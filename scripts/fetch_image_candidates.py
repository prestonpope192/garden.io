#!/usr/bin/env python3
"""Stage 1 of the catalogue image pipeline: fetch PD/CC illustration CANDIDATES
from Wikimedia Commons and build a numbered montage per plant for vision review.

Metadata alone can't tell an illustration from a photo, so this does NOT pick —
it gathers up to N right-species, freely-licensed candidates, downloads small
thumbnails, and composes a labelled montage (0..N-1). A Claude vision pass then
chooses the real botanical illustration. Free: Commons API only.

Run under the Pillow venv:
  SUPABASE_DB_URL=... /tmp/pilvenv/bin/python scripts/fetch_image_candidates.py \
      --slugs lavender,sage --out /tmp/imgverify
"""
from __future__ import annotations

import argparse, concurrent.futures, html, json, os, re, subprocess, sys, time, urllib.parse, urllib.request
from pathlib import Path
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
API = "https://commons.wikimedia.org/w/api.php"
UA = "garden-io-catalog/1.0 (botanical catalogue; preston@splinteredglass.solutions)"
PD = {"public domain", "cc0", "cc-zero", "pd"}
ILLUS = ["köhler","kohler","sturm","curtis","illustration","icones","thomé","thome",
         "lindman","medizinal","engraving","drawing","deutschlands","botanical magazine",
         "lithograph","woodcut","blanco","redouté","redoute","naturalis biodiversity"]
PHOTO = ["dsc","img_","photo","garten","jardin","park "]
YEAR = re.compile(r"\b(19[89][0-9]|20[0-2][0-9])\b")
TAG = re.compile(r"<[^>]+>")
FONT = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"

def clean(t): return html.unescape(TAG.sub("", t or "")).strip()

def load_env():
    for rel in (".env", "website/.env.local"):
        p = ROOT/rel
        if p.exists():
            for ln in p.read_text().splitlines():
                ln=ln.strip()
                if ln and not ln.startswith("#") and "=" in ln:
                    k,_,v=ln.partition("="); os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

def api(params):
    req=urllib.request.Request(API+"?"+urllib.parse.urlencode(params), headers={"User-Agent":UA})
    with urllib.request.urlopen(req, timeout=40) as r: return json.loads(r.read())

def plants_from_db(db, slugs, limit, offset):
    if slugs:
        inlist=",".join("'"+s.replace("'","''")+"'" for s in slugs)
        where=f"p.slug in ({inlist})"
    else:
        where=("p.is_published and t.species_name is not null and not exists "
               "(select 1 from catalog.plant_images i where i.plant_profile_id=p.id)")
    q=(f"select p.slug,p.display_name,t.botanical_name_full,t.genus_name,t.species_name "
       f"from catalog.plant_profiles p join catalog.plant_taxa t on t.id=p.plant_taxon_id "
       f"where {where} order by p.display_name limit {int(limit)} offset {int(offset)};")
    out=subprocess.run(["psql",db,"-t","-A","-F","\t","-c",q],capture_output=True,text=True,check=True)
    rows=[]
    for ln in out.stdout.splitlines():
        c=ln.split("\t")
        if len(c)>=5 and c[4]: rows.append(dict(slug=c[0],name=c[1],botanical=c[2],genus=c[3],species=c[4]))
    return rows

