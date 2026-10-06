# Changelog

## 1.3.1 - 2026-10-06

Source-verification and bilingual-completeness pass. No claim was added or removed;
all changes are corrections, source replacements and translation completions.

**Broken or blocked source URLs repaired.** The URL audit had drifted from
`broken_count: 0` (May 2026) to 10 dead or blocked links:

- `health-004`: WHO ELENA tool page (404) -> official WHO guideline
  `who.int/publications/i/item/9789240075412`
- `health-005`: OUCI record (502) -> PubMed Central `PMC11811470`
- `res-005`: EPA dioxin page (404, restructured) -> `epa.gov/trinationalanalysis/dioxins`
- `reg-033`, `pol-017`: Concurrences bulletin (403) -> official CNMC file `C/1426/23`
  and the CNMC second-phase press release
- `econ-003`: VoxEU column (403) -> CAGE/University of Warwick working paper
- `reg-036`: NASA ADS abstract (405) -> DOI landing page
- `env-016`, `res-003`: `bmwk.de` (renamed ministry domain) -> `bundeswirtschaftsministerium.de`

**Generic homepages replaced with specific documents** (`SOURCES_POLICY.md`
forbids bare homepages): `pol-004` -> Bundestag Lobbyregister entry R005503,
`eco-005` -> Badvertising climate-chaos report, `eco-007` -> Corporate Europe
Observatory municipalism investigation, `pol-007` -> Culture Action Europe PDF,
`reg-009` and `alt-002` -> Adfree Cities council briefing PDF.

**Source-independence and source-type corrections:**

- `env-016` listed invidis (digital-signage trade press) as the primary source with
  `independent: true`. The primary source is now the EnSikuMaV energy-saving
  ordinance itself (`type: government`); invidis is kept only as a labelled
  industry response with `independent: false`.
- `econ-003`: NBER is a private research institute, not a public agency;
  `type: government` -> `grey-literature`.
- `health-016`: primary URL moved to the reachable PubMed Central copy, with the
  Crossref DOI record kept as corroboration.
- `urban-010`: the Semantic Scholar link returned an empty body and its paper ID
  does not correspond to the cited paper; replaced with the matching Crossref DOI
  record (`10.3390/ijgi10100656`).

**Bilingual completeness.** The dataset advertised "bilingual (DE/EN)" for all
claims, but 26 claims (added in 1.3.0) had no English title and no English
translation, and 54 claims were missing the `languages` frontmatter field. All 189
claims now carry an English title and an English translation
(`data/translations_en.json`, `data/titles_en.json`; new batch in
`data/translations_batch10.json`), and `languages` is present on every claim.

**Metadata corrections.**

- README high-impact table: `psych-010`, `reg-033`, `pol-016`, `reg-038`, `reg-040`
  showed scores (and for `pol-016` a year) that no longer matched the claim files.
- `psych-010` was advertised as a "95-study meta-analysis" that "causally produces
  body image harm". The claim itself states it is *not* a meta-analysis and proves no
  causality; table wording and the `meta-analysis` tag corrected.
- `pol-016` presented the ~80% German DOOH share as an established market fact; it is
  an invidis trade estimate and is now labelled as such.

**Policy documentation.** `SOURCES_POLICY.md` now documents why the Crossref DOI
metadata record is accepted as the primary URL for peer-reviewed work behind
publisher bot-walls, and when that exception must not be used.

**Known remaining items** (deliberately not papered over):

- `culture-003` cites a publisher domain (`journals.aphriapub.com`) that refuses
  connections from some networks. The article exists and its abstract was verified
  through a separate fetching service; no stable replacement URL was found.
- Two `bundeswirtschaftsministerium.de` links are reported as `fetch failed` by
  `scripts/audit-urls.js` although they return HTTP 200 to `curl`. Cause not yet
  identified; treat those two audit entries as a runner artefact until then.
- 28 claims still rest on a single source URL.
- Six claims cite `semanticscholar.org` paper pages that return an empty 200/202 body
  to non-JS clients. Whether the paper IDs are valid could not be checked because the
  Semantic Scholar API rate-limited the audit; only `urban-010` was resolved (its ID
  demonstrably did not match the cited paper) and converted to a DOI record.

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
