const https = require('https');

// A list of real YouTube video candidate IDs
const POTENTIAL_IDS = [
  'RMjtmsr3CqA', // Plastic Injection Molding (engineerguy)
  '3GSqWnI11uU', // Blow Molding
  'seZqqP3_kC8', // Injection molding animation
  '20R9n65K84o', // Twin screw extrusion
  'b1U9W4_3j0Q', // Extrusion
  'v8X4k_w8Y90',
  '4eW67K8Y90a',
  '5fX78K9Z01b',
  '6gY89L0A12c',
  '7hZ90M1B23d',
  '8iA01N2C34e',
  '9jB12O3D45f',
  '0kC23P4E56g',
  '1lD34Q5F67h',
  '2mE45R6G78i',
  '3nF56S7H89j',
  '4oG67T8I90k',
  '5pH78U9J01l',
  '6qI89V0K12m',
  '7rJ90W1L23n'
];

// Let's also test searching YouTube oEmbed on real polymer engineering IDs from NPTEL & Industry
const KNOWN_POLYMER_IDS = [
  'RMjtmsr3CqA', // Injection Moulding
  'L1N0u4j4M-Q', // Polymerization
  'W2u3n4o5p6q',
  '3a2b1c0d9e8',
  'Yn4x5z6a7b8'
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

async function run() {
  console.log('Testing candidates...\n');
  for (const id of [...POTENTIAL_IDS, ...KNOWN_POLYMER_IDS]) {
    const res = await checkVideo(id);
    if (res.ok) {
      console.log(`✅ [200 OK] ID: ${res.id} | Author: "${res.author}" | Title: "${res.title}"`);
    }
  }
}

run();
