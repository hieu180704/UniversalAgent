# UniversalAgent — Universal AI Agent Framework & Starter Kit

# Mục lục
1. [Tổng Quan Bộ Khung](#1-tổng-quan-bộ-khung)
2. [Bản Đồ Cấu Trúc Hệ Thống](#2-bản-đồ-cấu-trúc-hệ-thống)
3. [Bản Đồ Rules, Recipes, Hooks & Skills](#3-bản-đồ-rules-recipes-hooks--skills)
4. [Quy Trình Áp Dụng Vào Dự Án Mới](#4-quy-trình-áp-dụng-vào-dự-án-mới)
5. [Quy Chuẩn Pair-Programming](#5-quy-chuẩn-pair-programming)

---

# 1. Tổng Quan Bộ Khung
- **Tên dự án:** UniversalAgent
- **Bản chất:** Bộ khung cấu hình, quy tắc tư duy, kịch bản tự động hoá và mẫu chuẩn hoá dành cho AI Agent (Antigravity/Gemini, Claude Code, ChatGPT, Cursor, GitHub Copilot) khi làm việc cặp (Pair-Working) trên **MỌI loại tác vụ**: Sáng tác/Viết truyện, Quản trị/Văn phòng, Nghiên cứu/Hỏi đáp, Kỹ thuật/Lập trình.
- **Mục tiêu cốt lõi:**
  - Vận hành kỷ luật theo quy trình 4 pha (`explore -> propose -> confirm -> execute`).
  - Bảo vệ tính toàn vẹn của dữ liệu và tri thức nền tảng.
  - Tối ưu hoá Context Window (Token Conservation) và quản lý tài liệu sống (Living Docs).
  - **Một nguồn, mọi nền tảng:** rule viết một lần tại `.agents/rules/`, sinh ra cấu hình tương đương cho mọi AI. Đổi model hay đổi công cụ giữa chừng vẫn nhận đúng bộ quy tắc đó.

---

# 2. Bản Đồ Cấu Trúc Hệ Thống

Ký hiệu: 🔒 = viết tay (nguồn) · ⚙️ = do `scripts/sync-agents.js` sinh ra, không sửa trực tiếp.

```text
UniversalAgent/
├── .agents/                       # 🔒 NGUỒN DUY NHẤT — Antigravity đọc trực tiếp
│   ├── hooks.json                 #    Cấu hình Lifecycle Hooks
│   ├── hooks/                     #    Scripts bảo vệ an toàn và ngữ cảnh
│   ├── rules/                     #    Hệ thống quy tắc tư duy
│   ├── recipes/                   #    Bộ mẫu cấu trúc cho các tác vụ phổ quát
│   └── skills/                    #    Kỹ năng mở rộng (/explain, /plan, /verify...)
├── .claude/                       # Claude Code
│   ├── settings.json              # 🔒 Hooks + permissions.deny
│   ├── rules|recipes|hooks/       # ⚙️ Gương của .agents/
│   └── commands/                  # ⚙️ Sinh từ .agents/skills/
├── .cursor/rules/                 # ⚙️ Cursor (format .mdc hiện hành)
├── .cursorrules                   # ⚙️ Cursor (format cũ, giữ cho bản đời trước)
├── .github/copilot-instructions.md# ⚙️ GitHub Copilot
├── .openai/system-prompt.txt      # ⚙️ ChatGPT / OpenAI Custom GPT
├── AGENTS.md                      # Entry point Antigravity — mục 3 là ⚙️
├── CLAUDE.md                      # Entry point Claude Code — mục 4 là ⚙️
├── CHATGPT.md                     # Entry point ChatGPT — phần quy tắc là ⚙️
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

**Quy tắc vàng:** sửa rule thì sửa ở `.agents/rules/`, rồi chạy `node scripts/sync-agents.js`. Sửa thẳng vào file ⚙️ sẽ mất trắng ở lần đồng bộ kế tiếp.

---

# 3. Bản Đồ Rules, Recipes, Hooks & Skills

<!-- UA:RULES:BEGIN -->
<!-- UA:GENERATED — sinh bởi: node scripts/sync-agents.js -->

### Rules — quy tắc luôn có hiệu lực

| File | Chủ đề | Các mục |
| :--- | :--- | :--- |
| `core-protocol.md` | Universal Core Protocol | Triết lý Cốt lõi · Quy trình 4 Pha Bắt buộc · Tư duy Nguyên lý Gốc & Phản biện Kỹ thuật · Kỷ luật Ngữ cảnh & Tiết kiệm Token |
| `quality-standards.md` | Universal Quality Standards | Chuẩn Mực Đầu Ra (Output Standards) · Tư Duy Lập Luận & Kiểm Chứng (Reasoning & Grounding) · Kỷ Luật Trình Bày & Định Dạng · Bảo Vệ Tính Toàn Vẹn Của Dữ Liệu |
| `doc-policy.md` | Universal Living Docs Policy | Triết Lý Tài Liệu Sống (Living Docs) · Cấu Trúc Thư Mục Docs/ Chuẩn · Quy Định Định Dạng File .txt · Kỷ Luật Worklog Fragments (Docs/Done/) |
| `knowledge-graph.md` | Universal Knowledge Graph Dispatcher (Node-0) | Nguyên Tắc Điều Hướng 2 Tầng · Bảng Phân Vùng Kiến Thức Tổng Quát (Node-0) · Định Dạng Lưu Trỏ Nội Dung (Pointer Contract) · Quy Trình Mở Rộng Khi Thêm Phân Vùng Mới |

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
| `closeout-trigger.js` | Universal Closeout & Living Docs Trigger — PreToolUse trên tool chạy lệnh (Bash / run_command) |
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

---

# 4. Quy Trình Áp Dụng Vào Dự Án Mới
1. Chạy lệnh cài đặt `.\install.ps1 -TargetDir "đường_dẫn"` (hoặc `./install.sh /đường/dẫn`).
2. Mở không gian làm việc mới với AI và gõ `/init`.
3. AI sẽ phỏng vấn 3 câu cốt lõi và tự động thiết lập toàn bộ tài liệu (`AGENTS.md`, `CLAUDE.md`, `CHATGPT.md`) cùng tri thức gốc tại `Docs/SourceOfTruth/overview.txt`.

Cài lại lần nữa lên cùng thư mục là an toàn: installer chạy theo kiểu merge, không tạo thư mục lồng nhau, và không ghi đè `.gitignore` / `.gitattributes` / `.editorconfig` / `.claude/settings.json` sẵn có của dự án (bản của khung được đặt cạnh dưới tên `<file>.universalagent`).

---

# 5. Quy Chuẩn Pair-Programming
- **Quy trình 4 bước:** `explore -> propose -> confirm -> execute`. Dừng lại ở mỗi bước để xác nhận, không tự ý nhảy bước khi chưa được duyệt.
- **Tiêu chuẩn cốt lõi:** *Correct, minimal, verifiable* — giải quyết triệt để vấn đề tận gốc, không vá tạm thời.
- **Kỷ luật sửa đổi:** Đọc kỹ tài liệu hiện hành trước khi sửa; không tự ý chỉnh sửa ngoài phạm vi yêu cầu.
