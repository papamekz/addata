const TRANSLATIONS = {
  de: {
    db_button:          'Datenbank',
    dataset_title:      'Datensatz',
    search_placeholder: 'Suchen…',
    all_categories:     'Alle Kategorien',
    privacy_label:      'Datenschutz',
    source_label:       'Quelle',
    independent_label:  'Unabhängig · Keine Industrie-Finanzierung',
    open_source_link:   'Quelle öffnen →',
    impact_label:       'Impact',
    severity_critical:  'KRITISCH',
    severity_elevated:  'ERHÖHT',
    severity_medium:    'MITTEL',
    severity_low:       'GERING',
    finding_label:      'Befund',
    subject_label:      'Gegenstand',
    zusammenfassung:    'Zusammenfassung',
    kernbefund:         'Kernbefund',
    quote_deutung:      'Zitat / Deutung / Hinweis',
    relevanz:           'Relevanz für Außenwerbung',
    cookie_text:        'Diese Seite verwendet keine Cookies und kein Tracking. Alle Ressourcen werden lokal ausgeliefert.',
    cookie_ok:          'OK',
    info_button:    'Info',
    info_title:     'Über diesen Datensatz',
    info_about:     'Maschinenlesbarer Forschungsdatensatz zu Risiken von Außen- und Digital-Außenwerbung (OOH/DOOH). Er aggregiert empirische Claims aus Forschung, Behörden, Gerichten, internationalen Organisationen und unabhängigen Recherchen sowie separate Zitat-Kontexte für kulturelle und ethische Einordnung.',
    info_stats:     'Kennzahlen',
    info_cats_head: 'Kategorien',
    info_claims_label:  'Forschungsclaims',
    info_records_label: 'Datensätze gesamt',
    info_quotes_label:  'Zitat-Kontexte',
    info_cats_label:    'Kategorien',
    info_avg_label:     'Ø Impact-Score',
    info_high_label:    'High-Impact (≥8)',
    info_period_label:  'Zeitraum',
    info_sources_label: 'URL-Audit',
    info_agent_files:   'Agent-Dateien',
    info_quality_note:  'Quote-Kontexte dienen als kulturelle/ethische Einordnung, nicht als empirischer Beweis. Für belastbare Nutzung: Quellenlinks und DATA_QUALITY.md prüfen.',
    info_use_head:      'Empfohlene Nutzung',
    info_use_1_title:   'Schnell suchen',
    info_use_1_text:    'Datenbank öffnen, nach Thema, Claim-ID oder Kategorie filtern und den Detaildialog mit Quellenlinks prüfen.',
    info_use_2_title:   'Agenten füttern',
    info_use_2_text:    'Für KI-Workflows zuerst digest.json oder rag-chunks.jsonl verwenden, danach die Original-Claim-Datei zitieren.',
    info_use_3_title:   'Qualität prüfen',
    info_use_3_text:    'Bei rechtlichen, finanziellen oder politischen Aussagen DATA_QUALITY.md, SOURCES_POLICY.md und die URL-Quellen gegenprüfen.',
    info_status_head:   'Release-Status',
    info_status_text:   'Letzter lokaler Audit: 0 defekte URLs, 115 Single-Source-Claims als Ausbaupunkt markiert.',
    content_lang_note:  'Inhalt auf Deutsch',

    privacy_html: `
      <div class="modal-badges"><span class="badge">Datenschutz</span></div>
      <h2 class="modal-title">Datenschutzerklärung</h2>
      <div class="modal-section">
        <div class="modal-section-label">Art des Angebots</div>
        <p>Dieses Dataset ist ein <strong style="color:var(--ink)">nicht-kommerzielles Forschungsprojekt</strong> ohne wirtschaftliches Interesse. Es werden keine Einnahmen erzielt, keine Werbung geschaltet und keine Dienstleistungen angeboten. Eine Impressumspflicht nach §5 TMG besteht für rein private, nicht-kommerzielle Angebote nicht.</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">Datenerhebung</div>
        <p>Diese Website erhebt <strong style="color:var(--ink)">keine personenbezogenen Daten</strong>. Es werden keine Cookies gesetzt, kein Tracking durchgeführt und keine Analysedienste eingesetzt. Die einzige gespeicherte Information ist ein lokales Flag im Browser (localStorage) — dieses verlässt nie deinen Browser.</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">Hosting</div>
        <p>Die Seite wird über <strong style="color:var(--ink)">GitHub Pages</strong> (GitHub Inc., San Francisco, USA) ausgeliefert. GitHub verarbeitet technisch notwendige Verbindungsdaten (IP, Zeitstempel). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" class="inline-link">GitHub Datenschutzerklärung →</a></p>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">Externe Ressourcen</div>
        <p>Diese Website lädt <strong style="color:var(--ink)">keine externen Ressourcen</strong>. Alle Schriftarten werden lokal ausgeliefert. Kein Datenaustausch mit Google, CDNs oder Drittanbietern.</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">Urheberrecht</div>
        <p>Lizenz: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" class="inline-link">CC-BY-4.0</a>. Nutzung mit Quellenangabe gestattet.</p>
      </div>`,

    category_labels: {
      psychology:   'Psychologie',
      environment:  'Umwelt',
      urban:        'Stadtraum',
      economy:      'Wirtschaft',
      health:       'Gesundheit',
      culture:      'Kultur',
      equity:       'Gerechtigkeit',
      regulation:   'Regulierung',
      resources:    'Ressourcen',
      politics:     'Politik',
      safety:       'Verkehrssicherheit',
      privacy:      'Datenschutz',
      alternatives: 'Alternativen',
      quotes:       'Zitate',
    },
  },

  en: {
    db_button:          'Database',
    dataset_title:      'Dataset',
    search_placeholder: 'Search…',
    all_categories:     'All categories',
    privacy_label:      'Privacy',
    source_label:       'Source',
    independent_label:  'Independent · No industry funding',
    open_source_link:   'Open source →',
    impact_label:       'Impact',
    severity_critical:  'CRITICAL',
    severity_elevated:  'ELEVATED',
    severity_medium:    'MEDIUM',
    severity_low:       'LOW',
    finding_label:      'Finding',
    subject_label:      'Subject',
    zusammenfassung:    'Summary',
    kernbefund:         'Key Finding',
    quote_deutung:      'Quote / Interpretation / Note',
    relevanz:           'Relevance for OOH Advertising',
    cookie_text:        'This site uses no cookies and no tracking. All resources are served locally.',
    cookie_ok:          'OK',
    info_button:    'Info',
    info_title:     'About this Dataset',
    info_about:     'Machine-readable research dataset on risks of out-of-home and digital out-of-home advertising (OOH/DOOH). It aggregates empirical claims from research, public institutions, courts, international organizations, and independent investigations, plus separate quote contexts for cultural and ethical framing.',
    info_stats:     'Key Figures',
    info_cats_head: 'Categories',
    info_claims_label:  'Research Claims',
    info_records_label: 'Total Records',
    info_quotes_label:  'Quote Contexts',
    info_cats_label:    'Categories',
    info_avg_label:     'Avg. Impact Score',
    info_high_label:    'High-Impact (≥8)',
    info_period_label:  'Period',
    info_sources_label: 'URL Audit',
    info_agent_files:   'Agent Files',
    info_quality_note:  'Quote contexts are cultural/ethical framing, not empirical proof. For high-stakes use, check source URLs and DATA_QUALITY.md.',
    info_use_head:      'Recommended Use',
    info_use_1_title:   'Search quickly',
    info_use_1_text:    'Open the database, filter by topic, claim ID, or category, then inspect the detail view with source links.',
    info_use_2_title:   'Feed agents',
    info_use_2_text:    'For AI workflows, start with digest.json or rag-chunks.jsonl, then cite the original claim file.',
    info_use_3_title:   'Check quality',
    info_use_3_text:    'For legal, financial, or policy use, check DATA_QUALITY.md, SOURCES_POLICY.md, and original source URLs.',
    info_status_head:   'Release Status',
    info_status_text:   'Latest local audit: 0 broken URLs, 115 single-source claims marked as an improvement target.',
    content_lang_note:  'Content in German',

    privacy_html: `
      <div class="modal-badges"><span class="badge">Privacy Policy</span></div>
      <h2 class="modal-title">Privacy Policy</h2>
      <div class="modal-section">
        <div class="modal-section-label">Nature of this project</div>
        <p>This dataset is a <strong style="color:var(--ink)">non-commercial research project</strong> with no economic interest. No revenue is generated, no advertising is displayed, and no services are offered.</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">Data collection</div>
        <p>This website collects <strong style="color:var(--ink)">no personal data</strong>. No cookies are set, no tracking is performed, and no analytics services are used. The only stored information is a local browser flag (localStorage) indicating whether the notice was dismissed — this never leaves your browser.</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">Hosting</div>
        <p>This site is served via <strong style="color:var(--ink)">GitHub Pages</strong> (GitHub Inc., San Francisco, USA). GitHub processes technically necessary connection data (IP address, timestamp). Legal basis: legitimate interest (Art. 6(1)(f) GDPR). <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" class="inline-link">GitHub Privacy Statement →</a></p>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">External resources</div>
        <p>This website loads <strong style="color:var(--ink)">no external resources</strong>. All fonts are served locally. No data exchange with Google, CDNs, or third parties.</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">License</div>
        <p>License: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" class="inline-link">CC-BY-4.0</a>. Free to use with attribution.</p>
      </div>`,

    category_labels: {
      psychology:   'Psychology',
      environment:  'Environment',
      urban:        'Urban Space',
      economy:      'Economy',
      health:       'Public Health',
      culture:      'Culture',
      equity:       'Equity',
      regulation:   'Regulation',
      resources:    'Resources',
      politics:     'Politics',
      safety:       'Traffic Safety',
      privacy:      'Privacy',
      alternatives: 'Alternatives',
      quotes:       'Quotes',
    },
  },
};

// ── Language resolution ──────────────────────────
function detectLang() {
  const stored = localStorage.getItem('lang');
  if (stored && TRANSLATIONS[stored]) return stored;
  const browser = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
  return TRANSLATIONS[browser] ? browser : 'en';
}

let currentLang = detectLang();

function t(key) {
  return TRANSLATIONS[currentLang][key] ?? TRANSLATIONS['en'][key] ?? key;
}

function categoryLabel(cat) {
  return TRANSLATIONS[currentLang].category_labels[cat]
      ?? TRANSLATIONS['en'].category_labels[cat]
      ?? cat;
}

function setLang(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  applyTranslations();
  document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

function applyTranslations() {
  // text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  // placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  // category filter first option
  const allOpt = document.querySelector('#category-filter option[value="all"]');
  if (allOpt) allOpt.textContent = t('all_categories');
  // active lang button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('lang-active', btn.dataset.lang === currentLang);
  });
}

// init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
});
