// Reads all .md claim files, extracts full content + source URL + EN translations, embeds into web/data.js
const fs   = require('fs');
const path = require('path');

const indexPath        = path.join(__dirname, '../data/index.json');
const outPath          = path.join(__dirname, '../web/data.js');
const translationsPath = path.join(__dirname, '../data/translations_en.json');
const titlesPath       = path.join(__dirname, '../data/titles_en.json');

const index        = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const translations = fs.existsSync(translationsPath)
  ? JSON.parse(fs.readFileSync(translationsPath, 'utf8'))
  : {};
const titlesEn = fs.existsSync(titlesPath)
  ? JSON.parse(fs.readFileSync(titlesPath, 'utf8'))
  : {};

function parseMarkdown(raw) {
  // strip YAML frontmatter
  const body = raw.replace(/^---[\s\S]*?---\s*/m, '').trim();

  const sections = {};
  const parts = body.split(/^## /m).filter(Boolean);
  for (const part of parts) {
    const nl = part.indexOf('\n');
    const heading = part.slice(0, nl).trim();
    const text = part.slice(nl + 1).trim();
    sections[heading] = text;
  }
  return sections;
}

function extractSourceUrl(raw) {
  const m = raw.match(/url:\s*"([^"]+)"/);
  return m ? m[1] : null;
}

function extractInstitution(raw) {
  const m = raw.match(/institution:\s*"([^"]+)"/);
  return m ? m[1] : null;
}

function extractTags(raw) {
  const block = raw.match(/^tags:\n([\s\S]*?)(?=\n\w|\n---)/m);
  if (!block) return [];
  return block[1].match(/- (.+)/g)?.map(t => t.replace('- ', '').trim()) || [];
}

let enriched = 0;
const claims = index.claims.map(claim => {
  const filePath = path.join(__dirname, '..', claim.file);
  if (!fs.existsSync(filePath)) return claim;

  const raw = fs.readFileSync(filePath, 'utf8');
  const sections = parseMarkdown(raw);
  const sourceUrl = extractSourceUrl(raw);
  const institution = extractInstitution(raw);
  const tags = extractTags(raw);

  const en = translations[claim.id] || {};

  enriched++;
  return {
    ...claim,
    institution,
    source_url: sourceUrl,
    tags,
    zusammenfassung:    sections['Zusammenfassung'] || null,
    kernbefund:         sections['Kernbefund'] || null,
    relevanz:           sections['Relevanz für Außenwerbung'] || null,
    title_en:           titlesEn[claim.id] || null,
    zusammenfassung_en: en.zusammenfassung || null,
    kernbefund_en:      en.kernbefund || null,
    relevanz_en:        en.relevanz || null,
  };
});

const enrichedIndex = { ...index, claims };

fs.writeFileSync(outPath, 'const URBAN_DATA = ' + JSON.stringify(enrichedIndex) + ';');

console.log(`Done. ${enriched}/${claims.length} claims enriched with full content.`);
console.log(`Output: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);

// Also output data/digest.json — compact EN-only index for AI agent ingestion
const digestClaims = claims.map(c => ({
  id:           c.id,
  title:        c.title_en || c.title,
  category:     c.category,
  impact_score: c.impact_score,
  year:         c.year,
  source_type:  c.source_type,
  institution:  c.institution,
  tags:         c.tags || [],
  summary:      c.zusammenfassung_en || null,
  finding:      c.kernbefund_en || null,
  file:         c.file,
}));

const digest = {
  version:   '1.0',
  generated: new Date().toISOString().slice(0, 10),
  total:     claims.length,
  note:      'Compact EN index for AI agent ingestion. Full claim text: read data/{file}. Search: node scripts/query.js --help',
  categories: index.categories,
  claims:    digestClaims,
};

const digestPath = path.join(__dirname, '../data/digest.json');
fs.writeFileSync(digestPath, JSON.stringify(digest, null, 2));
console.log(`Digest: ${digestPath} (${(fs.statSync(digestPath).size / 1024).toFixed(1)} KB)`);

// Auto-sync all hardcoded counts across project files
require('./sync-counts');
