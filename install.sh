#!/usr/bin/env bash
# UniversalAgent — macOS & Linux Installer
TARGET_DIR="${1:-.}"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Đang cài đặt UniversalAgent vào: $TARGET_DIR"

mkdir -p "$TARGET_DIR"

FOLDERS=(".agents" ".claude" ".codex" "Docs")
for f in "${FOLDERS[@]}"; do
  if [ -d "$SOURCE_DIR/$f" ]; then
    cp -R "$SOURCE_DIR/$f" "$TARGET_DIR/"
    echo "  [+] Đã sao chép thư mục: $f"
  fi
done

FILES=(".editorconfig" ".gitignore" ".gitattributes")
for file in "${FILES[@]}"; do
  if [ -f "$SOURCE_DIR/$file" ]; then
    cp "$SOURCE_DIR/$file" "$TARGET_DIR/"
    echo "  [+] Đã sao chép tệp: $file"
  fi
done

if [ ! -f "$TARGET_DIR/AGENTS.md" ]; then
  cp "$SOURCE_DIR/AGENTS_TEMPLATE.md" "$TARGET_DIR/AGENTS.md"
  echo "  [*] Đã tạo AGENTS.md khởi đầu từ template"
fi

if [ ! -f "$TARGET_DIR/CLAUDE.md" ]; then
  cp "$SOURCE_DIR/CLAUDE_TEMPLATE.md" "$TARGET_DIR/CLAUDE.md"
  echo "  [*] Đã tạo CLAUDE.md khởi đầu từ template"
fi

echo "🎉 Cài đặt UniversalAgent thành công!"
echo "👉 Bước tiếp theo: Mở project với Antigravity (Gemini), Claude Code hoặc Codex và gõ '/init' để AI tự động phỏng vấn và hoàn tất thiết lập!"
