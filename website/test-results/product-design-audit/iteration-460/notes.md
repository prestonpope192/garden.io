# Iteration 460 - My Garden Next Care Copy

Date: 2026-06-24

Surface focus:
- Sample garden My Garden route
- Authenticated My Garden default drawer copy

## Scope

Make the My Garden drawer keep the next care action primary, while making plant notes available as supporting context instead of the main message.

## Changes

- Changed the next-task drawer copy from `Open Bell Pepper to see what happened there.` to `Start with care for Bell Pepper. Open the plant if you need its notes.`
- Changed bed/area/garden next-task fallbacks to start with care in the relevant place.
- Changed the no-care fallback from `Open a bed or plant to see what happened there.` to `Open a bed or plant when you want its notes.`
- Updated sample-garden tests to protect the new care-first drawer wording and keep the older abstract copy out.

## Evidence

- Live `/sample-garden/property` route-output probe found `My Garden`, `This week`, `Water deeply before the hot afternoon`, and `4 plants in 3 beds. Start with care for Bell Pepper. Open the plant if you need its notes.`
- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus focused test verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
