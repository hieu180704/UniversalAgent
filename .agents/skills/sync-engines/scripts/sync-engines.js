#!/usr/bin/env node

/**
 * sync-engines.js — Bộ chuyển đổi cơ học và đồng bộ tri thức 3 AI Engine:
 * Antigravity (.agents/) <---> Claude Code (.claude/) <---> Codex CLI (.codex/)
 *
 * Tính năng:
 * - Rules: Giữ nguyên body Markdown, tự transpile Frontmatter phù hợp từng engine.
 * - Recipes: Copy 1-1 nguyên vẹn.
 * - Skills: Đồng bộ 1-1 giữa .agents/skills/ và .claude/skills/ (Codex đọc ké .agents/skills/).
 * - Subagents: Chuyển đổi giữa Markdown Frontmatter (.md) và TOML (.toml của Codex), map model tier.
 * - Hooks: Thay thế namespace đường dẫn (.agents <-> .claude <-> .codex), không đụng hook-adapter & registry.
 * - Check & Dry-run: Kiểm tra drift và preview diff trước khi ghi.
 */

const fs = require('fs');
const path = require('path');

function findRepoRoot(startDir) {
  let curr = startDir;
  while (curr && curr !== path.dirname(curr)) {
    if (fs.existsSync(path.join(curr, '.git'))) return curr;
    curr = path.dirname(curr);
  }
  return path.resolve(startDir, '..', '..', '..', '..');
}

const ROOT = findRepoRoot(__dirname);

const ENGINES = {
  agents: { dir: path.join(ROOT, '.agents'), name: 'Antigravity (.agents/)' },
  claude: { dir: path.join(ROOT, '.claude'), name: 'Claude Code (.claude/)' },
  codex: { dir: path.join(ROOT, '.codex'), name: 'Codex CLI (.codex/)' },
};

// Model mapping giữa Claude và Antigravity
const MODEL_MAP = {
  opus: 'pro',
  sonnet: 'flash',
  pro: 'opus',
  flash: 'sonnet',
};

// Hook scripts dùng chung
const COMMON_HOOK_SCRIPTS = [
  'closeout-trigger.js',
  'doc-budget.js',
  'language-guard.js',
  'read-guard.js',
  'safety-guard.js',
];

// Helper: Đọc text UTF-8
function readText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    return null;
  }
}

