# UniversalAgent — Agent Workspace Guidelines

Khung vận hành và quy chuẩn làm việc đa nền tảng cho AI Agent. Hỗ trợ song song cả **Antigravity IDE (Gemini)** và **Claude Code** thông qua kiến trúc lõi trung lập `.ai/`.

# Mục lục
1. Mục Tiêu Dự Án
2. Quy Tắc Cốt Lõi
3. Bản Đồ Ngữ Cảnh
4. Bản Đồ Hệ Thống AI (.ai/)

---

# 1. Mục Tiêu Dự Án

- **Tên:** UniversalAgent — Universal AI Agent Operating Framework & Starter Kit.
- **Mô tả:** Khung vận hành tiêu chuẩn hóa cho AI Agent (Gemini/Antigravity & Claude Code), giải quyết bài toán từ gốc rễ, bảo toàn ngữ cảnh và vận hành tài liệu sống (Living Docs).

Tài liệu gốc đầy đủ: `Docs/SourceOfTruth/overview.txt`.

---

# 2. Quy Tắc Cốt Lõi

- Tuân thủ quy trình 4 pha bắt buộc: `explore -> propose -> confirm -> execute`.
- **Root-Cause & First-Principles:** Sửa tận gốc vấn đề, không vá tạm triệu chứng, không đoán mò khi chưa đọc dữ liệu thực tế.
- **Living Docs Engine:** Tài liệu trong `Docs/` là nguồn chân lý duy nhất (Single Source of Truth), luôn cập nhật đồng hành cùng thực tế.
- **Tiết kiệm token:** Targeted reads (chỉ đọc file/dòng liên quan), không scan repo tràn lan. Trả lời súc tích, hoàn chỉnh 100%.

---

# 3. Bản Đồ Ngữ Cảnh

| Thư mục | Chứa gì |
| :--- | :--- |
| `Docs/SourceOfTruth/` | Tri thức nền, bền theo thời gian. Đọc trước khi kết luận. |
| `Docs/Decisions/` | Quyết định đã chốt kèm lý do (Decision Memos / ADR). |
| `Docs/QC/` | Tiêu chí nghiệm thu & checklist kiểm thử. |
| `Docs/Done/` | Worklog từng phiên, chỉ ghi thêm (Append-only). |
| `Docs/Handoffs/` | Bàn giao giữa các phiên làm việc. |
| `Docs/prompts/` | Prompt và kịch bản tái sử dụng. |

---

# 4. Bản Đồ Hệ Thống AI (.ai/)

Toàn bộ quy tắc, kỹ năng và công cụ của agent được quản lý tập trung tại `.ai/`:

### Rules (`.ai/rules/`) — Tự động nạp
- `core-protocol.md`: Universal Core Protocol (Quy trình 4 pha, Nguyên lý gốc, Kỷ luật token).
- `quality-standards.md`: Universal Quality Standards (Chuẩn mực đầu ra, Kiểm chứng logic).
- `doc-policy.md`: Universal Living Docs Policy (Cấu trúc Docs, Định dạng .txt, Worklogs).
- `knowledge-graph.md`: Knowledge Graph Dispatcher (Điều hướng tri thức 3 tầng).

### Skills (`.ai/skills/`) — Kỹ năng thao tác
- `/doc`, `/explain`, `/init`, `/newsession`, `/plan`, `/research`, `/system-cleanup`, `/verify`, `/worktree`, `/wrap`.

### Hooks (`.ai/hooks/`) — Cưỡng chế quy trình
- `safety-guard.js`: Chặn đọc/ghi file nhạy cảm (`.env`, private keys).
- `read-guard.js`: Cảnh báo đọc file nhị phân/media lớn.
- `closeout-trigger.js`: Nhắc cập nhật Living Docs trước khi commit.
- `doc-budget.js`: Kiểm soát ngân sách độ dài tài liệu và registry hook.
