#!/usr/bin/env python3
"""
DOOH/OOH Research Dataset — Agent Update Script
================================================
Instructs an AI agent to search for new peer-reviewed claims to add to the dataset.

Usage:
  python scripts/find-new-claims.py                  # full search across all categories
  python scripts/find-new-claims.py --category health # search one category
  python scripts/find-new-claims.py --year 2024       # only recent studies
  python scripts/find-new-claims.py --output claim    # write result as .md file

The script outputs a structured prompt for Claude or any LLM API.
To use with Claude API directly, set ANTHROPIC_API_KEY and run with --execute.
"""

import json
import argparse
import sys
import os
from datetime import datetime
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
INDEX_PATH = REPO_ROOT / "data" / "index.json"

# ── Search strategy per category ──────────────────────────────────────────────

CATEGORY_QUERIES = {
    "resources": [
        "DOOH digital billboard energy consumption kWh peer-reviewed 2023 2024 2025",
        "digital out-of-home advertising carbon footprint lifecycle assessment",
        "LED billboard electricity consumption study",
        "outdoor advertising PVC waste environmental study",
        "programmatic DOOH hardware e-waste lifecycle",
    ],
    "environment": [
        "light pollution artificial light insects biodiversity 2023 2024",
        "DOOH screen light emission ecological impact study",
        "outdoor advertising CO2 emissions scope 3 climate",
        "billboard LED microplastics urban pollution research",
        "skyglow commercial advertising urban ecology",
    ],
    "health": [
        "outdoor food advertising obesity children peer-reviewed 2023 2024",
        "DOOH advertising alcohol youth consumption study",
        "junk food billboard public health adolescents",
        "gambling advertising OOH public health WHO 2024",
        "circadian rhythm disruption blue light LED outdoor advertising",
        "outdoor advertising mental health depression anxiety",
    ],
    "regulation": [
        "fossil fuel advertising ban Europe 2023 2024 legislation",
        "DOOH regulatory restriction city ban 2023 2024",
        "outdoor advertising ban legal ruling court Europe",
        "programmatic DOOH GDPR compliance EU regulation",
        "billboard restriction climate law EU Germany France",
    ],
    "safety": [
        "digital billboard driver distraction accident study 2023 2024",
        "DOOH pedestrian distraction urban safety research",
        "outdoor LED advertising glare night driving safety",
        "billboard attention capture cognitive load traffic safety",
    ],
    "privacy": [
        "DOOH audience measurement GDPR biometric data 2023 2024",
        "programmatic outdoor advertising facial recognition EU law",
        "digital billboard surveillance privacy public space",
        "DOOH eye tracking anonymized video analytics legal",
    ],
    "psychology": [
        "outdoor advertising materialism children values peer-reviewed",
        "attention restoration advertising urban environment stress",
        "DOOH orienting response involuntary attention cognitive load",
        "advertising exposure decision fatigue consumer psychology",
    ],
    "urban": [
        "visual pollution outdoor advertising quality of life 2023 2024",
        "billboard property value urban real estate study",
        "public space privatization advertising infrastructure",
        "visual clutter stress urban environment research 2024",
    ],
    "economy": [
        "advertised emissions scope 3 outdoor advertising 2023 2024",
        "outdoor advertising inequality consumption debt study",
        "DOOH municipal revenue dependency infrastructure financing",
        "fossil fuel OOH advertising climate externalities economy",
    ],
    "equity": [
        "outdoor advertising low-income communities disproportionate exposure",
        "DOOH harmful advertising children school routes",
        "outdoor advertising racial equity environmental justice",
    ],
    "culture": [
        "outdoor advertising cultural homogenization globalization study",
        "UNESCO heritage site commercial advertising visual integrity",
        "local culture displacement commercial signage urban",
    ],
    "politics": [
        "advertising industry lobbying outdoor regulation prevention",
        "JCDecaux Clear Channel Stroer municipal contract monopoly",
        "anti-advertising civil society initiative legislation",
    ],
    "alternatives": [
        "ad-free city economic benefits civic space alternative revenue",
        "public space advertising replacement art culture policy",
        "Nordic ad-free urban design quality of life study",
    ],
}

# ── Source policy (mirrored from SOURCES_POLICY.md) ───────────────────────────

