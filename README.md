# UniversalAgent

Bộ khung làm việc chuẩn cho AI Agent, dùng được với 3 engine: **Claude Code** (`.claude/`), **Antigravity/Gemini** (`.agents/`), **Codex CLI** (`.codex/`). Mỗi engine giữ bản rule/skill/hook riêng, cả ba cùng đọc `AGENTS.md`.

# Mục lục
1. Cài đặt
2. Cách làm việc
3. Lệnh có sẵn
4. Thư mục Docs/
5. Hooks

---

# 1. Cài đặt

Yêu cầu: Node.js trong `PATH`.

- **Windows:** kéo thư mục dự án thả vào `start.bat`, hoặc `.\install.ps1 -TargetDir "D:\MyProject"`
- **macOS/Linux:** `./install.sh /path/to/my-project`

Thêm `-DryRun` / `--dry-run` để xem trước. Installer hỏi Y/N trước khi ghi.

Sau đó mở dự án bằng engine AI bất kỳ và gõ `/init` để AI phỏng vấn và điền `AGENTS.md`.

**Nâng cấp:** chạy lại lệnh cài bằng bản UniversalAgent mới.
- File framework (`.claude/`, `.agents/`, `.codex/`) được ghi đè; file bị sửa tay được sao lưu vào `.ua-backup/` trước.
- File của dự án (`AGENTS.md`, `Docs/`, `kg-*.md`, `.gitignore`...) không bao giờ bị ghi đè.
- Commit file `.universalagent.json` cùng dự án (lưu phiên bản và trạng thái cài).

---

# 2. Cách làm việc

Task không nhỏ đi theo 4 bước: **Explore → Propose → Confirm → Execute**. AI đọc đúng chỗ, đề xuất kèm trade-off, **dừng chờ duyệt**, rồi mới làm.

---

# 3. Lệnh có sẵn

| Lệnh | Khi nào dùng |
| :--- | :--- |
| `/init` | Bắt đầu dự án mới |
| `/close` | Nghỉ giữa chừng, task chưa xong |
| `/close done` | Task/milestone đã xong |
| `/kg-add` | Thêm phân vùng tri thức (KG leaf) |
| `/sync-engines` | Sau khi sửa rule/skill/agent, đồng bộ sang 2 engine còn lại |

Subagents: `adversary` (phản biện), `code-reviewer` (tìm bug), `research-expert` (điều tra sâu).

---

# 4. Thư mục Docs/

| Thư mục | Chứa gì |
| :--- | :--- |
| `SourceOfTruth/` | Kiến trúc, tri thức nền — luôn cập nhật theo code |
| `Decisions/` | Quyết định đã chốt — không sửa |
| `QC/` | Tiêu chí nghiệm thu |
| `Done/` | Worklog — chỉ thêm mới |
| `Handoffs/` | Bàn giao giữa các phiên — chỉ thêm mới |
| `prompts/` | Prompt tái sử dụng |

---

# 5. Hooks

- `safety-guard.js` — chặn đọc/ghi file nhạy cảm (`.env`, secrets).
- `closeout-trigger.js` — nhắc cập nhật docs trước khi commit, nhắc chạy `/sync-engines`.
- `doc-budget.js` — chặn tài liệu phình quá hạn mức.
- `language-guard.js` — yêu cầu tài liệu viết tiếng Việt có dấu. Tắt bằng dòng `LANGUAGE-GUARD: off` ở mục 2 của `AGENTS.md`.
