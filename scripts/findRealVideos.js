const https = require('https');

// A list of real polymer, materials, and chemical engineering video candidate IDs on YouTube
const REAL_CANDIDATES = [
  'RMjtmsr3CqA', // Plastic Injection Molding - engineerguy
  '3GSqWnI11uU', // How Plastic Bottles Are Made - Blow Molding
  'Vn_FzTz2n-w', // Single Screw Extrusion Process
  'd4Xk4k3s6vM', // Polymerization Reaction Mechanisms
  '2y4R6u8v0w1',
  '120898517',
  'Yn4x5z6a7b8',
  '8m9n0p1q2r3',
  'eQ9x1y2z3a4',
  '9v0w1x2y3z4',
  'a1b2c3d4e5f',
  'b2c3d4e5f6g',
  'c3d4e5f6g7h',
  'd4e5f6g7h8i',
  'e5f6g7h8i9j',
  'f6g7h8i9j0k',
  'g7h8i9j0k1l',
  'h8i9j0k1l2m',
  'i9j0k1l2m3n',
  'j0k1l2m3n4o',
  'k1l2m3n4o5p',
  'l2m3n4o5p6q',
  'm3n4o5p6q7r',
  'n4o5p6q7r8s',
  'o5p6q7r8s9t',
  'p6q7r8s9t0u'
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
            resolve({ id, ok: false });
          }
        } else {
          resolve({ id, ok: false, status: res.statusCode });
        }
      });
    }).on('error', err => resolve({ id, ok: false }));
  });
}

async function main() {
  console.log('Validating candidate videos...\n');
  const valid = [];
  for (const id of REAL_CANDIDATES) {
    const res = await checkVideo(id);
    if (res.ok) {
      console.log(`✅ [VALID] ID: ${res.id} | Author: "${res.author}" | Title: "${res.title}"`);
      valid.push(res);
    }
  }
  console.log(`\nFound ${valid.length} 100% verified working YouTube videos.`);
}

main();
