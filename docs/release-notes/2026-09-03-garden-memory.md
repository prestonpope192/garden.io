# Garden.io Garden Memory

Status: merged and deployed to production on 2026-09-28. Not announced. See
`docs/qa/2026-09-28-garden-memory-release-closeout.md` for route and release
evidence. Authenticated persistence, live database schema, provider, and signed
photo acceptance remain unverified.

## Summary

Garden.io now connects what a gardener noticed, what they did, and how the
garden responded. Plant and place timelines keep observations, completed care,
photos, and outcomes together while planned work remains in Weekly Care.

## Why it matters

Garden advice becomes more useful when it can be checked against the gardener's
own history. A grower can return after time away, understand what changed, review
a plant's seasonal story, and use recorded outcomes to make a better decision
next year.

## What changed

- Garden-level, place, bed, and plant memory timelines
- Seasonal photo journals grouped by season and year
- Answer-specific “What changed since last time?” follow-ups
- Source-specific explanations for why an answer fits the garden
- Harvest and lesson capture with history-derived recommendations
- Expandable older history and resilient plant-image fallbacks

## Customer-facing announcement draft

Garden.io is becoming a living garden notebook. Notes, completed care, photos,
and harvest outcomes now stay connected to the right garden, place, bed, or
plant. You can review what happened, ask what changed, and carry useful lessons
into the next season without mixing past work with what still needs attention.

## Suggested social copy

Your garden remembers more than a task list. Garden.io now brings together
observations, completed care, seasonal photos, and harvest outcomes—so the next
answer can build on what actually happened in your garden.

## QA status

Feature-scoped deterministic and Chromium journeys are covered in
`docs/qa/2026-09-03-garden-memory-finish-line.md`. Production deployment and
public-route checks are recorded in
`docs/qa/2026-09-28-garden-memory-release-closeout.md`. Neither local nor public
route checks establish canonical-database state, authenticated hosted behavior,
live OpenAI grounding, signed-photo delivery, or customer visibility.

## Known limitations

- Season labels currently use calendar seasons rather than a garden-specific
  hemisphere policy.
- Real signed-photo delivery still needs authenticated hosted acceptance.
- Database schema and authenticated persistence still need verification before
  calling the complete Garden Memory workflow accepted.

## Assets

Existing reusable screenshots are in
`docs/release-notes/assets/2026-07-07-today-memory-strip/`. New launch graphics
are deferred until authenticated hosted acceptance is complete.
