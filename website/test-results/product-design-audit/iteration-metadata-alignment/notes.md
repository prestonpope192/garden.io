# Metadata Alignment Pass

Date: 2026-06-24

## Scope

- Browser/share metadata for `/`
- Homepage metadata regression coverage

## Current-state Finding

- The visible homepage, auth gate, and Today flow had already moved to the clearer promise:
  `Save what you notice. Get care advice that remembers your plants.`
- The root metadata still used the older copy:
  `Track changes, ask what they mean, and keep useful answers with the right plant.`
- That mismatch could show stale language in browser previews, search snippets, and social cards even when the homepage itself looked cleaned up.

## Changes Implemented

- Updated `website/app/layout.tsx` metadata description, Open Graph description, and Twitter description to the same promise used in the visible hero.
- Updated `website/tests/homepage-content.test.ts` so metadata must stay aligned with the visible promise and must not regress to the older phrase.

## Rendered Metadata Evidence

Checked `http://127.0.0.1:3021/` in the in-app browser:

- Title: `Garden.io | Your Garden, Smarter`
- Meta description: `Save what you notice. Get care advice that remembers your plants.`
- Open Graph title: `Garden.io | Your Garden, Smarter`
- Open Graph description: `Save what you notice. Get care advice that remembers your plants.`
- Twitter title: `Garden.io | Your Garden, Smarter`
- Twitter description: `Save what you notice. Get care advice that remembers your plants.`
- Old promise found in head: no
- Old promise found in body: no
- Horizontal overflow: 0

## Verification

- Focused metadata/content test passed: `homepage-content.test.ts`, 5 tests.
- Full `npm test` passed: 24 files, 135 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Remaining Limits

- This pass did not verify external search/social cache refresh behavior; it only proves the current rendered app output.
- Authenticated live-data states, magic-link delivery, photo upload, and screen-reader behavior remain outside this pass.
