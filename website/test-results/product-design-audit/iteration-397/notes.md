# Iteration 397 Notes

Scope: use orchestratror-mode to simplify remaining homepage/app copy and align showcase imagery with the gardening-journal field-guide style.

Changed:
- Swapped homepage showcase plants from the brighter Calendula/Cilantro/Bell Pepper set to Apple, Borage, and Bouquet Dill botanical plate images from the existing Supabase `plant-art` bucket.
- Updated the homepage hero plate note to read like a gardener's record: `Note the bloom date once. Compare fruit set and harvest later.`
- Changed sample garden fallback plants to Borage, Bouquet Dill, and Bell Pepper so the demo app uses calmer botanical plates when live catalogue data is unavailable.
- Changed the public catalogue featured-slug preference to Apple, Borage, Bouquet Dill, then Bell Pepper.
- Changed the auth unavailable message from `We can't open garden questions right now.` to `We can't open your garden right now.`
- Changed the signed-in catalogue empty state from `No plants are ready yet.` to `No plants in the field guide yet.`
- Changed malformed diagnosis request copy from `Invalid request.` to `Add what changed or a photo, then try again.`
- Updated tests to lock the new plant set and reject the old developer/product-facing copy.

Evidence:
- Used Product Design audit critical overrides, session-budget guidance, Garden.io memory, and orchestratror-mode.
- Delegated a read-only explorer scan for remaining developer-facing/beta/internal-mechanic copy; it returned three high-confidence copy issues, all patched.
- Queried the live catalogue image metadata for public `plant-art` entries and visually inspected Apple, Borage, Bouquet Dill, and Bell Pepper candidates before using them.
- Focused tests passed from the website package: `homepage-content.test.ts`, `auth-gate-content.test.ts`, `catalogue-format.test.ts`, `public-catalogue-content.test.ts`, `sample-garden.test.ts`, and `diagnose-route-copy.test.ts` - 6 files, 43 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/` returned `200` and contains `Your garden, smarter.`, `plant-art%2Fapple.jpg`, `plant-art%2Fborage.jpg`, and `plant-art%2Fbouquet-dill.jpg`; it does not contain `plant-art%2Fcalendula.jpg`, `plant-art%2Fcilantro.jpg`, `Know what to do next`, `early access`, or `Working product`.
- Live `/sample-garden/plants` returned `200` and contains Borage, Bouquet Dill, Bell Pepper, and `Harvest dill before afternoon heat`; it does not contain `Harvest cilantro before afternoon heat`.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
