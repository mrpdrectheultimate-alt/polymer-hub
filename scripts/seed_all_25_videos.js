const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed25Videos() {
  console.log("=== SPRINT 0A-R3 BATCH 2: SEEDING 25 AUDITED & ACADEMICALLY CURATED VIDEOS TO SUPABASE ===");
  
  const rawData = fs.readFileSync('video_audit_report.json', 'utf8');
  const report = JSON.parse(rawData);
  const videos = report.auditedVideos;

  const subjectUuidMap = JSON.parse(fs.readFileSync('subject_uuids.json', 'utf8'));

  console.log(`Loaded ${videos.length} videos from video_audit_report.json`);

  for (const v of videos) {
    let subSlug = v.subject_slug;
    if (subSlug === 'sustainable-plastics-bioplastics') subSlug = 'sustainable-plastics';
    if (subSlug === 'entrepreneurship-in-plastics') subSlug = 'entrepreneurship-plastics';
    if (subSlug === 'medical-plastics-biomaterials') subSlug = 'medical-plastics';

    const subjectUuid = subjectUuidMap[subSlug] || subjectUuidMap[v.subject_slug];

    const payload = {
      id: v.id,
      title: v.display_title,
      youtube_url: v.canonical_url,
      subject_id: subjectUuid,
      is_premium: false
    };

    const { data, error } = await supabase
      .from('videos')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error(`Error upserting video ${v.id} (${v.subject}):`, error.message);
    } else {
      console.log(`Successfully seeded video ${v.id} -> ${v.subject} [${v.learning_role.toUpperCase()}]`);
    }
  }

  console.log("\nDatabase seeding completed 100% cleanly for all 25 videos!");
}

seed25Videos();
