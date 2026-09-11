# UniversalAgent Windows PowerShell installer. Keep this file ASCII-only for Windows PowerShell 5.1 compatibility.
param(
  [string]$TargetDir = ""
)

$Source = $PSScriptRoot

if ([string]::IsNullOrWhiteSpace($TargetDir)) {
  Write-Host "UniversalAgent installer" -ForegroundColor Cyan
  $TargetDir = Read-Host "Target project directory"
}

$TargetDir = $TargetDir.Trim().Trim('"').Trim("'").TrimEnd('\', '/')
if ([string]::IsNullOrWhiteSpace($TargetDir)) {
  Write-Host "No target directory was provided." -ForegroundColor Red
  exit 1
}

if (-not (Test-Path -LiteralPath $TargetDir)) {
  New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
}

$Destination = (Resolve-Path -LiteralPath $TargetDir).Path
$SourceResolved = (Resolve-Path -LiteralPath $Source).Path
if ($Destination -eq $SourceResolved) {
  Write-Host "The target directory cannot be the UniversalAgent source directory." -ForegroundColor Red
  exit 1
}

$Folders = @('.agents', '.claude', '.codex', 'Docs')
$Files = @('.editorconfig', '.gitignore', '.gitattributes')

foreach ($folder in $Folders) {
  $sourcePath = Join-Path $Source $folder
  $destinationPath = Join-Path $Destination $folder
  if (Test-Path -LiteralPath $sourcePath) {
    Copy-Item -LiteralPath $sourcePath -Destination $destinationPath -Recurse -Force
    Write-Host "Copied folder: $folder" -ForegroundColor Green
  }
}

foreach ($file in $Files) {
  $sourceFile = Join-Path $Source $file
  $destinationFile = Join-Path $Destination $file
  if (Test-Path -LiteralPath $sourceFile) {
    Copy-Item -LiteralPath $sourceFile -Destination $destinationFile -Force
    Write-Host "Copied file: $file" -ForegroundColor Green
  }
}

$agentsFile = Join-Path $Destination 'AGENTS.md'
if (-not (Test-Path -LiteralPath $agentsFile)) {
  Copy-Item -LiteralPath (Join-Path $Source 'AGENTS_TEMPLATE.md') -Destination $agentsFile
  Write-Host "Created AGENTS.md from template" -ForegroundColor Yellow
}

$claudeFile = Join-Path $Destination 'CLAUDE.md'
if (-not (Test-Path -LiteralPath $claudeFile)) {
  Copy-Item -LiteralPath (Join-Path $Source 'CLAUDE_TEMPLATE.md') -Destination $claudeFile
  Write-Host "Created CLAUDE.md from template" -ForegroundColor Yellow
}

Write-Host "UniversalAgent installation completed." -ForegroundColor Green