# Iteration 388 Notes

Date: 2026-06-24

Scope: simplify the My Garden side-guide copy around the next plant to check.

What changed:
- Changed the My Garden guide label from `First plant to check` to `Check first`.
- Changed the guide support line from `4 plants in 3 beds. Start here, or open any bed for notes and photos.` to `4 plants in 3 beds. Open any bed for notes and photos.`
- Changed the next-plant button from `Open plant notes` to `Open notes`.
- Updated focused sample-garden tests to require the simpler wording and reject the old phrases.

Why:
- The previous copy was clear but still sounded like app scaffolding.
- `Check first` is shorter and more immediately useful in a gardener's scan path.
- Removing `Start here` lowers the instruction density while preserving the action: open a bed or plant for notes and photos.

Evidence:
- Product Design audit, Product Design index, Product Design user-context preflight, Product Design critical overrides, session-budget guidance, and Garden.io memory were used during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo, current app source, live route/source evidence, and Garden.io memory as grounding.
- Focused tests passed from `website`: `npm test -- sample-garden.test.ts empty-state-content.test.ts` - 2 files, 21 tests.
- Full tests passed from `website`: `npm test` - 23 files, 130 tests.
- Production build passed from `website`: `npm run build`.
- Whitespace check passed from repo root: `git diff --check`.
- Live `/sample-garden/property` returned `200`, contains `Check first`, `Open any bed for notes and photos.`, and `Open notes`, and no longer contains `First plant to check`, `Start here, or open any bed for notes and photos.`, or `Open plant notes`.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
