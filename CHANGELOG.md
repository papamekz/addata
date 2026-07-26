# Changelog

## 1.3.0 - 2026-05-03

- Expanded dataset to 189 claims.
- Added more culture, politics, privacy, health, safety, regulation, equity, and
  urban claims.
- Added public agent package files: `AGENT_GUIDE.md`, `agent-manifest.json`,
  `CONTRIBUTING.md`, and `templates/claim.md`.
- Added agent and maintenance scripts:
  - `scripts/export-agent-context.js`
  - `scripts/export-rag-jsonl.js`
  - `scripts/generate-embeddings-openai.js`
  - `scripts/scaffold-claim.js`
  - `scripts/check-public-release.js`
- Added `data/advertising-quotes.json` with 25 cultural, philosophical,
  literary, policy, and public-interest quote contexts linked to empirical
  claims; each quote includes interpretation notes and source-quality guidance.
- Added GitHub issue templates, data-audit workflow, root `robots.txt`,
  `sitemap.xml`, and `.zenodo.json`.
- Added URL audit workflow; current upload audit reports `broken_count: 0`.
- Refreshed `QUICKREF.md` to avoid stale claim mappings.
- Updated public metadata counts across README, AGENTS, SKILL, datapackage,
  Croissant metadata, citation metadata, and agent manifest.

## 1.2.0 - 2026-05-01

- Added structured machine-readable indexes for agent ingestion.
- Added bilingual browser dataset in `web/data.js`.
- Added source policy and schema validation.
