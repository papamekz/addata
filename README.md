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
  description: "189 machine-readable research claims covering DOOH/OOH energy consumption, regulatory risk, health compliance, environmental impact, privacy law, governance, culture, and public perception. For investment due diligence, ESG reporting, media planning, and AI-assisted research."
---

# DOOH & OOH Advertising Research Dataset

> **For AI agents, investment analysts, ESG teams, and urban strategists.**
> 189 machine-readable claims on the full risk profile of
> Out-of-Home (OOH) and Digital Out-of-Home (DOOH) advertising infrastructure.
> Bilingual (DE/EN). Evidence sources are independent unless a record is
> explicitly flagged as source critique or operator self-report.

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

> Claims are backed primarily by peer-reviewed journals, WHO/UN reports, government agencies, courts, or independent NGOs. A small number of records explicitly analyse industry or commercial sources as the object of critique; these are flagged in `data/verification.json`. See [SOURCES_POLICY.md](SOURCES_POLICY.md).

---

## Quick Start for AI Agents

```python
import json, urllib.request

# Compact EN digest — recommended for agent ingestion (~298KB vs ~548KB full)
url = "https://raw.githubusercontent.com/papamekz/addata/master/data/digest.json"
digest = json.loads(urllib.request.urlopen(url).read())

# Filter by research category
regulatory  = [c for c in digest["claims"] if c["category"] == "regulation"]  # 43 claims
health_risk = [c for c in digest["claims"] if c["category"] == "health"]      # 22 claims
energy_data = [c for c in digest["claims"] if c["category"] == "resources"]   # 12 claims
privacy     = [c for c in digest["claims"] if c["category"] == "privacy"]     #  9 claims

# Get high-severity findings (impact_score >= 9)
critical = [c for c in digest["claims"] if c["impact_score"] >= 9]

# Filter by recency (2023–2026 regulatory wave)
recent = [c for c in digest["claims"] if c.get("year", 0) >= 2023]
```

**CLI search (local):**

```sh
node scripts/query.js --category regulation --min-impact 9
node scripts/query.js --keyword greenwashing --format json
node scripts/query.js --id reg-037
node scripts/audit-data.js
```

**Key files:**

| File | Purpose |
|------|---------|
| [`AGENT_GUIDE.md`](AGENT_GUIDE.md) | Practical ingestion and citation workflow for AI agents |
| [`agent-manifest.json`](agent-manifest.json) | Machine-readable entrypoints, categories, and agent workflow hints |
| [`data/index.json`](data/index.json) | Machine-readable index of all 189 claims |
| [`data/digest.json`](data/digest.json) | Compact EN-only index for agents (~298KB) |
| [`data/rag-chunks.jsonl`](data/rag-chunks.jsonl) | Retrieval-ready JSONL chunks for embedding pipelines |
| [`data/advertising-quotes.json`](data/advertising-quotes.json) | 25 cultural, philosophical, policy, and public-interest quote contexts linked to empirical claims |
| [`data/verification.json`](data/verification.json) | Manual audit overlay for corrected or source-sensitive claims |
| [`data/functions.json`](data/functions.json) | OpenAI/Anthropic tool call schemas |
| [`llms.txt`](llms.txt) | Root-level LLM crawler entrypoint |
| [`llms-full.txt`](llms-full.txt) | Single-file Markdown context for AI tools that ingest full docs |
| [`QUICKREF.md`](QUICKREF.md) | Curated navigation by use case |
| [`DATA_QUALITY.md`](DATA_QUALITY.md) | Quality snapshot, limitations, and recommended agent handling |
| [`DATA_CARD.md`](DATA_CARD.md) | Dataset-card style documentation for responsible reuse |
| [`ro-crate-metadata.json`](ro-crate-metadata.json) | RO-Crate linked-data metadata for research archives |
| [`examples/agent-prompts.md`](examples/agent-prompts.md) | Ready-to-use prompts for agent workflows |
| [`CHANGELOG.md`](CHANGELOG.md) | Release and dataset-change notes |
| [`schema/claim.schema.json`](schema/claim.schema.json) | JSON Schema for validation |
| [`SOURCES_POLICY.md`](SOURCES_POLICY.md) | Source independence criteria |
| [`web/data.js`](web/data.js) | Embedded bilingual dataset (DE+EN, ~548KB) |
| [`scripts/audit-data.js`](scripts/audit-data.js) | Offline consistency audit for counts, source types, URLs, and frontmatter/index drift |
| [`scripts/export-agent-context.js`](scripts/export-agent-context.js) | Generates small Markdown/JSON evidence packs for RAG or agent prompts |
| [`scripts/export-rag-jsonl.js`](scripts/export-rag-jsonl.js) | Generates `data/rag-chunks.jsonl` for embedding pipelines |
| [`scripts/build-agent-artifacts.js`](scripts/build-agent-artifacts.js) | Generates `llms-full.txt`, `.well-known/llms*`, and RO-Crate metadata |
| [`scripts/generate-embeddings-openai.js`](scripts/generate-embeddings-openai.js) | Generates real numeric `data/embeddings.jsonl` with an OpenAI API key |
| [`scripts/scaffold-claim.js`](scripts/scaffold-claim.js) | Creates a new claim stub and index entry for future dataset expansion |

