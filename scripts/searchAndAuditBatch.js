const CANDIDATES = [
  // Polymer Chemistry Candidates
  { subject: 'Polymer Chemistry', youtubeId: 's5R8v1_S3qQ', lessonSlug: 'introduction-to-polymers-and-classification' },
  { subject: 'Polymer Chemistry', youtubeId: 'sB6R3zWzZ4E', lessonSlug: 'step-growth-vs-chain-growth-polymerization' },
  { subject: 'Polymer Chemistry', youtubeId: 'd0p-Q897645', lessonSlug: 'free-radical-polymerization-kinetics' },
  { subject: 'Polymer Chemistry', youtubeId: '47dGq14Zz4E', lessonSlug: 'introduction-to-polymers-and-classification' },
  { subject: 'Polymer Chemistry', youtubeId: '23wE1S50011', lessonSlug: 'introduction-to-polymers-and-classification' },

  // Polymer Testing Candidates
  { subject: 'Polymer Testing', youtubeId: 'D8U3Gv4jAQA', lessonSlug: 'tensile-testing-astm-d638' },
  { subject: 'Polymer Testing', youtubeId: 'b05p2p85G5w', lessonSlug: 'tensile-testing-astm-d638' },
  { subject: 'Polymer Testing', youtubeId: '6bW700z84E0', lessonSlug: 'melt-flow-index-mfi-astm-d1238' },
  { subject: 'Polymer Testing', youtubeId: 'TA123TaInst', lessonSlug: 'differential-scanning-calorimetry-dsc-of-polymers' },

  // Polymer Rheology Candidates
  { subject: 'Polymer Rheology', youtubeId: 'u4ZzZ4E0011', lessonSlug: 'introduction-to-rheology-and-viscosity' },
  { subject: 'Polymer Rheology', youtubeId: 'Rheo1234567', lessonSlug: 'shear-thinning-and-non-newtonian-flow' },

  // Mould Design Candidates
  { subject: 'Mould Design', youtubeId: 'Mould123456', lessonSlug: 'injection-mould-components-and-types' },
  { subject: 'Mould Design', youtubeId: 'Gate1234567', lessonSlug: 'runner-system-and-gate-design' }
];

async function check(id) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  try {
    const r = await fetch(url);
    if (r.ok) {
      const data = await r.json();
      return { ok: true, title: data.title, author: data.author_name };
    }
  } catch (e) {}
  return { ok: false };
}

async function run() {
  console.log('Testing candidates...\n');
  for (const c of CANDIDATES) {
    const res = await check(c.youtubeId);
    if (res.ok) {
      console.log(`[✅ 200 OK] ${c.subject} (${c.youtubeId}): "${res.title}" by ${res.author}`);
    }
  }
}

run();
