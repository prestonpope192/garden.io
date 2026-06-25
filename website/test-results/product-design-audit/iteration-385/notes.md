# Iteration 385 Notes

Date: 2026-06-24

Scope: make the public plant guide hero copy simpler and more gardener-facing.

Orchestrator mode:
- Kept copy judgment and final review in the main thread.
- Used bounded parallel tool work for focused tests, full verification, and live route proof.
- Did not spawn subagents because the edit was limited to the public catalogue hero and related tests.

What changed:
- Changed the public catalogue support line from `Search by light, water, space, and use before you make room in a bed.` to `Search by sun, water, space, and use before you plant.`
- Updated catalogue regression tests to require the new sentence and reject the older wording.

Why:
- `Sun` is more natural garden language than `light` for a prospective gardener scanning the page.
- `Before you plant` is shorter and clearer than `before you make room in a bed`.

Evidence:
- Focused tests passed from `website`: `npm test -- catalogue-format.test.ts public-catalogue-content.test.ts` - 2 files, 22 tests.
- Full tests passed from `website`: `npm test` - 23 files, 130 tests.
- Production build passed from `website`: `npm run build`.
- Whitespace check passed from repo root: `git diff --check`.
- Live `/catalog` returned `200`, contains `Search by sun, water, space, and use before you plant.`, and no longer contains `Search by light, water, space, and use before you make room in a bed.`

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
