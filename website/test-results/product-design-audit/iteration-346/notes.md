# Iteration 346 - Field Guide Copy Cleanup

## Audit Scope

- Surface: signed-in/sample Field Guide cards.
- User goal: compare plants by what spot they need, what care to expect, and what to watch after planting.
- Accessibility target: keep the current card order, search/filter controls, links, and actions intact while making accessible labels more gardener-facing.

## Strengths

- The Field Guide already prioritizes plant names, photos, light, water, and watch notes.
- Sample/read-only mode already hides add/save actions that do not work in the sample garden.
- The card layout supports quick scanning before longer field notes.

## UX Risks Found

- `quick fit` and `garden fit` made the experience sound like internal scoring or product matching.
- `Care effort` framed maintenance as an abstract rating instead of plain garden care.
- `Small garden fit` repeated the same matching language in expanded notes.

## Changes Made

- Replaced `quick fit` with `planting notes`.
- Replaced `garden fit` with `planting basics`.
- Replaced `Care effort` with `Care needs`.
- Replaced `Container fit` and `Pollinator value` with `Containers` and `Pollinators`.
- Replaced `Small garden fit` with `Small garden notes`.
- Updated regression tests so the older fit/scoring terms do not return.

## Evidence

- Source inspected and changed: `website/components/views/catalogue-view.tsx`.
- Tests updated: `website/tests/sample-garden.test.ts`, `website/tests/catalogue-format.test.ts`, `website/tests/app-flow-visual-css.test.ts`.
- Focused tests passed from the website package: `catalogue-format.test.ts`, `sample-garden.test.ts`, and `app-flow-visual-css.test.ts` - 3 files, 35 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/catalogue` contains the new `planting notes` wording and does not contain the old fit/scoring phrases.
- Live `/catalog` visible body text contains no beta/private-beta/waitlist language; the raw `beta` string is botanical data for `Beta vulgaris`.

## Evidence Limits

- Browser screenshot capture was not available in this session. Browser/Chrome capture tools were not exposed, Codex app capture is blocked by safety policy, and Playwright fallback requires explicit permission under Product Design rules.
