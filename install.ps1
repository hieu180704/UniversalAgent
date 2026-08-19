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
# Docs/ CỐ Ý không nằm ở đây: nó là living docs của chính UniversalAgent, xử lý riêng ở bước 3.
$Folders = @(".agents", ".claude", "scripts")
# File template khung — luôn cập nhật.
$FrameworkFiles = @("AGENTS_TEMPLATE.md", "CLAUDE_TEMPLATE.md")
# File thuộc quyền dự án đích — KHÔNG bao giờ ghi đè.
$ProjectFiles = @(".editorconfig", ".gitignore", ".gitattributes")
# Khung thư mục Docs/ chuẩn (khớp .agents/rules/doc-policy.md mục 2).
$DocDirs = @("SourceOfTruth", "Decisions", "Handoffs", "QC", "Done", "prompts")

function Test-SameFile($a, $b) {
  if (-not (Test-Path $a) -or -not (Test-Path $b)) { return $false }
  return (Get-FileHash $a -Algorithm SHA256).Hash -eq (Get-FileHash $b -Algorithm SHA256).Hash
}

# File trong Docs/ được phép đi theo installer: chỉ template và README.
function Test-DocTemplate($name) {
  return ($name -like "*-template.txt") -or ($name -eq "README.txt")
}

# Đặt bản của khung cạnh file sẵn có của dự án, dưới tên <file>.universalagent.
# Chỉ làm khi nội dung THẬT SỰ khác nhau — giống nhau thì sidecar chỉ là rác
# (đúng trường hợp cài lại lần 2 lên chính file do lần cài đầu tạo ra), và
# sidecar cũ còn sót cũng được dọn luôn.
function Set-Sidecar($src, $dest) {
  $sidecar = "$dest.universalagent"
  if (Test-SameFile $src $dest) {
    if (Test-Path $sidecar) { Remove-Item -Path $sidecar -Force }
    return $false
  }
  Copy-Item -Path $src -Destination $sidecar -Force
  return $true
}

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
  # $targetSettings lúc này đang là bản của khung (vừa chép ở bước 1),
  # còn bản của dự án đích nằm trong $stashedSettings.
  $sidecar = Join-Path $Destination ".claude\settings.json.universalagent"
  if (Test-SameFile $stashedSettings $targetSettings) {
    if (Test-Path $sidecar) { Remove-Item -Path $sidecar -Force }
  }
  else {
    Copy-Item -Path $targetSettings -Destination $sidecar -Force
    Write-Host "  [!] Giữ nguyên .claude\settings.json sẵn có. Bản của UniversalAgent lưu tại .claude\settings.json.universalagent" -ForegroundColor Yellow
  }
  Copy-Item -Path $stashedSettings -Destination $targetSettings -Force
  Remove-Item -Path $stashedSettings -Force
}

# --- 3. Docs/: chỉ mang khung thư mục + file template ---
# Docs/ của UniversalAgent cũng là living docs của chính nó: /explain ghi vào
# Decisions\, /newsession ghi vào Handoffs\ và Done\. Chép nguyên thư mục sẽ đẩy
# tài liệu nội bộ của khung sang mọi dự án đích, nên ở đây dùng whitelist.
foreach ($d in $DocDirs) {
  $srcDocDir = Join-Path $Source "Docs\$d"
  $destDocDir = Join-Path $Destination "Docs\$d"
  New-Item -Path $destDocDir -ItemType Directory -Force | Out-Null
  if (Test-Path $srcDocDir) {
    Get-ChildItem -Path $srcDocDir -File | Where-Object { Test-DocTemplate $_.Name } | ForEach-Object {
      Copy-Item -Path $_.FullName -Destination (Join-Path $destDocDir $_.Name) -Force
    }
  }
}
Write-Host "  [+] Đã dựng khung Docs\ (chỉ file template)" -ForegroundColor Green

# Dọn tàn dư do bản installer cũ chép sang: file Docs\ của UniversalAgent không
# thuộc whitelist mà bên đích có bản TRÙNG KHÍT nội dung thì chắc chắn là bản
# chép nhầm. Nội dung đã khác = do người dùng viết -> giữ nguyên tuyệt đối.
$srcDocs = Join-Path $Source "Docs"
if (Test-Path $srcDocs) {
  Get-ChildItem -Path $srcDocs -Recurse -File | ForEach-Object {
    if (Test-DocTemplate $_.Name) { return }
    $relative = $_.FullName.Substring($Source.Length + 1)
    $leaked = Join-Path $Destination $relative
    if ((Test-Path $leaked) -and (Test-SameFile $_.FullName $leaked)) {
      Remove-Item -Path $leaked -Force
      Write-Host "  [-] Đã dọn tài liệu nội bộ của UniversalAgent: $relative" -ForegroundColor DarkGray
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
    if (Set-Sidecar $srcFile $destFile) {
      Write-Host "  [!] Giữ nguyên $file sẵn có. Bản của UniversalAgent lưu tại $file.universalagent" -ForegroundColor Yellow
    }
  }
  else {
    Copy-Item -Path $srcFile -Destination $destFile -Force
    Write-Host "  [+] Đã tạo tệp: $file" -ForegroundColor Green
  }
}

# --- 6. Khởi tạo các file entry point chính nếu chưa có ---
$Entries = @{
  "AGENTS.md" = "AGENTS_TEMPLATE.md"
  "CLAUDE.md" = "CLAUDE_TEMPLATE.md"
}
foreach ($entry in $Entries.GetEnumerator()) {
  $destFile = Join-Path $Destination $entry.Key
  $srcTemplate = Join-Path $Source $entry.Value
  if ((-not (Test-Path $destFile)) -and (Test-Path $srcTemplate)) {
    Copy-Item -Path $srcTemplate -Destination $destFile -Force
    Write-Host "  [*] Đã tạo $($entry.Key) khởi đầu từ template" -ForegroundColor Yellow
  }
}

# --- 7. Sinh cấu hình cho cả 3 nền tảng ngay trên dự án đích ---
# Không có bước này thì AGENTS.md/CLAUDE.md của dự án mới chỉ là template rỗng,
# và Antigravity/Codex sẽ chạy mà không có quy tắc nào trong ngữ cảnh.
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
Write-Host "👉 Bước tiếp theo: Mở project với AI (Antigravity IDE, Codex, Claude CLI) và gõ '/init' để AI tự động phỏng vấn và hoàn tất thiết lập tài liệu dự án!" -ForegroundColor Cyan