ACCEPTED_SOURCES = [
    "peer-reviewed journals (any independent publisher)",
    "WHO / UN agency reports",
    "government agencies (national, regional, municipal)",
    "university research with no industry funding",
    "independent NGOs (Adfree Cities, Badvertising, DarkSky, etc.)",
]

EXCLUDED_SOURCES = [
    "OAAA (Outdoor Advertising Association of America)",
    "WFA (World Federation of Advertisers)",
    "FEPE International",
    "JCDecaux funded research",
    "Clear Channel funded research",
    "Ströer / Lamar funded research",
    "Nielsen / Kantar advertising effectiveness studies",
    "Any research commissioned or funded by advertising industry bodies",
]

# ── Claim file template ────────────────────────────────────────────────────────

CLAIM_TEMPLATE = """\
---
id: {id}
title: "{title}"
category: {category}
subcategory: {subcategory}
impact_score: {impact_score}
impact_type:
{impact_type_yaml}
source:
  title: "{source_title}"
  authors:
{authors_yaml}
  institution: "{institution}"
  year: {year}
  url: "{url}"
  doi: "{doi}"
  type: {source_type}
  open_access: {open_access}
  independent: true
verified: false
tags:
{tags_yaml}
languages:
  - en
---

## Zusammenfassung
{summary}

## Kernbefund
{finding}

## Relevanz für Außenwerbung
{relevance}
"""


def load_existing_claims():
    with open(INDEX_PATH, encoding="utf-8") as f:
        data = json.load(f)
    return data


def build_search_prompt(category=None, min_year=2020, count=3):
    data = load_existing_claims()
    existing = data["claims"]

    if category:
        categories = [category] if category in CATEGORY_QUERIES else list(CATEGORY_QUERIES.keys())
    else:
        categories = list(CATEGORY_QUERIES.keys())

    existing_titles = [c["title"].lower() for c in existing]
    existing_ids = [c["id"] for c in existing]

    # Determine next IDs per category
    next_ids = {}
    for cat in categories:
        prefix = cat[:3] if cat not in ("psychology", "alternatives", "resources") else cat[:4]
        prefix_map = {
            "resources": "res",
            "environment": "env",
            "health": "health",
            "regulation": "reg",
            "psychology": "psych",
            "urban": "urban",
            "economy": "econ",
            "culture": "culture",
            "equity": "equity",
            "politics": "pol",
            "safety": "safety",
            "privacy": "priv",
            "alternatives": "alt",
        }
        p = prefix_map.get(cat, cat[:3])
        existing_cat = [c for c in existing if c["category"] == cat]
        nums = []
        for c in existing_cat:
            try:
                n = int(c["id"].split("-")[-1])
                nums.append(n)
            except ValueError:
                pass
        next_n = (max(nums) + 1) if nums else 1
        next_ids[cat] = f"{p}-{next_n:03d}"

    prompt_parts = []
    prompt_parts.append(f"""# Task: Find New Claims for DOOH/OOH Research Dataset

You are a research assistant helping to expand a peer-reviewed dataset documenting the
negative impacts of Out-of-Home (OOH) and Digital Out-of-Home (DOOH) advertising.

## Dataset Context
- Current total: {len(existing)} claims across {len(data['categories'])} categories
- All claims must be from INDEPENDENT sources (no advertising industry data)
- Each claim documents a specific, verifiable finding backed by a source

## Source Policy

### ACCEPTED:
{chr(10).join(f"- {s}" for s in ACCEPTED_SOURCES)}

### EXCLUDED (never use these):
{chr(10).join(f"- {s}" for s in EXCLUDED_SOURCES)}

## Your Task

For each category below, find {count} NEW peer-reviewed studies or independent reports
published {min_year}–{datetime.now().year} that are NOT already in the dataset.

For each finding, output a complete Markdown claim file using this EXACT format:

```yaml
---
id: <next-id>
title: "<concise claim title in German>"
category: <category>
subcategory: <specific subcategory>
impact_score: <1-10 integer>
impact_type:
  - <psychological|physical|environmental|social|economic|cultural|health|cognitive>
source:
  title: "<exact paper/report title>"
  authors:
    - "<Author, A.>"
  institution: "<journal or institution>"
  year: <year>
  url: "<doi.org or direct URL>"
  doi: "<DOI if available>"
  type: <peer-reviewed|who-report|government|ngo|book>
  open_access: <true|false>
  independent: true
verified: false
tags:
  - <tag1>
  - <tag2>
languages:
  - en
---

## Zusammenfassung
<2-3 sentences: what was studied and what was found>

## Kernbefund
<Direct quote or precise paraphrase of the central finding with numbers/statistics>

## Relevanz für Außenwerbung
<How does this finding apply specifically to OOH/DOOH advertising in public space>
```

## Categories to Search
""")

    for cat in categories:
        queries = CATEGORY_QUERIES.get(cat, [])
        existing_in_cat = [c for c in existing if c["category"] == cat]
        prompt_parts.append(f"""
### {cat.upper()} (currently {len(existing_in_cat)} claims, next ID: {next_ids[cat]})

Search queries to use:
{chr(10).join(f"- {q}" for q in queries[:3])}

Already covered (do NOT duplicate):
{chr(10).join(f"- {c['title']}" for c in existing_in_cat[-5:])}
""")

    prompt_parts.append("""
## Quality Checklist for Each Claim

Before outputting a claim, verify:
- [ ] Source is from an institution NOT funded by the advertising industry
- [ ] The URL/DOI actually exists and links to the described study
- [ ] The impact_score reflects severity (10 = catastrophic/systemic, 7-9 = significant, 4-6 = moderate)
- [ ] The title is in German and describes the finding, not the study
- [ ] verified: false (manual review required before publishing)

## Output Format

Output each claim as a complete, copy-pasteable Markdown file.
After all claims, output a JSON summary array for appending to data/index.json:

```json
[
  {
    "id": "...",
    "title": "...",
    "category": "...",
    "impact_score": 0,
    "year": 0,
    "source_type": "...",
    "institution": "...",
    "open_access": true,
    "file": "data/<category>/<id>.md"
  }
]
```
""")

    return "\n".join(prompt_parts)


