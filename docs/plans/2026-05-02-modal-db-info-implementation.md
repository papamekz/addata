# Modal + DB-Panel + Info-Tab Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the detail modal as a protocol sheet, convert the DB panel to a list/register view, and add a new Info tab with dataset stats.

**Architecture:** All changes in `web/style.css`, `web/dashboard.js`, `web/index.html`, `web/i18n.js`. No new dependencies. Info stats computed live from `URBAN_DATA` (already loaded). Existing overlay/panel pattern reused for the Info tab.

**Tech Stack:** Vanilla JS, CSS custom properties, existing i18n system.

---

### Task 1: CSS — Modal protocol layout

**Files:**
- Modify: `web/style.css` — modal section

**Step 1: Replace the modal CSS block**

Find `/* ─── Detail modal ─────────────────────────────── */` and replace everything from that comment through `.modal-tags { ... }` and `.modal-tag { ... }` with:

```css
/* ─── Detail modal ─────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(1, 1, 2, 0.85);
  backdrop-filter: blur(8px);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 500;
  padding: 2rem;
}
.modal-overlay.open {
  display: flex;
  animation: overlayIn 0.2s ease;
}

.modal-content {
  background: var(--surface-1);
  border: 1px solid var(--hairline-strong);
  width: 100%;
  max-width: 680px;
  max-height: 88vh;
  border-radius: 4px;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 40px 80px rgba(0,0,0,0.7);
  animation: panelIn 0.25s cubic-bezier(0.2, 0, 0, 1);
}

.modal-close {
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  border-radius: 4px;
  color: var(--ink-subtle);
  font-size: 13px;
  cursor: pointer;
  z-index: 1;
  transition: color 0.12s, background 0.12s;
}
.modal-close:hover { color: var(--ink); background: var(--surface-3); }

/* Protocol header */
.modal-proto-header {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0.65rem 1.25rem;
  border-bottom: 1px solid var(--hairline);
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--ink-tertiary);
  letter-spacing: 0.3px;
  padding-right: 3rem;
}

.modal-proto-sep {
  margin: 0 0.6rem;
  opacity: 0.35;
}

.modal-proto-cat {
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Protocol body */
.modal-proto-body {
  padding: 1.5rem 1.5rem 0;
}

.modal-gegenstand-label {
  font-size: 10px;
  font-family: var(--font-mono);
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: var(--ink-tertiary);
  margin-bottom: 0.4rem;
}

.modal-title {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.4px;
  line-height: 1.25;
  color: var(--ink);
  margin-bottom: 1.5rem;
}

.modal-section { margin-bottom: 1.25rem; }

.modal-section-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--ink-subtle);
  font-family: var(--font-mono);
  margin-bottom: 0.35rem;
}

.modal-section p {
  font-size: 14px;
  color: var(--ink-muted);
  line-height: 1.65;
}

.modal-section code {
  font-family: var(--font-mono);
  font-size: 12px;
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  padding: 1px 6px;
  border-radius: 4px;
  color: var(--ink-muted);
}

/* Protocol footer row */
.modal-proto-footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--hairline);
  margin-top: 0.25rem;
}

.modal-source-block {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.modal-source-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  letter-spacing: -0.2px;
}

.modal-source-meta {
  font-size: 12px;
  color: var(--ink-subtle);
  font-family: var(--font-mono);
}

.modal-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.6rem;
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 4px;
  background: var(--primary-glow);
  border: 1px solid rgba(94, 106, 210, 0.2);
  transition: background 0.15s, border-color 0.15s;
}
.modal-link:hover {
  background: rgba(94, 106, 210, 0.22);
  border-color: rgba(94, 106, 210, 0.4);
}

.modal-proto-severity {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 11px;
  font-family: var(--font-mono);
  font-weight: 600;
  letter-spacing: 0.4px;
  flex-shrink: 0;
  padding-top: 0.15rem;
}

.modal-sev-icon { font-size: 12px; }
.modal-sev-bar  { letter-spacing: 1px; font-size: 10px; }
.modal-sev-label { text-transform: uppercase; letter-spacing: 0.5px; }

.severity-kritisch .modal-sev-icon,
.severity-kritisch .modal-sev-bar,
.severity-kritisch .modal-sev-label { color: #ef4444; }

.severity-erhoeht .modal-sev-icon,
.severity-erhoeht .modal-sev-bar,
.severity-erhoeht .modal-sev-label  { color: #f97316; }

.severity-mittel .modal-sev-icon,
.severity-mittel .modal-sev-bar,
.severity-mittel .modal-sev-label   { color: #eab308; }

.severity-gering .modal-sev-icon,
.severity-gering .modal-sev-bar,
.severity-gering .modal-sev-label   { color: var(--ink-tertiary); }

/* Tags */
.modal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  padding: 0.75rem 1.5rem;
  border-top: 1px solid var(--hairline);
}

.modal-tag {
  font-size: 10px;
  font-family: var(--font-mono);
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--surface-2);
  color: var(--ink-tertiary);
  border: 1px solid var(--hairline);
}

.inline-link {
  color: var(--primary);
  text-decoration: none;
}
.inline-link:hover { text-decoration: underline; }

.modal-id-badge {
  font-family: var(--font-mono);
  font-size: 11px;
}
```

