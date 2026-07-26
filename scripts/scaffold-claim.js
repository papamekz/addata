#!/usr/bin/env node
/**
 * Create a new claim stub and append a minimal index entry.
 *
 * Example:
 *   node scripts/scaffold-claim.js --category culture --title "Claim title" --source-url "https://example.org" --impact-type cultural --tags "ooh,culture"
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX = path.join(ROOT, 'data', 'index.json');
const SCHEMA = path.join(ROOT, 'schema', 'claim.schema.json');

const PREFIX = {
  alternatives: 'alt',
  culture: 'culture',
  economy: 'eco',
  environment: 'env',
  equity: 'equity',
  health: 'health',
  politics: 'pol',
  privacy: 'priv',
  psychology: 'psych',
  regulation: 'reg',
  resources: 'res',
  safety: 'safety',
  urban: 'urban',
};

function parseArgs(argv) {
  const args = { impactTypes: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--category') { args.category = next; i++; }
    else if (a === '--title') { args.title = next; i++; }
    else if (a === '--impact') { args.impact = Number(next); i++; }
    else if (a === '--impact-type') { args.impactTypes.push(next); i++; }
    else if (a === '--impact-types') { args.impactTypes.push(...String(next || '').split(',')); i++; }
    else if (a === '--tags') { args.tags = String(next || '').split(','); i++; }
    else if (a === '--subcategory') { args.subcategory = next; i++; }
    else if (a === '--source-url') { args.sourceUrl = next; i++; }
    else if (a === '--source-title') { args.sourceTitle = next; i++; }
    else if (a === '--source-year') { args.sourceYear = Number(next); i++; }
    else if (a === '--source-type') { args.sourceType = next; i++; }
    else if (a === '--institution') { args.institution = next; i++; }
    else if (a === '--independent') { args.independent = next !== 'false'; i++; }
    else if (a === '--open-access') { args.openAccess = next !== 'false'; i++; }
  }
  return args;
}

function help() {
  console.log(`Usage: node scripts/scaffold-claim.js --category <category> --title <title> [options]

Options:
  --impact <1-10>           Initial impact score (default: 6)
  --impact-type <type>      Add one schema impact type; may be repeated
  --impact-types <a,b,c>    Comma-separated impact types
  --tags <a,b,c>            Comma-separated search tags
  --subcategory <name>      Optional finer-grained subcategory
  --source-url <url>        Primary source URL
  --source-title <title>    Primary source title
  --source-year <year>      Source publication year
  --source-type <type>      peer-reviewed, government, ngo, court_ruling, etc.
  --institution <name>      Publishing institution
  --independent <true|false> Whether source is independent (default: true)
  --open-access <true|false> Whether source is open access (default: true)
`);
}

function nextId(index, category) {
  const prefix = PREFIX[category];
  if (!prefix) throw new Error(`Unknown category: ${category}`);

  const nums = (index.claims || [])
    .filter(c => c.category === category && String(c.id || '').startsWith(prefix + '-'))
    .map(c => Number(String(c.id).slice(prefix.length + 1)))
    .filter(n => Number.isFinite(n));

  const n = nums.length ? Math.max(...nums) + 1 : 1;
  return `${prefix}-${String(n).padStart(3, '0')}`;
}

function yamlString(s) {
  return JSON.stringify(String(s || ''));
}

function cleanList(values) {
  return Array.from(new Set((values || [])
    .map(v => String(v || '').trim())
    .filter(Boolean)));
}

function markdown(args, id, filePath) {
  const title = args.title;
  const year = args.sourceYear || new Date().getFullYear();
  const impact = args.impact || 6;
  const impactTypes = cleanList(args.impactTypes).length ? cleanList(args.impactTypes) : ['social'];
  const tags = cleanList(args.tags).length ? cleanList(args.tags) : ['ooh', 'dooh'];
  const independent = args.independent !== false;
  const openAccess = args.openAccess !== false;
  return `---
id: ${id}
title: ${yamlString(title)}
category: ${args.category}
${args.subcategory ? `subcategory: ${yamlString(args.subcategory)}\n` : ''}impact_score: ${impact}
impact_type:
${impactTypes.map(v => `  - ${yamlString(v)}`).join('\n')}
source:
  title: ${yamlString(args.sourceTitle || title)}
  institution: ${yamlString(args.institution || "TODO")}
  year: ${year}
  url: ${yamlString(args.sourceUrl || "TODO")}
  type: ${yamlString(args.sourceType || "TODO")}
  open_access: ${openAccess}
  independent: ${independent}
tags:
${tags.map(v => `  - ${yamlString(v)}`).join('\n')}
verified: false
languages:
  - de
  - en
---

# ${title}

## Zusammenfassung

TODO: One concise paragraph describing what the source documents.

## Kernbefund

TODO: What exactly is evidenced? Include numbers, jurisdiction, time period, and caveats.

## Relevanz fuer Aussenwerbung

TODO: Explain why this matters for OOH/DOOH infrastructure, regulation, ESG, health,
privacy, safety, governance, culture, or future investment risk.

## English Summary

TODO: Short English summary for agent retrieval.

<!-- Generated by scripts/scaffold-claim.js. Complete this file, then run:
node scripts/build-data.js
node scripts/audit-data.js
node scripts/audit-urls.js
-->
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    help();
    return;
  }
  if (!args.category || !args.title) {
    help();
    process.exit(1);
  }
  if (!PREFIX[args.category]) {
    console.error(`Unknown category "${args.category}". Allowed: ${Object.keys(PREFIX).join(', ')}`);
    process.exit(1);
  }
  if (!fs.existsSync(INDEX)) {
    console.error('Missing data/index.json. Run from the repository root.');
    process.exit(1);
  }
  const impact = args.impact || 6;
  if (!Number.isInteger(impact) || impact < 1 || impact > 10) {
    console.error('--impact must be an integer from 1 to 10.');
    process.exit(1);
  }

  const index = JSON.parse(fs.readFileSync(INDEX, 'utf8'));
  const schema = fs.existsSync(SCHEMA) ? JSON.parse(fs.readFileSync(SCHEMA, 'utf8')) : null;
  if (schema) {
    const sourceTypes = new Set(schema.properties.source.properties.type.enum);
    const impactTypes = new Set(schema.properties.impact_type.items.enum);
    if (args.sourceType && !sourceTypes.has(args.sourceType)) {
      console.error(`Unknown --source-type "${args.sourceType}". Allowed: ${Array.from(sourceTypes).join(', ')}`);
      process.exit(1);
    }
    for (const impactType of cleanList(args.impactTypes)) {
      if (!impactTypes.has(impactType)) {
        console.error(`Unknown impact type "${impactType}". Allowed: ${Array.from(impactTypes).join(', ')}`);
        process.exit(1);
      }
    }
  }
  const id = nextId(index, args.category);
  const relFile = path.join('data', args.category, `${id}.md`).replace(/\\/g, '/');
  const absFile = path.join(ROOT, relFile);

  if (fs.existsSync(absFile)) {
    console.error(`Refusing to overwrite existing file: ${relFile}`);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(absFile), { recursive: true });
  fs.writeFileSync(absFile, markdown(args, id, relFile), 'utf8');

  index.claims.push({
    id,
    title: args.title,
    category: args.category,
    impact_score: args.impact || 6,
    year: args.sourceYear || new Date().getFullYear(),
    source_type: args.sourceType || 'TODO',
    institution: args.institution || 'TODO',
    file: relFile,
  });
  index.total = index.claims.length;
  index.generated = new Date().toISOString();
  fs.writeFileSync(INDEX, JSON.stringify(index, null, 2) + '\n', 'utf8');

  console.log(`Created ${relFile}`);
  console.log(`Added ${id} to data/index.json`);
  console.log('Next: complete the Markdown, run build-data.js, audit-data.js, and audit-urls.js.');
}

main();
