#!/usr/bin/env python3
"""Fallback: generate botanical illustrations for catalogue plants with no image.

For each published plant that still lacks a primary image (the gaps left after
the public-domain pass), generate a herbarium-style colour illustration with
OpenAI gpt-image-1, upload it to the 'plant-art' Supabase Storage bucket, and
upsert catalog.plant_images (credited as AI-generated). Paid: ~$0.04/image at
medium quality.

  SUPABASE_DB_URL=... python3 scripts/generate_catalog_images.py --limit 50 --quality medium
"""
from __future__ import annotations
import argparse, base64, json, os, subprocess, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUCKET = "plant-art"

def load_env():
    for rel in (".env", "website/.env.local"):
        p=ROOT/rel
        if p.exists():
            for ln in p.read_text().splitlines():
                ln=ln.strip()
                if ln and not ln.startswith("#") and "=" in ln:
                    k,_,v=ln.partition("="); os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

def gaps(db, limit, offset):
    q=(f"select p.slug,p.display_name,t.botanical_name_full,p.plant_type_code "
       f"from catalog.plant_profiles p join catalog.plant_taxa t on t.id=p.plant_taxon_id "
       f"where p.is_published and not exists "
       f"(select 1 from catalog.plant_images i where i.plant_profile_id=p.id and i.is_primary and i.is_public) "
       f"order by p.display_name limit {int(limit)} offset {int(offset)};")
    out=subprocess.run(["psql",db,"-t","-A","-F","\t","-c",q],capture_output=True,text=True,check=True)
    rows=[]
    for ln in out.stdout.splitlines():
        c=ln.split("\t")
        if len(c)>=3: rows.append(dict(slug=c[0],name=c[1],botanical=c[2],type=c[3] if len(c)>3 else ""))
    return rows

def gen(api_key, model, quality, name, botanical):
    prompt=(f"Vintage botanical illustration of {name} ({botanical}), 19th-century herbarium plate style: "
            "naturalistic hand-painted whole plant — leaves, stems, and flowers or fruit as appropriate — "
            "on aged warm cream paper with subtle texture, soft muted natural colours, fine botanical detail, "
            "elegant and restrained. No text, no labels, no border, centered specimen.")
    body=json.dumps({"model":model,"prompt":prompt,"size":"1024x1024","quality":quality,"n":1}).encode()
    req=urllib.request.Request("https://api.openai.com/v1/images/generations", data=body,
        headers={"Authorization":f"Bearer {api_key}","Content-Type":"application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=240) as r:
        return base64.b64decode(json.loads(r.read())["data"][0]["b64_json"])

def upload(supa, key, path, data):
    req=urllib.request.Request(f"{supa}/storage/v1/object/{BUCKET}/{path}", data=data, method="POST",
        headers={"Authorization":f"Bearer {key}","apikey":key,"Content-Type":"image/jpeg","x-upsert":"true"})
    urllib.request.urlopen(req, timeout=90).read()
    return f"{supa}/storage/v1/object/public/{BUCKET}/{path}"

def esc(s): return (s or "").replace("'","''")

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=50); ap.add_argument("--offset", type=int, default=0)
    ap.add_argument("--quality", default="medium", choices=["low","medium","high"])
    ap.add_argument("--model", default=os.environ.get("OPENAI_IMAGE_MODEL","gpt-image-1"))
    a=ap.parse_args(); load_env()
    db=os.environ.get("SUPABASE_DB_URL"); supa=os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key=os.environ.get("SUPABASE_SERVICE_ROLE_KEY"); api=os.environ.get("OPENAI_API_KEY")
    if not (db and supa and key and api): raise SystemExit("need SUPABASE_DB_URL, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY")

    plants=gaps(db, a.limit, a.offset)
    print(f"Generating {len(plants)} images ({a.quality}, {a.model})…", file=sys.stderr)
    rows=[]
    for i,p in enumerate(plants,1):
        try:
            data=gen(api, a.model, a.quality, p["name"], p["botanical"])
            url=upload(supa, key, f"{p['slug']}.jpg", data)
        except Exception as e:
            detail=e.read().decode()[:160] if hasattr(e,"read") else str(e)
            print(f"  [{i}/{len(plants)}] {p['slug']}: FAIL {detail}", file=sys.stderr); continue
        rows.append((p["slug"], url))
        if i % 20 == 0: print(f"  {i}/{len(plants)}…", file=sys.stderr)

    if not rows: print("nothing generated", file=sys.stderr); return
    stmts=["begin;"]
    slugs="','".join(esc(r[0]) for r in rows)
    for slug,url in rows:
        stmts.append(
          "insert into catalog.plant_images (plant_profile_id,image_url,attribution_text,license,mime_type,is_primary,is_public) "
          f"select p.id,'{esc(url)}','AI-generated botanical illustration · Garden.io','AI-generated','image/jpeg',true,true "
          f"from catalog.plant_profiles p where p.slug='{esc(slug)}' and p.deleted_at is null "
          f"and not exists (select 1 from catalog.plant_images i where i.plant_profile_id=p.id and i.image_url='{esc(url)}');")
    stmts.append(f"update catalog.plant_images set is_primary=false where image_url like '%.svg' "
                 f"and plant_profile_id in (select id from catalog.plant_profiles where slug in ('{slugs}'));")
    stmts.append("commit;")
    r=subprocess.run(["psql",db,"-v","ON_ERROR_STOP=1","-c","\n".join(stmts)],capture_output=True,text=True)
    print(r.stderr[-300:], file=sys.stderr)
    print(f"generated + stored {len(rows)} images", file=sys.stderr)

if __name__=="__main__": main()