// Helper: Ghi text UTF-8
function writeText(filePath, content, dryRun = false) {
  if (dryRun) {
    console.log(`[DRY-RUN] Ghi file: ${path.relative(ROOT, filePath)}`);
    return true;
  }
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[SYNCED] ${path.relative(ROOT, filePath)}`);
  return true;
}

// Helper: Copy recursive directory
function copyDirRecursive(src, dest, dryRun = false) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest) && !dryRun) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, dryRun);
    } else {
      const srcContent = fs.readFileSync(srcPath);
      let needCopy = true;
      if (fs.existsSync(destPath)) {
        const destContent = fs.readFileSync(destPath);
        if (srcContent.equals(destContent)) {
          needCopy = false;
        }
      }
      if (needCopy) {
        if (dryRun) {
          console.log(`[DRY-RUN] Copy file: ${path.relative(ROOT, destPath)}`);
        } else {
          fs.writeFileSync(destPath, srcContent);
          console.log(`[SYNCED] ${path.relative(ROOT, destPath)}`);
        }
      }
    }
  }
}

// -------------------------------------------------------------
// 1. RULE PARSER & TRANSPILER
// -------------------------------------------------------------

function parseRule(content) {
  if (!content) return null;
  const lines = content.split(/\r?\n/);
  
  if (lines[0] && lines[0].trim() === '---') {
    let closingIndex = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        closingIndex = i;
        break;
      }
    }
    if (closingIndex !== -1) {
      const frontmatterLines = lines.slice(1, closingIndex);
      const bodyLines = lines.slice(closingIndex + 1);
      
      let description = '';
      let trigger = '';
      let globs = [];

      for (let i = 0; i < frontmatterLines.length; i++) {
        const line = frontmatterLines[i];
        if (/^description:\s*/.test(line)) {
          description = line.replace(/^description:\s*/, '').trim();
        } else if (/^trigger:\s*/.test(line)) {
          trigger = line.replace(/^trigger:\s*/, '').trim();
        } else if (/^globs:\s*/.test(line)) {
          const rawGlobs = line.replace(/^globs:\s*/, '').trim();
          globs = rawGlobs.split(',').map((s) => s.trim()).filter(Boolean);
        } else if (/^paths:\s*$/.test(line)) {
          while (i + 1 < frontmatterLines.length && /^\s*-\s*/.test(frontmatterLines[i + 1])) {
            i++;
            const item = frontmatterLines[i].replace(/^\s*-\s*["']?/, '').replace(/["']?\s*$/, '').trim();
            if (item) globs.push(item);
          }
        }
      }

      let body = bodyLines.join('\n');
      if (body.startsWith('\n')) body = body.replace(/^\n+/, '');

      return {
        hasFrontmatter: true,
        description,
        trigger,
        globs,
        body,
      };
    }
  }

  return {
    hasFrontmatter: false,
    description: '',
    trigger: '',
    globs: [],
    body: content.trimStart(),
  };
}

function renderRule(parsed, targetEngine, sourceEngine) {
  let body = parsed.body;

  if (sourceEngine && targetEngine && sourceEngine !== targetEngine) {
    const fromDir = sourceEngine === 'agents' ? '.agents/' : sourceEngine === 'claude' ? '.claude/' : '.codex/';
    const toDir = targetEngine === 'agents' ? '.agents/' : targetEngine === 'claude' ? '.claude/' : '.codex/';
    body = body.split(fromDir).join(toDir);
  }

  if (targetEngine === 'codex') {
    return body;
  }

  const isAlwaysOn = parsed.globs.length === 0;

  if (targetEngine === 'claude') {
    const fmLines = ['---'];
    let desc = parsed.description;
    if (!desc) {
      const titleMatch = body.match(/^#\s+(.+)$/m);
      desc = titleMatch ? titleMatch[1].trim() : 'Quy chuẩn UniversalAgent';
    }
    fmLines.push(`description: ${desc}`);
    if (!isAlwaysOn) {
      fmLines.push('paths:');
      for (const g of parsed.globs) {
        let mappedGlob = g;
        if (sourceEngine && targetEngine && sourceEngine !== targetEngine) {
          const fromDir = sourceEngine === 'agents' ? '.agents/' : sourceEngine === 'claude' ? '.claude/' : '.codex/';
          const toDir = targetEngine === 'agents' ? '.agents/' : targetEngine === 'claude' ? '.claude/' : '.codex/';
          mappedGlob = mappedGlob.split(fromDir).join(toDir);
        }
        fmLines.push(`  - "${mappedGlob}"`);
      }
    }
    fmLines.push('---', '');
    return fmLines.join('\n') + '\n' + body;
  }

  if (targetEngine === 'agents') {
    const fmLines = ['---'];
    if (isAlwaysOn) {
      fmLines.push('trigger: always_on');
    } else {
      fmLines.push('trigger: glob');
      const mappedGlobs = parsed.globs.map((g) => {
        if (sourceEngine && targetEngine && sourceEngine !== targetEngine) {
          const fromDir = sourceEngine === 'agents' ? '.agents/' : sourceEngine === 'claude' ? '.claude/' : '.codex/';
          const toDir = targetEngine === 'agents' ? '.agents/' : targetEngine === 'claude' ? '.claude/' : '.codex/';
          return g.split(fromDir).join(toDir);
        }
        return g;
      });
      fmLines.push(`globs: ${mappedGlobs.join(', ')}`);
    }
    fmLines.push('---', '');
    return fmLines.join('\n') + '\n' + body;
  }

  return body;
}

// -------------------------------------------------------------
// 2. SUBAGENT PARSER & TRANSPILER
// -------------------------------------------------------------

function parseAgent(filePath) {
  const content = readText(filePath);
  if (!content) return null;
  const ext = path.extname(filePath);

  if (ext === '.toml') {
    const nameMatch = content.match(/^name\s*=\s*["']([^"']+)["']/m);
    const descMatch = content.match(/^description\s*=\s*["']([^"']+)["']/m);
    const modelMatch = content.match(/^model\s*=\s*["']([^"']+)["']/m);
    const instructMatch = content.match(/developer_instructions\s*=\s*'''([\s\S]*?)'''/m);

    return {
      name: nameMatch ? nameMatch[1] : path.basename(filePath, '.toml'),
      description: descMatch ? descMatch[1] : '',
      model: modelMatch ? modelMatch[1] : 'pro',
      tools: ['Read', 'Grep', 'Glob', 'Bash', 'Write'],
      instructions: instructMatch ? instructMatch[1].trim() : '',
      extra: {},
    };
  }

  const lines = content.split(/\r?\n/);
  if (lines[0] && lines[0].trim() === '---') {
    let closing = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        closing = i;
        break;
      }
    }
    if (closing !== -1) {
      const fmLines = lines.slice(1, closing);
      const instructions = lines.slice(closing + 1).join('\n').trim();

      let name = path.basename(filePath, '.md');
      let description = '';
      let model = 'pro';
      let tools = [];
      const extra = {};

      for (let i = 0; i < fmLines.length; i++) {
        const line = fmLines[i];
        if (/^name:\s*/.test(line)) name = line.replace(/^name:\s*/, '').trim();
        else if (/^description:\s*/.test(line)) description = line.replace(/^description:\s*/, '').trim();
        else if (/^model:\s*/.test(line)) model = line.replace(/^model:\s*/, '').trim();
        else if (/^model_tier:\s*/.test(line)) extra.model_tier = line.replace(/^model_tier:\s*/, '').trim();
        else if (/^tools_access:\s*/.test(line)) extra.tools_access = line.replace(/^tools_access:\s*/, '').trim();
        else if (/^tools:\s*$/.test(line)) {
          while (i + 1 < fmLines.length && /^\s*-\s*/.test(fmLines[i + 1])) {
            i++;
            const t = fmLines[i].replace(/^\s*-\s*/, '').trim();
            if (t) tools.push(t);
          }
        }
      }

      return { name, description, model, tools, instructions, extra };
    }
  }

  return null;
}

function renderAgent(parsed, targetEngine, existingTarget) {
  if (targetEngine === 'codex') {
    return [
      `name = "${parsed.name}"`,
      `description = "${parsed.description.replace(/"/g, '\\"')}"`,
      'sandbox_mode = "workspace-write"',
      `developer_instructions = '''`,
      parsed.instructions,
      `'''`,
      '',
    ].join('\n');
  }

  let mappedModel = parsed.model;
  let modelTier = parsed.extra && parsed.extra.model_tier;
  let toolsAccess = parsed.extra && parsed.extra.tools_access;

  if (existingTarget && existingTarget.extra) {
    if (!modelTier && existingTarget.extra.model_tier) modelTier = existingTarget.extra.model_tier;
    if (!toolsAccess && existingTarget.extra.tools_access) toolsAccess = existingTarget.extra.tools_access;
  }

  if (targetEngine === 'claude') {
    if (parsed.model === 'flash') {
      mappedModel = 'sonnet';
      if (!modelTier) modelTier = 'flash';
    } else {
      mappedModel = 'opus';
      if (!modelTier) modelTier = 'pro';
    }
  } else if (targetEngine === 'agents') {
    mappedModel = (parsed.model === 'sonnet' || parsed.model === 'flash') ? 'flash' : 'pro';
  }

  const fmLines = [
    '---',
    `name: ${parsed.name}`,
    `description: ${parsed.description}`,
  ];
  if (targetEngine === 'claude') {
    if (modelTier) fmLines.push(`model_tier: ${modelTier}`);
    if (toolsAccess) fmLines.push(`tools_access: ${toolsAccess}`);
    fmLines.push(`model: ${mappedModel}`);
  }
  fmLines.push('tools:');
  for (const t of parsed.tools || ['Read', 'Grep', 'Glob', 'Bash', 'Write']) {
    fmLines.push(`  - ${t}`);
  }
  if (targetEngine === 'agents') {
    fmLines.push(`model: ${mappedModel}`);
  }
  fmLines.push('---', '', parsed.instructions, '');

  return fmLines.join('\n');
}

