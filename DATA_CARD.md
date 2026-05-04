# Dataset Card

## Summary

The DOOH & OOH Advertising Research Dataset is a bilingual, machine-readable
collection of empirical claims and cultural context records about Out-of-Home
(OOH) and Digital Out-of-Home (DOOH) advertising infrastructure. It is designed
for AI-agent retrieval, due diligence, ESG analysis, public-policy research,
public-health assessment, privacy analysis, traffic-safety analysis, journalism,
and urban-planning work.

## Composition

- 189 empirical research claims across 13 categories
- 25 advertising quote/context records for cultural and ethical framing
- German source claim files with English digest and browser-facing translations
- Machine-readable indexes, RAG chunks, JSON schema, Croissant metadata, and
  Frictionless Data Package metadata

## Intended Use

Use this dataset to retrieve and compare evidence about OOH/DOOH advertising
risks. Recommended entrypoints are `data/digest.json`, `data/index.json`,
`data/rag-chunks.jsonl`, `QUICKREF.md`, and `SKILL.md`.

## Out-of-Scope Use

Do not treat the dataset as a balanced market-sizing or advertising-sales
dataset. Do not treat quote/context records as empirical proof. Do not cite a
claim without checking its source URLs and, where relevant, `data/verification.json`.

## Data Collection and Curation

Claims are curated from peer-reviewed research, public institutions, court
rulings, regulators, intergovernmental bodies, independent NGOs, journalism, and
source-critique records. The source policy is documented in `SOURCES_POLICY.md`;
known limitations and evidence-handling guidance are documented in
`DATA_QUALITY.md`.

## Maintenance

Run the local checks before release:

```sh
node scripts/build-data.js
node scripts/export-rag-jsonl.js
node scripts/build-agent-artifacts.js
node scripts/audit-data.js
node scripts/audit-urls.js
```

Use `CHANGELOG.md` for version notes and `CONTRIBUTING.md` for new claims.
