// Universal Hook Adapter for IndieGame (.ai/hooks/hook-adapter.js)
// Hỗ trợ tự động phân giải I/O giữa Antigravity (Gemini) và Claude Code.

const fs = require('fs');

let cachedContext = null;

function normalizePath(p) {
  if (typeof p !== 'string') return '';
  return p.replace(/\\/g, '/');
}

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch (err) {
    return '';
  }
}

function parsePayload() {
  const raw = readStdin().trim();
  if (!raw) return { raw: '', data: null };
  try {
    return { raw, data: JSON.parse(raw) };
  } catch (err) {
    return { raw, data: null };
  }
}

function parseContext() {
  if (cachedContext) return cachedContext;

  const { raw, data } = parsePayload();
  const argvTarget = process.argv[2] || '';

  let engine = 'unknown';
  let toolName = '';
  let hookEventName = '';
  const filePaths = [];
  const commands = [];
  let cwd = process.cwd();

  if (argvTarget) {
    filePaths.push(argvTarget);
    commands.push(argvTarget);
  }

  if (data && typeof data === 'object') {
    // 1. Kiểm tra engine Antigravity
    if (data.hook_event_name && (data.turn_id || data.session_id)) {
      engine = 'codex';
      toolName = data.tool_name || '';
      hookEventName = data.hook_event_name;
      const input = data.tool_input || {};

      if (data.cwd) cwd = data.cwd;

      for (const key of ['file_path', 'filePath', 'path', 'notebook_path', 'image_path', 'url']) {
        if (typeof input[key] === 'string' && input[key]) filePaths.push(input[key]);
      }
      if (typeof input.command === 'string' && input.command) {
        commands.push(input.command);
        if (toolName === 'apply_patch') {
          const patchFile = /^\*\*\* (?:Add|Update|Delete) File:\s*(.+)$/gm;
          let match;
          while ((match = patchFile.exec(input.command)) !== null) {
            const filePath = match[1].trim();
            if (filePath) filePaths.push(filePath);
          }
        }
      }
    }
    else if (data.toolCall) {
      engine = 'antigravity';
      toolName = data.toolCall.name || '';
      const args = data.toolCall.args || {};

      if (data.workspacePaths && data.workspacePaths.length > 0) {
        cwd = data.workspacePaths[0];
      }

      // Trích xuất file path từ các tool chuẩn của Antigravity
      for (const key of ['TargetFile', 'AbsolutePath', 'SearchPath', 'DirectoryPath', 'Url']) {
        if (typeof args[key] === 'string' && args[key]) {
          filePaths.push(args[key]);
        }
      }
      if (Array.isArray(args.ImagePaths)) {
        for (const p of args.ImagePaths) if (typeof p === 'string') filePaths.push(p);
      }
      if (Array.isArray(args.MediaPaths)) {
        for (const p of args.MediaPaths) if (typeof p === 'string') filePaths.push(p);
      }

      // Trích xuất command từ run_command
      if (typeof args.CommandLine === 'string' && args.CommandLine) {
        commands.push(args.CommandLine);
      }
      if (args.Cwd) cwd = args.Cwd;
    }
    // 2. Kiểm tra engine Claude Code
    else if (data.tool_name || data.tool_input || data.hook_event_name) {
      engine = 'claude';
      toolName = data.tool_name || '';
      const input = data.tool_input || {};

      if (data.cwd) cwd = data.cwd;

      for (const key of ['file_path', 'filePath', 'path', 'notebook_path', 'url']) {
        if (typeof input[key] === 'string' && input[key]) {
          filePaths.push(input[key]);
        }
      }
      if (typeof input.command === 'string' && input.command) {
        commands.push(input.command);
      }
    }
  } else if (raw) {
    filePaths.push(raw);
  }

  cachedContext = {
    engine,
    toolName,
    hookEventName,
    filePaths: filePaths.map(normalizePath),
    commands,
    rawPayload: data,
    cwd: normalizePath(cwd),
  };

  return cachedContext;
}

function deny(reason) {
  const { engine } = parseContext();
  if (engine === 'antigravity') {
    console.log(JSON.stringify({ decision: 'deny', reason }));
    process.exit(0);
  } else {
    console.error(reason);
    process.exit(2);
  }
}

function ask(reason) {
  const { engine, hookEventName } = parseContext();
  if (engine === 'antigravity') {
    console.log(JSON.stringify({ decision: 'ask', reason }));
    process.exit(0);
  } else if (engine === 'codex') {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: hookEventName || 'PreToolUse',
        additionalContext: reason,
      },
    }));
    process.exit(0);
  } else {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'ask',
          permissionDecisionReason: reason,
        },
      })
    );
    console.error(reason);
    process.exit(0);
  }
}

function inform(message) {
  const { engine, hookEventName } = parseContext();
  if (engine === 'codex') {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: hookEventName || 'PreToolUse',
        additionalContext: message,
      },
    }));
    process.exit(0);
  }
  console.error(message);
  allow({ decision: 'allow' });
}

function allow(responseObj) {
  const { engine } = parseContext();
  if (engine === 'antigravity') {
    console.log(JSON.stringify(responseObj !== undefined ? responseObj : { decision: 'allow' }));
  }
  process.exit(0);
}

module.exports = {
  parseContext,
  normalizePath,
  deny,
  ask,
  inform,
  allow,
};
