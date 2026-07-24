# Iteration 565 copy simplification pass

Scope: complete the requested three broad copy passes across the homepage, Today/Ask flow, and Weekly care without adding new complexity.

Changed:
- Weekly care now summarizes the week as `3 things need care this week` instead of `care notes this week`.
- Calendar empty states now talk about care plans and what needs care, not note records.
- Homepage lead now says `Note what changed. Ask what it means. Remember what worked.`
- Homepage plant examples now read like garden journal entries, with journal-style plant image alt text instead of botanical-plate/catalogue language.
- Today/Ask and plant diagnose copy now explain the AI value in plain user language: a note or photo makes the answer more specific.
- App/tour/auth entry subtitles now align on `Add what changed. Ask what it means.`

Evidence:
- Browser check at `/` confirmed the new homepage lead, old homepage lead absent, no horizontal overflow, and journal-style plant imagery.
- Browser check at `/tour/ask` confirmed `Add what changed. Ask what it means.`, `A note or photo makes the answer more specific.`, old `Keep what helped`/`Keep it where it belongs` copy absent, and no horizontal overflow.
- Browser check at `/tour/calendar` confirmed `3 things need care this week`, old `care notes this week` absent, and no horizontal overflow.
- Screenshots and route JSON saved in `iteration-565/`.

Verification:
- Focused copy tests passed from the website package: 6 files, 35 tests.
- Full `npm test` passed from the website package: 23 files, 132 tests.
- `npm run build` passed from the website package.
- `git diff --check` passed.

Limit:
- This completes the requested maximum-three sweeping passes for this turn. The larger active goal is still not fully complete; broader signed-in state QA and a manual keyboard/accessibility walkthrough remain.
