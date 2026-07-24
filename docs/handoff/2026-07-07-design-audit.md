# Design/UX Audit — July 7, 2026

Audit of design, UI/UX, visual system, and product flows, grounded in the
live app (authed fixture garden), the `/tour` demo, the public site, and the
codebase. Findings are numbered F1–F21; ✅ marks findings **already fixed**
in the same-day improvement passes (see
[2026-07-07-improvement-passes.md](2026-07-07-improvement-passes.md)).

## Product summary

- **Product:** AI-assisted garden journal. Plants, beds, notes, and weather
  become memory-cited care advice. The flagship moment works: asking
  "When did I last mulch the orchard row?" returns an answer citing the
  user's own note.
- **Audience:** home gardeners who want advice that remembers their garden;
  public catalogue browsers (1,036 plant profiles).
- **Style direction:** herbarium / field-journal. Laid-paper textures,
  EB Garamond + Ibarra Real Nova + Caveat, specimen labels, plate cards, ink
  stamps, margin notes, hand-drawn line icons, earth-tone tokens
  (`--paper/--ink/--olive/--clay/--berry/--gold`, now also `--water`).
- **Overall health:** good bones, mid-maturity execution. Distinctive brand,
  above-average accessibility habits, thoughtful empty states; debt is
  concentrated in one 10k-line stylesheet, duplicated components, and a
  refetch-the-world mutation model.

## Style system inventory (as audited)

- **Typography:** three Google fonts via `next/font`
  (`website/app/layout.tsx`). Fluid clamp-based headings. No type-scale
  tokens — ~150 rules hardcode ad-hoc rem values; a sub-14px tier existed
  down to 0.62rem (partially raised, see F12).
- **Color:** tokenized palette in `:root` (`globals.css:3-18`). Semantic
  color is informal (success borrows `--olive`, error `--berry`; no warning
  token). No dark mode anywhere.
- **Spacing/layout:** `--space-1..7` exists but competes with magic values;
  12+ distinct breakpoints (400/520/640/760×6/980/1024/1079/1080/1100)
  instead of a tier system; `--max-width: 1240px`.
- **Components:** journal primitives (`SpecimenLabel`, `PlateCard`,
  `MarginNote`, `InkStamp`, now `FieldText`/`FieldSelect`) in
  `components/journal-primitives.tsx`. ≥4 coexisting button systems
  (`.button`, `.folio-button` family, per-view `garden-*-btn` one-offs).
- **Iconography:** consistent hand-drawn inline SVG set
  (`components/field-icons.tsx`); stray emoji in `plant-timeline.tsx` and
  `quick-log.tsx`.
- **Motion:** duration/easing tokens exist but most transitions hardcode
  `220ms ease`; `prefers-reduced-motion` handled in 7 duplicated blocks.
- **Copy tone:** warm, concrete, journal-metaphorical, no exclamation marks.
  Consistently the strongest part of the system.

## Findings

### Fixed same-day ✅

- **F1 (P0, responsive)** Marketing topbar collided at ≤560px — brand
  overlapped nav ("Garden.iPlan garden"). Cause: `minmax(0,1fr) auto` grid at
  `globals.css` ≤759px block. Fixed: single-column stack + nav wrap.
- **F3 (P1, UX)** Auth error wiped the typed email (native form POST round
  trip). Fixed: fetch-based submit in `auth-gate.tsx` reading the API's
  `auth` redirect param; native POST kept as no-JS fallback.
- **F5 (P1, content)** Tour suggested memory questions its canned engine
  answered generically. Fixed: curated `SAMPLE_GARDEN_PROMPTS` +
  `promptExamples` prop on `GardenAskView`.
- **F7 (P1, a11y)** QuickLog dialog lacked `aria-modal`, Escape, focus trap,
  focus restore, and a 44px close target. All added (initial focus already
  worked — audit sub-agent claim corrected).
- **F10 (P2, design system)** Off-palette blues `#4a8caa`/`#6a9cb5` on
  calendar water chips. Fixed: `--water`/`--water-soft` tokens.
