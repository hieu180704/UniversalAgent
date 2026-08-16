# UniversalAgent — Universal AI Agent Framework & Starter Kit

# Mục lục
1. [Tổng Quan Bộ Khung](#1-tổng-quan-bộ-khung)
2. [Bản Đồ Cấu Trúc Hệ Thống](#2-bản-đồ-cấu-trúc-hệ-thống)
3. [Hệ Thống Rules & Guardrails](#3-hệ-thống-rules--guardrails)
4. [Hệ Thống Lifecycle Hooks](#4-hệ-thống-lifecycle-hooks)
5. [Hệ Thống Recipes (Mẫu Cấu Trúc)](#5-hệ-thống-recipes-mẫu-cấu-trúc)
6. [Hệ Thống Skills & Quản Trị Docs](#6-hệ-thống-skills--quản-trị-docs)
7. [Quy Trình Áp Dụng Vào Dự Án Mới](#7-quy-trình-áp-dụng-vào-dự-án-mới)
8. [Quy Chuẩn Pair-Programming](#8-quy-chuẩn-pair-programming)

---

# 1. Tổng Quan Bộ Khung
- **Tên dự án:** UniversalAgent
- **Bản chất:** Bộ khung cấu hình, quy tắc tư duy, kịch bản tự động hoá và mẫu chuẩn hoá dành cho AI Agent (Antigravity/Gemini, Claude Code, ChatGPT) khi làm việc cặp (Pair-Working) trên **MỌI loại tác vụ**: Sáng tác/Viết truyện, Quản trị/Văn phòng, Nghiên cứu/Hỏi đáp, Kỹ thuật/Lập trình.
- **Mục tiêu cốt lõi:**
  - Vận hành kỷ luật theo quy trình 4 pha (`explore -> propose -> confirm -> execute`).
  - Bảo vệ tính toàn vẹn của dữ liệu và tri thức nền tảng.
  - Tối ưu hoá Context Window (Token Conservation) và quản lý tài liệu sống (Living Docs).

---

# 2. Bản Đồ Cấu Trúc Hệ Thống
```text
UniversalAgent/
├── AGENTS.md & AGENTS_TEMPLATE.md # Entry point cho Gemini / Antigravity
├── CLAUDE.md & CLAUDE_TEMPLATE.md # Entry point cho Claude Code
├── CHATGPT.md & CHATGPT_TEMPLATE  # Entry point cho ChatGPT & OpenAI
├── .cursorrules                   # Cấu hình quy chuẩn cho Cursor IDE
├── .github/
│   └── copilot-instructions.md    # Hướng dẫn quy chuẩn cho GitHub Copilot
├── .editorconfig                  # Cưỡng chế quy chuẩn định dạng file UTF-8
├── .gitignore                     # Chặn file rác, file tạm, credentials
├── install.ps1                    # Script cài đặt 1 lệnh cho Windows (PowerShell)
├── install.sh                     # Script cài đặt 1 lệnh cho macOS & Linux (Bash)
├── README.md                      # Tài liệu tổng quan & hướng dẫn sử dụng
├── scripts/
│   └── sync-agents.js             # Công cụ tự động đồng bộ 3 chiều Rules & Recipes
├── .agents/                       # Cấu hình tối ưu cho Antigravity (Gemini)
│   ├── hooks.json                 # Cấu hình Lifecycle Hooks
│   ├── hooks/                     # Scripts bảo vệ an toàn và ngữ cảnh
│   ├── rules/                     # Hệ thống quy tắc tư duy (Always-on & Model-decision)
│   ├── recipes/                   # Bộ mẫu cấu trúc cho các tác vụ phổ quát
│   └── skills/                    # Kỹ năng mở rộng (/explain, /plan, /verify...)
├── .claude/                       # Cấu hình cho Claude Code
├── .openai/                       # Cấu hình cho ChatGPT / OpenAI
└── Docs/                          # Living Docs Framework
    ├── SourceOfTruth/             # Tri thức gốc, quy chuẩn cốt lõi, bối cảnh
    ├── Decisions/                 # Nhật ký quyết định quan trọng (ADR / Memos)
    ├── Handoffs/                  # Bản bàn giao phiên làm việc & bài học
    ├── QC/                        # Checklist kiểm thử & thẩm định chất lượng
    ├── Done/                      # Worklog fragments lưu vết các đầu việc đã xong
    └── prompts/                   # Kịch bản prompt nhanh & mẫu lệnh
```

---

# 3. Hệ Thống Rules & Guardrails
Nằm tại `.agents/rules/`:
- **`core-protocol.md`** *(always_on)*: Quy trình 4 pha bắt buộc, tư duy Root-cause, phản biện thẳng thắn, tiết kiệm token.
- **`knowledge-graph.md`** *(always_on)*: Dispatcher điều hướng 2 tầng giúp tìm thông tin chính xác mà không tốn token quét toàn bộ thư mục.
- **`quality-standards.md`** *(model_decision)*: Chuẩn mực đầu ra, tính hoàn chỉnh 100%, phân tách sự thật và suy đoán.
- **`doc-policy.md`** *(model_decision)*: Quy định tổ chức tài liệu sống, định dạng `.txt`, cấu trúc worklog fragment.

---

# 4. Hệ Thống Lifecycle Hooks
Nằm tại `.agents/hooks/`:
- **`safety-guard.js`** *(PreToolUse)*: Chặn sửa đổi trực tiếp các file nhạy cảm/bảo mật.
- **`read-guard.js`** *(PreToolUse)*: Cảnh báo khi đọc các file nhị phân lớn để bảo vệ Context Window.
- **`closeout-trigger.js`** *(PreToolUse)*: Tự động nhắc nhở cập nhật tài liệu sống và tạo worklog fragment khi commit/kết thúc task.

---

# 5. Hệ Thống Recipes (Mẫu Cấu Trúc)
Nằm tại `.agents/recipes/` (Tra cứu tại `00-recipe-index.md`):
- `recipe-analysis.md`: Mẫu bóc tách vấn đề & tìm nguyên nhân gốc rễ.
- `recipe-plan.md`: Mẫu lập kế hoạch hành động, WBS và lộ trình Milestones.
- `recipe-decision-memo.md`: Mẫu giải trình quyết định 7 phần & so sánh trade-offs.
- `recipe-deliverable.md`: Mẫu soạn thảo văn bản, tác phẩm hoặc tài liệu hoàn chỉnh.
- `recipe-synthesis.md`: Mẫu tổng hợp nghiên cứu đa nguồn & hỏi đáp chuyên sâu.
- `recipe-review-qc.md`: Mẫu thẩm định chất lượng, rà soát logic & nghiệm thu.

---

# 6. Hệ Thống Skills & Quản Trị Docs
- **Skills (`.agents/skills/`)**:
  - `/explain`: Tạo bản Decision Memo 7 phần để chốt hướng đi.
  - `/plan`: Phân rã mục tiêu thành kế hoạch từng bước rõ ràng.
  - `/verify`: Thẩm định chất lượng và rà soát lỗi logic.
  - `/doc`: Đồng bộ tài liệu sống theo thực tế mới nhất.
  - `/newsession`: Đóng phiên làm việc và tạo prompt bàn giao.
  - `/research`: Nghiên cứu chuyên sâu đa chiều một chủ đề.
  - `/system-cleanup`: Dọn dẹp tệp tin rác trong workspace.
  - `/worktree`: Thử nghiệm độc lập qua Git Worktree.

---

# 7. Quy Trình Áp Dụng Vào Dự Án Mới
1. Sao chép các thư mục `.agents/`, `.claude/`, `.openai/`, `Docs/`, và `.editorconfig` vào thư mục làm việc mới.
2. Sao chép file `AGENTS_TEMPLATE.md` thành `AGENTS.md` tại thư mục mới.
3. Cập nhật mục tiêu và bối cảnh cụ thể của dự án vào `Docs/SourceOfTruth/`.

---

# 8. Quy Chuẩn Pair-Programming
- **Quy trình 4 bước:** `explore -> propose -> confirm -> execute`. Dừng lại ở mỗi bước để xác nhận, không tự ý nhảy bước khi chưa được duyệt.
- **Tiêu chuẩn cốt lõi:** *Correct, minimal, verifiable* — giải quyết triệt để vấn đề tận gốc, không vá tạm thời.
- **Kỷ luật sửa đổi:** Đọc kỹ tài liệu hiện hành trước khi sửa; không tự ý chỉnh sửa ngoài phạm vi yêu cầu.
