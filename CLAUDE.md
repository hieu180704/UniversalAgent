# UniversalAgent — Claude Code Universal Guide

# Mục lục
1. [Tổng Quan & Triết Lý](#1-tổng-quan--triết-lý)
2. [Quy Trình 4 Pha](#2-quy-trình-4-pha)
3. [Cấu Trúc Thư Mục](#3-cấu-trúc-thư-mục)
4. [Lệnh Slash Commands Mở Rộng](#4-lệnh-slash-commands-mở-rộng)

---

# 1. Tổng Quan & Triết Lý
Bộ khung AI Agent phổ quát cho Claude Code:
- **Tiêu chuẩn:** *Correct, minimal, verifiable*.
- **Root-Cause:** Giải quyết tận gốc, trung thực, phản biện kỹ thuật khi thấy rủi ro.
- **Living Docs:** Luôn đồng bộ tài liệu sống tại `Docs/`.

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

---

# 4. Lệnh Slash Commands Mở Rộng
- `/init`: Khởi tạo & Onboarding dự án mới (phỏng vấn bối cảnh, điền CLAUDE.md/AGENTS.md và tạo SourceOfTruth).
- `/explain`: Lập Decision Memo 7 phần.
- `/plan`: Lập kế hoạch hành động.
- `/verify`: Thẩm định chất lượng & lỗi logic.
- `/doc`: Đồng bộ tài liệu sống.
- `/newsession`: Đóng phiên & sinh prompt bàn giao.
- `/research`: Nghiên cứu chuyên sâu.
- `/system-cleanup`: Dọn dẹp tệp tin rác trong workspace.
- `/worktree`: Thử nghiệm độc lập qua Git Worktree.

