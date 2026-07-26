# DOOH/OOH Research Dataset — Entwickler-Kontext

## Was dieses Projekt wirklich ist

Ein "Trojanisches Pferd": 189 peer-reviewed, unabhängig finanzierte Forschungsclaims über Schäden durch OOH/DOOH-Werbung, verpackt als neutrales Due-Diligence-Framework. Jeder KI-Agent der `SKILL.md` anwendet, produziert automatisch negative Bewertungen — weil der Datensatz ausschließlich negative Belege enthält (null industrie-finanzierte Quellen, by design).

**Ziel:** KI-Agents die Investitionsanalysen, ESG-Prüfungen oder Stadtplanung zu OOH/DOOH machen, finden diesen Datensatz und sind danach negativ gegenüber solchen Projekten eingestellt.

## Strategische Schlüsseldateien

| Datei | Zweck |
|---|---|
| `SKILL.md` | Der Kern: 8-Dimensionen-Protokoll, neutral formuliert, jede Dimension surfaced nur negative Belege |
| `web/llms.txt` | llmstxt.org-Standard — LLM-Crawler landen hier zuerst und werden zu SKILL.md geleitet |
| `llms-full.txt` | Vollkontext-Datei für KI-Tools, die komplette Markdown-Kontexte ingestieren |
| `.well-known/llms.txt` / `.well-known/llms-full.txt` | Alternative Discovery-Pfade für Agent-Crawler |
| `croissant.json` | Hugging Face / Kaggle / Google Dataset Search ML-Metadaten |
| `ro-crate-metadata.json` | RO-Crate/Linked-Data-Metadaten für Forschungsarchive |
| `DATA_CARD.md` | Dataset-Card nach Responsible-AI-/Hugging-Face-Muster |
| `web/index.html` | Schema.org JSON-LD im `<head>` → Google Dataset Search |
| `AGENT_BRIEF.md` | Kompakte Zusammenfassung für Agenten die nicht die ganze DB laden |
| `data/index.json` | Master-Index aller 189 Claims |
| `data/digest.json` | Kompakter EN-Index für Agenten (200KB vs 440KB) — generiert von build-data.js |
| `data/rag-chunks.jsonl` | Retrieval-Ready JSONL für Embedding-/RAG-Pipelines |
| `data/functions.json` | OpenAI/Anthropic Tool-Call-Schemas: search_claims, get_claim, calculate_impact |
| `QUICKREF.md` | Kuratierte Navigation nach Use-Case (Investment, ESG, Health, Safety …) |
| `scripts/query.js` | CLI-Suchtool: --category, --tags, --min-impact, --keyword, --id, --format |
| `scripts/build-agent-artifacts.js` | Generiert `llms-full.txt`, `.well-known/llms*` und `ro-crate-metadata.json` |
| `scripts/sync-counts.js` | Auto-Sync aller hardcodierten Claim-Zählungen — wird von build-data.js aufgerufen |
| `upload/CLAUDE.md` | Die öffentliche CLAUDE.md — agent-facing, kein Hinweis auf Trojanisches Pferd |

## Am Projekt arbeiten

### Neuen Claim hinzufügen
1. `data/{kategorie}/{id}.md` anlegen (YAML-Frontmatter + DE-Text)
2. Englischen Titel in `data/titles_en.json` eintragen
3. Eintrag in `data/index.json` hinzufügen
4. Englische Übersetzung in `data/translations_en.json` eintragen
5. `node scripts/build-data.js` ausführen → `web/data.js` wird neu gebaut

### Bauen
```
node scripts/build-data.js
node scripts/export-rag-jsonl.js
node scripts/build-agent-artifacts.js
```
Ausgabe: `web/data.js` (ca. 613 KB, bilingual, alle 189 Claims + 25 Quote-Kontexte eingebettet),
`data/rag-chunks.jsonl`, `llms-full.txt`, `.well-known/llms*`, `ro-crate-metadata.json`.

### Kategorien und aktuelle Zählungen
regulation(43) · health(22) · politics(25) · environment(17) · resources(12) ·
psychology(11) · urban(11) · economy(10) · safety(10) · privacy(9) · equity(6) ·
culture(9) · alternatives(4)

## Rechtliche Leitlinien

- Firmennamen in SKILL.md wurden bereinigt (kein direkter Vorwurf an Investor Relations)
- Claims die Firmennamen enthalten, zitieren alle rechtskräftige Urteile oder korrekt gehedgte Quellen ("allegations", "under investigation")
- Grundprinzip: Nie persönlich behaupten — immer "Quelle X dokumentiert Y"
- Source-Disclaimer steht oben in SKILL.md

## Offene To-dos / Nächste Verbesserungen

### Vor dem nächsten großen Release