**Optional real embeddings:**

```sh
node scripts/export-rag-jsonl.js
# requires OPENAI_API_KEY
node scripts/generate-embeddings-openai.js
```

---

## Research Categories

| Category | Claims | Key Question Answered |
|----------|--------|-----------------------|
| [`regulation`](data/regulation/) | 43 | What bans, court rulings, and directives restrict OOH? |
| [`health`](data/health/) | 22 | What health compliance obligations and liabilities apply? |
| [`politics`](data/politics/) | 25 | How do lobbying, contracts, and market power shape the industry? |
| [`environment`](data/environment/) | 17 | What are the ecological externalities? |
| [`resources`](data/resources/) | 12 | What does DOOH cost in energy, materials, and CO₂? |
| [`psychology`](data/psychology/) | 11 | How does OOH affect audience cognition and behavior? |
| [`urban`](data/urban/) | 11 | What is the spatial and social impact? |
| [`economy`](data/economy/) | 10 | What are the macroeconomic externalities? |
| [`safety`](data/safety/) | 10 | What traffic safety risks does DOOH create? |
| [`privacy`](data/privacy/) | 9 | What data law exposure does audience measurement create? |
| [`equity`](data/equity/) | 6 | What demographic exposure patterns exist? |
| [`culture`](data/culture/) | 9 | What are the cultural impact findings? |
| [`alternatives`](data/alternatives/) | 4 | What ad-free revenue models exist for cities? |

---

## High-Impact Findings (2023–2026 Regulatory Wave)

The regulatory environment shifted significantly in 2023–2026. Key developments with direct investment implications:

