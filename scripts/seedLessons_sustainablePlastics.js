// scripts/seedLessons_sustainablePlastics.js
// Run with: node scripts/seedLessons_sustainablePlastics.js

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
    subject_slug: 'sustainable-plastics',
    title: 'The Sustainable Plastics Landscape: Bio-based, Biodegradable, and Compostable',
    summary: 'Understand the critical differences between bio-based, biodegradable, and compostable plastics — three terms the industry and media consistently confuse — and why these distinctions define which applications actually make environmental sense.',
    order_index: 1,
    is_premium: false,
    content: `## The Three Terms the Industry Confuses Most

Walk into any sustainable packaging conference and you will hear "bio-based," "biodegradable," and "compostable" used almost interchangeably. They are not the same. Using the wrong material for the wrong application does not improve environmental outcomes — it can make them worse. As a polymer engineer, this vocabulary precision is not pedantic; it is foundational.

---

## Bio-based: Origin, Not Destiny

**Bio-based** describes where a polymer's carbon atoms came from — plants and biological sources rather than petroleum. It says nothing about what happens to the polymer at end of life.

\`\`\`
FOSSIL-BASED:  crude oil → naphtha → monomers → polymer
BIO-BASED:     sugarcane/corn → fermentation → monomers → polymer
\`\`\`

**Bio-based polymers can be:**
- Biodegradable (PLA, PHA)
- OR non-biodegradable (bio-PE, bio-PET, bio-Nylon)

**Bio-PE** (polyethylene made from sugarcane ethanol) is chemically identical to fossil PE — same structure, same properties, same recyclability, same end-of-life behavior. It neither biodegrades in soil nor composts. Its only environmental advantage is in the **carbon accounting**: the sugarcane absorbed CO₂ during growth, partially offsetting the CO₂ released when the material is eventually burned or degrades. This "carbon-neutral feedstock" argument is the entire basis of bio-PE's environmental claim.

**Key numbers:** Braskem (Brazil) produces **Green PE** from sugarcane ethanol, claiming a carbon footprint of approximately **-2.15 kg CO₂/kg** (carbon negative, because the sugarcane captures more CO₂ than the production process emits). Compared to fossil PE at +1.9 kg CO₂/kg, that is a swing of roughly 4 kg CO₂ per kg of material. Meaningful at scale.

---

## Biodegradable: Rate and Conditions Matter Everything

**Biodegradable** means microorganisms can break a material down into CO₂, water, and biomass — but this definition is nearly useless without specifying **under what conditions and over what timeframe**.

Virtually all organic materials are technically biodegradable over a long enough time period. The question is:
- Does it biodegrade in **industrial compost** (55-60°C, controlled humidity, 12 weeks)?
- Does it biodegrade in **home compost** (ambient temperature, months to years)?
- Does it biodegrade in **soil** (variable conditions, potentially years to decades)?
- Does it biodegrade in **marine environments** (cold, dark, low-oxygen — almost nothing degrades here without specific engineering)?

**Oxo-degradable plastics** (conventional PE or PP with pro-oxidant additives) fragment into microplastics in sunlight and heat — but do NOT biodegrade. They are banned in the EU since 2021 and in India under the Plastic Waste Management Rules for good reason: they create microplastic contamination without any true biodegradation benefit.

---

## Compostable: The Most Specific Claim

**Compostable** is the most precisely defined term — and the most demanding. Standards define specific conditions, timeframes, and residue requirements:

| Standard | Geography | Conditions | Timeframe |
|---------|-----------|-----------|-----------|
| EN 13432 | Europe | Industrial composting (55-60°C) | 12 weeks, >90% disintegration |
| ASTM D6400 | USA | Industrial composting | 180 days, >90% disintegration |
| AS 5810 | Australia | Home composting | Variable temp, 12 months |
| OK compost HOME | Global (TÜV Austria) | Home composting | Ambient temp |

**Industrial compostable ≠ home compostable.** A material certified to EN 13432 (industrial) will NOT reliably compost in a home garden or backyard bin — and will certainly not biodegrade meaningfully in a landfill or waterway.

This is the critical practical limitation of compostable plastics in India: **India has almost no industrial composting infrastructure at scale** that accepts compostable packaging. A PLA cup certified as industrially compostable, if placed in India's municipal waste stream, will end up in landfill where it behaves essentially like conventional plastic. The environmental benefit is theoretical without the end-of-life infrastructure to match.

---

## The Decision Matrix

| Type | Example | Feedstock | End-of-Life | Best Use Case |
|------|---------|-----------|-------------|--------------|
| Fossil-based, non-biodegradable | PE, PP, PET | Petroleum | Mechanical recycling | High-volume recyclable packaging |
| Bio-based, non-biodegradable | Bio-PE, Bio-PET | Sugarcane, corn | Mechanical recycling (same stream as fossil) | Drop-in replacement where carbon footprint matters |
| Bio-based, industrially compostable | PLA | Corn starch | Industrial composting (where available) | Foodservice items in facilities with composting |
| Bio-based, home compostable | PHA | Bacterial fermentation | Home composting, marine environments | Premium, niche applications |
| Fossil-based, biodegradable | PBAT | Petroleum | Industrial composting | Blended with PLA for flexibility |

---

### Indian Industry Example

**NatureWorks** (USA/Thailand) is the world's largest PLA producer, supplying Ingeo PLA resin to global markets including Indian converters. **Kaneka** (Japan) produces PHBH (a PHA copolymer), considered the most promising bioplastic for marine biodegradability. In India, **Ecogreen Bioplastics** and **Compostable India** are among the growing number of certified compostable packaging converters, while **SITRA (South India Textile Research Association)** has published compostable textile research relevant to the Indian market.

Globally, **Novamont** (Italy) is the pioneering bio-based PBAT and starch-blend producer behind the **Mater-Bi** brand — one of the most widely certified compostable materials in European food packaging — whose technology standards Indian compostable plastic producers reference when applying for BIS IS 17088 certification.

---

## Key Takeaways

- Bio-based describes feedstock origin only — bio-PE is chemically identical to fossil PE and neither biodegrades nor composts, with its only environmental benefit in carbon accounting (sugarcane captures CO₂ during growth)
- Biodegradable is meaningless without specifying conditions and timeframe — oxo-degradable plastics fragment into microplastics and are banned in the EU and India precisely because fragmentation without biodegradation is harmful
- Compostable is the most precisely defined term but requires matching infrastructure — industrial compostable materials (EN 13432, ASTM D6400) do not biodegrade in home gardens or landfills, and India's lack of industrial composting infrastructure limits the real-world benefit of compostable packaging today
`,
  },
  {
    subject_slug: 'sustainable-plastics',
    title: 'Polylactic Acid (PLA): Synthesis, Properties, and Commercial Reality',
    summary: 'Master PLA — the world\'s most commercially produced bioplastic — from its lactic acid fermentation synthesis through crystallization challenges, processing parameters, and the real limitations that prevent it replacing conventional plastics at scale.',
    order_index: 2,
    is_premium: false,
    content: `## The World's Most Produced Bioplastic

Polylactic acid (PLA) is synthesized from **lactic acid**, produced by fermenting glucose from agricultural feedstocks — predominantly corn starch in North America, sugarcane in Brazil and Southeast Asia. It is currently the largest-volume commercially produced bioplastic globally, with NatureWorks (USA/Thailand) operating the world's largest single PLA plant at 150,000 tonnes/year capacity.

PLA is important to understand in depth for two reasons: it is increasingly specified in food packaging and foodservice applications, and it exemplifies both the promise and the genuine engineering limitations of bioplastics as a category.

---

## Synthesis: From Corn to Polymer

\`\`\`
Corn starch → Glucose → Fermentation (Lactobacillus bacteria) → Lactic acid
→ Condensation → Oligomers → Ring-opening polymerization (ROP) of lactide → PLA
\`\`\`

The key step is **ring-opening polymerization** of **lactide** (a cyclic dimer of lactic acid) — not direct condensation polymerization of lactic acid, which produces only low molecular weight oligomers. The lactide route allows high molecular weight PLA suitable for film and packaging applications.

### Stereochemistry Controls Properties

Lactic acid has two stereoisomers (L and D forms), and their ratio in PLA dramatically affects properties:

| PLA Type | L:D Ratio | Crystallinity | Tm | Key Properties |
|----------|-----------|--------------|-----|----------------|
| PLLA (pure L) | 100:0 | High (~37%) | 170-180°C | High strength, good clarity when quenched |
| PDLA (pure D) | 0:100 | High | 170-180°C | Mirror image of PLLA |
| PDLLA (racemic) | 50:50 | Amorphous | None (only Tg ~55°C) | Fully amorphous, used in medical devices |
| PLA (commercial) | ~96:4 | Low-moderate | ~150-160°C | Standard packaging grade |

**Stereocomplex PLA** (mixing PLLA + PDLA) forms co-crystals with Tm up to 230°C — potentially solving PLA's heat resistance limitation, but commercially challenging due to PDLA cost.

---

## Properties: Where PLA Competes and Where It Falls Short

### Advantages

- **Clarity:** Amorphous or low-crystallinity PLA has excellent optical clarity — comparable to PS and PET for food packaging
- **Stiffness:** PLA has good flexural modulus (~3.5 GPa) — stiffer than many conventional polymers at room temperature
- **Carbon footprint:** ~1.8-3.2 kg CO₂/kg vs PET at 2.6-3.2 kg CO₂/kg — marginal to moderate advantage depending on feedstock and production energy
- **Printability:** Good surface for printing and labeling
- **Certification:** Widely certified to EN 13432 (industrial compostable) and FDA-approved for food contact

### Limitations

| Limitation | Detail | Impact |
|-----------|--------|--------|
| **Low heat resistance** | Tg ~55-60°C — softens in hot conditions | Cannot be used for hot-fill, microwave, or outdoor applications in Indian summer heat |
| **Brittleness** | Low impact strength without modification | Requires blending with PBAT or plasticizers for flexible film applications |
| **Slow crystallization** | Crystallizes slowly vs PET — limits cycle time in injection moulding | Longer cycle times = higher production cost |
| **Moisture sensitivity** | Hydrolyzes at processing temperatures if wet | Must be dried to <250 ppm moisture before processing |
| **End-of-life infrastructure** | Requires industrial composting (>55°C) — non-existent at scale in India | Environmental benefit theoretical without composting infrastructure |
| **Not recyclable in conventional streams** | Contaminates PET recycling if incorrectly sorted | Can reduce rPET quality if mixed |

**The 55°C Tg limitation is critical for India.** A PLA cup left in a car on a hot Indian summer day (interior temperatures easily reach 60-70°C) will deform. This is why PLA's primary global market is in cooler-climate countries (Europe, North America) for cold beverage and food applications.

---

## Processing PLA: What Changes vs Conventional Polymers

PLA can be processed on standard thermoplastic equipment (injection moulding, extrusion, blow moulding, thermoforming) with modifications:

| Parameter | PLA | PET (comparison) |
|-----------|-----|-----------------|
| Processing temp | 180-210°C | 255-280°C |
| Mould temp | 20-30°C (amorphous) / 90-120°C (crystalline) | 10-20°C |
| Drying | 80-100°C, 4+ hours (<250 ppm moisture) | 160-180°C, 4-6 hours |
| Cooling time | Longer than PET at same temperature | Standard |

**Critical note:** PLA hydrolyzes (chains break from moisture) at melt temperature even faster than PET. Insufficient drying causes dramatic molecular weight loss, resulting in brittle, weak parts with low melt strength. This is the most common processing failure with PLA.

---

### Indian Industry Example

**Ecolife** and **Compostable India** are producing PLA-based cutlery and food packaging in India certified to IS 17088 (India's compostable plastics standard, aligned to EN 13432). **BigBasket** and **Swiggy** have run trials with compostable PLA packaging for premium grocery delivery, though scale-up has been limited by infrastructure and cost.

Globally, **NatureWorks** (USA/Thailand) markets their **Ingeo PLA** grades specifically for packaging (Ingeo 2003D for thermoforming, 7001D for injection moulding) and supplies converters worldwide, while **Total Corbion PLA** (joint venture, Netherlands/Thailand) is the second-largest producer with their **Luminy** brand, focusing on high-heat resistant PLA grades using stereocomplex technology — specifically targeting the heat resistance limitation that prevents wider PLA adoption in hot-fill and foodservice applications.

---

## Key Takeaways

- PLA is synthesized from lactic acid via ring-opening polymerization of lactide, with stereochemistry (L:D ratio) controlling crystallinity and heat resistance — commercial packaging grades are predominantly PLLA with small D-content
- PLA's 55-60°C glass transition temperature is its most significant commercial limitation — it cannot withstand Indian summer heat conditions in vehicles or outdoor settings, limiting applications to cold-fill and ambient-temperature uses
- PLA processes like a standard thermoplastic but requires careful drying (below 250 ppm moisture) to prevent hydrolytic degradation at melt temperature — the most common processing failure, causing brittleness and weak parts
`,
  },
  {
    subject_slug: 'sustainable-plastics',
    title: 'Polyhydroxyalkanoates (PHA): Nature\'s True Bioplastic',
    summary: 'Explore PHA — the bioplastic produced by bacteria as an energy storage material — its diverse property range, genuine biodegradability in soil and marine environments, and why it is increasingly considered the most promising long-term conventional plastic replacement.',
    order_index: 3,
    is_premium: false,
    content: `## Plastic Made by Bacteria

Polyhydroxyalkanoates (PHA) are not synthesized in a chemical plant. They are produced by bacteria as intracellular carbon and energy storage granules — essentially, the bacteria make plastic inside themselves when fed excess carbon under nutrient-limited conditions.

\`\`\`
Bacteria + carbon feedstock (glucose, fatty acids, waste streams)
+ nutrient limitation (nitrogen or phosphorus limited)
→ Intracellular PHA granules (~50-80% cell dry weight)
→ Cell lysis → PHA extraction and purification → PHA resin
\`\`\`

This biological origin gives PHA two properties no other commercially available polymer currently matches simultaneously:
1. **True biodegradability** in soil, marine environments, and home compost — without specific temperature or humidity requirements
2. **Bio-based feedstock** — from renewable carbon sources including waste streams

---

## The PHA Family

PHA is not a single polymer — it is a large family of polyesters with highly variable properties depending on the bacterial species, feedstock, and fermentation conditions.

| Polymer | Abbreviation | Type | Key Properties |
|---------|-------------|------|----------------|
| Poly(3-hydroxybutyrate) | PHB | Homopolymer | Stiff, brittle, high crystallinity, Tm ~175°C |
| Poly(3-hydroxybutyrate-co-valerate) | PHBV | Copolymer | Less brittle than PHB, lower Tm, better impact |
| Poly(3-hydroxybutyrate-co-hexanoate) | PHBH | Copolymer | Flexible, soft, best biodegradability profile, Tm variable |
| Poly(4-hydroxybutyrate) | P4HB | Homopolymer | Very flexible, medical-grade biodegradability, expensive |
| Medium-chain-length PHAs (mcl-PHA) | mcl-PHA | Various | Elastomeric, waxy, specialty applications |

**PHBH** (produced by Kaneka, Japan) is considered the most commercially promising PHA for packaging because its copolymer composition can be tuned to resemble polypropylene or LDPE in flexibility — addressing the brittleness that has historically limited PHB commercial adoption.

---

## Biodegradability: What Makes PHA Different

The reason PHA biodegrades in marine environments when PLA does not is fundamental chemistry:

**PHA:** Microbial polyester with natural ester linkages that soil and marine microorganisms have evolved to recognize and break down — using the same PHA depolymerase enzymes that other bacteria use to access PHA as a food source. This is genuine, universal microbial decomposition.

**PLA:** Hydrolytic decomposition (water breaks ester bonds) — but this only occurs rapidly at temperatures above 55°C. Below that temperature, hydrolysis is too slow to be useful. Marine and soil environments are cool → PLA does not decompose meaningfully.

### Biodegradation timelines in different environments:

| Environment | PLA | PHBH | HDPE |
|-------------|-----|------|------|
| Industrial compost (60°C) | 3-6 months | 3-6 months | Does not biodegrade |
| Soil | Months to years | 3-12 months | Does not biodegrade |
| Freshwater | Years | 3-6 months | Does not biodegrade |
| Marine (seawater) | Years to decades | 3-12 months | Does not biodegrade |

This marine biodegradability is why PHA is attracting attention for **single-use applications where plastic leakage into ocean environments is a significant risk** — fishing gear, agricultural films, and packaging in coastal regions.

---

## Commercial Challenges: Cost and Scale

PHA currently costs **₹200-500/kg** (depending on grade) vs ₹90-130/kg for conventional PP or LDPE. This 2-4× price premium is the primary barrier to mass market adoption.

**Root causes of high cost:**
- **Fermentation yield:** Even optimized bacterial fermentation produces PHA at ~50-80% of cell dry weight — requiring large fermenters and significant cell processing
- **Extraction:** Getting PHA out of the bacterial cell requires solvent extraction or mechanical disruption — energy-intensive
- **Feedstock:** Commercial scale currently uses food-grade glucose — competing with human/animal food supply

**Cost reduction strategies being actively developed:**
- **Waste feedstocks:** Using methane (from biogas), fatty acids from food waste, or CO₂ as bacterial carbon sources
- **Continuous fermentation:** Instead of batch fermentation, continuous systems improve productivity
- **Metabolic engineering:** Engineering bacteria (E. coli, Cupriavidus necator) for higher yield and faster growth
- **Synthetic biology:** Designing entirely new microbial hosts optimized for industrial PHA production

**Cost trajectory:** Industry analysts project PHA costs falling to ₹150-200/kg by 2030 as new large-scale plants come online — still above conventional plastics, but within reach of premium packaging segments.

---

### Indian Industry Example

**Kaneka Biopolymers** (Japan) supplies PHBH (branded **Kaneka PHBH**) globally and has partnered with Indian packaging converters for trials in compostable food packaging. **CJ BIO** (South Korea, now part of **CJ CheilJedang**) operates one of the largest commercial PHA fermentation facilities globally and has established distribution in India.

In India, the **DBT (Department of Biotechnology)** has funded multiple IIT and CSIR research groups working on indigenous PHA production from Indian agricultural waste streams — mustard seed cake, sugarcane bagasse — specifically targeting cost reduction for domestic production. **CSIR-IICT Hyderabad** has published significant research on PHA production from inexpensive waste feedstocks relevant to Indian industrial conditions.

---

## Key Takeaways

- PHA is produced by bacteria as intracellular energy storage granules — genuine biological origin that gives it true biodegradability in soil and marine environments because other microorganisms possess PHA depolymerase enzymes to consume it as a food source
- The PHA family ranges from stiff/brittle PHB to flexible PHBH — copolymer composition is tunable to target specific mechanical property profiles resembling PP or LDPE
- PHA's 2-4× cost premium vs conventional polymers is the primary commercial barrier; cost reduction through waste carbon feedstocks (methane, food processing waste) and metabolic engineering is the active research frontier that will determine when PHA becomes mainstream
`,
  },
  {
    subject_slug: 'sustainable-plastics',
    title: 'Packaging Design for Sustainability: Mono-materials and Recyclable Structures',
    summary: 'Learn the engineering principles for designing plastic packaging that can actually be recycled — mono-material structures, barrier coating alternatives to multi-layer laminates, and the commercial reality of sustainable packaging redesign.',
    order_index: 4,
    is_premium: false,
    content: `## The Recyclability Problem Is Mostly a Design Problem

A large fraction of plastic packaging that ends up in landfill is not there because recycling infrastructure doesn't exist — it is there because the packaging was never designed to be recyclable. Multi-layer laminates, mixed-material structures, and incompatible component combinations (a PP tray with a PET lid, heat-sealed; a BOPP film with an aluminium metallized layer; a HDPE bottle with a PVC shrink-sleeve label) all create recycling challenges at the sorting and reprocessing stage.

The Ellen MacArthur Foundation's **New Plastics Economy** initiative and the EU PPWR framework are forcing a redesign moment — and the engineers who understand both the performance requirements and the recyclability constraints will be the ones who solve it.

---

## Why Multi-Layer Laminates Exist

Multi-layer laminates are the dominant form of flexible packaging for food products globally — and they exist for very good functional reasons:

| Layer | Material | Function |
|-------|---------|---------|
| Outer layer | BOPP | Printability, stiffness, moisture barrier |
| Barrier layer | EVOH or PVDC | Oxygen barrier (critical for food shelf life) |
| Tie layers | Modified PE/PP | Bond incompatible layers |
| Seal layer | LDPE or CPP | Heat sealability |

A 5-layer BOPP/tie/EVOH/tie/CPP structure can achieve oxygen transmission rates below 1 cc/m²/day — extending food shelf life by weeks. The problem: this structure is virtually impossible to mechanically recycle because the layers are chemically incompatible and permanently bonded.

**The global scale of this problem:** Multi-layer flexible packaging represents approximately 30-35% of all plastic packaging by weight, and less than 5% of it is recycled globally.

---

## The Mono-Material Revolution

The engineering challenge is to achieve the barrier performance of multi-layer laminates using **mono-material structures** — single-polymer structures that can be sorted and recycled in existing streams.

### Strategy 1: BOPP-Based Mono-material Structures

**Standard (non-recyclable):** BOPP + PE + EVOH + PE
**Mono-material alternative:** BOPP + thin inorganic barrier coating (SiOx or AlOx) + BOPP seal layer

**How inorganic barrier coatings work:** Physical Vapour Deposition (PVD) or Plasma-Enhanced Chemical Vapour Deposition (PECVD) deposits an extremely thin (10-50 nanometres) layer of silicon oxide (SiOx) or aluminium oxide (AlOx) onto the film surface. These inorganic layers provide excellent oxygen and moisture barrier properties while remaining so thin they do not affect recyclability — the film is still >99.9% polypropylene by weight.

**Performance:** SiOx coated BOPP achieves oxygen transmission rates of 1-3 cc/m²/day — not quite as good as EVOH-containing structures (0.1-1 cc/m²), but sufficient for many dry food applications (snacks, cereals, coffee).

### Strategy 2: PE-Based Mono-material Flexible Packaging

**Structure:** MDO-PE (machine-direction oriented polyethylene) for stiffness + LDPE or LLDPE seal layer + thin barrier coating

All layers are polyethylene → recyclable in PE film streams (supermarket take-back schemes in Europe collect PE film specifically). This approach is being adopted by several major European snack brands.

### Strategy 3: All-PET Thermoformed Trays

Replace PP tray + PET lid heat-sealed combinations with **all-PET** structures — same material for both tray and lidding film, both clear PET → recyclable in PET stream without needing lid separation.

---

## Component Compatibility Matrix

Design rule: all components of packaging (container, closure, label) should be compatible with the same recycling stream or easily separable.

| Component Combination | Recyclability | Solution |
|----------------------|--------------|---------|
| HDPE bottle + HDPE cap | ✅ Both HDPE — recyclable together | Standard design |
| HDPE bottle + PP cap | ✅ Both polyolefins — acceptable in mixed PE/PP stream | Acceptable |
| HDPE bottle + PVC shrink sleeve | ❌ PVC contaminates HDPE stream | Switch to PE shrink sleeve or paper label |
| PET bottle + PVC cap | ❌ PVC poisons PET melt | Switch to PET or PP cap |
| PET tray + PP lidding film | ❌ Incompatible materials | Switch to all-PET or all-PP structure |
| Black pigmented tray (carbon black) | ❌ NIR sorting cannot identify → ends in landfill | Switch to detectable pigments (carbon-black free) |

**The black plastic problem** deserves special emphasis. Black carbon-black pigmented plastic is ubiquitous in Indian ready-meal trays, electronics packaging, and automotive parts. It is virtually impossible to sort via NIR spectroscopy — the carbon black absorbs all NIR wavelengths, preventing material identification. Alternative: **wavelength-selective pigments** that appear black visually but are transparent to NIR (available from suppliers like Clariant and Cabot).

---

### Indian Industry Example

**Uflex Limited** (Noida) is India's largest flexible packaging manufacturer and one of the early adopters of mono-material flexible packaging structures in India — their **Quantum** range includes recyclable BOPP-based mono-material pouches certified to RecyClass and How2Recycle standards, targeting FMCG customers with EU export commitments.

**Huhtamaki India** (now part of **Huhtamaki Oyj**, Finland) is redesigning their food service packaging range toward mono-material structures specifically to comply with EU PPWR and to meet Unilever and Nestlé's internal sustainable packaging commitments that cascade to their Indian supplier base.

Globally, **SABIC** launched the **TRUCIRCLE** certified-circular polyolefin portfolio, while **Borealis** and **LyondellBasell** both have published mono-material packaging design guides for their polyolefin customers — technical documents that any Indian packaging converter working with these suppliers can access to guide their own product redesign.

---

## Key Takeaways

- Multi-layer laminates (BOPP/EVOH/PE) provide excellent barrier performance for food shelf life but are essentially unrecyclable — the engineering challenge is achieving comparable barrier performance with mono-material structures
- Inorganic barrier coatings (SiOx, AlOx) deposited at nanometre thickness via PVD/PECVD enable mono-material BOPP or PE films with adequate barrier properties for dry food applications while remaining recyclable
- Component compatibility (container, closure, label all in the same recycling stream) and elimination of carbon-black pigments (invisible to NIR sorting) are the two most actionable design rules for improving real-world packaging recyclability
`,
  },
  {
    subject_slug: 'sustainable-plastics',
    title: 'Bio-PE, Bio-PET, and Drop-In Bio-based Polymers',
    summary: 'Understand the commercial reality of drop-in bio-based polymers — materials chemically identical to their fossil equivalents, produced from renewable feedstocks, fully compatible with existing recycling streams.',
    order_index: 5,
    is_premium: false,
    content: `## The Pragmatic Path to Sustainability

The term "bioplastic" often conjures images of compostable cups and PLA cutlery. But the largest and arguably most commercially important category of bio-based polymers is one that looks, feels, processes, and recycles exactly like conventional plastic — because chemically, it is identical.

**Drop-in bio-based polymers** are produced from renewable biological feedstocks but have the same molecular structure, processing requirements, and end-of-life behavior as their petroleum-derived equivalents. They slot directly into existing supply chains, processing equipment, and recycling streams without any modification.

---

## Bio-PE: Green Polyethylene

**Braskem's "I'm green" Bio-PE** (Brazil) is the world's most commercially successful drop-in bio-based polymer. It is produced from:

\`\`\`
Sugarcane → Sucrose → Ethanol (fermentation) → Ethylene (dehydration) → Bio-PE (polymerization)
\`\`\`

**The key chemistry:** Ethylene is ethylene, regardless of whether it came from cracking naphtha or dehydrating bioethanol. The polymerization reaction, the polymer chain structure, the mechanical properties, the processing parameters, and the recycling behavior are identical to fossil PE.

### Why Bio-PE Matters Despite Being "The Same"

The environmental case rests entirely on carbon accounting:

| Metric | Fossil LDPE | Bio-PE (Braskem "I'm green") |
|--------|------------|------------------------------|
| Fossil carbon consumed | 2.0 kg C/kg polymer | ~0.1 kg C/kg (only for auxiliary energy) |
| CO₂ sequestered in feedstock | 0 | ~3.09 kg CO₂/kg polymer |
| Net GWP | +1.9 kg CO₂/kg | **-2.15 kg CO₂/kg** (carbon negative) |

**The sugarcane argument:** Sugarcane photosynthesis captures atmospheric CO₂ — when that carbon is locked into bio-PE, it is temporarily removed from the atmosphere. If the bio-PE is eventually burned or degrades, the CO₂ returns — so it is not permanent sequestration. But during the product's useful life, the net carbon footprint is negative, which counts as a credit in carbon accounting methodologies like ISO 14064 and GHG Protocol.

**Commercially:** Several global brands (Tetra Pak, Procter & Gamble, Coca-Cola) use Braskem Bio-PE for packaging caps and films, specifically because it is drop-in compatible with their existing manufacturing lines and certification under mass balance is straightforward.

---

## Bio-PET: The Partial Solution

**PET** consists of two monomers: **terephthalic acid (TPA, 70% of mass)** and **ethylene glycol (EG, 30% of mass)**.

**Bio-EG** is commercially available: the same sugarcane → ethanol → ethylene → EG route used for Bio-PE gives bio-derived EG. Coca-Cola's **PlantBottle** uses bio-EG to produce PET that is 30% bio-based by mass. This bio-PET is chemically identical to fossil PET — same properties, same processing, same rPET recyclability.

**Bio-TPA** is the unsolved piece. TPA is derived from p-xylene, which comes from reforming naphtha (fossil crude). No cost-competitive commercial bio-TPA production route exists yet, though multiple routes are in development:
- Isobutanol from fermentation → p-xylene → TPA (Gevo, USA)
- Furandicarboxylic acid (FDCA) from HMF from fructose → PEF polymer (Avantium — not identical to PET but a potential replacement)

**PEF (Polyethylene Furanoate)** from **Avantium** (Netherlands) deserves mention: it is a bio-based PET analog with a furan ring instead of a benzene ring, giving it **better gas barrier properties than PET** (6-10× better O₂ barrier) and higher Tg (~86°C vs 80°C for PET). PEF is not drop-in identical to PET (different monomer, different recycling compatibility), but Avantium is positioning it as a premium bio-based PET replacement for high-barrier applications like beer bottles.

---

## Bio-Nylon and Bio-Polyurethane

**Arkema** (France) produces **Rilsan** bio-polyamide 11 (PA11) from castor oil — a non-food feedstock, which avoids the food vs fuel land use debate. PA11 is a high-performance polyamide with excellent chemical resistance used in automotive fuel lines, hydraulic hoses, and sports equipment. Its bio-based origin gives it a significantly lower carbon footprint than Nylon 6 or Nylon 6,6 (~3.1 kg CO₂/kg vs 6.5-9.0 kg CO₂/kg for fossil Nylon 6).

**BASF's** Elastopan bio-polyurethane system uses bio-based polyols from castor oil, tall oil, and CO₂-based polyols — again, drop-in compatible with fossil polyurethane processing systems.

---

### Indian Industry Example

**Reliance Industries** has publicly announced plans to explore bio-based feedstock integration at their Jamnagar and Hazira complexes — bio-ethanol as a co-feed for their ethylene crackers. India's large sugarcane and agricultural surplus makes bio-based ethylene technically feasible at scale, though the economic case depends on relative crude oil and bioethanol prices.

**Godrej Consumer Products** and **Marico** have run trials with Braskem Bio-PE for cosmetics and personal care packaging — supply chains already established. **Coca-Cola India** uses PlantBottle (bio-EG PET) for select product lines, aligned with their global 50% bio-based or recycled PET target.

Globally, **Braskem** (Brazil) remains the undisputed leader in bio-PE volume, supplying over 200,000 tonnes/year of "I'm green" bio-PE, while **Corbion** (Netherlands) and **Toray Industries** (Japan) are leaders in bio-based chemical intermediates feeding the broader bio-based polymer supply chain that Indian companies increasingly source from.

---

## Key Takeaways

- Drop-in bio-based polymers (Bio-PE, Bio-PET) are chemically identical to fossil equivalents — same processing, same recycling, same end-of-life — with the entire environmental benefit in carbon accounting via biogenic carbon sequestration in the feedstock
- Bio-PE from Braskem achieves a carbon-negative footprint (-2.15 kg CO₂/kg) because sugarcane photosynthesis sequesters atmospheric CO₂ that becomes locked in the polymer, making it directly compatible with existing PE recycling streams without any modification
- Bio-PET is currently only 30% bio-based (bio-EG only) because bio-TPA has no commercial production route yet — PEF (Avantium) is a bio-based PET analog with better barrier properties but requires new recycling infrastructure rather than being drop-in compatible
`,
  },
  {
    subject_slug: 'sustainable-plastics',
    title: 'The Future of Sustainable Plastics: Trends, Investment, and Your Career',
    summary: 'Map the commercial and technological trajectory of sustainable plastics through 2035 — where global capital is flowing, which technologies will scale, and how to position yourself at the intersection of polymer engineering and the circular economy.',
    order_index: 6,
    is_premium: false,
    content: `## A Sector in Genuine Transition

The sustainable plastics sector is not a marketing exercise — it is undergoing a technology and capital investment shift that will fundamentally reshape the polymer industry over the next decade. The signals are unusually clear: regulatory mandates, brand commitments, and venture capital are all pointing in the same direction simultaneously. For a polymer engineering student, understanding this trajectory is as important as understanding the chemistry.

---

## Where Global Capital Is Flowing

### Chemical Recycling Investment (2022-2026)

| Company | Technology | Investment | Location |
|---------|-----------|-----------|---------|
| Eastman | Methanolysis (PET) | $1 billion | Tennessee, USA |
| Plastic Energy | Pyrolysis | €100M+ | Spain, Netherlands |
| PureCycle | Solvent purification (PP) | $500M+ | USA, Europe |
| Carbios | Enzymatic PET | €200M+ | France |
| INEOS Styrolution | PS chemical recycling | €100M+ | Europe |
| Indorama Ventures | Mechanical + chemical PET | $1.5B | Global |

The sheer volume of capital entering chemical recycling is unprecedented. The 2022-2026 period has seen more investment in plastic recycling technology than the previous three decades combined — driven by EU PPWR mandates, corporate sustainability commitments, and improving process economics.

### Bio-Based Polymer Investment

| Company | Focus | Status |
|---------|-------|--------|
| Avantium | PEF (bio-PET analog) | First commercial plant 2024 |
| Novamont | PHA + starch blends | Scaling PHBH production |
| Kaneka | PHBH | Commercial, scaling capacity |
| Corbion | PLA, lactic acid | Expanding Thailand plant |
| CJ BIO | PHA | New large-scale plant announced |

---

## The Technologies Most Likely to Scale by 2030

**High confidence:**
1. **Mechanical recycling with NIR sorting** — already commercial, economics work, scaling continuously
2. **Pyrolysis to cracker feedstock** — commercial-scale plants operating, oil majors (IOCL, Reliance potentially) as off-takers create viable economics
3. **PET enzymatic recycling (Carbios)** — first commercial plant open, brand commitments secured, technology de-risked
4. **Mono-material packaging redesign** — driven by regulation and brand demand, no technology barrier — only design and supply chain change needed

**Medium confidence (2030-2035):**
5. **PHBH at commodity scale** — cost trajectory is improving, but fermentation scale-up takes time
6. **PEF commercial scale** — Avantium plant starting, technology proven, market acceptance being established
7. **Bio-PP from bio-propylene** — fermentation routes for propylene being developed but not yet cost-competitive

**Long horizon (2035+):**
8. **Polyolefin chemical recycling beyond pyrolysis** — true PE/PP depolymerization back to monomers not yet commercially viable
9. **Carbon capture to polymer feedstocks** — CO₂ + H₂ (green hydrogen) to methanol to olefins is technically possible, economics require cheap green hydrogen

---

## The Careers This Creates

The sustainable plastics transition creates specific engineering roles that combine polymer science with sustainability expertise:

| Role | What You Do | Skills Needed | Salary Range |
|------|------------|--------------|-------------|
| Recycled Material Engineer | Qualify rPET/rHDPE grades, manage quality variation | Polymer testing, supplier auditing, compounding | ₹10-20 LPA |
| EPR Compliance Manager | Register PIBOs, manage certificate trading, audit recyclers | EPR regulations, data management, auditing | ₹12-22 LPA |
| LCA Analyst | Calculate product carbon footprints, identify redesign opportunities | ISO 14040, SimaPro/GaBi, data analysis | ₹10-18 LPA |
| Sustainable Packaging Engineer | Redesign packaging for recyclability/bio-based | Packaging design, mono-material structures, certification | ₹8-18 LPA |
| Chemical Recycling Process Engineer | Design/operate pyrolysis or depolymerization plants | Polymer chemistry, process engineering, safety | ₹12-25 LPA |
| Bioplastics Application Engineer | Develop PLA/PHA processing parameters, customer trials | Polymer processing, material characterization | ₹10-20 LPA |

---

## India-Specific Opportunity

India is uniquely positioned in the sustainable plastics transition for several reasons:

1. **Scale of plastic consumption:** India is the world's 4th largest plastic consumer — the problem is large enough that domestic solutions are needed
2. **Informal recycling infrastructure:** India's ragpicker network collects >90% of PET bottles — a collection infrastructure that took decades to build organically and that formal recycling economies are now trying to formalize and scale
3. **Agricultural feedstock abundance:** Sugarcane, bagasse, and agricultural residues are available at scale for bio-based polymer production
4. **Engineering talent cost advantage:** Indian polymer engineers with sustainability expertise will be globally competitive in salary terms while being more affordable for Indian companies

**The highest-leverage position for an Indian PPE graduate entering the sustainable plastics sector:** expertise at the intersection of polymer chemistry, processing knowledge, and regulatory framework understanding — this combination is genuinely rare and immediately valuable to companies navigating EPR compliance while also needing to reformulate products with recycled content.

---

### Indian Industry Example

**Tata Chemicals** has announced entry into the sustainable materials space via bio-based chemical intermediates. **Reliance Industries** has committed to a net-zero emissions target and is evaluating both chemical recycling and bio-based feedstock integration. The **FICCI Plastics & Polymer Division** has published a roadmap for Indian plastics sector sustainability aligned to government Net Zero 2070 commitments, identifying recycling technology and bio-based polymers as the two primary investment tracks.

Globally, the **World Economic Forum's Global Plastic Action Partnership (GPAP)** and the **Ellen MacArthur Foundation's New Plastics Economy** are the frameworks within which global brand owners, governments, and technology companies are coordinating the sustainable plastics transition — understanding these frameworks is essential context for any polymer engineer working in the sustainability space.

---

## Key Takeaways

- The 2022-2026 period has seen unprecedented capital investment in chemical recycling and bio-based polymers — Eastman ($1B), Carbios (€200M), Avantium, and others represent a genuine technology transition, not a marketing exercise
- The highest-confidence technologies scaling by 2030 are mechanical recycling with NIR sorting, pyrolysis to cracker feedstock, enzymatic PET recycling, and mono-material packaging redesign — all need polymer engineers who understand both the chemistry and the regulatory context
- India's combination of large plastic consumption scale, existing informal collection infrastructure, agricultural feedstock abundance, and engineering talent creates a distinctive opportunity for PPE graduates entering the sustainable plastics career track
`,
  },
];

