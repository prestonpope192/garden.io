import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders core positioning and audience fit statements", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(html).toContain("The living notebook for growers managing real complexity.");
    expect(html).toContain("Built for growers managing living systems, not ornamental chores.");
    expect(html).toContain("Multi-bed home growers");
    expect(html).toContain("Homesteaders");
  });

  it("renders plant catalogue entry points and waitlist CTA", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(html).toContain("Request Early Access");
    expect(html).toContain("Browse Plant Catalog");
    expect(html).toContain("The public plant catalogue is designed as an open front door");
  });

  it("describes product features as real product surfaces", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(html).toContain("What it does");
    expect(html).toContain("My Property");
    expect(html).toContain("Calendar");
    expect(html).toContain("Plant Catalogue");
  });
});
