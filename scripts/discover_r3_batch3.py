import urllib.request
import re
import json
import ssl
import time

ssl_context = ssl._create_unverified_context()

BATCH3_QUERIES = [
    ("Additives & Compounding (Foundation)", "antioxidants-uv-stabilizers-and-flame-retardants", "foundation", "https://www.youtube.com/results?search_query=NPTEL+Polymer+Additives+Plasticizers+Stabilizers+Fillers"),
    ("Sustainable Plastics & Bioplastics (Foundation)", "polylactic-acid-pla-and-pha-synthesis", "foundation", "https://www.youtube.com/results?search_query=NPTEL+Bioplastics+Biobased+Biodegradable+PLA+PHA"),
    ("Plastic Packaging Engineering (Foundation)", "blown-film-extrusion-and-co-extrusion", "foundation", "https://www.youtube.com/results?search_query=NPTEL+Plastic+Packaging+Barrier+Properties+Permeability"),
    ("Entrepreneurship in Plastics (Foundation)", "plastics-processing-unit-setup-and-business-plan", "foundation", "https://www.youtube.com/results?search_query=Plastics+Processing+Factory+Unit+Setup+Business+Plan"),
    ("Color Science & Masterbatches (Foundation)", "spectrophotometry-cie-lab-and-delta-e", "foundation", "https://www.youtube.com/results?search_query=Color+Science+CIE+Lab+Delta+E+Spectrophotometry")
]

def find_working_video(subject, lesson_slug, role, search_url):
    print(f"Searching for Batch 3: {subject} ({role})...")
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
                            print(f"  [200 OK] {subject} -> ID: {vid_id}")
                            print(f"     Title: \"{title}\" by {author}\n")
                            return {
                                "subject": subject.split(" (")[0],
                                "lesson_slug": lesson_slug,
                                "role": role,
                                "youtubeId": vid_id,
                                "sourceTitle": title,
                                "author": author
                            }
                except Exception:
                    pass
    except Exception as e:
        print(f"Error searching {subject}: {e}")
    return None

results = []
for subject, lesson_slug, role, search_url in BATCH3_QUERIES:
    res = find_working_video(subject, lesson_slug, role, search_url)
    if res:
        results.append(res)
    time.sleep(0.5)

print("\n=== DISCOVERED R3 BATCH 3 CANDIDATES ===")
print(json.dumps(results, indent=2))
