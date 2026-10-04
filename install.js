#!/usr/bin/env node
// UniversalAgent Installer — lõi duy nhất cho mọi nền tảng.
// install.ps1 / install.sh / start.bat chỉ là wrapper gọi file này.
//
// Dùng: node install.js <thư-mục-đích> [--dry-run] [--yes]
//
// Phân quyền sở hữu file:
//   - Framework (.claude/ .agents/ .codex/): ghi đè. File bị sửa tay (lệch hash so với lần cài
//     trước) hoặc chưa từng do installer cài -> sao lưu vào .ua-backup/<thời điểm>/ trước khi ghi.
//     File framework mà bản UA mới đã bỏ -> xoá (hoặc sao lưu nếu bị sửa tay).
//   - Project (AGENTS.md, file khung trong Docs/, .gitignore, .editorconfig, .gitattributes, kg-*.md, file tự thêm):
//     chỉ tạo khi chưa có, không bao giờ ghi đè.
//   - Setup cũ (.ai/ + junction): gỡ junction (chỉ gỡ link), chuyển .ai/ và registry cũ vào backup.
// Trạng thái cài đặt lưu ở .universalagent.json (phiên bản UA + hash từng file framework).

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');
const { execFileSync } = require('child_process');

const SOURCE = __dirname;
const ENGINE_DIRS = ['.claude', '.agents', '.codex'];
const ROOT_FILES = ['.editorconfig', '.gitignore', '.gitattributes'];
const MANIFEST = '.universalagent.json';
const BACKUP_ROOT = '.ua-backup';
const SOURCE_EXCLUDE = /(^|\/)settings\.local\.json$|(^|\/)rules\/kg-[^/]+\.md$/;
const LEGACY_FILES = ['.ai', '.agents/skills.json'];
const DOCS_SEED = /(-template|\/README)\.txt$/;

// ---------- tiện ích ----------

const toPosix = (p) => p.split(path.sep).join('/');
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

function lstatOrNull(p) {
  try { return fs.lstatSync(p); } catch (err) { return null; }
}

function walkFiles(root, rel = '') {
  const out = [];
  const abs = path.join(root, rel);
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const childRel = rel ? `${rel}/${entry.name}` : entry.name;
    // Không bao giờ đi xuyên junction/symlink — tránh đụng vào thư mục đích của link.
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) out.push(...walkFiles(root, childRel));
    else if (entry.isFile()) out.push(childRel);
  }
  return out;
}

function git(args) {
  try {
    return execFileSync('git', ['-C', SOURCE, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (err) {
    return null;
  }
}

// File framework lấy theo git (chính xác, bỏ file rác chưa track); không có git thì quét thư mục.
function listSourceFiles() {
  const tracked = git(['ls-files', '--', ...ENGINE_DIRS]);
  const files = tracked !== null
    ? tracked.split('\n').filter(Boolean)
    : ENGINE_DIRS.filter((d) => fs.existsSync(path.join(SOURCE, d))).flatMap((d) => walkFiles(SOURCE, d));
  return files.filter((f) => !SOURCE_EXCLUDE.test(f)).sort();
}

function sourceVersion() {
  const commit = git(['rev-parse', '--short', 'HEAD']);
  if (!commit) return 'unknown';
  const dirty = git(['status', '--porcelain']);
  return dirty ? `${commit}-dirty` : commit;
}

function findJunctions(target) {
  const out = [];
  for (const dir of ENGINE_DIRS) {
    const abs = path.join(target, dir);
    if (!fs.existsSync(abs)) continue;
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) out.push(`${dir}/${entry.name}`);
    }
  }
  return out;
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => { rl.close(); resolve(answer.trim()); }));
}

// ---------- lập kế hoạch (không ghi gì) ----------

