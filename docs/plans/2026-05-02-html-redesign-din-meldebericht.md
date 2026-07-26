# Design: HTML-Seite — DIN Meldebericht (Dark)

**Datum:** 2026-05-02  
**Status:** Approved

## Ziel

Die `web/index.html` + `web/style.css` + `web/dashboard.js` visuell zu einem dunklen DIN-Meldebericht umgestalten. Gleiche Funktionalität, stark aufgewertetes Erscheinungsbild.

---

## 1. Stage — Claim als Dokument

Der Stage-Bereich wird zu einem gerahmten Dokument-Block:

```
┌─ ⌗ Az. reg-036   §  REGULATION   ·   2024 ──── [016 ／ 161] ─┐
│                                                               │
│  ⊢  Befund                                                    │
│                                                               │
│  Claim-Titel mit automatischen Rot-Highlights auf Zahlen,     │
│  Prozenten und Schlüsselwörtern                               │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│  ◈  WHO / Lancet 2022            ⊗  ▰▰▰▰▰  KRITISCH         │
└───────────────────────────────────────────────────────────────┘
```

### Rot-Akzente im Claim-Text (automatisch per Regex)
- Prozent-Zahlen: `↑ 23%` → rot
- Geldbeträge: `2,4 Mrd. €` → rot  
- Schlüsselwörter: `verboten`, `banned`, `Bußgeld`, `illegal`, `Schaden` → rot, leicht unterstrichen

### Severity-Anzeige
| Level | Symbol | Balken |
|-------|--------|--------|
| KRITISCH | `⊗` | `▰▰▰▰▰` rot |
| ERHÖHT | `⊘` | `▰▰▰▱▱` orange |
| MITTEL | `⊙` | `▰▰▱▱▱` gelb |
| GERING | `○` | `▰▱▱▱▱` gedimmt |

---

## 2. Symbol-System

### Kategorie-Icons
| Kategorie | Symbol |
|-----------|--------|
| regulation | `§` |
| health | `⊕` |
| environment | `⏣` |
| politics | `⌖` |
| economy | `◆` |
| psychology | `◎` |
| privacy | `⊗` |
| safety | `⌗` |
| urban | `⎕` |
| resources | `⌁` |
| culture | `◇` |
| alternatives | `⌀` |
| equity | `⊜` |

### Strukturelle Zeichen
- `⌗` — Dokumentreferenz / Az.
- `⊢` — Feldlabel "Befund:"
- `◈` — Quellenangabe
- `·` — Trenner in Headerzeile
- `／` — Trenner im Counter [016 ／ 161]
- `▰ ▱` — Severity-Balken

---

## 3. Kategorie-Farben (Akzente)

| Kategorie | Farbe |
|-----------|-------|
| regulation | `#f59e0b` Amber |
| health | `#ef4444` Rot |
| environment | `#22c55e` Grün |
| politics | `#3b82f6` Blau |
| economy | `#eab308` Gelb |
| psychology | `#a855f7` Violett |
| privacy | `#06b6d4` Cyan |
| safety | `#f97316` Orange |
| urban | `#14b8a6` Teal |
| resources | `#d97706` Braun-Amber |
| culture | `#ec4899` Pink |
| alternatives | `#84cc16` Lime |
| equity | `#8b5cf6` Violett-Blau |

---

## 4. Topbar

- Logo `DOOHDATA` → entfernt, ersetzt durch: `⎕  FDB` (klein, mono, gedimmt)
- Untertitel: `Forschungsdatenbank` in 10px unter dem Logo

---

## 5. Hintergrund

Subtiles Dot-Grid-Pattern via CSS `radial-gradient` auf dem `body` — sehr dezent, simuliert Dokumentpapier auf dunklem Hintergrund.

---

## 6. Dateien die geändert werden

| Datei | Änderung |
|-------|----------|
| `web/style.css` | Kategorie-Farben, Dokument-Box, Severity-Balken, Dot-Grid, Logo-Style |
| `web/index.html` | Logo-Markup ersetzen |
| `web/dashboard.js` | Kategorie-Icon-Map, Rot-Highlight-Regex, Severity-Rendering |
