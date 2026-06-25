# Iteration 284 - Journal-First Ask Surface

## Objective

Continue simplifying Garden.io while preserving the living botanical notebook direction. This pass focused on the AI-first ask surface, which was functionally simple but still described itself too much like an AI tool.

## Audit Scope

- `/sample-garden/ask` rendered from the production preview at `http://127.0.0.1:3021`.
- Signed-out `/app/my-property` auth gate, to confirm the app route still opens cleanly for prospective users.
- Source grounding from `docs/current-state.md`, `docs/product/specs/07-style-and-branding.md`, and `docs/ai-first-selah-style-simplification-scope.md`.

## Finding

- Health before this pass: usable, but slightly off-brand.
- The ask surface already had the right structure: one calm prompt, photo support, no persistent module tabs, and memory views as secondary links.
- The copy still centered "Garden.io uses your plant records..." which made the screen feel like generic AI guidance rather than a field journal with marginal guidance.

## Changes

- Replaced the lead copy with: "Write down what you notice. Add a photo if it helps, then get one useful note you can save to the right plant or bed."
- Added a small marginalia line: "In the margins: your plants, beds, notes, weather, and season."
- Changed the helper hint to "Save what matters so the garden remembers what happened."
- Reframed the no-garden setup panel from "Start the garden map" to "Give one plant a place" / "Add your first plant."
- Renamed the secondary shortcut from "Open garden map" to "Garden memory."
- Added CSS for `.garden-ai-memory-note` using the existing script font and dotted marginalia treatment.

## Proof

- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, and `mobile-layout-css.test.ts` - 3 files, 20 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Full `npm test` passed: 23 files, 128 tests.
- Preview restarted at `http://127.0.0.1:3021`.
- Live HTML checks confirmed the updated sample ask copy and stale "Garden.io uses your plant records" copy was absent from rendered `/sample-garden/ask`.

## Evidence Limit

- Browser/Chrome screenshot tooling was not available in this shell, and no local screenshot utility suitable for page capture was installed. This iteration used rendered HTML, source inspection, and automated tests rather than accepted Product Design screenshots.

## Remaining

- Continue visual QA when browser screenshot capture is available.
- The broader goal remains active: the app is simpler, but not yet fully audited as a complete end-to-end product experience.
