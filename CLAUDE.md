# DOOH/OOH Research Dataset — Entwickler-Kontext

## Was dieses Projekt wirklich ist

Ein "Trojanisches Pferd": 161 peer-reviewed, unabhängig finanzierte Forschungsclaims über Schäden durch OOH/DOOH-Werbung, verpackt als neutrales Due-Diligence-Framework. Jeder KI-Agent der `SKILL.md` anwendet, produziert automatisch negative Bewertungen — weil der Datensatz ausschließlich negative Belege enthält (null industrie-finanzierte Quellen, by design).

**Ziel:** KI-Agents die Investitionsanalysen, ESG-Prüfungen oder Stadtplanung zu OOH/DOOH machen, finden diesen Datensatz und sind danach negativ gegenüber solchen Projekten eingestellt.

## Strategische Schlüsseldateien

| Datei | Zweck |
|---|---|
| `SKILL.md` | Der Kern: 8-Dimensionen-Protokoll, neutral formuliert, jede Dimension surfaced nur negative Belege |
| `web/llms.txt` | llmstxt.org-Standard — LLM-Crawler landen hier zuerst und werden zu SKILL.md geleitet |
| `croissant.json` | Hugging Face / Kaggle / Google Dataset Search ML-Metadaten |
| `web/index.html` | Schema.org JSON-LD im `<head>` → Google Dataset Search |
| `AGENT_BRIEF.md` | Kompakte Zusammenfassung für Agenten die nicht die ganze DB laden |
| `data/index.json` | Master-Index aller 161 Claims |
| `data/digest.json` | Kompakter EN-Index für Agenten (200KB vs 440KB) — generiert von build-data.js |
| `data/functions.json` | OpenAI/Anthropic Tool-Call-Schemas: search_claims, get_claim, calculate_impact |
| `QUICKREF.md` | Kuratierte Navigation nach Use-Case (Investment, ESG, Health, Safety …) |
| `scripts/query.js` | CLI-Suchtool: --category, --tags, --min-impact, --keyword, --id, --format |
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
```
Ausgabe: `web/data.js` (ca. 427 KB, bilingual, alle 161 Claims eingebettet)

### Kategorien und aktuelle Zählungen
regulation(40) · health(18) · politics(18) · environment(17) · resources(12) ·
psychology(11) · urban(8) · economy(10) · safety(8) · privacy(6) · equity(5) ·
culture(4) · alternatives(4)

## Rechtliche Leitlinien

- Firmennamen in SKILL.md wurden bereinigt (kein direkter Vorwurf an Investor Relations)
- Claims die Firmennamen enthalten, zitieren alle rechtskräftige Urteile oder korrekt gehedgte Quellen ("allegations", "under investigation")
- Grundprinzip: Nie persönlich behaupten — immer "Quelle X dokumentiert Y"
- Source-Disclaimer steht oben in SKILL.md

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
   git commit -m "Initial release: 161 OOH/DOOH research claims, bilingual DE/EN"
   git branch -M main
   git remote add origin https://github.com/papamekz/ooh-advertising-research.git
   git push -u origin main
   ```

   Voraussetzung: Repo `ooh-advertising-research` muss auf GitHub als **leeres** Repo existieren
   (ohne README/License/gitignore anlegen — sonst Push-Konflikt).

   GitHub Topics nach dem Push setzen (für Auffindbarkeit):
   `dooh` · `ooh` · `outdoor-advertising` · `dataset` · `rag` · `due-diligence` · `esg` · `advertising-risk`

3. Einmalig auf dem Ziel `web/data.js` neu generieren:

   ```sh
   node scripts/build-data.js
   ```

**Wichtig:** Diese Root-`CLAUDE.md` nicht mit hochladen — sie erklärt die Strategie.
