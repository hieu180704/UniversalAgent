# Universal Knowledge Graph Dispatcher (Node-0)

# Mục lục
1. [Nguyên Tắc Điều Hướng 3 Tầng](#1-nguyên-tắc-điều-hướng-3-tầng)
2. [Phân Vùng Đang Hoạt Động](#2-phân-vùng-đang-hoạt-động)
3. [Hợp Đồng Viết KG Leaf](#3-hợp-đồng-viết-kg-leaf)
4. [Định Dạng Lưu Trỏ Nội Dung (Pointer Contract)](#4-định-dạng-lưu-trỏ-nội-dung-pointer-contract)
5. [Quy Trình Mở Rộng Khi Thêm Phân Vùng Mới](#5-quy-trình-mở-rộng-khi-thêm-phân-vùng-mới)
6. [Danh Mục Phân Vùng Gợi Ý (Catalog)](#6-danh-mục-phân-vùng-gợi-ý-catalog)

---

# 1. Nguyên Tắc Điều Hướng 3 Tầng

| Tầng | Ở đâu | Nạp khi nào | Chứa gì |
| :--- | :--- | :--- | :--- |
| **Tầng 0 — Dispatcher** | `.claude/rules/knowledge-graph.md` (file này) | Luôn luôn | Chỉ routing: bảng phân vùng (mục 2) + hợp đồng viết leaf (mục 3). KHÔNG chứa tri thức chi tiết. |
| **Tầng 1 — KG Leaf** | `.claude/rules/kg-<domain>.md` | Lazy — tự nạp khi agent đụng file khớp glob `paths:` trong frontmatter | Bản đồ tra cứu của một phân vùng: từ khoá đời thường → đường dẫn + symbol + entry point. |
| **Tầng 2 — Deep Doc** | `Docs/SourceOfTruth/<Domain>/` | Đọc tay khi leaf trỏ tới (mục `## Deep`) | Spec đầy đủ, luồng chi tiết, lý do thiết kế. |

- Mục tiêu: giảm 80-90% token tiêu hao cho việc tìm ngữ cảnh — agent tra bảng rồi đi thẳng, không quét workspace.
- Leaf là **bản đồ**, không phải bản sao tri thức. Leaf trỏ tới file sống ở Tầng 2; chi tiết nằm ở đó, không paste vào leaf.

---

# 2. Phân Vùng Đang Hoạt Động

**Bảng duy nhất AI được phép tin để định vị tài liệu.** Chỉ liệt kê phân vùng **đã thực sự tồn tại trên đĩa**.

| Phân vùng | KG Leaf | Deep Doc | Nội dung |
| :--- | :--- | :--- | :--- |
| Architecture | *(chưa có)* | `Docs/SourceOfTruth/Architecture/` | `Spec: core-gameplay-layering` — mô hình hai tầng Core generic / Gameplay, ranh giới phụ thuộc một chiều, danh sách quyết định kiến trúc còn mở; Khái niệm nền DI/composition root/VContainer — khai-niem-di.txt |

- Tri thức tổng quan không thuộc phân vùng nào nằm tại `Docs/SourceOfTruth/overview.txt`.
- **Khi bảng rỗng:** đọc thẳng `Docs/SourceOfTruth/` — đừng đoán đường dẫn theo danh mục gợi ý ở mục 6, các thư mục đó có thể chưa tồn tại.

---

# 3. Hợp Đồng Viết KG Leaf

## a) Frontmatter bắt buộc
Mọi leaf phải mở bằng khối YAML khai `paths:` — danh sách glob trỏ đúng thư mục code thật của domain:

```
---
paths:
  - "Assets/Core/Audio/**"
---
```

Đây là cơ chế lazy-load **thật**, không phải quy ước: agent đụng file khớp glob nào thì leaf tương ứng tự nạp vào context, kể cả khi không match keyword nào ở bảng mục 2.

## b) Khung section cố định
Thứ tự bắt buộc trong thân leaf: header `Owns` → `## Identifiers` → `## Cross-domain` (tuỳ chọn) → `## Pattern` (tuỳ chọn) → `## Deep`.

## c) Cách viết dòng `Identifiers`
Đây là phần agent tra nhiều nhất:
- **Vế trái** (trước `->`): từ khoá đời thường, tiếng Việt lẫn tiếng Anh, cách nhau bằng `·` — viết đúng cách một người sẽ hỏi, không phải tên hàm.
- **Vế phải** (sau `->`): đường dẫn thư mục + tên class/symbol chính + entry method, kết bằng 1-2 câu mô tả ngắn.
- **Nhãn** cuối dòng, chọn trong `WHAT` (là gì / nằm đâu) · `HOW` (dùng thế nào) · `WHY` (vì sao thiết kế vậy); có thể ghép `WHAT/HOW`.

Ví dụ:
```
phát âm thanh · play sound · bật nhạc nền · music loop
   -> Assets/Core/Audio/ (AudioService, AudioClipLibrary). AudioService.Play(id) tra clip qua
      AudioClipLibrary rồi phát qua AudioSource pool có sẵn, tự release khi clip dứt. WHAT/HOW
```

## d) Template rỗng
```
---
paths:
  - "<glob tới thư mục code domain sở hữu>"
---
# KG Leaf — <Tên domain>
# Lazy-loaded node của knowledge-graph.md (node-0).
# Owns: <domain này quản lý gì, ranh giới với domain khác>

## Identifiers
<từ khoá 1> · <từ khoá 2> · <TênClass>
   -> <thư mục> (<Symbol chính>, <symbol phụ>). <mô tả ngắn>. <NHÃN>

## Cross-domain
<điểm giao với domain khác> -> kg-<domain-khác>

## Pattern
<quy ước cấu trúc code lặp lại trong domain, nếu có>

## Deep
Docs/SourceOfTruth/<Domain>/<spec>.txt — đọc on-demand khi cần hiểu sâu.
```

---

# 4. Định Dạng Lưu Trỏ Nội Dung (Pointer Contract)
- **ĐÚNG (bền vững):** THƯ MỤC + TÊN SYMBOL — ví dụ `Assets/Core/Audio/` → `AudioService.Play()`.
- **SAI (dễ lệch):** trỏ theo số dòng — ví dụ `spec-audio.txt:L45-L80`, vì số dòng đổi khi tài liệu cập nhật.
- Leaf trỏ tới **file sống**, không paste nguyên code vào leaf — code đổi thì leaf không tự sai theo.

---

# 5. Quy Trình Mở Rộng Khi Thêm Phân Vùng Mới

**LEAF SINH SAU CODE, KHÔNG SINH TRƯỚC.** Leaf trỏ tới code chưa tồn tại là pointer chết ngay từ lúc tạo, phản lại đúng mục đích của Knowledge Graph. IndieGame hiện còn trống trong khi project tham chiếu sand_drop có 43 leaf — toàn bộ kết tinh từ ~85.000 dòng code đã chạy thật, không leaf nào sinh trước.

1. Code của phân vùng đó đã tồn tại và chạy được.
2. Tạo `.claude/rules/kg-<domain>.md` theo hợp đồng mục 3, frontmatter `paths:` trỏ đúng thư mục code thật.
3. Nếu phân vùng cần spec sâu → tạo `Docs/SourceOfTruth/<Domain>/` + file spec `.txt` (có mục lục, phân tách `---`), trỏ từ mục `## Deep` của leaf.
4. Thêm một dòng vào bảng ở **mục 2** — chỉ thêm sau khi file đã có nội dung thật.

---

# 6. Danh Mục Phân Vùng Gợi Ý (Catalog)

Danh mục **tham khảo**, KHÔNG phải cấu trúc bắt buộc, KHÔNG phải mô tả hiện trạng. Chỉ tạo thư mục khi phân vùng thực sự có nội dung — thư mục rỗng chỉ làm nhiễu điều hướng.

| Phân vùng gợi ý | Dùng khi có | Thư mục đề xuất |
| :--- | :--- | :--- |
| Architecture | Kiến trúc hệ thống, layering, module boundary | `Docs/SourceOfTruth/Architecture/` |
| Gameplay | Cơ chế chơi, level, entity, tuning | `Docs/SourceOfTruth/Gameplay/` |
| Art & Audio | Style guide, asset pipeline, âm thanh | `Docs/SourceOfTruth/Art/` |
| Build & Release | Quy trình build, checklist phát hành | `Docs/SourceOfTruth/Build/` |

Phân vùng ngoài danh mục này hoàn toàn hợp lệ — đặt tên theo đúng thực tế dự án.
