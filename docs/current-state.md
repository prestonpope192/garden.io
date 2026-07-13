# Garden.io Current State

## Purpose

This document is the canonical cold-start summary of the repository as it exists on disk today. It separates implemented surfaces from planned/spec work so future sessions do not overstate what is already built.

## Snapshot

- Repo scope: product specs, a live Next.js website and garden app, Supabase SQL, import scripts, and plant catalog seed data.
- Primary executable surface: [`website/`](../website/).
- Primary local database contract: checked-in SQL under [`supabase/sql/`](../supabase/sql/).
- Primary product intent docs: [`../PRODUCT_SPEC.md`](../PRODUCT_SPEC.md) and [`product/specs/`](product/specs/).
- Latest working-session records: [`handoff/`](handoff/) — July 7, 2026 design audit, the three improvement passes shipped that day (uncommitted on `codex/garden-private-beta-mvp`), and the prioritized backlog with the next-pass prompt.

## What Is Implemented

Based on the checked-in code and tests, the repo currently supports these concrete surfaces:

### Website and marketing

- Landing page at `/` with simple garden-notebook positioning, direct app entry, garden-journal tour entry, and public catalogue entry points.
- Passwordless start/sign-in flow at `/api/auth/magic-link`.
- Public tour routes at `/tour` and `/tour/[view]` for a no-account tour of the working garden flow.
- The `/tour/ask` Today screen opens with a sample garden memory snapshot before the first question, including current garden facts, today care count, the latest note, and a link into the sample garden memory.
- Legacy `/sample-garden` routes remain as redirect-only aliases to `/tour`.

Evidence:
- [`website/app/page.tsx`](../website/app/page.tsx)
- [`website/app/api/auth/magic-link/route.ts`](../website/app/api/auth/magic-link/route.ts)
- [`website/app/tour/page.tsx`](../website/app/tour/page.tsx)
- [`website/app/tour/[view]/page.tsx`](../website/app/tour/[view]/page.tsx)
- [`website/app/sample-garden/page.tsx`](../website/app/sample-garden/page.tsx)
- [`website/app/sample-garden/[view]/page.tsx`](../website/app/sample-garden/[view]/page.tsx)
- [`website/tests/homepage-content.test.ts`](../website/tests/homepage-content.test.ts)
- [`website/tests/auth-magic-link-route.test.ts`](../website/tests/auth-magic-link-route.test.ts)
- [`website/tests/sample-garden.test.ts`](../website/tests/sample-garden.test.ts)
- [`website/e2e/finish-line-polish.spec.ts`](../website/e2e/finish-line-polish.spec.ts)

### Public plant catalogue

- Public catalogue list route at `/catalog`.
- Public detail route at `/catalog/[slug]`.
- Server-side route at `/api/plant-profiles` for profile loading.

Evidence:
- [`website/app/catalog/page.tsx`](../website/app/catalog/page.tsx)
- [`website/app/catalog/[slug]/page.tsx`](../website/app/catalog/[slug]/page.tsx)
- [`website/app/api/plant-profiles/route.ts`](../website/app/api/plant-profiles/route.ts)

### Garden app shell

- `/app` redirects into `/app/my-property`.
- App pages exist for:
  - `Today`
  - `My Garden`
  - `Weekly care`
  - `Plant Journal`
  - `Choose plants`
- `/app/my-property` is the authenticated Today entry by default: users describe what changed or add a photo, then save the useful note or care where it belongs.
- The no-account sample tour uses the same Today interaction model while surfacing sample memory up front so visitors can see what context the assistant has before asking.
- The map-style garden record is available as Garden Memory at `/app/garden-memory`, and `/app/my-property?zone=...&bed=...&plant=...` still opens the map context for deep links.
- The first garden-name screen remains inside the Garden Memory/property view. After a property exists, the first useful setup path is Place -> Bed -> Plant, deriving progress from existing records instead of persisted onboarding state.

Evidence:
- [`website/app/app/page.tsx`](../website/app/app/page.tsx)
- [`website/app/app/my-property/page.tsx`](../website/app/app/my-property/page.tsx)
- [`website/app/app/garden-memory/page.tsx`](../website/app/app/garden-memory/page.tsx)
- [`website/components/views/garden-ask-view.tsx`](../website/components/views/garden-ask-view.tsx)
- [`website/components/views/property-view.tsx`](../website/components/views/property-view.tsx)
- [`website/lib/garden-app-helpers.ts`](../website/lib/garden-app-helpers.ts)
- [`website/app/app/calendar/page.tsx`](../website/app/app/calendar/page.tsx)
- [`website/app/app/my-plants/page.tsx`](../website/app/app/my-plants/page.tsx)
- [`website/app/app/plant-catalogue/page.tsx`](../website/app/app/plant-catalogue/page.tsx)

