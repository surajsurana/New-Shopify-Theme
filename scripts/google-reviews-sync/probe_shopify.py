"""
Harmless Shopify permission probe for the Google Reviews sync.

Answers ONE question before the real sync ever runs: "does our Shopify app have
the access scope needed to write a Shop-owned metafield?" -- without touching
the real data. Steps (each prints only OK/FAILED and Shopify's exact error text;
never a token or secret):

  1. obtain an access token (client credentials, or the legacy static token)
  2. read   shop { id }
  3. write  metafieldsSet   Shop custom.sync_probe = "probe"  (tiny throwaway value)
  4. read   it back
  5. delete metafieldsDelete Shop custom.sync_probe   (always attempted if step 3 wrote it)

It NEVER touches custom.google_reviews (the key the live homepage reads) -- the
probe key is hard-coded and asserted different at import time. A missing access
scope shows up in Shopify's error message at step 2, 3, 4 or 5.

Refuses to run unless you pass --yes-probe explicitly:

    py scripts/google-reviews-sync/probe_shopify.py --yes-probe

Exit code 0 = every step OK, 2 = something failed, 3 = refused / not configured.
"""

from __future__ import annotations

import argparse
import json
import sys

import config
import shopify_client

PROBE_NAMESPACE = "custom"
PROBE_KEY = "sync_probe"
PROBE_TYPE = "single_line_text_field"
PROBE_VALUE = "probe"

# Hard safety rail: the probe must never be able to address the real metafield.
assert (PROBE_NAMESPACE, PROBE_KEY) != (config.METAFIELD_NAMESPACE, config.METAFIELD_KEY)

SET_MUTATION = """
mutation ProbeSet($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields { id namespace key value }
    userErrors { field message code }
  }
}
"""

READ_QUERY = """
query ProbeRead($namespace: String!, $key: String!) {
  shop { metafield(namespace: $namespace, key: $key) { id namespace key value type } }
}
"""

DELETE_MUTATION = """
mutation ProbeDelete($metafields: [MetafieldIdentifierInput!]!) {
  metafieldsDelete(metafields: $metafields) {
    deletedMetafields { key namespace ownerId }
    userErrors { field message }
  }
}
"""


def step(name: str, ok: bool, detail: str = "") -> bool:
    print(f"  [{'OK' if ok else 'FAILED'}] {name}" + (f" -- {detail}" if detail else ""))
    return ok


def run_probe() -> int:
    print(f"Shopify permission probe against {config.SHOPIFY_STORE_DOMAIN} (API {config.SHOPIFY_API_VERSION})")
    print(f"Probe key: {PROBE_NAMESPACE}.{PROBE_KEY}  (custom.google_reviews is never touched)")

    if not shopify_client.is_configured():
        print("  [FAILED] Shopify auth is not configured (SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET, or the legacy token).")
        return 3

    failed = False

    # 1. token
    try:
        shopify_client.get_access_token()
        scope = shopify_client.get_granted_scope()
        step("obtain access token", True, f"granted scopes: {scope}" if scope else "static token (scopes not reported)")
    except Exception as exc:  # noqa: BLE001 -- report Shopify's message, never a secret
        step("obtain access token", False, str(exc))
        return 2

    # 2. read shop id
    try:
        shop_gid = shopify_client.get_shop_gid()
        step("read shop { id }", True, shop_gid)
    except Exception as exc:  # noqa: BLE001
        step("read shop { id }", False, str(exc))
        return 2

    owner = {"ownerId": shop_gid, "namespace": PROBE_NAMESPACE, "key": PROBE_KEY}

    # 3. write throwaway metafield
    wrote = False
    try:
        data = shopify_client._graphql(SET_MUTATION, {"metafields": [{**owner, "type": PROBE_TYPE, "value": PROBE_VALUE}]})
        errors = data["metafieldsSet"]["userErrors"]
        if errors:
            failed = True
            step("metafieldsSet on Shop", False, json.dumps(errors))
        else:
            wrote = True
            step("metafieldsSet on Shop", True)
    except Exception as exc:  # noqa: BLE001
        failed = True
        step("metafieldsSet on Shop", False, str(exc))

    # 4. read back (only meaningful if the write worked)
    if wrote:
        try:
            data = shopify_client._graphql(READ_QUERY, {"namespace": PROBE_NAMESPACE, "key": PROBE_KEY})
            mf = data["shop"]["metafield"]
            good = bool(mf) and mf.get("value") == PROBE_VALUE
            if not good:
                failed = True
            step("read back", good, "" if good else f"unexpected result: {json.dumps(mf)}")
        except Exception as exc:  # noqa: BLE001
            failed = True
            step("read back", False, str(exc))

    # 5. always clean up if the write succeeded
    if wrote:
        try:
            data = shopify_client._graphql(DELETE_MUTATION, {"metafields": [{k: owner[k] for k in ("ownerId", "namespace", "key")}]})
            errors = data["metafieldsDelete"]["userErrors"]
            deleted = data["metafieldsDelete"]["deletedMetafields"]
            good = not errors and bool(deleted)
            if not good:
                failed = True
            step("metafieldsDelete (cleanup)", good, json.dumps(errors) if errors else ("" if good else "nothing deleted"))
        except Exception as exc:  # noqa: BLE001
            failed = True
            step("metafieldsDelete (cleanup)", False, str(exc))
            print(f"  !! The throwaway {PROBE_NAMESPACE}.{PROBE_KEY} metafield may still exist on the Shop -- delete it manually.")

    print("RESULT: " + ("FAILED (see the exact Shopify message above)" if failed else "all steps OK -- this app can write Shop metafields"))
    return 2 if failed else 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Harmless Shopify Shop-metafield permission probe (custom.sync_probe only).")
    parser.add_argument("--yes-probe", action="store_true", help="Required. Confirms you want a throwaway metafield written and deleted on the live Shop.")
    args = parser.parse_args()
    if not args.yes_probe:
        print("Refusing to run: pass --yes-probe to confirm. (Writes then deletes custom.sync_probe on the Shop; never touches custom.google_reviews.)")
        return 3
    return run_probe()


if __name__ == "__main__":
    sys.exit(main())
