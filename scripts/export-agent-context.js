#!/usr/bin/env node
/**
 * Export a compact task-specific evidence pack for AI agents.
 *
 * Examples:
 *   node scripts/export-agent-context.js --category regulation --min-impact 9 --top 8
 *   node scripts/export-agent-context.js --keyword greenwashing --format json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIGEST = path.join(ROOT, 'data', 'digest.json');

function parseArgs(argv) {
  const args = {
    format: 'md',
    top: 10,
    minImpact: 0,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === '--help' || a === '-h') {
      args.help = true;
    } else if (a === '--category') {
      args.category = next; i++;
    } else if (a === '--keyword') {
      args.keyword = next; i++;
    } else if (a === '--tags' || a === '--tag') {
      args.tags = next.split(',').map(s => s.trim()).filter(Boolean); i++;
    } else if (a === '--min-impact') {
      args.minImpact = Number(next); i++;
    } else if (a === '--top') {
      args.top = Number(next); i++;
    } else if (a === '--format') {
      args.format = next; i++;
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage: node scripts/export-agent-context.js [options]

Options:
  --category <name>       Filter by category, e.g. regulation, culture, health
  --keyword <text>        Search title, summary, finding, institution, tags
  --tags <a,b>            Match any comma-separated tag
  --min-impact <1-10>     Minimum impact_score
  --top <n>               Maximum claims to export (default: 10)
  --format <md|json>      Output format (default: md)
`);
}

function haystack(claim) {
  return [
    claim.id,
    claim.title,
    claim.category,
    claim.institution,
    claim.summary,
    claim.finding,
    ...(claim.tags || []),
  ].filter(Boolean).join(' ').toLowerCase();
}

function filterClaims(claims, args) {
  let out = claims.slice();

  if (args.category) {
    out = out.filter(c => c.category === args.category);
  }
  if (args.minImpact) {
    out = out.filter(c => Number(c.impact_score || 0) >= args.minImpact);
  }
  if (args.keyword) {
    const q = args.keyword.toLowerCase();
    out = out.filter(c => haystack(c).includes(q));
  }
  if (args.tags && args.tags.length) {
    const wanted = new Set(args.tags.map(t => t.toLowerCase()));
    out = out.filter(c => (c.tags || []).some(t => wanted.has(String(t).toLowerCase())));
  }

  out.sort((a, b) => {
    const score = Number(b.impact_score || 0) - Number(a.impact_score || 0);
    if (score) return score;
    return Number(b.year || 0) - Number(a.year || 0);
  });

  return out.slice(0, args.top);
}

function mdEscape(text) {
  return String(text || '').replace(/\r?\n/g, ' ').trim();
}

function renderMarkdown(data, claims, args) {
  const filters = [
    args.category && `category=${args.category}`,
    args.keyword && `keyword=${args.keyword}`,
    args.tags && `tags=${args.tags.join(',')}`,
    args.minImpact && `min-impact=${args.minImpact}`,
    `top=${args.top}`,
  ].filter(Boolean).join(', ');

  const lines = [
    '# OOH/DOOH Evidence Pack',
    '',
    `Dataset claims: ${data.total}`,
    `Filters: ${filters || 'none'}`,
    '',
    'Use this as retrieval context only. Retrieve the full claim Markdown and cite original source URLs before final publication.',
    '',
  ];

  for (const c of claims) {
    lines.push(`## ${c.id}: ${mdEscape(c.title)}`);
    lines.push('');
    lines.push(`- Category: ${c.category}`);
    lines.push(`- Impact: ${c.impact_score}/10`);
    lines.push(`- Year: ${c.year || 'unknown'}`);
    lines.push(`- Source type: ${c.source_type || 'unknown'}`);
    lines.push(`- Institution: ${mdEscape(c.institution || 'unknown')}`);
    lines.push(`- Claim file: ${c.file}`);
    if (c.verification_status) lines.push(`- Verification: ${c.verification_status}`);
    if (c.source_urls && c.source_urls.length) {
      lines.push(`- Sources: ${c.source_urls.join(' ; ')}`);
    } else if (c.source_url) {
      lines.push(`- Source: ${c.source_url}`);
    }
    if (c.tags && c.tags.length) lines.push(`- Tags: ${c.tags.join(', ')}`);
    lines.push('');
    if (c.summary) lines.push(`Summary: ${mdEscape(c.summary)}`);
    if (c.finding) lines.push(`Finding: ${mdEscape(c.finding)}`);
    lines.push('');
  }

  return lines.join('\n');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  if (!fs.existsSync(DIGEST)) {
    console.error(`Missing ${path.relative(ROOT, DIGEST)}. Run node scripts/build-data.js first.`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(DIGEST, 'utf8'));
  const claims = filterClaims(data.claims || [], args);

  if (args.format === 'json') {
    console.log(JSON.stringify({
      total_dataset_claims: data.total,
      exported_claims: claims.length,
      filters: args,
      claims,
    }, null, 2));
    return;
  }

  if (args.format !== 'md') {
    console.error('Unsupported --format. Use md or json.');
    process.exit(1);
  }

  console.log(renderMarkdown(data, claims, args));
}

main();
