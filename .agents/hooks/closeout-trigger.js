// Universal Closeout & Living Docs Trigger — PreToolUse trên tool chạy lệnh (Bash / run_command)
//
// Kênh input: payload JSON qua STDIN (Claude Code) hoặc chuỗi lệnh qua argv[2] (Antigravity).
//
// Logic: chỉ nhắc khi lệnh là `git commit` VÀ commit đó KHÔNG đụng tới Docs/.
// - Có đụng Docs/  -> im lặng cho qua (exit 0), tránh gây phiền mỗi lần commit.
// - Không đụng Docs/ -> trả permissionDecision "ask" để người dùng xác nhận có chủ đích.
//
// Hook không bao giờ tự chặn cứng: mọi lỗi (không phải git repo, thiếu git...) đều cho qua.

const fs = require('fs');
const { execFileSync } = require('child_process');

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch (err) {
    return '';
  }
}

function parsePayload() {
  const raw = readStdin().trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

function gitFiles(args, cwd) {
  try {
    // stdio: chặn git in usage/error ra stderr của phiên làm việc khi chạy ngoài repo.
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch (err) {
    return null; // git không khả dụng hoặc không phải repo
  }
}

const payload = parsePayload();
const input = payload.tool_input || payload.toolInput || {};
const command = typeof input.command === 'string' ? input.command : (process.argv[2] || '');

if (!/\bgit\s+commit\b/.test(command)) process.exit(0);

const cwd = payload.cwd || process.cwd();

const changed = gitFiles(['diff', '--cached', '--name-only'], cwd);
if (changed === null) process.exit(0);

// `git commit -a` / `--all` bỏ qua staging area — phải xét luôn cả unstaged.
if (/\s-[a-zA-Z]*a|\s--all\b/.test(command)) {
  const unstaged = gitFiles(['diff', '--name-only'], cwd);
  if (unstaged) changed.push(...unstaged);
}

if (changed.some((file) => file.startsWith('Docs/'))) process.exit(0);

const reason = [
  '[LIVING DOCS] Commit này không đụng tới Docs/. Trước khi chốt, rà lại:',
  '  1. Đã cập nhật tài liệu sống tại Docs/SourceOfTruth/ chưa?',
  '  2. Đã tạo worklog fragment Docs/Done/YYYY-MM-DD-task-name.txt chưa?',
  '  3. Quyết định quan trọng đã ghi vào Docs/Decisions/ chưa?',
].join('\n');

// Claude Code: đọc JSON trên stdout để quyết định quyền.
process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'PreToolUse',
    permissionDecision: 'ask',
    permissionDecisionReason: reason,
  },
}));

// Nền tảng không hiểu JSON trên: vẫn thấy nhắc nhở qua stderr.
console.error(reason);

process.exit(0);
