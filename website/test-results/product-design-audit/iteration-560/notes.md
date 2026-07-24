# Iteration 560 Rendered Audit Notes

Date: 2026-06-24
Surface: Garden.io homepage and sample garden flow
Task type: QA audit plus one targeted visual fix

## Scope

After completing the user's capped three broad implementation passes, verify the current rendered experience instead of starting another sweep. Captured the core user-facing path in the in-app browser:

1. Homepage
2. Sample Ask
3. Sample My Garden
4. Sample Plant Journal
5. Sample Weekly Care
6. Sample Field Guide

Screenshots were saved in this folder:

- `01-homepage.png`
- `02-sample-ask.png`
- `03-sample-property.png`
- `04-sample-plants.png`
- `04-sample-plants-after-wait.png`
- `04-sample-plants-after-thumb-fix.png`
- `05-sample-calendar.png`
- `06-sample-field-guide.png`

## Findings

### Strengths

- Homepage gives the simple promise quickly: `Your garden, smarter.`
- Homepage uses journal-style plant-art images from the Supabase `plant-art` bucket, not old SVG placeholders.
- Sample Ask focuses on the user's immediate action: add what changed, keep what helped.
- My Garden, Plant Journal, Weekly Care, and Field Guide now read as gardener tasks instead of product/database modules.
- Sample app navigation uses `Today`, `Start your garden`, and direct route links without exposing beta or developer language.
- Field Guide cards show journal-style botanical plates for Bell Pepper, Borage, and Bouquet Dill.

### UX Issue Fixed

- The first Plant Journal thumbnail for Bell Pepper was technically loaded but visually read like a blank dotted image slot at normal screenshot scale.
- Changed the thumbnail image treatment from washed-out filtering to `saturate(1.04) contrast(1.08)` so small botanical plates remain inspectable.
- Added a CSS regression assertion in `app-flow-visual-css.test.ts`.

### Accessibility Risks

- Screenshot review cannot prove keyboard order, focus rings, screen reader grouping, or contrast compliance.
- The rendered screenshots suggest large headings and controls are readable at desktop size, but this pass did not perform a mobile screenshot sweep or keyboard traversal.
- Plant images have useful alt text in the rendered DOM evidence; decorative/background visual treatment still needs screen-reader validation in a separate accessibility pass.

## Verification

- Browser screenshots captured and inspected from the local app at `http://127.0.0.1:3021`.
- Focused tests passed from `website`: 2 files, 23 tests.
- Full `npm test` passed from `website`: 23 files, 131 tests.
- `npm run build` passed from `website`.
- `git diff --check` passed.

## Remaining Uncertainty

The app is materially cleaner and simpler, but the overall goal remains broad. Completion should not be claimed until a dedicated mobile + keyboard/accessibility pass verifies the same clarity across responsive states and interaction paths.
