"""
One-time interactive Google OAuth authorization for the Google Reviews sync.

Run this ONCE, locally, on Suraj's Windows PC (it needs a real browser sign-in
as suraj.surana@gmail.com, the Owner of K&A's Business Profile). It produces
the refresh token that sync.py / google_business_client.py need, and writes
ONLY what the sync needs -- client id, client secret, refresh token -- into a
local, gitignored `.env` file next to this script, using exactly the variable
names config.py / .env.example expect:

    GOOGLE_CLIENT_ID=...
    GOOGLE_CLIENT_SECRET=...
    GOOGLE_REFRESH_TOKEN=...

Usage (from the repo root, see README.md for the full walkthrough):

    py -m pip install -r scripts/google-reviews-sync/requirements-authorize.txt
    py scripts/google-reviews-sync/authorize.py "Google My Business Reviews API/client_secret_<...>.json"

What it does, in order:
  1. Reads the Desktop OAuth client JSON you pass in (never printed).
  2. Opens your browser for Google sign-in/consent, scope
     https://www.googleapis.com/auth/business.manage, access_type=offline and
     prompt=consent (so Google always returns a refresh token, even if this
     client was authorized before).
  3. Merges the three GOOGLE_* values into scripts/google-reviews-sync/.env
     (other lines, e.g. SHOPIFY_ADMIN_API_TOKEN, are preserved). Refuses to
     write if git says that file is NOT ignored.
  4. Smoke test (skip with --skip-smoke-test): calls
     mybusinessaccountmanagement.googleapis.com/v1/accounts and prints only
     the number of accounts and their resource names (e.g. "accounts/123...").

Security: the client secret, refresh token and access token are NEVER printed
or logged by this script -- not on success, not on error. Nothing here touches
Shopify, the droplet, or any theme.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

SCOPES = ["https://www.googleapis.com/auth/business.manage"]
ACCOUNTS_URL = "https://mybusinessaccountmanagement.googleapis.com/v1/accounts"
DEFAULT_ENV_PATH = Path(__file__).resolve().parent / ".env"


def die(message: str, code: int = 1) -> None:
    print(f"[authorize] {message}", file=sys.stderr)
    sys.exit(code)


def load_client_config(path: Path) -> tuple[str, str]:
    """Return (client_id, client_secret) from a Google 'Desktop app' client JSON. Never prints them."""
    if not path.is_file():
        die(f"Client secret JSON not found: {path}")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        die(f"Could not read/parse the client secret JSON ({type(exc).__name__}).")
    block = data.get("installed")
    if not block:
        kind = next(iter(data), "unknown")
        die(
            f"This JSON is a '{kind}' OAuth client, but this script needs a 'Desktop app' client "
            "(top-level key 'installed'). Create a Desktop-app OAuth client in Cloud Console."
        )
    client_id = (block.get("client_id") or "").strip()
    client_secret = (block.get("client_secret") or "").strip()
    if not client_id or not client_secret:
        die("The client secret JSON is missing client_id and/or client_secret.")
    return client_id, client_secret


def ensure_gitignored(env_path: Path) -> None:
    """Refuse to write credentials to a path git would track. Best-effort: skipped if git is unavailable."""
    try:
        result = subprocess.run(
            ["git", "check-ignore", "-q", str(env_path)],
            cwd=str(env_path.parent),
            capture_output=True,
            timeout=15,
        )
    except (OSError, subprocess.SubprocessError):
        print("[authorize] (git not available -- could not verify the output file is gitignored)")
        return
    if result.returncode == 1:
        die(
            f"Refusing to write credentials: git does NOT ignore {env_path}. "
            "Add it to .gitignore first (or use --env-file with an ignored path)."
        )
    # returncode 0 = ignored (good); 128 = not a git repo / other error -- proceed, nothing to leak into.


def merge_env_file(env_path: Path, values: dict[str, str]) -> None:
    """Set/replace only the given KEY=VALUE lines; preserve every other line untouched."""
    lines = env_path.read_text(encoding="utf-8").splitlines() if env_path.exists() else []
    remaining = dict(values)
    out: list[str] = []
    for line in lines:
        key = line.split("=", 1)[0].strip() if "=" in line and not line.lstrip().startswith("#") else None
        if key in remaining:
            out.append(f"{key}={remaining.pop(key)}")
        else:
            out.append(line)
    for key, value in remaining.items():
        out.append(f"{key}={value}")
    env_path.write_text("\n".join(out) + "\n", encoding="utf-8")


def smoke_test(access_token: str) -> bool:
    """Harmless read: list Business Profile accounts. Prints only count + resource names."""
    import requests

    try:
        resp = requests.get(ACCOUNTS_URL, headers={"Authorization": f"Bearer {access_token}"}, timeout=30)
    except requests.RequestException as exc:
        print(f"[authorize] Smoke test could not reach Google ({type(exc).__name__}).", file=sys.stderr)
        return False
    if resp.status_code != 200:
        message = ""
        try:
            message = resp.json().get("error", {}).get("message", "")
        except ValueError:
            pass
        print(f"[authorize] Smoke test FAILED: HTTP {resp.status_code}. {message}", file=sys.stderr)
        return False
    accounts = resp.json().get("accounts", [])
    print(f"[authorize] Smoke test OK: the grant works. {len(accounts)} Business Profile account(s) visible.")
    for account in accounts:
        print(f"            - {account.get('name', '?')}  ({account.get('accountName', '')})")
    return True


def main() -> None:
    parser = argparse.ArgumentParser(description="One-time Google OAuth authorization for the Google Reviews sync.")
    parser.add_argument("client_secret_json", type=Path, help="Path to the Desktop OAuth client JSON downloaded from Cloud Console.")
    parser.add_argument("--env-file", type=Path, default=DEFAULT_ENV_PATH, help=f"Where to write the GOOGLE_* values (default: {DEFAULT_ENV_PATH}).")
    parser.add_argument("--skip-smoke-test", action="store_true", help="Skip the harmless accounts.list check after authorizing.")
    args = parser.parse_args()

    client_id, client_secret = load_client_config(args.client_secret_json)
    env_path = args.env_file.resolve()
    ensure_gitignored(env_path)  # check BEFORE the browser flow, so nothing is wasted if this would fail

    try:
        from google_auth_oauthlib.flow import InstalledAppFlow
    except ImportError:
        die("Missing dependency. Run: py -m pip install -r scripts/google-reviews-sync/requirements-authorize.txt")

    flow = InstalledAppFlow.from_client_secrets_file(str(args.client_secret_json), scopes=SCOPES)
    print("[authorize] Opening your browser. Sign in as suraj.surana@gmail.com and approve access.")
    print("[authorize] Expect an 'unverified app' screen: click Advanced -> 'Go to <app name> (unsafe)' -> Continue/Allow.")
    creds = flow.run_local_server(
        port=0,
        open_browser=True,
        access_type="offline",  # ask for a refresh token
        prompt="consent",  # force the consent screen so Google always returns one
        authorization_prompt_message="[authorize] If the browser did not open, copy the sign-in link from the address it tried to open.",
        success_message="Authorization complete. You can close this tab and return to the terminal.",
    )

    if not creds.refresh_token:
        die(
            "Google did not return a refresh token. Remove this app's earlier access at "
            "https://myaccount.google.com/permissions and run the script again."
        )
    granted = set(creds.scopes or [])
    if not set(SCOPES) <= granted:
        die("The business.manage scope was not granted. Re-run and tick every requested permission on the consent screen.")

    merge_env_file(
        env_path,
        {
            "GOOGLE_CLIENT_ID": client_id,
            "GOOGLE_CLIENT_SECRET": client_secret,
            "GOOGLE_REFRESH_TOKEN": creds.refresh_token,
        },
    )
    print(f"[authorize] Wrote GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN to {env_path}")
    print("[authorize] (values not displayed; that file is gitignored -- never commit or paste it anywhere)")

    if args.skip_smoke_test:
        return
    if not smoke_test(creds.token):
        die("Authorization succeeded and credentials were saved, but the smoke test failed (see above).", code=2)


if __name__ == "__main__":
    main()
