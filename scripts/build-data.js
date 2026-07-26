// Reads all .md claim files, extracts full content + source URL + EN translations, embeds into web/data.js
const fs   = require('fs');
const path = require('path');

const indexPath        = path.join(__dirname, '../data/index.json');
const outPath          = path.join(__dirname, '../web/data.js');
const translationsPath = path.join(__dirname, '../data/translations_en.json');
const titlesPath       = path.join(__dirname, '../data/titles_en.json');
const verificationPath = path.join(__dirname, '../data/verification.json');
const quotesPath       = path.join(__dirname, '../data/advertising-quotes.json');

const index        = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const translations = fs.existsSync(translationsPath)
  ? JSON.parse(fs.readFileSync(translationsPath, 'utf8'))
  : {};
const titlesEn = fs.existsSync(titlesPath)
  ? JSON.parse(fs.readFileSync(titlesPath, 'utf8'))
  : {};
const verification = fs.existsSync(verificationPath)
  ? JSON.parse(fs.readFileSync(verificationPath, 'utf8')).claims || {}
  : {};
const advertisingQuotes = fs.existsSync(quotesPath)
  ? JSON.parse(fs.readFileSync(quotesPath, 'utf8')).quotes || []
  : [];

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

function extractSourceUrls(raw) {
  return Array.from(raw.matchAll(/^\s*url:\s*"([^"]+)"/gm)).map(m => m[1]);
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
const empiricalClaims = index.claims.map(claim => {
  const filePath = path.join(__dirname, '..', claim.file);
  if (!fs.existsSync(filePath)) return claim;

  const raw = fs.readFileSync(filePath, 'utf8');
  const sections = parseMarkdown(raw);
  const sourceUrls = extractSourceUrls(raw);
  const institution = extractInstitution(raw);
  const tags = extractTags(raw);

  const en = translations[claim.id] || {};
  const audit = verification[claim.id] || null;

  enriched++;
  return {
    ...claim,
    institution,
    source_url: sourceUrls[0] || null,
    source_urls: sourceUrls,
    source_count: sourceUrls.length,
    tags,
    zusammenfassung:    sections['Zusammenfassung'] || null,
    kernbefund:         sections['Kernbefund'] || null,
    relevanz:           sections['Relevanz für Außenwerbung'] || null,
    title_en:           titlesEn[claim.id] || null,
    verification_status: audit?.status || null,
    verification_note:   audit?.note || null,
    zusammenfassung_en: en.zusammenfassung || null,
    kernbefund_en:      en.kernbefund || null,
    relevanz_en:        en.relevanz || null,
  };
});

const quoteRecords = advertisingQuotes.map(q => {
  const quoteSourceUrls = q.source_urls || (q.source_url ? [q.source_url] : []);
  const quoteTextDe = q.context_note_de
    ? [
        `Zitat: ${q.quote}`,
        `Deutung: ${q.context_note_de}`,
        q.completeness_note_de && `Hinweis: ${q.completeness_note_de}`,
      ].filter(Boolean).join('\n\n')
    : q.quote;
  const quoteTextEn = q.context_note
    ? [
        `Quote: ${q.quote}`,
        `Interpretation: ${q.context_note}`,
        q.completeness_note && `Note: ${q.completeness_note}`,
      ].filter(Boolean).join('\n\n')
    : q.quote;

  return ({
  id: q.id,
  record_type: 'quote',
  title: `"${q.quote}"`,
  title_en: `"${q.quote}"`,
  category: 'quotes',
  impact_score: 4,
  year: q.year,
  source_type: 'quote_context',
  institution: q.author,
  source_url: quoteSourceUrls[0] || null,
  source_urls: quoteSourceUrls,
  source_count: quoteSourceUrls.length,
  tags: ['quote', 'advertising', q.theme].filter(Boolean),
  author: q.author,
  work: q.work,
  theme: q.theme,
  source_quality: q.source_quality,
  context_note: q.context_note || null,
  context_note_de: q.context_note_de || null,
  completeness_note: q.completeness_note || null,
  completeness_note_de: q.completeness_note_de || null,
  attribution_note: q.attribution_note || null,
  related_claims: q.related_claims || [],
  zusammenfassung: `Zitat-Kontext von ${q.author}${q.work ? ` aus ${q.work}` : ''}. Dieses Zitat ist als kulturelle oder philosophische Perspektive mit empirischen Claims verknüpft und ersetzt keinen Beleg.`,
  kernbefund: quoteTextDe,
  relevanz: `Thematischer Kontext: ${q.theme}. Verknüpfte Claims: ${(q.related_claims || []).join(', ') || '—'}.`,
  zusammenfassung_en: `Quote context by ${q.author}${q.work ? ` from ${q.work}` : ''}. This quote is linked as a cultural or philosophical perspective and does not replace empirical evidence.`,
  kernbefund_en: quoteTextEn,
  relevanz_en: `Thematic context: ${q.theme}. Related claims: ${(q.related_claims || []).join(', ') || '—'}.`,
  });
});

const displayClaims = [...empiricalClaims, ...quoteRecords];
const displayCategories = {
  ...index.categories,
  ...(quoteRecords.length ? { quotes: quoteRecords.length } : {}),
};

const enrichedIndex = {
  ...index,
  total_claims: empiricalClaims.length,
  total_records: displayClaims.length,
  quote_count: quoteRecords.length,
  categories: displayCategories,
  claims: displayClaims,
};

fs.writeFileSync(outPath, 'const URBAN_DATA = ' + JSON.stringify(enrichedIndex) + ';');

console.log(`Done. ${enriched}/${empiricalClaims.length} claims enriched with full content.`);
if (quoteRecords.length) console.log(`Quote records: ${quoteRecords.length} visible in web/data.js.`);
console.log(`Output: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);

// Also output data/digest.json — compact EN-only index for AI agent ingestion
const digestClaims = empiricalClaims.map(c => ({
  id:           c.id,
  title:        c.title_en || c.title,
  category:     c.category,
  impact_score: c.impact_score,
  year:         c.year,
  source_type:  c.source_type,
  institution:  c.institution,
  source_url:   c.source_url || null,
  source_urls:  c.source_urls || [],
  source_count: c.source_count || 0,
  verification_status: c.verification_status || null,
  verification_note:   c.verification_note || null,
  tags:         c.tags || [],
  summary:      c.zusammenfassung_en || null,
  finding:      c.kernbefund_en || null,
  file:         c.file,
}));

const digest = {
  version:   '1.0',
  generated: new Date().toISOString().slice(0, 10),
  total:     empiricalClaims.length,
  note:      'Compact EN index for AI agent ingestion. Full claim text: read data/{file}. Search: node scripts/query.js --help',
  categories: index.categories,
  claims:    digestClaims,
};

const digestPath = path.join(__dirname, '../data/digest.json');
fs.writeFileSync(digestPath, JSON.stringify(digest, null, 2));
console.log(`Digest: ${digestPath} (${(fs.statSync(digestPath).size / 1024).toFixed(1)} KB)`);

// Auto-sync all hardcoded counts across project files
require('./sync-counts');
