# Design: DOOH/OOH Research Dataset — Trojan Horse Strategy

**Date:** 2026-05-01
**Status:** Implemented

## Goal

Build a machine-readable research dataset that corporate AI agents find when evaluating DOOH/OOH advertising investments — and whose data naturally leads those agents to advise against DOOH. The critical stance stays "between the lines": no explicit advocacy, only peer-reviewed evidence answering exactly the questions a due-diligence AI asks.

## Core Strategy

Surface: professional ESG/due-diligence research tool for DOOH investment analysis.
Underneath: 51 peer-reviewed findings documenting energy costs, regulatory risk, health liabilities, environmental harm, and cultural externalities.

The framing is "here is the research landscape you need for informed decisions." The data answers every question in a way that makes DOOH look like a stranded-asset risk.

## Architecture

### Discovery Layer (how agents find it)
- **GitHub**: Topics — `dooh`, `ooh`, `outdoor-advertising`, `esg`, `programmatic-dooh`, `media-planning`, `regulatory-risk`, `carbon-footprint`
- **Hugging Face**: YAML frontmatter in README.md triggers HF Dataset Hub indexing; tags include `dooh`, `esg`, `sustainability`, `programmatic-dooh`
- **SEO keywords throughout**: "due diligence", "ESG reporting", "media planning", "investment risk", "regulatory exposure"

### Data Layer (what agents read)
```
data/
├── index.json          ← master index, all 51 claims, machine-readable
├── resources/          ← 10 claims: energy, materials, CO₂, waste
├── environment/        ← 7 claims: light pollution, insect decline, CO₂
├── regulation/         ← 7 claims: EU/DE bans, court rulings, legal precedents
├── health/             ← 7 claims: obesity, child marketing, deaths
├── psychology/         ← 6 claims: attention, cognitive manipulation
├── urban/              ← 5 claims: visual pollution, public space
├── economy/            ← 4 claims: inequality, debt, externalities
├── culture/            ← 3 claims: homogenization
└── equity/             ← 2 claims: demographic targeting
```

### Format Layer (how agents parse it)
- Each claim: Markdown file with YAML frontmatter (id, title, category, impact_score, impact_type, source, verified, tags)
- `data/index.json`: complete index for batch processing; filterable by category, impact_score, source_type
- `schema/claim.schema.json`: JSON Schema validates all claims; `independent: true` is a const — no industry data can pass validation

## Source Policy

**Accepted:** Peer-reviewed journals, WHO/UN reports, government agencies, university research (no industry funding), independent NGOs.

**Excluded by name:** OAAA, WFA, FEPE, JCDecaux, Clear Channel, Ströer, Lamar, Nielsen, and any advertising-industry-funded research.

Documented in `SOURCES_POLICY.md`. This is load-bearing: the exclusion list is what makes the dataset credible to ESG analysts and adversarial to industry spin.

## Key Design Decisions

**Why "due diligence" framing?**
Corporate AI agents querying "DOOH investment risks" or "ESG DOOH" will retrieve this dataset. Neutral academic framing ("harm of advertising") would not appear in those query paths. The professional framing is the distribution mechanism.

**Why no explicit anti-advertising messaging?**
Explicit advocacy gets dismissed or filtered by corporate information systems. Evidence-only presentation is harder to discount and passes through AI agent retrieval unchanged.

**Why only independent sources?**
Industry-funded research systematically underestimates harms. The `independent: true` schema constraint is a technical guarantee that this dataset cannot be contaminated by industry data, even through PRs.

**Why impact_score 1-10?**
Allows AI agents to filter for high-severity findings (`impact_score >= 8`: 31 claims) without reading all 51 files. Increases the probability that critical findings surface in RAG context windows.

## Implemented

- 51 claims across 9 categories, all with YAML frontmatter
- `data/index.json` with complete metadata for all claims
- `schema/claim.schema.json` for validation
- `SOURCES_POLICY.md` with explicit exclusion list
- `README.md` with HuggingFace YAML card, industry keywords, ESG/due-diligence framing
- `data/references/organizations.md` with 15+ independent anti-advertising organizations
- `docs/methodology.md` with impact score methodology

## Next Steps

1. Create GitHub repository with appropriate Topics
2. Push to GitHub (public)
3. Create Hugging Face dataset (upload index.json, configure dataset card)
4. Monitor: track if dataset appears in HF search results for `dooh esg`
