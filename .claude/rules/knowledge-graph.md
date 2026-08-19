# Universal Knowledge Graph Dispatcher (Node-0)

# Mục lục
1. [Nguyên Tắc Điều Hướng 2 Tầng](#1-nguyên-tắc-điều-hướng-2-tầng)
2. [Phân Vùng Đang Hoạt Động Của Dự Án Này](#2-phân-vùng-đang-hoạt-động-của-dự-án-này)
3. [Danh Mục Phân Vùng Gợi Ý (Catalog)](#3-danh-mục-phân-vùng-gợi-ý-catalog)
4. [Định Dạng Lưu Trỏ Nội Dung (Pointer Contract)](#4-định-dạng-lưu-trỏ-nội-dung-pointer-contract)
5. [Quy Trình Mở Rộng Khi Thêm Phân Vùng Mới](#5-quy-trình-mở-rộng-khi-thêm-phân-vùng-mới)

---

# 1. Nguyên Tắc Điều Hướng 2 Tầng
- **Tầng 1 (Dispatcher Node-0 - File này):** Bản đồ tổng quan phân chia các phân vùng kiến thức (Domains) trong không gian làm việc. AI tra bảng ở mục 2 để định vị nhanh khu vực tài liệu liên quan mà không cần quét toàn bộ workspace.
- **Tầng 2 (Leaf Nodes / Domain Specs):** Nằm tại `Docs/SourceOfTruth/<Domain>/`, chứa thông tin chi tiết, luồng hoạt động và danh mục thực thể của riêng phân vùng đó.
- **Mục tiêu:** Giảm 80-90% token tiêu hao cho việc tìm kiếm thông tin ngữ cảnh.

---

# 2. Phân Vùng Đang Hoạt Động Của Dự Án Này

**Đây là bảng duy nhất AI được phép tin để định vị tài liệu.** Chỉ liệt kê phân vùng **đã thực sự tồn tại trên đĩa**.

| Phân vùng (Domain) | Thư mục | Nội dung chính |
| :--- | :--- | :--- |
| **Architecture** | `Docs/SourceOfTruth/Architecture/` | `Spec: installer-contract` — hợp đồng 4 nhóm file, trình tự 7 bước và các bẫy ngầm của installer |

Tri thức tổng quan không thuộc phân vùng nào nằm thẳng tại `Docs/SourceOfTruth/overview.txt`: định danh dự án, kiến trúc một-nguồn, ba lớp chống drift, quy ước sở hữu file.

**Khi bảng này rỗng:** dự án chưa phân vùng tri thức. Đọc thẳng `Docs/SourceOfTruth/` — đừng đoán đường dẫn theo danh mục gợi ý ở mục 3, vì các thư mục đó chưa tồn tại.

**Ai điền bảng này:** `/init` điền lần đầu theo lĩnh vực của dự án; sau đó cập nhật mỗi khi phát sinh phân vùng mới (xem mục 5).

---

# 3. Danh Mục Phân Vùng Gợi Ý (Catalog)

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

# 4. Định Dạng Lưu Trỏ Nội Dung (Pointer Contract)
Tất cả tham chiếu trong Knowledge Graph phải tuân thủ dạng **THƯ MỤC + TÊN THỰC THỂ/SYMBOL BỀN VỮNG**:
- **ĐÚNG (Bền vững):** `Docs/SourceOfTruth/Content/` → `CharacterProfile: JohnDoe`, `Timeline: Chapter3`
- **SAI (Dễ bị lệch):** `Docs/SourceOfTruth/Content/lore.txt:L45-L80` *(Vì số dòng sẽ thay đổi khi tài liệu được cập nhật)*.

---

# 5. Quy Trình Mở Rộng Khi Thêm Phân Vùng Mới
1. Tạo thư mục `Docs/SourceOfTruth/<Domain>/` và file spec đầu tiên (mẫu: `Docs/SourceOfTruth/spec-template.txt`).
2. Thêm một dòng vào bảng ở **mục 2** — chỉ thêm sau khi thư mục đã có nội dung thật.
3. Chạy `node scripts/sync-agents.js` để đẩy thay đổi sang toàn bộ nền tảng.
