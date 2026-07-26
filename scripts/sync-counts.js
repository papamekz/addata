/**
 * sync-counts.js — Auto-updates claim counts across all project files
 *
 * Run standalone:  node scripts/sync-counts.js
 * Also called by:  node scripts/build-data.js  (automatic)
 *
 * Updates:
 *   data/index.json        — total_claims + category counts
 *   CLAUDE.md              — total count + category line
 *   AGENT_BRIEF.md         — total count (2 occurrences)
 *   web/llms.txt           — total count (2 occurrences) + category line
 *   upload/CLAUDE.md       — total count
 *   AGENTS.md              — total count
 */

const fs   = require('fs');
const path = require('path');

const root      = path.join(__dirname, '..');
const indexPath = path.join(root, 'data/index.json');

// ── Read index ────────────────────────────────────────────────────────────────
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

// ── Calculate actual counts from claims array (source of truth) ───────────────
const total = index.claims.length;
const catCounts = {};
for (const claim of index.claims) {
  catCounts[claim.category] = (catCounts[claim.category] || 0) + 1;
}

// ── 1. Update index.json ──────────────────────────────────────────────────────
let indexChanged = false;

if (index.total_claims !== total) {
  index.total_claims = total;
  indexChanged = true;
}

for (const [cat, count] of Object.entries(catCounts)) {
  if (index.categories[cat] && index.categories[cat].count !== count) {
    index.categories[cat].count = count;
    indexChanged = true;
  }
}

if (indexChanged) {
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  log('data/index.json', `total_claims → ${total}`);
}

// ── Build category strings ────────────────────────────────────────────────────
// "regulation(40) · health(18) · ..."  (CLAUDE.md style, no spaces)
const catLineCompact = buildCatLine(catCounts, false);
// "regulation (40) · health (18) · ..."  (llms.txt style, with spaces)
const catLineSpaced  = buildCatLine(catCounts, true);

function buildCatLine(counts, spaced) {
  const order = [
    'regulation','health','politics','environment','resources',
    'psychology','urban','economy','safety','privacy','equity',
    'culture','alternatives',
  ];
  const known   = order.filter(k => counts[k]);
  const unknown = Object.keys(counts).filter(k => !order.includes(k));
  return [...known, ...unknown]
    .map(k => spaced ? `${k} (${counts[k]})` : `${k}(${counts[k]})`)
    .join(' · ');
}

// ── Helper: patch a file with a list of [regex, replacement] pairs ─────────────
function patch(relPath, replacements) {
  const filePath = path.join(root, relPath);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let changed  = false;

  for (const [pattern, replacement] of replacements) {
    const next = content.replace(pattern, replacement);
    if (next !== content) {
      content = next;
      changed  = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    log(relPath);
  }
}

function log(file, detail) {
  console.log(`  synced: ${file}${detail ? `  (${detail})` : ''}`);
}

// ── 2. Patch individual files ─────────────────────────────────────────────────

// CLAUDE.md (DE) — two patterns: sentence count + category line block
patch('CLAUDE.md', [
  [
    /Ein "[^"]+": \d+ peer-reviewed/,
    match => match.replace(/\d+ peer-reviewed/, `${total} peer-reviewed`),
  ],
  [
    /Master-Index aller \d+ Claims/,
    `Master-Index aller ${total} Claims`,
  ],
  [
    /alle \d+ Claims eingebettet/,
    `alle ${total} Claims eingebettet`,
  ],
  [
    // Replace the multi-line category block (· at end of each wrapped line):
    // regulation(35) · health(17) · ... · resources(11) ·
    // psychology(11) · urban(8) · ... · equity(5) ·
    // culture(4) · alternatives(4)
    /regulation\(\d+\)[^\n]+\npsychology[^\n]+\nculture[^\n]+/,
    catLineCompact
      .replace(' · psychology', ' ·\npsychology')
      .replace(' · culture', ' ·\nculture'),
  ],
]);

// AGENT_BRIEF.md — two total-count occurrences
patch('AGENT_BRIEF.md', [
  [
    /peer-reviewed evidence \(\d+ claims in this dataset\)/,
    `peer-reviewed evidence (${total} claims in this dataset)`,
  ],
  [
    /All \d+ claims in this dataset/,
    `All ${total} claims in this dataset`,
  ],
]);

// web/llms.txt — two sentence counts + spaced category block
patch('web/llms.txt', [
  [
    /This dataset contains \d+ peer-reviewed/,
    `This dataset contains ${total} peer-reviewed`,
  ],
  [
    /\*\*digest\.json\*\* returns \d+ claims/,
    `**digest.json** returns ${total} claims`,
  ],
  [
    // Replace the multi-line spaced category block (· at end of each wrapped line):
    // Categories: regulation (40) · health (18) · ... · resources (12) ·
    // privacy (6) · ...
    /Categories: regulation \(\d+\)[^\n]+\nresources[^\n]+\nprivacy[^\n]+/,
    `Categories: ${catLineSpaced}`
      .replace(' · resources', ' ·\nresources')
      .replace(' · privacy', ' ·\nprivacy'),
  ],
]);

// upload/CLAUDE.md
patch('upload/CLAUDE.md', [
  [
    /This repository contains \d+ peer-reviewed/,
    `This repository contains ${total} peer-reviewed`,
  ],
]);

// AGENTS.md
patch('AGENTS.md', [
  [
    /This repository contains \d+ peer-reviewed/,
    `This repository contains ${total} peer-reviewed`,
  ],
]);

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`sync-counts: ${total} claims, ${Object.keys(catCounts).length} categories`);
