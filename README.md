# UniversalAgent 🤖

> **Khung Vận Hành Đa Nền Tảng Cho AI Agent — Chuẩn hoá song song 3 Engine Độc Lập: Gemini (Antigravity IDE), Claude Code & Codex CLI.**

[![Engine - Antigravity](https://img.shields.io/badge/Engine-Antigravity%20(Gemini)-4285F4?style=flat-square&logo=google)](https://github.com/)
[![Engine - Claude Code](https://img.shields.io/badge/Engine-Claude%20Code-D97706?style=flat-square&logo=anthropic)](https://github.com/)
[![Engine - Codex CLI](https://img.shields.io/badge/Engine-Codex%20CLI-10A37F?style=flat-square&logo=openai)](https://github.com/)
[![Platform - Windows | macOS | Linux](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-gray?style=flat-square)](https://github.com/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20External-success?style=flat-square)](https://github.com/)

---

# Mục lục
1. [Giới Thiệu Tổng Quan](#1-giới-thiệu-tổng-quan)
2. [Quy Trình 4 Pha Bắt Buộc](#2-quy-trình-4-pha-bắt-buộc)
3. [Cài Đặt Siêu Tốc Trong 30 Giây](#3-cài-đặt-siêu-tốc-trong-30-giây)
4. [Bản Đồ Đối Chiếu 3 AI Engine](#4-bản-đồ-đối-chiếu-3-ai-engine)
5. [Cấu Trúc Thư Mục Dự Án](#5-cấu-trúc-thư-mục-dự-án)
6. [Hệ Thống 6 Subagents Chuyên Biệt](#6-hệ-thống-6-subagents-chuyên-biệt)
7. [Hệ Thống Slash Commands & Skills](#7-hệ-thống-slash-commands--skills)
8. [Bản Đồ Ngữ Cảnh Living Docs](#8-bản-đồ-ngữ-cảnh-living-docs)
9. [5 Lớp Lá Chắn Bảo Vệ (Hooks Security)](#9-5-lớp-lá-chắn-bảo-vệ-hooks-security)

---

# 1. Giới Thiệu Tổng Quan

**UniversalAgent** là khung vận hành (Operating Framework) và bộ công cụ chuẩn hóa toàn diện dành cho AI Agent trong môi trường Pair-Programming và phát triển dự án thực chiến.

### ✨ Điểm Khác Biệt Cốt Lõi
- **3 Engine Hoàn Toàn Độc Lập:** Tách biệt nguyên bản cho **Antigravity IDE (Gemini)** (`.agents/`), **Claude Code** (`.claude/`) và **Codex CLI** (`.codex/`).
- **100% Real Files:** Không dùng Directory Junctions hay Symlinks trung gian dễ gãy; sao chép trực tiếp tệp tin thật, hoạt động bền bỉ trên mọi hệ điều hành.
- **Đồng Bộ Tri Thức Tự Động (`/sync-engines`):** Viết quy chuẩn một nơi, lệnh sync tự động chuyển đổi Frontmatter, TOML và model tier cho 2 engine còn lại với **0% drift**.
- **Living Docs Engine:** Tài liệu trong `Docs/` là nguồn chân lý duy nhất (Single Source of Truth), luôn phản ánh chính xác trạng thái hiện tại của codebase.
- **Không Cài Đặt Phụ Thuộc (Zero External Dependencies):** Toàn bộ hooks và kịch bản vận hành bằng Node.js thuần native.

---

# 2. Quy Trình 4 Pha Bắt Buộc

Mọi tương tác phức tạp hoặc yêu cầu tạo mới/chỉnh sửa mã nguồn đều phải tuân thủ nghiêm ngặt chu trình:

```text
┌──────────────┐       ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  1. EXPLORE  │ ────► │  2. PROPOSE  │ ────► │  3. CONFIRM  │ ────► │  4. EXECUTE  │
└──────────────┘       └──────────────┘       └──────────────┘       └──────────────┘
 Đọc & định vị          Đề xuất giải pháp      Dừng đợi người         Thực thi đúng
 chính xác nguồn.       & chỉ rõ trade-offs.   dùng phê duyệt.        phạm vi đã duyệt.
```

- **Explore:** Chỉ đọc trúng đích dòng code/tài liệu liên quan qua Knowledge Graph, không quét tràn lan gây phình token.
- **Propose:** Trình bày nguyên nhân gốc rễ (Root Cause), giải pháp kèm rủi ro và phạm vi chỉnh sửa.
- **Confirm:** **Dừng lại đợi người dùng xác nhận.** Im lặng không đồng nghĩa với đồng thuận (*Silence ≠ Approval*).
- **Execute:** Triển khai đúng phạm vi, tự động kiểm tra chéo và đồng bộ tài liệu sống song song.

---

# 3. Cài Đặt Siêu Tốc Trong 30 Giây

### Bước 1: Sao chép khung vào dự án đích

- **Windows (1-Click Kéo & Thả):** Kéo thư mục dự án cần cài đặt và thả trực tiếp vào file [`start.bat`](file:///C:/Project/UniversalAgent/start.bat).
- **Windows (PowerShell):**
  ```powershell
  .\install.ps1 -TargetDir "D:\MyProject"
  ```
- **macOS & Linux (Bash):**
  ```bash
  ./install.sh /path/to/my-project
  ```

### Bước 2: Mở dự án bằng AI Engine ưa thích
Mở thư mục dự án đích bằng Antigravity IDE, Claude Code hoặc Codex CLI.

### Bước 3: Khởi động dự án với `/init`
Gõ `/init` trong khung chat của AI. Agent sẽ tự động phỏng vấn bối cảnh dự án, khởi tạo `AGENTS.md` / `CLAUDE.md` và thiết lập hệ thống tài liệu ban đầu.

> [!TIP]
> **Bộ cài an toàn (Idempotent):** Installer không bao giờ ghi đè lên cấu hình cá nhân đã có của dự án đích (`.editorconfig`, `.gitignore`, `.gitattributes`, `AGENTS.md`, `CLAUDE.md`).

---

# 4. Bản Đồ Đối Chiếu 3 AI Engine

UniversalAgent quản lý tri thức song song giữa 3 nền tảng AI hàng đầu:

| Tiêu chí | Antigravity IDE (Gemini) | Claude Code | Codex CLI |
| :--- | :--- | :--- | :--- |
| **Thư mục cấu hình** | `.agents/` | `.claude/` | `.codex/` |
| **Định dạng Rules** | Markdown + Frontmatter (`trigger: always_on / glob`) | Markdown + Frontmatter (`description:`, `paths:`) | Markdown thuần túy (Không Frontmatter) |
| **Định dạng Subagents** | Markdown (`model: pro / flash`) | Markdown (`model: opus / sonnet`) | TOML (`model = "gpt-5.4-mini"`) |
| **Entry Point** | `AGENTS.md` | `CLAUDE.md` | `AGENTS.md` |
| **Trigger Hooks** | `.agents/hooks.json` | `.claude/settings.json` | `.codex/hooks.json` |
| **Cơ chế Đồng bộ** | **Nguồn chuẩn (Source)** | Tự động sinh qua `/sync-engines` | Tự động sinh qua `/sync-engines` |

> [!NOTE]
> Khi thêm hoặc sửa Rule, Recipe hay Subagent tại `.agents/`, chỉ cần chạy:
> ```bash
> node .agents/skills/sync-engines/scripts/sync-engines.js --source agents
> ```
> Hệ thống sẽ tự động đồng bộ sang `.claude/` và `.codex/` với cú pháp chuẩn xác cho từng engine.

---

# 5. Cấu Trúc Thư Mục Dự Án

```text
UniversalAgent/
├── .agents/                        # Cấu hình Antigravity IDE (Gemini)
│   ├── rules/                      # Rules với YAML frontmatter (trigger: always_on / glob)
│   ├── recipes/                    # Biểu mẫu cấu trúc đầu ra chuẩn hóa (Analysis, Plan, QC...)
│   ├── skills/                     # Bộ kỹ năng điều phối (/init, /newsession, /wrap, /sync-engines)
│   ├── agents/                     # Khai báo 6 Subagents Markdown chuyên biệt
│   ├── hooks/                      # Kịch bản bảo vệ I/O độc lập cho Antigravity
│   └── hooks.json                  # Registry đăng ký hook triggers
├── .claude/                        # Cấu hình Claude Code
│   ├── rules/                      # Rules với YAML frontmatter (description & paths)
│   ├── recipes/                    # Recipes đồng bộ 1-1
│   ├── skills/                     # Skills đồng bộ 1-1
│   ├── agents/                     # Subagents Markdown chuẩn Claude (opus/sonnet)
│   ├── hooks/                      # Kịch bản bảo vệ I/O độc lập cho Claude Code
│   └── settings.json               # Cấu hình phân quyền & hook triggers
├── .codex/                         # Cấu hình Codex CLI
│   ├── rules/                      # Rules Markdown thuần túy
│   ├── recipes/                    # Recipes đồng bộ 1-1
│   ├── agents/                     # Subagents TOML chuẩn Codex
│   ├── hooks/                      # Kịch bản bảo vệ I/O độc lập cho Codex
│   └── hooks.json                  # Registry đăng ký hook triggers
├── Docs/                           # Hệ thống Living Docs (Single Source of Truth)
│   ├── SourceOfTruth/              # Tri thức gốc, kiến trúc hệ thống, spec
│   ├── Decisions/                  # Nhật ký quyết định quan trọng (ADR / Decision Memos)
│   ├── Handoffs/                   # Bàn giao phiên làm việc & bài học kinh nghiệm
│   ├── QC/                         # Tiêu chí nghiệm thu & checklist kiểm thử
│   ├── Done/                       # Worklog fragments lưu vết công việc đã xong
│   └── prompts/                    # Thư viện prompt tái sử dụng nhanh
├── .editorconfig                   # Chuẩn format file mã nguồn & văn bản
├── .gitattributes                  # Chuẩn hoá xử lý kết thúc dòng (LF)
├── .gitignore                      # Danh sách bỏ qua của Git
├── AGENTS.md                       # Chỉ dẫn vận hành cho Antigravity IDE & Codex CLI
├── CLAUDE.md                       # Chỉ dẫn vận hành cho Claude Code
├── AGENTS_TEMPLATE.md              # Template khởi đầu cho dự án mới
├── CLAUDE_TEMPLATE.md              # Template khởi đầu cho dự án mới
├── start.bat                       # Trình cài đặt 1-Click (Kéo-Thả) trên Windows
├── install.ps1                     # Script cài đặt PowerShell trên Windows
├── install.sh                      # Script cài đặt Bash trên macOS & Linux
└── README.md                       # Tài liệu hướng dẫn tổng quan
```

---

# 6. Hệ Thống 6 Subagents Chuyên Biệt

UniversalAgent trang bị sẵn 6 chuyên gia AI độc lập, tự động gọi qua ngữ cảnh hoặc chỉ định thủ công:

| Subagent | Chế độ | Vai Trò & Nhiệm Vụ Cốt Lõi | Ngữ Cảnh Kích Hoạt |
| :--- | :---: | :--- | :--- |
| `adversary` | Read-only | **Phản biện kỹ thuật (Red-team):** Tìm giả định sai, rủi ro tiềm ẩn, lỗ hổng kiến trúc và chi phí bảo trì ngầm. | "phản biện", "red-team", "đánh giá rủi ro" |
| `code-analyzer` | Read-only | **Phân tích hệ thống:** Bóc tách bản đồ quan hệ phụ thuộc (dependencies), luồng thực thi bottom-up và tìm code thừa (dead code). | "phân tích hệ thống", "giải thích luồng", "tìm dead code" |
| `code-reviewer` | Read-only | **Đánh giá chất lượng mã nguồn:** Rà soát bugs, bảo mật, suy giảm hiệu năng và sai lệch logic so với spec. | "review", "audit code", "tìm bug", "kiểm tra an toàn" |
| `code-writer` | Write | **Hiện thực hoá mã nguồn:** Trực tiếp viết code mới, implement tính năng chuẩn kỹ thuật và kiến trúc đã thống nhất. | "implement", "viết code", "tạo hàm", "build tính năng" |
| `convention-enforcer` | Read-only | **Giám sát quy chuẩn:** Kiểm tra tuân thủ coding conventions, cấu trúc thư mục, quy tắc đặt tên và ranh giới kiến trúc. | "check convention", "soi quy chuẩn", "kiểm tra lint" |
| `research-expert` | Read-only | **Điều tra chuyên sâu:** Khảo sát mã nguồn, tra cứu thư viện ngoài và điều hướng tài liệu qua Knowledge Graph. | "research", "điều tra", "khảo sát mảng X", "tìm hiểu sâu" |

---

# 7. Hệ Thống Slash Commands & Skills

Các kỹ năng vận hành cấp cao giúp tự động hóa quy trình làm việc:

| Lệnh | Thời Điểm Dùng | Tác Vụ Tự Động Thực Hiện |
| :--- | :--- | :--- |
| **`/init`** | Bắt đầu dự án mới | Phỏng vấn bối cảnh dự án, tạo cấu hình `AGENTS.md` / `CLAUDE.md` và thiết lập tài liệu gốc `Docs/SourceOfTruth/`. |
| **`/sync-engines`** | Sau khi sửa Rules/Skills | Chuyển đổi cú pháp và đồng bộ tức thì tri thức giữa Antigravity, Claude Code và Codex CLI (0 drift). |
| **`/newsession`** | Tạm nghỉ hoặc hết phiên | Cập nhật tài liệu sống, tạo worklog fragment trong `Docs/Done/`, commit Git gọn và sinh prompt 4-field để tiếp tục phiên sau. |
| **`/wrap`** | Hoàn thành Milestone lớn | Đóng gói toàn diện: đổi status DONE, lưu trữ handoff, commit narrow, và đúc kết Retrospective tổng kết task. |

---

# 8. Bản Đồ Ngữ Cảnh Living Docs

Toàn bộ tri thức của dự án được lưu trữ sống động trong thư mục `Docs/` theo nguyên tắc phân quyền rõ ràng:

| Thư mục | Vai Trò | Quy Tắc Sửa Đổi |
| :--- | :--- | :--- |
| [`Docs/SourceOfTruth/`](file:///C:/Project/UniversalAgent/Docs/SourceOfTruth/) | Tri thức nền, kiến trúc hệ thống, API specs | **Living** (Luôn cập nhật song hành cùng code) |
| [`Docs/Decisions/`](file:///C:/Project/UniversalAgent/Docs/Decisions/) | Nhật ký quyết định kỹ thuật & đánh giá trade-offs (ADR) | **Immutable** (Bất biến sau khi đã chốt) |
| [`Docs/QC/`](file:///C:/Project/UniversalAgent/Docs/QC/) | Tiêu chí nghiệm thu, test cases, checklist chất lượng | **Living** (Cập nhật định nghĩa bài test) |
| [`Docs/Done/`](file:///C:/Project/UniversalAgent/Docs/Done/) | Worklog fragments lưu vết các đầu việc đã hoàn thành | **Frozen** (Append-only — Chỉ thêm mới, không sửa cũ) |
| [`Docs/Handoffs/`](file:///C:/Project/UniversalAgent/Docs/Handoffs/) | Bàn giao phiên làm việc & bài học kinh nghiệm | **Frozen** (Append-only — Bất biến theo thời gian) |
| [`Docs/prompts/`](file:///C:/Project/UniversalAgent/Docs/prompts/) | Mẫu prompt và kịch bản tác vụ tái sử dụng nhanh | **Living** |

---

# 9. 5 Lớp Lá Chắn Bảo Vệ (Hooks Security)

Mọi thao tác của AI đều được kiểm soát thời gian thực bởi 5 kịch bản Hook độc lập:

1. **🛡️ Safety Guard (`safety-guard.js`):**
   - Chặn tuyệt đối việc AI đọc, ghi hoặc commit các file chứa bí mật (`.env`, SSH keys, credentials, tokens).
   - Ngăn chặn các lệnh shell nguy hiểm mang tính huỷ diệt (`rm -rf`, xoá disk, reset hard).
2. **📦 Read Guard (`read-guard.js`):**
   - Cảnh báo khi AI cố nạp các tệp nhị phân, video, hình ảnh hoặc file media lớn làm tràn cửa sổ ngữ cảnh (Context Window).
3. **🔄 Closeout Trigger (`closeout-trigger.js`):**
   - Cảnh báo và nhắc nhở AI đồng bộ tài liệu sống trước mỗi lệnh Git commit.
   - Phát hiện thay đổi trong rules/skills và nhắc nhở chạy `/sync-engines`.
4. **📏 Doc Budget Guard (`doc-budget.js`):**
   - Giám sát độ dài tài liệu sau mỗi lần ghi theo cơ chế **Ratchet**: chặn file phình to mất kiểm soát, chỉ cho phép chỉnh sửa nếu giữ nguyên hoặc làm ngắn lại.
   - Tự động kiểm tra tính hợp lệ của hook registry (`hooks.json` / `settings.json`).
5. **🇻🇳 Language Guard (`language-guard.js`):**
   - Cưỡng chế văn xuôi tài liệu trong workspace phải viết bằng tiếng Việt chuẩn có dấu (≥90%), giữ nguyên thuật ngữ kỹ thuật bằng tiếng Anh.

---

> 💡 **UniversalAgent** — *Xây dựng chuẩn mực lập trình cùng AI: Chính xác, Tinh gọn, và Luôn có thể kiểm chứng (Correct, Minimal, Verifiable).*