// scripts/seedLessons_polymerProcessing_batch.js
// Lessons 2-6 for Polymer Processing subject
// Run with: node scripts/seedLessons_polymerProcessing_batch.js

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
    subject_slug: 'polymer-processing',
    title: 'Extrusion: Process, Screw Design, and Die Types',
    summary: 'Master extrusion — the continuous process behind pipes, films, sheets, and profiles — covering screw zones, L/D ratio, and the major die configurations used across Indian industry.',
    order_index: 2,
    is_premium: false,
    content: `## What is Extrusion?

**Extrusion** is a continuous manufacturing process where plastic granules are melted and forced through a shaped die to produce a constant cross-section product — pipes, sheets, films, profiles, and cable insulation.

Unlike injection moulding (which produces individual discrete parts), extrusion runs **continuously**, often 24/7, producing kilometres of product that are cut to length downstream.

**Typical products:** PVC and HDPE pipes, plastic sheets, blown film for bags, window profiles, wire and cable insulation, drinking straws, weatherstripping.

---

## The Single-Screw Extruder

The heart of extrusion is the **single-screw extruder** — a rotating screw inside a heated barrel that melts and conveys the polymer forward.

### The Three Screw Zones

\`\`\`
HOPPER → [FEED ZONE] → [COMPRESSION ZONE] → [METERING ZONE] → DIE
          (solid conveying)  (melting begins)    (uniform melt)
\`\`\`

1. **Feed Zone:** Deep flight channels convey solid granules forward; barrel is moderately heated
2. **Compression Zone:** Flight depth gradually decreases, compressing and melting the polymer through shear heating and barrel heat
3. **Metering Zone:** Shallow, constant-depth channels deliver a uniform, well-mixed melt at consistent pressure to the die

### Key Screw Parameters

| Parameter | Typical Range | Significance |
|-----------|---------------|----------------|
| L/D Ratio (Length/Diameter) | 20:1 to 30:1 | Higher ratio = better mixing, more melting capacity |
| Compression Ratio | 2:1 to 4:1 | Feed depth ÷ metering depth; higher for amorphous polymers |
| Screw speed | 20–150 rpm | Controls output rate and shear heating |
| Barrel temperature zones | 4–6 zones | Each independently controlled, profiled from low (feed) to processing temp (metering) |

**Compression ratio selection depends on polymer type:** Crystalline polymers like HDPE (low melt viscosity change) typically use lower compression ratios (2:1–2.5:1), while amorphous polymers like PVC may use higher ratios (3:1–4:1) for better mixing and gradual melting.

---

## Die Types and Their Products

The die shapes the molten polymer into its final continuous profile as it exits the extruder.

### 1. Pipe/Tube Die (Annular Die)
Melt flows around a central mandrel, forming a tube. A **vacuum sizing tank** immediately downstream pulls the hot tube against a sizing sleeve to set the exact diameter while cooling in a water bath.

\`\`\`
EXTRUDER → ANNULAR DIE → VACUUM SIZING TANK → COOLING BATH → HAUL-OFF → CUTTER
\`\`\`

### 2. Flat Sheet Die (T-Die / Coat-Hanger Die)
A wide, flat die distributes melt evenly across its width using an internal "coat-hanger" shaped flow channel — critical for uniform sheet thickness. Sheet passes through **chill rolls** (polished, water-cooled rollers) for cooling and surface finish.

### 3. Blown Film Die (Annular Die + Air Ring)
Similar to pipe dies but the tube is inflated with air into a "bubble" 2–6× the die diameter, then flattened by nip rollers and wound onto rolls. This is how virtually all plastic carry bags and packaging film are made.

### 4. Profile Die
Custom-shaped dies for complex cross-sections — window frames, weatherstripping, edge trim — requiring careful flow balancing since different wall thicknesses within one profile want to flow at different rates.

---

## Critical Process Parameters

| Parameter | Effect |
|-----------|--------|
| Melt temperature | Too low → poor mixing, surging; too high → degradation, sag |
| Screw speed (RPM) | Controls output and residence time; too fast → poor melting |
| Die temperature | Affects melt flow and surface finish |
| Take-off (haul-off) speed | Must match output rate — controls wall thickness/diameter via draw-down |
| Cooling rate | Affects crystallinity, dimensional stability, internal stress |

**Draw-down ratio** is a key concept: the ratio between die opening size and final product size. Higher draw-down (faster haul-off relative to extrusion rate) gives thinner walls but can cause orientation effects and dimensional instability.

---

## Common Extrusion Defects

| Defect | Cause | Fix |
|--------|-------|-----|
| Surging (pulsing output) | Inconsistent feeding, worn screw, poor temperature control | Stabilize feed, check screw wear |
| Melt fracture (sharkskin) | Excessive shear rate at die exit | Reduce output rate, increase die temperature, polish die land |
| Die lines | Die damage or polymer degradation buildup | Clean/polish die, check for hang-up areas |
| Out-of-round pipe | Uneven cooling or sizing sleeve issues | Check vacuum sizing tank uniformity |
| Voids/bubbles | Moisture in resin, trapped air | Pre-dry resin, check vent design |

---

### Indian Industry Example

**Astral Limited** operates large-diameter HDPE pipe extrusion lines (up to 1200mm diameter) across their Gujarat and Tamil Nadu plants, using twin-screw extruders with vacuum sizing tanks calibrated to IS 4984 dimensional tolerances for municipal water supply projects.

**Jindal Poly Films** (Nashik) runs some of India's largest blown film lines, producing BOPP (biaxially oriented polypropylene) packaging film exported globally — their extrusion technology licensed originally from German and Austrian die manufacturers, now operated at massive scale for FMCG packaging.

Globally, **Krauss Maffei** (Germany) and **Davis-Standard** (USA) are the benchmark extrusion machinery manufacturers whose screw and die designs Indian machine builders like **Kabra Extrusiontechnik** (Mumbai) — one of India's largest extrusion machinery exporters — have adapted and improved for tropical, high-throughput Indian operating conditions.

---

## Key Takeaways

- Extrusion is a continuous process using a rotating screw with three zones (feed, compression, metering) to melt and convey polymer through a shaped die — unlike injection moulding's discrete cycle
- Die selection determines the product: annular dies make pipes and blown film, flat dies make sheet, profile dies make custom cross-sections like window frames
- Draw-down ratio (die size vs final product size via haul-off speed) is the primary control for wall thickness, and most defects (surging, melt fracture, die lines) trace back to inconsistent screw feeding or excessive shear at the die exit
`,
  },

  {
    subject_slug: 'polymer-processing',
    title: 'Blow Moulding: Extrusion and Injection Blow Processes',
    summary: 'Learn how hollow plastic containers — bottles, tanks, jerrycans — are manufactured through blow moulding, covering both extrusion blow moulding and injection stretch blow moulding (ISBM) used for PET bottles.',
    order_index: 3,
    is_premium: false,
    content: `## Making Hollow Parts

Injection moulding excels at solid and complex-geometry parts, but it cannot efficiently produce **hollow containers** like bottles and tanks. **Blow moulding** solves this — using air pressure to inflate a softened plastic tube or preform against a mould cavity wall, exactly like blowing up a balloon inside a bottle-shaped mould.

**Typical products:** Water bottles, shampoo bottles, milk jugs, fuel tanks, drums, jerrycans, toys.

---

## Extrusion Blow Moulding (EBM)

The most common process for HDPE bottles, jerrycans, and large containers.

### The Process

\`\`\`
1. EXTRUDE PARISON  → Extruder pushes out a hollow tube (parison) vertically
2. CLOSE MOULD       → Two mould halves close around the parison, pinching the bottom
3. INFLATE           → Compressed air (4-10 bar) blows the parison against mould walls
4. COOL              → Part cools against the cold mould wall
5. EJECT & TRIM       → Mould opens, part ejected, flash trimmed from pinch points
\`\`\`

**Parison control is critical:** As the parison hangs and extrudes, gravity causes it to thin near the top — a **programmable parison wall thickness controller** (using a moving die pin) compensates by varying wall thickness along the parison length, ensuring uniform final wall thickness despite the container's varying diameter (e.g., a bottle's narrow neck vs wide body).

### Key Parameters

| Parameter | Effect |
|-----------|--------|
| Parison swell | Extruded parison diameter expands beyond die size — must be accounted for in die sizing |
| Blow pressure | 4–10 bar typical; too low = poor mould detail; too high = blow-out at thin spots |
| Mould temperature | 10–20°C typical (cold) for fast cycle; controls surface finish and cooling rate |
| Pinch-off design | Mould geometry that seals parison bottom/top; affects flash and weld strength |

---

## Injection Stretch Blow Moulding (ISBM)

The dominant process for **PET bottles** — water bottles, carbonated soft drink bottles — requiring high clarity and biaxial strength that EBM cannot achieve with PET.

### The Two-Stage Process

**Stage 1 — Injection Mould the Preform:**
A thick-walled, test-tube-shaped "preform" with the finished bottle neck/thread already formed is injection moulded — looks like a small test tube with a cap thread.

**Stage 2 — Stretch Blow Mould the Bottle:**
The preform is reheated to just above its glass transition (Tg ~80°C for PET, kept below melt point) and:
1. A **stretch rod** mechanically pulls the preform lengthwise (axial orientation)
2. Simultaneously, high-pressure air (25–40 bar) blows it outward against the mould (hoop/radial orientation)

\`\`\`
PREFORM → REHEAT → STRETCH ROD (axial) + AIR BLOW (radial) = BIAXIAL ORIENTATION
\`\`\`

**Why biaxial stretching matters:** This simultaneous two-direction stretching aligns PET's polymer chains in both directions, dramatically increasing **clarity, barrier properties (less gas permeation — crucial for carbonated drinks), and burst strength** compared to unstretched PET. An unstretched PET bottle would be cloudy, weak, and let CO2 escape quickly.

### One-Stage vs Two-Stage ISBM

| Type | Process | Use Case |
|------|---------|----------|
| Two-stage | Preforms moulded separately (often by a different company), reheated and blown later | High volume, centralized preform supply, exports |
| One-stage | Preform injection moulded and immediately blown in the same machine cycle | Lower volume, specialty bottle shapes, no preform storage/transport needed |

---

## EBM vs ISBM Comparison

| Factor | Extrusion Blow Moulding | Injection Stretch Blow Moulding |
|--------|--------------------------|-----------------------------------|
| Typical material | HDPE, PP | PET, occasionally PP |
| Wall thickness control | Moderate (parison programming) | Excellent (preform design) |
| Clarity | Poor to moderate | Excellent (PET bottles) |
| Neck precision | Lower | Very high (threaded closures) |
| Typical products | Jerrycans, bottles, tanks, drums | Beverage bottles, cosmetic bottles |
| Cycle complexity | Lower, single stage | Higher, often two stages |

---

### Indian Industry Example

**Manjushree Technopack** (Bengaluru) — India's largest PET preform and packaging manufacturer — supplies Coca-Cola India, PepsiCo India, and Bisleri with billions of preforms annually, running two-stage ISBM with reheat-stretch-blow technology across multiple manufacturing locations.

**Sintex Industries** (Kalol, Gujarat) is a leading Indian extrusion blow moulding company producing large HDPE water storage tanks and overhead tanks using single-piece blow moulding — eliminating weld seams found in rotomoulded alternatives.

Globally, **Sidel** (France) and **Krones** (Germany) are the benchmark ISBM machinery manufacturers whose stretch-blow technology underpins most large PET bottling lines worldwide, including those operated by Coca-Cola and Bisleri bottlers in India, while **Bekum** (Germany) remains a leading global EBM machine supplier whose technology Indian machine builders have adapted for HDPE container production at competitive cost.

---

## Key Takeaways

- Extrusion blow moulding extrudes a hollow parison, then inflates it against a mould — used for HDPE containers like bottles, jerrycans, and tanks; parison wall thickness programming compensates for gravity-induced thinning
- Injection stretch blow moulding (ISBM) injection moulds a preform first, then simultaneously stretches (axially) and blows (radially) it to achieve biaxial orientation — essential for PET bottle clarity, strength, and gas barrier properties
- Material and product requirements dictate process choice: PET beverage bottles always use ISBM for clarity and CO2 retention, while HDPE containers use the simpler, single-stage EBM process
`,
  },

  {
    subject_slug: 'polymer-processing',
    title: 'Thermoforming: Vacuum, Pressure, and Twin-Sheet Processes',
    summary: 'Understand thermoforming — shaping heated plastic sheet over a mould using vacuum or pressure — the process behind packaging trays, disposable cups, and large automotive and refrigerator components.',
    order_index: 4,
    is_premium: false,
    content: `## Shaping Sheet Instead of Melt

Thermoforming starts where extrusion ends: a flat plastic **sheet** (already extruded) is reheated to a formable softness — well below full melt — and shaped over or into a mould using vacuum, air pressure, or mechanical force.

**Key distinction from injection moulding:** Thermoforming doesn't melt the polymer into a flowable liquid; it softens the sheet just enough to stretch and conform to a mould shape, then cools and trims. This makes tooling dramatically cheaper than injection moulds, ideal for large parts or lower production volumes.

**Typical products:** Disposable cups and food trays, blister packaging, refrigerator door liners, automotive interior trim, large equipment housings, bathtubs.

---

## The Thermoforming Process

\`\`\`
1. CLAMP SHEET    → Plastic sheet clamped in a frame
2. HEAT           → Radiant heaters soften sheet to forming temperature
3. FORM           → Vacuum/pressure/mechanical force shapes sheet over/into mould
4. COOL           → Part cools against mould (often with cooling air assist)
5. TRIM           → Excess sheet (skeleton) trimmed away from finished part
\`\`\`

**Forming temperature** is critical — typically the polymer's rubbery plateau, well above Tg (for amorphous polymers like PS, ABS, PVC) or just below Tm (for crystalline polymers like PP, HDPE). Too cool: poor detail and tearing. Too hot: sagging, thinning, or melting through.

---

## Vacuum Forming

The simplest and most common method — a vacuum pulls the heated sheet down against a single-sided mould.

### Variants

**Straight Vacuum Forming:** Sheet draped over a male mould, vacuum pulls it down — simplest, but causes uneven wall thickness (areas furthest from the sheet's original position stretch and thin the most).

**Drape Forming:** Sheet draped over mould before vacuum applied, pre-stretching the sheet for more even thickness distribution — common for deeper parts.

**Plug-Assist Forming:** A mechanical plug pushes into the softened sheet before vacuum is applied, pre-stretching material into the deepest part of the cavity, dramatically improving wall thickness uniformity — standard for packaging trays and cups.

\`\`\`
WITHOUT PLUG ASSIST:           WITH PLUG ASSIST:
Thin corners/bottom              Plug pre-stretches material
   ╲___________╱                    ╲___▼___╱
    (uneven wall)                  (even wall thickness)
\`\`\`

---

## Pressure Forming

Similar to vacuum forming, but **positive air pressure (2–7 bar) pushes from above** in addition to vacuum pulling from below — giving much sharper detail, finer texture reproduction, and the ability to form deeper, more complex geometries.

**Used for:** High-detail parts needing crisp logos, textures, or sharp corners — appliance housings, medical device enclosures, premium packaging.

---

## Twin-Sheet Thermoforming

Two heated sheets are formed simultaneously in **two opposing mould halves**, then **fused together at the parting line** while still hot, creating a hollow, double-walled part in one operation — similar in concept to blow moulding but using flat sheet instead of an extruded tube.

**Advantages:**
- Creates hollow, rib-reinforced structures without the weld-line weaknesses of welding two separately formed halves
- Can combine two different sheet materials/colors (inside vs outside surface)
- Excellent for large, lightweight, structural parts

**Used for:** Pallets, industrial containers, vehicle body panels, playground equipment, kayaks.

---

## Thermoforming vs Injection Moulding: Tooling Cost

| Factor | Thermoforming | Injection Moulding |
|--------|----------------|----------------------|
| Tooling cost | Low (single-sided aluminum mould) | High (precision steel mould, both halves) |
| Tooling lead time | Days to weeks | Weeks to months |
| Best for volume | Low to medium | Medium to very high |
| Wall thickness control | Moderate (varies with draw depth) | Excellent (consistent) |
| Part size capability | Excellent for very large parts | Limited by machine clamping force |
| Material waste (skeleton) | Higher (trim waste) | Minimal (only runners/sprues) |

**This is why thermoforming dominates packaging (high variety, frequent design changes, lower per-tool investment) while injection moulding dominates high-volume precision parts.**

---

### Indian Industry Example

**Huhtamaki India** (formerly Paper Products Limited) operates extensive thermoforming lines for food packaging trays and cups across multiple Indian facilities, supplying QSR chains and FMCG companies with PP and PS-based disposable packaging.

**Wim Plast** (Gujarat) uses twin-sheet thermoforming for large industrial containers and material handling pallets, competing directly with rotational moulding for similar hollow, large-format products.

Globally, **Illig** (Germany) and **GN Thermoforming Equipment** (Canada) are leading thermoforming machinery manufacturers whose plug-assist and pressure-forming technology Indian packaging companies like Huhtamaki and Uflex license and operate, while **Placon** (USA) pioneered much of the high-clarity PET thermoforming technology now standard for premium food packaging trays exported globally from India.

---

## Key Takeaways

- Thermoforming softens (not melts) a pre-extruded sheet and shapes it via vacuum, pressure, or mechanical force over a single-sided mould — tooling is far cheaper than injection moulding, making it ideal for large parts or lower volumes
- Plug-assist forming pre-stretches the sheet with a mechanical plug before vacuum is applied, solving the uneven wall thickness problem of simple vacuum forming, especially for deep-draw parts like cups and trays
- Twin-sheet thermoforming fuses two simultaneously formed sheets into one hollow part — ideal for large, lightweight structural products like pallets and panels — while pressure forming adds positive air pressure for sharper surface detail than vacuum alone
`,
  },

  {
    subject_slug: 'polymer-processing',
    title: 'Compression and Transfer Moulding for Thermosets',
    summary: 'Learn the two primary processes for moulding thermoset materials — compression moulding and transfer moulding — and why these differ fundamentally from thermoplastic processing.',
    order_index: 5,
    is_premium: false,
    content: `## Processing Materials That Cure, Not Melt

Thermosets cannot be injection moulded the way thermoplastics are — they don't simply melt and flow; they undergo an **irreversible curing reaction** during moulding. This requires different processing approaches: **compression moulding** and **transfer moulding** — both built around the cure-while-shaped principle.

**Typical products:** Electrical switchgear, circuit breaker housings, cookware handles, automotive brake components, composite panels, rubber seals.

---

## Compression Moulding

The oldest and simplest thermoset process — a pre-measured charge of material is placed directly into an open, heated mould cavity, which then closes under pressure, curing the material in place.

### The Process

\`\`\`
1. CHARGE LOADING  → Pre-weighed material (powder, pellet, or preform) placed in open mould
2. MOULD CLOSES    → Heated platens (140-200°C) close under high pressure (50-300 bar)
3. CURE             → Heat + pressure trigger cross-linking reaction (minutes, depending on thickness)
4. MOULD OPENS      → Part ejected, fully cured — no further shaping possible
\`\`\`

### Material Forms Used

| Form | Description | Use Case |
|------|-------------|----------|
| Powder/granule | Phenolic or melamine moulding compound | Electrical components, kitchenware |
| Preform (pre-compacted tablet) | Pre-shaped charge for more accurate dosing | High-precision parts |
| Sheet Moulding Compound (SMC) | Glass-fibre reinforced thermoset sheet | Automotive body panels, large composite parts |
| Bulk Moulding Compound (BMC) | Glass-fibre reinforced thermoset bulk material | Electrical housings, structural components |

**Cure time depends heavily on part thickness** — heat must penetrate to the core for the reaction to complete throughout. A thick part can require several minutes per millimeter of thickness, making compression moulding inherently slower-cycling than thermoplastic injection moulding.

---

## Transfer Moulding

A refinement of compression moulding — material is first loaded into a separate heated **transfer pot**, then forced through a sprue and runner system into a closed mould cavity using a plunger.

### The Process

\`\`\`
1. CHARGE IN POT    → Material loaded into heated transfer pot (separate from cavity)
2. PLUNGER PUSHES   → Plunger forces softened material through sprue/runners into closed cavity
3. CURE IN CAVITY    → Material cures while pressure is maintained
4. EJECT            → Part ejected; runner system trimmed separately
\`\`\`

### Why Transfer Moulding Improves on Compression Moulding

| Advantage | Reason |
|-----------|--------|
| Better dimensional accuracy | Mould stays fully closed during fill — no flash from charge placement variability |
| Encapsulation capability | Can mould around delicate inserts (electrical components, wires) without damage |
| More uniform cure | Material is pre-heated in the pot before entering cavity |
| Smoother surface finish | Cavity remains closed and pressurized throughout |

**Trade-off:** Transfer moulding generates more material waste (the sprue/runner system cures too and must be discarded — it cannot be reground and reused like thermoplastic runners) and has higher tooling complexity than simple compression moulding.

---

## Compression vs Transfer Moulding

| Factor | Compression Moulding | Transfer Moulding |
|--------|------------------------|----------------------|
| Charge placement | Directly in open cavity | In separate pot, transferred via plunger |
| Dimensional accuracy | Moderate | High |
| Insert/encapsulation capability | Limited | Excellent |
| Material waste | Lower | Higher (cured runner system) |
| Tooling cost | Lower | Higher |
| Typical part complexity | Simple to moderate | Moderate to complex, especially with inserts |

---

## Why Not Just Inject Mould Thermosets?

A specialized variant called **thermoset injection moulding** does exist (common for rubber via Liquid Injection Moulding, and some BMC applications), but it requires fundamentally different machine design:

- The barrel must stay **cool** (to prevent premature curing) while the mould stays **hot** (to trigger curing) — the reverse of thermoplastic injection moulding, where the barrel is hot and the mould is comparatively cool
- Screw and barrel materials must resist the abrasive glass-fibre reinforcement common in thermoset compounds
- Cycle times remain longer than thermoplastics due to cure kinetics, regardless of injection speed

This specialized requirement is why compression and transfer moulding remain the dominant, simpler-to-tool processes for most thermoset production, especially in India's small-to-mid-scale manufacturing sector.

---

### Indian Industry Example

**Bakelite Hylam Limited** (Hyderabad) uses compression moulding extensively for phenolic electrical components — switchgear parts, insulators, and industrial mouldings — where the simplicity and lower tooling cost of compression moulding suits their high-mix, moderate-volume production.

**Schneider Electric India** and **Havells India** rely on transfer moulding for circuit breaker components that encapsulate metal contacts and wiring — the insert-moulding capability of transfer moulding is essential since these conductive elements cannot be damaged during the moulding process.

Globally, **Hexion** and **Sumitomo Bakelite** (Japan) are major suppliers of phenolic and epoxy moulding compounds used worldwide in compression and transfer moulding, with Sumitomo Bakelite's encapsulation compounds being an industry benchmark for semiconductor packaging — a precision transfer moulding application now also growing in India's expanding electronics manufacturing sector.

---

## Key Takeaways

- Compression moulding places a pre-measured charge directly in an open heated mould, which then closes and cures it under heat and pressure — simple, low tooling cost, but limited dimensional accuracy and no insert capability
- Transfer moulding pushes material from a separate heated pot through runners into a closed cavity via a plunger, giving better accuracy and the ability to encapsulate inserts like electrical components — at the cost of more waste and higher tooling complexity
- Thermoset processing fundamentally differs from thermoplastic injection moulding because the material must cure (irreversible chemical reaction), not just cool from a melt — requiring specialized hot-mould, cool-barrel machine configurations when injection moulding thermosets directly
`,
  },

  {
    subject_slug: 'polymer-processing',
    title: 'Extrusion Die Design Fundamentals',
    summary: 'Go deeper into die design principles — flow balancing, land length, and pressure drop calculations — the engineering behind producing dimensionally consistent extruded products at high speed.',
    order_index: 6,
    is_premium: false,
    content: `## Why Die Design Is Harder Than It Looks

A die's job sounds simple: shape molten polymer into the desired cross-section as it exits the extruder. In practice, die design is one of the most mathematically demanding areas of polymer processing — because molten polymer doesn't flow like water. It's a **non-Newtonian, shear-thinning** fluid, meaning its resistance to flow changes depending on how fast it's being pushed through different parts of the die.

---

## The Core Challenge: Flow Balancing

If a die has any variation in flow channel depth or width across its cross-section, the polymer will flow faster through the easier (shorter, wider) paths and slower through the harder (long, narrow) paths — causing **uneven output**, warping, and dimensional inconsistency in the final product.

**Flow balancing** is the process of designing die geometry so that melt exits **uniformly** across the entire die opening, despite the melt having to travel different distances from the single entry point to reach all parts of a wide or complex die.

\`\`\`
UNBALANCED DIE:                    BALANCED DIE:
(faster flow near center)          (uniform flow across width)
   ↓↓↓↓                              ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
  ↓↓↓↓↓↓↓                            ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
   ↓↓↓↓                              ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
(bowed, uneven sheet)               (flat, uniform sheet)
\`\`\`

### How Flow Balancing Is Achieved

**Coat-Hanger Die Design (for flat sheet/film):** The manifold (the channel distributing melt across the die width) is shaped like an inverted coat hanger — wider and deeper near the center inlet, tapering toward the edges. This geometry is calculated so that **pressure drop is equal along every flow path**, regardless of path length, ensuring uniform exit velocity across the entire width.

**Spider/Mandrel Support Dies (for pipe/tube):** In annular dies, the mandrel (inner die piece forming the bore) must be supported by "spider legs" or a "spider" bridge — but these create flow disturbances and potential weld lines where the melt stream splits and rejoins around each support leg. Modern die designs minimize the number of spider legs and add flow channels specifically to help the melt streams re-knit smoothly downstream of each support point.

---

## The Land Length Concept

The **land** is the final straight section of the die just before the exit — the parallel-walled portion that gives the melt its last, most important shaping influence.

\`\`\`
[MANIFOLD] → [APPROACH] → [LAND] → EXIT
                            ↑
                    Final shaping zone
                    (constant cross-section)
\`\`\`

**Why land length matters:**
- **Too short:** Melt doesn't have enough residence time at constant geometry to "relax" — leads to poor dimensional stability, die swell variation, surface defects
- **Too long:** Increases pressure drop (more energy needed, more heat generation from shear), increases residence time (risk of degradation for heat-sensitive polymers like PVC)

**Typical land length:** 10–20× the wall thickness of the extruded product, though this varies significantly by polymer melt viscosity and die geometry.

---

## Die Swell (Extrudate Swell)

As molten polymer exits the die, it doesn't maintain the exact die opening dimensions — it **swells**, expanding to a larger cross-section than the die opening itself. This happens because polymer chains, compressed and oriented while flowing through the confined die channel, **relax and recoil** once free of the die walls.

\`\`\`
Die opening: 10mm  →  Extrudate diameter: 12-15mm (after swell)
\`\`\`

**Die swell ratio** depends on:
- Polymer molecular weight and branching (higher MW, more branching → more swell)
- Die L/D (land length to diameter ratio) — longer land reduces swell by allowing more relaxation before exit
- Shear rate (faster extrusion → more swell)
- Melt temperature (higher temp → less swell, as chains relax more easily)

**Practical impact:** Die designers must undersize the die opening relative to the desired final product dimension to compensate for swell — this is determined experimentally for each material/die combination through trial runs, since swell behavior varies significantly between polymer grades.

---

## Pressure Drop and Output Rate

The relationship between die geometry, melt viscosity, and achievable output rate is governed by the polymer's **flow behavior** through the die channels. In simplified terms, for a given die geometry:

\`\`\`
Higher Melt Viscosity → Higher Pressure Drop → Lower Output Rate (for same screw speed)
Larger Die Opening → Lower Pressure Drop → Higher Output Rate, but less back-pressure for good mixing
\`\`\`

This is why MFI (Melt Flow Index) of the chosen resin grade directly affects required die design and achievable line speeds — a low-MFI (high viscosity) pipe-grade HDPE requires different die clearances and more extruder torque than a high-MFI film-grade resin running through a similar-sized die.

---

### Indian Industry Example

**Kabra Extrusiontechnik** (Mumbai) — one of India's largest extrusion machinery manufacturers — designs and manufactures coat-hanger dies in-house for their sheet and film extrusion lines, calibrating flow balance specifically for the range of PP, PVC, and PE grades commonly available from Indian resin producers like Reliance and Haldia Petrochemicals.

**Supreme Industries'** large-diameter HDPE pipe extrusion facilities use spider-leg-supported annular dies engineered to minimize weld line visibility and strength loss — critical for pressure pipe applications where weld lines are potential failure points under sustained internal pressure.

Globally, **Cloeren Incorporated** (USA) is recognized as the global benchmark for precision coat-hanger die technology in film and sheet extrusion, supplying die technology used by major global film producers, while **extrusion die design software** from companies like **Polymerplus (PolyXtrue)** is increasingly used by Indian machinery manufacturers to simulate flow balance computationally before cutting expensive die steel — reducing costly trial-and-error die corrections.

---

## Key Takeaways

- Flow balancing ensures molten polymer exits a die uniformly despite traveling different distances from a single entry point — achieved through coat-hanger manifold designs for sheet dies and careful spider-leg placement in pipe dies
- Land length (the final constant-geometry section before exit) controls dimensional stability and die swell — too short causes poor shaping, too long increases pressure drop and degradation risk for heat-sensitive polymers
- Die swell (extrudate expanding beyond die opening size due to chain relaxation) means die dimensions must always be undersized relative to the target product dimension, with the exact compensation determined experimentally for each polymer grade and die combination
`,
  },
];

async function seedLessons() {
  console.log('🚀 PolymerHub — Seeding Polymer Processing lessons 2-6...\n');

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

  console.log('✅ Polymer Processing lessons 2-6 seeded successfully!\n');
  data.forEach((l, i) => console.log(`   ${i + 1}. ${l.title}`));
  console.log(`\n🎉 Done! ${data.length} lessons added.\n`);
}

seedLessons();
