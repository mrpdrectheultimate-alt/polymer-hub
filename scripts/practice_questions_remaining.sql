-- ============================================================
-- POLYMERHUB — PRACTICE QUESTIONS: REMAINING 5 SUBJECTS
-- Run in Supabase SQL Editor AFTER practice_questions_schema.sql
-- Adds 5 questions each for:
-- Sustainable Plastics, Composites, Entrepreneurship, Medical Plastics
-- (Recycling already seeded in first batch)
-- ============================================================

DO $$
DECLARE
  s_sustainable uuid;
  s_composites uuid;
  s_entrepreneurship uuid;
  s_medical uuid;
BEGIN
  SELECT id INTO s_sustainable FROM subjects WHERE slug = 'sustainable-plastics';
  SELECT id INTO s_composites FROM subjects WHERE slug = 'polymer-composites';
  SELECT id INTO s_entrepreneurship FROM subjects WHERE slug = 'entrepreneurship-plastics';
  SELECT id INTO s_medical FROM subjects WHERE slug = 'medical-plastics';

  -- ── SUSTAINABLE PLASTICS & BIOPLASTICS ───────────────────────────────────────
  INSERT INTO practice_questions (subject_id, question, type, options, correct_answer, explanation, difficulty, topic, is_gate_relevant) VALUES

  (s_sustainable,
    'PLA (Polylactic Acid) is described as "bio-based" and "biodegradable." In practice, PLA degrades only under:',
    'mcq',
    '["A) Normal soil composting conditions within 3–6 months", "B) Industrial composting conditions — 58°C minimum, high humidity, microbial activity — not in home compost or landfill", "C) Any aqueous environment within 2 years", "D) Direct sunlight exposure for 6 months"]',
    'B',
    'This is one of the most important misconceptions in sustainable plastics. PLA requires industrial composting conditions (58–60°C, >90% relative humidity, active microbial population) to biodegrade in 3–6 months. In a home compost bin, cold landfill, or ocean environment, PLA behaves almost identically to conventional plastic — it can persist for decades. This is why "compostable" packaging must be sent to industrial composting facilities, not regular bins. The distinction between bio-based (feedstock origin), biodegradable (can break down), and compostable (breaks down under specific conditions) is fundamental to sustainable plastics engineering.',
    'medium', 'Bioplastics — PLA Reality', false),

  (s_sustainable,
    'The primary commercial advantage of "drop-in" bio-based polymers (like bio-PE and bio-PET) over conventional fossil-based equivalents is:',
    'mcq',
    '["A) They are biodegradable, solving end-of-life plastic pollution", "B) They are chemically identical to fossil-based equivalents, requiring no changes to processing equipment, product specifications, or recycling infrastructure", "C) They have superior mechanical properties", "D) They cost less than fossil-based polymers"]',
    'B',
    'Drop-in bio-based polymers (bio-PE from sugarcane ethanol, bio-PET using bio-MEG) are chemically identical to their fossil-based counterparts — same molecular structure, same properties, same processing conditions, same recycling codes. The entire existing value chain (processing lines, packaging formats, recycling systems) works unchanged. This is their critical commercial advantage over novel bioplastics like PLA/PHA, which require new processing conditions and separate collection/composting infrastructure. The carbon reduction comes from the bio-based feedstock capturing atmospheric CO₂ during plant growth.',
    'medium', 'Bio-based vs Biodegradable', false),

  (s_sustainable,
    'PHA (Polyhydroxyalkanoate) is produced by:',
    'mcq',
    '["A) Chemical synthesis from petroleum-derived monomers", "B) Ring-opening polymerization of lactide", "C) Bacterial fermentation — microorganisms accumulate PHA as an intracellular energy storage polymer when grown under nutrient limitation", "D) Hydrolysis of natural starch"]',
    'C',
    'PHA is the only major bioplastic produced entirely by biological synthesis — bacteria (Cupriavidus necator, Halomonas, and others) accumulate PHA granules intracellularly when grown in carbon-rich but nitrogen-limited conditions. The bacteria are then lysed and the PHA extracted. This makes PHA genuinely biodegradable in soil, marine, and freshwater environments (unlike PLA) because the same enzymatic pathways that produced it can degrade it. The challenge is production cost — bacterial fermentation is currently 3–5× more expensive than petrochemical polymer production, which is the primary barrier to commercial scale.',
    'hard', 'PHA Bioplastics', false),

  (s_sustainable,
    'The EU Packaging and Packaging Waste Regulation (PPWR) mandates that all plastic beverage bottles must contain minimum recycled content of:',
    'mcq',
    '["A) 10% by 2025", "B) 25% by 2025, rising to 30% by 2030 for PET bottles; all plastic packaging 35% by 2030", "C) 50% by 2025", "D) 100% by 2030"]',
    'B',
    'EU PPWR (Regulation 2024/1781) sets mandatory minimum recycled content: PET beverage bottles ≥25% by 2025 and ≥30% by 2030; all plastic packaging ≥35% by 2040. This creates a legally mandated market for certified rPET — directly linking recycling economics to regulatory compliance. For Indian exporters, any plastic packaging sold in the EU market must meet these requirements. This is why FMCG companies are actively procuring EPR certificates and rPET — it is regulatory compliance, not just voluntary sustainability.',
    'hard', 'Global Plastics Policy', true),

  (s_sustainable,
    'Mono-material packaging design is preferred for recycling because:',
    'mcq',
    '["A) It uses less total material weight", "B) Single-material packaging can be sorted and recycled through existing infrastructure; multi-material laminates (e.g., PE/Nylon/PE) are impossible to separate and go to landfill or incineration", "C) Mono-material packaging is stronger than multi-layer laminates", "D) It requires less printing ink"]',
    'B',
    'Multi-layer flexible packaging (e.g., snack wrappers: PET/metallised PET/PE laminate) provides excellent barrier properties but is technically unrecyclable by conventional mechanical recycling — the different polymers are bonded and cannot be separated. Mono-material PE or PP flexible packaging (using all-PE film instead of PE/nylon/PE) can enter the polyolefin recycling stream. The engineering challenge is achieving equivalent barrier performance with a single polymer family — typically requiring thicker layers or specific additive systems. This is why major FMCG companies (Unilever, Nestlé) have committed to mono-material flexible packaging by 2025–2030.',
    'medium', 'Sustainable Packaging Design', false);

  -- ── POLYMER COMPOSITES ───────────────────────────────────────────────────────
  INSERT INTO practice_questions (subject_id, question, type, options, correct_answer, explanation, difficulty, topic, is_gate_relevant) VALUES

  (s_composites,
    'The "rule of mixtures" in composite materials predicts longitudinal (fibre direction) tensile modulus as:',
    'mcq',
    '["A) E_c = E_f × V_f only (matrix ignored)", "B) E_c = E_f × V_f + E_m × V_m (weighted average by volume fraction)", "C) E_c = 1/(V_f/E_f + V_m/E_m) (harmonic mean)", "D) E_c = √(E_f × E_m)"]',
    'B',
    'The rule of mixtures (isostrain condition) for longitudinal loading: E_c = E_f × V_f + E_m × V_m, where E_f and E_m are fibre and matrix moduli, V_f and V_m are volume fractions. This applies when fibres and matrix experience the same strain (longitudinal loading, continuous fibres). For transverse loading (perpendicular to fibres), the inverse rule of mixtures applies: 1/E_c = V_f/E_f + V_m/E_m (isostress condition). Understanding both conditions is essential for composite design — CFRP is extremely anisotropic, with E_longitudinal typically 10× higher than E_transverse.',
    'hard', 'Composite Mechanics', true),

  (s_composites,
    'Carbon fibre reinforced polymer (CFRP) is preferred over glass fibre (GFRP) for aerospace applications primarily because:',
    'mcq',
    '["A) Carbon fibre is cheaper than glass fibre", "B) Carbon fibre has much higher specific stiffness (modulus/density) — achieving steel-level stiffness at one-fifth the weight", "C) Carbon fibre has better chemical resistance", "D) Carbon fibre is easier to process by hand layup"]',
    'B',
    'The key metric for aerospace is specific properties (property/density). Carbon fibre (HM grade): tensile modulus ~390 GPa, density 1.8 g/cm³ → specific modulus ~217 GPa·cm³/g. Steel: modulus 200 GPa, density 7.8 g/cm³ → specific modulus ~26 GPa·cm³/g. CFRP achieves ~8× higher specific stiffness than steel — the same structural stiffness at one-fifth the weight. Every kilogram saved in aircraft structure saves approximately 2,700 litres of fuel over a 20-year service life. This economic and performance case drives CFRP adoption in Boeing 787 (50% by weight), Airbus A350 (53%), and ISRO launch vehicles.',
    'medium', 'CFRP vs GFRP', false),

  (s_composites,
    'The interface between fibre and matrix in a composite is critical because:',
    'mcq',
    '["A) It determines the density of the composite", "B) Stress transfer from the lower-modulus matrix to the higher-modulus fibre occurs entirely through the interface — poor adhesion means the fibre cannot be loaded effectively", "C) It controls the thermal conductivity only", "D) The interface has no effect on mechanical properties"]',
    'B',
    'In a fibre-reinforced composite, the matrix is weaker but ductile — it transfers load to the fibres through shear stress at the interface. If the interface is weak (poor adhesion), the fibre debonds under load before reaching its strength — the reinforcement potential is wasted. This is why glass fibres receive silane coupling agent surface treatment, and carbon fibres receive oxidative surface treatment (increasing surface energy and functional groups) before composite fabrication. Fibre-matrix compatibility determines whether you achieve the theoretical rule-of-mixtures strength or significantly below it.',
    'medium', 'Fibre-Matrix Interface', true),

  (s_composites,
    'Natural fibre composites (jute, coir, bamboo) have limited adoption in structural applications because:',
    'mcq',
    '["A) Natural fibres are more expensive than carbon fibre", "B) High moisture absorption and resulting dimensional instability, variable mechanical properties (batch-to-batch), and poor long-term durability under weathering conditions", "C) Natural fibres have higher density than glass fibre", "D) Natural fibres cannot be processed by injection moulding"]',
    'B',
    'Natural fibres are hydrophilic — they absorb 5–15% moisture (jute absorbs up to 30% moisture in humid conditions), causing swelling, reduced mechanical properties, and dimensional instability. Unlike glass or carbon fibre with consistent manufacturing quality, natural fibre properties vary by plant species, growing region, harvest time, and processing method — making reliable composite design difficult. However, natural fibre composites are successfully used in non-structural applications (automotive interior panels, packaging, construction boards) where Tata Motors, Daimler, and BMW have incorporated jute/hemp composites as mass reduction measures.',
    'medium', 'Natural Fibre Composites', false),

  (s_composites,
    'Short fibre reinforced thermoplastics (e.g., 30% glass-filled PA6) processed by injection moulding exhibit anisotropic properties because:',
    'mcq',
    '["A) The glass fibres are hollow", "B) Fibres align preferentially in the flow direction during mould filling — mechanical properties are significantly higher along the flow direction than perpendicular to it", "C) Short fibres cannot be uniformly distributed in the matrix", "D) Glass fibres react chemically with the nylon matrix during processing"]',
    'B',
    'During injection moulding, the shear flow of melt through the gate and into the cavity aligns short glass fibres preferentially along the flow direction. This creates mechanical anisotropy: tensile strength and modulus in the flow direction (0°) can be 30–50% higher than in the transverse direction (90°). For structural part design, this means gate location directly affects where the "strong direction" is in the part — a critical input for finite element analysis. Weld lines (where two flow fronts meet) are particularly weak points because fibres align parallel to the weld, providing no transverse reinforcement across it.',
    'hard', 'Short Fibre Composites', false);

  -- ── ENTREPRENEURSHIP IN PLASTICS ─────────────────────────────────────────────
  INSERT INTO practice_questions (subject_id, question, type, options, correct_answer, explanation, difficulty, topic, is_gate_relevant) VALUES

  (s_entrepreneurship,
    'The PMEGP (Prime Minister''s Employment Generation Programme) provides a non-repayable subsidy of what percentage for a general category entrepreneur starting a manufacturing unit in an urban area?',
    'mcq',
    '["A) 5% of project cost", "B) 15% of project cost (up to ₹50 lakh total project)", "C) 25% of project cost", "D) 35% of project cost"]',
    'B',
    'PMEGP subsidy rates: General category in urban areas = 15%; General category in rural areas = 25%; SC/ST/Women/Minorities/Ex-servicemen in urban = 25%; SC/ST/Women/Minorities in rural = 35%. On a ₹50 lakh project for a general urban entrepreneur: ₹7.5 lakh is a direct non-repayable grant, bank finances ~₹37.5 lakh as term loan, and promoter contributes ₹5 lakh (10%). Application goes through DIC (District Industries Centre) or KVIC. This is the most underutilised government scheme available to PPE graduates starting manufacturing businesses.',
    'medium', 'Government Funding Schemes', false),

  (s_entrepreneurship,
    'CGTMSE (Credit Guarantee Fund Trust for Micro and Small Enterprises) is critical for first-generation entrepreneurs because:',
    'mcq',
    '["A) It provides direct cash grants to entrepreneurs", "B) It guarantees bank loans up to ₹2 crore without requiring collateral — enabling entrepreneurs without property to access manufacturing finance", "C) It provides free machinery to new manufacturers", "D) It offers subsidised raw material procurement"]',
    'B',
    'Most first-generation graduates lack property to mortgage as collateral for bank loans. Without CGTMSE, a bank would require property worth 125-150% of the loan value before lending ₹50 lakh for a plastics processing unit. CGTMSE provides a government-backed guarantee covering 75-85% of the loan against default — allowing banks to lend without the property security requirement. The entrepreneur pays an annual guarantee fee (~1.35-1.80% of loan amount). This single scheme is what makes ₹25-₹200 lakh manufacturing loans accessible to technically-qualified graduates without family property assets.',
    'medium', 'CGTMSE Scheme', false),

  (s_entrepreneurship,
    'For a masterbatch compounding business, why is the technical knowledge of a polymer engineer the primary competitive advantage?',
    'mcq',
    '["A) Masterbatch equipment is very expensive, creating a capital barrier", "B) Masterbatch is a knowledge product — correct pigment-resin compatibility, carrier selection, let-down ratio, and colour matching batch-to-batch requires polymer chemistry knowledge that most SME operators lack", "C) Masterbatch raw materials are difficult to source", "D) The masterbatch market is too small for competition"]',
    'B',
    'Masterbatch pricing is ₹150-800/kg vs raw resin at ₹90-130/kg — the premium is entirely for knowledge, not material. The technical challenges that create competitive barriers: selecting pigments compatible with the specific customer resin (a phthalocyanine blue that works in PP can cause plate-out in Nylon); formulating correct carrier resin (incompatible carrier = dispersion failure); achieving consistent colour between batches (spectrophotometer + process discipline required); solving customer processing problems (the technical service relationship). Most SME masterbatch operators buy on price and struggle with consistency — a polymer engineer starting a masterbatch business competes on quality and technical service, not price.',
    'medium', 'Masterbatch Business', false),

  (s_entrepreneurship,
    'When writing a Detailed Project Report (DPR) for a bank loan for a HDPE pipe extrusion plant, which section most directly benefits from a polymer engineering background?',
    'mcq',
    '["A) Legal and compliance section", "B) Technical parameters section — specifying exact machine specs, resin grade (Reliance Relene HD P80054, MFI 0.20 g/10min), BIS IS 4984 compliance protocol, and in-house testing requirements", "C) Marketing section", "D) Promoter CV section only"]',
    'B',
    'Banks evaluate DPR technical sections to assess whether the entrepreneur understands the business deeply enough to execute successfully. Generic descriptions ("we will use a pipe machine to make HDPE pipes") signal low technical credibility and increase perceived risk. Specific technical language — exact machine specification, raw material grade with MFI and density values, standard compliance requirement (IS 4984 for HDPE pressure pipes), in-house testing protocol (ring stiffness, MFI incoming QC) — signals deep operational knowledge. Banks have seen hundreds of generic DPRs fail; specific technical language from a polymer engineer is immediately credibility-building and differentiating.',
    'medium', 'DPR Writing', false),

  (s_entrepreneurship,
    'BIS product certification (ISI mark) is mandatory for HDPE water supply pipes. The primary business value of obtaining BIS certification beyond legal compliance is:',
    'mcq',
    '["A) It allows the manufacturer to charge 10× higher prices", "B) It qualifies the manufacturer for government infrastructure tenders (Jal Jeevan Mission, AMRUT) which require ISI-marked products — opening a procurement channel unavailable to uncertified competitors", "C) It reduces raw material costs", "D) It reduces raw material costs"]',
    'B',
    'Government infrastructure tenders under Jal Jeevan Mission (₹3.6 lakh crore programme), AMRUT, and state irrigation schemes specify ISI-marked products in their technical specifications — uncertified manufacturers are legally excluded from bidding regardless of their actual product quality. BIS certification (IS 4984 for HDPE, IS 4985 for uPVC) converts a commodity product into a specification-compliant product eligible for institutional procurement. In practice, government infrastructure is the most stable, high-volume B2B channel for pipe manufacturers — and BIS certification is the gating requirement to access it.',
    'hard', 'BIS Certification Strategy', false);

  -- ── MEDICAL PLASTICS & BIOMATERIALS ──────────────────────────────────────────
  INSERT INTO practice_questions (subject_id, question, type, options, correct_answer, explanation, difficulty, topic, is_gate_relevant) VALUES

  (s_medical,
    'ISO 10993-1 determines which biological tests are required for a medical device based on:',
    'mcq',
    '["A) The country where the device will be sold", "B) The nature of body contact (skin, mucosal, blood, implant) and the duration of contact (limited <24hr, prolonged 24hr-30d, permanent >30d)", "C) The price of the device", "D) The manufacturing method used"]',
    'B',
    'ISO 10993-1 (Biological Evaluation of Medical Devices — Part 1: Evaluation and Testing) uses a risk-based matrix approach: the more intimate and longer the body contact, the more comprehensive the biological evaluation required. A wound dressing (skin contact, limited duration) requires cytotoxicity and sensitization testing only. A permanent blood-contacting implant (e.g., heart valve) requires cytotoxicity, sensitization, systemic toxicity, genotoxicity, implantation, and hemocompatibility testing. This risk-based approach is what makes ISO 10993 the global standard referenced by FDA (USA), CE marking (EU), and CDSCO (India) for medical device regulatory submissions.',
    'medium', 'ISO 10993 Biocompatibility', false),

  (s_medical,
    'Medical-grade PVC for IV bags and tubing is plasticised with DEHP (di-2-ethylhexyl phthalate). DEHP is being replaced in paediatric applications because:',
    'mcq',
    '["A) DEHP makes PVC too rigid for IV tubing", "B) DEHP is classified as an endocrine disruptor — it leaches from PVC into IV fluids and blood products at levels of concern for neonates and paediatric patients with developing endocrine systems", "C) DEHP is too expensive", "D) DEHP causes PVC to discolour"]',
    'B',
    'DEHP (a phthalate plasticiser at 30-40% loading in medical PVC) leaches from PVC tubing into IV fluids and blood products — the leaching rate is highest for lipid-containing solutions and blood. DEHP is a reproductive toxin and endocrine disruptor in animal models, classified SVHC (Substance of Very High Concern) under EU REACH. EU regulations now restrict DEHP in medical devices for neonates, male infants, and pregnant women. Alternative plasticisers: ATBC (acetyl tributyl citrate — bio-based, best biocompatibility profile), TOTM (trioctyl trimellitate), DINP. This is an active regulatory and materials engineering challenge in medical PVC.',
    'hard', 'Medical PVC and DEHP', false),

  (s_medical,
    'PEEK is used in spinal interbody fusion cages primarily because:',
    'mcq',
    '["A) PEEK is the cheapest engineering polymer available", "B) PEEK is radiolucent (X-ray transparent) and can be formulated with carbon fibre to match cortical bone stiffness, avoiding stress shielding while allowing post-operative MRI monitoring", "C) PEEK is biodegradable and dissolves after fusion is complete", "D) PEEK has the highest tensile strength of all polymers"]',
    'B',
    'Three properties make PEEK ideal for spinal cages: (1) Radiolucency — PEEK does not artifact on X-ray or MRI, allowing surgeons to monitor bone fusion through the cage; titanium is radiopaque and obscures imaging. (2) Stiffness matching — CF-PEEK composites can be formulated to 15-25 GPa flexural modulus (matching cortical bone), reducing stress shielding vs titanium (110 GPa); stress shielding causes bone resorption around the implant. (3) Biocompatibility — decades of ISO 10993 testing. PEEK spinal cages are the most commercially significant polymer implant by revenue, used by Stryker, DePuy Synthes, and Medtronic in millions of surgeries annually.',
    'medium', 'PEEK Implants', false),

  (s_medical,
    'Standard PP is NOT suitable for gamma radiation sterilization (25-40 kGy) without modification because:',
    'mcq',
    '["A) PP melts at the radiation dose required", "B) Gamma radiation causes chain scission in PP — breaking backbone bonds, reducing molecular weight, and causing embrittlement — leading to brittle failure in syringes and medical components", "C) PP absorbs radiation and becomes radioactive", "D) Gamma radiation has no effect on PP"]',
    'B',
    'PP has a tertiary carbon in its backbone that is particularly susceptible to free radical formation under gamma irradiation — chain scission dominates over crosslinking, progressively reducing molecular weight. This causes syringe plungers to crack during actuation, packaging to become brittle, and components to fail mechanically. The solution: radiation-stabilised PP grades containing HALS (Hindered Amine Light Stabilisers) that scavenge the free radicals generated by gamma exposure before they cause chain scission. HMD (Hindustan Syringes) and other Indian medical moulders specify radiation-stabilised PP grades from Borealis and LyondellBasell for gamma-sterilisable products.',
    'medium', 'Sterilization Compatibility', false),

  (s_medical,
    'ISO 13485 is the Quality Management System standard specific to medical devices. Its key additional requirement vs ISO 9001 is:',
    'mcq',
    '["A) It requires lower product quality standards than ISO 9001", "B) Full traceability from raw material lot to finished device, design controls with documented design history files, sterilization validation to SAL 10⁻⁶, and supplier qualification of all component suppliers", "C) It only applies to devices sold in Europe", "D) ISO 13485 replaces all other quality standards"]',
    'B',
    'ISO 13485 extends ISO 9001 with medical device-specific requirements: Design Controls (documented design inputs, outputs, reviews, verification and validation — the design history file must be maintained for the device lifetime + retention period); Risk Management (ISO 14971 risk analysis for all foreseeable hazards); Sterilization Validation (bioburden testing, sterility assurance level SAL 10⁻⁶ validation); Supplier Controls (all suppliers including raw material suppliers must be qualified — this is why medical-grade polymer suppliers maintain ISO 13485 or ISO 9001 certification); Full Traceability (every device traceable to every raw material lot). Any polymer processor supplying to a medical device manufacturer must typically hold ISO 13485 certification.',
    'hard', 'ISO 13485 QMS', false);

  RAISE NOTICE 'All remaining subject questions seeded successfully! Total: 50 questions across 10 subjects.';
END $$;
