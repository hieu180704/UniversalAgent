# UniversalAgent — Windows PowerShell Installer
param(
  [string]$TargetDir = "."
)

$Source = $PSScriptRoot
$Destination = Resolve-Path $TargetDir

Write-Host "🚀 Đang cài đặt UniversalAgent vào: $Destination" -ForegroundColor Cyan

$Folders = @(".agents", ".claude", ".openai", "Docs", "scripts")
$Files = @("AGENTS_TEMPLATE.md", "CLAUDE_TEMPLATE.md", "CHATGPT_TEMPLATE.md", ".cursorrules", ".editorconfig", ".gitignore", ".gitattributes")

foreach ($f in $Folders) {
  $srcPath = Join-Path $Source $f
  $destPath = Join-Path $Destination $f
  if (Test-Path $srcPath) {
    Copy-Item -Path $srcPath -Destination $destPath -Recurse -Force
    Write-Host "  [+] Đã chép thư mục: $f" -ForegroundColor Green
  }
}

foreach ($file in $Files) {
  $srcFile = Join-Path $Source $file
  $destFile = Join-Path $Destination $file
  if (Test-Path $srcFile) {
    Copy-Item -Path $srcFile -Destination $destFile -Force
    Write-Host "  [+] Đã chép tệp: $file" -ForegroundColor Green
  }
}

# Khởi tạo AGENTS.md nếu chưa có
$agentsFile = Join-Path $Destination "AGENTS.md"
if (-not (Test-Path $agentsFile)) {
  Copy-Item -Path (Join-Path $Source "AGENTS_TEMPLATE.md") -Destination $agentsFile
  Write-Host "  [*] Đã tạo AGENTS.md khởi đầu từ template" -ForegroundColor Yellow
}

Write-Host "🎉 Cài đặt UniversalAgent thành công!" -ForegroundColor Green
