import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("mobile layout safety", () => {
  it("keeps primary entry surfaces from clipping controls on phone screens", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

    expect(css).toContain("@media (max-width: 759px)");
    expect(css).toContain("width: min(var(--max-width), calc(100% - 1rem));");
    expect(css).toContain(".cover-sheet__actions,");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr);");
    expect(css).toContain(".cover-sheet__actions .folio-link,");
    expect(css).toContain(".public-catalogue-filter-summary__actions .folio-link");

    expect(css).toContain("@media (max-width: 760px)");
    expect(css).toContain(".garden-auth__panel");
    expect(css).toContain("max-width: 100%;");
    expect(css).toContain(".garden-auth__first-steps");
    expect(css).toContain("grid-template-columns: 1fr;");
    expect(css).toContain(".garden-app-header__identity");
    expect(css).toContain("grid-template-areas:");
    expect(css).toContain('"brand action"');
    expect(css).toContain('"nav nav"');
    expect(css).toContain(".garden-app-header__account .folio-button");
    expect(css).toContain("font-size: 1.55rem;");
    expect(css).toContain("min-height: 40px;");
    expect(css).toContain("font-size: 0.72rem;");
    expect(css).toContain("min-height: 40px;");
    expect(css).toContain("font-size: 0.78rem;");
    expect(css).toContain("overflow-x: visible;");
    expect(css).not.toContain("flex: 1 1 calc(50% - 0.45rem);");
    expect(css).toContain(".garden-app-title {");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr) auto;");
    expect(css).toContain("font-size: clamp(2.2rem, 11vw, 2.9rem);");
    expect(css).toContain(".garden-app-title .ink-stamp");
    expect(css).toContain("max-width: 8.5rem;");
    expect(css).toContain(".garden-ai-home {");
    expect(css).toContain("min-height: calc(100dvh - 63px);");
    expect(css).toContain(".garden-ai-composer textarea {");
    expect(css).toContain("min-height: 145px;");
    expect(css).toContain("padding: 0.95rem;");
    expect(css).toContain(".garden-ai-answer {");
    expect(css).toContain("padding: 0.9rem;");
    expect(css).toContain(".garden-ai-answer__summary {");
    expect(css).toContain("font-size: clamp(1.55rem, 9vw, 2.15rem);");
    expect(css).toContain(".garden-ai-secondary-action {");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr);");
    expect(css).toContain(".garden-ai-followup,");
    expect(css).toContain(".garden-ai-why summary,");
    expect(css).toContain(".garden-ai-more-checks summary,");
    expect(css).toContain(".garden-ai-more-checks .garden-ai-secondary-actions,");
    expect(css).toContain("padding-inline: 0.72rem;");
    expect(css).toContain(".garden-ai-save-target {");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr);");
    expect(css).toContain("overflow-wrap: anywhere;");
    expect(css).toContain(".garden-ai-save__actions {");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr);");
    expect(css).not.toContain("font-size: 2.45rem;");
  });

  it("allows grid children and pill controls to shrink before their parent overflows", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

    expect(css).toContain(".cover-sheet__copy,");
    expect(css).toContain(".garden-flipbook {");
    expect(css).toContain("min-width: 0;");
    expect(css).toContain(".folio-button,");
    expect(css).toContain(".folio-link {");
    expect(css).toContain("display: inline-flex;");
    expect(css).toContain("max-width: 100%;");
  });
});
