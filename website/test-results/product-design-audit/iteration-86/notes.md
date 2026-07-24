# Iteration 86 - Plant Guide wording cleanup

Current-state finding:
- The app/sample Plant Guide was functional and visually calmer, but several labels still sounded like catalogue/database language instead of a gardener-facing guide.
- Remaining examples included `Care snapshot`, `Field notes`, `Primary uses`, `Small garden notes`, `Cultivar differences`, `Catalogue groups`, and accessible `ratings` labels.
- These words appeared in the shared Plant Guide surfaces, so they affected the sample garden, signed-in app guide, public plant guide, and public plant detail page.

Changes implemented:
- Replaced `Care snapshot` with `Care notes` in shared plant cards, public catalogue rows, and public plant detail.
- Replaced accessible `Catalogue groups` with `Plant groups`.
- Replaced card metric accessible labels from `ratings` to `garden fit`.
- Reworded app Plant Guide details:
  - `Field notes` -> `More details`
  - `Primary uses` -> `Best for`
  - `Small garden notes` -> `Small garden fit`
  - `Cultivar differences` -> `Variety notes`
- Reworded metric labels:
  - `Container` -> `Container fit`
  - `Pollinator` -> `Pollinator value`
  - `Care` -> `Care effort`
- Removed a few component comments that preserved the old catalogue framing around the visible surface.

Updated health after implementation:
- Sample Plant Guide: good. It now reads more like a simple care guide and less like a plant database.
- Public Plant Guide: good. Browse/search rows now use `Care notes` instead of `Care snapshot`.
- Public plant detail: good. The same `Care notes` language now carries through to the plant page.
- Accessibility-facing labels: improved. Screen-reader labels now say `Plant groups` and `garden fit` instead of catalogue/ratings language.

Evidence:
- Product Design user-context preflight ran; no saved context exists, so this pass used the current app as source of truth.
- Focused tests passed: `sample-garden.test.ts`, `catalogue-format.test.ts`, and `public-catalogue-content.test.ts`, 3 files, 20 tests.
- Full `npm test` passed: 17 test files, 78 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed.
- Rendered route scan confirmed `/`, `/sample-garden`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, `/app/plant-catalogue`, and `/app/my-property` returned `200`.
- The rendered route scan confirmed new `Care notes` / `garden fit` wording on the relevant Plant Guide and plant detail routes.
- The rendered route scan found no hits for `Care snapshot`, `Field notes`, `Primary uses`, `Small garden notes`, `Cultivar differences`, `Catalogue groups`, old homepage copy, early access, waitlist, working-product language, or product-facing homepage terms.
- Source scan found old guide/homepage phrases only in negative test assertions or non-visible data field names.

Evidence limits:
- No accepted screenshots were captured in this pass. Browser screenshot capture remains unavailable in this environment without using Playwright, and the Product Design skill requires asking before using Playwright as fallback.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
