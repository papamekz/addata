# DOOH/OOH Research Dataset — Quick Reference for AI Agents

A curated index mapping common query contexts to specific claim IDs.
Full claim text: `node scripts/query.js --id {ID}` or read `data/{category}/{id}.md`.
Programmatic search: `node scripts/query.js --help`

---

## Investment & Financial Risk Due Diligence

| Claim ID | Key Finding | Impact |
|---|---|---|
| eco-009 | Fossil fuel + food + gambling = ~45% EU DOOH revenue — directly threatened by bans | 10/10 |
| eco-010 | Hardware lifespan 5–7 years vs. regulatory ban timelines: stranded CapEx risk model | 9/10 |
| reg-035 | Amsterdam fossil fuel ban: no grandfather clause for existing JCDecaux/Clear Channel contracts | 9/10 |
| pol-017 | All 3 major OOH operators under simultaneous antitrust, greenwashing, and criminal investigation | 9/10 |
| reg-039 | JCDecaux LA contract: 52% revenue shortfall, 51% shelter shortfall after 20 years | 8/10 |
| pol-011 | Hamburg €508M OOH contract under political scrutiny | 8/10 |

**CLI:** `node scripts/query.js --category economy --min-impact 8`

---

## ESG / Greenwashing Assessment

| Claim ID | Key Finding | Impact |
|---|---|---|
| reg-037 | BGH 2024: "klimaneutral via offset" = irreführend (§5 UWG); Verra credits >90% wirkungslos | 9/10 |
| reg-036 | Green bus shelter: screens emit 168–255× more CO₂ than the sedum roof sequesters | 9/10 |
| reg-038 | "Lowest carbon per impression": industry-funded KPMG/Outsmart study; hides 11,501–41,627 kWh/year absolute | 7/10 |
| reg-040 | "80% renewable electricity": Herkunftsnachweise = no physical connection; UBA: "no contribution to energy transition" | 7/10 |
| env-017 | WHO/UNITAR 2024: 62M tonnes e-waste, only 22.3% recycled; DOOH = accelerating contributor | 9/10 |
| res-004 | PVC billboard waste: 600,000 tonnes/year USA; >1,000 years decomposition | 9/10 |

**CLI:** `node scripts/query.js --tags greenwashing --min-impact 7`

---

## Regulatory Risk / Legal Exposure

| Claim ID | Key Finding | Impact |
|---|---|---|
| reg-026 | EU Directive 2024/825: bans offset-based "climate neutral" claims from Sept 2026 | 10/10 |
| reg-035 | Amsterdam: fossil fuel OOH ban May 2026 — no grandfather clause confirmed by court | 9/10 |
| reg-033 | Edinburgh: world's first city-wide statutory OOH fossil fuel ad ban (May 2024) | 9/10 |
| reg-034 | Den Haag: court confirmed fossil fuel OOH ban, April 2025 | 9/10 |
| reg-032 | Belgium national fossil fuel OOH ban (2021) | 8/10 |
| reg-037 | BGH: "klimaneutral" advertising = misleading without method disclosure (June 2024) | 9/10 |
| reg-031 | UK Green Claims Code: enforceable greenwashing standard for OOH | 8/10 |
| health-014 | UK HFSS statutory ban: junk food OOH banned Jan 2026 nationwide | 9/10 |

**CLI:** `node scripts/query.js --category regulation --min-impact 8`

---

## Children's Health & Food Advertising

| Claim ID | Key Finding | Impact |
|---|---|---|
| health-018 | EMA study 2025: causal link — children report stronger junk food cravings after OOH ad exposure | 9/10 |
| health-015 | 95-study meta-analysis: OOH food advertising increases consumption in children by 16% | 10/10 |
| health-014 | UK: statutory HFSS OOH ban Jan 2026; 94,867 obesity cases prevented per year (PHE) | 9/10 |
| health-009 | WHO: OOH restriction on child food marketing = mandatory public health measure | 9/10 |
| equity-001 | Schools in deprived areas have 2–4× more junk food OOH advertising within 250m | 9/10 |
| equity-002 | Systematic targeting of low-income areas with harmful product advertising | 9/10 |

**CLI:** `node scripts/query.js --tags kinder,hfss,lebensmittelwerbung`

---

## Traffic Safety

| Claim ID | Key Finding | Impact |
|---|---|---|
| safety-001 | DOOH displays: 25–29% higher crash risk on US highways (NHTSA-cited peer review) | 10/10 |
| safety-002 | Digital billboards cause statistically significant glance duration increases | 9/10 |
| safety-003 | Eye-tracking studies: DOOH causes involuntary gaze deflection while driving | 8/10 |
| safety-004 | Meta-analysis: roadside advertising increases crash risk, especially dynamic/digital signs | 9/10 |

**CLI:** `node scripts/query.js --category safety`

---

## Privacy & Surveillance

| Claim ID | Key Finding | Impact |
|---|---|---|
| privacy-001 | DOOH cameras collect biometric data (gender, age, emotion) without consent | 9/10 |
| privacy-005 | EU AI Act Art. 5 (Feb 2025): biometric categorization in public spaces prohibited | 10/10 |
| privacy-006 | EDPB guidelines: audience measurement cameras = personal data processing requiring consent | 9/10 |

