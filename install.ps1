<#
Installs the excalidraw-diagram skill for GitHub Copilot (and optionally Claude Code).
Usage (from the unzipped folder):
  powershell -ExecutionPolicy Bypass -File .\install.ps1            # Copilot: %USERPROFILE%\.copilot\skills
  powershell -ExecutionPolicy Bypass -File .\install.ps1 -Claude    # also %USERPROFILE%\.claude\skills
  powershell -ExecutionPolicy Bypass -File .\install.ps1 -Force     # replace an existing install
#>
param([switch]$Claude, [switch]$Force)
$ErrorActionPreference = 'Stop'
$pkg = Join-Path $PSScriptRoot 'excalidraw-diagram'
if (-not (Test-Path (Join-Path $pkg 'SKILL.md'))) { throw "SKILL.md not found next to this script: $pkg" }

$roots = @(Join-Path $env:USERPROFILE '.copilot\skills')
if ($Claude) { $roots += Join-Path $env:USERPROFILE '.claude\skills' }

foreach ($r in $roots) {
  $dest = Join-Path $r 'excalidraw-diagram'
  if (Test-Path $dest) {
    if (-not $Force) { throw "Already installed at $dest. Re-run with -Force to replace it." }
    Remove-Item $dest -Recurse -Force
  }
  New-Item -ItemType Directory -Force $r | Out-Null
  Copy-Item $pkg $dest -Recurse

  # Fill in this machine's absolute skill path (the browser needs absolute paths).
  $sk = Join-Path $dest 'SKILL.md'
  $t = [IO.File]::ReadAllText($sk)
  $t = $t.Replace('{{SKILL_DIR_JS}}', $dest.Replace('\', '\\')).Replace('{{SKILL_DIR}}', $dest)
  [IO.File]::WriteAllText($sk, $t, (New-Object Text.UTF8Encoding($false)))

  $libs = (Get-ChildItem (Join-Path $dest 'assets\libraries') -Filter *.excalidrawlib).Count
  if ($t -match '\{\{SKILL_DIR' -or $libs -ne 3) { throw "Install check failed at $dest (libraries=$libs)." }
  "Installed -> $dest  (3 icon packs, paths set)"
}
'Done. Restart VS Code (or start a new Copilot chat) so the skill is picked up.'
