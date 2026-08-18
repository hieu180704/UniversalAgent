# UniversalAgent — Claude Code Universal Guide

# Mục lục
1. [Tổng Quan & Triết Lý](#1-tổng-quan--triết-lý)
2. [Quy Trình 4 Pha](#2-quy-trình-4-pha)
3. [Cấu Trúc Thư Mục](#3-cấu-trúc-thư-mục)
4. [Bản Đồ Rules, Recipes, Hooks & Skills](#4-bản-đồ-rules-recipes-hooks--skills)

---

# 1. Tổng Quan & Triết Lý
Bộ khung AI Agent phổ quát cho Claude Code:
- **Tiêu chuẩn:** *Correct, minimal, verifiable*.
- **Root-Cause:** Giải quyết tận gốc, trung thực, phản biện kỹ thuật khi thấy rủi ro.
- **Living Docs:** Luôn đồng bộ tài liệu sống tại `Docs/`.

Quy tắc chi tiết nằm ở `.claude/rules/` và được Claude Code nạp tự động — không cần đọc lại thủ công.

---

# 2. Quy Trình 4 Pha
`explore -> propose -> confirm -> execute`
Dừng lại ở pha Propose để đợi xác nhận trước khi thực thi.

---

# 3. Cấu Trúc Thư Mục
- `Docs/SourceOfTruth/`: Tài liệu gốc & spec.
- `Docs/Decisions/`: Nhật ký quyết định.
- `Docs/Handoffs/`: Bàn giao ca trực.
- `Docs/QC/`: Checklist nghiệm thu.
- `Docs/Done/`: Worklog fragments.

Nguồn cấu hình là `.agents/`; `.claude/rules`, `.claude/recipes`, `.claude/hooks` và `.claude/commands` do `node scripts/sync-agents.js` sinh ra — sửa ở nguồn, đừng sửa bản gương.

---

# 4. Bản Đồ Rules, Recipes, Hooks & Skills

<!-- UA:RULES:BEGIN -->
<!-- UA:GENERATED — sinh bởi: node scripts/sync-agents.js -->

### Rules — quy tắc luôn có hiệu lực

| File | Chủ đề | Các mục |
| :--- | :--- | :--- |
| `core-protocol.md` | Universal Core Protocol | Triết lý Cốt lõi · Quy trình 4 Pha Bắt buộc · Tư duy Nguyên lý Gốc & Phản biện Kỹ thuật · Kỷ luật Ngữ cảnh & Tiết kiệm Token |
| `quality-standards.md` | Universal Quality Standards | Chuẩn Mực Đầu Ra (Output Standards) · Tư Duy Lập Luận & Kiểm Chứng (Reasoning & Grounding) · Kỷ Luật Trình Bày & Định Dạng · Bảo Vệ Tính Toàn Vẹn Của Dữ Liệu |
| `doc-policy.md` | Universal Living Docs Policy | Triết Lý Tài Liệu Sống (Living Docs) · Cấu Trúc Thư Mục Docs/ Chuẩn · Quy Định Định Dạng File .txt · Kỷ Luật Worklog Fragments (Docs/Done/) |
| `knowledge-graph.md` | Universal Knowledge Graph Dispatcher (Node-0) | Nguyên Tắc Điều Hướng 2 Tầng · Phân Vùng Đang Hoạt Động Của Dự Án Này · Danh Mục Phân Vùng Gợi Ý (Catalog) · Định Dạng Lưu Trỏ Nội Dung (Pointer Contract) · Quy Trình Mở Rộng Khi Thêm Phân Vùng Mới |

### Recipes — mẫu cấu trúc đầu ra

Tra cứu tại `.agents/recipes/00-recipe-index.md` (bản cho Claude Code: `.claude/recipes/`).

| File | Mẫu |
| :--- | :--- |
| `recipe-analysis.md` | Bóc Tách & Phân Tích Vấn Đề (Root-Cause Analysis) |
| `recipe-decision-memo.md` | Bản Giải Trình Quyết Định 7 Phần (Decision Memo) |
| `recipe-deliverable.md` | Soạn Thảo Văn Bản & Sản Phẩm Hoàn Chỉnh (Deliverable) |
| `recipe-plan.md` | Lập Kế Hoạch & Lộ Trình (Action Plan) |
| `recipe-review-qc.md` | Thẩm Định Chất Lượng & Kiểm Lỗi Logic (Review & QC) |
| `recipe-synthesis.md` | Tổng Hợp Nghiên Cứu & Đối Chiếu Đa Nguồn (Research Synthesis) |

### Hooks — chốt chặn vòng đời

| File | Vai trò |
| :--- | :--- |
| `closeout-trigger.js` | Universal Closeout Trigger — nhắc Living Docs và chặn drift file tự sinh trước khi commit |
| `read-guard.js` | Universal Read & Context Token Guard — PreToolUse (advisory) |
| `safety-guard.js` | Universal Safety Guard Hook — PreToolUse |

### Skills — lệnh mở rộng

| Lệnh | Mô tả |
| :--- | :--- |
| `/doc` | Đồng bộ tài liệu sống trong Docs/SourceOfTruth/ với thực tế mới nhất của không gian làm việc. |
| `/explain` | Tổng hợp vấn đề phức tạp thành bản Decision Memo 7 phần chuẩn mực để chốt giải pháp. |
| `/init` | Khởi tạo và thiết lập dự án mới. Tự động phỏng vấn bối cảnh, điền AGENTS.md, CLAUDE.md, CHATGPT.md và tạo tài liệu SourceOfTruth. |
| `/newsession` | Đóng gói phiên làm việc, tạo worklog fragment trong Docs/Done/ và sinh prompt bàn giao cho phiên tiếp theo. |
| `/plan` | Phân rã mục tiêu lớn thành kế hoạch hành động từng bước (WBS, Milestones, DoD). |
| `/research` | Nghiên cứu chuyên sâu đa chiều một chủ đề phức tạp, tổng hợp dữ liệu và lập ma trận so sánh. |
| `/system-cleanup` | Rà soát và dọn dẹp các tệp tin rác, bản nháp trùng lặp hoặc dữ liệu thừa trong workspace. |
| `/verify` | Thẩm định chất lượng, rà soát mâu thuẫn logic, bối cảnh hoặc kiểm tra checklist nghiệm thu. |
| `/worktree` | Tạo và quản lý Git Worktree độc lập để thử nghiệm ý tưởng hoặc xử lý nhánh song song. |

<!-- UA:RULES:END -->
