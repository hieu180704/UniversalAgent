# UniversalAgent 🌐
**Universal AI Agent Operating Framework & Starter Kit for Antigravity IDE, Codex & Claude CLI**

---

## 📖 Mục lục
1. [Giới thiệu](#-giới-thiệu)
2. [Triết lý Cốt lõi](#-triết-lý-cốt-lõi)
3. [Yêu cầu Trước khi Cài](#-yêu-cầu-trước-khi-cài)
4. [Cài đặt vào Dự Án Mới](#-cài-đặt-vào-dự-án-mới)
5. [Cấu trúc Hệ thống](#-cấu-trúc-hệ-thống)
6. [Một Nguồn, Mọi Nền tảng](#-một-nguồn-mọi-nền-tảng)
7. [Áp dụng cho Mọi Lĩnh vực](#-áp-dụng-cho-mọi-lĩnh-vực)
8. [Hệ thống Lệnh Slash & Meta-Skills](#-hệ-thống-lệnh-slash--meta-skills)
9. [Guardrails: Hooks & Permissions](#-guardrails-hooks--permissions)

---

## 🌟 Giới thiệu
**UniversalAgent** là bộ khung vận hành chuẩn hoá cho AI Agent, thiết kế theo hướng **phổ quát** — dùng được cho mọi loại công việc (sáng tác, quản trị, nghiên cứu, lập trình) và mọi model.

Điểm cốt lõi: bạn viết quy tắc **một lần** tại `.agents/rules/`, một bộ sinh tự động phát ra cấu hình tương đương cho từng nền tảng. Cài hôm nay bằng Claude CLI, vài tháng sau mở lại bằng Codex hay Antigravity — vẫn đúng bộ quy tắc đó, không phải chép tay lại lần nào.

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

## ⚡ Cài đặt vào Dự Án Mới

Thư mục `UniversalAgent/` đóng vai trò **bộ cài**: giữ nó ở một chỗ cố định trên máy, rồi dùng chính nó cài cho bao nhiêu dự án khác tuỳ ý. Không cần clone lại cho từng dự án.

### Bước 1 — Lấy bộ khung về máy (làm một lần duy nhất)

```bash
git clone https://github.com/hieu180704/UniversalAgent.git
```

Hoặc tải ZIP rồi giải nén — ví dụ đặt tại `D:\Tools\UniversalAgent`.

### Bước 2 — Chạy installer, trỏ vào dự án đích

**Windows — 1-click:**
- **Kéo & thả** thư mục dự án đích vào `setup.bat`, hoặc
- **Click đúp** `setup.bat` rồi dán đường dẫn dự án khi được hỏi.

**Terminal:**
```powershell
# Windows
.\install.ps1 -TargetDir "D:\Project\GameCuaToi"
```
```bash
# macOS & Linux
./install.sh ~/project/game-cua-toi
```

Thư mục đích **chưa tồn tại** thì installer tự tạo. Dự án **đã có code sẵn** cũng chạy được — installer merge vào, không xoá gì và không đụng tới mã nguồn của bạn.

Installer làm 3 việc: chép khung cấu hình cho 3 nền tảng, dựng khung `Docs/`, rồi chạy luôn `node scripts/sync-agents.js` ngay trên dự án đích để sinh cấu hình. Thiếu Node.js thì hai việc đầu vẫn xong, việc thứ ba báo lỗi — cài Node rồi chạy tay lệnh đó là đủ.

### Bước 3 — Bật guardrails *(chỉ khi dự án đã có sẵn `.claude/settings.json`)*

Installer **không ghi đè** file cấu hình sẵn có của bạn, nên trong trường hợp này hooks sẽ không tự bật. Mở `.claude/settings.json.universalagent` và merge hai khối `hooks` + `permissions.deny` sang file của bạn. Dự án chưa có file đó thì bỏ qua bước này — hooks đã chạy sẵn.

### Bước 4 — Mở dự án bằng AI và gõ `/init`

AI hỏi 3 câu (tên & lĩnh vực dự án · mục tiêu cốt lõi · techstack và quy chuẩn riêng), rồi tự điền `AGENTS.md` / `CLAUDE.md`, tạo `Docs/SourceOfTruth/overview.txt` và khai báo phân vùng tri thức.

### Kiểm tra cài đặt thành công

```bash
node scripts/sync-agents.js --check     # phải in ✅ và thoát với mã 0
```

Trong Claude CLI, gõ `/` phải thấy đủ 9 lệnh: `/init` · `/plan` · `/explain` · `/research` · `/verify` · `/doc` · `/newsession` · `/worktree` · `/system-cleanup`.

### Cập nhật khung về sau

`git pull` trong thư mục `UniversalAgent/`, rồi chạy lại installer lên đúng dự án cũ. **Cài lại lên cùng thư mục là an toàn:**

- Installer merge chứ không thay thế — không tạo cấu trúc lồng nhau kiểu `.agents/.agents`.
- **Không ghi đè** `.gitignore`, `.gitattributes`, `.editorconfig`, `.claude/settings.json` sẵn có. Bản của khung chỉ được đặt cạnh dưới tên `<file>.universalagent` khi nội dung **thật sự khác** file của bạn; giống nhau thì không sinh file thừa, và sidecar cũ còn sót cũng được dọn luôn.
- **Không mang tài liệu nội bộ của khung sang dự án bạn.** `Docs/` chỉ được dựng khung thư mục (`SourceOfTruth/`, `Decisions/`, `Handoffs/`, `QC/`, `Done/`, `prompts/`) kèm các file `*-template.txt`. Worklog, decision memo, handoff mà UniversalAgent sinh ra trong lúc phát triển chính nó đều ở lại repo gốc. Bản installer cũ từng chép nhầm sang thì lần cài mới sẽ dọn — nhưng chỉ dọn file **trùng khít từng byte** với bản gốc; file bạn tự viết dù trùng tên vẫn giữ nguyên.
- Ngoại lệ: các file `*-template.txt` trong `Docs/` thuộc quyền sở hữu của khung nên **luôn được làm mới**. Cần template riêng thì đặt tên khác.
- Nội dung do `/init` điền vào `AGENTS.md` / `CLAUDE.md` nằm ngoài cặp marker `UA:RULES` nên không bao giờ bị đụng tới.

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
├── .claude/                        # Claude CLI
│   ├── settings.json               # 🔒 Hooks + permissions.deny
│   ├── rules|recipes|hooks/        # ⚙️ Gương của .agents/
│   └── commands/                   # ⚙️ Sinh từ .agents/skills/
├── AGENTS.md                       # Entry point Antigravity + Codex — giữa marker là ⚙️
├── CLAUDE.md                       # Entry point Claude CLI — giữa marker là ⚙️
├── scripts/sync-agents.js          # 🔒 Bộ sinh cấu hình đa nền tảng
├── install.ps1 / install.sh / setup.bat
└── Docs/                           # Living Docs — installer chỉ mang *-template.txt
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
| Antigravity IDE | `.agents/rules/` + `AGENTS.md` | nguồn + **toàn văn** quy tắc |
| Codex | `AGENTS.md` | **toàn văn** quy tắc |
| Claude CLI | `.claude/rules/` + `CLAUDE.md` | gương + bản đồ chỉ mục |

Claude CLI tự nạp `.claude/rules/` nên `CLAUDE.md` chỉ cần **bản đồ chỉ mục** (rules / recipes / hooks / skills). `AGENTS.md` thì khác: Antigravity đọc thẳng `.agents/rules/`, nhưng **Codex chỉ nạp đúng `AGENTS.md`** và không tự mở thư mục rules — nên file này phải mang **toàn văn** quy tắc, kèm danh mục recipes/hooks/skills. Đổi lại là system prompt dài hơn, nhưng hành xử của Codex mới đồng nhất với hai nền tảng còn lại.

**Cơ chế marker.** Trong `AGENTS.md` và `CLAUDE.md`, bộ sinh chỉ ghi đè phần nằm giữa:
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

Nguồn của các lệnh này là `.agents/skills/<tên>/SKILL.md`. Thêm một thư mục skill mới rồi chạy đồng bộ là Claude CLI có ngay slash command tương ứng.

---

## 🛡 Guardrails: Hooks & Permissions

Ba hook trong `.agents/hooks/` (bản cho Claude CLI nằm ở `.claude/hooks/`):

| Hook | Sự kiện | Hành vi |
| :--- | :--- | :--- |
| `safety-guard.js` | trước khi ghi/sửa file | **Chặn cứng** thao tác lên `.env`, `*.pem`, `id_rsa*`, `credentials.json`, `secrets/` |
| `read-guard.js` | trước khi đọc file | Cảnh báo khi đọc file nhị phân/media — **advisory, không chặn** |
| `closeout-trigger.js` | trước `git commit` | Nhắc Living Docs (chỉ khi commit không đụng `Docs/`) **và** chạy `sync-agents.js --check` để bắt file tự sinh đã lệch nguồn |

Hook đọc payload JSON qua stdin (Claude CLI) và có fallback `argv[2]` (Antigravity) nên một file chạy được cả hai nền tảng.

> ⚠️ **Codex chưa có cơ chế lifecycle hook**, nên lớp guardrails tự động này chỉ có hiệu lực trên Antigravity và Claude CLI. Chạy bằng Codex thì quy tắc an toàn vẫn nằm trong rule text, nhưng không có chốt chặn cưỡng chế.

Riêng Claude CLI còn có lớp chặn thật ở tầng harness: `permissions.deny` trong `.claude/settings.json` khoá thẳng quyền đọc/ghi các file nhạy cảm và lệnh `rm -rf`, không phụ thuộc vào hook.

> ⚠️ Sửa `.claude/settings.json` xong phải **khởi động lại phiên** Claude CLI thì cấu hình hook mới được nạp.
