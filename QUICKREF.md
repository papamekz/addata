# DOOH/OOH Research Dataset - Quick Reference

Curated navigation for AI agents and analysts. For final answers, retrieve the
full claim Markdown and cite the original source URLs listed in that claim.

Fast paths:

```sh
node scripts/query.js --id reg-037
node scripts/query.js --category regulation --min-impact 9 --format text
node scripts/query.js --keyword greenwashing --format json
node scripts/export-agent-context.js --category culture --top 8 --format md
```

For philosophical, policy, literary, and cultural context, use
`data/advertising-quotes.json`. These quote records are interpretive context,
not empirical evidence. For quality caveats, see `DATA_QUALITY.md`.
Those records are linked to claim IDs but should be treated as interpretive
context, not empirical evidence.

## Current Dataset Shape

| Category | Claims | Use for |
|---|---:|---|
| `regulation` | 43 | bans, court rulings, greenwashing law, advertising restrictions |
| `politics` | 25 | corruption, contract opacity, lobbying, market power |
| `health` | 22 | food, alcohol, gambling, body image, child protection |
| `environment` | 17 | light pollution, emissions, e-waste, biodiversity |
| `resources` | 12 | electricity, materials, screen lifecycle, PVC |
| `urban` | 11 | visual pollution, public space, property values |
| `psychology` | 11 | attention capture, materialism, body image |
| `economy` | 10 | advertised emissions, stranded assets, municipal dependency |
| `safety` | 10 | driver distraction, crashes, illegal billboard structures |
| `privacy` | 9 | GDPR, EU AI Act, biometrics, mobile tracking |
| `culture` | 9 | heritage, gentrification, language, cultural homogenization |
| `equity` | 6 | unequal exposure, children, low-income neighborhoods |
| `alternatives` | 4 | ad-free city and revenue models |

## High-Severity Starting Points

| Context | Start with | Query |
|---|---|---|
| EU regulatory exposure | `reg-025`, `reg-032`, `reg-034`, `reg-026`, `reg-027`, `reg-028` | `node scripts/query.js --category regulation --min-impact 9` |
| Greenwashing / ESG claims | `reg-026`, `reg-031`, `reg-037`, `reg-038`, `reg-040`, `env-015` | `node scripts/query.js --keyword greenwashing --min-impact 8` |
| Operator governance and corruption | `pol-024`, `pol-021`, `pol-018`, `pol-009`, `reg-023`, `pol-011` | `node scripts/query.js --category politics --min-impact 9` |
| Child and public health | `health-014`, `health-009`, `health-016`, `health-005`, `health-013`, `equity-001` | `node scripts/query.js --category health --min-impact 9` |
| Biometric / privacy risk | `priv-006`, `priv-009`, `priv-008`, `priv-003`, `priv-001` | `node scripts/query.js --category privacy --min-impact 9` |
| Traffic and structural safety | `safety-010`, `safety-008`, `safety-001`, `safety-007`, `safety-009` | `node scripts/query.js --category safety --min-impact 8` |
| Energy and material footprint | `res-001`, `res-011`, `res-005`, `env-016`, `env-017`, `res-012` | `node scripts/query.js --keyword energy --format text` |
| Culture and public-space effects | `culture-004`, `culture-008`, `culture-006`, `culture-005`, `culture-007` | `node scripts/export-agent-context.js --category culture --top 8` |
| Inequality / exposure mapping | `equity-005`, `equity-001`, `equity-003`, `equity-002`, `equity-006` | `node scripts/query.js --category equity` |
| Ad-free alternatives | `alt-001`, `alt-002`, `alt-003`, `alt-004` | `node scripts/query.js --category alternatives` |

## Agent Workflow

1. Use `data/digest.json` for retrieval and ranking.
2. Filter by `category`, `tags`, `keyword`, `year`, and `impact_score`.
3. Retrieve `data/{category}/{id}.md` before citing.
4. Check `data/verification.json` for source-sensitive or corrected claims.
5. Cite claim IDs and original source URLs.
6. Run `scripts/audit-data.js` and `scripts/audit-urls.js` before publishing a derived dataset.

## Query Recipes

```sh
# Highest-impact claims across the dataset
node scripts/query.js --min-impact 9 --format text

# Recent regulatory wave
node scripts/query.js --category regulation --keyword 2025 --format text

# Export a compact evidence pack for a downstream LLM/agent
node scripts/export-agent-context.js --keyword "EU AI Act" --top 6 --format md

# Find claims about fossil fuel advertising
node scripts/query.js --keyword "fossil" --format json

# Inspect one claim in full
node scripts/query.js --id reg-032 --format text
```

## Maintenance Commands

```sh
node scripts/build-data.js
node scripts/audit-data.js
node scripts/audit-urls.js
node scripts/check-public-release.js
```

To add a claim:

```sh
node scripts/scaffold-claim.js --category culture --title "Short claim title" --source-url "https://example.org/source"
```

Then complete the generated Markdown file and rerun the build and audit commands.
