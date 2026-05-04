#!/usr/bin/env node
/**
 * query.js — AI-agent search tool for the DOOH/OOH Research Dataset
 *
 * Usage:
 *   node scripts/query.js                          # list all claims by impact score
 *   node scripts/query.js --category regulation    # filter by category
 *   node scripts/query.js --tags greenwashing       # filter by tag (comma-separated)
 *   node scripts/query.js --min-impact 8           # minimum impact score
 *   node scripts/query.js --keyword carbon         # keyword search in title + summary
 *   node scripts/query.js --id reg-037             # get single claim (full detail)
 *   node scripts/query.js --top 10                 # top N claims by impact score
 *   node scripts/query.js --category health --min-impact 8 --format text
 *
 * Options:
 *   --category   <string>   Filter by category name
 *   --tags       <a,b,c>    Filter by tags (ANY match, comma-separated)
 *   --min-impact <number>   Minimum impact_score (1–10)
 *   --keyword    <string>   Search in title + summary (case-insensitive)
 *   --id         <string>   Return single claim by ID
 *   --top        <number>   Return top N results (default: all)
 *   --format     json|text  Output format (default: json)
 *   --help                  Show this help
 *
 * Returns JSON array of matching claims (compact digest format), or full detail for --id.
 * Loads from data/digest.json — run scripts/build-data.js first if missing.
 * Claims may include verification_status/verification_note for corrected or source-sensitive records.
 */

const fs   = require('fs');
const path = require('path');

// ── Argument parsing ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(fs.readFileSync(__filename, 'utf8').match(/\/\*\*([\s\S]*?)\*\//)[0]);
  process.exit(0);
}

function getArg(name) {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}

const filterCategory   = getArg('--category');
const filterTags       = getArg('--tags')?.split(',').map(t => t.trim().toLowerCase());
const filterMinImpact  = getArg('--min-impact') ? parseInt(getArg('--min-impact')) : null;
const filterKeyword    = getArg('--keyword')?.toLowerCase();
const filterId         = getArg('--id');
const topN             = getArg('--top') ? parseInt(getArg('--top')) : null;
const format           = getArg('--format') || 'json';

// ── Load digest ───────────────────────────────────────────────────────────────
const digestPath = path.join(__dirname, '../data/digest.json');

if (!fs.existsSync(digestPath)) {
  console.error('Error: data/digest.json not found. Run: node scripts/build-data.js');
  process.exit(1);
}

const digest = JSON.parse(fs.readFileSync(digestPath, 'utf8'));
let claims = digest.claims;

// ── Single claim lookup ───────────────────────────────────────────────────────
if (filterId) {
  const claim = claims.find(c => c.id === filterId);
  if (!claim) {
    console.error(`Claim not found: ${filterId}`);
    process.exit(1);
  }
  // For single claim, also load full markdown if available
  const mdPath = path.join(__dirname, '..', claim.file);
  const fullText = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf8') : null;
  const result = fullText ? { ...claim, full_text: fullText } : claim;
  console.log(format === 'text' ? formatText([result]) : JSON.stringify(result, null, 2));
  process.exit(0);
}

// ── Filters ───────────────────────────────────────────────────────────────────
if (filterCategory) {
  claims = claims.filter(c => c.category === filterCategory);
}

if (filterTags) {
  claims = claims.filter(c =>
    c.tags && filterTags.some(t => c.tags.includes(t))
  );
}

if (filterMinImpact !== null) {
  claims = claims.filter(c => c.impact_score >= filterMinImpact);
}

if (filterKeyword) {
  claims = claims.filter(c => {
    const searchText = [c.title, c.summary, c.finding].filter(Boolean).join(' ').toLowerCase();
    return searchText.includes(filterKeyword);
  });
}

// ── Sort by impact score descending ──────────────────────────────────────────
claims.sort((a, b) => b.impact_score - a.impact_score);

// ── Top N ─────────────────────────────────────────────────────────────────────
if (topN) {
  claims = claims.slice(0, topN);
}

// ── Output ────────────────────────────────────────────────────────────────────
function formatText(list) {
  return list.map(c => [
    `[${c.id}] ${c.title}`,
    `  Category: ${c.category} | Impact: ${c.impact_score}/10 | Year: ${c.year} | Source: ${c.source_type}`,
    c.source_urls?.length ? `  Sources: ${c.source_urls.join(' | ')}` : '',
    c.tags?.length ? `  Tags: ${c.tags.join(', ')}` : '',
    c.summary ? `  Summary: ${c.summary.slice(0, 200)}${c.summary.length > 200 ? '...' : ''}` : '',
    '',
  ].filter(l => l !== '').join('\n')).join('\n');
}

if (format === 'text') {
  console.log(`Found ${claims.length} claims:\n`);
  console.log(formatText(claims));
} else {
  // JSON output — include meta
  console.log(JSON.stringify({
    query: {
      category:   filterCategory || null,
      tags:       filterTags || null,
      min_impact: filterMinImpact || null,
      keyword:    filterKeyword || null,
      top:        topN || null,
    },
    total_matched: claims.length,
    claims: claims.map(c => ({
      id:           c.id,
      title:        c.title,
      category:     c.category,
      impact_score: c.impact_score,
      year:         c.year,
      source_type:  c.source_type,
      source_url:   c.source_url || null,
      source_urls:  c.source_urls || [],
      source_count: c.source_count || 0,
      verification_status: c.verification_status || null,
      verification_note:   c.verification_note || null,
      tags:         c.tags,
      summary:      c.summary,
      file:         c.file,
    })),
  }, null, 2));
}