**Step 2: Commit**
```bash
git add web/style.css
git commit -m "style: protocol layout for detail modal"
```

---

### Task 2: JS — Rewrite openDetail()

**Files:**
- Modify: `web/dashboard.js` — `openDetail()` function

**Step 1: Replace the entire `openDetail(c)` function**

Find `function openDetail(c) { ... }` and replace with:

```js
  function openDetail(c) {
    modalBody._claim = c;
    const sev = severityInfo(c.impact_score);
    const catColor = `var(--cat-${c.category}, var(--primary))`;

    const isEn = currentLang === 'en';
    const zusammenfassung = isEn ? (c.zusammenfassung_en || c.zusammenfassung) : c.zusammenfassung;
    const kernbefund      = isEn ? (c.kernbefund_en      || c.kernbefund)      : c.kernbefund;
    const relevanz        = isEn ? (c.relevanz_en        || c.relevanz)        : c.relevanz;

    const section = (labelKey, text) => text ? `
      <div class="modal-section">
        <div class="modal-section-label">${t(labelKey)}</div>
        <p>${md(text)}</p>
      </div>` : '';

    const tags = c.tags?.length
      ? `<div class="modal-tags">${c.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('')}</div>`
      : '';

    const sourceLink = c.source_url
      ? `<a href="${c.source_url}" target="_blank" class="modal-link">${t('open_source_link')}</a>`
      : '';

    modalBody.innerHTML = `
      <div class="modal-proto-header">
        <span style="font-weight:600;color:${catColor}">⌗ ${c.id}</span>
        <span class="modal-proto-sep">·</span>
        <span class="modal-proto-cat" style="color:${catColor}">${categoryLabel(c.category)}</span>
        <span class="modal-proto-sep">·</span>
        <span>${c.year}</span>
      </div>
      <div class="modal-proto-body">
        <div class="modal-gegenstand-label">Gegenstand</div>
        <h2 class="modal-title">${claimTitle(c)}</h2>
        ${section('zusammenfassung', zusammenfassung)}
        ${section('kernbefund', kernbefund)}
        ${section('relevanz', relevanz)}
      </div>
      <div class="modal-proto-footer">
        <div class="modal-source-block">
          <div class="modal-source-name">${c.institution || '—'}</div>
          <div class="modal-source-meta">${c.year} · ${(c.source_type || '').toUpperCase()} · ${t('independent_label')}</div>
          ${sourceLink}
        </div>
        <div class="modal-proto-severity ${sev.cls}">
          <span class="modal-sev-icon">${sev.icon}</span>
          <span class="modal-sev-bar">${sev.bar}</span>
          <span class="modal-sev-label">${sev.label}</span>
        </div>
      </div>
      ${tags}
    `;

    paused = true;
    clearProgress();
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
```

**Step 2: Commit**
```bash
git add web/dashboard.js
git commit -m "feat: protocol layout for detail modal"
```

---

### Task 3: CSS + JS — DB list view

**Files:**
- Modify: `web/style.css` — DB grid section
- Modify: `web/dashboard.js` — `renderDbGrid()`

