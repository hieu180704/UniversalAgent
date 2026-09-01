# UniversalAgent - Windows PowerShell Installer
param(
  [string]$TargetDir = ""
)

$Source = $PSScriptRoot

if ([string]::IsNullOrWhiteSpace($TargetDir)) {
  Write-Host "================================================================" -ForegroundColor Cyan
  Write-Host "      🚀 UniversalAgent - Trình Cài Đặt 1-Click (Dual-Agent)" -ForegroundColor Yellow
  Write-Host "================================================================" -ForegroundColor Cyan
  Write-Host ""
  $TargetDir = Read-Host "👉 Nhập đường dẫn thư mục dự án đích (hoặc kéo thả thư mục vào đây)"
}

$TargetDir = $TargetDir.Trim().Trim('"').Trim("'").TrimEnd('\', '/')

if ([string]::IsNullOrWhiteSpace($TargetDir)) {
  Write-Host "[!] Không có đường dẫn nào được cung cấp. Đang hủy..." -ForegroundColor Red
  exit 1
}

if (-not (Test-Path $TargetDir)) {
  Write-Host "[*] Thư mục '$TargetDir' chưa tồn tại. Đang tạo mới..." -ForegroundColor Yellow
  New-Item -Path $TargetDir -ItemType Directory -Force | Out-Null
}

$Destination = (Resolve-Path $TargetDir).Path

if ($Destination -eq $Source) {
  Write-Host "[!] Thư mục đích trùng với thư mục nguồn UniversalAgent. Đang hủy để tránh tự ghi đè." -ForegroundColor Red
  exit 1
}

Write-Host "🚀 Đang cài đặt UniversalAgent vào: $Destination" -ForegroundColor Cyan

$Folders = @(".ai", ".agents", ".claude", "Docs")
$Files = @("AGENTS_TEMPLATE.md", "CLAUDE_TEMPLATE.md", ".editorconfig", ".gitignore", ".gitattributes")

foreach ($f in $Folders) {
  $srcPath = Join-Path $Source $f
  $destPath = Join-Path $Destination $f
  if (Test-Path $srcPath) {
    Copy-Item -Path $srcPath -Destination $destPath -Recurse -Force
    Write-Host "  [+] Đã sao chép thư mục: $f" -ForegroundColor Green
  }
}

foreach ($file in $Files) {
  $srcFile = Join-Path $Source $file
  $destFile = Join-Path $Destination $file
  if (Test-Path $srcFile) {
    Copy-Item -Path $srcFile -Destination $destFile -Force
    Write-Host "  [+] Đã sao chép tệp: $file" -ForegroundColor Green
  }
}

# Khởi tạo AGENTS.md và CLAUDE.md nếu chưa có
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

# Chạy setup-links.js tại thư mục đích để thiết lập Directory Junctions
$setupLinks = Join-Path $Destination ".ai/setup-links.js"
Write-Host "🔗 Đang thiết lập Directory Junctions (.agents & .claude)..." -ForegroundColor Cyan

$hasNode = $null -ne (Get-Command node -ErrorAction SilentlyContinue)
if ($hasNode -and (Test-Path $setupLinks)) {
  node $setupLinks
} else {
  $junctions = @(
    @{ Link = (Join-Path $Destination ".claude\rules"); Target = (Join-Path $Destination ".ai\rules") },
    @{ Link = (Join-Path $Destination ".claude\skills"); Target = (Join-Path $Destination ".ai\skills") },
    @{ Link = (Join-Path $Destination ".agents\rules"); Target = (Join-Path $Destination ".ai\rules") },
    @{ Link = (Join-Path $Destination ".agents\skills"); Target = (Join-Path $Destination ".ai\skills") }
  )
  foreach ($j in $junctions) {
    if (Test-Path $j.Link) {
      try {
        [System.IO.Directory]::Delete($j.Link, $true)
      } catch {
        cmd /c "rmdir /s /q ""$($j.Link)"" 2>nul" | Out-Null
      }
    }
    $parent = Split-Path -Parent $j.Link
    if (-not (Test-Path $parent)) {
      New-Item -Path $parent -ItemType Directory -Force | Out-Null
    }
    cmd /c "mklink /J ""$($j.Link)"" ""$($j.Target)"" 2>nul" | Out-Null
    Write-Host "  [OK] Linked: $($j.Link) -> $($j.Target)" -ForegroundColor Green
  }
}

Write-Host ""
Write-Host "🎉 Cài đặt UniversalAgent thành công!" -ForegroundColor Green
Write-Host "👉 Bước tiếp theo: Mở project với Antigravity (Gemini) hoặc Claude Code và gõ '/init' để AI tự động phỏng vấn và hoàn tất thiết lập!" -ForegroundColor Cyan
