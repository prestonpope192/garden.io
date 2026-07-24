# Product Design Audit - Iteration 514

Date: 2026-06-24
Scope: align Field Guide actions and click feedback with the new `Plants to try` language.

## Changed

- Changed the signed-in Field Guide helper sentence from `Still deciding? Save it for later.` to `Still deciding? Add it to plants to try.`
- Changed the Field Guide button from `Save for later` to `Add to plants to try`.
- Changed plant-idea mutation feedback from `Saved for later.` / `Removed from saved plants.` to `Added to plants to try.` / `Removed from plants to try.`
- Changed sample garden preview prompts that referenced saved plants to plants-to-try language.
- Added/updated tests to require the new CTA and toast copy and reject the old saved/idea phrasing.

## Evidence

- Used orchestratror-mode, Product Design critical overrides, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source scan confirms the old visible phrases now only appear as negative regression guards.
- Focused tests passed from the website package: `catalogue-format.test.ts`, `garden-mutation-copy.test.ts`, `sample-garden.test.ts`, `empty-state-content.test.ts`, `ai-first-garden-home.test.tsx`, and `homepage-content.test.ts` - 6 files, 44 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not available. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used source/test verification before broader checks.