**Step 1: Replace DB grid CSS**

Find `/* ─── DB Grid ──────────────────────────────────── */` and replace everything from that comment through `.db-card-year { ... }` with:

```css
/* ─── DB List ──────────────────────────────────── */
.db-grid {
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--surface-1);
}

.db-row {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 1rem;
  height: 44px;
  border-bottom: 1px solid var(--hairline);
  cursor: pointer;
  transition: background 0.1s;
  flex-shrink: 0;
}
.db-row:hover { background: var(--surface-2); }
.db-row:last-child { border-bottom: none; }

.db-row-cat {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  width: 130px;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  overflow: hidden;
  white-space: nowrap;
}

.db-row-cat-icon {
  font-size: 11px;
  flex-shrink: 0;
}

.db-row-id {
  width: 90px;
  flex-shrink: 0;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--ink-tertiary);
  padding-left: 0.75rem;
}

.db-row-title {
  flex: 1;
  font-size: 13px;
  color: var(--ink-muted);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 1rem;
  min-width: 0;
}
.db-row:hover .db-row-title { color: var(--ink); }

.db-row-sev {
  flex-shrink: 0;
  font-size: 13px;
  width: 20px;
  text-align: center;
}

.db-row-year {
  width: 44px;
  flex-shrink: 0;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--ink-tertiary);
  text-align: right;
}
```

**Step 2: Replace `renderDbGrid()` in dashboard.js**

Find `function renderDbGrid(list) { ... }` and replace with:

```js
  function renderDbGrid(list) {
    dbGrid.innerHTML = '';
    list.forEach(c => {
      const row = document.createElement('div');
      row.className = 'db-row';
      const icon     = CATEGORY_ICONS[c.category] || '◈';
      const catColor = `var(--cat-${c.category}, var(--primary))`;
      const sev      = severityInfo(c.impact_score);
      row.innerHTML = `
        <div class="db-row-cat" style="color:${catColor}">
          <span class="db-row-cat-icon">${icon}</span>
          <span>${categoryLabel(c.category)}</span>
        </div>
        <span class="db-row-id">${c.id}</span>
        <span class="db-row-title">${claimTitle(c)}</span>
        <span class="db-row-sev ${sev.cls}" style="color:inherit">${sev.icon}</span>
        <span class="db-row-year">${c.year}</span>
      `;
      row.addEventListener('click', () => openDetail(c));
      dbGrid.appendChild(row);
    });
  }
```

**Step 3: Commit**
```bash
git add web/style.css web/dashboard.js
git commit -m "feat: DB panel as Aktenregister list view"
```

---

### Task 4: i18n — Info tab translations

**Files:**
- Modify: `web/i18n.js`

**Step 1: Add keys to DE translations**

Find the `de: {` block. Add after `cookie_ok: 'OK',`:

```js
    info_button:    'Info',
    info_title:     'Über diesen Datensatz',
    info_about:     'Unabhängig finanzierte, peer-reviewed Forschungsbelege zu den Auswirkungen von Außen- und Digital-Außenwerbung (OOH/DOOH). Der Datensatz aggregiert Studien zu Regulierung, Gesundheit, Umwelt, Sicherheit und weiteren Dimensionen. Alle Quellen sind unabhängig — keine Industrie-Finanzierung.',
    info_stats:     'Kennzahlen',
    info_cats_head: 'Kategorien',
    info_claims_label:  'Forschungsclaims',
    info_cats_label:    'Kategorien',
    info_avg_label:     'Ø Impact-Score',
    info_high_label:    'High-Impact (≥8)',
    info_period_label:  'Zeitraum',
    info_sources_label: 'Unabh. Quellen',
```

**Step 2: Add keys to EN translations**

Find the `en: {` block. Add after `cookie_ok: 'OK',` (or equivalent position):

