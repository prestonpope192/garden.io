# Product Design Audit Iteration 192

Scope: tighten prospective-user copy around plant fit, plant checks, and the app's remembered history.

## Change

- Homepage catalogue CTA: `Explore plants` -> `Find plants that fit`.
- Auth gate catalogue fallback CTA: `Explore plants` -> `Find plants that fit`.
- Auth unavailable message: `browse plants` -> `find plants that fit`.
- Homepage AI-adjacent promise: `Get help when something looks off` -> `Check a plant with its history`.
- Homepage plant-check support copy now says the check starts with notes, bed, photo, and season.
- Garden Map mixed timeline label: `Care history` -> `Notes and care`.

## Rationale

- `Find plants that fit` explains the catalogue's user value faster than a generic browse action.
- `Check a plant with its history` sells the AI-supported workflow in user terms without making the page sound like it is pitching infrastructure.
- `Notes and care` better describes the mixed record users review in the drawer: notes, care tasks, photos, and history.

## Verification

- Focused copy tests passed from `website/`: `homepage-content.test.ts`, `auth-gate-content.test.ts`, and `empty-state-content.test.ts`; 3 files, 12 tests.
- Full `npm test` passed from `website/`: 18 files, 93 tests.
- `npm run build` passed from `website/`.
- `git diff --check` passed from the repo root.
- Local route checks all returned 200:
  - `/`
  - `/app`
  - `/sample-garden/plants`
  - `/sample-garden/property`
  - `/catalog`
- Rendered homepage HTML contained:
  - `Find plants that fit`
  - `Check a plant with its history`
  - `When leaves yellow or pests show up`
  - Supabase `plant-art` image URLs for real plant photos
- Rendered app auth gate contained:
  - `Start with what you already have.`
  - `Find plants that fit`
- Rendered sample plants page contained:
  - `My Plants`
  - `Choose a plant to see its notes, photos, and next care.`

## Evidence Limits

- The Product Design Browser/Chrome capture tools were not exposed in this thread. No Playwright screenshot pass was run because the Product Design workflow requires approval before using Playwright directly.
- Current proof is source inspection, component/server-rendered tests, production build, route checks, and rendered HTML probes.
- Authenticated signed-in visual QA, keyboard behavior, screen-reader behavior, magic-link delivery, and photo upload still need a reliable browser-backed pass.
