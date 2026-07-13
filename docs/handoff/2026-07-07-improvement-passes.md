# Improvement Passes — July 7-8, 2026

Five implementation passes on top of the design audit. Everything
below is **uncommitted** on `codex/garden-private-beta-mvp` (HEAD `9d7bb6d`),
in a working tree that also carries earlier, unrelated uncommitted app-audit
work. Latest verification state: **`npm test` 154/154 (29 files),
`npm run typecheck` clean, `npm run build` exit 0.** Browser verification
from the previous queue-completion pass: **`npm run test:browser` 11/11**
when run against the active local dev server via `PLAYWRIGHT_BASE_URL`.

## Pass 1 — audit quick fixes + DevEx

| Change | Files | Verified |
| --- | --- | --- |
| Mobile marketing topbar: brand row + wrapping nav at ≤759px (was overlapping at 375px) | `website/app/globals.css` | 375px screenshot; logo/nav rects no longer intersect |
| Auth email survives a failed send (fetch submit reading the `auth` redirect param; native POST fallback kept) | `website/components/auth-gate.tsx` | Live: real server error returned with email still in field |
| Branded 404 — "Unlabeled specimen / This page isn't in the journal." | `website/app/not-found.tsx` (new) | Screenshot |
| Homepage closing CTA — "Begin the record / Start with one plant." | `website/app/page.tsx` | Screenshot (mobile, full-width buttons) |
| QuickLog dialog a11y: `aria-modal`, Escape, Tab trap, focus restore to FAB, 44×44 close, `:focus-visible` | `website/components/quick-log.tsx`, `globals.css` | Live DOM probe: `{escapeClosed: true, focusRestoredToFab: true}` |
| Pressed-specimen placeholders for missing plant art (dashed frame + italic initial) | `website/components/views/plants-view.tsx`, `catalogue-view.tsx`, `globals.css` | Screenshots (Acanthus "A" in both views); dead `--text-only` rule removed |
| Ask composer: solid paper background + 12.5rem thread clearance (was 94% opaque, content bled through) | `website/app/globals.css` | Computed style probe: `rgb(255,251,245)`, 200px padding |
| `--water`/`--water-soft` tokens replace off-palette blues | `website/app/globals.css` | Grep: no `#4a8caa`/`#6a9cb5` remain |
| DevEx: `typecheck` script, `.env.example`, GitHub Actions CI (`npm ci` → typecheck → test) | `website/package.json`, `website/.env.example` (new), `.github/workflows/ci.yml` (new) | CI not yet exercised (needs a push) |
| Fixed 9 pre-existing `tsc` errors in test fixtures | `tests/sample-garden.test.ts`, `empty-state-content.test.ts`, `homepage-content.test.ts` (also CTA count 1→2), `diagnose-route-copy.test.ts`, `next-config.test.ts` | `tsc --noEmit` clean |

## Pass 2 — overdue care, catalogue tiering, mutation tests

