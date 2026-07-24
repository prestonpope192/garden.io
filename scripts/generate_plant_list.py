#!/usr/bin/env python3
"""Generate a deduplicated list of popular garden-plant common names (OpenAI gpt-4.1-mini).

Asks the model for popular plants per category, dedupes by normalized name, drops
any whose slug already exists in the catalogue, and writes one name per line.
Over-generates so the downstream botanical dedup still lands near the target.

Usage:
  python3 scripts/generate_plant_list.py --out /tmp/catalog_gen/names.txt
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

# (category prompt, count) — over-generate; dedup trims to ~target.
CATEGORIES = [
    ("popular vegetables grown in home gardens", 130),
    ("popular culinary and medicinal herbs", 80),
    ("popular annual flowers for gardens", 130),
    ("popular perennial flowers and forbs", 160),
    ("popular garden shrubs", 130),
    ("popular small ornamental and fruit trees for yards", 100),
    ("popular fruit, berry, and nut plants for home growers", 100),
    ("popular climbing vines for gardens", 55),
    ("popular groundcover plants", 45),
    ("popular flowering bulbs, corms, and tubers", 70),
    ("popular ornamental grasses", 45),
    ("popular succulents and cacti for gardens", 55),
]


def slugify(value: str) -> str:
    value = value.strip().lower().replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return re.sub(r"-+", "-", value).strip("-")


def norm(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def load_env() -> None:
    for rel in (".env", "website/.env.local"):
        path = ROOT / rel
        if path.exists():
            for line in path.read_text().splitlines():
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, _, v = line.partition("=")
                    os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def list_category(api_key: str, model: str, category: str, count: int) -> list[str]:
    schema = {
        "type": "object", "additionalProperties": False, "required": ["plants"],
        "properties": {"plants": {"type": "array", "items": {"type": "string"}}},
    }
    body = json.dumps({
        "model": model,
        "messages": [
            {"role": "system", "content": "You list common garden plants by their everyday common name (no botanical names, no cultivars). Return distinct, well-known plants only."},
            {"role": "user", "content": f"List {count} {category}. Common names only, one entry each, no duplicates."},
        ],
        "response_format": {"type": "json_schema", "json_schema": {"name": "plant_list", "strict": True, "schema": schema}},
    }).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=body, headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}, method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        payload = json.loads(resp.read())
    return json.loads(payload["choices"][0]["message"]["content"]).get("plants", [])


def existing_slugs() -> set[str]:
    db = os.environ.get("SUPABASE_DB_URL")
    if not db:
        return set()
    out = subprocess.run(
        ["psql", db, "-t", "-A", "-c", "select slug from catalog.plant_profiles where deleted_at is null;"],
        capture_output=True, text=True,
    )
    return {s.strip() for s in out.stdout.splitlines() if s.strip()}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--model", default=os.environ.get("OPENAI_CATALOG_MODEL", DEFAULT_MODEL))
    args = parser.parse_args()

    load_env()
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise SystemExit("OPENAI_API_KEY required.")

    have = existing_slugs()
    print(f"{len(have)} existing slugs to exclude.", file=sys.stderr)

    seen: set[str] = set()
    kept: list[str] = []
    for category, count in CATEGORIES:
        try:
            plants = list_category(api_key, args.model, category, count)
        except Exception as exc:  # noqa: BLE001
            print(f"  [{category}] FAILED: {exc}", file=sys.stderr)
            continue
        added = 0
        for p in plants:
            p = p.strip()
            key = norm(p)
            if not key or key in seen:
                continue
            if slugify(p) in have:
                seen.add(key)
                continue
            seen.add(key)
            kept.append(p)
            added += 1
        print(f"  [{category}] +{added} (total {len(kept)})", file=sys.stderr)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text("\n".join(kept) + "\n")
    print(f"Wrote {len(kept)} names to {args.out}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