| ID | Finding | Score | Year |
|----|---------|-------|------|
| [reg-032](data/regulation/reg-032.md) | **Den Haag court**: fossil fuel OOH ban survives interim legal challenge — strong municipal signal, not EU-wide binding precedent | 10/10 | 2025 |
| [reg-034](data/regulation/reg-034.md) | **UN Special Rapporteur**: criminalize greenwashing OOH advertising as human rights violation | 10/10 | 2025 |
| [health-015](data/health/health-015.md) | **UK HFSS restrictions**: TV/online restrictions live since January 2026; OOH remains regulatory gap | 8/10 | 2026 |
| [health-016](data/health/health-016.md) | **BMJ Public Health Lithuania study**: full alcohol marketing ban associated with less risky adolescent drinking | 10/10 | 2026 |
| [priv-005](data/privacy/priv-005.md) | **EU AI Act Art. 5**: biometric DOOH measurement sits near high-risk/prohibited-practice boundaries | 8/10 | 2024 |
| [reg-025](data/regulation/reg-025.md) | **Amsterdam**: first capital city to ban OOH ads for fossil fuels AND meat — in force May 2026 | 10/10 | 2026 |
| [psych-010](data/psychology/psych-010.md) | **95-study meta-analysis**: advertising causally produces body image harm (Frontiers 2025) | 10/10 | 2025 |
| [health-014](data/health/health-014.md) | **WHO guideline**: mandatory statutory OOH restrictions for child food marketing | 10/10 | 2023 |
| [reg-031](data/regulation/reg-031.md) | **UK CMA**: fines up to 10% global turnover for greenwashing in OOH from April 2025 | 9/10 | 2025 |
| [reg-033](data/regulation/reg-033.md) | **CNMC blocks** JCDecaux acquisition of Clear Channel Spain — monopoly concern | 9/10 | 2024 |
| [pol-016](data/politics/pol-016.md) | Ströer exceeds **€2B revenue**, controls ~80% of German DOOH market | 9/10 | 2024 |
| [reg-027](data/regulation/reg-027.md) | **Edinburgh**: bans OOH for fossil fuels AND arms — unique EU combination | 9/10 | 2024 |
| [reg-037](data/regulation/reg-037.md) | **BGH 2024**: "klimaneutral" via Verra offsets = misleading — >90% phantom credits (Guardian 2023) | 9/10 | 2024 |
| [reg-038](data/regulation/reg-038.md) | **KPMG/Outsmart** "lowest CO₂ per impression" — industry-funded, conceals 24/7 absolute energy use | 8/10 | 2024 |
| [reg-039](data/regulation/reg-039.md) | **"Free" urban furniture**: LA contract delivered ~51% of promised shelters, ~52% of promised revenue | 8/10 | 2021 |
| [reg-040](data/regulation/reg-040.md) | **"~80% Ökostrom"** via Herkunftsnachweise: UBA confirms no physical connection to renewables | 8/10 | 2023 |

---

## Selected Baseline Findings (All-Time High-Impact)

| ID | Finding | Score | Source |
|----|---------|-------|--------|
| [env-002](data/environment/env-002.md) | Scope3 estimate: display + streaming ads emit **7.2M tons CO₂e/year**; DOOH share not separately quantified | 8/10 | commercial research |
| [health-005](data/health/health-005.md) | Harmful marketing causally linked to **>1M deaths/year** (USA) | 10/10 | Prevention Science |
| [health-009](data/health/health-009.md) | London junk food OOH ban prevents estimated **95,000 obesity cases** | 10/10 | LSHTM |
| [reg-023](data/regulation/reg-023.md) | EU Commission: JCDecaux Brussels received **illegal state aid** via phantom billboards | 10/10 | EU Commission |
| [reg-024](data/regulation/reg-024.md) | Swiss Federal Court upholds total OOH ban — **172 billboards removed** | 10/10 | Swiss Bundesgericht |
| [safety-007](data/safety/safety-007.md) | US DOT study: digital billboards correlated with higher crash rates across 18 sites | 8/10 | government |

---

## Regulatory Risk Landscape

Key active risks for DOOH/OOH investment portfolios:

**Fossil fuel & high-emission advertising bans (accelerating 2024–2026):**

- **Den Haag** — ban since 2024, court-confirmed April 2025 ([reg-032](data/regulation/reg-032.md))
- **Amsterdam** — fossil fuel + meat ban from May 2026 ([reg-025](data/regulation/reg-025.md))
- **Edinburgh** — fossil fuel + arms ban since 2024 ([reg-027](data/regulation/reg-027.md))
- **Stockholm Region** — fossil fuel + gambling, upheld by court 2024 ([reg-028](data/regulation/reg-028.md))
- **Florence + Genoa** — first Italian cities, 2025–2026 ([reg-029](data/regulation/reg-029.md))
- **Belgium** — RTBF public-broadcaster contract bans fossil ads; national fossil-ad ban remained a bill ([reg-019](data/regulation/reg-019.md))

