# Product Design Audit - Iteration 113

Date: 2026-06-22
Scope: save/remove feedback for plant history.

Capture status: no new screenshots were captured in this pass. Product Design Browser capture was not exposed through available tools, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## User Goal

A gardener should see one consistent idea across the plant flow: save what happened, keep it with the plant, and use that history later. Feedback copy should not expose internal outcome/result vocabulary.

## Finding

After the selected-plant history copy was simplified, mutation feedback and delete warnings still used `Result saved`, `Result removed`, `Result kept`, and `results will be removed`. These phrases were small but broke the plain-language model at the moment a user saves or removes plant history.

## Change

- Save feedback now says `Saved to this plant's history.`
- Remove feedback now says `Removed from this plant's history.`
- Sample preview feedback now uses `Saved to this plant's history.` and `Kept with this plant's history.`
- Plant deletion warning now says saved history will be removed instead of `results`.
- Regression tests now reject the old `Result saved` / `Result removed` copy and the old delete-warning phrase.

## Step Review

1. Save harvest/how-it-went feedback: healthier. It confirms the user's plant history was updated without naming the data model.
2. Remove harvest/how-it-went feedback: healthier. It uses the same history language as the timeline.
3. Plant delete warning: healthier. It explains the consequence in user terms.
4. Public and signed-out routes: healthy. Rendered route scan still avoids stale launch/beta/product and result-copy markers.

## Verification

- Focused tests passed: `garden-mutation-copy.test.ts`, `empty-state-content.test.ts`, `plant-timeline-content.test.ts`, and `sample-garden.test.ts`, 4 files, 19 tests.
- Full `npm test` passed: 18 files, 86 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes.

## Evidence Limit

No screenshot-backed visual audit was completed in this pass. The feedback-copy behavior is verified through constants, source-level regression checks, component rendering tests, and rendered public route HTML. Signed-in click-through toast behavior still needs browser-backed interaction testing when capture is available or Playwright is approved.
