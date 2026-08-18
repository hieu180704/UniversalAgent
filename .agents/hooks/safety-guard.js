// Universal Safety Guard Hook — PreToolUse
//
// Kênh input (hỗ trợ cả 2 nền tảng):
//   - Claude Code   : payload JSON qua STDIN — { tool_name, tool_input: { file_path, command, ... }, cwd }
//   - Antigravity   : đường dẫn thô qua argv[2]
//
// Kênh output (Claude Code):
//   - exit 2 => CHẶN tool call, stderr được trả ngược về cho model đọc
//   - exit 0 => cho phép
//   Lưu ý: exit 1 KHÔNG chặn được gì (chỉ là non-blocking error) — đây là lỗi của bản cũ.

const fs = require('fs');

const SENSITIVE_PATTERNS = [
  /(^|[\/])\.env(\.[^\/]*)?$/i,
  /(^|[\/])id_rsa/i,
  /\.pem$/i,
  /(^|[\/])credentials\.json$/i,
  /(^|[\/])secrets?([\/.]|$)/i,
];

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch (err) {
    // Không có stdin (chạy tay từ terminal / TTY) — bỏ qua, dùng argv.
    return '';
  }
}

function collectTargets() {
  const targets = [];

  const argvTarget = process.argv[2];
  if (argvTarget) targets.push(argvTarget);

  const raw = readStdin().trim();
  if (!raw) return targets;

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (err) {
    targets.push(raw); // stdin không phải JSON — coi như chuỗi đường dẫn thô
    return targets;
  }

  const input = payload.tool_input || payload.toolInput || {};
  for (const key of ['file_path', 'filePath', 'path', 'notebook_path', 'command']) {
    if (typeof input[key] === 'string' && input[key]) targets.push(input[key]);
  }
  return targets;
}

for (const target of collectTargets()) {
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(target)) {
      console.error(
        `[SAFETY VIOLATION] Thao tác bị chặn trên "${target}": không được sửa đổi trực tiếp ` +
        'file chứa thông tin nhạy cảm/bảo mật. Nếu thực sự cần, hãy đề nghị người dùng ' +
        'chỉnh tay, hoặc gỡ pattern tương ứng trong .agents/hooks/safety-guard.js.'
      );
      process.exit(2);
    }
  }
}

process.exit(0);
