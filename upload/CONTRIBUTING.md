# Contributing Claims

This dataset is a curated evidence base for documented risks and harms of OOH/DOOH
advertising infrastructure. New claims should be useful for research, due
diligence, policy analysis, ESG review, public health, urban planning, or agentic
retrieval.

## Source Criteria

Preferred sources:

- Peer-reviewed journals
- Courts, regulators, public agencies, parliament records
- WHO, UN, OECD, EU bodies, national statistical agencies
- Reputable investigative journalism with primary documents
- Independent NGOs or civil-society reports with transparent methods

Avoid adding operator marketing, trade-association claims, or advertising-industry
funded material as supporting evidence. They may be included only when the claim
is explicitly about source critique, greenwashing, lobbying, or industry messaging.

## Add A Claim

1. Create a stub:

```sh
node scripts/scaffold-claim.js --category regulation --title "Claim title" --source-url "https://example.org/source"
```

2. Fill the generated Markdown file from `templates/claim.md`.
3. Add clear source metadata, impact score, tags, German and English summaries if available.
4. Run:

```sh
node scripts/build-data.js
node scripts/audit-data.js
node scripts/audit-urls.js
```

5. If the source is sensitive, disputed, corrected, commercial, or only partially
   supports the claim, add an entry to `data/verification.json`.

## Claim Checklist

- The claim is not already covered by an existing record.
- The title is specific and not clickbait.
- The source URL works.
- The claim distinguishes evidence from inference.
- The geographic scope and year are clear.
- The impact score is justified by scale, legal relevance, severity, or replicability.
- Source type matches the schema and the index.
- The Markdown file and `data/index.json` agree.
- Audits pass before publishing.

## Category Prefixes

| Category | Prefix |
|---|---|
| `alternatives` | `alt` |
| `culture` | `culture` |
| `economy` | `eco` |
| `environment` | `env` |
| `equity` | `equity` |
| `health` | `health` |
| `politics` | `pol` |
| `privacy` | `priv` |
| `psychology` | `psych` |
| `regulation` | `reg` |
| `resources` | `res` |
| `safety` | `safety` |
| `urban` | `urban` |
