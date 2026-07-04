// scripts/seedLessons_rubberTechnology_batch.js
// Lessons 2-6 for Rubber Technology subject
// Run with: node scripts/seedLessons_rubberTechnology_batch.js

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
    subject_slug: 'rubber-technology',
    title: 'Natural Rubber vs Synthetic Rubber: Sources and Selection',
    summary: 'Understand the chemistry and sourcing of natural rubber versus the major synthetic rubber families, and how to select the right elastomer for a given application based on its property profile.',
    order_index: 2,
    is_premium: false,
    content: `## One Tree, Dozens of Synthetic Alternatives

Rubber technology began with a single natural material — latex tapped from the **Hevea brasiliensis** tree — but today's industry relies on a wide family of synthetic rubbers, each engineered to outperform natural rubber in specific properties that natural rubber lacks, such as oil resistance, heat resistance, or weathering durability.

---

## Natural Rubber (NR): Chemistry and Sourcing

Natural rubber is **cis-1,4-polyisoprene** — harvested as liquid latex from tapped rubber trees, then coagulated, processed, and dried into solid rubber sheets or blocks.

\`\`\`
Tapped Latex (liquid, ~30% rubber content) → 
Coagulation (acid treatment) → 
Sheeting/Creping → Drying/Smoking → Solid NR (RSS or Block Rubber)
\`\`\`

### Why Natural Rubber's Molecular Structure Matters

The **cis** configuration (versus trans) of the double bonds in polyisoprene gives NR exceptional **strain-induced crystallization** — when stretched, NR chains spontaneously align and partially crystallize, dramatically increasing strength exactly when the material needs it most (under load). This is why NR has outstanding **tensile strength and tear resistance** compared to most synthetic alternatives, despite being a relatively simple, naturally-occurring polymer.

### NR's Limitations

| Weakness | Why It Matters |
|----------|------------------|
| Poor oil/fuel resistance | Swells and degrades in contact with petroleum-based oils and fuels |
| Moderate heat resistance | Degrades above ~80-100°C continuous service |
| Poor ozone/UV resistance (unprotected) | Surface cracking develops over time without protective additives |
| Variable quality | Natural product — quality varies with tree source, tapping season, processing |

---

## Major Synthetic Rubber Families

### Styrene-Butadiene Rubber (SBR)

The highest-volume synthetic rubber globally, a copolymer of styrene and butadiene monomers (typically 23-25% styrene). Cheaper than NR, with good abrasion resistance but lower tensile strength and tear resistance — commonly blended with NR rather than used alone in demanding applications.

**Primary use:** Tyre treads (often blended with NR), conveyor belts, footwear soles.

### Polybutadiene Rubber (BR)

Excellent abrasion resistance and very low heat buildup under flexing (low hysteresis) — but poor tear strength and difficult to process alone, so almost always blended with NR or SBR rather than used as a standalone material.

**Primary use:** Tyre sidewalls and treads (blended), golf ball cores.

### Nitrile Rubber (NBR)

Copolymer of butadiene and acrylonitrile — the acrylonitrile content directly controls oil resistance (higher acrylonitrile = better oil resistance, but reduced low-temperature flexibility).

**Primary use:** Fuel hoses, O-rings and seals exposed to oil/fuel, gaskets in automotive and industrial applications.

### Ethylene Propylene Diene Monomer (EPDM)

Outstanding weathering, ozone, and heat resistance due to its saturated backbone (no double bonds in the main chain, unlike NR/SBR/BR) — but poor resistance to petroleum oils.

**Primary use:** Automotive weatherstripping, roofing membranes, radiator hoses, outdoor seals.

### Chloroprene Rubber (CR / Neoprene)

Balanced general-purpose properties — good oil resistance, good weathering, good flame resistance — without excelling dramatically in any single property, making it a versatile but moderately expensive choice.

**Primary use:** Wetsuits, gaskets, adhesives, cable jacketing.

### Silicone Rubber (VMQ)

Exceptional temperature range performance (-60°C to +200°C+) and excellent biocompatibility, but relatively low tensile strength and tear resistance compared to other elastomers.

**Primary use:** Medical devices, food-grade seals, high-temperature gaskets, baking products.

---

## Selection Comparison Table

| Rubber Type | Oil Resistance | Heat Resistance | Ozone/Weather Resistance | Cost |
|-------------|-------------------|----------------------|--------------------------------|------|
| Natural Rubber (NR) | Poor | Moderate | Poor (unprotected) | Low-moderate |
| SBR | Poor | Moderate | Poor | Low |
| NBR | Excellent | Moderate | Poor | Moderate |
| EPDM | Poor | Excellent | Excellent | Moderate |
| CR (Neoprene) | Good | Good | Good | Moderate-high |
| Silicone (VMQ) | Poor-Moderate | Excellent | Excellent | High |

**The core selection principle:** No single rubber excels at everything — selection always means identifying the application's most critical 1-2 requirements (oil contact? outdoor UV exposure? high temperature?) and choosing the elastomer family that best satisfies those specific demands, often accepting compromises in other properties.

---

### Indian Industry Example

**MRF Limited**, **Apollo Tyres**, and **CEAT** all use carefully formulated NR/SBR/BR blends in their tyre compounds — NR provides the tear resistance and strength needed in the tyre carcass, while SBR and BR contribute abrasion resistance in the tread, with the exact blend ratio varying by tyre position and intended vehicle application.

**Rubfila International** (Kerala) — India's largest natural rubber thread manufacturer — sources latex directly from Kerala's extensive rubber plantations (India is among the world's top NR-producing nations), supplying rubber thread for elastic waistbands and medical gloves globally.

Globally, **Goodyear** (USA) and **Continental** (Germany) operate extensive synthetic rubber R&D, often partnering with chemical majors like **Lanxess** (Germany) — one of the world's largest synthetic rubber producers, supplying EPDM and NBR raw material to Indian compounders — while India's own **Rubber Board** (under the Ministry of Commerce) regulates and supports the natural rubber plantation sector that supplies companies like Rubfila and the major Indian tyre manufacturers.

---

## Key Takeaways

- Natural rubber (cis-1,4-polyisoprene) offers outstanding tensile strength and tear resistance due to strain-induced crystallization, but has poor oil resistance and moderate heat/ozone resistance, requiring protective additives or blending for demanding applications
- Synthetic rubbers are engineered for specific property gaps NR cannot fill: NBR for oil resistance, EPDM for weathering/heat resistance, silicone for extreme temperature range, with each family carrying its own cost and processing trade-offs
- Rubber selection always starts by identifying the application's most critical requirement (oil exposure, UV/weathering, temperature extremes) since no single elastomer excels across all properties simultaneously — tyre compounds typically blend multiple rubber types to combine complementary strengths
`,
  },

  {
    subject_slug: 'rubber-technology',
    title: 'Rubber Compounding: Fillers, Carbon Black, and Additives',
    summary: 'Learn how raw rubber is transformed into a compound through the addition of fillers, carbon black, plasticizers, and other additives — and why carbon black is the single most important reinforcing filler in the rubber industry.',
    order_index: 3,
    is_premium: false,
    content: `## Why Raw Rubber Alone Is Never Used

Pure, unfilled rubber — whether natural or synthetic — is too weak, too expensive, or both, for almost any practical product. **Compounding** is the process of mixing raw rubber with a carefully formulated package of fillers, processing aids, and functional additives to create a material with the specific properties (strength, cost, color, processability) a final product requires.

---

## Carbon Black: The Most Important Reinforcing Filler

**Carbon black** — essentially very fine carbon particles produced by controlled incomplete combustion of petroleum or natural gas — is added to rubber compounds at levels typically ranging from **20 to 60 parts per hundred rubber (phr)**, and is responsible for the dramatic property improvements that make modern rubber products possible.

### Why Carbon Black Reinforces Rubber So Effectively

Carbon black particles are extremely small (10-500 nanometers) with a very high surface area, allowing them to form strong physical and chemical bonds with rubber polymer chains. This **reinforcement effect** dramatically increases tensile strength, tear resistance, and abrasion resistance compared to unfilled (gum) rubber.

\`\`\`
Unfilled NR:     Tensile Strength ~20-25 MPa
NR + 50 phr Carbon Black:  Tensile Strength ~25-30 MPa, MASSIVELY improved abrasion resistance
\`\`\`

**Particle size and structure matter enormously:** Smaller particle size carbon black grades (like N220, used in tyre treads) give higher reinforcement and better abrasion resistance but increase compound viscosity (harder to process) and heat buildup during flexing. Larger particle size grades (like N660, used in less demanding applications) are easier to process and disperse but provide less reinforcement.

| Carbon Black Grade | Particle Size | Typical Use |
|------------------------|-------------------|----------------|
| N110, N220 (fine) | Small, high surface area | Tyre treads — maximum abrasion resistance |
| N330, N550 (medium) | Medium | General mechanical rubber goods |
| N660, N770 (coarse) | Larger, lower surface area | Lower-stress applications, easier processing |

---

## Other Common Fillers

### Non-Reinforcing/Semi-Reinforcing Fillers

| Filler | Purpose |
|--------|---------|
| Calcium carbonate | Cost reduction, minimal reinforcement |
| Clay (kaolin) | Cost reduction, improves electrical insulation properties |
| Precipitated silica | Reinforcement comparable to carbon black, but light-colored (allows colored rubber products, unlike black-only carbon black reinforcement) — increasingly used in "green tyre" formulations for lower rolling resistance |

**Why silica matters for modern tyres:** Silica-reinforced tread compounds (often combined with a silane coupling agent to bond silica effectively to rubber) provide better wet-grip and lower rolling resistance than carbon-black-only compounds — a major reason "green tyres" with improved fuel efficiency have shifted toward partial or full silica reinforcement in tread formulations over the past two decades.

---

## Processing Additives

### Plasticizers and Process Oils

Added to soften the raw rubber, ease processing (mixing, extrusion, calendering), and improve low-temperature flexibility. Common types include aromatic, naphthenic, and paraffinic process oils, selected based on compatibility with the specific rubber type and desired final properties.

### Antioxidants and Antiozonants

As covered conceptually in the polymer degradation lesson, rubber — especially unsaturated rubbers like NR, SBR, and BR with double bonds in their backbone — is highly vulnerable to oxidative and ozone attack. Antioxidants (like hindered phenols) and antiozonants (like waxes that migrate to the surface, or chemical antiozonants like 6PPD) are essential additives protecting against surface cracking and property degradation over the product's service life.

### Processing Aids

Small quantities of materials like stearic acid, fatty acid esters, or specialized processing aid packages reduce compound viscosity during mixing and improve mould release, without significantly affecting final cured properties.

---

## A Typical Tyre Tread Compound Recipe (Simplified)

\`\`\`
NR/BR/SBR blend ........... 100 phr (base polymer)
Carbon Black (N220) ........ 50 phr (reinforcement)
Process Oil ................. 8 phr (processing aid, flexibility)
Zinc Oxide ................... 5 phr (vulcanization activator)
Stearic Acid .................. 2 phr (vulcanization activator)
Sulphur ....................... 1.5 phr (vulcanizing agent)
Accelerator (CBS) ............ 1.2 phr (cure speed control)
Antioxidant ................... 2 phr (degradation protection)
Antiozonant Wax ............. 2 phr (ozone protection)
\`\`\`

**This formulation directly connects to your vulcanization lesson** — note how zinc oxide, stearic acid, sulphur, and accelerator (the vulcanization system) form just one part of a much larger compound recipe that also addresses reinforcement, processability, and long-term durability simultaneously.

---

### Indian Industry Example

**Phillips Carbon Black Limited** (Kolkata) is one of India's largest carbon black manufacturers, supplying reinforcing grades to MRF, Apollo Tyres, CEAT, and other major Indian rubber product manufacturers — carbon black represents one of the most strategically important raw material supply chains in the entire Indian rubber industry.

**Apollo Tyres'** R&D centre in Chennai has invested significantly in silica-reinforced "green tyre" tread compound development, responding to both domestic fuel-efficiency regulations and export market demand for lower rolling-resistance tyres.

Globally, **Cabot Corporation** (USA) and **Orion Engineered Carbons** (Germany/USA) are leading global carbon black producers whose technology and grades set industry benchmarks that Indian producers like Phillips Carbon Black reference, while **Evonik** (Germany) and **Solvay** (Belgium) are major global suppliers of precipitated silica and silane coupling agents used in green tyre formulations increasingly adopted by Indian tyre manufacturers pursuing both domestic BIS fuel-efficiency labeling requirements and international export standards.

---

## Key Takeaways

- Carbon black is the most important reinforcing filler in rubber compounding, dramatically improving tensile strength, tear resistance, and abrasion resistance through strong physical/chemical bonding with rubber chains — particle size selection balances reinforcement level against processing ease
- Precipitated silica offers comparable reinforcement to carbon black while allowing colored/light rubber products, and has become central to "green tyre" formulations for improved wet grip and lower rolling resistance when combined with silane coupling agents
- A complete rubber compound combines base polymer, reinforcing filler, process oils, vulcanization system (zinc oxide, stearic acid, sulphur, accelerator), and protective additives (antioxidants, antiozonants) — each component addresses a distinct functional requirement simultaneously
`,
  },

  {
    subject_slug: 'rubber-technology',
    title: 'Latex Technology: Processing and Applications',
    summary: 'Understand latex — the liquid form of rubber used directly without solid-state processing — covering dipping, foam, and thread production methods central to gloves, balloons, and elastic textile applications.',
    order_index: 4,
    is_premium: false,
    content: `## Rubber That Never Becomes Solid Before Use

Most rubber processing you've studied so far starts with solid rubber — compounded, then shaped and cured. **Latex technology** takes a fundamentally different path: rubber remains in its liquid, colloidal form (a stable suspension of tiny rubber particles in water) throughout processing, only solidifying into its final shape during or immediately before vulcanization.

---

## What Latex Actually Is

Natural rubber latex is a **colloidal suspension** — microscopic rubber particles (roughly 0.05 to 3 microns in diameter) suspended in water, stabilized by a thin protein/lipid layer around each particle that prevents the particles from clumping together (coagulating) prematurely.

\`\`\`
Latex = Rubber particles (≈30-60% by weight) + Water + Stabilizing proteins/surfactants
\`\`\`

**Natural latex** is harvested directly from tapped rubber trees (as covered in the previous lesson) and typically concentrated from its natural ~30% rubber content up to 60% via centrifugation before use in manufacturing. **Synthetic latex** (most commonly synthetic polyisoprene or NBR-based) is produced via emulsion polymerization, directly creating a similar colloidal suspension without needing a tree at all.

---

## Dipping Process: Gloves, Balloons, and Condoms

The dominant manufacturing method for thin-walled latex products — surgical and household gloves, balloons, condoms, and similar thin, flexible items.

### The Process

\`\`\`
1. FORMER PREPARATION  → Ceramic or glass hand/balloon-shaped mould (former) cleaned
2. COAGULANT DIP        → Former dipped in coagulant solution (calcium nitrate typical)
3. LATEX DIP             → Former dipped into compounded latex; coagulant causes a thin rubber film to form on the former surface
4. LEACHING              → Product (still on former) rinsed in water to remove water-soluble proteins and chemical residues
5. VULCANIZATION         → Heated in an oven to cure the rubber film (often using accelerated sulphur systems for fast cure at relatively low temperature)
6. STRIPPING              → Cured product peeled/stripped off the former
\`\`\`

**Why coagulant dipping works:** The coagulant solution destabilizes the latex particles' protective protein layer upon contact, causing rubber particles to bond together and form a continuous film exactly where the former touches the latex — building up film thickness with dip time and latex concentration, allowing precise control over final product wall thickness.

### Multiple Dip Process

For products requiring more thickness or specific layered properties (like double-dipped gloves with a textured outer layer for grip), formers may be dipped multiple times, sometimes in different latex formulations for each layer.

---

## Latex Foam: Mattresses and Cushioning

**Latex foam** (used in premium mattresses and cushions) is produced by mechanically whipping air into compounded latex to create a stable foam structure, then gelling and curing this foam into its final cellular form.

### Two Main Foam Processes

**Talalay Process:** Latex foam is poured into a mould, partially vacuum-expanded to create very uniform cell structure, then flash-frozen before gelling — producing exceptionally consistent, often more expensive foam with excellent durability and consistent firmness throughout the product.

**Dunlop Process:** Latex foam is poured into a mould and gelled/cured directly without the vacuum-expansion and freezing steps — simpler, lower-cost process producing slightly denser foam with a natural firmness gradient (typically firmer at the bottom where rubber particles settle slightly before gelling).

---

## Latex Thread: Elastic Textile Applications

Continuous latex rubber thread — used in elastic waistbands, surgical bandages, and woven elastic fabric — is produced through a continuous extrusion-coagulation process distinct from both dipping and foam methods.

\`\`\`
Compounded Latex → Extruded through fine nozzles into a coagulant bath →
Continuous thin rubber thread forms → Washed → Dried → Vulcanized (continuous oven) → Wound onto spools
\`\`\`

**Why continuous processing matters:** Unlike dipped products (made one piece at a time on individual formers) or foam (batch-moulded), thread production runs continuously, allowing extremely high-volume output essential for the textile industry's elastic fabric and waistband demand.

---

## Latex vs Dry Rubber Processing: When Each Is Used

| Factor | Latex Processing | Dry Rubber Processing |
|--------|----------------------|----------------------------|
| Typical products | Gloves, balloons, foam, thread, adhesives, dipped coatings | Tyres, seals, mouldings, mechanical goods |
| Wall thickness capability | Excellent for very thin films (gloves: 0.05-0.15mm) | Better suited to thicker, more substantial parts |
| Equipment investment | Lower for dipping; specialized for foam | Higher (mixing mills, presses, injection equipment) |
| Production speed | Very fast for thin films and continuous thread | Slower, cycle-time dependent for moulded parts |

---

### Indian Industry Example

**Rubfila International** (Thrissur, Kerala) operates one of the world's largest continuous latex thread production facilities, supplying elastic rubber thread to textile and medical glove manufacturers globally, leveraging Kerala's position as a major natural latex source region.

**Hindustan Latex Limited (HLL Lifecare)** is a major Indian manufacturer of dipped latex products, particularly condoms and medical gloves, operating large-scale dipping lines as part of India's public health manufacturing infrastructure alongside private sector glove manufacturers.

Globally, **Top Glove** (Malaysia) is the world's largest manufacturer of dipped latex and nitrile gloves, operating at a scale that significantly influences global latex and synthetic latex pricing, while **Mountain Top Industries** and other Talalay foam specialists in the **USA** and **Europe** set the premium benchmark for latex mattress foam quality that Indian foam manufacturers like **Sheela Foam** reference when developing their own premium latex foam product lines.

---

## Key Takeaways

- Latex remains in liquid, colloidal form throughout most of its processing, only solidifying during coagulant contact (dipping) or gelling (foam) — fundamentally different from dry rubber processing, which starts with solid compounded rubber from the beginning
- Dipping processes (gloves, balloons, condoms) build up rubber film thickness on a former through repeated or extended contact with coagulant-treated latex, enabling extremely thin, precise wall thicknesses impossible with dry rubber moulding
- Latex foam (Talalay vs Dunlop processes) and continuous latex thread production represent two further specialized latex applications, each using distinct processing approaches optimized for their specific product geometry and volume requirements
`,
  },

  {
    subject_slug: 'rubber-technology',
    title: 'Rubber Processing: Mixing, Calendering, and Extrusion',
    summary: 'Learn how raw rubber and compounding ingredients are physically combined and shaped — covering internal mixers, two-roll mills, calendering for sheet production, and rubber extrusion for profiles and tubing.',
    order_index: 5,
    is_premium: false,
    content: `## Getting the Recipe Actually Mixed

Knowing the right compound recipe (covered in your compounding lesson) is only half the challenge — raw rubber, carbon black, oils, and chemical additives must be physically and thoroughly combined into a homogeneous compound before any shaping or curing can happen. This mixing step is mechanically demanding, since raw rubber is initially very stiff and resistant to blending in new ingredients.

---

## Two-Roll Mills: The Traditional Method

The oldest rubber mixing equipment still in widespread use — two horizontal rollers rotating at slightly different speeds (friction ratio, typically 1:1.1 to 1:1.25), with a controlled gap between them.

### How Milling Works

\`\`\`
Raw rubber fed between rollers → 
Rubber forms a continuous "band" wrapping around the faster roller →
Operator/automated system adds carbon black, oils, chemicals in stages →
Rubber repeatedly passes through the roller gap, working ingredients into the rubber
\`\`\`

**The friction ratio is essential:** Because the two rollers turn at different speeds, the rubber band experiences shear as it passes through the gap — this shearing action is what actually mixes ingredients into the rubber matrix, rather than simple rolling without any speed difference.

**Limitations:** Two-roll mills are labor-intensive, relatively slow, and present operator safety challenges (the nip point between rollers is a serious injury risk requiring careful guarding and procedures) — this is why most large-scale industrial rubber compounding has shifted to internal mixers for primary mixing, with two-roll mills now mostly used for smaller batches, final compound sheeting, or specialty/laboratory work.

---

## Internal Mixers: Modern High-Volume Mixing

**Internal mixers** (most commonly **Banbury-type mixers**, named after their original inventor) use two large rotors turning within an enclosed mixing chamber, with a hydraulically operated ram pressing ingredients down into the rotor zone.

### Advantages Over Two-Roll Mills

| Factor | Internal Mixer | Two-Roll Mill |
|--------|-------------------|-------------------|
| Mixing speed | Much faster (minutes per batch) | Slower |
| Batch size capability | Large batches (hundreds of kg) | Limited by roll length |
| Operator safety | Enclosed, safer | Exposed nip point, higher risk |
| Mixing consistency | More consistent, less operator-dependent | More variable, skill-dependent |
| Temperature control | More challenging (enclosed, heat builds rapidly) | Easier (open rolls dissipate heat) |

**Why temperature control matters in internal mixers:** The intense shearing action that makes internal mixers fast also generates significant heat very quickly — if mixing temperature rises too high, premature vulcanization (called **scorch**, directly connecting to your vulcanization lesson's scorch time concept) can begin during mixing itself, ruining the batch before it even reaches the shaping and curing stages. This is why most industrial mixing is done in **two stages**: a first "masterbatch" mix combining rubber, carbon black, and oils (without the vulcanization system), followed by a cooler second mix adding sulphur and accelerators just before shaping, minimizing the time the full vulcanization-ready compound spends at elevated mixing temperature.

---

## Calendering: Producing Rubber Sheet

**Calendering** passes rubber compound through a series of heated, precisely-set rollers (typically 3-4 rolls in various configurations) to produce continuous rubber sheet of precise, controlled thickness.

\`\`\`
COMPOUND → [ROLL 1] → [ROLL 2] → [ROLL 3] → CONTINUOUS SHEET (precise thickness)
            (progressively closing gaps, building precise final thickness)
\`\`\`

### Calendering Applications

- **Tyre ply/fabric coating:** Textile or steel cord fabric is fed through the calender alongside rubber compound, coating the reinforcement with rubber in a single pass — essential for tyre carcass construction
- **Sheet rubber for further processing:** Flat sheet stock later cut and assembled into various rubber goods
- **Friction/skim coating:** Thin rubber layers applied to fabric for waterproofing or bonding applications

**Calendering precision requirements:** Unlike simple sheeting on a two-roll mill, calendering for tyre cord coating requires extremely tight thickness tolerance (often ±0.05mm or tighter) since inconsistent rubber coating thickness directly affects tyre uniformity and performance — this precision requirement is why calendering equipment represents a significant capital investment for tyre manufacturers.

---

## Rubber Extrusion: Profiles and Tubing

Similar in basic principle to thermoplastic extrusion (covered in your processing subject) but adapted for rubber compound's different flow behavior — rubber extruders use a screw to convey and pressurize compound through a shaped die, producing continuous profiles.

### Key Differences from Thermoplastic Extrusion

| Factor | Rubber Extrusion | Thermoplastic Extrusion |
|--------|----------------------|------------------------------|
| Material state entering extruder | Uncured compound (not yet crosslinked) | Solid pellets that melt in the barrel |
| What happens after the die | Extrudate must be vulcanized (separate curing step — often a continuous oven or salt bath) | Extrudate cools and solidifies directly (already final material state) |
| Screw compression | Lower compression ratios typical (rubber compound is already a viscous, workable mass, not solid pellets requiring melting) | Higher compression ratios needed to melt and convey solid granules |
| Risk during processing | Scorch (premature cure) if barrel temperature too high | Thermal degradation if barrel temperature too high |

**Why a separate vulcanization step is essential:** Uncured rubber compound exits the extruder die in a soft, non-crosslinked state — it must pass through a continuous vulcanization system (hot air tunnel, microwave curing line, or molten salt bath) downstream of the die to develop its elastic properties.

**Typical extruded rubber products:** Door and window seals, hose (combined with reinforcement braiding), weatherstripping, conveyor belt edge profiles.

---

### Indian Industry Example

**MRF Limited's** tyre manufacturing facilities operate large Banbury-type internal mixers as the first stage of their tyre compound production, followed by precision calendering lines that coat steel and textile tyre cord with rubber compound to extremely tight thickness tolerances essential for tyre uniformity and performance consistency.

**Cosmo Films** and various Indian rubber profile manufacturers operate continuous rubber extrusion lines with downstream hot-air or microwave curing tunnels for automotive weatherstripping and seal production, supplying Tier-1 automotive component suppliers across India's major auto manufacturing hubs.

Globally, **Farrel Corporation** (USA, part of **HF Mixing Group**) and **Kobelco** (Japan) are leading manufacturers of Banbury-type internal mixers used in rubber compounding facilities worldwide, including major Indian tyre manufacturers, while **Berstorff** (Germany, part of **KraussMaffei**) is a recognized global leader in rubber extrusion line technology, supplying continuous vulcanization systems that Indian automotive seal and profile manufacturers have increasingly adopted to match international quality standards.

---

## Key Takeaways

- Two-roll mills mix rubber compound through shear created by rollers turning at different speeds (friction ratio), while internal (Banbury-type) mixers achieve much faster, more consistent mixing in an enclosed chamber — though internal mixers require careful temperature control to avoid premature scorch during the intense mixing shear
- Calendering produces precision rubber sheet and coats reinforcement fabric/cord with rubber by passing compound through a series of heated rollers — tyre cord coating requires extremely tight thickness tolerance given its direct impact on tyre performance uniformity
- Rubber extrusion shapes uncured compound through a die similar to thermoplastic extrusion, but the extrudate must pass through a separate continuous vulcanization step (hot air, microwave, or salt bath curing) afterward, since unlike thermoplastics, the extrudate exits the die in an uncured, not-yet-functional state
`,
  },

  {
    subject_slug: 'rubber-technology',
    title: 'Tyre Construction: From Components to Finished Product',
    summary: 'Bring together everything you have learned about rubber technology by examining tyre construction — the most complex and demanding rubber product manufactured, integrating compounding, calendering, and vulcanization into one assembly.',
    order_index: 6,
    is_premium: false,
    content: `## The Most Complex Rubber Product You Will Ever Study

A modern radial tyre contains over 20 distinct components, multiple different rubber compounds optimized for completely different functions, steel and textile reinforcement, and represents the culmination of nearly every rubber technology concept covered in this subject — vulcanization, compounding, calendering, and material selection, all integrated into a single high-performance assembly.

---

## The Major Tyre Components

\`\`\`
                    TREAD
                  ╱─────────╲
              SIDEWALL    SIDEWALL
                 │            │
              BEAD          BEAD
            (steel ring)  (steel ring)
\`\`\`

### 1. Tread

The outer rubber layer contacting the road — formulated for **abrasion resistance, wet grip, and rolling resistance** simultaneously, often using carbon black/silica blends (covered in your compounding lesson) for modern "green tyre" formulations balancing these competing requirements.

### 2. Sidewall

The rubber covering the tyre's side, protecting the internal carcass from curb damage, weathering, and flexing fatigue — formulated for **flex fatigue resistance and ozone/weathering resistance** rather than abrasion resistance, since it doesn't contact the road directly.

### 3. Carcass (Body Ply)

The structural skeleton of the tyre — layers of **rubber-coated textile cord** (polyester, rayon, or nylon, calendered with rubber as covered in your processing lesson) running radially from bead to bead, providing the tyre's basic strength and shape retention under inflation pressure.

### 4. Belt Package (Radial Tyres)

Steel cord belts positioned between the carcass and tread, running at an angle to stabilize the tread area, improve handling precision, and resist puncture — steel cord is calendered with specially formulated **brass-coated steel adhesion compound** to ensure the rubber bonds securely to the steel wire.

### 5. Bead

A high-strength steel wire ring (or bundle of wires) embedded in rubber at each edge of the tyre, anchoring the tyre securely onto the wheel rim and resisting the substantial forces trying to pull the tyre off the rim during driving.

### 6. Innerliner

A specialized rubber layer (typically **halobutyl rubber** — chlorinated or brominated butyl rubber) on the tyre's interior, providing the **air-impermeability** that allows tubeless tyres to hold pressure without a separate inner tube — butyl rubber's saturated, tightly-packed molecular structure gives it exceptional gas impermeability compared to NR or SBR.

---

## Tyre Building: Assembling the Components

Modern tyre building uses a **tyre building drum** — a cylindrical, expandable machine onto which the various calendered and extruded components are applied in precise sequence:

\`\`\`
1. Innerliner applied first (cylinder shape on drum)
2. Carcass ply applied over innerliner
3. Bead rings positioned and carcass wrapped around them
4. Belt package applied (radial tyres)
5. Tread and sidewall (often co-extruded as one combined profile) applied
6. Drum shape expanded into toroidal (donut) shape, components consolidated
7. Result: "Green tyre" (uncured, assembled, but not yet vulcanized)
\`\`\`

**The term "green tyre" here refers specifically to the uncured, assembled tyre** before vulcanization — not to be confused with the "green tyre" terminology used elsewhere in this lesson referring to environmentally-optimized, low-rolling-resistance silica tread formulations. Both terms are standard industry usage, distinguished entirely by context.

---

## Tyre Curing: The Final Vulcanization

The assembled green tyre is placed in a **tyre curing press** — a heated mould matching the tyre's final tread pattern and sidewall markings, with an internal expandable bladder that presses the green tyre outward against the mould walls under heat and pressure.

\`\`\`
GREEN TYRE → CURING PRESS (160-180°C, 15-20 minutes typical) →
Bladder inflates, presses tyre against mould → 
Vulcanization occurs (sulphur crosslinking, as covered in your vulcanization lesson) →
Cured tyre removed, tread pattern and markings now permanently formed
\`\`\`

**Why curing time is so long compared to typical rubber products:** A tyre's substantial total rubber thickness (especially through the tread and multiple internal layers) means heat must penetrate significantly further to reach full cure throughout the entire cross-section — directly connecting to the cure-time-vs-thickness relationship covered in your compression/transfer moulding lesson, scaled up to one of the thickest rubber products manufactured.

---

## Why Different Compounds Are Used in Different Tyre Zones

This is the central integrating insight of tyre technology: **no single rubber compound could satisfy all the simultaneously competing requirements across a tyre's different zones.**

| Zone | Primary Requirement | Compound Strategy |
|------|------------------------|------------------------|
| Tread | Abrasion resistance + wet grip + low rolling resistance | High carbon black/silica loading, SBR/BR blend |
| Sidewall | Flex fatigue + weathering resistance | NR-rich blend, high antiozonant loading |
| Innerliner | Air impermeability | Halobutyl rubber (saturated backbone) |
| Bead area | Maximum stiffness, rim grip | Hard, high-modulus compound |
| Belt/steel adhesion | Rubber-to-steel bonding strength | Specialized brass-adhesion compound system |

This zone-specific compounding strategy — applying everything covered across natural/synthetic rubber selection, carbon black reinforcement, and vulcanization system design to different parts of a single integrated product — represents the practical synthesis of the entire rubber technology subject.

---

### Indian Industry Example

**MRF Limited's** Chennai R&D facility (Asia's largest tyre testing facility) develops zone-specific compound formulations for each tyre component, running extensive vulcanization curve analysis (rheometer testing, covered in your testing subject) to optimize cure systems differently for tread versus sidewall versus innerliner compounds within the same tyre.

**Apollo Tyres'** Vadodara manufacturing facility operates integrated tyre building lines combining calendering, extrusion, and assembly into continuous production flow, supplying both domestic Indian vehicle manufacturers and substantial export markets across Europe and other regions.

Globally, **Bridgestone** (Japan) and **Michelin** (France) are widely regarded as the technology leaders in radial tyre construction and compound innovation, with patents and manufacturing techniques that influence tyre design standards followed by manufacturers worldwide, including India's major producers, while **VMI Group** (Netherlands) is a leading global supplier of tyre building machine technology used in modern Indian tyre manufacturing facilities to achieve the precision component placement required for consistent, high-performance tyre construction.

---

## Key Takeaways

- A tyre integrates multiple distinct rubber compounds (tread, sidewall, innerliner, bead, belt adhesion) each formulated for entirely different functional requirements, demonstrating why "rubber" is never a single material but a family of compounds engineered for specific purposes within one product
- Tyre building assembles calendered fabric/steel-reinforced layers, extruded tread/sidewall profiles, and steel bead rings on a building drum into an uncured "green tyre," which is then vulcanized under heat and pressure in a curing press to develop its final properties and tread pattern
- The need for different compounds in different tyre zones (abrasion-resistant tread, flex-resistant sidewall, impermeable innerliner, adhesion-promoting belt compound) is the practical synthesis of everything covered across rubber selection, compounding, and vulcanization — illustrating how real products require zone-specific material engineering rather than one-size-fits-all formulation
`,
  },
];

async function seedLessons() {
  console.log('🚀 PolymerHub — Seeding Rubber Technology lessons 2-6...\n');

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

  console.log('✅ Rubber Technology lessons 2-6 seeded successfully!\n');
  data.forEach((l, i) => console.log(`   ${i + 1}. ${l.title}`));
  console.log(`\n🎉 ALL 30 LESSONS NOW COMPLETE ACROSS ALL 5 SUBJECTS! 🎉\n`);
}

seedLessons();
