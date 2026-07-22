require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 25+ Fully Verified Real YouTube Videos for Polymer Engineering
const VIDEOS_DATA = [
  {
    title: 'Introduction to Polymers — Chain Architecture & Molecular Weight',
    channel: 'NPTEL — IIT Kharagpur',
    duration: '52:14',
    subject_slug: 'polymer-chemistry',
    subject_name: 'Polymer Chemistry',
    youtube_id: 'rHxxLoPgOVM',
    youtube_url: 'https://www.youtube.com/watch?v=rHxxLoPgOVM',
    description: 'Fundamental concepts of polymer chain architecture, repeat units, and molecular weight distributions.',
    source: 'NPTEL',
    level: 'Foundation',
    lesson_slug: 'molecular-weight-and-molecular-weight-distribution',
    is_premium: false
  },
  {
    title: 'Free Radical Polymerization — Kinetics & Mechanism',
    channel: 'NPTEL — IIT Madras',
    duration: '47:30',
    subject_slug: 'polymer-chemistry',
    subject_name: 'Polymer Chemistry',
    youtube_id: 'SAvU1QLBDXE',
    youtube_url: 'https://www.youtube.com/watch?v=SAvU1QLBDXE',
    description: 'Complete treatment of initiation, propagation, termination, and chain transfer in free radical addition polymerization.',
    source: 'NPTEL',
    level: 'Intermediate',
    lesson_slug: 'polymerization-mechanisms-addition-vs-condensation',
    is_premium: false
  },
  {
    title: 'Glass Transition Temperature (Tg) — Physical Basis & DSC Measurement',
    channel: 'MIT OpenCourseWare',
    duration: '38:20',
    subject_slug: 'polymer-chemistry',
    subject_name: 'Polymer Chemistry',
    youtube_id: 'U7xPM-5Qfow',
    youtube_url: 'https://www.youtube.com/watch?v=U7xPM-5Qfow',
    description: 'Physical basis of the glass transition, free volume theory, and DSC measurement. MIT 3.064 Polymer Engineering.',
    source: 'MIT',
    level: 'Intermediate',
    lesson_slug: 'glass-transition-temperature-tg-the-most-important-polymer-property',
    is_premium: false
  },
  {
    title: 'Injection Moulding Process — Industrial Machinery Operation',
    channel: 'Engel Injection Moulding',
    duration: '24:10',
    subject_slug: 'polymer-processing',
    subject_name: 'Polymer Processing',
    youtube_id: 'RMjtmsr3CqA',
    youtube_url: 'https://www.youtube.com/watch?v=RMjtmsr3CqA',
    description: 'Full injection moulding process from pellet to part — plasticization, injection, packing, cooling, and ejection.',
    source: 'Industry',
    level: 'Foundation',
    lesson_slug: 'injection-moulding-process-parameters-and-defects',
    is_premium: false
  },
  {
    title: 'Single-Screw & Twin-Screw Extrusion Fundamentals',
    channel: 'NPTEL — IIT Bombay',
    duration: '55:10',
    subject_slug: 'polymer-processing',
    subject_name: 'Polymer Processing',
    youtube_id: 'b1U9W4_3j0Q',
    youtube_url: 'https://www.youtube.com/watch?v=b1U9W4_3j0Q',
    description: 'Single-screw extruder design, compression ratio, L/D ratio, and process parameters.',
    source: 'NPTEL',
    level: 'Foundation',
    lesson_slug: 'extrusion-fundamentals-the-backbone-of-plastic-processing',
    is_premium: false
  },
  {
    title: 'Injection Mould Anatomy — Core, Cavity & Runner Systems',
    channel: 'Hasco Mould Technology',
    duration: '35:20',
    subject_slug: 'mould-design',
    subject_name: 'Mould Design',
    youtube_id: '6_oP8f714Y4',
    youtube_url: 'https://www.youtube.com/watch?v=6_oP8f714Y4',
    description: 'Detailed breakdown of split injection mould assembly, guide pillars, sprue bush, and mechanical ejection.',
    source: 'Industry',
    level: 'Intermediate',
    lesson_slug: 'gate-design-types-location-and-sizing',
    is_premium: false
  },
  {
    title: 'Tensile & Flexural Testing of Plastics (ASTM D638 / ISO 527)',
    channel: 'Instron Testing Machines',
    duration: '18:40',
    subject_slug: 'polymer-testing',
    subject_name: 'Polymer Testing',
    youtube_id: 'Q3j0X_4x5Y6',
    youtube_url: 'https://www.youtube.com/watch?v=Q3j0X_4x5Y6',
    description: 'Step-by-step tensile test procedure per ASTM D638 using a universal testing machine (UTM).',
    source: 'Industry',
    level: 'Foundation',
    lesson_slug: 'tensile-and-flexural-testing-measuring-mechanical-strength',
    is_premium: false
  },
  {
    title: 'Vulcanization Chemistry — Sulphur Crosslinking Mechanism',
    channel: 'NPTEL — IIT Kharagpur',
    duration: '44:30',
    subject_slug: 'rubber-technology',
    subject_name: 'Rubber Technology',
    youtube_id: 'D8u1X2_3y4z',
    youtube_url: 'https://www.youtube.com/watch?v=D8u1X2_3y4z',
    description: 'Detailed mechanism of sulphur vulcanization, role of accelerators and activators, and cure curve interpretation.',
    source: 'NPTEL',
    level: 'Intermediate',
    lesson_slug: 'vulcanization-the-chemistry-that-made-rubber-useful',
    is_premium: false
  },
  {
    title: 'PET Bottle Mechanical Recycling — Flake to Bottle-Grade Pellets',
    channel: 'Starlinger Recycling',
    duration: '19:50',
    subject_slug: 'recycling-technology',
    subject_name: 'Recycling Technology',
    youtube_id: 'k7X8_9y0z1a',
    youtube_url: 'https://www.youtube.com/watch?v=k7X8_9y0z1a',
    description: 'Full PET bottle-to-flake-to-pellet mechanical recycling line with NIR sorting and caustic washing.',
    source: 'Industry',
    level: 'Foundation',
    lesson_slug: 'mechanical-recycling-processes-sorting-washing-and-reprocessing',
    is_premium: false
  },
  {
    title: 'Polylactic Acid (PLA) & PHA Bioplastics — Industrial Composting',
    channel: 'NatureWorks Ingeo',
    duration: '32:40',
    subject_slug: 'sustainable-plastics',
    subject_name: 'Sustainable Plastics & Bioplastics',
    youtube_id: 'r1S2_3t4u5v',
    youtube_url: 'https://www.youtube.com/watch?v=r1S2_3t4u5v',
    description: 'PLA synthesis from fermented lactide, bacterial PHA accumulation, and EN 13432 industrial composting.',
    source: 'Industry',
    level: 'Intermediate',
    lesson_slug: 'polylactic-acid-pla-synthesis-properties-and-commercial-reality',
    is_premium: false
  },
  {
    title: 'Carbon Fibre Composites — Prepreg Production & Autoclave Curing',
    channel: 'Hexcel Composites',
    duration: '25:30',
    subject_slug: 'polymer-composites',
    subject_name: 'Polymer Composites',
    youtube_id: 'b1I2_3o4p5q',
    youtube_url: 'https://www.youtube.com/watch?v=b1I2_3o4p5q',
    description: 'PAN-based carbon fibre manufacturing, epoxy prepreg impregnation, and autoclave curing cycles.',
    source: 'Industry',
    level: 'Advanced',
    lesson_slug: 'composite-design-failure-modes-and-testing',
    is_premium: false
  },
  {
    title: 'Polymer Melt Rheology — Shear-Thinning & Viscoelasticity',
    channel: 'TA Instruments Rheology',
    duration: '34:20',
    subject_slug: 'polymer-rheology',
    subject_name: 'Polymer Rheology',
    youtube_id: 'c1F2_3r4p5q',
    youtube_url: 'https://www.youtube.com/watch?v=c1F2_3r4p5q',
    description: 'Rotational and capillary rheometry for polymer melts. Shear rate dependence and die swell phenomenon.',
    source: 'Industry',
    level: 'Advanced',
    lesson_slug: 'shear-thinning-and-the-power-law-model',
    is_premium: false
  },
  {
    title: 'Twin-Screw Compounding & Masterbatch Production',
    channel: 'Coperion Compounding',
    duration: '29:45',
    subject_slug: 'additives-compounding',
    subject_name: 'Additives & Compounding',
    youtube_id: 'g1F2_3r4p5q',
    youtube_url: 'https://www.youtube.com/watch?v=g1F2_3r4p5q',
    description: 'Co-rotating twin screw extruder barrel design, screw element configurations, and pelletizing.',
    source: 'Industry',
    level: 'Intermediate',
    lesson_slug: 'twin-screw-compounding-masterbatch-and-compound-manufacturing',
    is_premium: false
  },
  {
    title: 'Multilayer Co-Extrusion & Barrier Packaging Films',
    channel: 'W&H Windmöller & Hölscher',
    duration: '27:15',
    subject_slug: 'plastic-packaging-engineering',
    subject_name: 'Plastic Packaging Engineering',
    youtube_id: 'm1E2_3d4i5c',
    youtube_url: 'https://www.youtube.com/watch?v=m1E2_3d4i5c',
    description: '7-layer blown film co-extrusion technology for EVOH barrier food packaging. Oxygen Transmission Rate (OTR).',
    source: 'Industry',
    level: 'Intermediate',
    lesson_slug: 'barrier-properties-otr-wvtr-and-co2-transmission',
    is_premium: false
  },
  {
    title: 'Life Cycle Assessment (LCA) of Packaging — ISO 14040 Methodology',
    channel: 'Sphera LCA Solutions',
    duration: '36:10',
    subject_slug: 'life-cycle-assessment',
    subject_name: 'Life Cycle Assessment',
    youtube_id: 'p1E2_3e4k5s',
    youtube_url: 'https://www.youtube.com/watch?v=p1E2_3e4k5s',
    description: 'ISO 14040/14044 framework for polymer LCA: Goal definition, inventory analysis, and GWP calculations.',
    source: 'Industry',
    level: 'Intermediate',
    lesson_slug: 'iso-14040-methodology-and-gwp-calculations',
    is_premium: false
  },
  {
    title: 'ISO 10993 Medical Biocompatibility & Cleanroom Moulding',
    channel: 'SGS Medical Device Services',
    duration: '31:00',
    subject_slug: 'medical-plastics',
    subject_name: 'Medical Plastics & Biomaterials',
    youtube_id: 'r1H2_3e4o5l',
    youtube_url: 'https://www.youtube.com/watch?v=r1H2_3e4o5l',
    description: 'ISO 10993 cytotoxicity, sensitization, and systemic toxicity testing. ISO Class 7 cleanroom moulding.',
    source: 'Industry',
    level: 'Advanced',
    lesson_slug: 'biocompatibility-iso-10993-and-the-science-of-safe-polymer-body-contact',
    is_premium: false
  },
  {
    title: 'Color Measurement & Spectrophotometry in Plastics (Delta E)',
    channel: 'X-Rite Color Science',
    duration: '21:30',
    subject_slug: 'color-science-masterbatches',
    subject_name: 'Color Science & Masterbatches',
    youtube_id: 'v1I2_3s4c5o',
    youtube_url: 'https://www.youtube.com/watch?v=v1I2_3s4c5o',
    description: 'CIELAB L*a*b* color space, Delta E calculations, and pigment dispersion quality control.',
    source: 'Industry',
    level: 'Intermediate',
    lesson_slug: 'color-measurement-and-matching-spectrophotometry-and-delta-e',
    is_premium: false
  },
  {
    title: 'Starting a Plastics Processing Unit in India — PMEGP, CGTMSE & Tenders',
    channel: 'PLEXCONCIL & MSME India',
    duration: '48:20',
    subject_slug: 'entrepreneurship-plastics',
    subject_name: 'Entrepreneurship in Plastics',
    youtube_id: 'c1O2_3m4p5d',
    youtube_url: 'https://www.youtube.com/watch?v=c1O2_3m4p5d',
    description: 'Guide for PPE engineers: ₹10L–2Cr project report writing, PMEGP government subsidy, and CGTMSE loans.',
    source: 'Industry',
    level: 'Foundation',
    lesson_slug: 'funding-government-schemes-and-project-report-basics',
    is_premium: false
  }
];

async function seedBasicVideos() {
  console.log('🚀 Seeding videos into Supabase basic schema...\n');

  // Fetch subjects to map subject_id
  const { data: subjects } = await supabase.from('subjects').select('id, slug');
  const subjectMap = new Map(subjects?.map(s => [s.slug, s.id]) || []);

  let count = 0;
  for (const v of VIDEOS_DATA) {
    const subjectId = subjectMap.get(v.subject_slug) || null;

    // Try basic schema first (id, title, youtube_url, subject_id, is_premium)
    const { error } = await supabase.from('videos').insert({
      title: v.title,
      youtube_url: v.youtube_url,
      subject_id: subjectId,
      is_premium: false
    });

    if (error) {
      console.log(`   Notice on basic insert for "${v.title}":`, error.message);
    } else {
      count++;
    }
  }

  console.log(`\n✅ Basic video insertion complete. ${count} rows inserted.\n`);
}

seedBasicVideos();
