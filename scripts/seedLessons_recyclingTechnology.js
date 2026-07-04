// scripts/seedLessons_recyclingTechnology.js
// Run with: node scripts/seedLessons_recyclingTechnology.js

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
    subject_slug: 'recycling-technology',
    title: 'Introduction to the Plastics Recycling Landscape: Why It Matters Now',
    summary: 'Understand the scale of the global plastic waste problem, India\'s EPR framework, and why recycling technology is the fastest-growing career track in the polymer sector.',
    order_index: 1,
    is_premium: false,
    content: `## The Problem Is Real — and Solvable

Every year, approximately **400 million tonnes** of plastic are produced globally. Of that, roughly **9%** is recycled, **12%** is incinerated, and **79%** accumulates in landfills or leaks into the environment. That gap between what is produced and what is recovered is the engineering problem of your generation.

This isn't a reason to be pessimistic about a career in polymer engineering. It's the opposite — it means there is an enormous technical and industrial problem that needs engineers who understand polymer science deeply. Recycling is not a social movement. It is an engineering challenge.

---

## What "Recycling" Actually Means

The word "recycling" covers at least four distinct technical processes, each with different economics, equipment requirements, and output quality:

| Type | What Happens | Output | Maturity |
|------|-------------|--------|---------|
| **Mechanical recycling** | Sort, wash, shred, re-melt, re-pelletize | Recycled resin (rPET, rHDPE, rPP) | Commercial scale |
| **Chemical recycling (pyrolysis)** | Thermal cracking of polymers into fuel or monomer | Pyrolysis oil, syngas | Pilot to early commercial |
| **Depolymerization** | Break polymer back into original monomers | Virgin-equivalent monomers | Pilot scale (PET, Nylon) |
| **Enzymatic recycling** | Biological enzymes digest specific polymers | Monomers (PET → TPA + EG) | Early pilot (Carbios) |

Most of what India currently does is mechanical recycling. The entire chemical recycling sector — pyrolysis, depolymerization, enzymatic — is where global investment and job creation is happening right now, and where an engineer with polymer chemistry and processing knowledge has enormous advantage over a generic chemical engineer.

---

## India's EPR Framework: The Policy Driver

**Extended Producer Responsibility (EPR)** is the legal framework that is forcing recycling to scale in India. Under the **Plastic Waste Management Rules 2022 (amended)**, every producer, importer, and brand owner (PIBO) of plastic packaging must:

1. Register on the **CPCB EPR portal**
2. Meet annual recycled content targets (increasing from 25% to 60% by 2025-26)
3. Purchase **EPR certificates** from registered recyclers to meet targets they cannot fulfil directly

**What this creates:** A legally mandated market for certified recycled material. Every tonne of rPET, rHDPE, or rPP that a registered recycler produces and certifies generates an EPR certificate that PIBOs are willing to pay a premium for. This is why new recycling plants are being registered across India — there is now a government-backed financial incentive beyond just the commodity value of recycled resin.

---

## The Three Streams That Matter Most in India

### 1. PET (Polyethylene Terephthalate)
- **Source:** Water and beverage bottles (Bisleri, Kinley, Coca-Cola)
- **Collection infrastructure:** Ragpickers collect >90% of PET bottles in urban India — one of the highest informal collection rates globally
- **End use:** rPET fiber (largest volume), rPET packaging, rPET strap

### 2. HDPE
- **Source:** Milk pouches (Amul, Mother Dairy), shampoo/detergent bottles, pipes offcuts
- **End use:** Non-food containers, drainage pipes, cable sheathing

### 3. PP
- **Source:** Woven sacks, crates, caps, automotive parts
- **End use:** Compounded rPP for automotive, furniture, non-food packaging

---

### Indian Industry Example

**Dalmia Polypro** (now part of **Dalmia Bharat Refractories**) operates one of India's largest PET recycling plants, processing post-consumer PET bottles into rPET flake and fiber. **Ganpati Plastfab** (Gujarat) is a major rHDPE and rPP processor supplying recycled resin to pipe fittings manufacturers across western India.

Globally, **Veolia** (France) and **SUEZ** (France, now part of Veolia) are the world's largest waste management and recycling infrastructure companies, operating mechanical recycling lines at a scale that Indian companies are now beginning to emulate — while **Carbios** (France) is leading the enzymatic depolymerization revolution, with a commercial PET recycling plant beginning operations with global brand partners including L'Oreal and Nestlé.

---

## Key Takeaways

- Global plastic production is 400 million tonnes annually with only 9% currently recycled — the gap is an engineering opportunity, not just an environmental concern
- Four recycling technologies exist at different maturity levels: mechanical (commercial), pyrolysis (early commercial), chemical depolymerization, and enzymatic (pilot) — each requiring polymer engineering expertise
- India's EPR framework creates a legally mandated market for certified recycled material, making recycling plant investment financially viable beyond just commodity resin value
`,
  },
  {
    subject_slug: 'recycling-technology',
    title: 'Mechanical Recycling: Collection, Sorting, and Reprocessing',
    summary: 'Master the mechanical recycling process from post-consumer collection through washing, sorting, shredding, and pelletizing — the backbone of India\'s current recycling infrastructure.',
    order_index: 2,
    is_premium: false,
    content: `## The Dominant Technology — For Now

Mechanical recycling is the process of physically sorting, cleaning, and reprocessing post-consumer plastic waste back into usable resin — without breaking the polymer chains. It is the most commercially mature recycling technology and handles the vast majority of plastic recycled globally today.

Understanding mechanical recycling in detail is essential because it is where most recycling plant jobs exist right now, where most EPR compliance is being met, and where India is investing most heavily in new capacity.

---

## The Full Process Chain

\`\`\`
COLLECTION → SORTING → BALING → SHREDDING → WASHING → 
DRYING → EXTRUSION/PELLETIZING → QUALITY TESTING → rPELLET
\`\`\`

### Step 1: Collection and Baling

Post-consumer plastic waste reaches recyclers through:
- **Ragpicker networks** (informal — dominant in India, especially for PET)
- **Municipal collection** (formal, growing with Smart Cities initiatives)
- **Buy-back schemes** (corporate EPR-driven collection by brands)
- **Industrial waste** (clean, sorted offcuts from processors — easiest to recycle)

Material arrives at the recycling plant as loose bales, often mixed. A standard bale of post-consumer PET bottles weighs ~200-500 kg.

### Step 2: Sorting

Sorting separates plastics by type, colour, and contamination level. This is the most critical and technically challenging step — mixing incompatible polymers (even 5% HDPE in a PET stream) destroys the quality of the recycled output.

**Sorting technologies:**

| Technology | How It Works | Accuracy |
|------------|-------------|----------|
| **Manual sorting** | Workers separate by visual identification | ~85-90%, labour-intensive |
| **Near-Infrared (NIR) spectroscopy** | Each polymer reflects IR differently — sensors identify and air jets separate | >98%, standard in modern plants |
| **Density separation (float-sink tanks)** | PET sinks (1.38 g/cm³), HDPE/PP float (0.95 g/cm³) in water — simple physical separation | Excellent for PE/PP vs PET |
| **Eddy current separation** | Removes aluminium (metal caps, foil laminates) from plastic stream | Specific to metal removal |
| **Colour sorting (optical)** | Camera + AI identifies and separates by colour | Used for PET: clear vs coloured vs opaque |

NIR sorting is the technology transformation happening in India right now. Traditional manual-sort plants are being upgraded or replaced by NIR-equipped lines as EPR certificate quality requirements tighten.

### Step 3: Shredding and Grinding

Sorted plastic is shredded into flake (typically 10-20mm for PET, larger for HDPE/PP) using industrial shredders and granulators. Flake size affects washing efficiency — smaller flake has more surface area to clean but requires more energy.

### Step 4: Washing

The most water-intensive step. Plastic flake passes through a series of wash tanks:

1. **Pre-wash / float-sink tank:** Removes heavy contaminants (sand, glass, metal), initial density separation
2. **Hot wash (60-80°C with caustic soda / NaOH):** Removes food residue, adhesive labels, and microbial contamination — critical for food-contact rPET
3. **Friction washer:** High-shear mechanical action removes label fragments and surface contamination
4. **Rinse tank:** Removes caustic soda residue to prevent alkaline degradation of PET during reprocessing

**Water consumption** is a major environmental and cost issue — a well-designed plant recirculates and treats 80%+ of wash water. This is an active area of engineering improvement.

### Step 5: Drying

Wet flake must be dried to very low moisture levels before extrusion — especially critical for hygroscopic polymers like PET and Nylon, which hydrolyze (chains break due to moisture at melt temperature) if moisture is above ~0.005% by weight for PET.

Drying is done in **rotary drum dryers** or **dehumidifying hopper dryers** at 120-150°C for PET.

### Step 6: Extrusion and Pelletizing

Dry flake is melted and extruded through a multi-vent single or twin-screw extruder with:
- **Vacuum venting** to remove residual volatiles (odour compounds, degradation products)
- **Filtration** through progressively finer screens (from 100-mesh to 300-mesh or finer) to remove unmelted contaminants
- **Underwater pelletizer** to produce uniform recycled pellets (rPellets)

The extruder conditions must be carefully controlled — PET recycles best at lower temperatures with shorter residence time to minimize additional molecular weight reduction (chain scission).

---

## Quality of Recycled Output

Mechanical recycling always produces resin of **lower molecular weight and slightly worse properties** than virgin resin due to:
- Thermal history (re-melting causes some chain scission)
- Contamination (even small amounts degrade properties significantly)
- Mixed colour streams (limits colour options)

**rPET grades by quality:**
- **Food-contact rPET (FC grade):** Requires decontamination step (superclean process), FDA/EU approved. Used in bottle-to-bottle and food packaging. Highest value.
- **Fiber-grade rPET:** Lower purity standard, used in polyester textile fiber (majority of Indian rPET production)
- **Sheet/strap-grade rPET:** Mid-quality, used in strapping tape and packaging sheet

---

### Indian Industry Example

**Wellman International** (Ireland, global operations) and **Loop Industries** (Canada) represent the global benchmark for food-contact rPET mechanical recycling, while in India, **Polygenta Technologies** (Mumbai) pioneered food-contact grade rPET from post-consumer bottles using a superclean decontamination process, supplying to companies like Coca-Cola India under their World Without Waste commitment.

**NEPRA Resource Management** (Gujarat) is India's largest formal plastic waste collection and recycling network operator, managing EPR compliance programmes for major FMCG brands and demonstrating how the formal recycling sector is scaling up from the informal ragpicker base.

---

## Key Takeaways

- Mechanical recycling processes post-consumer plastic through collection, sorting (NIR spectroscopy is the key modern technology), washing, drying, and extrusion/pelletizing — each step having specific engineering requirements and failure modes
- Sorting quality is the single biggest determinant of recycled resin quality — even 5% polymer cross-contamination can make an entire batch unusable for food-contact applications
- Recycled resin is always lower molecular weight than virgin due to thermal history and contamination; quality tiers (food-contact, fiber-grade, sheet-grade) determine application and price
`,
  },
  {
    subject_slug: 'recycling-technology',
    title: 'Chemical Recycling: Pyrolysis, Depolymerization, and Solvolysis',
    summary: 'Go beyond mechanical recycling to understand the advanced chemical processes that can handle contaminated, mixed, or multi-layer plastics that mechanical recycling cannot — and why global investment is flooding into this space.',
    order_index: 3,
    is_premium: false,
    content: `## When Mechanical Recycling Hits Its Limits

Mechanical recycling works well for clean, well-sorted single-polymer streams. But most real-world post-consumer plastic waste is:
- Contaminated with food residue, labels, adhesives
- Multi-layer laminates (BOPP + PE + adhesive — common in snack packaging)
- Dark-coloured or mixed-colour streams that limit end-use applications
- Degraded from multiple prior processing cycles

**Chemical recycling** addresses these limitations by breaking the polymer down to smaller molecules — either fuel/wax-range hydrocarbons (pyrolysis) or the original monomers (depolymerization) — rather than re-melting the polymer chains intact.

---

## Technology 1: Pyrolysis (Thermal Cracking)

Pyrolysis applies heat (typically 400-600°C) in the **absence of oxygen** to break long polymer chains into shorter hydrocarbon molecules — producing pyrolysis oil, syngas, and char.

\`\`\`
Mixed/contaminated plastic → HEAT (400-600°C, no O₂) → 
Pyrolysis Oil (~50-60%) + Gas (~20-30%) + Char (~10-20%)
\`\`\`

### What Pyrolysis Oil Is Used For

Pyrolysis oil (also called plastic-derived fuel or PDF) is a complex mixture of hydrocarbons roughly similar to diesel or naphtha. It can be:
- **Used directly as industrial fuel** (lowest value use, but simplest)
- **Co-processed in an oil refinery** (cracker feedstock — produces virgin-equivalent polymer, the highest value application)
- **Upgraded further** to produce chemical fractions

**The key commercial challenge:** Pyrolysis oil quality varies significantly with feedstock quality and reactor design. Chlorine (from PVC contamination), nitrogen (from polyamides), and sulphur must be removed before co-processing. This is why **feedstock sorting is critical even for pyrolysis** — PVC must be removed before the mixed plastic enters the pyrolysis reactor, or it generates corrosive HCl gas.

### Pyrolysis Reactor Designs

| Reactor Type | How It Works | Advantages | Challenges |
|--------------|-------------|------------|------------|
| Fixed bed | Batch process, plastic loaded, heated, oil collected | Simple, low cost | Not continuous, inconsistent quality |
| Rotary kiln | Rotating cylinder, continuous feed possible | Better mixing, continuous | High maintenance |
| Fluidized bed | Inert sand bed fluidized by gas, plastic fed in | Best heat transfer, fast | Complex control, high capital cost |
| Microwave pyrolysis | MW energy heats plastic from within | Faster, more selective | Very early stage, high energy cost |

---

## Technology 2: Depolymerization (Back to Monomers)

Unlike pyrolysis (which produces fuel), **depolymerization** specifically breaks polymer chains back into the exact monomers they were built from — allowing production of virgin-quality polymer from recycled feedstock.

This is only possible for **condensation polymers** (PET, Nylon, Polycarbonate, Polyurethane) because their repeat units are linked by specific chemical bonds (ester, amide, carbonate) that can be cleaved selectively. **Addition polymers** (PE, PP, PS) don't have these selective cleavage points and currently cannot be depolymerized back to monomers economically.

### PET Depolymerization Routes

\`\`\`
PET → TPA (terephthalic acid) + EG (ethylene glycol) → Virgin-equivalent PET
\`\`\`

| Method | Reagent | Products | Status |
|--------|---------|----------|--------|
| Methanolysis | Methanol | DMT + EG | Commercial (Eastman) |
| Glycolysis | Ethylene glycol | BHET (bishydroxyethyl terephthalate) | Commercial for fiber-grade |
| Hydrolysis (acid) | Acid + water | TPA + EG | Emerging |
| Enzymatic (PETase) | Engineered enzyme | TPA + EG | Pilot scale (Carbios) |

**Eastman's** Kingsport, Tennessee facility (USA) is the world's largest commercial chemical recycling plant, using methanolysis to produce virgin-equivalent PET from post-consumer waste — including difficult-to-recycle dark-coloured bottles and trays.

---

## Technology 3: Solvolysis (Solvent-Based)

Solvolysis dissolves the target polymer in a solvent, separates contaminants and additives, then re-precipitates the pure polymer. Unlike pyrolysis or depolymerization, it theoretically produces **polymer** (not monomers or fuel), preserving molecular weight.

**Applicable to:** PS (polystyrene), PC (polycarbonate), mixed polymers

**Challenge:** Solvent recovery and the economics of large-scale solvent handling make this expensive and complex. Most commercially interesting work is focused on PS (which dissolves readily in limonene, a bio-based solvent derived from citrus peel).

---

## How Chemical Recycling Connects to Your Syllabus

Every chemical recycling process is deeply connected to what you've already studied:

- **Pyrolysis** applies the **thermal degradation** principles from your polymer degradation lesson — you already know that polymers break down at high temperatures; pyrolysis is a controlled version of that
- **PET depolymerization** reverses the **condensation polymerization** mechanism from your polymer chemistry lesson — knowing how PET is built tells you exactly how to break it down
- **PETase enzymatic recycling** targets the **ester bonds** in PET's backbone — the same ester linkage you learned makes PET a polyester condensation polymer

---

### Indian Industry Example

**Borealis** (Austria) and **Plastic Energy** (UK) are leaders in pyrolysis-to-cracker feedstock technology, with multiple plants now co-processing pyrolysis oil from mixed plastic waste into new polyolefins — exactly the kind of circular production Reliance Industries is evaluating for their Jamnagar complex.

In India, **Genie Recycling** (Pune) and **Rudra Environmental Solutions** (Pune) are among the early commercial-scale pyrolysis operators, while **IOCL (Indian Oil Corporation)** has published plans to co-process plastic pyrolysis oil at its refineries — a development that would massively scale the economics of chemical recycling in India when implemented.

---

## Key Takeaways

- Pyrolysis thermally cracks mixed/contaminated plastic to oil, gas, and char — feedstock for fuel or refinery co-processing; PVC contamination is the critical quality issue that must be controlled upstream
- Depolymerization breaks condensation polymers (PET, Nylon, PC) back to their original monomers, enabling true circular production of virgin-quality polymer — the holy grail of plastic recycling that Eastman and Carbios are now proving at commercial scale
- The chemistry of chemical recycling connects directly to your polymer chemistry lessons: pyrolysis is controlled thermal degradation; depolymerization reverses the condensation polymerization mechanism that built the polymer in the first place
`,
  },
  {
    subject_slug: 'recycling-technology',
    title: 'Enzymatic and Biological Recycling: The Frontier Technology',
    summary: 'Understand how engineered enzymes like PETase are revolutionizing PET recycling by mimicking biological decomposition at industrial speed — and why this technology is closer to commercial reality than most people realize.',
    order_index: 4,
    is_premium: false,
    content: `## A New Category of Recycling

In 2016, Japanese researchers discovered a bacterium called **Ideonella sakaiensis** living near a plastic bottle recycling facility — and found it was eating PET as its primary food source using two enzymes: **PETase** and **MHETase**. This discovery triggered a global race to engineer these enzymes for industrial use.

The fundamental idea: rather than using high-temperature thermal processes to break plastic into hydrocarbons (pyrolysis) or cleave ester bonds using harsh chemicals (depolymerization), could we use **biological catalysts** — proteins evolved or engineered to specifically target polymer bonds — to do the same work at lower energy, higher selectivity, and with higher-quality outputs?

The answer is increasingly yes — but with important constraints that every polymer engineer needs to understand.

---

## How PETase Works

PETase is a **hydrolase enzyme** — it breaks ester bonds using water (hydrolysis) specifically within the PET polymer chain.

\`\`\`
PETase attacks the ester bond:

—[CH₂-CH₂-O-CO-C₆H₄-CO-O]n—
         ↑ ester bond ↑
         PETase cleaves here using H₂O

→ Produces: MHET (monohydroxyethyl terephthalate)
  MHETase further converts MHET → TPA + EG
\`\`\`

**Final products:** Terephthalic acid (TPA) and ethylene glycol (EG) — the exact monomers used to synthesize virgin PET. This is **true circular recycling**: plastic in, monomers out, new plastic possible.

### The Engineering Challenge: Speed

Natural PETase is extremely slow. At ambient temperature, it would take years to decompose a plastic bottle. The engineering challenge has been to dramatically increase reaction rate (called **enzyme activity** or **kcat**) through protein engineering.

**Key milestones:**

| Year | Development | Impact |
|------|------------|--------|
| 2016 | PETase discovered in *Ideonella sakaiensis* | Proof of concept |
| 2018 | NREL/University of Portsmouth engineer PETaseM | 20% faster than wild-type |
| 2020 | Carbios engineers thermophilic FAST-PETase | Runs at 72°C, commercially viable rate |
| 2022 | UT Austin develops **FAST-PETase** variant | Degrades PET in 24 hours at 50°C |
| 2024 | Carbios opens world's first commercial enzymatic PET recycling demonstration plant | Industrial validation |

**HotPETase** (also called thermophilic PETase) operates at 65-72°C rather than ambient temperature — much closer to PET's glass transition temperature, where chains are more mobile and accessible to the enzyme. This temperature window is critical for commercial viability.

---

## Carbios: The Commercial Pioneer

**Carbios** (France) is the company closest to commercial-scale enzymatic PET recycling. Their process:

1. Grind post-consumer PET waste into flake
2. Heat to ~72°C in a bioreactor with their proprietary PETase
3. Enzyme degrades PET to TPA + EG within hours
4. Separate, purify, and recover monomers
5. Repolymerize into virgin-equivalent PET

**Key advantages over mechanical recycling:**
- Can process **coloured, contaminated, and multi-layer PET** (enzyme is selective for PET regardless of colour or surface contamination)
- Produces **virgin-equivalent monomers** — no quality loss vs virgin
- Works on **food-contact packaging** that mechanical recycling struggles to certify

**Brand partners:** Carbios has signed agreements with **L'Oréal, Nestlé, PepsiCo, and Solvay** to supply enzymatically recycled PET for packaging — the first commercial commitments to this technology.

---

## Beyond PETase: Other Polymer-Active Enzymes

PET is not the only polymer that biological systems can degrade. Active research is happening on:

| Polymer | Enzyme Class | Status |
|---------|-------------|--------|
| PET | PETase (hydrolase) | Pilot/commercial (Carbios) |
| Nylon 6 | Nylon hydrolases | Early research |
| Polyurethane | Esterases, proteases | Early research |
| PBAT (biodegradable plastic) | Lipases | Moderate progress |
| Natural rubber | Rubber oxygenase (RoxA) | Early research |

**Polyolefins (PE, PP) remain the frontier challenge** — their C-C backbone has no specific enzymatic cleavage site, and oxidative degradation by laccase/peroxidase enzymes is far too slow to be commercially useful. This is why PE and PP chemical recycling still relies on thermal pyrolysis.

---

## Life Cycle Assessment of Enzymatic Recycling

Enzymatic recycling has a better carbon footprint than mechanical recycling in several ways:
- **No high-temperature melting** needed (72°C vs 250-280°C for PET melt processing) → lower energy
- **No sorting by colour required** → simpler feedstock preparation
- **Virgin-quality monomers** → no downcycling quality loss

However, **enzyme production itself has a carbon footprint** (fermentation to produce the protein, energy for bioreactor heating) that must be counted in full life cycle assessment. Current LCAs show 30-50% lower carbon footprint than virgin PET production — but the final number depends heavily on the energy source powering the bioreactor.

---

### Indian Industry Example

**Aarav Sustainable Solutions** and several biotech startups in the IIT Bombay and IIT Delhi ecosystems are pursuing enzyme-based plastic degradation research as part of India's push into the circular economy. The **Department of Biotechnology (DBT), Government of India** has funded multiple grant programmes specifically targeting plastic-degrading enzyme engineering.

Globally, beyond Carbios, **NREL (National Renewable Energy Laboratory, USA)** has published the most technically detailed PETase engineering research, while **Novozymes** (Denmark, the world's largest industrial enzyme manufacturer) has entered the plastic degradation space, bringing decades of large-scale enzyme fermentation expertise that will be critical for eventually producing PETase at the tonnes-per-year scale a commercial recycling plant needs.

---

## Key Takeaways

- PETase is a hydrolase enzyme that cleaves PET's ester bonds using water, producing TPA and EG monomers — enabling true circular recycling where plastic in equals virgin monomers out, with no quality degradation
- The engineering challenge is enzyme speed (kcat) at commercially useful temperatures — solved by protein engineering to produce thermophilic variants like Carbios' FAST-PETase operating at 72°C, where PET chains are mobile enough for rapid enzyme access
- Enzymatic recycling can handle coloured and contaminated PET that mechanical recycling cannot, with lower energy input than pyrolysis — but polyolefins (PE, PP) remain outside the reach of current biological approaches, and enzyme production at industrial scale remains a significant cost challenge
`,
  },
  {
    subject_slug: 'recycling-technology',
    title: 'Extended Producer Responsibility (EPR) and Regulatory Frameworks',
    summary: 'Navigate India\'s EPR compliance system, the CPCB portal, certificate trading, and how global regulations like the EU PPWR are reshaping what Indian exporters must prove about their plastic packaging.',
    order_index: 5,
    is_premium: false,
    content: `## The Policy Architecture Driving Recycling Investment

Technical recycling capability and policy framework must work together. The best recycling technology in the world produces no social or environmental benefit if there is no financial mechanism that makes operating it economically rational. **Extended Producer Responsibility (EPR)** is the policy architecture that creates that financial mechanism.

Understanding EPR is not just important for sustainability-focused career paths — it is essential for any polymer engineer working in packaging, consumer goods, or industrial plastics, because compliance now affects every company's product design and procurement decisions.

---

## What EPR Means (Simply)

The core principle: **the company that puts plastic into the market is financially responsible for that plastic's end-of-life.**

Before EPR frameworks existed, a company could sell a billion plastic sachets, and the cost of collecting and managing those sachets after use fell entirely on municipal governments and ultimately taxpayers. EPR shifts that cost back to the brand owner or producer.

How it works in practice:
1. **Producers** (who make plastic packaging) register with the regulator
2. **Producers** must meet targets: collect and have recycled a certain tonnage of plastic per year
3. **Producers** who cannot meet targets themselves can buy **EPR certificates** from registered recyclers who have recycled plastic on their behalf
4. **Registered recyclers** generate and sell EPR certificates, creating a revenue stream beyond just selling recycled resin

---

## India's EPR Framework: Plastic Waste Management Rules 2022

India's EPR system is administered by the **Central Pollution Control Board (CPCB)** under the Plastic Waste Management (Amendment) Rules 2022.

### Who Must Register?

All **Producers, Importers, and Brand Owners (PIBOs)** of:
- Plastic packaging (rigid and flexible)
- Multilayer plastic packaging
- Plastic carry bags
- Single-use plastics (where not banned)

### Targets (Phase-in Schedule)

| Category | 2024-25 | 2025-26 |
|----------|---------|---------|
| Rigid plastic packaging | 50% collection + recycling | 60% |
| Flexible plastic (≥75µ) | 50% | 60% |
| Multilayer packaging | 50% compostable/recycling | 60% |
| Category IV (sachets, etc.) | 50% collect + end of life | 60% |

### The CPCB EPR Portal

The **CPCB EPR portal** is the digital infrastructure through which:
- PIBOs register and submit annual obligation statements
- Recyclers register to generate EPR certificates
- Certificate trading/transfer is tracked
- Annual compliance reports are submitted and audited

**How certificates are generated:** A registered recycler processes X tonnes of plastic waste → submits documentation (weight slips, invoices, GST records) → CPCB portal generates EPR certificates representing those X tonnes → PIBOs purchase certificates to offset their obligation.

---

## Global Frameworks Affecting Indian Exporters

### EU Packaging and Packaging Waste Regulation (EU PPWR 2025)

The EU PPWR (formally adopted 2024, enforcement from 2025 onward) requires:
- **30% recycled content** in plastic bottles by 2030 (rising to 60%)
- **All packaging to be recyclable** by 2030 in EU member states
- **Digital Product Passports (DPP)** — traceable data on material origin and recyclability embedded in packaging

**Impact on Indian exporters:** Any Indian company exporting plastic packaging or packaged goods to the EU must now comply with PPWR requirements. This creates demand for rPET, rHDPE, and rPP with certified mass balance documentation — and requires redesigning any packaging that is not mono-material recyclable.

### US EPA Recycling Strategy

The US EPA's National Recycling Strategy (2021) sets 50% recycling rate target by 2030, driving state-level EPR legislation (California, Maine, Oregon, Colorado already have packaging EPR laws). Indian companies with US exports face similar pressure.

---

## Mass Balance Certification: ISCC PLUS

When chemical recycling or pyrolysis is used (where recycled material is mixed with fossil feedstocks at the molecule level), **mass balance** accounting is used to certify the recycled content. **ISCC PLUS** (International Sustainability & Carbon Certification) is the most widely accepted global standard.

Mass balance works like a bank account — if 10 tonnes of recycled feedstock enters a cracker alongside 90 tonnes of fossil feedstock, the 10 tonnes of recycled content can be "allocated" to specific product batches via a certified chain of custody, even though the molecules themselves are physically indistinguishable.

---

### Indian Industry Example

**Hindustan Unilever Limited (HUL)**, **ITC Limited**, and **Nestlé India** are among the largest PIBOs navigating India's EPR system, with dedicated EPR compliance teams and contracts with certified recyclers to meet their annual obligations. **HUL** has publicly committed to making all their plastic packaging recyclable by 2025 and achieving 50% recycled content across their portfolio — a commitment that creates direct procurement demand for certified rHDPE and rPET in India.

**CPCB's EPR portal** has registered thousands of PIBOs and hundreds of recyclers since its 2022 launch, with certificate trading volumes growing as compliance targets tighten. This is creating a structured, verifiable recycling economy for the first time in India.

Globally, **Tomra** (Norway) is the world's leading provider of reverse vending machines and sorting technology infrastructure that enables the collection systems underpinning EPR compliance, while **Quantis** (Switzerland) is a leading LCA and carbon accounting consultancy helping companies calculate their EPR obligations and sustainability metrics under frameworks like PPWR.

---

## Key Takeaways

- EPR frameworks make plastic producers financially responsible for end-of-life management — creating a legally mandated market for certified recycled material through certificate trading that makes recycling plant investment economically rational beyond just commodity resin value
- India's CPCB EPR portal manages registration, certificate generation, and compliance reporting for thousands of PIBOs and recyclers — with targets increasing to 60% collection and recycling by 2025-26
- Global frameworks like EU PPWR (mandatory recycled content, digital product passports) and US state EPR laws directly affect Indian exporters, requiring mass balance certification (ISCC PLUS) and packaging redesign for mono-material recyclability
`,
  },
  {
    subject_slug: 'recycling-technology',
    title: 'Life Cycle Assessment (LCA) and the Circular Economy Framework',
    summary: 'Learn how to measure a polymer product\'s total environmental impact from raw material to end of life, and how circular economy design principles can dramatically reduce that impact at the engineering stage.',
    order_index: 6,
    is_premium: false,
    content: `## Measuring What Actually Matters

An engineer can design a product that is technically recyclable but has such a high carbon footprint during production that recycling it saves almost nothing compared to virgin production. Or a bioplastic might seem "green" but requires more energy to produce than conventional PE. **Life Cycle Assessment (LCA)** is the standardized methodology that cuts through marketing claims and measures the actual environmental impact of a product or process across its entire life.

For polymer engineers, LCA skills are increasingly demanded by employers — particularly in sustainability roles, R&D, and any company with export markets where environmental certification is required.

---

## What LCA Measures

LCA, governed by **ISO 14040/14044**, quantifies environmental impacts across multiple categories:

| Impact Category | What It Measures | Unit |
|----------------|-----------------|------|
| Climate change (GWP) | Greenhouse gas emissions | kg CO₂ equivalent |
| Fossil resource use | Crude oil, natural gas depletion | MJ or kg oil eq. |
| Water consumption | Fresh water use | m³ |
| Land use | Biodiversity, soil impact | m² |
| Acidification | SO₂, NOx emissions affecting ecosystems | mol H⁺ eq. |
| Eutrophication | Nutrient runoff affecting water bodies | kg PO₄ eq. |

**Global Warming Potential (GWP)** — measured in kg CO₂ equivalent — is the impact category most reported by companies and regulators, because it directly connects to climate change commitments. But a product can have low GWP while having high water consumption or land use impacts — which is why full LCA considers multiple categories simultaneously.

---

## The Four Phases of LCA (ISO 14040)

### Phase 1: Goal and Scope Definition

Define:
- **Functional unit:** What is the product providing? (e.g., "packaging for 1 litre of liquid" — not "1 kg of polymer")
- **System boundary:** Where does the assessment start and end?
- **Cradle-to-grave** = raw material extraction → production → use → end-of-life disposal
- **Cradle-to-gate** = raw material → production (stops at factory gate)
- **Cradle-to-cradle** = includes recycling loop, credits for recycled output

### Phase 2: Inventory Analysis (LCI)

Collect all inputs (energy, materials, water) and outputs (products, emissions, waste) for every process in the system boundary. This is the most data-intensive phase.

**Example for 1 kg of PET bottle production:**
- Inputs: crude oil, ethylene, p-xylene, electricity, process heat, water
- Outputs: PET pellet, CO₂ emissions, wastewater, VOC emissions

Databases like **ecoinvent** (Switzerland) and **GaBi** (Germany) provide standardized inventory data for thousands of processes, so LCA practitioners don't have to measure everything from scratch.

### Phase 3: Impact Assessment (LCIA)

Convert the raw inventory data into impact category scores using characterization factors. For GWP, each greenhouse gas is multiplied by its 100-year global warming potential:
- CO₂: 1 kg CO₂ eq.
- CH₄ (methane): 28 kg CO₂ eq.
- N₂O (nitrous oxide): 265 kg CO₂ eq.

### Phase 4: Interpretation

Identify which life cycle stage dominates the impact, which material or process substitutions would have the most effect, and what the uncertainty is in the results.

---

## Carbon Footprints of Common Polymers

| Polymer | GWP (kg CO₂/kg polymer) | Notes |
|---------|------------------------|-------|
| LDPE | 1.9–2.2 | Standard fossil-based |
| HDPE | 1.8–2.0 | |
| PP | 1.7–2.1 | |
| PET | 2.6–3.2 | Higher due to aromatics |
| Nylon 6 | 6.5–9.0 | High — N₂O emissions from caprolactam |
| Bio-PLA | 0.5–2.5 | Depends heavily on land use and farming practices |
| rPET (mechanical) | 0.5–1.2 | ~70% lower than virgin PET |
| rPET (enzymatic) | 0.8–1.5 | Still lower than virgin; enzyme production adds back some impact |

**Nylon 6's high GWP** is largely from N₂O emissions during caprolactam synthesis — a powerful greenhouse gas 265× more potent than CO₂. This is actively being addressed by catalyst improvements at BASF and other Nylon producers.

---

## Circular Economy Design Principles

LCA reveals where impact is highest — circular economy design principles provide the engineering response.

**The Ellen MacArthur Foundation's** circular economy model prioritizes:
1. **Design out waste** (mono-material packaging vs multi-layer)
2. **Keep products and materials in use** (reusable packaging before recyclable before compostable)
3. **Regenerate natural systems** (bio-based feedstocks from regenerative agriculture)

**For polymer engineers, design for recycling (DfR) means:**
- Choose **mono-material designs** over multi-layer laminates (BOPP/PE/EVOH/PE laminates are nearly impossible to recycle; mono-BOPP with barrier coating is recyclable)
- **Avoid black carbon-black pigmented plastics** (NIR sorting cannot identify black plastic — most ends up landfilled even when otherwise recyclable)
- **Design labels for easy removal** (pressure-sensitive labels must float off in float-sink; shrink-sleeve labels must have perforations for removal)
- **Minimise adhesives** between dissimilar materials

---

### Indian Industry Example

**Tata Consultancy Services (TCS) Sustainability Practice** and **EY India** run LCA consulting practices for Indian FMCG companies navigating EU PPWR and domestic EPR requirements, quantifying product carbon footprints and identifying redesign opportunities. **Hindustan Unilever** has published detailed LCA data for several of their packaging formats, committing to mono-material redesigns specifically to enable mechanical recyclability.

Globally, **Quantis** (Switzerland) and **PRé Sustainability** (Netherlands, makers of SimaPro LCA software) are the leading LCA methodology and software providers, while the **Ellen MacArthur Foundation** (UK) runs the **Global Commitment** programme, under which over 500 companies — including Reliance's packaging customers like Unilever, Nestlé, and L'Oréal — have committed to circular packaging targets that directly drive demand for recycling-compatible polymer engineering in India.

---

## Key Takeaways

- Life Cycle Assessment (ISO 14040/14044) quantifies environmental impact across the full life cycle using a functional unit — Global Warming Potential (GWP in kg CO₂ eq.) is the most reported category, but water use, land use, and acidification matter equally in full LCA
- Recycled polymers have dramatically lower GWP than virgin (rPET is ~70% lower than virgin PET) — but the benefit depends on system boundary choices, energy source, and whether recycled content displaces virgin production
- Circular economy design principles for polymer engineers center on mono-material design, avoiding black pigments, enabling label removal, and minimizing adhesives between dissimilar materials — making recyclability possible before the product is even manufactured
`,
  },
];

async function seedLessons() {
  console.log('🚀 PolymerHub Phase 2 — Seeding Recycling Technology lessons 1-6...\n');

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

  if (!subjectMap['recycling-technology']) {
    console.error('❌ Subject "recycling-technology" not found. Run phase2_complete_safe.sql first.');
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

  console.log(`📦 Inserting ${lessons.length} lessons...\n`);

  const { data, error } = await supabase
    .from('lessons')
    .upsert(lessons, { onConflict: 'slug', ignoreDuplicates: false })
    .select();

  if (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }

  console.log('✅ Recycling Technology lessons seeded successfully!\n');
  data.forEach((l, i) => console.log(`   ${i + 1}. ${l.title}`));
  console.log(`\n🎉 Done! ${data.length} lessons added.\n`);
}

seedLessons();
