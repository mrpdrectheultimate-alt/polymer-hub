require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const questionsData = [
  // SUSTAINABLE PLASTICS
  {
    subject_slug: 'sustainable-plastics',
    question: 'PLA (Polylactic Acid) is described as "bio-based" and "biodegradable." In practice, PLA degrades only under:',
    type: 'mcq',
    options: ["A) Normal soil composting conditions within 3–6 months", "B) Industrial composting conditions — 58°C minimum, high humidity, microbial activity — not in home compost or landfill", "C) Any aqueous environment within 2 years", "D) Direct sunlight exposure for 6 months"],
    correct_answer: 'B',
    explanation: 'This is one of the most important misconceptions in sustainable plastics. PLA requires industrial composting conditions (58–60°C, >90% relative humidity, active microbial population) to biodegrade in 3–6 months.',
    difficulty: 'medium',
    topic: 'Bioplastics — PLA Reality',
    is_gate_relevant: false,
  },
  {
    subject_slug: 'sustainable-plastics',
    question: 'The primary commercial advantage of "drop-in" bio-based polymers (like bio-PE and bio-PET) over conventional fossil-based equivalents is:',
    type: 'mcq',
    options: ["A) They are biodegradable, solving end-of-life plastic pollution", "B) They are chemically identical to fossil-based equivalents, requiring no changes to processing equipment, product specifications, or recycling infrastructure", "C) They have superior mechanical properties", "D) They cost less than fossil-based polymers"],
    correct_answer: 'B',
    explanation: 'Drop-in bio-based polymers are chemically identical to their fossil-based counterparts — same molecular structure, same properties, same processing conditions, same recycling codes.',
    difficulty: 'medium',
    topic: 'Bio-based vs Biodegradable',
    is_gate_relevant: false,
  },
  {
    subject_slug: 'sustainable-plastics',
    question: 'PHA (Polyhydroxyalkanoate) is produced by:',
    type: 'mcq',
    options: ["A) Chemical synthesis from petroleum-derived monomers", "B) Ring-opening polymerization of lactide", "C) Bacterial fermentation — microorganisms accumulate PHA as an intracellular energy storage polymer when grown under nutrient limitation", "D) Hydrolysis of natural starch"],
    correct_answer: 'C',
    explanation: 'PHA is produced by biological synthesis — bacteria accumulate PHA granules intracellularly when grown in carbon-rich but nitrogen-limited conditions.',
    difficulty: 'hard',
    topic: 'PHA Bioplastics',
    is_gate_relevant: false,
  },
  {
    subject_slug: 'sustainable-plastics',
    question: 'The EU Packaging and Packaging Waste Regulation (PPWR) mandates that all plastic beverage bottles must contain minimum recycled content of:',
    type: 'mcq',
    options: ["A) 10% by 2025", "B) 25% by 2025, rising to 30% by 2030 for PET bottles; all plastic packaging 35% by 2030", "C) 50% by 2025", "D) 100% by 2030"],
    correct_answer: 'B',
    explanation: 'EU PPWR sets mandatory minimum recycled content: PET beverage bottles ≥25% by 2025 and ≥30% by 2030; all plastic packaging ≥35% by 2040.',
    difficulty: 'hard',
    topic: 'Global Plastics Policy',
    is_gate_relevant: true,
  },
  {
    subject_slug: 'sustainable-plastics',
    question: 'Mono-material packaging design is preferred for recycling because:',
    type: 'mcq',
    options: ["A) It uses less total material weight", "B) Single-material packaging can be sorted and recycled through existing infrastructure; multi-material laminates (e.g., PE/Nylon/PE) are impossible to separate and go to landfill or incineration", "C) Mono-material packaging is stronger than multi-layer laminates", "D) It requires less printing ink"],
    correct_answer: 'B',
    explanation: 'Single-material packaging can be sorted and recycled through existing infrastructure; multi-material laminates are impossible to separate mechanically.',
    difficulty: 'medium',
    topic: 'Sustainable Packaging Design',
    is_gate_relevant: false,
  },

  // POLYMER COMPOSITES
  {
    subject_slug: 'polymer-composites',
    question: 'The "rule of mixtures" in composite materials predicts longitudinal (fibre direction) tensile modulus as:',
    type: 'mcq',
    options: ["A) E_c = E_f × V_f only (matrix ignored)", "B) E_c = E_f × V_f + E_m × V_m (weighted average by volume fraction)", "C) E_c = 1/(V_f/E_f + V_m/E_m) (harmonic mean)", "D) E_c = √(E_f × E_m)"],
    correct_answer: 'B',
    explanation: 'The rule of mixtures for longitudinal loading: E_c = E_f × V_f + E_m × V_m, where E_f and E_m are fibre and matrix moduli, V_f and V_m are volume fractions.',
    difficulty: 'hard',
    topic: 'Composite Mechanics',
    is_gate_relevant: true,
  },
  {
    subject_slug: 'polymer-composites',
    question: 'Carbon fibre reinforced polymer (CFRP) is preferred over glass fibre (GFRP) for aerospace applications primarily because:',
    type: 'mcq',
    options: ["A) Carbon fibre is cheaper than glass fibre", "B) Carbon fibre has much higher specific stiffness (modulus/density) — achieving steel-level stiffness at one-fifth the weight", "C) Carbon fibre has better chemical resistance", "D) Carbon fibre is easier to process by hand layup"],
    correct_answer: 'B',
    explanation: 'Carbon fibre has much higher specific stiffness (modulus/density) — achieving steel-level stiffness at one-fifth the weight.',
    difficulty: 'medium',
    topic: 'CFRP vs GFRP',
    is_gate_relevant: false,
  },
  {
    subject_slug: 'polymer-composites',
    question: 'The interface between fibre and matrix in a composite is critical because:',
    type: 'mcq',
    options: ["A) It determines the density of the composite", "B) Stress transfer from the lower-modulus matrix to the higher-modulus fibre occurs entirely through the interface — poor adhesion means the fibre cannot be loaded effectively", "C) It controls the thermal conductivity only", "D) The interface has no effect on mechanical properties"],
    correct_answer: 'B',
    explanation: 'Stress transfer from the matrix to the fibre occurs entirely through the interface — poor adhesion means the fibre cannot be loaded effectively.',
    difficulty: 'medium',
    topic: 'Fibre-Matrix Interface',
    is_gate_relevant: true,
  },
  {
    subject_slug: 'polymer-composites',
    question: 'Natural fibre composites (jute, coir, bamboo) have limited adoption in structural applications because:',
    type: 'mcq',
    options: ["A) Natural fibres are more expensive than carbon fibre", "B) High moisture absorption and resulting dimensional instability, variable mechanical properties (batch-to-batch), and poor long-term durability under weathering conditions", "C) Natural fibres have higher density than glass fibre", "D) Natural fibres cannot be processed by injection moulding"],
    correct_answer: 'B',
    explanation: 'High moisture absorption, batch-to-batch variability, and poor long-term durability limit structural adoption.',
    difficulty: 'medium',
    topic: 'Natural Fibre Composites',
    is_gate_relevant: false,
  },
  {
    subject_slug: 'polymer-composites',
    question: 'Short fibre reinforced thermoplastics (e.g., 30% glass-filled PA6) processed by injection moulding exhibit anisotropic properties because:',
    type: 'mcq',
    options: ["A) The glass fibres are hollow", "B) Fibres align preferentially in the flow direction during mould filling — mechanical properties are significantly higher along the flow direction than perpendicular to it", "C) Short fibres cannot be uniformly distributed in the matrix", "D) Glass fibres react chemically with the nylon matrix during processing"],
    correct_answer: 'B',
    explanation: 'Fibres align preferentially in the flow direction during mould filling, making properties higher along the flow direction.',
    difficulty: 'hard',
    topic: 'Short Fibre Composites',
    is_gate_relevant: false,
  },

  // ENTREPRENEURSHIP IN PLASTICS
  {
    subject_slug: 'entrepreneurship-plastics',
    question: "The PMEGP (Prime Minister's Employment Generation Programme) provides a non-repayable subsidy of what percentage for a general category entrepreneur starting a manufacturing unit in an urban area?",
    type: 'mcq',
    options: ["A) 5% of project cost", "B) 15% of project cost (up to ₹50 lakh total project)", "C) 25% of project cost", "D) 35% of project cost"],
    correct_answer: 'B',
    explanation: 'PMEGP subsidy for general category in urban areas is 15% of project cost up to ₹50 lakh total project.',
    difficulty: 'medium',
    topic: 'Government Funding Schemes',
    is_gate_relevant: false,
  },
  {
    subject_slug: 'entrepreneurship-plastics',
    question: 'CGTMSE (Credit Guarantee Fund Trust for Micro and Small Enterprises) is critical for first-generation entrepreneurs because:',
    type: 'mcq',
    options: ["A) It provides direct cash grants to entrepreneurs", "B) It guarantees bank loans up to ₹2 crore without requiring collateral — enabling entrepreneurs without property to access manufacturing finance", "C) It provides free machinery to new manufacturers", "D) It offers subsidised raw material procurement"],
    correct_answer: 'B',
    explanation: 'It guarantees bank loans up to ₹2 crore without requiring collateral, enabling first-generation entrepreneurs to access manufacturing finance.',
    difficulty: 'medium',
    topic: 'CGTMSE Scheme',
    is_gate_relevant: false,
  },
  {
    subject_slug: 'entrepreneurship-plastics',
    question: 'For a masterbatch compounding business, why is the technical knowledge of a polymer engineer the primary competitive advantage?',
    type: 'mcq',
    options: ["A) Masterbatch equipment is very expensive, creating a capital barrier", "B) Masterbatch is a knowledge product — correct pigment-resin compatibility, carrier selection, let-down ratio, and colour matching batch-to-batch requires polymer chemistry knowledge that most SME operators lack", "C) Masterbatch raw materials are difficult to source", "D) The masterbatch market is too small for competition"],
    correct_answer: 'B',
    explanation: 'Masterbatch is a knowledge product — correct pigment-resin compatibility, carrier selection, let-down ratio, and colour matching require polymer chemistry expertise.',
    difficulty: 'medium',
    topic: 'Masterbatch Business',
    is_gate_relevant: false,
  },
  {
    subject_slug: 'entrepreneurship-plastics',
    question: 'When writing a Detailed Project Report (DPR) for a bank loan for a HDPE pipe extrusion plant, which section most directly benefits from a polymer engineering background?',
    type: 'mcq',
    options: ["A) Legal and compliance section", "B) Technical parameters section — specifying exact machine specs, resin grade (Reliance Relene HD P80054, MFI 0.20 g/10min), BIS IS 4984 compliance protocol, and in-house testing requirements", "C) Marketing section", "D) Promoter CV section only"],
    correct_answer: 'B',
    explanation: 'Specifying exact machine specs, resin grades, BIS standards, and testing protocols builds technical credibility with loan officers.',
    difficulty: 'medium',
    topic: 'DPR Writing',
    is_gate_relevant: false,
  },
  {
    subject_slug: 'entrepreneurship-plastics',
    question: 'BIS product certification (ISI mark) is mandatory for HDPE water supply pipes. The primary business value of obtaining BIS certification beyond legal compliance is:',
    type: 'mcq',
    options: ["A) It allows the manufacturer to charge 10× higher prices", "B) It qualifies the manufacturer for government infrastructure tenders (Jal Jeevan Mission, AMRUT) which require ISI-marked products — opening a procurement channel unavailable to uncertified competitors", "C) It reduces raw material costs", "D) It reduces raw material costs"],
    correct_answer: 'B',
    explanation: 'It qualifies the manufacturer for government infrastructure tenders (Jal Jeevan Mission, AMRUT) requiring ISI-marked products.',
    difficulty: 'hard',
    topic: 'BIS Certification Strategy',
    is_gate_relevant: false,
  },

  // MEDICAL PLASTICS
  {
    subject_slug: 'medical-plastics',
    question: 'ISO 10993-1 determines which biological tests are required for a medical device based on:',
    type: 'mcq',
    options: ["A) The country where the device will be sold", "B) The nature of body contact (skin, mucosal, blood, implant) and the duration of contact (limited <24hr, prolonged 24hr-30d, permanent >30d)", "C) The price of the device", "D) The manufacturing method used"],
    correct_answer: 'B',
    explanation: 'It evaluates risk based on the nature of body contact and the duration of contact.',
    difficulty: 'medium',
    topic: 'ISO 10993 Biocompatibility',
    is_gate_relevant: false,
  },
  {
    subject_slug: 'medical-plastics',
    question: 'Medical-grade PVC for IV bags and tubing is plasticised with DEHP. DEHP is being replaced in paediatric applications because:',
    type: 'mcq',
    options: ["A) DEHP makes PVC too rigid for IV tubing", "B) DEHP is classified as an endocrine disruptor — it leaches from PVC into IV fluids and blood products at levels of concern for neonates and paediatric patients", "C) DEHP is too expensive", "D) DEHP causes PVC to discolour"],
    correct_answer: 'B',
    explanation: 'DEHP is classified as an endocrine disruptor that leaches into IV fluids and blood products.',
    difficulty: 'hard',
    topic: 'Medical PVC and DEHP',
    is_gate_relevant: false,
  },
  {
    subject_slug: 'medical-plastics',
    question: 'PEEK is used in spinal interbody fusion cages primarily because:',
    type: 'mcq',
    options: ["A) PEEK is the cheapest engineering polymer available", "B) PEEK is radiolucent (X-ray transparent) and can be formulated with carbon fibre to match cortical bone stiffness, avoiding stress shielding while allowing post-operative MRI monitoring", "C) PEEK is biodegradable and dissolves after fusion is complete", "D) PEEK has the highest tensile strength of all polymers"],
    correct_answer: 'B',
    explanation: 'PEEK is radiolucent (X-ray transparent) and matches cortical bone stiffness to prevent stress shielding.',
    difficulty: 'medium',
    topic: 'PEEK Implants',
    is_gate_relevant: false,
  },
  {
    subject_slug: 'medical-plastics',
    question: 'Standard PP is NOT suitable for gamma radiation sterilization (25-40 kGy) without modification because:',
    type: 'mcq',
    options: ["A) PP melts at the radiation dose required", "B) Gamma radiation causes chain scission in PP — breaking backbone bonds, reducing molecular weight, and causing embrittlement", "C) PP absorbs radiation and becomes radioactive", "D) Gamma radiation has no effect on PP"],
    correct_answer: 'B',
    explanation: 'Gamma radiation causes chain scission in standard PP, breaking backbone bonds and causing severe embrittlement.',
    difficulty: 'medium',
    topic: 'Sterilization Compatibility',
    is_gate_relevant: false,
  },
  {
    subject_slug: 'medical-plastics',
    question: 'ISO 13485 is the Quality Management System standard specific to medical devices. Its key additional requirement vs ISO 9001 is:',
    type: 'mcq',
    options: ["A) It requires lower product quality standards than ISO 9001", "B) Full traceability from raw material lot to finished device, design controls with documented design history files, sterilization validation to SAL 10⁻⁶, and supplier qualification", "C) It only applies to devices sold in Europe", "D) ISO 13485 replaces all other quality standards"],
    correct_answer: 'B',
    explanation: 'Full traceability, documented design history files, sterilization validation to SAL 10⁻⁶, and supplier qualifications.',
    difficulty: 'hard',
    topic: 'ISO 13485 QMS',
    is_gate_relevant: false,
  },
];

async function seedPracticeQuestions() {
  console.log('🚀 Seeding remaining practice questions...\n');

  const { data: subjects } = await supabase.from('subjects').select('id, slug');
  const subjectMap = new Map(subjects.map(s => [s.slug, s.id]));

  let inserted = 0;
  for (const q of questionsData) {
    const subjectId = subjectMap.get(q.subject_slug);
    if (!subjectId) {
      console.log(`Subject not found for slug: ${q.subject_slug}`);
      continue;
    }

    const { error } = await supabase.from('practice_questions').insert({
      subject_id: subjectId,
      question: q.question,
      type: q.type,
      options: JSON.stringify(q.options),
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      topic: q.topic,
      is_gate_relevant: q.is_gate_relevant,
    });

    if (error) {
      console.error(`Failed to insert question: ${q.topic}`, error.message);
    } else {
      inserted++;
    }
  }

  console.log(`✅ Inserted ${inserted} practice questions successfully!\n`);
}

seedPracticeQuestions();