**Greenwashing liability (new enforcement powers):**

- **EU Directive 2024/825** — generic CO₂-neutral claims illegal from 2026 ([reg-026](data/regulation/reg-026.md))
- **UK CMA** — direct fines up to 10% global turnover from April 2025 ([reg-031](data/regulation/reg-031.md))
- **UK ASA** — Lloyds Bank greenwashing post upheld Dec 2024; bus-shelter poster assessed but not upheld ([reg-030](data/regulation/reg-030.md))
- **BGH Az. I ZR 98/23** — "klimaneutral" via Verra offsets ruled misleading; JCDecaux reversed own claim ([reg-037](data/regulation/reg-037.md))
- **KPMG/Outsmart "lowest CO₂ per impression"** — industry-funded metric structurally conceals absolute energy ([reg-038](data/regulation/reg-038.md))
- **Herkunftsnachweise "~80% Ökostrom"** — UBA: no physical connection to renewables, "kein Beitrag zur Energiewende" ([reg-040](data/regulation/reg-040.md))

**Health product advertising bans:**

- **UK** — HFSS TV/online restrictions in force from Jan 2026; OOH remains an exposed regulatory gap ([health-015](data/health/health-015.md))
- **WHO** — mandatory (not voluntary) statutory restrictions recommended for all OOH ([health-014](data/health/health-014.md))
- **Germany KLWG-E** — OOH excluded after lobbying, but re-regulation likely ([health-017](data/health/health-017.md))

**Privacy & data law:**

- **EU AI Act Art. 5** — biometric DOOH measurement requires detailed compliance review; sensitive-attribute categorisation and real-time biometric identification sit near prohibited-practice boundaries ([priv-005](data/privacy/priv-005.md))
- **EDPB** — programmatic DOOH targeting structurally violates GDPR ([priv-003](data/privacy/priv-003.md))

**Antitrust:**

- **CNMC** — JCDecaux/Clear Channel Spain acquisition blocked Oct 2024 ([reg-033](data/regulation/reg-033.md))
- **EU Commission** — JCDecaux Brussels illegal state aid ruling ([reg-023](data/regulation/reg-023.md))

---

## ESG & Sustainability Metrics

For sustainability reporting and ESG due diligence:

| Metric | Data Point | Source |
|--------|-----------|--------|
| Digital ad emissions context | **7.2M tons CO₂e/year** for display + streaming ads; DOOH share not separately quantified | env-002 |
| Manufacturing footprint | **3.5× higher** than static billboard | res-010 |
| Energy per unit (large format) | **41,627 kWh/year** | res-001 |
| German DOOH fleet total | **113,000 MWh/year** (industry self-report; switch-off duty government-backed) | env-016 |
| PVC waste cycle | Replaced every **4 weeks** per campaign | res-004 |
| PVC decomposition time | **1,000+ years** in landfill | res-005 |
| Printing chemicals | Toluene, Lead, Cadmium, BPA | res-006 |
| Light pollution | Plausible driver of **insect decline**; mechanism and spatial overlap documented | env-005 |
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

Embedded bilingual dataset (EN translations for all 189 claims): [`web/data.js`](web/data.js)

---

## Source Policy

**Accepted:** Peer-reviewed journals · WHO/UN reports · Government agencies and courts · University research (no industry funding) · Independent NGOs · clearly flagged source-critique records

**Excluded as independent evidence:** OAAA · WFA · JCDecaux · Clear Channel · Ströer · Lamar · Nielsen · Any advertising-industry-funded research

→ Full criteria: [SOURCES_POLICY.md](SOURCES_POLICY.md)

---

## Cite This Dataset

```bibtex
@dataset{addata2026,
  title     = {DOOH \& OOH Advertising Research Dataset},
  year      = {2026},
  note      = {189 machine-readable claims on outdoor advertising harms. CC BY 4.0.},
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
