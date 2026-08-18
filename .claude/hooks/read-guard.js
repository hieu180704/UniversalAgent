// Universal Read & Context Token Guard — PreToolUse (advisory)
//
// Kênh input: payload JSON qua STDIN (Claude Code) hoặc đường dẫn qua argv[2] (Antigravity).
//
// Hook này CỐ Ý không chặn (exit 0). Cần hiểu đúng giới hạn: với exit 0, Claude Code chỉ
// ghi output vào transcript (Ctrl-R), KHÔNG đẩy vào ngữ cảnh của model. Đây là hook
// cảnh báo/log cho người dùng, KHÔNG phải guardrail cứng.
// Muốn chặn thật sự -> dùng permissions.deny trong .claude/settings.json.

const fs = require('fs');

const BINARY_EXTENSIONS = [
  '.exe', '.dll', '.zip', '.tar', '.iso', '.bin',
  '.png', '.jpg', '.jpeg', '.gif', '.mp4', '.pdf',
];

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch (err) {
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
    targets.push(raw);
    return targets;
  }

  const input = payload.tool_input || payload.toolInput || {};
  for (const key of ['file_path', 'filePath', 'path', 'notebook_path', 'url']) {
    if (typeof input[key] === 'string' && input[key]) targets.push(input[key]);
  }
  return targets;
}

for (const target of collectTargets()) {
  const lowered = target.toLowerCase();
  const hit = BINARY_EXTENSIONS.find((ext) => lowered.endsWith(ext));
  if (hit) {
    console.error(
      `[READ GUARD] Đang đọc file nhị phân/media (${hit}): ${target}. ` +
      'Chỉ đọc khi thật sự cần thiết để tránh tràn context window.'
    );
    break;
  }
}

process.exit(0);
