# Data Quality and Limitations

This dataset is a curated risk and harm evidence base for OOH/DOOH advertising
analysis. It is designed for due diligence, ESG review, public-interest research,
urban planning, and policy analysis. It is not a neutral market overview and it
should not be used as the only source for commercial forecasting.

## Current Quality Snapshot

- Empirical claims: 189
- Cultural quote context records: 25
- Retrieval chunks: 214
- Languages: German source summaries plus English agent-facing digest
- Validation status: `scripts/audit-data.js` reports no structural errors
- Public package status: `upload/scripts/check-public-release.js` passes

## Strengths

- Strong coverage of regulatory, health, environment, safety, privacy, politics,
  and urban-risk dimensions.
- High agent usability through `data/digest.json`, `data/rag-chunks.jsonl`,
  `agent-manifest.json`, `llms.txt`, `QUICKREF.md`, and `SKILL.md`.
- Source-sensitive records are separated with `data/verification.json`,
  `source_count`, `source_type`, and source policy notes.
- Quote records are explicitly marked as interpretive context, not empirical
  evidence.
- The portable `upload/` folder can be audited and rebuilt independently.

## Known Limitations

- Many claims still have only one source URL. This is not a structural error, but
  high-impact claims should receive corroborating official or academic links
  first.
- Some claims are jurisdiction-specific. Agents should not generalize a local
  court ruling, city policy, or national advertising rule to all markets unless a
  claim explicitly supports that scope.
- Some records document industry or commercial material as the object of critique.
  These are not independent evidence of public benefit and must be read with
  `data/verification.json` and `SOURCES_POLICY.md`.
- Quote context records include literary, philosophical, policy, and public-life
  quotations. They support framing and interpretation only; they do not prove
  factual claims.
- URL availability changes over time. Run `node scripts/audit-urls.js` before a
  formal release or citation-heavy downstream use.
- Numeric embeddings are optional and not committed unless generated from a real
  embedding model. `scripts/generate-embeddings-openai.js` refuses fake vectors.

## Recommended Agent Handling

1. Use `data/digest.json` or `data/rag-chunks.jsonl` for retrieval.
2. Read the full Markdown claim before citing.
3. Prefer claims with multiple source URLs for high-stakes conclusions.
4. Treat `impact_score` as prioritization, not as a statistical effect size.
5. Separate evidence from inference in generated analysis.
6. Use quote records only as cultural or ethical context.
7. Cite original source URLs, not only dataset file paths.

## Improvement Priorities

1. Add second sources to high-impact single-source claims.
2. Replace unstable URLs with official landing pages, DOI pages, court pages, or
   archived/public repository links.
3. Add more non-European jurisdictional comparisons only when sources are strong.
4. Add explicit caveats to claims based on estimates, correlations, or local
   policy contexts.
5. Periodically rebuild `web/data.js`, `data/digest.json`, and
   `data/rag-chunks.jsonl` after edits.

