# Iteration 260 - Hero And Ask Copy

Date: 2026-06-23
Preview: http://127.0.0.1:3021

## Scope

Tighten the homepage and ask-entry copy around the user phrase `Your garden, smarter.` and remove remaining product-facing phrasing from the first moments of the experience.

## Accepted Screenshots

- `screenshots/01-homepage-current-mobile.png` - homepage before the final copy tune, already showing the newer headline.
- `screenshots/02-ask-current-mobile.png` - ask entry before the final copy tune.
- `screenshots/03-homepage-after-mobile.png` - homepage after the copy tune.
- `screenshots/04-ask-after-mobile.png` - ask entry after the copy tune.

## Finding

The stale `Know what to do next` headline was already gone from source and from the rebuilt preview. The remaining issue was subtler: the supporting copy still described what Garden.io does instead of speaking plainly to the gardener.

## Changed

- Kept the homepage and app promise as `Your garden, smarter.`
- Rewrote the homepage lead to focus on adding a note/photo and getting help with garden context already in place.
- Rewrote the homepage support note as a garden journal that can answer back.
- Rewrote the signed-out start screen lead to match the same user-facing promise.
- Rewrote the ask-entry lead to explain the useful answer without internal system language.
- Updated content regression tests for the homepage, auth gate, AI-first ask view, and sample garden.

## Result

The first mobile viewport now sells one simple idea: save a little garden context, then get more useful answers. It no longer starts with `Know what to do next`, `Ask your garden`, or `Garden.io remembers...`.

## Evidence

- Live DOM check at `http://127.0.0.1:3021/` confirmed the headline is `Your garden, smarter.` and the stale copy is absent.
- Live DOM check at `http://127.0.0.1:3021/sample-garden/ask` confirmed the ask label is `Your garden, smarter` and the old ask-copy is absent.
- Focused tests passed: `homepage-content.test.ts`, `auth-gate-content.test.ts`, `ai-first-garden-home.test.tsx`, and `sample-garden.test.ts`, 4 files, 21 tests.
- Full `npm test` passed: 22 files, 120 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limits

This pass only tuned copy. It did not change the homepage plant art/photo selection or deeper sample-garden interaction model.
