# UniversalAgent — Universal AI Agent Framework & Starter Kit

# Mục lục
1. [Tổng Quan Bộ Khung](#1-tổng-quan-bộ-khung)
2. [Bản Đồ Cấu Trúc Hệ Thống](#2-bản-đồ-cấu-trúc-hệ-thống)
3. [Quy Tắc Vận Hành & Danh Mục Mở Rộng](#3-quy-tắc-vận-hành--danh-mục-mở-rộng)
4. [Quy Trình Áp Dụng Vào Dự Án Mới](#4-quy-trình-áp-dụng-vào-dự-án-mới)
5. [Quy Chuẩn Pair-Programming](#5-quy-chuẩn-pair-programming)

---

# 1. Tổng Quan Bộ Khung
- **Tên dự án:** UniversalAgent
- **Bản chất:** Bộ khung cấu hình, quy tắc tư duy, kịch bản tự động hoá và mẫu chuẩn hoá dành cho AI Agent trên **3 nền tảng: Antigravity IDE · Codex · Claude CLI** khi làm việc cặp (Pair-Working) trên **MỌI loại tác vụ**: Sáng tác/Viết truyện, Quản trị/Văn phòng, Nghiên cứu/Hỏi đáp, Kỹ thuật/Lập trình.
- **Mục tiêu cốt lõi:**
  - Vận hành kỷ luật theo quy trình 4 pha (`explore -> propose -> confirm -> execute`).
  - Bảo vệ tính toàn vẹn của dữ liệu và tri thức nền tảng.
  - Tối ưu hoá Context Window (Token Conservation) và quản lý tài liệu sống (Living Docs).
  - **Một nguồn, 3 nền tảng:** rule viết một lần tại `.agents/rules/`, sinh ra cấu hình tương đương cho cả Antigravity, Codex lẫn Claude CLI. Đổi model hay đổi công cụ giữa chừng vẫn nhận đúng bộ quy tắc đó.

---

# 2. Bản Đồ Cấu Trúc Hệ Thống

Ký hiệu: 🔒 = viết tay (nguồn) · ⚙️ = do `scripts/sync-agents.js` sinh ra, không sửa trực tiếp.

```text
UniversalAgent/
├── .agents/                       # 🔒 NGUỒN DUY NHẤT — Antigravity đọc trực tiếp
│   ├── hooks.map.json             # 🔒 Khai báo nối dây hook cho mọi nền tảng
│   ├── hooks.json                 # ⚙️ Cấu hình Lifecycle Hooks (Antigravity)
│   ├── hooks/                     # 🔒 Scripts bảo vệ an toàn và ngữ cảnh
│   ├── rules/                     # 🔒 Hệ thống quy tắc tư duy
│   ├── recipes/                   # 🔒 Bộ mẫu cấu trúc cho các tác vụ phổ quát
│   └── skills/                    # 🔒 Kỹ năng mở rộng (/explain, /plan, /verify...)
├── .claude/                       # Claude CLI
│   ├── settings.json              # 🔒 permissions.deny · ⚙️ riêng khối "hooks"
│   ├── rules|recipes|hooks/       # ⚙️ Gương của .agents/
│   └── commands/                  # ⚙️ Sinh từ .agents/skills/
├── .github/workflows/             # 🔒 CI drift-check — không đi theo installer
├── AGENTS.md                      # Entry point Antigravity + Codex — mục 3 là ⚙️
├── CLAUDE.md                      # Entry point Claude CLI — mục 4 là ⚙️
├── *_TEMPLATE.md                  # 🔒 Bản mẫu cho dự án mới
├── .editorconfig / .gitignore     # 🔒 Thuộc quyền dự án đích, installer không ghi đè
├── install.ps1 / install.sh       # 🔒 Cài đặt 1 lệnh (Windows / macOS & Linux)
├── setup.bat                      # 🔒 Cài đặt 1-click cho Windows
├── scripts/sync-agents.js         # 🔒 Bộ sinh cấu hình đa nền tảng
└── Docs/                          # Living Docs Framework
    ├── SourceOfTruth/             # Tri thức gốc, quy chuẩn cốt lõi, bối cảnh
    ├── Decisions/                 # Nhật ký quyết định quan trọng (ADR / Memos)
    ├── Handoffs/                  # Bản bàn giao phiên làm việc & bài học
    ├── QC/                        # Checklist kiểm thử & thẩm định chất lượng
    ├── Done/                      # Worklog fragments lưu vết các đầu việc đã xong
    └── prompts/                   # Kịch bản prompt nhanh & mẫu lệnh
```

**Quy tắc vàng:** sửa rule thì sửa ở `.agents/rules/`, sửa nối dây hook thì sửa ở `.agents/hooks.map.json` — rồi chạy `node scripts/sync-agents.js`. Sửa thẳng vào file ⚙️ sẽ mất trắng ở lần đồng bộ kế tiếp.

---

# 3. Quy Tắc Vận Hành & Danh Mục Mở Rộng

<!-- UA:RULES:BEGIN -->
<!-- UA:GENERATED — sinh bởi: node scripts/sync-agents.js -->

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
| **Architecture** | `Docs/SourceOfTruth/Architecture/` | `Spec: installer-contract` — hợp đồng 4 nhóm file, trình tự 7 bước và các bẫy ngầm của installer |

Tri thức tổng quan không thuộc phân vùng nào nằm thẳng tại `Docs/SourceOfTruth/overview.txt`: định danh dự án, kiến trúc một-nguồn, ba lớp chống drift, quy ước sở hữu file.

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

---

## Danh Mục Recipes, Hooks & Skills

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
| `/init` | Khởi tạo và thiết lập dự án mới. Tự động phỏng vấn bối cảnh, điền AGENTS.md, CLAUDE.md và tạo tài liệu SourceOfTruth. |
| `/newsession` | Đóng gói phiên làm việc, tạo worklog fragment trong Docs/Done/ và sinh prompt bàn giao cho phiên tiếp theo. |
| `/plan` | Phân rã mục tiêu lớn thành kế hoạch hành động từng bước (WBS, Milestones, DoD). |
| `/research` | Nghiên cứu chuyên sâu đa chiều một chủ đề phức tạp, tổng hợp dữ liệu và lập ma trận so sánh. |
| `/system-cleanup` | Rà soát và dọn dẹp các tệp tin rác, bản nháp trùng lặp hoặc dữ liệu thừa trong workspace. |
| `/verify` | Thẩm định chất lượng, rà soát mâu thuẫn logic, bối cảnh hoặc kiểm tra checklist nghiệm thu. |
| `/worktree` | Tạo và quản lý Git Worktree độc lập để thử nghiệm ý tưởng hoặc xử lý nhánh song song. |

<!-- UA:RULES:END -->

---

# 4. Quy Trình Áp Dụng Vào Dự Án Mới
1. Chạy lệnh cài đặt `.\install.ps1 -TargetDir "đường_dẫn"` (hoặc `./install.sh /đường/dẫn`).
2. Mở không gian làm việc mới với AI và gõ `/init`.
3. AI sẽ phỏng vấn 3 câu cốt lõi và tự động thiết lập toàn bộ tài liệu (`AGENTS.md`, `CLAUDE.md`) cùng tri thức gốc tại `Docs/SourceOfTruth/overview.txt`.

Cài lại lần nữa lên cùng thư mục là an toàn: installer chạy theo kiểu merge, không tạo thư mục lồng nhau, và không ghi đè `.gitignore` / `.gitattributes` / `.editorconfig` / `.claude/settings.json` sẵn có của dự án (bản của khung được đặt cạnh dưới tên `<file>.universalagent`).

---

# 5. Quy Chuẩn Pair-Programming
- **Quy trình 4 bước:** `explore -> propose -> confirm -> execute`. Dừng lại ở mỗi bước để xác nhận, không tự ý nhảy bước khi chưa được duyệt.
- **Tiêu chuẩn cốt lõi:** *Correct, minimal, verifiable* — giải quyết triệt để vấn đề tận gốc, không vá tạm thời.
- **Kỷ luật sửa đổi:** Đọc kỹ tài liệu hiện hành trước khi sửa; không tự ý chỉnh sửa ngoài phạm vi yêu cầu.
