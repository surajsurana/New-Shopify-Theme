"""
Google Business Profile API client -- fetches reviews for K&A's location.

======================================================================
STATUS (2026-09-21): Google APPROVED Business Profile API access on
2026-09-14 (Cloud project number 250716548984, 300 QPM). The code in this
file is ready to run the moment three env vars exist. What's left is the
ONE-TIME interactive consent, which is done by authorize.py (next to this
file) -- not by anything in here.
======================================================================
How the credentials get here:
  1. Suraj runs, on his Windows PC, from the repo root:
         py -m pip install -r scripts/google-reviews-sync/requirements-authorize.txt
         py scripts/google-reviews-sync/authorize.py "Google My Business Reviews API/client_secret_<...>.json"
     He signs in as suraj.surana@gmail.com (Owner of K&A's Business Profile),
     clicks through Google's "unverified app" warning (Advanced -> Go to <app>
     (unsafe) -> Allow), and grants scope
     https://www.googleapis.com/auth/business.manage (access_type=offline,
     prompt=consent so a refresh token always comes back).
  2. authorize.py writes GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET /
     GOOGLE_REFRESH_TOKEN into scripts/google-reviews-sync/.env (gitignored;
     never printed) and smoke-tests accounts.list.
  3. For production, those same three values go into the droplet's systemd
     unit environment (see config.py + .env.example) -- never in git.
  4. get_access_token() below is a standard OAuth refresh-token grant, the
     same shape for every Google API, and just works from then on.
See README.md for the full walkthrough.

Reference docs (fetched/confirmed 2026-08-29, not guessed):
  - Reviews (legacy v4, still active, this is what Basic API Access unlocks):
    https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list
  - Account discovery (newer split API):
    https://developers.google.com/my-business/reference/accountmanagement/rest/v1/accounts/list
  - Location discovery (newer split API):
    https://developers.google.com/my-business/reference/businessinformation/rest/v1/accounts.locations/list
"""

from __future__ import annotations

import sys
from typing import Optional

import requests

import config

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
ACCOUNT_MANAGEMENT_BASE = "https://mybusinessaccountmanagement.googleapis.com/v1"
BUSINESS_INFORMATION_BASE = "https://mybusinessbusinessinformation.googleapis.com/v1"
REVIEWS_BASE = "https://mybusiness.googleapis.com/v4"  # legacy v4 -- reviews still live here


class GoogleAuthNotConfigured(RuntimeError):
    """Raised when Google OAuth credentials aren't present (authorize.py hasn't been run yet)."""


def get_access_token() -> str:
    """
    Exchanges the stored refresh token for a short-lived access token via
    Google's standard OAuth 2.0 refresh grant. Needs config.GOOGLE_CLIENT_ID /
    GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN to be real values (produced
    by authorize.py). If any is empty this raises immediately instead of
    silently doing nothing.
    """
    if not (config.GOOGLE_CLIENT_ID and config.GOOGLE_CLIENT_SECRET and config.GOOGLE_REFRESH_TOKEN):
        raise GoogleAuthNotConfigured(
            "Google OAuth credentials are not set -- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / "
            "GOOGLE_REFRESH_TOKEN are empty. API access is approved; run the one-time "
            "authorize.py (see this module's docstring / README.md) to create them. "
            "Nothing to fix in code -- this is a credentials gap, not a bug."
        )

    response = requests.post(
        GOOGLE_TOKEN_URL,
        data={
            "client_id": config.GOOGLE_CLIENT_ID,
            "client_secret": config.GOOGLE_CLIENT_SECRET,
            "refresh_token": config.GOOGLE_REFRESH_TOKEN,
            "grant_type": "refresh_token",
        },
        timeout=30,
    )
    response.raise_for_status()
    token = response.json().get("access_token")
    if not token:
        raise GoogleAuthNotConfigured("Token refresh succeeded but returned no access_token.")
    return token


def discover_account_and_location(access_token: str) -> tuple[str, str]:
    """
    Resolves K&A's Google Business Profile account ID and location ID.
    Only needed once -- after a successful run, pin the results into
    GOOGLE_ACCOUNT_ID / GOOGLE_LOCATION_ID env vars and this becomes a
    no-op fallback path.
    """
    if config.GOOGLE_ACCOUNT_ID and config.GOOGLE_LOCATION_ID:
        return config.GOOGLE_ACCOUNT_ID, config.GOOGLE_LOCATION_ID

    headers = {"Authorization": f"Bearer {access_token}"}

    accounts_resp = requests.get(f"{ACCOUNT_MANAGEMENT_BASE}/accounts", headers=headers, timeout=30)
    accounts_resp.raise_for_status()
    accounts = accounts_resp.json().get("accounts", [])
    if not accounts:
        raise RuntimeError("Google Business Profile API returned zero accounts for this OAuth grant.")
    # K&A has a single Business Profile account -- take the first result.
    account_name = accounts[0]["name"]  # e.g. "accounts/1234567890"
    account_id = account_name.split("/")[-1]

    locations_resp = requests.get(
        f"{BUSINESS_INFORMATION_BASE}/{account_name}/locations",
        headers=headers,
        params={"readMask": "name,title"},
        timeout=30,
    )
    locations_resp.raise_for_status()
    locations = locations_resp.json().get("locations", [])
    if not locations:
        raise RuntimeError(f"No locations found under Google Business Profile account {account_id}.")
    # K&A operates a single storefront/location -- take the first result.
    location_name = locations[0]["name"]  # e.g. "locations/9876543210"
    location_id = location_name.split("/")[-1]

    return account_id, location_id


def fetch_reviews(access_token: str, account_id: str, location_id: str) -> dict:
    """
    Pulls all reviews for the given location via the v4 Reviews API,
    paginating with pageToken until exhausted.

    Returns: {"reviews": [...raw review objects...], "average_rating": float,
              "total_review_count": int}
    """
    headers = {"Authorization": f"Bearer {access_token}"}
    url = f"{REVIEWS_BASE}/accounts/{account_id}/locations/{location_id}/reviews"

    all_reviews: list[dict] = []
    average_rating: Optional[float] = None
    total_review_count: Optional[int] = None
    page_token = None

    while True:
        params = {"pageSize": 50, "orderBy": "updateTime desc"}
        if page_token:
            params["pageToken"] = page_token

        resp = requests.get(url, headers=headers, params=params, timeout=30)
        resp.raise_for_status()
        body = resp.json()

        all_reviews.extend(body.get("reviews", []))
        # averageRating/totalReviewCount are stable across pages -- take the first page's values.
        if average_rating is None:
            average_rating = body.get("averageRating")
        if total_review_count is None:
            total_review_count = body.get("totalReviewCount")

        page_token = body.get("nextPageToken")
        if not page_token:
            break

    return {
        "reviews": all_reviews,
        "average_rating": average_rating,
        "total_review_count": total_review_count,
    }


if __name__ == "__main__":
    # Manual smoke-test entry point -- NOT run by the cron job (sync.py is).
    try:
        token = get_access_token()
    except GoogleAuthNotConfigured as exc:
        print(f"[google_business_client] {exc}", file=sys.stderr)
        sys.exit(1)

    acct_id, loc_id = discover_account_and_location(token)
    print(f"Account: {acct_id}  Location: {loc_id}")
    data = fetch_reviews(token, acct_id, loc_id)
    print(f"Fetched {len(data['reviews'])} reviews, average {data['average_rating']}, total {data['total_review_count']}")
