// Reads all .md claim files, extracts full content + source URL, embeds into web/data.js
const fs   = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../data/index.json');
const outPath   = path.join(__dirname, '../web/data.js');

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

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

  enriched++;
  return {
    ...claim,
    institution,
    source_url: sourceUrl,
    tags,
    zusammenfassung: sections['Zusammenfassung'] || null,
    kernbefund:      sections['Kernbefund'] || null,
    relevanz:        sections['Relevanz für Außenwerbung'] || null,
  };
});

const enrichedIndex = { ...index, claims };

fs.writeFileSync(outPath, 'const URBAN_DATA = ' + JSON.stringify(enrichedIndex) + ';');

console.log(`Done. ${enriched}/${claims.length} claims enriched with full content.`);
console.log(`Output: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
