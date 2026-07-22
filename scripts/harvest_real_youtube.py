import urllib.request
import json
import ssl

ssl_context = ssl._create_unverified_context()

# Common active educational video IDs for testing
TEST_IDS = [
    ("RMjtmsr3CqA", "Polymer Processing", "injection-moulding-process-parameters-and-defects"),
    ("s5R8v1_S3qQ", "Polymer Chemistry", "introduction-to-polymers-and-classification"),
    ("fV3eS6_P5XQ", "Polymer Chemistry", "introduction-to-polymers-and-classification"),
    ("yP8R-Qp1s2w", "Polymer Chemistry", "step-growth-vs-chain-growth-polymerization"),
    ("kYJj43S4H2I", "Polymer Chemistry", "introduction-to-polymers-and-classification"),
    ("Jm_R-3-bZ04", "Polymer Testing", "tensile-testing-astm-d638"),
    ("LqUe6z_z7W0", "Polymer Testing", "tensile-testing-astm-d638"),
    ("R9Z8X46jD8I", "Polymer Rheology", "introduction-to-rheology-and-viscosity"),
    ("b1N6T-045", "Polymer Rheology", "shear-thinning-and-non-newtonian-flow"),
    ("b05p2p85G5w", "Mould Design", "injection-mould-components-and-types"),
    ("xV96-r-J9sM", "Mould Design", "runner-system-and-gate-design")
]

print("Auditing Candidate Polymer Videos via oEmbed & Thumbnail APIs...\n")

approved = []

for vid_id, subject, lesson_slug in TEST_IDS:
    oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid_id}&format=json"
    thumb_url = f"https://img.youtube.com/vi/{vid_id}/hqdefault.jpg"
    
    headers = {"User-Agent": "Mozilla/5.0"}
    
    oembed_ok = False
    thumb_ok = False
    title = None
    author = None
    
    try:
        req = urllib.request.Request(oembed_url, headers=headers)
        with urllib.request.urlopen(req, context=ssl_context) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode())
                title = data.get("title")
                author = data.get("author_name")
                oembed_ok = True
    except Exception as e:
        pass
        
    try:
        req_t = urllib.request.Request(thumb_url, headers=headers)
        with urllib.request.urlopen(req_t, context=ssl_context) as resp_t:
            if resp_t.status == 200:
                thumb_ok = True
    except Exception as e:
        pass
        
    if oembed_ok and thumb_ok:
        print(f"[PASS 200 OK] {subject} | ID: {vid_id}")
        print(f"   Title: \"{title}\"")
        print(f"   Author: {author}\n")
        approved.append({
            "id": f"audited-v{len(approved)+1}",
            "subject": subject,
            "subjectSlug": subject.lower().replace(" ", "-"),
            "lessonSlug": lesson_slug,
            "youtubeId": vid_id,
            "title": title,
            "author": author,
            "canonicalUrl": f"https://www.youtube.com/watch?v={vid_id}",
            "embedStatus": "working"
        })
    else:
        print(f"[FAIL] {subject} | ID: {vid_id} (oEmbed: {oembed_ok}, Thumb: {thumb_ok})\n")

print(f"Approved Total: {len(approved)} / {len(TEST_IDS)}")

with open("video_audit_report.json", "w") as f:
    json.dump({"approved": approved}, f, indent=2)
