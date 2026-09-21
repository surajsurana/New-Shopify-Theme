"""
Shopify Admin API client -- writes the synced review payload into the
`custom.google_reviews` Shop metafield via metafieldsSet.

AUTH (updated 2026-09-21): Shopify no longer allows creating classic admin
"custom apps" with a reveal-once token. This module authenticates as an app
created in the Shopify Dev Dashboard ("K&A Reviews Sync") and installed on the
store, using the OAuth client-credentials grant:

    POST https://{shop}.myshopify.com/admin/oauth/access_token
         grant_type=client_credentials & client_id=... & client_secret=...
    -> {"access_token": "...", "scope": "...", "expires_in": ~86399}

A fresh token is fetched on demand and cached IN MEMORY ONLY (never written to
disk, never logged) until shortly before it expires. If SHOPIFY_CLIENT_ID /
SHOPIFY_CLIENT_SECRET are not set, an optional static SHOPIFY_ADMIN_API_TOKEN
is used instead (legacy fallback). See README.md for the setup steps.

The metafield definition itself already exists on the store (created
2026-08-29 via metafieldDefinitionCreate): namespace "custom", key
"google_reviews", type "json", owner type SHOP --
gid://shopify/MetafieldDefinition/292565483810.
"""

from __future__ import annotations

import json
import time

import requests

import config

GRAPHQL_URL = f"https://{{store_domain}}/admin/api/{{api_version}}/graphql.json"

SHOP_ID_QUERY = """
query ShopId {
  shop {
    id
  }
}
"""

METAFIELDS_SET_MUTATION = """
mutation SetGoogleReviews($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields {
      id
      namespace
      key
      updatedAt
    }
    userErrors {
      field
      message
      code
    }
  }
}
"""


TOKEN_URL = "https://{store_domain}/admin/oauth/access_token"
TOKEN_REFRESH_MARGIN_SECONDS = 300  # refresh this long before expiry

# In-memory only. Holds the short-lived access token; never persisted or logged.
_token_cache: dict = {"token": None, "expires_at": 0.0, "scope": ""}


class ShopifyWriteError(RuntimeError):
    pass


class ShopifyAuthNotConfigured(RuntimeError):
    """Neither SHOPIFY_CLIENT_ID+SHOPIFY_CLIENT_SECRET nor SHOPIFY_ADMIN_API_TOKEN is set."""


def _reset_token_cache() -> None:
    _token_cache.update(token=None, expires_at=0.0, scope="")


def is_configured() -> bool:
    """True if EITHER auth form is available (client credentials, or the static token fallback)."""
    return bool(
        (config.SHOPIFY_CLIENT_ID and config.SHOPIFY_CLIENT_SECRET) or config.SHOPIFY_ADMIN_API_TOKEN
    )


def get_granted_scope() -> str:
    """Scopes Shopify reported for the cached client-credentials token ('' for a static token)."""
    return _token_cache["scope"]


def get_access_token() -> str:
    """
    Returns an Admin API access token.
      1. client credentials (preferred): SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET -> short-lived token,
         cached in memory until 5 minutes before expiry.
      2. else the optional static SHOPIFY_ADMIN_API_TOKEN.
    Raises ShopifyAuthNotConfigured if neither is available. Errors mention the HTTP status and Shopify's
    own error text only -- never the client secret or a token.
    """
    if config.SHOPIFY_CLIENT_ID and config.SHOPIFY_CLIENT_SECRET:
        if _token_cache["token"] and time.time() < _token_cache["expires_at"]:
            return _token_cache["token"]
        try:
            resp = requests.post(
                TOKEN_URL.format(store_domain=config.SHOPIFY_STORE_DOMAIN),
                data={
                    "grant_type": "client_credentials",
                    "client_id": config.SHOPIFY_CLIENT_ID,
                    "client_secret": config.SHOPIFY_CLIENT_SECRET,
                },
                headers={"Accept": "application/json"},
                timeout=30,
            )
        except requests.RequestException as exc:
            raise ShopifyWriteError(f"Could not reach Shopify to fetch an access token ({type(exc).__name__}).") from None
        if resp.status_code != 200:
            raise ShopifyWriteError(
                f"Shopify token request failed: HTTP {resp.status_code}. {_safe_body(resp)} "
                "(Check SHOPIFY_CLIENT_ID/SHOPIFY_CLIENT_SECRET, that the app is installed on this store, "
                "and that SHOPIFY_STORE_DOMAIN is the .myshopify.com domain.)"
            )
        try:
            body = resp.json()
            token = body["access_token"]
        except (ValueError, KeyError):
            raise ShopifyWriteError("Shopify token response did not contain an access_token.") from None
        expires_in = float(body.get("expires_in") or 3600)
        _token_cache.update(
            token=token,
            expires_at=time.time() + max(expires_in - TOKEN_REFRESH_MARGIN_SECONDS, 60),
            scope=str(body.get("scope") or ""),
        )
        return token

    if config.SHOPIFY_ADMIN_API_TOKEN:
        return config.SHOPIFY_ADMIN_API_TOKEN

    raise ShopifyAuthNotConfigured(
        "Shopify auth is not configured: set SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET (Dev Dashboard app "
        "'K&A Reviews Sync' > Settings), or the legacy SHOPIFY_ADMIN_API_TOKEN. See README.md."
    )


def _safe_body(resp) -> str:
    """Shopify's error text for a failed HTTP call, truncated. (Never includes what we sent.)"""
    try:
        return str(resp.text)[:400]
    except Exception:  # pragma: no cover
        return ""


def _graphql(query: str, variables: dict | None = None) -> dict:
    url = GRAPHQL_URL.format(store_domain=config.SHOPIFY_STORE_DOMAIN, api_version=config.SHOPIFY_API_VERSION)
    headers = {
        "X-Shopify-Access-Token": get_access_token(),
        "Content-Type": "application/json",
    }
    resp = requests.post(url, headers=headers, json={"query": query, "variables": variables or {}}, timeout=30)
    if resp.status_code != 200:
        raise ShopifyWriteError(f"Shopify GraphQL request failed: HTTP {resp.status_code}. {_safe_body(resp)}")
    body = resp.json()
    if "errors" in body:
        raise ShopifyWriteError(f"Shopify GraphQL errors: {body['errors']}")
    return body["data"]


def get_shop_gid() -> str:
    """Fetches the current Shop's GID. Confirmed live 2026-08-29:
    gid://shopify/Shop/76831129890 -- re-fetched here rather than hardcoded
    so a store-side change is never silently missed."""
    data = _graphql(SHOP_ID_QUERY)
    return data["shop"]["id"]


def write_reviews_metafield(payload: dict) -> dict:
    """
    Writes `payload` (the dict produced by sync.transform_reviews) into the
    custom.google_reviews Shop metafield as a single JSON value.

    Returns the metafieldsSet response's `metafields` list on success.
    Raises ShopifyWriteError on any userErrors -- never fails silently.
    """
    shop_gid = get_shop_gid()

    variables = {
        "metafields": [
            {
                "ownerId": shop_gid,
                "namespace": config.METAFIELD_NAMESPACE,
                "key": config.METAFIELD_KEY,
                "type": config.METAFIELD_TYPE,
                "value": json.dumps(payload),
            }
        ]
    }

    data = _graphql(METAFIELDS_SET_MUTATION, variables)
    result = data["metafieldsSet"]

    if result["userErrors"]:
        raise ShopifyWriteError(f"metafieldsSet userErrors: {result['userErrors']}")

    return result["metafields"]