| Change | Files | Verified |
| --- | --- | --- |
| **Overdue surfacing.** `overdueBacklogTasks()` (exported; open tasks due before the visible week's Monday) + pinned OVERDUE group above "First up" reusing `TaskCard`; head copy "Nothing new this week" when backlog exists; new `berry` tone on `SpecimenLabel` | `website/components/views/calendar-view.tsx`, `journal-primitives.tsx`, `globals.css` | Live: fixture showed **3** previously hidden tasks pinned with working actions |
| **Today chip honesty.** `dueOrOverdue()` (`due_on <= today`); "N care items waiting" when any are overdue | `website/components/views/garden-ask-view.tsx` | Live: chip flipped from "No urgent care today" to "3 care items waiting" |
| **Catalogue Show-more tiering.** `CATALOGUE_PAGE_SIZE = 48`; window resets on search/filter; "Showing X of Y" | `website/components/views/catalogue-view.tsx`, `globals.css` | Live: 1,390 DOM nodes initial (was 26,560); 48→96 on click; search "sage" → 6 |
| **Mocked-Supabase mutation tests** (4 tests mounting the real `GardenApp` tree) + reusable chainable mock | `website/tests/garden-app-mutations.test.tsx` (new), `website/tests/support/garden-supabase-mock.ts` (new); devDeps `jsdom`, `@testing-library/react` | Covers: success notice + reload; failure notice w/o reload; initial-load error; **no-empty-flash regression guard** |
| Overdue unit/render tests (8 tests) | `website/tests/overdue-care.test.ts` (new) | Selector edge cases + both views' copy |

Data note: the "Prune suckers (due Jun 12)" trace confirmed overdue items are
**real `garden_tasks` rows** (service-role read-only query), not derived
suggestions — `lib/garden-suggestions.ts` was not the culprit and was left
untouched.

## Pass 3 — delight, ergonomics, polish

| Change | Files | Verified |
| --- | --- | --- |
| **Ink-stroke completion**: completing a task draws a slanted strike (`garden-ink-strike` keyframe) through the title, tints the check olive, fades the card until the fresh snapshot removes it | `website/components/views/calendar-view.tsx`, `globals.css` | Live: animation captured mid-mutation |
| **Undo on "Marked done."** — notice gains an inline Undo that reopens the task | `website/components/garden-app.tsx`, `globals.css` | Live round-trip: done → Undo → "Added back to weekly care.", task restored |
| **Stamp stability** — mid-mutation reloads keep `status="saving"` so the season stamp no longer flips to "Loading" | `website/components/garden-app.tsx` | Live: stamp read "Late spring" throughout a save |
| **Tour prompt honesty** — `promptExamples` prop on `GardenAskView`; tour passes 4 prompts its canned engine answers well | `website/components/views/garden-ask-view.tsx`, `garden-app-preview.tsx` | Live: rotator cycled only curated prompts |
| `FieldText`/`FieldSelect` hoisted to `journal-primitives.tsx` (unified API: `options?: string[]` renders "—" + list, else `children`); property-view deduplicated | `website/components/journal-primitives.tsx`, `views/property-view.tsx` | Typecheck + suite (plants-view still has local copies — see backlog) |
| Drawer row echo fixed ("Stage: Harvest-ready" dropped when Harvest says the same) | `website/components/views/property-view.tsx` | Suite |
| Season copy: "Your season: Late spring" → "Late spring in your garden" | `website/components/views/calendar-view.tsx` | Suite |
| Contrast/type floor: `--ink-muted` → `#7a684a` (≥4.5:1 on paper); 0.62rem → 0.72rem for `.garden-diagnose__conf` + `.garden-timeline__badge` | `website/app/globals.css` | Computed contrast |
| Auth loading state → polite live region with sr-only text | `website/components/auth-gate.tsx` | Code review |

## Pass 4 — next-pass queue completion

| Change | Files | Verified |
| --- | --- | --- |
| **Plant Journal dedup.** Six near-duplicate grid/list components collapsed into variant-driven `PlantCard`/`PlantListRow`; local `FieldSelect` replaced with the shared primitive; read-only/wishlist cards can select as whole cards. | `website/components/views/plants-view.tsx`, `website/app/globals.css` | Focused render/source tests, full suite |
| **Tour local interactions.** Sample calendar checkboxes use local demo task state, play the existing ink-strike class, and show "It'll wait for your real garden."; no persistence or app mutation path is used. | `website/components/garden-app-preview.tsx`, `website/components/views/calendar-view.tsx` | `npm run test:browser` 11/11 |
| **Playwright CI.** Browser tests now have a CI job with Chromium install; local runs can reuse an existing dev server through `PLAYWRIGHT_BASE_URL` while CI starts its own `webServer`. | `.github/workflows/ci.yml`, `website/playwright.config.ts` | Local Playwright 11/11; GitHub CI still unrun until push |
| **Targeted refetch.** `runMutation` now accepts reload scopes; routine writes refetch only affected tables while structural deletes stay conservative. Observation reloads still refresh signed media URLs. | `website/components/garden-app.tsx`, `website/tests/garden-app-mutations.test.tsx` | Mocked mutation suite covers targeted reload and no-empty-flash |
| **Local-date fixture hardening.** Demo/test date helpers stopped deriving `YYYY-MM-DD` from UTC `toISOString()`, preventing evening timezone drift from hiding "today" care. | `website/lib/demo-garden-snapshot.ts`, `website/tests/ai-first-garden-home.test.tsx`, `website/tests/overdue-care.test.ts` | Full suite + Playwright |

## Pass 5 — first medium-queue item

| Change | Files | Verified |
| --- | --- | --- |
| **Quiet weather/geocode failure status (F16).** Failed frost forecast checks now surface a muted Suggestions note instead of silently suppressing alerts; failed geocode searches in the location editor show a recoverable muted note. | `website/components/views/property-view.tsx`, `website/tests/property-weather-status.test.tsx` | Focused jsdom render/source test, full suite, typecheck, build |

Note: the geocode branch remains covered by source assertion because the
current property-level edit UI is not reachable from the property drawer
without a separate product decision to expose property editing.

## How things were verified

- **Gates:** `npm test`, `npm run typecheck`, `npm run build` — all green at
  the end of each pass. Pass 4 additionally ran `npm run test:browser`
  against the active local server on `http://localhost:53469` using
  `PLAYWRIGHT_BASE_URL=http://localhost:53469`.
- **Live checks:** minted-session flow (see
  `docs/handoff/2026-07-07-backlog.md` § Working practices) against fixture
  `plotmap-preview@garden.test` ("Thornfield Garden", zone 7a). All test
  mutations were reverted in-UI (undo) or deleted via service role; the
  fixture is in its original state.
- **Instrumentation:** mutation flow sampled at 60ms intervals (no
  empty-flash) before Pass 4; Pass 4 replaced the broad post-mutation reload
  with targeted table reloads. Live production latency has not been remeasured.
