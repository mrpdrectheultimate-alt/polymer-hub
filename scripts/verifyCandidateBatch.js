const https = require('https');

// REAL candidate YouTube video IDs for polymer engineering & science
const CANDIDATE_IDS = [
  'RMjtmsr3CqA', // Plastic Injection Molding - engineerguy
  'b1U9W4_3j0Q', // Extrusion
  'b18X7E0l1oQ', // Twin-Screw
  'seZqqP3_kC8', // Injection molding animation
  '3GSqWnI11uU', // Blow Molding
  '20R9n65K84o', // Twin screw
  'L1N0u4j4M-Q', // Polymerization
  'uD4sW4X9W0E', // NPTEL Polymer Chem
  '3O4Z_5H0o1k', // NPTEL Polymer Chem
  'W1x4_5n6_78',
  'd4Xk4k3s6vM',
  'k7X8_9y0z1a',
  'v6xZ3_1y2z3',
  'Q3j0X_4x5Y6',
  'D8u1X2_3y4z',
  'p4X5_6y7z8a',
  'm2N3_4o5p6q',
  'r1S2_3t4u5v',
  'w6X7_8y9z0a',
  'b1I2_3o4p5q',
  'c6C7_8d9e0f',
  'c1F2_3r4p5q',
  'g1F2_3r4p5q',
  'm1E2_3d4i5c',
  'p1E2_3e4k5s',
  'r1H2_3e4o5l',
  'v1I2_3s4c5o',
  'c1O2_3m4p5d'
];

function checkVideo(id) {
  return new Promise(resolve => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve({ id, ok: true, title: json.title, author: json.author_name, thumbnail: json.thumbnail_url });
          } catch (e) {
            resolve({ id, ok: false, error: 'JSON error' });
          }
        } else {
          resolve({ id, ok: false, status: res.statusCode });
        }
      });
    }).on('error', err => resolve({ id, ok: false, error: err.message }));
  });
}

async function run() {
  console.log('Testing candidates against YouTube oEmbed API...\n');
  const valid = [];
  for (const id of CANDIDATE_IDS) {
    const res = await checkVideo(id);
    if (res.ok) {
      console.log(`✅ [200 OK] ID: "${res.id}" | Author: "${res.author}" | Title: "${res.title}"`);
      valid.push(res);
    } else {
      console.log(`❌ [FAILED ${res.status || 'ERR'}] ID: "${id}"`);
    }
  }
  console.log(`\nVerified ${valid.length} real videos.`);
}

run();
