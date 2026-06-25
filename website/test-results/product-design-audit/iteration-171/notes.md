# Iteration 171: Calendar weekly-care wording

Scope: replace remaining visible Calendar `care item` wording with clearer weekly-care language.

Changed:
- Replaced `4 care items` with `4 things to do` in the Care this week count.
- Replaced `Next care item coming up.` with `Next care is coming up.`
- Replaced empty-state `Add a care item when you notice one.` with `Add care when you notice it.`
- Replaced the add form label `Add a care item` with `Add care`.
- Replaced screen-reader labels `Mark care item done` / `Put care item back on the list` with `Mark care done` / `Put care back on the list`.
- Updated regression coverage to require the simpler Calendar wording and reject the older `care item` phrases.

Why:
- `Care item` reads like internal task-system language.
- `Things to do` is clearer in the weekly summary, and `Add care` is shorter in the form.
- The Calendar should answer the gardener's felt need: what needs doing this week.

Verification:
- Focused tests passed from `website/`: `sample-garden.test.ts` and `empty-state-content.test.ts`, 2 files, 17 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered visible-text scan passed across `/sample-garden/calendar`, `/sample-garden/plants`, `/`, and `/catalog`.
- Rendered scan confirms `/sample-garden/calendar` includes `Care this week` and `4 things to do`.
- Rendered scan confirms `/sample-garden/calendar` no longer includes `care item`, `care items`, or `Next care item coming up.`

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls were not available in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
