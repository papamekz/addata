// Kompiliert alle addata MD-Dateien → upload/data/facts-de.json
const fs = require('fs');
const path = require('path');

const CATEGORY_LABELS = {
  psychology: 'Psychologie',
  environment: 'Umwelt',
  urban: 'Stadtraum',
  economy: 'Wirtschaft',
  health: 'Gesundheit',
  culture: 'Kultur',
  equity: 'Gerechtigkeit',
  regulation: 'Regulierung',
  resources: 'Ressourcen',
  politics: 'Politik',
  safety: 'Verkehr',
  privacy: 'Privatsphäre',
  alternatives: 'Alternativen'
};

function parseMd(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;
  const fm = frontmatterMatch[1];
  const body = content.slice(frontmatterMatch[0].length);

  // Parse frontmatter fields
  const get = (key) => {
    const m = fm.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, 'm'));
    return m ? m[1].trim() : null;
  };
  const getNum = (key) => {
    const m = fm.match(new RegExp(`^${key}:\\s*(\\d+)`, 'm'));
    return m ? parseInt(m[1]) : null;
  };

  // Parse nested source fields
  const sourceTitle = fm.match(/^  title:\s*"?([^"\n]+)"?/m)?.[1]?.trim();
  const sourceYear = fm.match(/^  year:\s*(\d+)/m)?.[1];
  const sourceUrl = fm.match(/^  url:\s*"?([^"\n]+)"?/m)?.[1]?.trim();
  const sourceInstitution = fm.match(/^  institution:\s*"?([^"\n]+)"?/m)?.[1]?.trim();

  // Parse markdown sections
  const getSection = (heading) => {
    const m = body.match(new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`));
    return m ? m[1].trim() : '';
  };

  return {
    id: get('id'),
    title: get('title'),
    category: get('category'),
    categoryLabel: CATEGORY_LABELS[get('category')] || get('category'),
    impact_score: getNum('impact_score'),
    source: {
      title: sourceTitle || '',
      institution: sourceInstitution || '',
      year: sourceYear ? parseInt(sourceYear) : null,
      url: sourceUrl || ''
    },
    zusammenfassung: getSection('Zusammenfassung'),
    kernbefund: getSection('Kernbefund'),
    relevanz: getSection('Relevanz für Außenwerbung')
  };
}

// Alle MD-Dateien aus data/ sammeln
const dataDir = path.join(__dirname, 'data');
const facts = [];

function walkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full);
    } else if (entry.name.endsWith('.md') && entry.name !== 'organizations.md') {
      const content = fs.readFileSync(full, 'utf8');
      const parsed = parseMd(content);
      if (parsed && parsed.id && parsed.title && parsed.kernbefund) {
        facts.push(parsed);
      }
    }
  }
}

walkDir(dataDir);

// Nach impact_score sortieren (höchste zuerst), dann nach id
facts.sort((a, b) => (b.impact_score || 0) - (a.impact_score || 0) || a.id.localeCompare(b.id));

const output = {
  version: '1.0',
  generated: new Date().toISOString().split('T')[0],
  total: facts.length,
  facts
};

const outPath = path.join(__dirname, 'upload', 'data', 'facts-de.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`Fertig: ${facts.length} Fakten → ${outPath}`);
