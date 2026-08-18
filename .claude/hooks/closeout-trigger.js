// Universal Closeout Trigger — nhắc Living Docs và chặn drift file tự sinh trước khi commit
//
// Kênh input: payload JSON qua STDIN (Claude Code) hoặc chuỗi lệnh qua argv[2] (Antigravity).
//
// Chỉ chạy khi lệnh là `git commit`. Kiểm tra hai thứ, gộp thành một lần hỏi:
//   1. Living Docs — commit không đụng tới Docs/ thì nhắc rà lại tài liệu sống.
//   2. Drift — chạy `sync-agents.js --check`, phát hiện file tự sinh đã lệch nguồn
//      .agents/ trước khi độ lệch đó theo vào lịch sử repo.
// Không vấn đề nào -> im lặng cho qua (exit 0), tránh gây phiền mỗi lần commit.
// Có vấn đề -> permissionDecision "ask" để người dùng xác nhận có chủ đích.
//
// Hook không bao giờ tự chặn cứng: mọi lỗi (không phải git repo, thiếu git/node...) đều cho qua.

const fs = require('fs');
const path = require('path');
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

const reasons = [];

if (!changed.some((file) => file.startsWith('Docs/'))) {
  reasons.push(
    [
      '[LIVING DOCS] Commit này không đụng tới Docs/. Trước khi chốt, rà lại:',
      '  1. Đã cập nhật tài liệu sống tại Docs/SourceOfTruth/ chưa?',
      '  2. Đã tạo worklog fragment Docs/Done/YYYY-MM-DD-task-name.txt chưa?',
      '  3. Quyết định quan trọng đã ghi vào Docs/Decisions/ chưa?',
    ].join('\n')
  );
}

// Bộ sinh cấu hình đa nền tảng có chế độ --check, nhưng nó chỉ có tác dụng nếu
// có thứ gì đó gọi. Gọi ngay tại đây: commit là đúng thời điểm phát hiện file
// tự sinh đã lệch nguồn, trước khi độ lệch đó theo vào lịch sử repo.
const syncScript = path.join(cwd, 'scripts', 'sync-agents.js');
if (fs.existsSync(syncScript)) {
  try {
    execFileSync(process.execPath, [syncScript, '--check'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    // exit 1 = phát hiện lệch. Mã khác (script lỗi, thiếu quyền...) thì bỏ qua,
    // hook này không được phép cản trở vì lý do hạ tầng.
    if (err.status === 1) {
      reasons.push(
        [
          '[SYNC] File tự sinh đang lệch nguồn .agents/:',
          String(err.stderr || '')
            .split('\n')
            .filter((line) => line.trim() && !line.includes('👉'))
            .map((line) => `  ${line.trim()}`)
            .join('\n'),
          '  👉 Chạy `node scripts/sync-agents.js` rồi commit lại.',
        ].join('\n')
      );
    }
  }
}

if (reasons.length === 0) process.exit(0);

const reason = reasons.join('\n\n');

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
