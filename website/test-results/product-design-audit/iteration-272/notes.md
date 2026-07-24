## Iteration 272 update

Current-state finding:
- The older hero direction in the screenshot, `Ask your garden` and `Know what to do next`, was too generic and too detached from the garden journal direction.
- The homepage had already been simplified, but the supporting copy still felt like a feature explanation in places.
- The featured homepage plants used bright photo-like choices that competed with the notebook/specimen design preference.
- The app ask surface and auth gate needed to echo the same simple promise as the homepage.

Changes implemented:
- Centered the public homepage on `Your garden, smarter.`
- Rewrote the hero support copy to explain the user value in one simple promise: start with a bed or plant, add notes and photos, then get answers that already know the garden.
- Replaced the homepage plant showcase with quieter botanical plate style bucket images: Apple, Bay leaf, and Bell Pepper.
- Rewrote the homepage loop into three user-facing steps: `Map your garden`, `Save quick notes`, and `Ask what to do next`.
- Updated the auth entry copy to match the same promise.
- Updated the ask surface lead to `Add what you are seeing. Get one clear next step based on your plants, beds, and season.`
- Updated app and sample-preview subtitles plus regression tests to protect the new wording.

Updated health after implementation:
- The homepage now communicates the product in roughly three seconds: a garden journal that makes future answers smarter.
- The visual system now leans toward botanical notebook plates instead of bright full-color garden photos.
- The auth and ask states use the same user-facing language as the homepage.
- The old `Ask your garden` / `Know what to do next` wording is absent from rendered routes.

Evidence:
- Focused tests passed: `homepage-content.test.ts`, `auth-gate-content.test.ts`, `ai-first-garden-home.test.tsx`, and `sample-garden.test.ts`, 4 files, 23 tests.
- Full `npm test` passed: 23 test files, 124 tests.
- `npm run build` passed with Next.js production build.
- Route scan confirmed `/`, `/app?auth=sent`, `/app?auth=invalid_email`, and `/sample-garden/ask` returned 200 after redirects.
- Route scan confirmed `/app?auth=sent` preserves the sent state at `/app/my-property?auth=sent`.
- Route scan found `Your garden, smarter` and no `Know what to do next` on checked routes.
- Screenshots captured:
  - `01-homepage.png`
  - `02-auth-sent-state.png`
  - `03-sample-ask.png`
- Screenshot dimensions verified at 1280 by 900.
- Preview remains running at `http://127.0.0.1:3021`.

Evidence limits:
- This pass did not verify real external email delivery.
- This pass did not create a real signed-in Supabase account from the browser.
- Chrome headless wrote the screenshots but needed manual interruption after each capture because the process hung after writing the file.
