# UniversalAgent Windows PowerShell installer. Keep this file ASCII-only for Windows PowerShell 5.1 compatibility.
# Thin wrapper: all install/upgrade logic lives in install.js.
param(
  [string]$TargetDir = "",
  [switch]$DryRun,
  [switch]$Yes
)

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js was not found in PATH. UniversalAgent hooks and installer require Node.js." -ForegroundColor Red
  exit 1
}

if ([string]::IsNullOrWhiteSpace($TargetDir)) {
  Write-Host "UniversalAgent installer" -ForegroundColor Cyan
  $TargetDir = Read-Host "Target project directory"
}

$TargetDir = $TargetDir.Trim().Trim('"').Trim("'")
if ([string]::IsNullOrWhiteSpace($TargetDir)) {
  Write-Host "No target directory was provided." -ForegroundColor Red
  exit 1
}

$nodeArgs = @((Join-Path $PSScriptRoot 'install.js'), $TargetDir)
if ($DryRun) { $nodeArgs += '--dry-run' }
if ($Yes) { $nodeArgs += '--yes' }

& node @nodeArgs
exit $LASTEXITCODE
