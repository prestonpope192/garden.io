# Iteration 570 final broad simplification pass

Scope: third and final broad pass requested for this round, focused on remaining app/public catalogue language and plant imagery consistency after the homepage simplification work.

Changed:
- Replaced the remaining primary `Field Guide` app/navigation language with `Choose plants` in the signed-in app shell, sample/tour app shell, public catalogue, and public plant detail page.
- Kept `Plant Journal` for saved plants because it fits the garden notebook direction, while making the plant-selection action plain and fast to understand.
- Changed the empty signed-in catalogue state from `No plants in the field guide yet.` to `No plants to choose from yet.`
- Changed the plant drawer toggle from `Hide field guide` to `Hide plant choices`.
- Increased the actual public catalogue and signed-in catalogue search input minimum height to 44px so the visible input no longer measures as a compressed target.
- Updated tests to protect the simpler user-facing language and reject old `Field Guide` copy in rendered app/home/catalogue surfaces.

Evidence:
- Screenshots saved in this folder:
  - `after-home.png`
  - `after-calendar.png`
  - `after-tour-catalogue.png`
  - `after-tour-plants.png`
  - `after-ask.png`
  - `after-public-catalogue.png`
  - `after-plant-detail-borage.png`
- Route summaries saved in:
  - `before-summary.json`
  - `after-summary.json`
  - `after-plant-detail-borage.json`
- Browser capture confirmed no horizontal overflow on checked routes.
- Browser capture confirmed `Field Guide`/`field guide` was absent from checked rendered screens.
- Browser capture confirmed checked image sources used loaded `plant-art` images with zero SVG image sources.
- The public catalogue input no longer appeared in the small-control scan after adding the input min-height.

Verification:
- Focused content/CSS tests passed: 7 files, 64 tests.
- Focused public/catalogue retest passed: 4 files, 40 tests.
- Full `npm test` passed: 24 files, 133 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- This completes the user's requested maximum of three additional large sweeping passes for this round. The active long-running clean/simple app goal should remain open because a full signed-in keyboard/a11y pass and deeper production-data states have not been completed.
