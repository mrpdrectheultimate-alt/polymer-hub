// scripts/seedLessons_polymerChemistry_batch.js
// Lessons 2-6 for Polymer Chemistry subject
// Run with: node scripts/seedLessons_polymerChemistry_batch.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const lessonData = [
  {
    subject_slug: 'polymer-chemistry',
    title: 'Polymerization Mechanisms: Addition vs Condensation',
    summary: 'Understand the two fundamental ways monomers join to form polymers — addition and condensation polymerization — and how each determines the structure and properties of the final material.',
    order_index: 2,
    is_premium: false,
    content: `## Two Paths to Build a Polymer

Every polymer is built by joining monomers together. There are exactly two fundamental mechanisms by which this happens: **addition polymerization** and **condensation polymerization**. Knowing which mechanism produced a polymer tells you immediately what byproducts to expect, what its chain structure looks like, and how it will behave during processing.

---

## Addition Polymerization (Chain-Growth)

In addition polymerization, monomers containing a **double bond** (C=C) open up and link directly to each other — one monomer at a time, very fast, with **no byproduct**.

\`\`\`
n (CH2=CH2)  →  —[CH2—CH2]n—
   ethylene         polyethylene
\`\`\`

### The Three Stages

1. **Initiation:** A reactive species (free radical, cation, or anion) is generated, usually by a catalyst or initiator (e.g., benzoyl peroxide)
2. **Propagation:** The reactive chain end attacks monomer after monomer, growing rapidly — milliseconds to seconds per chain
3. **Termination:** Two growing chains combine, or a chain transfer agent stops growth

**Key feature:** Once a chain starts growing, it reaches full length almost instantly. At any point during the reaction, you have a mixture of fully-grown polymer chains and unreacted monomer — very little "in-between" material.

### Common Addition Polymers

| Monomer | Polymer | Double Bond |
|---------|---------|-------------|
| Ethylene | Polyethylene (PE) | CH2=CH2 |
| Propylene | Polypropylene (PP) | CH2=CH-CH3 |
| Vinyl chloride | PVC | CH2=CHCl |
| Styrene | Polystyrene (PS) | CH2=CH-C6H5 |
| Acrylonitrile + Butadiene + Styrene | ABS | Mixed |

---

## Condensation Polymerization (Step-Growth)

In condensation polymerization, monomers with **two reactive functional groups** (like –OH or –COOH) react together, releasing a **small byproduct molecule** — usually water, sometimes methanol or HCl.

\`\`\`
n HOOC-R-COOH + n H2N-R'-NH2  →  —[OC-R-CO-NH-R'-NH]n—  +  2n H2O
  diacid          diamine            polyamide (Nylon)        water
\`\`\`

### The Mechanism

Unlike addition polymerization, condensation happens in **steps**: monomer + monomer → dimer, dimer + monomer → trimer, dimer + dimer → tetramer, and so on. Chain growth is slow and statistical — at any point in the reaction, you have a wide mix of short, medium, and long chains.

**Key feature:** High molecular weight is only reached very late in the reaction (typically >98% conversion). This is why condensation polymers require careful control of stoichiometry and removal of the byproduct (often under vacuum) to reach useful molecular weights.

### Common Condensation Polymers

| Monomers | Polymer | Byproduct |
|----------|---------|-----------|
| Diacid + Diamine | Nylon (Polyamide) | Water |
| Diacid + Diol | Polyester (PET) | Water |
| Diol + Diisocyanate | Polyurethane | None (addition-type step-growth) |
| Phenol + Formaldehyde | Bakelite | Water |

---

## Side-by-Side Comparison

| Feature | Addition | Condensation |
|---------|----------|---------------|
| Byproduct | None | Small molecule (usually water) |
| Reaction speed | Fast (chain grows instantly) | Slow (builds up gradually) |
| Molecular weight buildup | High MW from early stages | High MW only near completion |
| Functional groups needed | One double bond | Two reactive groups per monomer |
| Examples | PE, PP, PVC, PS | Nylon, PET, Polyurethane, Bakelite |

---

### Indian Industry Example

**Reliance Industries** runs continuous **addition polymerization** at their Hazira and Jamnagar complexes for HDPE, LDPE, and PP — using Ziegler-Natta catalysts in gas-phase or slurry reactors, producing thousands of tonnes per day with no byproduct stream to manage.

**SRF Limited** (Gwalior) manufactures **Nylon 6,6 tyre cord fabric** via condensation polymerization — reacting adipic acid with hexamethylenediamine, carefully removing water under vacuum to push the reaction to high molecular weight needed for tyre cord strength.

Globally, **DuPont** — the original inventor of Nylon (1935) — still licenses condensation polymerization technology worldwide, while **Dow Chemical** is among the largest addition-polymerization producers globally, running ethylene crackers and polyethylene plants on a scale comparable to Reliance's Indian operations.

---

## Key Takeaways

- Addition polymerization joins monomers with double bonds rapidly with no byproduct; condensation polymerization joins monomers with two functional groups slowly, releasing a small molecule like water
- Addition polymers reach high molecular weight almost immediately; condensation polymers only reach high MW near the end of the reaction, requiring precise stoichiometry control
- Knowing the mechanism tells you what byproduct to manage during manufacturing and explains why condensation polymers (Nylon, PET) require more controlled, often vacuum-assisted processing than addition polymers (PE, PP)
`,
  },

  {
    subject_slug: 'polymer-chemistry',
    title: 'Thermoplastics vs Thermosets: Structure and Behavior',
    summary: 'Learn the fundamental chemical difference between thermoplastics and thermosets — why one can be melted and reshaped endlessly while the other cannot — and how this drives material selection in industry.',
    order_index: 3,
    is_premium: false,
    content: `## The Most Important Classification in Polymer Engineering

Every polymer you will ever work with falls into one of two categories: **thermoplastic** or **thermoset**. This single classification determines whether a material can be melted and reshaped, whether it can be recycled, and which manufacturing processes are even possible.

---

## Thermoplastics: Melt, Cool, Repeat

Thermoplastics are polymers made of **individual linear or branched chains held together only by weak intermolecular forces** (van der Waals forces, hydrogen bonding) — no chemical bonds between chains.

\`\`\`
Chain 1:  ~~~~~~~~~~~~~~~~~
Chain 2:  ~~~~~~~~~~~~~~~~~     ← held together by weak forces only
Chain 3:  ~~~~~~~~~~~~~~~~~        (no covalent bonds between chains)
\`\`\`

**Behavior on heating:** As temperature rises, these weak forces weaken, chains slide past each other, and the material **softens and eventually melts** into a viscous liquid. On cooling, it solidifies again. This process is **fully reversible** — you can melt and reshape a thermoplastic many times (with some property loss after repeated cycles due to thermal degradation).

### Common Thermoplastics

| Polymer | Glass Transition (Tg) | Melting Point (Tm) |
|---------|----------------------|---------------------|
| PP | -10°C | 160–170°C |
| HDPE | -120°C | 120–140°C |
| PVC | 80°C | 160–180°C (decomposes before true melt) |
| PC | 147°C | 260–300°C (amorphous, softens gradually) |
| Nylon 6 | 50°C | 220°C |

**Why this matters industrially:** Thermoplastics can be injection moulded, extruded, blow moulded, and — critically — **recycled** by simply remelting scrap material and reprocessing it.

---

## Thermosets: One-Way Transformation

Thermosets start as a liquid resin or soft solid, but during processing (usually with heat, pressure, or a curing agent), they undergo an **irreversible chemical reaction** that creates **covalent cross-links between chains**, forming one giant interconnected 3D network molecule.

\`\`\`
Chain 1: ~~~~~|~~~~~~~|~~~~~~
              |        |          ← covalent cross-links (permanent)
Chain 2: ~~~~~|~~~~~~~|~~~~~~
\`\`\`

**Behavior on heating:** Once cured, a thermoset **cannot be melted again**. Heating it further only causes thermal degradation (charring, burning) — there is no melt state because the entire part is essentially one molecule. This is **irreversible**.

### Common Thermosets

| Polymer | Cure Method | Typical Use |
|---------|-------------|-------------|
| Epoxy resin | Hardener (amine-based) | Adhesives, composites, coatings |
| Phenolic (Bakelite) | Heat + pressure | Electrical switches, handles |
| Unsaturated Polyester | Peroxide catalyst | Boat hulls, automotive body panels |
| Polyurethane (rigid foam) | Isocyanate + polyol | Insulation panels |
| Vulcanized Rubber | Sulphur cross-linking | Tyres, seals, gaskets |

---

## Why the Difference Matters in Practice

| Factor | Thermoplastic | Thermoset |
|--------|---------------|-----------|
| Reprocessing | Yes — melt and remould | No — permanent shape once cured |
| Recyclability | Easy (mechanical recycling) | Very difficult (must grind to filler, can't remelt) |
| Heat resistance | Limited by Tm/Tg | Often higher (no melt point to exceed) |
| Typical processing | Injection moulding, extrusion | Compression moulding, casting, RTM |
| Strength source | Chain entanglement | Covalent cross-link network |
| Scrap value | High (regrind and reuse) | Low (mostly waste) |

---

## A Useful Mental Model

Think of thermoplastics like **wax** — heat it, it melts, pour it into a new mould, it solidifies again, repeat indefinitely.

Think of thermosets like **a baked cake** — once the eggs and flour undergo the chemical reaction of baking, you cannot "unbake" it back into batter. The transformation is one-way.

---

### Indian Industry Example

**Supreme Industries** processes thermoplastics almost exclusively — PP, HDPE, PVC — across all their injection moulding and pipe extrusion lines, because thermoplastic scrap (sprues, runners, rejected parts) can be reground and fed back into the process, dramatically reducing material cost.

**Bakelite Hylam Limited** (Hyderabad) — one of India's oldest polymer companies, named after the very thermoset it produces — manufactures **phenolic laminates and mouldings** for electrical insulation, switchgear, and industrial components where thermoset heat resistance is non-negotiable.

---

## Key Takeaways

- Thermoplastics are held together by weak intermolecular forces and can be melted and reshaped repeatedly; thermosets form permanent covalent cross-links during curing and cannot be remelted
- This single difference determines recyclability (thermoplastics: easy; thermosets: very difficult) and dictates which manufacturing process applies
- Material selection comes down to this trade-off: thermosets for heat/chemical resistance and dimensional stability, thermoplastics for processability and recyclability
`,
  },

  {
    subject_slug: 'polymer-chemistry',
    title: 'Crystallinity and Morphology in Polymers',
    summary: 'Discover how polymer chains arrange themselves into ordered (crystalline) and disordered (amorphous) regions, and why this microscopic structure controls macroscopic properties like strength, clarity, and shrinkage.',
    order_index: 4,
    is_premium: false,
    content: `## Why Some Plastics Are Clear and Others Are Cloudy

Hold a PET water bottle up to light — it's transparent. Now look at an HDPE milk jug — it's opaque white. Both are thermoplastics, yet they look completely different. The reason lies in **crystallinity** — how the polymer chains are arranged at the molecular level.

---

## Amorphous vs Crystalline Regions

Polymer chains, when cooled from the melt, can arrange themselves in two ways:

**Amorphous regions:** Chains are tangled randomly, like cooked spaghetti — no order, no repeating pattern.

**Crystalline regions:** Chains fold back and forth in regular, repeating patterns called **lamellae**, packing tightly together.

No polymer is 100% crystalline. Even highly crystalline polymers like HDPE are typically 60–80% crystalline. We describe this with **percent crystallinity** — a key number on every polymer datasheet.

---

## Why Crystallinity Forms: Chain Regularity

| Chain Feature | Effect on Crystallinity |
|----------------|--------------------------|
| Linear, unbranched chains | Pack tightly → high crystallinity (HDPE) |
| Branched chains | Branches prevent tight packing → low crystallinity (LDPE) |
| Bulky side groups | Disrupt regular packing → amorphous (PS, PC) |
| Symmetric repeat unit | Easier to pack → higher crystallinity (PP, PE) |

---

## How Crystallinity Affects Properties

| Property | High Crystallinity | Low Crystallinity (Amorphous) |
|----------|---------------------|----------------------------------|
| Optical clarity | Opaque/translucent | Transparent (PS, PC, PMMA) |
| Tensile strength | Higher | Lower |
| Chemical resistance | Better | Lower |
| Mould shrinkage | Higher (3–5% for HDPE) | Lower (0.3–0.7% for PC) |
| Melting behavior | Sharp melting point (Tm) | Gradual softening (Tg only) |

---

### Indian Industry Example

**Reliance Industries** controls crystallinity precisely in their HDPE pipe-grade resins — higher crystallinity directly improves long-term hydrostatic strength required for pressure pipe applications under IS 4984 standards.

**Haldia Petrochemicals** produces PP homopolymer grades where controlled crystallinity determines whether the resin suits rigid packaging (high crystallinity) or flexible film (lower crystallinity, more clarity).

---

## Key Takeaways

- Polymer chains arrange into amorphous (random) and crystalline (ordered lamellae) regions; percent crystallinity is a key datasheet specification
- Chain regularity controls crystallinity: linear symmetric chains (HDPE, PP) crystallize easily; branched or bulky chains (LDPE, PS, PC) stay mostly amorphous
- Crystallinity drives optical clarity, strength, chemical resistance, and mould shrinkage — critical for both material selection and mould design
`,
  },

  {
    subject_slug: 'polymer-chemistry',
    title: 'Polymer Blends and Composites: Combining Materials for Better Performance',
    summary: 'Learn how blending two polymers or adding reinforcing fillers creates materials with properties neither component has alone — the engineering strategy behind most modern plastic products.',
    order_index: 5,
    is_premium: false,
    content: `## Why Pure Polymers Are Rarely Used Alone

Almost no plastic product you encounter is made of a single, unmodified polymer. Real-world products use **blends** (mixing two or more polymers) or **composites** (adding reinforcing fillers) to achieve a combination of properties that no single base polymer provides.

---

## Polymer Blends: Mixing Two Polymers

A **polymer blend** is a physical mixture of two or more different polymers, melt-mixed together without chemical bonding between them.

### Common Commercial Blends

| Blend | Components | Why It's Used |
|-------|-----------|----------------|
| PC/ABS | Polycarbonate + ABS | PC's impact strength + ABS's processability |
| PP/EPDM (TPO) | Polypropylene + rubber | Rigid PP + rubber's flexibility for bumpers |
| PVC/CPE | PVC + Chlorinated PE | Improved impact resistance for pipe fittings |

**Real example:** Automotive bumpers are almost always **PP/EPDM (TPO)** blends — pure PP would crack on impact in cold weather; pure rubber would be too soft to hold shape.

---

## Polymer Composites: Adding Reinforcement

| Filler Type | Effect | Example Use |
|-------------|--------|---------------|
| Glass fibre (10–40%) | Massive increase in stiffness and strength | Automotive housings, electrical components |
| Carbon fibre | Highest strength-to-weight ratio | Aerospace, sporting goods |
| Talc | Increases stiffness, improves dimensional stability | Automotive interior trim |
| Calcium carbonate | Cost reduction, slight stiffness increase | Pipe fittings |
| Carbon black | Reinforcement + UV protection | Tyres, cable jacketing |

### The Glass-Fibre Effect

Adding 30% glass fibre to Nylon 6 can:
- Increase tensile strength from ~80 MPa to ~180 MPa (more than double)
- Increase flexural modulus by 3–4×
- Reduce mould shrinkage significantly

---

### Indian Industry Example

**Motherson Sumi Systems** (Noida) uses **PP/EPDM TPO blends** for bumper fascias supplied to Maruti Suzuki, Hyundai, and Tata Motors.

**DIC India** supplies glass-fibre reinforced engineering compounds to electrical switchgear manufacturers across Gujarat, where 30% glass-filled Nylon 66 is standard for circuit breaker housings.

---

## Key Takeaways

- Polymer blends physically mix two polymers to combine properties — like PP/EPDM TPO blending PP's rigidity with rubber's flexibility for automotive bumpers
- Composites add reinforcing fillers (glass fibre, talc, carbon black) to dramatically increase strength — 30% glass-filled Nylon roughly doubles tensile strength
- Blending and reinforcing are faster and cheaper than developing new polymers, which is why most commercial plastic products are blends or composites
`,
  },

  {
    subject_slug: 'polymer-chemistry',
    title: 'Polymer Degradation and Stabilization',
    summary: 'Understand how heat, UV light, and oxygen break down polymer chains over time, and the stabilizer chemistry the industry uses to prevent premature failure of plastic products.',
    order_index: 6,
    is_premium: false,
    content: `## Why Plastics Don't Last Forever (Unless You Want Them To)

Every polymer degrades over time — chains break, color changes, mechanical properties drop. Understanding degradation mechanisms is how engineers select the right stabilizers to control a product's service life.

---

## The Three Main Degradation Mechanisms

### 1. Thermal Degradation

At high temperatures, polymer chains break via **random chain scission**, especially under shear stress in an extruder or injection moulding barrel.

**Symptoms:** Discoloration, reduced melt viscosity, brittleness, odor (PVC releases HCl gas when thermally degraded).

### 2. UV (Photo) Degradation

UV light breaks C–C and C–H bonds directly, initiating a **free radical chain reaction** that progressively destroys the polymer backbone.

**Symptoms:** Surface chalking, color fading, severe embrittlement, surface micro-cracking.

**Most vulnerable:** PP (fails outdoors within 1–2 years without stabilizer), ABS (yellows badly).

### 3. Oxidative Degradation

Oxygen attacks chains at elevated temperature or under UV exposure, forming **hydroperoxides** that decompose into more free radicals — a self-propagating breakdown cycle.

---

## Stabilizer Chemistry

| Stabilizer Type | Mechanism | Typical Dose |
|-------------------|-----------|----------------|
| **Primary Antioxidants** — Hindered phenols | Scavenge free radicals | 0.05–0.5% |
| **Secondary Antioxidants** — Phosphites | Decompose hydroperoxides | 0.05–0.3% |
| **UV Absorbers** — Benzotriazoles | Absorb UV photons as heat | 0.1–0.5% |
| **HALS** — Hindered Amine Light Stabilizers | Continuously scavenge radicals | 0.1–1.0% |
| **Heat Stabilizers** (PVC-specific) | Neutralize HCl release | 1–3 phr |
| **Carbon Black** | Physically blocks UV penetration | 2–3% |

**Why carbon black works:** Black HDPE pipe with 2.5% carbon black can last 50+ years outdoors, while unstabilized natural HDPE fails within months. This is why virtually all outdoor HDPE and PP products are either black or contain UV stabilizer packages.

---

## Testing Degradation Resistance

- **QUV Testing:** Cycles of UV + condensation, simulating months of outdoor exposure in weeks
- **Xenon Arc Testing:** Full-spectrum light simulating real sunlight
- **Oxidative Induction Time (OIT) via DSC:** Measures how long a sample resists oxidation — a key QC test for pipe-grade PE

---

### Indian Industry Example

**Finolex Industries** and **Astral Pipes** formulate their outdoor HDPE and PVC pipe grades with carbon black and heat stabilizer packages for India's intense UV exposure — IS 4984 and IS 4985 standards mandate minimum carbon black content for outdoor pipes.

**Sudarshan Chemical Industries** (Pune) is a major Indian supplier of pigments and stabilizer additives, supplying UV stabilizer packages to automotive and outdoor furniture manufacturers.

---

## Key Takeaways

- Polymers degrade via thermal (heat + shear), UV/photo (sunlight initiating radical reactions), and oxidative (oxygen attack) mechanisms — often acting together
- Stabilizer packages (antioxidants, UV absorbers, HALS, heat stabilizers, carbon black) interrupt these mechanisms and extend service life
- Accelerated weathering tests (QUV, Xenon arc, OIT) let engineers predict decades of outdoor performance in weeks
`,
  },
];

