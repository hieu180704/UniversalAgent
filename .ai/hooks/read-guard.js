// Universal Read & Context Token Guard — PreToolUse (advisory)
// Hỗ trợ đồng thời: Claude Code & Antigravity IDE (Gemini)

const { parseContext, allow } = require('./hook-adapter');

const BINARY_EXTENSIONS = [
  '.exe', '.dll', '.zip', '.tar', '.iso', '.bin',
  '.png', '.jpg', '.jpeg', '.gif', '.mp4', '.pdf',
];

const context = parseContext();

for (const target of context.filePaths) {
  const lowered = target.toLowerCase();
  const hit = BINARY_EXTENSIONS.find((ext) => lowered.endsWith(ext));
  if (hit) {
    if (context.engine === 'codex') {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: context.hookEventName || 'PreToolUse',
          additionalContext: `[READ GUARD] Reading a binary/media file (${hit}): ${target}. Only continue when it is necessary.`,
        },
      }));
      process.exit(0);
    }
    console.error(
      `[READ GUARD] Đang đọc file nhị phân/media (${hit}): ${target}. ` +
      'Chỉ đọc khi thật sự cần thiết để tránh tràn context window.'
    );
    break;
  }
}

allow({ decision: 'allow' });
