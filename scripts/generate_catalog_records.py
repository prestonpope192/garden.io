#!/usr/bin/env python3
"""Generate normalized Garden.io catalog plant records with OpenAI (gpt-4.1-mini).

Produces JSON records that follow docs/catalog/plant-profile-record.schema.json
(draft subset) for a list of common plant names, then leaves importing to
scripts/import_catalog_plant_records.py. The model only fills factual/prose
fields under a STRICT json_schema (enums enforced at generation, so coded fields
cannot be out-of-vocabulary); this script owns the fixed fields (schema_version,
slug, publish flags) so they are never left to the model.

Env (loaded from website/.env.local or the shell): OPENAI_API_KEY.
Model: OPENAI_CATALOG_MODEL or default "gpt-4.1-mini".

Usage:
  python3 scripts/generate_catalog_records.py --names "Zucchini,Carrot" --out /tmp/catalog_gen/pilot
  python3 scripts/generate_catalog_records.py --names-file plants.txt --out data/catalog/generated/batchNN --workers 6
"""

from __future__ import annotations

import argparse
import concurrent.futures
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_VERSION = "2026-06-plant-profile-v1"
DEFAULT_MODEL = "gpt-4.1-mini"

PLANT_TYPE_CODES = [
    "tree", "shrub", "subshrub", "vine", "groundcover", "grass", "sedge", "fern",
    "forb", "succulent", "aquatic", "herb", "vegetable", "grain", "legume",
    "fruit_cane", "bulb", "tuber",
]
LIFECYCLE_TYPES = ["annual", "biennial", "perennial", "self_seed_annual", "unknown"]
TAXON_RANKS = ["genus", "species", "subspecies", "variety", "hybrid", "unknown"]
ORIGIN_TYPES = ["native", "naturalized", "exotic", "invasive_risk", "unknown"]
TOLERANCE_CODES = ["very_low", "low", "medium", "high", "very_high", "unknown"]
WATER_NEED_LEVELS = ["very_low", "low", "medium", "high", "very_high"]
EVERGREEN_CODES = ["evergreen", "deciduous", "semi_evergreen", "unknown"]
LIGHT_CODES = ["full_sun", "partial_sun", "partial_shade", "full_shade"]
USE_TYPES = [
    "culinary", "medicinal", "pollinator_support", "erosion_control", "chop_and_drop",
    "nitrogen_fixation", "dynamic_accumulator", "pest_confusion", "trap_crop",
    "privacy_screen", "fodder", "cut_flower", "shade", "edible_fruit", "edible_leaf",
    "living_mulch",
]
EVIDENCE_CODES = ["strong", "moderate", "weak", "traditional", "anecdotal", "unknown"]


def slugify(value: str) -> str:
    value = value.strip().lower().replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return re.sub(r"-+", "-", value).strip("-") or "plant"


def _str_or_null(desc: str) -> dict:
    return {"type": ["string", "null"], "description": desc}


def _num_or_null(desc: str) -> dict:
    return {"type": ["number", "null"], "description": desc}


def _obj(props: dict) -> dict:
    return {"type": "object", "additionalProperties": False, "required": list(props), "properties": props}


