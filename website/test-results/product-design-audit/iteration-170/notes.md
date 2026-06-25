# Iteration 170: Weekly-care wording in the Plants drawer

Scope: make the sample Plants drawer describe upcoming plant care in plain, specific language.

Changed:
- Replaced the default drawer summary `4 need care soon.` with `4 plants have care this week.`
- Replaced the care urgency badge `Care soon` with `Care this week`.
- Replaced the filter label `Needs care soon only` with `Care this week only`.
- Replaced the selected-drawer detail label `Needs care soon` with `Care this week`.
- Updated regression coverage so the sample Plants drawer keeps the weekly-care wording and rejects the older vague phrases.

Why:
- `Need care soon` is vague and reads like task-system language.
- `Care this week` matches the app's calendar promise and gives the gardener a clearer timeframe.
- The sample Plants page already shows each plant's next care; the drawer should summarize that state instead of adding a disconnected count.

Verification:
- Focused tests passed from `website/`: `sample-garden.test.ts` and `empty-state-content.test.ts`, 2 files, 17 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered visible-text scan passed across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, and `/app/my-property`.
- Rendered scan confirms `/sample-garden/plants` includes `4 plants have care this week.` and no longer includes `4 need care soon.`, `need care soon`, `Needs care soon`, or `Due soon`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls were not available in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
