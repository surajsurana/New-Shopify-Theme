<#
Emits the Admin GraphQL query for the LIVE-vs-STAGING drift check's first
step: a cheap, checksum-only listing of every file in both themes (no body
content -- keeps the payload small enough to fetch in one call even for a
200+ file theme). Feed the saved response into compare-live-staging-drift.ps1.

This is read-only. It never writes anything, and reading the live theme's
file list has always been within Technical Director's existing (2026-07-12)
read-only Shopify access -- no new permission is needed for this step.

Usage:
  scripts/get-drift-file-lists-query.ps1 -LiveThemeId 188751446306 -StagingThemeId 189829808418
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$LiveThemeId,
    [Parameter(Mandatory = $true)]
    [string]$StagingThemeId
)

Write-Output "--- GraphQL query (run via graphql_query) ---"
Write-Output @"
query DriftFileLists {
  live: theme(id: "gid://shopify/OnlineStoreTheme/$LiveThemeId") {
    id name role updatedAt
    files(first: 2500) { nodes { filename checksumMd5 size contentType updatedAt } }
  }
  staging: theme(id: "gid://shopify/OnlineStoreTheme/$StagingThemeId") {
    id name role updatedAt
    files(first: 2500) { nodes { filename checksumMd5 size contentType updatedAt } }
  }
}
"@
Write-Output ""
Write-Output "Save the raw response to a file, then run:"
Write-Output "  scripts/compare-live-staging-drift.ps1 -ResponseJsonPath <path>"
Write-Output ""
Write-Output "For any file it reports as LIVE-ONLY or CHANGED IN BOTH, fetch actual body content for just"
Write-Output "those filenames from both themes (body { ... on OnlineStoreThemeFileBodyText { content } } }),"
Write-Output "save that response too, and run:"
Write-Output "  scripts/diff-theme-file-content.ps1 -ResponseJsonPath <path>"
Write-Output "to get a real unified diff per file -- do not classify a file from checksum/size alone."
