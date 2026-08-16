#!/usr/bin/env bash
# UniversalAgent — macOS & Linux Installer
TARGET_DIR="${1:-.}"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Đang cài đặt UniversalAgent vào: $TARGET_DIR"

mkdir -p "$TARGET_DIR"

FOLDERS=(".agents" ".claude" ".openai" "Docs" "scripts")
for f in "${FOLDERS[@]}"; do
  if [ -d "$SOURCE_DIR/$f" ]; then
    cp -R "$SOURCE_DIR/$f" "$TARGET_DIR/"
    echo "  [+] Đã chép thư mục: $f"
  fi
done

FILES=("AGENTS_TEMPLATE.md" "CLAUDE_TEMPLATE.md" "CHATGPT_TEMPLATE.md" ".cursorrules" ".editorconfig" ".gitignore" ".gitattributes")
for file in "${FILES[@]}"; do
  if [ -f "$SOURCE_DIR/$file" ]; then
    cp "$SOURCE_DIR/$file" "$TARGET_DIR/"
    echo "  [+] Đã chép tệp: $file"
  fi
done

if [ ! -f "$TARGET_DIR/AGENTS.md" ]; then
  cp "$SOURCE_DIR/AGENTS_TEMPLATE.md" "$TARGET_DIR/AGENTS.md"
  echo "  [*] Đã tạo AGENTS.md khởi đầu từ template"
fi

echo "🎉 Cài đặt UniversalAgent thành công!"
