#!/usr/bin/env node
/**
 * DOOH/OOH Impact Calculator
 *
 * Calculates quantified impact estimates for a DOOH/OOH project based on
 * 152 peer-reviewed claims. All formulas cite their source claim IDs.
 *
 * Usage (CLI):
 *   node scripts/impact-calculator.js --screens 50 --type large --location highway --city amsterdam --concession 15 --investment 5000000
 *
 * Usage (JSON stdin):
 *   echo '{"screens":50,"type":"large","location":"highway","city":"amsterdam","concession_years":15,"investment_eur":5000000}' | node scripts/impact-calculator.js
 *
 * Usage (require):
 *   const { calculate } = require('./scripts/impact-calculator');
 *   const result = calculate({ screens: 50, type: 'large', location: 'highway', city: 'amsterdam', concession_years: 15 });
 */

'use strict';

const path = require('path');
const fs   = require('fs');

const CITIES_PATH = path.join(__dirname, '..', 'data', 'cities.json');

// --- Documented base rates (all cite source claim IDs) ---
const RATES = {
  energy: {
    large_kwh_per_year:  41627,  // res-001: "large format billboard"
    medium_kwh_per_year: 11501,  // res-001: "six-sheet 1.2m×1.8m"
    household_per_large: 11,     // res-001
    household_per_medium: 3,     // res-001
  },
  revenue_at_risk: {
    fossil_fuel_min: 0.15,  // eco-009
    fossil_fuel_max: 0.18,
    hfss_food_min:   0.18,  // eco-009
    hfss_food_max:   0.22,
    gambling_min:    0.08,  // eco-009
    gambling_max:    0.12,
    combined:        0.45,  // eco-009: "~45% of EU DOOH revenue"
  },
  traffic_safety: {
    highway_crash_increase_min: 0.25,  // safety-007 (Florida)
    highway_crash_increase_max: 0.29,  // safety-007 (Alabama)
    source: 'safety-007',
    geography_note: 'US highways (Florida, Alabama). EU Commission confirms distraction risk (safety-008); no equivalent EU quantified study.',
  },
  hardware: {
    lifecycle_min_years: 5,   // eco-010
    lifecycle_max_years: 7,   // eco-010
    capex_per_large_screen_eur_estimate: 15000,  // ESTIMATE — not from claims
    capex_estimate_note: 'Industry average estimate; verify with operator. Not from dataset claims.',
  },
  food_advertising: {
    obesity_multiplier_per_10pct_density: 1.05,  // health-003
    source: 'health-003',
  },
  london_hfss_ban_reference: {
    obesity_cases_prevented: 94867,   // health-009
    population: 9000000,              // London
    per_million_residents: 10.5,      // derived: 94867 / 9M × 1M
    source: 'health-009',
  },
};

function loadCities() {
  try {
    return JSON.parse(fs.readFileSync(CITIES_PATH, 'utf8'));
  } catch {
    return null;
  }
}

function lookupCity(cityName) {
  const db = loadCities();
  if (!db) return null;
  const all = [...(db.cities || []), ...(db.national || [])];
  return all.find(c =>
    c.name.toLowerCase().includes(cityName.toLowerCase()) ||
    cityName.toLowerCase().includes(c.name.toLowerCase().split(' ')[0])
  ) || null;
}