async function seedLessons() {
  console.log('🚀 PolymerHub — Seeding Polymer Chemistry lessons 2-6...\n');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
  }

  const { data: subjects, error: subjectError } = await supabase
    .from('subjects')
    .select('id, slug');

  if (subjectError) {
    console.error('❌ Failed to fetch subjects:', subjectError.message);
    process.exit(1);
  }

  const subjectMap = {};
  subjects.forEach((s) => { subjectMap[s.slug] = s.id; });

  const lessons = lessonData.map((lesson) => {
    const subject_id = subjectMap[lesson.subject_slug];
    if (!subject_id) {
      console.error(`❌ Subject not found for slug: ${lesson.subject_slug}`);
      process.exit(1);
    }
    return {
      subject_id,
      title: lesson.title,
      slug: slugify(lesson.title),
      content: lesson.content,
      summary: lesson.summary,
      is_premium: lesson.is_premium,
      order_index: lesson.order_index,
    };
  });

  console.log(`📦 Inserting ${lessons.length} lessons...\n`);

  const { data, error } = await supabase
    .from('lessons')
    .upsert(lessons, { onConflict: 'slug', ignoreDuplicates: false })
    .select();

  if (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }

  console.log('✅ Polymer Chemistry lessons 2-6 seeded successfully!\n');
  data.forEach((l, i) => console.log(`   ${i + 1}. ${l.title}`));
  console.log(`\n🎉 Done! ${data.length} lessons added.\n`);
}

seedLessons();
