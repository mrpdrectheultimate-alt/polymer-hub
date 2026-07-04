// scripts/seedLessons_polymerComposites.js
// Run with: node scripts/seedLessons_polymerComposites.js

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
    subject_slug: 'polymer-composites',
    title: 'Introduction to Polymer Composites: Matrix, Reinforcement, and Interface',
    summary: 'Understand the three-component architecture of polymer composites — matrix, reinforcement, and the critical interface between them — and why composites achieve properties no single material can match.',
    order_index: 1,
    is_premium: false,
    content: `## When One Material Is Not Enough

Pure polymers have limitations. Unreinforced PP has a tensile strength of 30-40 MPa — too weak for structural automotive applications. Unreinforced Nylon 6 has a flexural modulus of ~2,800 MPa — not stiff enough for precision gear housings. Carbon fibre alone is extremely stiff and strong but has no shape — it cannot be moulded into complex geometries.

**Polymer composites** solve this by combining two or more constituent materials with fundamentally different properties into a structure that performs better than any individual component. The matrix holds the reinforcement in place, transfers load to the reinforcement, and protects it. The reinforcement carries the structural load that the matrix alone cannot.

---

## The Three Components of a Composite

### 1. The Matrix

The continuous phase — surrounds, binds, and protects the reinforcement. In polymer composites, the matrix is a polymer (thermoplastic or thermoset).

**Thermoset matrices** (epoxy, polyester, vinyl ester, phenolic):
- Cure irreversibly during processing → part shape is permanent
- Good temperature resistance and chemical resistance
- Cannot be recycled by remelting
- Dominant in aerospace, marine, wind energy

**Thermoplastic matrices** (PP, Nylon, PEEK, PPS):
- Can be remelted → recyclable, weldable, faster processing
- Generally lower temperature resistance than thermosets
- Dominant in automotive injection-moulded composites

### 2. The Reinforcement

The discontinuous or continuous phase that carries the primary structural load. Properties are dominated by the reinforcement type, length, orientation, and volume fraction.

| Reinforcement | Tensile Modulus | Tensile Strength | Cost |
|--------------|----------------|-----------------|------|
| E-glass fibre | 73 GPa | 3,400 MPa | Low |
| S-glass fibre | 87 GPa | 4,800 MPa | Medium |
| Standard carbon fibre (T300) | 230 GPa | 3,530 MPa | High |
| High-modulus carbon fibre (M55J) | 540 GPa | 4,020 MPa | Very high |
| Aramid fibre (Kevlar 49) | 125 GPa | 3,600 MPa | Medium-high |
| Basalt fibre | 89 GPa | 4,840 MPa | Medium |
| Natural jute fibre | 26-32 GPa | 400-800 MPa | Very low |

**For comparison:** steel has a tensile modulus of ~200 GPa and tensile strength of 400-600 MPa (mild steel). A well-made carbon fibre composite can match steel's strength at 1/5th the weight — this weight advantage is why composites dominate in aerospace and are growing rapidly in automotive.

### 3. The Interface (Interphase)

The interface between matrix and reinforcement is where stress is transferred — and where composite failure most often initiates. A poor interface means the matrix and reinforcement behave as separate materials; a good interface means load transfers efficiently and the composite achieves its theoretical performance.

**Interface improvement methods:**
- **Silane coupling agents** for glass fibre in thermoplastics (chemical bonding between glass surface and polymer matrix)
- **Sizing** applied to fibres during manufacture (controls surface chemistry and wettability)
- **Surface oxidation** of carbon fibre (increases surface energy for better matrix adhesion)
- **Compatibilizers** (maleic anhydride grafted PP for glass-PP composites — creates chemical bridge between polar glass and non-polar PP)

---

## Rule of Mixtures: Predicting Composite Properties

For continuous, unidirectional composites, properties in the fibre direction follow the **Rule of Mixtures**:

\`\`\`
Composite modulus (longitudinal) = Ef × Vf + Em × Vm

Where:
Ef = fibre modulus
Vf = fibre volume fraction
Em = matrix modulus
Vm = matrix volume fraction (= 1 - Vf)
\`\`\`

**Example:** 60% volume fraction carbon fibre (T300, 230 GPa) in epoxy (3.5 GPa):
\`\`\`
E_composite = 230 × 0.60 + 3.5 × 0.40 = 138 + 1.4 = 139.4 GPa
\`\`\`

This is approximately 70× stiffer than the unreinforced epoxy alone.

**Important caveat:** The Rule of Mixtures applies only in the fibre direction for unidirectional composites. Properties perpendicular to fibres are matrix-dominated and much lower (this anisotropy is both a feature and a design challenge of composites).

---

### Indian Industry Example

**Tata Advanced Materials** (Bangalore) manufactures aerospace-grade carbon fibre reinforced epoxy composites for ISRO's PSLV and GSLV launch vehicles — structural composite components where weight reduction directly translates to payload capacity. **Mahindra Composites** (Pune) produces glass fibre reinforced thermoplastic composites for automotive structural applications, targeting weight reduction vs conventional steel stampings.

Globally, **Hexcel** (USA) and **Toray Industries** (Japan) are the world's leading carbon fibre and carbon fibre prepreg manufacturers, supplying aerospace primes like Boeing and Airbus. **Owens Corning** (USA) remains the global benchmark for glass fibre production, with significant supply operations supporting Indian automotive and wind energy composite manufacturers.

---

## Key Takeaways

- Polymer composites combine a matrix (continuous polymer phase — thermoset or thermoplastic) with a reinforcement (discontinuous or continuous fibres) to achieve properties no single material can match — the interface between them is where stress transfers and where composite failure most often initiates
- Carbon fibre composites can match steel's strength at 1/5th the weight using the specific stiffness advantage of high-modulus carbon fibres (230-540 GPa modulus vs steel's 200 GPa, at carbon's density of 1.8 g/cm³ vs steel's 7.8 g/cm³)
- The Rule of Mixtures predicts longitudinal composite modulus from fibre and matrix moduli and volume fractions — but composites are anisotropic, with properties perpendicular to fibres being matrix-dominated and much lower, requiring multi-directional layup design for real applications
`,
  },
  {
    subject_slug: 'polymer-composites',
    title: 'Glass Fibre Reinforced Plastics (GFRP): Processing and Applications',
    summary: 'Master glass fibre reinforced polymer composites — the dominant composite material by volume — covering fibre types, chopped vs woven forms, processing methods from hand layup to RTM, and major Indian applications.',
    order_index: 2,
    is_premium: false,
    content: `## The Workhorse of the Composites Industry

Glass fibre reinforced plastics (GFRP) account for approximately 90% of global composite production by volume. While carbon fibre gets the headlines for its use in aerospace and performance cars, glass fibre is the material behind wind turbine blades, boat hulls, bathroom panels, automotive body parts, storage tanks, and electrical enclosures across the entire industrial spectrum.

---

## Glass Fibre Types

Not all glass fibres are the same. Different glass compositions are engineered for specific properties:

| Type | Composition | Tensile Strength | Key Property | Use Case |
|------|-------------|-----------------|-------------|---------|
| E-glass | Alumino-borosilicate | 3,400 MPa | Low cost, good electrical insulation | 90%+ of market — general composites |
| S-glass (S-2) | Magnesium aluminosilicate | 4,800 MPa | 40% higher strength than E-glass | Aerospace, ballistic armour |
| C-glass | Soda-lime borosilicate | ~3,300 MPa | Excellent chemical resistance | Chemical storage tanks |
| R-glass | Aluminosilicate | ~4,400 MPa | High strength + acid resistance | European wind blades, aerospace |
| AR-glass | Zirconia-containing | ~3,700 MPa | Alkali resistant | Cement reinforcement (GRC panels) |

**For most applications, E-glass is the correct and cost-effective choice.** S-glass is reserved for applications where the weight/performance premium justifies its 5-10× cost premium over E-glass.

---

## Fibre Forms: How Reinforcement Is Supplied

The form in which glass fibre is used determines the processing method and the composite's properties:

### Chopped Strand Mat (CSM)
Random short fibres (typically 25-50mm) held together with a binder. Produces **isotropic** properties (same in all directions) at low cost. Used in hand layup for boat hulls, bathroom products, general FRP sheets.

### Woven Fabrics
Continuous fibres woven into bidirectional (0°/90°) structures. **Higher strength and stiffness than CSM** in the weave directions. Multiple weave architectures: plain, twill, satin — each affecting drapeability and strength balance.

### Non-crimp Fabrics (NCF)
Fibres stitched (not woven) together in multiple orientations (0°/90°, ±45°). No crimp means fibres run straighter → higher theoretical strength utilization vs woven fabrics. Used in wind blades and aerospace structural parts.

### Unidirectional (UD) Tape/Roving
All fibres aligned in one direction — maximum stiffness and strength in that direction, very low properties transversely. Used for pultruded profiles (constant cross-section structural members), filament winding, and tape-laying.

### Chopped Strand (for injection/compression moulding)
Short (3-6mm) chopped glass fibres mixed directly with thermoplastic resin pellets or compounded into glass-filled masterbatches for injection moulding. This is the form used in all the glass-filled Nylon and PP applications from your earlier lessons.

---

## Processing Methods for GFRP

### Hand Layup (Open Mould)
Oldest and simplest method. Layers of fibre mat/fabric manually placed in an open mould, wet out with liquid resin (polyester or vinyl ester) using rollers and brushes, cured at room temperature. Low tooling cost, large parts possible, but labour-intensive, inconsistent fibre volume fraction, significant styrene emission (health and environmental concern with polyester resin).

**Used for:** Boat hulls, custom automotive body panels, architectural panels, small production volumes.

### Resin Transfer Moulding (RTM)
Dry fibre preform placed in a closed matched mould, resin injected under pressure to wet out fibres, cured under heat. Much better fibre volume fraction and part consistency than hand layup, lower emissions.

**Used for:** Automotive structural parts (bonnet, door panels), wind blade roots, medium-volume aerospace components.

### Vacuum Infusion (VARTM)
Dry fibre layup covered with vacuum bag, resin drawn in by vacuum rather than positive pressure injection. Lower tooling cost than RTM (one-sided mould only), good part quality for large structures.

**Used for:** Wind turbine blades (up to 100m+), large marine hulls, infrastructure panels.

### Pultrusion
Continuous fibres and mats pulled through a resin bath, then through a heated die that gives the final cross-section shape and cures the resin. Produces very high fibre volume fractions (up to 70%), excellent consistency, very high specific properties, continuous process.

**Used for:** Structural profiles (I-beams, tubes, channels), ladder rails, cable tray, reinforcing bars (rebar) for concrete.

### Filament Winding
Continuous fibre rovings wound around a rotating mandrel under controlled tension and winding angle. Excellent for cylindrical and near-cylindrical shapes.

**Used for:** Pressure vessels, gas cylinders, pipes, rocket motor casings.

---

### Indian Industry Example

**Owens Corning India** (Taloja, Maharashtra) manufactures E-glass fibres specifically for Indian composite manufacturers. **Aeron Composite** (Vadodara) produces wind turbine blade components and structural composite parts for ISRO and DRDO applications. **Supreme Industries** makes glass fibre reinforced PP automotive underbody shields and structural parts.

Globally, **Vestas** (Denmark) and **Siemens Gamesa** (Spain/Germany) are the world's largest wind turbine manufacturers, consuming millions of tonnes of glass fibre/epoxy composite in their blade production — directly relevant to India's ambitious 500 GW renewable energy target, which requires a domestic wind blade composites manufacturing capacity that Indian companies like **Inox Wind** and **Suzlon Energy** are building out.

---

## Key Takeaways

- E-glass is the workhorse fibre for 90%+ of GFRP applications — S-glass and R-glass offer higher performance at significantly higher cost, reserved for weight-critical aerospace and defence applications
- Fibre form determines processing method: chopped strand mat enables simple hand layup for large irregular parts; woven fabrics and NCF enable RTM and vacuum infusion for structural parts; UD roving enables pultrusion and filament winding for highest specific properties in defined load directions
- Short glass fibre in injection-moulded thermoplastics (Nylon, PP) is technically a composite — the same interface engineering principles apply, with maleic anhydride compatibilization critical for bonding glass to non-polar PP matrices
`,
  },
  {
    subject_slug: 'polymer-composites',
    title: 'Carbon Fibre Reinforced Polymers (CFRP): Aerospace to Automotive',
    summary: 'Understand carbon fibre production, prepreg processing, autoclave vs out-of-autoclave manufacturing, and why CFRP\'s specific stiffness advantage is transforming aerospace, automotive, and increasingly wind energy.',
    order_index: 3,
    is_premium: false,
    content: `## The Premium Reinforcement

Carbon fibre is to composite engineering what premium alloyed steel is to conventional metallurgy — significantly higher performance, significantly higher cost, justified in applications where weight and stiffness savings translate directly to performance or energy savings.

---

## Carbon Fibre Production

Carbon fibre is not found in nature — it is manufactured through a carefully controlled process of pyrolysis:

\`\`\`
PAN precursor (polyacrylonitrile fibre)
→ Stabilization (200-300°C in air, oxidation) — 30-120 minutes
→ Carbonization (1000-1500°C, inert atmosphere) — converts to carbon structure
→ Graphitization (optional, >2000°C) — increases modulus, reduces strength
→ Surface treatment (oxidation to improve matrix adhesion)
→ Sizing (protective/adhesion coating)
→ Carbon fibre
\`\`\`

**PAN-based vs pitch-based:**
- **PAN-based** (polyacrylonitrile): Standard and intermediate modulus carbon fibres (Toray T300, T700, T800) — highest commercial volume, best balance of strength and modulus
- **Pitch-based** (coal tar or petroleum pitch): Very high modulus fibres (up to 900 GPa) but lower tensile strength — specialty applications (space structures, thermal management)

**The cost reality:** Carbon fibre currently costs ₹800-3000/kg depending on grade, vs E-glass at ₹60-120/kg. This 10-20× cost premium defines where carbon fibre can be justified.

### Specific Stiffness: The Weight Advantage Quantified

The reason aerospace and automotive engineers accept carbon fibre's cost premium is **specific stiffness** (modulus ÷ density) and **specific strength** (strength ÷ density):

| Material | Density (g/cm³) | Tensile Modulus (GPa) | Specific Modulus (GPa·cm³/g) |
|---------|----------------|----------------------|------------------------------|
| Mild steel | 7.85 | 200 | 25.5 |
| Aluminium 7075 | 2.80 | 71 | 25.4 |
| CFRP (60% UD T300/epoxy) | 1.60 | 135 (longitudinal) | 84.4 |
| CFRP (quasi-isotropic) | 1.60 | ~70 (average all directions) | 43.8 |

CFRP's specific modulus is 3-4× higher than both steel and aluminium — the same stiffness at 1/4-1/5 the weight. In aircraft structures, every kilogram saved saves approximately 5 kg of fuel over the aircraft's lifetime. In electric vehicles, weight reduction extends range directly.

---

## Prepreg: The Dominant Aerospace Processing Form

**Prepreg** (pre-impregnated) is carbon fibre fabric or UD tape already impregnated with a partially cured (B-staged) epoxy resin — supplied frozen to prevent premature cure, thawed before use.

**Prepreg advantages:**
- Precise, uniform resin content (typically 35-40% by weight)
- Consistent fibre volume fraction → consistent properties
- Cleaner, faster layup (no liquid resin handling)
- Higher fibre volume fraction achievable vs wet layup

**Prepreg processing (autoclave moulding):**
\`\`\`
1. Layup: Prepreg plies cut and placed on mould in specified orientation sequence
2. Debulking: Vacuum applied periodically to remove trapped air
3. Vacuum bagging: Sealed with release film, breather, vacuum bag
4. Autoclave cure: Temperature + pressure (typically 120-180°C, 5-7 bar) cures epoxy
5. Post-cure: Optional higher-temperature cycle to maximize crosslink density
\`\`\`

The **autoclave** provides both heat (to cure epoxy) and hydrostatic pressure (to consolidate plies, remove voids) — producing aerospace-grade parts with void content <1%.

---

## Out-of-Autoclave (OoA) Processes

Autoclaves are expensive (a large aerospace autoclave costs $5-20M), creating strong industry pressure toward **out-of-autoclave (OoA)** processes that achieve equivalent quality without autoclave pressure:

**Vacuum-only prepregs (OoA prepregs):** Specially formulated prepreg systems that achieve adequate consolidation under vacuum alone. Now used for many aerospace secondary structures.

**Resin Transfer Moulding of carbon fibre (RTM, VARTM):** Dry carbon fibre preforms infused with low-viscosity epoxy or thermoplastic resins. BMW i3 and i8 carbon fibre structural parts used high-pressure RTM (HP-RTM) — enabling automotive cycle times of minutes per part vs hours for autoclave-cured prepreg.

**Thermoplastic CFRP (CFRTP):** Carbon fibre with thermoplastic matrices (PEEK, PPS, PA, PP) — can be stamped, welded, and recycled. Processing cycle time far shorter than thermoset CFRP. Major growth area for automotive applications.

---

### Indian Industry Example

**Tata Advanced Materials** (Bangalore) produces prepreg-based CFRP aerospace structures for ISRO and IAF applications, operating autoclaves and RTM equipment in-house. **Aerospace Composites Pvt. Ltd.** (Hyderabad) manufactures CFRP radomes and structural panels for HAL (Hindustan Aeronautics Limited) aircraft programmes.

Globally, **Toray** (Japan) supplies approximately 50% of global aerospace carbon fibre through their T and M series fibres used in Boeing 787 (50% by weight CFRP) and Airbus A350 (53% by weight CFRP), while **Solvay** (Belgium) and **Hexcel** (USA) are the dominant aerospace prepreg suppliers. **SGL Carbon** (Germany) and **Teijin** (Japan) are leaders in the automotive CFRP segment, developing high-volume processing technologies for the mass-market electric vehicle application that represents the next major growth frontier for carbon composites.

---

## Key Takeaways

- Carbon fibre is manufactured by controlled pyrolysis of PAN precursor through stabilization, carbonization, and optional graphitization — PAN-based fibres dominate commercial production with the best balance of strength and modulus
- CFRP's specific modulus (84 GPa·cm³/g for UD) is 3-4× higher than both steel and aluminium, justifying the 10-20× cost premium in weight-critical applications where mass savings translate to direct performance or energy savings
- Prepreg + autoclave processing remains the aerospace gold standard for void-free, high-fibre-volume-fraction parts, but out-of-autoclave processes (OoA prepregs, HP-RTM, thermoplastic CFRP stamping) are enabling automotive cycle times that will drive the next decade of carbon composite growth
`,
  },
  {
    subject_slug: 'polymer-composites',
    title: 'Short Fibre Reinforced Thermoplastics: Injection Moulded Composites',
    summary: 'Understand the most commercially important composite category by production volume — short glass and carbon fibre reinforced thermoplastics processed by injection moulding — covering compounding, fibre orientation effects, and warpage control.',
    order_index: 4,
    is_premium: false,
    content: `## The Composite You Use Every Day

The gear housing on a power tool. The intake manifold under the hood of your car. The structural bracket inside a printer. The connector housing on your phone charger. All are short fibre reinforced thermoplastic composites — injection moulded in a process you already understand from your polymer processing lessons, with glass or carbon fibre added to the resin.

This is by far the largest commercial segment of the composites market by production volume — far exceeding aerospace prepreg or continuous fibre structural composites. Every major Indian injection moulding facility working with engineering polymers (Nylon, PBT, PPS, PEEK) is producing composites.

---

## Compounding: Creating the Filled Material

Short fibre reinforced thermoplastics are produced by **melt compounding** — blending short fibres into molten thermoplastic using a twin-screw extruder:

\`\`\`
Polymer pellets + Glass fibre (3-4mm chopped strand) or long fibre rovings
→ Twin-screw extruder (260-320°C depending on polymer)
→ Intensive mixing and fibre wetout
→ Underwater pelletizing
→ Short fibre reinforced compound pellets (fibre length now typically 0.1-0.5mm after compounding)
\`\`\`

**Important:** The compounding process significantly breaks fibres. A 3-4mm chopped strand glass fibre entering the compounding extruder exits at an average length of 0.1-0.5mm in most standard compounds. This fibre length reduction is the primary reason short fibre composites have much lower properties than the Rule of Mixtures would predict from the starting fibre — actual stress transfer in short fibres depends critically on the **critical fibre length** concept.

---

## Critical Fibre Length

For a short fibre to carry load efficiently, it must be longer than a critical minimum length:

\`\`\`
Critical length (lc) = (σf × d) / (2 × τi)

Where:
σf = fibre tensile strength
d = fibre diameter
τi = interfacial shear strength (matrix-fibre bond)
\`\`\`

**Implication:** Fibres shorter than lc cannot be stressed to their full tensile strength — they pull out of the matrix before breaking. Fibres much longer than lc can be fully loaded. For glass fibre in Nylon 6, lc is typically 0.3-0.5mm. Most commercial short fibre compound fibres average 0.2-0.4mm — meaning many fibres are near or below critical length, which explains why actual composite properties are typically 40-60% of theoretical predictions.

**Long fibre reinforced thermoplastics (LFT)** address this by maintaining fibre lengths of 5-15mm in the final part, using a different compounding process (pultrusion to produce LFT pellets where fibres run the full pellet length). LFT composites have significantly better impact resistance and fatigue performance than short fibre compounds at comparable stiffness.

---

## Fibre Orientation in Injection Moulded Parts

Fibre orientation in an injection moulded short fibre composite part is **not random and not uniform** — it is determined by the flow pattern during mould filling, creating a layered structure:

\`\`\`
PART CROSS-SECTION:

Surface (skin): Fibres aligned in FLOW direction (high shear at wall)
Mid-layer (core): Fibres aligned TRANSVERSE to flow (extensional flow at melt front)
\`\`\`

This **skin-core structure** means:
- Properties are **anisotropic** — higher stiffness and strength in the flow direction
- **Warpage** is caused by differential shrinkage: fibres constrain shrinkage in their alignment direction, causing the part to shrink less where fibres are aligned and more where they are not → warpage on cooling
- **Weld lines** are especially weak in short fibre composites — at weld lines, fibres are oriented perpendicular to the weld plane (fibre alignment follows the converging flow), creating a weak plane with strength approaching the unfilled polymer

---

## Properties: Short Fibre vs Continuous Fibre Comparison

Using 30% glass-filled Nylon 6 as reference:

| Property | Unfilled Nylon 6 | 30% GF Nylon 6 | Continuous GF/Nylon (unidirectional) |
|---------|-----------------|----------------|--------------------------------------|
| Tensile strength | 80 MPa | 150-190 MPa | ~600 MPa |
| Flexural modulus | 2,800 MPa | 7,000-9,000 MPa | ~35,000 MPa |
| Notched Izod impact | 50 J/m | 80-120 J/m | Very high |
| HDT at 1.8 MPa | 65°C | 200-210°C | - |

The 2-3× strength improvement of short fibre vs unfilled is substantial and commercially very valuable — making injection-moulded 30% GF Nylon a practical engineering material for demanding mechanical applications. But it is far below the potential of continuous fibre composites.

---

### Indian Industry Example

**DIC India** and **Lanxess India** both produce glass-filled and mineral-filled Nylon 6 and PBT engineering compounds at significant volume for Indian automotive, electrical, and consumer product manufacturers. **Bharat Forge** (Pune) has invested in long fibre thermoplastic (LFT) technology for structural automotive applications, targeting weight reduction vs metal stampings while maintaining injection mouldability.

Globally, **BASF's Ultramid** (glass-filled Nylon) and **DSM's Stanyl** (glass-filled Nylon 4,6 for high-heat applications) are global benchmark engineering compounds used in automotive underhood applications in temperatures up to 220°C — performance benchmarks that Indian compound suppliers like DIC India and PolyOne (now Avient, operating in India) work toward in their domestic product development.

---

## Key Takeaways

- Short fibre reinforced thermoplastic composites are the highest-volume composite category — processed by conventional injection moulding from compound pellets, making them accessible to any injection moulder with the right barrel temperature and screw design
- Fibre length after compounding (typically 0.1-0.5mm) is critical — fibres near or below critical length cannot be fully loaded, explaining why actual properties are 40-60% of theoretical predictions; long fibre thermoplastics (LFT, 5-15mm fibres) bridge the gap with substantially better impact performance
- Fibre orientation in injection moulded parts creates skin-core structure and anisotropy — fibres align in the flow direction at the surface and transverse at the core, causing warpage from differential shrinkage that mould designers must compensate for through gate location, wall thickness, and cooling channel design
`,
  },
  {
    subject_slug: 'polymer-composites',
    title: 'Natural Fibre Composites: Jute, Flax, Coir, and Bamboo Reinforcement',
    summary: 'Explore natural fibre reinforced polymer composites — lower cost, lower density, and lower carbon footprint alternatives to glass fibre for interior automotive, construction, and consumer product applications.',
    order_index: 5,
    is_premium: false,
    content: `## A Distinctly Indian Opportunity

India produces more natural fibres than almost any country on earth. Jute (Bengal and Assam), coir (Kerala and Tamil Nadu), banana fibre, sisal, bamboo — these agricultural materials have been used for rope, fabric, and packaging for millennia. Their potential as polymer composite reinforcements is a research and commercial frontier that is distinctly relevant to India's competitive position in sustainable materials.

---

## Why Natural Fibres as Composite Reinforcement?

| Property | Natural Fibre Advantage | Limitation |
|---------|------------------------|-----------|
| Density | 1.1-1.5 g/cm³ vs glass fibre 2.5 g/cm³ — lighter parts possible | - |
| Specific stiffness | Comparable to E-glass on weight basis | Lower absolute stiffness |
| Carbon footprint | Biogenic carbon sequestered during crop growth | Processing emissions |
| Cost | Generally lower than glass fibre per kg | Variable quality |
| Vibration damping | Higher than glass fibre — good acoustic/NVH properties | - |
| End-of-life | Compostable / lower toxicity incineration | - |
| Biodegradability | Biodegrades if natural fibre + biopolymer matrix | - |
| Processing | Processes on standard equipment | - |

**The critical limitation:** Natural fibres are **hydrophilic** (water-attracting) — they absorb moisture, which swells the fibre, degrades the matrix-fibre interface, and causes significant property variation and long-term degradation. Moisture absorption is the primary engineering challenge that limits natural fibre composites to non-structural, interior, or protected applications.

---

## Key Natural Fibres for Composites

### Jute (Corchorus species)

India produces ~80% of global jute. Jute fibre has:
- Tensile modulus: 26-32 GPa
- Tensile strength: 400-800 MPa
- Density: 1.44 g/cm³

Woven jute mats can replace glass fibre CSM in hand-laid composite panels with similar structural performance at lower cost and density. The automotive sector (door panels, package trays, trunk liners) is the primary target application — a sector where European regulations on vehicle end-of-life requirements create demand for natural fibre composites.

### Coir (Coconut Husk Fibre)

India and Sri Lanka are the dominant producers. Coir is unique among natural fibres:
- **Very high cellulose + lignin content** → more rigid, less hydrophilic than jute
- **Excellent impact absorption** — natural cellular structure acts as energy absorber
- **Low density:** 1.15-1.46 g/cm³

Primary application: injection-moulded PP/PE composites for automotive underbody shields, floor mats, and protective packaging.

### Bamboo Fibre and Bamboo Composites

Bamboo is technically a grass, not a tree, with exceptional tensile properties (fibre tensile strength up to 900 MPa) and one of the fastest growth rates of any plant — 50-100cm/day in ideal conditions.

**Two forms:**
- **Bamboo fibre** (extracted, similar to other natural fibres): Used in polymer composites and textile-based composites
- **Bamboo composite lumber** (bamboo strips in thermoset matrix): High-performance structural material for construction, growing rapidly in China and India

**Bamboo composites** are increasingly specified in Indian construction (flooring, panels) as a lower-carbon alternative to hardwood and MDF.

### Flax and Hemp

Used predominantly in European automotive natural fibre composites (Daimler, BMW, Audi all use flax/kenaf/hemp in door panels). Less available in India but globally the highest-performance natural fibre reinforcements — tensile modulus 50-70 GPa, approaching glass fibre on a weight-adjusted basis.

---

## Interface Engineering for Natural Fibre Composites

The hydrophilic surface of natural fibres and the hydrophobic surface of most polymer matrices (PP, PE, Nylon) creates a poor interface by default. Several surface treatment strategies are used:

| Treatment | Method | Effect |
|----------|--------|--------|
| Alkali treatment (mercerization) | NaOH solution, 5-20% concentration | Removes hemicellulose, wax, increases surface roughness and cellulose content → better mechanical interlocking |
| Silane coupling agents | Surface coating with amino or methacryl silane | Creates chemical bond between fibre OH groups and polymer matrix |
| Maleic anhydride grafted PP (MAPP) | Compatibilizer in PP/natural fibre compounds | MAPP reacts with fibre OH groups and is compatible with PP matrix — most effective for PP/natural fibre composites |
| Acetylation | Replaces OH groups with acetyl groups | Reduces moisture absorption, improves hydrophobicity |

---

### Indian Industry Example

**Jute Corporation of India** (government of India) has funded multiple research programmes for jute-reinforced composite development, recognizing India's raw material advantage. **IIT Delhi and IIT Madras** both have active research groups on jute and coir natural fibre composites with several published studies on MAPP compatibilization and surface treatment optimization.

**Automotive sector connection:** **Maruti Suzuki** and **Tata Motors** have evaluated jute-reinforced PP door panels as part of their sustainable materials programmes — acoustic performance and weight reduction are the primary drivers, with cost competitiveness vs glass fibre PP a key commercial hurdle still being addressed.

Globally, **Bcomp** (Switzerland) has developed high-performance flax fibre composite components used in Formula 1 (Williams Racing, Sauber), ski equipment, and marine applications — demonstrating that natural fibre composites can compete with glass fibre in demanding structural applications when properly engineered, opening a pathway that Indian natural fibre composite developers can follow.

---

## Key Takeaways

- Natural fibre reinforced polymer composites offer specific stiffness comparable to glass fibre at lower density, lower carbon footprint, and lower cost — with India having significant raw material advantage in jute, coir, and bamboo
- Moisture absorption is the critical engineering challenge — natural fibres are inherently hydrophilic, requiring alkali treatment, silane coupling, or MAPP compatibilization to improve the fibre-matrix interface and reduce long-term property degradation
- Primary applications are automotive interior panels, construction panels, and packaging — not structural load-bearing applications where moisture exposure and fatigue loading make natural fibre composites currently unsuitable without significant protective engineering
`,
  },
  {
    subject_slug: 'polymer-composites',
    title: 'Composite Design, Failure Modes, and Testing',
    summary: 'Learn how composites fail, the standardized tests used to characterize composite laminates, and the basic design rules that prevent the most common failure modes — essential knowledge for any engineer specifying or working with composite materials.',
    order_index: 6,
    is_premium: false,
    content: `## How Composites Fail (Which Is Different From Metals)

Polymer composites fail by fundamentally different mechanisms than metals. A metal typically deforms plastically before failure, giving visible warning. A composite structure can fail catastrophically with little prior visual indication — which is why understanding composite failure modes is safety-critical knowledge.

---

## The Five Primary Failure Modes

### 1. Fibre Breakage (Fibre Fracture)

The fibres themselves break when the applied stress exceeds their tensile strength. In a well-designed composite loaded in the fibre direction, this is the ultimate failure mode — and it represents the full utilization of the fibre's strength.

### 2. Matrix Cracking

The matrix (epoxy, Nylon, PP) cracks under tensile loading transverse to the fibre direction, or under shear loading. Matrix cracks don't immediately cause catastrophic failure but allow moisture ingress and stress redistribution to fibres, accelerating subsequent damage.

### 3. Delamination

Separation of adjacent plies at the interface between them. The dominant failure mode in continuous fibre laminates under bending, impact, or compression loading. Very difficult to detect visually (delamination can occur internally with no surface indication) — detected by non-destructive testing (ultrasonic scanning, thermography).

**Why delamination is insidious:** A delaminated panel can look undamaged while having lost 50-70% of its original compressive strength. This is a primary concern in aircraft structures where "barely visible impact damage" (BVID) after a hailstone or tool-drop must be reliably detected before strength is critically compromised.

### 4. Fibre Pull-Out

At the fracture plane, fibres pull out of the matrix rather than breaking cleanly — occurs when the interface is weaker than the fibre. Pull-out absorbs significant energy (makes the composite tougher) but indicates sub-optimal fibre-matrix bonding.

### 5. Buckling (Compressive Failure)

Fibres are very strong in tension but can buckle in compression — especially long slender fibres in a relatively soft matrix. Compressive strength of CFRP laminates is typically only 50-65% of their tensile strength, which drives design conservatism in aerospace applications.

---

## Laminate Orientation Notation

Before testing, engineers must specify the laminate — the sequence and orientation of plies. Standard notation:

\`\`\`
[0/90/±45/90/0]s
 ↑  ↑   ↑  ↑  ↑
 │  │   │  │  └── Final ply (0°)
 │  │   │  └───── 90° ply
 │  │   └──────── ±45° plies
 │  └──────────── 90° ply
 └─────────────── 0° reference direction ply

's' = symmetric (same sequence mirrored about midplane)
\`\`\`

**Quasi-isotropic laminate [0/±45/90]s:** Equal plies in 0°, ±45°, and 90° orientations — produces approximately equal properties in all in-plane directions. Standard starting point for structural composite design where loading direction is not fixed.

---

## Key Mechanical Tests for Composites

Testing standards for composites differ from those for unreinforced polymers (ASTM D638 for tensile applies to polymers, but composite-specific standards are needed):

| Test | Standard | What It Measures |
|------|---------|-----------------|
| Tensile strength/modulus | ASTM D3039 | In-plane tensile properties of laminate |
| Compressive strength | ASTM D3410 (IITRI) | Compressive properties — critical because CFRP compressive strength governs structural design |
| Interlaminar shear strength (ILSS) | ASTM D2344 | Short-beam shear test — measures matrix-dominated interlaminar shear, sensitive to processing quality |
| Impact resistance (ASTM D7136) | ASTM D7136 | Drop-weight impact — measures damage tolerance vs. metals (Charpy/Izod not suitable for composites) |
| Flexural properties | ASTM D7264 | Four-point bending — critical for sandwich and panel applications |
| Mode I delamination toughness (GIc) | ASTM D5528 | Double Cantilever Beam — measures resistance to delamination crack opening |

---

## Non-Destructive Testing (NDT) of Composites

Because composites can have internal damage without visible surface indication, NDT is essential for aerospace and critical structural applications:

| Method | What It Detects | How |
|--------|----------------|-----|
| Ultrasonic C-scan | Delamination, voids, disbonds | Sound waves attenuate through damage |
| X-ray / CT scan | Internal structure, fibre orientation, voids | X-ray absorption differences |
| Thermography | Delamination, voids | Surface temperature anomalies over defects |
| Acoustic emission | Active crack growth | Sound waves from fracture events |

---

### Indian Industry Example

**DRDL (Defence Research and Development Laboratory)**, Hyderabad, and **National Aerospace Laboratories (NAL)**, Bangalore, are the primary Indian government institutions conducting composite structural testing and NDT to aerospace standards for HAL and ISRO programmes. **CIPET's** materials testing division is increasingly adding composite testing capability as Indian wind energy and automotive composite demand grows.

Globally, the **ASTM D30 Committee** (USA) maintains all major structural composite test standards, while **Cytec Solvay** and **Hexcel** publish application-specific composite design guides that have become de facto industry references for laminate design rules and allowable stress databases — documents that any Indian composite engineer working on aerospace or high-performance automotive applications will reference regularly.

---

## Key Takeaways

- Composites fail by five mechanisms — fibre fracture, matrix cracking, delamination, fibre pull-out, and buckling — with delamination being the most insidious because it can cause 50-70% compressive strength loss without visible surface indication
- Laminate design using orientation notation [0/90/±45]s controls in-plane stiffness and strength distribution — quasi-isotropic laminates provide equal properties in all directions and are the standard starting point when load direction is variable
- Composite testing requires different standards than unreinforced polymers — ASTM D3039 (tensile), D3410 (compression), D2344 (interlaminar shear), and D7136 (impact) are the primary characterization tests, complemented by non-destructive testing (ultrasonic C-scan, thermography) for internal damage detection in service
`,
  },
];

async function seedLessons() {
  console.log('🚀 PolymerHub Phase 2 — Seeding Polymer Composites lessons 1-6...\n');

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

  if (!subjectMap['polymer-composites']) {
    console.error('❌ Subject "polymer-composites" not found. Run phase2_complete_safe.sql first.');
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

  console.log('✅ Polymer Composites lessons seeded!\n');
  data.forEach((l, i) => console.log(`   ${i + 1}. ${l.title}`));
  console.log(`\n🎉 Done! ${data.length} lessons added.\n`);
}

seedLessons();
