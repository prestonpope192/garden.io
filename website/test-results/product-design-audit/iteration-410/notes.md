# Iteration 410 - Sample Save Prompt

Date: 2026-06-24

## Scope

Make read-only sample save prompts feel inviting instead of blocked. The old Garden Check result hint said `Start your garden before saving notes or care.`, which explained the limitation but sounded like a warning.

## Change

- Changed the Garden Check result hint to `Start your garden to keep notes and care like this.`
- Changed the reusable sample save helper from `Start your garden to keep your own notes.` to `Start your garden to keep notes like these.`
- Updated Garden Check and sample-garden tests to require the warmer copy and reject the old warning-style lines.

## Evidence

- Product Design audit/index/user-context guidance, Product Design critical overrides, Product Design saved-context preflight, session-budget guidance, Garden.io memory, current source, and live local route output were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo and source-level evidence.
- Focused tests passed from the website package: `sample-garden.test.ts` and `ai-first-garden-home.test.tsx` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Source scan found the new `Start your garden to keep notes and care like this.` and `Start your garden to keep notes like these.` lines, and found no current component/test source using `Start your garden before saving notes or care.` or `Start your garden to keep your own notes.`

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
