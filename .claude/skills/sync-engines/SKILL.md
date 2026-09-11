---
name: sync-engines
description: Đồng bộ tri thức (Rules, Recipes, Skills, Subagents) giữa 3 AI Engine (Antigravity, Claude Code, Codex) theo đúng cú pháp đặc thù của từng engine. Dùng khi thêm/sửa rules, skills, recipes, agents hoặc user gõ "/sync-engines", "đồng bộ engine", "sync ai".
---

# Kỹ Năng /sync-engines — Đồng Bộ Tri Thức 3 AI Engine

Hệ thống điều phối và chuyển đổi cú pháp tự động giữa 3 AI Engine trong dự án:
- **Antigravity IDE** (`.agents/`)
- **Claude Code** (`.claude/`)
- **Codex CLI** (`.codex/`)

Đảm bảo bất kỳ thay đổi nào về tri thức (Rules, Recipes, Skills, Subagents) ở một engine đều được chuyển đổi và cập nhật chuẩn xác sang 2 engine còn lại mà không làm vỡ cú pháp riêng của từng bên.

---

## 1. Ma Trận Chuyển Đổi

| Loại tài nguyên | Nguồn $\rightarrow$ Đích | Quy tắc xử lý của `sync-engines.js` |
| :--- | :--- | :--- |
| **Rules (`rules/`)** | Cả 3 engine | **Giữ nguyên 100% thân file (Body).**<br>- **Claude**: YAML Frontmatter `description:` + `paths:` (list).<br>- **Antigravity**: YAML Frontmatter `trigger: glob` + `globs:` (chuỗi 1 dòng, dấu phẩy) hoặc `trigger: always_on`.<br>- **Codex**: Lột bỏ 100% Frontmatter. |
| **Recipes (`recipes/`)** | Cả 3 engine | **Copy 1-1** nguyên vẹn giữa `.agents/recipes/`, `.claude/recipes/`, `.codex/recipes/`. |
| **Skills (`skills/`)** | Cả 3 engine | **Đồng bộ 1-1** cả thư mục giữa `.agents/skills/` và `.claude/skills/`. (Codex tự động đọc chung `.agents/skills/`). |
| **Subagents (`agents/`)** | Cả 3 engine | **Giữ nguyên prompt instructions.**<br>- **Claude $\leftrightarrow$ Antigravity**: Map model tier (`opus`/`sonnet` $\leftrightarrow$ `pro`/`flash`).<br>- **Codex**: Chuyển đổi thành định dạng `.toml` với trường `developer_instructions`. |
| **Hooks (`hooks/`)** | Tuỳ chọn (`--hooks`) | Đồng bộ các file logic JS dùng chung, tự đổi chuỗi namespace `.agents/` $\leftrightarrow$ `.claude/` $\leftrightarrow$ `.codex/`. **Cấm đụng `hook-adapter.js` và file config JSON.** |

---

## 2. Quy Trình Thực Thi Cho Agent

Khi người dùng yêu cầu đồng bộ, hoặc khi bạn vừa tạo/sửa Rules/Recipes/Skills/Agents:

### Bước 1: Xác định Engine Hiện Tại
- Nếu đang chạy dưới **Antigravity CLI**: Engine nguồn là `agents`.
- Nếu đang chạy dưới **Claude Code**: Engine nguồn là `claude`.
- Nếu đang chạy dưới **Codex CLI**: Engine nguồn là `codex`.

### Bước 2: Chạy Script Đồng Bộ
Chạy lệnh trong terminal (thay thế `--source` phù hợp):

```bash
# Đồng bộ bình thường (Rules, Recipes, Skills, Subagents)
node .agents/skills/sync-engines/scripts/sync-engines.js --source agents

# Nếu có chỉnh sửa logic Hooks dùng chung:
node .agents/skills/sync-engines/scripts/sync-engines.js --source agents --hooks

# Kiểm tra trước (Dry-run):
node .agents/skills/sync-engines/scripts/sync-engines.js --source agents --dry-run
```

*(Lưu ý: Nếu đang ở Claude Code, đường dẫn script có thể gọi qua `.claude/skills/sync-engines/scripts/sync-engines.js`)*.

### Bước 3: Báo Cáo
Tóm tắt ngắn gọn cho người dùng:
- Số file Rules/Recipes/Skills/Agents đã đồng bộ.
