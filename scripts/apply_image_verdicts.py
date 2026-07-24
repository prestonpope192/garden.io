#!/usr/bin/env python3
"""Stage 3 of the image pipeline: apply vision verdicts.

Given the fetch candidates + a {slug: best_index} verdict map, download each
chosen illustration at higher resolution, upload it to the public 'plant-art'
Supabase Storage bucket, and upsert catalog.plant_images (primary, public, with
attribution + license), demoting any SVG placeholder so the real plate wins.

  SUPABASE_DB_URL=... python3 scripts/apply_image_verdicts.py \
      --candidates /tmp/imgverify/full/candidates.json --verdicts /tmp/imgverify/verdicts.json
"""
from __future__ import annotations
import argparse, json, os, subprocess, sys, time, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UA = {"User-Agent": "garden-io-catalog/1.0 (preston@splinteredglass.solutions)"}
BUCKET = "plant-art"

def load_env():
    for rel in (".env", "website/.env.local"):
        p = ROOT/rel
        if p.exists():
            for ln in p.read_text().splitlines():
                ln=ln.strip()
                if ln and not ln.startswith("#") and "=" in ln:
                    k,_,v=ln.partition("="); os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

def big_url(title, w=1100):
    q={"action":"query","format":"json","titles":title,"prop":"imageinfo","iiprop":"url","iiurlwidth":str(w)}
    try:
        req=urllib.request.Request("https://commons.wikimedia.org/w/api.php?"+urllib.parse.urlencode(q), headers=UA)
        d=json.loads(urllib.request.urlopen(req,timeout=40).read())
        for p in d["query"]["pages"].values():
            ii=(p.get("imageinfo") or [{}])[0]
            return ii.get("thumburl") or ii.get("url")
    except Exception:
        return None

def upload(supa, key, path, data):
    url=f"{supa}/storage/v1/object/{BUCKET}/{path}"
    req=urllib.request.Request(url, data=data, method="POST",
        headers={"Authorization":f"Bearer {key}","apikey":key,"Content-Type":"image/jpeg","x-upsert":"true"})
    urllib.request.urlopen(req, timeout=90).read()
    return f"{supa}/storage/v1/object/public/{BUCKET}/{path}"

def esc(s): return (s or "").replace("'","''")

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--candidates", required=True, type=Path)
    ap.add_argument("--verdicts", required=True, type=Path)
    a=ap.parse_args(); load_env()
    db=os.environ.get("SUPABASE_DB_URL"); supa=os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key=os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not (db and supa and key): raise SystemExit("need SUPABASE_DB_URL, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY")
    cand={c["slug"]:c for c in json.loads(a.candidates.read_text())}
    verdicts=json.loads(a.verdicts.read_text())  # {slug: best_index}

    rows=[]; done=0
    for slug, best in verdicts.items():
        if best is None or best < 0 or slug not in cand: continue
        cands=cand[slug]["candidates"]
        if best >= len(cands): continue
        c=cands[best]
        url=big_url(c["title"]) or c["thumb"]
        data=None
        for attempt in range(5):
            try:
                data=urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()
                break
            except Exception as e:
                time.sleep(1.2*(attempt+1))
        if not data:
            print(f"  {slug}: download FAIL", file=sys.stderr); continue
        try:
            public=upload(supa, key, f"{slug}.jpg", data)
        except Exception as e:
            print(f"  {slug}: upload FAIL {e}", file=sys.stderr); continue
        time.sleep(0.4)
        attribution=" · ".join(filter(None,[c.get("artist") or "Unknown artist", c.get("license"), "Wikimedia Commons"]))
        rows.append((slug, public, attribution, c.get("license") or "Public domain"))
        done+=1
        if done % 25 == 0: print(f"  uploaded {done}…", file=sys.stderr)

    if not rows:
        print("no images to apply", file=sys.stderr); return
    stmts=["begin;"]
    slugs="','".join(esc(r[0]) for r in rows)
    for slug,url,attr,lic in rows:
        stmts.append(
          "insert into catalog.plant_images (plant_profile_id,image_url,attribution_text,license,mime_type,is_primary,is_public) "
          f"select p.id,'{esc(url)}','{esc(attr)}','{esc(lic)}','image/jpeg',true,true from catalog.plant_profiles p "
          f"where p.slug='{esc(slug)}' and p.deleted_at is null "
          f"and not exists (select 1 from catalog.plant_images i where i.plant_profile_id=p.id and i.image_url='{esc(url)}');")
    # demote any placeholder so the new plate is primary
    stmts.append(f"update catalog.plant_images set is_primary=false where image_url like '%.svg' "
                 f"and plant_profile_id in (select id from catalog.plant_profiles where slug in ('{slugs}'));")
    stmts.append("commit;")
    r=subprocess.run(["psql",db,"-v","ON_ERROR_STOP=1","-c","\n".join(stmts)], capture_output=True, text=True)
    print(r.stdout[-200:]); print(r.stderr[-300:], file=sys.stderr)
    print(f"applied {len(rows)} images", file=sys.stderr)

if __name__=="__main__": main()
