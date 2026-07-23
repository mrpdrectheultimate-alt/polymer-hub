const fs = require('fs');

const report = JSON.parse(fs.readFileSync('curriculum_audit_report.json', 'utf8'));

console.log("=== ALL LESSONS IN AUDIT REPORT SORTED BY SCORE ===");
const targetSubjects = ['polymer-chemistry', 'polymer-processing', 'polymer-testing', 'polymer-rheology'];

const sorted = report.all_audited_lessons.sort((a, b) => a.quality_score - b.quality_score);

console.log("\n--- Target Subject Lessons (Polymer Chemistry, Processing, Testing, Rheology) ---");
const targetLessons = sorted.filter(l => targetSubjects.includes(l.subject_slug));
targetLessons.forEach((l, idx) => {
  console.log(`#${idx+1} Score: ${l.quality_score} | Grade: ${l.grade} | Subject: ${l.subject_name} (${l.subject_slug}) | Title: ${l.title} | Slug: ${l.slug}`);
});
