const fs = require('fs');

const report = JSON.parse(fs.readFileSync('curriculum_audit_report.json', 'utf8'));

const upgradedSlugs = [
  "polymerization-mechanisms-addition-vs-condensation",
  "introduction-to-rheology-polymer-melts",
  "tensile-and-flexural-testing-measuring-mechanical-strength",
  "injection-moulding-process-parameters-and-defects",
  "runner-and-sprue-design-balancing-flow-to-multiple-cavities",
  "pla-pha-and-starch-based-polymers-in-packaging",
  "compression-and-transfer-moulding-for-thermosets",
  "extrusion-die-design-fundamentals",
  "crystallinity-and-morphology-in-polymers",
  "melt-flow-index-mfi-measurement-significance-and-indian-standards"
];

console.log("=== LOWEST SCORING UNRESOLVED LESSONS FOR SPRINT 1B BATCH 3 ===");

const sorted = report.all_audited_lessons.sort((a, b) => a.quality_score - b.quality_score);

const unresolved = sorted.filter(l => !upgradedSlugs.includes(l.slug));

console.log(`Found ${unresolved.length} unresolved lessons.`);

unresolved.slice(0, 10).forEach((l, idx) => {
  console.log(`#${idx+1} Score: ${l.quality_score} | Grade: ${l.grade} | Subject: ${l.subject_name} (${l.subject_slug}) | Title: ${l.title} | Slug: ${l.slug}`);
});