# Strict OpenAI output schema. Every property required; nullable via type unions;
# coded fields constrained to their enum so the model cannot emit invalid codes.
GEN_SCHEMA = _obj({
    "display_name": {"type": "string"},
    "plant_type_code": {"type": "string", "enum": PLANT_TYPE_CODES},
    "lifecycle_type": {"type": "string", "enum": LIFECYCLE_TYPES},
    "taxonomy": _obj({
        "family_name": _str_or_null("Botanical family, e.g. Solanaceae"),
        "genus_name": {"type": "string", "description": "Capitalized genus, e.g. Capsicum"},
        "species_name": _str_or_null("Species epithet, lowercase, e.g. annuum"),
        "botanical_name_full": {"type": "string", "description": "Full binomial, e.g. Capsicum annuum"},
        "taxon_rank": {"type": "string", "enum": TAXON_RANKS},
        "native_range": _str_or_null("Where it originates"),
        "origin_type": {"type": "string", "enum": ORIGIN_TYPES},
    }),
    "common_names": {"type": "array", "items": {"type": "string"}, "description": "Common names; first is primary"},
    "narratives": _obj({
        "short_description": {"type": "string"},
        "why_plant_it": {"type": "string"},
        "pros_summary": {"type": "string"},
        "cons_summary": {"type": "string"},
        "primary_use_cases": {"type": "string", "description": "Short comma-separated list"},
        "notes_for_homestead": {"type": "string"},
        "notes_for_small_garden": {"type": "string"},
        "notes_for_container_growing": {"type": "string"},
    }),
    "climate": _obj({
        "usda_hardiness_min": _str_or_null("e.g. '3'"),
        "usda_hardiness_max": _str_or_null("e.g. '9'"),
        "frost_tender": {"type": ["boolean", "null"]},
        "preferred_light": {"type": ["string", "null"], "enum": LIGHT_CODES + [None]},
        "drought_tolerance_code": {"type": "string", "enum": TOLERANCE_CODES},
        "humidity_tolerance_code": {"type": "string", "enum": TOLERANCE_CODES},
        "flood_tolerance_code": {"type": "string", "enum": TOLERANCE_CODES},
        "wind_tolerance_code": {"type": "string", "enum": TOLERANCE_CODES},
        "salt_tolerance_code": {"type": "string", "enum": TOLERANCE_CODES},
    }),
    "growth": _obj({
        "mature_height_min_in": _num_or_null("inches"),
        "mature_height_max_in": _num_or_null("inches"),
        "mature_width_min_in": _num_or_null("inches"),
        "mature_width_max_in": _num_or_null("inches"),
        "growth_rate_code": {"type": "string", "enum": TOLERANCE_CODES},
        "growth_habit": _str_or_null("short text"),
    }),
    "water": _obj({
        "water_need_level": {"type": "string", "enum": WATER_NEED_LEVELS},
        "moisture_sensitivity_code": {"type": "string", "enum": TOLERANCE_CODES},
    }),
    "ornamental": _obj({"evergreen_deciduous": {"type": "string", "enum": EVERGREEN_CODES}}),
    "uses": {
        "type": "array",
        "items": _obj({
            "use_type_code": {"type": "string", "enum": USE_TYPES},
            "evidence_strength_code": {"type": "string", "enum": EVIDENCE_CODES},
        }),
    },
})

SYSTEM_PROMPT = (
    "You are a horticulture catalogue editor. For the given common plant name, return accurate, "
    "widely-accepted facts for a home-gardening catalogue. Be precise about the botanical genus and "
    "species (e.g. a bell pepper is Capsicum annuum, NOT Solanum). Keep prose concise and practical. "
    "For numeric ranges give realistic mature sizes in inches. Never invent a USDA zone or number you "
    "are not confident about — use null. Use the most common cultivated species for the name."
)


def load_env() -> None:
    for rel in (".env", "website/.env.local"):
        path = ROOT / rel
        if not path.exists():
            continue
        for line in path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def call_openai(api_key: str, model: str, name: str) -> dict[str, Any]:
    body = json.dumps({
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Generate the catalogue record for: {name}"},
        ],
        "response_format": {
            "type": "json_schema",
            "json_schema": {"name": "plant_record", "strict": True, "schema": GEN_SCHEMA},
        },
    }).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        payload = json.loads(resp.read())
    return json.loads(payload["choices"][0]["message"]["content"])


