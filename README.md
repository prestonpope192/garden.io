# Garden.io

Garden.io is a product and prototype repository for a grower-focused planning system that connects land, timing, and plant memory.

The repo currently contains:

- a Next.js website and prototype app in [`website/`](website/)
- product, audience, architecture, and database specs in [`docs/`](docs/)
- Supabase SQL and seed/import helpers in [`supabase/sql/`](supabase/sql/) and [`scripts/`](scripts/)
- starter plant-catalog JSON and generated SQL in [`data/catalog/`](data/catalog/)

## Start Here

- Repo docs index: [`docs/README.md`](docs/README.md)
- Current implementation and status: [`docs/current-state.md`](docs/current-state.md)
- Website-specific setup: [`website/README.md`](website/README.md)

## Current Repo Shape

Implemented or directly evidenced in-repo today:

- Marketing homepage with waitlist flow.
- Public plant catalogue at `/catalog` with server-side profile loading.
- Prototype authenticated app routes under `/app/*` for `My Property`, `Calendar`, `My Plants`, and `Plant Catalogue`.
- Supabase-backed waitlist persistence and optional email sending.
- Supabase SQL for a broader private-beta data model plus additive follow-on migrations.
- Python import scripts for starter workbook data and plant catalogue records.

Planned/spec-heavy areas that are documented more deeply than they are currently implemented:

- full product module behavior across property, calendar, tasks, AI suggestions, and collaboration
- large portions of the canonical PostgreSQL architecture
- broader plant-catalog evidence and normalization workflows

Use [`docs/current-state.md`](docs/current-state.md) when you need the safest cold-start summary of what is real versus what is still blueprint/spec work.

## Quick Start

### Website

```bash
cd website
npm install
npm run dev
```

The website runs at `http://localhost:3000`.

### Docker

From repo root:

```bash
docker compose up --build -d
```

### Tests

```bash
cd website
npm test
```

## Data and Schema Work

- Waitlist table SQL: [`website/supabase/waitlist.sql`](website/supabase/waitlist.sql)
- Private beta MVP schema entrypoint: [`supabase/sql/20-private-beta-mvp.sql`](supabase/sql/20-private-beta-mvp.sql)
- Schema validation SQL: [`supabase/sql/10-garden-validate.sql`](supabase/sql/10-garden-validate.sql)
- Starter workbook importer: [`scripts/import_garden_starter_workbook.py`](scripts/import_garden_starter_workbook.py)
- Plant record importer: [`scripts/import_catalog_plant_records.py`](scripts/import_catalog_plant_records.py)

## Important Orientation Notes

- This repo has substantial active work-in-progress on the current branch. Read `git status` before assuming docs reflect a clean release state.
- Product specs under [`docs/product/specs/`](docs/product/specs/) are the canonical design intent, not proof that every surface is already implemented.
- The website app depends on Supabase environment variables for live data and write paths; see [`website/README.md`](website/README.md) for the exact variables.
- A prior security review is checked in at [`security_best_practices_report.md`](security_best_practices_report.md). Treat that as a point-in-time review, not current proof that all issues are fixed.
