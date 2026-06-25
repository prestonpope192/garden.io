# Iteration 431 - Public Catalogue Copy Cleanup

Date: 2026-06-24
Route focus:
- `/catalog`
- `/catalog/apple`

## Scope

Continue simplifying Garden.io's public path so it reads like a calm field guide and garden notebook for prospective gardeners, not like internal product copy.

## Changes

- Changed the catalogue hero eyebrow from `Choose plants` to `Plant notes`, with `Field guide` as the folio context.
- Changed the catalogue summary aria label from `Choose plants summary` to `Field guide summary`.
- Changed the third catalogue summary metric from `Keep notes / weather and photos together` to `Remember later / what changed and what helped`.
- Changed highlighted-card and row links from `Open plant page` to `Open plant note`.
- Changed the highlighted-card label from `Plant plate` to `Plant note`.
- Changed the results section label from `Choose plants` to `Plants to consider`.
- Changed active category summary copy from category `choices` to category `plants`.
- Changed the plant detail page nav and hero label to `Field guide` / `Plant note`.
- Changed the plant detail season helper from `Bloom timing, weather shifts, pests, and care that helped.` to `Bloom timing, weather shifts, pests, and what helped.`
- Changed the plant detail CTA from `Then keep its notes, photos, weather, and care together.` to `Then remember what happened and what helped next time.`

## Evidence

- Used `orchestratror-mode` in the main thread: main model kept product judgment, copy direction, and final review; bounded parallel tool waves handled source scans, route probes, and verification.
- Used `codex-safe-run` guardrails for bounded log output and file-backed test/build logs.
- Focused tests passed from the website package: `public-catalogue-content.test.ts` and `catalogue-format.test.ts` - 2 files, 22 tests.
- Live `/catalog` route-output probe found `Plant notes`, `Remember later`, `what changed and what helped`, `Plant note`, `Open plant note`, and `Plants to consider`.
- Live `/catalog/apple` route-output probe found `Plant note`, `Field guide`, `Bloom timing, weather shifts, pests, and what helped.`, and `Then remember what happened and what helped next time.`
- Source scan found the old `Plant plate`, `Open plant page`, `Choose plants summary`, `weather and photos together`, old season helper, and old detail CTA only in negative test assertions.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. Browser tools were not exposed in this turn, and Computer Use remains blocked from the Codex app by safety policy. Playwright fallback requires explicit permission under the Product Design rules.
