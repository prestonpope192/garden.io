# Iteration 286 - User-Facing Journal Copy

Date: 2026-06-24
Preview: http://127.0.0.1:3021

## Objective

Tighten the public and in-app copy around the simpler "Your garden, smarter" promise, while keeping the product in the gardening-journal style rather than a developer-facing product explanation or generic task tracker.

## Audit Scope

- Homepage hero promise and support line.
- Signed-in/sample ask surface.
- Shared app shell tagline.
- My Plants and This Week empty states.
- Rendered homepage and sample ask route.

## Finding

The old "Ask your garden" / "Know what to do next" language was too abstract and sounded like a feature label. The better direction is a plain user benefit: keep a simple garden journal, add notes/photos, and get help understanding what changed, what matters, and what to do next.

## Changes

- Homepage now leads with "Your garden, smarter." and explains the value in one sentence.
- Ask surface now uses the same "Your garden, smarter" label and starts with a plain garden-journal action: write down what you notice, add a photo if helpful, and save one useful note to the right plant or bed.
- Shared app shell tagline now says: "Keep your plants, notes, photos, and care history in one garden journal."
- My Plants empty state now points to keeping notes, photos, and care history together.
- This Week empty states now talk about care notes, watering, pruning, and harvest notes instead of "next steps" or task-list language.

## Proof

- Focused tests passed: `empty-state-content.test.ts` and `sample-garden.test.ts` - 2 files, 21 tests.
- Full `npm test` passed: 23 files, 128 tests.
- `npm run build` passed.
- `git diff --check` passed after note updates.
- Preview is running at `http://127.0.0.1:3021`.
- Rendered homepage contains "Your garden, smarter." and "Start with one plant. Every note makes the garden a little smarter."
- Rendered sample ask route contains "Your garden, smarter" and the journal-first ask lead.

## Evidence Limit

The empty-state copy is covered by component rendering tests because the sample garden data does not naturally show every empty state. Browser screenshot capture was not used in this pass.
