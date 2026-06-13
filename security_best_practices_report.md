# Security Best Practices Report

Date: 2026-03-09
Scope: `/Users/preston/Code/garden.io` (website code + security-relevant SQL/config)
Reviewer: Codex (`security-best-practices` workflow)

## Executive Summary

I found **1 High** and **4 Medium** security issues that should be addressed before broader launch traffic. The most important are:
1. `next` runtime version is in a vulnerable range per advisories detected by `npm audit`.
2. Waitlist endpoint has no server-side abuse controls (rate limiting/challenge), making it easy to automate signups and trigger outbound email abuse.

No tracked plaintext secrets were detected in committed files during this pass.

## Findings by Severity

### High

### SEC-001: Vulnerable `next` version in dependency tree
- Severity: High
- Location:
  - `/Users/preston/Code/garden.io/website/package.json:14`
  - `/Users/preston/Code/garden.io/website/package-lock.json:425`
  - `/Users/preston/Code/garden.io/website/package-lock.json:1625`
- Evidence:
  - `next` is pinned to `^14.2.33` and resolved to `14.2.35`.
  - `npm audit --audit-level=moderate` reports `next` advisories including `GHSA-h25m-26qc-wcjf` (high) and `GHSA-9g9p-9gw9-jx7f`.
- Impact:
  - Remote DoS risk depending on deployment/runtime path; exploitable versions are in your current installed range.
- Fix:
  - Upgrade to a patched, supported Next line (recommended: latest stable, currently 16.x per audit suggestion).
  - Re-run `npm audit` and regression test routing/API behavior.
- Mitigation if upgrade must wait:
  - Restrict exposure with edge WAF/rate-limits and request size limits.

### Medium

### SEC-002: Waitlist API has no rate limiting / abuse guardrails
- Severity: Medium
- Location:
  - `/Users/preston/Code/garden.io/website/app/api/waitlist/route.ts:5`
  - `/Users/preston/Code/garden.io/website/lib/waitlist-service.ts:36`
  - `/Users/preston/Code/garden.io/website/lib/waitlist-mailer.ts:23`
- Evidence:
  - Public POST endpoint accepts repeated requests with no per-IP/per-email throttling.
  - Endpoint triggers outbound email (`Resend` or Supabase OTP) on successful path.
- Impact:
  - Easy scripted abuse can increase provider cost, hurt sender reputation, and potentially trigger provider throttling/suspension.
- Fix:
  - Add server-side rate limits keyed by IP + normalized email.
  - Add bot challenge (Turnstile/hCaptcha) for repeated attempts.
  - Add cooldown windows for repeated email sends to same address.
- Mitigation:
  - Add Vercel edge rate-limits/WAF rules while app-level limits are implemented.

### SEC-003: Unsanitized user input interpolated into HTML email
- Severity: Medium
- Location:
  - `/Users/preston/Code/garden.io/website/lib/waitlist-mailer.ts:7`
  - `/Users/preston/Code/garden.io/website/lib/waitlist-mailer.ts:10`
- Evidence:
  - `name` from user input is inserted directly into HTML body string.
- Impact:
  - HTML injection in email template (unexpected links/markup), which can be abused for deceptive content in confirmation emails.
- Fix:
  - Escape HTML entities in user-controlled strings before interpolation.
  - Prefer templating with automatic escaping.
- Mitigation:
  - Restrict allowed `name` character set to conservative letters/spaces while escaping is added.

### SEC-004: Internal error details are returned to client responses
- Severity: Medium
- Location:
  - `/Users/preston/Code/garden.io/website/lib/waitlist-service.ts:82`
  - `/Users/preston/Code/garden.io/website/lib/waitlist-service.ts:87`
  - `/Users/preston/Code/garden.io/website/app/api/waitlist/route.ts:11`
- Evidence:
  - Raw `error.message` is propagated into JSON response for 500 paths.
- Impact:
  - Information disclosure (provider internals, policy/table details, operational hints) that helps attackers tune abuse attempts.
- Fix:
  - Return generic client-safe messages; log detailed errors server-side with correlation IDs.
- Mitigation:
  - Strip provider/policy/database strings before returning responses.

### SEC-005: Missing baseline security response headers in app config
- Severity: Medium
- Location:
  - `/Users/preston/Code/garden.io/website/next.config.mjs:2`
- Evidence:
  - No explicit security header policy (CSP, frame-ancestors/X-Frame-Options, `X-Content-Type-Options`, `Referrer-Policy`, etc.).
- Impact:
  - Reduced defense-in-depth for XSS/clickjacking/content-type sniffing.
- Fix:
  - Add `headers()` in Next config (or edge platform config) with a baseline policy.
- Mitigation:
  - Apply headers at Vercel edge while app-level config is being added.

## Additional Notes

- `npm audit` also reported moderate dev-tooling issues in `vitest/vite/esbuild`; these are lower production impact but should be upgraded to reduce local/dev exploit surface.
- Waitlist SQL policy (`/Users/preston/Code/garden.io/website/supabase/waitlist.sql`) intentionally allows anonymous inserts. This is acceptable for product behavior but increases abuse risk unless paired with endpoint-level controls.

## Recommended Remediation Order

1. Upgrade `next` to patched version and re-run test/build/audit.
2. Add API abuse controls (rate limiting + cooldown + optional challenge).
3. Sanitize/escape `name` before email HTML rendering.
4. Replace raw client error messages with generic responses + server logging.
5. Add baseline security headers policy.

## Validation Commands Used

- `npm audit --audit-level=moderate --json` (in `website/`)
- Targeted code review of route/mailer/env/repository/config and SQL policy files.
