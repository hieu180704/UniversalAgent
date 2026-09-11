# UniversalAgent — Agent Workspace Guidelines

Khung vận hành và quy chuẩn làm việc đa nền tảng cho AI Agent. Hỗ trợ song song 3 engine AI độc lập: **Antigravity IDE (Gemini)** (`.agents/`), **Claude Code** (`.claude/`), **Codex CLI** (`.codex/`) — mỗi engine giữ bản rule/hook/skill/agent riêng, không phụ thuộc lõi trung lập hay symlinks.

# Mục lục
1. Mục Tiêu Dự Án
2. Quy Tắc Cốt Lõi
3. Bản Đồ Ngữ Cảnh (Docs/)
4. Bản Đồ Hệ Thống AI (.agents/ & .codex/)

---

# 1. Mục Tiêu Dự Án

- **Tên:** UniversalAgent — Universal AI Agent Operating Framework & Starter Kit.
- **Mô tả:** Khung vận hành tiêu chuẩn hóa cho AI Agent (Gemini/Antigravity, Claude Code & Codex), giải quyết bài toán từ gốc rễ, bảo toàn ngữ cảnh và vận hành tài liệu sống (Living Docs).

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

# 4. Bản Đồ Hệ Thống AI (.agents/ & .codex/)

Hệ thống vận hành 3 engine độc lập, phân tách rõ ràng:

### Rules
- **Antigravity (`.agents/rules/`):** Khai báo frontmatter `trigger: always_on` cho rule mặc định hoặc `trigger: glob`, `globs: ...` cho rule theo ngữ cảnh.
- **Codex (`.codex/rules/`):** Markdown thuần không frontmatter. Đọc theo điều hướng khi đụng domain tương ứng.
- **Quy chuẩn:** `core-protocol.md`, `quality-standards.md`, `doc-policy.md`, `knowledge-graph.md` (Node-0 Dispatcher).

### Recipes (`.agents/recipes/` & `.codex/recipes/`)
- Mẫu cấu trúc đầu ra: `00-recipe-index.md`, `recipe-analysis.md`, `recipe-decision-memo.md`, `recipe-deliverable.md`, `recipe-plan.md`, `recipe-review-qc.md`, `recipe-synthesis.md`.

### Skills (`.agents/skills/`)
- Antigravity và Codex dùng chung thư mục `.agents/skills/`:
  - `/init`: Khởi tạo và phỏng vấn dự án mới.
  - `/newsession`: Chốt nhanh phiên làm việc tạm thời.
  - `/wrap`: Đóng gói hoàn tất milestone / task lớn.
  - `/sync-engines`: Đồng bộ tri thức giữa 3 AI Engine.

### Đồng Bộ Đa Engine (`/sync-engines`)
- Khi tạo hoặc sửa Rules, Recipes, Skills, Subagents ở bất kỳ engine nào, chạy `/sync-engines` (`node .agents/skills/sync-engines/scripts/sync-engines.js --source agents`) để tự động chuyển đổi chuẩn hóa cú pháp (Frontmatter, TOML, model tier) và cập nhật sang các engine còn lại.

### Subagents (`.agents/agents/` & `.codex/agents/`)
- Cung cấp 6 vai trò chuyên biệt: `adversary`, `code-analyzer`, `code-reviewer`, `code-writer`, `convention-enforcer`, `research-expert`.

### Hooks (`.agents/hooks/` & `.codex/hooks/`)
- Cưỡng chế quy trình và bảo vệ an toàn:
  - `safety-guard.js`: Chặn đọc/ghi file nhạy cảm (`.env`, secrets).
  - `read-guard.js`: Cảnh báo nạp file nhị phân/media lớn.
  - `closeout-trigger.js`: Nhắc cập nhật Living Docs trước khi commit Git và cảnh báo `/sync-engines`.
  - `doc-budget.js`: Kiểm soát ngân sách độ dài tài liệu và kiểm tra khai báo hook registry.
  - `language-guard.js`: Đảm bảo văn xuôi trong tài liệu viết bằng tiếng Việt có dấu (≥90%).
