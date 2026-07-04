// scripts/seedLessons.js
// Run with: node scripts/seedLessons.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper: slugify title
var slugify = function(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// Helper: read lesson content from markdown file
var readLesson = function(filename) {
  return fs.readFileSync(path.join(__dirname, 'lessons', filename), 'utf8');
};

// 5 Detailed Lessons — One Per Subject
var lessonData = [
  {
    subject_slug: 'polymer-chemistry',
    title: 'Introduction to Polymer Structure and Molecular Weight',
    summary: 'Understand how polymer chain length, molecular weight, and structure determine the physical properties of plastics used in everyday Indian products.',
    order_index: 1,
    is_premium: false,
    contentFile: 'polymer-chemistry.md',
  },
  {
    subject_slug: 'polymer-processing',
    title: 'Injection Moulding: Process, Parameters, and Defects',
    summary: 'Master the injection moulding process — the most widely used manufacturing method in Indian plastics industry — including machine setup, key parameters, and common defects.',
    order_index: 1,
    is_premium: false,
    contentFile: 'polymer-processing.md',
  },
  {
    subject_slug: 'mould-design',
    title: 'Gate Design in Injection Moulds: Types, Location, and Selection',
    summary: 'Learn how gate design controls where and how plastic enters a mould cavity — one of the most critical decisions affecting part quality, cycle time, and appearance.',
    order_index: 1,
    is_premium: false,
    contentFile: 'mould-design.md',
  },
  {
    subject_slug: 'polymer-testing',
    title: 'Melt Flow Index (MFI): Measurement, Significance, and Indian Standards',
    summary: 'Understand Melt Flow Index — the single most important quality control test in Indian polymer processing — how to measure it, what it tells you, and how Indian manufacturers use it.',
    order_index: 1,
    is_premium: false,
    contentFile: 'polymer-testing.md',
  },
  {
    subject_slug: 'rubber-technology',
    title: 'Vulcanization of Rubber: Chemistry, Systems, and Industrial Practice',
    summary: 'Understand vulcanization — the cross-linking process that transforms soft, tacky rubber into strong, elastic products — covering sulphur systems, accelerators, and Indian rubber industry applications.',
    order_index: 1,
    is_premium: false,
    contentFile: 'rubber-technology.md',
  },
];

// Main seed function
async function seedLessons() {
  console.log('🚀 PolymerHub — Starting lessons seed...\n');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
  }

  // Fetch all subjects to get their IDs
  var result = await supabase.from('subjects').select('id, slug');

  if (result.error) {
    console.error('❌ Failed to fetch subjects:', result.error.message);
    process.exit(1);
  }

  var subjects = result.data;
  var subjectMap = {};
  subjects.forEach(function(s) { subjectMap[s.slug] = s.id; });

  console.log('📚 Found subjects:', Object.keys(subjectMap).join(', '), '\n');

  // Build lessons array with subject_id and slug
  var lessons = lessonData.map(function(lesson) {
    var subject_id = subjectMap[lesson.subject_slug];
    if (!subject_id) {
      console.error('❌ Subject not found for slug: ' + lesson.subject_slug);
      process.exit(1);
    }
    return {
      subject_id: subject_id,
      title: lesson.title,
      slug: slugify(lesson.title),
      content: readLesson(lesson.contentFile),
      summary: lesson.summary,
      is_premium: lesson.is_premium,
      order_index: lesson.order_index,
    };
  });

  console.log('📦 Inserting ' + lessons.length + ' lessons...\n');

  var upsertResult = await supabase
    .from('lessons')
    .upsert(lessons, { onConflict: 'slug', ignoreDuplicates: false })
    .select();

  if (upsertResult.error) {
    console.error('❌ Seed failed:');
    console.error('   Code: ' + upsertResult.error.code);
    console.error('   Message: ' + upsertResult.error.message);
    process.exit(1);
  }

  var data = upsertResult.data;
  console.log('✅ Lessons seeded successfully!\n');
  console.log('📖 Lessons inserted:');
  data.forEach(function(l, i) {
    console.log('   ' + (i + 1) + '. ' + l.title);
    console.log('      slug: ' + l.slug + '\n');
  });

  console.log('🎉 Done! ' + data.length + ' lessons are live in your Supabase database.');
  console.log('   → Check Supabase Table Editor → lessons to verify.\n');
}

seedLessons();
