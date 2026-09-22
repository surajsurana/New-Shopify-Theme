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


def post_reply(review_name: str, comment: str) -> dict:
    """
    Posts (or updates) the owner reply to ONE review, via Google's v4
    Reviews API:
        PUT https://mybusiness.googleapis.com/v4/{review_name}/reply
        body: {"comment": comment}
    -- confirmed against Google's live REST reference for
    accounts.locations.reviews.updateReply (2026-09-22), not guessed. Per
    that doc: "Updates the reply to the specified review. A reply is
    created if one does not exist," so this same call both creates a first
    reply and edits an existing one. Requires the business.manage scope
    already granted to this app's OAuth consent -- no new authorization
    needed.

    review_name: the review's own `name` field exactly as returned by
        fetch_reviews(), e.g. "accounts/123/locations/456/reviews/abc123".
        NOT just the reviewId -- the full resource name.
    comment: the reply text to post, plain text, max 4096 bytes per
        Google's limit. Caller's responsibility to have this approved
        first -- this function does no drafting, no filtering, no
        approval logic of its own. It posts EXACTLY the comment it is
        given, to EXACTLY the review_name it is given, and nothing else.

    Deliberately NOT wired into any loop, batch helper, or "post all
    pending" wrapper anywhere in this codebase. Every call site must pass
    an explicit review_name + comment for ONE review. Do not add a
    "post_all_pending_replies()" convenience wrapper around this function
    -- that would defeat the one-at-a-time human-approval requirement this
    was built for (Suraj, 2026-09-22: "every single reply must be
    explicitly approved by him before it posts... no batch auto-post, no
    'approve all', ever").
    """
    if not review_name or "/reviews/" not in review_name:
        raise ValueError(
            f"post_reply requires the review's full resource name "
            f"(e.g. 'accounts/.../locations/.../reviews/...'), got: {review_name!r}"
        )
    if not comment or not comment.strip():
        raise ValueError("post_reply requires a non-empty comment.")

    access_token = get_access_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    url = f"{REVIEWS_BASE}/{review_name}/reply"

    resp = requests.put(url, headers=headers, json={"comment": comment}, timeout=30)
    resp.raise_for_status()
    return resp.json()


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
