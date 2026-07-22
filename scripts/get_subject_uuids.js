const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchSubjects() {
  const { data, error } = await supabase.from('subjects').select('id, slug, name');
  if (error) {
    console.error("Error fetching subjects:", error);
  } else {
    console.log("Subjects UUID Mapping:");
    const map = {};
    data.forEach(s => {
      map[s.slug] = s.id;
      console.log(`  "${s.slug}": "${s.id}"`);
    });
    fs.writeFileSync('subject_uuids.json', JSON.stringify(map, null, 2));
  }
}
const fs = require('fs');
fetchSubjects();
