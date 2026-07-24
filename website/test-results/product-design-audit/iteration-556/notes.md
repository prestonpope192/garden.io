# Iteration 556 Notes

Date: 2026-06-24

Scope: broaden sample and Ask note-keeping copy so note destinations do not imply everything belongs only with one plant.

Changed:
- Changed the Ask save-disabled hint from `Start your garden to keep notes with the right plant.` to `Start your garden to keep notes where they belong.`
- Changed sample preview save notices for observations and quick logs from `keep this note with the right plant` to `keep this note where it belongs`.
- Changed the sample Bloom Border bed note from `This area gets bloom and pollinator observations.` to `This place gets bloom and pollinator observations.`
- Updated Ask and sample-garden tests to require the broader wording and reject the older plant-only/sample area phrasing.

Evidence:
- Used Product Design audit guidance, Product Design user-context preflight, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source inspection showed the Ask save target model supports garden, place, bed, and plant contexts, but disabled/sample copy still spoke as though notes only belonged with a plant.
- Targeted stale-copy scans found the older `right plant`/`This area` wording removed from source and present only as negative test assertions.

Verification:
- Focused tests passed from the website package: `ai-first-garden-home.test.tsx` and `sample-garden.test.ts` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.

Limit:
- Direct browser screenshot capture was not used in this run, so this pass used source/test verification before broader visual checks.
