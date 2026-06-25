# Iteration 543 Notes

Scope: clean up history-based care suggestion language so personal performance insights read like garden notebook observations, not storage-system summaries.

Changed:
- Changed suggestion rationale from `From what you saved` to `From your garden notes`.
- Changed performance summaries from `saved harvests` to `harvest notes`.
- Changed fallback performance wording from `saved results` to `noted results`.
- Renamed a related timeline test description from `saved results` to `noted results` so future source scans stay clean.
- Updated suggestion and performance tests to require the new wording and reject the older save/storage phrasing.

Evidence:
- Used Product Design audit guidance, Product Design user-context preflight, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Targeted source inspection found history-driven care ideas still used `From what you saved` and `saved harvests` after earlier homepage, Ask, Quick Log, and Plant Journal passes moved toward garden-notebook language.
- Focused tests passed from the website package: `garden-performance.test.ts`, `garden-suggestions-history.test.ts`, `garden-timeline.test.ts`, `plant-timeline-content.test.ts`, and `sample-garden.test.ts` - 5 files, 49 tests.

Verification:
- Focused tests passed from the website package: 5 files, 49 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- Direct browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
