# Iteration 88 - Calendar Copy Simplification

Date: 2026-06-21
Surface: Garden calendar / weekly care flow
Goal: Make the calendar feel like a calm care list that answers "what should I do next?" instead of a scheduling dashboard.

## Current-State Finding

- The calendar was functionally useful, but some copy still sounded like interface mechanics: filters, task management, due-date scheduling, and attention states.
- First-time empty calendar copy promised care reminders before the user had added a plant, which skipped the user's actual first step.
- The weekly focus card said `Needs attention`, which is understandable but less direct than telling the user where to start.
- Seasonal guidance included unused `SEASON_SIGNALS` copy in code. It did not render, but it kept older intelligence/signal wording around a user-facing surface.

## Changes Implemented

- Reframed the weekly focus section:
  - `Needs attention` -> `Start here`
  - `Nothing needs attention this week.` -> `Nothing urgent this week.`
  - `task(s) this week` -> `thing(s) this week`
- Simplified task actions:
  - `Reschedule +1 week` -> `Move one week later`
  - `+1 wk` -> `+1 week`
  - `View in garden` / `Open` -> `See place`
- Simplified task filtering:
  - `Filters` -> `Show only`
  - `All upcoming care` -> `Everything coming up`
  - `Clear filters` -> `Show everything`
  - `Filter tasks` -> `Choose what to show`
- Simplified undated-task copy:
  - `Needs a date` -> `Choose a date`
  - `pick a date` -> `No date yet`
- Simplified task creation:
  - `Add a task` -> `Add something to do`
  - Kept `What needs doing?` and `When` as short gardener-facing field labels.
- Rewrote empty calendar setup copy to start with the user's first action:
  - `Add one plant first. Then this page can show what needs watering, pruning, harvesting, or checking.`
  - CTA is now `Add plants`.
- Reworked seasonal guidance to be shorter and more practical, with a `This season` heading and plain bullets.
- Removed unused `SEASON_SIGNALS` copy.
- Updated sample and empty-state tests to guard against the old dashboard language returning.

## Updated Health

- The calendar now reads more like a simple care list than a task management dashboard.
- The sample garden calendar better demonstrates the app's core value: it tells a prospective user where to start, what is coming up, and what the garden suggests next.
- First-time users now see the true first step before care work appears: add one plant.
- No behavior or data model changes were introduced in this pass.

## Evidence

- Product Design audit skill and critical overrides were loaded.
- Product Design user-context preflight ran and found no saved Product Design context.
- Focused tests passed: `empty-state-content.test.ts`, `sample-garden.test.ts`, and `quick-log-content.test.ts`, 3 files, 13 tests.
- Full `npm test` passed: 17 test files, 78 tests.
- `git diff --check` passed for the touched files.
- `npm run build` passed with a Next.js production build.
- Rendered route scan passed for `/`, `/sample-garden`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, `/app/my-property`, `/app/my-plants`, and `/app/calendar`.
- Rendered route scan found no hits for removed beta/product/dashboard phrases including `All upcoming care`, `Filter tasks`, `Needs attention`, `Nothing needs attention this week`, `Open Garden Map`, `care reminders will appear here`, `Task title`, `Due date`, `WeatherIQ`, or `HarvestIQ`.

## Evidence Limits

- No accepted screenshots were captured in this pass. Browser and Chrome screenshot capture were unavailable in this environment, and Product Design audit rules require asking before using Playwright as a screenshot fallback.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.

## Next Opportunity

Review the remaining logged-in surfaces for the same problem: any label that describes the app's internal object model instead of the gardener's next action should be simplified or removed.