```js
    info_button:    'Info',
    info_title:     'About this Dataset',
    info_about:     'Independently funded, peer-reviewed research evidence on the impacts of out-of-home and digital out-of-home advertising (OOH/DOOH). The dataset aggregates studies on regulation, health, environment, safety, and other dimensions. All sources are independent — no industry funding.',
    info_stats:     'Key Figures',
    info_cats_head: 'Categories',
    info_claims_label:  'Research Claims',
    info_cats_label:    'Categories',
    info_avg_label:     'Avg. Impact Score',
    info_high_label:    'High-Impact (≥8)',
    info_period_label:  'Period',
    info_sources_label: 'Indep. Sources',
```

**Step 3: Commit**
```bash
git add web/i18n.js
git commit -m "feat: add Info tab i18n keys (DE+EN)"
```

---

### Task 5: HTML — Info button + overlay

**Files:**
- Modify: `web/index.html`

**Step 1: Add Info button to topbar-nav**

Find `<nav class="topbar-nav">` and add the info button as the FIRST item inside it (before the lang-switcher):

```html
      <button class="db-tab info-tab" id="info-tab-btn">
        <span data-i18n="info_button"></span>
      </button>
```

**Step 2: Add Info overlay HTML**

Find `<!-- ── Database overlay ──` block. Add a new overlay RIGHT BEFORE it:

```html
  <!-- ── Info overlay ── -->
  <div class="db-overlay" id="info-overlay">
    <div class="db-panel">
      <div class="db-panel-header">
        <div class="db-panel-title" data-i18n="info_title"></div>
        <div class="db-panel-controls">
          <button class="db-close" id="info-close-btn">✕</button>
        </div>
      </div>
      <div class="info-body" id="info-body"></div>
    </div>
  </div>
```

**Step 3: Commit**
```bash
git add web/index.html
git commit -m "feat: add Info tab button and overlay HTML"
```

---

### Task 6: CSS — Info panel styles

**Files:**
- Modify: `web/style.css` — add at end, before `@media` block

**Step 1: Add info panel CSS**

Insert BEFORE the `@media (max-width: 768px)` block:

```css
/* ─── Info panel ───────────────────────────────── */
.info-tab {
  opacity: 0.7;
}
.info-tab:hover { opacity: 1; }

.info-body {
  overflow-y: auto;
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.info-about {
  font-size: 14px;
  color: var(--ink-muted);
  line-height: 1.7;
}

.info-section-label {
  font-size: 10px;
  font-family: var(--font-mono);
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: var(--ink-subtle);
  margin-bottom: 0.85rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--hairline);
}

.info-stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--hairline);
  border: 1px solid var(--hairline);
  border-radius: 4px;
  overflow: hidden;
}

.info-stat {
  background: var(--surface-2);
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.info-stat-value {
  font-size: 22px;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--ink);
  letter-spacing: -0.5px;
}

.info-stat-label {
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--ink-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.info-cat-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.info-cat-pill {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 4px 10px;
  border-radius: 3px;
  background: var(--surface-2);
  border: 1px solid var(--hairline);
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--ink-muted);
  cursor: pointer;
  transition: background 0.1s;
}
.info-cat-pill:hover { background: var(--surface-3); color: var(--ink); }

.info-cat-icon { font-size: 11px; }

.info-cat-count {
  font-size: 10px;
  color: var(--ink-tertiary);
  margin-left: 0.2rem;
}

.info-footer {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--ink-tertiary);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
  border-top: 1px solid var(--hairline);
}
```

**Step 2: Commit**
```bash
git add web/style.css
git commit -m "style: Info panel styles"
```

---

### Task 7: JS — Info panel logic

**Files:**
- Modify: `web/dashboard.js`

**Step 1: Add element refs after existing refs**

Find `const datenschutzBtn = document.getElementById('datenschutz-btn');` and add after it:

```js
  const infoTabBtn  = document.getElementById('info-tab-btn');
  const infoOverlay = document.getElementById('info-overlay');
  const infoClose   = document.getElementById('info-close-btn');
  const infoBody    = document.getElementById('info-body');
```

**Step 2: Add renderInfoPanel() function**

Add this function after `renderDbGrid()`:

