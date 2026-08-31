---
name: newsession
description: Đóng phiên làm việc gọn (khi task chưa xong hoặc tạm nghỉ) — sync doc, tạo worklog fragment Docs/Done/, commit narrow, và sinh prompt 4-field để làm tiếp ở session mới. Dùng khi user gõ "/newsession", "chốt nhanh", "tạm nghỉ".
---

# Kỹ năng /newsession — Đóng Phiên Làm Việc Gọn

Sử dụng khi **Task CHƯA XONG** nhưng cần:
- Kết thúc ngày làm việc / Tạm nghỉ ngơi.
- Context chat hiện tại bị phình to (>100k token), cần mở phiên chat mới để tiếp tục làm tiếp task này.

> Nếu **Task ĐÃ HOÀN THÀNH 100%** (code xong, test pass, nghiệm thu xong), hãy dùng kỹ năng **`/wrap`** để đóng gói và archive handoff.

---

## Mục Lục
1. [Quy Trình 4 Bước Đóng Phiên Nhanh](#1-quy-trình-4-bước-đóng-phiên-nhanh)
2. [Cấu Trúc Worklog Fragment (Docs/Done/)](#2-cấu-trúc-worklog-fragment-docsdone)
3. [Quy Chuẩn Next-Session Prompt (4-Field)](#3-quy-chuẩn-next-session-prompt-4-field)
4. [Lưu Ý & Kỷ Luật](#4-lưu-ý--kỷ-luật)

---

## 1. Quy Trình 4 Bước Đóng Phiên Nhanh

1. **Doc-Sync (Tạo Worklog Fragment):**
   - Tạo file `Docs/Done/YYYY-MM-DD-slug.txt` ghi nhận những gì đã làm trong phiên này.
   - ⚠ **Dòng SUMMARY đầu tiên BẮT BUỘC có TRẠNG THÁI VERIFY** (xem mục 2).
   - Nếu có đụng chạm kiến trúc hay hệ thống lớn: cập nhật nhanh các tài liệu liên quan trong `Docs/SourceOfTruth/`.

2. **Handoff-Stale Check (Kiểm tra & Cảnh báo):**
   - Kiểm tra các file trong `Docs/Handoffs/*.txt`.
   - Nếu việc vừa làm thuộc về một Handoff đang dở dang: **Cảnh báo người dùng** hoặc nhắc cập nhật tiến độ vào file handoff đó.
   - *Lưu ý:* `/newsession` KHÔNG tự động flip `# STATUS: DONE` hay archive handoff (đó là việc của `/wrap`).

3. **Commit Narrow (Commit Git hẹp & có chủ đích):**
   - Chỉ `git add` các file thuộc phạm vi phiên này. Tuyệt đối không `git add -A`.
   - Trình bày tóm tắt commit message và xin xác nhận của người dùng trước khi commit.

4. **Đẻ Next-Session Prompt (Khung 4-Field):**
   - Sinh đoạn prompt ngắn gọn theo đúng chuẩn 4-Field (mục 3) để người dùng dán vào phiên chat mới tiếp theo.

---

## 2. Cấu Trúc Worklog Fragment (`Docs/Done/`)

Tên file: `Docs/Done/YYYY-MM-DD-task-slug.txt`

```text
# YYYY-MM-DD: Tên tóm tắt công việc — [play-test PASS | compile-green only | CHƯA verify]

- Commit: <SHA ngắn hoặc 'chưa commit'>
- Những việc đã làm:
  1. ...
  2. ...
- Trạng thái hiện tại: Đang dở ở bước X, đã verify tới đâu.
- Điểm cần chú ý cho phiên sau: ...
```

> ⚠ **Kỷ luật cốt lõi:** Dòng tiêu đề đầu tiên BẮT BUỘC mang trạng thái kiểm chứng thật (`play-test PASS` / `compile-green only` / `CHƯA verify`). Session sau chỉ đọc summary để định vị ngữ cảnh, việc ghi mập mờ "đã làm X" mà không rõ đã verify chưa sẽ gây hiểu nhầm tai hại.

---

## 3. Quy Chuẩn Next-Session Prompt (4-Field)

Khi kết thúc `/newsession`, xuất ra một block code định dạng đúng 4 trường sau:

```text
read:   Docs/Handoffs/handoff-<slug>.txt (hoặc Docs/SourceOfTruth/...txt)
state:  Đã xong bước 1 & 2 (commit abc1234), đang dở bước 3 [tên bước]
action: execute bước 3 (mô tả ngắn hành động tiếp theo)
gate:   bám sát quy chuẩn dự án, verify logic/test trước khi kết thúc
```

- **Luật cho session mới nhận prompt này:** BẮT BUỘC đọc file trong trường `read:` TRƯỚC câu trả lời đầu tiên để nạp đúng ngữ cảnh.

---

## 4. Lưu Ý & Kỷ Luật

1. **Không over-scope:** `/newsession` tập trung đóng phiên nhanh, không sa đà vào refactor hay viết văn bản dài dòng.
2. **Không chôn bug/nợ trong fragment:** Nếu phát hiện bug mới mà chưa kịp sửa trong phiên này, hãy ghi vào file Handoff hoặc Decision memo, không chôn ở cuối file fragment (vì fragment là nhật ký đóng, không ai tra cứu lại thường xuyên).
