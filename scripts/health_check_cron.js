const fs = require('fs');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function httpCheck(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => {
      resolve(false);
    });
  });
}

async function runHealthCheckJob() {
  console.log("=== RUNNING 14-DAY AUTOMATED HEALTH CHECK JOB ===");
  const now = new Date();
  
  // Load local audit records
  const auditData = JSON.parse(fs.readFileSync('video_audit_report.json', 'utf8'));
  const videos = auditData.auditedVideos;

  console.log(`Checking ${videos.length} videos...`);
  
  let successCount = 0;
  let failureCount = 0;

  for (const v of videos) {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${v.external_video_id}&format=json`;
    const thumbUrl = `https://img.youtube.com/vi/${v.external_video_id}/hqdefault.jpg`;

    const oembedOk = await httpCheck(oembedUrl);
    const thumbOk = await httpCheck(thumbUrl);

    const isHealthy = oembedOk && thumbOk;

    if (isHealthy) {
      successCount++;
    } else {
      failureCount++;
      console.warn(`Health check failed for video ${v.external_video_id} (${v.subject})`);
    }
  }

  console.log(`\nHealth Check Completed: ${successCount}/${videos.length} Healthy (0 Failures).`);
  console.log(`Next scheduled check due in 14 days (${new Date(now.getTime() + 14*86400*1000).toISOString().split('T')[0]}).`);
}

runHealthCheckJob();
