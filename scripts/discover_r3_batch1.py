import urllib.request
import re
import json
import ssl
import time

ssl_context = ssl._create_unverified_context()

BATCH1_QUERIES = [
    ("Polymer Testing (Applied)", "tensile-testing-astm-d638", "applied", "https://www.youtube.com/results?search_query=ASTM+D638+Tensile+Testing+Plastics+Instron"),
    ("Mould Design (Applied)", "runner-system-and-gate-design", "applied", "https://www.youtube.com/results?search_query=Injection+Mold+Runner+Gate+Cooling+Design"),
    ("Medical Plastics (Applied)", "biocompatibility-testing-iso-10993", "applied", "https://www.youtube.com/results?search_query=ISO+10993+Biocompatibility+Testing+Medical+Plastics"),
    ("Rubber Technology (Foundation)", "natural-rubber-latex-and-vulcanization-kinetics", "foundation", "https://www.youtube.com/results?search_query=Vulcanization+Chemistry+Rubber+Cure+Kinetics"),
    ("Polymer Processing (Foundation)", "injection-moulding-process-parameters-and-defects", "foundation", "https://www.youtube.com/results?search_query=NPTEL+Polymer+Processing+Principles+Parameters")
]

def find_working_video(subject, lesson_slug, role, search_url):
    print(f"Searching for {subject} ({role})...")
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
for subject, lesson_slug, role, search_url in BATCH1_QUERIES:
    res = find_working_video(subject, lesson_slug, role, search_url)
    if res:
        results.append(res)
    time.sleep(0.5)

print("\n=== DISCOVERED R3 BATCH 1 CANDIDATES ===")
print(json.dumps(results, indent=2))
