# Iteration 267 - Sample Garden First-Touch Reliability

Date: 2026-06-23

Scope: audit the first-touch path from homepage CTA to sample garden Ask screen.

## Captured Screens

- `01-homepage.png` - homepage hero and first value section.
- `02-sample-ask.png` - sample garden Ask screen after the route fix.
- `03-auth-gate.png` - signed-out app gate.

## Finding

- The homepage CTA now says `See a sample garden`, so the sample route must open quickly.
- During Browser and `curl` checks, `/sample-garden/ask` was slow because the route waited on `getPlantProfiles()` before rendering.
- That DB-backed dependency made a prospective user's low-commitment sample path feel unreliable, even though the sample garden already has local botanical-plate fallback data.

## Changed

- Removed the database call from `website/app/sample-garden/[view]/page.tsx`.
- The sample garden now renders from `buildDemoGardenSnapshot([])` so it uses local sample data immediately.
- Added a regression test that rejects reintroducing `@/lib/plant-profile-service` or `getPlantProfiles` into the sample view route.

## Evidence

- In-app Browser screenshot capture succeeded for the homepage, sample Ask screen, and auth gate.
- Before the fix, the sample route delayed long enough for Browser navigation and `curl` to exceed normal audit timing.
- After the fix and preview restart, `/sample-garden/ask` returned in 43-78ms across route probes.
- The fixed HTML contains local sample IDs such as `demo-profile-calendula` instead of DB profile IDs.
- Focused `npm test -- sample-garden.test.ts` passed: 1 file, 12 tests.
- Full `npm test` passed: 22 files, 121 tests.
- `npm run build` passed.
- Preview restarted at `http://127.0.0.1:3021`.

## Step Notes

1. Homepage hero: healthy. The sample CTA is clear and visible next to `Start your garden`.
2. Sample Ask screen: healthier after fix. The route now renders quickly from stable local sample data.
3. Signed-out app gate: healthy enough for this pass. It gives a direct email path plus sample/catalogue fallback links.

## Evidence Limits

- This pass verified first-touch sample reliability and screenshots for three entry surfaces.
- It did not audit every authenticated app interaction, successful magic-link delivery, or database-backed catalogue latency.
