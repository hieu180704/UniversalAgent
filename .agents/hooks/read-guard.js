// Universal Read & Context Token Guard — PreToolUse (advisory)
// Hỗ trợ đồng thời: Codex, Claude Code & Antigravity IDE (Gemini)

const { parseContext, allow, injectContext } = require('./hook-adapter');

const BINARY_EXTENSIONS = [
  '.exe', '.dll', '.zip', '.tar', '.iso', '.bin',
  '.png', '.jpg', '.jpeg', '.gif', '.mp4', '.pdf',
];

const context = parseContext();

for (const target of context.filePaths) {
  const lowered = target.toLowerCase();
  const hit = BINARY_EXTENSIONS.find((ext) => lowered.endsWith(ext));
  if (hit) {
    injectContext(
      `[READ GUARD] Đang đọc file nhị phân/media (${hit}): ${target}. ` +
      'Chỉ đọc khi thật sự cần thiết để tránh tràn context window.'
    );
  }
}

allow();
