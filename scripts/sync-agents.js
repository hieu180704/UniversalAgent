// Universal Multi-Platform Sync
//
// Nguồn duy nhất (viết tay): .agents/rules/, .agents/recipes/, .agents/hooks/, .agents/skills/
// Mọi thứ khác trong danh sách dưới đây do script này SINH RA — đừng sửa trực tiếp.
//
// Cách dùng:
//   node scripts/sync-agents.js           Sinh lại toàn bộ file đích
//   node scripts/sync-agents.js --check   Không ghi gì, chỉ báo file nào đang lệch nguồn
//                                         (exit 1 nếu có lệch — dùng cho pre-commit / CI)

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const CHECK_ONLY = process.argv.includes('--check');

const AGENTS_DIR = path.join(root, '.agents');
const RULES_DIR = path.join(AGENTS_DIR, 'rules');
const RECIPES_DIR = path.join(AGENTS_DIR, 'recipes');
const HOOKS_DIR = path.join(AGENTS_DIR, 'hooks');
const SKILLS_DIR = path.join(AGENTS_DIR, 'skills');

// Thứ tự trình bày rule trong file sinh ra. File nào không nằm trong danh sách
// sẽ được nối thêm ở cuối theo thứ tự alphabet.
const RULE_ORDER = [
  'core-protocol.md',
  'quality-standards.md',
  'doc-policy.md',
  'knowledge-graph.md',
];

const MARK_BEGIN = '<!-- UA:RULES:BEGIN -->';
const MARK_END = '<!-- UA:RULES:END -->';
const GENERATED_TAG = 'UA:GENERATED';

const changed = [];
const drifted = [];

// ---------------------------------------------------------------------------
// Tiện ích file
// ---------------------------------------------------------------------------

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
}

function listDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function rel(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

// Ghi file, chuẩn hoá xuống dòng LF. Ở chế độ --check chỉ so sánh, không ghi.
function writeOut(file, content) {
  const normalized = content.replace(/\r\n/g, '\n');
  const existed = fs.existsSync(file);
  const current = existed ? read(file).replace(/\r\n/g, '\n') : null;

  if (current === normalized) return;

  if (CHECK_ONLY) {
    drifted.push(existed ? `lệch nguồn: ${rel(file)}` : `thiếu: ${rel(file)}`);
    return;
  }

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, normalized, 'utf8');
  changed.push(rel(file));
}

function removeOut(file, reason) {
  if (!fs.existsSync(file)) return;

  if (CHECK_ONLY) {
    drifted.push(`thừa (${reason}): ${rel(file)}`);
    return;
  }

  fs.unlinkSync(file);
  changed.push(`${rel(file)} (đã xoá — ${reason})`);
}

// ---------------------------------------------------------------------------
// Xử lý nội dung Markdown
// ---------------------------------------------------------------------------

