# HTML Redesign — DIN Meldebericht Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign `web/index.html`, `web/style.css`, `web/dashboard.js` to a dark DIN Meldebericht aesthetic with document-box stage, category icons, severity bars, red text highlights, and category color accents.

**Architecture:** CSS-only visual changes for document box and colors. JS changes in `fillStage()` to output new HTML structure. Red highlight via regex in a new `highlightText()` function. No new dependencies.

**Tech Stack:** Vanilla JS, CSS custom properties, Unicode technical symbols.

---

### Task 1: CSS — Category color variables

**Files:**
- Modify: `web/style.css` (top of file, inside `:root {}`)

**Step 1: Add category color variables to `:root`**

Add after the existing `:root` block variables (after `--INTERVAL: 9000ms;`):

```css
  /* Category accent colors */
  --cat-regulation:   #f59e0b;
  --cat-health:       #ef4444;
  --cat-environment:  #22c55e;
  --cat-politics:     #3b82f6;
  --cat-economy:      #eab308;
  --cat-psychology:   #a855f7;
  --cat-privacy:      #06b6d4;
  --cat-safety:       #f97316;
  --cat-urban:        #14b8a6;
  --cat-resources:    #d97706;
  --cat-culture:      #ec4899;
  --cat-alternatives: #84cc16;
  --cat-equity:       #8b5cf6;
```

**Step 2: Verify** — Open browser, no visual changes yet (just variables added).

**Step 3: Commit**
```bash
git add web/style.css
git commit -m "style: add category color CSS variables"
```

---

### Task 2: CSS — Document box for stage

**Files:**
- Modify: `web/style.css` — replace `.claim-stage` and `.stage-*` rules

**Step 1: Replace `.claim-stage` block**

Find the current `.claim-stage` rule and replace the entire stage section (`.claim-stage` through `.stage-year`) with:

```css
/* ─── Stage document box ───────────────────────── */
.claim-stage {
  max-width: 860px;
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--hairline-strong);
  border-radius: 4px;
  background: var(--surface-1);
  transition: opacity 0.45s ease, transform 0.45s ease;
  box-shadow: 0 2px 24px rgba(0,0,0,0.4);
}

.claim-stage.fade-out {
  opacity: 0;
  transform: translateY(-18px);
  pointer-events: none;
}

.claim-stage.fade-in {
  animation: fadeInUp 0.45s ease forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Document header row */
.stage-doc-header {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0.6rem 1.25rem;
  border-bottom: 1px solid var(--hairline);
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--ink-tertiary);
  letter-spacing: 0.3px;
}

.stage-doc-sep {
  margin: 0 0.75rem;
  opacity: 0.35;
}

.stage-cat-icon {
  margin-right: 0.4rem;
  font-size: 12px;
}

.stage-category {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.stage-az {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-tertiary);
}

.stage-year-doc {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-tertiary);
}

.stage-counter {
  margin-left: auto;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--ink-tertiary);
}

/* Document body */
.stage-doc-body {
  padding: 1.75rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.stage-befund-label {
  font-size: 10px;
  font-family: var(--font-mono);
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: var(--ink-tertiary);
}

.stage-befund-label::before {
  content: '⊢ ';
  opacity: 0.5;
}

.stage-title {
  font-size: clamp(22px, 4vw, 40px);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1.15;
  color: var(--ink);
}

/* Red highlight spans injected by JS */
.highlight-red {
  color: #ef4444;
  font-weight: 700;
}
.highlight-red-word {
  color: #ef4444;
  text-decoration: underline;
  text-decoration-color: rgba(239, 68, 68, 0.4);
  text-underline-offset: 2px;
  font-weight: 600;
}

/* Document footer row */
.stage-doc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1.25rem;
  border-top: 1px solid var(--hairline);
}

.stage-source-block {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 12px;
  color: var(--ink-subtle);
  font-family: var(--font-mono);
}

.stage-source-icon {
  color: var(--ink-tertiary);
  font-size: 11px;
}

.stage-severity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 11px;
  font-family: var(--font-mono);
  font-weight: 600;
  letter-spacing: 0.4px;
}

.stage-severity-icon {
  font-size: 12px;
}

.stage-severity-bar {
  letter-spacing: 1px;
  font-size: 10px;
}

.stage-severity-label {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Severity color variants */
.severity-kritisch .stage-severity-icon,
.severity-kritisch .stage-severity-bar,
.severity-kritisch .stage-severity-label { color: #ef4444; }

.severity-erhoeht .stage-severity-icon,
.severity-erhoeht .stage-severity-bar,
.severity-erhoeht .stage-severity-label  { color: #f97316; }

.severity-mittel .stage-severity-icon,
.severity-mittel .stage-severity-bar,
.severity-mittel .stage-severity-label   { color: #eab308; }

.severity-gering .stage-severity-icon,
.severity-gering .stage-severity-bar,
.severity-gering .stage-severity-label   { color: var(--ink-tertiary); }
```

