#!/usr/bin/env python3
"""Validate and import normalized Garden.io catalog plant records.

The importer accepts JSON records that follow
docs/catalog/plant-profile-record.schema.json. It performs deterministic
semantic validation and emits idempotent SQL. Models should produce JSON only;
this script owns SQL generation.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import uuid
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATH = ROOT / "docs/catalog/plant-profile-record.schema.json"
NAMESPACE = uuid.UUID("16c79757-4139-4e12-94a2-1181e70ac9f5")
SCHEMA_VERSION = "2026-06-plant-profile-v1"

SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
CLAIM_TYPE_RE = re.compile(r"^[a-z_]+\.[a-z0-9_]+$")

FULL_RECORD_SECTIONS = {
    "taxonomy",
    "names",
    "profile",
    "aesthetic_styles",
    "uses",
    "narratives",
    "ornamental",
    "climate",
    "growth",
    "propagation_methods",
    "flowering",
    "fruiting",
    "soil",
    "water",
    "water_establishment",
    "water_seasonal",
    "ecology",
    "maintenance",
    "safety",
    "relationships",
    "phenology_templates",
    "zone_profiles",
    "care_events",
    "sources",
    "claims",
    "images",
    "ratings",
}

BANNED_KEYS = {
    "garden_catalog_plants",
    "growing_requirements",
    "soil_texture_preferences",
    "propagation_profile",
    "plant_propagation_profiles",
}

RATING_DIMENSIONS = {
    "sun_need",
    "shade_tolerance",
    "afternoon_sun_tolerance",
    "water_need",
    "drought_tolerance",
    "wet_feet_tolerance",
    "soil_drainage_need",
    "soil_fertility_need",
    "soil_compaction_tolerance",
    "soil_texture_flexibility",
    "maintenance_need",
    "beginner_friendliness",
    "spread_aggressiveness",
    "container_suitability",
    "transplant_tolerance",
    "pollinator_value",
    "wildlife_food_value",
    "erosion_control_value",
    "biomass_value",
    "invasive_risk",
    "disease_susceptibility",
    "pest_susceptibility",
    "humidity_disease_risk",
    "deer_resistance",
    "rabbit_resistance",
}

PLANT_TYPE_CODES = {
    "tree",
    "shrub",
    "subshrub",
    "vine",
    "groundcover",
    "grass",
    "sedge",
    "fern",
    "forb",
    "succulent",
    "aquatic",
    "herb",
    "vegetable",
    "grain",
    "legume",
    "fruit_cane",
    "bulb",
    "tuber",
}

LIFECYCLE_TYPES = {"annual", "biennial", "perennial", "self_seed_annual", "unknown"}
TAXON_RANKS = {"genus", "species", "subspecies", "variety", "hybrid", "unknown"}
ORIGIN_TYPES = {"native", "naturalized", "exotic", "invasive_risk", "unknown"}
TOLERANCE_CODES = {"very_low", "low", "medium", "high", "very_high", "unknown"}
SAFETY_LEVEL_CODES = {"safe", "caution", "toxic", "severe_toxicity", "unknown"}
EVIDENCE_CODES = {"strong", "moderate", "weak", "traditional", "anecdotal", "unknown"}
METHOD_CODES = {
    "direct_sow",
    "transplant_seedling",
    "cutting",
    "division",
    "bare_root",
    "crown",
    "tuber",
    "rhizome",
    "bulb",
    "grafted_tree",
}
SOIL_TEXTURE_CODES = {"sand", "sandy_loam", "loam", "silt_loam", "clay", "rocky", "peaty"}
WATER_NEED_LEVELS = {"very_low", "low", "medium", "high", "very_high"}
EVERGREEN_CODES = {"evergreen", "deciduous", "semi_evergreen", "unknown"}
SAFETY_SUBJECT_TYPES = {"human", "cow", "chicken", "dog", "cat", "horse", "goat"}
RELATIONSHIP_TYPES = {
    "good_companion",
    "bad_companion",
    "nurse_plant",
    "trap_crop_helper",
    "shade_conflict",
    "root_competition",
    "allelopathy_risk",
    "shared_disease_risk",
    "pollination_partner",
}
USE_TYPES = {
    "culinary",
    "medicinal",
    "pollinator_support",
    "erosion_control",
    "chop_and_drop",
    "nitrogen_fixation",
    "dynamic_accumulator",
    "pest_confusion",
    "trap_crop",
    "privacy_screen",
    "fodder",
    "cut_flower",
    "shade",
    "edible_fruit",
    "edible_leaf",
    "living_mulch",
}
AESTHETIC_STYLE_CODES = {"formal", "cottage", "meadow", "tropical", "edible_landscape", "xeric", "woodland"}
REGION_TYPES = {"usda_zone", "climate_band", "state", "region", "generic"}
WATER_REGION_TYPES = {"usda_zone", "region", "state", "generic"}
TRIGGER_TYPES = {
    "date",
    "temperature",
    "soil_temp",
    "frost",
    "rainfall",
    "daylight",
    "gdd",
    "plant_observation",
    "calendar",
}
TIMING_TYPES = {"calendar", "temp_threshold", "soil_temp", "gdd", "rainfall", "photoperiod", "event_offset"}
PRIORITY_CODES = {"low", "medium", "high", "critical"}
SOURCE_TYPES = {"extension", "academic", "government", "community", "internal_curation", "ai_extraction", "other"}
CLAIM_REVIEW_STATUSES = {"pending_review", "approved", "rejected", "needs_more_evidence"}
PROFILE_REVIEW_STATUSES = {"draft", "pending_review", "approved", "rejected"}
GENERATION_STATUSES = {"human_curated", "ai_generated", "ai_reviewed", "community_generated"}
CULTIVAR_OVERRIDE_SCOPES = {"trait", "climate", "yield", "disease", "phenology", "water", "other"}


class ValidationError(Exception):
    pass


@dataclass
class LoadedRecord:
    path: Path
    record: dict[str, Any]


def stable_uuid(*parts: Any) -> str:
    return str(uuid.uuid5(NAMESPACE, "::".join(str(part) for part in parts)))


def clean(value: Any) -> Any:
    if isinstance(value, str):
        value = value.strip()
        return value if value else None
    return value


def sql(value: Any) -> str:
    value = clean(value)
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, (date, datetime)):
        return "'" + value.isoformat() + "'"
    text = str(value)
    return "'" + text.replace("'", "''") + "'"


def sql_json(value: Any) -> str:
    return sql(json.dumps(value, sort_keys=True, separators=(",", ":"))) + "::jsonb"


def sql_text_array(values: Any) -> str:
    if values is None:
        return "null"
    if not isinstance(values, list):
        raise ValidationError(f"Expected list for SQL text array, got {type(values).__name__}")
    if not values:
        return "'{}'::text[]"
    return "array[" + ", ".join(sql(str(value)) for value in values) + "]::text[]"


def sql_uuid(value: str) -> str:
    return f"{sql(value)}::uuid"


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value


def read_records(input_path: Path) -> list[LoadedRecord]:
    if input_path.is_dir():
        paths = sorted(path for path in input_path.rglob("*.json") if path.is_file())
        records: list[LoadedRecord] = []
        for path in paths:
            records.extend(read_records(path))
        return records

    with input_path.open("r", encoding="utf-8") as handle:
        if input_path.suffix == ".jsonl":
            records = []
            for index, line in enumerate(handle, start=1):
                if not line.strip():
                    continue
                value = json.loads(line)
                if not isinstance(value, dict):
                    raise ValidationError(f"{input_path}:{index}: JSONL rows must be objects")
                records.append(LoadedRecord(input_path, value))
            return records

        value = json.load(handle)
        if isinstance(value, list):
            return [LoadedRecord(input_path, item) for item in value]
        if isinstance(value, dict):
            return [LoadedRecord(input_path, value)]
        raise ValidationError(f"{input_path}: expected object or array")


def iter_keys(value: Any) -> list[str]:
    keys: list[str] = []
    if isinstance(value, dict):
        for key, nested in value.items():
            keys.append(key)
            keys.extend(iter_keys(nested))
    elif isinstance(value, list):
        for item in value:
            keys.extend(iter_keys(item))
    return keys


def require_object(record: dict[str, Any], key: str) -> dict[str, Any]:
    value = record.get(key)
    if not isinstance(value, dict):
        raise ValidationError(f"{record.get('slug', '<unknown>')}: {key} must be an object")
    return value


def optional_object(record: dict[str, Any], key: str) -> dict[str, Any]:
    value = record.get(key)
    if value is None:
        return {}
    if not isinstance(value, dict):
        raise ValidationError(f"{record.get('slug', '<unknown>')}: {key} must be an object")
    return value


def optional_list(record: dict[str, Any], key: str) -> list[Any]:
    value = record.get(key)
    if value is None:
        return []
    if not isinstance(value, list):
        raise ValidationError(f"{record.get('slug', '<unknown>')}: {key} must be a list")
    return value


def check_enum(slug: str, path: str, value: Any, allowed: set[str], nullable: bool = True) -> None:
    if value is None and nullable:
        return
    if value not in allowed:
        raise ValidationError(f"{slug}: {path} must be one of {sorted(allowed)}, got {value!r}")


def check_range_pair(slug: str, section: dict[str, Any], min_key: str, max_key: str) -> None:
    min_value = section.get(min_key)
    max_value = section.get(max_key)
    if min_value is not None and max_value is not None and min_value > max_value:
        raise ValidationError(f"{slug}: {min_key} cannot be greater than {max_key}")


def check_int_range(slug: str, path: str, value: Any, low: int, high: int) -> None:
    if value is None:
        return
    if not isinstance(value, int) or value < low or value > high:
        raise ValidationError(f"{slug}: {path} must be an integer between {low} and {high}")


def check_confidence(slug: str, path: str, value: Any) -> None:
    if value is None:
        return
    if not isinstance(value, (int, float)) or value < 0 or value > 1:
        raise ValidationError(f"{slug}: {path} must be between 0 and 1")


def validate_record(record: dict[str, Any], strict: bool = True) -> None:
    slug = record.get("slug")
    if record.get("schema_version") != SCHEMA_VERSION:
        raise ValidationError(f"{slug or '<unknown>'}: schema_version must be {SCHEMA_VERSION}")
    if not isinstance(slug, str) or not SLUG_RE.fullmatch(slug):
        raise ValidationError(f"{slug or '<unknown>'}: slug must be kebab-case")

    banned_found = sorted(BANNED_KEYS.intersection(iter_keys(record)))
    if banned_found:
        raise ValidationError(f"{slug}: banned legacy keys present: {', '.join(banned_found)}")

    if strict:
        missing = sorted(section for section in FULL_RECORD_SECTIONS if section not in record)
        if missing:
            raise ValidationError(f"{slug}: strict mode missing sections: {', '.join(missing)}")

    taxonomy = require_object(record, "taxonomy")
    profile = require_object(record, "profile")
    names = optional_list(record, "names")
    if not names:
        raise ValidationError(f"{slug}: at least one name is required")

    check_enum(slug, "taxonomy.taxon_rank", taxonomy.get("taxon_rank"), TAXON_RANKS, nullable=False)
    check_enum(slug, "taxonomy.origin_type", taxonomy.get("origin_type", "unknown"), ORIGIN_TYPES)
    if not clean(taxonomy.get("genus_name")):
        raise ValidationError(f"{slug}: taxonomy.genus_name is required")
    if not clean(taxonomy.get("botanical_name_full")):
        raise ValidationError(f"{slug}: taxonomy.botanical_name_full is required")

    for index, name in enumerate(names):
        if not isinstance(name, dict):
            raise ValidationError(f"{slug}: names[{index}] must be an object")
        if not clean(name.get("name")):
            raise ValidationError(f"{slug}: names[{index}].name is required")
        check_enum(slug, f"names[{index}].name_type", name.get("name_type"), {"common", "synonym", "trade", "latin_variant"}, nullable=False)

    if not clean(profile.get("display_name")):
        raise ValidationError(f"{slug}: profile.display_name is required")
    if slugify(profile.get("display_name", "")) != slug and strict:
        # Not fatal in draft mode, but strict batches should not have surprising URL keys.
        pass
    check_enum(slug, "profile.plant_type_code", profile.get("plant_type_code"), PLANT_TYPE_CODES, nullable=False)
    check_enum(slug, "profile.lifecycle_type", profile.get("lifecycle_type"), LIFECYCLE_TYPES, nullable=False)
    check_enum(slug, "profile.generation_status", profile.get("generation_status", "human_curated"), GENERATION_STATUSES)
    check_enum(slug, "profile.review_status", profile.get("review_status", "draft"), PROFILE_REVIEW_STATUSES)
    check_confidence(slug, "profile.confidence_score", profile.get("confidence_score"))

    cultivar = optional_object(record, "cultivar")
    if cultivar:
        if not clean(cultivar.get("cultivar_name")):
            raise ValidationError(f"{slug}: cultivar.cultivar_name is required")
        check_range_pair(slug, cultivar, "chill_hours_min", "chill_hours_max")

    if optional_list(record, "cultivar_overrides") and not cultivar:
        raise ValidationError(f"{slug}: cultivar_overrides require a cultivar object")
    for index, item in enumerate(optional_list(record, "cultivar_overrides")):
        if not isinstance(item, dict):
            raise ValidationError(f"{slug}: cultivar_overrides[{index}] must be an object")
        if not clean(item.get("field_key")):
            raise ValidationError(f"{slug}: cultivar_overrides[{index}].field_key is required")
        check_enum(slug, f"cultivar_overrides[{index}].override_scope", item.get("override_scope"), CULTIVAR_OVERRIDE_SCOPES, nullable=False)
        check_enum(slug, f"cultivar_overrides[{index}].region_type", item.get("region_type"), REGION_TYPES)
        check_enum(slug, f"cultivar_overrides[{index}].evidence_strength_code", item.get("evidence_strength_code"), EVIDENCE_CODES)

    for index, item in enumerate(optional_list(record, "aesthetic_styles")):
        if not isinstance(item, dict):
            raise ValidationError(f"{slug}: aesthetic_styles[{index}] must be an object")
        check_enum(slug, f"aesthetic_styles[{index}].style_code", item.get("style_code"), AESTHETIC_STYLE_CODES, nullable=False)
        check_int_range(slug, f"aesthetic_styles[{index}].weight_score", item.get("weight_score"), 0, 10)

    for index, item in enumerate(optional_list(record, "uses")):
        if not isinstance(item, dict):
            raise ValidationError(f"{slug}: uses[{index}] must be an object")
        check_enum(slug, f"uses[{index}].use_type_code", item.get("use_type_code"), USE_TYPES, nullable=False)
        check_enum(slug, f"uses[{index}].evidence_strength_code", item.get("evidence_strength_code"), EVIDENCE_CODES, nullable=False)

    ornamental = optional_object(record, "ornamental")
    check_enum(slug, "ornamental.evergreen_deciduous", ornamental.get("evergreen_deciduous"), EVERGREEN_CODES)

    climate = optional_object(record, "climate")
    for key in ["humidity_tolerance_code", "drought_tolerance_code", "flood_tolerance_code", "wind_tolerance_code", "salt_tolerance_code"]:
        check_enum(slug, f"climate.{key}", climate.get(key), TOLERANCE_CODES)
    check_range_pair(slug, climate, "sun_min_hours", "sun_max_hours")
    check_range_pair(slug, climate, "chill_hours_min", "chill_hours_max")

    growth = optional_object(record, "growth")
    for min_key, max_key in [
        ("mature_height_min_in", "mature_height_max_in"),
        ("mature_width_min_in", "mature_width_max_in"),
    ]:
        check_range_pair(slug, growth, min_key, max_key)
    check_enum(slug, "growth.growth_rate_code", growth.get("growth_rate_code"), TOLERANCE_CODES)

    for index, method in enumerate(optional_list(record, "propagation_methods")):
        if not isinstance(method, dict):
            raise ValidationError(f"{slug}: propagation_methods[{index}] must be an object")
        check_enum(slug, f"propagation_methods[{index}].planting_method_code", method.get("planting_method_code"), METHOD_CODES, nullable=False)
        check_enum(slug, f"propagation_methods[{index}].transplant_shock_risk_code", method.get("transplant_shock_risk_code"), TOLERANCE_CODES)
        check_range_pair(slug, method, "depth_min_in", "depth_max_in")
        check_range_pair(slug, method, "spacing_min_in", "spacing_max_in")
        check_range_pair(slug, method, "germination_days_min", "germination_days_max")

    flowering = optional_object(record, "flowering")
    for key in ["bloom_start_week", "bloom_end_week"]:
        check_int_range(slug, f"flowering.{key}", flowering.get(key), 1, 53)

    fruiting = optional_object(record, "fruiting")
    for min_key, max_key in [
        ("yield_lb_per_plant_year_min", "yield_lb_per_plant_year_max"),
        ("productive_years_min", "productive_years_max"),
    ]:
        check_range_pair(slug, fruiting, min_key, max_key)
    for key in ["harvest_window_start_week", "harvest_window_end_week"]:
        check_int_range(slug, f"fruiting.{key}", fruiting.get(key), 1, 53)

    soil = optional_object(record, "soil")
    check_range_pair(slug, soil, "ph_min", "ph_max")
    check_range_pair(slug, soil, "ph_ideal_min", "ph_ideal_max")
    for key in ["compaction_tolerance_code", "rocky_soil_tolerance_code", "ph_sensitivity_code", "calcium_sensitivity_code", "waterlogging_sensitivity_code"]:
        check_enum(slug, f"soil.{key}", soil.get(key), TOLERANCE_CODES)
    for texture in soil.get("preferred_soil_texture_codes") or []:
        check_enum(slug, "soil.preferred_soil_texture_codes[]", texture, SOIL_TEXTURE_CODES, nullable=False)

    water = optional_object(record, "water")
    check_enum(slug, "water.water_need_level", water.get("water_need_level"), WATER_NEED_LEVELS)
    for key in ["drought_tolerance_code", "moisture_sensitivity_code"]:
        check_enum(slug, f"water.{key}", water.get(key), TOLERANCE_CODES)

    for index, item in enumerate(optional_list(record, "water_establishment")):
        if not isinstance(item, dict):
            raise ValidationError(f"{slug}: water_establishment[{index}] must be an object")
        check_range_pair(slug, item, "week_from_planting_start", "week_from_planting_end")

    for index, item in enumerate(optional_list(record, "water_seasonal")):
        if not isinstance(item, dict):
            raise ValidationError(f"{slug}: water_seasonal[{index}] must be an object")
        check_enum(slug, f"water_seasonal[{index}].region_type", item.get("region_type", "generic"), WATER_REGION_TYPES)
        check_int_range(slug, f"water_seasonal[{index}].month_no", item.get("month_no"), 1, 12)

    ecology = optional_object(record, "ecology")
    check_enum(slug, "ecology.invasive_risk_code", ecology.get("invasive_risk_code"), SAFETY_LEVEL_CODES)

    for index, item in enumerate(optional_list(record, "safety")):
        if not isinstance(item, dict):
            raise ValidationError(f"{slug}: safety[{index}] must be an object")
        check_enum(slug, f"safety[{index}].subject_type_code", item.get("subject_type_code"), SAFETY_SUBJECT_TYPES, nullable=False)
        check_enum(slug, f"safety[{index}].safety_level_code", item.get("safety_level_code"), SAFETY_LEVEL_CODES, nullable=False)

    for index, item in enumerate(optional_list(record, "relationships")):
        if not isinstance(item, dict):
            raise ValidationError(f"{slug}: relationships[{index}] must be an object")
        related_slug = item.get("related_slug")
        if not isinstance(related_slug, str) or not SLUG_RE.fullmatch(related_slug):
            raise ValidationError(f"{slug}: relationships[{index}].related_slug must be kebab-case")
        check_enum(slug, f"relationships[{index}].relationship_type_code", item.get("relationship_type_code"), RELATIONSHIP_TYPES, nullable=False)

    for index, item in enumerate(optional_list(record, "phenology_templates")):
        if not isinstance(item, dict):
            raise ValidationError(f"{slug}: phenology_templates[{index}] must be an object")
        check_enum(slug, f"phenology_templates[{index}].region_type", item.get("region_type"), REGION_TYPES, nullable=False)
        for event_index, event in enumerate(item.get("events") or []):
            if not isinstance(event, dict):
                raise ValidationError(f"{slug}: phenology_templates[{index}].events[{event_index}] must be an object")
            check_enum(slug, f"phenology_templates[{index}].events[{event_index}].trigger_type", event.get("trigger_type"), TRIGGER_TYPES, nullable=False)
            check_enum(slug, f"phenology_templates[{index}].events[{event_index}].timing_type", event.get("timing_type"), TIMING_TYPES, nullable=False)
            for key in ["week_start_of_year", "week_end_of_year"]:
                check_int_range(slug, f"phenology_templates[{index}].events[{event_index}].{key}", event.get(key), 1, 53)
            for key in ["month_start", "month_end"]:
                check_int_range(slug, f"phenology_templates[{index}].events[{event_index}].{key}", event.get(key), 1, 12)
            check_enum(slug, f"phenology_templates[{index}].events[{event_index}].urgency_code", event.get("urgency_code"), PRIORITY_CODES)

    for index, item in enumerate(optional_list(record, "zone_profiles")):
        if not isinstance(item, dict):
            raise ValidationError(f"{slug}: zone_profiles[{index}] must be an object")
        check_enum(slug, f"zone_profiles[{index}].region_type", item.get("region_type"), REGION_TYPES, nullable=False)
        for key in [
            "planting_window_start_week",
            "planting_window_end_week",
            "harvest_window_start_week",
            "harvest_window_end_week",
            "bloom_window_start_week",
            "bloom_window_end_week",
            "dieback_window_start_week",
            "reemergence_window_start_week",
        ]:
            check_int_range(slug, f"zone_profiles[{index}].{key}", item.get(key), 1, 53)

    for index, item in enumerate(optional_list(record, "care_events")):
        if not isinstance(item, dict):
            raise ValidationError(f"{slug}: care_events[{index}] must be an object")
        if not clean(item.get("task_type_code")):
            raise ValidationError(f"{slug}: care_events[{index}].task_type_code is required")
        if not clean(item.get("source_type_code")):
            raise ValidationError(f"{slug}: care_events[{index}].source_type_code is required")
        if not clean(item.get("title")):
            raise ValidationError(f"{slug}: care_events[{index}].title is required")
        check_enum(slug, f"care_events[{index}].priority_code", item.get("priority_code"), PRIORITY_CODES)

    source_refs = set()
    for index, source in enumerate(optional_list(record, "sources")):
        if not isinstance(source, dict):
            raise ValidationError(f"{slug}: sources[{index}] must be an object")
        source_ref = source.get("source_ref")
        if not source_ref:
            raise ValidationError(f"{slug}: sources[{index}].source_ref is required")
        if source_ref in source_refs:
            raise ValidationError(f"{slug}: duplicate source_ref {source_ref}")
        source_refs.add(source_ref)
        check_enum(slug, f"sources[{index}].source_type", source.get("source_type"), SOURCE_TYPES, nullable=False)
        check_confidence(slug, f"sources[{index}].credibility_score", source.get("credibility_score"))

    for index, claim in enumerate(optional_list(record, "claims")):
        if not isinstance(claim, dict):
            raise ValidationError(f"{slug}: claims[{index}] must be an object")
        claim_type = claim.get("claim_type")
        if not isinstance(claim_type, str) or not CLAIM_TYPE_RE.fullmatch(claim_type):
            raise ValidationError(f"{slug}: claims[{index}].claim_type must be field-aligned like soil.ph_range")
        check_enum(slug, f"claims[{index}].evidence_strength_code", claim.get("evidence_strength_code"), EVIDENCE_CODES)
        check_enum(slug, f"claims[{index}].review_status", claim.get("review_status", "pending_review"), CLAIM_REVIEW_STATUSES)
        check_confidence(slug, f"claims[{index}].confidence_score", claim.get("confidence_score"))
        source_ref = claim.get("source_ref")
        if source_ref and source_ref not in source_refs:
            raise ValidationError(f"{slug}: claims[{index}].source_ref {source_ref!r} not found in sources")

    for index, image in enumerate(optional_list(record, "images")):
        if not isinstance(image, dict):
            raise ValidationError(f"{slug}: images[{index}] must be an object")
        source_ref = image.get("source_ref")
        if source_ref and source_ref not in source_refs:
            raise ValidationError(f"{slug}: images[{index}].source_ref {source_ref!r} not found in sources")

    seen_dimensions = set()
    for index, rating in enumerate(optional_list(record, "ratings")):
        if not isinstance(rating, dict):
            raise ValidationError(f"{slug}: ratings[{index}] must be an object")
        dimension = rating.get("dimension_code")
        if dimension not in RATING_DIMENSIONS:
            raise ValidationError(f"{slug}: ratings[{index}].dimension_code {dimension!r} is not an active rating dimension")
        if dimension in seen_dimensions:
            raise ValidationError(f"{slug}: duplicate rating dimension {dimension}")
        seen_dimensions.add(dimension)
        check_int_range(slug, f"ratings[{index}].rating", rating.get("rating"), 1, 5)
        check_enum(slug, f"ratings[{index}].evidence_strength_code", rating.get("evidence_strength_code"), EVIDENCE_CODES)
        check_confidence(slug, f"ratings[{index}].confidence_score", rating.get("confidence_score"))


def insert_one_to_one(lines: list[str], table: str, profile_ref_sql: str, values: dict[str, Any], columns: list[str], array_columns: set[str] | None = None, json_columns: set[str] | None = None) -> None:
    if not values:
        return
    array_columns = array_columns or set()
    json_columns = json_columns or set()
    insert_columns = ["plant_profile_id"] + columns
    insert_values = [profile_ref_sql]
    for column in columns:
        value = values.get(column)
        if column in array_columns:
            insert_values.append(sql_text_array(value or []))
        elif column in json_columns:
            insert_values.append(sql_json(value or {}))
        else:
            insert_values.append(sql(value))
    updates = [f"{column} = excluded.{column}" for column in columns]
    updates.append("updated_at = now()")
    lines.extend(
        [
            f"insert into {table} ({', '.join(insert_columns)})",
            f"values ({', '.join(insert_values)})",
            "on conflict (plant_profile_id) do update set",
            "  " + ",\n  ".join(updates) + ";",
            "",
        ]
    )


def build_sql(records: list[LoadedRecord]) -> str:
    lines = [
        "begin;",
        "",
        "create extension if not exists pgcrypto;",
        "",
    ]

    for loaded in records:
        record = loaded.record
        slug = record["slug"]
        taxonomy = record["taxonomy"]
        profile = record["profile"]
        cultivar = optional_object(record, "cultivar")
        profile_id = stable_uuid("plant-profile", slug)
        profile_ref = f"(select id from catalog.plant_profiles where slug = {sql(slug)} and deleted_at is null)"
        taxon_id = stable_uuid("plant-taxon", slug)
        taxon_ref = (
            "(select id from catalog.plant_taxa where "
            f"lower(genus_name) = lower({sql(taxonomy.get('genus_name'))}) and "
            f"coalesce(lower(species_name), '') = coalesce(lower({sql(taxonomy.get('species_name'))}), '') and "
            f"coalesce(lower(subspecies_name), '') = coalesce(lower({sql(taxonomy.get('subspecies_name'))}), '') and "
            f"coalesce(lower(variety_name), '') = coalesce(lower({sql(taxonomy.get('variety_name'))}), '') "
            "limit 1)"
        )
        cultivar_id = stable_uuid("plant-cultivar", taxonomy.get("genus_name"), taxonomy.get("species_name"), cultivar.get("cultivar_name")) if cultivar else None
        cultivar_ref = (
            "(select id from catalog.plant_cultivars where "
            f"plant_taxon_id = {taxon_ref} and "
            f"cultivar_name = {sql(cultivar.get('cultivar_name'))} "
            "limit 1)"
        ) if cultivar else "null"

        source_ids = {
            source["source_ref"]: stable_uuid("plant-source", source["source_ref"], source.get("source_url") or source.get("source_name"))
            for source in optional_list(record, "sources")
        }

        lines.extend(
            [
                f"-- {slug}",
                "insert into catalog.plant_taxa (",
                "  id, kingdom_name, family_name, genus_name, species_name, subspecies_name, variety_name,",
                "  botanical_name_full, taxon_rank, native_range, origin_type",
                ") values (",
                "  "
                + ", ".join(
                    [
                        sql_uuid(taxon_id),
                        sql(taxonomy.get("kingdom_name") or "Plantae"),
                        sql(taxonomy.get("family_name")),
                        sql(taxonomy.get("genus_name")),
                        sql(taxonomy.get("species_name")),
                        sql(taxonomy.get("subspecies_name")),
                        sql(taxonomy.get("variety_name")),
                        sql(taxonomy.get("botanical_name_full")),
                        sql(taxonomy.get("taxon_rank")),
                        sql(taxonomy.get("native_range")),
                        sql(taxonomy.get("origin_type") or "unknown"),
                    ]
                ),
                ")",
                "on conflict ((lower(genus_name)), (coalesce(lower(species_name), '')), (coalesce(lower(subspecies_name), '')), (coalesce(lower(variety_name), ''))) do update set",
                "  kingdom_name = excluded.kingdom_name,",
                "  family_name = excluded.family_name,",
                "  genus_name = excluded.genus_name,",
                "  species_name = excluded.species_name,",
                "  subspecies_name = excluded.subspecies_name,",
                "  variety_name = excluded.variety_name,",
                "  botanical_name_full = excluded.botanical_name_full,",
                "  taxon_rank = excluded.taxon_rank,",
                "  native_range = excluded.native_range,",
                "  origin_type = excluded.origin_type,",
                "  updated_at = now();",
                "",
            ]
        )

        for name in optional_list(record, "names"):
            lines.extend(
                [
                    "insert into catalog.plant_names (plant_taxon_id, name, name_type, locale, is_primary)",
                    f"values ({taxon_ref}, {sql(name.get('name'))}, {sql(name.get('name_type'))}, {sql(name.get('locale') or 'en')}, {sql(bool(name.get('is_primary')))})",
                    "on conflict (plant_taxon_id, (lower(name)), name_type, locale) do update set",
                    "  is_primary = excluded.is_primary,",
                    "  updated_at = now();",
                    "",
                ]
            )

        if cultivar:
            lines.extend(
                [
                    "insert into catalog.plant_cultivars (",
                    "  id, plant_taxon_id, cultivar_name, market_name, description, chill_hours_min, chill_hours_max, disease_resistance_notes, is_active",
                    ") values (",
                    "  "
                    + ", ".join(
                        [
                            sql_uuid(cultivar_id),
                            taxon_ref,
                            sql(cultivar.get("cultivar_name")),
                            sql(cultivar.get("market_name")),
                            sql(cultivar.get("description")),
                            sql(cultivar.get("chill_hours_min")),
                            sql(cultivar.get("chill_hours_max")),
                            sql(cultivar.get("disease_resistance_notes")),
                            sql(cultivar.get("is_active", True)),
                        ]
                    ),
                    ")",
                    "on conflict (plant_taxon_id, cultivar_name) do update set",
                    "  market_name = excluded.market_name,",
                    "  description = excluded.description,",
                    "  chill_hours_min = excluded.chill_hours_min,",
                    "  chill_hours_max = excluded.chill_hours_max,",
                    "  disease_resistance_notes = excluded.disease_resistance_notes,",
                    "  is_active = excluded.is_active,",
                    "  updated_at = now();",
                    "",
                ]
            )

        lines.extend(
            [
                "insert into catalog.plant_profiles (",
                "  id, plant_taxon_id, plant_cultivar_id, slug, display_name, plant_type_code, lifecycle_type,",
                "  confidence_score, evidence_count, source_count, source_last_reviewed_at,",
                "  ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes,",
                "  is_ai_generated, generation_status, is_published, review_status",
                ") values (",
                "  "
                + ", ".join(
                    [
                        sql_uuid(profile_id),
                        taxon_ref,
                        cultivar_ref,
                        sql(slug),
                        sql(profile.get("display_name")),
                        sql(profile.get("plant_type_code")),
                        sql(profile.get("lifecycle_type")),
                        sql(profile.get("confidence_score")),
                        sql(profile.get("evidence_count", 0)),
                        sql(profile.get("source_count", len(source_ids))),
                        sql(profile.get("source_last_reviewed_at")),
                        sql(profile.get("ai_generated_summary", False)),
                        sql(profile.get("human_verified", False)),
                        sql(profile.get("conflict_flag", False)),
                        sql(profile.get("region_specific_conflict_notes")),
                        sql(profile.get("is_ai_generated", False)),
                        sql(profile.get("generation_status", "human_curated")),
                        sql(profile.get("is_published", False)),
                        sql(profile.get("review_status", "draft")),
                    ]
                ),
                ")",
                "on conflict (slug) where deleted_at is null do update set",
                "  plant_taxon_id = excluded.plant_taxon_id,",
                "  plant_cultivar_id = excluded.plant_cultivar_id,",
                "  slug = excluded.slug,",
                "  display_name = excluded.display_name,",
                "  plant_type_code = excluded.plant_type_code,",
                "  lifecycle_type = excluded.lifecycle_type,",
                "  confidence_score = excluded.confidence_score,",
                "  evidence_count = excluded.evidence_count,",
                "  source_count = excluded.source_count,",
                "  source_last_reviewed_at = excluded.source_last_reviewed_at,",
                "  ai_generated_summary = excluded.ai_generated_summary,",
                "  human_verified = excluded.human_verified,",
                "  conflict_flag = excluded.conflict_flag,",
                "  region_specific_conflict_notes = excluded.region_specific_conflict_notes,",
                "  is_ai_generated = excluded.is_ai_generated,",
                "  generation_status = excluded.generation_status,",
                "  is_published = excluded.is_published,",
                "  review_status = excluded.review_status,",
                "  updated_at = now();",
                "",
            ]
        )

        for item in optional_list(record, "cultivar_overrides"):
            override_id = stable_uuid(
                "plant-cultivar-override",
                slug,
                item.get("field_key"),
                item.get("region_type"),
                item.get("region_value"),
            )
            lines.extend(
                [
                    "insert into catalog.plant_cultivar_overrides (id, plant_cultivar_id, plant_profile_id, region_type, region_value, field_key, override_scope, override_value, evidence_strength_code, source_notes)",
                    f"values ({sql_uuid(override_id)}, {cultivar_ref}, {profile_ref}, {sql(item.get('region_type'))}, {sql(item.get('region_value'))}, {sql(item.get('field_key'))}, {sql(item.get('override_scope'))}, {sql_json(item.get('override_value'))}, {sql(item.get('evidence_strength_code'))}, {sql(item.get('source_notes'))})",
                    "on conflict (plant_cultivar_id, field_key, (coalesce(region_type, '')), (coalesce(region_value, ''))) do update set",
                    "  plant_profile_id = excluded.plant_profile_id,",
                    "  override_scope = excluded.override_scope,",
                    "  override_value = excluded.override_value,",
                    "  evidence_strength_code = excluded.evidence_strength_code,",
                    "  source_notes = excluded.source_notes,",
                    "  updated_at = now();",
                    "",
                ]
            )

        for item in optional_list(record, "aesthetic_styles"):
            item_id = stable_uuid("plant-aesthetic-style", slug, item["style_code"])
            lines.extend(
                [
                    "insert into catalog.plant_profile_aesthetic_styles (id, plant_profile_id, style_code, weight_score)",
                    f"values ({sql_uuid(item_id)}, {profile_ref}, {sql(item.get('style_code'))}, {sql(item.get('weight_score'))})",
                    "on conflict (plant_profile_id, style_code) do update set",
                    "  weight_score = excluded.weight_score;",
                    "",
                ]
            )

        for item in optional_list(record, "uses"):
            item_id = stable_uuid("plant-use", slug, item["use_type_code"])
            lines.extend(
                [
                    "insert into catalog.plant_profile_uses (id, plant_profile_id, use_type_code, evidence_strength_code, supports_use, mechanism_description, target_benefit, target_pest, target_soil_effect, notes)",
                    f"values ({sql_uuid(item_id)}, {profile_ref}, {sql(item.get('use_type_code'))}, {sql(item.get('evidence_strength_code'))}, {sql(item.get('supports_use', True))}, {sql(item.get('mechanism_description'))}, {sql(item.get('target_benefit'))}, {sql(item.get('target_pest'))}, {sql(item.get('target_soil_effect'))}, {sql(item.get('notes'))})",
                    "on conflict (plant_profile_id, use_type_code) do update set",
                    "  evidence_strength_code = excluded.evidence_strength_code,",
                    "  supports_use = excluded.supports_use,",
                    "  mechanism_description = excluded.mechanism_description,",
                    "  target_benefit = excluded.target_benefit,",
                    "  target_pest = excluded.target_pest,",
                    "  target_soil_effect = excluded.target_soil_effect,",
                    "  notes = excluded.notes,",
                    "  updated_at = now();",
                    "",
                ]
            )

        narratives = optional_object(record, "narratives")
        if narratives:
            narrative_columns = [
                "locale",
                "short_description",
                "why_plant_it",
                "pros_summary",
                "cons_summary",
                "primary_use_cases",
                "notes_for_homestead",
                "notes_for_small_garden",
                "notes_for_container_growing",
                "editorial_summary",
            ]
            values = {**narratives, "locale": narratives.get("locale") or "en"}
            insert_columns = ["plant_profile_id"] + narrative_columns
            insert_values = [profile_ref] + [sql(values.get(column)) for column in narrative_columns]
            updates = [f"{column} = excluded.{column}" for column in narrative_columns if column != "locale"] + ["updated_at = now()"]
            lines.extend(
                [
                    f"insert into catalog.plant_profile_narratives ({', '.join(insert_columns)})",
                    f"values ({', '.join(insert_values)})",
                    "on conflict (plant_profile_id, locale) do update set",
                    "  " + ",\n  ".join(updates) + ";",
                    "",
                ]
            )

        insert_one_to_one(
            lines,
            "catalog.plant_ornamental_profiles",
            profile_ref,
            optional_object(record, "ornamental"),
            ["evergreen_deciduous", "ornamental_season_interest", "visual_texture", "foliage_color", "evergreen_foliage", "winter_interest"],
            array_columns={"ornamental_season_interest"},
        )
        insert_one_to_one(lines, "catalog.plant_climate_profiles", profile_ref, optional_object(record, "climate"), [
            "usda_hardiness_min", "usda_hardiness_max", "ahs_heat_zone_min", "ahs_heat_zone_max",
            "cold_tolerance_absolute_f", "cold_tolerance_established_f", "heat_tolerance_f",
            "humidity_tolerance_code", "drought_tolerance_code", "flood_tolerance_code", "wind_tolerance_code",
            "salt_tolerance_code", "chill_hours_min", "chill_hours_max", "frost_tender",
            "reemergence_after_freeze_behavior", "sun_min_hours", "sun_max_hours", "preferred_light",
            "shade_tolerance_score", "afternoon_sun_tolerance_score", "reflected_heat_tolerance_score",
        ])
        insert_one_to_one(lines, "catalog.plant_growth_profiles", profile_ref, optional_object(record, "growth"), [
            "mature_height_min_in", "mature_height_max_in", "mature_width_min_in", "mature_width_max_in",
            "annual_growth_height_in", "annual_growth_width_in", "growth_rate_code", "growth_habit",
            "root_behavior", "spread_aggressiveness", "pruning_response", "transplant_tolerance",
            "container_tolerance", "trellis_needed", "support_type",
        ])

        for method in optional_list(record, "propagation_methods"):
            method_id = stable_uuid("plant-propagation-method", slug, method["planting_method_code"])
            columns = [
                "id", "plant_profile_id", "planting_method_code", "allowed", "is_preferred", "depth_min_in",
                "depth_max_in", "spacing_min_in", "spacing_max_in", "proliferation_behavior", "self_seeds",
                "reseeding_intensity", "spreads_by_runners", "spreads_by_rhizomes", "grafted_common",
                "seed_viability_duration_months", "germination_days_min", "germination_days_max",
                "cold_stratification_required", "scarification_required", "rooting_hormone_helpful",
                "transplant_shock_risk_code", "establishment_difficulty", "notes",
            ]
            values = [
                sql_uuid(method_id),
                profile_ref,
                sql(method["planting_method_code"]),
                sql(method.get("allowed", True)),
                sql(method.get("is_preferred", False)),
                sql(method.get("depth_min_in")),
                sql(method.get("depth_max_in")),
                sql(method.get("spacing_min_in")),
                sql(method.get("spacing_max_in")),
                sql(method.get("proliferation_behavior")),
                sql(method.get("self_seeds")),
                sql(method.get("reseeding_intensity")),
                sql(method.get("spreads_by_runners")),
                sql(method.get("spreads_by_rhizomes")),
                sql(method.get("grafted_common")),
                sql(method.get("seed_viability_duration_months")),
                sql(method.get("germination_days_min")),
                sql(method.get("germination_days_max")),
                sql(method.get("cold_stratification_required")),
                sql(method.get("scarification_required")),
                sql(method.get("rooting_hormone_helpful")),
                sql(method.get("transplant_shock_risk_code")),
                sql(method.get("establishment_difficulty")),
                sql(method.get("notes")),
            ]
            update_columns = columns[3:]
            lines.extend(
                [
                    f"insert into catalog.plant_propagation_methods ({', '.join(columns)})",
                    f"values ({', '.join(values)})",
                    "on conflict (plant_profile_id, planting_method_code) do update set",
                    "  " + ",\n  ".join(f"{column} = excluded.{column}" for column in update_columns) + ",",
                    "  updated_at = now();",
                    "",
                ]
            )

        insert_one_to_one(lines, "catalog.plant_flowering_profiles", profile_ref, optional_object(record, "flowering"), [
            "flowering_bool", "flower_color", "flower_size", "bloom_start_week", "bloom_end_week",
            "bloom_duration_days", "flower_abundance", "flower_fragrance_strength", "pollinator_value",
            "nectar_value", "pollen_value", "attracts_bees", "attracts_butterflies", "attracts_hummingbirds",
            "larval_host", "native_pollinator_value",
        ])
        insert_one_to_one(lines, "catalog.plant_fruiting_profiles", profile_ref, optional_object(record, "fruiting"), [
            "fruiting_bool", "fruit_color", "fruit_size", "fruit_flavor", "fruiting_start_age_years",
            "yield_lb_per_plant_year_min", "yield_lb_per_plant_year_max", "harvest_window_start_week",
            "harvest_window_end_week", "fruit_drop_behavior", "wildlife_attraction",
            "first_harvest_time_from_planting_days", "productive_years_min", "productive_years_max",
            "harvest_frequency", "preservation_uses", "edible_parts", "medicinal_parts", "fodder_parts",
        ], array_columns={"edible_parts", "medicinal_parts", "fodder_parts"})
        insert_one_to_one(lines, "catalog.plant_soil_profiles", profile_ref, optional_object(record, "soil"), [
            "drainage_requirement", "organic_matter_preference", "compaction_tolerance_code",
            "rocky_soil_tolerance_code", "ph_min", "ph_max", "ph_ideal_min", "ph_ideal_max",
            "ph_sensitivity_code", "fertility_need", "nitrogen_need", "phosphorus_need", "potassium_need",
            "calcium_sensitivity_code", "soil_oxygen_need", "mycorrhizal_association_notes",
            "mulch_preference", "mulch_depth_preference_in", "waterlogging_sensitivity_code",
            "texture_preferences", "preferred_soil_texture_codes", "soil_texture_summary",
        ], array_columns={"preferred_soil_texture_codes"}, json_columns={"texture_preferences"})
        insert_one_to_one(lines, "catalog.plant_water_profiles", profile_ref, optional_object(record, "water"), [
            "water_need_level", "drought_tolerance_code", "moisture_sensitivity_code", "preferred_irrigation_method",
            "root_zone_depth_in", "container_water_multiplier", "mulched_water_reduction_factor",
            "summer_heat_adjustment_factor",
        ])
        insert_one_to_one(lines, "catalog.plant_ecology_profiles", profile_ref, optional_object(record, "ecology"), [
            "invasive_risk_code", "wildlife_food_value", "erosion_control_value", "biomass_value",
            "compost_value", "chop_drop_value",
        ])
        insert_one_to_one(lines, "catalog.plant_maintenance_profiles", profile_ref, optional_object(record, "maintenance"), [
            "pruning_frequency", "deadheading_helpful", "division_interval_years", "staking_needed",
            "suckering_management", "cleanup_intensity", "disease_susceptibility_level",
            "pest_susceptibility_level", "humidity_disease_risk", "air_flow_importance",
        ])

        for item in optional_list(record, "water_establishment"):
            item_id = stable_uuid("plant-water-establishment", slug, item["week_from_planting_start"], item["week_from_planting_end"])
            lines.extend(
                [
                    "insert into catalog.plant_water_establishment_profiles (id, plant_profile_id, week_from_planting_start, week_from_planting_end, gallons_per_week, frequency_per_week, deep_vs_frequent, notes)",
                    f"values ({sql_uuid(item_id)}, {profile_ref}, {sql(item.get('week_from_planting_start'))}, {sql(item.get('week_from_planting_end'))}, {sql(item.get('gallons_per_week'))}, {sql(item.get('frequency_per_week'))}, {sql(item.get('deep_vs_frequent'))}, {sql(item.get('notes'))})",
                    "on conflict (id) do update set",
                    "  gallons_per_week = excluded.gallons_per_week,",
                    "  frequency_per_week = excluded.frequency_per_week,",
                    "  deep_vs_frequent = excluded.deep_vs_frequent,",
                    "  notes = excluded.notes;",
                    "",
                ]
            )

        for item in optional_list(record, "water_seasonal"):
            item_id = stable_uuid("plant-water-seasonal", slug, item.get("region_type", "generic"), item.get("region_value"), item["month_no"], item.get("lifecycle_stage_code"))
            lines.extend(
                [
                    "insert into catalog.plant_water_seasonal_profiles (id, plant_profile_id, region_type, region_value, month_no, lifecycle_stage_code, estimated_inches_per_week, estimated_gallons_per_week, preferred_method, stress_watchouts)",
                    f"values ({sql_uuid(item_id)}, {profile_ref}, {sql(item.get('region_type') or 'generic')}, {sql(item.get('region_value'))}, {sql(item.get('month_no'))}, {sql(item.get('lifecycle_stage_code'))}, {sql(item.get('estimated_inches_per_week'))}, {sql(item.get('estimated_gallons_per_week'))}, {sql(item.get('preferred_method'))}, {sql(item.get('stress_watchouts'))})",
                    "on conflict (plant_profile_id, region_type, (coalesce(region_value, '')), month_no, (coalesce(lifecycle_stage_code, ''))) do update set",
                    "  estimated_inches_per_week = excluded.estimated_inches_per_week,",
                    "  estimated_gallons_per_week = excluded.estimated_gallons_per_week,",
                    "  preferred_method = excluded.preferred_method,",
                    "  stress_watchouts = excluded.stress_watchouts;",
                    "",
                ]
            )

        for item in optional_list(record, "phenology_templates"):
            template_id = stable_uuid("phenology-template", slug, item["region_type"], item.get("region_value"), item.get("is_default", False))
            template_ref = (
                "(select id from catalog.phenology_templates where "
                f"plant_profile_id = {profile_ref} and "
                f"region_type = {sql(item.get('region_type'))} and "
                f"coalesce(region_value, '') = coalesce({sql(item.get('region_value'))}, '') and "
                f"is_default = {sql(item.get('is_default', False))} "
                "limit 1)"
            )
            lines.extend(
                [
                    "insert into catalog.phenology_templates (id, plant_profile_id, region_type, region_value, is_default, notes)",
                    f"values ({sql_uuid(template_id)}, {profile_ref}, {sql(item.get('region_type'))}, {sql(item.get('region_value'))}, {sql(item.get('is_default', False))}, {sql(item.get('notes'))})",
                    "on conflict (plant_profile_id, region_type, (coalesce(region_value, '')), is_default) do update set",
                    "  notes = excluded.notes,",
                    "  updated_at = now();",
                    "",
                ]
            )
            for event_index, event in enumerate(item.get("events") or []):
                event_id = stable_uuid("phenology-event", slug, item["region_type"], item.get("region_value"), event.get("stage_code"), event_index)
                columns = [
                    "id", "phenology_template_id", "stage_code", "stage_name", "trigger_type", "trigger_rule",
                    "timing_type", "earliest_date", "typical_date", "latest_date", "week_start_of_year",
                    "week_end_of_year", "month_start", "month_end", "offset_days_from_planting",
                    "repeat_every_days", "cues", "recommended_action", "recurrence", "urgency_code",
                    "failure_risk_if_missed", "priority_weight", "repeatable",
                ]
                values = [
                    sql_uuid(event_id),
                    template_ref,
                    sql(event.get("stage_code")),
                    sql(event.get("stage_name")),
                    sql(event.get("trigger_type")),
                    sql(event.get("trigger_rule")),
                    sql(event.get("timing_type")),
                    sql(event.get("earliest_date")),
                    sql(event.get("typical_date")),
                    sql(event.get("latest_date")),
                    sql(event.get("week_start_of_year")),
                    sql(event.get("week_end_of_year")),
                    sql(event.get("month_start")),
                    sql(event.get("month_end")),
                    sql(event.get("offset_days_from_planting")),
                    sql(event.get("repeat_every_days")),
                    sql(event.get("cues")),
                    sql(event.get("recommended_action")),
                    sql(event.get("recurrence")),
                    sql(event.get("urgency_code")),
                    sql(event.get("failure_risk_if_missed")),
                    sql(event.get("priority_weight", 50)),
                    sql(event.get("repeatable", False)),
                ]
                lines.extend(
                    [
                        f"insert into catalog.phenology_events ({', '.join(columns)})",
                        f"values ({', '.join(values)})",
                        "on conflict (id) do update set",
                        "  stage_code = excluded.stage_code,",
                        "  stage_name = excluded.stage_name,",
                        "  trigger_type = excluded.trigger_type,",
                        "  trigger_rule = excluded.trigger_rule,",
                        "  timing_type = excluded.timing_type,",
                        "  earliest_date = excluded.earliest_date,",
                        "  typical_date = excluded.typical_date,",
                        "  latest_date = excluded.latest_date,",
                        "  week_start_of_year = excluded.week_start_of_year,",
                        "  week_end_of_year = excluded.week_end_of_year,",
                        "  month_start = excluded.month_start,",
                        "  month_end = excluded.month_end,",
                        "  offset_days_from_planting = excluded.offset_days_from_planting,",
                        "  repeat_every_days = excluded.repeat_every_days,",
                        "  cues = excluded.cues,",
                        "  recommended_action = excluded.recommended_action,",
                        "  recurrence = excluded.recurrence,",
                        "  urgency_code = excluded.urgency_code,",
                        "  failure_risk_if_missed = excluded.failure_risk_if_missed,",
                        "  priority_weight = excluded.priority_weight,",
                        "  repeatable = excluded.repeatable,",
                        "  updated_at = now();",
                        "",
                    ]
                )

        for item in optional_list(record, "zone_profiles"):
            item_id = stable_uuid("plant-zone-profile", slug, item["region_type"], item.get("region_value"))
            lines.extend(
                [
                    "insert into catalog.plant_zone_profiles (id, plant_profile_id, region_type, region_value, usda_zone_min, usda_zone_max, planting_window_start_week, planting_window_end_week, harvest_window_start_week, harvest_window_end_week, bloom_window_start_week, bloom_window_end_week, dieback_window_start_week, reemergence_window_start_week, proliferation_behavior, maintenance_timing_notes, seasonal_risk_notes)",
                    f"values ({sql_uuid(item_id)}, {profile_ref}, {sql(item.get('region_type'))}, {sql(item.get('region_value'))}, {sql(item.get('usda_zone_min'))}, {sql(item.get('usda_zone_max'))}, {sql(item.get('planting_window_start_week'))}, {sql(item.get('planting_window_end_week'))}, {sql(item.get('harvest_window_start_week'))}, {sql(item.get('harvest_window_end_week'))}, {sql(item.get('bloom_window_start_week'))}, {sql(item.get('bloom_window_end_week'))}, {sql(item.get('dieback_window_start_week'))}, {sql(item.get('reemergence_window_start_week'))}, {sql(item.get('proliferation_behavior'))}, {sql(item.get('maintenance_timing_notes'))}, {sql(item.get('seasonal_risk_notes'))})",
                    "on conflict (plant_profile_id, region_type, (coalesce(region_value, ''))) do update set",
                    "  usda_zone_min = excluded.usda_zone_min,",
                    "  usda_zone_max = excluded.usda_zone_max,",
                    "  planting_window_start_week = excluded.planting_window_start_week,",
                    "  planting_window_end_week = excluded.planting_window_end_week,",
                    "  harvest_window_start_week = excluded.harvest_window_start_week,",
                    "  harvest_window_end_week = excluded.harvest_window_end_week,",
                    "  bloom_window_start_week = excluded.bloom_window_start_week,",
                    "  bloom_window_end_week = excluded.bloom_window_end_week,",
                    "  dieback_window_start_week = excluded.dieback_window_start_week,",
                    "  reemergence_window_start_week = excluded.reemergence_window_start_week,",
                    "  proliferation_behavior = excluded.proliferation_behavior,",
                    "  maintenance_timing_notes = excluded.maintenance_timing_notes,",
                    "  seasonal_risk_notes = excluded.seasonal_risk_notes,",
                    "  updated_at = now();",
                    "",
                ]
            )

        for item in optional_list(record, "care_events"):
            item_id = stable_uuid("plant-care-event", slug, item.get("stage_code"), item["task_type_code"], item["title"])
            lines.extend(
                [
                    "insert into catalog.plant_care_events (id, plant_profile_id, stage_code, task_type_code, source_type_code, title, description, recurrence_rule, lead_days, window_days, priority_code, requires_confirmation, repeatable, is_active)",
                    f"values ({sql_uuid(item_id)}, {profile_ref}, {sql(item.get('stage_code'))}, {sql(item.get('task_type_code'))}, {sql(item.get('source_type_code'))}, {sql(item.get('title'))}, {sql(item.get('description'))}, {sql(item.get('recurrence_rule'))}, {sql(item.get('lead_days'))}, {sql(item.get('window_days'))}, {sql(item.get('priority_code'))}, {sql(item.get('requires_confirmation', False))}, {sql(item.get('repeatable', False))}, {sql(item.get('is_active', True))})",
                    "on conflict (id) do update set",
                    "  stage_code = excluded.stage_code,",
                    "  task_type_code = excluded.task_type_code,",
                    "  source_type_code = excluded.source_type_code,",
                    "  title = excluded.title,",
                    "  description = excluded.description,",
                    "  recurrence_rule = excluded.recurrence_rule,",
                    "  lead_days = excluded.lead_days,",
                    "  window_days = excluded.window_days,",
                    "  priority_code = excluded.priority_code,",
                    "  requires_confirmation = excluded.requires_confirmation,",
                    "  repeatable = excluded.repeatable,",
                    "  is_active = excluded.is_active,",
                    "  updated_at = now();",
                    "",
                ]
            )

        for item in optional_list(record, "safety"):
            item_id = stable_uuid("plant-safety", slug, item["subject_type_code"])
            lines.extend(
                [
                    "insert into catalog.plant_safety_profiles (id, plant_profile_id, subject_type_code, safety_level_code, toxic_parts, condition_notes, symptoms, evidence_source_type, safe_use_notes)",
                    f"values ({sql_uuid(item_id)}, {profile_ref}, {sql(item.get('subject_type_code'))}, {sql(item.get('safety_level_code'))}, {sql_text_array(item.get('toxic_parts') or [])}, {sql(item.get('condition_notes'))}, {sql(item.get('symptoms'))}, {sql(item.get('evidence_source_type'))}, {sql(item.get('safe_use_notes'))})",
                    "on conflict (plant_profile_id, subject_type_code) do update set",
                    "  safety_level_code = excluded.safety_level_code,",
                    "  toxic_parts = excluded.toxic_parts,",
                    "  condition_notes = excluded.condition_notes,",
                    "  symptoms = excluded.symptoms,",
                    "  evidence_source_type = excluded.evidence_source_type,",
                    "  safe_use_notes = excluded.safe_use_notes,",
                    "  updated_at = now();",
                    "",
                ]
            )

        for source in optional_list(record, "sources"):
            source_id = source_ids[source["source_ref"]]
            lines.extend(
                [
                    "insert into catalog.plant_sources (id, source_name, source_type, publisher, author, source_url, citation_text, published_on, credibility_score, license, notes, last_reviewed_at)",
                    f"values ({sql_uuid(source_id)}, {sql(source.get('source_name'))}, {sql(source.get('source_type'))}, {sql(source.get('publisher'))}, {sql(source.get('author'))}, {sql(source.get('source_url'))}, {sql(source.get('citation_text'))}, {sql(source.get('published_on'))}, {sql(source.get('credibility_score'))}, {sql(source.get('license'))}, {sql(source.get('notes'))}, {sql(source.get('last_reviewed_at'))})",
                    "on conflict (id) do update set",
                    "  source_name = excluded.source_name,",
                    "  source_type = excluded.source_type,",
                    "  publisher = excluded.publisher,",
                    "  author = excluded.author,",
                    "  source_url = excluded.source_url,",
                    "  citation_text = excluded.citation_text,",
                    "  published_on = excluded.published_on,",
                    "  credibility_score = excluded.credibility_score,",
                    "  license = excluded.license,",
                    "  notes = excluded.notes,",
                    "  last_reviewed_at = excluded.last_reviewed_at,",
                    "  updated_at = now();",
                    "",
                ]
            )

        for index, claim in enumerate(optional_list(record, "claims")):
            claim_id = stable_uuid("plant-claim", slug, claim["claim_type"], index)
            source_id = source_ids.get(claim.get("source_ref"))
            lines.extend(
                [
                    "insert into catalog.plant_claims (id, plant_profile_id, claim_type, value_json, evidence_strength_code, confidence_score, evidence_count, source_count, source_id, source_quote_or_excerpt, source_url, reviewed_by_human, review_status, region_scope, cultivar_scope, ai_generated_summary, human_verified, conflict_flag, region_specific_conflict_notes)",
                    f"values ({sql_uuid(claim_id)}, {profile_ref}, {sql(claim.get('claim_type'))}, {sql_json(claim.get('value_json'))}, {sql(claim.get('evidence_strength_code'))}, {sql(claim.get('confidence_score'))}, {sql(1 if claim.get('source_ref') else 0)}, {sql(1 if claim.get('source_ref') else 0)}, {sql_uuid(source_id) if source_id else 'null'}, {sql(claim.get('source_quote_or_excerpt'))}, {sql(claim.get('source_url'))}, {sql(claim.get('reviewed_by_human', False))}, {sql(claim.get('review_status') or 'pending_review')}, {sql(claim.get('region_scope'))}, {sql(claim.get('cultivar_scope'))}, {sql(claim.get('ai_generated_summary', False))}, {sql(claim.get('human_verified', False))}, {sql(claim.get('conflict_flag', False))}, {sql(claim.get('region_specific_conflict_notes'))})",
                    "on conflict (id) do update set",
                    "  value_json = excluded.value_json,",
                    "  evidence_strength_code = excluded.evidence_strength_code,",
                    "  confidence_score = excluded.confidence_score,",
                    "  source_id = excluded.source_id,",
                    "  source_quote_or_excerpt = excluded.source_quote_or_excerpt,",
                    "  source_url = excluded.source_url,",
                    "  reviewed_by_human = excluded.reviewed_by_human,",
                    "  review_status = excluded.review_status,",
                    "  region_scope = excluded.region_scope,",
                    "  cultivar_scope = excluded.cultivar_scope,",
                    "  ai_generated_summary = excluded.ai_generated_summary,",
                    "  human_verified = excluded.human_verified,",
                    "  conflict_flag = excluded.conflict_flag,",
                    "  region_specific_conflict_notes = excluded.region_specific_conflict_notes,",
                    "  updated_at = now();",
                    "",
                ]
            )

        for item in optional_list(record, "ratings"):
            rating_id = stable_uuid("plant-rating", slug, item["dimension_code"])
            lines.extend(
                [
                    "insert into catalog.plant_profile_ratings (id, plant_profile_id, dimension_code, rating, description, evidence_strength_code, confidence_score, source_notes)",
                    f"values ({sql_uuid(rating_id)}, {profile_ref}, {sql(item.get('dimension_code'))}, {sql(item.get('rating'))}, {sql(item.get('description'))}, {sql(item.get('evidence_strength_code'))}, {sql(item.get('confidence_score'))}, {sql(item.get('source_notes'))})",
                    "on conflict (plant_profile_id, dimension_code) do update set",
                    "  rating = excluded.rating,",
                    "  description = excluded.description,",
                    "  evidence_strength_code = excluded.evidence_strength_code,",
                    "  confidence_score = excluded.confidence_score,",
                    "  source_notes = excluded.source_notes,",
                    "  updated_at = now();",
                    "",
                ]
            )

        for item in optional_list(record, "relationships"):
            item_id = stable_uuid("plant-relationship", slug, item["related_slug"], item["relationship_type_code"])
            related_ref = f"(select id from catalog.plant_profiles where slug = {sql(item['related_slug'])} and deleted_at is null)"
            lines.extend(
                [
                    "insert into catalog.plant_relationships (id, plant_profile_id, related_plant_profile_id, relationship_type_code, rank_value, evidence_strength_code, rationale, distance_notes, overlap_window_start_week, overlap_window_end_week, source_notes, is_published)",
                    f"values ({sql_uuid(item_id)}, {profile_ref}, {related_ref}, {sql(item.get('relationship_type_code'))}, {sql(item.get('rank_value'))}, {sql(item.get('evidence_strength_code'))}, {sql(item.get('rationale'))}, {sql(item.get('distance_notes'))}, {sql(item.get('overlap_window_start_week'))}, {sql(item.get('overlap_window_end_week'))}, {sql(item.get('source_notes'))}, {sql(item.get('is_published', True))})",
                    "on conflict (plant_profile_id, related_plant_profile_id, relationship_type_code) do update set",
                    "  rank_value = excluded.rank_value,",
                    "  evidence_strength_code = excluded.evidence_strength_code,",
                    "  rationale = excluded.rationale,",
                    "  distance_notes = excluded.distance_notes,",
                    "  overlap_window_start_week = excluded.overlap_window_start_week,",
                    "  overlap_window_end_week = excluded.overlap_window_end_week,",
                    "  source_notes = excluded.source_notes,",
                    "  is_published = excluded.is_published,",
                    "  updated_at = now();",
                    "",
                ]
            )

        for image in optional_list(record, "images"):
            image_key = image.get("storage_key") or image.get("image_url") or image.get("stage_code") or "image"
            image_id = stable_uuid("plant-image", slug, image_key)
            source_id = source_ids.get(image.get("source_ref"))
            lines.extend(
                [
                    "insert into catalog.plant_images (id, plant_profile_id, source_id, stage_code, image_url, storage_key, mime_type, width_px, height_px, attribution_text, license, is_primary, is_public)",
                    f"values ({sql_uuid(image_id)}, {profile_ref}, {sql_uuid(source_id) if source_id else 'null'}, {sql(image.get('stage_code'))}, {sql(image.get('image_url'))}, {sql(image.get('storage_key'))}, {sql(image.get('mime_type'))}, {sql(image.get('width_px'))}, {sql(image.get('height_px'))}, {sql(image.get('attribution_text'))}, {sql(image.get('license'))}, {sql(image.get('is_primary', False))}, {sql(image.get('is_public', True))})",
                    "on conflict (id) do update set",
                    "  source_id = excluded.source_id,",
                    "  stage_code = excluded.stage_code,",
                    "  image_url = excluded.image_url,",
                    "  storage_key = excluded.storage_key,",
                    "  mime_type = excluded.mime_type,",
                    "  width_px = excluded.width_px,",
                    "  height_px = excluded.height_px,",
                    "  attribution_text = excluded.attribution_text,",
                    "  license = excluded.license,",
                    "  is_primary = excluded.is_primary,",
                    "  is_public = excluded.is_public,",
                    "  updated_at = now();",
                    "",
                ]
            )

    lines.append("commit;")
    lines.append("")
    return "\n".join(lines)


def maybe_schema_validate(records: list[LoadedRecord]) -> None:
    try:
        import jsonschema  # type: ignore
    except ImportError:
        raise ValidationError(
            "jsonschema is required unless --skip-json-schema is passed. "
            "Install it with: python3 -m pip install jsonschema"
        )

    with SCHEMA_PATH.open("r", encoding="utf-8") as handle:
        schema = json.load(handle)
    validator = jsonschema.Draft202012Validator(schema)
    errors: list[str] = []
    for loaded in records:
        for error in sorted(validator.iter_errors(loaded.record), key=lambda item: list(item.path)):
            path = ".".join(str(part) for part in error.path) or "<root>"
            errors.append(f"{loaded.path}: {loaded.record.get('slug', '<unknown>')}: {path}: {error.message}")
    if errors:
        raise ValidationError("\n".join(errors))


def apply_sql(sql_text: str) -> None:
    database_url = os.environ.get("SUPABASE_DB_URL")
    if not database_url:
        raise ValidationError("SUPABASE_DB_URL is required for --apply")
    psql = shutil.which("psql")
    if not psql:
        raise ValidationError("psql is required for --apply")

    with tempfile.NamedTemporaryFile("w", suffix=".sql", delete=False, encoding="utf-8") as handle:
        handle.write(sql_text)
        sql_path = handle.name
    try:
        subprocess.run([psql, database_url, "-v", "ON_ERROR_STOP=1", "-f", sql_path], check=True)
    finally:
        Path(sql_path).unlink(missing_ok=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate and import Garden.io catalog plant JSON records.")
    parser.add_argument("--input", required=True, type=Path, help="JSON file, JSONL file, or directory of JSON files.")
    parser.add_argument("--validate-only", action="store_true", help="Validate records without emitting or applying SQL.")
    parser.add_argument("--output-sql", type=Path, help="Write generated SQL to this path.")
    parser.add_argument("--apply", action="store_true", help="Apply generated SQL with psql using SUPABASE_DB_URL.")
    parser.add_argument("--draft", action="store_true", help="Allow records that omit full-production sections.")
    parser.add_argument("--skip-json-schema", action="store_true", help="Skip JSON Schema validation and run semantic validation only.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    records = read_records(args.input)
    if not records:
        raise ValidationError(f"{args.input}: no records found")

    for loaded in records:
        validate_record(loaded.record, strict=not args.draft)
    if not args.skip_json_schema:
        maybe_schema_validate(records)

    if args.validate_only:
        print(f"Validated {len(records)} plant record(s).")
        return 0

    sql_text = build_sql(records)
    if args.output_sql:
        args.output_sql.parent.mkdir(parents=True, exist_ok=True)
        args.output_sql.write_text(sql_text, encoding="utf-8")
        print(f"Wrote SQL for {len(records)} plant record(s) to {args.output_sql}")
    elif not args.apply:
        print(sql_text)

    if args.apply:
        apply_sql(sql_text)
        print(f"Applied {len(records)} plant record(s).")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValidationError as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(1)
