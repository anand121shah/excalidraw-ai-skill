<#
Writes the Excalidraw clipboard (after H.copyAll()) to a .excalidraw file.
Usage: powershell -File save-scene.ps1 -OutPath C:\path\diagram-v1.excalidraw -ExpectedCount 212
Never overwrites; if the path exists, it appends -2, -3, ...
#>
param(
  [Parameter(Mandatory = $true)][string]$OutPath,
  [int]$ExpectedCount = 0
)
$ErrorActionPreference = 'Stop'
$raw = Get-Clipboard -Raw
if (-not $raw) { throw 'Clipboard is empty. Run H.copyAll() first.' }
$clip = $raw | ConvertFrom-Json
if ($clip.type -ne 'excalidraw/clipboard') { throw "Clipboard is not Excalidraw data (type=$($clip.type))." }
$n = @($clip.elements).Count
if ($ExpectedCount -gt 0 -and $n -ne $ExpectedCount) { throw "Clipboard has $n elements, expected $ExpectedCount." }

$files = if ($clip.files) { $clip.files } else { [pscustomobject]@{} }
$scene = [ordered]@{
  type     = 'excalidraw'
  version  = 2
  source   = 'https://excalidraw.com'
  elements = @($clip.elements)
  appState = [ordered]@{ viewBackgroundColor = '#ffffff'; gridSize = $null }
  files    = $files
}

$dir = Split-Path $OutPath -Parent
$base = [IO.Path]::GetFileNameWithoutExtension($OutPath)
$ext = [IO.Path]::GetExtension($OutPath); if (-not $ext) { $ext = '.excalidraw' }
$target = Join-Path $dir ($base + $ext); $i = 2
while (Test-Path $target) { $target = Join-Path $dir ("$base-$i" + $ext); $i++ }

$json = $scene | ConvertTo-Json -Depth 100 -Compress
[IO.File]::WriteAllText($target, $json, (New-Object Text.UTF8Encoding($false)))
$check = (Get-Content $target -Raw -Encoding UTF8 | ConvertFrom-Json).elements.Count
"Saved $check elements -> $target"