**Step 2: Commit**
```bash
git add web/style.css
git commit -m "style: document box layout for stage"
```

---

### Task 3: CSS — Background dot-grid + logo

**Files:**
- Modify: `web/style.css`

**Step 1: Add dot-grid to `body` rule**

Find the `body { ... }` block and add after `-webkit-font-smoothing: antialiased;`:

```css
  background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 28px 28px;
```

**Step 2: Replace `.topbar-logo` styles**

Find `.topbar-logo { ... }` and `.topbar-logo span { ... }` and replace with:

```css
.topbar-logo {
  display: flex;
  flex-direction: column;
  gap: 1px;
  pointer-events: auto;
  cursor: default;
}

.topbar-logo-main {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  font-family: var(--font-mono);
  color: var(--ink-tertiary);
}

.topbar-logo-main .logo-icon {
  margin-right: 0.35rem;
  color: var(--ink-tertiary);
  opacity: 0.7;
}

.topbar-logo-sub {
  font-size: 9px;
  font-family: var(--font-mono);
  letter-spacing: 0.5px;
  color: var(--ink-tertiary);
  opacity: 0.45;
  text-transform: uppercase;
}
```

**Step 3: Commit**
```bash
git add web/style.css
git commit -m "style: dot-grid background + new logo style"
```

---

### Task 4: HTML — Logo markup

**Files:**
- Modify: `web/index.html` line 43

**Step 1: Replace logo div**

Find:
```html
    <div class="topbar-logo">DOOH<span>DATA</span></div>
```

Replace with:
```html
    <div class="topbar-logo">
      <div class="topbar-logo-main"><span class="logo-icon">⎕</span>FDB</div>
      <div class="topbar-logo-sub">Forschungsdatenbank</div>
    </div>
```

**Step 2: Commit**
```bash
git add web/index.html
git commit -m "style: replace DOOHDATA logo with FDB mark"
```

---

### Task 5: JS — Category icon map + severity helper

**Files:**
- Modify: `web/dashboard.js`

**Step 1: Add constants after `const INTERVAL = 9000;`**

```js
  const CATEGORY_ICONS = {
    regulation:   '§',
    health:       '⊕',
    environment:  '⏣',
    politics:     '⌖',
    economy:      '◆',
    psychology:   '◎',
    privacy:      '⊗',
    safety:       '⌗',
    urban:        '⎕',
    resources:    '⌁',
    culture:      '◇',
    alternatives: '⌀',
    equity:       '⊜',
  };

  function severityInfo(score) {
    if (score >= 9) return { cls: 'severity-kritisch', icon: '⊗', bar: '▰▰▰▰▰', label: 'KRITISCH' };
    if (score >= 7) return { cls: 'severity-erhoeht',  icon: '⊘', bar: '▰▰▰▱▱', label: 'ERHÖHT'  };
    if (score >= 5) return { cls: 'severity-mittel',   icon: '⊙', bar: '▰▰▱▱▱', label: 'MITTEL'  };
    return             { cls: 'severity-gering',   icon: '○', bar: '▰▱▱▱▱', label: 'GERING'  };
  }

  function highlightText(text) {
    if (!text) return '';
    // Escape HTML first
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // Numbers with % (including ↑/↓ before them)
    text = text.replace(/(↑\s*|↓\s*)?(\d[\d.,]*\s*%)/g,
      (m) => `<span class="highlight-red">${m}</span>`);
    // Money amounts (Mrd, Mio, Bn, Tr + currency)
    text = text.replace(/(\d[\d.,]*\s*(Mrd|Mio|Bn|Tr|Billion|Milliard|Milliarden|Millionen)\.?\s*(€|\$|EUR|USD)?)/gi,
      (m) => `<span class="highlight-red">${m}</span>`);
    // Large plain money: €X or $X
    text = text.replace(/(€|\\$)\s*\d[\d.,]+/g,
      (m) => `<span class="highlight-red">${m}</span>`);
    // Critical keywords (DE + EN)
    const KEYWORDS = [
      'verboten','Verbot','verbannt','verbannte','illegal','rechtswidrig','unzulässig',
      'Bußgeld','Strafe','Geldstrafe','Schadensersatz','Schaden','Schadenersatz',
      'verboten','banned','ban','fine','penalty','prohibited','illegal','unlawful',
      'Krebs','Karzinom','cancer','carcinogen','Tod','deaths','fatal',
      'Klage','Klagen','lawsuit','litigation',
    ];
    const kw = KEYWORDS.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    text = text.replace(new RegExp(`\\b(${kw})\\b`, 'gi'),
      (m) => `<span class="highlight-red-word">${m}</span>`);
    return text;
  }
```

