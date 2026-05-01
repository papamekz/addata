document.addEventListener('DOMContentLoaded', () => {
  let dataset = null;
  let filteredClaims = [];

  const claimsContainer  = document.getElementById('claims-container');
  const categoryFilter   = document.getElementById('category-filter');
  const searchInput      = document.getElementById('search-input');
  const sortOrder        = document.getElementById('sort-order');
  const totalClaimsEl    = document.getElementById('total-claims');
  const totalCategoriesEl = document.getElementById('total-categories');
  const avgImpactEl      = document.getElementById('avg-impact');
  const modalOverlay     = document.getElementById('modal-overlay');
  const modalBody        = document.getElementById('modal-body');
  const closeModalBtn    = document.getElementById('close-modal');

  if (typeof URBAN_DATA !== 'undefined') {
    dataset = URBAN_DATA;
    initDashboard();
  } else {
    fetch('../data/index.json')
      .then(r => r.json())
      .then(data => { dataset = data; initDashboard(); })
      .catch(err => console.error('Error loading dataset:', err));
  }

  function initDashboard() {
    totalClaimsEl.textContent = dataset.total_claims;
    const cats = Object.keys(dataset.categories);
    totalCategoriesEl.textContent = cats.length;

    const avg = dataset.claims.reduce((a, c) => a + c.impact_score, 0) / dataset.claims.length;
    avgImpactEl.textContent = avg.toFixed(1);

    cats.sort().forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = dataset.categories[cat].label || cat;
      categoryFilter.appendChild(opt);
    });

    filteredClaims = [...dataset.claims];
    renderClaims();
  }

  function renderClaims() {
    claimsContainer.innerHTML = '';
    const sortVal = sortOrder.value;

    filteredClaims.sort((a, b) => {
      if (sortVal === 'impact-desc') return b.impact_score - a.impact_score;
      if (sortVal === 'impact-asc')  return a.impact_score - b.impact_score;
      if (sortVal === 'id-asc')      return a.id.localeCompare(b.id);
      return 0;
    });

    filteredClaims.forEach(claim => {
      const card = document.createElement('div');
      card.className = 'claim-card';

      const isHigh = claim.impact_score >= 8;

      card.innerHTML = `
        <div class="claim-card-top">
          <span class="claim-category-label">${claim.category}</span>
          <span class="claim-id">${claim.id}</span>
        </div>
        <p class="claim-title">${claim.title}</p>
        <div class="claim-footer">
          <span class="impact-badge ${isHigh ? 'impact-high' : ''}">Impact ${claim.impact_score}/10</span>
          <span class="claim-year">${claim.year}</span>
        </div>
      `;

      card.addEventListener('click', () => openDetail(claim));
      claimsContainer.appendChild(card);
    });
  }

  function openDetail(claim) {
    const isHigh = claim.impact_score >= 8;
    modalBody.innerHTML = `
      <div class="modal-header-meta">
        <span class="impact-badge ${isHigh ? 'impact-high' : ''}">Impact ${claim.impact_score}/10</span>
        <span class="impact-badge">${claim.category}</span>
        <span class="impact-badge">${claim.source_type}</span>
      </div>
      <h2 class="modal-title">${claim.title}</h2>

      <div class="modal-section">
        <div class="modal-section-title">Source</div>
        <div class="modal-source-name">${claim.institution}</div>
        <div class="modal-source-meta">${claim.year} · ${claim.source_type.toUpperCase()} · Independent: YES${claim.open_access ? ' · Open Access' : ''}</div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Data File</div>
        <p>Full context, source analysis, and relevance in <code>${claim.file}</code></p>
        <a href="https://github.com/daniel-kem/addata/blob/main/${claim.file}" target="_blank" class="view-source-link">
          View in Repository →
        </a>
      </div>
    `;
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function applyFilters() {
    const term = searchInput.value.toLowerCase();
    const cat  = categoryFilter.value;
    filteredClaims = dataset.claims.filter(c => {
      const matchSearch = c.title.toLowerCase().includes(term) ||
                          c.institution.toLowerCase().includes(term) ||
                          c.id.toLowerCase().includes(term);
      const matchCat = cat === 'all' || c.category === cat;
      return matchSearch && matchCat;
    });
    renderClaims();
  }

  categoryFilter.addEventListener('change', applyFilters);
  searchInput.addEventListener('input', applyFilters);
  sortOrder.addEventListener('change', renderClaims);

  closeModalBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function closeModal() {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }
});