function buildPlan(target) {
  const plan = { unlink: [], legacyMove: [], write: [], backupThenWrite: [], remove: [], backupThenRemove: [], create: [], warnings: [] };

  const manifestPath = path.join(target, MANIFEST);
  const oldManifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : null;
  const oldHashes = (oldManifest && oldManifest.files) || {};

  // Setup cũ: junction trong thư mục engine phải gỡ TRƯỚC, nếu không mọi lệnh ghi sẽ xuyên vào .ai/.
  plan.unlink = findJunctions(target);
  plan.legacyMove = LEGACY_FILES.filter((f) => lstatOrNull(path.join(target, f)));

  const sourceFiles = listSourceFiles();
  const sourceSet = new Set(sourceFiles);
  const junctionPrefixes = plan.unlink.map((j) => `${j}/`);

  for (const rel of sourceFiles) {
    const dest = path.join(target, rel);
    // File nằm dưới junction sẽ biến mất khi gỡ link -> coi như chưa có.
    const underJunction = junctionPrefixes.some((p) => rel.startsWith(p));
    const stat = underJunction ? null : lstatOrNull(dest);
    if (!stat) { plan.write.push(rel); continue; }
    const current = sha256(dest);
    if (current === sha256(path.join(SOURCE, rel))) continue;
    if (oldHashes[rel] === current) plan.write.push(rel);
    else plan.backupThenWrite.push(rel);
  }

  for (const rel of Object.keys(oldHashes)) {
    if (sourceSet.has(rel)) continue;
    const dest = path.join(target, rel);
    if (!fs.existsSync(dest)) continue;
    if (sha256(dest) === oldHashes[rel]) plan.remove.push(rel);
    else plan.backupThenRemove.push(rel);
  }

  // File của project: chỉ tạo khi chưa có. Từ Docs/ chỉ lấy file khung — tài liệu riêng của
  // UniversalAgent (Decisions, Done...) không được lan sang project đích.
  const docsFiles = (fs.existsSync(path.join(SOURCE, 'Docs')) ? walkFiles(SOURCE, 'Docs') : [])
    .filter((f) => DOCS_SEED.test(f));
  for (const rel of [...docsFiles, ...ROOT_FILES]) {
    if (fs.existsSync(path.join(SOURCE, rel)) && !fs.existsSync(path.join(target, rel))) plan.create.push({ rel, from: rel });
  }
  if (!fs.existsSync(path.join(target, 'AGENTS.md'))) plan.create.push({ rel: 'AGENTS.md', from: 'AGENTS_TEMPLATE.md' });

  // Cảnh báo những thứ installer cố tình không tự xử lý.
  if (fs.existsSync(path.join(target, 'CLAUDE.md'))) {
    plan.warnings.push('Có CLAUDE.md — setup mới chỉ dùng AGENTS.md. Gộp nội dung riêng (nếu có) vào AGENTS.md rồi xoá CLAUDE.md.');
  }
  const agentsMd = path.join(target, 'AGENTS.md');
  if (fs.existsSync(agentsMd) && !fs.readFileSync(agentsMd, 'utf8').includes('Phân Vùng Tri Thức')) {
    plan.warnings.push('AGENTS.md chưa có mục "Phân Vùng Tri Thức" và mục "Bản Đồ Hệ Thống AI" kiểu mới — đối chiếu AGENTS_TEMPLATE.md của UniversalAgent để cập nhật tay.');
  }
  const gitignore = path.join(target, '.gitignore');
  if (fs.existsSync(gitignore)) {
    const stale = fs.readFileSync(gitignore, 'utf8').split(/\r?\n/)
      .filter((line) => /^\/?\.(claude|agents|codex)\/(hooks|recipes|rules|skills)\/?$/.test(line.trim()));
    if (stale.length) plan.warnings.push(`.gitignore còn dòng ignore junction của setup cũ (${stale.join(', ')}) — nên xoá, nếu không file framework sẽ không được commit.`);
  }

  return { plan, oldManifest, sourceFiles };
}

