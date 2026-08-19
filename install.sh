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
# Docs/ CỐ Ý không nằm ở đây: nó là living docs của chính UniversalAgent, xử lý riêng ở bước 3.
FOLDERS=(".agents" ".claude" "scripts")
# File template khung — luôn cập nhật.
FRAMEWORK_FILES=("AGENTS_TEMPLATE.md" "CLAUDE_TEMPLATE.md")
# File thuộc quyền dự án đích — KHÔNG bao giờ ghi đè.
PROJECT_FILES=(".editorconfig" ".gitignore" ".gitattributes")
# Khung thư mục Docs/ chuẩn (khớp .agents/rules/doc-policy.md mục 2).
DOC_DIRS=("SourceOfTruth" "Decisions" "Handoffs" "QC" "Done" "prompts")

# File trong Docs/ được phép đi theo installer: chỉ template và README.
is_doc_template() {
  case "$(basename "$1")" in
    *-template.txt|README.txt) return 0 ;;
    *) return 1 ;;
  esac
}

# Đặt bản của khung cạnh file sẵn có của dự án, dưới tên <file>.universalagent.
# Chỉ làm khi nội dung THẬT SỰ khác nhau — giống nhau thì sidecar chỉ là rác
# (đúng trường hợp cài lại lần 2 lên chính file do lần cài đầu tạo ra), và
# sidecar cũ còn sót cũng được dọn luôn.
place_sidecar() {
  if cmp -s "$1" "$2"; then
    rm -f "$2.universalagent"
    return 1
  fi
  cp "$1" "$2.universalagent"
  return 0
}

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
  # $DEST/.claude/settings.json lúc này đang là bản của khung (vừa chép ở bước 1),
  # còn bản của dự án đích nằm trong $STASHED_SETTINGS.
  if cmp -s "$STASHED_SETTINGS" "$DEST/.claude/settings.json"; then
    rm -f "$DEST/.claude/settings.json.universalagent"
  else
    cp "$DEST/.claude/settings.json" "$DEST/.claude/settings.json.universalagent"
    echo "  [!] Giữ nguyên .claude/settings.json sẵn có. Bản của UniversalAgent lưu tại .claude/settings.json.universalagent"
  fi
  cp "$STASHED_SETTINGS" "$DEST/.claude/settings.json"
  rm -f "$STASHED_SETTINGS"
fi

# --- 3. Docs/: chỉ mang khung thư mục + file template ---
# Docs/ của UniversalAgent cũng là living docs của chính nó: /explain ghi vào
# Decisions/, /newsession ghi vào Handoffs/ và Done/. Chép nguyên thư mục sẽ đẩy
# tài liệu nội bộ của khung sang mọi dự án đích, nên ở đây dùng whitelist.
for d in "${DOC_DIRS[@]}"; do
  mkdir -p "$DEST/Docs/$d"
  for src_file in "$SOURCE_DIR/Docs/$d"/*; do
    if [ -f "$src_file" ] && is_doc_template "$src_file"; then
      cp "$src_file" "$DEST/Docs/$d/$(basename "$src_file")"
    fi
  done
done
echo "  [+] Đã dựng khung Docs/ (chỉ file template)"

# Dọn tàn dư do bản installer cũ chép sang: file Docs/ của UniversalAgent không
# thuộc whitelist mà bên đích có bản TRÙNG KHÍT nội dung thì chắc chắn là bản
# chép nhầm. Nội dung đã khác = do người dùng viết -> giữ nguyên tuyệt đối.
if [ -d "$SOURCE_DIR/Docs" ]; then
  while IFS= read -r src_file; do
    if is_doc_template "$src_file"; then continue; fi
    relative="${src_file#"$SOURCE_DIR"/}"
    if [ -f "$DEST/$relative" ] && cmp -s "$src_file" "$DEST/$relative"; then
      rm -f "$DEST/$relative"
      echo "  [-] Đã dọn tài liệu nội bộ của UniversalAgent: $relative"
    fi
  done < <(find "$SOURCE_DIR/Docs" -type f)
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
      if place_sidecar "$SOURCE_DIR/$file" "$DEST/$file"; then
        echo "  [!] Giữ nguyên $file sẵn có. Bản của UniversalAgent lưu tại $file.universalagent"
      fi
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

# --- 7. Sinh cấu hình cho cả 3 nền tảng ngay trên dự án đích ---
# Không có bước này thì AGENTS.md/CLAUDE.md của dự án mới chỉ là template rỗng,
# và Antigravity/Codex sẽ chạy mà không có quy tắc nào trong ngữ cảnh.
if [ -f "$DEST/scripts/sync-agents.js" ]; then
  if command -v node >/dev/null 2>&1; then
    if (cd "$DEST" && node scripts/sync-agents.js >/dev/null); then
      echo "  [+] Đã sinh cấu hình đa nền tảng cho dự án đích"
    else
      echo "  [!] Bộ sinh cấu hình báo lỗi. Hãy chạy tay: node scripts/sync-agents.js"
    fi
  else
    echo "  [!] Không tìm thấy Node.js. Hãy cài Node rồi chạy: node scripts/sync-agents.js"
  fi
fi

echo "🎉 Cài đặt UniversalAgent thành công!"
echo "👉 Bước tiếp theo: Mở project với AI (Antigravity IDE, Codex, Claude CLI) và gõ '/init' để AI tự động phỏng vấn và hoàn tất thiết lập tài liệu dự án!"
