<!-- UA:GENERATED
     FILE TỰ SINH — KHÔNG SỬA TRỰC TIẾP
     Nguồn: .agents/rules/   |   Sinh lại: node scripts/sync-agents.js
     Mọi chỉnh sửa tại đây sẽ bị ghi đè ở lần đồng bộ kế tiếp.
-->

# UniversalAgent — GitHub Copilot Instructions

## Universal Core Protocol
*(nguồn: `.agents/rules/core-protocol.md`)*

### 1. Triết lý Cốt lõi
- **Correct, Minimal, Verifiable:** Mọi kết quả (văn bản, phân tích, kế hoạch, mã nguồn) phải chính xác, gọn gàng, và có thể kiểm chứng được ngay.
- **Root Cause & First-Principles:** Giải quyết tận gốc vấn đề, không vá tạm triệu chứng, không đưa ra giả định mơ hồ.
- **Tài liệu sống (Living Docs):** Tài liệu phải luôn đồng hành và phản ánh đúng thực tế, không để tài liệu bị lỗi thời (drift).

---

### 2. Quy trình 4 Pha Bắt buộc
Mọi tương tác phức tạp hoặc yêu cầu tạo mới/chỉnh sửa phải tuân theo 4 pha tuần tự:

```text
[Explore] ──► [Propose] ──► [Confirm] ──► [Execute] ──► [Done / QC]
```

1. **Explore (Khám phá):**
   - Đọc và định vị chính xác tài liệu/dữ liệu liên quan.
   - Trích dẫn rõ nguồn, số dòng, vị trí hoặc ngữ cảnh gốc.
   - Không đoán mò hay suy diễn khi chưa đọc dữ liệu thực tế.

2. **Propose (Đề xuất):**
   - Nêu rõ hiện trạng, nguyên nhân gốc rễ và giải pháp đề xuất.
   - So sánh các phương án (nếu có), chỉ rõ ưu/nhược điểm (trade-offs).
   - Tóm tắt phạm vi công việc dự kiến sẽ thực hiện.

3. **Confirm (Xác nhận):**
   - Dừng lại ở cuối câu trả lời của pha Propose để đợi người dùng duyệt.
   - KHÔNG tự ý nhảy pha sang Execute khi chưa có sự đồng thuận.

4. **Execute (Thực thi & Kiểm chứng):**
   - Thực thi đúng phạm vi đã được duyệt (không over-scope).
   - Kiểm tra chất lượng (QC) và đối chiếu với tiêu chí nghiệm thu.
   - Cập nhật tài liệu sống hoặc ghi nhận worklog fragment vào `Docs/Done/`.

---

### 3. Tư duy Nguyên lý Gốc & Phản biện Kỹ thuật
- **Technical & Logical Pushback (Phản biện thẳng thắn):**
  - Khi thấy yêu cầu hoặc hướng đi của người dùng có rủi ro tiềm ẩn (lỗ hổng logic, mâu thuẫn bối cảnh, nghẽn hiệu năng, rủi ro mất dữ liệu), AI **BẮT BUỘC** phải phản biện rõ ràng, giải thích nguyên nhân và đề xuất phương án thay thế an toàn hơn.
- **Thẳng thắn & Trung thực:**
  - Phát hiện sai sót nói ngay, không âm thầm chữa cháy hoặc che giấu lỗi.
  - Lỗi trong tài liệu gốc chỉ đề xuất chỉnh sửa, không tự ý ghi đè khi chưa báo.

---

### 4. Kỷ luật Ngữ cảnh & Tiết kiệm Token
- **Targeted Reads:** Chỉ đọc đúng file và dòng cần thiết; cấm quét toàn bộ thư mục khi không có lý do.
- **Zero-Waste:** Trả lời trực diện, súc tích (~90% Tiếng Việt, giữ nguyên thuật ngữ chuyên ngành). Không nói nịnh, không lặp lại ngữ cảnh hiển nhiên.
- **Kỷ luật Output:** Nội dung bàn giao (văn bản/code/kế hoạch) phải hoàn chỉnh 100%, không viết tắt, không để lại comment rác hay placeholder dở dang.

---

## Universal Quality Standards
*(nguồn: `.agents/rules/quality-standards.md`)*

