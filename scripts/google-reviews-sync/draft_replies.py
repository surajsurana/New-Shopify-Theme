"""
Drafts AI-written replies to Google reviews that have no owner reply yet, and
writes them to a local durable queue file (pending_replies.json) for human
review. This script NEVER posts anything -- it does not import or call
google_business_client.post_reply, and it never will (see the warning in that
function's docstring). Posting is a deliberate, separate, one-review-at-a-time
action, always after Suraj has approved the exact final text.

Run:
    python3 draft_replies.py

What it does:
  1. Fetches ALL reviews fresh from Google (reuses get_access_token(),
     discover_account_and_location(), fetch_reviews() -- unchanged).
  2. Filters to reviews with no `reviewReply` field.
  3. Drafts a reply for each, in the voice Ashita already uses for her 19
     existing manual replies (see the docstring below for the rules). Two
     star-only reviews with zero review text and a sub-5 rating are instead
     flagged "skip" -- see SKIP POLICY below.
  4. Writes ALL drafted/flagged reviews to pending_replies.json: reviewer
     name, star rating, original review text, drafted reply (or null +
     skip_reason), and the review's own resource `name` (needed later to
     post). This file is the durable queue -- nothing here posts anything.
  5. Prints a summary (count drafted, count flagged) and exits.

VOICE RULES (2026-09-22, source: SEO & Discoverability session's confirmed
entity facts + brand-brief, relayed by the coordinator):
  - Warm, personal, specific -- reference what the reviewer actually said.
    Never a generic "thank you for your feedback."
  - Never invent specifics about a customer's order/experience beyond what
    they themselves wrote in their review.
  - Sign-off varies with tone, matching Ashita's real pattern: "Warm
    regards" (the default), "Warmest regards" (especially enthusiastic
    reviews), "Kind regards" (a more measured tone, e.g. acknowledging
    constructive feedback).
  - HOUSE STYLE (Suraj, 2026-09-22): the names line is "Karishma Ashita" --
    NO "and" between the names. So every sign-off is exactly one of:
        Warm regards,
        Karishma Ashita
    or "Warmest regards," / "Kind regards," with the same "Karishma Ashita"
    names line (never "Karishma and Ashita"). The first batch (2026-09-22,
    _drafts_2026_09_22.py) was authored with "Karishma and Ashita" and was
    hand-corrected afterwards directly in pending_replies.json by the
    coordinator -- that source module was NOT updated to match, so do not
    re-run draft_replies.py against it as-is (it would regenerate
    pending_replies.json and silently undo that fix). Any NEW dated drafts
    module must use "Karishma Ashita" (no "and") from the start.
  - No discount language, no urgency/FOMO, no generic e-commerce phrasing.
  - Facts from Docs/2026-07-21-confirmed-entity-facts.md (studio location,
    founding year, price point, production timelines, video consultations,
    customization, returns policy) are referenced ONLY when a review
    actually touches on that topic -- never padded in.

SKIP POLICY (my judgment call, noted per-review in the output): the two
sub-5-star reviews with literally zero review text (a 3-star and a 1-star)
are flagged skip rather than drafted. Unlike blank 5-star/4-star reviews
(where a short generic thank-you matches Ashita's own established pattern,
e.g. her real replies to Aditi Parekh and Divya Ganatra), a sub-5 rating
with no stated reason has nothing to reference or apologize for -- a
templated "thank you" risked reading as tone-deaf, and Suraj asked for
these two to get individual handling rather than a standard reply.

THIS SCRIPT NEVER POSTS. Search this file: there is no call to
google_business_client.post_reply anywhere below.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import google_business_client as gbc
import sync as sync_mod

OUT_PATH = Path(__file__).parent / "pending_replies.json"


def build_queue(reviews: list[dict], drafts: list[tuple]) -> list[dict]:
    """
    reviews: unreplied reviews, newest-first (already filtered by caller).
    drafts: parallel list, same order, of (reply_text_or_None, skip_reason_or_None).
    """
    if len(reviews) != len(drafts):
        raise ValueError(
            f"drafts list ({len(drafts)}) does not match unreplied review count "
            f"({len(reviews)}) -- did the live review set change since the drafts "
            f"were written? Re-run and re-draft rather than mismatching by position."
        )
    queue = []
    for r, (reply_text, skip_reason) in zip(reviews, drafts):
        queue.append({
            "name": r.get("name"),
            "reviewer_name": sync_mod.format_reviewer_name(r.get("reviewer", {}).get("displayName", "")),
            "reviewer_name_raw": r.get("reviewer", {}).get("displayName", ""),
            "rating": sync_mod.star_rating_value(r),
            "review_text": sync_mod.review_text(r.get("comment")),
            "review_updateTime": r.get("updateTime"),
            "drafted_reply": reply_text,
            "status": "drafted" if reply_text else "skipped",
            "skip_reason": skip_reason,
            "posted": False,
        })
    return queue


def run() -> int:
    try:
        token = gbc.get_access_token()
    except gbc.GoogleAuthNotConfigured as exc:
        print(f"[draft_replies] {exc}", file=sys.stderr)
        return 1

    acct_id, loc_id = gbc.discover_account_and_location(token)
    data = gbc.fetch_reviews(token, acct_id, loc_id)
    all_reviews = data["reviews"]

    unreplied = [r for r in all_reviews if not r.get("reviewReply")]
    unreplied.sort(key=lambda r: r.get("updateTime") or "", reverse=True)

    # Drafts authored 2026-09-22 against this exact unreplied set (order-matched
    # by newest-first updateTime). IMPORTANT: this script does not call an LLM
    # itself -- there is no drafting API wired into this codebase yet. Each
    # batch's replies were authored directly (by Claude, reviewing the actual
    # review text + the voice/fact rules in this file's docstring) and saved as
    # a dated Python module alongside this script. If the live unreplied set has
    # changed since a batch's drafts were written (a new review came in, or
    # Ashita manually replied to one of these), build_queue() raises rather than
    # silently mismatching -- author a fresh dated drafts module in that case
    # and point this import at it before re-running.
    #
    # Sign-off house style (Suraj, 2026-09-22): every new dated drafts module
    # must sign off "Karishma Ashita" -- NO "and" -- e.g.:
    #     Warm regards,
    #     Karishma Ashita
    # (see the VOICE RULES / HOUSE STYLE note in this file's module docstring).
    # _drafts_2026_09_22.py below predates this rule (it used "Karishma and
    # Ashita") and was hand-corrected only in the OUTPUT (pending_replies.json),
    # not in this source module -- do not re-run this script against it as-is.
    from _drafts_2026_09_22 import DRAFTS  # noqa: E402 (see note above)

    queue = build_queue(unreplied, DRAFTS)

    with open(OUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(queue, fh, ensure_ascii=False, indent=2)

    drafted = sum(1 for q in queue if q["status"] == "drafted")
    skipped = sum(1 for q in queue if q["status"] == "skipped")
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass
    print(f"Fetched {len(all_reviews)} reviews total; {len(unreplied)} have no reply yet.")
    print(f"Drafted: {drafted}   Flagged/skipped: {skipped}")
    print(f"Queue written to {OUT_PATH} -- nothing was posted to Google.")
    return 0


if __name__ == "__main__":
    sys.exit(run())
