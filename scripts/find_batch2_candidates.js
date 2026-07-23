const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function findBatch2Candidates() {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, title, slug, quality_score, review_status, subjects(slug, name)')
    .order('quality_score', { ascending: true });

  if (error) {
    console.error("Error fetching lessons:", error);
    return;
  }

  console.log("=== LOWEST SCORING UNRESOLVED LESSONS IN TARGET SUBJECTS ===");
  const targetSubjects = ['polymer-chemistry', 'polymer-processing', 'polymer-testing', 'polymer-rheology'];

  let count = 0;
  for (const l of lessons) {
    const subSlug = l.subjects?.slug;
    const isTarget = targetSubjects.includes(subSlug);
    const isApproved = l.review_status === 'approved' && l.quality_score >= 90;
    
    console.log(`[${isTarget ? 'TARGET' : 'OTHER'}] Score: ${l.quality_score} | Status: ${l.review_status} | Subject: ${l.subjects?.name} (${subSlug}) | Title: ${l.title} | Slug: ${l.slug}`);
    if (isTarget && !isApproved) {
      count++;
    }
  }
}

findBatch2Candidates();
