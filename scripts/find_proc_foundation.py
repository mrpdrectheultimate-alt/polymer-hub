import urllib.request
import re
import json
import ssl

ssl_context = ssl._create_unverified_context()
url = "https://www.youtube.com/results?search_query=NPTEL+Injection+Molding+Process+Parameters"
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, context=ssl_context) as resp:
    html = resp.read().decode('utf-8', errors='ignore')
    video_ids = list(set(re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html)))
    for vid_id in video_ids[:15]:
        oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid_id}&format=json"
        try:
            o_req = urllib.request.Request(oembed_url, headers=headers)
            with urllib.request.urlopen(o_req, context=ssl_context) as o_resp:
                if o_resp.status == 200:
                    data = json.loads(o_resp.read().decode())
                    print(f"ID: {vid_id} | Title: \"{data.get('title')}\" by {data.get('author_name')}")
        except Exception:
            pass
