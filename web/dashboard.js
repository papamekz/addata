document.addEventListener('DOMContentLoaded', () => {
  let dataset = null;
  let claims  = [];
  let index   = 0;
  let timer   = null;
  let paused  = false;

  const INTERVAL = 9000;

  const stageEl        = document.getElementById('stage');
  const claimStage     = document.getElementById('claim-stage');
  const stageCategory  = document.getElementById('stage-category');
  const stageCounter   = document.getElementById('stage-counter');
  const stageTitle     = document.getElementById('stage-title');
  const stageImpact    = document.getElementById('stage-impact');
  const stageSource    = document.getElementById('stage-source');
  const stageYear      = document.getElementById('stage-year');
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
    stageCategory.textContent = categoryLabel(c.category);
    stageCounter.textContent  = `${i + 1} / ${claims.length}`;
    stageTitle.textContent    = claimTitle(c);

    const isHigh = c.impact_score >= 8;
    stageImpact.textContent = `${t('impact_label')} ${c.impact_score}/10`;
    stageImpact.className   = `stage-badge${isHigh ? '' : ' badge-normal'}`;
    stageSource.textContent = (c.source_type || '').toUpperCase();
    stageYear.textContent   = c.year;
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
    if (dbOverlay.classList.contains('open') || modalOverlay.classList.contains('open')) return;
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
      const card = document.createElement('div');
      card.className = 'db-card';
      const isHigh = c.impact_score >= 8;
      card.innerHTML = `
        <div class="db-card-top">
          <span class="db-card-category">${categoryLabel(c.category)}</span>
          <span class="db-card-id">${c.id}</span>
        </div>
        <p class="db-card-title">${claimTitle(c)}</p>
        <div class="db-card-footer">
          <span class="badge ${isHigh ? 'badge-high' : ''}">${t('impact_label')} ${c.impact_score}/10</span>
          <span class="db-card-year">${c.year}</span>
        </div>
      `;
      card.addEventListener('click', () => openDetail(c));
      dbGrid.appendChild(card);
    });
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
    const isHigh = c.impact_score >= 8;

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
      <div class="modal-badges">
        <span class="badge ${isHigh ? 'badge-high' : ''}">${t('impact_label')} ${c.impact_score}/10</span>
        <span class="badge">${categoryLabel(c.category)}</span>
        <span class="badge">${c.source_type || ''}</span>
        <span class="badge modal-id-badge">${c.id}</span>
      </div>
      <h2 class="modal-title">${claimTitle(c)}</h2>
      ${section('zusammenfassung', zusammenfassung)}
      ${section('kernbefund', kernbefund)}
      ${section('relevanz', relevanz)}
      <div class="modal-section">
        <div class="modal-section-label">${t('source_label')}</div>
        <div class="modal-source-name">${c.institution || '—'}</div>
        <div class="modal-source-meta">${c.year} · ${(c.source_type || '').toUpperCase()} · ${t('independent_label')}</div>
        ${sourceLink}
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
  });
});
