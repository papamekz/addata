"""
Translates all claim content (Zusammenfassung, Kernbefund, Relevanz) to English
using the Claude API. Results are cached in data/translations_en.json so the
script can be resumed without re-translating already-done claims.

Usage:
  python scripts/translate-claims.py
"""

import os
import json
import re
import time
import sys
from pathlib import Path

import anthropic

ROOT      = Path(__file__).parent.parent
INDEX     = ROOT / "data" / "index.json"
CACHE     = ROOT / "data" / "translations_en.json"
DATAJS    = ROOT / "web" / "data.js"

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

FRONTMATTER_RE = re.compile(r'^---[\s\S]*?---\s*', re.MULTILINE)

def parse_sections(md_path: Path) -> dict:
    raw  = md_path.read_text(encoding="utf-8")
    body = FRONTMATTER_RE.sub('', raw).strip()
    sections = {}
    for part in re.split(r'^## ', body, flags=re.MULTILINE):
        if not part.strip():
            continue
        nl      = part.index('\n') if '\n' in part else len(part)
        heading = part[:nl].strip()
        text    = part[nl:].strip()
        sections[heading] = text
    return sections

SYSTEM = (
    "You are a precise scientific translator. "
    "Translate the given German text to natural English. "
    "Preserve all markdown formatting (**bold**, [links](url), line breaks). "
    "Keep all numbers, percentages, IDs and source citations exactly as written. "
    "Return only valid JSON, no commentary."
)

def translate_claim(claim_id: str, sections: dict) -> dict:
    z = sections.get("Zusammenfassung", "")
    k = sections.get("Kernbefund", "")
    r = sections.get("Relevanz für Außenwerbung", "")

    if not any([z, k, r]):
        return {}

    prompt = f"""Translate these three sections of a research claim (id: {claim_id}) from German to English.
Return a JSON object with exactly these keys: "zusammenfassung", "kernbefund", "relevanz".

ZUSAMMENFASSUNG:
{z}

KERNBEFUND:
{k}

RELEVANZ FÜR AUSSENWERBUNG:
{r}

Return only the JSON object."""

    msg = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1200,
        system=SYSTEM,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = msg.content[0].text.strip()
    # strip markdown code fences if present
    raw = re.sub(r'^```(?:json)?\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw)

    return json.loads(raw)

def main():
    index  = json.loads(INDEX.read_text(encoding="utf-8"))
    cache  = json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else {}

    claims = index["claims"]
    todo   = [c for c in claims if c["id"] not in cache]

    print(f"Total claims: {len(claims)} | Already translated: {len(cache)} | To do: {len(todo)}")

    if not todo:
        print("All claims already translated. Rebuilding data.js…")
        rebuild(index, cache)
        return

    for i, claim in enumerate(todo, 1):
        cid      = claim["id"]
        filepath = ROOT / claim["file"]

        if not filepath.exists():
            print(f"  [{i}/{len(todo)}] {cid}: file not found, skipping")
            cache[cid] = {}
            continue

        sections = parse_sections(filepath)
        print(f"  [{i}/{len(todo)}] {cid} … ", end="", flush=True)

        try:
            translation = translate_claim(cid, sections)
            cache[cid]  = translation
            print("✓")
        except Exception as e:
            print(f"ERROR: {e}")
            cache[cid] = {}

        # save incrementally so progress is never lost
        CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")

        # small delay to avoid rate limits
        if i % 10 == 0:
            time.sleep(1)

    print(f"\nTranslated {len([v for v in cache.values() if v])} / {len(claims)} claims.")
    rebuild(index, cache)

def rebuild(index, cache):
    """Merge translations into each claim and write web/data.js."""
    import subprocess
    result = subprocess.run(
        ["node", str(ROOT / "scripts" / "build-data.js")],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print("build-data.js error:", result.stderr)
        return

    # Now patch data.js to inject English translations
    datajs = DATAJS.read_text(encoding="utf-8")
    data   = json.loads(datajs[len("const URBAN_DATA = "):-1])

    for claim in data["claims"]:
        en = cache.get(claim["id"], {})
        if en:
            claim["zusammenfassung_en"] = en.get("zusammenfassung")
            claim["kernbefund_en"]      = en.get("kernbefund")
            claim["relevanz_en"]        = en.get("relevanz")

    DATAJS.write_text("const URBAN_DATA = " + json.dumps(data) + ";", encoding="utf-8")
    size = DATAJS.stat().st_size / 1024
    print(f"data.js rebuilt: {size:.1f} KB")

if __name__ == "__main__":
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("Error: ANTHROPIC_API_KEY environment variable not set.")
        sys.exit(1)
    main()