- **F12 (P2, a11y)** `--ink-muted` was ~4.0:1 on paper (fails AA for small
  text); meaning-bearing 0.62rem labels. Fixed: `#7a684a` (≥4.5:1) and
  0.72rem floors for AI-confidence + timeline badges. A broader sub-14px
  sweep remains open.
- **F13 (P2, visual)** Unbranded default 404; no closing CTA on homepage.
  Fixed: `app/not-found.tsx` ("Unlabeled specimen") + "Begin the record"
  closing section on `app/page.tsx`.
- **F17 (P1, UX — top product finding)** Overdue care was invisible: Plant
  Journal showed "CARE OVERDUE (due Jun 12)" while Weekly care said "All
  clear this week" and Today said "No urgent care today". Root cause: three
  inconsistent selectors — `tasksForWeek` used a strict Mon–Sun window;
  Today used `due_on === today`. Confirmed against `garden_tasks` (real
  rows, not derived guidance). Fixed: `overdueBacklogTasks()` + pinned
  OVERDUE group (berry tone) + `due_on <= today` chip with "waiting" copy.
- **F18 (P1, visual)** 691/1,036 catalogue cards had no art and rendered
  empty frames. Fixed: pressed-specimen placeholder (dashed frame + italic
  initial) in both plants-view and catalogue-view.
- **F19 (P1, performance)** All 1,036 catalogue cards mounted at once
  (26,560 DOM nodes). Fixed: 48-per-step "Show more" tiering (1,390 nodes
  initial, 19× reduction); search/filter resets the window.
- **F20 (P2, visual)** Sticky Ask composer (94% opaque, no bottom clearance)
  collided with answer content. Fixed: solid paper bg + 12.5rem thread
  padding.
- **F21 (P3, content)** Drawer echoed "Stage: Harvest-ready" + "Harvest:
  Ready to harvest"; "Summer" vs "Your season: Late spring" juxtaposition.
  Both fixed. (Native file input styling in QuickLog still open.)
- **F6 (P1, UX) — partially fixed.** Full-snapshot refetch after every
  mutation: no empty-flash exists (instrumented; also regression-tested),
  but saves cost ~2–3s on a 5-plant garden. Fixed: season stamp no longer
  flips to "Loading" mid-save; "Marked done." now offers Undo. Open: the
  refetch architecture itself (targeted refetch per mutation type).

### Still open

- **F2 (ops, resolved externally):** Supabase project had been paused
  (NXDOMAIN); Preston unpaused it. Note: Supabase's built-in mailer rejected
  a `.test` address — real-address deliverability unproven.
- **F4 (P1, UX):** tour renders dead affordances — checkboxes and plant
  cards do nothing (real app is fully interactive). Prompts fixed (F5);
  interactivity stubs still open.
- **F8 (P2, IA):** three naming systems — marketing nav "Choose plants" vs
  "Browse plants"; app slugs (`/app/my-garden`) vs tour slugs
  (`/tour/property`); Ask view's duplicate icon-only topbar.
- **F9 (P2, visual):** My Garden stacks three title tiers (~340px on mobile
  before content); redundant for single-property users.
- **F11 (P2, design system):** button-system fragmentation (≥4 patterns).
- **F14 (P2, design system):** globals.css ≈10k lines; "Inlined view
  styles" accretion layer; 12+ breakpoints; motion tokens bypassed.
- **F15 (P3, a11y):** no skip links; required fields lack visible markers;
  emoji-as-icon in two components. (Auth loading live region: fixed.)
- **F16 (P3, UX):** frost-alert/geocode fetches fail silently
  (`property-view.tsx` ~320–360) — "couldn't check" is indistinguishable
  from "no alert".

## Creative opportunities (not yet built)

1. **Today as the journal's living page** — the flagship Ask screen is the
   least branded surface. Compose it as a dated spread: script date +
   season stamp, memory snapshot as a `PlateCard`, today's care inline,
   latest note as a `MarginNote`. Highest-leverage brand move; needs
   product-owner approval.
2. **Guided 3-beat tour** — ask a memory question → jump to the cited bed →
   check off the care item (ink-strike). Depends on F4 stubs.
3. **My Garden plot sketch** — optional spatial view: beds as hand-ruled
   rectangles on grid paper. Validate demand before building.
