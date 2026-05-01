# Methodology

## How Claims Are Selected

Claims are selected based on three criteria:

1. **Source independence**: The source must have no financial or institutional ties to the advertising industry.
2. **Scientific rigor**: Peer-reviewed journal articles, WHO reports, government studies, or research from accredited universities are preferred.
3. **Relevance to outdoor advertising**: The claim must document a harm that is caused or amplified by advertising in public spaces.

## Impact Score

Each claim has an `impact_score` from 1 to 10:

| Score | Meaning |
|-------|---------|
| 1–3 | Minor or indirect harm, limited evidence |
| 4–6 | Moderate harm, reasonable evidence |
| 7–8 | Significant harm, strong evidence |
| 9–10 | Severe harm, very strong or WHO-level evidence |

Scores are assigned conservatively. When in doubt, the lower score is used.

## Source Types

| Type | Description |
|------|-------------|
| `peer-reviewed` | Published in a peer-reviewed academic journal |
| `who-report` | WHO guideline, policy statement, or ELENA intervention |
| `government` | Government agency report (CDC, NBER, public health ministries) |
| `ngo` | Independent nonprofit research organization |
| `book` | Academic book from a university press |

## How to Challenge a Claim

If you believe a source does not meet independence criteria, or a claim misrepresents the source:

1. Open a GitHub Issue with label `source-review`
2. Provide the claim ID and the specific concern
3. Claims under review will be marked `verified: false`

## Languages

Claims are written in German (for accessibility in the German-speaking public), but source metadata is always in the original language.
