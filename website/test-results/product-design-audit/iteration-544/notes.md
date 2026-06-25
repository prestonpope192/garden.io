# Iteration 544 Notes

Scope: clean up the main app mutation error state so failed changes feel like recoverable garden actions, not software storage failures.

Changed:
- Added a shared `changeFailed` mutation message: `That change didn't go through. Check the details and try again.`
- Replaced the inline `Unable to save that change. Please check the fields and try again.` notice with the shared user-facing message.
- Updated mutation copy tests to require the new error wording and reject the old save/field phrasing.

Evidence:
- Used Product Design audit guidance, Product Design user-context preflight, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Targeted source inspection found the main app mutation error still used `Unable to save that change`, which sounded like implementation/storage language after the rest of the app had moved toward `keep`, `note`, and garden-action language.
- Focused tests passed from the website package: `garden-mutation-copy.test.ts`, `sample-garden.test.ts`, `quick-log-content.test.ts`, and `plant-timeline-content.test.ts` - 4 files, 18 tests.

Verification:
- Focused tests passed from the website package: 4 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- Direct browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
