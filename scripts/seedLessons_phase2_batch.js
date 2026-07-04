// scripts/seedLessons_phase2_batch.js
// Lessons for Phase 2 subjects (Recycling, Bioplastics, Composites, Entrepreneurship)
// Run with: node scripts/seedLessons_phase2_batch.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const lessonData = [
  // ─── Subject 6: Recycling Technology ──────────────────────────────────────────
  {
    subject_slug: 'recycling-technology',
    title: 'Introduction to Mechanical and Chemical Recycling',
    summary: 'Understand the core processes of mechanical recycling (sorting, washing, shredding, melt filtration) and chemical recycling (depolymerization, pyrolysis, and enzymatic pathways) for plastic waste.',
    order_index: 1,
    is_premium: false,
    content: `## The Recycling Hierarchy

Plastics recycling is classified into four categories based on the recovery mechanism:
1. **Primary (Closed-Loop):** In-plant recycling of clean scrap (e.g. edge trims in film blowing re-extruded directly).
2. **Secondary (Mechanical):** Physical processing of post-consumer waste into pellets without breaking molecular chains.
3. **Tertiary (Chemical):** Depolymerization of polymer chains back into monomers or chemical feedstocks.
4. **Quaternary (Energy Recovery):** Incineration of contaminated plastics to recover energy (WTE plants).

---

## Mechanical Recycling Process Flow

Mechanical recycling is the workhorse of the Indian recycling sector, processing over 90% of recovered polymers. The process follows these critical steps:

\`\`\`
Collection → Sorting → Shredding → Washing/Float-Sink → Melt Filtration → Pelletizing
\`\`\`

### 1. Sorting (The Critical Bottleneck)
*   **Manual sorting:** Still dominates Indian recycling hubs like Dharavi (Mumbai) and Haldiram/Bawana (Delhi).
*   **Automated sorting:** Uses Near-Infrared (NIR) spectroscopy to identify and sort polymers by resin type (PET, HDPE, PP, PS) and color. NIR cannot identify black plastics (carbon black absorbs NIR radiation).

### 2. Washing and Float-Sink Separation
Polymers are separated in water tanks based on density differences relative to water (density = 1.0 g/cm³):

| Polymer | Density (g/cm³) | Float or Sink in Water? |
|---------|-----------------|------------------------|
| PP / PE | 0.89 – 0.96 | **Float** |
| Water   | 1.00 | - |
| PET     | 1.34 – 1.40 | **Sink** |
| PVC     | 1.38 – 1.42 | **Sink** |

This separation allows easy separation of PP/PE bottle caps (float) from PET bottle flakes (sink).

### 3. Extrusion and Melt Filtration
The clean flakes are melted in a single or twin-screw extruder. A **melt screen changer** (mesh size 80–150 mesh) filters out paper, aluminum, and un-melted impurities before pelletizing.

---

## Chemical Recycling (Tertiary Recycling)

Chemical recycling breaks down polymer chains into molecular building blocks, enabling recycled plastics to achieve **100% food-grade safety**, which mechanical recycling cannot guarantee.

### 1. Pyrolysis
Thermal degradation of mixed plastic waste (mainly PE and PP) in the absence of oxygen at 400–600°C.
*   **Output:** Pyrolysis oil (hydrocarbons similar to naphtha).
*   **Advantage:** Can process contaminated multi-layer films that cannot be mechanically recycled.

### 2. Depolymerization (PET Glycolysis and Hydrolysis)
PET polyester can be chemically broken down into its monomers, bis(2-hydroxyethyl) terephthalate (BHET), dimethyl terephthalate (DMT), or terephthalic acid (PTA) + ethylene glycol (EG).
*   **Enzymatic depolymerization:** Advanced trials use mutated **PETase enzymes** (e.g., Carbios process) to selectively dissolve PET in mixed textile waste at mild temperatures (60°C).

---

### Indian Industry Context

**Ganesha Ecosphere** (Kanpur) is India's largest PET recycler, processing over 1.2 billion PET bottles annually into Recycled Polyester Staple Fibre (rPSF) and food-grade rPET pellets.

Reliance Industries (RIL) operates an advanced chemical recycling plant at Jamnagar, using **pyrolysis oil** derived from plastic waste as a feedstock in their crackers to produce circular polymers sold under the **CircuRepol** and **CircuRelene** brands.

---

## Key Takeaways
- Mechanical recycling relies on density separation (float-sink) and melt filtration; it degrades polymer chain length (molecular weight) each heat cycle.
- Chemical recycling (pyrolysis, glycolysis) breaks polymers down into monomers, eliminating contaminants and producing virgin-quality food-grade resin.
`
  },
  {
    subject_slug: 'recycling-technology',
    title: 'EPR (Extended Producer Responsibility) Compliance Frameworks in India',
    summary: 'Master the legal and regulatory frameworks governing plastic packaging waste in India, including EPR categories, recycling targets, and the CPCB registration portal.',
    order_index: 2,
    is_premium: true,
    content: `## What is EPR?

**Extended Producer Responsibility (EPR)** is a policy framework that makes plastic packaging manufacturers, brand owners (PIBOs), and importers legally and financially responsible for the collection, recycling, and end-of-life management of the plastic products they put into the market.

In India, EPR is mandated under the **Plastic Waste Management (PWM) Rules, 2016** (amended in 2022 by the Ministry of Environment, Forest, and Climate Change).

---

## EPR Categories in India

The Central Pollution Control Board (CPCB) classifies plastic packaging into four distinct categories for EPR targets:

| Category | Description | Examples |
|----------|-------------|----------|
| **Category I** | Rigid plastic packaging | PET water bottles, HDPE shampoo bottles, PP paint buckets |
| **Category II** | Flexible plastic packaging (single-layer or multi-layer with one polymer) | LDPE grocery bags, stretch films, PP bags |
| **Category III** | Multi-layered plastic packaging (at least one layer of plastic and other materials) | TetraPaks, potato chip bags (metallized BOPP + PE) |
| **Category IV** | Compostable plastic sheets/bags | PLA carry bags, starch-based compostable garbage bags |

---

## Recycling and Collection Targets

PIBOs must register on the CPCB centralized EPR portal and meet progressive recycling targets calculated as a percentage of the average plastic packaging introduced in the previous two financial years.

Under the 2022 amendments, the minimum recycling targets for Category I (Rigid) are:
- **FY 2024-25:** 50%
- **FY 2025-26:** 60%
- **FY 2026-27 onwards:** 80%

### The EPR Certificate System
PIBOs meet their targets by purchasing **EPR Certificates** from registered recyclers on the CPCB portal. For example:
- A registered recycler processes 1,000 kg of PET bottle waste.
- The CPCB issues an EPR certificate of 1,000 kg to the recycler.
- A Brand Owner (like Coca-Cola India) buys these certificates to offset their packaging liability.
- If a brand fails to meet its target, CPCB imposes **Environmental Compensation (EC)** charges, which operate as a penalty.

---

## Indian Regulatory Context

The CPCB portal plays a key role in monitoring compliance. Fresh polymer engineering graduates are increasingly hired as **Compliance Managers** or **EPR Auditors** by FMCG companies (like ITC, Dabur, Nestle India) and recyclers to audit collection trails, verify recycling capacities, and upload invoices to the CPCB portal.

Firms like **Recykal** and **Banyan Nation** act as digital aggregators in India, bridging the gap between informal scrap collectors (Kabadiwalas), formal recyclers, and brand owners to ensure transparent compliance.

---

## Key Takeaways
- India classifies plastic packaging into four categories: Rigid, Flexible, Multi-layered, and Compostable.
- EPR is compliance-driven through the CPCB online portal via the exchange of verified recycling certificates.
- Brand owners must purchase certificates or pay environmental compensation fees; this creates a massive demand for polymer engineers who understand both materials and environmental regulations.
`
  },

  // ─── Subject 7: Sustainable Plastics & Bioplastics ──────────────────────────
  {
    subject_slug: 'sustainable-plastics',
    title: 'Bioplastics: Synthesis, Compostability, and Standards',
    summary: 'Differentiate between bio-based and biodegradable polymers. Study the chemical synthesis of PLA, biosynthesis of PHA, and the test standards (IS/ISO 17088) that define commercial compostability.',
    order_index: 1,
    is_premium: false,
    content: `## Bio-Based vs. Biodegradable

A common point of confusion is the difference between source material (bio-based vs. fossil-based) and end-of-life behavior (biodegradable vs. non-biodegradable):

1. **Bio-based, Non-biodegradable:** E.g., Bio-PET or Bio-PE (made from sugarcane ethanol but identical in chemical structure to fossil-PE).
2. **Bio-based, Biodegradable:** E.g., Polylactic Acid (PLA) or Polyhydroxyalkanoates (PHA).
3. **Fossil-based, Biodegradable:** E.g., Polybutylene Adipate Terephthalate (PBAT) or Polycaprolactone (PCL).
4. **Fossil-based, Non-biodegradable:** Conventional plastics (PP, HDPE, PVC).

---

## Synthesis of Key Biopolymers

### 1. Polylactic Acid (PLA)
PLA is synthesized from starch (derived from corn or sugarcane in India). The process involves:
*   Fermentation of starch into **Lactic Acid**.
*   Dimerization into cyclic **Lactide monomer**.
*   **Ring-Opening Polymerization (ROP)** of lactide using tin octoate catalyst to yield high molecular weight PLA.

\\\[
\\text{Starch} \\rightarrow \\text{L-Lactic Acid} \\rightarrow \\text{Lactide} \\xrightarrow{\\text{ROP}} \\text{Polylactic Acid (PLA)}
\\\]

### 2. Polyhydroxyalkanoates (PHA)
PHAs are polyesters synthesized directly inside bacterial cells (e.g., *Cupriavidus necator*) as carbon and energy storage reserves.
*   Bacteria are fed sugars or vegetable oils under nitrogen-limited conditions.
*   PHAs accumulate as intracellular granules up to 90% of the dry cell weight.
*   The cells are lysed using enzymes or solvents to extract pure PHA.

---

## Compostability Standards (IS/ISO 17088)

A polymer cannot be labeled "compostable" without meeting strict certification standards. In India, the Bureau of Indian Standards mandates **IS/ISO 17088** (identical to ASTM D6400 / EN 13432):

### 1. Disintegration
After 12 weeks of composting, no more than 10% of the plastic dry weight must remain on a 2mm sieve.

### 2. Biodegradation
At least 90% conversion of the organic carbon to CO2 must occur within 180 days in an industrial composting facility.

### 3. Ecotoxicity
The resulting compost must be tested for heavy metal limits, and seed germination tests must show that the compost supports plant growth (at least 90% of control compost).

---

### Indian Laboratory and Testing

The **CIPET Central Laboratory** in Chennai is the primary agency authorized by the Central Pollution Control Board to test and certify biodegradable and compostable plastics under IS/ISO 17088. Any Indian manufacturer selling compostable carry bags must print their CPCB license number and the CIPET test certificate ID on every bag.

---

## Key Takeaways
- Bio-based refers to the carbon source; biodegradable refers to chemical breakdown by micro-organisms.
- PLA is synthesized via Ring-Opening Polymerization of lactide; PHA is synthesized biosynthetically by bacterial fermentation.
- IS/ISO 17088 requires disintegration, biodegradation (90% in 180 days), and non-toxic compost quality.
`
  },
  {
    subject_slug: 'sustainable-plastics',
    title: 'PLA, PHA, and Starch-based Polymers in Packaging',
    summary: 'Analyze the engineering challenges of processing PLA, PHA, and starch blends using conventional extrusion and injection moulding machinery, and study their applications in commercial packaging.',
    order_index: 2,
    is_premium: true,
    content: `## The Challenge of Drop-In Replacements

While biopolymers are environmentally attractive, they cannot be processed exactly like conventional polyolefins (LDPE/PP). They require modifications in processing temperatures, drying protocols, and screw designs.

---

## Processing Characteristics of Biopolymers

### 1. Polylactic Acid (PLA)
PLA has a melting temperature of 150–160°C, but behaves very differently from PP:
*   **Hydrolytic Degradation:** PLA is highly hygroscopic. If processed with moisture content above 0.025% (250 ppm), water breaks the ester bonds in the molten state, reducing molecular weight and rendering the parts extremely brittle. **Drying at 60–80°C for 4 hours in a desiccant dryer is mandatory.**
*   **Low Melt Strength:** PLA has low melt strength, making it difficult to blow thin films or extrusion blow-mould bottles. It requires chain extenders (e.g. epoxy-functional acrylic copolymers) to increase branching and melt viscosity.

### 2. Thermoplastic Starch (TPS) Blends
Starch alone does not melt; it decomposes. To make it processable:
*   Starch is mixed with plasticizers (glycerol, sorbitol) and sheared in a twin-screw extruder to destroy the crystalline starch granules, yielding **Thermoplastic Starch (TPS)**.
*   TPS is highly water-soluble and brittle. Therefore, it is blended with biodegradable polyesters like **PBAT** (Polybutylene Adipate Terephthalate) or **PLA** to make flexible carry bags.

---

## Property Comparison: Bio-Packaging vs. Conventional

| Property | PLA | PHA (PHBV) | TPS/PBAT Blend | LDPE (Control) |
|----------|-----|------------|----------------|----------------|
| Density (g/cm³) | 1.24 | 1.25 | 1.20 | 0.92 |
| Tensile Strength (MPa) | 50 – 60 | 30 – 40 | 15 – 20 | 10 – 20 |
| Elongation at Break (%) | 4 – 10% | 5 – 15% | 150 – 300% | 500 – 600% |
| Oxygen Barrier | Good | Excellent | Poor | Poor |
| Price (relative to LDPE) | ~2.5× | ~4–5× | ~1.8× | 1.0 |

---

## Industrial Applications in India

In India, starch-PBAT blends are widely processed on conventional blown film lines by manufacturers like **Ecolife** and **Truegreen** to make compostable carry bags, garbage liners, and agricultural mulch films.

PLA is processed by thermoforming to make compostable cups, food containers, and blister packaging. In premium cosmetics, **PHA** is slowly finding traction for rigid bottles due to its excellent moisture barrier and marine biodegradability.

---

## Key Takeaways
- PLA must be dried to less than 250 ppm before processing to prevent hydrolytic chain cleavage.
- Starch must be plasticized into TPS and blended with synthetic biodegradable polyesters (like PBAT) to achieve usable flexibility.
- Biopolymers have lower elongation at break and higher cost than conventional LDPE, but offer specialized barrier advantages and circular benefits.
`
  },

  // ─── Subject 8: Polymer Composites ──────────────────────────────────────────
  {
    subject_slug: 'polymer-composites',
    title: 'Introduction to Reinforced Polymer Composites',
    summary: 'Learn the fundamentals of composites: matrix vs. reinforcement, glass-fibre and carbon-fibre systems, the critical fibre length concept, and interfacial bonding using silane coupling agents.',
    order_index: 1,
    is_premium: false,
    content: `## What is a Polymer Composite?

A **polymer composite** is a materials system consisting of a polymer binder (**matrix**) and a structural phase (**reinforcement** or filler). The properties of the composite are superior to those of the individual constituents.

$$\\text{Composite} = \\text{Polymer Matrix (Thermoset or Thermoplastic)} + \\text{Reinforcing Fibres (Glass, Carbon, or Aramid)}$$

---

## Roles of the Components

### 1. The Reinforcement (Load-Bearing Phase)
Reinforcements provide strength and stiffness. The most common structural fibres are:
*   **Glass Fibre:** E-glass (electrical grade, standard structural fibre) and S-glass (high strength, aerospace grade).
*   **Carbon Fibre:** Extremely high modulus and low density, used in high-performance structural applications.
*   **Aramid Fibre (Kevlar):** Excellent impact and abrasion resistance, used in bulletproof vests and high-wear gears.

### 2. The Matrix (Load-Transfer and Protection)
The matrix binds the fibres together, transfers applied loads to the fibres via shear stress at the interface, and protects the fibres from environmental damage (moisture, chemicals).
*   **Thermoset matrices:** Epoxy (best strength, aerospace), Unsaturated Polyester (cheap, standard GRP), Vinyl Ester (good chemical resistance).
*   **Thermoplastic matrices:** PP, Polyamide (Nylon 6/66), Polyetheretherketone (PEEK).

---

## The Interface and Coupling Agents

The strength of a composite depends entirely on the efficiency of load transfer across the matrix-fibre interface.

Because glass fibre is hydrophilic (polar) and polymers like polypropylene are hydrophobic (non-polar), they do not bond well. To solve this, **Silane Coupling Agents** are applied as a sizing on glass fibres.

A typical silane has the chemical formula:

$$\\text{Y-R-Si(OR)}_3$$

*   The **$-\\text{Si(OR)}_3$** (alkoxysilane) group hydrolyzes and bonds covalently to the hydroxyl groups on the glass surface.
*   The **$\\text{Y}$** group is an organofunctional group (like amine or epoxy) that reacts and dissolves into the polymer matrix during processing.
*   This forms a chemical bridge across the interface, increasing tensile strength by up to 150%.

---

## Critical Fibre Length ($L_c$)

For a fibre to be stressed to its maximum tensile strength, it must exceed a **critical length** ($L_c$):

$$L_c = \\frac{\\sigma_f \\cdot d}{2 \\tau_c}$$

Where:
- $\\sigma_f$ = Tensile strength of the fibre
- $d$ = Fibre diameter
- $\\tau_c$ = Interfacial shear strength (matrix-fibre bond strength)

If fibre length $L < L_c$, the fibre will pull out of the matrix rather than breaking. This is why **Long Fibre Thermoplastics (LFT)** yield much tougher automotive parts than short-fibre compounds.

---

## Key Takeaways
- The matrix transfers stress to the reinforcing fibres; glass and carbon fibres carry the mechanical load.
- Silane coupling agents act as molecular bridges to bond hydrophilic glass to hydrophobic resins.
- Fibres must exceed the critical length ($L_c$) to achieve maximum reinforcement efficiency, preventing pull-out failure.
`
  },
  {
    subject_slug: 'polymer-composites',
    title: 'Manufacturing of Glass-Fibre and Carbon-Fibre Composites',
    summary: 'Study the primary manufacturing methods for composites: Hand Lay-up, Filament Winding, Pultrusion, and Resin Transfer Moulding (RTM), with real-world Indian aerospace and automotive applications.',
    order_index: 2,
    is_premium: true,
    content: `## Composite Processing Classifications

Composite processing is divided into **open mould** (low cost, labor-intensive, low volume) and **closed mould** (high tooling cost, automated, high volume, uniform part thickness) methods.

---

## Key Manufacturing Techniques

### 1. Hand Lay-up / Spray-up (Open Mould)
*   **Process:** Fibres in the form of woven mats are placed manually into a single-sided mould, and liquid resin (usually polyester mixed with MEKP catalyst) is rolled out manually to remove trapped air.
*   **Use case:** Boat hulls, water tanks, chemical storage vessels.
*   **Pros/Cons:** Lowest tooling cost, but inconsistent quality and high emissions of volatile styrene.

### 2. Pultrusion (Continuous Profile Production)
*   **Process:** Continuous fibre rovings are pulled through a liquid resin bath, then pulled through a heated steel die where the resin cures. The solid composite profile emerges continuously and is cut to length.
*   **Products:** Ladder rails, electrical tool handles, structural beams, rebar.

### 3. Filament Winding (Cylindrical Structures)
*   **Process:** Continuous resin-impregnated fibre rovings are wound onto a rotating mandrel at controlled angles (helical, hoop, polar) using a CNC carriage.
*   **Products:** High-pressure cylinders, CNG tanks, rocket motor casings, chemical pipes.

### 4. Resin Transfer Moulding (RTM) (Closed Mould)
*   **Process:** Dry fibre preforms are placed in a matched metal mould cavity. The mould is clamped shut, and liquid resin is injected under pressure. Vacuum is often applied to ensure complete wet-out.
*   **Products:** Car body panels, aerospace fairings.

---

## Process Comparison Matrix

| Method | Production Rate | Fibre Content (vol %) | Surface Finish | Tooling Cost |
|--------|-----------------|-----------------------|----------------|--------------|
| **Hand Lay-up** | Very Low | 20 – 35% | One side smooth | Very Low |
| **Filament Winding**| Medium | 50 – 70% | Inside smooth | Medium |
| **Pultrusion** | High (continuous) | 50 – 75% | Excellent | Medium |
| **RTM** | Medium-High | 45 – 65% | Both sides smooth| High |

---

## Indian Structural Composite Sector

**Tata Advanced Systems Limited (TASL)** (Bengaluru) manufactures carbon-fibre reinforced polymer (CFRP) structural components for Boeing and Airbus using automated RTM and autoclave curing.

**ISRO** (Indian Space Research Organisation) manufactures rocket motor casings for the PSLV and GSLV launchers using automated **filament winding** of carbon fibre with epoxy resins at the Vikram Sarabhai Space Centre (VSSC) in Thiruvananthapuram.

Wind turbine blade manufacturers in Gujarat (like **Suzlon**) use pultrusion and resin infusion to manufacture glass-fibre reinforced epoxy wind turbine blades up to 80 meters in length.

---

## Key Takeaways
- Open mould processes (like Hand Lay-up) are suited for low-volume large parts; closed mould processes (like RTM) are automated and produce consistent, high-performance parts.
- Filament winding is the standard method for structural cylinders, using precise winding angles to balance hoop and axial stresses.
- Indian engineering sectors (ISRO, TASL, Suzlon) utilize composites to reduce weight in space, aviation, and renewable energy sectors.
`
  },

  // ─── Subject 9: Entrepreneurship in Plastics ────────────────────────────────
  {
    subject_slug: 'entrepreneurship-plastics',
    title: 'CAPEX and Business Planning for Plastics Processing',
    summary: 'Learn how to construct a business plan for a plastics manufacturing unit in India. Covers CAPEX, OPEX, power and utility requirements, and calculating the payback period.',
    order_index: 1,
    is_premium: false,
    content: `## Starting a Plastics Venture in India

Plastics processing represents one of the most accessible manufacturing fields for first-generation entrepreneurs in India due to high demand, predictable raw material supply, and modular machinery. 

A startup business plan requires mapping out two capital categories: **CAPEX** (Capital Expenditure) and **OPEX** (Operational Expenditure).

---

## Case Study: Low-CAPEX Injection Moulding Unit
*Target: Manufacturing PP household items (containers, cups, hangers) in an industrial estate in Maharashtra/Gujarat.*

### 1. CAPEX Breakdown (Initial Setup)

| Asset Item | Capacity/Specs | Cost (Estimated) |
|------------|----------------|------------------|
| **Injection Moulding Machine** | 150-tonne hydraulic (semi-automatic) | ₹12,00,000 |
| **Moulds** | 2 multi-cavity moulds (Hanger & Cup) | ₹3,00,000 |
| **Auxiliary Equipment** | Cooling tower (5 TR), Hopper dryer, Grinder | ₹2,50,000 |
| **Electrical Installation** | 45 HP power connection, cabling | ₹1,50,000 |
| **Factory Deposit & Setup** | 1,500 sq.ft leased shed | ₹1,00,000 |
| **Total CAPEX** | - | **₹20,00,000** |

### 2. OPEX Breakdown (Monthly Operating Cost)
*Working capital is critical; plastics raw material is sold on advance cash or short credit.*
- **Raw Material:** 5,000 kg PP Homopolymer (Repol H110MA) @ ₹95/kg = ₹4,75,000
- **Power Bill:** 30 kW avg load, 20 hrs/day, 25 days @ ₹8/unit = ₹48,000
- **Labor:** 1 supervisor (₹25k) + 3 operators/packers (₹15k each) = ₹70,000
- **Factory Rent:** ₹30,000
- **Consumables & Logistics:** ₹25,000
- **Total Monthly OPEX:** **₹6,48,000**

---

## Financial Metrics for the Venture

To check viability, we calculate the **Simple Payback Period** and **Break-Even Point (BEP)**.

### Net Profit Calculation
- Output: 4,850 kg finished goods (assuming 3% scrap/regrind).
- Sale Price: ₹160/kg (finished plastic hangers/mugs wholesale price).
- Monthly Revenue: $4850 \\times 160 = \\text{₹7,76,000}$
- Monthly Net Profit: $\\text{₹7,76,000} - \\text{₹6,48,000} = \\text{₹1,28,000}$

### Payback Period Calculation

$$\\text{Payback Period} = \\frac{\\text{Total CAPEX}}{\\text{Annual Net Profit}}$$

$$\\text{Annual Net Profit} = 1,28,000 \\times 12 = \\text{₹15,36,000}$$

$$\\text{Payback Period} = \\frac{20,00,000}{15,36,000} = 1.3 \\text{ years (approx 16 months)}$$

This is considered a highly viable business venture under Indian banking norms.

---

## Key Takeaways
- Starting a plastics unit requires balancing machinery CAPEX against substantial raw material working capital (OPEX).
- Power and raw materials constitute over 80% of monthly operating costs in plastics processing.
- A payback period of 1.5 to 2.5 years is typical for standard injection moulding or extrusion setups in India.
`
  },
  {
    subject_slug: 'entrepreneurship-plastics',
    title: 'BIS Compliance, Raw Material Sourcing, and Government Schemes in India',
    summary: 'Navigate Bureau of Indian Standards (BIS) certifications, secure raw materials from RIL/GAIL/Distributors, and utilize Indian government MSME funding schemes like CLCSS and PMEGP.',
    order_index: 2,
    is_premium: true,
    content: `## Sourcing Raw Materials in India

One of the key determinants of a plastic unit's profitability is the raw material sourcing strategy. Polymer prices fluctuate daily in line with crude oil and petrochemical cracker margins.

### 1. Primary Resins (Virgin Grade)
- **Direct Sourcing:** Resins like **Repol PP** or **Relene PE** are purchased directly from **Reliance Industries Limited (RIL)**, **GAIL**, or **IOCL** through their regional depots. This requires a GST number, a minimum order quantity (MOQ) of typically 9 to 18 tonnes, and advance payments.
- **Distributor Networks:** For smaller quantities, entrepreneurs buy from local authorized distributors (del-credere agents) who charge a small markup but offer local delivery and flexible billing.

### 2. Recycled Materials (Regrinds/Granules)
- Sourced from recycling clusters like **Daman**, **Silvassa**, **Haldiram**, or **Halol** (Gujarat). Recycled PP/PE granules sell for ₹60–75/kg (compared to virgin at ₹95/kg), which is essential to manufacture competitive low-cost items like garbage bags or agricultural pipes.

---

## Bureau of Indian Standards (BIS) Licensing

The Indian government has made **BIS Quality Control Orders (QCOs)** mandatory for major plastic products and polymers to curb cheap, low-quality imports.

*   **IS 4984:** Specification for HDPE pipes for drinking water supply (mandatory for Jal Jeevan Mission government contracts).
*   **IS 2508:** Specification for LDPE films for general packaging.
*   **IS 7809:** Specification for PVC insulation tapes.

### The Licensing Process
1. Establish an in-house laboratory with testing equipment (Melt Flow Indexer, Tensile Tester, Density Balance, Carbon Black Content Tester).
2. Apply online on the **Manakonline** portal.
3. A BIS Auditor visits the factory, audits the QC process, and seals samples for independent testing.
4. Once tests pass, the factory is granted the **ISI mark** license.

---

## Government Schemes for Plastic MSMEs

The Government of India provides subsidies and loans to promote local manufacturing:

### 1. PMEGP (Prime Minister\'s Employment Generation Programme)
- **Coverage:** Loans up to ₹50 Lakhs for manufacturing units.
- **Subsidy:** 15% to 35% of the project cost is provided as a government subsidy, making it excellent for rural/semi-urban polymer processing units.

### 2. CLCSS (Credit Linked Capital Subsidy Scheme)
- **Purpose:** Upgradation of technology.
- **Benefit:** 15% capital subsidy (up to ₹15 Lakhs) for purchasing modern, energy-efficient machinery (e.g. electric injection moulding machines that save 40% power).

### 3. CGTMSE (Credit Guarantee Fund Trust for Micro and Small Enterprises)
- Provides collateral-free loans up to ₹5 Crores from nationalized banks, resolving the main hurdle faced by fresh graduates without land or assets to pledge.

---

## Key Takeaways
- Virgin resins are purchased from major producers (RIL, GAIL) through depots or distributors; recycled resins offer cost savings but variable quality.
- Mandated BIS (ISI mark) compliance requires setting up an in-house testing lab — this is a key role for polymer engineers.
- Schemes like PMEGP, CLCSS, and CGTMSE provide crucial financial support, capital subsidies, and collateral-free loans for MSMEs.
`
  }
];

