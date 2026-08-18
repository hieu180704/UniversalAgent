# UniversalAgent 🌐
**Universal AI Agent Operating Framework & Starter Kit for Antigravity/Gemini, Claude Code, ChatGPT, Cursor & Copilot**

---

## 📖 Mục lục
1. [Giới thiệu](#-giới-thiệu)
2. [Triết lý Cốt lõi](#-triết-lý-cốt-lõi)
3. [Yêu cầu Trước khi Cài](#-yêu-cầu-trước-khi-cài)
4. [Cài đặt Nhanh](#-cài-đặt-nhanh)
5. [Cấu trúc Hệ thống](#-cấu-trúc-hệ-thống)
6. [Một Nguồn, Mọi Nền tảng](#-một-nguồn-mọi-nền-tảng)
7. [Áp dụng cho Mọi Lĩnh vực](#-áp-dụng-cho-mọi-lĩnh-vực)
8. [Hệ thống Lệnh Slash & Meta-Skills](#-hệ-thống-lệnh-slash--meta-skills)
9. [Guardrails: Hooks & Permissions](#-guardrails-hooks--permissions)

---

## 🌟 Giới thiệu
**UniversalAgent** là bộ khung vận hành chuẩn hoá cho AI Agent, thiết kế theo hướng **phổ quát** — dùng được cho mọi loại công việc (sáng tác, quản trị, nghiên cứu, lập trình) và mọi model.

Điểm cốt lõi: bạn viết quy tắc **một lần** tại `.agents/rules/`, một bộ sinh tự động phát ra cấu hình tương đương cho từng nền tảng. Cài hôm nay bằng Claude Code, vài tháng sau mở lại bằng Cursor hay Antigravity — vẫn đúng bộ quy tắc đó, không phải chép tay lại lần nào.

---

## 🧠 Triết lý Cốt lõi
- **Quy trình 4 pha bắt buộc:** `Explore -> Propose -> Confirm -> Execute`. Không tự ý hành động khi chưa có xác nhận.
- **Root-Cause & First-Principles:** Giải quyết tận gốc, không đoán mò hay vá triệu chứng.
- **Living Docs Engine:** `Docs/` là nguồn chân lý duy nhất, cập nhật song song với thực tế.
- **Tiết kiệm Token:** Điều hướng 2 tầng qua Knowledge Graph Node-0, chỉ đọc trúng đích.
- **Một nguồn, mọi nền tảng:** không có bản sao viết tay nào được phép tồn tại.

---

## 📋 Yêu cầu Trước khi Cài
- **Node.js** — bắt buộc. Bộ sinh cấu hình (`scripts/sync-agents.js`) và toàn bộ hooks đều chạy bằng Node. Không có Node thì hooks im lặng không chạy.
- **Git** — tuỳ chọn, chỉ cần cho hook nhắc Living Docs khi commit và cho lệnh `/worktree`.
- **Windows:** PowerShell 5.1 trở lên (có sẵn trong Windows).

---

## ⚡ Cài đặt Nhanh

### Cách 1: 1-Click (Windows)
- **Kéo & Thả:** kéo thư mục dự án đích thả vào `setup.bat`.
- **Hoặc click đúp** `setup.bat` rồi dán đường dẫn thư mục dự án.

### Cách 2: Terminal
```powershell
# Windows
.\install.ps1 -TargetDir "D:\MyWorkspace"
```
```bash
# macOS & Linux
./install.sh /path/to/workspace
```

**Cài lại lần nữa lên cùng thư mục là an toàn.** Installer chạy theo kiểu merge — không tạo thư mục lồng nhau, và **không ghi đè** `.gitignore`, `.gitattributes`, `.editorconfig`, `.claude/settings.json` sẵn có của dự án; bản của khung được đặt cạnh dưới tên `<file>.universalagent` để bạn tự đối chiếu.

> 💡 **Sau khi cài:** mở dự án bằng AI bất kỳ và gõ `/init`. AI sẽ phỏng vấn 3 câu và thiết lập toàn bộ tài liệu dự án.

---

## 📂 Cấu trúc Hệ thống

Ký hiệu: 🔒 = viết tay (nguồn) · ⚙️ = tự sinh, **không sửa trực tiếp**.

```text
UniversalAgent/
├── .agents/                        # 🔒 NGUỒN DUY NHẤT — Antigravity đọc trực tiếp
│   ├── rules/                      #    4 file quy tắc cốt lõi
│   ├── recipes/                    #    Mẫu cấu trúc đầu ra
│   ├── hooks/ + hooks.json         #    Chốt chặn vòng đời
│   └── skills/                     #    Kỹ năng mở rộng (/plan, /verify...)
├── .claude/                        # Claude Code
│   ├── settings.json               # 🔒 Hooks + permissions.deny
│   ├── rules|recipes|hooks/        # ⚙️ Gương của .agents/
│   └── commands/                   # ⚙️ Sinh từ .agents/skills/
├── .cursor/rules/universalagent.mdc# ⚙️ Cursor (format hiện hành)
├── .cursorrules                    # ⚙️ Cursor (format cũ, giữ tương thích ngược)
├── .github/copilot-instructions.md # ⚙️ GitHub Copilot
├── .openai/system-prompt.txt       # ⚙️ ChatGPT / OpenAI Custom GPT
├── AGENTS.md / CLAUDE.md / CHATGPT.md  # Entry point — vùng giữa marker là ⚙️
├── scripts/sync-agents.js          # 🔒 Bộ sinh cấu hình đa nền tảng
├── install.ps1 / install.sh / setup.bat
└── Docs/                           # Living Docs Framework
    ├── SourceOfTruth/              # Tri thức gốc, spec, bối cảnh
    ├── Decisions/                  # Nhật ký quyết định (ADR / Memos)
    ├── Handoffs/                   # Bàn giao phiên & bài học
    ├── QC/                         # Checklist nghiệm thu
    ├── Done/                       # Worklog fragments
    └── prompts/                    # Prompt tái sử dụng nhanh
```

---

## 🔄 Một Nguồn, Mọi Nền tảng

Sửa bất kỳ file nào trong `.agents/rules/`, rồi chạy:

```bash
node scripts/sync-agents.js
```

Bộ sinh sẽ phát ra cấu hình cho từng nền tảng theo đúng cơ chế nạp của nó:

| Nền tảng | File đích | Nội dung |
| :--- | :--- | :--- |
| Antigravity / Gemini | `.agents/rules/` + `AGENTS.md` | nguồn + bản đồ chỉ mục |
| Claude Code | `.claude/rules/` + `CLAUDE.md` | gương + bản đồ chỉ mục |
| ChatGPT | `CHATGPT.md` | **toàn văn** quy tắc |
| OpenAI Custom GPT | `.openai/system-prompt.txt` | **toàn văn**, dán thẳng vào System Prompt |
| Cursor | `.cursor/rules/universalagent.mdc` + `.cursorrules` | **toàn văn**, cả format mới lẫn cũ |
| GitHub Copilot | `.github/copilot-instructions.md` | **toàn văn** |

Antigravity và Claude Code tự nạp được thư mục rules nên chỉ cần **bản đồ chỉ mục** (rules / recipes / hooks / skills). Bốn nền tảng còn lại không có cơ chế đó nên nhận **toàn văn** — đổi lại là system prompt dài hơn đáng kể, nhưng hành xử mới đồng nhất với Claude và Antigravity.

**Cơ chế marker.** Trong `AGENTS.md`, `CLAUDE.md`, `CHATGPT.md`, bộ sinh chỉ ghi đè phần nằm giữa:
```
<!-- UA:RULES:BEGIN -->  ...vùng tự sinh...  <!-- UA:RULES:END -->
```
Nội dung riêng của dự án (phần `/init` điền) nằm ngoài marker và không bao giờ bị đụng tới.

**Chống trôi lệch (drift).**
```bash
node scripts/sync-agents.js --check
```
Không ghi gì, chỉ báo file nào đã lệch nguồn và thoát với mã lỗi 1.

Bạn không cần nhớ chạy lệnh này: hook `closeout-trigger.js` tự gọi nó trước mỗi `git commit`, nên độ lệch bị chặn lại ngay tại cửa thay vì lọt vào lịch sử repo. Lệnh trên dành cho khi bạn muốn kiểm tra thủ công hoặc nối vào CI.

Bộ sinh cũng tự **dọn file mồ côi**: xoá một skill trong `.agents/skills/` thì `.claude/commands/<skill>.md` tương ứng bị gỡ theo. Command bạn tự viết (không mang dấu `UA:GENERATED`) không bao giờ bị dọn.

> ⚠️ `.claude/rules`, `.claude/recipes`, `.claude/hooks` là **thư mục gương** — nội dung do bộ sinh sở hữu hoàn toàn, file lạ đặt vào đó sẽ bị dọn.

---

## 🎯 Áp dụng cho Mọi Lĩnh vực

| Lĩnh vực | `Docs/SourceOfTruth/` | `Docs/Decisions/` | `Docs/QC/` | Recipes dùng |
| :--- | :--- | :--- | :--- | :--- |
| **✍️ Sáng tác & Viết truyện** | Hồ sơ nhân vật, bối cảnh, timeline | Hướng đi cốt truyện, số phận nhân vật | Kiểm tra mâu thuẫn lore, văn phong | `recipe-deliverable`, `recipe-review-qc` |
| **💼 Quản trị & Văn phòng** | Quy trình chuẩn (SOP), mục tiêu | Quyết định chiến lược, biên bản họp | Checklist nghiệm thu | `recipe-plan`, `recipe-decision-memo` |
| **🔍 Hỏi đáp & Nghiên cứu** | Tài liệu tham khảo, dữ liệu kiểm chứng | So sánh giả thuyết, ưu/nhược điểm | Fact-check | `recipe-synthesis`, `recipe-analysis` |
| **💻 Kỹ thuật & Lập trình** | Kiến trúc hệ thống, API specs | Quyết định kiến trúc (ADR), trade-offs | Test cases, linter, review | `recipe-plan`, `recipe-review-qc` |

---

## 🛠 Hệ thống Lệnh Slash & Meta-Skills
- `/init` — Khởi tạo dự án: phỏng vấn bối cảnh & dựng SourceOfTruth.
- `/explain` — Decision Memo 7 phần để chốt hướng đi.
- `/plan` — Phân rã mục tiêu thành WBS & Milestones.
- `/verify` — Thẩm định chất lượng, rà soát logic, checklist.
- `/doc` — Đồng bộ tài liệu sống với thực tế.
- `/newsession` — Đóng phiên, lưu worklog, sinh prompt bàn giao.
- `/research` — Nghiên cứu chuyên sâu đa chiều.
- `/system-cleanup` — Dọn tệp rác và dữ liệu thừa.
- `/worktree` — Git Worktree cho thử nghiệm độc lập.

Nguồn của các lệnh này là `.agents/skills/<tên>/SKILL.md`. Thêm một thư mục skill mới rồi chạy đồng bộ là Claude Code có ngay slash command tương ứng.

---

## 🛡 Guardrails: Hooks & Permissions

Ba hook trong `.agents/hooks/` (bản cho Claude Code nằm ở `.claude/hooks/`):

| Hook | Sự kiện | Hành vi |
| :--- | :--- | :--- |
| `safety-guard.js` | trước khi ghi/sửa file | **Chặn cứng** thao tác lên `.env`, `*.pem`, `id_rsa*`, `credentials.json`, `secrets/` |
| `read-guard.js` | trước khi đọc file | Cảnh báo khi đọc file nhị phân/media — **advisory, không chặn** |
| `closeout-trigger.js` | trước `git commit` | Nhắc Living Docs (chỉ khi commit không đụng `Docs/`) **và** chạy `sync-agents.js --check` để bắt file tự sinh đã lệch nguồn |

Hook đọc payload JSON qua stdin (Claude Code) và có fallback `argv[2]` (Antigravity) nên một file chạy được cả hai nền tảng.

Riêng Claude Code còn có lớp chặn thật ở tầng harness: `permissions.deny` trong `.claude/settings.json` khoá thẳng quyền đọc/ghi các file nhạy cảm và lệnh `rm -rf`, không phụ thuộc vào hook.

> ⚠️ Sửa `.claude/settings.json` xong phải **khởi động lại phiên** Claude Code thì cấu hình hook mới được nạp.
