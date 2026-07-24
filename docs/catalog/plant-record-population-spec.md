# Plant Record Population Spec

## Purpose

Manual, one-plant-at-a-time catalog curation does not scale for the starter plant list. The scalable path is:

1. Gather source material for each plant.
2. Extract a structured JSON record that follows `docs/catalog/plant-profile-record.schema.json`.
3. Validate the JSON deterministically.
4. Generate idempotent SQL from the validated JSON.
5. Apply the SQL in a transaction and run the catalog validation checks.

No model or human should write SQL directly for bulk plant curation. Models may draft JSON and source-backed descriptions. The importer owns identifiers, upsert shape, range checks, old-table rejection, and database writes.

## Core Model

`catalog.plant_profiles` is the core header record and FK anchor. It is not the full app-facing catalog row. The app catalog should be loaded from joined child tables or, later, a materialized view.

New plant records should write profile detail to child tables:

- `catalog.plant_taxa`: botanical identity.
- `catalog.plant_names`: common names, synonyms, and trade names.
- `catalog.plant_cultivars`: named cultivars that share a taxon but have garden-relevant differences.
- `catalog.plant_profiles`: stable header, slug, display name, lifecycle, status, evidence counts.
- `catalog.plant_profile_narratives`: descriptions, summaries, and fit notes.
- `catalog.plant_ornamental_profiles`: foliage, seasonal interest, and ornamental display facts.
- `catalog.plant_profile_aesthetic_styles`: searchable aesthetic/style tags.
- `catalog.plant_profile_uses`: functional uses with evidence strength.
- `catalog.plant_profile_ratings`: normalized 1-5 comparison fields.
- `catalog.plant_climate_profiles`: zone, heat, humidity, sun, shade, and weather tolerance facts.
- `catalog.plant_growth_profiles`: size, growth habit, support, spread, and transplant/container behavior.
- `catalog.plant_propagation_methods`: every allowed propagation/planting method plus method-specific propagation facts.
- `catalog.plant_flowering_profiles`: flowering and pollinator facts.
- `catalog.plant_fruiting_profiles`: fruit, harvest, yield, edible/medicinal/fodder parts.
- `catalog.plant_soil_profiles`: drainage, chemistry, fertility, and structured texture preferences.
- `catalog.plant_water_profiles`, `catalog.plant_water_establishment_profiles`, `catalog.plant_water_seasonal_profiles`: layered water needs.
- `catalog.plant_ecology_profiles`: wildlife, biomass, erosion, invasive risk.
- `catalog.plant_maintenance_profiles`: pruning, division, disease/pest risk, cleanup.
- `catalog.plant_safety_profiles`: toxicity or safety by subject.
- `catalog.plant_relationships`: companion, conflict, pollination, and related-plant graph.
- `catalog.phenology_templates` and `catalog.phenology_events`: regional lifecycle timing.
- `catalog.plant_zone_profiles`: region-specific windows, risks, and behavior.
- `catalog.plant_care_events`: reusable catalog-level care tasks.
- `catalog.plant_cultivar_overrides`: cultivar-specific differences for size, timing, use, yield, disease, or other scoped traits.
- `catalog.plant_sources`, `catalog.plant_claims`, `catalog.plant_images`: evidence and media.

Do not repopulate retired or transitional structures:

- `public.garden_catalog_plants`
- `growing_requirements`
- `catalog.plant_soil_texture_preferences`
- `catalog.plant_propagation_profiles`

## Full Record Contract

A full plant record should include these JSON sections:

- `taxonomy`
- `names`
- `profile`
- `aesthetic_styles`
- `uses`
- `narratives`
- `ornamental`
- `climate`
- `growth`
- `propagation_methods`
- `flowering`
- `fruiting`
- `soil`
- `water`
- `water_establishment`
- `water_seasonal`
- `ecology`
- `maintenance`
- `safety`
- `relationships`
- `phenology_templates`
- `zone_profiles`
- `care_events`
- `sources`
- `claims`
- `images`
- `ratings`

Cultivar-specific plant records should also include:

- `cultivar`
- `cultivar_overrides`

The importer may allow draft records during early curation, but a published or full-quality record should not skip major sections silently. Unknown values should be explicit `null`, `unknown`, or omitted only when the field is not applicable.

## Deterministic Versus Model-Assisted Work

Deterministic steps:

- Slug normalization.
- Stable UUID generation.
- JSON schema validation.
- Required-section checks for strict mode.
- Enum and range validation.
- 1-5 rating validation.
- Claim type validation.
- Source-reference validation.
- SQL generation and transaction boundaries.
- Upsert conflict behavior.
- Old-table/old-section rejection.
- Post-import validation query execution.

Model-assisted steps:

- Reading source material.
- Summarizing descriptions.
- Mapping evidence into field-level claims.
- Choosing preliminary ratings from source facts.
- Explaining uncertainty and conflicts.
- Drafting relationship rationales and care notes.

The model output is treated as untrusted input until the deterministic validator passes it.

## Claim Rules

Claims exist to preserve evidence and uncertainty at the field level. They should not duplicate the whole profile as broad prose.

Claim types must be field-aligned:

- Good: `soil.ph_range`, `soil.texture_preferences`, `water.need_level`, `climate.usda_hardiness`, `growth.mature_size`, `propagation.division`, `relationship.good_companion`
- Bad: `profile`, `growing_requirements`, `care`, `misc`, `plant_notes`

Every sourced fact that may vary by region, cultivar, source quality, or interpretation should have a claim. Stable identity facts may still have claims if the source is useful, but taxonomy does not need a claim for every column when the source table and botanical name are enough.

