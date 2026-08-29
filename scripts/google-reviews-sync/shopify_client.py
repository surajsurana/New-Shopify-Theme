"""
Shopify Admin API client -- writes the synced review payload into the
`custom.google_reviews` Shop metafield via metafieldsSet.

Unlike google_business_client.py, this half is NOT blocked on Suraj's Google
API application. A Shopify custom app scoped to write_metafields (+
read_metafields) can be created today in Shopify Admin, independent of the
Google approval timeline -- see README.md for the exact steps. This module
is real and testable as soon as SHOPIFY_ADMIN_API_TOKEN is set.

The metafield definition itself already exists on the store (created
2026-08-29 via metafieldDefinitionCreate): namespace "custom", key
"google_reviews", type "json", owner type SHOP --
gid://shopify/MetafieldDefinition/292565483810.
"""

from __future__ import annotations

import json

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


class ShopifyWriteError(RuntimeError):
    pass


def _graphql(query: str, variables: dict | None = None) -> dict:
    url = GRAPHQL_URL.format(store_domain=config.SHOPIFY_STORE_DOMAIN, api_version=config.SHOPIFY_API_VERSION)
    headers = {
        "X-Shopify-Access-Token": config.SHOPIFY_ADMIN_API_TOKEN,
        "Content-Type": "application/json",
    }
    resp = requests.post(url, headers=headers, json={"query": query, "variables": variables or {}}, timeout=30)
    resp.raise_for_status()
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
