// Universal Safety Guard Hook — PreToolUse
// Hỗ trợ đồng thời: Claude Code & Antigravity IDE (Gemini)

const { parseContext, deny, allow, normalizePath } = require('./hook-adapter');

const PATH_PATTERNS = [
  /(^|\/)\.env(\.[^/]*)?$/i,
  /(^|\/)id_rsa/i,
  /\.pem$/i,
  /(^|\/)credentials\.json$/i,
  /(^|\/)secrets?(\/|\.|$)/i,
];

const COMMAND_PATTERNS = [
  /(^|\/)\.env(\.[^/]*)?$/i,
  /(^|\/)id_rsa/i,
  /\.pem$/i,
  /(^|\/)credentials\.json$/i,
  /(^|\/)secrets?\//i,
];

const MESSAGE_FLAGS = /^(-m|-am|--message)$/;

function commandTargets(command) {
  const targets = [];
  const token = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let match;
  let skipNext = false;

  while ((match = token.exec(command)) !== null) {
    const value = match[1] !== undefined ? match[1] : (match[2] !== undefined ? match[2] : match[3]);

    if (skipNext) { skipNext = false; continue; }
    if (MESSAGE_FLAGS.test(value)) { skipNext = true; continue; }

    for (const part of value.split('=')) {
      const cleaned = part.replace(/^[<>@|&$()]+/, '');
      if (cleaned) targets.push(cleaned);
    }
  }

  return targets;
}

const context = parseContext();

for (const target of context.filePaths) {
  const value = normalizePath(target);
  if (PATH_PATTERNS.some((pattern) => pattern.test(value))) {
    deny(
      `[SAFETY VIOLATION] Thao tác bị chặn trên "${target}": không được đọc/ghi trực tiếp ` +
      'file chứa thông tin nhạy cảm/bảo mật. Nếu thực sự cần, hãy chỉnh tay hoặc gỡ pattern trong .ai/hooks/safety-guard.js.'
    );
  }
}

for (const command of context.commands) {
  for (const target of commandTargets(command)) {
    const value = normalizePath(target);
    if (COMMAND_PATTERNS.some((pattern) => pattern.test(value))) {
      deny(
        `[SAFETY VIOLATION] Thao tác bị chặn trên "${target}" (trong chuỗi lệnh): không được thao tác trực tiếp ` +
        'file chứa thông tin nhạy cảm/bảo mật. Nếu thực sự cần, hãy chỉnh tay hoặc gỡ pattern trong .ai/hooks/safety-guard.js.'
      );
    }
  }
}

allow({ decision: 'allow' });