// Bỏ khối "# Mục lục ... ---" của từng file rule: file tổng hợp có mục lục riêng.
function stripToc(md) {
  const lines = md.split('\n');
  const start = lines.findIndex((line) => /^#+\s*Mục lục\s*$/i.test(line));
  if (start === -1) return md;

  let end = start + 1;
  while (end < lines.length && lines[end].trim() !== '---') end += 1;
  if (end >= lines.length) return md;

  lines.splice(start, end - start + 1);
  return lines.join('\n').replace(/^\n+/, '');
}

// Hạ bậc heading để 4 rule ghép được vào chung một tài liệu mà vẫn đúng thứ bậc.
// File nguồn dùng "# Tiêu đề" cho tên rule và "# 1. Tên mục" cho các mục con —
// cùng cấp 1, nên mục con phải hạ 2 bậc thì cây heading mới không bị phẳng.
function demoteHeadings(md) {
  return md
    .split('\n')
    .map((line) => {
      if (/^#\s+\d+\./.test(line)) return `##${line}`;
      if (/^#{1,4} /.test(line)) return `#${line}`;
      return line;
    })
    .join('\n');
}

function firstHeading(md) {
  const line = md.split('\n').find((item) => /^#\s+/.test(item));
  return line ? line.replace(/^#\s+/, '').trim() : '';
}

// Danh sách heading cấp 1 dạng "# 1. Tên mục" của một file rule — dùng làm mô tả
// tự sinh, không cần bảng mô tả viết tay (thứ chắc chắn sẽ lệch theo thời gian).
function sectionTitles(md) {
  return md
    .split('\n')
    .filter((line) => /^#\s+\d+\./.test(line))
    .map((line) => line.replace(/^#\s+\d+\.\s*/, '').trim());
}

function frontmatterField(md, field) {
  const match = md.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return '';
  const line = match[1].split('\n').find((item) => item.startsWith(`${field}:`));
  return line ? line.slice(field.length + 1).trim() : '';
}

// ---------------------------------------------------------------------------
// Thu thập dữ liệu nguồn
// ---------------------------------------------------------------------------

function ruleFiles() {
  const present = listFiles(RULES_DIR).filter((name) => name.endsWith('.md'));
  const ordered = RULE_ORDER.filter((name) => present.includes(name));
  const extra = present.filter((name) => !RULE_ORDER.includes(name));
  return [...ordered, ...extra];
}

function skillEntries() {
  return listDirs(SKILLS_DIR)
    .map((name) => {
      const file = path.join(SKILLS_DIR, name, 'SKILL.md');
      if (!fs.existsSync(file)) return null;
      return { name, raw: read(file), description: frontmatterField(read(file), 'description') };
    })
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Sinh nội dung
// ---------------------------------------------------------------------------

// Toàn văn 4 rule, ghép thành một tài liệu — dùng cho AGENTS.md, vì Codex chỉ
// nạp đúng file đó và không tự đọc thư mục .agents/rules/.
function renderFullRules() {
  return ruleFiles()
    .map((file) => {
      const body = demoteHeadings(stripToc(read(path.join(RULES_DIR, file)))).trim();
      const [heading, ...rest] = body.split('\n');
      return [heading, `*(nguồn: \`.agents/rules/${file}\`)*`, ...rest]
        .join('\n')
        .replace(/\n{3,}/g, '\n\n');
    })
    .join('\n\n---\n\n');
}

// Bảng chỉ mục recipes / hooks / skills — phần dùng chung cho mọi file đích.
function catalogTables() {
  const recipes = listFiles(RECIPES_DIR)
    .filter((file) => file.endsWith('.md') && file !== '00-recipe-index.md')
    .map((file) => {
      const title = firstHeading(read(path.join(RECIPES_DIR, file))).replace(/^Recipe:\s*/, '');
      return `| \`${file}\` | ${title} |`;
    });

  const hooks = listFiles(HOOKS_DIR)
    .filter((file) => file.endsWith('.js'))
    .map((file) => {
      const head = read(path.join(HOOKS_DIR, file)).split('\n')[0].replace(/^\/\/\s*/, '');
      return `| \`${file}\` | ${head} |`;
    });

  const skills = skillEntries().map((skill) => `| \`/${skill.name}\` | ${skill.description} |`);

  return [
    '### Recipes — mẫu cấu trúc đầu ra',
    '',
    'Tra cứu tại `.agents/recipes/00-recipe-index.md` (bản cho Claude Code: `.claude/recipes/`).',
    '',
    '| File | Mẫu |',
    '| :--- | :--- |',
    ...recipes,
    '',
    '### Hooks — chốt chặn vòng đời',
    '',
    '| File | Vai trò |',
    '| :--- | :--- |',
    ...hooks,
    '',
    '### Skills — lệnh mở rộng',
    '',
    '| Lệnh | Mô tả |',
    '| :--- | :--- |',
    ...skills,
  ];
}

// Bản đồ chỉ mục đầy đủ — dùng cho CLAUDE.md: Claude Code tự nạp .claude/rules/
// nên chỉ cần bảng tra cứu, không cần chép lại nội dung rule.
function renderIndex() {
  const rules = ruleFiles().map((file) => {
    const raw = read(path.join(RULES_DIR, file));
    return `| \`${file}\` | ${firstHeading(raw)} | ${sectionTitles(raw).join(' · ')} |`;
  });

  return [
    '### Rules — quy tắc luôn có hiệu lực',
    '',
    '| File | Chủ đề | Các mục |',
    '| :--- | :--- | :--- |',
    ...rules,
    '',
    ...catalogTables(),
  ].join('\n');
}

// AGENTS.md phục vụ cả Antigravity lẫn Codex. Antigravity đọc thẳng .agents/rules/,
// nhưng Codex chỉ nạp đúng AGENTS.md — nên file này phải mang TOÀN VĂN rule,
// kèm danh mục recipes/hooks/skills để điều hướng.
function renderAgentsBlock() {
  return [
    renderFullRules(),
    '',
    '---',
    '',
    '## Danh Mục Recipes, Hooks & Skills',
    '',
    ...catalogTables(),
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Ghi vào file đích
// ---------------------------------------------------------------------------

// Chỉ thay phần nằm giữa hai marker; nội dung riêng của dự án nằm ngoài marker
// (phần do /init điền) được giữ nguyên tuyệt đối.
function applyMarkerBlock(file, body, label) {
  const block = [MARK_BEGIN, `<!-- ${GENERATED_TAG} — sinh bởi: node scripts/sync-agents.js -->`, '', body, '', MARK_END].join('\n');

  if (!fs.existsSync(file)) {
    writeOut(file, `${block}\n`);
    return;
  }

  const current = read(file);
  const begin = current.indexOf(MARK_BEGIN);
  const end = current.indexOf(MARK_END);

  if (begin === -1 || end === -1 || end < begin) {
    // Chưa có marker: nối vào cuối file, lần sau sẽ cập nhật đúng chỗ.
    const separator = current.endsWith('\n') ? '\n' : '\n\n';
    writeOut(file, `${current}${separator}---\n\n# ${label}\n\n${block}\n`);
    return;
  }

  const before = current.slice(0, begin);
  const after = current.slice(end + MARK_END.length);
  writeOut(file, `${before}${block}${after}`);
}

// Thư mục gương: nội dung do sync sở hữu hoàn toàn, file lạ sẽ bị dọn.
function mirrorDir(srcDir, destDir) {
  const srcFiles = listFiles(srcDir);
  for (const name of srcFiles) {
    writeOut(path.join(destDir, name), read(path.join(srcDir, name)));
  }
  for (const name of listFiles(destDir)) {
    if (!srcFiles.includes(name)) {
      removeOut(path.join(destDir, name), 'không còn ở nguồn');
    }
  }
}

// Skill -> slash command của Claude Code. Chèn marker để phân biệt file tự sinh
// với command người dùng tự viết (loại sau không bao giờ bị dọn).
function syncSkillsToCommands() {
  const commandsDir = path.join(root, '.claude', 'commands');
  const skills = skillEntries();

  for (const skill of skills) {
    const marker = `<!-- ${GENERATED_TAG} từ .agents/skills/${skill.name}/SKILL.md — sửa tại nguồn, chạy: node scripts/sync-agents.js -->`;
    const match = skill.raw.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
    const content = match ? `${match[1]}\n${marker}\n${match[2]}` : `${marker}\n${skill.raw}`;
    writeOut(path.join(commandsDir, `${skill.name}.md`), content);
  }

  const names = skills.map((skill) => skill.name);
  for (const file of listFiles(commandsDir)) {
    if (!file.endsWith('.md')) continue;
    const name = file.replace(/\.md$/, '');
    if (names.includes(name)) continue;
    if (!read(path.join(commandsDir, file)).includes(GENERATED_TAG)) continue;
    removeOut(path.join(commandsDir, file), 'skill nguồn đã bị xoá');
  }
}

// ---------------------------------------------------------------------------
// Chạy
// ---------------------------------------------------------------------------

console.log(
  CHECK_ONLY
    ? '🔍 Đang kiểm tra độ lệch giữa nguồn .agents/ và các file tự sinh...'
    : '🔄 Đang đồng bộ rules, recipes, hooks và skills ra toàn bộ nền tảng...'
);

// --- 1. Claude Code: gương của nguồn + slash commands ---
mirrorDir(RULES_DIR, path.join(root, '.claude', 'rules'));
mirrorDir(RECIPES_DIR, path.join(root, '.claude', 'recipes'));
mirrorDir(HOOKS_DIR, path.join(root, '.claude', 'hooks'));
syncSkillsToCommands();

// --- 2. Antigravity + Codex: dùng chung AGENTS.md, cần toàn văn rule ---
applyMarkerBlock(path.join(root, 'AGENTS.md'), renderAgentsBlock(), 'Quy Tắc Vận Hành & Danh Mục Mở Rộng');

// --- 3. Claude Code: CLAUDE.md chỉ cần bản đồ chỉ mục ---
applyMarkerBlock(path.join(root, 'CLAUDE.md'), renderIndex(), 'Bản Đồ Rules, Recipes, Hooks & Skills');

// --- Báo cáo ---
if (CHECK_ONLY) {
  if (drifted.length === 0) {
    console.log('✅ Không có độ lệch — mọi file tự sinh đều khớp nguồn.');
    process.exit(0);
  }
  console.error(`❌ Phát hiện ${drifted.length} điểm lệch:`);
  for (const item of drifted) console.error(`   - ${item}`);
  console.error('👉 Chạy: node scripts/sync-agents.js');
  process.exit(1);
}

if (changed.length === 0) {
  console.log('✅ Đã đồng bộ sẵn — không có gì thay đổi.');
} else {
  console.log(`✅ Đồng bộ hoàn tất — ${changed.length} file thay đổi:`);
  for (const item of changed) console.log(`   - ${item}`);
}
