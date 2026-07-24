import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("app flow visual layout", () => {
  it("keeps the homepage hero focused on the user outcome", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

    expect(css).toContain(".home-hero h1 {");
    expect(css).toContain("max-width: 12ch;");
    expect(css).not.toContain(".home-hero h1 {\n  max-width: 10ch;");
  });

  it("keeps desktop plant cards wide enough to scan as records", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

    expect(css).toContain(".garden-plants2-card-grid {");
    expect(css).toContain("grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));");
    expect(css).not.toContain("grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));");
  });

  it("keeps the Plants mobile guide compact before the plant list", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

    expect(css).toContain("@media (max-width: 760px)");
    expect(css).toContain(".garden-plants2-drawer {");
    expect(css).toContain("order: -1;");
    expect(css).toContain(".garden-plants2-drawer .garden-drawer__scope {");
    expect(css).toContain("display: none;");
    expect(css).toContain(".garden-plants2-empty-guide {");
    expect(css).toContain("gap: 0.5rem;");
    expect(css).not.toContain(".garden-plants2-empty-guide__focus");
  });

  it("keeps My Garden layout first on phones while preserving desktop columns", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

    expect(css).toContain(".garden-plot {\n  grid-column: 1;");
    expect(css).toContain("grid-row: 1;");
    expect(css).toContain(".garden-drawer {\n  grid-column: 2;");
    expect(css).toContain("grid-row: 1;");
    expect(css).toContain(".garden-property-guide__focus {");
    expect(css).toContain("border-block: 1px dotted rgba(94, 74, 46, 0.24);");
    expect(css).toContain(".garden-plot,\n  .garden-drawer {\n    grid-column: auto;");
    expect(css).toContain("grid-row: auto;");
    expect(css).toContain("@media (max-width: 760px)");
    expect(css).toContain(".garden-property .garden-drawer {");
    expect(css).not.toContain(".garden-property .garden-drawer {\n    order: -1;");
    expect(css).toContain(".garden-property .garden-drawer__scope {");
    expect(css).toContain("display: none;");
    expect(css).toContain(".garden-property .garden-drawer__section {");
    expect(css).toContain("gap: 0.6rem;");
  });

  it("keeps mobile Plants records compact while preserving journal-style plant images", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

    expect(css).toContain(".garden-plants-thumb__img {");
    expect(css).toContain("object-fit: contain;");
    expect(css).toContain("object-position: center;");
    expect(css).toContain("filter: saturate(1.04) contrast(1.08);");
    expect(css).toContain(".garden-plants2-card__select-btn {\n  display: flex;");
    expect(css).not.toContain(".garden-plants2-card__select-btn {\n  display: contents;");
    expect(css).toContain(".garden-plants2-card .garden-plants-thumb {");
    expect(css).toContain("width: 84px !important;");
    expect(css).toContain("height: 84px !important;");
    expect(css).toContain(".garden-plants-card:not(.garden-plants2-card) .garden-plants-thumb {");
    expect(css).not.toContain("@media (max-width: 520px) {\n  .garden-plants-card {\n    grid-template-columns: 1fr;");
  });

  it("keeps mobile app controls visibly focusable and large enough to target", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

    expect(css).toContain(".garden-app-header__nav {");
    expect(css).toContain(".garden-app-shell h1,\n.garden-app-shell h2,\n.garden-app-shell h3");
    expect(css).toContain(".garden-app-header .journal-shell__brand");
    expect(css).toContain("font-family: var(--font-body), \"Palatino Linotype\", serif;");
    expect(css).toContain("grid-template-columns: repeat(5, minmax(0, 1fr));");
    expect(css).toMatch(/\.garden-app-header__nav a \{[\s\S]*display: inline-flex;[\s\S]*min-height: 40px;/);
    expect(css).toContain(".garden-ai-attachment-button:focus-visible,");
    expect(css).toContain(".garden-ai-attachment-menu button:focus-visible");
    expect(css).toMatch(/\.garden-ai-photo-input \{[\s\S]*width: 0;[\s\S]*height: 0;[\s\S]*overflow: hidden;/);
    expect(css).toMatch(/\.garden-ai-icon-button \{[\s\S]*cursor: pointer;/);
    expect(css).toContain(".garden-ai-icon-button:hover::before,\n.garden-ai-icon-button:hover::after,");
    expect(css).toContain(".garden-ai-icon-button:focus-visible::before,\n.garden-ai-icon-button:focus-visible::after");
    expect(css).toContain(".garden-ai-brand:focus-visible,\n.garden-ai-icon-button:focus-visible");
    expect(css).toContain(".garden-tour-banner {");
    expect(css).toContain("backdrop-filter: blur(10px);");
    expect(css).toContain(".garden-ai-memory-strip {");
    expect(css).toContain(".garden-zone__head {\n  display: flex;");
    expect(css).toContain("min-height: 44px;");
    expect(css).toContain(".garden-bed__head {\n  display: flex;");
    expect(css).toContain("min-height: 40px;");
    expect(css).toMatch(/\.garden-chip \{[\s\S]*min-height: 40px;/);
    expect(css).toMatch(/\.garden-ai-secondary-action button \{[\s\S]*min-height: 40px;/);
    expect(css).toMatch(/\.garden-ai-save-target button \{[\s\S]*min-height: 40px;/);
    expect(css).toMatch(/\.garden-ai-photo-preview button \{[\s\S]*min-height: 40px;/);
    expect(css).toMatch(/\.garden-cal-nav__btn \{[\s\S]*min-height: 40px;/);
    expect(css).toMatch(/\.garden-cal-task-card__action \{[\s\S]*min-height: 40px;/);
    expect(css).toMatch(/\.garden-cal2-nav__btn \{[\s\S]*min-height: 40px;/);
    expect(css).toMatch(/\.garden-plants-chip \{[\s\S]*min-height: 40px;/);
    expect(css).toMatch(/\.garden-plants-chip--bed \{[\s\S]*min-height: 40px;/);
    expect(css).toMatch(/\.garden-plants-card__actions \.folio-button \{[\s\S]*min-height: 40px;/);
    expect(css).toMatch(/\.garden-plants2-view-toggle__btn \{[\s\S]*min-height: 40px;/);
    expect(css).toMatch(/\.garden-cat-expand__toggle \{[\s\S]*min-height: 40px;/);
    expect(css).toMatch(/\.garden-cat-chip \{[\s\S]*min-height: 40px;/);
    expect(css).not.toMatch(/\.garden-cat-sort__select \{[\s\S]*min-height: 40px;/);
    expect(css).toMatch(/\.garden-plants-search \{[\s\S]*min-height: 44px;/);
  });

  it("keeps the setup wizard modal constrained instead of shifting the app layout", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

    expect(css).toContain(".garden-setup-wizard {");
    expect(css).toContain("position: fixed;");
    expect(css).toContain("place-items: center;");
    expect(css).toContain(".garden-setup-wizard__dialog {");
    expect(css).toContain("width: min(100%, 520px);");
    expect(css).toContain("max-height: calc(100vh - 2rem);");
    expect(css).toContain("border-radius: var(--radius-sm);");
    expect(css).toContain("@media (max-width: 640px)");
    expect(css).toContain(".garden-setup-wizard__actions .button,");
  });

  it("keeps this week's care visible before secondary calendar context", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

    expect(css).toContain(".garden-cal2-attention {");
    expect(css).toContain("background: transparent;");
    expect(css).toContain(".garden-cal2-attention__flow,");
    expect(css).toContain(".garden-cal2-attention__subhead {");
    expect(css).toContain(".garden-cal2-attention__cards {");
    expect(css).toContain("grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));");
    expect(css).toContain(".garden-cal2-card--featured {");
    expect(css).not.toContain(".garden-cal2-attention {\n  display: none;");
  });

  it("keeps mobile This Week care cards compact enough to scan", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

    expect(css).toContain("@media (max-width: 640px)");
    expect(css).toContain(".garden-cal2-card__top {");
    expect(css).toContain("grid-template-columns: auto minmax(0, 1fr) auto;");
    expect(css).toContain(".garden-cal2-card__context {");
    expect(css).toContain("overflow-wrap: anywhere;");
    expect(css).toContain(".garden-cal2-upcoming-item__title {");
    expect(css).toContain(".garden-cal2-upcoming-item__ctx {");
    expect(css).toContain("grid-template-columns: 4.2rem minmax(0, 1fr);");
    expect(css).not.toContain(".garden-cal2-card__context {\n  font-size: 0.76rem;\n  color: var(--ink-muted);\n  text-transform: uppercase;");
    expect(css).not.toContain("white-space: nowrap;\n}\n\n.garden-cal2-card__notes");
    expect(css).not.toContain(".garden-cal2-upcoming-item__title {\n  font-size: 0.85rem;\n  font-family: var(--font-label), \"Baskerville\", serif;\n  color: var(--ink);\n  line-height: 1.25;\n  overflow: hidden;");
    expect(css).toContain(".garden-cal2-card__notes {");
    expect(css).toContain("display: none;");
    expect(css).toContain(".garden-cal2-card__footer {");
    expect(css).toContain("margin-left: calc(16px + 0.55rem);");
  });

  it("keeps plant chooser cards focused on planting notes before long prose", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

    expect(css).toContain(".garden-cat-fit-list {");
    expect(css).toContain("grid-template-columns: repeat(2, minmax(0, 1fr));");
    expect(css).toMatch(/\.garden-cat-search:focus-within \{[\s\S]*box-shadow: 0 0 0 3px rgba\(90, 101, 79, 0\.14\);/);
    expect(css).toContain(".garden-cat-fit-list__spot,");
    expect(css).toContain(".garden-cat-fit-list__memory {");
    expect(css).toContain("grid-column: 1 / -1;");
    expect(css).toContain(".garden-cat-card__image-col .catalogue-photo--small {");
    expect(css).toContain("height: clamp(132px, 18vw, 180px);");
    expect(css).toContain("@media (max-width: 760px)");
    expect(css).toContain("grid-template-columns: 96px minmax(0, 1fr);");
    expect(css).toContain("height: 112px;");
    expect(css).toContain(".garden-cat-fit-list__memory {");
    expect(css).toContain(".garden-catalogue-metrics,");
    expect(css).toContain(".garden-cat-expand {");
    expect(css).toContain("display: none;");
  });

  it("keeps the public catalogue mobile entry compact enough to reach plants quickly", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

    expect(css).toContain(".public-catalogue-hero {");
    expect(css).toContain("padding: 0.95rem;");
    expect(css).toContain(".public-catalogue-hero__folio > span:not(.specimen-label) {");
    expect(css).toContain(".public-catalogue-search {");
    expect(css).toContain("min-height: 44px;");
    expect(css).toMatch(/\.catalog-tag \{[\s\S]*min-height: 40px;/);
    expect(css).toMatch(/\.public-catalogue-index-tabs button \{[\s\S]*min-height: 40px;/);
    expect(css).toMatch(/\.public-catalogue-search:focus-within \{[\s\S]*box-shadow: 0 0 0 3px rgba\(90, 101, 79, 0\.14\)/);
    expect(css).toContain(".public-catalogue-workbench {");
    expect(css).toContain("margin-top: 1rem;");
    expect(css).toContain(".public-catalogue-row {");
    expect(css).toContain("grid-template-columns: 90px minmax(0, 1fr);");
    expect(css).toContain(".public-catalogue-row__taxonomy,");
    expect(css).toContain(".public-catalogue-row__body > p {");
    expect(css).toContain(".public-catalogue-row__preview .public-catalogue-photo--small {");
    expect(css).toContain("max-height: 96px;");
    expect(css).toContain("grid-template-columns: repeat(2, minmax(0, 1fr));");
  });
});