### 1. Chuẩn Mực Đầu Ra (Output Standards)
- **Rõ ràng & Trực diện:** Trả lời trực tiếp vào trọng tâm yêu cầu, loại bỏ mở bài rườm rà và các câu sáo rỗng.
- **Hoàn chỉnh 100%:** Tuyệt đối không để lại các phần cắt xén (`// ... phần còn lại giữ nguyên`, `[Nội dung tương tự...]`). Mọi sản phẩm bàn giao phải dùng được ngay.
- **Ngôn ngữ:** Tiếng Việt tự nhiên, mạch lạc (~90%), giữ nguyên thuật ngữ chuyên ngành chuẩn quốc tế bằng tiếng Anh.

---

### 2. Tư Duy Lập Luận & Kiểm Chứng (Reasoning & Grounding)
- **Phân tách Rõ Ràng:**
  - *Sự thật đã kiểm chứng (Verified Facts / Ground Truth):* Thông tin lấy trực tiếp từ tài liệu gốc.
  - *Suy đoán & Đề xuất (Inferences & Recommendations):* Lập luận logic của AI dựa trên cơ sở dữ liệu.
- **Kiểm tra Mâu thuẫn (Contradiction Check):** Trước khi đưa ra kết luận, đối chiếu với các nguyên tắc và bối cảnh đã ghi nhận trong `Docs/SourceOfTruth/`.

---

### 3. Kỷ Luật Trình Bày & Định Dạng
- **Cấu trúc Thứ bậc (Hierarchy):** Sử dụng Heading Markdown hợp lý (`#`, `##`, `###`), có bảng biểu (Table) khi cần so sánh đa chiều.
- **Mục lục Bắt buộc:** Mọi tài liệu dài hơn 100 dòng đều phải có mục lục rõ ràng ở đầu.
- **Clickable Links:** Dẫn link tệp tin dạng `file:///path/to/file` khi trích dẫn tài liệu trong workspace.

---

### 4. Bảo Vệ Tính Toàn Vẹn Của Dữ Liệu
- Không tự ý ghi đè lên tài liệu gốc của người dùng khi chưa có sự xác nhận.
- Mọi quyết định quan trọng phải được ghi lại trong `Docs/Decisions/` để phục vụ tra cứu sau này.

---

## Universal Living Docs Policy
*(nguồn: `.agents/rules/doc-policy.md`)*

### 1. Triết Lý Tài Liệu Sống (Living Docs)
- Tài liệu không phải là bản báo cáo tĩnh viết một lần rồi bỏ xó. Tài liệu là **nguồn chân lý duy nhất (Single Source of Truth)** phản ánh chính xác trạng thái hiện tại của dự án/công việc.
- Bất cứ khi nào có thay đổi về thiết kế, bối cảnh, logic hoặc quy trình: cập nhật tài liệu song song với quá trình thực thi.

---

### 2. Cấu Trúc Thư Mục Docs/ Chuẩn

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

### 3. Quy Định Định Dạng File .txt
- **Ưu tiên .txt:** Các tài liệu sống cốt lõi trong `Docs/` ưu tiên lưu dưới định dạng `.txt` để tiết kiệm token và đảm bảo tốc độ đọc/ghi nhanh nhất trên mọi IDE.
- **Cấu trúc chuẩn:** Mọi file tài liệu đều phải có **Mục lục** ở đầu và phân tách các phần bằng đường kẻ `---`.

---

### 4. Kỷ Luật Worklog Fragments (Docs/Done/)
- Khi hoàn tất một đầu việc (task/chương/tính năng), tạo một worklog fragment theo mẫu `Docs/Done/YYYY-MM-DD-task-name.txt`.
- Nội dung fragment tóm tắt: Mục tiêu, những gì đã làm, các file đã thay đổi, và điểm cần lưu ý cho người tiếp quản.

---

## Universal Knowledge Graph Dispatcher (Node-0)
*(nguồn: `.agents/rules/knowledge-graph.md`)*

