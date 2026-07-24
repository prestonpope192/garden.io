# Iteration 294 - Notebook Copy Pass

Date: 2026-06-23
Preview: http://127.0.0.1:3021

## Goal

Move the homepage, signed-out entry, and Ask surface closer to the living botanical notebook direction without adding new structure.

## What Changed

- Homepage hero now says "A calm garden notebook..." instead of repeating the longer "simple garden journal" promise.
- Homepage secondary line now says "Start with one plant. Add notes as the season unfolds."
- Homepage sample CTA changed to "Tour a garden."
- Hero annotation changed from "Garden note" to "Field note."
- "How it helps" copy now uses notebook/care language:
  - "A garden notebook that remembers with you."
  - "Every note, photo, and harvest makes later care easier."
- Tracking loop copy now says "Save what happened" and avoids generic future-guidance phrasing.
- Signed-out entry screen uses the same calm notebook promise and "Tour a garden" CTA.
- Ask surface now says help uses what is "already saved," the garden has "more context," and saved notes help "the next visit."
- Setup feedback changed from "Add the first X next" to:
  - "Now add a place to grow."
  - "Now add a bed."
  - "Now add a plant."
- Sample tour answer copy now says "saved garden notes" instead of "sample garden notes."

## Image Check

- Downloaded and inspected the current homepage hero image from the `plant-art` bucket.
- The apple image is a botanical plate-style illustration, not an ordinary full-color garden snapshot.
- Asset copy and tests continue to prefer `plant-art` images over ordinary photos.
- Inspected asset saved at `iteration-294/assets/apple.jpg`.

## Evidence

- Product Design user-context preflight ran; no saved product/design entries were available.
- Product Design critical overrides were reread during the pass.
- Memory and repo docs were checked: `docs/current-state.md` and `docs/product/specs/07-style-and-branding.md`.
- Focused tests passed: `homepage-content.test.ts`, `auth-gate-content.test.ts`, `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, `garden-mutation-copy.test.ts`, and `empty-state-content.test.ts` - 6 files, 33 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- App/component source scan found no matches for the old public phrases targeted in this pass.
- Preview restarted at `http://127.0.0.1:3021`.
- Rendered homepage contains "A calm garden notebook," "Tour a garden," "Field note," and "A living notebook for your garden."
- Rendered sample Ask route contains "already saved," "more context," "next visit," "Add a photo," and "Beds, plants, and notes together."
- Rendered signed-out app entry contains "A calm garden notebook" and "Tour a garden."

## Limit

Browser screenshot capture was not used. Browser/Chrome audit tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Target

Run a visual spacing pass when screenshot capture is available, especially homepage first viewport, mobile wrapping, and whether every showcased plant image feels like botanical notebook material.
