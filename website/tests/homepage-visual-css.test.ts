import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("homepage visual spacing", () => {
  it("keeps the simplified hero compact enough to reveal the next section cleanly", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

    expect(css).toContain(".home-hero {");
    expect(css).toContain("padding: clamp(0.6rem, 2vw, 1.1rem) clamp(0.1rem, 1vw, 0.5rem) clamp(1.6rem, 3vw, 2.2rem);");
    expect(css).toMatch(/\.home-hero \{[\s\S]*border: 0;/);
    expect(css).toMatch(/\.home-hero \{[\s\S]*border-bottom: 1px solid var\(--line\);/);
    expect(css).toMatch(/\.home-hero \{[\s\S]*background: transparent;/);
    expect(css).toMatch(/\.home-hero \{[\s\S]*box-shadow: none;/);
    expect(css).toMatch(/\.home-hero::before \{[\s\S]*display: none;/);
    expect(css).toContain("min-height: clamp(340px, 34vw, 470px);");
    expect(css).toContain(".home-hero__media {");
    expect(css).toContain("padding: clamp(0.7rem, 1.8vw, 1rem);");
    expect(css).toContain(".home-hero__photo {");
    expect(css).toContain("object-fit: contain;");
    expect(css).toContain("object-position: center;");
    expect(css).toMatch(/\.home-hero__photo \{[\s\S]*filter: saturate\(0\.78\) contrast\(0\.96\);/);
    expect(css).toMatch(/\.home-hero__photo \{[\s\S]*padding: clamp\(0\.45rem, 1\.2vw, 0\.85rem\);/);
    expect(css).toContain(".home-plant-card__image {");
    expect(css).toMatch(/\.home-plant-card__image \{[\s\S]*filter: saturate\(0\.78\) contrast\(0\.96\);/);
    expect(css).toMatch(/\.home-plant-card__image \{[\s\S]*object-fit: cover;/);
    expect(css).not.toMatch(/\.home-plant-card__image \{[\s\S]*padding: 0\.6rem;/);
    expect(css).toMatch(/\.home-plant-card \{[\s\S]*scroll-margin-block: 1rem;/);
    expect(css).toMatch(/\.home-plant-card:focus-visible \{[\s\S]*outline: 2px solid var\(--olive\);/);
    expect(css).toContain(".home-loop {");
    expect(css).toContain("margin-top: var(--space-4);");
    expect(css).toContain("padding-top: var(--space-4);");
    expect(css).not.toContain("min-height: clamp(420px, 42vw, 560px);");
    expect(css).not.toContain(".home-hero__photo {\n  width: 100%;\n  height: 100%;\n  min-height: inherit;\n  object-fit: cover;");
  });

  it("keeps the mobile homepage first screen focused on one primary path", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

    expect(css).toContain(".site--marketing .topbar__actions {");
    expect(css).toContain("display: none;");
    expect(css).toMatch(/\.topnav a \{[\s\S]*min-height: 40px;/);
    expect(css).toContain(".home-hero .cover-sheet__actions {");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr);");
    expect(css).toContain(".home-hero .cover-sheet__actions .folio-link--secondary {");
    expect(css).toContain("width: fit-content;");
    expect(css).toContain("min-height: 40px;");
    expect(css).toContain("background: transparent;");
    expect(css).toContain(".home-hero__media {");
    expect(css).toContain(".home-fit-note {");
    expect(css).toContain("display: none;");
    expect(css).toContain("height: 300px;");
    expect(css).toContain("min-height: 0;");
    expect(css).toContain(".home-hero__photo {");
    expect(css).not.toContain("min-height: 330px;");
  });
});
