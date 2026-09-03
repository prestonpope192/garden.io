# Garden Memory Sequential User-Story Run

Status: PASS — FEATURE-SCOPED

## Objective and authority

Run five realistic grower journeys in order and harden each step before moving
to the next. Actor: a home grower using the repository-owned sample garden or
a stateful local component fixture. Account/tenant: test-only local fixture.

- Repo/worktree: `/Users/preston/.codex/worktrees/garden-first-run-ai-home-20260901`
- Branch at start: `codex/bulk-garden-first-run-ai-home-20260901`
- Start SHA: `9eff252f17952a604a7506ed7acc364f89ce43be`
- Allowed: local code, test, fixture, screenshot, and documentation changes
- Not authorized: remote database writes, RLS/role/policy changes, provider or
  OAuth configuration, external messages, deployment, destructive operations
- Browser boundary: `/tour/*` is a rendered read-only sample. Stateful callback
  fixtures prove local interaction contracts; neither proves hosted persistence.
- Tenant isolation: no customer records or credentials; repository-owned data only
- Logs: verbose output goes to `/tmp/garden-user-stories/`

## Story contracts

### Story 1 — Diagnose a plant and track recovery

The grower asks about yellow pepper leaves, inspects grounding, saves the answer
as an observation, adds one recommended action to Weekly Care, returns to the
originating answer, asks what changed, and receives a comparison grounded in the
same plant. Pass requires observable answer context, independent save/care
callbacks, origin-answer follow-up context, retryable failures, and rendered
browser proof. Excludes live OpenAI and Supabase calls.

### Story 2 — Review a plant's seasonal story

The grower opens Bell Pepper, reviews a chronological past-to-today-to-upcoming
timeline, sees observations/completed care/outcomes, opens a photo journal grouped
by season and year, and records a final outcome. Pass requires correct scoping,
chronology, semantic dates, photo grouping/empty behavior, and an outcome callback.
Excludes private signed-photo delivery.

### Story 3 — Decide what to repeat next year

The grower reviews prior Bell Pepper outcomes and receives a history-cited
recommendation that explains the result, relevant place, and suggested next
decision. Pass requires recommendations to derive from matching recorded history,
exclude unrelated plants/beds, distinguish strong and weak history, and appear in
the rendered plant experience. Excludes automatic planting or schedule creation.

### Story 4 — Catch up after time away

The grower opens Today, reviews the garden-memory snapshot, moves to Garden Memory,
sees observations/completed care/outcomes without future tasks, opens Weekly Care
for planned work, and asks what changed. Pass requires a clear history-vs-plan
boundary, accurate counts, usable navigation, and grounded uncertainty language.
Excludes background monitoring or inferred events during the absence.

### Story 5 — Build a photo journal over several seasons

The grower sees an instructive empty photo journal, adds test-only dated photo
observations over multiple seasons/years, and reviews newest-first groups without
merging identical seasons across years. Pass requires decorative duplicate-image
alts, signed-URL-only rendering, stable grouping, and a linked outcome record.
Excludes upload-provider and long-term hosted retention proof.

## Sequential run ledger

| Story | Status | Evidence / defect / next action |
| --- | --- | --- |
| 1 | Pass | Stateful Vitest 11/11 and Chromium 8/8. Grounding, independent note/care callbacks, retry behavior, origin-answer follow-up context, and rendered plant linking passed. Logs: `story-1-vitest.log`, `story-1-browser.log`. No repair. |
| 2 | Pass | Added direct outcome-submit and failed-save retention coverage. Focused Vitest 20/20 and mobile Chromium 1/1 passed. Logs: `story-2-vitest.log`, `story-2-browser.log`. Test file added: `plant-timeline-interactions.test.tsx`. |
| 3 | Pass | Vitest 31/31 and Chromium 1/1. Found broken remote-art thumbnails when image delivery fails; added a local initial fallback and deterministic failed-image browser coverage. Recommendation cites the matching 4.0/5 outcome, same spot/timing, and visible Container Row context. Logs: `story-3-vitest.log`, `story-3-browser.log`; screenshot: `story-3-history-refined.png`. |
| 4 | Pass | Vitest 27/27 and Chromium 1/1. Today → Garden Memory → Weekly Care → Today/change comparison passed. One test expectation was corrected to distinguish returned evidence from diagnostic causes; no product repair. Logs: `story-4-vitest.log`, `story-4-browser.log`. |
| 5 | Pass | Vitest 23/23 and mobile Chromium 1/1. Photo handoff, empty state, season/year ordering, missing-media-URL behavior, decorative image alts, and linked outcome copy passed. Logs: `story-5-vitest.log`, `story-5-browser.log`. |

## Defects, hypotheses, and repairs

- Story 2 had no direct outcome-submit interaction contract. Added successful
  payload/reset and failed-save retention tests; product behavior already passed.
- Story 3 showed broken-image icons when remote plant art failed. Root cause:
  `PlantThumbnail` had no error state. Added a source-resetting local initial
  fallback and deterministic browser interception; the repaired UI passed.
- Story 4 initially asserted a diagnostic cause where the API response supplied
  stronger source evidence. Corrected the journey to open and audit the evidence
  disclosure; no product change.
- One bounded read-only subagent failed during startup with an external service
  404, produced no evidence, and made no edits. Main-thread execution continued.

Stateful external operations: none.

## Final truth matrix

| Layer | Result |
| --- | --- |
| Local deterministic | Pass: 39 Vitest files / 185 tests, typecheck, hygiene, and production build. |
| Rendered local browser | Pass: Chromium 13/13, plus screenshots for Stories 3–5. |
| Remote database / RLS | Not run; test callbacks and repository fixtures only. |
| Hosted authenticated | Not run; Arc was not applicable because no hosted authenticated target was authorized. |
| AI / media provider | Not run; canned AI and explicit authorized-media URL fixtures only. |
| Public / customer-visible | Not deployed or claimed. |

## Acceptance and evidence

- Story 1: grounded answer, evidence disclosure, note/care callback boundaries,
  retry behavior, answer-specific comparison, and plant deep link passed.
- Story 2: scoped chronology, semantic dates, season/year grouping, empty state,
  successful outcome serialization, and failed-save retention passed.
- Story 3: matching-history recommendation, strong/weak isolation tests, visible
  plant/place context, and failed-art fallback passed.
- Story 4: accurate memory counts, future-care exclusion, Weekly Care separation,
  navigation, and grounded change comparison passed.
- Story 5: photo handoff, authorized-media rendering, multi-year grouping,
  newest-first order, duplicate-alt behavior, and outcome linkage passed.

Full logs: `/tmp/garden-user-stories/full-vitest.log`, `typecheck.log`,
`hygiene.log`, `build.log`, and `full-browser.log`. Screenshots:
`story-3-history-refined.png`, `story-4-returning-grower.png`, and
`story-5-empty-photo-journal.png` in the same directory.

Current blocker: none. Exact next safe action: review and commit the local
feature-scoped repairs and coverage. Next gated action: none.
