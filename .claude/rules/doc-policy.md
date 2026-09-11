---
description: Universal Living Docs Policy (Cấu trúc Docs, Định dạng .txt, Worklogs)
---

# Universal Living Docs Policy

# Mục lục
1. [Triết Lý Tài Liệu Sống (Living Docs)](#1-triết-lý-tài-liệu-sống-living-docs)
2. [Cấu Trúc Thư Mục Docs/ Chuẩn](#2-cấu-trúc-thư-mục-docs-chuẩn)
3. [Quy Định Định Dạng File .txt](#3-quy-định-định-dạng-file-txt)
4. [Kỷ Luật Worklog Fragments (Docs/Done/)](#4-kỷ-luật-worklog-fragments-docsdone)
5. [Hạn Mức Độ Dài & Phân Vai Tài Liệu](#5-hạn-mức-độ-dài--phân-vai-tài-liệu)

---

# 1. Triết Lý Tài Liệu Sống (Living Docs)
- Tài liệu không phải là bản báo cáo tĩnh viết một lần rồi bỏ xó. Tài liệu là **nguồn chân lý duy nhất (Single Source of Truth)** phản ánh chính xác trạng thái hiện tại của dự án/công việc.
- Bất cứ khi nào có thay đổi về thiết kế, bối cảnh, logic hoặc quy trình: cập nhật tài liệu song song với quá trình thực thi.

---

# 2. Cấu Trúc Thư Mục Docs/ Chuẩn

```text
Docs/
├── SourceOfTruth/       # Tri thức gốc, quy chuẩn cốt lõi, bối cảnh, spec
├── Decisions/           # Nhật ký các quyết định quan trọng (Decision Memos / ADR)
├── Handoffs/            # Bản bàn giao phiên làm việc & bài học kinh nghiệm
├── QC/                  # Tiêu chí nghiệm thu, checklist kiểm thử & thẩm định
├── Done/                # Worklog fragments lưu vết các đầu việc đã hoàn thành
└── prompts/             # Các mẫu lệnh, kịch bản prompt tái sử dụng nhanh
```

---

# 3. Quy Định Định Dạng File .txt
- **Ưu tiên .txt:** Các tài liệu sống cốt lõi trong `Docs/` ưu tiên lưu dưới định dạng `.txt` để tiết kiệm token và đảm bảo tốc độ đọc/ghi nhanh nhất trên mọi IDE.
- **Cấu trúc chuẩn:** Mọi file tài liệu đều phải có **Mục lục** ở đầu và phân tách các phần bằng đường kẻ `---`.

---

# 4. Kỷ Luật Worklog Fragments (Docs/Done/)
- Khi hoàn tất một đầu việc (task/chương/tính năng), tạo một worklog fragment theo mẫu `Docs/Done/YYYY-MM-DD-task-name.txt`.
- Nội dung fragment tóm tắt: Mục tiêu, những gì đã làm, các file đã thay đổi, và điểm cần lưu ý cho người tiếp quản.

---

# 5. Hạn Mức Độ Dài & Phân Vai Tài Liệu

- **Hạn mức chia theo tần suất nạp**, không phải một con số phẳng. Mọi con số nằm ở hằng số đầu `.claude/hooks/doc-budget.js` — nguồn chân lý duy nhất, cố tình không chép sang đây. Hook chạy `PostToolUse` sau mỗi `Write`/`Edit`, kêu ngay tại chỗ chứ không đợi lúc commit.
- **Ratchet:** file cũ đã quá hạn mức chỉ bị chặn khi lần sửa làm nó **dài thêm**; sửa cho ngắn lại luôn được qua. Vượt có chủ đích thì khai trong 10 dòng đầu file: `# BUDGET-EXEMPT: <lý do> — <ai duyệt> <YYYY-MM-DD>`.
- **Chạm trần always-on là tín hiệu phải CẮT, không phải tín hiệu nâng trần.** Nâng số trong hook chỉ khi có lý do ghi ở `Docs/Decisions/`.
- **Một luật chỉ viết đầy đủ ở một nơi.** `.claude/rules/` giữ câu luật, bảng tra, danh sách cấm. `Docs/Decisions/` giữ lý do, bằng chứng, phương án bị loại, kết quả đo, điều kiện biên. Rule trỏ memo bằng một dòng, không chép lập luận của memo sang. Luật do chính rule đặt ra mà memo chưa có thì viết đủ ở rule.
- **Mọi script trong `.claude/hooks/` bắt buộc khai trong `.claude/hooks.json`.** Không khai thì không bao giờ tự chạy — quy ước suông đội lốt cưỡng chế. `doc-budget.js` tự kiểm điều này.