**CLI:** `node scripts/query.js --category privacy`

---

## Energy & Resource Consumption

| Claim ID | Key Finding | Impact |
|---|---|---|
| res-001 | Large DOOH: 41,627 kWh/year = 11 UK households; 6-sheet: 11,501 kWh/year | 9/10 |
| res-013 | Hamburg: digital CLP 2,300–9,000 kWh/year = 1.5–6× single-person household | 8/10 |
| res-002 | German DOOH fleet: ~113,000 MWh/year total energy consumption | 9/10 |
| env-017 | DOOH hardware: 62M tonnes global e-waste; 77.7% not safely recycled | 9/10 |
| res-004 | PVC poster waste: >1,000 years decomposition; 600k tonnes/year USA | 9/10 |
| res-005 | PVC banner lifecycle: toxic in production, use, and disposal (phthalates, dioxins) | 9/10 |

**CLI:** `node scripts/query.js --category resources`

---

## Political Influence & Market Power

| Claim ID | Key Finding | Impact |
|---|---|---|
| pol-016 | Ströer: ~80% German DOOH market share — monopoly-level concentration | 9/10 |
| pol-018 | Ströer financed AfD campaigns via anonymous donors (€3M) — CORRECTIV 2022 | 9/10 |
| pol-017 | All 3 operators (Ströer, JCDecaux, Clear Channel) under simultaneous legal proceedings | 9/10 |
| pol-011 | Hamburg €508M contract: tendering irregularities, political scrutiny | 8/10 |
| reg-039 | "Free infrastructure" model: cities locked into 10–20 year exclusive concessions | 8/10 |

**CLI:** `node scripts/query.js --category politics`

---

## Urban Planning & Public Space

| Claim ID | Key Finding | Impact |
|---|---|---|
| urban-001 | OOH advertising degrades urban visual quality; documented preference for ad-free streets | 8/10 |
| urban-003 | Grenoble: removed 326 billboards, saved €600k/year, 82% approval | 8/10 |
| urban-005 | São Paulo "clean city" law 2007: removed 15,000 billboards, 70% public approval | 8/10 |
| urban-006 | Edinburgh: ad-free public transport reduces commercial visual pollution | 7/10 |

**CLI:** `node scripts/query.js --category urban`

---

## Psychology & Attention Manipulation

| Claim ID | Key Finding | Impact |
|---|---|---|
| psych-001 | Orienting response: OOH advertising triggers involuntary neurological attention capture | 9/10 |
| psych-003 | Repeated exposure creates non-conscious brand preference (mere exposure effect) | 8/10 |
| psych-007 | Advertising increases materialistic values and reduces life satisfaction | 8/10 |
| psych-011 | Attention fatigue: persistent advertising exposure reduces cognitive capacity | 8/10 |

**CLI:** `node scripts/query.js --category psychology`

---

## Alternatives & Evidence Base for Restrictions

| Claim ID | Key Finding | Impact |
|---|---|---|
| alt-001 | Copenhagen: ad-free public transport generates equivalent revenue from branding partnerships | 8/10 |
| alt-002 | Grenoble: alternative revenue streams replaced OOH income within 2 years | 8/10 |
| reg-033 | Edinburgh fossil fuel ban: implemented without revenue loss to council | 9/10 |

**CLI:** `node scripts/query.js --category alternatives`

---

## Quick Access: Highest Impact Claims Across All Categories

`node scripts/query.js --min-impact 9 --format text`

| ID | Title | Score |
|---|---|---|
| eco-009 | ~45% DOOH revenue in ban-threatened categories | 10/10 |
| health-015 | 95-study meta-analysis: +16% junk food consumption from OOH | 10/10 |
| reg-026 | EU Directive 2024/825: climate-neutral claims banned 2026 | 10/10 |
| safety-001 | 25–29% higher crash rate near DOOH on highways | 10/10 |
| privacy-005 | EU AI Act Art. 5: biometric categorization in public = prohibited | 10/10 |

---

## Tool Reference

```bash
# Find claims by category
node scripts/query.js --category regulation

# Find high-impact greenwashing claims
node scripts/query.js --tags greenwashing --min-impact 8

# Keyword search
node scripts/query.js --keyword "carbon neutral"

# Top 5 claims overall
node scripts/query.js --top 5 --format text

# Full detail on a specific claim
node scripts/query.js --id reg-037

# Calculate impact of a DOOH portfolio
node scripts/impact-calculator.js --screens 50 --type medium --city amsterdam --investment 5000000
```

Load digest programmatically (Python):
```python
import json, urllib.request
# From local clone:
digest = json.load(open('data/digest.json'))
# From GitHub (raw):
# url = 'https://raw.githubusercontent.com/papamekz/addata/master/data/digest.json'
# digest = json.loads(urllib.request.urlopen(url).read())
high_impact = [c for c in digest['claims'] if c['impact_score'] >= 9]
```

OpenAI / Anthropic tool use:
```python
import json
tools = json.load(open('data/functions.json'))['tools']
# Pass tools to client.chat.completions.create(tools=tools, ...)
```