async function seedLessons() {
  console.log('🚀 PolymerHub Phase 2 — Seeding Sustainable Plastics lessons 1-6...\n');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
  }

  const { data: subjects, error: subjectError } = await supabase
    .from('subjects').select('id, slug');

  if (subjectError) {
    console.error('❌ Failed to fetch subjects:', subjectError.message);
    process.exit(1);
  }

  const subjectMap = {};
  subjects.forEach((s) => { subjectMap[s.slug] = s.id; });

  if (!subjectMap['sustainable-plastics']) {
    console.error('❌ Subject "sustainable-plastics" not found. Run phase2_complete_safe.sql first.');
    process.exit(1);
  }

  const lessons = lessonData.map((lesson) => ({
    subject_id: subjectMap[lesson.subject_slug],
    title: lesson.title,
    slug: slugify(lesson.title),
    content: lesson.content,
    summary: lesson.summary,
    is_premium: lesson.is_premium,
    order_index: lesson.order_index,
  }));

  const { data, error } = await supabase
    .from('lessons')
    .upsert(lessons, { onConflict: 'slug', ignoreDuplicates: false })
    .select();

  if (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }

  console.log('✅ Sustainable Plastics lessons seeded!\n');
  data.forEach((l, i) => console.log(`   ${i + 1}. ${l.title}`));
  console.log(`\n🎉 Done! ${data.length} lessons added.\n`);
}

seedLessons();
