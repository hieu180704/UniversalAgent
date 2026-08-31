# UniversalAgent

Khung vận hành và quy chuẩn làm việc đa nền tảng cho AI Agent. Hỗ trợ song song cả **Claude Code** và **Antigravity IDE (Gemini)** thông qua kiến trúc lõi trung lập `.ai/`.

# Mục lục
1. Mục Tiêu Dự Án
2. Quy Tắc Cốt Lõi
3. Bản Đồ Ngữ Cảnh
4. Bản Đồ Hệ Thống AI (.ai/)

---

# 1. Mục Tiêu Dự Án

- **Tên:** UniversalAgent — Universal AI Agent Operating Framework & Starter Kit
- **Mô tả:** Khung vận hành tiêu chuẩn hóa cho AI Agent (Claude Code & Gemini/Antigravity), giải quyết bài toán từ gốc rễ, bảo toàn ngữ cảnh và vận hành tài liệu sống (Living Docs).

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

Toàn bộ cấu hình và tri thức dùng chung của agent nằm trong `.ai/` (được liên kết đối xứng tới `.claude/` và `.agents/`).

### Rules (`.ai/rules/`) — auto-load mỗi phiên

| File | Chủ đề | Các mục |
| :--- | :--- | :--- |
| `core-protocol.md` | Universal Core Protocol | Triết lý Cốt lõi · Quy trình 4 Pha Bắt buộc · Tư duy Nguyên lý Gốc & Phản biện Kỹ thuật · Kỷ luật Ngữ cảnh & Tiết kiệm Token |
| `quality-standards.md` | Universal Quality Standards | Chuẩn Mực Đầu Ra · Tư Duy Lập Luận & Kiểm Chứng · Kỷ Luật Trình Bày & Định Dạng · Bảo Vệ Tính Toàn Vẹn Của Dữ Liệu |
| `doc-policy.md` | Universal Living Docs Policy | Triết Lý Tài Liệu Sống · Cấu Trúc Thư Mục Docs/ Chuẩn · Quy Định Định Dạng File .txt · Kỷ Luật Worklog Fragments |
| `knowledge-graph.md` | Knowledge Graph Dispatcher (Node-0) | Nguyên Tắc Điều Hướng 3 Tầng · Phân Vùng Đang Hoạt Động · Hợp Đồng Viết KG Leaf · Pointer Contract · Quy Trình Mở Rộng · Danh Mục Phân Vùng Gợi Ý |

### Recipes (`.ai/recipes/`) — mẫu cấu trúc đầu ra

Không auto-load. Slash command tự trỏ tới khi cần, đường dẫn `.ai/recipes/`.

| File | Mẫu |
| :--- | :--- |
| `recipe-analysis.md` | Bóc Tách & Phân Tích Vấn Đề (Root-Cause Analysis) |
| `recipe-decision-memo.md` | Bản Giải Trình Quyết Định 7 Phần (Decision Memo) |
| `recipe-deliverable.md` | Soạn Thảo Văn Bản & Sản Phẩm Hoàn Chỉnh (Deliverable) |
| `recipe-plan.md` | Lập Kế Hoạch & Lộ Trình (Action Plan) |
| `recipe-review-qc.md` | Thẩm Định Chất Lượng & Kiểm Lỗi Logic (Review & QC) |
| `recipe-synthesis.md` | Tổng Hợp Nghiên Cứu & Đối Chiếu Đa Nguồn (Research Synthesis) |

### Hooks (`.ai/hooks/`) — khai báo trong `.claude/settings.json` và `.agents/hooks.json`

| File | Vai trò |
| :--- | :--- |
| `closeout-trigger.js` | Nhắc cập nhật Living Docs trước khi commit |
| `doc-budget.js` | Cưỡng chế hạn mức độ dài doc + kiểm registry hook (`doc-policy.md` mục 5) |
| `read-guard.js` | Cảnh báo khi Read file nhị phân/media tốn token |
| `safety-guard.js` | Chặn đọc/ghi file nhạy cảm (`.env`, khoá riêng, `secrets/`) |

### Skills / Commands (`.ai/skills/`) — chuẩn Agent Skills

| Lệnh | Mô tả |
| :--- | :--- |
| `/doc` | Đồng bộ tài liệu sống trong Docs/SourceOfTruth/ với thực tế mới nhất của không gian làm việc. |
| `/explain` | Tổng hợp vấn đề phức tạp thành bản Decision Memo 7 phần chuẩn mực để chốt giải pháp. |
| `/init` | Khởi tạo và thiết lập dự án mới: phỏng vấn bối cảnh, điền AGENTS.md/CLAUDE.md và tạo tài liệu SourceOfTruth. |
| `/newsession` | Đóng phiên làm việc gọn khi task chưa xong, tạo fragment Docs/Done/ và sinh prompt làm tiếp. |
| `/plan` | Phân rã mục tiêu lớn thành kế hoạch hành động từng bước (WBS, Milestones, DoD). |
| `/research` | Nghiên cứu chuyên sâu đa chiều một chủ đề phức tạp, tổng hợp dữ liệu và lập ma trận so sánh. |
| `/system-cleanup` | Rà soát và dọn dẹp các tệp tin rác, bản nháp trùng lặp hoặc dữ liệu thừa trong workspace. |
| `/verify` | Thẩm định chất lượng, rà soát mâu thuẫn logic, bối cảnh hoặc kiểm tra checklist nghiệm thu. |
| `/worktree` | Tạo và quản lý Git Worktree độc lập để thử nghiệm ý tưởng hoặc xử lý nhánh song song. |
| `/wrap` | Đóng gói hoàn tất một Task/Milestone lớn: sync doc, archive handoff DONE, commit narrow và retrospective đúc kết. |
