const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ALL_53_MODULES = {
  "polymer-processing": [
    { name: "Module 1 — Processing Fundamentals", slug: "processing-fundamentals", seq: 1 },
    { name: "Module 2 — Injection Moulding", slug: "injection-moulding", seq: 2 },
    { name: "Module 3 — Extrusion & Film Processing", slug: "extrusion-film-processing", seq: 3 },
    { name: "Module 4 — Blow Moulding & Thermoforming", slug: "blow-moulding-thermoforming", seq: 4 },
    { name: "Module 5 — Advanced & Emerging Processing", slug: "advanced-emerging-processing", seq: 5 }
  ],
  "polymer-testing": [
    { name: "Module 1 — Testing Standards and Specimen Preparation", slug: "testing-standards-specimen-prep", seq: 1 },
    { name: "Module 2 — Mechanical Testing", slug: "mechanical-testing", seq: 2 },
    { name: "Module 3 — Thermal Characterization", slug: "thermal-characterization", seq: 3 },
    { name: "Module 4 — Rheological and Flow Testing", slug: "rheological-flow-testing", seq: 4 },
    { name: "Module 5 — Spectroscopy and Failure Analysis", slug: "spectroscopy-failure-analysis", seq: 5 }
  ],
  "medical-plastics": [
    { name: "Module 1 — Medical Polymer Fundamentals", slug: "medical-polymer-fundamentals", seq: 1 },
    { name: "Module 2 — Biocompatibility and ISO 10993", slug: "biocompatibility-iso-10993", seq: 2 },
    { name: "Module 3 — Sterilization, Cleanrooms and Manufacturing Quality", slug: "sterilization-cleanrooms-quality", seq: 3 },
    { name: "Module 4 — Implants and Advanced Biomaterials", slug: "implants-advanced-biomaterials", seq: 4 }
  ],
  "life-cycle-assessment": [
    { name: "Module 1 — Goal, Scope and ISO 14040 Framework", slug: "iso-14040-framework", seq: 1 },
    { name: "Module 2 — Life-Cycle Inventory and Data", slug: "lci-inventory-data", seq: 2 },
    { name: "Module 3 — Impact Assessment and Carbon Footprint", slug: "lcia-carbon-footprint", seq: 3 },
    { name: "Module 4 — End-of-Life and Circularity Scenarios", slug: "end-of-life-circularity", seq: 4 }
  ],
  "polymer-chemistry": [
    { name: "Module 1 — Chemical Fundamentals & Polymerization", slug: "chemical-fundamentals-polymerization", seq: 1 },
    { name: "Module 2 — Synthesis & Reaction Mechanisms", slug: "synthesis-reaction-mechanisms", seq: 2 },
    { name: "Module 3 — Polymer Structure & Molecular Weight", slug: "polymer-structure-molecular-weight", seq: 3 },
    { name: "Module 4 — Industrial Polymers & Degradation", slug: "industrial-polymers-degradation", seq: 4 }
  ],
  "mould-design": [
    { name: "Module 1 — Mould Fundamentals & Tooling", slug: "mould-fundamentals-tooling", seq: 1 },
    { name: "Module 2 — Injection Mould Systems (Runner, Gate, Ejection)", slug: "injection-mould-systems", seq: 2 },
    { name: "Module 3 — Cooling & Thermal Management", slug: "cooling-thermal-management", seq: 3 },
    { name: "Module 4 — Advanced Mould Design & Defect Prevention", slug: "advanced-mould-design-defects", seq: 4 }
  ],
  "polymer-rheology": [
    { name: "Module 1 — Viscosity & Shear Flow Fundamentals", slug: "viscosity-shear-flow-fundamentals", seq: 1 },
    { name: "Module 2 — Viscoelasticity & Rheometry", slug: "viscoelasticity-rheometry", seq: 2 },
    { name: "Module 3 — Processing Rheology & Flow Instabilities", slug: "processing-rheology-instabilities", seq: 3 }
  ],
  "rubber-technology": [
    { name: "Module 1 — Elastomer Science & Natural Rubber", slug: "elastomer-science-natural-rubber", seq: 1 },
    { name: "Module 2 — Vulcanization Chemistry & Compounding", slug: "vulcanization-chemistry-compounding", seq: 2 },
    { name: "Module 3 — Synthetic Rubbers & Industrial Processing", slug: "synthetic-rubbers-processing", seq: 3 }
  ],
  "recycling-technology": [
    { name: "Module 1 — Recycling Fundamentals & Sorting", slug: "recycling-fundamentals-sorting", seq: 1 },
    { name: "Module 2 — Mechanical Recycling & Reprocessing", slug: "mechanical-recycling-reprocessing", seq: 2 },
    { name: "Module 3 — Chemical Recycling & Circular Economy", slug: "chemical-recycling-circular-economy", seq: 3 }
  ],
  "sustainable-plastics": [
    { name: "Module 1 — Bio-Based & Biodegradable Fundamentals", slug: "bio-based-biodegradable-fundamentals", seq: 1 },
    { name: "Module 2 — PLA, PHA & Bio-Polymers", slug: "pla-pha-biopolymers", seq: 2 },
    { name: "Module 3 — Sustainability Standards & Degradation", slug: "sustainability-standards-degradation", seq: 3 }
  ],
  "polymer-composites": [
    { name: "Module 1 — Composite Fundamentals & Matrices", slug: "composite-fundamentals-matrices", seq: 1 },
    { name: "Module 2 — Reinforcement Fibers & Interfaces", slug: "reinforcement-fibers-interfaces", seq: 2 },
    { name: "Module 3 — Composite Manufacturing & Processing", slug: "composite-manufacturing-processing", seq: 3 }
  ],
  "additives-compounding": [
    { name: "Module 1 — Additive Chemistry & Functional Roles", slug: "additive-chemistry-roles", seq: 1 },
    { name: "Module 2 — Compounding Extrusion & Masterbatches", slug: "compounding-extrusion-masterbatches", seq: 2 },
    { name: "Module 3 — High-Performance Formulations", slug: "high-performance-formulations", seq: 3 }
  ],
  "plastic-packaging-engineering": [
    { name: "Module 1 — Packaging Materials & Barrier Properties", slug: "packaging-materials-barrier-properties", seq: 1 },
    { name: "Module 2 — Flexible & Rigid Packaging Production", slug: "flexible-rigid-packaging-production", seq: 2 },
    { name: "Module 3 — Shelf Life & Migration Safety", slug: "shelf-life-migration-safety", seq: 3 }
  ],
  "color-science-masterbatches": [
    { name: "Module 1 — Colorimetry & CIE L*a*b* Fundamentals", slug: "colorimetry-cie-lab-fundamentals", seq: 1 },
    { name: "Module 2 — Masterbatch Formulation & Pigments", slug: "masterbatch-formulation-pigments", seq: 2 },
    { name: "Module 3 — Color Matching & Quality Control", slug: "color-matching-quality-control", seq: 3 }
  ],
  "entrepreneurship-plastics": [
    { name: "Module 1 — Market Validation & Product Selection", slug: "market-validation-product-selection", seq: 1 },
    { name: "Module 2 — Factory Setup, CAPEX & Unit Economics", slug: "factory-setup-capex-unit-economics", seq: 2 },
    { name: "Module 3 — Regulatory Compliance & Operations", slug: "regulatory-compliance-operations", seq: 3 }
  ]
};

