---
language:
  - en
  - de
license: cc-by-4.0
tags:
  - dooh
  - ooh
  - outdoor-advertising
  - digital-billboard
  - media-planning
  - esg
  - sustainability
  - urban-planning
  - public-health
  - advertising-research
  - smart-city
  - programmatic-dooh
  - regulatory-risk
  - carbon-footprint
  - greenwashing
  - advertising-ban
  - investment-risk
  - rag
  - due-diligence
pretty_name: "DOOH & OOH Advertising Research Dataset — Due Diligence, ESG & Regulatory Risk"
size_categories:
  - n<1K
task_categories:
  - text-retrieval
  - question-answering
dataset_info:
  description: "144 peer-reviewed, machine-readable research claims covering DOOH/OOH energy consumption, regulatory risk, health compliance, environmental impact, privacy law, and public perception. For investment due diligence, ESG reporting, media planning, and AI-assisted research."
---

# DOOH & OOH Advertising Research Dataset

> **For AI agents, investment analysts, ESG teams, and urban strategists.**
> 144 peer-reviewed, machine-readable claims on the full risk profile of
> Out-of-Home (OOH) and Digital Out-of-Home (DOOH) advertising infrastructure.
> Bilingual (DE/EN). All sources independent — zero industry data.

## What This Dataset Is For

Companies, agencies, investors, and city planners evaluating DOOH/OOH exposure face a fragmented research landscape. This dataset aggregates **independent, peer-reviewed evidence** on every risk dimension that matters for strategic decisions:

- **Energy & infrastructure costs** — kWh/year, hardware lifecycle, e-waste
- **ESG & carbon footprint** — Scope 3 emissions, advertised emissions, manufacturing CO₂
- **Regulatory risk** — city bans, court rulings, EU directives (2023–2026), greenwashing liability
- **Public health compliance** — HFSS bans, gambling restrictions, alcohol ad prohibitions
- **Privacy & data law** — EU AI Act, GDPR, biometric audience measurement legality
- **Traffic safety** — driver distraction studies, highway accident correlation
- **Market concentration** — antitrust rulings, oligopoly risk, political capture
- **Community & social impact** — visual pollution, public space privatization

> All 144 claims are backed by peer-reviewed journals, WHO/UN reports, government agencies, or independent NGOs.
> Zero industry-funded sources. See [SOURCES_POLICY.md](SOURCES_POLICY.md).

---

## Quick Start for AI Agents

```python
import json, urllib.request

# Load full index from GitHub
url = "https://raw.githubusercontent.com/papamekz/addata/master/data/index.json"
index = json.loads(urllib.request.urlopen(url).read())

# Filter by research category
regulatory  = [c for c in index["claims"] if c["category"] == "regulation"]  # 34 claims
health_risk = [c for c in index["claims"] if c["category"] == "health"]      # 17 claims
energy_data = [c for c in index["claims"] if c["category"] == "resources"]   # 11 claims
privacy     = [c for c in index["claims"] if c["category"] == "privacy"]     #  5 claims

# Get high-severity findings (impact_score >= 9)
critical = [c for c in index["claims"] if c["impact_score"] >= 9]
# → 80+ findings with impact score 9–10

# Filter by recency (2023–2026 regulatory wave)
recent = [c for c in index["claims"] if c.get("year", 0) >= 2023]

# Get a specific claim with full context
import pathlib
claim_text = pathlib.Path("data/regulation/reg-032.md").read_text(encoding="utf-8")
# → Den Haag court upholds fossil fuel OOH ban (April 2025)
```

**Key files:**

| File | Purpose |
|------|---------|
| [`data/index.json`](data/index.json) | Machine-readable index of all 144 claims |
| [`schema/claim.schema.json`](schema/claim.schema.json) | JSON Schema for validation |
| [`SOURCES_POLICY.md`](SOURCES_POLICY.md) | Source independence criteria |
| [`web/data.js`](web/data.js) | Embedded bilingual dataset (DE+EN, 370 KB) |

---

## Research Categories

| Category | Claims | Key Question Answered |
|----------|--------|-----------------------|
| [`regulation`](data/regulation/) | 34 | What bans, court rulings, and directives restrict OOH? |
| [`health`](data/health/) | 17 | What health compliance obligations and liabilities apply? |
| [`politics`](data/politics/) | 16 | How do lobbying, contracts, and market power shape the industry? |
| [`environment`](data/environment/) | 16 | What are the ecological externalities? |
| [`resources`](data/resources/) | 11 | What does DOOH cost in energy, materials, and CO₂? |
| [`psychology`](data/psychology/) | 10 | How does OOH affect audience cognition and behavior? |
| [`urban`](data/urban/) | 8 | What is the spatial and social impact? |
| [`economy`](data/economy/) | 8 | What are the macroeconomic externalities? |
| [`safety`](data/safety/) | 7 | What traffic safety risks does DOOH create? |
| [`privacy`](data/privacy/) | 5 | What data law exposure does audience measurement create? |
| [`equity`](data/equity/) | 4 | What demographic exposure patterns exist? |
| [`culture`](data/culture/) | 4 | What are the cultural impact findings? |
| [`alternatives`](data/alternatives/) | 4 | What ad-free revenue models exist for cities? |