async function seedLessons() {
  console.log('🚀 Seeding Phase 2 Lessons...\n');

  // Fetch subjects to map slugs to IDs
  const { data: subjects, error: fetchErr } = await supabase
    .from('subjects')
    .select('id, slug');

  if (fetchErr) {
    console.error('❌ Failed to fetch subjects:', fetchErr.message);
    process.exit(1);
  }

  const subjectMap = {};
  subjects.forEach(s => {
    subjectMap[s.slug] = s.id;
  });

  const lessonsToInsert = lessonData.map(l => {
    const subjectId = subjectMap[l.subject_slug];
    if (!subjectId) {
      console.error(`❌ Subject id not found for slug: ${l.subject_slug}`);
      process.exit(1);
    }
    return {
      subject_id: subjectId,
      title: l.title,
      slug: slugify(l.title),
      summary: l.summary,
      content: l.content,
      is_premium: l.is_premium,
      order_index: l.order_index
    };
  });

  console.log(`📦 Upserting ${lessonsToInsert.length} lessons...`);

  const { data: inserted, error: upsertErr } = await supabase
    .from('lessons')
    .upsert(lessonsToInsert, { onConflict: 'slug', ignoreDuplicates: false })
    .select('id, title, slug');

  if (upsertErr) {
    console.error('❌ Failed to upsert lessons:', upsertErr.message);
    console.error(JSON.stringify(upsertErr));
    process.exit(1);
  }

  console.log(`✅ Success! Seeded ${inserted.length} lessons:`);
  inserted.forEach((l, i) => {
    console.log(`   ${i + 1}. ${l.title} (${l.slug})`);
  });
}

seedLessons();
