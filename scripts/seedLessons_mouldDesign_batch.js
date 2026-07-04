// scripts/seedLessons_mouldDesign_batch.js
// Lessons 2-6 for Mould Design subject
// Run with: node scripts/seedLessons_mouldDesign_batch.js

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
    subject_slug: 'mould-design',
    title: 'Cooling System Design: Channels, Layout, and Heat Transfer',
    summary: 'Learn how mould cooling channel design controls cycle time, part quality, and warpage — the single biggest lever for injection moulding productivity.',
    order_index: 2,
    is_premium: false,
    content: `## Why Cooling Design Is the Biggest Lever in Mould Design

Cooling time typically accounts for **60-70% of total injection moulding cycle time**. A poorly cooled mould doesn't just run slow — it produces warped parts, sink marks, and inconsistent dimensions. Of every design decision a mould designer makes, cooling channel layout has the single largest impact on both productivity and part quality.

---

## How Heat Actually Leaves the Part

Molten plastic enters the cavity at 200-300°C and must cool to its ejection temperature (typically 40-80°C below melt temperature, polymer dependent) before the part can be safely ejected without distortion. Heat travels from the plastic, through the steel mould wall, into circulating coolant (almost always water, sometimes oil for high-temperature moulds).

\`\`\`
HOT PLASTIC → STEEL MOULD WALL → COOLANT IN CHANNEL → OUT TO CHILLER
   (250°C)         (conducts heat)      (carries heat away)
\`\`\`

**The closer the cooling channel is to the cavity surface, the faster and more uniform the cooling** — but channels too close to the surface risk breaking through the mould wall or creating cold spots that telegraph onto the part surface.

---

## Cooling Channel Design Rules

| Parameter | Typical Guideline | Reason |
|-----------|---------------------|--------|
| Channel diameter | 8-14mm | Larger channels = more coolant flow = better heat removal |
| Distance from cavity surface | 1.5-2× channel diameter | Balance heat transfer speed against mould wall strength |
| Distance between channels | 3-5× channel diameter | Even cooling without channels interfering with each other |
| Coolant velocity | Turbulent flow (Reynolds number > 4000) | Turbulent flow transfers heat far more efficiently than laminar flow |

**Turbulent vs laminar flow is critical:** Many beginner mould designs accidentally run coolant in laminar flow (smooth, low-velocity), which transfers heat poorly. Designers deliberately size channels and pump capacity to ensure turbulent flow — this single factor can change cooling efficiency by 3-10×.

---

## Common Cooling Channel Layouts

### 1. Straight-Drilled Channels
Simple drilled holes through the mould block, connected by external plugs and hoses. Cheapest and easiest to manufacture, but limited to following straight lines — cannot follow complex part contours.

### 2. Baffles and Bubblers
For deep cores or ribs that straight channels can't reach: a **baffle** is a drilled hole with a blade inserted to split flow into two channels (up one side, down the other) within a single drilled hole. A **bubbler** uses a tube inside a larger hole, with coolant flowing up through the tube and back down around it — both techniques cool deep, narrow core sections that a straight channel cannot reach.

\`\`\`
BAFFLE (in core pin):              BUBBLER:
   ↑  ↓                               ↑    ↓
   │  │  ← blade splits flow          │    │
   │  │                              tube  outer wall
\`\`\`

### 3. Conformal Cooling (Additive Manufacturing)
Channels designed to **follow the actual 3D contour of the part** rather than straight drilled lines — only possible using metal 3D printing (DMLS/SLM) to build the mould insert with internal channels that curve and branch exactly where needed.

**Why conformal cooling matters:** For complex parts with varying wall thickness or deep ribs, conformal channels can reduce cycle time by 20-40% compared to straight-drilled channels, because coolant follows the heat source instead of approximating it with straight lines.

---

## Cooling and Warpage

Uneven cooling is the single most common cause of part warpage. If one side of a part cools faster than the other, that side shrinks first and pulls the part out of shape as the slower-cooling side continues to shrink afterward.

**Design principle:** Cooling channels should be laid out so that **all areas of the cavity reach ejection temperature at approximately the same time** — this often means more channels (or closer channel spacing) near thick sections, ribs, and bosses where more material mass means more heat to remove.

---

## Mould Temperature and Material Selection

| Polymer | Typical Mould Temperature | Reason |
|---------|------------------------------|--------|
| PP, PE (crystalline) | 20-60°C | Lower mould temp speeds crystallization, shortens cycle |
| ABS, PS (amorphous) | 40-70°C | Higher temp improves surface finish, reduces internal stress |
| PC (amorphous, high Tg) | 80-120°C | Must stay well above Tg during fill to avoid premature freezing and stress |
| Nylon (crystalline, hygroscopic) | 60-90°C | Balances crystallization control with surface finish |

**Higher mould temperature generally means longer cooling time** (more heat to remove before ejection) but better surface finish and lower residual stress — a trade-off mould designers and process engineers balance based on part requirements.

---

### Indian Industry Example

**Sintex BAPL** (Kalol, Gujarat) employs baffle and bubbler cooling extensively in their deep-draw container moulds, where straight-drilled channels cannot reach the bottom of tall, narrow core sections common in storage container designs.

**Mold-Tek Technologies** (Hyderabad) — a major Indian mould design and manufacturing company serving FMCG packaging clients — has begun adopting conformal cooling inserts for high-volume thin-wall packaging moulds where every second of cycle time reduction translates directly into significant annual cost savings at millions of cycles per year.

Globally, **EOS GmbH** (Germany) is the leading metal 3D printing technology provider for conformal cooling mould inserts, with their DMLS machines used by mould makers worldwide including several Indian toolrooms now investing in metal additive manufacturing capability, while **Moldflow** simulation software (now part of **Autodesk**, originally developed in Australia) remains the global standard for predicting cooling uniformity and warpage before a mould is ever cut.

---

## Key Takeaways

- Cooling typically consumes 60-70% of cycle time, making cooling channel design the single biggest lever for both productivity and part quality — channels should be sized and positioned to achieve turbulent coolant flow for efficient heat transfer
- Baffles and bubblers extend cooling reach into deep cores and ribs that straight-drilled channels cannot access, while conformal cooling (only possible via metal 3D printing) follows the part's actual contour for maximum cooling efficiency in complex geometries
- Uneven cooling across the cavity is the most common cause of part warpage — designers must balance channel placement so all areas reach ejection temperature simultaneously, with channel spacing increased near thick sections, ribs, and bosses
`,
  },

  {
    subject_slug: 'mould-design',
    title: 'Ejection Systems: Pins, Sleeves, Strippers, and Air Ejection',
    summary: 'Understand how moulded parts are safely removed from the mould without damage, covering ejector pin design, stripper plates, and air-assisted ejection for thin-wall and deep-draw parts.',
    order_index: 3,
    is_premium: false,
    content: `## Getting the Part Out Without Breaking It

Once a part has cooled and the mould opens, it must be pushed out of the cavity — but the part is still warm, somewhat soft, and often gripping the core due to shrinkage. Poor ejection system design causes the most common moulding defects you'll encounter on a shop floor: ejector pin marks, part distortion, cracking, and sticking.

---

## Why Parts Stick to the Core

As molten plastic cools in the mould, it **shrinks** — typically 0.3% to 2.5% depending on the polymer (crystalline polymers shrink more than amorphous ones, as covered in the crystallinity lesson). This shrinkage causes the part to **grip tightly onto core features** (the male side of the mould) while pulling away slightly from cavity features (the female side).

**This is why moulds are designed so the part stays on the moving (ejector) half** when the mould opens — the core side is typically the moving half, ensuring the part remains where the ejector system can act on it.

---

## Ejector Pin Systems

The most common ejection method — simple cylindrical pins that push the part off the core as the mould opens.

### Design Considerations

| Factor | Guideline | Reason |
|--------|-----------|--------|
| Pin placement | On ribs, bosses, and structural areas, not visible cosmetic surfaces | Pins leave a visible witness mark; hide them where possible |
| Pin diameter | As large as the part geometry allows | Larger pins distribute ejection force over more area, reducing stress concentration and part distortion |
| Number of pins | Enough to distribute force evenly | Too few pins concentrate force, causing pin marks to push through or distort thin walls |
| Pin length | Matched precisely to core depth | Pins that don't fully retract leave the part stuck; pins extending too far damage the cavity on mould close |

**Witness marks:** Even well-designed ejector pins leave a slight circular mark (raised or recessed) on the part surface where they contacted it — this is why pin placement on hidden or non-cosmetic surfaces is a standard design discipline.

---

## Stripper Plates and Stripper Rings

For parts with thin walls or large flat areas (cups, containers, thin housings) where individual ejector pins would concentrate too much force and distort the part, a **stripper plate** pushes against the entire part rim simultaneously, distributing ejection force evenly around the full perimeter.

\`\`\`
EJECTOR PINS (point loads):        STRIPPER PLATE (distributed load):
   ↑   ↑   ↑                           ═══════════
  (concentrated force,                 ↑↑↑↑↑↑↑↑↑↑↑
   risk of distortion)                (even force across rim)
\`\`\`

**Stripper rings** work the same principle for round parts (bottle caps, cylindrical containers) — a ring-shaped plate that pushes the part off uniformly around its full circumference, essential for thin-wall packaging where even slight uneven ejection force causes visible distortion or cracking.

---

## Air-Assisted Ejection

For very thin-wall parts (especially PET preforms, thin packaging, and large flat parts) where mechanical ejector contact of any kind risks marking or distorting the surface, **compressed air is blown through small valve pins or porous mould inserts** to break the vacuum/suction holding the part to the core, allowing it to drop free without any mechanical contact mark.

**Common applications:**
- Large thin-wall parts (refrigerator liners, large packaging)
- Parts requiring a completely mark-free cosmetic surface
- Combined with mechanical ejection (air breaks initial suction, then pins complete the push)

---

## Undercuts and Side-Action Ejection

Some part geometries (snap-fit hooks, internal/external threads, side holes) physically cannot be ejected by straight pin movement alone — these **undercuts** require specialized mechanisms:

| Mechanism | How It Works | Use Case |
|-----------|---------------|----------|
| Side-action slides | Angled pins (cam pins) force a slide sideways as the mould opens, clearing the undercut before ejection | Side holes, external snap features |
| Lifters | An angled core component that moves both sideways and outward simultaneously during ejection | Internal undercuts, internal snap hooks |
| Collapsible cores | A core that mechanically shrinks inward to clear internal threads before ejection | Internal threads (bottle caps, jar lids) |
| Unscrewing mechanisms | A rotating core that unscrews the part like removing a literal screw thread | External threads requiring rotation to release |
+
 These mechanisms add significant mould complexity and cost but are unavoidable for many common consumer products — internally threaded bottle caps, for instance, require either a collapsible core or unscrewing mechanism since the thread is a continuous spiral undercut.

---

### Indian Industry Example

**Nilkamal Limited** uses extensive stripper-plate ejection systems for their furniture and storage container moulds, where individual ejector pins would create unacceptable visible marks on the large flat surfaces of chairs and storage bins seen directly by end consumers.

**Manjushree Technopack** relies on collapsible core technology for PET preform and closure moulds producing internally threaded bottle caps at extremely high cavitation (64-128 cavities per mould) for beverage industry clients, where unscrewing mechanisms would be too slow for the required cycle times.

Globally, **Husky Injection Molding Systems** (Canada) is the leading global supplier of high-cavitation PET preform mould systems with integrated collapsible-core and stripper-ring ejection used by major Indian packaging companies, while **Hasco** (Germany) remains the global standard supplier of standardized ejector pin components that Indian mould makers specify directly into their tool designs rather than custom-machining every pin from scratch.

---

## Key Takeaways

- Parts shrink onto the core during cooling, which is why moulds are designed with the core on the moving (ejector) half — ejection systems must overcome this grip without distorting or damaging the part
- Stripper plates and rings distribute ejection force evenly across a part's full perimeter for thin-wall parts where individual ejector pins would concentrate force and cause distortion, while air-assisted ejection avoids mechanical contact entirely for mark-free cosmetic surfaces
- Undercuts (threads, snap-fits, side holes) require specialized mechanisms — side-action slides, lifters, collapsible cores, or unscrewing systems — that add mould complexity but are unavoidable for many standard consumer product features
`,
  },

  {
    subject_slug: 'mould-design',
    title: 'Runner and Sprue Design: Balancing Flow to Multiple Cavities',
    summary: 'Learn how runner systems deliver molten plastic from the machine nozzle to every cavity in a multi-cavity mould — and why balanced runner design is essential for consistent part quality across all cavities.',
    order_index: 4,
    is_premium: false,
    content: `## The Delivery Network Inside Every Mould

In a single-cavity mould, the path from machine nozzle to part is simple: sprue, then gate, then cavity. But most production moulds run **multiple cavities simultaneously** — 2, 4, 8, even 96+ cavities in high-volume packaging applications — and every cavity must fill with the same pressure, same speed, and same melt condition, or parts from different cavities will have inconsistent quality.

This is the job of the **runner system**: the network of channels distributing melt from the sprue to every individual gate.

---

## The Flow Path

\`\`\`
MACHINE NOZZLE → SPRUE → MAIN RUNNER → SECONDARY RUNNERS → GATES → CAVITIES
\`\`\`

- **Sprue:** The single channel carrying melt from the machine nozzle into the mould, always tapered (larger at the nozzle end) for easy removal after ejection
- **Main Runner:** Distributes melt from the sprue to the first branch point(s)
- **Secondary/Branch Runners:** Further distribute melt to each individual cavity
- **Gates:** The final restricted entry into each cavity (covered in your earlier gate design lesson)

---

## Naturally Balanced vs Artificially Balanced Layouts

### Naturally Balanced (Geometrically Balanced)

Cavities are arranged so that the **flow path length and cross-section are identical** from the sprue to every single cavity — achieved through symmetric, branching layouts (H-pattern, X-pattern).

\`\`\`
NATURALLY BALANCED (4-cavity, H-pattern):

        Cavity 1   Cavity 2
            \\         /
             \\       /
              SPRUE
             /       \\
            /         \\
        Cavity 3   Cavity 4

(All four paths are geometrically identical in length)
\`\`\`

**This is always the preferred approach** — because flow path length and geometry are identical, melt pressure, temperature, and shear history are naturally equal at every cavity without requiring any calculation or compensation.

### Artificially Balanced (Non-Geometric Layouts)

When cavity placement cannot be made naturally symmetric (often due to part shape or mould space constraints), runners are **artificially balanced** by deliberately varying channel diameter — making runners to closer cavities smaller (more flow restriction) and runners to farther cavities larger (less restriction) — to equalize pressure drop despite unequal path lengths.

**Why this is harder:** Artificial balancing requires either detailed flow simulation (Moldflow or similar) or extensive trial-and-error, since melt viscosity is non-Newtonian and shear-rate-dependent — a runner sized correctly at one injection speed may become unbalanced at a different speed.

---

## Runner Cross-Section Shapes

| Shape | Efficiency | Notes |
|-------|------------|-------|
| Full round | Best (lowest surface-area-to-volume ratio, least heat loss, easiest flow) | Requires runner cut into both mould halves — higher machining cost |
| Trapezoidal | Good (90-95% as efficient as full round) | Can be cut into one mould half only — much cheaper to machine |
| Half-round | Poor | Avoided in modern design except for very low-cost tooling |

**Full round runners are the technical ideal** because they have the lowest surface-to-volume ratio, meaning the least heat loss to the cold mould steel and most uniform cooling across the runner cross-section — keeping the center hot and flowing while the outer skin freezes, exactly like the desired flow behavior in the part itself.

---

## Cold Runners vs Hot Runners

### Cold Runner Systems
The simplest configuration — runners are part of the mould, fill with plastic every cycle, cool and solidify alongside the part, then get ejected and trimmed away as waste (or reground and reused for non-critical applications).

**Trade-off:** Simple, lower mould cost — but generates runner waste every single cycle, which adds material cost and, for some processes, regrind quality concerns.

### Hot Runner Systems
Runners are internally heated and kept molten between cycles — only the part itself solidifies and ejects; the runner system never cools or wastes material.

**Trade-off:** Significantly higher mould cost and complexity (heating elements, temperature controllers for each drop) — but eliminates runner waste entirely, often improves cycle time (no runner to cool), and is essential for high-cavitation, high-volume production where waste reduction at millions of cycles delivers major cost savings.

| Factor | Cold Runner | Hot Runner |
|--------|--------------|--------------|
| Mould cost | Lower | Significantly higher |
| Material waste | Every cycle (runner becomes scrap or regrind) | None |
| Cycle time | Slightly longer (runner must cool too) | Shorter (no runner to cool) |
| Maintenance complexity | Low | Higher (heater bands, controllers per drop) |
| Best for | Low-medium volume, simple parts | High volume, high cavitation, expensive resins |

---

### Indian Industry Example

**Manjushree Technopack's** high-cavitation PET preform moulds (64-128 cavities) rely entirely on hot runner systems with individually controlled valve gates per cavity — at this scale, even a small percentage of runner waste per cycle would translate into enormous annual material cost given the billions of preforms produced.

**Supreme Industries'** furniture and crate moulds more commonly use naturally balanced cold runner systems with full-round runners — at lower cavitation (2-8 cavities) and lower-cost commodity resin (PP, HDPE), the simplicity and lower tooling investment of cold runners makes more economic sense than hot runner complexity.

Globally, **Mold-Masters** (Canada, part of **Milacron**) is the world's leading hot runner system supplier, with their valve-gate technology used extensively by Indian packaging mould makers, while **Synventive Molding Solutions** (USA/Germany) is another major global hot runner technology provider whose sequential valve-gate control systems are increasingly specified by Indian automotive component mould makers for large, multi-gate parts requiring precise fill control.

---

## Key Takeaways

- Naturally balanced runner layouts (geometrically identical flow paths to every cavity) are always preferred over artificially balanced ones, since they guarantee equal pressure and melt condition at every cavity without complex calculation or simulation
- Full round runner cross-sections are the technical ideal due to their low surface-to-volume ratio and uniform cooling behavior, though trapezoidal runners (cut into one mould half only) are far cheaper to machine and commonly used as a practical compromise
- Hot runner systems eliminate runner waste and often improve cycle time at the cost of significantly higher mould complexity and price — making them standard for high-cavitation, high-volume production while cold runners remain economical for lower-volume, simpler multi-cavity moulds
`,
  },

  {
    subject_slug: 'mould-design',
    title: 'Draft Angles and Shrinkage Allowance in Mould Design',
    summary: 'Master two of the most fundamental dimensional design rules in mould making — draft angles that allow easy part release, and shrinkage allowance that ensures the final cooled part matches the intended dimensions.',
    order_index: 5,
    is_premium: false,
    content: `## Two Rules Every Mould Designer Learns First

Before a mould designer ever thinks about gates, runners, or cooling, two dimensional fundamentals must be built into every single surface of the part design: **draft angle** (so the part can be removed from the mould at all) and **shrinkage allowance** (so the cooled part actually matches the intended dimensions). Skip either one, and the mould simply will not produce usable parts.

---

## Draft Angle: Why Vertical Walls Don't Work

Any surface in a mould that runs **parallel to the direction of mould opening** will grip the mould wall through friction and shrinkage as the part cools — even a microscopically perfect vertical wall will stick due to the part shrinking onto the core. **Draft angle** is a slight taper applied to these walls so they angle away from the mould surface as the part is ejected, breaking that frictional grip.

\`\`\`
NO DRAFT (sticks):              WITH DRAFT (releases easily):
   │           │                    ╲             ╱
   │  PART     │                     ╲   PART    ╱
   │           │                      ╲          ╱
───┴───────────┴───              ─────┴──────────┴─────
  (vertical walls grip mould)      (tapered walls release)
\`\`\`

### Typical Draft Angle Guidelines

| Surface Type | Minimum Draft | Notes |
|---------------|------------------|-------|
| Smooth/polished surfaces | 0.5° – 1° | Smoother surface = less friction = less draft needed |
| Standard textured surfaces (light texture) | 1° – 2° per side | Texture depth requires more draft to release cleanly |
| Heavy texture (leather grain, heavy stipple) | 3° – 5°+ | Deep texture grips the mould significantly more |
| Ribs and bosses (thin, deep features) | 0.25° – 0.5° per side minimum | Even thin features need draft, though space constraints limit how much |

**The deeper the feature, the more draft angle matters in absolute terms** — a 1° draft on a 10mm-deep wall produces a tiny dimensional change, but the same 1° on a 100mm-deep wall produces nearly 2mm of taper, which can become a significant design constraint for deep parts like buckets or tall containers.

---

## Shrinkage Allowance: Designing for the Cooled State

When molten plastic at 200-300°C cools to room temperature, it physically **contracts** — this shrinkage must be compensated for in the mould cavity dimensions, or the final part will always be smaller than intended.

\`\`\`
Mould cavity dimension = Desired part dimension × (1 + Shrinkage Rate)
\`\`\`

**Example:** If you want a final part dimension of 100mm, and the polymer has 2% shrinkage:

\`\`\`
Mould cavity dimension = 100mm × 1.02 = 102mm
\`\`\`

The mould cavity is cut 2mm larger than the desired final part dimension, so that after the part shrinks during cooling, it ends up at exactly 100mm.

### Typical Shrinkage Rates by Polymer

| Polymer | Shrinkage Rate | Crystallinity |
|---------|-----------------|------------------|
| PC (amorphous) | 0.5% – 0.7% | Amorphous — low, predictable shrinkage |
| ABS (amorphous) | 0.4% – 0.7% | Amorphous — low shrinkage |
| PP (crystalline) | 1.0% – 2.5% | Crystalline — significantly higher shrinkage |
| HDPE (crystalline) | 1.5% – 3.0% | Crystalline — highest typical shrinkage |
| Nylon (crystalline, unfilled) | 1.0% – 2.5% | Crystalline, also affected by moisture content |
| Glass-filled Nylon (30%) | 0.3% – 0.8% | Glass fibres restrict shrinkage significantly |

**This directly connects to the crystallinity lesson:** Crystalline polymers (PP, HDPE, Nylon) shrink considerably more than amorphous polymers (PC, ABS) because the ordered crystalline regions pack more tightly during cooling, pulling the material into a denser, smaller final volume.

---

## Why Shrinkage Isn't Always Uniform

Real-world shrinkage is rarely perfectly uniform in all directions — several factors cause **differential shrinkage**:

| Factor | Effect |
|--------|--------|
| Flow direction vs cross-flow direction | Polymer chains orient during flow, causing more shrinkage along flow direction than across it (especially pronounced in glass-filled or fibre-reinforced materials) |
| Wall thickness variation | Thicker sections cool slower and shrink more than thin sections in the same part |
| Mould temperature variation | Areas of the mould running hotter cause slower cooling and more crystallization/shrinkage in crystalline polymers |
| Packing/holding pressure | Higher holding pressure pushes more material into the cavity during cooling, reducing apparent shrinkage |

**This is why "shrinkage rate" on a datasheet is always a range, not a single number** — actual shrinkage for a specific part depends on wall thickness, flow length, gate location, and process settings, which is why experienced mould designers often build in slightly adjustable cavity inserts for fine-tuning after first trial shots, rather than assuming the datasheet number will be exactly correct on the first attempt.

---

### Indian Industry Example

**Nilkamal Limited's** chair and furniture moulds use deliberately generous draft angles (often 2-3°) on textured surfaces, since their products feature decorative textured finishes that require more draft than the smooth-surface minimum to release cleanly at high-volume production speeds.

**Sintex BAPL's** water tank moulds account for HDPE's high shrinkage rate (up to 3%) by cutting cavities significantly oversized relative to the nominal tank capacity marking — a critical calculation since their tanks must meet exact volume specifications despite the substantial dimensional change between molten and cooled states.

Globally, **Moldflow** (Autodesk) shrinkage simulation modules are used worldwide, including by Indian toolrooms like **Mold-Tek Technologies** and **Lumax Industries**, to predict differential shrinkage and warpage before cutting mould steel — reducing the costly trial-and-error cavity rework that was standard practice before simulation software became widely accessible to Indian mould makers over the past two decades.

---

## Key Takeaways

- Draft angle (typically 1-2° minimum, more for textured surfaces) is required on every surface parallel to the mould opening direction to allow the part to release without sticking — deeper features require proportionally more attention since draft accumulates with depth
- Mould cavity dimensions must be cut larger than the desired final part dimension by the polymer's shrinkage rate, with crystalline polymers (PP, HDPE, Nylon, 1-3%) shrinking significantly more than amorphous polymers (PC, ABS, 0.4-0.7%)
- Shrinkage is rarely perfectly uniform — flow direction, wall thickness variation, and mould temperature differences all cause differential shrinkage, which is why datasheet shrinkage values are ranges and why experienced designers build adjustability into cavity inserts for fine-tuning after initial trial shots
`,
  },

  {
    subject_slug: 'mould-design',
    title: 'Mould Materials and Surface Finish',
    summary: 'Learn how to select the right tool steel for a mould based on production volume and part requirements, and how surface finish — from mirror polish to textured grain — is achieved and specified.',
    order_index: 6,
    is_premium: false,
    content: `## Choosing the Right Steel for the Job

A mould isn't just a shape — it's a precision tool that must withstand thousands to millions of high-pressure, high-temperature injection cycles without dimensional drift, cracking, or excessive wear. Material selection for mould construction is a direct trade-off between **cost, expected production volume, and part requirements**.

---

## Common Mould Steel Grades

| Steel Type | Hardness (typical) | Best For | Approximate Cavitation Life |
|------------|------------------------|----------|--------------------------------|
| P20 (pre-hardened) | 28-32 HRC | General purpose, prototype to medium volume | 100,000 – 500,000 cycles |
| H13 (hot-work tool steel) | 48-52 HRC (hardened) | High-wear, abrasive materials (glass-filled), high-volume | 500,000 – 1,000,000+ cycles |
| S7 (shock-resistant) | 54-58 HRC | High-impact applications, large core pins | 500,000+ cycles |
| 420 Stainless | 50-52 HRC | Corrosive materials (PVC releases HCl), medical/clean room | 300,000 – 700,000 cycles |
| Aluminum (7075, QC-10) | N/A (not hardened) | Prototype, bridge tooling, very low volume | 1,000 – 10,000 cycles |

**Why P20 dominates general-purpose moulding:** P20 arrives pre-hardened from the steel mill, meaning it can be machined directly without a separate heat-treatment step (which risks dimensional distortion in precision cavities) — making it the most common, cost-effective choice across Indian toolrooms for moulds not facing extreme abrasive wear or corrosive conditions.

**Why H13 is chosen for glass-filled materials:** Glass fibre reinforcement (covered in the polymer blends lesson) is highly abrasive — it literally erodes softer steel surfaces over repeated cycles. H13's high hardness after heat treatment resists this abrasive wear dramatically better than P20, justifying its higher cost and additional heat-treatment processing step for high-volume glass-filled Nylon or PP production.

**Why stainless steel matters for PVC:** PVC releases corrosive HCl gas during processing (covered in the degradation lesson) — over time, this attacks standard tool steel, causing pitting and corrosion that damages surface finish and dimensional accuracy. 420 stainless steel's corrosion resistance directly addresses this chemical attack.

---

## Aluminum Tooling: The Bridge Tool Strategy

For new product development, many Indian and global manufacturers use **aluminum bridge tools** — lower-cost, faster-to-machine moulds (often 50-70% cheaper and faster to produce than steel) used to validate part design and run initial low-volume production while the permanent steel production tool is being built in parallel.

**Trade-off:** Aluminum moulds wear far faster (thousands of cycles vs hundreds of thousands for steel) and cannot handle abrasive or corrosive materials well — but the speed-to-market advantage for new product launches often outweighs the limited cavitation life, especially when validating a design before committing to expensive steel tooling.

---

## Surface Finish Specifications

Surface finish isn't just cosmetic — it affects part release (smoother surfaces release more easily, requiring less draft), appearance, and even functional properties like grip or light diffusion.

### The SPI Finish Standard (Society of the Plastics Industry)

| SPI Grade | Description | Typical Use |
|-----------|--------------|----------------|
| SPI A-1, A-2, A-3 | Mirror/high polish (diamond buffed) | Optical lenses, high-gloss cosmetic surfaces |
| SPI B-1, B-2, B-3 | Fine to medium polish (fine sandpaper grit) | General good-quality cosmetic surfaces |
| SPI C-1, C-2, C-3 | Matte finish (stone/fine grit blast) | Functional surfaces, light texture desired |
| SPI D-1, D-2, D-3 | Textured/dry blast (heaviest texture) | Grip surfaces, hiding minor flow marks, decorative texture |

**Achieving mirror finish (SPI A grade)** requires extensive hand polishing using progressively finer diamond paste after the cavity is machined — a highly skilled, time-consuming manual process that significantly adds to mould cost and lead time, which is why mirror-finish moulds (for products like clear lenses or high-gloss electronics housings) command premium tooling prices.

---

## Textured Finishes: Function Beyond Appearance

Textured mould surfaces (achieved through chemical etching or EDM texturing) serve practical purposes beyond decoration:

- **Hiding minor surface flow lines or knit lines** that would be visible on a polished surface
- **Improving grip** on handles, tool housings, automotive interior surfaces
- **Reducing visible scratches** in everyday use (textured surfaces show wear far less than polished ones)
- **Light diffusion** for translucent lighting components

**Important design consequence:** As covered in the draft angle lesson, textured surfaces always require more draft angle than polished surfaces (often 2-3° vs 0.5-1°) since texture depth creates additional mechanical grip against the mould wall during ejection.

---

### Indian Industry Example

**Mold-Tek Technologies** (Hyderabad) routinely specifies H13 hardened steel for their high-volume FMCG packaging moulds running abrasive, mineral-filled PP compounds, while using P20 for their unfilled commodity resin moulds where the abrasive wear concern doesn't apply.

**Lumax Industries** (Gurugram), a major automotive lighting component manufacturer, requires SPI A-grade mirror-polished mould cavities for their headlamp lens production — even microscopic surface imperfections in the mould would be optically visible and unacceptable in a finished automotive lens.

Globally, **Erowa** (Switzerland) and GF Machining Solutions (Switzerland) are leading suppliers of precision EDM (Electrical Discharge Machining) equipment used worldwide, including by premium Indian toolrooms, for cutting fine textures and achieving the dimensional precision required for SPI A-grade finishes, while standardized mould steel grades from Uddeholm (Sweden, part of Voestalpine) and Böhler (Austria) remain globally recognized benchmark steel suppliers whose material certifications Indian toolrooms reference when specifying imported tool steel for premium mould projects.

---

## Key Takeaways

- Mould steel selection balances cost against expected cavitation life and part requirements: P20 suits general-purpose moulding, H13 resists abrasive wear from glass-filled materials, and 420 stainless resists corrosion from materials like PVC that release HCl gas
- Aluminum bridge tooling offers a faster, cheaper path to validate part designs and run initial low-volume production while a permanent steel tool is built in parallel, trading cavitation life for speed-to-market
- Surface finish follows the SPI standard from A-grade mirror polish (extensive hand-polishing, premium cost) to D-grade textured finishes — textured surfaces hide flow lines and improve grip but always require more draft angle than polished surfaces due to increased mechanical grip during ejection
`,
  },
];

async function seedLessons() {
  console.log('🚀 PolymerHub — Seeding Mould Design lessons 2-6...\n');

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

  console.log('✅ Mould Design lessons 2-6 seeded successfully!\n');
  data.forEach((l, i) => console.log(`   ${i + 1}. ${l.title}`));
  console.log(`\n🎉 Done! ${data.length} lessons added.\n`);
}

seedLessons();