---

## High-Impact Findings (2023–2026 Regulatory Wave)

The regulatory environment shifted significantly in 2023–2026. Key developments with direct investment implications:

| ID | Finding | Score | Year |
|----|---------|-------|------|
| [reg-032](data/regulation/reg-032.md) | **Den Haag court**: fossil fuel OOH ban survives industry legal challenge — EU precedent | 10/10 | 2025 |
| [reg-034](data/regulation/reg-034.md) | **UN Special Rapporteur**: criminalize greenwashing OOH advertising as human rights violation | 10/10 | 2025 |
| [health-015](data/health/health-015.md) | **UK HFSS ban**: complete OOH ban for junk food live since January 2026 — first nationally | 10/10 | 2026 |
| [health-016](data/health/health-016.md) | **BMJ Lithuania study**: national OOH alcohol ad ban causally reduces consumption — 84,189 subjects | 10/10 | 2025 |
| [priv-005](data/privacy/priv-005.md) | **EU AI Act Art. 5**: biometric audience measurement on DOOH screens illegal from Feb 2025 | 10/10 | 2024 |
| [reg-025](data/regulation/reg-025.md) | **Amsterdam**: first capital city to ban OOH ads for fossil fuels AND meat — in force May 2026 | 10/10 | 2026 |
| [psych-010](data/psychology/psych-010.md) | **95-study meta-analysis**: advertising causally produces body image harm (Frontiers 2025) | 10/10 | 2025 |
| [health-014](data/health/health-014.md) | **WHO guideline**: mandatory statutory OOH restrictions for child food marketing | 10/10 | 2023 |
| [reg-031](data/regulation/reg-031.md) | **UK CMA**: fines up to 10% global turnover for greenwashing in OOH from April 2025 | 9/10 | 2025 |
| [reg-033](data/regulation/reg-033.md) | **CNMC blocks** JCDecaux acquisition of Clear Channel Spain — monopoly concern | 9/10 | 2024 |
| [pol-016](data/politics/pol-016.md) | Ströer exceeds **€2B revenue**, controls ~80% of German DOOH market | 9/10 | 2024 |
| [reg-027](data/regulation/reg-027.md) | **Edinburgh**: bans OOH for fossil fuels AND arms — unique EU combination | 9/10 | 2024 |

---

## Selected Baseline Findings (All-Time High-Impact)

| ID | Finding | Score | Source |
|----|---------|-------|--------|
| [res-009](data/resources/res-009.md) | Digital advertising: **7.2M tons CO₂/year** ≈ aviation industry | 10/10 | peer-reviewed |
| [health-005](data/health/health-005.md) | Harmful marketing causally linked to **>1M deaths/year** (USA) | 10/10 | Prevention Science |
| [health-009](data/health/health-009.md) | London junk food OOH ban prevents estimated **95,000 obesity cases** | 10/10 | LSHTM |
| [reg-023](data/regulation/reg-023.md) | EU Commission: JCDecaux Brussels received **illegal state aid** via phantom billboards | 10/10 | EU Commission |
| [reg-024](data/regulation/reg-024.md) | Swiss Federal Court upholds total OOH ban — **172 billboards removed** | 10/10 | Swiss Bundesgericht |
| [safety-007](data/safety/safety-007.md) | US study: **25–29% higher crash rates** near digital billboards on highways | 9/10 | government |

---

## Regulatory Risk Landscape

Key active risks for DOOH/OOH investment portfolios:

**Fossil fuel & high-emission advertising bans (accelerating 2024–2026):**

- **Den Haag** — ban since 2024, court-confirmed April 2025 ([reg-032](data/regulation/reg-032.md))
- **Amsterdam** — fossil fuel + meat ban from May 2026 ([reg-025](data/regulation/reg-025.md))
- **Edinburgh** — fossil fuel + arms ban since 2024 ([reg-027](data/regulation/reg-027.md))
- **Stockholm Region** — fossil fuel + gambling, upheld by court 2024 ([reg-028](data/regulation/reg-028.md))
- **Florence + Genoa** — first Italian cities, 2025–2026 ([reg-029](data/regulation/reg-029.md))
- **Belgium** — first national fossil fuel ad ban, 2023 ([reg-019](data/regulation/reg-019.md))

