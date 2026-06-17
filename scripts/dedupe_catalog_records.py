#!/usr/bin/env python3
"""Dedupe generated catalog records against the DB and within the batch.

A taxon may already exist (the catalogue allows only one published profile per
taxon), and two different common names can resolve to the same species. This
moves any record whose botanical_name_full already exists in catalog.plant_taxa,
or repeats one earlier in the batch, into a _skipped/ dir — so the remaining set
imports cleanly.

Usage:
  SUPABASE_DB_URL=... python3 scripts/dedupe_catalog_records.py --dir /tmp/catalog_gen/records
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path


def existing_taxa_keys(db: str) -> set[str]:
    # Match the DB's actual uniqueness: (lower(genus), coalesce(lower(species),'')).
    out = subprocess.run(
        ["psql", db, "-t", "-A", "-F", "|", "-c",
         "select lower(btrim(genus_name)), lower(btrim(coalesce(species_name,''))) from catalog.plant_taxa where genus_name is not null;"],
        capture_output=True, text=True, check=True,
    )
    keys = set()
    for line in out.stdout.splitlines():
        if "|" in line:
            g, s = line.split("|", 1)
            keys.add(f"{g.strip()}|{s.strip()}")
    return keys


def record_key(rec: dict) -> str:
    t = rec.get("taxonomy", {})
    g = (t.get("genus_name") or "").strip().lower()
    s = (t.get("species_name") or "").strip().lower()
    return f"{g}|{s}"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dir", required=True, type=Path)
    args = parser.parse_args()
    db = os.environ.get("SUPABASE_DB_URL")
    if not db:
        raise SystemExit("SUPABASE_DB_URL required.")

    skipped_dir = args.dir / "_skipped"
    skipped_dir.mkdir(exist_ok=True)

    seen = existing_taxa_keys(db)
    print(f"{len(seen)} existing taxa keys loaded.", file=sys.stderr)

    kept = skipped = bad = 0
    for path in sorted(args.dir.glob("*.json")):
        try:
            rec = json.loads(path.read_text())
            key = record_key(rec)
        except (json.JSONDecodeError, OSError):
            path.rename(skipped_dir / path.name)
            bad += 1
            continue
        if key == "|" or key in seen:
            path.rename(skipped_dir / path.name)
            skipped += 1
            continue
        seen.add(key)
        kept += 1
    print(f"kept={kept} skipped_dup={skipped} bad={bad} (skipped moved to {skipped_dir})", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
