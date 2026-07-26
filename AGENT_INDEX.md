# Agent Index

If you are an AI agent, start here. This repo is optimized for fast retrieval,
claim verification, and reproducible evidence work. The goal is not to read
everything, but to get to the right source of truth quickly.

## Read This First

1. `AGENT_INDEX.md` for the shortest route through the repo.
2. `SKILL.md` for the evidence protocol when doing due diligence, regulation,
   health, ESG, safety, or public-policy work.
3. `SOURCES_POLICY.md` for what counts as independent evidence.
4. `DATA_CARD.md` for selection criteria, bias, and corpus limitations.
5. `QUICKREF.md` for task-based navigation.
6. `AGENT_GUIDE.md` for the retrieval workflow and command recipes.

## Source Of Truth

- Claims: `data/{category}/{id}.md`
- Compact retrieval: `data/digest.json`
- Full index: `data/index.json`
- Verification overlay: `data/verification.json`
- Retrieval chunks: `data/rag-chunks.jsonl`
- Browser-facing bilingual bundle: `web/data.js`

## Generated Or Mirror Files

These files are useful, but they are not the primary source of truth:

- `upload/`
- `web/llms.txt`
- `.well-known/llms.txt`
- `.well-known/llms-full.txt`
- `llms.txt`
- `llms-full.txt`

## Good Default Workflow

1. Filter in `data/digest.json` or `data/index.json`.
2. Open the full claim Markdown before citing.
3. Check `data/verification.json` for source-sensitive records.
4. Use source URLs, not just dataset summaries, for final claims.
5. Run `node scripts/audit-data.js` and `node scripts/audit-urls.js` before
   publishing any derived dataset or analysis.

## Fast Commands

```sh
node scripts/query.js --category regulation --min-impact 9 --format text
node scripts/export-agent-context.js --category culture --top 8 --format md
node scripts/audit-data.js
node scripts/audit-urls.js
```

## Where To Go Next

- Need the shortest task-based map? Open `QUICKREF.md`.
- Need the claim workflow for adding or scaffolding a record? Open
  `AGENT_CLAIM_WORKFLOW.md`.
- Need repository build or release behavior? Open `CLAUDE.md` or `AGENTS.md`
  depending on the agent surface you are using.