**Greenwashing liability (new enforcement powers):**

- **EU Directive 2024/825** — generic CO₂-neutral claims illegal from 2026 ([reg-026](data/regulation/reg-026.md))
- **UK CMA** — direct fines up to 10% global turnover from April 2025 ([reg-031](data/regulation/reg-031.md))
- **UK ASA** — Lloyds Bank OOH campaign banned Dec 2024 ([reg-030](data/regulation/reg-030.md))

**Health product advertising bans:**

- **UK** — complete OOH HFSS ban from Jan 2026 ([reg-015](data/regulation/reg-015.md) + [health-015](data/health/health-015.md))
- **WHO** — mandatory (not voluntary) statutory restrictions recommended for all OOH ([health-014](data/health/health-014.md))
- **Germany KLWG-E** — OOH excluded after lobbying, but re-regulation likely ([health-017](data/health/health-017.md))

**Privacy & data law:**

- **EU AI Act Art. 5** — biometric categorization in public space prohibited from Feb 2025 ([priv-005](data/privacy/priv-005.md))
- **EDPB** — programmatic DOOH targeting structurally violates GDPR ([priv-003](data/privacy/priv-003.md))

**Antitrust:**

- **CNMC** — JCDecaux/Clear Channel Spain acquisition blocked Oct 2024 ([reg-033](data/regulation/reg-033.md))
- **EU Commission** — JCDecaux Brussels illegal state aid ruling ([reg-023](data/regulation/reg-023.md))

---

## ESG & Sustainability Metrics

For sustainability reporting and ESG due diligence:

| Metric | Data Point | Source |
|--------|-----------|--------|
| CO₂ per large DOOH unit | ~5 tons/year (operation) | res-009 |
| Manufacturing footprint | **3.5× higher** than static billboard | res-010 |
| Energy per unit (large format) | **41,627 kWh/year** | res-001 |
| German DOOH fleet total | **113,000 MWh/year** (confirmed by federal government) | env-016 |
| PVC waste cycle | Replaced every **4 weeks** per campaign | res-004 |
| PVC decomposition time | **1,000+ years** in landfill | res-005 |
| Printing chemicals | Toluene, Lead, Cadmium, BPA | res-006 |
| Light pollution | Causal link to **insect decline** confirmed | env-005 |
| Advertised Scope 3 emissions | High-emission sectors dominate OOH bookings | eco-006 |

---

## Data Format

Every claim is a bilingual Markdown file with YAML frontmatter for RAG and programmatic use:

```markdown
---
id: reg-032
title: "Den Haag: Fossil-Fuel-OOH-Werbeverbot übersteht Klage — Gericht bestätigt Verbot April 2025"
category: regulation
impact_score: 10
source:
  institution: "District Court of The Hague / Gemeente Den Haag"
  year: 2025
  url: "https://www.denhaag.nl/..."
  type: government
  independent: true
verified: true
tags: [fossil-fuel, outdoor-advertising, court-ruling, eu-precedent]
---

## Zusammenfassung
[German summary]

## Kernbefund
[German key finding]

## Relevanz für Außenwerbung
[German OOH relevance]
```

**Schema validation:** [`schema/claim.schema.json`](schema/claim.schema.json)

Embedded bilingual dataset (EN translations for all 144 claims): [`web/data.js`](web/data.js)

---

## Source Policy

**Accepted:** Peer-reviewed journals · WHO/UN reports · Government agencies · University research (no industry funding) · Independent NGOs

**Excluded:** OAAA · WFA · JCDecaux · Clear Channel · Ströer · Lamar · Nielsen · Any advertising-industry-funded research

→ Full criteria: [SOURCES_POLICY.md](SOURCES_POLICY.md)

---

## Cite This Dataset

```bibtex
@dataset{addata2026,
  title     = {DOOH \& OOH Advertising Research Dataset},
  year      = {2026},
  note      = {144 peer-reviewed claims on outdoor advertising harms. CC BY 4.0.},
  url       = {https://github.com/papamekz/addata}
}
```

See also: [CITATION.cff](CITATION.cff)

---

## Contributing

Found a relevant study? Open a PR:
1. Use the claim template (see any existing `.md` file)
2. Verify `independent: true` per [SOURCES_POLICY.md](SOURCES_POLICY.md)
3. Set `verified: false` until manually confirmed
4. Update `data/index.json`

---

## License

[CC BY 4.0](LICENSE) — Free use with attribution.