// -------------------------------------------------------------
// 3. HOOK SCRIPT TRANSPILER
// -------------------------------------------------------------

function transpileHookScript(content, fromEngine, toEngine) {
  if (!content) return null;
  const fromDir = fromEngine === 'agents' ? '.agents' : fromEngine === 'claude' ? '.claude' : '.codex';
  const toDir = toEngine === 'agents' ? '.agents' : toEngine === 'claude' ? '.claude' : '.codex';

  let res = content;
  if (fromDir !== toDir) {
    res = res.split(fromDir + '/').join(toDir + '/');
  }

  if (toEngine === 'claude') {
    res = res.replace(/hooks\.json/g, 'settings.json');
  } else {
    res = res.replace(/settings\.json/g, 'hooks.json');
  }

  return res;
}

// -------------------------------------------------------------
// 4. CHÍNH SÁCH ĐỒNG BỘ CHÍNH
// -------------------------------------------------------------

function syncRules(sourceEngine, targets, dryRun, stats) {
  console.log(`\n=== [1/4] Đồng Bộ Rules (Nguồn: ${ENGINES[sourceEngine].name}) ===`);
  const srcDir = path.join(ENGINES[sourceEngine].dir, 'rules');
  if (!fs.existsSync(srcDir)) return;

  const ruleFiles = fs.readdirSync(srcDir).filter((f) => f.endsWith('.md'));

  for (const file of ruleFiles) {
    const srcPath = path.join(srcDir, file);
    const content = readText(srcPath);
    const parsed = parseRule(content);
    if (!parsed) continue;

    for (const target of targets) {
      const destPath = path.join(ENGINES[target].dir, 'rules', file);
      let targetDesc = parsed.description;
      if (!targetDesc && fs.existsSync(destPath)) {
        const destParsed = parseRule(readText(destPath));
        if (destParsed && destParsed.description) targetDesc = destParsed.description;
      }

      const ruleToRender = { ...parsed, description: targetDesc };
      const rendered = renderRule(ruleToRender, target, sourceEngine);
      const existing = readText(destPath);

      if (existing !== rendered) {
        stats.rules++;
        writeText(destPath, rendered, dryRun);
      }
    }
  }
}

