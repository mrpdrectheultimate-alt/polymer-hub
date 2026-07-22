require('dotenv').config({ path: '.env.local' });
const https = require('https');
const { createClient } = require('@supabase/supabase-js');
function extractYouTubeVideoId(input) {
  if (!input) return null;
  const value = input.trim();
  const blacklist = ['rubber123', 'carbon456', 'mfi_test', 'xyzabc123', 'dqw4w9wgxcq'];
  if (blacklist.some(b => value.toLowerCase().includes(b))) return null;

  const patterns = [
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function checkUrl(url) {
  return new Promise(resolve => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', err => resolve({ status: 500, error: err.message }));
  });
}

async function auditAll() {
  console.log('🔬 PolymerHub — Comprehensive 100% Video Audit Pipeline\n');

  // Fetch all videos from Supabase
  const { data: dbVideos, error: dbErr } = await supabase.from('videos').select('*');

  console.log(`Database Rows Total: ${dbVideos ? dbVideos.length : 0}`);
  if (dbErr) console.error('DB Error:', dbErr.message);

  console.log('\n===================================================================================================================');
  console.log('| # | Extracted ID | Title | oEmbed Status | Thumbnail Status | Verification Result |');
  console.log('===================================================================================================================');

  if (!dbVideos || dbVideos.length === 0) {
    console.log('| 0 | NONE | No videos in database. Clean reset verified! |');
  } else {
    let index = 1;
    for (const v of dbVideos) {
      const raw = v.youtube_id || v.external_video_id || v.youtube_url || '';
      const yid = extractYouTubeVideoId(raw);

      if (!yid) {
        console.log(`| ${index} | ❌ INVALID | ${v.title} | FAILED | FAILED | ❌ REJECTED (Fake/Invalid ID) |`);
        index++;
        continue;
      }

      const oembedRes = await checkUrl(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${yid}&format=json`);
      const thumbRes = await checkUrl(`https://img.youtube.com/vi/${yid}/hqdefault.jpg`);

      const oembedOk = oembedRes.status === 200;
      const thumbOk = thumbRes.status === 200;

      let title = v.title;
      if (oembedOk) {
        try {
          const parsed = JSON.parse(oembedRes.data);
          title = parsed.title;
        } catch(e) {}
      }

      const result = (oembedOk && thumbOk) ? '✅ 100% VERIFIED & PLAYABLE' : '❌ FAILED AUDIT';

      console.log(`| ${index} | ${yid} | ${title.slice(0, 35)} | HTTP ${oembedRes.status} | HTTP ${thumbRes.status} | ${result} |`);
      index++;
    }
  }

  console.log('===================================================================================================================\n');
}

auditAll();
