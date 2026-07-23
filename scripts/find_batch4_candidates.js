const fs = require('fs');

const auditReport = JSON.parse(fs.readFileSync('curriculum_audit_report.json', 'utf8'));

const alreadyUpgradedSlugs = [
  // Batch 1
  "polymerization-mechanisms-addition-vs-condensation",
  "introduction-to-rheology-polymer-melts",
  "tensile-and-flexural-testing-measuring-mechanical-strength",
  "injection-moulding-process-parameters-and-defects",
  "runner-and-sprue-design-balancing-flow-to-multiple-cavities",
  // Batch 2
  "pla-pha-and-starch-based-polymers-in-packaging",
  "compression-and-transfer-moulding-for-thermosets",
  "extrusion-die-design-fundamentals",
  "crystallinity-and-morphology-in-polymers",
  "melt-flow-index-mfi-measurement-significance-and-indian-standards",
  // Batch 3 / 3R / 3R.1
  "gate-design-in-injection-moulds-types-location-and-selection",
  "introduction-to-mechanical-and-chemical-recycling",
  "epr-extended-producer-responsibility-compliance-frameworks-in-india",
  "75-lakh-2-crore-scale-tier-extrusion-plants-recycling-and-processing-lines",
  "polymer-blends-and-composites-combining-materials-for-better-performance"
];

const candidateLessons = auditReport.all_audited_lessons
  .filter(l => !alreadyUpgradedSlugs.includes(l.slug))
  .sort((a, b) => a.quality_score - b.quality_score);

console.log("=== NEXT 5 UNRESOLVED LESSON CANDIDATES FOR BATCH 4 ===");
candidateLessons.slice(0, 5).forEach((l, idx) => {
  console.log(`${idx + 1}. [Score: ${l.quality_score}, Grade: ${l.grade}] ${l.slug} (${l.subject_slug || l.module_name})`);
});
