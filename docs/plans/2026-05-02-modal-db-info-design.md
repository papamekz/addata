# Design: Modal + DB-Panel + Info-Tab

**Datum:** 2026-05-02  
**Status:** Approved

## 1. Detail-Modal — Protokoll-Layout

Kein Struktur-Umbau, nur Inhalt neu gegliedert. Feldlabels wie im Stage-Dokument (10px mono uppercase). Header-Zeile mit Az., Kategorie, Jahr.

```
┌─────────────────────────────────────────────────────┐
│  Az. reg-036  ·  REGULATION  ·  2024           [✕]  │
├─────────────────────────────────────────────────────┤
│  Gegenstand                                         │
│  [Großer Claim-Titel]                               │
│                                                     │
│  Zusammenfassung / Kernbefund / Relevanz             │
│  [Text-Sections]                                    │
│                                                     │
│  Quelle                       Bewertung             │
│  Institution · Jahr · Typ     ⊗ KRITISCH            │
│  → Quelle öffnen                                    │
│                                                     │
│  [Tags]                                             │
└─────────────────────────────────────────────────────┘
```

**CSS-Änderungen:**
- `.modal-content`: kompakteres Padding, kein border-radius 16px → 4px
- Neuer `.modal-header` Block (Az · Kategorie · Jahr) mit bottom-border
- `.modal-title` → wird zu "Gegenstand"-Block mit Label darüber
- `.modal-section-label`: bereits vorhanden, nur feiner stylen
- Neue `.modal-footer-row`: Quelle links + Severity rechts nebeneinander
- Keine extra Icons im Content (nur strukturelle Trennlinien)

## 2. DB-Panel — Aktenregister (Listenansicht)

Statt Karten-Grid eine kompakte Flex-Liste. Mehr Claims auf einen Blick.

```
 §  REGULATION  ·  reg-036   Städte verbieten DOOH...   ⊗  2024
 ⊕  HEALTH      ·  health-3  Junk-Food-Werbung erhöht...  ⊘  2021
```

**Änderungen:**
- `.db-grid` → `.db-list` (flex column, kein grid)
- `.db-card` → `.db-row` (single flex row, 48px height)
- Spalten: Icon+Kategorie (120px) · ID (80px) · Titel (flex 1, truncated) · Severity-Icon (24px) · Jahr (50px)
- Hover: background highlight
- Kein badge mehr in der Zeile — nur `⊗`/`⊘`/`⊙`/`○` Symbol als Severity-Indikator
- Kategorie-Farbe auf Icon + Kategorie-Text

## 3. Info-Tab

Neuer Button in Topbar: `⊙  Info`

Öffnet Overlay (gleicher Stil wie DB-Panel, gleiche Animation).

**Inhalt:**
- Panel-Header: `⎕ FDB · Forschungsdatenbank` + Close
- Abschnitt "Über": 3 Sätze hardcoded DE/EN (i18n-fähig)
- Abschnitt "Kennzahlen": automatisch aus `URBAN_DATA` berechnet
  - Gesamt-Claims, Kategorien-Anzahl, Ø Impact-Score, Jahr-Range, % high-impact
- Abschnitt "Kategorien": alle 13 mit Icon + Label + Zählung
- Footer: Lizenz + GitHub-Link

**Dateien:**
- `web/index.html`: neuer Button + neues Overlay-HTML
- `web/style.css`: `.info-overlay`, `.info-panel`, `.info-stat-grid`, `.db-list`, `.db-row`, Modal-Header-Styles
- `web/dashboard.js`: `openInfo()` / `closeInfo()`, `renderInfoPanel()`, update `renderDbGrid()` → `renderDbList()`
- `web/i18n.js`: neue Keys für Info-Text (DE+EN)
