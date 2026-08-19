// Universal Safety Guard Hook — PreToolUse
//
// Kênh input (hỗ trợ cả 2 nền tảng):
//   - Claude CLI    : payload JSON qua STDIN — { tool_name, tool_input: { file_path, command, ... }, cwd }
//   - Antigravity   : đường dẫn HOẶC chuỗi lệnh thô qua argv[2]
//
// Kênh output (Claude CLI):
//   - exit 2 => CHẶN tool call, stderr được trả ngược về cho model đọc
//   - exit 0 => cho phép
//   Lưu ý: exit 1 KHÔNG chặn được gì (chỉ là non-blocking error) — đây là lỗi của bản cũ.
//
// Hai luồng kiểm tra TÁCH BIỆT, cố ý không dùng chung bộ pattern:
//   1. Đường dẫn file  -> so khớp trên toàn bộ chuỗi đường dẫn.
//   2. Chuỗi lệnh shell -> tách token trước rồi mới so khớp, và dùng bộ pattern
//      hẹp hơn để `grep "secrets"` hay `git commit -m "..."` không bị chặn oan.

const fs = require('fs');

// Windows dùng '\' làm dấu phân cách. Không chuẩn hoá thì mọi pattern có (^|/)
// đều trượt trên D:\project\.env và hook trở thành vô dụng trên Windows.
function normalize(target) {
  return target.replace(/\\/g, '/');
}

const PATH_PATTERNS = [
  /(^|\/)\.env(\.[^/]*)?$/i,
  /(^|\/)id_rsa/i,
  /\.pem$/i,
  /(^|\/)credentials\.json$/i,
  /(^|\/)secrets?(\/|\.|$)/i,
];

// Bộ dành cho chuỗi lệnh: giống trên, riêng 'secrets' BẮT BUỘC kèm dấu phân cách.
// Thiếu ràng buộc đó thì mọi lệnh chỉ vô tình chứa từ "secrets" đều bị chặn oan.
const COMMAND_PATTERNS = [
  /(^|\/)\.env(\.[^/]*)?$/i,
  /(^|\/)id_rsa/i,
  /\.pem$/i,
  /(^|\/)credentials\.json$/i,
  /(^|\/)secrets?\//i,
];

// Cờ mang thông điệp tự do (không phải đường dẫn): bỏ qua đối số đứng ngay sau.
const MESSAGE_FLAGS = /^(-m|-am|--message)$/;

// Tách chuỗi lệnh thành những token có khả năng là đường dẫn.
function commandTargets(command) {
  const targets = [];
  const token = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let match;
  let skipNext = false;

  while ((match = token.exec(command)) !== null) {
    const value = match[1] !== undefined ? match[1] : (match[2] !== undefined ? match[2] : match[3]);

    if (skipNext) { skipNext = false; continue; }
    if (MESSAGE_FLAGS.test(value)) { skipNext = true; continue; }

    // Lộ đường dẫn thật ra khỏi các dạng bọc: `--data-binary=@.env`, `>.env`, `@.env`.
    for (const part of value.split('=')) {
      const cleaned = part.replace(/^[<>@|&$()]+/, '');
      if (cleaned) targets.push(cleaned);
    }
  }

  return targets;
}

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch (err) {
    // Không có stdin (chạy tay từ terminal / TTY) — bỏ qua, dùng argv.
    return '';
  }
}

function collect() {
  const paths = [];
  const commands = [];

  // Antigravity gửi qua argv[2], và tuỳ matcher mà đó là đường dẫn hay chuỗi lệnh.
  // Không phân biệt được từ phía hook nên đưa vào cả hai luồng, lấy hợp của kết quả.
  const argvTarget = process.argv[2];
  if (argvTarget) {
    paths.push(argvTarget);
    commands.push(argvTarget);
  }

  const raw = readStdin().trim();
  if (!raw) return { paths, commands };

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (err) {
    paths.push(raw); // stdin không phải JSON — coi như chuỗi đường dẫn thô
    return { paths, commands };
  }

  const input = payload.tool_input || payload.toolInput || {};
  for (const key of ['file_path', 'filePath', 'path', 'notebook_path']) {
    if (typeof input[key] === 'string' && input[key]) paths.push(input[key]);
  }
  if (typeof input.command === 'string' && input.command) commands.push(input.command);

  return { paths, commands };
}

function deny(target, origin) {
  console.error(
    `[SAFETY VIOLATION] Thao tác bị chặn trên "${target}"${origin}: không được đọc/ghi trực tiếp ` +
    'file chứa thông tin nhạy cảm/bảo mật. Nếu thực sự cần, hãy đề nghị người dùng ' +
    'chỉnh tay, hoặc gỡ pattern tương ứng trong .agents/hooks/safety-guard.js.'
  );
  process.exit(2);
}

const { paths, commands } = collect();

for (const target of paths) {
  const value = normalize(target);
  if (PATH_PATTERNS.some((pattern) => pattern.test(value))) deny(target, '');
}

for (const command of commands) {
  for (const target of commandTargets(command)) {
    const value = normalize(target);
    if (COMMAND_PATTERNS.some((pattern) => pattern.test(value))) deny(target, ' (trong chuỗi lệnh)');
  }
}

process.exit(0);