Each claim should include:

- `claim_type`
- `value_json`
- `evidence_strength_code`
- `confidence_score`
- `source_ref`
- `source_quote_or_excerpt` when available
- `region_scope` or `cultivar_scope` when the claim is scoped
- `review_status`

If the source conflicts with another source, keep both claims and set `conflict_flag`.

## Cultivar Rules

Do not model cultivars as separate taxa. Cultivars should reuse the base botanical taxon and add a `catalog.plant_cultivars` row when the named cultivar matters to actual garden decisions.

Create a cultivar-linked `catalog.plant_profiles` row when the cultivar materially changes app-facing behavior, search, or recommendations. Good reasons include materially different mature size, container suitability, days to harvest, seed/fruit timing, disease resistance, yield, use emphasis, pollinator value, or maintenance burden.

Do not create a separate profile for a cultivar when the name is only a vendor label and the available evidence does not show a meaningful difference. In that case, keep it as a name/trade synonym or source claim until better evidence exists.

Use `cultivar_overrides` for specific differences from the base species profile. Keep the override small and field-aligned:

- Good: `growth.mature_height_in`, `phenology.days_to_maturity`, `profile.primary_use_cases`, `maintenance.disease_resistance`
- Bad: `whole_profile`, `care_notes`, `misc`

When maturity differs by harvest purpose, do not collapse it into one opaque number. Prefer a structured override with purpose-specific values such as leaf harvest, flower head, seed head, or full maturity. If sources conflict, keep the conflict in `claims` and set the override value to a range or conflict object instead of hiding the uncertainty.

## Rating Rules

Ratings use a normalized 1-5 scale so the app can filter, compare, and recommend plants without parsing prose.

Ratings are not a replacement for detail fields. They are indexed comparison summaries derived from the detail fields and evidence.

Each rating must include:

- `dimension_code`
- `rating`
- `description`
- `evidence_strength_code`
- `confidence_score`
- `source_notes`

Use the live `catalog.plant_rating_dimensions` and `catalog.plant_rating_dimension_levels` rows as the scale source. The current dimensions include:

- `sun_need`
- `shade_tolerance`
- `afternoon_sun_tolerance`
- `water_need`
- `drought_tolerance`
- `wet_feet_tolerance`
- `soil_drainage_need`
- `soil_fertility_need`
- `soil_compaction_tolerance`
- `soil_texture_flexibility`
- `maintenance_need`
- `beginner_friendliness`
- `spread_aggressiveness`
- `container_suitability`
- `transplant_tolerance`
- `pollinator_value`
- `wildlife_food_value`
- `erosion_control_value`
- `biomass_value`
- `invasive_risk`
- `disease_susceptibility`
- `pest_susceptibility`
- `humidity_disease_risk`
- `deer_resistance`
- `rabbit_resistance`

If a rating is based on weak inference, keep the rating but set lower confidence and explain the basis in `source_notes`.

## Soil Contract

Soil texture and soil profile are one table now. Use `soil.texture_preferences` for structured texture-specific values and `soil.preferred_soil_texture_codes` for searchable codes.

Example texture preference object:

```json
{
  "loam": {
    "suitability": 5,
    "label": "preferred",
    "description": "Best performance in fertile, moisture-retentive but drained loam."
  },
  "clay": {
    "suitability": 3,
    "label": "tolerated if drained",
    "description": "Can handle heavier soil when drainage and winter wet are managed."
  }
}
```

`soil_texture_summary` is the human-readable summary. It should not be the only representation.

## Propagation Contract

There is no separate propagation profile table. Use `propagation_methods`, one row per method.

Method-level rows should include only facts that apply to that method. Example: seed germination days belong on `direct_sow` or `transplant_seedling`; rooting hormone belongs on `cutting`; division interval belongs in `maintenance` and division-specific notes may also appear on the `division` method.

Allowed method codes:

- `direct_sow`
- `transplant_seedling`
- `cutting`
- `division`
- `bare_root`
- `crown`
- `tuber`
- `rhizome`
- `bulb`
- `grafted_tree`

## Batch Workflow

For the starter plant list:

1. Export/import the plant names and existing slugs from the workbook/import tables.
2. Build a source bundle per plant from trusted extension, botanic garden, government, academic, and reputable horticulture references.
3. Use a cheap model for first-pass extraction into JSON, constrained by `plant-profile-record.schema.json`.
4. Run `scripts/import_catalog_plant_records.py --validate-only --input <file-or-dir>`.
5. Send validation failures back to the model with the exact error list.
6. Generate SQL with `--output-sql`.
7. Spot review representative records and every high-risk record.
8. Apply with `--apply` only after validation and review.
9. Run `supabase/sql/27-private-beta-canonical-catalog-validate.sql` and app/API smoke checks.

Use a stronger model or human review for:

- toxic plants
- edible/medicinal claims
- invasive or region-restricted claims
- relationship/companion claims
- ambiguous botanical identity
- plants with multiple common-name collisions

## Importer Usage

Install the JSON Schema validator once in the Python environment used for imports:

```bash
python3 -m pip install jsonschema
```

Validate one JSON file:

```bash
python3 scripts/import_catalog_plant_records.py --input data/catalog/acanthus.json --validate-only
```

Validate a directory and emit SQL:

```bash
python3 scripts/import_catalog_plant_records.py --input data/catalog/plant-records --output-sql tmp/catalog-import.sql
```

Apply a validated batch:

```bash
python3 scripts/import_catalog_plant_records.py --input data/catalog/plant-records --apply
```

`--apply` requires `SUPABASE_DB_URL` and uses `psql` so the import runs inside a database transaction.
