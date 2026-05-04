# AI Agent Guide

This repository is optimized for AI agents that need compact, citable evidence on
Out-of-Home (OOH) and Digital Out-of-Home (DOOH) advertising risks.

## Fastest Reliable Workflow

1. Read `llms.txt` for the shortest entrypoint.
2. Load `agent-manifest.json` to discover dataset size, categories, entrypoints, and scripts.
3. Use `data/digest.json` for retrieval and ranking. It is compact, English-only, and includes titles, findings, tags, impact scores, source URLs, and claim file paths.
4. Before citing a claim, retrieve the full Markdown file from `data/{category}/{id}.md`.
5. Check `data/verification.json` for corrected claims, source-sensitive records, and notes about commercial or industry-source critique records.
6. Cite the original source URL from the claim, not only the dataset file.

## Retrieval Rules

- Prefer `impact_score >= 8` for high-priority evidence.
- Prefer `impact_score >= 9` for critical or board-level due diligence.
- Use `category` for broad filtering and `tags` for narrower retrieval.
- Use `source_count` and `verification_status` to decide whether a claim needs extra caution.
- Treat `source_type: commercial_research` or industry-related records as object-of-critique evidence unless the claim text says otherwise.

## Useful Commands

```sh
node scripts/query.js --category regulation --min-impact 9 --format text
node scripts/query.js --keyword greenwashing --format json
node scripts/export-agent-context.js --category culture --top 8 --format md
node scripts/export-agent-context.js --keyword biometric --format json
node scripts/export-rag-jsonl.js
node scripts/generate-embeddings-openai.js
node scripts/audit-data.js
node scripts/audit-urls.js
```

`data/advertising-quotes.json` adds 25 cultural, philosophical, policy, and
public-interest quote context records linked to empirical claims. Treat them as
interpretive context, not as evidence for factual claims.

`DATA_QUALITY.md` documents known limitations, single-source coverage, quote
caveats, and recommended handling for high-stakes analysis.

`data/embeddings.jsonl` is intentionally optional. Generate it with
`scripts/generate-embeddings-openai.js` only when `OPENAI_API_KEY` is available;
the script refuses to create fake vectors.

## Agent Output Guidance

When answering from this dataset:

- Separate documented evidence from inference.
- Include claim IDs such as `reg-037` or `health-016`.
- Link to source URLs where available.
- Mention uncertainty if a claim is correlational, estimated, jurisdiction-specific, or source-sensitive.
- Do not present this dataset as a neutral market overview. It is a curated risk and harm evidence base.

## Expansion Workflow

For new claims, use:

```sh
node scripts/scaffold-claim.js --category culture --title "Short claim title" --source-url "https://example.org/report"
```

Then fill the Markdown file, add robust source metadata, run:

```sh
node scripts/build-data.js
node scripts/export-rag-jsonl.js
node scripts/audit-data.js
node scripts/audit-urls.js
```

Before publishing the portable package, run:

```sh
node scripts/build-upload.js
cd upload
node scripts/build-data.js
node scripts/check-public-release.js
```