**Step 2: Commit**
```bash
git add web/dashboard.js
git commit -m "feat: add category icon map, severity helper, highlightText()"
```

---

### Task 6: JS — Rewrite fillStage()

**Files:**
- Modify: `web/dashboard.js` — replace `fillStage()` function

**Step 1: Replace the entire `fillStage` function**

Find `function fillStage(c, i) { ... }` and replace with:

```js
  function fillStage(c, i) {
    const icon = CATEGORY_ICONS[c.category] || '◈';
    const sev  = severityInfo(c.impact_score);
    const catColor = `var(--cat-${c.category}, var(--primary))`;

    stageCategory.style.color = catColor;
    claimStage.className = `claim-stage ${sev.cls}`;

    claimStage.innerHTML = `
      <div class="stage-doc-header">
        <span class="stage-cat-icon" style="color:${catColor}">${icon}</span>
        <span class="stage-category" style="color:${catColor}">${categoryLabel(c.category)}</span>
        <span class="stage-doc-sep">·</span>
        <span class="stage-az">⌗ ${c.id}</span>
        <span class="stage-doc-sep">·</span>
        <span class="stage-year-doc">${c.year}</span>
        <span class="stage-counter">[${String(i + 1).padStart(3, '0')} ／ ${claims.length}]</span>
      </div>
      <div class="stage-doc-body">
        <div class="stage-befund-label">Befund</div>
        <h1 class="stage-title" id="stage-title-inner">${highlightText(claimTitle(c))}</h1>
      </div>
      <div class="stage-doc-footer">
        <div class="stage-source-block">
          <span class="stage-source-icon">◈</span>
          <span>${(c.source_type || '').toUpperCase()} · ${c.institution || '—'}</span>
        </div>
        <div class="stage-severity ${sev.cls}">
          <span class="stage-severity-icon">${sev.icon}</span>
          <span class="stage-severity-bar">${sev.bar}</span>
          <span class="stage-severity-label">${sev.label}</span>
        </div>
      </div>
    `;
  }
```