function printPlan(plan, oldManifest, version) {
  const section = (title, items) => {
    if (!items.length) return;
    console.log(`\n${title} (${items.length}):`);
    for (const item of items) console.log(`  - ${typeof item === 'string' ? item : item.rel}`);
  };
  const mode = oldManifest ? `NÂNG CẤP ${oldManifest.version} -> ${version}`
    : (plan.unlink.length || plan.legacyMove.length) ? `CHUYỂN TỪ SETUP CŨ -> ${version}` : `CÀI MỚI ${version}`;
  console.log(`\nChế độ: ${mode}`);
  section('Gỡ junction của setup cũ (chỉ gỡ link)', plan.unlink);
  section('Chuyển setup cũ vào backup', plan.legacyMove);
  section('Ghi file framework', plan.write);
  section('Sao lưu rồi ghi đè (file đã bị sửa tay hoặc không do installer cài)', plan.backupThenWrite);
  section('Xoá file framework mà bản mới đã bỏ', plan.remove);
  section('Sao lưu rồi xoá (file đã bỏ nhưng bị sửa tay)', plan.backupThenRemove);
  section('Tạo file project còn thiếu', plan.create);
  section('CẢNH BÁO — cần xử lý tay', plan.warnings);
}

// ---------- thực thi ----------

function apply(target, plan, sourceFiles, version) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(target, BACKUP_ROOT, stamp);
  const moveToBackup = (rel) => {
    const dest = path.join(backupDir, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.renameSync(path.join(target, rel), dest);
  };
  const copyFromSource = (from, rel) => {
    const dest = path.join(target, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(SOURCE, from), dest);
  };

  for (const rel of plan.unlink) fs.unlinkSync(path.join(target, rel));
  for (const rel of plan.legacyMove) moveToBackup(rel);
  for (const rel of plan.backupThenWrite) moveToBackup(rel);
  for (const rel of [...plan.write, ...plan.backupThenWrite]) copyFromSource(rel, rel);
  for (const rel of plan.backupThenRemove) moveToBackup(rel);
  for (const rel of plan.remove) fs.unlinkSync(path.join(target, rel));
  for (const { rel, from } of plan.create) copyFromSource(from, rel);

  const files = {};
  for (const rel of sourceFiles) files[rel] = sha256(path.join(target, rel));
  const manifest = { source: 'UniversalAgent', version, installedAt: new Date().toISOString(), files };
  fs.writeFileSync(path.join(target, MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`);

  return fs.existsSync(backupDir) ? backupDir : null;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const yes = args.includes('--yes');
  const targetArg = args.find((a) => !a.startsWith('--'));
  if (!targetArg) {
    console.error('Thiếu thư mục đích. Dùng: node install.js <thư-mục-đích> [--dry-run] [--yes]');
    process.exit(1);
  }

  const target = path.resolve(targetArg);
  if (target === path.resolve(SOURCE)) {
    console.error('Thư mục đích không được là chính thư mục nguồn UniversalAgent.');
    process.exit(1);
  }
  if (!dryRun) fs.mkdirSync(target, { recursive: true });

  const version = sourceVersion();
  const { plan, oldManifest, sourceFiles } = buildPlan(target);

  console.log(`UniversalAgent installer — đích: ${target}`);
  printPlan(plan, oldManifest, version);

  const changes = plan.unlink.length + plan.legacyMove.length + plan.write.length + plan.backupThenWrite.length
    + plan.remove.length + plan.backupThenRemove.length + plan.create.length;
  if (dryRun) { console.log('\n[DRY-RUN] Không ghi gì.'); return; }
  if (!changes && oldManifest && oldManifest.version === version) { console.log('\nĐã ở bản mới nhất, không có gì để làm.'); return; }

  if (!yes) {
    const answer = await ask('\nÁp dụng các thay đổi trên? (y/N) ');
    if (!/^y(es)?$/i.test(answer)) { console.log('Đã huỷ, không ghi gì.'); return; }
  }

  const backupDir = apply(target, plan, sourceFiles, version);
  console.log('\nHoàn tất.');
  if (backupDir) console.log(`Bản sao lưu: ${backupDir} — kiểm tra rồi tự xoá khi không cần nữa.`);
  if (!oldManifest && !(plan.unlink.length || plan.legacyMove.length)) {
    console.log("Bước tiếp theo: mở project bằng Claude Code / Antigravity / Codex và gõ '/init'.");
  }
}

main().catch((err) => {
  console.error(`Lỗi: ${err.message}`);
  process.exit(1);
});
