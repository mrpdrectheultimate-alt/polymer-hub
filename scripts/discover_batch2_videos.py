import urllib.request
import re
import json
import ssl
import time

ssl_context = ssl._create_unverified_context()

BATCH2_TARGETS = [
    ("Polymer Composites", "introduction-to-composite-materials-and-matrices", "https://www.youtube.com/results?search_query=NPTEL+Composite+Materials+GFRP+CFRP+manufacturing"),
    ("Additives & Compounding", "antioxidants-uv-stabilizers-and-flame-retardants", "https://www.youtube.com/results?search_query=Twin+screw+extruder+compounding+plastic+additives"),
    ("Rubber Technology", "natural-rubber-latex-and-vulcanization-kinetics", "https://www.youtube.com/results?search_query=NPTEL+Rubber+Technology+Vulcanization+process"),
    ("Medical Plastics & Biomaterials", "biocompatibility-testing-iso-10993", "https://www.youtube.com/results?search_query=Medical+grade+plastics+biocompatibility+cleanroom"),
    ("Recycling Technology", "mechanical-recycling-sorting-and-re-granulation", "https://www.youtube.com/results?search_query=Plastic+recycling+line+sorting+shredding+extrusion"),
    ("Sustainable Plastics & Bioplastics", "polylactic-acid-pla-and-pha-synthesis", "https://www.youtube.com/results?search_query=PLA+PHA+bioplastics+biodegradable+polymers"),
    ("Plastic Packaging Engineering", "blown-film-extrusion-and-co-extrusion", "https://www.youtube.com/results?search_query=Blown+film+extrusion+process+plastic+packaging"),
    ("Life Cycle Assessment", "iso-14040-lca-framework-for-polymers", "https://www.youtube.com/results?search_query=Life+Cycle+Assessment+ISO+14040+fundamentals"),
    ("Entrepreneurship in Plastics", "plastics-processing-unit-setup-and-business-plan", "https://www.youtube.com/results?search_query=Plastics+manufacturing+business+setup+CIPET"),
    ("Color Science & Masterbatches", "spectrophotometry-cie-lab-and-delta-e", "https://www.youtube.com/results?search_query=Color+masterbatch+manufacturing+spectrophotometry")
]

def find_candidate(subject, lesson_slug, search_url):
    print(f"Searching for {subject} candidates...")
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    try:
        req = urllib.request.Request(search_url, headers=headers)
        with urllib.request.urlopen(req, context=ssl_context) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            video_ids = list(set(re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html)))
            print(f"Found {len(video_ids)} candidate IDs for {subject}")
            
            for vid_id in video_ids[:20]:
                time.sleep(0.15)
                oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid_id}&format=json"
                thumb_url = f"https://img.youtube.com/vi/{vid_id}/hqdefault.jpg"
                try:
                    o_req = urllib.request.Request(oembed_url, headers=headers)
                    t_req = urllib.request.Request(thumb_url, headers=headers)
                    with urllib.request.urlopen(o_req, context=ssl_context) as o_resp, urllib.request.urlopen(t_req, context=ssl_context) as t_resp:
                        if o_resp.status == 200 and t_resp.status == 200:
                            data = json.loads(o_resp.read().decode())
                            title = data.get("title", "")
                            author = data.get("author_name", "")
                            print(f"  [200 OK MATCH] {subject} -> ID: {vid_id}")
                            print(f"     Source Title: \"{title}\"")
                            print(f"     Author: {author}\n")
                            return {
                                "subject": subject,
                                "subjectSlug": subject.lower().replace(" & ", "-").replace(" ", "-"),
                                "lessonSlug": lesson_slug,
                                "youtubeId": vid_id,
                                "sourceTitle": title,
                                "author": author
                            }
                except Exception:
                    pass
    except Exception as e:
        print(f"Error searching {subject}: {e}")
    return None

discovered = []
for subject, lesson_slug, search_url in BATCH2_TARGETS:
    res = find_candidate(subject, lesson_slug, search_url)
    if res:
        discovered.append(res)
    time.sleep(0.5)

print("\n=== DISCOVERED BATCH 2 CANDIDATES ===")
print(json.dumps(discovered, indent=2))
