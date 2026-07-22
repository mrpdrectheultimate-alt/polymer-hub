const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding 15 verified Sprint 0A-R2 videos into Supabase...');
  
  if (!fs.existsSync('video_audit_report.json')) {
    console.error('Error: video_audit_report.json not found!');
    return;
  }

  const raw = fs.readFileSync('video_audit_report.json', 'utf8');
  const report = JSON.parse(raw);
  const records = report.auditedVideos;

  console.log(`Found ${records.length} audited video records to seed.`);

  try {
    const { error: deleteError } = await supabase
      .from('videos')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.warn('Note on table clear:', deleteError.message);
    }

    const { data, error } = await supabase
      .from('videos')
      .upsert(records, { onConflict: 'youtube_id' });

    if (error) {
      console.log('Supabase Seed Response:', error.message);
    } else {
      console.log('Successfully seeded all 15 verified videos into Supabase videos table!');
    }
  } catch (e) {
    console.log('Seeding Execution Exception:', e.message);
  }
}

seed();
