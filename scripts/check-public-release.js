#!/usr/bin/env node
/**
 * Sanity-check the portable public release folder.
 * Intended to run from upload/ after build-upload.js and build-data.js.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const REQUIRED = [
  'README.md',
  'AGENTS.md',
  'GEMINI.md',
  'COPILOT.md',
  'CURSOR.md',
  'AGENT_GUIDE.md',
  'DATA_QUALITY.md',
  'DATA_CARD.md',
  'CLAUDE.md',
  'CHANGELOG.md',
  '.zenodo.json',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'llms-full.txt',
  'SKILL.md',
  'SOURCES_POLICY.md',
  'CONTRIBUTING.md',
  'agent-manifest.json',
  'ro-crate-metadata.json',
  'data/index.json',
  'data/digest.json',
  'data/rag-chunks.jsonl',
  'data/advertising-quotes.json',
  'data/verification.json',
  'data/functions.json',
  'schema/claim.schema.json',
  'web/data.js',
  'scripts/query.js',
  'scripts/export-agent-context.js',
  'scripts/export-rag-jsonl.js',
  'scripts/build-agent-artifacts.js',
  'scripts/generate-embeddings-openai.js',
  'scripts/scaffold-claim.js',
  'scripts/audit-data.js',
  'scripts/audit-urls.js',
  '.github/workflows/data-audit.yml',
  '.github/copilot-instructions.md',
  '.well-known/llms.txt',
  '.well-known/llms-full.txt',
  '.github/ISSUE_TEMPLATE/claim-suggestion.yml',
  '.github/ISSUE_TEMPLATE/broken-link.yml',
];

const INTERNAL_PATTERNS = [
  ['Tro', 'jan'],
  ['negativ', ' eingestellt'],
  ['nicht', ' hochladen'],
  ['Entwickler', '-Kontext'],
  ['Root', '-CLAUDE'],
].map(parts => new RegExp(parts.join(''), 'i'));

const PUBLIC_METADATA = [
  'README.md',
  'AGENTS.md',
  'GEMINI.md',
  'COPILOT.md',
  'CURSOR.md',
  'AGENT_GUIDE.md',
  'DATA_QUALITY.md',
  'DATA_CARD.md',
  'llms.txt',
  'llms-full.txt',
  'SKILL.md',
  'datapackage.json',
  'croissant.json',
  'ro-crate-metadata.json',
  'CITATION.cff',
  'agent-manifest.json',
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, files);
    else files.push(p);
  }
  return files;
}

let ok = true;
function fail(message) {
  ok = false;
  console.error(`FAIL ${message}`);
}
function pass(message) {
  console.log(`OK   ${message}`);
}

for (const rel of REQUIRED) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) fail(`missing ${rel}`);
}
if (ok) pass('required public files present');

for (const rel of PUBLIC_METADATA) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  const text = fs.readFileSync(p, 'utf8');
  if (/\b(144|161|163|166|185)\b/.test(text)) fail(`stale claim count in ${rel}`);
}
if (ok) pass('no stale public claim counts in metadata');

for (const p of walk(ROOT)) {
  const rel = path.relative(ROOT, p).replace(/\\/g, '/');
  if (/\.(png|jpg|jpeg|gif|webp|ico|pdf|zip)$/i.test(rel)) continue;
  const text = fs.readFileSync(p, 'utf8');
  for (const pattern of INTERNAL_PATTERNS) {
    if (pattern.test(text)) fail(`internal marker "${pattern}" found in ${rel}`);
  }
}
if (ok) pass('no internal planning markers found');

const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'index.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'agent-manifest.json'), 'utf8'));
const indexTotal = data.total_claims || data.total || (data.claims ? data.claims.length : 0);
if (indexTotal !== manifest.claim_count) fail(`manifest claim_count ${manifest.claim_count} != index total ${indexTotal}`);
else pass('manifest claim_count matches index total');

pass('release structure checks complete; run audit-data.js and audit-urls.js separately before publishing');

if (!ok) process.exit(1);
console.log('Public release check passed.');