def candidates(genus, species, want=6):
    try:
        d=api({"action":"query","format":"json","generator":"search",
               "gsrsearch":f"{genus} {species}","gsrnamespace":"6","gsrlimit":"40",
               "prop":"imageinfo","iiprop":"url|mime|extmetadata","iiurlwidth":"360"})
    except Exception: return []
    cands=[]
    for pg in (d.get("query",{}).get("pages",{}) or {}).values():
        ii=(pg.get("imageinfo") or [None])[0]
        if not ii or not ii.get("mime","").startswith("image/"): continue
        title=pg.get("title") or ""; tl=title.lower()
        if len(species)<4 or species.lower() not in tl or genus[:4].lower() not in tl: continue
        meta=ii.get("extmetadata",{}) or {}
        lic=clean((meta.get("LicenseShortName",{}) or {}).get("value","")); ll=lic.lower()
        is_pd=any(k in ll for k in PD); is_ccby=ll.startswith(("cc by","cc-by"))
        if not (is_pd or is_ccby): continue
        # soft score to surface likely-illustrations first (vision makes the call)
        sc=(40 if is_pd else 0)+(35 if any(k in tl for k in ILLUS) else 0)
        sc+=(8 if ii.get("mime") in ("image/png","image/tiff") else 0)
        if YEAR.search(tl): sc-=20
        if any(h in tl for h in PHOTO): sc-=25
        cands.append(dict(score=sc, title=title, thumb=ii.get("thumburl") or ii.get("url"),
                          page=ii.get("descriptionurl"), artist=clean((meta.get("Artist",{}) or {}).get("value",""))[:120],
                          license=lic or "Public domain", pd=is_pd))
    cands.sort(key=lambda x:x["score"], reverse=True)
    return cands[:want]

def fetch_img(url, tries=3):
    for i in range(tries):
        try:
            req=urllib.request.Request(url, headers={"User-Agent":UA, "Referer":"https://commons.wikimedia.org/"})
            return Image.open(BytesIO(urllib.request.urlopen(req,timeout=50).read())).convert("RGB")
        except Exception:
            time.sleep(0.5*(i+1))
    return None

def montage(slug, cands, outdir):
    thumbs=[]
    for c in cands:
        thumbs.append(fetch_img(c["thumb"]))
        time.sleep(0.3)
    cell=300; cols=3; rows=(len(cands)+cols-1)//cols or 1
    sheet=Image.new("RGB",(cols*cell, rows*cell),(238,238,234)); d=ImageDraw.Draw(sheet)
    f=ImageFont.truetype(FONT,40)
    for i,im in enumerate(thumbs):
        x=(i%cols)*cell; y=(i//cols)*cell
        if im: im.thumbnail((cell-16,cell-46)); sheet.paste(im,(x+8,y+38))
        d.rectangle([x+2,y+2,x+cell-2,y+cell-2],outline=(180,180,170),width=1)
        d.rectangle([x+6,y+4,x+44,y+34],fill=(40,40,40))
        d.text((x+14,y+0),str(i),font=f,fill=(255,255,255))
    path=Path(outdir)/"montage"/f"{slug}.png"; path.parent.mkdir(parents=True,exist_ok=True)
    sheet.save(path); return str(path)

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--slugs"); ap.add_argument("--limit",type=int,default=40); ap.add_argument("--offset",type=int,default=0)
    ap.add_argument("--out",type=Path,default=Path("/tmp/imgverify")); ap.add_argument("--want",type=int,default=5)
    ap.add_argument("--workers",type=int,default=8)
    a=ap.parse_args(); load_env()
    db=os.environ.get("SUPABASE_DB_URL")
    if not db: raise SystemExit("SUPABASE_DB_URL required")
    slugs=[s.strip() for s in a.slugs.split(",")] if a.slugs else None
    plants=plants_from_db(db, slugs, a.limit, a.offset)
    a.out.mkdir(parents=True,exist_ok=True)
    (a.out/"montage").mkdir(parents=True, exist_ok=True)

    def work(p):
        cands=candidates(p["genus"],p["species"],a.want)
        if not cands:
            print(f"  {p['slug']}: 0 candidates",file=sys.stderr)
            return dict(p, candidates=[], montage=None)
        mp=montage(p["slug"],cands,a.out)
        print(f"  {p['slug']}: {len(cands)} candidates",file=sys.stderr)
        return dict(p, candidates=cands, montage=mp)

    manifest=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=a.workers) as pool:
        for r in pool.map(work, plants):
            manifest.append(r)
    (a.out/"candidates.json").write_text(json.dumps(manifest,indent=2))
    have=[m for m in manifest if m["candidates"]]
    print(f"\n{len(have)}/{len(plants)} plants have >=1 candidate. Montages in {a.out}/montage/",file=sys.stderr)

if __name__=="__main__": main()
