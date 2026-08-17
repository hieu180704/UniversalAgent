# UniversalAgent — Windows PowerShell Installer
param(
  [string]$TargetDir = ""
)

$Source = $PSScriptRoot

if ([string]::IsNullOrWhiteSpace($TargetDir)) {
  Write-Host "================================================================" -ForegroundColor Cyan
  Write-Host "      🌐 UniversalAgent — Trình Cài Đặt 1-Click" -ForegroundColor Yellow
  Write-Host "================================================================" -ForegroundColor Cyan
  Write-Host ""
  $TargetDir = Read-Host "👉 Nhập đường dẫn thư mục dự án đích (hoặc kéo thả thư mục vào đây)"
  $TargetDir = $TargetDir.Trim().Trim('"').Trim("'")
}

if ([string]::IsNullOrWhiteSpace($TargetDir)) {
  Write-Host "[!] Không có đường dẫn nào được cung cấp. Đang hủy..." -ForegroundColor Red
  exit 1
}

if (-not (Test-Path $TargetDir)) {
  Write-Host "[*] Thư mục '$TargetDir' chưa tồn tại. Đang tạo mới..." -ForegroundColor Yellow
  New-Item -Path $TargetDir -ItemType Directory -Force | Out-Null
}

$Destination = (Resolve-Path $TargetDir).Path

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

# Khởi tạo các file MD chính nếu chưa có
$agentsFile = Join-Path $Destination "AGENTS.md"
if (-not (Test-Path $agentsFile)) {
  Copy-Item -Path (Join-Path $Source "AGENTS_TEMPLATE.md") -Destination $agentsFile
  Write-Host "  [*] Đã tạo AGENTS.md khởi đầu từ template" -ForegroundColor Yellow
}

$claudeFile = Join-Path $Destination "CLAUDE.md"
if (-not (Test-Path $claudeFile)) {
  Copy-Item -Path (Join-Path $Source "CLAUDE_TEMPLATE.md") -Destination $claudeFile
  Write-Host "  [*] Đã tạo CLAUDE.md khởi đầu từ template" -ForegroundColor Yellow
}

$chatgptFile = Join-Path $Destination "CHATGPT.md"
if (-not (Test-Path $chatgptFile)) {
  Copy-Item -Path (Join-Path $Source "CHATGPT_TEMPLATE.md") -Destination $chatgptFile
  Write-Host "  [*] Đã tạo CHATGPT.md khởi đầu từ template" -ForegroundColor Yellow
}

Write-Host "🎉 Cài đặt UniversalAgent thành công!" -ForegroundColor Green
Write-Host "👉 Bước tiếp theo: Mở project với AI (Gemini, Claude Code, ChatGPT) và gõ '/init' để AI tự động phỏng vấn và hoàn tất thiết lập tài liệu dự án!" -ForegroundColor Cyan

