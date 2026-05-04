#!/usr/bin/env node
/**
 * Export retrieval-ready JSONL chunks for embedding pipelines.
 *
 * This does not create numeric embeddings. It creates stable text chunks with
 * metadata so any embedding model can index the dataset without reparsing the
 * Markdown files.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIGEST = path.join(ROOT, 'data', 'digest.json');
const QUOTES = path.join(ROOT, 'data', 'advertising-quotes.json');
const OUT = path.join(ROOT, 'data', 'rag-chunks.jsonl');

function textOf(claim) {
  return [
    `Claim ID: ${claim.id}`,
    `Title: ${claim.title}`,
    `Category: ${claim.category}`,
    `Impact score: ${claim.impact_score}/10`,
    `Year: ${claim.year || 'unknown'}`,
    claim.summary && `Summary: ${claim.summary}`,
    claim.finding && `Finding: ${claim.finding}`,
    claim.tags && claim.tags.length && `Tags: ${claim.tags.join(', ')}`,
    claim.source_urls && claim.source_urls.length && `Sources: ${claim.source_urls.join(' ; ')}`,
  ].filter(Boolean).join('\n');
}

function main() {
  if (!fs.existsSync(DIGEST)) {
    console.error('Missing data/digest.json. Run node scripts/build-data.js first.');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(DIGEST, 'utf8'));
  const lines = (data.claims || []).map(claim => JSON.stringify({
    id: claim.id,
    text: textOf(claim),
    metadata: {
      id: claim.id,
      title: claim.title,
      category: claim.category,
      impact_score: claim.impact_score,
      year: claim.year,
      source_type: claim.source_type,
      institution: claim.institution,
      file: claim.file,
      source_urls: claim.source_urls || (claim.source_url ? [claim.source_url] : []),
      source_count: claim.source_count || 0,
      tags: claim.tags || [],
      verification_status: claim.verification_status || null,
    },
  }));

  if (fs.existsSync(QUOTES)) {
    const quoteData = JSON.parse(fs.readFileSync(QUOTES, 'utf8'));
    for (const quote of quoteData.quotes || []) {
      lines.push(JSON.stringify({
        id: quote.id,
        text: [
          `Quote ID: ${quote.id}`,
          `Author: ${quote.author}`,
          `Work: ${quote.work}`,
          `Theme: ${quote.theme}`,
          `Quote: ${quote.quote}`,
          quote.context_note && `Context: ${quote.context_note}`,
          quote.completeness_note && `Completeness note: ${quote.completeness_note}`,
          `Related claims: ${(quote.related_claims || []).join(', ')}`,
          `Sources: ${(quote.source_urls || (quote.source_url ? [quote.source_url] : [])).join(' ; ')}`,
          quote.attribution_note && `Attribution note: ${quote.attribution_note}`,
        ].filter(Boolean).join('\n'),
        metadata: {
          id: quote.id,
          record_type: 'quote',
          author: quote.author,
          work: quote.work,
          year: quote.year,
          theme: quote.theme,
          source_url: (quote.source_urls || [quote.source_url]).filter(Boolean)[0] || null,
          source_urls: quote.source_urls || (quote.source_url ? [quote.source_url] : []),
          source_quality: quote.source_quality,
          context_note: quote.context_note || null,
          context_note_de: quote.context_note_de || null,
          completeness_note: quote.completeness_note || null,
          completeness_note_de: quote.completeness_note_de || null,
          related_claims: quote.related_claims || [],
          attribution_note: quote.attribution_note || null,
        },
      }));
    }
  }

  fs.writeFileSync(OUT, lines.join('\n') + '\n', 'utf8');
  console.log(`Wrote ${lines.length} RAG chunks to ${path.relative(ROOT, OUT)}`);
}

main();
