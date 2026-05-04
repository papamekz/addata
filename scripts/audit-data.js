#!/usr/bin/env node
/**
 * audit-data.js — local consistency audit for the OOH/DOOH dataset.
 *
 * This is intentionally offline-only: it checks structural consistency, stale
 * counts, schema enum drift, and source metadata without touching the network.
 * Use it before publishing, then perform source-by-source verification for any
 * flagged high-risk claims.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'data/index.json');
const SCHEMA_PATH = path.join(ROOT, 'schema/claim.schema.json');
const VERIFICATION_PATH = path.join(ROOT, 'data/verification.json');

const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
const verification = fs.existsSync(VERIFICATION_PATH)
  ? JSON.parse(fs.readFileSync(VERIFICATION_PATH, 'utf8')).claims || {}
  : {};

const SOURCE_ENUM = new Set(schema.properties.source.properties.type.enum);
const IMPACT_ENUM = new Set(schema.properties.impact_type.items.enum);

const errors = [];
const warnings = [];
const singleSourceClaims = [];

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function frontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : '';
}

function scalar(fm, key) {
  const match = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!match) return null;
  return match[1].trim().replace(/^"|"$/g, '');
}

function listBlock(fm, key) {
  const lines = fm.split(/\r?\n/);
  const start = lines.findIndex(line => line === `${key}:`);
  if (start === -1) return [];
  const values = [];
  for (const line of lines.slice(start + 1)) {
    if (/^\S/.test(line)) break;
    const item = line.match(/^\s*-\s*(.+)$/);
    if (item) values.push(item[1].trim());
  }
  return values;
}

function nestedSourceType(fm) {
  const lines = fm.split(/\r?\n/);
  const start = lines.findIndex(line => line === 'source:');
  if (start === -1) return null;
  for (const line of lines.slice(start + 1)) {
    if (/^\S/.test(line)) break;
    const type = line.match(/^\s*type:\s*(.+)$/);
    if (type) return type[1].trim().replace(/^"|"$/g, '');
  }
  return null;
}

function nestedBoolean(fm, key) {
  const lines = fm.split(/\r?\n/);
  const start = lines.findIndex(line => line === 'source:');
  if (start === -1) return null;
  for (const line of lines.slice(start + 1)) {
    if (/^\S/.test(line)) break;
    const match = line.match(new RegExp(`^\\s*${key}:\\s*(true|false)$`));
    if (match) return match[1] === 'true';
  }
  return null;
}

function sourceUrls(fm) {
  return Array.from(fm.matchAll(/^\s*url:\s*"([^"]+)"/gm)).map(m => m[1]);
}

function categoryCounts() {
  const counts = {};
  for (const claim of index.claims) {
    counts[claim.category] = (counts[claim.category] || 0) + 1;
  }
  return counts;
}

if (index.total_claims !== index.claims.length) {
  errors.push(`data/index.json total_claims=${index.total_claims}, actual=${index.claims.length}`);
}

for (const [cat, count] of Object.entries(categoryCounts())) {
  const declared = index.categories[cat]?.count;
  if (declared !== count) {
    errors.push(`category ${cat} count=${declared}, actual=${count}`);
  }
}

const seen = new Set();
for (const claim of index.claims) {
  if (seen.has(claim.id)) errors.push(`duplicate id: ${claim.id}`);
  seen.add(claim.id);

  if (!fs.existsSync(path.join(ROOT, claim.file))) {
    errors.push(`${claim.id}: missing file ${claim.file}`);
    continue;
  }

  const fm = frontmatter(read(claim.file));
  const fmId = scalar(fm, 'id');
  const fmTitle = scalar(fm, 'title');
  const fmCategory = scalar(fm, 'category');
  const fmImpact = Number(scalar(fm, 'impact_score'));
  const fmType = nestedSourceType(fm);
  const independent = nestedBoolean(fm, 'independent');
  const urls = sourceUrls(fm);
  const impactTypes = listBlock(fm, 'impact_type');

  if (fmId !== claim.id) errors.push(`${claim.id}: frontmatter id=${fmId}`);
  if (fmTitle && fmTitle !== claim.title) warnings.push(`${claim.id}: index title differs from frontmatter`);
  if (fmCategory !== claim.category) errors.push(`${claim.id}: category index=${claim.category}, fm=${fmCategory}`);
  if (fmImpact !== claim.impact_score) errors.push(`${claim.id}: impact index=${claim.impact_score}, fm=${fmImpact}`);
  if (fmType !== claim.source_type) warnings.push(`${claim.id}: source_type index=${claim.source_type}, fm=${fmType}`);
  if (fmType && !SOURCE_ENUM.has(fmType)) errors.push(`${claim.id}: source.type not in schema enum: ${fmType}`);
  if (independent === false && !['source_critique', 'corrected'].includes(verification[claim.id]?.status)) {
    warnings.push(`${claim.id}: source.independent=false; use only as source-critique, self-admission, or clearly labelled commercial/industry estimate`);
  }
  if (!urls.length) errors.push(`${claim.id}: no source URL in frontmatter`);
  if (urls.length < 2) singleSourceClaims.push(claim.id);

  for (const impactType of impactTypes) {
    if (!IMPACT_ENUM.has(impactType)) {
      errors.push(`${claim.id}: impact_type not in schema enum: ${impactType}`);
    }
  }
}

const staleCountPatterns = [
  ['web/index.html', /\b148\b|\b152\b/],
  ['croissant.json', /\b148\b|\b152\b/],
  ['SKILL.md', /All 152 claims/],
  ['README.md', /\b148\b|\b152\b/],
  ['web/llms.txt', /\b148\b|\b152\b/],
];

for (const [relPath, pattern] of staleCountPatterns) {
  if (fs.existsSync(path.join(ROOT, relPath)) && pattern.test(read(relPath))) {
    warnings.push(`${relPath}: stale claim count pattern found`);
  }
}

if (singleSourceClaims.length) {
  warnings.push(`${singleSourceClaims.length} claims have only one source URL; add corroborating_sources for high-impact and URL-audit-failing claims first`);
}

const result = {
  total_claims: index.claims.length,
  categories: categoryCounts(),
  single_source_count: singleSourceClaims.length,
  single_source_sample: singleSourceClaims.slice(0, 25),
  errors,
  warnings,
};

console.log(JSON.stringify(result, null, 2));
process.exit(errors.length ? 1 : 0);
