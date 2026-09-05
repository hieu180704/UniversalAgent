#!/usr/bin/env bash
# UniversalAgent — macOS & Linux Installer
TARGET_DIR="${1:-.}"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Đang cài đặt UniversalAgent vào: $TARGET_DIR"

mkdir -p "$TARGET_DIR"

FOLDERS=(".ai" ".agents" ".claude" ".codex" "Docs")
for f in "${FOLDERS[@]}"; do
  if [ -d "$SOURCE_DIR/$f" ]; then
    cp -R "$SOURCE_DIR/$f" "$TARGET_DIR/"
    echo "  [+] Đã sao chép thư mục: $f"
  fi
done

FILES=("AGENTS_TEMPLATE.md" "CLAUDE_TEMPLATE.md" ".editorconfig" ".gitignore" ".gitattributes")
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

# Setup symlinks on Unix
mkdir -p "$TARGET_DIR/.claude" "$TARGET_DIR/.agents"
ln -sf "../.ai/rules" "$TARGET_DIR/.claude/rules" 2>/dev/null || true
ln -sf "../.ai/skills" "$TARGET_DIR/.claude/skills" 2>/dev/null || true
ln -sf "../.ai/recipes" "$TARGET_DIR/.claude/recipes" 2>/dev/null || true
ln -sf "../.ai/hooks" "$TARGET_DIR/.claude/hooks" 2>/dev/null || true
ln -sf "../.ai/rules" "$TARGET_DIR/.agents/rules" 2>/dev/null || true
ln -sf "../.ai/skills" "$TARGET_DIR/.agents/skills" 2>/dev/null || true
ln -sf "../.ai/recipes" "$TARGET_DIR/.agents/recipes" 2>/dev/null || true
ln -sf "../.ai/hooks" "$TARGET_DIR/.agents/hooks" 2>/dev/null || true

echo "🎉 Cài đặt UniversalAgent thành công!"
echo "👉 Bước tiếp theo: Mở project với Antigravity (Gemini) hoặc Claude Code và gõ '/init' để AI tự động phỏng vấn và hoàn tất thiết lập!"
