import urllib.request
import re
import json
import ssl
import time

ssl_context = ssl._create_unverified_context()

BATCH2_QUERIES = [
    ("Polymer Composites (Applied)", "introduction-to-composite-materials-and-matrices", "applied", "https://www.youtube.com/results?search_query=Carbon+Fiber+Layup+Vacuum+Bagging+Composite+Manufacturing"),
    ("Polymer Rheology (Applied)", "introduction-to-rheology-and-viscosity", "applied", "https://www.youtube.com/results?search_query=Rotational+Rheometer+Polymer+Melt+Viscosity+Test"),
    ("Polymer Chemistry (Applied)", "addition-and-condensation-polymerization-mechanisms", "applied", "https://www.youtube.com/results?search_query=Nylon+66+Polymerization+Synthesis+Experiment"),
    ("Recycling Technology (Applied)", "mechanical-recycling-sorting-and-re-granulation", "applied", "https://www.youtube.com/results?search_query=PET+Bottle+Recycling+Plant+Sorting+Washing+Extrusion"),
    ("Life Cycle Assessment (Applied)", "iso-14040-lca-framework-for-polymers", "applied", "https://www.youtube.com/results?search_query=Life+Cycle+Assessment+Plastic+Packaging+LCA+Case+Study")
]

def find_working_video(subject, lesson_slug, role, search_url):
    print(f"Searching for Batch 2: {subject} ({role})...")
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
for subject, lesson_slug, role, search_url in BATCH2_QUERIES:
    res = find_working_video(subject, lesson_slug, role, search_url)
    if res:
        results.append(res)
    time.sleep(0.5)

print("\n=== DISCOVERED R3 BATCH 2 CANDIDATES ===")
print(json.dumps(results, indent=2))