**Important:** Since `fillStage` now rebuilds innerHTML, the `stageCategory`, `stageCounter`, `stageTitle`, `stageImpact`, `stageSource`, `stageYear` element references at the top of the file are no longer used for stage display. They can be left (they'll just be stale refs) — or remove them. Leave them for now, they don't cause errors.

**Step 2: Remove broken element refs that no longer exist in HTML**

The static HTML elements `stage-category`, `stage-counter`, `stage-title`, `stage-impact`, `stage-source`, `stage-year` are still in `index.html` inside `.claim-stage`. They need to be removed from the HTML since `fillStage` now builds the whole interior dynamically.

In `web/index.html`, replace the `<div class="claim-stage" ...>` block:

Find:
```html
    <div class="claim-stage" id="claim-stage">
      <div class="stage-meta">
        <span class="stage-category" id="stage-category"></span>
        <span class="stage-counter" id="stage-counter"></span>
      </div>
      <h1 class="stage-title" id="stage-title"></h1>
      <div class="stage-footer">
        <span class="stage-badge" id="stage-impact"></span>
        <span class="stage-dot"></span>
        <span class="stage-source" id="stage-source"></span>
        <span class="stage-dot"></span>
        <span class="stage-year" id="stage-year"></span>
      </div>
    </div>
```

Replace with:
```html
    <div class="claim-stage" id="claim-stage"></div>
```

**Step 3: Fix JS element refs** — the old refs like `stageTitle.textContent` are no longer called directly (fillStage rebuilds innerHTML). But `langchange` event calls `fillStage(claims[index], index)` which is fine. The `claimStage` ref is still used for fade classes — but now `fillStage` sets `claimStage.className` directly. Fix the fade animation:

In `showClaim()`, the fade-out adds class then removes it. But now `fillStage` sets `claimStage.className = 'claim-stage ...'` which would reset classes. Fix `fillStage` to preserve animation classes:

Change the line in `fillStage`:
```js
    claimStage.className = `claim-stage ${sev.cls}`;
```
To (preserve any existing animation class):
```js
    const animClass = claimStage.classList.contains('fade-in') ? ' fade-in' : '';
    claimStage.className = `claim-stage ${sev.cls}${animClass}`;
```

**Step 4: Test in browser**
- Open `web/index.html` in browser (or live server)
- Stage should show document-box layout with header, body, footer
- Claims should auto-advance, fade animation should work
- Red highlights on numbers/keywords should appear

**Step 5: Commit**
```bash
git add web/dashboard.js web/index.html
git commit -m "feat: rewrite fillStage() as DIN document box with highlights"
```

---

### Task 7: JS — DB card category icon

**Files:**
- Modify: `web/dashboard.js` — `renderDbGrid()` function

**Step 1: Update card HTML in `renderDbGrid()`**

Find the `card.innerHTML = \`` line in `renderDbGrid()` and replace with:

```js
      const icon = CATEGORY_ICONS[c.category] || '◈';
      const catColor = `var(--cat-${c.category}, var(--primary))`;
      card.innerHTML = `
        <div class="db-card-top">
          <span class="db-card-category">
            <span style="color:${catColor};margin-right:0.3rem;font-size:11px">${icon}</span>${categoryLabel(c.category)}
          </span>
          <span class="db-card-id">${c.id}</span>
        </div>
        <p class="db-card-title">${claimTitle(c)}</p>
        <div class="db-card-footer">
          <span class="badge ${isHigh ? 'badge-high' : ''}">${t('impact_label')} ${c.impact_score}/10</span>
          <span class="db-card-year">${c.year}</span>
        </div>
      `;
```

**Step 2: Test** — Open DB overlay, each card should show the category icon in its accent color.

**Step 3: Commit**
```bash
git add web/dashboard.js
git commit -m "feat: add category icon to DB grid cards"
```

---

### Task 8: CSS — Mobile responsive cleanup

**Files:**
- Modify: `web/style.css` — `@media (max-width: 768px)` block

**Step 1: Update mobile rules**

Replace the existing `@media (max-width: 768px)` block with:

```css
@media (max-width: 768px) {
  .stage-title { font-size: clamp(18px, 5.5vw, 28px); }
  .stage { padding: 4rem 1rem 4rem; }
  .stage-prev { left: 0.25rem; }
  .stage-next { right: 0.25rem; }
  .stage-doc-header { padding: 0.5rem 0.85rem; font-size: 10px; }
  .stage-doc-body { padding: 1.25rem 1rem 1rem; }
  .stage-doc-footer { padding: 0.5rem 0.85rem; }
  .db-search { width: 110px; }
  .db-grid { grid-template-columns: 1fr; }
  .modal-content { padding: 1.25rem; }
  .modal-title { font-size: 19px; }
  .topbar { padding: 0 0.85rem; }
  .topbar-logo-sub { display: none; }
}
```

**Step 2: Commit**
```bash
git add web/style.css
git commit -m "style: mobile responsive cleanup for document box"
```

---

### Task 9: Sync to upload/

**Step 1:** Run build-upload script
```bash
node scripts/build-upload.js
```

**Step 2: Verify** — Check that `upload/web/index.html`, `upload/web/style.css`, `upload/web/dashboard.js` are updated.

**Step 3: Commit**
```bash
git add upload/web/
git commit -m "chore: sync redesigned web files to upload/"
```