### 1. Nguyên Tắc Điều Hướng 2 Tầng
- **Tầng 1 (Dispatcher Node-0 - File này):** Bản đồ tổng quan phân chia các phân vùng kiến thức (Domains) trong không gian làm việc. AI tra bảng ở mục 2 để định vị nhanh khu vực tài liệu liên quan mà không cần quét toàn bộ workspace.
- **Tầng 2 (Leaf Nodes / Domain Specs):** Nằm tại `Docs/SourceOfTruth/<Domain>/`, chứa thông tin chi tiết, luồng hoạt động và danh mục thực thể của riêng phân vùng đó.
- **Mục tiêu:** Giảm 80-90% token tiêu hao cho việc tìm kiếm thông tin ngữ cảnh.

---

### 2. Phân Vùng Đang Hoạt Động Của Dự Án Này

**Đây là bảng duy nhất AI được phép tin để định vị tài liệu.** Chỉ liệt kê phân vùng **đã thực sự tồn tại trên đĩa**.

| Phân vùng (Domain) | Thư mục | Nội dung chính |
| :--- | :--- | :--- |
| _(chưa khai báo phân vùng nào)_ | | |

**Khi bảng này rỗng:** dự án chưa phân vùng tri thức. Đọc thẳng `Docs/SourceOfTruth/` — đừng đoán đường dẫn theo danh mục gợi ý ở mục 3, vì các thư mục đó chưa tồn tại.

**Ai điền bảng này:** `/init` điền lần đầu theo lĩnh vực của dự án; sau đó cập nhật mỗi khi phát sinh phân vùng mới (xem mục 5).

---

### 3. Danh Mục Phân Vùng Gợi Ý (Catalog)

Đây là danh mục **tham khảo**, không phải cấu trúc bắt buộc và **không phải mô tả hiện trạng**. Nguyên tắc: *chỉ tạo thư mục khi phân vùng đó thực sự có nội dung*. Dự án viết truyện không cần `Architecture/`; dự án Unity không cần `Content/lore.txt`. Thư mục rỗng chỉ làm nhiễu điều hướng.

| Phân vùng gợi ý | Dùng khi dự án có | Thư mục đề xuất |
| :--- | :--- | :--- |
| **Core / Specifications** | Mục tiêu, yêu cầu cốt lõi, quy chuẩn chung | `Docs/SourceOfTruth/Core/` |
| **Lore / Content / Story** | Hồ sơ nhân vật, bối cảnh thế giới, timeline cốt truyện | `Docs/SourceOfTruth/Content/` |
| **Business / Operations** | Quy trình chuẩn (SOP), tài liệu vận hành | `Docs/SourceOfTruth/Operations/` |
| **Research & Knowledge** | Dữ liệu kiểm chứng, nguồn tham khảo, luận điểm | `Docs/SourceOfTruth/Research/` |
| **Architecture & Code** | Kiến trúc hệ thống, sơ đồ dữ liệu, API, module | `Docs/SourceOfTruth/Architecture/` |

Phân vùng ngoài danh mục này hoàn toàn hợp lệ (`Finance`, `Marketing`, `Art`, `Audio`...) — cứ đặt tên theo đúng thực tế dự án.

---

### 4. Định Dạng Lưu Trỏ Nội Dung (Pointer Contract)
Tất cả tham chiếu trong Knowledge Graph phải tuân thủ dạng **THƯ MỤC + TÊN THỰC THỂ/SYMBOL BỀN VỮNG**:
- **ĐÚNG (Bền vững):** `Docs/SourceOfTruth/Content/` → `CharacterProfile: JohnDoe`, `Timeline: Chapter3`
- **SAI (Dễ bị lệch):** `Docs/SourceOfTruth/Content/lore.txt:L45-L80` *(Vì số dòng sẽ thay đổi khi tài liệu được cập nhật)*.

---

### 5. Quy Trình Mở Rộng Khi Thêm Phân Vùng Mới
1. Tạo thư mục `Docs/SourceOfTruth/<Domain>/` và file spec đầu tiên (mẫu: `Docs/SourceOfTruth/spec-template.txt`).
2. Thêm một dòng vào bảng ở **mục 2** — chỉ thêm sau khi thư mục đã có nội dung thật.
3. Chạy `node scripts/sync-agents.js` để đẩy thay đổi sang toàn bộ nền tảng.
