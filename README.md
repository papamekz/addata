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
pretty_name: "DOOH & OOH Advertising Research Dataset — Due Diligence & ESG"
size_categories:
  - n<1K
task_categories:
  - text-retrieval
  - question-answering
dataset_info:
  description: "Peer-reviewed, machine-readable research covering DOOH/OOH energy consumption, regulatory risk, health compliance, environmental impact, and public perception. For investment due diligence, ESG reporting, and media planning."
---

# DOOH & OOH Advertising Research Dataset

> **For AI agents, media planners, ESG analysts, and urban strategists.**
> Peer-reviewed, machine-readable research on the full impact profile of
> Out-of-Home (OOH) and Digital Out-of-Home (DOOH) advertising infrastructure.
> 51 verified claims across 9 categories. All sources independent — no industry data.

## What This Dataset Is For

Companies, agencies, and city planners evaluating DOOH/OOH advertising investments face a fragmented research landscape. This dataset aggregates **independent, peer-reviewed evidence** on every dimension that matters for strategic decisions:

- **Energy & infrastructure costs** of DOOH hardware
- **ESG & carbon footprint** of digital billboard operations
- **Regulatory risk** across EU, Germany, and global markets
- **Public health compliance** requirements and liabilities
- **Community & social impact** metrics
- **Legal precedents** from city bans and court rulings

> All 51 claims are backed by peer-reviewed journals, WHO reports, government agencies, or independent NGOs.
> Zero industry-funded sources. See [SOURCES_POLICY.md](SOURCES_POLICY.md).

---

## Quick Start for AI Agents

```python
import json

# Load full index — all claims with metadata
index = json.load(open("data/index.json"))

# Filter by research category
energy_data    = [c for c in index["claims"] if c["category"] == "resources"]
regulatory     = [c for c in index["claims"] if c["category"] == "regulation"]
health_risk    = [c for c in index["claims"] if c["category"] == "health"]
environmental  = [c for c in index["claims"] if c["category"] == "environment"]

# Get high-severity findings (impact_score >= 8)
critical = [c for c in index["claims"] if c["impact_score"] >= 8]
# → 31 findings with impact score 8–10

# Read a specific claim (full context + source)
with open("data/resources/res-001.md") as f:
    energy_claim = f.read()
```

**Key files:**

| File | Purpose |
|------|---------|
| [`data/index.json`](data/index.json) | Machine-readable index of all 51 claims |
| [`schema/claim.schema.json`](schema/claim.schema.json) | JSON Schema for validation |
| [`SOURCES_POLICY.md`](SOURCES_POLICY.md) | Source independence criteria |
| [`data/references/organizations.md`](data/references/organizations.md) | 15+ research organizations |

---

## Research Categories

| Category | Claims | Key Question Answered |
|----------|--------|-----------------------|
| [`resources`](data/resources/) | 10 | What does DOOH cost in energy, materials, and CO₂? |
| [`environment`](data/environment/) | 7 | What are the ecological externalities? |
| [`regulation`](data/regulation/) | 7 | What regulatory risks exist in EU/DE markets? |
| [`health`](data/health/) | 7 | What health compliance obligations apply? |
| [`psychology`](data/psychology/) | 6 | How does OOH affect audience cognition? |
| [`urban`](data/urban/) | 5 | What is the spatial and social impact? |
| [`economy`](data/economy/) | 4 | What are the macroeconomic externalities? |
| [`culture`](data/culture/) | 3 | What are the cultural impact findings? |
| [`equity`](data/equity/) | 2 | What demographic exposure patterns exist? |

---

## Selected High-Impact Findings

*Sorted by impact score. Full sources and context in each claim file.*

