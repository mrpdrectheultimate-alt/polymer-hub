const fs = require('fs');
const https = require('https');
const path = require('path');

// ─── Candidate Videos for Sprint 0A-R2 (Batch 1: 5 Subjects) ────────────────

const CANDIDATES = [
  // 1. Polymer Processing
  {
    id: 'audited-v1',
    subject: 'Polymer Processing',
    subjectSlug: 'polymer-processing',
    lessonSlug: 'injection-moulding-process-parameters-and-defects',
    youtubeId: 'RMjtmsr3CqA',
    level: 'Foundation',
    source: 'Industry'
  },
  // 2. Polymer Chemistry Candidates
  {
    id: 'cand-chem-1',
    subject: 'Polymer Chemistry',
    subjectSlug: 'polymer-chemistry',
    lessonSlug: 'introduction-to-polymers-and-classification',
    youtubeId: 'rHxxLoPgOVM',
    level: 'Foundation',
    source: 'NPTEL'
  },
  {
    id: 'cand-chem-2',
    subject: 'Polymer Chemistry',
    subjectSlug: 'polymer-chemistry',
    lessonSlug: 'step-growth-vs-chain-growth-polymerization',
    youtubeId: 'sB6R3zWzZ4E',
    level: 'Intermediate',
    source: 'University'
  },
  {
    id: 'cand-chem-3',
    subject: 'Polymer Chemistry',
    subjectSlug: 'polymer-chemistry',
    lessonSlug: 'free-radical-polymerization-kinetics',
    youtubeId: 'L8v7wP0z84E',
    level: 'Intermediate',
    source: 'University'
  },
  {
    id: 'cand-chem-4',
    subject: 'Polymer Chemistry',
    subjectSlug: 'polymer-chemistry',
    lessonSlug: 'introduction-to-polymers-and-classification',
    youtubeId: '47dGq14Zz4E',
    level: 'Foundation',
    source: 'NPTEL'
  },
  // 3. Polymer Testing Candidates
  {
    id: 'cand-test-1',
    subject: 'Polymer Testing',
    subjectSlug: 'polymer-testing',
    lessonSlug: 'tensile-testing-astm-d638',
    youtubeId: 'D8U3Gv4jAQA',
    level: 'Foundation',
    source: 'Industry'
  },
  {
    id: 'cand-test-2',
    subject: 'Polymer Testing',
    subjectSlug: 'polymer-testing',
    lessonSlug: 'melt-flow-index-mfi-astm-d1238',
    youtubeId: '6bW700z84E',
    level: 'Foundation',
    source: 'Industry'
  },
  {
    id: 'cand-test-3',
    subject: 'Polymer Testing',
    subjectSlug: 'polymer-testing',
    lessonSlug: 'differential-scanning-calorimetry-dsc-of-polymers',
    youtubeId: 'TA123TaInst',
    level: 'Intermediate',
    source: 'Industry'
  },
  // 4. Polymer Rheology Candidates
  {
    id: 'cand-rheo-1',
    subject: 'Polymer Rheology',
    subjectSlug: 'polymer-rheology',
    lessonSlug: 'introduction-to-rheology-and-viscosity',
    youtubeId: 'u4ZzZ4E0011',
    level: 'Intermediate',
    source: 'University'
  },
  {
    id: 'cand-rheo-2',
    subject: 'Polymer Rheology',
    subjectSlug: 'polymer-rheology',
    lessonSlug: 'shear-thinning-and-non-newtonian-flow',
    youtubeId: 'Rheo1234567',
    level: 'Advanced',
    source: 'University'
  },
  // 5. Mould Design Candidates
  {
    id: 'cand-mould-1',
    subject: 'Mould Design',
    subjectSlug: 'mould-design',
    lessonSlug: 'injection-mould-components-and-types',
    youtubeId: 'Mould123456',
    level: 'Foundation',
    source: 'Industry'
  },
  {
    id: 'cand-mould-2',
    subject: 'Mould Design',
    subjectSlug: 'mould-design',
    lessonSlug: 'runner-system-and-gate-design',
    youtubeId: 'Gate1234567',
    level: 'Intermediate',
    source: 'Industry'
  }
];

async function auditCandidate(candidate) {
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${candidate.youtubeId}&format=json`;
  const thumbUrl = `https://img.youtube.com/vi/${candidate.youtubeId}/hqdefault.jpg`;

  let oembedStatus = 0;
  let oembedData = null;
  let oembedOk = false;

  try {
    const res = await fetch(oembedUrl);
    oembedStatus = res.status;
    if (res.ok) {
      oembedData = await res.json();
      oembedOk = true;
    }
  } catch (e) {
    oembedStatus = 500;
  }

  let thumbStatus = 0;
  let thumbOk = false;

  try {
    const res = await fetch(thumbUrl, { method: 'HEAD' });
    thumbStatus = res.status;
    thumbOk = res.ok;
  } catch (e) {
    thumbStatus = 500;
  }

  const isApproved = oembedOk && thumbOk;

  return {
    ...candidate,
    oembedStatus,
    thumbStatus,
    oembedOk,
    thumbOk,
    approved: isApproved,
    title: oembedData ? oembedData.title : null,
    author: oembedData ? oembedData.author_name : null,
    thumbnailUrl: thumbUrl,
    canonicalUrl: `https://www.youtube.com/watch?v=${candidate.youtubeId}`
  };
}

async function runAudit() {
  console.log('🔍 Auditing Candidate Polymer Videos for Sprint 0A-R2...\n');
  const results = [];

  for (const candidate of CANDIDATES) {
    const res = await auditCandidate(candidate);
    results.push(res);
    console.log(`[${res.approved ? '✅ PASS' : '❌ FAIL'}] ${res.subject} | ID: ${res.youtubeId}`);
    console.log(`   Title: ${res.title || 'N/A'}`);
    console.log(`   Author: ${res.author || 'N/A'}`);
    console.log(`   oEmbed: ${res.oembedStatus} | Thumb: ${res.thumbStatus}\n`);
  }

  const approvedList = results.filter((r) => r.approved);
  console.log(`\n🎉 Audit Complete! Total Candidates: ${CANDIDATES.length} | Approved: ${approvedList.length}`);

  fs.writeFileSync(
    path.join(__dirname, '../video_audit_report.json'),
    JSON.stringify({ auditedAt: new Date().toISOString(), results }, null, 2)
  );

  console.log('📁 Report saved to video_audit_report.json');
}

runAudit();
