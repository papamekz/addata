#!/usr/bin/env node
/**
 * Builds the portable upload/ folder.
 * Copies all public-facing files, places upload/CLAUDE.md as the root CLAUDE.md.
 * Run: node scripts/build-upload.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DEST = path.join(ROOT, 'upload');

function copy(src, dest) {
  const destDir = path.dirname(dest);
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const s = path.join(srcDir, entry.name);
    const d = path.join(destDir, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else copy(s, d);
  }
}

// Files to include at root level
const rootFiles = [
  'README.md',
  'AGENTS.md',
  'GEMINI.md',
  'COPILOT.md',
  'CURSOR.md',
  'AGENT_GUIDE.md',
  'AGENT_CLAIM_WORKFLOW.md',
  'DATA_QUALITY.md',
  'DATA_CARD.md',
  'agent-manifest.json',
  'CHANGELOG.md',
  '.zenodo.json',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'SKILL.md',
  'SOURCES_POLICY.md',
  'QUICKREF.md',
  'CONTRIBUTING.md',
  'CITATION.cff',
  'datapackage.json',
  'croissant.json',
  'ro-crate-metadata.json',
  'LICENSE',
];

// Directories to include
const dirs = ['data', 'schema', 'web', 'templates', 'examples', '.github', '.well-known'];

// Files/dirs to exclude from web/
const webExclude = ['data.js']; // too large, regenerate on target

console.log('Building upload/ folder...\n');

// Clean destination (keep upload/CLAUDE.md as the new root CLAUDE.md)
const savedClaude = fs.readFileSync(path.join(DEST, 'CLAUDE.md'), 'utf8');

// Remove and recreate
fs.rmSync(DEST, { recursive: true, force: true });
fs.mkdirSync(DEST, { recursive: true });

// Restore CLAUDE.md as root CLAUDE.md in upload/
fs.writeFileSync(path.join(DEST, 'CLAUDE.md'), savedClaude);
console.log('✓ CLAUDE.md (from upload/CLAUDE.md)');

// Copy root files
for (const f of rootFiles) {
  const src = path.join(ROOT, f);
  if (fs.existsSync(src)) {
    copy(src, path.join(DEST, f));
    console.log(`✓ ${f}`);
  } else {
    console.warn(`  skipped (not found): ${f}`);
  }
}

// Copy directories
for (const dir of dirs) {
  const srcDir = path.join(ROOT, dir);
  const destDir = path.join(DEST, dir);
  if (!fs.existsSync(srcDir)) continue;

  if (dir === 'web') {
    // Copy web/ but skip excluded files
    fs.mkdirSync(destDir, { recursive: true });
    for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
      if (webExclude.includes(entry.name)) {
        console.log(`  skipped web/${entry.name} (too large — run build-data.js on target)`);
        continue;
      }
      const s = path.join(srcDir, entry.name);
      const d = path.join(destDir, entry.name);
      if (entry.isDirectory()) copyDir(s, d);
      else copy(s, d);
    }
    console.log(`✓ web/ (without data.js)`);
  } else {
    copyDir(srcDir, destDir);
    const count = fs.readdirSync(srcDir).length;
    console.log(`✓ ${dir}/ (${count} entries)`);
  }
}

// Add public scripts so target can rebuild data.js and search claims
const publicScripts = [
  'build-data.js',
  'sync-counts.js',
  'query.js',
  'audit-data.js',
  'audit-urls.js',
  'impact-calculator.js',
  'export-agent-context.js',
  'export-rag-jsonl.js',
  'build-agent-artifacts.js',
  'generate-embeddings-openai.js',
  'scaffold-claim.js',
  'check-public-release.js',
];
for (const s of publicScripts) {
  const scriptsSrc = path.join(ROOT, 'scripts', s);
  if (fs.existsSync(scriptsSrc)) {
    copy(scriptsSrc, path.join(DEST, 'scripts', s));
    console.log(`✓ scripts/${s}`);
  }
}

console.log('\nDone. upload/ is ready.');
console.log('Note: run "node scripts/build-data.js" in upload/ to regenerate web/data.js on the target.');
