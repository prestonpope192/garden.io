# Garden memory features run state — 2026-09-03

## Objective and accepted scope

Build four additive Garden.io memory features from the accepted request:

- seasonal photo journals
- “What changed since last time?” follow-ups
- expandable “Why this answer fits your garden” evidence
- a premium memory timeline combining photos, observations, and care outcomes

Preserve the existing first-run AI-home behavior. Prefer existing observation,
task, outcome, and private-media records; no new schema is planned.

## Repo and branch

- Repo: `/Users/preston/.codex/worktrees/garden-first-run-ai-home-20260901`
- Branch: `codex/bulk-garden-first-run-ai-home-20260901`
- Base: `origin/main` at `5869a9c1a661ebf4fd06d865c713a2af90b3b2c1`
- Accepted starting SHA: `09faf8cc51fd41a17c034af3b17179e1def0b616`

## Safety and stateful operations

- Elevated approvals: none required.
- Migrations, seeds, backfills, provider configuration, shared database writes:
  none planned.
- Deployment, merge, push, customer messaging: not performed.
- Private garden photos remain owner-scoped through the existing storage path;
  no new public media surface is introduced.

## Truth matrix

| Surface | Status | Evidence |
| --- | --- | --- |
| Local source/tests | Proven locally | 38 files / 181 Vitest tests passed; typecheck passed; hygiene passed for 257 tracked files; production build passed. |
| Local browser/demo | Proven locally | Exact worktree on `http://localhost:3011`; 11/11 Chromium checks passed, including mobile garden and plant memory views. |
| Committed branch | Proven locally | Commit `692ba24` (`feat: add garden memory feature loop`) contains the reviewed task-owned diff. |
| Hosted/authenticated/provider | Not claimed | No authenticated provider configuration is present in this worktree. |
| Production/customer-visible | Not performed | No deployment or external communication requested. |

## Current decision and next action

Use `GardenAskView` for answer evidence and contextual follow-ups. Extend the
existing `PlantTimeline` with seasonal photo presentation and explicit outcome
labels. Keep changes within the website component/lib/test surfaces, then run
focused tests followed by the existing full validation sequence.

Current blocker: none.

Local validation artifacts: `/tmp/garden-memory-full-vitest-final-3.log`,
`/tmp/garden-memory-typecheck-final-4.log`, `/tmp/garden-memory-hygiene-final-2.log`,
`/tmp/garden-memory-build-final-2.log`, and `/tmp/garden-memory-browser-final-2.log`.

Reusable session: local dev server session `39262` is serving the exact feature
worktree at `http://localhost:3011`; inspect before reuse and do not start a
duplicate.

## Make It Better refinement pass

Direct screenshot review and one bounded read-only subagent audit converged on
a “memory truthfulness” refinement:

- completed care is historical memory; open tasks remain planned care
- answer-specific follow-ups retain their originating answer as context
- photo journals group and order memories by season plus year
- long place/bed histories offer an explicit older-entry expansion
- evidence descriptions name only sources actually returned
- evidence disclosures expose visible open/closed and keyboard-focus cues
- plants with no photos still explain how the seasonal journal will grow

Weak ideas rejected: fake sample photos, hemisphere assumptions without a
product policy, AI visual-change detection, a gallery/lightbox redesign, and a
new provenance schema.

Refinement proof: focused Vitest 41/41; full Vitest 38 files / 183 tests;
typecheck passed; hygiene passed for 258 tracked files; production build passed;
Chromium 11/11 passed; desktop/mobile screenshots inspected at
`/tmp/garden-mib/ask-evidence-refined.png`,
`/tmp/garden-mib/property-mobile-refined.png`, and
`/tmp/garden-mib/plant-timeline-refined.png`.

Refinement logs: `/tmp/garden-mib-focused-3.log`,
`/tmp/garden-mib-vitest.log`, `/tmp/garden-mib-typecheck-final.log`,
`/tmp/garden-mib-hygiene.log`, `/tmp/garden-mib-build.log`, and
`/tmp/garden-mib-browser.log`.

Current blocker: none. Refinement commit: pending final reviewed commit.
Next safe action: commit the reviewed local refinement. Next gated action: none;
deployment, provider configuration, and shared-data changes remain unrequested.
