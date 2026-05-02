document.addEventListener('DOMContentLoaded', () => {
  let dataset = null;
  let claims  = [];
  let index   = 0;
  let timer   = null;
  let paused  = false;

  const INTERVAL = 9000;

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
    text = text.replace(/(€|\$)\s*\d[\d.,]+/g,
      (m) => `<span class="highlight-red">${m}</span>`);
    // Critical keywords (DE + EN)
    const KEYWORDS = [
      'verboten','Verbot','verbannt','verbannte','illegal','rechtswidrig','unzulässig',
      'Bußgeld','Strafe','Geldstrafe','Schadensersatz','Schaden','Schadenersatz',
      'banned','ban','fine','penalty','prohibited','unlawful',
      'Krebs','Karzinom','cancer','carcinogen','Tod','deaths','fatal',
      'Klage','Klagen','lawsuit','litigation',
    ];
    const kw = KEYWORDS.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    text = text.replace(new RegExp(`\\b(${kw})\\b`, 'gi'),
      (m) => `<span class="highlight-red-word">${m}</span>`);
    return text;
  }

  const stageEl        = document.getElementById('stage');
  const claimStage     = document.getElementById('claim-stage');
  const progressBar    = document.getElementById('progress-bar');
  const prevBtn        = document.getElementById('stage-prev');
  const nextBtn        = document.getElementById('stage-next');
  const dbCount        = document.getElementById('db-count');

  const dbTabBtn       = document.getElementById('db-tab-btn');
  const dbOverlay      = document.getElementById('db-overlay');
  const dbCloseBtn     = document.getElementById('db-close-btn');
  const dbGrid         = document.getElementById('db-grid');
  const searchInput    = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');

  const modalOverlay   = document.getElementById('modal-overlay');
  const modalBody      = document.getElementById('modal-body');
  const modalClose     = document.getElementById('modal-close');

  const cookieBanner       = document.getElementById('cookie-banner');
  const cookieOk           = document.getElementById('cookie-ok');
  const datenschutzBtn     = document.getElementById('datenschutz-btn');
  const infoTabBtn  = document.getElementById('info-tab-btn');
  const infoOverlay = document.getElementById('info-overlay');
  const infoClose   = document.getElementById('info-close-btn');
  const infoBody    = document.getElementById('info-body');
  const datenschutzOverlay = document.getElementById('datenschutz-overlay');
  const datenschutzClose   = document.getElementById('datenschutz-close');
  const privacyBody        = document.getElementById('privacy-body');

  // ── Load data ──────────────────────────────────
  if (typeof URBAN_DATA !== 'undefined') {
    init(URBAN_DATA);
  } else {
    fetch('../data/index.json')
      .then(r => r.json())
      .then(data => init(data))
      .catch(err => console.error('Error:', err));
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function init(data) {
    dataset = data;
    claims  = shuffle(data.claims);
    dbCount.textContent = data.total_claims;

    Object.keys(data.categories).sort().forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = categoryLabel(cat);
      opt.dataset.cat = cat;
      categoryFilter.appendChild(opt);
    });

    showClaim(0, false);
    startTimer();
    renderDbGrid(claims);
  }

  // ── Re-render on language change ────────────────
  document.addEventListener('langchange', () => {
    // update category filter options
    categoryFilter.querySelectorAll('option[data-cat]').forEach(opt => {
      opt.textContent = categoryLabel(opt.dataset.cat);
    });
    // re-render current stage text
    if (claims.length) fillStage(claims[index], index);
    // re-render db grid with current filter
    filterDb();
    // re-render privacy modal if open
    if (datenschutzOverlay.classList.contains('open')) renderPrivacy();
    if (infoOverlay.classList.contains('open')) renderInfoPanel();
    // re-render detail modal if open
    if (modalOverlay.classList.contains('open') && modalBody._claim) {
      openDetail(modalBody._claim);
    }
  });

  // ── Stage display ───────────────────────────────
  function showClaim(i, animate = true) {
    index = ((i % claims.length) + claims.length) % claims.length;
    const c = claims[index];

    if (animate) {
      claimStage.classList.add('fade-out');
      setTimeout(() => {
        fillStage(c, index);
        claimStage.classList.remove('fade-out');
        claimStage.classList.add('fade-in');
        setTimeout(() => claimStage.classList.remove('fade-in'), 500);
      }, 280);
    } else {
      fillStage(c, index);
    }
  }

  function claimTitle(c) {
    return (currentLang === 'en' && c.title_en) ? c.title_en : c.title;
  }

  function fillStage(c, i) {
    const icon = CATEGORY_ICONS[c.category] || '◈';
    const sev  = severityInfo(c.impact_score);
    const catColor = `var(--cat-${c.category}, var(--primary))`;

    const animClass = claimStage.classList.contains('fade-in') ? ' fade-in' : '';
    claimStage.className = `claim-stage ${sev.cls}${animClass}`;

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
        <h1 class="stage-title">${highlightText(claimTitle(c))}</h1>
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

  // ── Timer ───────────────────────────────────────
  function startTimer() {
    clearProgress();
    if (paused) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      progressBar.style.transition = `width ${INTERVAL}ms linear`;
      progressBar.style.width = '100%';
    }));
    timer = setTimeout(() => advance(1), INTERVAL);
  }

  function clearProgress() {
    clearTimeout(timer);
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
  }

  function advance(dir) {
    showClaim(index + dir);
    startTimer();
  }

  // ── Stage interaction ───────────────────────────
  stageEl.addEventListener('click', e => {
    if (e.target.closest('.stage-arrow') || e.target.closest('.topbar')) return;
    openDetail(claims[index]);
  });

  stageEl.addEventListener('mouseenter', () => { paused = true;  clearProgress(); });
  stageEl.addEventListener('mouseleave', () => {
    if (dbOverlay.classList.contains('open') || modalOverlay.classList.contains('open') || infoOverlay.classList.contains('open')) return;
    paused = false;
    startTimer();
  });

  prevBtn.addEventListener('click', e => { e.stopPropagation(); advance(-1); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); advance(1); });

  document.addEventListener('keydown', e => {
    if (dbOverlay.classList.contains('open') || modalOverlay.classList.contains('open') ||
        datenschutzOverlay.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  advance(-1);
    if (e.key === 'ArrowRight') advance(1);
  });

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

  // ── Database overlay ────────────────────────────
  dbTabBtn.addEventListener('click', () => {
    paused = true;
    clearProgress();
    dbOverlay.classList.add('open');
  });

  function closeDb() {
    dbOverlay.classList.remove('open');
    paused = false;
    startTimer();
  }

  dbCloseBtn.addEventListener('click', closeDb);
  dbOverlay.addEventListener('click', e => { if (e.target === dbOverlay) closeDb(); });

  searchInput.addEventListener('input', filterDb);
  categoryFilter.addEventListener('change', filterDb);

  function filterDb() {
    const term = searchInput.value.toLowerCase();
    const cat  = categoryFilter.value;
    const filtered = dataset.claims.filter(c => {
      const matchSearch = !term ||
        c.title.toLowerCase().includes(term) ||
        (c.id || '').toLowerCase().includes(term);
      const matchCat = cat === 'all' || c.category === cat;
      return matchSearch && matchCat;
    });
    renderDbGrid(filtered);
  }

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

  // ── Detail modal ────────────────────────────────
  function md(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="inline-link">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }

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

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (!dbOverlay.classList.contains('open')) {
      paused = false;
      startTimer();
    }
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

  // ── Privacy modal ───────────────────────────────
  function renderPrivacy() {
    privacyBody.innerHTML = t('privacy_html');
  }

  datenschutzBtn.addEventListener('click', () => {
    paused = true;
    clearProgress();
    renderPrivacy();
    datenschutzOverlay.classList.add('open');
  });

  function closePrivacy() {
    datenschutzOverlay.classList.remove('open');
    paused = false;
    startTimer();
  }

  datenschutzClose.addEventListener('click', closePrivacy);
  datenschutzOverlay.addEventListener('click', e => { if (e.target === datenschutzOverlay) closePrivacy(); });

  // ── Cookie banner ───────────────────────────────
  if (localStorage.getItem('cookie-ok')) cookieBanner.classList.add('hidden');
  cookieOk.addEventListener('click', () => {
    localStorage.setItem('cookie-ok', '1');
    cookieBanner.classList.add('hidden');
  });

  // ── Global Escape ───────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (modalOverlay.classList.contains('open'))       { closeModal();   return; }
    if (dbOverlay.classList.contains('open'))          { closeDb();      return; }
    if (datenschutzOverlay.classList.contains('open')) { closePrivacy(); return; }
    if (infoOverlay.classList.contains('open'))          { closeInfo();    return; }
  });
});
