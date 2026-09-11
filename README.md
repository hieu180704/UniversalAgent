# UniversalAgent 🤖

**Universal AI Agent Operating Framework & Starter Kit for Gemini (Antigravity IDE), Claude Code & Codex CLI**

---

# Mục lục
1. [Giới thiệu](#-giới-thiệu)
2. [Triết lý Cốt lõi](#-triết-lý-cốt-lõi)
3. [Kiến trúc Hệ thống 3 Engine](#-kiến-trúc-hệ-thống-3-engine)
4. [Áp dụng cho Mọi Lĩnh vực](#-áp-dụng-cho-mọi-lĩnh-vực)
5. [Cài đặt Nhanh (1 Click & CLI)](#-cài-đặt-nhanh-1-click--cli)
6. [Hệ thống Slash Commands & Skills](#-hệ-thống-slash-commands--skills)
7. [Hệ thống Hooks & Bảo Vệ Toàn Diện](#-hệ-thống-hooks--bảo-vệ-toàn-diện)

---

# 🌟 Giới thiệu

**UniversalAgent** là khung vận hành (Operating Framework) và chuẩn hóa toàn diện dành cho AI Agent trong môi trường Pair-Programming và phát triển phần mềm/dự án.

Được thiết kế theo kiến trúc **3 Engine Độc Lập**, UniversalAgent hỗ trợ song song và phân tách nguyên bản 3 nền tảng agent hàng đầu hiện nay:
- **Antigravity IDE (Gemini)** qua `.agents/`
- **Claude Code** qua `.claude/`
- **Codex CLI** qua `.codex/`

Mỗi engine sở hữu toàn bộ rules, recipes, skills, subagents và hooks riêng biệt bằng tệp tin thực tế, không dùng junctions hay symlinks. Mọi thay đổi tri thức được chuyển đổi cú pháp và đồng bộ tức thì qua kỹ năng `/sync-engines`.

---

# 🧠 Triết lý Cốt lõi

- **Quy trình 4 pha bắt buộc:** `Explore -> Propose -> Confirm -> Execute`. Không tự ý hành động khi chưa có sự xác nhận của người dùng.
- **Root-Cause & First-Principles:** Giải quyết tận gốc vấn đề, không đoán mò hay vá triệu chứng tạm bợ.
- **Living Docs Engine:** Tài liệu trong `Docs/` là nguồn chân lý duy nhất (Single Source of Truth), luôn được cập nhật song song với thực tế công việc.
- **Kỷ luật Ngữ cảnh & Tiết kiệm Token:** Điều hướng thông minh qua Knowledge Graph Node-0, chỉ đọc trúng đích dữ liệu cần thiết, cấm quét tràn lan.
- **Phản biện Kỹ thuật (Technical Pushback):** AI chủ động phát hiện rủi ro logic, nghẽn hiệu năng hoặc xung đột để phản biện và đề xuất giải pháp an toàn hơn.

---

# 🏗️ Kiến trúc Hệ thống 3 Engine

```text
UniversalAgent/
├── .agents/                        # ANTIGRAVITY IDE (GEMINI)
│   ├── rules/                      # Rules với frontmatter trigger: always_on / glob
│   ├── recipes/                    # Biểu mẫu cấu trúc đầu ra (1-1 copy)
│   ├── skills/                     # Kỹ năng agent (/init, /newsession, /wrap, /sync-engines)
│   ├── agents/                     # 6 Subagents Markdown (model: pro/flash)
│   ├── hooks/                      # Hooks I/O chuyên biệt cho Antigravity
│   └── hooks.json                  # Cấu hình trigger hooks chuẩn Antigravity
├── .claude/                        # CLAUDE CODE
│   ├── rules/                      # Rules với frontmatter description & paths
│   ├── recipes/                    # Biểu mẫu cấu trúc đầu ra (1-1 copy)
│   ├── skills/                     # Kỹ năng agent (/init, /newsession, /wrap, /sync-engines)
│   ├── agents/                     # 6 Subagents Markdown (model: opus/sonnet)
│   ├── hooks/                      # Hooks I/O chuyên biệt cho Claude Code
│   └── settings.json               # Phân quyền bảo mật & trigger hooks Claude
├── .codex/                         # CODEX CLI
│   ├── rules/                      # Rules Markdown thuần không frontmatter
│   ├── recipes/                    # Biểu mẫu cấu trúc đầu ra (1-1 copy)
│   ├── agents/                     # 6 Subagents TOML (developer_instructions inline)
│   ├── hooks/                      # Hooks I/O chuyên biệt cho Codex
│   └── hooks.json                  # Cấu hình trigger hooks chuẩn Codex
├── Docs/                           # HỆ THỐNG LIVING DOCS
│   ├── SourceOfTruth/              # Tri thức gốc, quy chuẩn cốt lõi, spec
│   ├── Decisions/                  # Nhật ký các quyết định quan trọng (ADR)
│   ├── Handoffs/                   # Bàn giao phiên làm việc & bài học kinh nghiệm
│   ├── QC/                         # Tiêu chí nghiệm thu & checklist kiểm thử
│   ├── Done/                       # Worklog fragments lưu vết công việc đã xong
│   └── prompts/                    # Kịch bản prompt tái sử dụng nhanh
├── AGENTS.md                       # Entry point cho Gemini / Antigravity & Codex
├── CLAUDE.md                       # Entry point cho Claude Code
├── AGENTS_TEMPLATE.md              # Template khởi đầu cho dự án mới (chỉ dùng lúc cài đặt)
├── CLAUDE_TEMPLATE.md              # Template khởi đầu cho dự án mới (chỉ dùng lúc cài đặt)
├── start.bat                       # Trình cài đặt 1-Click (Kéo-Thả) trên Windows
├── setup.bat                       # Trình cài đặt 1-Click (Kéo-Thả) trên Windows
├── install.ps1                     # Script cài đặt PowerShell
├── install.sh                      # Script cài đặt Bash (macOS/Linux)
└── README.md
```

---

# 🚀 Áp dụng cho Mọi Lĩnh vực

| Lĩnh vực | `Docs/SourceOfTruth/` | `Docs/Decisions/` | `Docs/QC/` | Mẫu Recipes Hay Dùng |
| :--- | :--- | :--- | :--- | :--- |
| **💻 Kỹ thuật & Lập trình** | Kiến trúc hệ thống, API specs, data models | Quyết định kiến trúc (ADR), Trade-offs | Test cases, linter, memory review | `recipe-plan`, `recipe-review-qc` |
| **🏢 Quản trị & Dự án** | Quy trình chuẩn (SOP), mục tiêu dự án | Quyết định chiến lược, biên bản họp | Checklist nghiệm thu công việc | `recipe-plan`, `recipe-decision-memo` |
| **🔍 Nghiên cứu & Phân tích** | Dữ liệu kiểm chứng, tài liệu tham khảo | So sánh giả thuyết, ưu/nhược điểm | Kiểm chứng tính xác thực (Fact-check) | `recipe-synthesis`, `recipe-analysis` |
| **✍️ Sáng tạo & Viết lách** | Hồ sơ nhân vật, bối cảnh thế giới, timeline | Hướng đi cốt truyện, số phận nhân vật | Kiểm tra mâu thuẫn lore, văn phong | `recipe-deliverable`, `recipe-review-qc` |

---

# 📦 Cài đặt Nhanh (1 Click & CLI)

### Cách 1: Kéo & Thả (Windows 1-Click)
- Kéo thư mục dự án cần cài đặt và thả trực tiếp vào file `start.bat` (hoặc `setup.bat`).
- Hoặc nhấp đúp vào `start.bat` và dán đường dẫn thư mục dự án.

### Cách 2: Qua Terminal (PowerShell / Bash)
- **Windows (PowerShell):**
  ```powershell
  .\install.ps1 -TargetDir "D:\MyProject"
  ```
- **macOS & Linux (Bash):**
  ```bash
  ./install.sh /path/to/my-project
  ```

> 💡 **Khởi động dự án:** Sau khi cài đặt, mở dự án trong Antigravity IDE, Claude Code hoặc Codex và gõ lệnh `/init`. AI sẽ tự động phỏng vấn bối cảnh và thiết lập toàn bộ hệ thống tài liệu ban đầu!

---

# ⚡ Hệ thống Slash Commands & Skills

| Lệnh | Mô tả |
| :--- | :--- |
| `/init` | Khởi tạo và thiết lập dự án mới: phỏng vấn bối cảnh, điền AGENTS.md/CLAUDE.md và tạo tài liệu SourceOfTruth. |
| `/sync-engines` | Tự động chuyển đổi cú pháp và đồng bộ tri thức (Rules, Recipes, Skills, Agents) giữa 3 AI Engine. |
| `/newsession` | Đóng phiên làm việc gọn khi task chưa xong, tạo fragment Docs/Done/ và sinh prompt 4-field làm tiếp. |
| `/wrap` | Đóng gói hoàn tất Task/Milestone lớn: sync doc, archive handoff DONE, commit narrow và retrospective đúc kết. |

---

# 🛡️ Hệ thống Hooks & Bảo Vệ Toàn Diện

Mọi thao tác của AI đều được giám sát bởi hệ thống Hooks độc lập của từng engine:
1. **Safety Guard (`safety-guard.js`):** Ngăn chặn hoàn toàn việc AI vô tình đọc, ghi hoặc commit các tệp nhạy cảm (`.env`, file khóa SSH/RSA, credentials, secrets) và các lệnh huỷ diệt diện rộng.
2. **Read Guard (`read-guard.js`):** Cảnh báo khi AI mở các file media/nhị phân lớn làm lãng phí context window.
3. **Closeout Trigger (`closeout-trigger.js`):** Cảnh báo và nhắc nhở AI cập nhật Living Docs trước khi commit Git, và nhắc nhở chạy `/sync-engines` khi có thay đổi tài nguyên AI.
4. **Doc Budget Guard (`doc-budget.js`):** Tự động đo độ dài tài liệu sau khi ghi, cưỡng chế hạn mức token theo cơ chế ratchet chống phình ngữ cảnh và kiểm soát khai báo hook registry.
5. **Language Guard (`language-guard.js`):** Cưỡng chế văn xuôi trong tài liệu Markdown/txt bắt buộc viết bằng tiếng Việt có dấu (≥90%).
