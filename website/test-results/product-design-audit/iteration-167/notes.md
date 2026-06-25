# Iteration 167 Product Design Audit Notes

Scope: simplify the sample Calendar priority section so it reads like a weekly care list, not a command.

Changed:
- Replaced the section label `Do first` with `Care this week`.
- Removed the repeated `this week` from the count line, so the rendered heading reads like `Care this week 4 care items`.
- Updated sample calendar regression coverage to require the new label and reject the old one.

Why:
- `Do first` is terse and command-like, and it reads awkwardly beside the count.
- `Care this week` directly matches the gardener's felt need: know what needs care this week.
- The cleaner header keeps the calendar focused on useful next care without adding task-management language.

Verification:
- Focused tests passed from `website/`: `sample-garden.test.ts` and `empty-state-content.test.ts`, 2 files, 17 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Source scan confirms `Do first` is absent and `Care this week` is present.
- Rendered visible-text scan passed across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, and `/app/my-property`.
- Rendered scan confirms `/sample-garden/calendar` includes `Care this week 4 care items` and no longer includes `Do first`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls were not available in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