function syncRecipes(sourceEngine, targets, dryRun, stats) {
  console.log(`\n=== [2/4] Đồng Bộ Recipes (Nguồn: ${ENGINES[sourceEngine].name}) ===`);
  const srcDir = path.join(ENGINES[sourceEngine].dir, 'recipes');
  if (!fs.existsSync(srcDir)) return;

  for (const target of targets) {
    const destDir = path.join(ENGINES[target].dir, 'recipes');
    copyDirRecursive(srcDir, destDir, dryRun);
    stats.recipes++;
  }
}

function syncSkills(sourceEngine, targets, dryRun, stats) {
  console.log(`\n=== [3/4] Đồng Bộ Skills (Nguồn: ${ENGINES[sourceEngine].name}) ===`);
  const agentsSkills = path.join(ENGINES.agents.dir, 'skills');
  const claudeSkills = path.join(ENGINES.claude.dir, 'skills');

  if (sourceEngine === 'claude') {
    copyDirRecursive(claudeSkills, agentsSkills, dryRun);
  } else {
    copyDirRecursive(agentsSkills, claudeSkills, dryRun);
  }
  stats.skills++;
}

function syncAgents(sourceEngine, targets, dryRun, stats) {
  console.log(`\n=== [4/4] Đồng Bộ Subagents (Nguồn: ${ENGINES[sourceEngine].name}) ===`);
  const srcDir = path.join(ENGINES[sourceEngine].dir, 'agents');
  if (!fs.existsSync(srcDir)) return;

  const agentFiles = fs.readdirSync(srcDir).filter((f) => f.endsWith('.md') || f.endsWith('.toml'));

  for (const file of agentFiles) {
    const srcPath = path.join(srcDir, file);
    const parsed = parseAgent(srcPath);
    if (!parsed) continue;

    for (const target of targets) {
      const destExt = target === 'codex' ? '.toml' : '.md';
      const destFile = parsed.name + destExt;
      const destPath = path.join(ENGINES[target].dir, 'agents', destFile);

      const existingParsed = fs.existsSync(destPath) ? parseAgent(destPath) : null;
      const rendered = renderAgent(parsed, target, existingParsed);
      const existing = readText(destPath);

      if (existing !== rendered) {
        stats.agents++;
        writeText(destPath, rendered, dryRun);
      }
    }
  }
}

