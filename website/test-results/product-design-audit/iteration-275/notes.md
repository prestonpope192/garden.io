# Iteration 275 Product Design Audit

Scope: keep public and sample plant imagery aligned with the garden-journal / botanical-notebook style instead of drifting back toward ordinary full-color plant photos.

Audit mode: visual review of current rendered plant surfaces, image-source inspection, focused code hardening, regression tests, full test suite, production build, Chrome-rendered image checks, and screenshot capture.

Captured screens:
- `01-public-catalogue-before.png` - public catalogue before this pass.
- `02-sample-catalogue-before.png` - sample garden catalogue before this pass.
- `03-sample-plants-before.png` - sample garden plants list before this pass.
- `04-public-catalogue-after.png` - public catalogue after the image-selection hardening.
- `05-sample-catalogue-after.png` - sample garden catalogue after the image-selection hardening.
- `06-sample-plants-after.png` - sample garden plants list after the image-selection hardening.

Finding:
- The current visible plant surfaces already mostly used botanical plates, which fits the journal style.
- The selection logic was still too broad: any non-SVG image counted as a good featured/demo image.
- That left the homepage/sample/catalogue defaults vulnerable to drifting back toward ordinary garden photos when database rows changed.

Changed:
- Added `getJournalStylePlantImageUrl()` for image URLs that pass the existing real-image filter and come from the curated `plant-art` bucket.
- Updated sample garden profile selection to prefer journal-style plant art for the first sample plants, falling back to bundled botanical plate profiles before ordinary photos.
- Updated public catalogue highlighting to prefer journal-style plant art before ordinary photos.
- Updated catalogue broad sorting so journal-style images rank before ordinary image-backed rows, then no-image rows.
- Added regression tests for journal-style image preference in broad catalogue sorting, public catalogue highlighting, and sample garden construction.

Evidence:
- Focused tests passed: `catalogue-format.test.ts`, `public-catalogue-content.test.ts`, `sample-garden.test.ts`, and `homepage-content.test.ts` - 4 files, 39 tests.
- Full `npm test` passed: 23 files, 127 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Chrome-rendered image checks passed for `/catalog`, `/sample-garden/catalogue`, and `/sample-garden/plants`.
- Rendered checks confirmed those routes use `plant-art` images first and no visible image sources include `/art/specimen-`, `.svg`, or ordinary `example.com` photo URLs.
- Preview restarted at `http://127.0.0.1:3021`.

Evidence limits:
- This pass verifies the first public/sample plant surfaces and image-selection logic, not every possible searched/filtered plant row in the 988-profile catalogue.
- The helper currently treats the curated `plant-art` bucket as the journal-style source. If later uploads mix ordinary photos into that bucket, the bucket taxonomy will need a more explicit style flag.
