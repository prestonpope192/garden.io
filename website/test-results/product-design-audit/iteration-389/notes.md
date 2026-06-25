# Iteration 389 Notes

Date: 2026-06-24

Scope: replace user-facing `care plan` wording with simpler `care list` language.

What changed:
- Changed signed-in care action buttons from `Add to care plan` to `Add to care list`.
- Changed delete and navigation actions from `Remove from care plan` / `See care plan` to `Remove from care list` / `See care list`.
- Changed care save notices from `Added to your care plan.`, `Back in your care plan.`, and `Removed from your care plan.` to `Added to your care list.`, `Back on your care list.`, and `Removed from your care list.`
- Updated focused tests to require the new wording and reject the old `care plan` wording where the surfaced copy is covered.

Why:
- `Care plan` sounds more like product language.
- `Care list` better matches the user's mental model: a simple list of things to do in the garden.
- This keeps the same task behavior while making the app feel less like planning software.

Evidence:
- Product Design audit, Product Design index, Product Design user-context preflight, Product Design critical overrides, session-budget guidance, and Garden.io memory were used during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo, current app source, live route/source evidence, and Garden.io memory as grounding.
- Focused tests passed from `website`: `npm test -- empty-state-content.test.ts garden-mutation-copy.test.ts ai-first-garden-home.test.tsx diagnose-panel-content.test.ts plant-timeline-content.test.ts` - 5 files, 18 tests.
- Full tests passed from `website`: `npm test` - 23 files, 130 tests.
- Production build passed from `website`: `npm run build`.
- Whitespace check passed from repo root: `git diff --check`.
- Source scan confirms visible component copy now uses `Add to care list`, `Remove from care list`, `See care list`, and the new care-list mutation messages. Remaining `care plan` strings are negative test guards for older rejected copy.
- Live read-only sample routes do not expose these signed-in action labels; `/sample-garden/calendar` and `/sample-garden/property` still returned `200`.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
