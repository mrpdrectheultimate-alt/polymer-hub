const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function findSlugs() {
  const { data } = await supabase.from('lessons').select('id, title, slug');
  console.log("Total lessons:", data.length);
  for (const l of data) {
    if (l.slug.includes('polymer') || l.slug.includes('rheology') || l.slug.includes('tensile') || l.slug.includes('runner') || l.slug.includes('injection')) {
      console.log(`ID: ${l.id} | Slug: "${l.slug}" | Title: "${l.title}"`);
    }
  }
}
findSlugs();
