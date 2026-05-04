# Agent Claim Workflow

Use this workflow when an AI agent adds new claims to the dataset. The goal is
to make expansion easy while keeping the dataset useful for retrieval, due
diligence, and public-interest evidence review.

## 1. Check for Duplicates First

Before creating a claim, search existing records:

```sh
node scripts/query.js --keyword "your topic" --format text
rg -i "distinctive phrase|operator|city|law|study author" data
```

Do not add a new record if an existing claim already covers the same finding,
source, jurisdiction, and year. Prefer improving the existing claim with a
better source or caveat.

## 2. Prefer Strong Sources

Recommended source order:

1. Court ruling, law, regulator, government, WHO/UN, or primary public filing
2. Peer-reviewed paper or systematic review
3. Independent NGO or investigative journalism with transparent evidence
4. Industry source only when the claim explicitly critiques or contextualizes
   the industry source itself

For high-impact claims (`impact_score >= 8`), add a corroborating source when
reasonably available.

## 3. Scaffold the Claim

Use the script instead of hand-picking IDs:

```sh
node scripts/scaffold-claim.js \
  --category regulation \
  --title "Short specific claim title" \
  --impact 8 \
  --impact-types "regulation,legal" \
  --tags "ooh,dooh,advertising-ban,city-name" \
  --source-url "https://example.org/source" \
  --source-title "Source title" \
  --source-year 2026 \
  --source-type government \
  --institution "Institution name"
```

Allowed categories:

`psychology`, `environment`, `urban`, `economy`, `health`, `culture`, `equity`,
`regulation`, `resources`, `politics`, `safety`, `privacy`, `alternatives`.

Allowed source types and impact types are defined in
`schema/claim.schema.json`.

## 4. Complete the Markdown

Fill these sections:

- `Zusammenfassung`: concise, plain-language summary
- `Kernbefund`: exact evidence, numbers, dates, jurisdiction, caveats
- `Relevanz fuer Aussenwerbung`: why this matters for OOH/DOOH
- `English Summary`: short retrieval summary for English-speaking agents

Keep claims specific. Avoid broad activist language in claim titles; put
interpretation and limitations in the body.

## 5. Build and Audit

Run:

```sh
node scripts/build-data.js
node scripts/audit-data.js
node scripts/audit-urls.js
node scripts/export-rag-jsonl.js
node scripts/build-agent-artifacts.js
node scripts/build-upload.js
```

Then from `upload/`:

```sh
node scripts/build-data.js
node scripts/export-rag-jsonl.js
node scripts/build-agent-artifacts.js
node scripts/check-public-release.js
node scripts/audit-data.js
```

If `audit-urls.js` flags a URL, replace it or add a stable corroborating
source before publishing.

## 6. Publish

Only publish the public `upload/` release. Do not publish internal root notes
that are not copied into `upload/`.

For public releases, update:

- `CHANGELOG.md`
- release tag/version if making a meaningful batch update
- GitHub Pages by pushing the public release repo
