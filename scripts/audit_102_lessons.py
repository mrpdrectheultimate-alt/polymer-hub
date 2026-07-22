import os
import json
import re
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('.env.local')

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not url or not key:
    print("Error: Missing Supabase credentials")
    exit(1)

supabase = create_client(url, key)

MODULE_ARCHITECTURE = {
    "polymer-processing": [
        "Module 1 — Processing Fundamentals",
        "Module 2 — Injection Moulding",
        "Module 3 — Extrusion & Film Processing",
        "Module 4 — Blow Moulding & Thermoforming",
        "Module 5 — Advanced & Emerging Processing"
    ],
    "polymer-chemistry": [
        "Module 1 — Chemical Fundamentals & Polymerization",
        "Module 2 — Synthesis & Reaction Mechanisms",
        "Module 3 — Polymer Structure & Molecular Weight",
        "Module 4 — Industrial Polymers & Degradation"
    ],
    "mould-design": [
        "Module 1 — Mould Fundamentals & Tooling",
        "Module 2 — Injection Mould Systems (Runner, Gate, Ejection)",
        "Module 3 — Cooling & Thermal Management",
        "Module 4 — Advanced Mould Design & Defect Prevention"
    ],
    "polymer-testing": [
        "Module 1 — Quality Assurance & Testing Standards",
        "Module 2 — Mechanical & Tensile Testing",
        "Module 3 — Thermal & Rheological Characterization",
        "Module 4 — Chemical & Spectroscopic Analysis"
    ],
    "polymer-rheology": [
        "Module 1 — Viscosity & Shear Flow Fundamentals",
        "Module 2 — Viscoelasticity & Rheometry",
        "Module 3 — Processing Rheology & Flow Instabilities"
    ],
    "rubber-technology": [
        "Module 1 — Elastomer Science & Natural Rubber",
        "Module 2 — Vulcanization Chemistry & Compounding",
        "Module 3 — Synthetic Rubbers & Industrial Processing"
    ],
    "recycling-technology": [
        "Module 1 — Recycling Fundamentals & Sorting",
        "Module 2 — Mechanical Recycling & Reprocessing",
        "Module 3 — Chemical Recycling & Circular Economy"
    ],
    "sustainable-plastics": [
        "Module 1 — Bio-Based & Biodegradable Fundamentals",
        "Module 2 — PLA, PHA & Bio-Polymers",
        "Module 3 — Sustainability Standards & Degradation"
    ],
    "polymer-composites": [
        "Module 1 — Composite Fundamentals & Matrices",
        "Module 2 — Reinforcement Fibers & Interfaces",
        "Module 3 — Composite Manufacturing & Processing"
    ],
    "additives-compounding": [
        "Module 1 — Additive Chemistry & Functional Roles",
        "Module 2 — Compounding Extrusion & Masterbatches",
        "Module 3 — High-Performance Formulations"
    ],
    "medical-plastics": [
        "Module 1 — Medical Polymer Science & Biocompatibility",
        "Module 2 — ISO 10993 Testing & Cleanroom Molding",
        "Module 3 — Implants, Devices & Sterilization"
    ],
    "plastic-packaging-engineering": [
        "Module 1 — Packaging Materials & Barrier Properties",
        "Module 2 — Flexible & Rigid Packaging Production",
        "Module 3 — Shelf Life & Migration Safety"
    ],
    "life-cycle-assessment": [
        "Module 1 — ISO 14040/14044 Framework & LCI",
        "Module 2 — Environmental Impact Assessment & Carbon Footprint",
        "Module 3 — Polymer Circularity & End-of-Life Scenarios"
    ],
    "color-science-masterbatches": [
        "Module 1 — Colorimetry & CIE L*a*b* Fundamentals",
        "Module 2 — Masterbatch Formulation & Pigments",
        "Module 3 — Color Matching & Quality Control"
    ],
    "entrepreneurship-plastics": [
        "Module 1 — Market Validation & Product Selection",
        "Module 2 — Factory Setup, CAPEX & Unit Economics",
        "Module 3 — Regulatory Compliance & Operations"
    ]
}

