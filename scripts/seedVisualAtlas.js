// scripts/seedVisualAtlas.js
// Seeding 6 detailed visual atlas entries (Machine, Material, Product, Process)
// Run with: node scripts/seedVisualAtlas.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const atlasData = [
  {
    id: '8b5fa21d-93e1-4c7b-b271-9d935e4d291e',
    title: 'Single-Screw Extruder Assembly',
    tag: 'Machine',
    description: 'The foundational machinery for continuous polymer processing. Features a rotating reciprocating screw in a heated barrel, moving solid plastic granules from the hopper, through melt and compression zones, to the extrusion die.',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    subject_slug: 'polymer-processing',
    material_name: 'Polypropylene, Polyethylene'
  },
  {
    id: '7a4eb31c-82d0-3b6a-a160-8c824d3c180d',
    title: 'Matched Injection Moulding Platen & Mould',
    tag: 'Machine',
    description: 'Heavy industrial clamping mechanism (measured in tonnes force) holding a split core-and-cavity steel mould shut. Resists the massive injection pressure of molten polymer during the filling cycle.',
    image_url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    subject_slug: 'mould-design',
    material_name: 'Polystyrene, Nylon, PP'
  },
  {
    id: '6f3da20b-71c9-2a59-905f-7b713c2b07fe',
    title: 'Polylactic Acid (PLA) Bio-Granules',
    tag: 'Material',
    description: 'Bio-derived, compostable polymer raw granules. Derived from fermented corn-starch lactides and synthesized via ring-opening polymerization. Requires desiccant drying to prevent hydrolytic degradation during processing.',
    image_url: 'https://images.unsplash.com/photo-1617155093730-a8bf47be792d?auto=format&fit=crop&q=80&w=800',
    subject_slug: 'sustainable-plastics',
    material_name: 'Polylactic Acid (PLA)'
  },
  {
    id: '5e2ca19a-60b8-1948-804e-6a602c1a06fd',
    title: 'High-Pressure Glass-Fibre Composite Pipe',
    tag: 'Product',
    description: 'A cross-section of a glass-fibre reinforced polymer (GFRP) pipe. Displays the structured glass fibre roving layers wound helically in an epoxy resin matrix, providing high burst pressure rating and corrosion immunity.',
    image_url: 'https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&q=80&w=800',
    subject_slug: 'polymer-composites',
    material_name: 'Glass Fibre + Epoxy'
  },
  {
    id: '4d1ba089-5f07-0837-703d-59501b0905fc',
    title: 'Float-Sink Separation Tank',
    tag: 'Process',
    description: 'A physical separation process separating shredded post-consumer plastic flakes by density. Polyolefins (PP/PE) float in water (density < 1.0 g/cm³), while heavy polyesters and vinyls (PET/PVC) sink to the bottom (density > 1.0 g/cm³).',
    image_url: 'https://images.unsplash.com/photo-1605600611280-146e6889be48?auto=format&fit=crop&q=80&w=800',
    subject_slug: 'recycling-technology',
    material_name: 'rPET, HDPE, rPP'
  },
  {
    id: '3c0aa978-4e96-f726-602c-48400a0804fb',
    title: 'Universal Testing Machine (UTM) Tensile Test',
    tag: 'Machine',
    description: 'A quality control laboratory test pulling a standard ASTM D638 dogbone specimen under a controlled rate. Measures load vs displacement to calculate the polymer\'s yield stress, Young\'s modulus, and elongation at break.',
    image_url: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&q=80&w=800',
    subject_slug: 'polymer-testing',
    material_name: 'All Polymers'
  }
];

async function seedAtlas() {
  console.log('🚀 Seeding Visual Atlas...\n');

  console.log(`📦 Upserting ${atlasData.length} atlas items...`);

  const { data: inserted, error: upsertErr } = await supabase
    .from('visual_atlas')
    .upsert(atlasData, { onConflict: 'id', ignoreDuplicates: false })
    .select('id, title, tag');

  if (upsertErr) {
    console.error('❌ Failed to upsert visual atlas:', upsertErr.message);
    console.error(JSON.stringify(upsertErr));
    process.exit(1);
  }

  console.log(`✅ Success! Seeded ${inserted.length} atlas cards:`);
  inserted.forEach((item, i) => {
    console.log(`   ${i + 1}. [${item.tag}] ${item.title}`);
  });
}

seedAtlas();
