# [Tên Dự Án] — Agent Workspace Guidelines

[Mô tả ngắn gọn về dự án]. Dự án hỗ trợ song song cả **Codex**, **Antigravity IDE (Gemini)** và **Claude Code** thông qua kiến trúc lõi trung lập `.ai/`.

# Mục lục
1. Mục Tiêu Dự Án
2. Quy Tắc Đặc Thù Của Dự Án
3. Bản Đồ Ngữ Cảnh
4. Bản Đồ Hệ Thống AI (.ai/)

---

# 1. Mục Tiêu Dự Án

- **Tên:** [Tên dự án]
- **Target / Nền tảng:** [Môi trường chạy]
- **Mô tả:** [Mô tả chi tiết mục tiêu của dự án]

Tài liệu gốc đầy đủ: `Docs/SourceOfTruth/overview.txt`.

---

# 2. Quy Tắc Đặc Thù Của Dự Án

- Tuân thủ quy trình 4 pha bắt buộc: `explore -> propose -> confirm -> execute`.
- [Thêm các ràng buộc kiến trúc, công nghệ hoặc quy chuẩn riêng của dự án tại đây].

---

# 3. Bản Đồ Ngữ Cảnh

| Thư mục | Chứa gì |
| :--- | :--- |
| `Docs/SourceOfTruth/` | Tri thức nền, bền theo thời gian. Đọc trước khi kết luận. |
| `Docs/Decisions/` | Quyết định đã chốt kèm lý do. |
| `Docs/QC/` | Checklist nghiệm thu. |
| `Docs/Done/` | Worklog từng phiên, chỉ ghi thêm. |
| `Docs/Handoffs/` | Bàn giao giữa các phiên. |
| `Docs/prompts/` | Prompt dùng lại. |

---

# 4. Bản Đồ Hệ Thống AI (.ai/)

Toàn bộ quy tắc, kỹ năng và công cụ của agent được quản lý tập trung tại `.ai/`:

### Rules (`.ai/rules/`) — quy tắc chung; đọc theo phạm vi task
- `core-protocol.md`: Universal Core Protocol.
- `quality-standards.md`: Universal Quality Standards.
- `doc-policy.md`: Universal Living Docs Policy.
- `knowledge-graph.md`: Knowledge Graph Dispatcher.

### Skills (`.ai/skills/`) — Kỹ năng thao tác
- `/doc`, `/explain`, `/init`, `/newsession`, `/plan`, `/research`, `/system-cleanup`, `/verify`, `/worktree`, `/wrap`.

### Hooks (`.ai/hooks/`) — Cưỡng chế quy trình
- `safety-guard.js`, `read-guard.js`, `closeout-trigger.js`, `doc-budget.js`.
