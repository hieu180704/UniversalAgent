// Setup Directory Junctions for Multi-Agent Environment (.agents & .claude)
// Chạy: node .ai/setup-links.js

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');

const links = [
  { link: path.join(root, '.claude', 'rules'), target: path.join(root, '.ai', 'rules') },
  { link: path.join(root, '.claude', 'skills'), target: path.join(root, '.ai', 'skills') },
  { link: path.join(root, '.claude', 'recipes'), target: path.join(root, '.ai', 'recipes') },
  { link: path.join(root, '.claude', 'hooks'), target: path.join(root, '.ai', 'hooks') },
  { link: path.join(root, '.agents', 'rules'), target: path.join(root, '.ai', 'rules') },
  { link: path.join(root, '.agents', 'skills'), target: path.join(root, '.ai', 'skills') },
  { link: path.join(root, '.agents', 'recipes'), target: path.join(root, '.ai', 'recipes') },
  { link: path.join(root, '.agents', 'hooks'), target: path.join(root, '.ai', 'hooks') },
];

console.log('--- Setting up Multi-Agent Junctions ---');

for (const { link, target } of links) {
  try {
    if (fs.existsSync(link)) {
      try {
        fs.rmSync(link, { recursive: true, force: true });
      } catch {
        execSync(`cmd /c rmdir /s /q "${link}" 2>nul`);
      }
    }
    const parent = path.dirname(link);
    if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });

    execSync(`cmd /c mklink /J "${link}" "${target}"`);
    console.log(`[OK] Linked: ${path.relative(root, link)} -> ${path.relative(root, target)}`);
  } catch (err) {
    console.error(`[ERROR] Failed to link ${link}:`, err.message);
  }
}

console.log('--- Done ---');
