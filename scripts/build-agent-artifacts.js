#!/usr/bin/env node
/**
 * Builds machine/agent discovery artifacts that are easy to forget manually:
 * - llms-full.txt
 * - .well-known/llms.txt
 * - .well-known/llms-full.txt
 * - ro-crate-metadata.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
}

function readText(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8').trim();
}

function writeText(rel, text) {
  const out = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, text.endsWith('\n') ? text : `${text}\n`);
  console.log(`Wrote ${rel}`);
}

function fileEntity(rel, description, encodingFormat) {
  return {
    '@id': rel,
    '@type': 'File',
    name: path.basename(rel),
    description,
    encodingFormat,
  };
}

function buildLlmsFull() {
  const index = readJson('data/index.json');
  const digest = readJson('data/digest.json');
  const manifest = readJson('agent-manifest.json');
  const quotes = readJson('data/advertising-quotes.json');

  const sections = [
    '# DOOH & OOH Advertising Research Dataset - Full Agent Context',
    '',
    'This file is generated for AI tools that prefer a single Markdown context file.',
    'Use empirical claim records as evidence. Use quote/context records only as cultural, ethical, or rhetorical framing.',
    '',
    '## Dataset Snapshot',
    '',
    `- Claims: ${index.total_claims || index.claims.length}`,
    `- Quote/context records: ${quotes.quotes.length}`,
    `- Languages: ${(manifest.languages || []).join(', ')}`,
    `- License: ${manifest.license}`,
    `- Version: ${manifest.version}`,
    '',
    '## Primary Agent Files',
    '',
    readText('llms.txt'),
    '',
    '## Data Quality',
    '',
    readText('DATA_QUALITY.md'),
    '',
    '## Quick Reference',
    '',
    readText('QUICKREF.md'),
    '',
    '## Source Policy',
    '',
    readText('SOURCES_POLICY.md'),
    '',
    '## Compact Claim Digest',
    '',
  ];

  for (const claim of digest.claims || []) {
    sections.push(`### ${claim.id}: ${claim.title}`);
    sections.push('');
    sections.push(`- Category: ${claim.category}`);
    sections.push(`- Impact score: ${claim.impact_score}`);
    sections.push(`- Year: ${claim.year || 'unknown'}`);
    sections.push(`- Source type: ${claim.source_type || 'unknown'}`);
    sections.push(`- File: ${claim.file}`);
    if (claim.source_urls && claim.source_urls.length) {
      sections.push(`- Sources: ${claim.source_urls.join(' ; ')}`);
    }
    if (claim.summary) sections.push(`- Summary: ${String(claim.summary).replace(/\s+/g, ' ')}`);
    if (claim.finding) sections.push(`- Finding: ${String(claim.finding).replace(/\s+/g, ' ')}`);
    sections.push('');
  }

  return sections.join('\n');
}

function buildRoCrate() {
  const index = readJson('data/index.json');
  const manifest = readJson('agent-manifest.json');
  const now = new Date().toISOString().slice(0, 10);

  const graph = [
    {
      '@id': 'ro-crate-metadata.json',
      '@type': 'CreativeWork',
      conformsTo: { '@id': 'https://w3id.org/ro/crate/1.1' },
      about: { '@id': './' },
    },
    {
      '@id': './',
      '@type': 'Dataset',
      name: manifest.title,
      description: 'Machine-readable DOOH/OOH advertising research dataset for AI-agent due diligence, ESG, policy, public-health, privacy, safety, and urban-planning analysis.',
      license: { '@id': 'https://creativecommons.org/licenses/by/4.0/' },
      version: manifest.version,
      dateModified: now,
      inLanguage: manifest.languages || ['en', 'de'],
      keywords: [
        'DOOH',
        'OOH',
        'outdoor advertising',
        'digital billboard',
        'advertising risk',
        'ESG',
        'RAG',
        'dataset',
      ],
      hasPart: [
        { '@id': 'README.md' },
        { '@id': 'AGENTS.md' },
        { '@id': 'SKILL.md' },
        { '@id': 'DATA_QUALITY.md' },
        { '@id': 'data/index.json' },
        { '@id': 'data/digest.json' },
        { '@id': 'data/rag-chunks.jsonl' },
        { '@id': 'data/advertising-quotes.json' },
        { '@id': 'schema/claim.schema.json' },
        { '@id': 'croissant.json' },
        { '@id': 'datapackage.json' },
      ],
      variableMeasured: [
        'claim id',
        'category',
        'impact_score',
        'source_type',
        'publication year',
        'source URLs',
      ],
      size: `${index.total_claims || index.claims.length} empirical claims`,
    },
    fileEntity('README.md', 'Human-readable dataset card and quick start.', 'text/markdown'),
    fileEntity('AGENTS.md', 'General instructions for AI agents.', 'text/markdown'),
    fileEntity('SKILL.md', 'Structured OOH/DOOH assessment protocol.', 'text/markdown'),
    fileEntity('DATA_QUALITY.md', 'Limitations, evidence handling, and quality assessment.', 'text/markdown'),
    fileEntity('data/index.json', 'Full machine-readable claim index.', 'application/json'),
    fileEntity('data/digest.json', 'Compact English digest for agent retrieval.', 'application/json'),
    fileEntity('data/rag-chunks.jsonl', 'Retrieval-ready JSONL chunks.', 'application/x-ndjson'),
    fileEntity('data/advertising-quotes.json', 'Advertising criticism quote/context records.', 'application/json'),
    fileEntity('schema/claim.schema.json', 'JSON Schema for claim records.', 'application/schema+json'),
    fileEntity('croissant.json', 'MLCommons Croissant metadata.', 'application/ld+json'),
    fileEntity('datapackage.json', 'Frictionless Data Package descriptor.', 'application/json'),
  ];

  return JSON.stringify({
    '@context': 'https://w3id.org/ro/crate/1.1/context',
    '@graph': graph,
  }, null, 2);
}

function main() {
  const full = buildLlmsFull();
  writeText('llms-full.txt', full);
  writeText('.well-known/llms.txt', readText('llms.txt'));
  writeText('.well-known/llms-full.txt', full);
  writeText('ro-crate-metadata.json', buildRoCrate());
}

main();
