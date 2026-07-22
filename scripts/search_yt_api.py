import urllib.request
import re
import json
import ssl
import time

ssl_context = ssl._create_unverified_context()

QUERIES = [
    ("Polymer Chemistry", "introduction-to-polymers-and-classification", "https://www.youtube.com/results?search_query=NPTEL+Polymer+Chemistry+IIT+Kharagpur"),
    ("Polymer Chemistry Alt", "step-growth-vs-chain-growth-polymerization", "https://www.youtube.com/results?search_query=NPTEL+Polymer+Science+Dibakar+Dhara")
]

def find_working_id(subject, search_url):
    print(f"Searching for {subject} videos...")
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    try:
        req = urllib.request.Request(search_url, headers=headers)
        with urllib.request.urlopen(req, context=ssl_context) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            video_ids = list(set(re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html)))
            print(f"Found {len(video_ids)} candidate IDs for {subject}")
            
            for vid_id in video_ids[:15]:
                time.sleep(0.2)
                oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid_id}&format=json"
                try:
                    o_req = urllib.request.Request(oembed_url, headers=headers)
                    with urllib.request.urlopen(o_req, context=ssl_context) as o_resp:
                        if o_resp.status == 200:
                            data = json.loads(o_resp.read().decode())
                            title = data.get("title", "")
                            author = data.get("author_name", "")
                            if any(w in title.lower() for w in ["polymer", "chemistry", "testing", "mould", "mold", "tensile", "viscosity", "lec"]):
                                print(f"[FOUND 200 OK MATCH] {subject} -> ID: {vid_id} | Title: \"{title}\" by {author}")
                                return {
                                    "subject": subject,
                                    "youtubeId": vid_id,
                                    "title": title,
                                    "author": author
                                }
                except Exception:
                    pass
    except Exception as e:
        print(f"Error searching {subject}: {e}")
    return None

results = []
for subject, lesson_slug, search_url in QUERIES:
    res = find_working_id(subject, search_url)
    if res:
        res["lessonSlug"] = lesson_slug
        results.append(res)
    time.sleep(1)

print("\n--- FINAL DISCOVERED 200 OK VIDEOS ---")
print(json.dumps(results, indent=2))
