# Iteration 172: Care feedback wording

Scope: remove the remaining `care item` phrasing from action feedback and Garden Map task labels.

Changed:
- Replaced signed-in app feedback `Care item updated.` with `Care updated.`
- Replaced example garden feedback `Care item updated.` with `Care updated.`
- Replaced example garden feedback `Care item kept on your list.` with `Care kept on your list.`
- Replaced Garden Map screen-reader labels `Mark care item done` / `Put care item back on the list` with `Mark care done` / `Put care back on the list`.
- Updated regression coverage so mutation feedback and sample Garden Map source reject the older `care item` language.

Why:
- `Care item` sounds like an internal task object.
- `Care updated` and `Care kept on your list` are shorter and easier to understand after a user edits or removes care.
- The same plain wording should hold for visible confirmations and assistive-technology labels.

Verification:
- Focused tests passed from `website/`: `sample-garden.test.ts`, `garden-mutation-copy.test.ts`, and `empty-state-content.test.ts`, 3 files, 18 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered visible-text scan passed across `/`, `/sample-garden/property`, `/sample-garden/calendar`, `/app/my-property`, and `/app/calendar`.
- Rendered scan confirms `/sample-garden/property` and `/sample-garden/calendar` no longer include `Care item` or `care item`.
- Rendered scan confirms `/app/my-property` and `/app/calendar` render the sign-in gate in this environment and do not expose `Care item`, `care item`, `private-beta`, `prototype`, or `early access`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls were not available in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
