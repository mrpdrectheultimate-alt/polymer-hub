const https = require('https');

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
            resolve({ id, ok: false, error: 'JSON parse error' });
          }
        } else {
          resolve({ id, ok: false, status: res.statusCode });
        }
      });
    }).on('error', err => resolve({ id, ok: false, error: err.message }));
  });
}

// Candidates across polymer subjects
const CANDIDATES = [
  // Injection Molding
  'RMjtmsr3CqA', // Plastic Injection Molding - engineerguy
  'seZqqP3_kC8', // Injection Molding Animation
  'b1U9W4_3j0Q', // Extrusion
  '3a2L4g8b1_0', 
  '_5t7Jm0c_w8',
  't4a1x_k9w0E',
  'V1oP5a2c1_0',
  'J2_1x4n5_m0',
  'S5t7_8w9_10',

  // NPTEL Polymer Chemistry & Processing
  'W1x4_5n6_78',
  '2k3l4m5n6o7',
  'p1q2r3s4t5u',

  // Polymer Testing (UTM / DSC / Impact)
  'H4c1_2v3_45',
  'J4v5_6w7_89',

  // Recycling & Bioplastics
  'W2e3_4r5_67',
  'T1u2_3v4_56'
];

async function run() {
  console.log('Testing candidates...\n');
  for (const id of CANDIDATES) {
    const res = await checkVideo(id);
    if (res.ok) {
      console.log(`✅ ${id} -> [${res.author}] ${res.title}`);
    } else {
      console.log(`❌ ${id} -> Status ${res.status || res.error}`);
    }
  }
}

run();
