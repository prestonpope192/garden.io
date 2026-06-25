# Iteration 429 Notes

Scope: make the primary homepage and signed-out app promise describe the user's felt need instead of listing product contents.

Changed:
- Changed the homepage hero promise from `Keep plants, notes, photos, and care together in one calm garden notebook.` to `Remember what you planted, what changed, and what to do next in one calm garden notebook.`
- Applied the same promise to the signed-out app entry so the app does not shift back into feature-list copy.
- Updated browser, Open Graph, and Twitter metadata from the generic journal inventory to `Remember what you planted, what changed, and what to do next.`
- Changed the signed-in shell tagline from `Keep your plants, notes, photos, and care in one garden journal.` to `Keep plants, notes, photos, and next care in one garden journal.`

Evidence:
- Used Product Design audit guidance, Product Design critical overrides, Product Design saved-context preflight, session-budget guidance, Garden.io memory, current source, current route text, focused tests, full tests, build, and diff hygiene.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo, local route evidence, and Garden.io memory.
- Focused tests passed from the website package: `homepage-content.test.ts` and `auth-gate-content.test.ts` - 2 files, 7 tests.
- Live `/` route-output probe found `Remember what you planted, what changed, and what to do next in one calm garden notebook.` and did not find `Keep plants, notes, photos, and care together`.
- Live `/app/my-property` route-output probe found the same new signed-out promise and did not find the old feature-list promise.
- Live `/` HTML probe found the updated metadata description and did not find `Keep a simple garden journal with plants, notes, photos, and care in one place.`
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- Browser screenshot capture was not used. Browser tools were not exposed in this turn, and Computer Use remains blocked from the Codex app by safety policy. Playwright fallback requires explicit permission under the Product Design rules.