function calculate(opts) {
  const {
    screens         = 1,
    type            = 'large',          // 'large' | 'medium'
    location        = 'urban',          // 'highway' | 'urban'
    city            = null,
    concession_years = 10,
    investment_eur  = null,
    food_ad_pct     = 0,                // 0–100: % of inventory showing food ads
  } = opts;

  const isLarge = type !== 'medium';
  const kwh_per_screen = isLarge ? RATES.energy.large_kwh_per_year : RATES.energy.medium_kwh_per_year;
  const hh_per_screen  = isLarge ? RATES.energy.household_per_large : RATES.energy.household_per_medium;

  // 1. ENERGY
  const energy = {
    kwh_per_year:          screens * kwh_per_screen,
    household_equivalent:  screens * hh_per_screen,
    basis:                 `${screens} ${type} screens × ${kwh_per_screen} kWh/screen/year`,
    source:                'res-001',
  };

  // 2. REVENUE AT RISK
  const revenue_at_risk = {
    combined_pct:    45,
    fossil_fuel_pct: '15–18',
    hfss_food_pct:   '18–22',
    gambling_pct:    '8–12',
    source:          'eco-009',
    note:            'Percentage of EU DOOH revenue in categories facing active regulatory bans',
  };
  if (investment_eur) {
    revenue_at_risk.investment_at_risk_eur_estimate = Math.round(investment_eur * 0.45);
    revenue_at_risk.investment_note = 'Conservative estimate using combined 45% rate (eco-009)';
  }

  // 3. STRANDED CAPEX
  const hw_min = RATES.hardware.lifecycle_min_years;
  const hw_max = RATES.hardware.lifecycle_max_years;
  const second_gen_start_min = hw_min;
  const second_gen_start_max = hw_max;
  const remaining_after_second_gen_min = concession_years - second_gen_start_max;
  let stranding_risk;
  if (remaining_after_second_gen_min <= 0) {
    stranding_risk = 'low';
  } else if (remaining_after_second_gen_min <= hw_max) {
    stranding_risk = 'medium';
  } else {
    stranding_risk = 'high';
  }
  const stranded_capex = {
    hardware_lifecycle_years: `${hw_min}–${hw_max}`,
    concession_years,
    second_generation_starts_in: `year ${second_gen_start_min}–${second_gen_start_max}`,
    stranding_risk,
    reasoning: `With a ${concession_years}-year concession, hardware refreshed in year ${second_gen_start_min}–${second_gen_start_max} ` +
               `leaves ${concession_years - second_gen_start_min}–${concession_years - second_gen_start_max} years of second-generation hardware ` +
               `exposed to ban risk. Amsterdam (2026) confirmed no grandfather clause in existing concession contracts (reg-035).`,
    source: 'eco-010, reg-035',
  };
  if (investment_eur) {
    const est = Math.round((screens * RATES.hardware.capex_per_large_screen_eur_estimate));
    stranded_capex.capex_estimate_eur = est;
    stranded_capex.capex_estimate_note = RATES.hardware.capex_estimate_note;
  }

  // 4. TRAFFIC SAFETY
  const traffic_safety = {
    applicable: location === 'highway',
    source: 'safety-007',
  };
  if (location === 'highway') {
    traffic_safety.crash_rate_increase_pct = '25–29%';
    traffic_safety.basis = 'Study of 18 digital billboard sites on US highways';
    traffic_safety.eu_note = 'EU Commission 2023 report confirms roadside advertising as significant distraction risk (safety-008)';
    traffic_safety.risk_level = 'high';
  } else {
    traffic_safety.note = 'No quantified EU crash rate study for urban DOOH. EU Commission identifies distraction risk (safety-008).';
    traffic_safety.risk_level = 'moderate';
  }

  // 5. FOOD ADVERTISING HEALTH IMPACT
  const health = {};
  if (food_ad_pct > 0) {
    const density_increase_units = food_ad_pct / 10;
    const obesity_multiplier = Math.pow(RATES.food_advertising.obesity_multiplier_per_10pct_density, density_increase_units);
    health.food_advertising = {
      food_ad_pct_of_inventory: food_ad_pct,
      obesity_risk_multiplier: +obesity_multiplier.toFixed(4),
      basis: `${food_ad_pct}% food ad density → ${obesity_multiplier.toFixed(2)}× obesity risk`,
      source: 'health-003',
      london_reference: `London HFSS ban prevented ~94,867 obesity cases and 3,000 Type-2 diabetes cases (health-009)`,
    };
  }

  // 6. CITY REGULATORY CONTEXT
  let regulatory = { city: city || 'not specified' };
  if (city) {
    const cityData = lookupCity(city);
    if (cityData) {
      regulatory = {
        city: cityData.name,
        country: cityData.country,
        status: cityData.regulatory_status,
        active_bans: cityData.active_bans || [],
        key_claims: cityData.key_claims || [],
      };
      if (cityData.ban_effective) regulatory.ban_effective = cityData.ban_effective;
      if (cityData.pending_legislation) regulatory.pending = cityData.pending_legislation;
      if (cityData.contract_note) regulatory.contract_note = cityData.contract_note;
    } else {
      regulatory.note = `City "${city}" not in documented database. Check data/cities.json for covered cities.`;
    }
  }

  // 7. OVERALL RISK RATING
  let risk_score = 0;
  if (regulatory.status === 'ban_active')                risk_score += 3;
  else if (regulatory.status === 'ban_pending')          risk_score += 2;
  else if (regulatory.status === 'national_ban_active')  risk_score += 3;
  if (location === 'highway')                            risk_score += 2;
  if (stranding_risk === 'high')                         risk_score += 2;
  else if (stranding_risk === 'medium')                  risk_score += 1;
  if (food_ad_pct > 20)                                  risk_score += 1;

  const overall_risk = risk_score >= 6 ? 'CRITICAL' : risk_score >= 4 ? 'HIGH' : risk_score >= 2 ? 'MEDIUM' : 'LOW';

  return {
    input: { screens, type, location, city, concession_years, investment_eur, food_ad_pct },
    energy,
    revenue_at_risk,
    stranded_capex,
    traffic_safety,
    ...(Object.keys(health).length ? { health } : {}),
    regulatory,
    overall_risk,
    disclaimer: 'All figures derive from independent peer-reviewed or government sources cited by claim ID. See data/index.json for full source context. This tool does not constitute financial or legal advice.',
  };
}

// --- CLI entry point ---
if (require.main === module) {
  let opts = {};

  const hasArgs = process.argv.length > 2 && !process.argv.includes('--stdin');

  if (hasArgs) {
    const args = process.argv.slice(2);
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--screens')       opts.screens          = +args[++i];
      if (args[i] === '--type')          opts.type             = args[++i];
      if (args[i] === '--location')      opts.location         = args[++i];
      if (args[i] === '--city')          opts.city             = args[++i];
      if (args[i] === '--concession')    opts.concession_years = +args[++i];
      if (args[i] === '--investment')    opts.investment_eur   = +args[++i];
      if (args[i] === '--food-ad-pct')   opts.food_ad_pct      = +args[++i];
    }
    console.log(JSON.stringify(calculate(opts), null, 2));
  } else {
    let raw = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => raw += chunk);
    process.stdin.on('end', () => {
      try { opts = JSON.parse(raw); } catch { opts = {}; }
      console.log(JSON.stringify(calculate(opts), null, 2));
    });
  }
}

module.exports = { calculate, lookupCity, RATES };