async function seedModulesAndBackfillLessons() {
  console.log("=== SEEDING 53 CURRICULUM MODULES & BACKFILLING LESSON MODULE_IDs ===");

  const { data: subjects, error: subErr } = await supabase.from('subjects').select('id, slug, name');
  if (subErr || !subjects) {
    console.error("Error fetching subjects:", subErr?.message);
    process.exit(1);
  }

  const subjectMap = {};
  subjects.forEach(s => {
    let slug = s.slug;
    if (slug === 'sustainable-plastics-bioplastics') slug = 'sustainable-plastics';
    if (slug === 'entrepreneurship-in-plastics') slug = 'entrepreneurship-plastics';
    if (slug === 'medical-plastics-biomaterials') slug = 'medical-plastics';
    subjectMap[slug] = s.id;
    subjectMap[s.slug] = s.id;
  });

  const moduleMapBySubjectAndName = {};
  let totalSeeded = 0;

  for (const [subSlug, modules] of Object.entries(ALL_53_MODULES)) {
    const subjectId = subjectMap[subSlug];
    if (!subjectId) {
      console.error(`Subject ID not found for ${subSlug}`);
      continue;
    }

    for (const m of modules) {
      const payload = {
        subject_id: subjectId,
        name: m.name,
        slug: m.slug,
        sequence_number: m.seq,
        description: `${m.name} for ${subSlug}`
      };

      const { data: inserted, error: modErr } = await supabase
        .from('curriculum_modules')
        .upsert(payload, { onConflict: 'subject_id,slug' })
        .select('id, name')
        .single();

      if (modErr) {
        // Fetch existing if upsert didn't return
        const { data: existing } = await supabase
          .from('curriculum_modules')
          .select('id, name')
          .eq('subject_id', subjectId)
          .eq('slug', m.slug)
          .single();
        if (existing) {
          moduleMapBySubjectAndName[`${subjectId}::${m.name}`] = existing.id;
          totalSeeded++;
        } else {
          console.error(`Failed to insert/fetch module ${m.name}:`, modErr.message);
        }
      } else if (inserted) {
        moduleMapBySubjectAndName[`${subjectId}::${m.name}`] = inserted.id;
        totalSeeded++;
      }
    }
  }

  console.log(`Seeded/Verified ${totalSeeded} modules in curriculum_modules table.`);

  // Now backfill all 102 lessons with module_id
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, slug, subject_id, module_name, subjects(slug)');

  console.log(`Backfilling module_id for ${lessons.length} lessons...`);
  let backfilledCount = 0;

  for (const l of lessons) {
    const subId = l.subject_id;
    const modName = l.module_name || "Module 1 — Processing Fundamentals";
    
    // Find matching module ID
    let modId = moduleMapBySubjectAndName[`${subId}::${modName}`];

    if (!modId) {
      // Fallback to first module of subject
      const subSlug = l.subjects?.slug || 'polymer-processing';
      const firstMod = ALL_53_MODULES[subSlug]?.[0]?.name || "Module 1 — Processing Fundamentals";
      modId = moduleMapBySubjectAndName[`${subId}::${firstMod}`];
    }

    if (modId) {
      await supabase.from('lessons').update({ module_id: modId }).eq('id', l.id);
      backfilledCount++;
    }
  }

  console.log(`Successfully backfilled module_id on ${backfilledCount}/${lessons.length} lessons!`);
}

seedModulesAndBackfillLessons();
