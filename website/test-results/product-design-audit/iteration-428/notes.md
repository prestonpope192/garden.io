# Iteration 428 Notes

Scope: simplify the homepage and sample app copy that still sounded like product taxonomy, internal labels, or generic prompts.

Changed:
- Changed the Garden Check prompt from `What changed in your garden?` to `Show what changed. Get one care step.`
- Changed the Garden Check hint from saving "the answer" to saving what the gardener noticed with the right plant or bed.
- Changed the My Garden shell subtitle to emphasize notes, photos, and next care in one place.
- Changed the This Week shell subtitle from `today's care` to `next care check`.
- Changed the Plant Journal stats stamp from `Garden plants` to `Plants you're growing`.
- Changed Field Guide result counts from `plant choices` to `plants to consider`.
- Changed the Plant Journal chooser collapse label from `Hide plant choices` to `Hide field guide`.
- Changed homepage plant showcase copy from category labels like `Blossom and fruit notes` to journal-style entries like `First bloom and fruit set`, `Bees in the borage`, and `Sown, cut, gone to seed`.
- Changed the homepage hero media label from `field-guide plate` to `garden note`, and changed the card from `Bloom note` to `First bloom` with a dated journal-style line.

Evidence:
- Used Product Design audit guidance, critical overrides, saved-context preflight, session-budget guidance, Garden.io memory, current source, read-only orchestrator explorer findings, focused tests, live route-output probes, full tests, build, and diff hygiene.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo, local route evidence, and Garden.io memory.
- Focused tests passed from the website package: `homepage-content.test.ts`, `sample-garden.test.ts`, `ai-first-garden-home.test.tsx`, `catalogue-format.test.ts`, and `empty-state-content.test.ts` - 5 files, 43 tests.
- Live `/` route-output probe found `First bloom`, `Apr. 12. Compare fruit set and harvest later.`, `First bloom and fruit set`, `Bees in the borage`, and `Sown, cut, gone to seed`, and did not find `Bloom note`.
- Live `/sample-garden/ask` route-output probe found `Show what changed. Get one care step.` and `Save what you noticed with the right plant or bed.`, and did not find `What changed in your garden?`.
- Live `/sample-garden/property` route-output probe found `See what grows where, with notes, photos, and next care in one place.` and did not find the old `this week's care` subtitle.
- Live `/sample-garden/calendar` route-output probe found `Start with the next care check. Let the rest wait.` and did not find `Start with today's care`.
- Live `/sample-garden/catalogue` route-output probe found `3 plants to consider` and did not find `3 plant choices`.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- Browser screenshot capture was not used. Browser tools were not exposed in this turn, and Computer Use remains blocked from the Codex app by safety policy. Playwright fallback requires explicit permission under the Product Design rules.
