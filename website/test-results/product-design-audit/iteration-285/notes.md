# Iteration 285 - Homepage Plate Presentation

## Objective

Continue the simplification pass by checking whether the homepage plant imagery matches the gardening-journal direction instead of feeling like generic full-color garden photography.

## Audit Scope

- Homepage hero and featured plant imagery.
- Local asset inspection for current homepage plant-art choices: Apple, Bay Leaf, Bell Pepper, Calendula, and Cilantro.
- CSS inspection for homepage image presentation.

## Finding

- Health before this pass: partly aligned.
- The homepage image assets are botanical plates from the `plant-art` bucket, not ordinary full-color garden snapshots.
- The hero slot still treated the Apple plate like a cropped photo with `object-fit: cover`, which can cut off plate details and make the surface feel less like a journal/specimen page.
- Plant cards were already using `object-fit: contain`, so the inconsistency was mostly the hero.

## Changes

- Changed `.home-hero__photo` from `object-fit: cover` to `object-fit: contain`.
- Added a paper-toned background and inset padding to `.home-hero__media` so botanical plates read as placed on a page instead of cropped into a photo frame.
- Added border radius and a soft paper background to the hero image itself.
- Updated `homepage-visual-css.test.ts` to guard the contained/centered botanical plate presentation.

## Proof

- Downloaded and inspected current candidate assets in `iteration-285/assets/`; Apple, Bay Leaf, Bell Pepper, Calendula, and Cilantro are botanical plates.
- Focused tests passed: `homepage-visual-css.test.ts`, `homepage-content.test.ts`, and `app-flow-visual-css.test.ts` - 3 files, 16 tests.
- `npm run build` passed.
- Full `npm test` passed: 23 files, 128 tests.
- `git diff --check` passed.
- Preview restarted at `http://127.0.0.1:3021`.
- Live HTML check confirmed the homepage renders the Apple `plant-art` image in the hero.

## Evidence Limit

- Browser screenshot capture was still unavailable in this shell. This pass used local image inspection, CSS/source inspection, rendered HTML, tests, and build output.

## Remaining

- When browser screenshot capture is available, visually compare the homepage hero on mobile and desktop to confirm the plate is framed cleanly behind the note panel.
