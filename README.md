# UniversalAgent 🤖

**Universal AI Agent Operating Framework & Starter Kit for Gemini (Antigravity IDE) & Claude Code**

---

# Mục lục
1. [Giới thiệu](#-giới-thiệu)
2. [Triết lý Cốt lõi](#-triết-lý-cốt-lõi)
3. [Kiến trúc Hệ thống](#-kiến-trúc-hệ-thống)
4. [Áp dụng cho Mọi Lĩnh vực](#-áp-dụng-cho-mọi-lĩnh-vực)
5. [Cài đặt Nhanh (1 Click & CLI)](#-cài-đặt-nhanh-1-click--cli)
6. [Hệ thống Slash Commands & Skills](#-hệ-thống-slash-commands--skills)
7. [Hệ thống Hooks & Bảo Vệ Toàn Diện](#-hệ-thống-hooks--bảo-vệ-toàn-diện)

---

# 🌟 Giới thiệu

**UniversalAgent** là khung vận hành (Operating Framework) và chuẩn hóa toàn diện dành cho AI Agent trong môi trường Pair-Programming và phát triển phần mềm/dự án.

Được thiết kế theo kiến trúc **Lõi Trung Lập (Neutral Core `.ai/`)**, UniversalAgent hỗ trợ song song và đối xứng cả hai nền tảng agent hàng đầu hiện nay:
- **Antigravity IDE (Gemini)** qua cấu hình adapter `.agents/`
- **Claude Code** qua cấu hình adapter `.claude/`

Toàn bộ tri thức, quy tắc (Rules), biểu mẫu (Recipes), kỹ năng (Skills) và hook kiểm soát (Hooks) được đồng bộ 100% không trùng lặp thông qua cơ chế liên kết **Directory Junctions**.

---

# 🧠 Triết lý Cốt lõi

- **Quy trình 4 pha bắt buộc:** `Explore -> Propose -> Confirm -> Execute`. Không tự ý hành động khi chưa có sự xác nhận của người dùng.
- **Root-Cause & First-Principles:** Giải quyết tận gốc vấn đề, không đoán mò hay vá triệu chứng tạm bợ.
- **Living Docs Engine:** Tài liệu trong `Docs/` là nguồn chân lý duy nhất (Single Source of Truth), luôn được cập nhật song song với thực tế công việc.
- **Kỷ luật Ngữ cảnh & Tiết kiệm Token:** Điều hướng thông minh qua Knowledge Graph Node-0, chỉ đọc trúng đích dữ liệu cần thiết, cấm quét tràn lan.
- **Phản biện Kỹ thuật (Technical Pushback):** AI chủ động phát hiện rủi ro logic, nghẽn hiệu năng hoặc xung đột để phản biện và đề xuất giải pháp an toàn hơn.

---

# 🏗️ Kiến trúc Hệ thống

```text
UniversalAgent/
├── .ai/                            # LÕI TRUNG LẬP (Single Source of Truth cho AI)
│   ├── hooks/                      # Bộ hook bảo vệ & kiểm soát I/O dùng chung
│   │   ├── hook-adapter.js         # Phân giải I/O giữa Antigravity & Claude Code
│   │   ├── safety-guard.js         # Chặn thao tác trên file nhạy cảm (.env, keys)
│   │   ├── read-guard.js           # Cảnh báo đọc file nhị phân/media lớn
│   │   ├── closeout-trigger.js     # Nhắc cập nhật Living Docs trước khi commit
│   │   └── doc-budget.js           # Kiểm soát ngân sách độ dài tài liệu & hook registry
│   ├── rules/                      # Quy tắc chuẩn (Rules) auto-load mỗi phiên
│   │   ├── core-protocol.md        # 4 Pha bắt buộc & kỷ luật ngữ cảnh
│   │   ├── quality-standards.md    # Chuẩn mực đầu ra 100% hoàn chỉnh
│   │   ├── doc-policy.md           # Quy định định dạng .txt & worklog fragments
│   │   └── knowledge-graph.md      # Dispatcher điều hướng tri thức 3 tầng (Node-0)
│   ├── recipes/                    # Biểu mẫu cấu trúc đầu ra (Output Templates)
│   │   ├── 00-recipe-index.md
│   │   ├── recipe-analysis.md      # Bóc tách & phân tích nguyên nhân gốc
│   │   ├── recipe-decision-memo.md # Bản giải trình quyết định 7 phần
│   │   ├── recipe-deliverable.md   # Soạn thảo văn bản hoàn chỉnh
│   │   ├── recipe-plan.md          # Kế hoạch hành động WBS & Milestones
│   │   ├── recipe-review-qc.md     # Thẩm định chất lượng & kiểm lỗi logic
│   │   └── recipe-synthesis.md     # Tổng hợp nghiên cứu đa chiều
│   ├── skills/                     # Kỹ năng thao tác (Agent Skills)
│   │   ├── doc/SKILL.md            # Đồng bộ tài liệu sống (/doc)
│   │   ├── explain/SKILL.md        # Lập Decision Memo 7 phần (/explain)
│   │   ├── init/SKILL.md           # Onboarding & khởi tạo dự án (/init)
│   │   ├── newsession/SKILL.md     # Đóng phiên làm việc gọn (/newsession)
│   │   ├── plan/SKILL.md           # Phân rã mục tiêu & lập kế hoạch (/plan)
│   │   ├── research/SKILL.md       # Nghiên cứu chuyên sâu đa nguồn (/research)
│   │   ├── system-cleanup/SKILL.md # Dọn dẹp tệp tin rác (/system-cleanup)
│   │   ├── verify/SKILL.md         # Thẩm định chất lượng (/verify)
│   │   ├── worktree/SKILL.md       # Quản lý Git Worktree độc lập (/worktree)
│   │   └── wrap/SKILL.md           # Đóng gói hoàn tất Task/Milestone (/wrap)
│   └── setup-links.js              # Script tự động tạo Directory Junctions
├── .agents/                        # ADAPTER CHO GEMINI / ANTIGRAVITY IDE
│   ├── hooks.json                  # Cấu hình trigger hooks chuẩn Antigravity
│   ├── skills.json                 # Định tuyến thư mục skills
│   ├── rules                       # [Junction] -> .ai/rules
│   └── skills                      # [Junction] -> .ai/skills
├── .claude/                        # ADAPTER CHO CLAUDE CODE
│   ├── settings.json               # Phân quyền bảo mật & trigger hooks Claude
│   ├── rules                       # [Junction] -> .ai/rules
│   └── skills                      # [Junction] -> .ai/skills
├── Docs/                           # HỆ THỐNG LIVING DOCS
│   ├── SourceOfTruth/              # Tri thức gốc, quy chuẩn cốt lõi, spec
│   ├── Decisions/                  # Nhật ký các quyết định quan trọng (ADR)
│   ├── Handoffs/                   # Bàn giao phiên làm việc & bài học kinh nghiệm
│   ├── QC/                         # Tiêu chí nghiệm thu & checklist kiểm thử
│   ├── Done/                       # Worklog fragments lưu vết công việc đã xong
│   └── prompts/                    # Kịch bản prompt tái sử dụng nhanh
├── AGENTS.md                       # Entry point cho Gemini / Antigravity
├── CLAUDE.md                       # Entry point cho Claude Code
├── AGENTS_TEMPLATE.md              # Template khởi đầu cho dự án mới
├── CLAUDE_TEMPLATE.md              # Template khởi đầu cho dự án mới
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
- Kéo thư mục dự án cần cài đặt và thả trực tiếp vào file `setup.bat`.
- Hoặc nhấp đúp vào `setup.bat` và dán đường dẫn thư mục dự án.

### Cách 2: Qua Terminal (PowerShell / Bash)
- **Windows (PowerShell):**
  ```powershell
  .\install.ps1 -TargetDir "D:\MyProject"
  ```
- **macOS & Linux (Bash):**
  ```bash
  ./install.sh /path/to/my-project
  ```

> 💡 **Khởi động dự án:** Sau khi cài đặt, mở dự án trong Antigravity IDE hoặc Claude Code và gõ lệnh `/init`. AI sẽ tự động phỏng vấn bối cảnh và thiết lập toàn bộ hệ thống tài liệu ban đầu!

---

# ⚡ Hệ thống Slash Commands & Skills

| Lệnh | Mô tả |
| :--- | :--- |
| `/init` | Khởi tạo và thiết lập dự án mới: phỏng vấn bối cảnh, điền AGENTS.md/CLAUDE.md và tạo tài liệu SourceOfTruth. |
| `/plan` | Phân rã mục tiêu lớn thành kế hoạch hành động từng bước (WBS, Milestones, DoD). |
| `/explain` | Tổng hợp vấn đề phức tạp thành bản Decision Memo 7 phần chuẩn mực để chốt giải pháp. |
| `/verify` | Thẩm định chất lượng, rà soát mâu thuẫn logic, bối cảnh hoặc kiểm tra checklist nghiệm thu. |
| `/doc` | Đồng bộ tài liệu sống trong Docs/SourceOfTruth/ với thực tế không gian làm việc. |
| `/newsession` | Đóng phiên làm việc gọn khi task chưa xong, tạo fragment Docs/Done/ và sinh prompt 4-field làm tiếp. |
| `/wrap` | Đóng gói hoàn tất Task/Milestone lớn: sync doc, archive handoff DONE, commit narrow và retrospective đúc kết. |
| `/research` | Nghiên cứu chuyên sâu đa chiều một chủ đề phức tạp, lập ma trận so sánh đối chiếu. |
| `/system-cleanup`| Rà soát và dọn dẹp các tệp tin rác, bản nháp trùng lặp trong workspace. |
| `/worktree` | Tạo và quản lý Git Worktree độc lập để thử nghiệm song song. |

---

# 🛡️ Hệ thống Hooks & Bảo Vệ Toàn Diện

Mọi thao tác của AI đều được giám sát bởi hệ thống Universal Hooks:
1. **Safety Guard (`safety-guard.js`):** Ngăn chặn hoàn toàn việc AI vô tình đọc, ghi hoặc commit các tệp nhạy cảm (`.env`, file khóa SSH/RSA, credentials, secrets).
2. **Read Guard (`read-guard.js`):** Cảnh báo khi AI mở các file media/nhị phân lớn làm lãng phí context window.
3. **Closeout Trigger (`closeout-trigger.js`):** Cảnh báo và nhắc nhở AI cập nhật Living Docs (`Docs/SourceOfTruth/`, `Docs/Done/`) trước khi thực hiện `git commit`.
4. **Doc Budget Guard (`doc-budget.js`):** Tự động đo độ dài tài liệu sau khi ghi, cưỡng chế hạn mức token theo cơ chế ratchet chống phình ngữ cảnh và kiểm soát tính toàn vẹn của hook registry.
