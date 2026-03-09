import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders core positioning and audience fit statements", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(html).toContain("The living notebook for growers managing real complexity.");
    expect(html).toContain("Built for growers managing living systems.");
    expect(html).toContain("Best fit right now");
    expect(html).toContain("Not the focus today");
  });

  it("renders both conversion CTAs and disclosure boundary", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(html).toContain("Request Early Access");
    expect(html).toContain("Join the Waitlist");
    expect(html).toContain("What we share publicly vs what we keep private before launch");
  });

  it("includes source-backed market signal section", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(html).toContain("The audience is large, active, and ready for better planning tools.");
    expect(html).toContain("80%");
    expect(html).toContain("61%");
    expect(html).toContain("33M+");
  });
});
