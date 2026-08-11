<#
Given a saved raw GraphQL JSON response of the shape
  { "data": { "live": { "files": { "nodes": [{filename, body{content}}] } },
              "staging": { "files": { "nodes": [...] } } } }
(fetched via a query requesting body content, NOT the cheap checksum-only
listing from compare-live-staging-drift.ps1), writes each file's live and
staging content to disk and prints a unified diff for every filename found
on both sides. This is the "inspect the actual diff" step CLAUDE.md's
reconciliation rule requires before deciding whether a live/staging
difference is meaningful.

Usage:
  scripts/diff-theme-file-content.ps1 -ResponseJsonPath <path> [-OutDir <dir>]
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$ResponseJsonPath,
    [string]$OutDir = "$env:TEMP\ka-theme-drift-diff"
)

$ErrorActionPreference = 'Stop'
$resp = Get-Content -Raw -Encoding UTF8 -Path $ResponseJsonPath | ConvertFrom-Json

if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }

$liveNodes = @{}
foreach ($n in $resp.data.live.files.nodes) { $liveNodes[$n.filename] = $n.body.content }
$stagingNodes = @{}
foreach ($n in $resp.data.staging.files.nodes) { $stagingNodes[$n.filename] = $n.body.content }

$common = $liveNodes.Keys | Where-Object { $stagingNodes.ContainsKey($_) }

foreach ($filename in $common) {
    $safeName = $filename -replace '[\\/]', '__'
    $livePath = Join-Path $OutDir "$safeName.live"
    $stagingPath = Join-Path $OutDir "$safeName.staging"
    Set-Content -Path $livePath -Value $liveNodes[$filename] -Encoding UTF8 -NoNewline
    Set-Content -Path $stagingPath -Value $stagingNodes[$filename] -Encoding UTF8 -NoNewline

    Write-Output "############################################################"
    Write-Output "### $filename"
    Write-Output "############################################################"
    & git diff --no-index --no-color -- $livePath $stagingPath
    Write-Output ""
}
