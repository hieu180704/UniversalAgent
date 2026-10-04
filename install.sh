#!/usr/bin/env bash
# UniversalAgent — macOS & Linux Installer
# Wrapper mỏng: toàn bộ logic cài mới / nâng cấp nằm trong install.js.
# Dùng: ./install.sh <thư-mục-đích> [--dry-run] [--yes]
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v node >/dev/null 2>&1; then
  echo "Không tìm thấy Node.js trong PATH — hook và installer của UniversalAgent cần Node.js." >&2
  exit 1
fi

if [ $# -eq 0 ]; then
  set -- .
fi

exec node "$SOURCE_DIR/install.js" "$@"
