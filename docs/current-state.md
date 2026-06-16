# Garden.io Current State

## Purpose

This document is the canonical cold-start summary of the repository as it exists on disk today. It separates implemented surfaces from planned/spec work so future sessions do not overstate what is already built.

## Snapshot

- Repo scope: product specs, a live Next.js website/prototype app, Supabase SQL, import scripts, and plant catalog seed data.
- Primary executable surface: [`website/`](../website/).
- Primary local database contract: checked-in SQL under [`supabase/sql/`](../supabase/sql/).
- Primary product intent docs: [`../PRODUCT_SPEC.md`](../PRODUCT_SPEC.md) and [`product/specs/`](product/specs/).

## What Is Implemented

Based on the checked-in code and tests, the repo currently supports these concrete surfaces:

### Website and marketing

- Landing page at `/` with product positioning, audience framing, catalogue entry points, and waitlist CTA.
- Waitlist API at `/api/waitlist` with tests covering success, validation failure, and repeated-submission rate limiting.
- Optional welcome-email behavior through Resend or Supabase OTP fallback, depending on environment configuration.

Evidence:
- [`website/app/page.tsx`](../website/app/page.tsx)
- [`website/app/api/waitlist/route.ts`](../website/app/api/waitlist/route.ts)
- [`website/tests/homepage-content.test.ts`](../website/tests/homepage-content.test.ts)
- [`website/tests/waitlist-route.test.ts`](../website/tests/waitlist-route.test.ts)

### Public plant catalogue

- Public catalogue list route at `/catalog`.
- Public detail route at `/catalog/[slug]`.
- Server-side route at `/api/plant-profiles` for profile loading.

Evidence:
- [`website/app/catalog/page.tsx`](../website/app/catalog/page.tsx)
- [`website/app/catalog/[slug]/page.tsx`](../website/app/catalog/[slug]/page.tsx)
- [`website/app/api/plant-profiles/route.ts`](../website/app/api/plant-profiles/route.ts)

### Prototype authenticated app shell

- `/app` redirects into `/app/my-property`.
- Prototype pages exist for:
  - `My Property`
  - `Calendar`
  - `My Plants`
  - `Plant Catalogue`
- These routes are present in the website app and should be treated as prototype/private-beta surfaces, not confirmed production-complete modules.

Evidence:
- [`website/app/app/page.tsx`](../website/app/app/page.tsx)
- [`website/app/app/my-property/page.tsx`](../website/app/app/my-property/page.tsx)
- [`website/app/app/calendar/page.tsx`](../website/app/app/calendar/page.tsx)
- [`website/app/app/my-plants/page.tsx`](../website/app/app/my-plants/page.tsx)
- [`website/app/app/plant-catalogue/page.tsx`](../website/app/app/plant-catalogue/page.tsx)

### AI assistance and the personal learning loop (Phase 3)

- Frictionless capture + visible memory: quick-log notes/photos and a per-context Care timeline (Phase 3A).
- AI observation & diagnosis assistant over OpenAI vision, grounded in plant context, with results persistable as observations (Phase 3B). Route: `/api/diagnose`.
- Per-plant **planting timeline** (Phase 3C Slice 1): a past → today → upcoming arc built by a pure, tested `buildPlantTimeline()` — planting milestone, observations/diagnoses, completed tasks, a "today + lifecycle stage" divider, open tasks, projected harvest, and suggested next actions (one-tap to commit). Shown both in the property detail drawer and a Timeline tab in My Plants.
- Per-planting **outcome capture** (Phase 3C Slice 2): record harvest quantity/quality and a success/partial/failure result; outcomes show on the timeline as harvest milestones. Backed by `garden_plant_outcomes` (migration `43`).
- **History-cited recommendations** (Phase 3C Slice 3): a per-(bed × plant) and per-plant performance memory feeds the suggestion engine, so recommendations cite the grower's real track record ("your X averaged 4.5/5 over 2 harvests — keep doing what works"; or a caution for weak history).

Evidence:
- [`website/lib/garden-timeline.ts`](../website/lib/garden-timeline.ts), [`website/components/plant-timeline.tsx`](../website/components/plant-timeline.tsx)
- [`website/lib/garden-performance.ts`](../website/lib/garden-performance.ts), [`website/lib/garden-suggestions.ts`](../website/lib/garden-suggestions.ts)
- [`website/app/api/diagnose/route.ts`](../website/app/api/diagnose/route.ts)
- [`supabase/sql/43-private-beta-plant-outcomes.sql`](../supabase/sql/43-private-beta-plant-outcomes.sql)
- Tests: [`website/tests/garden-timeline.test.ts`](../website/tests/garden-timeline.test.ts), [`website/tests/garden-performance.test.ts`](../website/tests/garden-performance.test.ts), [`website/tests/garden-suggestions-history.test.ts`](../website/tests/garden-suggestions-history.test.ts)

### Supabase schema and import tooling

- Waitlist SQL exists for the public signup workflow.
- A larger private-beta MVP schema exists, followed by additional additive SQL files.
- Import helpers exist for starter workbook ingestion and plant-record ingestion.

Evidence:
- [`website/supabase/waitlist.sql`](../website/supabase/waitlist.sql)
- [`supabase/sql/20-private-beta-mvp.sql`](../supabase/sql/20-private-beta-mvp.sql)
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
