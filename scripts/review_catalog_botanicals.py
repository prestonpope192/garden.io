#!/usr/bin/env python3
"""Cross-check AI-generated catalogue botanical names for errors (OpenAI gpt-4.1-mini).

For every AI-generated published profile, independently re-derive the botanical
name from the common name (the model never sees the stored value), then diff
against what's stored. Genus-level mismatches are the high-signal errors
(e.g. cassava 'Yuca' stored as Yucca). Writes a JSON report for human
adjudication — it does NOT modify the DB.

Usage:
  SUPABASE_DB_URL=... python3 scripts/review_catalog_botanicals.py --out /tmp/catalog_gen/botanical_review.json
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MODEL = "gpt-4.1-mini"
BATCH = 25


def load_env() -> None:
    for rel in (".env", "website/.env.local"):
        path = ROOT / rel
        if path.exists():
            for line in path.read_text().splitlines():
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, _, v = line.partition("=")
                    os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def norm(s: str | None) -> str:
    return re.sub(r"[^a-z]+", " ", (s or "").lower()).strip()


def fetch_entries(db: str) -> list[dict]:
    out = subprocess.run(
        ["psql", db, "-t", "-A", "-F", "\t", "-c",
         """select p.slug, p.display_name, lower(btrim(t.genus_name)), lower(btrim(coalesce(t.species_name,''))), t.botanical_name_full
            from catalog.plant_profiles p join catalog.plant_taxa t on t.id=p.plant_taxon_id
            where p.is_published and p.is_ai_generated order by p.display_name;"""],
        capture_output=True, text=True, check=True,
    )
    rows = []
    for line in out.stdout.splitlines():
        parts = line.split("\t")
        if len(parts) >= 5:
            rows.append({"slug": parts[0], "common": parts[1], "genus": parts[2], "species": parts[3], "stored": parts[4]})
    return rows


def rederive(api_key: str, model: str, names: list[str]) -> list[str]:
    schema = {
        "type": "object", "additionalProperties": False, "required": ["botanicals"],
        "properties": {"botanicals": {"type": "array", "items": {
            "type": "object", "additionalProperties": False, "required": ["common", "botanical"],
            "properties": {"common": {"type": "string"}, "botanical": {"type": "string"}},
        }}},
    }
    numbered = "\n".join(f"{i+1}. {n}" for i, n in enumerate(names))
    body = json.dumps({
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a botanist. For each common garden-plant name, give the single most widely accepted botanical name for the plant usually meant by that common name. Use 'Genus species' (capitalized genus, lowercase species); genus only if no single species applies. Be careful with confusable names (e.g. Yuca/cassava = Manihot esculenta, NOT Yucca)."},
            {"role": "user", "content": f"Give the botanical name for each:\n{numbered}"},
        ],
        "response_format": {"type": "json_schema", "json_schema": {"name": "botanicals", "strict": True, "schema": schema}},
    }).encode()
    req = urllib.request.Request("https://api.openai.com/v1/chat/completions", data=body,
                                 headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=120) as resp:
        payload = json.loads(resp.read())
    items = json.loads(payload["choices"][0]["message"]["content"]).get("botanicals", [])
    # Align by order (model preserves input order); fall back to length-padding.
    return [it.get("botanical", "") for it in items]


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--model", default=os.environ.get("OPENAI_CATALOG_MODEL", DEFAULT_MODEL))
    ap.add_argument("--limit", type=int)
    args = ap.parse_args()
    load_env()
    db = os.environ.get("SUPABASE_DB_URL"); api = os.environ.get("OPENAI_API_KEY")
    if not db or not api:
        raise SystemExit("SUPABASE_DB_URL and OPENAI_API_KEY required.")

    entries = fetch_entries(db)
    if args.limit:
        entries = entries[: args.limit]
    print(f"Checking {len(entries)} AI entries…", file=sys.stderr)

    flagged = []
    for i in range(0, len(entries), BATCH):
        batch = entries[i:i + BATCH]
        try:
            got = rederive(api, args.model, [e["common"] for e in batch])
        except Exception as exc:  # noqa: BLE001
            print(f"  batch {i}: FAIL {exc}", file=sys.stderr); continue
        for e, suggested in zip(batch, got + [""] * (len(batch) - len(got))):
            sg = norm(suggested).split(" ")[0] if suggested else ""
            stored_g = e["genus"]
            if sg and stored_g and sg != stored_g:
                flagged.append({"slug": e["slug"], "common": e["common"], "stored": e["stored"],
                                "stored_genus": stored_g, "suggested": suggested, "suggested_genus": sg})
        print(f"  {min(i+BATCH,len(entries))}/{len(entries)} checked, {len(flagged)} genus-mismatches", file=sys.stderr)

    args.out.write_text(json.dumps(flagged, indent=2))
    print(f"Wrote {len(flagged)} genus-mismatch flags to {args.out}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
