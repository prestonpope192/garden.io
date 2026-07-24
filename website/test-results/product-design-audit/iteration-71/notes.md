# Iteration 71 - User-Facing Copy And First-Use Cleanup

## Flow Steps Checked

1. Homepage entry
   - Health: healthy by route text and image-source checks.
   - Notes: copy stays focused on remembering what was planted, what changed, and what needs attention. No checked beta, waitlist, prototype, or developer-facing phrases were present.

2. Sample Garden Map
   - Health: healthy by route text checks.
   - Notes: visible garden rail labels remain clear (`2 beds`, `1 bed`) and the map keeps the user focused on areas, beds, plants, notes, tasks, and care history.

3. Sample Plants
   - Health: improved by source and regression tests.
   - Notes: no-selection drawer copy now speaks to gardener intent: choose a plant to see place, history, and next care signal. Removed the developer-facing phrase about "future planting ideas."

4. Signed-out app gate
   - Health: improved by route text and regression tests.
   - Notes: copy now presents a normal secure sign-in link instead of a private/invite-sounding link. The Plant Guide link casing is consistent with the app.

## Screenshot Capture

- In-app Browser navigation worked, but both full-page and viewport screenshot capture timed out before writing accepted image files.
- No screenshot from this iteration should be used as visual evidence.

## Evidence

- Focused content tests passed: `auth-gate-content.test.ts`, `empty-state-content.test.ts`, `homepage-content.test.ts`, and `sample-garden.test.ts` (4 files, 17 tests).
- Full `npm test` passed: 17 files, 77 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Route text scan passed for `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/app/my-property`, and `/catalog`.
- Checked routes had no hits for stale private-link, beta, waitlist, prototype, whole-product, homepage, future-planting, Supabase/config, or old empty-state copy.
- Checked routes had `0` SVG image sources; homepage rendered 4 `plant-art` images, public catalogue rendered 7, sample Plants rendered 4, and sample Plant Guide rendered 3.

## Remaining Limits

- Authenticated signed-in visual QA still needs a real browser screenshot path.
- Keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload remain unverified.
