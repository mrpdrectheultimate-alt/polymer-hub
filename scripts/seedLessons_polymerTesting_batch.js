// scripts/seedLessons_polymerTesting_batch.js
// Lessons 2-6 for Polymer Testing subject
// Run with: node scripts/seedLessons_polymerTesting_batch.js

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
    subject_slug: 'polymer-testing',
    title: 'Tensile and Flexural Testing: Measuring Mechanical Strength',
    summary: 'Learn the two foundational mechanical tests every polymer engineer must master — tensile testing for stress-strain behavior and flexural testing for bending stiffness — including standard procedures and how to read the resulting curves.',
    order_index: 2,
    is_premium: false,
    content: `## The Most Common Question in Materials Engineering

"How strong is this material?" is the question every polymer test ultimately tries to answer, and **tensile testing** is the single most common way to answer it. Nearly every material datasheet you will ever read starts with tensile strength, elongation at break, and tensile modulus — numbers that come directly from this one standardized test.

---

## Tensile Testing: Pulling a Sample Apart

A standardized dumbbell-shaped specimen (per **ASTM D638** or **IS 13360**) is clamped at both ends in a **Universal Testing Machine (UTM)** and pulled apart at a controlled, constant speed until it breaks, while the machine continuously records force and displacement.

\`\`\`
        ┌─────┐                          ┌─────┐
   ←────┤     ├──────────────────────────┤     ├────→
        └─────┘         GAUGE LENGTH      └─────┘
        (clamp)                            (clamp)
        
   Force applied outward at both ends, pulling specimen to failure
\`\`\`

### From Raw Data to the Stress-Strain Curve

The machine records force (load cell) and displacement (extensometer or crosshead movement), which are converted to engineering values:

\`\`\`
Stress (σ) = Force / Original Cross-Sectional Area    [MPa]
Strain (ε) = Change in Length / Original Length        [%, or mm/mm]
\`\`\`

Plotting stress against strain produces the **stress-strain curve** — the single most information-dense graph in materials engineering.

### Reading the Stress-Strain Curve

| Region/Point | What It Tells You |
|----------------|----------------------|
| Initial linear slope | **Tensile Modulus (Young's Modulus)** — material stiffness; steeper slope = stiffer material |
| Yield point | Stress at which the material begins permanent (plastic) deformation — beyond this point, it won't fully recover if unloaded |
| Peak of curve | **Tensile Strength** — maximum stress the material withstands |
| Final point (break) | **Elongation at Break** — how much the material stretched before fracturing; high values indicate ductile/tough behavior, low values indicate brittle behavior |

**Brittle vs ductile behavior is immediately visible on the curve:** A brittle polymer like unmodified PS shows a steep line that breaks suddenly with very little elongation (often under 5%). A ductile polymer like PP or PE shows yielding, necking, and significant elongation before break (often 100-600%+).

---

## Flexural Testing: Bending Instead of Pulling

While tensile testing pulls a sample lengthwise, **flexural testing** (per **ASTM D790**) measures resistance to bending — more representative of how many real parts (shelving, structural brackets, panels) actually experience load in service.

### The Three-Point Bend Test

A rectangular bar specimen rests on two support points, while a third point in the center applies downward force until the specimen yields or breaks (or reaches a specified strain limit for tough materials that won't break).

\`\`\`
              ↓ (load applied here, center)
        ┌─────────────────────────┐
   ─────┴                         ┴─────
   (support)                  (support)
\`\`\`

### Key Flexural Values

| Measurement | What It Represents |
|---------------|------------------------|
| Flexural Modulus | Stiffness in bending — often higher than tensile modulus due to the combined compression (top surface) and tension (bottom surface) stress state |
| Flexural Strength | Maximum stress at the outer fiber before yield or break |

**Why flexural testing matters separately from tensile testing:** A material's behavior in bending isn't always perfectly predictable from tensile data alone, especially for reinforced composites where fibre orientation affects bending and tension differently. Many product specifications require both tests, since real parts rarely experience pure tensile loading.

---

## Test Speed Matters

Polymers are **viscoelastic** — their mechanical response depends on how fast they're loaded. A standard tensile test specifies a fixed crosshead speed (commonly 50 mm/min for rigid plastics, 500 mm/min for flexible films) because testing the same material at different speeds produces different strength and elongation values.

**This is why test reports always specify test speed** — comparing tensile data from tests run at different speeds is not valid, a common mistake students make when comparing datasheet values from different suppliers without checking the test conditions match.

---

## Typical Values for Reference

| Polymer | Tensile Strength | Elongation at Break | Flexural Modulus |
|---------|----------------------|----------------------|----------------------|
| PP Homopolymer | 30-40 MPa | 100-600% | 1,200-1,700 MPa |
| HDPE | 25-35 MPa | 400-800% | 800-1,200 MPa |
| ABS | 35-50 MPa | 10-50% | 2,000-2,800 MPa |
| Polycarbonate | 55-70 MPa | 80-150% | 2,200-2,500 MPa |
| Glass-filled Nylon (30%) | 150-190 MPa | 3-5% | 7,000-9,000 MPa |

**Notice the trade-off:** Glass-filled Nylon has dramatically higher strength and stiffness but very low elongation — it's strong but brittle. Pure HDPE has much lower strength but extremely high elongation — it's weaker but extremely tough and flexible. Material selection always balances this strength-versus-toughness trade-off against the specific part's functional requirements.

---

### Indian Industry Example

**CIPET centers** across Chennai, Ahmedabad, Lucknow, and other locations run tensile and flexural testing as core curriculum and industry service work, using Universal Testing Machines from manufacturers like **Instron** and **Tinius Olsen** to certify incoming resin batches for Indian processors and validate finished product compliance with IS and ASTM standards.

**Supreme Industries'** in-house quality labs run tensile testing on every incoming batch of PP and HDPE resin before it enters production, rejecting batches that fall outside the specification tolerance band — a critical check since resin-to-resin variation can otherwise go undetected until finished parts fail in service.

Globally, **Instron** (USA) and **Twick Roell** (Germany) are the two dominant global manufacturers of Universal Testing Machines, with their equipment forming the backbone of materials testing labs worldwide, including essentially every major Indian polymer testing facility from CIPET to private compounders like **DIC India** and **Polyplastics India**.

---

## Key Takeaways

- Tensile testing pulls a standardized dumbbell specimen to failure, generating a stress-strain curve that reveals tensile modulus (stiffness), tensile strength (maximum stress), and elongation at break (ductility vs brittleness)
- Flexural testing (three-point bend test) measures bending stiffness and strength separately from tensile data, since real parts often experience bending loads and reinforced composites can behave differently in bending versus pure tension
- Test speed must always be specified and matched when comparing data, since polymers are viscoelastic and their mechanical response changes with loading rate — comparing results from tests run at different speeds produces invalid conclusions
`,
  },

  {
    subject_slug: 'polymer-testing',
    title: 'Impact Testing: Izod and Charpy Methods',
    summary: 'Understand how impact resistance — a property tensile testing cannot measure — is quantified using Izod and Charpy pendulum tests, and why this single property often determines real-world product failure.',
    order_index: 3,
    is_premium: false,
    content: `## Why Slow-Pull Tests Don't Predict Sudden Impacts

Tensile testing pulls a sample apart slowly and steadily — but real-world product failures are often **sudden**: a phone dropped on the floor, a plastic crate hitting the ground, a bumper struck in a low-speed collision. A material can have excellent tensile strength yet shatter instantly under sudden impact, because **impact resistance is a fundamentally different property** governed by how fast a material can absorb and dissipate energy, not how much static stress it can bear.

---

## The Pendulum Impact Test Principle

Both Izod and Charpy tests use the same core principle: a **calibrated pendulum** swings down from a fixed height, strikes a notched specimen, and the pendulum's remaining swing height after breaking the sample tells you how much energy the sample absorbed.

\`\`\`
BEFORE IMPACT:                    AFTER IMPACT:
    ●  (pendulum at start          
    │   height, has full              ●  (pendulum swings less far —
    │   potential energy)             │   energy was absorbed
    │                                 │   breaking the specimen)
   [specimen]                        (broken specimen)
\`\`\`

\`\`\`
Impact Energy Absorbed = Energy at Start − Energy Remaining After Break
\`\`\`

Results are reported as energy absorbed per unit of specimen cross-section — typically **J/m** (Izod) or **kJ/m²** (Charpy) — allowing comparison between specimens of slightly different size.

---

## Izod Impact Test (ASTM D256)

The specimen is held **vertically**, clamped at the bottom like a cantilever beam, with a notch facing the pendulum's swing direction. The pendulum strikes the free, unsupported top end.

\`\`\`
        ↓ pendulum swings and strikes here
       ╱│
      ╱ │
  ───┤  │← notch
     │  │
  ═══╪══╪═══  (clamped at base)
\`\`\`

**Standard specimen:** Notched bar, typically 63.5mm × 12.7mm × 3.2mm, with a precisely machined V-notch (0.25mm radius) on one face.

**Why the notch matters:** The notch creates a deliberate **stress concentration point** — without it, many tough polymers would simply bend and absorb the impact without breaking, making the test meaningless for material comparison. The notch ensures fracture initiates at a controlled, repeatable location, allowing fair comparison between different materials and grades.

---

## Charpy Impact Test (ASTM D6110 / ISO 179)

The specimen is held **horizontally**, supported at both ends like a simple beam, with the notch facing away from the pendulum strike (on the tension side). The pendulum strikes the center of the specimen.

\`\`\`
              ↓ pendulum strikes here (center)
   ───────────┴───────────
  ╱                        ╲
(support)              (support)
        notch on bottom face (tension side)
\`\`\`

**Key difference from Izod:** Charpy is a simply-supported beam configuration (like the three-point flexural test geometry), while Izod is a cantilever configuration. This geometric difference means Izod and Charpy values for the **same material are not directly comparable** — they measure related but distinct loading conditions.

---

## Notched vs Unnotched Testing

| Test Type | What It Reveals |
|-------------|----------------------|
| Notched | Material's resistance to crack propagation from a pre-existing flaw — most relevant to real parts, which almost always have some stress concentration (corners, holes, gate marks) |
| Unnotched | Material's raw energy absorption capacity without a deliberate flaw — useful for inherently brittle materials where even a notched test gives near-zero, uninformative readings |

**Practical significance:** A material's notched impact value is often dramatically lower than its unnotched value — sometimes by 10× or more — because the notch concentrates stress at a single point rather than distributing it across the full cross-section. This is exactly why product designs avoid sharp internal corners: they act as unintentional "notches" that can trigger the same dramatic strength reduction seen in notched impact testing.

---

## Temperature Dependence: The Ductile-to-Brittle Transition

Impact resistance is **highly temperature-dependent**, often far more so than tensile properties. Many polymers exhibit a **ductile-to-brittle transition temperature** — above this temperature the material absorbs impact energy through ductile deformation; below it, the same material fractures in a brittle, low-energy-absorbing manner.

**Practical example:** PP is reasonably impact-resistant at room temperature but becomes noticeably brittle in cold conditions — this is why outdoor PP products (garden furniture, storage crates) in regions with cold winters often use **impact-modified PP copolymer** grades rather than standard homopolymer, specifically to push the ductile-to-brittle transition temperature lower.

---

### Indian Industry Example

**Motherson Sumi Systems** runs extensive notched Izod testing on automotive bumper and interior trim materials, since these components must retain adequate impact resistance across India's wide climate range — from Himalayan winter cold to peak summer heat in Rajasthan — requiring materials qualified across a broad temperature window, not just at standard lab conditions.

**CIPET's** materials testing division performs both Izod and Charpy testing as standard service offerings for Indian processors, particularly important for crate, helmet, and safety equipment manufacturers where impact failure has direct safety consequences rather than just cosmetic concerns.

Globally, **Tinius Olsen** (USA) and **Zwick Roell** (Germany) manufacture the pendulum impact testers used as the global standard in materials labs, while **BASF** and **LyondellBasell** both publish extensive notched Izod data across temperature ranges for their impact-modified PP copolymer grades — data that Indian compounders reference when formulating cold-climate-rated products for both domestic and export markets.

---

## Key Takeaways

- Impact testing measures a fundamentally different property than tensile testing — energy absorption under sudden loading — using a calibrated pendulum that strikes a notched specimen, with energy absorbed calculated from the difference between starting and remaining pendulum height
- Izod (cantilever, vertical specimen) and Charpy (simply-supported, horizontal specimen) test different loading geometries and are not directly comparable to each other, even for the same material — always confirm which method was used when comparing datasheet values
- Impact resistance is highly temperature-dependent due to the ductile-to-brittle transition — many polymers used outdoors or in cold climates require impact-modified grades specifically formulated to maintain toughness at low temperatures where standard grades would become brittle
`,
  },

  {
    subject_slug: 'polymer-testing',
    title: 'Thermal Analysis: DSC, TGA, and HDT Testing',
    summary: 'Master the three core thermal characterization techniques used to understand how polymers respond to heat — Differential Scanning Calorimetry, Thermogravimetric Analysis, and Heat Deflection Temperature testing.',
    order_index: 4,
    is_premium: false,
    content: `## Why Thermal Behavior Needs Its Own Test Category

Every polymer property you've studied so far — strength, impact resistance, crystallinity — changes with temperature. Thermal analysis techniques exist specifically to map out **how and at what temperatures** these transitions happen, giving engineers the data needed to set safe processing windows and predict in-service performance limits.

---

## Differential Scanning Calorimetry (DSC)

DSC measures the **heat flow** into or out of a small polymer sample (typically 5-10mg) as it's heated or cooled at a controlled rate, comparing it against an inert reference. This reveals every thermal transition the material undergoes.

### What DSC Reveals

\`\`\`
Heat Flow
   │           ┌─── Melting peak (Tm) — endothermic, absorbs heat
   │          ╱│╲
   │_________╱ │ ╲________________
   │    ↑                          
   │   Tg (glass transition —      
   │   subtle step, not a peak)    
   └──────────────────────────────→ Temperature
\`\`\`

| Transition | What It Means | Appears As |
|-------------|-------------------|----------------|
| Glass Transition (Tg) | Amorphous regions transition from rigid/glassy to rubbery/flexible | Subtle step change in baseline, not a sharp peak |
| Melting Point (Tm) | Crystalline regions melt | Sharp endothermic peak (absorbs heat) |
| Crystallization Temperature (Tc) | Polymer crystallizes on cooling | Exothermic peak (releases heat) |
| Percent Crystallinity | Calculated from melting peak area | ΔH of sample ÷ ΔH of 100% crystalline reference × 100 |
| Curing reaction (thermosets) | Cross-linking reaction releases heat | Broad exothermic peak |

**Why DSC is the most-used thermal test in industry:** A single 10-minute test reveals Tg, Tm, percent crystallinity, and even detects contamination or incorrect material (since every polymer grade has a characteristic, repeatable thermal fingerprint) — making it the fastest, most information-dense thermal QC test available.

---

## Thermogravimetric Analysis (TGA)

TGA measures **weight loss** as a sample is heated at a controlled rate, revealing decomposition temperature, filler content, and moisture/volatile content.

### Reading a TGA Curve

\`\`\`
Weight %
  100% ┤──────╲
       │        ╲___ (moisture/volatile loss, small step)
       │            ╲
       │              ╲___________
       │                          ╲ (major decomposition)
   X%  │                            ╲________
       │                                     (residual ash/filler %)
       └────────────────────────────────────→ Temperature
\`\`\`

**Key applications:**
- **Decomposition temperature:** Identifies the maximum safe processing temperature before the polymer begins breaking down
- **Filler/reinforcement content:** For glass-filled or mineral-filled compounds, the organic polymer burns off completely while inorganic filler remains as residual weight — directly measuring actual glass or mineral content, useful for verifying a supplier's stated filler percentage
- **Moisture content:** A small early weight-loss step reveals absorbed moisture, particularly important for hygroscopic polymers like Nylon and PET that must be dried before processing

**Practical QC use:** If a supplier claims "30% glass-filled Nylon" but TGA reveals only 22% residual ash, that's a direct, objective verification that the material doesn't match its specification — a critical check before accepting incoming material for production.

---

## Heat Deflection Temperature (HDT)

While DSC and TGA characterize the material itself, **HDT (ASTM D648)** measures a more practically useful number: the temperature at which a loaded sample bends by a specified amount — essentially "how hot can this get before it sags."

### The Test Method

A rectangular bar specimen is loaded in three-point bending (similar geometry to the flexural test) under a fixed stress (typically **0.45 MPa or 1.8 MPa**), while temperature is raised at a controlled rate. The temperature at which the bar deflects by a specified amount (0.25mm) is recorded as the HDT.

\`\`\`
Fixed load applied (0.45 or 1.8 MPa) → Temperature rises steadily → 
Record temperature when deflection reaches 0.25mm
\`\`\`

**Why two different stress levels exist:** The 0.45 MPa test (lower stress) gives a higher HDT value, more relevant to lightly-loaded applications. The 1.8 MPa test (higher stress) gives a lower, more conservative HDT value, relevant to structurally loaded applications — datasheets often report both, and engineers must select the test condition matching their actual part's loading.

### HDT vs Glass Transition Temperature

HDT is closely related to but not identical to Tg (from DSC) — HDT is a practical engineering measurement under load, while Tg is a fundamental material transition measured without mechanical load. For amorphous polymers, HDT typically sits close to but slightly below Tg; for crystalline polymers, HDT can be significantly below Tm since the amorphous regions soften well before the crystalline regions melt.

---

## Comparing the Three Tests

| Test | Measures | Typical Sample Size | Primary Industrial Use |
|------|----------|------------------------|----------------------------|
| DSC | Heat flow (Tg, Tm, % crystallinity) | 5-10mg | Material identification, QC fingerprinting, crystallinity verification |
| TGA | Weight loss (decomposition, filler %, moisture) | 10-20mg | Filler content verification, processing temperature limits, moisture QC |
| HDT | Deflection under load vs temperature | Full bar specimen (~125mm) | Practical service temperature rating for product design |

---

### Indian Industry Example

**CIPET's** materials characterization labs run DSC and TGA testing as standard incoming-material verification for Indian compounders and processors, particularly valuable for catching off-spec or substituted material before it enters production — a service heavily used by smaller processors who lack in-house thermal analysis equipment.

**DIC India** and **Polyplastics India**, both major engineering compound suppliers, rely on TGA to verify glass fibre content in every batch of reinforced Nylon and PBT compounds shipped to automotive and electrical customers, since filler content directly determines the mechanical properties customers depend on.

Globally, **TA Instruments** (USA) and **Netzsch** (Germany) are the leading global manufacturers of DSC and TGA equipment, with their instruments forming the analytical backbone of polymer R&D labs worldwide, including BASF's and SABIC's central research facilities — the same underlying technology now standard in CIPET's testing infrastructure across India.

---

## Key Takeaways

- DSC measures heat flow to reveal glass transition, melting point, and percent crystallinity in a single fast test, making it the most widely used thermal QC and material identification technique in industry
- TGA measures weight loss with temperature, directly verifying filler/glass content (organic polymer burns off, inorganic filler remains) and moisture content — an essential check for confirming a supplier's stated material composition
- HDT measures the practical "how hot before it sags" temperature under a specified mechanical load, distinct from but related to Tg — always check which stress level (0.45 or 1.8 MPa) was used when comparing HDT values between materials or suppliers
`,
  },

  {
    subject_slug: 'polymer-testing',
    title: 'Hardness Testing: Shore A and Shore D Durometers',
    summary: 'Learn how hardness testing quantifies a material\'s resistance to indentation, the difference between Shore A and Shore D scales, and why hardness is one of the fastest, most accessible quality control tests in the polymer industry.',
    order_index: 5,
    is_premium: false,
    content: `## The Fastest Test in the Polymer Lab

While tensile testing requires a Universal Testing Machine, standardized specimens, and several minutes per test, **hardness testing** can be performed in seconds with a simple handheld instrument directly on a finished part — making it one of the most practical, widely used quality control tests across the entire plastics and rubber industry.

---

## What Hardness Actually Measures

Hardness testing measures a material's **resistance to localized indentation** — how much a small, spring-loaded indenter penetrates into the material's surface under a standardized force. Unlike tensile testing (which measures bulk material behavior under uniform stress), hardness is fundamentally a **surface property test**.

\`\`\`
INDENTER (spring-loaded) → pressed into material surface →
Depth of penetration measured → Converted to hardness scale reading
\`\`\`

**Softer material → indenter penetrates deeper → lower hardness reading**
**Harder material → indenter penetrates less → higher hardness reading**

---

## Shore Durometer Scales: Why Two Scales Exist

The **Shore Durometer** test (ASTM D2240 / IS 3400) uses spring-loaded indenters, but different indenter geometries and spring forces are needed to meaningfully measure the vast hardness range across rubber, soft plastics, and rigid plastics.

### Shore A Scale

Used for **soft, flexible materials** — rubber, soft TPE/TPU, flexible PVC.

- Indenter: Blunt, truncated cone
- Spring force: Lower (822 grams typical)
- Scale range: 0 (very soft) to 100 (firm)

| Shore A Value | Typical Material |
|------------------|----------------------|
| 20-40 A | Soft rubber bands, gel-like materials |
| 50-70 A | Shoe soles, rubber seals, soft TPE grips |
| 80-95 A | Skateboard wheels, hard rubber tyres, firm gaskets |

### Shore D Scale

Used for **harder, more rigid materials** — rigid plastics, hard rubber, engineering polymers.

- Indenter: Sharper, more pointed cone
- Spring force: Higher (4,536 grams typical)
- Scale range: 0 (relatively soft) to 100 (very hard/rigid)

| Shore D Value | Typical Material |
|------------------|----------------------|
| 40-50 D | Semi-rigid PVC, soft engineering plastics |
| 65-75 D | HDPE, PP |
| 80-90 D | Rigid PVC, Nylon, hard engineering plastics |

**Why two scales matter:** A material reading 95 on the Shore A scale (very firm rubber) might read only 40-45 on the Shore D scale — the scales aren't directly convertible because they use different indenter geometries and forces designed for different hardness ranges. Always check which scale (A or D) a hardness value refers to before making comparisons.

---

## The Shore Test Procedure

1. Sample must meet **minimum thickness** (typically 6mm, or stacked layers to reach minimum thickness) — testing thin samples gives falsely high readings since the indenter "feels" the harder surface underneath
2. Durometer is pressed firmly and quickly against the flat sample surface, perpendicular to it
3. Reading is taken **immediately upon contact** for rigid materials, or after a specified delay (typically 15 seconds) for materials showing viscoelastic creep (the reading drops slightly over time as the material relaxes under the indenter)

**Why immediate vs delayed reading matters:** Many polymers, especially softer ones, show **stress relaxation** — the hardness reading taken immediately on contact is higher than the reading taken after 15 seconds, because the material slowly continues to deform under the sustained indenter load. Standards specify which timing to use and report, since comparing an instant reading to a delayed reading from a different test gives misleading results.

---

## Hardness vs Other Mechanical Properties

Hardness correlates loosely with tensile strength and modulus but is **not a direct substitute** for proper mechanical testing — it's a fast screening tool, not a complete material characterization.

| What Hardness Tells You | What Hardness Does NOT Tell You |
|------------------------------|--------------------------------------|
| Relative surface stiffness/firmness | Tensile strength or elongation |
| Quick batch-to-batch consistency check | Impact resistance |
| Approximate material family identification | Long-term creep or fatigue behavior |
| Surface wear resistance indication | Internal/bulk material properties |

**This is why hardness is primarily used as a quick QC screening tool** rather than a primary design specification — a processor might check hardness on every batch as a fast consistency verification, while relying on full tensile/flexural/impact data from periodic comprehensive testing for actual design and specification purposes.

---

### Indian Industry Example

**MRF Limited** and other Indian tyre manufacturers use Shore A hardness testing extensively as an in-process quality check during rubber compounding and vulcanization — hardness directly correlates with cure state and crosslink density (covered in your rubber technology vulcanization lesson), making it a fast indicator of whether a batch has been properly cured before more extensive mechanical testing is performed.

**Sheela Foam** (manufacturer of Sleepwell mattresses and foam products) relies on Shore hardness testing throughout their foam production for both quality control and product grading, since hardness is one of the primary specifications customers use to select mattress firmness.

Globally, **Zwick Roell** and **PTC Instruments** (USA) manufacture widely used Shore durometers found in materials labs worldwide, while the **Shore Instrument Company** (the original inventor of the Shore scale, now part of **Instron**) remains the historical namesake and standard-setter for this test method used identically from CIPET labs in India to rubber compounders in Germany and tyre manufacturers in the United States.

---

## Key Takeaways

- Shore hardness testing measures resistance to indentation using a spring-loaded indenter, with Shore A used for soft/flexible materials (rubber, soft TPE) and Shore D used for harder rigid materials (engineering plastics, rigid PVC) — the two scales are not directly convertible
- Sample thickness (minimum 6mm) and reading timing (immediate vs delayed for viscoelastic materials) must follow standard procedure, since thin samples or inconsistent timing produce misleading, non-comparable results
- Hardness is a fast, practical screening tool correlating loosely with stiffness and material family, but it does not replace proper tensile, flexural, or impact testing for actual design specifications — it's best used for quick batch-to-batch consistency verification in production
`,
  },

  {
    subject_slug: 'polymer-testing',
    title: 'Rheological Testing: Understanding Melt Flow Behavior',
    summary: 'Go beyond basic MFI testing to understand rotational and capillary rheometry — the advanced techniques used to characterize how polymer melts behave across the full range of shear rates encountered in real processing.',
    order_index: 6,
    is_premium: false,
    content: `## Why MFI Alone Isn't Enough

You've already learned that Melt Flow Index gives a single flow-rate number at one specific shear rate and temperature. But real processing — injection moulding, extrusion, blow moulding — subjects the melt to **wildly different shear rates** across different parts of the process, from slow flow in a large runner to extremely fast flow through a narrow gate. **Rheological testing** characterizes flow behavior across this entire range, giving processors and die designers the complete picture MFI alone cannot provide.

---

## Why Polymer Melts Don't Behave Like Water

Water is a **Newtonian fluid** — its viscosity stays constant regardless of how fast you stir or push it. Polymer melts are **non-Newtonian, shear-thinning fluids** — their apparent viscosity **decreases** as shear rate increases, because polymer chains progressively align and disentangle under faster flow, allowing them to slide past each other more easily.

\`\`\`
Apparent Viscosity
    │╲
    │ ╲
    │  ╲___
    │      ╲______
    │             ╲__________
    └──────────────────────────→ Shear Rate
    (Low shear: high viscosity — chains tangled)
    (High shear: low viscosity — chains aligned, slide easily)
\`\`\`

**This is precisely why a single MFI value (one shear rate point) cannot predict behavior across an entire process** — a material's relative ranking against another material can even reverse between low-shear and high-shear conditions, which is why rheological characterization across a range of shear rates is essential for serious process and die design work.

---

## Capillary Rheometry

The most common method for characterizing melt flow across a wide, processing-relevant shear rate range (roughly 10 to 10,000 s⁻¹, covering everything from slow compression moulding flow to fast injection moulding gate flow).

### How It Works

Molten polymer is forced through a precision capillary die (known length and diameter) at a series of controlled flow rates, while pressure is measured at each rate. From pressure and flow rate at each test point, **shear stress and shear rate are calculated**, building up a complete flow curve across the tested range.

\`\`\`
HEATED BARREL → PISTON pushes melt at controlled speed →
CAPILLARY DIE (precise L/D) → Pressure measured → 
Repeat at multiple speeds → Build complete viscosity vs shear rate curve
\`\`\`

**Why this matters for die design:** As covered in the extrusion die design lesson, die designers need to know how viscosity changes across the shear rates their specific die geometry will produce — capillary rheometry provides exactly this data, allowing accurate prediction of pressure drop and flow balance before cutting expensive die steel.

---

## Rotational (Oscillatory) Rheometry

While capillary rheometry excels at high shear rates relevant to processing, **rotational rheometry** characterizes melt behavior at very low shear rates and, critically, in **oscillatory (dynamic) mode** — revealing viscoelastic properties that capillary testing cannot capture.

### Parallel Plate / Cone-and-Plate Configuration

A small sample is sandwiched between two plates (or a cone and plate), and the upper plate either rotates continuously (steady shear) or oscillates back and forth at controlled frequency (dynamic/oscillatory mode).

### What Oscillatory Testing Reveals

| Measurement | What It Represents |
|---------------|------------------------|
| Storage Modulus (G') | The "elastic" component — energy stored and recovered, like a spring |
| Loss Modulus (G'') | The "viscous" component — energy dissipated as heat, like a damper |
| Complex Viscosity (η*) | Overall resistance to oscillatory deformation |
| Tan Delta (G''/G') | Ratio indicating whether material behaves more like a solid (low tan delta) or liquid (high tan delta) at the test frequency |

**Why this matters:** Polymer melts are **viscoelastic** — they have both liquid-like (viscous) and solid-like (elastic) character simultaneously. This elastic component is responsible for phenomena like die swell (covered in your die design lesson) — the melt's elastic "memory" of being compressed in the die causes it to spring back and expand after exiting. Oscillatory rheometry directly quantifies this elastic behavior, which simple capillary or MFI testing cannot capture at all.

---

## Practical Industrial Applications

| Application | Which Test Is Used |
|----------------|------------------------|
| Quick incoming batch QC | MFI (fast, simple, single point) |
| Die design and flow simulation input | Capillary rheometry (full shear rate range) |
| Predicting die swell behavior | Oscillatory rheometry (elastic component) |
| Quality control for consistent processability | MFI for routine checks; full rheology for troubleshooting unusual processing issues |
| New material/grade development | Full rheological characterization (both capillary and oscillatory) |

**In practice, MFI remains the everyday QC workhorse** due to its speed and simplicity, while full rheological characterization is reserved for die design, troubleshooting, and material development work where the additional data justifies the significantly higher test time and equipment cost.

---

### Indian Industry Example

**Reliance Industries'** polymer R&D centre uses both capillary and oscillatory rheometry extensively when developing new resin grades, characterizing how each new catalyst system or formulation change affects flow behavior across the shear rate range relevant to their customers' specific processing methods — critical since a grade optimized for film blowing needs very different rheological behavior than one optimized for injection moulding.

**Kabra Extrusiontechnik** uses customer-supplied rheological data when designing custom dies for new extrusion lines, since accurate flow simulation (referenced in your die design lesson) depends entirely on having accurate viscosity-versus-shear-rate data for the specific resin grade the customer plans to run.

Globally, **Anton Paar** (Austria) and **TA Instruments** (USA) are the leading manufacturers of rotational rheometers used in polymer R&D labs worldwide, while **Göttfert** (Germany) is a recognized global leader in capillary rheometry equipment — instruments found in both major global polymer producer R&D centres (BASF, Dow, SABIC) and increasingly in India's growing private polymer R&D facilities as the industry matures beyond basic MFI-only characterization.

---

## Key Takeaways

- Polymer melts are non-Newtonian, shear-thinning fluids whose apparent viscosity decreases as shear rate increases — a single MFI measurement at one shear rate cannot predict behavior across the full range of shear rates encountered in real processing
- Capillary rheometry characterizes flow behavior across the high shear rate range relevant to actual processing (injection moulding, extrusion), providing the viscosity-versus-shear-rate data essential for accurate die design and flow simulation
- Oscillatory (rotational) rheometry reveals the viscoelastic character of polymer melts — separating elastic (storage modulus) from viscous (loss modulus) behavior — explaining phenomena like die swell that simple flow-rate tests like MFI cannot capture or predict
`,
  },
];

async function seedLessons() {
  console.log('🚀 PolymerHub — Seeding Polymer Testing lessons 2-6...\n');

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

  console.log('✅ Polymer Testing lessons 2-6 seeded successfully!\n');
  data.forEach((l, i) => console.log(`   ${i + 1}. ${l.title}`));
  console.log(`\n🎉 Done! ${data.length} lessons added.\n`);
}

seedLessons();