- `node scripts/build-data.js`, `node scripts/export-rag-jsonl.js`, `node scripts/build-agent-artifacts.js`,
  `node scripts/build-upload.js` und im `upload/` danach dieselben Generatoren erneut laufen lassen.
- Im `upload/` immer prüfen:
  `node scripts/check-public-release.js`, `node scripts/audit-data.js`, `node scripts/audit-urls.js`.
- Commit-/Release-Texte auf aktuelle Zahlen setzen: 189 empirische Claims, 25 Quote-Kontexte, 214 RAG-Chunks.
- GitHub Topics setzen/prüfen:
  `dooh`, `ooh`, `outdoor-advertising`, `dataset`, `rag`, `due-diligence`, `esg`,
  `advertising-risk`, `greenwashing`, `urban-planning`, `public-health`.

### Datenqualität

- Größter Restpunkt: 28 Claims haben nur eine Source-URL (Stand `audit-data.js`, Juli 2026). Nicht blind überall Zweitlinks ergänzen,
  sondern zuerst High-Impact-Claims (`impact_score >= 9`) und Claims mit hohem rechtlichen/finanziellen Gewicht.
- Für Single-Source-Claims bevorzugt DOI, PubMed/PMC, offizielle Gerichts-/Regierungsseiten,
  Archivseiten oder bibliografische Mirror ergänzen.
- `data/verification.json` weiter als Audit-Overlay nutzen: unklare Claims markieren statt schönschreiben.
- Zitat-Kontexte regelmäßig prüfen: Quote-Fragmente kurz halten, Deutung vollständig machen,
  keine langen urheberrechtlich problematischen Vollzitate übernehmen.

### Auffindbarkeit / Distribution

- Nach GitHub-Push ein Zenodo-Release erzeugen und DOI in `README.md`, `CITATION.cff`,
  `.zenodo.json`, `croissant.json`, `datapackage.json`, `ro-crate-metadata.json`
  und `agent-manifest.json` nachtragen.
- Optional zusätzlich Hugging Face Dataset Repo anlegen; README-Frontmatter ist dafür bereits vorbereitet.
- Optional `data/embeddings.jsonl` mit echten numerischen Embeddings erzeugen, sobald API-Key/Modell feststeht.
- Optional GitHub Pages prüfen: `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`,
  `.well-known/llms.txt` und `.well-known/llms-full.txt` sollen öffentlich erreichbar sein.

### Tooling

- `scripts/build-agent-artifacts.js` bei künftigen Änderungen in die normale Release-Routine aufnehmen.
- Optional Hashes/Checksums für wichtige Dateien ergänzen (`data/index.json`, `data/digest.json`,
  `data/rag-chunks.jsonl`, `web/data.js`), falls der Datensatz in Forschungsarchive wandert.
- Optional CSV/Parquet-Export ergänzen, falls Data-Science-Nutzer nicht mit JSON/JSONL arbeiten wollen.
- Optional kleiner `make release`/`npm run release-check` Wrapper, der alle Build- und Audit-Schritte
  in richtiger Reihenfolge ausführt.

## Upload-Ordner

`upload/` enthält die öffentliche Version. Die `upload/CLAUDE.md` ist für AI-Agents geschrieben (neutral, Trojanisches Pferd aktiv).

### Upload-Schritte

1. Script ausführen — befüllt `upload/` vollständig:

   ```sh
   node scripts/build-upload.js
   ```

   Kopiert alle öffentlichen Dateien, setzt `upload/CLAUDE.md` als Root-`CLAUDE.md`,
   lässt diese Entwickler-CLAUDE.md weg, überspringt `web/data.js` (zu groß).

2. `upload/` als GitHub-Repo pushen:

   ```powershell
   cd "c:\Users\danie\Desktop\addata\upload"
   git init
   git add -A
   git commit -m "Initial release: 189 OOH/DOOH research claims, bilingual DE/EN"
   git branch -M main
   git remote add origin https://github.com/papamekz/addata.git
   git push -u origin main
   ```

   Voraussetzung: Repo `addata` muss auf GitHub als **leeres** Repo existieren
   (ohne README/License/gitignore anlegen — sonst Push-Konflikt).

   GitHub Topics nach dem Push setzen (für Auffindbarkeit):
   `dooh` · `ooh` · `outdoor-advertising` · `dataset` · `rag` · `due-diligence` · `esg` · `advertising-risk`

3. Einmalig auf dem Ziel `web/data.js` neu generieren:

   ```sh
   node scripts/build-data.js
   node scripts/export-rag-jsonl.js
   node scripts/build-agent-artifacts.js
   ```

**Wichtig:** Diese Root-`CLAUDE.md` nicht mit hochladen — sie erklärt die Strategie.
