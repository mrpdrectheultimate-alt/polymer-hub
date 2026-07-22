require('dotenv').config({ path: '.env.local' });
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Real candidate YouTube IDs for polymer engineering & manufacturing
const CANDIDATES = [
  { id: 'RMjtmsr3CqA', subject: 'Polymer Processing', subjectSlug: 'polymer-processing', lesson: 'injection-moulding-process-parameters-and-defects', level: 'Foundation', source: 'Industry' },
  { id: 'b18X7E0l1oQ', subject: 'Polymer Processing', subjectSlug: 'polymer-processing', lesson: 'extrusion-fundamentals-the-backbone-of-plastic-processing', level: 'Foundation', source: 'Industry' },
  { id: '3GSqWnI11uU', subject: 'Polymer Processing', subjectSlug: 'polymer-processing', lesson: 'blow-moulding-extrusion-and-injection-blow-processes', level: 'Intermediate', source: 'Industry' },
  { id: '20R9n65K84o', subject: 'Additives & Compounding', subjectSlug: 'additives-compounding', lesson: 'twin-screw-compounding-masterbatch-and-compound-manufacturing', level: 'Intermediate', source: 'Industry' },
  { id: 'Vn_FzTz2n-w', subject: 'Polymer Processing', subjectSlug: 'polymer-processing', lesson: 'extrusion-fundamentals-the-backbone-of-plastic-processing', level: 'Foundation', source: 'Industry' },
  { id: 'L1N0u4j4M-Q', subject: 'Polymer Chemistry', subjectSlug: 'polymer-chemistry', lesson: 'polymerization-mechanisms-addition-vs-condensation', level: 'Intermediate', source: 'NPTEL' },
];

function checkoEmbed(id) {
  return new Promise(resolve => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve({ ok: true, status: 200, title: json.title, author: json.author_name });
          } catch (e) {
            resolve({ ok: false, status: 500 });
          }
        } else {
          resolve({ ok: false, status: res.statusCode });
        }
      });
    }).on('error', err => resolve({ ok: false, status: 500 }));
  });
}

async function run() {
  console.log('🔍 Testing candidates against YouTube oEmbed...\n');
  const validList = [];

  for (const c of CANDIDATES) {
    const res = await checkoEmbed(c.id);
    if (res.ok) {
      console.log(`✅ [200 OK] ID: ${c.id} | Author: "${res.author}" | Title: "${res.title}"`);
      validList.push({ ...c, title: res.title, author: res.author });
    } else {
      console.log(`❌ [FAIL ${res.status}] ID: ${c.id}`);
    }
  }

  if (validList.length > 0) {
    console.log(`\nInserting ${validList.length} verified videos into Supabase...`);
    for (const item of validList) {
      await supabase.from('videos').upsert({
        title: item.title,
        channel: item.author,
        duration: '12:00',
        subject_slug: item.subjectSlug,
        subject_name: item.subject,
        youtube_id: item.id,
        external_video_id: item.id,
        canonical_url: `https://www.youtube.com/watch?v=${item.id}`,
        description: item.title,
        source: item.source,
        level: item.level,
        lesson_slug: item.lesson,
        status: 'published',
        embed_status: 'working',
        is_active: true,
        checked_at: new Date().toISOString()
      }, { onConflict: 'youtube_id' });
    }
    console.log('✅ Supabase insertion complete!');
  }
}

run();
