# Iteration 85 - homepage copy and entry clarity

Current-state finding:
- The homepage was already far simpler than the original marketing page, but a few phrases still described the app from a builder/product perspective instead of a gardener perspective.
- Remaining examples included `Garden tracking example`, `Plant memory`, `Every plant gets its own living history`, and an AI sentence that centered the system instead of the user's garden.
- The signed-out entry page linked to `Browse Plant Guide`, while the homepage used `Explore plants`; the inconsistency made the entry flow feel less polished.

Changes implemented:
- Rewrote the homepage loop around direct user needs:
  - `Know what is where`
  - `Save what happened`
  - `Get a useful next step`
- Replaced the old AI copy with `AI can use your notes, timing, and weather so advice fits your garden.`
- Reframed the main explanation as `One place for what you planted, what happened, and what comes next.`
- Replaced `Plant memory` / `living history` with `Your plants` and `See the full story of each plant.`
- Replaced the hero media label `Garden tracking example` with a concrete plant note label.
- Tightened plant-card notes so they explain remembered value for each real photo-backed plant.
- Updated site metadata to the same simple promise: `Remember what you planted, what happened, and what needs attention next.`
- Updated the signed-out auth gate's plant link to `Explore plants` for consistency with the homepage.

Updated health after implementation:
- Homepage hero: good. It still presents Garden.io in under three seconds: remember what was planted, where it is, and what needs attention next.
- Homepage explanation loop: good. The three-step sequence is now simpler and user-facing.
- Homepage plant showcase: good. It uses real plant photos from the Supabase-backed `plant-art` URLs and no SVG specimen art.
- App entry/sign-in gate: good. The fallback links now match the public homepage's language.

Evidence:
- Product Design user-context preflight ran; no saved context exists, so this pass used the current app as source of truth.
- Focused tests passed: `homepage-content.test.ts`, `auth-gate-content.test.ts`, and `sample-garden.test.ts`, 3 files, 14 tests.
- Full `npm test` passed: 17 test files, 78 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed.
- Rendered route scan confirmed `/`, `/sample-garden`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, and `/app/my-property` returned `200`.
- The rendered route scan found no hits for old homepage/product-facing phrases including `Garden tracking example`, `Plant memory`, `Every plant gets its own living history`, `Let AI use your own garden history`, `Working product`, `whole product`, `early access`, `Waitlist`, `Start tracking`, `Garden tracking preview`, `the product`, `product is`, `product has`, `product can`, `front door`, or `homepage`.

Evidence limits:
- No accepted screenshots were captured in this pass. The Browser tool was not available through tool discovery, Chrome app-state capture failed with `cgWindowNotFound`, and a macOS screenshot attempt captured the OS lock screen instead of the app, so it was rejected and removed.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
