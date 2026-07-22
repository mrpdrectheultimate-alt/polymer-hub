const CANDIDATES = [
  { subject: 'Polymer Processing', youtubeId: 'RMjtmsr3CqA', lessonSlug: 'injection-moulding-process-parameters-and-defects', level: 'Foundation', source: 'Industry' },
  { subject: 'Polymer Chemistry', youtubeId: 'kYJj43S4H2I', lessonSlug: 'introduction-to-polymers-and-classification', level: 'Foundation', source: 'NPTEL' },
  { subject: 'Polymer Testing', youtubeId: 'Jm_R-3-bZ04', lessonSlug: 'tensile-testing-astm-d638', level: 'Foundation', source: 'Industry' },
  { subject: 'Polymer Testing Alt', youtubeId: 'LqUe6z_z7W0', lessonSlug: 'tensile-testing-astm-d638', level: 'Foundation', source: 'Industry' },
  { subject: 'Polymer Rheology', youtubeId: 'R9Z8X46jD8I', lessonSlug: 'introduction-to-rheology-and-viscosity', level: 'Intermediate', source: 'NPTEL' },
  { subject: 'Mould Design', youtubeId: 'uO8e1J_GqYk', lessonSlug: 'injection-mould-components-and-types', level: 'Intermediate', source: 'Industry' }
];

async function checkId(c) {
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${c.youtubeId}&format=json`;
  const thumbUrl = `https://img.youtube.com/vi/${c.youtubeId}/hqdefault.jpg`;
  const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };

  try {
    const resOembed = await fetch(oembedUrl, { headers });
    const resThumb = await fetch(thumbUrl, { headers });

    if (resOembed.ok && resThumb.ok) {
      const data = await resOembed.json();
      return { ...c, status: 200, title: data.title, author: data.author_name };
    } else {
      return { ...c, status: resOembed.status || resThumb.status };
    }
  } catch (e) {
    return { ...c, status: 500, error: e.message };
  }
}

async function run() {
  console.log('🔍 Auditing Candidate Polymer Videos via oEmbed & Thumbnail APIs...\n');
  const approved = [];
  for (const c of CANDIDATES) {
    const res = await checkId(c);
    if (res.status === 200) {
      console.log(`[✅ 200 OK] ${res.subject} | ID: ${res.youtubeId}`);
      console.log(`   Title: "${res.title}"`);
      console.log(`   Author: ${res.author}\n`);
      approved.push(res);
    } else {
      console.log(`[❌ ${res.status}] ${res.subject} | ID: ${res.youtubeId}\n`);
    }
  }
  console.log(`🎉 Approved Total: ${approved.length} / ${CANDIDATES.length}`);
}

run();
