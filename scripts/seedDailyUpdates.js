// scripts/seedDailyUpdates.js
// Run with: node scripts/seedDailyUpdates.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const dailyUpdates = [
  {
    headline: 'MIT Engineers Synthesize Self-Healing Biopolymer Derived From Marine Chitin With 45-Minute Ambient Recovery',
    summary: 'New patent maps molecular recovery matrices that heal structural micro-fractures at room temperature. Potential applications in automotive seals, medical implants, and long-life packaging that outlasts traditional thermoset alternatives.',
    source_name: 'MIT Technology Review',
    source_url: 'https://www.technologyreview.com',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
    category: 'Research',
    related_lesson_slug: 'polymer-degradation-and-stabilization',
    related_subject_slug: 'polymer-chemistry',
    is_featured: true
  },
  {
    headline: 'Reliance Industries Adjusts Repol PP Wholesale Pricing Across Gujarat and Maharashtra Distribution Hubs',
    summary: 'Injection-grade Repol PP adjusts by +₹1.20/kg across major hubs. Analysts attribute the shift to Brent Crude gaining overnight on Middle East supply concerns.',
    source_name: 'Chemical Weekly India',
    source_url: 'https://www.chemicalweekly.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
    category: 'Market',
    related_lesson_slug: 'injection-moulding-process-parameters-and-defects',
    related_subject_slug: 'polymer-processing',
    is_featured: false
  },
  {
    headline: 'Carbios PETase Enzyme Trial Enters 10-Tonne Pilot Scale — Chemical Recycling Milestone for Food-Grade PET',
    summary: 'Carbios reports first food-contact-safe rPET from enzymatic depolymerization at pilot scale — the clearest proof yet that closed-loop PET recycling is commercially viable within this decade.',
    source_name: 'Sustainable Plastics',
    source_url: 'https://www.sustainableplastics.com',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
    category: 'Recycling',
    related_lesson_slug: 'enzymatic-and-biological-recycling-the-frontier-technology',
    related_subject_slug: 'recycling-technology',
    is_featured: false
  },
  {
    headline: 'CIPET Launches Advanced Polymer Testing Certification Aligned to BIS IS 13360 Standards',
    summary: 'New 6-week certification covers MFI, DSC/TGA thermal analysis, and tensile/impact testing — directly applicable for QC roles at Finolex, Supreme Industries, and Astral.',
    source_name: 'CIPET Press Office',
    source_url: 'https://www.cipet.gov.in',
    image_url: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&q=80',
    category: 'India',
    related_lesson_slug: 'tensile-and-flexural-testing-measuring-mechanical-strength',
    related_subject_slug: 'polymer-testing',
    is_featured: false
  },
  {
    headline: 'BIS Tightens IS 4984 Compliance Requirements for HDPE Pressure Pipes in Jal Jeevan Mission Projects',
    summary: 'New amendments require third-party testing at BIS-approved labs for all HDPE pipe consignments above 5-tonne — affecting Astral, Prince Pipes, and Finolex directly.',
    source_name: 'Bureau of Indian Standards',
    source_url: 'https://www.bis.gov.in',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
    category: 'Policy',
    related_lesson_slug: 'melt-flow-index-mfi-measurement-significance-and-indian-standards',
    related_subject_slug: 'polymer-testing',
    is_featured: false
  },
  {
    headline: 'IIT Bombay Develops Low-Cost Silica-Carbon Black Hybrid Filler for Green Tyre Compound With 12% Rolling Resistance Reduction',
    summary: 'Breakthrough filler system targets the price barrier slowing silica tyre adoption in India — hybrid compound matches global green tyre performance at 60% of imported silica cost.',
    source_name: 'Journal of Applied Polymer Science',
    source_url: 'https://onlinelibrary.wiley.com/journal/10974628',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    category: 'Research',
    related_lesson_slug: 'rubber-compounding-fillers-carbon-black-and-additives',
    related_subject_slug: 'rubber-technology',
    is_featured: false
  },
  {
    headline: 'NatureWorks Announces 200,000 Tonne PLA Expansion in Thailand — Largest Bioplastics Capacity Addition in Asia',
    summary: 'NatureWorks confirms Phase 2 of their Thailand Ingeo PLA facility, adding capacity that would make Asia the largest bioplastics production region by 2027.',
    source_name: 'PlasticsToday',
    source_url: 'https://www.plasticstoday.com',
    image_url: 'https://images.unsplash.com/photo-1569427830807-c1429cbabed9?w=600&q=80',
    category: 'Bioplastics',
    related_lesson_slug: 'polylactic-acid-pla-synthesis-properties-and-commercial-reality',
    related_subject_slug: 'sustainable-plastics',
    is_featured: false
  },
  {
    headline: 'EU PPWR Mandatory Recycled Content Rules Come Into Force — 30% rPET in Bottles Required From January 2025',
    summary: 'The EU Packaging and Packaging Waste Regulation begins enforcement of mandatory recycled content requirements — directly affecting every Indian company exporting to European markets.',
    source_name: 'Plastics News Europe',
    source_url: 'https://www.plasticsnews.com',
    image_url: 'https://images.unsplash.com/photo-1624517452488-04aec72f6a44?w=600&q=80',
    category: 'Sustainability',
    related_lesson_slug: 'extended-producer-responsibility-epr-and-regulatory-frameworks',
    related_subject_slug: 'recycling-technology',
    is_featured: false
  },
  {
    headline: 'ISRO Chandrayaan-4 Mission Uses 38% CFRP Composite Structures — Tata Advanced Materials Selected as Supplier',
    summary: 'Tata Advanced Materials confirms supply of carbon-fibre reinforced polymer structural components for the upcoming Chandrayaan-4 mission, marking the highest domestic composite content in any ISRO programme.',
    source_name: 'The Hindu BusinessLine',
    source_url: 'https://www.thehindubusinessline.com',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
    category: 'Innovation',
    related_lesson_slug: 'carbon-fibre-reinforced-polymers-cfrp-aerospace-to-automotive',
    related_subject_slug: 'polymer-composites',
    is_featured: false
  },
  {
    headline: 'Supreme Industries Reports 14% Revenue Growth — Plastic Piping Segment Drives Expansion Across Rural India',
    summary: 'Supreme Industries Q4 results show strong growth in plastic piping systems driven by Jal Jeevan Mission tenders — management signals capacity expansion at Gadegaon and Malanpur plants.',
    source_name: 'Business Standard',
    source_url: 'https://www.business-standard.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
    category: 'India',
    related_lesson_slug: 'the-plastics-entrepreneurship-landscape-in-india-why-your-degree-is-the-moat',
    related_subject_slug: 'entrepreneurship-plastics',
    is_featured: false
  }
];

async function seed() {
  console.log('Clearing existing daily updates...');
  const { error: deleteError } = await supabase
    .from('daily_updates')
    .delete()
    .neq('headline', ''); // Deletes all rows

  if (deleteError) {
    console.error('Error clearing table (it may not exist yet):', deleteError.message);
    console.log('Attempting insert anyway...');
  }

  console.log(`Inserting ${dailyUpdates.length} daily updates...`);
  const { data, error } = await supabase
    .from('daily_updates')
    .insert(dailyUpdates)
    .select();

  if (error) {
    console.error('Error seeding daily updates:', error.message);
    process.exit(1);
  }

  console.log(`Successfully seeded ${data.length} updates!`);
  process.exit(0);
}

seed();
