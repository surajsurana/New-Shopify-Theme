<#
Hard pass/fail gate for a staging deployment. Compares the expected file
list (written by get-staging-verification-query.ps1 to
.staging-verify/expected.json) against the actual Shopify Admin API
response for the same query, and fails loudly -- non-zero exit code, no
ambiguity -- if anything expected is missing or stale.

This is deliberately a separate step from the Shopify API call itself:
no script in this repo holds Shopify credentials. The flow is:
  1. scripts/get-staging-verification-query.ps1   (emits query + expected.json)
  2. Claude Code runs that query via its Shopify Admin GraphQL MCP tool
  3. Save the raw JSON response Shopify returned to a file
  4. scripts/compare-staging-verification.ps1 -ActualJsonPath <that file>

A deployment is NOT successful until this script prints PASS. Per CLAUDE.md's
staging deployment procedure, do not report a theme change as "done" on the
strength of a successful `git push` alone -- see the "Known issue" section
for why (Shopify's GitHub sync has silently dropped files at least 4 times
on this project with no error anywhere).

Usage:
  scripts/compare-staging-verification.ps1 -ActualJsonPath <path to saved Shopify response>
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$ActualJsonPath
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$expectedPath = Join-Path $repoRoot '.staging-verify\expected.json'

if (-not (Test-Path $expectedPath)) {
    Write-Output "FAIL: $expectedPath not found -- run scripts/get-staging-verification-query.ps1 first."
    exit 1
}
if (-not (Test-Path $ActualJsonPath)) {
    Write-Output "FAIL: $ActualJsonPath not found."
    exit 1
}

$expected = Get-Content -Raw -Encoding UTF8 -Path $expectedPath | ConvertFrom-Json
$actualRaw = Get-Content -Raw -Encoding UTF8 -Path $ActualJsonPath | ConvertFrom-Json

$actualNodes = $actualRaw.data.theme.files.nodes
if ($null -eq $actualNodes) {
    Write-Output "FAIL: could not find data.theme.files.nodes in $ActualJsonPath -- is this the raw GraphQL response?"
    exit 1
}

$deployedAfter = [datetime]::Parse($expected.deployedAfter).ToUniversalTime()
$actualByFilename = @{}
foreach ($node in $actualNodes) { $actualByFilename[$node.filename] = $node }

$missing = New-Object System.Collections.Generic.List[string]
$stale = New-Object System.Collections.Generic.List[string]

foreach ($filename in $expected.filenames) {
    if (-not $actualByFilename.ContainsKey($filename)) {
        $missing.Add($filename)
        continue
    }
    $updatedAt = [datetime]::Parse($actualByFilename[$filename].updatedAt).ToUniversalTime()
    if ($updatedAt -lt $deployedAfter) {
        $stale.Add("$filename (updatedAt $($actualByFilename[$filename].updatedAt), before deploy cutoff $($expected.deployedAfter))")
    }
}

$extra = $actualByFilename.Keys | Where-Object { $expected.filenames -notcontains $_ }

$ok = ($missing.Count -eq 0) -and ($stale.Count -eq 0)

if ($missing.Count -gt 0) {
    Write-Output "MISSING FROM STAGING ($($missing.Count)):"
    foreach ($m in $missing) { Write-Output "  - $m" }
}
if ($stale.Count -gt 0) {
    Write-Output "STALE ON STAGING (present, but not updated by this deploy) ($($stale.Count)):"
    foreach ($s in $stale) { Write-Output "  - $s" }
}
if ($extra.Count -gt 0) {
    Write-Output "EXTRA/UNEXPECTED (returned by Shopify but not in the expected list) ($($extra.Count)):"
    foreach ($e in $extra) { Write-Output "  - $e" }
}

if ($ok) {
    Write-Output "PASS: all $($expected.filenames.Count) expected file(s) present on staging with a fresh updatedAt."
    exit 0
} else {
    Write-Output "FAIL: staging deployment verification failed -- do NOT report this change as done."
    exit 1
}