### Garden notes and learning loop

- Quick notes/photos can be kept with the relevant garden, place, bed, or plant.
- AI plant help uses OpenAI vision, grounded in plant context, with useful answers persistable as observations. Route: `/api/diagnose`.
- Per-plant **planting timeline**: a past -> today -> upcoming arc built by a pure, tested `buildPlantTimeline()` — planting milestone, observations/diagnoses, completed tasks, a "today + lifecycle stage" divider, open tasks, projected harvest, and suggested next actions. Shown both in the property detail drawer and a Timeline tab in Plant Journal.
- Per-planting **outcome capture**: record harvest quantity/quality and a success/partial/failure result; outcomes show on the timeline as harvest milestones. Backed by `garden_plant_outcomes` (migration `43`).
- **History-cited recommendations**: a per-(bed × plant) and per-plant performance memory feeds the suggestion engine, so recommendations cite the grower's real track record ("your X averaged 4.5/5 over 2 harvests — keep doing what works"; or a caution for weak history).

Evidence:
- [`website/lib/garden-timeline.ts`](../website/lib/garden-timeline.ts), [`website/components/plant-timeline.tsx`](../website/components/plant-timeline.tsx)
- [`website/lib/garden-performance.ts`](../website/lib/garden-performance.ts), [`website/lib/garden-suggestions.ts`](../website/lib/garden-suggestions.ts)
- [`website/app/api/diagnose/route.ts`](../website/app/api/diagnose/route.ts)
- SQL migration 43 for `garden_plant_outcomes`
- Tests: [`website/tests/garden-timeline.test.ts`](../website/tests/garden-timeline.test.ts), [`website/tests/garden-performance.test.ts`](../website/tests/garden-performance.test.ts), [`website/tests/garden-suggestions-history.test.ts`](../website/tests/garden-suggestions-history.test.ts)

### Supabase schema and import tooling

- Garden app SQL exists for properties, zones, beds, plants, notes, care, outcomes, and related app records.
- Older SQL filenames may still contain historical launch naming, but the current app surface should be described in user-facing garden language.
- Import helpers exist for starter workbook ingestion and plant-record ingestion.

Evidence:
- SQL migration 20 for the core garden app tables
- [`scripts/import_garden_starter_workbook.py`](../scripts/import_garden_starter_workbook.py)
- [`scripts/import_catalog_plant_records.py`](../scripts/import_catalog_plant_records.py)

## What Is Specified More Broadly Than It Is Implemented

These areas have strong documentation but should not be treated as fully implemented without code-level confirmation:

- the complete multi-module product behavior described in [`product/specs/01-08`](product/specs/01-my-property-interface.md)
- the full service topology and event backbone described in [`product/specs/09-system-architecture-overview.md`](product/specs/09-system-architecture-overview.md)
- the full canonical PostgreSQL architecture described in [`product/specs/10-database-architecture-postgres.md`](product/specs/10-database-architecture-postgres.md)
- broad AI/system/community capabilities described in the higher-level specs

The safe reading order is:

1. confirm the route, script, SQL, or test that exists
2. use the product specs to understand intended direction
3. avoid assuming parity between blueprint docs and current UI/data behavior

## Local Development and Verification

### Website

```bash
cd website
npm install
npm run dev
```

### Docker

```bash
docker compose up --build -d
```

### Tests

```bash
cd website
npm test
```

### Environment

The main website depends on Supabase environment variables for live data and write flows. The canonical variable list is in [`../website/README.md`](../website/README.md).

## Known Constraints and Risks

- The repo currently has substantial unstaged changes. Treat the working tree as active work-in-progress rather than a frozen release snapshot.
- The product specs and SQL architecture are more mature than the repo-level onboarding docs were before this sync, so older sessions may have inferred too much from the spec layer.
- A security review exists, but it is dated 2026-03-09 and should be treated as point-in-time evidence only: [`../security_best_practices_report.md`](../security_best_practices_report.md).
- The public catalogue requires live plant-profile data access; `website/README.md` notes `SUPABASE_DB_URL` as required for live catalogue data.

## Recommended Next Read Depending on Task

- Product framing or audience questions: [`../PRODUCT_SPEC.md`](../PRODUCT_SPEC.md), [`../TARGET_AUDIENCE.md`](../TARGET_AUDIENCE.md)
- Website changes: [`../website/README.md`](../website/README.md)
- Data model or migration work: [`product/specs/10-database-architecture-postgres.md`](product/specs/10-database-architecture-postgres.md), [`../supabase/sql/`](../supabase/sql/)
- Catalog import or curation work: [`catalog/plant-record-population-spec.md`](catalog/plant-record-population-spec.md), [`../scripts/import_catalog_plant_records.py`](../scripts/import_catalog_plant_records.py)
