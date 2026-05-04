# Agent Prompt Examples

These prompts are designed for agents that can read repository files or fetch raw
GitHub URLs.

## ESG Due Diligence

Use `SKILL.md` and `data/digest.json` from this repository. Assess the ESG and
regulatory exposure of a DOOH operator with screens in EU public space. Prioritize
claims with `impact_score >= 8`. Retrieve full Markdown claim files before citing.
Separate documented evidence from your own inference. Include claim IDs and source
URLs.

## Culture And Public Space

Use `data/digest.json`, `QUICKREF.md`, and claims in `data/culture/`,
`data/urban/`, and `data/equity/`. Summarize documented cultural and public-space
risks of outdoor advertising. Focus on heritage, visual pollution, gentrification,
language commodification, and unequal exposure. Cite claim IDs and source URLs.

## Greenwashing Review

Use this dataset to test whether an outdoor-advertising sustainability claim is
well supported. Search for `greenwashing`, `climate neutral`, `renewable`, `offset`,
`energy`, and `electricity`. Check `data/verification.json` before finalizing. Do
not treat industry-funded metrics as neutral unless the claim is explicitly about
source critique.

## Claim Expansion

Find a new independent source about OOH/DOOH risk that is not already duplicated
in `data/index.json`. Create a candidate summary with proposed category, impact
score, source type, tags, caveats, and why it belongs in the dataset. Prefer courts,
regulators, peer-reviewed papers, public agencies, WHO/UN/EU sources, or
investigative reporting with primary documents.
