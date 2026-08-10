<#
Pre-push validator for this theme's Liquid section/block schema and JSON templates.

Root cause this exists for -- see CLAUDE.md "Known issue" section for full
history (4 confirmed incidents: ka-predictive-search.liquid + ka-nav.liquid
2026-07-12, ka-cart-items.liquid 2026-07-13, ka-faq-main.liquid 2026-07-23,
Client Diaries 2026-08-10): Shopify's GitHub->theme sync silently drops any
section file with invalid schema, with zero error surfaced anywhere in git,
GitHub, or Shopify Admin -- confirmed directly via themeFilesUpsert Admin API
errors, which DO surface the real validation failure. Two specific invalid-
schema patterns have actually recurred on this project and are checked here:
  1. A schema/preset/block "name" over Shopify's real 25-character hard limit
     ("Invalid schema: name is too long (max 25 characters)").
  2. A type:"url" setting with a "default" value -- Shopify does not allow
     defaults on url-type settings at all.
Either one causes the same silent failure. A file that fails this way, and
anything that references it (e.g. a JSON template referencing its section
"type"), simply doesn't exist on the theme after a sync that reports no error.

Usage:
  pwsh scripts/validate-theme-schema.ps1
  (or from Windows PowerShell: powershell -File scripts/validate-theme-schema.ps1)

Exit code 0 = clean. Exit code 1 = at least one violation found (fix before
pushing / deploying to staging).
#>

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$maxNameLength = 25
$violations = New-Object System.Collections.Generic.List[string]

function Get-SchemaBlock {
    param([string]$Content)
    # Strip {%- comment -%}...{%- endcomment -%} blocks first: this theme's
    # files document past incidents inline, including the literal text
    # "{% schema %}" inside prose (e.g. sections/ka-cart-items.liquid's
    # history note) -- without stripping comments first, a naive regex
    # anchors on that mention instead of the real tag and captures
    # everything up to the real {% endschema %}, which then fails to
    # parse as JSON (confirmed the hard way while writing this script).
    $withoutComments = $Content -replace '(?s)\{%-?\s*comment\s*-?%\}.*?\{%-?\s*endcomment\s*-?%\}', ''
    if ($withoutComments -match '(?s)\{%-?\s*schema\s*-?%\}(.*?)\{%-?\s*endschema\s*-?%\}') {
        return $Matches[1]
    }
    return $null
}

function Test-NameField {
    param([string]$File, [string]$Label, $Value)
    if ($null -eq $Value) { return }
    $len = [string]$Value
    if ($len.Length -gt $maxNameLength) {
        $violations.Add("[$File] $Label is $($len.Length) chars (max $maxNameLength): `"$len`"")
    }
}

# --- 1. Section and block schema name/preset-name/block-name length ---
$liquidDirs = @('sections', 'blocks') | Where-Object { Test-Path (Join-Path $repoRoot $_) }
foreach ($dir in $liquidDirs) {
    $files = Get-ChildItem -Path (Join-Path $repoRoot $dir) -Filter '*.liquid' -File
    foreach ($f in $files) {
        $relPath = "$dir/$($f.Name)"
        # -Encoding UTF8 is required: these files are UTF-8 without a BOM, and
        # Windows PowerShell 5.1's default Get-Content encoding misreads
        # multi-byte characters (em dashes, arrows) as mojibake without it,
        # which also throws off .Length-based character counts.
        $content = Get-Content -Raw -Encoding UTF8 -Path $f.FullName
        $schemaText = Get-SchemaBlock -Content $content
        if ($null -eq $schemaText) { continue }

        try {
            $schema = $schemaText | ConvertFrom-Json -ErrorAction Stop
        } catch {
            $violations.Add("[$relPath] schema block is not valid JSON: $($_.Exception.Message)")
            continue
        }

        Test-NameField -File $relPath -Label 'schema "name"' -Value $schema.name

        if ($schema.presets) {
            foreach ($preset in $schema.presets) {
                Test-NameField -File $relPath -Label 'preset "name"' -Value $preset.name
            }
        }
        if ($schema.blocks) {
            foreach ($block in $schema.blocks) {
                Test-NameField -File $relPath -Label "block `"name`" (type: $($block.type))" -Value $block.name
            }
        }

        # type:"url" settings must not have a "default" -- Shopify's schema
        # validator rejects it outright (real incident: ka-nav.liquid, eaa251f).
        $settingsGroups = @()
        if ($schema.settings) { $settingsGroups += , $schema.settings }
        if ($schema.blocks) {
            foreach ($block in $schema.blocks) {
                if ($block.settings) { $settingsGroups += , $block.settings }
            }
        }
        foreach ($settingsList in $settingsGroups) {
            foreach ($setting in $settingsList) {
                if ($setting.type -eq 'url' -and $null -ne $setting.default) {
                    $violations.Add("[$relPath] setting `"$($setting.id)`" is type:`"url`" with a `"default`" value (`"$($setting.default)`") -- Shopify does not allow defaults on url-type settings")
                }
            }
        }
    }
}

# --- 2. JSON template validity + section "type" references resolve to real files ---
$knownSectionTypes = @{}
foreach ($dir in $liquidDirs) {
    Get-ChildItem -Path (Join-Path $repoRoot $dir) -Filter '*.liquid' -File | ForEach-Object {
        $knownSectionTypes[[System.IO.Path]::GetFileNameWithoutExtension($_.Name)] = $true
    }
}

$templatesDir = Join-Path $repoRoot 'templates'
if (Test-Path $templatesDir) {
    $templateFiles = Get-ChildItem -Path $templatesDir -Filter '*.json' -File
    foreach ($f in $templateFiles) {
        $relPath = "templates/$($f.Name)"
        $raw = Get-Content -Raw -Encoding UTF8 -Path $f.FullName
        $stripped = $raw -replace '(?s)/\*.*?\*/', ''
        try {
            $obj = $stripped | ConvertFrom-Json -ErrorAction Stop
        } catch {
            $violations.Add("[$relPath] template JSON is not valid: $($_.Exception.Message)")
            continue
        }
        if ($obj.sections) {
            foreach ($prop in $obj.sections.PSObject.Properties) {
                $sectionType = $prop.Value.type
                if ($sectionType -and -not $knownSectionTypes.ContainsKey($sectionType)) {
                    $violations.Add("[$relPath] references section type `"$sectionType`" with no matching sections/$sectionType.liquid on disk")
                }
            }
        }
    }
}

# --- Report ---
if ($violations.Count -eq 0) {
    Write-Output "PASS: no schema-name-length or template-reference violations found."
    exit 0
} else {
    Write-Output "FAIL: $($violations.Count) violation(s) found -- fix before pushing/deploying to staging:"
    foreach ($v in $violations) { Write-Output "  - $v" }
    exit 1
}
