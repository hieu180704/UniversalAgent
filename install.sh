#!/usr/bin/env bash
# UniversalAgent — macOS & Linux Installer
set -eu

TARGET_DIR="${1:-.}"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "$TARGET_DIR"
DEST="$(cd "$TARGET_DIR" && pwd)"

if [ "$DEST" = "$SOURCE_DIR" ]; then
  echo "[!] Thư mục đích trùng với thư mục nguồn UniversalAgent. Đang hủy để tránh tự ghi đè."
  exit 1
fi

echo "🚀 Đang cài đặt UniversalAgent vào: $DEST"

# Thư mục khung do UniversalAgent sở hữu — luôn cập nhật.
FOLDERS=(".agents" ".claude" ".openai" "Docs" "scripts")
# File template khung — luôn cập nhật.
FRAMEWORK_FILES=("AGENTS_TEMPLATE.md" "CLAUDE_TEMPLATE.md" "CHATGPT_TEMPLATE.md")
# File thuộc quyền dự án đích — KHÔNG bao giờ ghi đè.
PROJECT_FILES=(".cursorrules" ".editorconfig" ".gitignore" ".gitattributes")

# --- Giữ lại .claude/settings.json sẵn có của dự án đích ---
STASHED_SETTINGS=""
if [ -f "$DEST/.claude/settings.json" ]; then
  STASHED_SETTINGS="$(mktemp)"
  cp "$DEST/.claude/settings.json" "$STASHED_SETTINGS"
fi

# --- 1. Chép thư mục theo kiểu merge (chạy lại nhiều lần vẫn đúng) ---
for f in "${FOLDERS[@]}"; do
  if [ -d "$SOURCE_DIR/$f" ]; then
    mkdir -p "$DEST/$f"
    # Chép nội dung bên trong (src/.) chứ KHÔNG chép chính thư mục,
    # nếu không lần chạy thứ 2 sẽ tạo ra cấu trúc lồng nhau kiểu .agents/.agents.
    cp -R "$SOURCE_DIR/$f/." "$DEST/$f/"
    echo "  [+] Đã đồng bộ thư mục: $f"
  fi
done

# --- 2. Trả lại settings.json của dự án đích, bản khung để cạnh làm tham chiếu ---
if [ -n "$STASHED_SETTINGS" ]; then
  cp "$DEST/.claude/settings.json" "$DEST/.claude/settings.json.universalagent"
  cp "$STASHED_SETTINGS" "$DEST/.claude/settings.json"
  rm -f "$STASHED_SETTINGS"
  echo "  [!] Giữ nguyên .claude/settings.json sẵn có. Bản của UniversalAgent lưu tại .claude/settings.json.universalagent"
fi

# --- 3. Không mang worklog riêng của UniversalAgent sang dự án đích ---
if [ -d "$SOURCE_DIR/Docs/Done" ]; then
  for src_file in "$SOURCE_DIR"/Docs/Done/*; do
    if [ -f "$src_file" ]; then
      name="$(basename "$src_file")"
      if [ "$name" != "fragment-template.txt" ] && [ -f "$DEST/Docs/Done/$name" ]; then
        rm -f "$DEST/Docs/Done/$name"
        echo "  [-] Đã loại worklog riêng của UniversalAgent: Docs/Done/$name"
      fi
    fi
  done
fi

# --- 4. File template khung ---
for file in "${FRAMEWORK_FILES[@]}"; do
  if [ -f "$SOURCE_DIR/$file" ]; then
    cp "$SOURCE_DIR/$file" "$DEST/$file"
    echo "  [+] Đã đồng bộ tệp: $file"
  fi
done

# --- 5. File thuộc quyền dự án đích: chỉ tạo khi chưa có ---
for file in "${PROJECT_FILES[@]}"; do
  if [ -f "$SOURCE_DIR/$file" ]; then
    if [ -e "$DEST/$file" ]; then
      cp "$SOURCE_DIR/$file" "$DEST/$file.universalagent"
      echo "  [!] Giữ nguyên $file sẵn có. Bản của UniversalAgent lưu tại $file.universalagent"
    else
      cp "$SOURCE_DIR/$file" "$DEST/$file"
      echo "  [+] Đã tạo tệp: $file"
    fi
  fi
done

# --- 6. Khởi tạo các file entry point chính nếu chưa có ---
seed_entry() {
  entry="$1"
  template="$2"
  if [ ! -e "$DEST/$entry" ] && [ -f "$SOURCE_DIR/$template" ]; then
    cp "$SOURCE_DIR/$template" "$DEST/$entry"
    echo "  [*] Đã tạo $entry khởi đầu từ template"
  fi
}
seed_entry "AGENTS.md" "AGENTS_TEMPLATE.md"
seed_entry "CLAUDE.md" "CLAUDE_TEMPLATE.md"
seed_entry "CHATGPT.md" "CHATGPT_TEMPLATE.md"

echo "🎉 Cài đặt UniversalAgent thành công!"
echo "👉 Bước tiếp theo: Mở project với AI (Gemini, Claude Code, ChatGPT) và gõ '/init' để AI tự động phỏng vấn và hoàn tất thiết lập tài liệu dự án!"
