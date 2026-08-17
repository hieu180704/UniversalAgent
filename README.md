# UniversalAgent 🌐
**Universal AI Agent Operating Framework & Starter Kit for Gemini, Claude Code, ChatGPT, Cursor & Copilot**

---

## 📖 Mục lục
1. [Giới thiệu](#-giới-thiệu)
2. [Triết lý Cốt lõi](#-triết-lý-cốt-lõi)
3. [Cấu trúc Hệ thống](#-cấu-trúc-hệ-thống)
4. [Áp dụng cho Mọi Lĩnh vực](#-áp-dụng-cho-mọi-lĩnh-vực)
5. [Cài đặt Nhanh (1 Lệnh)](#-cài-đặt-nhanh-1-lệnh)
6. [Hệ thống Lệnh Slash & Meta-Skills](#-hệ-thống-lệnh-slash--meta-skills)
7. [Đồng bộ Đa Nền tảng](#-đồng-bộ-đa-nền-tảng)

---

## 🌟 Giới thiệu
**UniversalAgent** là một bộ khung vận hành và chuẩn hoá toàn diện dành cho AI Agent. Được thiết kế theo hướng **phổ quát (generic & flexible)**, UniversalAgent biến bất kỳ mô hình AI nào (Gemini/Antigravity, Claude Code, ChatGPT) thành một cộng sự đắc lực, kỷ luật cao, giải quyết triệt để bài toán từ gốc và luôn đồng bộ tài liệu sống.

---

## 🧠 Triết lý Cốt lõi
- **Quy trình 4 pha bắt buộc:** `Explore -> Propose -> Confirm -> Execute`. Không tự ý hành động khi chưa có sự xác nhận.
- **Root-Cause & First-Principles:** Giải quyết tận gốc nguyên nhân, không đoán mò hay vá triệu chứng.
- **Living Docs Engine:** Tài liệu trong `Docs/` là nguồn chân lý duy nhất (Single Source of Truth), luôn được cập nhật song song với thực tế.
- **Tiết kiệm Token & Ngữ cảnh:** Điều hướng 2 tầng qua Knowledge Graph Node-0, chỉ đọc trúng đích dữ liệu cần thiết.

---

## 📂 Cấu trúc Hệ thống
```text
UniversalAgent/
├── AGENTS.md                # Entry point cho Gemini / Antigravity
├── CLAUDE.md                # Entry point cho Claude Code
├── CHATGPT.md               # Entry point cho ChatGPT / OpenAI
├── .cursorrules              # Cấu hình Cursor IDE
├── .github/copilot-instructions.md # Cấu hình GitHub Copilot
├── scripts/
│   └── sync-agents.js       # Đồng bộ 3 chiều rules & recipes giữa các AI
├── install.ps1 / install.sh # Cài đặt 1 lệnh vào bất kỳ thư mục nào
├── .agents/
│   ├── hooks/               # Safety guard, token guard, closeout trigger
│   ├── rules/               # Core protocol, knowledge graph, quality standards, doc policy
│   ├── recipes/             # Analysis, plan, decision memo, deliverable, synthesis, review QC
│   └── skills/              # /explain, /plan, /verify, /doc, /newsession, /research...
└── Docs/                    # Living Docs Framework
    ├── SourceOfTruth/       # Tri thức gốc, quy chuẩn cốt lõi, bối cảnh
    ├── Decisions/           # Nhật ký quyết định quan trọng (ADR / Memos)
    ├── Handoffs/            # Bản bàn giao phiên làm việc & bài học
    ├── QC/                  # Checklist kiểm thử & thẩm định chất lượng
    └── Done/                # Worklog fragments lưu vết các đầu việc đã xong
```

---

## 🎯 Áp dụng cho Mọi Lĩnh vực

| Lĩnh vực | `Docs/SourceOfTruth/` | `Docs/Decisions/` | `Docs/QC/` | Mẫu Recipes Sử Dụng |
| :--- | :--- | :--- | :--- | :--- |
| **✍️ Sáng tác & Viết truyện** | Hồ sơ nhân vật, bối cảnh thế giới, timeline | Hướng đi cốt truyện, số phận nhân vật | Kiểm tra mâu thuẫn lore, văn phong | `recipe-deliverable`, `recipe-review-qc` |
| **💼 Quản trị & Văn phòng** | Quy trình chuẩn (SOP), mục tiêu dự án | Quyết định chiến lược, biên bản họp | Checklist nghiệm thu công việc | `recipe-plan`, `recipe-decision-memo` |
| **🔍 Hỏi đáp & Nghiên cứu** | Tài liệu tham khảo, dữ liệu kiểm chứng | So sánh giả thuyết, ưu/nhược điểm | Kiểm chứng tính xác thực (Fact-check) | `recipe-synthesis`, `recipe-analysis` |
| **💻 Kỹ thuật & Lập trình** | Kiến trúc hệ thống, API specs | Quyết định kiến trúc (ADR), Trade-offs | Test cases, linter, memory review | `recipe-plan`, `recipe-review-qc` |

---

## ⚡ Cài đặt Nhanh (1-Click & 1 Lệnh)

### Cách 1: Click chuột 1-Chạm (Windows)
- **Kéo & Thả:** Kéo thư mục dự án đích thả trực tiếp vào file [`setup.bat`](file:///c:/Project/UniversalAgent/setup.bat).
- **Hoặc Click đúp:** Mở [`setup.bat`](file:///c:/Project/UniversalAgent/setup.bat) và dán đường dẫn thư mục dự án cần cài.

### Cách 2: Qua Terminal (PowerShell / Bash)
- **Windows (PowerShell):**
  ```powershell
  .\install.ps1 -TargetDir "D:\MyWorkspace"
  ```
- **macOS & Linux (Bash):**
  ```bash
  ./install.sh /path/to/workspace
  ```

> 💡 **Khởi tạo dự án:** Sau khi cài đặt, mở dự án trong trình soạn thảo với AI (Gemini/Antigravity, Claude Code, ChatGPT) và gõ lệnh `/init`. AI sẽ tự động phỏng vấn bối cảnh và thiết lập toàn bộ tài liệu dự án!


---

## 🛠 Hệ thống Lệnh Slash & Meta-Skills
- `/init`: Khởi tạo và thiết lập tài liệu dự án mới (onboarding phỏng vấn bối cảnh & tạo SourceOfTruth).
- `/explain`: Tạo bản Decision Memo 7 phần để giải quyết vấn đề hóc búa.
- `/plan`: Phân rã mục tiêu thành kế hoạch từng bước (WBS & Milestones).
- `/verify`: Thẩm định chất lượng, rà soát logic và kiểm tra checklist.
- `/doc`: Đồng bộ tài liệu sống với thực tế không gian làm việc.
- `/newsession`: Đóng gói phiên làm việc, lưu worklog và tạo prompt bàn giao.
- `/research`: Nghiên cứu chuyên sâu đa chiều một chủ đề.
- `/system-cleanup`: Dọn dẹp tệp tin rác và dữ liệu thừa.
- `/worktree`: Quản lý Git Worktree để thử nghiệm độc lập.


---

## 🔄 Đồng bộ Đa Nền tảng
Khi chỉnh sửa bất kỳ Rule hay Recipe nào, chạy lệnh:
```bash
node scripts/sync-agents.js
```
Toàn bộ thay đổi sẽ được tự động đồng bộ sang Claude Code, ChatGPT, Cursor và Copilot!
