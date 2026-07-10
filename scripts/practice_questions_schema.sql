-- ============================================================
-- POLYMERHUB — PRACTICE QUESTIONS SCHEMA
-- Run in Supabase SQL Editor
-- ============================================================

create table if not exists public.practice_questions (
  id uuid default gen_random_uuid() primary key,
  subject_id uuid references public.subjects(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,

  -- Content
  question text not null,
  type text not null check (type in ('mcq', 'short', 'numerical')),
  options jsonb,                    -- for MCQ: ["A", "B", "C", "D"]
  correct_answer text not null,     -- for MCQ: "A", for short: model answer
  explanation text not null,        -- why this is the correct answer
  marks integer default 1,

  -- Classification
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  topic text,                       -- specific topic within subject
  is_gate_relevant boolean default false,

  -- Meta
  order_index integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- User answers tracking
create table if not exists public.user_answers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  question_id uuid references public.practice_questions(id) on delete cascade,
  selected_answer text,
  is_correct boolean,
  answered_at timestamptz default now(),
  unique(user_id, question_id)
);

-- Indexes
create index if not exists idx_questions_subject on public.practice_questions(subject_id);
create index if not exists idx_questions_difficulty on public.practice_questions(difficulty);
create index if not exists idx_questions_gate on public.practice_questions(is_gate_relevant);
create index if not exists idx_user_answers_user on public.user_answers(user_id);

-- RLS
alter table public.practice_questions enable row level security;
drop policy if exists "Questions publicly readable" on public.practice_questions;
create policy "Questions publicly readable"
  on public.practice_questions for select using (is_active = true);

alter table public.user_answers enable row level security;
drop policy if exists "Users manage own answers" on public.user_answers;
create policy "Users manage own answers"
  on public.user_answers for all using (auth.uid() = user_id);

-- ─── SEED: 5 questions per subject = 50 questions total ───────────────────────

DO $$
DECLARE
  s_polymer_chem uuid;
  s_processing uuid;
  s_mould uuid;
  s_testing uuid;
  s_rubber uuid;
  s_recycling uuid;
  s_sustainable uuid;
  s_composites uuid;
  s_entrepreneurship uuid;
  s_medical uuid;
BEGIN
  SELECT id INTO s_polymer_chem FROM subjects WHERE slug = 'polymer-chemistry';
  SELECT id INTO s_processing FROM subjects WHERE slug = 'polymer-processing';
  SELECT id INTO s_mould FROM subjects WHERE slug = 'mould-design';
  SELECT id INTO s_testing FROM subjects WHERE slug = 'polymer-testing';
  SELECT id INTO s_rubber FROM subjects WHERE slug = 'rubber-technology';
  SELECT id INTO s_recycling FROM subjects WHERE slug = 'recycling-technology';
  SELECT id INTO s_sustainable FROM subjects WHERE slug = 'sustainable-plastics';
  SELECT id INTO s_composites FROM subjects WHERE slug = 'polymer-composites';
  SELECT id INTO s_entrepreneurship FROM subjects WHERE slug = 'entrepreneurship-plastics';
  SELECT id INTO s_medical FROM subjects WHERE slug = 'medical-plastics';

  -- ── POLYMER CHEMISTRY ────────────────────────────────────────────────────────
  INSERT INTO practice_questions (subject_id, question, type, options, correct_answer, explanation, difficulty, topic, is_gate_relevant) VALUES
  (s_polymer_chem,
    'Which of the following best describes the glass transition temperature (Tg)?',
    'mcq',
    '["A) The temperature at which a polymer melts completely", "B) The temperature at which amorphous polymer regions transition from glassy to rubbery state", "C) The temperature at which crystalline regions form", "D) The temperature at which polymer chains break"]',
    'B',
    'Tg is the temperature range at which amorphous polymer segments gain sufficient mobility to transition from a rigid, glassy state to a flexible, rubbery state. It is NOT a melting point — that applies only to crystalline regions (Tm). Polymers like PVC and PS are used below their Tg (rigid/glassy); elastomers are used above their Tg (flexible/rubbery).',
    'easy', 'Glass Transition Temperature', true),

  (s_polymer_chem,
    'In addition polymerization, which step consumes the most monomer?',
    'mcq',
    '["A) Initiation", "B) Propagation", "C) Termination", "D) Chain transfer"]',
    'B',
    'Propagation is the chain growth step where thousands of monomer units are added rapidly to the growing radical chain. Initiation creates the first radical (slow, rate-determining step), and termination ends the chain. The vast majority of monomer consumption happens during propagation — a single initiation event can add 10,000+ monomer units.',
    'easy', 'Polymerization Mechanisms', true),

  (s_polymer_chem,
    'Polypropylene (PP) has a higher melting point than polyethylene (PE) despite both being polyolefins. The primary reason is:',
    'mcq',
    '["A) PP has higher molecular weight", "B) The methyl side groups in PP create steric hindrance that increases chain stiffness and crystal melting temperature", "C) PP has more crosslinks than PE", "D) PP has a higher degree of branching"]',
    'B',
    'The pendant methyl groups (–CH₃) in polypropylene create steric effects that stiffen the polymer backbone compared to the flexible –CH₂–CH₂– repeat unit of PE. Isotactic PP (where methyl groups are on the same side) packs efficiently into crystals, giving Tm of 160–170°C vs HDPE at 125–135°C. This is a direct structure-property relationship fundamental to polymer chemistry.',
    'medium', 'Structure-Property Relationships', true),

  (s_polymer_chem,
    'Which polymerization mechanism produces condensation polymers like Nylon and PET?',
    'mcq',
    '["A) Free radical addition polymerization", "B) Anionic polymerization", "C) Step-growth (condensation) polymerization", "D) Ring-opening polymerization"]',
    'C',
    'Step-growth polymerization occurs between bifunctional monomers with complementary reactive groups (–NH₂ + –COOH for Nylon; –OH + –COOH for PET), releasing a small molecule (water, HCl) at each step. Unlike addition polymerization where high MW builds immediately, step-growth polymerization requires very high conversion (>99%) to achieve high molecular weight — following the Carothers equation.',
    'medium', 'Polymerization Mechanisms', true),

  (s_polymer_chem,
    'Antioxidants are added to polyolefins primarily to:',
    'mcq',
    '["A) Increase the melting point of the polymer", "B) Act as plasticizers to improve flexibility", "C) Scavenge free radicals formed during processing and service to prevent oxidative degradation", "D) Increase the crystallinity of the polymer"]',
    'C',
    'During melt processing (extrusion, injection moulding), heat and shear generate free radicals that initiate oxidative chain scission and crosslinking — degrading molecular weight and properties. Hindered phenol antioxidants (like Irganox 1010) donate a hydrogen to terminate the radical chain without themselves becoming reactive. HALS (hindered amine light stabilizers) serve the same function during UV exposure in outdoor applications.',
    'hard', 'Polymer Degradation and Stabilization', false);

  -- ── POLYMER PROCESSING ───────────────────────────────────────────────────────
  INSERT INTO practice_questions (subject_id, question, type, options, correct_answer, explanation, difficulty, topic, is_gate_relevant) VALUES
  (s_processing,
    'During injection moulding, sink marks are most commonly caused by:',
    'mcq',
    '["A) Excessive injection speed", "B) Insufficient holding pressure or holding time, causing the core to shrink away from the solidified skin", "C) Mould temperature too low", "D) Melt temperature too low"]',
    'B',
    'Sink marks appear opposite ribs, bosses, or thick wall sections where the core shrinks inward after the skin solidifies. Insufficient holding pressure (or holding time too short — gate freezes before packing is complete) allows this shrinkage to pull the surface inward. Solutions: increase hold pressure by 10–15%, extend hold time, reduce wall thickness, or increase gate size to delay freeze-off.',
    'easy', 'Injection Moulding Defects', false),

  (s_processing,
    'The compression ratio of an extruder screw is defined as:',
    'mcq',
    '["A) Ratio of screw length to diameter (L/D ratio)", "B) Ratio of the feed zone channel depth to the metering zone channel depth", "C) Ratio of output pressure to input pressure", "D) Ratio of melt temperature to ambient temperature"]',
    'B',
    'Compression ratio = feed zone channel depth ÷ metering zone channel depth. A typical general-purpose screw has a compression ratio of 2.5:1 to 3.5:1. Higher compression ratios generate more shear heat (good for non-shear-sensitive materials like PE, PP); lower ratios are used for heat-sensitive materials like PVC and rigid materials that can degrade. This ratio determines how much the polymer is mechanically worked and melted as it travels from feed to metering zone.',
    'medium', 'Extrusion Screw Design', true),

  (s_processing,
    'In blow moulding, parison sag occurs because:',
    'mcq',
    '["A) The mould is too cold", "B) The parison stretches under its own weight before the mould closes, causing non-uniform wall thickness", "C) The blow pressure is too high", "D) The parison is too short"]',
    'B',
    'Parison sag is gravitational drawdown — the extruded tube stretches under its own weight during the time between extrusion and mould closure. The bottom of the parison becomes thinner than the top. Solutions: increase extrusion speed (reduce hang time), reduce melt temperature (increase melt strength), use parison programming (thicker at bottom of stroke) or switch to bimodal HDPE grades with higher melt strength.',
    'medium', 'Blow Moulding', false),

  (s_processing,
    'Melt Flow Index (MFI) is measured in g/10min. A higher MFI value indicates:',
    'mcq',
    '["A) Higher molecular weight and higher melt viscosity", "B) Lower molecular weight and lower melt viscosity — the polymer flows more easily", "C) Higher crystallinity", "D) Better impact resistance"]',
    'B',
    'MFI measures how much polymer flows through a standard die in 10 minutes under a specified load and temperature. Higher MFI = more flow = lower viscosity = lower molecular weight. Low MFI resins (e.g., HDPE pipe grade: MFI 0.05–0.3) have high molecular weight for strength; high MFI resins (e.g., PP fibres: MFI 20–35) flow easily for thin-wall moulding. The inverse relationship between MFI and MW is fundamental to polymer processing.',
    'easy', 'Melt Flow Index', true),

  (s_processing,
    'Flash (thin fins at the parting line) in injection moulding is primarily caused by:',
    'mcq',
    '["A) Insufficient injection pressure", "B) Mould clamping force insufficient for the cavity pressure × projected area, or damaged parting line", "C) Melt temperature too low", "D) Short holding time"]',
    'B',
    'Flash occurs when molten plastic escapes the cavity — either because clamping force is insufficient (cavity pressure × projected area > clamp force) or because the parting line is worn/damaged. Required clamp force = projected area (cm²) × cavity pressure (bar) ÷ 100. Solutions: verify clamp tonnage calculation, reduce injection/hold pressure, inspect and polish parting line, or use a larger machine.',
    'medium', 'Injection Moulding Defects', false);

  -- ── MOULD DESIGN ─────────────────────────────────────────────────────────────
  INSERT INTO practice_questions (subject_id, question, type, options, correct_answer, explanation, difficulty, topic, is_gate_relevant) VALUES
  (s_mould,
    'Draft angles in injection moulds are required primarily to:',
    'mcq',
    '["A) Reduce cycle time by improving cooling", "B) Allow easy ejection of the part from the mould without surface damage", "C) Increase the strength of the moulded part", "D) Control the wall thickness of the part"]',
    'B',
    'Draft angles (typically 0.5°–3° per side depending on surface finish and material) taper the part walls so they release cleanly from the mould core and cavity during ejection. Without draft, parts grip the mould surface (especially textured surfaces), causing drag marks, surface tearing, or part distortion. Deeper draws and textured surfaces require larger draft angles — textured surfaces typically need 1° per 0.025mm of texture depth.',
    'easy', 'Draft Angles and Ejection', false),

  (s_mould,
    'A submarine (tunnel) gate is used when:',
    'mcq',
    '["A) The part requires maximum gate size for easy filling", "B) Automatic degating is required — the gate breaks automatically as the part is ejected", "C) The part has a very thin wall section", "D) The runner system needs to be balanced"]',
    'B',
    'Submarine gates tunnel through the mould at an angle and automatically shear off as the part ejects from the mould — eliminating the manual degating step required with sprue, edge, and fan gates. They leave a small witness mark on the part but allow fully automatic production. They are typically used on small to medium parts where the gate mark location is not cosmetically critical and where automation is valued.',
    'medium', 'Gate Design', false),

  (s_mould,
    'The primary purpose of venting in an injection mould is to:',
    'mcq',
    '["A) Control the melt temperature inside the mould", "B) Allow trapped air and gas to escape as the mould fills, preventing burn marks and short shots", "C) Reduce the clamping force required", "D) Speed up the cooling process"]',
    'B',
    'As melt flows into the cavity, it compresses the air ahead of it. Without vents, this air cannot escape — it compresses adiabatically to very high temperatures (the "diesel effect"), burning the polymer and causing black marks. Vents are typically 0.02–0.05mm deep (thin enough to prevent plastic flow but allow air escape) at the last-fill points identified by flow simulation.',
    'easy', 'Mould Venting', false),

  (s_mould,
    'Warpage in injection moulded parts is most commonly caused by:',
    'mcq',
    '["A) Insufficient injection speed", "B) Non-uniform cooling — areas that cool faster shrink more, creating differential shrinkage that distorts the part", "C) Too much holding pressure", "D) Incorrect gate location only"]',
    'B',
    'Warpage is differential shrinkage — when different regions of the part cool and shrink at different rates, the resulting dimensional mismatch creates internal stress that distorts the part after ejection. Primary causes: non-uniform cooling channel layout, thickness variation, asymmetric gate location creating differential flow orientation, and material selection (high-shrinkage materials like unfilled PP are most susceptible). Solution: Moldflow simulation + uniform wall thickness + balanced cooling.',
    'medium', 'Warpage and Shrinkage', false),

  (s_mould,
    'In a balanced runner system, the primary goal is to:',
    'mcq',
    '["A) Minimize the amount of material used in the runner", "B) Ensure all cavities fill simultaneously at equal pressure, producing uniform parts across the mould", "C) Maximize the cooling rate of the runner", "D) Reduce the number of gates required"]',
    'B',
    'In a balanced runner, all flow paths from the sprue to each gate have equal length and cross-section, ensuring identical filling time, pressure, and temperature at every cavity. Unbalanced runners cause some cavities to fill before others — early-filling cavities become over-packed (flash, dimensional excess) while late-filling cavities may short-shot. Naturally balanced runners (H-tree or radial layout) achieve this geometrically; artificially balanced runners adjust cross-sections.',
    'medium', 'Runner System Design', false);

  -- ── POLYMER TESTING ──────────────────────────────────────────────────────────
  INSERT INTO practice_questions (subject_id, question, type, options, correct_answer, explanation, difficulty, topic, is_gate_relevant) VALUES
  (s_testing,
    'The key difference between Izod and Charpy impact tests is:',
    'mcq',
    '["A) Izod uses a larger pendulum weight", "B) In Izod the specimen is cantilevered (vertical, one end fixed); in Charpy the specimen is supported at both ends (horizontal beam)", "C) Charpy measures tensile impact, Izod measures compressive impact", "D) Izod is used for metals only, Charpy for plastics only"]',
    'B',
    'Both tests use a swinging pendulum to break a notched specimen and measure the energy absorbed. The critical difference: Izod specimen is clamped vertically at one end (cantilever) and struck near the free top end. Charpy specimen is supported at both ends (simply supported beam) and struck in the middle. Izod is more common for plastics in India (IS 13360 Part 5); Charpy is the European standard (ISO 179). Results are not directly comparable between methods.',
    'easy', 'Impact Testing', true),

  (s_testing,
    'A polymer sample is tested by DSC (Differential Scanning Calorimetry). The thermogram shows an endothermic peak at 165°C. This most likely represents:',
    'mcq',
    '["A) The glass transition temperature (Tg)", "B) An oxidative degradation event", "C) Melting of crystalline regions (Tm)", "D) A crosslinking reaction"]',
    'C',
    'An endothermic peak in DSC indicates a process that absorbs heat — melting of crystalline regions requires heat input and produces a characteristic sharp endothermic peak. Tg appears as a step change (inflection) in heat flow, not a peak. Oxidative degradation and crosslinking typically appear as exothermic events. A Tm of ~165°C is consistent with isotactic polypropylene, and DSC is the standard method for accurately measuring both Tg and Tm.',
    'medium', 'Thermal Analysis (DSC)', true),

  (s_testing,
    'Shore hardness testing measures:',
    'mcq',
    '["A) The elastic modulus of the polymer", "B) The resistance to permanent indentation by a standardized indenter under a specified load", "C) The tensile strength of the polymer surface", "D) The scratch resistance of the polymer"]',
    'B',
    'Shore hardness measures indentation resistance — a standardized indenter (needle or frustum shape) is pressed into the material under a known load, and the depth of penetration is converted to a hardness value (0–100 scale). Shore A is used for soft rubbers and elastomers (0–100 Shore A); Shore D for semi-rigid and rigid plastics. A Shore A 60 rubber is significantly softer than a Shore D 60 polymer — the two scales are different instruments and results.',
    'easy', 'Shore Hardness', false),

  (s_testing,
    'In tensile testing of plastics (ASTM D638), the tensile strength is calculated as:',
    'mcq',
    '["A) Maximum load divided by original cross-sectional area", "B) Maximum load divided by final cross-sectional area at break", "C) Load at yield point divided by gauge length", "D) Energy absorbed divided by volume of specimen"]',
    'A',
    'Tensile strength (also called Ultimate Tensile Strength, UTS) = Maximum load (N) ÷ Original cross-sectional area (mm²), expressed in MPa. Using the original (not deformed) cross-section is called engineering stress. Some materials (especially ductile metals) show necking before failure, but for most plastics, tensile strength and fracture stress are close. The test also measures elongation at break (%) = (final gauge length - original gauge length) ÷ original gauge length × 100.',
    'easy', 'Tensile Testing', true),

  (s_testing,
    'Heat Deflection Temperature (HDT) at 1.8 MPa is relevant because:',
    'mcq',
    '["A) It measures the maximum continuous service temperature under structural load — above this temperature, the part will deform in service", "B) It determines the processing temperature for injection moulding", "C) It measures the temperature at which the polymer crystallizes", "D) It is only relevant for rubber materials"]',
    'A',
    'HDT (also called DTUL — Deflection Temperature Under Load) measures the temperature at which a standard beam specimen deflects 0.25mm under a specified bending stress (0.45 MPa or 1.8 MPa). It represents the practical upper service temperature for structural applications under load. Glass-filled grades have significantly higher HDT than unfilled grades — 30% GF Nylon 6 has HDT >200°C at 1.8 MPa vs ~65°C for unfilled Nylon 6 (because glass fibres carry the load above Tg).',
    'medium', 'Thermal Testing', true);

  -- ── RUBBER TECHNOLOGY ────────────────────────────────────────────────────────
  INSERT INTO practice_questions (subject_id, question, type, options, correct_answer, explanation, difficulty, topic, is_gate_relevant) VALUES
  (s_rubber,
    'In rubber vulcanization using sulphur, the role of zinc oxide and stearic acid is to:',
    'mcq',
    '["A) Act as the primary crosslinking agent replacing sulphur", "B) Act as activators — they react together to form zinc stearate which activates the accelerator, dramatically increasing crosslink density and cure speed", "C) Prevent the rubber from burning during processing", "D) Increase the carbon black loading capacity"]',
    'B',
    'ZnO and stearic acid together form zinc stearate in situ, which activates the accelerator (e.g., CBS, TBBS) by forming highly reactive zinc-accelerator complexes. These complexes dramatically increase the rate of sulphur crosslink formation — without activators, cure time would be 10–50× longer. This is why ZnO (5 phr) and stearic acid (2 phr) appear in virtually every sulphur-cured rubber compound, alongside the accelerator.',
    'medium', 'Vulcanization Chemistry', true),

  (s_rubber,
    'EPDM rubber is preferred for automotive weatherstripping and roofing membranes primarily because:',
    'mcq',
    '["A) It has the best oil resistance of all synthetic rubbers", "B) Its saturated backbone (no double bonds in the main chain) gives outstanding resistance to ozone, UV, and weathering", "C) It has the lowest cost of all synthetic rubbers", "D) It has the highest tensile strength of all elastomers"]',
    'B',
    'EPDM (Ethylene Propylene Diene Monomer) has a fully saturated backbone — the diene monomer introduces unsaturation into a pendant side chain only (not the main chain). Ozone and UV attack double bonds in the main chain (which is why NR, SBR, and BR crack outdoors without protection). Since EPDM main chain has no double bonds, ozone and UV cannot attack it — giving exceptional outdoor durability without antiozonants. EPDM''s weakness: poor oil/fuel resistance (saturated backbone does not swell in non-polar solvents effectively).',
    'medium', 'Synthetic Rubber Selection', false),

  (s_rubber,
    'Carbon black N220 grade is used in tyre tread compounds (rather than N660) because:',
    'mcq',
    '["A) N220 is cheaper than N660", "B) N220 has smaller particle size and higher surface area, giving greater reinforcement and abrasion resistance", "C) N220 has larger particle size, making it easier to disperse", "D) N220 provides better electrical conductivity"]',
    'B',
    'Carbon black grades are classified by particle size — the N-number relates to the ASTM particle size category. N220 (fine grade) has particle size ~20nm and very high surface area (~110 m²/g), creating more surface contact with rubber polymer chains = stronger physical bonds = better reinforcement, tensile strength, and abrasion resistance. N660 (coarse grade) has particle size ~60nm — lower reinforcement but easier to process and lower heat buildup. Tyre treads need maximum abrasion resistance → N220; lower-stress applications → N550–N770.',
    'hard', 'Carbon Black Reinforcement', false),

  (s_rubber,
    'The Mooney viscosity [ML(1+4) at 100°C] of a rubber compound primarily indicates:',
    'mcq',
    '["A) The tensile strength of the vulcanized rubber", "B) The molecular weight and processability of the raw rubber — higher Mooney = higher MW = harder to process", "C) The degree of crosslinking achieved after vulcanization", "D) The carbon black loading in the compound"]',
    'B',
    'Mooney viscosity is measured using a rotating disc in raw rubber at 100°C — it indicates the compound''s resistance to shear flow, which correlates with molecular weight distribution. ML(1+4) = Large rotor, 1 minute preheat + 4 minutes test time. High Mooney viscosity (e.g., ML 80) means high MW rubber — better mechanical properties after vulcanization but harder to mix and process. Most processing lines prefer Mooney 45–70 for processability without sacrificing too much property.',
    'medium', 'Rubber Characterization', false),

  (s_rubber,
    'In tyre construction, the innerliner is made from halobutyl rubber (chlorobutyl or bromobutyl) because:',
    'mcq',
    '["A) Halobutyl has the best abrasion resistance of all rubbers", "B) Halobutyl''s saturated backbone with halogen atoms gives exceptional air impermeability — critical for tubeless tyre pressure retention", "C) Halobutyl is the cheapest rubber available", "D) Halobutyl has the best adhesion to steel belts"]',
    'B',
    'Butyl rubber (IIR) is an isobutylene-isoprene copolymer with very low isoprene content — the near-saturated, tightly packed molecular structure gives it the lowest gas permeability of any commercial rubber (10× lower than NR). Halogenation (chloro- or bromo-butyl) improves adhesion to adjacent diene rubbers (NR/SBR carcass) via co-vulcanization. Without an impermeable innerliner, a tubeless tyre would lose pressure rapidly through the natural rubber carcass.',
    'hard', 'Tyre Construction', false);

  -- ── RECYCLING TECHNOLOGY ─────────────────────────────────────────────────────
  INSERT INTO practice_questions (subject_id, question, type, options, correct_answer, explanation, difficulty, topic, is_gate_relevant) VALUES
  (s_recycling,
    'In mechanical recycling, NIR (Near-Infrared) spectroscopy sorting is used because:',
    'mcq',
    '["A) It separates plastics by colour only", "B) Each polymer has a unique NIR absorption spectrum, allowing automatic identification and separation with >98% accuracy", "C) It removes metal contamination from the plastic stream", "D) It measures the molecular weight of incoming plastic waste"]',
    'B',
    'NIR spectroscopy exploits the fact that different polymers absorb near-infrared light at characteristic wavelengths — PET, HDPE, PP, PVC, PS, and other resins each have a unique spectral fingerprint. High-speed NIR sensors scan each item, and air jets eject specific resin types into separate streams in milliseconds. This enables >98% purity sorting vs ~85% for manual sorting, and is the technology transformation replacing labor-intensive hand-sorting in modern Indian recycling plants.',
    'medium', 'Mechanical Recycling Sorting', false),

  (s_recycling,
    'India''s EPR (Extended Producer Responsibility) framework under the Plastic Waste Management Rules 2022 requires:',
    'mcq',
    '["A) Only export-oriented companies to register", "B) All Producers, Importers, and Brand Owners (PIBOs) of plastic packaging to register on the CPCB EPR portal and meet annual collection and recycling targets", "C) Only plastic manufacturers to pay recycling fees", "D) EPR registration only for companies with turnover above ₹100 crore"]',
    'B',
    'India''s EPR framework under PWM Rules 2022 (amended) mandates ALL PIBOs — any company that puts plastic packaging into the Indian market — to register on the CPCB EPR portal, submit annual plastic footprint declarations, and meet progressive collection+recycling targets (reaching 60% by 2025-26). Companies that cannot meet targets themselves must purchase EPR certificates from registered recyclers. This creates a legally mandated market for certified recycled material, fundamentally changing recycling economics.',
    'medium', 'EPR Framework India', false),

  (s_recycling,
    'Pyrolysis of plastic waste primarily produces:',
    'mcq',
    '["A) Virgin-quality polymer pellets", "B) Pyrolysis oil (fuel range hydrocarbons), syngas, and char — which can be used as fuel or as refinery feedstock", "C) Carbon black only", "D) Monomers identical to virgin petrochemical feedstock"]',
    'B',
    'Pyrolysis thermally cracks long polymer chains (at 400–600°C in the absence of oxygen) into shorter hydrocarbon molecules — producing pyrolysis oil (~50–60% yield), syngas (~20–30%), and char (~10–20%). The oil can be used as industrial fuel or — higher value — co-processed at oil refineries as cracker feedstock to produce new polymers. Unlike depolymerization, pyrolysis does NOT produce the original monomers (that requires depolymerization reactions specific to condensation polymers like PET).',
    'medium', 'Chemical Recycling', false),

  (s_recycling,
    'PETase enzyme (discovered in Ideonella sakaiensis) achieves recycling of PET by:',
    'mcq',
    '["A) Melting PET at high temperature and reforming it", "B) Hydrolyzing the ester bonds in PET''s backbone using water, producing TPA and EG monomers", "C) Converting PET into carbon black for rubber compounding", "D) Crosslinking PET chains to improve its properties"]',
    'B',
    'PETase is a hydrolase enzyme that cleaves PET''s ester bonds using water molecules in a targeted enzymatic reaction — producing terephthalic acid (TPA) and ethylene glycol (EG), the exact monomers used to synthesize virgin PET. This enables true circular recycling: plastic in → monomers out → new virgin-quality plastic. Commercial-scale implementation by Carbios (France) at 72°C uses thermophilic FAST-PETase variants engineered for industrial speed, handling coloured and contaminated PET that mechanical recycling cannot process.',
    'hard', 'Enzymatic Recycling', false),

  (s_recycling,
    'Life Cycle Assessment (LCA) of recycled PET typically shows a Global Warming Potential (GWP) approximately how much lower than virgin PET?',
    'mcq',
    '["A) 5–10% lower", "B) 30–40% lower", "C) 60–75% lower", "D) Greater than virgin PET (recycling has higher carbon footprint)"]',
    'C',
    'Mechanical recycling of PET bottles into rPET pellets requires significantly less energy than producing virgin PET from naphtha → paraxylene → terephthalic acid → polymerization. Published LCAs (Shen et al., WRAP UK, Carbios) consistently show rPET has 60–75% lower GWP than virgin PET, and approximately 50–65% lower fossil resource consumption. This is the core environmental and commercial argument for brand commitments to recycled content under EU PPWR and India''s EPR targets.',
    'hard', 'Life Cycle Assessment', false);

  -- ── SUSTAINABLE PLASTICS ─────────────────────────────────────────────────────
  INSERT INTO practice_questions (subject_id, question, type, options, correct_answer, explanation, difficulty, topic, is_gate_relevant) VALUES
  (s_sustainable,
    'Which of the following is both bio-based AND biodegradable?',
    'mcq',
    '["A) Bio-PET", "B) Polylactic Acid (PLA)", "C) Bio-PE", "D) Polyethylene Furanoate (PEF)"]',
    'B',
    'Polylactic acid (PLA) is synthesized from corn starch or sugarcane (bio-based) and is compostable/biodegradable under industrial composting conditions (60°C, high humidity). Bio-PE and Bio-PET are chemically identical to their fossil-based counterparts — they are bio-based (drop-ins) but NOT biodegradable. PEF is bio-based with high barrier but is only slowly biodegradable.',
    'medium', 'Bioplastics Classification', true),

  (s_sustainable,
    'Industrial composting of PLA requires a temperature of approximately:',
    'mcq',
    '["A) 25°C (ambient room temperature)", "B) 55–60°C with high humidity", "C) Above 100°C", "D) Composting happens at any temperature"]',
    'B',
    'PLA is stable under normal ambient conditions. For biodegradation to begin, it must undergo initial abiotic hydrolysis — which requires temperature above its Tg (typically 55–60°C) and high moisture. In industrial composting facilities, these conditions trigger hydrolysis, breaking the polymer into oligomers that microbes can then digest into CO2 and water. Home composting (ambient temperature) will NOT degrade standard PLA.',
    'medium', 'Biodegradation Mechanisms', false),

  (s_sustainable,
    'The building block monomer of Polylactic Acid (PLA) is:',
    'mcq',
    '["A) Ethylene glycol", "B) Lactic acid (or lactide dimer)", "C) Adipic acid", "D) Vinyl chloride"]',
    'B',
    'PLA is produced by fermenting dextrose (from corn starch or sugarcane) into lactic acid, followed by condensation or, commercially, catalytic ring-opening polymerization of the cyclic lactide dimer. This allows high molecular weight PLA synthesis without removing reaction water continuously.',
    'easy', 'Biopolymers Synthesis', true),

  (s_sustainable,
    'Which certification standard is used globally to verify industrial compostability of plastics?',
    'mcq',
    '["A) ISO 9001", "B) EN 13432 / ASTM D6400", "C) ISO 14001", "D) IS 12267"]',
    'B',
    'EN 13432 (Europe) and ASTM D6400 (US) specify testing criteria for compostable packaging — requiring >90% biodegradation within 180 days, disintegration of the material, no toxic residues, and no negative effects on plant growth (ecotoxicity). In India, IS/ISO 17088 is the matching national standard.',
    'medium', 'Standards and Certification', false),

  (s_sustainable,
    'Bioplastics like Polyhydroxyalkanoates (PHAs) are synthesized by:',
    'mcq',
    '["A) Chemical polymerization of fossil crude", "B) Direct intracellular accumulation in bacteria as energy storage reserves during nutrient imbalance", "C) Catalytic cracking of vegetable oil", "D) Sintering agricultural waste"]',
    'B',
    'PHAs are natural polyesters accumulated intracellularly by bacteria (e.g. Cupriavidus necator) under conditions of excess carbon source but limited nitrogen or phosphorus. The bacteria store PHA as carbon reserves (similar to fat in humans). PHA is harvested by lysing the cells, and it is 100% bio-based and marine-biodegradable.',
    'hard', 'PHAs Synthesis', true);

  -- ── POLYMER COMPOSITES ───────────────────────────────────────────────────────
  INSERT INTO practice_questions (subject_id, question, type, options, correct_answer, explanation, difficulty, topic, is_gate_relevant) VALUES
  (s_composites,
    'In fibre-reinforced composites, the primary function of the matrix (e.g., epoxy resin) is to:',
    'mcq',
    '["A) Carry the bulk of the tensile load", "B) Bind the fibres together, transfer load between fibres via shear, and protect them from environmental damage", "C) Reduce the weight of the composite", "D) Prevent chemical degradation of the structure"]',
    'B',
    'The fibres carry the main structural tensile load. The matrix (thermoset or thermoplastic) holds the fibres in the desired orientation, distributes and transfers the applied load to the high-strength fibres via shear stress at the interface, and protects the fibres from abrasion and environmental corrosion. Without matrix shear transfer, individual fibres would fail independently.',
    'easy', 'Composite Fundamentals', true),

  (s_composites,
    'Which manufacturing process is most suitable for producing hollow composite pipes with high hoop strength?',
    'mcq',
    '["A) Pultrusion", "B) Filament winding", "C) Resin Transfer Moulding (RTM)", "D) Compression moulding"]',
    'B',
    'Filament winding involves winding continuous, resin-impregnated fibre rovings onto a rotating mandrel at controlled angles. It is the premier method for manufacturing hollow cylindrical structures (pipes, chemical tanks, pressure vessels) because the winding angle can be adjusted to optimize hoop strength (radial pressure resistance) and axial strength.',
    'medium', 'Composites Processing', false),

  (s_composites,
    'The critical fibre length (Lc) in short-fibre composites represents:',
    'mcq',
    '["A) The maximum length of fibre that can be mixed into an extruder screw", "B) The minimum length at which the fibre can carry stress up to its ultimate tensile strength without debonding", "C) The length of fibre required to cause resin degradation", "D) The standard length of glass fibres used in continuous mats"]',
    'B',
    'Lc = (Ultimate Tensile Strength of fibre × Fibre Diameter) ÷ (2 × Shear Yield Strength of interface). If fibre length is less than Lc, the matrix will shear and slide off the fibre before the fibre can reach its breaking strength (resulting in pull-out failure rather than reinforcement). For effective reinforcement, actual fibre length should be at least 10× Lc.',
    'hard', 'Micro-Mechanics of Composites', true),

  (s_composites,
    'Carbon fibres are manufactured primarily from which precursor polymer?',
    'mcq',
    '["A) Polyethylene (PE)", "B) Polyacrylonitrile (PAN)", "C) Polyethylene Terephthalate (PET)", "D) Polyvinyl Chloride (PVC)"]',
    'B',
    'Over 90% of commercial carbon fibres are made from polyacrylonitrile (PAN) precursor fibres. The process involves spinning PAN fibres, stabilization/oxidation at 200–300°C (forming a ladder polymer), carbonization in nitrogen at 1000–1500°C to remove non-carbon elements, and optional graphitization above 2000°C to orient graphite sheets for ultra-high modulus.',
    'medium', 'Carbon Fibre Manufacture', true),

  (s_composites,
    'A sheet moulding compound (SMC) is:',
    'mcq',
    '["A) A dry powder used for rotational moulding", "B) A ready-to-mould leather-like sheet of carbon/epoxy prepreg", "C) A compression-mouldable mixture of chopped glass fibres, thermoset polyester resin, fillers, and additives, sheeted between plastic carrier films", "D) A specialty thermoplastic extrusion grade"]',
    'C',
    'SMC is an integrated sheet material consisting of chopped glass strands (~25–50mm) sandwiched between layers of filled polyester or vinyl ester paste. It is aged (thickened) to a leather-like consistency, cut into charges, and compression moulded in hot matched metal dies to make automotive panels, electric boxes, and structural components.',
    'medium', 'SMC Molding', false);

  -- ── ENTREPRENEURSHIP IN PLASTICS ─────────────────────────────────────────────
  INSERT INTO practice_questions (subject_id, question, type, options, correct_answer, explanation, difficulty, topic, is_gate_relevant) VALUES
  (s_entrepreneurship,
    'Which Indian government scheme provides unsecured loans up to ₹10 lakh for micro and small manufacturing units?',
    'mcq',
    '["A) Startup India Seed Fund", "B) Pradhan Mantri MUDRA Yojana (PMMY)", "C) PLI Scheme", "D) Make in India scheme"]',
    'B',
    'The MUDRA scheme provides collateral-free loans up to ₹10 lakh to micro/small business enterprises in manufacturing, trading, and services. Loans are classified as Shishu (up to ₹50,000), Kishor (₹50,000 to ₹5 lakh), and Tarun (₹5 lakh to ₹10 lakh). For a small scale plastics recycling or bag-making start-up, MUDRA represents the primary banking entry point in India.',
    'easy', 'Financing and Schemes', false),

  (s_entrepreneurship,
    'In a plastics processing factory budget, power costs are classified as:',
    'mcq',
    '["A) Fixed cost", "B) Variable cost", "C) Capital expenditure (CapEx)", "D) Sunk cost"]',
    'B',
    'Variable costs change in direct proportion to the volume of production (raw material resins, electricity consumed by machines, packaging). Fixed costs remain constant regardless of output (factory rent, machine EMI, permanent staff salary). CapEx is the initial investment in plant machinery and land.',
    'easy', 'Financial Planning', false),

  (s_entrepreneurship,
    'The "break-even point" (BEP) in a manufacturing startup represents the production volume where:',
    'mcq',
    '["A) The company becomes debt-free", "B) Total revenue equals total cost (fixed + variable), resulting in zero profit and zero loss", "C) The startup qualifies for government subsidies", "D) Capital expenditure is completely written off"]',
    'B',
    'BEP = Fixed Costs ÷ (Selling Price per unit - Variable Cost per unit). At this point, the gross contribution margin covers the fixed expenses completely. Any production above the BEP generates net profit. Calculating BEP is critical for startup viability analysis.',
    'medium', 'Business Viability', false),

  (s_entrepreneurship,
    'What is the standard GST rate applicable on recycled plastic granules in India?',
    'mcq',
    '["A) 5%", "B) 12%", "C) 18%", "D) 28%"]',
    'C',
    'Recycled plastic granules, virgin polymers, and plastic products in India are subject to a standard GST rate of 18%. Recyclers collect waste (often tax-free from informal collectors) and pay 18% GST on their output granules, which is offset by input tax credits (ITC) on factory electricity and chemicals.',
    'medium', 'GST and Taxation', false),

  (s_entrepreneurship,
    'A CPCB (Central Pollution Control Board) registration is mandatory for starting which type of plastic business in India?',
    'mcq',
    '["A) A plastic product distribution shop", "B) A plastic processing or recycling unit, under the PWM Rules 2016", "C) A general CAD design agency", "D) A retail packaging shop"]',
    'B',
    'Every plastic waste recycling unit and manufacturing unit of plastic packaging must obtain registration from the State Pollution Control Board (SPCB) or CPCB. Operating without Consent to Establish (CTE) and Consent to Operate (CTO) is a violation of environmental laws.',
    'easy', 'Compliance and Licensing', false);

  -- ── MEDICAL PLASTICS ─────────────────────────────────────────────────────────
  INSERT INTO practice_questions (subject_id, question, type, options, correct_answer, explanation, difficulty, topic, is_gate_relevant) VALUES
  (s_medical,
    'Which standard series defines the biological evaluation and biocompatibility testing requirements for medical devices?',
    'mcq',
    '["A) ISO 9001", "B) ISO 13485", "C) ISO 10993", "D) ASTM D1238"]',
    'C',
    'ISO 10993 is the global standard series for biological evaluation of medical devices. It evaluates cytotoxicity, sensitization, irritation, systemic toxicity, subchronic toxicity, genotoxicity, and hemocompatibility of plastics and polymers before they can be certified for clinical use.',
    'easy', 'Biocompatibility Standards', true),

  (s_medical,
    'Why is PEEK (Polyether Ether Ketone) widely used in spinal fusion cages and orthopedic implants?',
    'mcq',
    '["A) It dissolves slowly inside the body to release medication", "B) It has an elastic modulus close to human cortical bone, reducing stress shielding, is highly radiolucent, and survives repeated autoclave sterilization", "C) It is the cheapest engineering plastic available", "D) It can be injected directly into the patient"]',
    'B',
    'PEEK''s modulus (~3.6–4 GPa unfilled) matches human bone closer than titanium or steel, avoiding "stress shielding" where stiff metal carries all load, causing surrounding bone to atrophy. It is radiolucent (invisible under X-ray, allowing doctors to monitor bone growth) and survives autoclave sterilization.',
    'medium', 'PEEK Implantable Polymers', true),

  (s_medical,
    'The primary concern when using plasticized PVC in medical blood bags and IV tubing is:',
    'mcq',
    '["A) The plastic becomes brittle at body temperature", "B) Leaching of phthalate plasticizers (such as DEHP), which are suspected endocrine disruptors, into the blood or lipid-based medications", "C) The material cannot be sterilized by any method", "D) PVC is too stiff for flexible bags"]',
    'B',
    'Flexible PVC contains up to 40% plasticizer (usually DEHP). Because plasticizers are physically blended rather than chemically bonded, they can leach out over time into lipid-rich fluids (blood, nutrition emulsions). Due to health concerns, the medical industry is transitioning to DEHP-free plasticizers (like TOTM) or alternative materials (TPEs, polyolefins).',
    'medium', 'Plasticizer Leaching', true),

  (s_medical,
    'Which sterilization method is NOT compatible with Teflon (PTFE) medical components?',
    'mcq',
    '["A) Autoclaving (steam sterilization)", "B) Gamma radiation (triggers chain scission and degradation of Teflon''s mechanical properties)", "C) Ethylene Oxide (EtO) gas", "D) Dry heat sterilization"]',
    'B',
    'Teflon (PTFE) is highly sensitive to radiation. Gamma radiation triggers extensive chain scission in the fluoropolymer, destroying its tensile strength and making it brittle and crumbly. Autoclaving, EtO, and electron beam are preferred sterilization methods for PTFE.',
    'hard', 'Sterilization Compatibility', true),

  (s_medical,
    'A "Class VI" rating on a medical-grade polymer datasheet indicates:',
    'mcq',
    '["A) The material is highly flammable", "B) The polymer meets the highest biocompatibility tier defined by the USP (United States Pharmacopeia) Class VI testing protocol", "C) The material is suitable for continuous contact over 10 years", "D) The plastic is biodegradable in sea water"]',
    'B',
    'USP Class VI is a widely recognized medical-grade plastic classification. It requires passing three in vivo biological tests: acute systemic toxicity, intracutaneous reactivity, and muscle implantation. Passing USP Class VI is a primary prerequisite for medical packaging and device housings.',
    'easy', 'USP Class VI Testing', false);

  RAISE NOTICE 'Practice questions seeded successfully!';
END $$;