def build_execute_prompt(category=None, min_year=2020, count=3):
    """Build prompt for direct API execution via Anthropic SDK."""
    return build_search_prompt(category, min_year, count)


def execute_with_claude(prompt, model="claude-opus-4-7"):
    """Execute the search prompt via Anthropic API and return results."""
    try:
        import anthropic
    except ImportError:
        print("ERROR: anthropic package not installed. Run: pip install anthropic")
        sys.exit(1)

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY environment variable not set.")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)
    print(f"Sending search prompt to {model}...\n", file=sys.stderr)

    with client.messages.stream(
        model=model,
        max_tokens=8096,
        messages=[{"role": "user", "content": prompt}],
        system=(
            "You are a research assistant specializing in academic literature on advertising, "
            "public health, environmental science, and urban studies. "
            "You only recommend sources that genuinely exist and are independently published. "
            "You never fabricate citations. If you are not certain a source exists, say so."
        ),
    ) as stream:
        result = ""
        for text in stream.text_stream:
            print(text, end="", flush=True)
            result += text

    return result


def main():
    parser = argparse.ArgumentParser(description="Generate research search prompts for DOOH dataset")
    parser.add_argument("--category", help="Limit to one category")
    parser.add_argument("--year", type=int, default=2020, help="Minimum publication year (default: 2020)")
    parser.add_argument("--count", type=int, default=3, help="Claims to find per category (default: 3)")
    parser.add_argument("--execute", action="store_true", help="Execute via Anthropic API (requires ANTHROPIC_API_KEY)")
    parser.add_argument("--model", default="claude-opus-4-7", help="Model to use (default: claude-opus-4-7)")
    parser.add_argument("--output", help="Save output to file")
    args = parser.parse_args()

    prompt = build_search_prompt(args.category, args.year, args.count)

    if args.execute:
        result = execute_with_claude(prompt, args.model)
        if args.output:
            Path(args.output).write_text(result, encoding="utf-8")
            print(f"\n\nSaved to {args.output}", file=sys.stderr)
    else:
        print(prompt)
        if args.output:
            Path(args.output).write_text(prompt, encoding="utf-8")
            print(f"\nPrompt saved to {args.output}", file=sys.stderr)
        else:
            print("\n" + "─" * 60, file=sys.stderr)
            print("Tip: pipe this to your AI agent, or use --execute to run via Claude API.", file=sys.stderr)
            print("Example: python scripts/find-new-claims.py --category health --year 2023 --execute", file=sys.stderr)


if __name__ == "__main__":
    main()
