// scripts/seedMaterials.js
// Run with: node scripts/seedMaterials.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// ─── Supabase client (service role for unrestricted insert) ───────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role bypasses RLS for seeding
);

// ─── 10 Foundational Polymers — Indian Industry Data ─────────────────────────
const materials = [
  {
    name: 'Polypropylene (PP)',
    family: 'Polyolefin',
    density: 0.91,
    melt_temp: '160–170°C',
    tensile_strength: '30–40 MPa',
    top_applications: [
      'Woven sacks and FIBC bags',
      'Automobile bumpers and dashboards',
      'Pipes and fittings',
      'Packaging films and containers',
      'Furniture and crates',
    ],
    indian_trade_names: [
      'Repol (Reliance Industries)',
      'Koylene (IPCL)',
      'Moplen (LyondellBasell India)',
      'Hifill (Supreme Petrochem)',
      'GAIL PP',
    ],
    is_premium: false,
  },
  {
    name: 'High-Density Polyethylene (HDPE)',
    family: 'Polyolefin',
    density: 0.95,
    melt_temp: '120–140°C',
    tensile_strength: '25–35 MPa',
    top_applications: [
      'Water supply and drainage pipes',
      'Milk and juice bottles',
      'Industrial drums and tanks',
      'Crates and pallets',
      'Geomembranes for water bodies',
    ],
    indian_trade_names: [
      'Relene HDPE (Reliance Industries)',
      'GAIL HDPE',
      'ONGC HDPE',
      'Lupolen (BASF India)',
      'Hostalen (LyondellBasell India)',
    ],
    is_premium: false,
  },
  {
    name: 'Low-Density Polyethylene (LDPE)',
    family: 'Polyolefin',
    density: 0.92,
    melt_temp: '105–115°C',
    tensile_strength: '8–15 MPa',
    top_applications: [
      'Carry bags and packaging films',
      'Squeeze bottles and lids',
      'Agricultural mulch films',
      'Flexible tubing',
      'Lamination and coating',
    ],
    indian_trade_names: [
      'Relene LD (Reliance Industries)',
      'GAIL LDPE',
      'Indothene (DCM Shriram)',
      'Lupolen LD (BASF India)',
      'IPCL LDPE',
    ],
    is_premium: false,
  },
  {
    name: 'Polyvinyl Chloride (PVC)',
    family: 'Vinyl',
    density: 1.40,
    melt_temp: '160–180°C',
    tensile_strength: '45–55 MPa',
    top_applications: [
      'Water supply and sewage pipes',
      'Window and door profiles (uPVC)',
      'Electrical wire and cable insulation',
      'Footwear soles and flooring',
      'Medical tubes and blood bags',
    ],
    indian_trade_names: [
      'Finolex PVC (Finolex Industries)',
      'Supreme PVC (Supreme Industries)',
      'Astral PVC (Astral Pipes)',
      'Chemplast PVC (Chemplast Sanmar)',
      'DCW PVC (DCW Ltd)',
    ],
    is_premium: false,
  },
  {
    name: 'Acrylonitrile Butadiene Styrene (ABS)',
    family: 'Styrenic',
    density: 1.05,
    melt_temp: '220–240°C',
    tensile_strength: '40–50 MPa',
    top_applications: [
      'Consumer electronics housings',
      'Automobile interior trims',
      'Refrigerator liners',
      'Helmets and safety equipment',
      'Toys and LEGO-type bricks',
    ],
    indian_trade_names: [
      'Absolac (INEOS Styrolution India)',
      'Terluran (BASF India)',
      'Royalac (Chi Mei India)',
      'Kumho ABS (Kumho Petrochemical India)',
      'LG ABS (LG Chem India)',
    ],
    is_premium: false,
  },
  {
    name: 'Polycarbonate (PC)',
    family: 'Engineering Thermoplastic',
    density: 1.20,
    melt_temp: '260–300°C',
    tensile_strength: '55–65 MPa',
    top_applications: [
      'Safety helmets and riot shields',
      'Optical lenses and eyewear',
      'Water dispensing bottles (20L)',
      'Electrical switchgear housings',
      'Greenhouse and roofing sheets',
    ],
    indian_trade_names: [
      'Lexan (SABIC India)',
      'Makrolon (Covestro India)',
      'Calibre (Trinseo India)',
      'Wonderlite (Chi Mei India)',
      'Panlite (Teijin India)',
    ],
    is_premium: false,
  },
  {
    name: 'Polyamide 6 (Nylon 6)',
    family: 'Engineering Thermoplastic',
    density: 1.14,
    melt_temp: '220–240°C',
    tensile_strength: '70–85 MPa',
    top_applications: [
      'Gears, bearings and bushings',
      'Textile and tyre cord fibres',
      'Fuel lines and intake manifolds',
      'Zip fasteners and buckles',
      'Fishing nets and ropes',
    ],
    indian_trade_names: [
      'Ultramid B (BASF India)',
      'Durethan (Lanxess India)',
      'Akulon (DSM India)',
      'Wellamid (Well Plastics)',
      'SRF Nylon 6 (SRF Ltd)',
    ],
    is_premium: false,
  },
  {
    name: 'Polyethylene Terephthalate (PET)',
    family: 'Polyester',
    density: 1.38,
    melt_temp: '255–280°C',
    tensile_strength: '75–85 MPa',
    top_applications: [
      'Beverage and mineral water bottles',
      'Polyester textile fibres',
      'Food-grade packaging trays',
      'Photographic and X-ray films',
      'Strapping tapes for packaging',
    ],
    indian_trade_names: [
      'Indorama PET (Indorama Ventures India)',
      'JBF PET (JBF Industries)',
      'Reliance PET (Reliance Industries)',
      'SENPET (Senpet Synthetics)',
      'IOCL PET (Indian Oil Corporation)',
    ],
    is_premium: false,
  },
  {
    name: 'Polyoxymethylene (POM / Acetal)',
    family: 'Engineering Thermoplastic',
    density: 1.42,
    melt_temp: '175–195°C',
    tensile_strength: '60–70 MPa',
    top_applications: [
      'Precision gears and cams',
      'Door handles and lock mechanisms',
      'Aerosol and pump components',
      'Conveyor belt links',
      'Insulin pens and medical devices',
    ],
    indian_trade_names: [
      'Delrin (DuPont India)',
      'Ultraform (BASF India)',
      'Hostaform (Celanese India)',
      'Kepital (Korea Engineering Plastics India)',
      'Tecaform (Ensinger India)',
    ],
    is_premium: false,
  },
  {
    name: 'Polytetrafluoroethylene (PTFE / Teflon)',
    family: 'Fluoropolymer',
    density: 2.20,
    melt_temp: '327°C',
    tensile_strength: '20–30 MPa',
    top_applications: [
      'Non-stick cookware coatings',
      'Chemical plant seals and gaskets',
      'Electrical wire insulation (high temp)',
      'Bearing pads and slide plates',
      'Laboratory equipment liners',
    ],
    indian_trade_names: [
      'Teflon (Chemours India)',
      'Dyneon PTFE (3M India)',
      'Fluon (AGC Chemicals India)',
      'Gujarat Fluorochemicals PTFE (GFL)',
      'SRF PTFE (SRF Fluorochemicals)',
    ],
    is_premium: false,
  },
  {
    name: 'Polyether Ether Ketone (PEEK)',
    family: 'Engineering Thermoplastic',
    density: 1.32,
    melt_temp: '343°C',
    tensile_strength: '100 MPa',
    top_applications: [
      'Aerospace structural parts',
      'Medical implants',
      'Semiconductor components',
      'Oil & gas seals',
    ],
    indian_trade_names: [
      'Victrex PEEK',
      'KetaSpire (Solvay India)',
      'Vestakeep (Evonik India)',
    ],
    is_premium: true,
  },
  {
    name: 'Polylactic Acid (PLA)',
    family: 'Bioplastic',
    density: 1.24,
    melt_temp: '150–175°C',
    tensile_strength: '50–70 MPa',
    top_applications: [
      'Compostable food packaging',
      'Cutlery and dinnerware',
      '3D printing filament',
      'Disposable cups and plates',
    ],
    indian_trade_names: [
      'NatureWorks PLA',
      'Ingeo (distributors in India)',
      'Ecogreen Bioplastics',
    ],
    is_premium: false,
  },
  {
    name: 'Natural Rubber (NR)',
    family: 'Elastomer',
    density: 0.92,
    melt_temp: '36°C (gum)',
    tensile_strength: '20–35 MPa',
    top_applications: [
      'Automotive tyre treads and sidewalls',
      'Conveyor belts and hoses',
      'Latex gloves and contraceptives',
      'Engine mounts and vibration isolators',
      'Footwear soles',
    ],
    indian_trade_names: [
      'ISNR (Indian Standard Natural Rubber)',
      'RMA Grades (Ribbed Smoked Sheets)',
      'Pale Latex Crepe',
    ],
    is_premium: false,
  },
  {
    name: 'Styrene-Butadiene Rubber (SBR)',
    family: 'Elastomer',
    density: 0.94,
    melt_temp: 'Amorphous',
    tensile_strength: '15–25 MPa',
    top_applications: [
      'Passenger car tyre treads',
      'Conveyor belts',
      'Shoe soles and heels',
      'Adhesives and chewing gum',
      'Moulded rubber goods',
    ],
    indian_trade_names: [
      'Apresar (Synthetics & Chemicals)',
      'Synaprene SBR',
      'Kumho SBR (imported)',
    ],
    is_premium: false,
  },
  {
    name: 'Ethylene Propylene Diene Monomer (EPDM)',
    family: 'Elastomer',
    density: 0.88,
    melt_temp: 'Amorphous',
    tensile_strength: '10–20 MPa',
    top_applications: [
      'Automotive window seals and weatherstripping',
      'Radiator and heater hoses',
      'Roofing membranes (single-ply)',
      'O-rings and gaskets',
      'Wire and cable jacketing (outdoor)',
    ],
    indian_trade_names: [
      'Keltan (Arlanxeo India)',
      'Vistalon (ExxonMobil India)',
      'Nordel (Dow India)',
    ],
    is_premium: true,
  },
];

// ─── Seed function ─────────────────────────────────────────────────────────────
async function seedMaterials() {
  console.log('🚀 PolymerHub — Starting materials seed...\n');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables.');
    console.error('   Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
  }

  console.log(`📦 Inserting ${materials.length} materials into public.materials...\n`);

  const { data, error } = await supabase
    .from('materials')
    .upsert(materials, {
      onConflict: 'name',       // skip duplicates if re-run
      ignoreDuplicates: false,  // update existing rows on re-run
    })
    .select();

  if (error) {
    console.error('❌ Seed failed:');
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Details: ${error.details}`);
    process.exit(1);
  }

  console.log('✅ Materials seeded successfully!\n');
  console.log('📊 Records inserted/updated:');
  data.forEach((m, i) => {
    console.log(`   ${i + 1}. ${m.name} (${m.family})`);
  });

  console.log(`\n🎉 Done! ${data.length} materials are live in your Supabase database.`);
  console.log('   → Check Supabase Table Editor → materials to verify.\n');
}

seedMaterials();
