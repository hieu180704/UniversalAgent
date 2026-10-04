# [TÊN DỰ ÁN] — Agent Workspace Guidelines

[Mô tả ngắn gọn về dự án]. Dự án hỗ trợ song song 3 engine AI độc lập: **Antigravity IDE (Gemini)** (`.agents/`), **Claude Code** (`.claude/`), **Codex CLI** (`.codex/`) — mỗi engine giữ bản rule/hook/skill/agent riêng, không phụ thuộc lõi trung lập hay symlinks.

# Mục lục
1. Mục Tiêu Dự Án
2. Quy Tắc Cốt Lõi
3. Bản Đồ Ngữ Cảnh (Docs/)
4. Phân Vùng Tri Thức (Knowledge Graph)
5. Bản Đồ Hệ Thống AI (.claude/ · .agents/ · .codex/)

---

# 1. Mục Tiêu Dự Án

- **Tên:** [Tên dự án]
- **Mô tả:** [Mô tả chi tiết mục tiêu, kiến trúc và phạm vi của dự án].

Tài liệu gốc đầy đủ: `Docs/SourceOfTruth/overview.txt`.

---

# 2. Quy Tắc Cốt Lõi

- Tuân thủ quy trình 4 pha bắt buộc: `explore -> propose -> confirm -> execute`. Dừng lại sau pha Propose, đợi xác nhận trước khi Execute.
- **Root-Cause & First-Principles:** Sửa tận gốc vấn đề, không vá tạm triệu chứng, không đoán mò khi chưa đọc dữ liệu thực tế.
- **Living Docs Engine:** Tài liệu trong `Docs/` là nguồn chân lý duy nhất (Single Source of Truth), luôn cập nhật đồng hành cùng thực tế.
- **Tiết kiệm token:** Targeted reads (chỉ đọc file/dòng liên quan), không scan repo tràn lan. Trả lời súc tích, hoàn chỉnh 100%.

---

# 3. Bản Đồ Ngữ Cảnh (Docs/)

| Thư mục | Vai trò | Quy tắc sửa đổi |
| :--- | :--- | :--- |
| `Docs/SourceOfTruth/` | Tri thức nền, kiến trúc hệ thống | Living (Cập nhật song hành cùng code) |
| `Docs/Decisions/` | Quyết định đã chốt kèm lý do (ADR) | Immutable (Bất biến sau khi chốt) |
| `Docs/QC/` | Tiêu chí nghiệm thu & checklist kiểm thử | Living (Định nghĩa bài test) |
| `Docs/Done/` | Worklog từng phiên | Frozen (Append-only) |
| `Docs/Handoffs/` | Bàn giao giữa các phiên làm việc | Frozen (Append-only) |
| `Docs/prompts/` | Mẫu prompt và kịch bản tái sử dụng | Living |

---

# 4. Phân Vùng Tri Thức (Knowledge Graph)

Bảng định tuyến của `knowledge-graph.md` (mục 2). Chỉ liệt kê phân vùng **đã thực sự tồn tại trên đĩa**; thêm dòng theo quy trình mục 5 của rule đó.

| Phân vùng | KG Leaf | Deep Doc | Nội dung |
| :--- | :--- | :--- | :--- |
| *(chưa có)* | *(chưa có)* | *(chưa có)* | *(chưa có phân vùng)* |

---

# 5. Bản Đồ Hệ Thống AI (.claude/ · .agents/ · .codex/)

Ba engine vận hành độc lập, mỗi engine giữ bản rule/recipe/skill/agent/hook riêng. Cả ba cùng đọc file `AGENTS.md` này làm entry point duy nhất.

| Thành phần | Claude Code | Antigravity (Gemini) | Codex CLI |
| :--- | :--- | :--- | :--- |
| Rules | `.claude/rules/` — frontmatter `paths:` để lazy-load | `.agents/rules/` — `trigger: always_on` hoặc `trigger: glob` + `globs:` | `.codex/rules/` — Markdown thuần, không frontmatter |
| Recipes | `.claude/recipes/` | `.agents/recipes/` | `.codex/recipes/` |
| Skills | `.claude/skills/` | `.agents/skills/` | `.agents/skills/` (dùng chung với Antigravity) |
| Subagents | `.claude/agents/` | `.agents/agents/` | `.codex/agents/` (TOML) |
| Hooks | `.claude/hooks/`, khai trong `.claude/settings.json` | `.agents/hooks/`, khai trong `.agents/hooks.json` | `.codex/hooks/`, khai trong `.codex/hooks.json` |

### Rules
- Always-on: `core-protocol.md`, `quality-standards.md`, `doc-policy.md`, `knowledge-graph.md` (Node-0 Dispatcher).
- Rule theo ngữ cảnh: khai báo frontmatter đúng cú pháp của từng engine (xem bảng trên).

### Recipes — Mẫu cấu trúc đầu ra
- `00-recipe-index.md`, `recipe-analysis.md`, `recipe-decision-memo.md`, `recipe-deliverable.md`, `recipe-plan.md`, `recipe-review-qc.md`, `recipe-synthesis.md`.

### Skills
- `/init`: Khởi tạo và phỏng vấn dự án mới.
- `/newsession`: Chốt nhanh phiên làm việc tạm thời.
- `/wrap`: Đóng gói hoàn tất milestone / task lớn.
- `/sync-engines`: Đồng bộ tri thức giữa 3 AI Engine.

### Đồng Bộ Đa Engine (`/sync-engines`)
- Khi tạo hoặc sửa Rules, Recipes, Skills, Subagents ở bất kỳ engine nào, chạy `/sync-engines` với `--source` là engine vừa sửa (`claude` | `agents` | `codex`) để tự động chuyển đổi cú pháp (Frontmatter, TOML, model tier) và cập nhật sang các engine còn lại.
- Ví dụ: `node .claude/skills/sync-engines/scripts/sync-engines.js --source claude` hoặc `node .agents/skills/sync-engines/scripts/sync-engines.js --source agents`.

### Subagents
- Cung cấp 6 vai trò chuyên biệt: `adversary`, `code-analyzer`, `code-reviewer`, `code-writer`, `convention-enforcer`, `research-expert`.

### Hooks
- `safety-guard.js`: Chặn đọc/ghi file nhạy cảm (`.env`, secrets).
- `read-guard.js`: Cảnh báo nạp file nhị phân/media lớn.
- `closeout-trigger.js`: Nhắc cập nhật Living Docs trước khi commit Git và cảnh báo `/sync-engines`.
- `doc-budget.js`: Kiểm soát ngân sách độ dài tài liệu và kiểm tra khai báo hook registry.
- `language-guard.js`: Đảm bảo văn xuôi trong tài liệu viết bằng tiếng Việt có dấu (≥90%).
