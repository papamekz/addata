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

## Selection Criteria and Known Bias

This dataset is an **adverse-evidence corpus**, not a representative sample of the
research literature on OOH/DOOH advertising. Two independent selection rules shape
its contents, and both must be understood before the data is used:

In practice, the corpus was built by deliberately searching for adverse findings,
documented harms, regulatory actions, and other risk-relevant evidence rather than
for a balanced cross-section of the literature. Industry, operator, and commercial
marketing-research sources are excluded as evidence under `SOURCES_POLICY.md`.
That means the collection is intentionally skewed toward negative or cautionary
findings and is therefore not a representative sample of the full OOH/DOOH
research literature.

1. **Directional claim selection.** Records were collected by searching for
   documented harms, risks, regulatory actions, and adverse findings. Studies
   reporting null or beneficial effects of OOH/DOOH advertising were not sought
   and are therefore largely absent. Their absence here is a property of the
   collection strategy — it is not evidence that such research does not exist.
2. **Source-independence filter.** Advertising companies, industry associations,
   and commercial marketing-research firms are excluded as evidence sources
   (see `SOURCES_POLICY.md`). Industry material appears only where a claim
   analyses that material as its object of critique.

Consequences for downstream use:

- Aggregating this dataset yields a risk-weighted picture by construction. Do not
  read category counts, `impact_score` distributions, or the ratio of negative to
  positive findings as a measure of scientific consensus or effect size.
- A balanced assessment requires a separate literature search for null and
  positive findings, and for industry-side data where commercially relevant.
- Individual claims remain independently verifiable through their source URLs.
  The selection bias applies to the corpus as a whole, not to the accuracy of any
  single record.

The dataset is built as a risk-evidence base in the tradition of litigation-risk
registers and hazard monographs. This section states the selection rule so that
downstream users and AI agents can account for it explicitly.

## Intended Use

Use this dataset to retrieve and compare evidence about OOH/DOOH advertising
risks. Recommended entrypoints are `data/digest.json`, `data/index.json`,
`data/rag-chunks.jsonl`, `QUICKREF.md`, and `SKILL.md`.

## Out-of-Scope Use

Do not treat the dataset as a balanced literature review, market-sizing, or
advertising-sales dataset — see "Selection Criteria and Known Bias" above. Do not
treat quote/context records as empirical proof. Do not cite a claim without
checking its source URLs and, where relevant, `data/verification.json`.

## Data Collection and Curation

Claims are curated from peer-reviewed research, public institutions, court
rulings, regulators, intergovernmental bodies, independent NGOs, journalism, and
source-critique records. Claims are selected directionally as described above.
The source policy is documented in `SOURCES_POLICY.md`; known limitations and
evidence-handling guidance are documented in `DATA_QUALITY.md`.

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