function syncHooks(sourceEngine, targets, dryRun, stats) {
  console.log(`\n=== [*] Kiểm tra & Đồng bộ Hooks Chung ===`);
  const srcDir = path.join(ENGINES[sourceEngine].dir, 'hooks');
  if (!fs.existsSync(srcDir)) return;

  for (const scriptName of COMMON_HOOK_SCRIPTS) {
    const srcPath = path.join(srcDir, scriptName);
    const content = readText(srcPath);
    if (!content) continue;

    for (const target of targets) {
      const destPath = path.join(ENGINES[target].dir, 'hooks', scriptName);
      const transpiled = transpileHookScript(content, sourceEngine, target);
      const existing = readText(destPath);

      if (existing !== transpiled) {
        stats.hooks++;
        writeText(destPath, transpiled, dryRun);
      }
    }
  }
}

// -------------------------------------------------------------
// 5. MAIN ENTRY POINT
// -------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  let sourceEngine = 'agents';
  let dryRun = false;
  let checkOnly = false;
  let includeHooks = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source' && args[i + 1]) {
      sourceEngine = args[i + 1].toLowerCase();
      i++;
    } else if (args[i] === '--dry-run') {
      dryRun = true;
    } else if (args[i] === '--check') {
      checkOnly = true;
      dryRun = true;
    } else if (args[i] === '--hooks') {
      includeHooks = true;
    }
  }

  if (!ENGINES[sourceEngine]) {
    console.error(`[ERROR] Engine nguồn không hợp lệ: "${sourceEngine}". Chọn một trong: agents, claude, codex`);
    process.exit(1);
  }

  const targets = Object.keys(ENGINES).filter((e) => e !== sourceEngine);

  console.log('---------------------------------------------------------');
  console.log(`  AI Engine Synchronizer — UniversalAgent`);
  console.log(`  Engine nguồn: ${ENGINES[sourceEngine].name}`);
  console.log(`  Engine đích : ${targets.map((t) => ENGINES[t].name).join(', ')}`);
  console.log(`  Chế độ      : ${dryRun ? (checkOnly ? 'CHECK ONLY' : 'DRY-RUN') : 'LIVE WRITE'}`);
  console.log('---------------------------------------------------------');

  const stats = { rules: 0, recipes: 0, skills: 0, agents: 0, hooks: 0 };

  syncRules(sourceEngine, targets, dryRun, stats);
  syncRecipes(sourceEngine, targets, dryRun, stats);
  syncSkills(sourceEngine, targets, dryRun, stats);
  syncAgents(sourceEngine, targets, dryRun, stats);

  if (includeHooks) {
    syncHooks(sourceEngine, targets, dryRun, stats);
  }

  console.log('\n---------------------------------------------------------');
  console.log(`  TỔNG KẾT:`);
  console.log(`  - Rules cập nhật    : ${stats.rules}`);
  console.log(`  - Subagents cập nhật: ${stats.agents}`);
  console.log(`  - Hooks cập nhật    : ${stats.hooks}`);
  console.log('---------------------------------------------------------');

  if (includeHooks && stats.hooks > 0 && !dryRun) {
    console.warn('\n[CẢNH BÁO QUAN TRỌNG VỀ CODEX]:');
    console.warn('Bạn vừa cập nhật script hook. Codex lưu trust theo hash của file.');
    console.warn('BẮT BUỘC mở Codex CLI và gõ lệnh `/hooks` để review và trust lại!\n');
  }

  console.log('\n[PASS] Hoàn tất đồng bộ các AI Engine thành công!');
}

main();
