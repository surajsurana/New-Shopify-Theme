<#
LIVE-vs-STAGING drift detector. This is the mandatory pre-promotion check:
LIVE is allowed to contain manual edits that never went through git, so
comparing git branches is not sufficient -- this script compares the
ACTUAL current file lists of both real Shopify themes (LIVE and STAGING),
fetched live via the Admin API, using checksumMd5 for cheap equality
(no theme-wide body-content fetch needed for files that match).

Input: a saved raw GraphQL JSON response with this shape (see
scripts/get-drift-file-lists-query.txt for the query that produces it):
  { "data": { "live": { "files": { "nodes": [...] } },
              "staging": { "files": { "nodes": [...] } } } }

Output: 5 classified lists per the release architecture in CLAUDE.md:
  1. STAGING-only files      (new in staging, not yet on live)
  2. LIVE-only files         (exist on live, not in staging -- POTENTIAL
                               manual live edits; needs reconciliation
                               review before any promotion)
  3. Changed in both         (same filename, different checksum on both
                               sides -- needs a content-level diff to
                               tell what actually changed; this script
                               only flags them, it does not itself decide
                               preserve/replace/stop -- that judgment call
                               belongs to Technical Director + Suraj, per
                               CLAUDE.md's reconciliation rule)
  4. Identical                (same checksum both sides -- no action)
  5. Summary counts

This script never writes anything -- it is read-only analysis over two
already-fetched snapshots.

Usage:
  scripts/compare-live-staging-drift.ps1 -ResponseJsonPath <path>
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$ResponseJsonPath
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $ResponseJsonPath)) {
    Write-Output "FAIL: $ResponseJsonPath not found."
    exit 1
}

$resp = Get-Content -Raw -Encoding UTF8 -Path $ResponseJsonPath | ConvertFrom-Json

$liveTheme = $resp.data.live
$stagingTheme = $resp.data.staging

if ($null -eq $liveTheme -or $null -eq $stagingTheme) {
    Write-Output "FAIL: response JSON does not have both data.live and data.staging -- wrong query/response shape."
    exit 1
}

Write-Output "LIVE:    $($liveTheme.name)  ($($liveTheme.id))  role=$($liveTheme.role)  files=$($liveTheme.files.nodes.Count)"
Write-Output "STAGING: $($stagingTheme.name)  ($($stagingTheme.id))  role=$($stagingTheme.role)  files=$($stagingTheme.files.nodes.Count)"
Write-Output ""

$liveByFile = @{}
foreach ($n in $liveTheme.files.nodes) { $liveByFile[$n.filename] = $n }
$stagingByFile = @{}
foreach ($n in $stagingTheme.files.nodes) { $stagingByFile[$n.filename] = $n }

$stagingOnly = New-Object System.Collections.Generic.List[string]
$liveOnly = New-Object System.Collections.Generic.List[string]
$changedBoth = New-Object System.Collections.Generic.List[string]
$identical = New-Object System.Collections.Generic.List[string]

foreach ($filename in $stagingByFile.Keys) {
    if (-not $liveByFile.ContainsKey($filename)) {
        $stagingOnly.Add($filename)
    }
}
foreach ($filename in $liveByFile.Keys) {
    if (-not $stagingByFile.ContainsKey($filename)) {
        $liveOnly.Add($filename)
        continue
    }
    $liveNode = $liveByFile[$filename]
    $stagingNode = $stagingByFile[$filename]
    if ($liveNode.checksumMd5 -and $stagingNode.checksumMd5 -and $liveNode.checksumMd5 -eq $stagingNode.checksumMd5) {
        $identical.Add($filename)
    } else {
        $changedBoth.Add("$filename  (live checksum: $($liveNode.checksumMd5), staging checksum: $($stagingNode.checksumMd5), live size: $($liveNode.size), staging size: $($stagingNode.size))")
    }
}

Write-Output "=== 1. STAGING-ONLY (new in staging, not yet on live) -- $($stagingOnly.Count) file(s) ==="
$stagingOnly | Sort-Object | ForEach-Object { Write-Output "  + $_" }
Write-Output ""

Write-Output "=== 2. LIVE-ONLY (on live, not in staging -- REVIEW BEFORE ANY PROMOTION) -- $($liveOnly.Count) file(s) ==="
$liveOnly | Sort-Object | ForEach-Object { Write-Output "  ! $_" }
Write-Output ""

Write-Output "=== 3. CHANGED IN BOTH (different content, same filename -- needs content-level diff) -- $($changedBoth.Count) file(s) ==="
$changedBoth | Sort-Object | ForEach-Object { Write-Output "  ~ $_" }
Write-Output ""

Write-Output "=== 4. IDENTICAL -- $($identical.Count) file(s) (no action) ==="
Write-Output ""

Write-Output "=== SUMMARY ==="
Write-Output "  staging-only : $($stagingOnly.Count)"
Write-Output "  live-only    : $($liveOnly.Count)"
Write-Output "  changed-both : $($changedBoth.Count)"
Write-Output "  identical    : $($identical.Count)"
Write-Output ""

if ($liveOnly.Count -gt 0 -or $changedBoth.Count -gt 0) {
    Write-Output "RESULT: DRIFT DETECTED. Per CLAUDE.md's reconciliation rule, every LIVE-only file and every"
    Write-Output "changed-in-both file must be individually classified (A: already in staging / B: legitimate"
    Write-Output "manual live change to preserve / C: staging intentionally replaces it, needs human approval /"
    Write-Output "D: cannot confidently determine intent, STOP) before any STAGING -> LIVE promotion proceeds."
    exit 1
} else {
    Write-Output "RESULT: NO DRIFT. Staging is a strict superset of live's content (or identical) -- safe to"
    Write-Output "proceed to the normal approval gate for promotion."
    exit 0
}
