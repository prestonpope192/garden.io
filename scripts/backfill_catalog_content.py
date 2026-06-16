#!/usr/bin/env python3
"""AI content backfill for thin published catalogue records (Catalog Quality Pass · Slice 1).

Most published `catalog.plant_profiles` rows are missing user-facing prose
(`why_plant_it`, `primary_use_cases`, growing notes, etc.), so detail pages read
as empty. This script drafts that copy with OpenAI, grounded in each plant's
taxonomy + existing structured fields, and writes it back — but only into fields
that are currently empty (so curated content is never overwritten and re-runs are
no-ops).

Design:
- Idempotent: fills empty target fields only; re-running skips already-filled rows.
- Provenance: touched rows are marked `is_ai_generated = true`.
- Reversible: emits a companion rollback SQL that nulls exactly the fields it set.
- Safe-by-default: dry run prints drafts + writes SQL but does NOT touch the DB;
  `--apply` runs it. Growing-note prompts forbid invented numbers (days, temps,
  zones) to limit hallucinated horticulture.

Usage:
  export SUPABASE_DB_URL='postgresql://...'           # DB (repo .env)
  export OPENAI_API_KEY='sk-...'                       # or website/.env.local
  python3 scripts/backfill_catalog_content.py --output-sql /tmp/backfill.sql        # dry run
  python3 scripts/backfill_catalog_content.py --limit 2 --output-sql /tmp/peek.sql  # sample
  python3 scripts/backfill_catalog_content.py --apply                               # write to DB
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]

# User-facing prose fields we are willing to AI-draft. Ordered; growing notes
# last because they edge toward factual territory (handled with care in the prompt).
TARGET_FIELDS = [
    "short_description",
    "why_plant_it",
    "primary_use_cases",
    "pros_summary",
    "cons_summary",
    "notes_for_homestead",
    "notes_for_small_garden",
    "notes_for_container_growing",
]

FIELD_GUIDANCE = {
    "short_description": "One vivid sentence describing the plant.",
    "why_plant_it": "1-2 sentences on why a home grower would want it (benefits, appeal).",
    "primary_use_cases": "A short comma-separated list of practical uses (e.g. 'Fresh herb, pollinator support, container growing').",
    "pros_summary": "1-2 sentences on the main upsides.",
    "cons_summary": "1-2 sentences on the main drawbacks or cautions.",
    "notes_for_homestead": "1-2 sentences of qualitative guidance for a homestead/larger plot.",
    "notes_for_small_garden": "1-2 sentences of qualitative guidance for a small garden.",
    "notes_for_container_growing": "1-2 sentences of qualitative guidance for container growing.",
}


def load_env() -> None:
    """Load repo .env and website/.env.local into os.environ (without overriding existing)."""
    for rel in (".env", "website/.env.local"):
        path = ROOT / rel
        if not path.exists():
            continue
        for line in path.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


def sql_str(value: Any) -> str:
    if value is None:
        return "null"
    text = str(value).strip()
    if not text:
        return "null"
    return "'" + text.replace("'", "''") + "'"


def is_empty(value: Any) -> bool:
    return value is None or (isinstance(value, str) and value.strip() == "")


def fetch_rows(db_url: str, limit: int | None) -> list[dict[str, Any]]:
    """Pull published profiles whose en narrative is missing >=1 target field.

    The catalogue view reads prose from catalog.plant_profile_narratives (locale
    'en'), NOT from the base plant_profiles columns — so that is what we fill.
    """
    empty_clause = " or ".join(
        f"(n.{f} is null or btrim(n.{f}) = '')" for f in TARGET_FIELDS
    )
    limit_clause = f"limit {int(limit)}" if limit else ""
    select_fields = ",\n        ".join(f"n.{f}" for f in TARGET_FIELDS)
    query = f"""
    select coalesce(json_agg(r), '[]'::json)::text from (
      select
        p.id,
        p.display_name,
        p.plant_type_code,
        p.lifecycle_type,
        {select_fields},
        t.genus_name,
        t.species_name,
        t.family_name,
        t.botanical_name_full
      from catalog.plant_profiles p
      join catalog.plant_taxa t on t.id = p.plant_taxon_id
      join catalog.plant_profile_narratives n
        on n.plant_profile_id = p.id and n.locale = 'en'
      where p.is_published and ({empty_clause})
      order by p.display_name
      {limit_clause}
    ) r;
    """
    out = subprocess.run(
        ["psql", db_url, "-t", "-A", "-c", query],
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(out.stdout.strip() or "[]")


SYSTEM_PROMPT = (
    "You are a horticulture catalogue editor writing concise, warm, practical copy "
    "for a home-gardening plant catalogue. Write for a curious home grower. "
    "Be specific to the named plant. Keep each field tight (no headers, no markdown). "
    "For the growing-note fields, give qualitative guidance only: NEVER invent precise "
    "numbers such as days-to-maturity, exact temperatures, spacing, or USDA zones. "
    "If you are genuinely unsure about a plant, give cautious, general guidance rather "
    "than inventing facts."
)

OPENAI_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {f: {"type": "string"} for f in TARGET_FIELDS},
    "required": list(TARGET_FIELDS),
}


def build_user_prompt(row: dict[str, Any]) -> str:
    facts = {
        "display_name": row.get("display_name"),
        "botanical_name": row.get("botanical_name_full")
        or " ".join(filter(None, [row.get("genus_name"), row.get("species_name")])),
        "family": row.get("family_name"),
        "type": row.get("plant_type_code"),
        "lifecycle": row.get("lifecycle_type"),
    }
    lines = [f"- {k}: {v}" for k, v in facts.items() if v]
    guidance = "\n".join(f"- {k}: {FIELD_GUIDANCE[k]}" for k in TARGET_FIELDS)
    return (
        "Write catalogue copy for this plant:\n"
        + "\n".join(lines)
        + "\n\nProduce every field below as plain text:\n"
        + guidance
    )


def call_openai(api_key: str, model: str, row: dict[str, Any]) -> dict[str, str]:
    body = json.dumps(
        {
            "model": model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": build_user_prompt(row)},
            ],
            "response_format": {
                "type": "json_schema",
                "json_schema": {"name": "catalogue_copy", "strict": True, "schema": OPENAI_SCHEMA},
            },
        }
    ).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        payload = json.loads(resp.read())
    content = payload["choices"][0]["message"]["content"]
    return json.loads(content)


def build_update(row: dict[str, Any], draft: dict[str, str]) -> tuple[str, str] | None:
    """Return (forward_sql, rollback_sql) for the empty narrative fields only, or None.

    Writes prose to catalog.plant_profile_narratives (the source the view reads) and
    marks provenance on the parent profile (is_ai_generated) only for profiles we fill.
    """
    sets: list[str] = []
    rollback_sets: list[str] = []
    for field in TARGET_FIELDS:
        if not is_empty(row.get(field)):
            continue  # never overwrite existing content
        value = (draft.get(field) or "").strip()
        if not value:
            continue
        sets.append(f"{field} = {sql_str(value)}")
        rollback_sets.append(f"{field} = null")
    if not sets:
        return None
    pid = sql_str(row["id"])
    forward = (
        f"update catalog.plant_profile_narratives set {', '.join(sets)} "
        f"where plant_profile_id = {pid} and locale = 'en';\n"
        f"update catalog.plant_profiles set is_ai_generated = true where id = {pid};"
    )
    rollback = (
        f"update catalog.plant_profile_narratives set {', '.join(rollback_sets)} "
        f"where plant_profile_id = {pid} and locale = 'en';\n"
        f"update catalog.plant_profiles set is_ai_generated = false where id = {pid};"
    )
    return forward, rollback


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true", help="Write changes to the DB via psql.")
    parser.add_argument("--output-sql", type=Path, help="Write forward SQL to this path (dry run).")
    parser.add_argument("--limit", type=int, help="Only process the first N thin profiles.")
    parser.add_argument("--model", default=os.environ.get("OPENAI_MODEL", "gpt-4o"))
    args = parser.parse_args()

    load_env()
    db_url = os.environ.get("SUPABASE_DB_URL")
    api_key = os.environ.get("OPENAI_API_KEY")
    if not db_url:
        raise SystemExit("SUPABASE_DB_URL is required.")
    if not api_key:
        raise SystemExit("OPENAI_API_KEY is required (repo .env or website/.env.local).")

    rows = fetch_rows(db_url, args.limit)
    print(f"Found {len(rows)} published profile(s) with missing content.", file=sys.stderr)
    if not rows:
        return

    forward_stmts: list[str] = []
    rollback_stmts: list[str] = []
    for i, row in enumerate(rows, 1):
        name = row.get("display_name", row["id"])
        try:
            draft = call_openai(api_key, args.model, row)
        except (urllib.error.HTTPError, urllib.error.URLError, KeyError, json.JSONDecodeError) as exc:
            print(f"  [{i}/{len(rows)}] {name}: SKIP (OpenAI error: {exc})", file=sys.stderr)
            continue
        built = build_update(row, draft)
        if built is None:
            print(f"  [{i}/{len(rows)}] {name}: nothing to fill", file=sys.stderr)
            continue
        forward, rollback = built
        forward_stmts.append(forward)
        rollback_stmts.append(rollback)
        filled = [f for f in TARGET_FIELDS if is_empty(row.get(f)) and (draft.get(f) or "").strip()]
        print(f"  [{i}/{len(rows)}] {name}: filling {', '.join(filled)}", file=sys.stderr)
        # Show the actual drafts so a dry run is reviewable even under auto-publish.
        for f in filled:
            print(f"      {f}: {draft[f].strip()[:160]}", file=sys.stderr)

    if not forward_stmts:
        print("No updates produced.", file=sys.stderr)
        return

    forward_sql = "begin;\n" + "\n".join(forward_stmts) + "\ncommit;\n"
    rollback_sql = "begin;\n" + "\n".join(rollback_stmts) + "\ncommit;\n"

    if args.output_sql:
        args.output_sql.write_text(forward_sql)
        rollback_path = args.output_sql.with_suffix(args.output_sql.suffix + ".rollback")
        rollback_path.write_text(rollback_sql)
        print(f"Wrote {len(forward_stmts)} update(s) to {args.output_sql}", file=sys.stderr)
        print(f"Wrote rollback to {rollback_path}", file=sys.stderr)

    if args.apply:
        with tempfile.NamedTemporaryFile("w", suffix=".sql", delete=False) as tmp:
            tmp.write(forward_sql)
            tmp_path = tmp.name
        subprocess.run(["psql", db_url, "-v", "ON_ERROR_STOP=1", "-f", tmp_path], check=True)
        os.unlink(tmp_path)
        print(f"Applied {len(forward_stmts)} update(s) to the database.", file=sys.stderr)
    elif not args.output_sql:
        print("Dry run only (no --apply, no --output-sql). Re-run with --output-sql or --apply.", file=sys.stderr)


if __name__ == "__main__":
    main()
