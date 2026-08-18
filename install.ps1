# UniversalAgent — Windows PowerShell Installer
param(
  [string]$TargetDir = ""
)

$ErrorActionPreference = "Stop"
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

if ($Destination -eq $Source) {
  Write-Host "[!] Thư mục đích trùng với thư mục nguồn UniversalAgent. Đang hủy để tránh tự ghi đè." -ForegroundColor Red
  exit 1
}

Write-Host "🚀 Đang cài đặt UniversalAgent vào: $Destination" -ForegroundColor Cyan

# Thư mục khung do UniversalAgent sở hữu — luôn cập nhật.
$Folders = @(".agents", ".claude", ".cursor", ".github", ".openai", "Docs", "scripts")
# File template khung — luôn cập nhật.
$FrameworkFiles = @("AGENTS_TEMPLATE.md", "CLAUDE_TEMPLATE.md", "CHATGPT_TEMPLATE.md", ".cursorrules")
# File thuộc quyền dự án đích — KHÔNG bao giờ ghi đè.
$ProjectFiles = @(".editorconfig", ".gitignore", ".gitattributes")

# --- Giữ lại .claude/settings.json sẵn có của dự án đích ---
$targetSettings = Join-Path $Destination ".claude\settings.json"
$stashedSettings = $null
if (Test-Path $targetSettings) {
  $stashedSettings = Join-Path ([System.IO.Path]::GetTempPath()) ("ua-settings-" + [Guid]::NewGuid().ToString() + ".json")
  Copy-Item -Path $targetSettings -Destination $stashedSettings -Force
}

# --- 1. Chép thư mục theo kiểu merge (chạy lại nhiều lần vẫn đúng) ---
foreach ($f in $Folders) {
  $srcPath = Join-Path $Source $f
  $destPath = Join-Path $Destination $f
  if (Test-Path $srcPath) {
    New-Item -Path $destPath -ItemType Directory -Force | Out-Null
    # Chép nội dung bên trong (src\*) chứ KHÔNG chép chính thư mục,
    # nếu không lần chạy thứ 2 sẽ tạo ra cấu trúc lồng nhau kiểu .agents\.agents.
    Copy-Item -Path (Join-Path $srcPath "*") -Destination $destPath -Recurse -Force
    Write-Host "  [+] Đã đồng bộ thư mục: $f" -ForegroundColor Green
  }
}

# --- 2. Trả lại settings.json của dự án đích, bản khung để cạnh làm tham chiếu ---
if ($stashedSettings) {
  $sidecar = Join-Path $Destination ".claude\settings.json.universalagent"
  Copy-Item -Path $targetSettings -Destination $sidecar -Force
  Copy-Item -Path $stashedSettings -Destination $targetSettings -Force
  Remove-Item -Path $stashedSettings -Force
  Write-Host "  [!] Giữ nguyên .claude\settings.json sẵn có. Bản của UniversalAgent lưu tại .claude\settings.json.universalagent" -ForegroundColor Yellow
}

# --- 3. Không mang worklog riêng của UniversalAgent sang dự án đích ---
$srcDone = Join-Path $Source "Docs\Done"
if (Test-Path $srcDone) {
  Get-ChildItem -Path $srcDone -File | Where-Object { $_.Name -ne "fragment-template.txt" } | ForEach-Object {
    $leaked = Join-Path $Destination "Docs\Done\$($_.Name)"
    if (Test-Path $leaked) {
      Remove-Item -Path $leaked -Force
      Write-Host "  [-] Đã loại worklog riêng của UniversalAgent: Docs\Done\$($_.Name)" -ForegroundColor DarkGray
    }
  }
}

# --- 4. File template khung ---
foreach ($file in $FrameworkFiles) {
  $srcFile = Join-Path $Source $file
  if (Test-Path $srcFile) {
    Copy-Item -Path $srcFile -Destination (Join-Path $Destination $file) -Force
    Write-Host "  [+] Đã đồng bộ tệp: $file" -ForegroundColor Green
  }
}

# --- 5. File thuộc quyền dự án đích: chỉ tạo khi chưa có ---
foreach ($file in $ProjectFiles) {
  $srcFile = Join-Path $Source $file
  $destFile = Join-Path $Destination $file
  if (-not (Test-Path $srcFile)) { continue }

  if (Test-Path $destFile) {
    $sidecar = "$destFile.universalagent"
    Copy-Item -Path $srcFile -Destination $sidecar -Force
    Write-Host "  [!] Giữ nguyên $file sẵn có. Bản của UniversalAgent lưu tại $file.universalagent" -ForegroundColor Yellow
  }
  else {
    Copy-Item -Path $srcFile -Destination $destFile -Force
    Write-Host "  [+] Đã tạo tệp: $file" -ForegroundColor Green
  }
}

# --- 6. Khởi tạo các file entry point chính nếu chưa có ---
$Entries = @{
  "AGENTS.md"  = "AGENTS_TEMPLATE.md"
  "CLAUDE.md"  = "CLAUDE_TEMPLATE.md"
  "CHATGPT.md" = "CHATGPT_TEMPLATE.md"
}
foreach ($entry in $Entries.GetEnumerator()) {
  $destFile = Join-Path $Destination $entry.Key
  $srcTemplate = Join-Path $Source $entry.Value
  if ((-not (Test-Path $destFile)) -and (Test-Path $srcTemplate)) {
    Copy-Item -Path $srcTemplate -Destination $destFile -Force
    Write-Host "  [*] Đã tạo $($entry.Key) khởi đầu từ template" -ForegroundColor Yellow
  }
}

# --- 7. Sinh cấu hình cho toàn bộ nền tảng ngay trên dự án đích ---
# Không có bước này thì AGENTS.md/CLAUDE.md/CHATGPT.md của dự án mới chỉ là
# template rỗng, và ChatGPT/Cursor/Copilot sẽ chạy mà không có quy tắc nào.
$syncScript = Join-Path $Destination "scripts\sync-agents.js"
if (Test-Path $syncScript) {
  $previousLocation = Get-Location
  try {
    Set-Location $Destination
    & node "scripts/sync-agents.js" | Out-Null
    if ($LASTEXITCODE -eq 0) {
      Write-Host "  [+] Đã sinh cấu hình đa nền tảng cho dự án đích" -ForegroundColor Green
    }
    else {
      Write-Host "  [!] Bộ sinh cấu hình báo lỗi. Hãy chạy tay: node scripts/sync-agents.js" -ForegroundColor Yellow
    }
  }
  catch {
    Write-Host "  [!] Không chạy được bộ sinh cấu hình (thiếu Node.js?). Hãy cài Node rồi chạy: node scripts/sync-agents.js" -ForegroundColor Yellow
  }
  finally {
    Set-Location $previousLocation
  }
}

Write-Host "🎉 Cài đặt UniversalAgent thành công!" -ForegroundColor Green
Write-Host "👉 Bước tiếp theo: Mở project với AI (Gemini, Claude Code, ChatGPT) và gõ '/init' để AI tự động phỏng vấn và hoàn tất thiết lập tài liệu dự án!" -ForegroundColor Cyan
