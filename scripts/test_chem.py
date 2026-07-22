import urllib.request
import json
import ssl

ssl_context = ssl._create_unverified_context()

IDS = ["d4e1Ka-iaL0", "MBQyRcp99RM", "yP8R-Qp1s2w", "kYJj43S4H2I", "08q75J1Z34E"]

headers = {"User-Agent": "Mozilla/5.0"}
for vid_id in IDS:
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid_id}&format=json"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ssl_context) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode())
                print(f"[200 OK] ID: {vid_id} | Title: \"{data.get('title')}\" by {data.get('author_name')}")
    except Exception as e:
        print(f"[FAIL {vid_id}]: {e}")