def assemble_record(gen: dict[str, Any]) -> dict[str, Any]:
    """Wrap the model output into a full importer record; fixed fields owned here."""
    display_name = gen["display_name"].strip()
    slug = slugify(display_name)
    commons = [c.strip() for c in gen.get("common_names", []) if c and c.strip()] or [display_name]
    names = []
    for i, cn in enumerate(commons):
        names.append({"name": cn, "name_type": "common", "locale": "en", "is_primary": i == 0})

    tax = gen["taxonomy"]
    clim = gen["climate"]
    return {
        "schema_version": SCHEMA_VERSION,
        "slug": slug,
        "taxonomy": {
            "kingdom_name": "Plantae",
            "family_name": tax.get("family_name"),
            "genus_name": tax["genus_name"],
            "species_name": tax.get("species_name"),
            "subspecies_name": None,
            "variety_name": None,
            "botanical_name_full": tax["botanical_name_full"],
            "taxon_rank": tax["taxon_rank"],
            "native_range": tax.get("native_range"),
            "origin_type": tax.get("origin_type", "unknown"),
        },
        "names": names,
        "profile": {
            "display_name": display_name,
            "plant_type_code": gen["plant_type_code"],
            "lifecycle_type": gen["lifecycle_type"],
            "confidence_score": 0.4,
            "evidence_count": 0,
            "source_count": 0,
            "ai_generated_summary": False,
            "human_verified": False,
            "conflict_flag": False,
            "is_ai_generated": True,
            "generation_status": "ai_generated",
            "is_published": True,
            "review_status": "approved",
        },
        "narratives": {"locale": "en", "editorial_summary": None, **gen["narratives"]},
        "ornamental": {
            "evergreen_deciduous": gen["ornamental"]["evergreen_deciduous"],
            "ornamental_season_interest": [],
        },
        "climate": {
            "usda_hardiness_min": clim.get("usda_hardiness_min"),
            "usda_hardiness_max": clim.get("usda_hardiness_max"),
            "frost_tender": clim.get("frost_tender"),
            "preferred_light": clim.get("preferred_light"),
            "drought_tolerance_code": clim.get("drought_tolerance_code", "unknown"),
            "humidity_tolerance_code": clim.get("humidity_tolerance_code", "unknown"),
            "flood_tolerance_code": clim.get("flood_tolerance_code", "unknown"),
            "wind_tolerance_code": clim.get("wind_tolerance_code", "unknown"),
            "salt_tolerance_code": clim.get("salt_tolerance_code", "unknown"),
        },
        "growth": {**gen["growth"]},
        "water": {
            "water_need_level": gen["water"]["water_need_level"],
            "drought_tolerance_code": clim.get("drought_tolerance_code", "unknown"),
            "moisture_sensitivity_code": gen["water"].get("moisture_sensitivity_code", "unknown"),
        },
        "uses": gen.get("uses", []),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--names", help="Comma-separated common names.")
    parser.add_argument("--names-file", type=Path, help="File with one common name per line.")
    parser.add_argument("--out", required=True, type=Path, help="Output directory for <slug>.json files.")
    parser.add_argument("--model", default=os.environ.get("OPENAI_CATALOG_MODEL", DEFAULT_MODEL))
    parser.add_argument("--workers", type=int, default=6)
    args = parser.parse_args()

    load_env()
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise SystemExit("OPENAI_API_KEY is required (website/.env.local or env).")

    names: list[str] = []
    if args.names:
        names += [n.strip() for n in args.names.split(",") if n.strip()]
    if args.names_file:
        names += [l.strip() for l in args.names_file.read_text().splitlines() if l.strip() and not l.startswith("#")]
    if not names:
        raise SystemExit("Provide --names or --names-file.")

    args.out.mkdir(parents=True, exist_ok=True)
    print(f"Generating {len(names)} record(s) with {args.model} -> {args.out}", file=sys.stderr)

    def work(name: str) -> tuple[str, str]:
        try:
            gen = call_openai(api_key, args.model, name)
            record = assemble_record(gen)
            path = args.out / f"{record['slug']}.json"
            path.write_text(json.dumps(record, indent=2))
            return name, f"ok -> {record['slug']} ({record['taxonomy']['botanical_name_full']})"
        except (urllib.error.HTTPError, urllib.error.URLError, KeyError, json.JSONDecodeError, ValueError) as exc:
            detail = exc.read().decode()[:200] if isinstance(exc, urllib.error.HTTPError) else str(exc)
            return name, f"FAIL: {detail}"

    ok = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        for name, msg in pool.map(work, names):
            if msg.startswith("ok"):
                ok += 1
            print(f"  {name}: {msg}", file=sys.stderr)
    print(f"Done: {ok}/{len(names)} written to {args.out}", file=sys.stderr)
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