```js
  function renderInfoPanel() {
    if (!dataset) return;
    const allClaims = dataset.claims;
    const total     = allClaims.length;
    const avgScore  = (allClaims.reduce((s, c) => s + (c.impact_score || 0), 0) / total).toFixed(1);
    const highCount = allClaims.filter(c => c.impact_score >= 8).length;
    const years     = allClaims.map(c => Number(c.year)).filter(Boolean);
    const yearRange = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '—';
    const catCount  = Object.keys(dataset.categories || {}).length;

    const catCounts = {};
    allClaims.forEach(c => { catCounts[c.category] = (catCounts[c.category] || 0) + 1; });

    const catPills = Object.entries(catCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => {
        const icon     = CATEGORY_ICONS[cat] || '◈';
        const catColor = `var(--cat-${cat}, var(--primary))`;
        return `<span class="info-cat-pill">
          <span class="info-cat-icon" style="color:${catColor}">${icon}</span>
          <span>${categoryLabel(cat)}</span>
          <span class="info-cat-count">(${count})</span>
        </span>`;
      }).join('');

    infoBody.innerHTML = `
      <p class="info-about">${t('info_about')}</p>

      <div>
        <div class="info-section-label">${t('info_stats')}</div>
        <div class="info-stat-grid">
          <div class="info-stat">
            <span class="info-stat-value">${total}</span>
            <span class="info-stat-label">${t('info_claims_label')}</span>
          </div>
          <div class="info-stat">
            <span class="info-stat-value">${catCount}</span>
            <span class="info-stat-label">${t('info_cats_label')}</span>
          </div>
          <div class="info-stat">
            <span class="info-stat-value">${avgScore}</span>
            <span class="info-stat-label">${t('info_avg_label')}</span>
          </div>
          <div class="info-stat">
            <span class="info-stat-value">${highCount}</span>
            <span class="info-stat-label">${t('info_high_label')}</span>
          </div>
          <div class="info-stat">
            <span class="info-stat-value">${yearRange}</span>
            <span class="info-stat-label">${t('info_period_label')}</span>
          </div>
          <div class="info-stat">
            <span class="info-stat-value">100%</span>
            <span class="info-stat-label">${t('info_sources_label')}</span>
          </div>
        </div>
      </div>

      <div>
        <div class="info-section-label">${t('info_cats_head')}</div>
        <div class="info-cat-grid">${catPills}</div>
      </div>

      <div class="info-footer">
        <span>CC-BY-4.0</span>
        <a href="https://github.com/papamekz/addata" target="_blank" class="inline-link">github.com/papamekz/addata</a>
      </div>
    `;
  }
```

**Step 3: Add open/close handlers**

Find `// ── Database overlay ────────────────────────────` and add BEFORE it:

```js
  // ── Info overlay ─────────────────────────────────
  infoTabBtn.addEventListener('click', () => {
    paused = true;
    clearProgress();
    renderInfoPanel();
    infoOverlay.classList.add('open');
  });

  function closeInfo() {
    infoOverlay.classList.remove('open');
    paused = false;
    startTimer();
  }

  infoClose.addEventListener('click', closeInfo);
  infoOverlay.addEventListener('click', e => { if (e.target === infoOverlay) closeInfo(); });
```

**Step 4: Update langchange handler**

Find `document.addEventListener('langchange', () => {` and inside it, after `if (datenschutzOverlay.classList.contains('open')) renderPrivacy();`, add:

```js
    if (infoOverlay.classList.contains('open')) renderInfoPanel();
```

**Step 5: Update Escape handler**

Find `if (datenschutzOverlay.classList.contains('open')) { closePrivacy(); return; }` and add after it:

```js
    if (infoOverlay.classList.contains('open'))          { closeInfo();    return; }
```

**Step 6: Update pause check in mouseleave**

Find `if (dbOverlay.classList.contains('open') || modalOverlay.classList.contains('open')) return;` and replace with:

```js
    if (dbOverlay.classList.contains('open') || modalOverlay.classList.contains('open') || infoOverlay.classList.contains('open')) return;
```

**Step 7: Commit**
```bash
git add web/dashboard.js
git commit -m "feat: Info tab panel with live dataset stats"
```

---

### Task 8: Sync to upload/

**Step 1:** Run build-upload script
```bash
node scripts/build-upload.js
```

**Step 2: Commit**
```bash
git add upload/
git commit -m "chore: sync modal+DB+info improvements to upload/"
```