def audit_lesson_content(title, content):
    if not content:
        content = ""
    
    char_len = len(content)
    has_eq = bool(re.search(r'\\[|\$|\\\(|=|\\frac', content))
    has_diagram = bool(re.search(r'```mermaid|!\[|svg|Diagram|Figure', content, re.IGNORECASE))
    has_example = bool(re.search(r'Indian|Reliance|Tata|Supreme|Global|Industrial Example|Case Study', content, re.IGNORECASE))
    has_sources = bool(re.search(r'Source|Reference|ASTM|ISO|NPTEL|Standard', content, re.IGNORECASE))
    has_objectives = bool(re.search(r'Objective|Learning Objective|Why It Matters', content, re.IGNORECASE))
    
    tech_accuracy = 22 if char_len > 3000 else (18 if char_len > 1500 else 12)
    conceptual_depth = 18 if (char_len > 2500 and has_eq) else (14 if char_len > 1200 else 9)
    structure_clarity = 13 if (has_objectives and char_len > 1000) else 8
    visual_quality = 10 if has_diagram else 4
    industrial_relevance = 9 if has_example else 5
    assessment_quality = 8
    sources_freshness = 9 if has_sources else 4

    total_score = tech_accuracy + conceptual_depth + structure_clarity + visual_quality + industrial_relevance + assessment_quality + sources_freshness

    if total_score >= 85:
        grade = "A"
        review_status = "approved"
    elif total_score >= 70:
        grade = "B"
        review_status = "needs_light_revision"
    elif total_score >= 50:
        grade = "C"
        review_status = "needs_deep_revision"
    else:
        grade = "D"
        review_status = "rewrite_required"

    return {
        "score": total_score,
        "grade": grade,
        "review_status": review_status,
        "breakdown": {
            "tech_accuracy": tech_accuracy,
            "conceptual_depth": conceptual_depth,
            "structure_clarity": structure_clarity,
            "visual_quality": visual_quality,
            "industrial_relevance": industrial_relevance,
            "assessment_quality": assessment_quality,
            "sources_freshness": sources_freshness
        },
        "content_length": char_len,
        "has_equations": has_eq,
        "has_diagram": has_diagram,
        "has_industrial_example": has_example,
        "has_sources": has_sources
    }

print("=== SPRINT 1A: 102-LESSON CURRICULUM AUDIT & MODULE ARCHITECTURE ===")

res = supabase.from_('lessons').select('id, title, slug, content, subject_id, subjects(slug, name)').execute()
lessons = res.data

print(f"Retrieved {len(lessons)} lessons from Supabase database.")

audited_lessons = []
subject_counts = {}

for index, l in enumerate(lessons):
    sub_info = l.get('subjects') or {}
    sub_slug = sub_info.get('slug') or 'polymer-processing'
    sub_name = sub_info.get('name') or 'Polymer Processing'

    if sub_slug not in subject_counts:
        subject_counts[sub_slug] = 0
    subject_counts[sub_slug] += 1
    
    modules = MODULE_ARCHITECTURE.get(sub_slug, MODULE_ARCHITECTURE["polymer-processing"])
    mod_index = (subject_counts[sub_slug] - 1) % len(modules)
    assigned_module = modules[mod_index]

    if mod_index == 0:
        level = "foundation"
    elif mod_index == len(modules) - 1:
        level = "advanced"
    else:
        level = "intermediate"

    audit = audit_lesson_content(l.get('title'), l.get('content'))

    audited_lessons.append({
        "id": l['id'],
        "title": l['title'],
        "slug": l['slug'],
        "subject_name": sub_name,
        "subject_slug": sub_slug,
        "module_name": assigned_module,
        "level": level,
        "quality_score": audit["score"],
        "grade": audit["grade"],
        "review_status": audit["review_status"],
        "content_length": audit["content_length"],
        "breakdown": audit["breakdown"],
        "has_equations": audit["has_equations"],
        "has_diagram": audit["has_diagram"],
        "has_industrial_example": audit["has_industrial_example"],
        "has_sources": audit["has_sources"]
    })

audited_lessons.sort(key=lambda x: x["quality_score"])

weakest_30 = [l for l in audited_lessons if l["quality_score"] < 75][:30]
if len(weakest_30) < 30:
    weakest_30 = audited_lessons[:30]

print(f"\nAudit completed across {len(audited_lessons)} lessons.")
print(f"Grade A (85-100): {len([l for l in audited_lessons if l['grade'] == 'A'])}")
print(f"Grade B (70-84):  {len([l for l in audited_lessons if l['grade'] == 'B'])}")
print(f"Grade C (50-69):  {len([l for l in audited_lessons if l['grade'] == 'C'])}")
print(f"Grade D (<50):    {len([l for l in audited_lessons if l['grade'] == 'D'])}")

summary_data = {
    "sprint": "Sprint 1A — 102-Lesson Curriculum Audit & Module Architecture",
    "total_lessons": len(audited_lessons),
    "grade_distribution": {
        "A": len([l for l in audited_lessons if l['grade'] == 'A']),
        "B": len([l for l in audited_lessons if l['grade'] == 'B']),
        "C": len([l for l in audited_lessons if l['grade'] == 'C']),
        "D": len([l for l in audited_lessons if l['grade'] == 'D'])
    },
    "weakest_30_lessons": [{
        "id": l["id"],
        "title": l["title"],
        "slug": l["slug"],
        "subject": l["subject_name"],
        "module": l["module_name"],
        "score": l["quality_score"],
        "grade": l["grade"],
        "status": l["review_status"]
    } for l in weakest_30],
    "all_audited_lessons": audited_lessons
}

with open("curriculum_audit_report.json", "w") as f:
    json.dump(summary_data, f, indent=2)

print("\nAudit report exported to curriculum_audit_report.json")

for l in audited_lessons:
    supabase.from_('lessons').update({
        "module_name": l["module_name"],
        "level": l["level"],
        "quality_score": l["quality_score"],
        "review_status": l["review_status"],
        "version": 1
    }).eq('id', l["id"]).execute()

print("Supabase database updated with module_name, level, quality_score, and review_status!")
