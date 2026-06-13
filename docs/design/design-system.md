# Garden.io Design System

The Garden.io visual language is a **grower's field notebook** — a 19th-century botanical herbarium that also functions as a planning system. Every design decision should feel like it belongs in a well-worn, cherished object: warm parchment, aged ink, pressed specimen plates, handwritten margin notes, and a ledger-like structure for data.

---

## Design Principles

1. **Warm over clinical** — No white backgrounds, no pure black text. Everything has the warmth of paper and ink.
2. **Structure from the page, not the grid** — Layouts reference the physical spread of a journal: left page / right page, folio numbers, ruled dividers.
3. **Calm over urgent** — No loud CTAs, no aggressive color. Actions feel like turning a page, not clicking a button.
4. **Analog references, digital behavior** — The aesthetic is 19th century; the usability is contemporary.

---

## Tokens

All tokens live in `:root` in `website/app/globals.css`.

### Color

| Token | Value | Use |
|---|---|---|
| `--paper` | `#f6f1e7` | Page background |
| `--paper-soft` | `#fbf7ef` | Elevated surfaces |
| `--paper-shadow` | `#e8dfc9` | Subtle dividers |
| `--paper-deep` | `#cbbfa1` | Heavy borders, inactive fills |
| `--paper-inkwash` | `#efe6d3` | Tinted inset areas |
| `--ink` | `#2b2b2b` | Body text, primary content |
| `--ink-soft` | `#6c5a3a` | Secondary text, captions |
| `--ink-muted` | `#867454` | Tertiary text, labels, metadata |
| `--olive` | `#5a654f` | Active/selected state, positive |
| `--olive-soft` | `#d8decc` | Olive tint fills |
| `--clay` | `#7b6045` | Labels, kickers, warm accent |
| `--clay-soft` | `#e6d7c6` | Clay tint fills |
| `--berry` | `#714d4d` | Error states |
| `--gold` | `#a78545` | Seasonal/lifecycle accents |
| `--line` | `rgba(94,74,46,0.24)` | Default borders |
| `--line-strong` | `rgba(94,74,46,0.42)` | Emphasized borders, hover states |

**Contrast note:** `--ink-soft` on `--paper` passes WCAG AA only at 18px+. Use `--ink` for any text under 16px.

### Semantic Surfaces

Pre-composed gradient tokens for the paper surface system. Use these instead of writing gradients inline.

| Token | Use |
|---|---|
| `--surface-page` | Main content area (warm editorial white) |
| `--surface-panel` | Card/panel face (slightly lifted) |
| `--surface-inset` | Inner slots, list items, unselected states |
| `--surface-inset-active` | Selected/active list item fill |

### Typography

Fonts load via `next/font/google` in `website/app/layout.tsx`.

| Token | Font | Use |
|---|---|---|
| `--font-label` | Ibarra Real Nova | Headings (h1–h3), navigation, labels, specimen labels |
| `--font-body` | EB Garamond | Body copy, paragraph text, captions |
| `--font-script` | Caveat | Handwritten accents: kickers, margin note heads, folio numbers, annotation labels |

**Type scale** (defined on `h1`/`h2`/`h3` globally):
- `h1`: `clamp(2.4rem, 6vw, 5.15rem)` · max 14ch · line-height 1.08
- `h2`: `clamp(1.7rem, 4.6vw, 3rem)` · max 22ch
- `h3`: `clamp(1.18rem, 3vw, 1.7rem)`
- Lead paragraph: `clamp(1.05rem, 2vw, 1.28rem)` · `.lead`
- Small labels: `0.79rem` · uppercase · `letter-spacing: 0.08em`

### Spacing

| Token | Value |
|---|---|
| `--space-1` | `0.45rem` |
| `--space-2` | `0.75rem` |
| `--space-3` | `1rem` |
| `--space-4` | `1.5rem` |
| `--space-5` | `2rem` |
| `--space-6` | `3rem` |
| `--space-7` | `4rem` |

### Border Radius

Use the scale tokens. Do not introduce arbitrary `border-radius` values.

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `8px` | Small utility elements: search inputs, filter chips, tight insets |
| `--radius-md` | `16px` | Standard inputs, notice boxes, small cards |
| `--radius-lg` | `22px` | Panels, annotation cards, rail items |
| `--radius-xl` | `28px` | Major containers: journal shell, app rail/main |
| `--radius-2xl` | `36px` | Hero cover sheet, top-level page cards |
| `--radius-pill` | `999px` | Pill buttons, tags, status chips |

### Motion

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | `160ms` | Microinteractions (color shifts) |
| `--duration-base` | `220ms` | Most transitions (hover, focus) |
| `--duration-slow` | `360ms` | Layout shifts, panels opening |
| `--ease-out` | `cubic-bezier(0.2,0,0,1)` | All transitions |

### Breakpoints

Defined as media queries in the CSS (not token variables). Two breakpoints:

| Name | Width | What changes |
|---|---|---|
| `tablet` | `760px` | Two-column layouts activate (cover-sheet, section-card split, journal-spread, topbar) |
| `desktop` | `1080px` | Three-column layouts activate (folio-workspace, public-catalogue-workbench, property-browser) |

Mobile is the default single-column stack.

---

## Shadows

| Token | Use |
|---|---|
| `--shadow-paper` | `0 28px 60px rgba(75,57,33,0.14)` — Major cards, panels |
| `--shadow-note` | `0 16px 32px rgba(75,57,33,0.11)` — Secondary cards, navigation |

---

## Components

### SpecimenLabel
Small uppercase label with tracked serif lettering. The primary categorization/section marker.

