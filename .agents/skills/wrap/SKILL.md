---
name: wrap
description: Đóng gói hoàn tất một Task / Milestone lớn (Full Closeout) — đồng bộ Living Docs, đổi status DONE và archive handoff, commit narrow, đúc kết Retrospective, và kết thúc trọn vẹn task. Dùng khi user gõ "/wrap", "đóng task", "wrap session", "hoàn thành task".
---

# Kỹ năng /wrap — Đóng Gói Hoàn Tất Task (Full Closeout)

Sử dụng khi **Task / Milestone ĐÃ HOÀN THÀNH 100%**:
- Mã nguồn đã hoàn thiện, tiêu chí nghiệm thu (Acceptance Criteria) đã đạt.
- Test / Verify đã PASS sạch sẽ.
- Cần chốt sổ, lưu trữ hồ sơ công việc, đúc kết kinh nghiệm và kết thúc trọn vẹn task.

---

## Mục Lục
1. [Quy Trình 4 Bước Đóng Task Chuẩn](#1-quy-trình-4-bước-đóng-task-chuẩn)
2. [Chi Tiết Từng Bước Thực Hiện](#2-chi-tiết-từng-bước-thực-hiện)
3. [Kỷ Luật Retrospective (Đúc Kết Bài Học)](#3-kỷ-luật-retrospective-đúc-kết-bài-học)
4. [Tùy Chọn: Next-Session Prompt (Chỉ Khi Yêu Cầu)](#4-tùy-chọn-next-session-prompt-chỉ-khi-yêu-cầu)

---

## 1. Quy Trình 4 Bước Đóng Task Chuẩn

```text
[1. Doc-Sync & SoT] ──► [2. Chốt Handoff & Archive] ──► [3. Commit Narrow] ──► [4. Retrospective & DONE]
```

---

## 2. Chi Tiết Từng Bước Thực Hiện

### Bước 1: Đồng Bộ Tài Liệu Sống (Living Docs Sync)
- Cập nhật các tài liệu liên quan trong `Docs/SourceOfTruth/<Domain>/...txt` và KG Leaf `.ai/rules/kg-<domain>.md`.
- Tạo worklog fragment chính thức tại `Docs/Done/YYYY-MM-DD-task-slug.txt`:
  - Dòng tiêu đề: `# YYYY-MM-DD: <Tên Task> — [play-test PASS | verified]`
  - Liệt kê các file đã tạo/sửa và kết quả nghiệm thu.

### Bước 2: Chốt Handoff & Archive
- Tìm file handoff tương ứng trong `Docs/Handoffs/handoff-<slug>.txt`.
- Cập nhật dòng trạng thái thành `# STATUS: 🟢 DONE`.
- Di chuyển file handoff đã hoàn thành vào thư mục lưu trữ:
  `git mv Docs/Handoffs/handoff-<slug>.txt Docs/Handoffs/Archive/`
  *(Đảm bảo thư mục `Docs/Handoffs/` chỉ giữ lại các đầu việc đang dở dang)*.

### Bước 3: Commit Narrow (Commit Gọn Gàng)
- Gom và add các file mã nguồn, tài liệu, worklog và file handoff đã archive.
- Tạo commit rõ ràng kèm mã số task/milestone.
- Lấy commit SHA ngắn (`git rev-parse --short HEAD`) để ghi vào báo cáo.

### Bước 4: Retrospective & Báo Cáo Hoàn Tất (DONE)
- Thực hiện đúc kết ngắn gọn theo chuẩn [Mục 3](#3-kỷ-luật-retrospective-đúc-kết-bài-học).
- **Xuất báo cáo DONE 100% và DỪNG LẠI TẠI ĐÂY.** Không tự ý sinh prompt thừa thãi khi không có yêu cầu tiếp nối.

---

## 3. Kỷ Luật Retrospective (Đúc Kết Bài Học)

Đánh giá ngắn gọn toàn bộ quá trình thực hiện task (2-4 dòng):

1. **Hiệu quả thực thi:**
   - Điểm nào làm tốt và trôi chảy?
   - Điểm nào bị nghẽn, tốn token thừa, phải sửa đi sửa lại (re-work) hoặc hiểu nhầm ý?
2. **Đề xuất cải tiến hệ thống (nếu có):**
   - Đề xuất sửa đổi file quy tắc nào (`.ai/rules/` hay `.ai/skills/`) để lần sau làm nhanh hơn?
   - ⚠ **Nguyên tắc:** Chỉ đề xuất cho người dùng xem xét, TUYỆT ĐỐI không tự ý sửa đổi rules ngoài phạm vi. Nếu không có gì cần cải tiến thì ghi rõ *"Task hoàn thành sạch sẽ, không có đề xuất cải tiến thêm"*.

---

## 4. Tùy Chọn: Next-Session Prompt (Chỉ Khi Yêu Cầu)

Chỉ sinh block prompt 4-Field này **KHI NGƯỜI DÙNG YÊU CẦU** (ví dụ: người dùng nói *"chuẩn bị prompt cho task tiếp theo là X"*):

```text
read:   Docs/SourceOfTruth/<NextTaskDomain>/...txt (hoặc Docs/Decisions/...txt)
state:  Task [Tên Task vừa xong] đã DONE tại commit [SHA], toàn bộ docs & handoff đã archive
action: plan & execute [Tên Task tiếp theo]
gate:   tuân thủ quy chuẩn dự án, verify theo checklist QC
```
