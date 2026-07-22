const https = require('https');

function fetchUrl(url) {
  return new Promise(resolve => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', err => resolve({ status: 500, error: err.message }));
  });
}

async function verify() {
  console.log('🔬 Verifying Live Video Assets & Embeds...\n');

  // 1. Check YouTube Thumbnail Image
  const thumbRes = await fetchUrl('https://img.youtube.com/vi/RMjtmsr3CqA/hqdefault.jpg');
  console.log('1. YouTube Thumbnail Image (RMjtmsr3CqA):');
  console.log(`   - HTTP Status: ${thumbRes.status}`);
  console.log(`   - Content-Type: ${thumbRes.headers['content-type']}`);
  console.log(`   - Content-Length: ${thumbRes.headers['content-length']} bytes`);
  console.log(`   - Result: ${thumbRes.status === 200 && parseInt(thumbRes.headers['content-length']) > 1000 ? '✅ VALID IMAGE' : '❌ INVALID'}\n`);

  // 2. Check YouTube oEmbed API
  const oembedRes = await fetchUrl('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=RMjtmsr3CqA&format=json');
  console.log('2. YouTube oEmbed Verification (RMjtmsr3CqA):');
  console.log(`   - HTTP Status: ${oembedRes.status}`);
  if (oembedRes.status === 200) {
    const json = JSON.parse(oembedRes.body);
    console.log(`   - Title: "${json.title}"`);
    console.log(`   - Author: "${json.author_name}"`);
    console.log(`   - Result: ✅ 100% VALID & PLAYABLE`);
  } else {
    console.log(`   - Result: ❌ INVALID`);
  }
}

verify();