```tsx
<SpecimenLabel>Public folio</SpecimenLabel>
<SpecimenLabel tone="olive">What it does</SpecimenLabel>
<SpecimenLabel tone="clay">Who it's for</SpecimenLabel>
```

| Prop | Values | Default |
|---|---|---|
| `tone` | `"default"` · `"olive"` · `"clay"` | `"default"` |

**Use for:** section kickers, card eyebrows, status indicators. Do not use for body labels — that's what `--font-label` heading styles are for.

---

### PlateCard
A botanical specimen plate with folio number, ruled separator, illustration area, and body content.

```tsx
<PlateCard plateNumber="17" title="Cherokee Purple Tomato" subtitle="Public catalog profile" illustration={<img … />}>
  <dl className="detail-list">…</dl>
</PlateCard>
```

**Use for:** hero plant illustrations on marketing/catalog, featured plant records in the app. One PlateCard per editorial section.

---

### MarginNote
A handwritten-style aside with Caveat font header and dashed border.

```tsx
<MarginNote icon="sprout" title="Public plant catalogue">
  <p>Browse profiles without logging in…</p>
</MarginNote>
```

**Use for:** contextual explanations alongside main content, not for primary information. The dashed border and script font signal "aside" semantics.

---

### InkStamp
A rotated pill with double border — evokes a rubber stamp or date mark.

```tsx
<InkStamp tone="charcoal">3/6 ready</InkStamp>
<InkStamp tone="olive">Beta access</InkStamp>
```

**Use for:** status badges, counts, section markers that need visual contrast with surrounding labels. Use sparingly — one per view is usually enough.

---

### JournalPage / JournalSpread / JournalShell
The authenticated app layout system. `JournalShell` wraps a view; `JournalSpread` creates the two-page layout; `JournalPage` is a single page.

```tsx
<JournalShell currentPath="/app/my-property">
  <JournalSpread layout="feature-left">
    <JournalPage side="left" folio="01" label="My Property" title="Oak Orchard" variant="ledger">
      {/* list/nav content */}
    </JournalPage>
    <JournalPage side="right" folio="02" label="Zone Detail" title="South Beds" variant="editorial">
      {/* detail content */}
    </JournalPage>
  </JournalSpread>
</JournalShell>
```

**Layouts:** `"balanced"` (50/50), `"feature-left"` (55/45), `"feature-right"` (45/55)
**Variants:** `"standard"`, `"editorial"` (warmer white), `"ledger"` (cooler, ruled-feeling)

---

## Buttons

Three button classes exist. Use them semantically:

| Class | Appearance | Use |
|---|---|---|
| `.button` | Warm parchment pill, `--line-strong` border, min 48px | **Primary action** in forms and panels (Save, Submit, Complete) |
| `.folio-button` | Lighter parchment pill, standard border, min 46px | **Secondary action** alongside a primary (Add, Archive, Restore) |
| `.folio-link` | Gradient parchment pill, same border, as `<a>` | **Navigation CTA** — links that look like buttons (Browse Catalog, Request Access) |

All three share the hover transform (`translateY(-1px)`) and transition via the shared selector group.

**Do not mix** `.button` and `.folio-button` in the same action group for the same importance level. If two equal-weight actions sit side by side, use `.folio-button` for both.

---

## App Shell (Authenticated)

The authenticated app at `/app/*` uses the `beta-*` CSS namespace. As of the June 2026 design system update, these classes use the same surface tokens and radius scale as the journal system:

- `beta-app-header` — sticky nav bar with `--surface-panel` gradient and journal-style active tab treatment
- `beta-app-rail` — sticky sidebar with `--radius-xl`, `--surface-panel` background
- `beta-app-main` — main content area with `--radius-xl`, `--surface-page` background
- `beta-panel` — inner content panels with `--radius-lg`, `--surface-panel`
- `beta-list button` — list items use `--surface-inset` / `--surface-inset-active`, `--radius-md`, olive active state

The beta app shell does **not** yet use `JournalPage`/`JournalSpread` — that migration is the next phase. For now, surface tokens create visual consistency without a full layout rewrite.

---

## Patterns

### Property Hierarchy Navigation
The core spatial navigation pattern: Property → Zone → Bed → Plant. At `<1080px`, rendered as breadcrumb pills. At `≥1080px`, rendered as a vertical left-rail list with full-width buttons.

### Folio Workspace
Three-column layout (`220px rail | flex main | 240px aside`) at `≥1080px`. Used for the public catalogue and planned app views. Classes: `folio-workspace`, `folio-workspace__rail`, `folio-workspace__main`, `folio-workspace__aside`.

### Detail List
Key-value data presented as a ruled list. Label column uses `--font-label` serif; value column right-aligns at desktop, left-aligns at mobile.

```html
<dl class="detail-list">
  <div class="detail-list__row">
    <dt><FieldIcon name="sun" /> Sun</dt>
    <dd>Full sun</dd>
  </div>
</dl>
```

---

## What to Avoid

- **Hardcoded hex colors** — use tokens. Any `rgba(94, 74, 46, …)` inline should use `--line` or `--line-strong` instead.
- **Arbitrary border-radius** — use the radius scale. `border-radius: 12px` is not in the scale (use `--radius-md` or `--radius-lg`).
- **Generic sans-serif for any visible text** — every visible text element should use one of the three font variables.
- **Pure white backgrounds (`#fff`, `rgba(255,255,255,1)`)** — use `--surface-inset` or `--paper-soft` instead. The parchment warmth must be maintained.
- **Blue links** — all links inherit `color: inherit` or use `--ink-soft`. The one exception is hover underlines on nav links.
