document.addEventListener('DOMContentLoaded', () => {
  let dataset = null;
  let claims  = [];
  let index   = 0;
  let timer   = null;
  let progress = null;
  let paused  = false;

  const INTERVAL = 9000;

  const stageEl       = document.getElementById('stage');
  const claimStage    = document.getElementById('claim-stage');
  const stageCategory = document.getElementById('stage-category');
  const stageCounter  = document.getElementById('stage-counter');
  const stageTitle    = document.getElementById('stage-title');
  const stageImpact   = document.getElementById('stage-impact');
  const stageSource   = document.getElementById('stage-source');
  const stageYear     = document.getElementById('stage-year');
  const progressBar   = document.getElementById('progress-bar');
  const prevBtn       = document.getElementById('stage-prev');
  const nextBtn       = document.getElementById('stage-next');
  const dbCount       = document.getElementById('db-count');

  const dbTabBtn      = document.getElementById('db-tab-btn');
  const dbOverlay     = document.getElementById('db-overlay');
  const dbCloseBtn    = document.getElementById('db-close-btn');
  const dbGrid        = document.getElementById('db-grid');
  const searchInput   = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');

  const modalOverlay  = document.getElementById('modal-overlay');
  const modalBody     = document.getElementById('modal-body');
  const modalClose    = document.getElementById('modal-close');

  // legal
  const cookieBanner       = document.getElementById('cookie-banner');
  const cookieOk           = document.getElementById('cookie-ok');
  const datenschutzBtn     = document.getElementById('datenschutz-btn');
  const datenschutzOverlay = document.getElementById('datenschutz-overlay');
  const datenschutzClose   = document.getElementById('datenschutz-close');

  // ── Load data ──────────────────────────────────
  if (typeof URBAN_DATA !== 'undefined') {
    init(URBAN_DATA);
  } else {
    fetch('../data/index.json')
      .then(r => r.json())
      .then(data => init(data))
      .catch(err => console.error('Error:', err));
  }

  function init(data) {
    dataset = data;
    claims = [...data.claims].sort((a, b) => b.impact_score - a.impact_score);
    dbCount.textContent = data.total_claims;

    Object.keys(data.categories).sort().forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = data.categories[cat].label || cat;
      categoryFilter.appendChild(opt);
    });

    showClaim(0, false);
    startTimer();
    renderDbGrid(claims);
  }

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

  function fillStage(c, i) {
    const catLabel = dataset.categories[c.category]?.label || c.category;
    stageCategory.textContent = catLabel;
    stageCounter.textContent  = `${i + 1} / ${claims.length}`;
    stageTitle.textContent    = c.title;

    const isHigh = c.impact_score >= 8;
    stageImpact.textContent   = `Impact ${c.impact_score}/10`;
    stageImpact.className     = `stage-badge${isHigh ? '' : ' badge-normal'}`;

    stageSource.textContent   = c.source_type?.toUpperCase() || '';
    stageYear.textContent     = c.year;
  }

  // ── Auto-advance timer ──────────────────────────
  function startTimer() {
    clearProgress();
    if (paused) return;

    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progressBar.style.transition = `width ${INTERVAL}ms linear`;
        progressBar.style.width = '100%';
      });
    });

    timer = setTimeout(() => {
      advance(1);
    }, INTERVAL);
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

  // ── Stage click → detail ────────────────────────
  stageEl.addEventListener('click', e => {
    if (e.target.closest('.stage-arrow') || e.target.closest('.topbar')) return;
    openDetail(claims[index]);
  });

  // pause rotation while hovering stage
  stageEl.addEventListener('mouseenter', () => {
    paused = true;
    clearProgress();
  });
  stageEl.addEventListener('mouseleave', () => {
    if (dbOverlay.classList.contains('open') || modalOverlay.classList.contains('open')) return;
    paused = false;
    startTimer();
  });

  // ── Arrow navigation ────────────────────────────
  prevBtn.addEventListener('click', e => { e.stopPropagation(); advance(-1); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); advance(1); });

  document.addEventListener('keydown', e => {
    if (dbOverlay.classList.contains('open') || modalOverlay.classList.contains('open')) return;
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
          <span class="db-card-category">${c.category}</span>
          <span class="db-card-id">${c.id}</span>
        </div>
        <p class="db-card-title">${c.title}</p>
        <div class="db-card-footer">
          <span class="badge ${isHigh ? 'badge-high' : ''}">Impact ${c.impact_score}/10</span>
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
    const isHigh = c.impact_score >= 8;

    const zusammenfassung = c.zusammenfassung
      ? `<div class="modal-section">
           <div class="modal-section-label">Zusammenfassung</div>
           <p>${md(c.zusammenfassung)}</p>
         </div>` : '';

    const kernbefund = c.kernbefund
      ? `<div class="modal-section">
           <div class="modal-section-label">Kernbefund</div>
           <p>${md(c.kernbefund)}</p>
         </div>` : '';

    const relevanz = c.relevanz
      ? `<div class="modal-section">
           <div class="modal-section-label">Relevanz für Außenwerbung</div>
           <p>${md(c.relevanz)}</p>
         </div>` : '';

    const tags = c.tags?.length
      ? `<div class="modal-tags">${c.tags.map(t => `<span class="modal-tag">${t}</span>`).join('')}</div>`
      : '';

    const sourceLink = c.source_url
      ? `<a href="${c.source_url}" target="_blank" class="modal-link">Quelle öffnen →</a>`
      : '';

    modalBody.innerHTML = `
      <div class="modal-badges">
        <span class="badge ${isHigh ? 'badge-high' : ''}">Impact ${c.impact_score}/10</span>
        <span class="badge">${c.category}</span>
        <span class="badge">${c.source_type || ''}</span>
        <span class="badge modal-id-badge">${c.id}</span>
      </div>
      <h2 class="modal-title">${c.title}</h2>
      ${zusammenfassung}
      ${kernbefund}
      ${relevanz}
      <div class="modal-section">
        <div class="modal-section-label">Quelle</div>
        <div class="modal-source-name">${c.institution || '—'}</div>
        <div class="modal-source-meta">${c.year} · ${(c.source_type || '').toUpperCase()} · Unabhängig · Keine Industrie-Finanzierung</div>
        ${sourceLink}
      </div>
      ${tags}
    `;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

  // ── Cookie banner ───────────────────────────────
  if (localStorage.getItem('cookie-ok')) {
    cookieBanner.classList.add('hidden');
  }
  cookieOk.addEventListener('click', () => {
    localStorage.setItem('cookie-ok', '1');
    cookieBanner.classList.add('hidden');
  });

  // ── Datenschutz ─────────────────────────────────
  datenschutzBtn.addEventListener('click', () => {
    paused = true;
    clearProgress();
    datenschutzOverlay.classList.add('open');
  });
  datenschutzClose.addEventListener('click', () => {
    datenschutzOverlay.classList.remove('open');
    paused = false;
    startTimer();
  });
  datenschutzOverlay.addEventListener('click', e => {
    if (e.target === datenschutzOverlay) {
      datenschutzOverlay.classList.remove('open');
      paused = false;
      startTimer();
    }
  });

  // extend Escape to cover legal modals
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (modalOverlay.classList.contains('open'))       { closeModal(); return; }
    if (dbOverlay.classList.contains('open'))          { closeDb(); return; }
    if (datenschutzOverlay.classList.contains('open')) { datenschutzClose.click(); return; }
  });
});
