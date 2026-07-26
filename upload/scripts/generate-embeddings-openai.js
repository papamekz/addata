#!/usr/bin/env node
/**
 * Generate real numeric embeddings for data/rag-chunks.jsonl using the OpenAI API.
 *
 * Requirements:
 *   - Node 18+ with global fetch
 *   - OPENAI_API_KEY environment variable
 *
 * Example:
 *   $env:OPENAI_API_KEY="sk-..."
 *   node scripts/generate-embeddings-openai.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INPUT = path.join(ROOT, 'data', 'rag-chunks.jsonl');
const OUTPUT = path.join(ROOT, 'data', 'embeddings.jsonl');
const MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
const API_KEY = process.env.OPENAI_API_KEY;
const BATCH_SIZE = Number(process.env.EMBEDDING_BATCH_SIZE || 64);

function readJsonl(file) {
  return fs.readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

async function embedBatch(batch) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      input: batch.map(row => row.text),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI embeddings request failed: ${response.status} ${text}`);
  }

  return response.json();
}

async function main() {
  if (!API_KEY) {
    console.error('OPENAI_API_KEY is missing. Refusing to create fake embeddings.');
    process.exit(1);
  }
  if (!fs.existsSync(INPUT)) {
    console.error('Missing data/rag-chunks.jsonl. Run node scripts/export-rag-jsonl.js first.');
    process.exit(1);
  }

  const rows = readJsonl(INPUT);
  const out = fs.createWriteStream(OUTPUT, { encoding: 'utf8' });

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const result = await embedBatch(batch);
    for (let j = 0; j < batch.length; j++) {
      out.write(JSON.stringify({
        id: batch[j].id,
        model: MODEL,
        embedding: result.data[j].embedding,
        metadata: batch[j].metadata,
      }) + '\n');
    }
    console.log(`Embedded ${Math.min(i + batch.length, rows.length)}/${rows.length}`);
  }

  out.end();
  console.log(`Wrote ${rows.length} embeddings to ${path.relative(ROOT, OUTPUT)}`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
