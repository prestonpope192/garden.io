# Garden.io Docs

This folder is the canonical documentation index for the repository.

Use these entrypoints in order when picking the project up cold.

## 1. Repo State and Continuation

- [`current-state.md`](current-state.md): safest repo-level summary of what is implemented, what is prototype-only, what is spec-only, and how to continue safely.
- [`../website/README.md`](../website/README.md): website setup, environment variables, waitlist flow, catalogue route notes, Docker, and test commands.

## 2. Product Foundation

- [`../PRODUCT_SPEC.md`](../PRODUCT_SPEC.md): product north star and module map.
- [`../TARGET_AUDIENCE.md`](../TARGET_AUDIENCE.md): target users, anti-personas, packaging implications, and source-backed audience framing.

## 3. Product Module Specs

These files are canonical design intent for the product modules. They should be read as blueprint/spec documents unless a feature is separately confirmed in [`current-state.md`](current-state.md).

- [`product/specs/01-my-property-interface.md`](product/specs/01-my-property-interface.md)
- [`product/specs/02-calendar-design.md`](product/specs/02-calendar-design.md)
- [`product/specs/03-my-plants.md`](product/specs/03-my-plants.md)
- [`product/specs/04-plant-catalogue-ux.md`](product/specs/04-plant-catalogue-ux.md)
- [`product/specs/05-task-system.md`](product/specs/05-task-system.md)
- [`product/specs/06-ai-suggestion-system.md`](product/specs/06-ai-suggestion-system.md)
- [`product/specs/07-style-and-branding.md`](product/specs/07-style-and-branding.md)
- [`product/specs/08-user-management-shared-access.md`](product/specs/08-user-management-shared-access.md)
- [`product/specs/09-system-architecture-overview.md`](product/specs/09-system-architecture-overview.md)
- [`product/specs/10-database-architecture-postgres.md`](product/specs/10-database-architecture-postgres.md)

## 4. Catalog Data Pipeline

- [`catalog/plant-record-population-spec.md`](catalog/plant-record-population-spec.md): source-backed JSON-to-SQL workflow for plant profile population.
- [`catalog/plant-profile-record.schema.json`](catalog/plant-profile-record.schema.json): record contract used by the importer pipeline.
- [`../data/catalog/`](../data/catalog/): curated plant JSON and generated import SQL.

## 5. Design Artifacts

- [`design/stitch/README.md`](design/stitch/README.md): Stitch design artifact index.
- [`../website/docs/ART_PROVENANCE.md`](../website/docs/ART_PROVENANCE.md): notes on current botanical illustration assets used in the website prototype.

## 6. Security and Operations References

- [`../security_best_practices_report.md`](../security_best_practices_report.md): point-in-time security review dated 2026-03-09.
- [`../docker-compose.yml`](../docker-compose.yml): local container entrypoint for the website.
- [`../scripts/`](../scripts/): schema apply/import helpers used by the current Supabase workflows.

## Documentation Rules

- Treat repo code, tests, and checked-in SQL as proof of implementation.
- Treat product specs as design intent unless current code or tests show otherwise.
- Keep future repo-level updates anchored in [`current-state.md`](current-state.md) so cold starts do not require replaying chat history.