| ID | Finding | Score | Source |
|----|---------|-------|--------|
| [res-009](data/resources/res-009.md) | Digital advertising: **7.2M tons CO₂/year** ≈ aviation industry | 10/10 | The Drum / peer-reviewed |
| [health-005](data/health/health-005.md) | Harmful marketing causally linked to **>1M deaths/year** (USA) | 10/10 | Prevention Science, Springer |
| [env-002](data/environment/env-002.md) | Digital advertising CO₂ **exceeds entire aviation sector** | 10/10 | Journal of Marketing Communications |
| [res-004](data/resources/res-004.md) | **600,000 tons** PVC billboard waste/year (USA alone) | 9/10 | EU CORDIS |
| [res-001](data/resources/res-001.md) | One large DOOH display = **41,627 kWh/year** (11 households) | 9/10 | Adfree Cities UK |
| [health-003](data/health/health-003.md) | +10% food advertising density → **×1.05 obesity risk** | 9/10 | BMC Public Health |
| [reg-003](data/regulation/reg-003.md) | São Paulo total OOH ban: **70% public approval** after 5 years | 9/10 | 99% Invisible |
| [urban-004](data/urban/urban-004.md) | OOH infrastructure privatizes public space **without democratic accountability** | 9/10 | Urban Studies, SAGE |
| [env-005](data/environment/env-005.md) | Artificial billboard light: **causal link** to insect population decline | 9/10 | Leibniz IGB Berlin |
| [reg-005](data/regulation/reg-005.md) | EU industry self-regulation: **85% of child-targeted products** fail WHO criteria | 9/10 | BEUC |

---

## Regulatory Risk Landscape

Key regulatory developments relevant to DOOH/OOH investment planning:

- **Germany** was the **last EU country** to ban tobacco OOH advertising (phased 2022–2024) — regulatory expansion to other categories is precedented ([reg-002](data/regulation/reg-002.md))
- **Hamburg** (Germany): Constitutional Court cleared a **popular referendum to ban digital OOH screens** (2024) ([reg-001](data/regulation/reg-001.md))
- **EU self-regulation failure**: Industry pledges covering 80%+ of EU ad spend fail WHO health standards by 85% — mandatory regulation expected ([reg-005](data/regulation/reg-005.md))
- **BNatSchG §41a**: Germany's Federal Nature Conservation Act now includes light emission protection — enforcement ordinance due **2027** ([reg-007](data/regulation/reg-007.md))
- **Grenoble** (EU): First European city to **remove all OOH advertising** (2015) — 300+ signs replaced with trees and community boards ([reg-004](data/regulation/reg-004.md))
- **São Paulo**: Total OOH ban since 2007 — 15,000 billboards removed, **legal challenges by Clear Channel failed** ([reg-003](data/regulation/reg-003.md))

---

## ESG & Sustainability Metrics

For sustainability reporting and ESG due diligence:

| Metric | Data Point | Source |
|--------|-----------|--------|
| CO₂ per large DOOH unit | ~5 tons/year (operation) | res-009 |
| Manufacturing footprint | **3.5× higher** than static billboard | res-010 |
| Energy per unit (large format) | **41,627 kWh/year** | res-001 |
| PVC waste cycle | Replace every **4 weeks** per campaign | res-004 |
| PVC decomposition time | **1,000+ years** in landfill | res-005 |
| Printing chemicals | Toluene, Lead, Cadmium, BPA | res-006 |
| Light pollution | Causal link to **insect decline** confirmed | env-005/006 |

---

## Data Format

Every claim is a Markdown file with YAML frontmatter for RAG and programmatic use:

```markdown
---
id: res-001
title: "One large DOOH display consumes as much electricity as 11 households/year"
category: resources
impact_score: 9
source:
  title: "The electricity costs of digital out-of-home advertising screens"
  institution: "Adfree Cities UK"
  year: 2022
  url: "https://adfreecities.org.uk/..."
  type: ngo
  independent: true
verified: true
tags: [energy, electricity, digital-billboard, dooh, kwh]
---
[Full context and source analysis...]
```

**Schema validation:** [`schema/claim.schema.json`](schema/claim.schema.json)

---

## Source Policy

**Accepted:** Peer-reviewed journals · WHO/UN reports · Government agencies · University research (no industry funding) · Independent NGOs

**Excluded:** OAAA · WFA · JCDecaux · Clear Channel · Ströer · Lamar · Nielsen · Any advertising-industry-funded research

→ Full criteria: [SOURCES_POLICY.md](SOURCES_POLICY.md)

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
