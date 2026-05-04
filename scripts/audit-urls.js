#!/usr/bin/env node
/**
 * audit-urls.js — network URL checker for claim frontmatter sources.
 *
 * This complements audit-data.js. It performs HTTP HEAD/GET checks, follows
 * redirects, and reports broken or weak source coverage. Run before publishing
 * when network access is available.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'data/index.json');
const TIMEOUT_MS = Number(process.env.URL_AUDIT_TIMEOUT_MS || 12000);
const CONCURRENCY = Number(process.env.URL_AUDIT_CONCURRENCY || 8);

const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));

function frontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : '';
}

function sourceUrls(fm) {
  return Array.from(fm.matchAll(/^\s*url:\s*"([^"]+)"/gm)).map(m => m[1]);
}

function readClaim(claim) {
  const raw = fs.readFileSync(path.join(ROOT, claim.file), 'utf8');
  return sourceUrls(frontmatter(raw));
}

async function fetchWithTimeout(url, method) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method,
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'addata-url-audit/1.0 (+https://github.com/papamekz/addata)',
        'accept': 'text/html,application/pdf,application/json,*/*',
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function checkUrl(url) {
  const started = Date.now();
  try {
    let response = await fetchWithTimeout(url, 'HEAD');
    if ([405, 403, 501].includes(response.status)) {
      response = await fetchWithTimeout(url, 'GET');
    }
    return {
      url,
      ok: response.status >= 200 && response.status < 400,
      status: response.status,
      final_url: response.url,
      ms: Date.now() - started,
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: null,
      error: error.name === 'AbortError' ? 'timeout' : error.message,
      ms: Date.now() - started,
    };
  }
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function main() {
  const claims = index.claims.map(claim => ({
    id: claim.id,
    file: claim.file,
    urls: readClaim(claim),
  }));

  const uniqueUrls = Array.from(new Set(claims.flatMap(c => c.urls)));
  const checked = await mapLimit(uniqueUrls, CONCURRENCY, checkUrl);
  const byUrl = Object.fromEntries(checked.map(result => [result.url, result]));

  const claimResults = claims.map(claim => ({
    ...claim,
    source_count: claim.urls.length,
    url_results: claim.urls.map(url => byUrl[url]),
  }));

  const broken = claimResults
    .map(claim => ({
      id: claim.id,
      file: claim.file,
      broken: claim.url_results.filter(result => !result.ok),
    }))
    .filter(claim => claim.broken.length);

  const single_source = claimResults
    .filter(claim => claim.source_count < 2)
    .map(claim => ({ id: claim.id, file: claim.file, urls: claim.urls }));

  const result = {
    checked_at: new Date().toISOString(),
    total_claims: claims.length,
    unique_urls: uniqueUrls.length,
    broken_count: broken.reduce((sum, claim) => sum + claim.broken.length, 0),
    single_source_count: single_source.length,
    broken,
    single_source,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(broken.length ? 1 : 0);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
