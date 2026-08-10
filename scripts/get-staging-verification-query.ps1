<#
Computes the set of theme-relevant files changed between two git refs and
emits a ready-to-run Shopify Admin GraphQL query + variables for checking
whether the staging theme actually has each one, with fresh updatedAt.

Why this exists: a successful `git push` only proves GitHub received the
commit -- it does NOT prove Shopify's theme actually received every file.
Shopify's GitHub->theme sync has, on this project alone, silently dropped
files on at least 4 separate occasions (ka-predictive-search.liquid,
ka-cart-items.liquid, ka-faq-main.liquid, and the 3 Client Diaries entry
sections + their template -- see CLAUDE.md "Known issue" section) with zero
error surfaced anywhere in git, GitHub, or Shopify Admin. This script is
the "EXPECTED" half of the expected-vs-actual comparison; Claude Code runs
the emitted query via its Shopify Admin API access and diffs the result
against this file list -- see CLAUDE.md's staging deployment procedure.

This script only reads git and the filesystem; it does not call Shopify
itself (no script in this repo holds Shopify credentials -- only the
already-authenticated Claude Code session does, via its Shopify MCP tools).

Usage:
  scripts/get-staging-verification-query.ps1                  # HEAD~1..HEAD
  scripts/get-staging-verification-query.ps1 -From <ref> -To <ref>
  scripts/get-staging-verification-query.ps1 -ThemeId 189829808418
#>

param(
    [string]$From = 'HEAD~1',
    [string]$To = 'HEAD',
    [string]$ThemeId = '189829808418'
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot
try {
    $themeDirs = @('sections', 'blocks', 'templates', 'layout', 'snippets', 'assets', 'locales', 'config')
    $pathspec = $themeDirs | Where-Object { Test-Path $_ }

    $changed = git diff --name-only --diff-filter=ACMR $From $To -- $pathspec 2>$null
    $changed = $changed | Where-Object { $_ -and (Test-Path $_) }

    if (-not $changed -or $changed.Count -eq 0) {
        Write-Output "No theme-relevant files changed between $From and $To -- nothing to verify."
        exit 0
    }

    Write-Output "EXPECTED (changed theme files between $From and $To, $($changed.Count) total):"
    foreach ($f in $changed) { Write-Output "  - $f" }
    Write-Output ""

    Write-Output "Run this via the Shopify Admin GraphQL MCP tool (graphql_query), then diff"
    Write-Output "the returned 'files.nodes[].filename' list against EXPECTED above:"
    Write-Output "  MISSING FROM STAGING = any EXPECTED filename absent from the response."
    Write-Output "  STALE = present but updatedAt is older than this deploy's timestamp."
    Write-Output "Treat either as a FAILED deployment -- do not report the change as done."
    Write-Output ""

    $filenamesJsonArray = ($changed | ForEach-Object { '"' + ($_ -replace '\\', '/') + '"' }) -join ', '

    Write-Output "--- GraphQL query ---"
    Write-Output @"
query VerifyStagingDeploy(`$id: ID!, `$filenames: [String!]) {
  theme(id: `$id) {
    id
    name
    role
    processing
    files(filenames: `$filenames, first: 50) {
      nodes { filename contentType size updatedAt }
    }
  }
}
"@
    Write-Output ""
    Write-Output "--- Variables ---"
    Write-Output "{ ""id"": ""gid://shopify/OnlineStoreTheme/$ThemeId"", ""filenames"": [$filenamesJsonArray] }"

    # Persist the expected-file list + a deploy cutoff timestamp so
    # compare-staging-verification.ps1 can do a hard, scriptable pass/fail
    # instead of relying on eyeballing the diff.
    $verifyDir = Join-Path $repoRoot '.staging-verify'
    if (-not (Test-Path $verifyDir)) { New-Item -ItemType Directory -Path $verifyDir | Out-Null }
    $expected = [PSCustomObject]@{
        deployedAfter = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
        filenames     = @($changed | ForEach-Object { $_ -replace '\\', '/' })
    }
    $expected | ConvertTo-Json -Depth 5 | Set-Content -Path (Join-Path $verifyDir 'expected.json') -Encoding UTF8
    Write-Output ""
    Write-Output "(expected-file list saved to .staging-verify/expected.json for compare-staging-verification.ps1)"
}
finally {
    Pop-Location
}
