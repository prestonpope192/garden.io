import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  AuthGate,
  SIGN_IN_SENT_MESSAGE,
  SIGN_IN_UNAVAILABLE_MESSAGE
} from "@/components/auth-gate";

describe("AuthGate content", () => {
  it("uses user-facing copy for unavailable sign-in states", () => {
    const html = renderToStaticMarkup(
      createElement(AuthGate, {
        authResult: {
          status: "error",
          message: SIGN_IN_UNAVAILABLE_MESSAGE
        },
        children: () => null
      })
    );

    expect(html).toContain("We can&#x27;t open your garden right now.");
    expect(html).not.toContain("We can&#x27;t open garden questions right now.");
    expect(html).toContain("Start your garden");
    expect(html).toContain("Your garden, smarter");
    expect(html).toContain("Save what you notice. Get care advice that remembers your plants.");
    expect(html).not.toContain("Remember what you planted, what changed, and what to do next in one calm garden notebook.");
    expect(html).not.toContain("Keep plants, notes, photos, and care together in one calm garden notebook.");
    expect(html).not.toContain("Keep each plant, place, note, photo, and care plan in one calm garden notebook.");
    expect(html).not.toContain("Keep each plant, place, note, photo, and care step in one calm garden notebook.");
    expect(html).not.toContain("A calm garden notebook for what you planted, where it lives, what changed, and what needs care next.");
    expect(html).not.toContain("what to care for now");
    expect(html).not.toContain("A simple garden journal that remembers");
    expect(html).not.toContain("care gets clearer every season");
    expect(html).not.toContain("Garden.io helps you understand what changed, what matters, and what to do next");
    expect(html).not.toContain("Garden.io helps you spot what changed, remember what worked, and care with more confidence");
    expect(html).toContain("Start with one plant.");
    expect(html).toContain("Name where it grows so notes, photos, and care can stay together.");
    expect(html).not.toContain("Choose where it grows so notes and answers stay where they belong.");
    expect(html).not.toContain("Choose where it grows so notes stay where they belong.");
    expect(html).not.toContain("Choose where it grows so notes stay with the right spot.");
    expect(html).not.toContain("Add one plant to begin.");
    expect(html).not.toContain("Give one plant a bed so notes stay with the right spot.");
    expect(html).not.toContain("Future checks remember it");
    expect(html).not.toContain("Put it in a bed once");
    expect(html).not.toContain("Notes, photos, and care stay connected after that");
    expect(html).not.toContain("Start with one garden note");
    expect(html).toContain("Enter your email.");
    expect(html).toContain("send a link to start your garden");
    expect(html).not.toContain("send a link to open your garden");
    expect(html).not.toContain("send a no-password garden link");
    expect(html).not.toContain("Your first plant gives the notebook a place to begin");
    expect(html).not.toContain("Enter your email to start your garden notebook.");
    expect(html).not.toContain("send a link back");
    expect(html).not.toContain("No password needed");
    expect(html).toContain("Email address");
    expect(html).toContain("Email me a start link");
    expect(html).not.toContain("Send garden link");
    expect(html).not.toContain("Send my garden link");
    expect(html).toContain("Tour a garden journal");
    expect(html).toContain("/tour");
    expect(html).not.toContain("/sample-garden");
    expect(html).not.toContain("Browse an example garden");
    expect(html).not.toContain("See a sample garden");
    expect(html).not.toContain(">Tour a garden</a>");
    expect(html).toContain("Choose plants");
    expect(html).not.toContain("Find plants that fit");
    expect(SIGN_IN_UNAVAILABLE_MESSAGE).toContain("tour a garden journal");
    expect(SIGN_IN_UNAVAILABLE_MESSAGE).not.toContain("browse an example garden");
    expect(SIGN_IN_UNAVAILABLE_MESSAGE).not.toContain("see a sample garden");
    expect(SIGN_IN_UNAVAILABLE_MESSAGE).toContain("choose plants for the beds you have");
    expect(SIGN_IN_UNAVAILABLE_MESSAGE).not.toContain("choose plants for your light, water, and beds");
    expect(SIGN_IN_UNAVAILABLE_MESSAGE).not.toContain("find plants that fit");
    expect(SIGN_IN_UNAVAILABLE_MESSAGE).not.toContain("Sign-in");
    expect(SIGN_IN_UNAVAILABLE_MESSAGE).not.toContain("start your garden");
    expect(html).not.toContain("Look around");
    expect(SIGN_IN_UNAVAILABLE_MESSAGE).not.toContain("look around");
    const source = readFileSync(new URL("../components/auth-gate.tsx", import.meta.url), "utf8");
    expect(source).toContain("Enter your email to start your garden.");
    expect(source).toContain('aria-label="Why start a garden notebook"');
    expect(source).not.toContain("Enter your email to ask about your garden.");
    expect(source).not.toContain("Enter your email to open your garden.");
    expect(source).not.toContain("start your garden memory");
    expect(source).not.toContain('aria-label="Why start a garden memory"');
    expect(html).not.toContain("Garden help with memory");
    expect(html).not.toContain("Ask once. Build memory as you go");
    expect(html).not.toContain("Ask about what you see");
    expect(html).not.toContain("Add a photo if it helps");
    expect(html).not.toContain("Save the useful next step");
    expect(html).not.toContain("send a link back to this page");
    expect(html).not.toContain("Your garden, remembered");
    expect(html).not.toContain("Know what to do next");
    expect(html).not.toContain("Snap a photo, ask a question");
    expect(html).not.toContain("Garden.io keeps your plants");
    expect(html).not.toContain("save the answer with the plant, bed, or season it belongs to");
    expect(html).not.toContain("Save the useful answer when you want the garden to remember it");
    expect(html).not.toContain("Start with one garden note");
    expect(html).not.toContain("future answers more context");
    expect(html).not.toContain("do not have to explain the same garden again");
    expect(html).not.toContain("Ask with a quick note or photo");
    expect(html).not.toContain("Ask first. Save what matters");
    expect(html).not.toContain("Keep the care step");
    expect(html).not.toContain("name your garden so notes, plants, and care have a place to go");
    expect(html).not.toContain("Start with the garden you have");
    expect(html).not.toContain("Start by naming your garden");
    expect(html).not.toContain("First, make one place for the season");
    expect(html).not.toContain("Save beds, plants, photos, notes, and next care");
    expect(html).not.toContain("Keep photos, notes, and next care together");
    expect(html).not.toContain("Send my link");
    expect(html).not.toContain("Email me my garden link");
    expect(html).not.toContain("sign-in link");
    expect(html).not.toContain("Email me a secure link");
    expect(html).not.toContain("email a secure link back to your garden");
    expect(html).not.toContain("No password to remember");
    expect(html).not.toContain("secure garden link");
    expect(html).not.toContain("Open your garden");
    expect(html).not.toContain("Start or sign in");
    expect(html).not.toContain("Explore plants");
    expect(html).not.toContain("AI suggestions");
    expect(html).not.toContain("care reminders");
    expect(html).not.toContain("onboarding");
    expect(html).not.toContain("Supabase");
    expect(html).not.toContain("environment variables");
    expect(html).not.toContain("not configured");
    expect(html).not.toContain("private link");
    expect(html).not.toContain("private-beta");
    expect(html).not.toContain("Your first plant gives the garden context");
  });

  it("tells users what to do after a sign-in link is sent", () => {
    const html = renderToStaticMarkup(
      createElement(AuthGate, {
        authResult: {
          status: "sent",
          message: SIGN_IN_SENT_MESSAGE
        },
        children: () => null
      })
    );

    expect(html).toContain(SIGN_IN_SENT_MESSAGE);
    expect(html).toContain("Check your email, then give one plant a home");
    expect(html).not.toContain("Check your email, then add one plant to begin");
    expect(html).not.toContain("Use the garden link, then add one plant to begin");
    expect(html).not.toContain("Open the garden link, then add one plant to begin");
    expect(html).not.toContain("Open the garden link, then start with one bed or plant");
    expect(html).toContain("Your garden, smarter");
    expect(html).toContain("Email me a start link");
    expect(html).not.toContain("Send garden link");
    expect(html).not.toContain("Send my garden link");
    expect(html).not.toContain("Email me my garden link");
    expect(html).not.toContain("sign-in link");
    expect(html).toContain("Tour a garden journal");
    expect(html).not.toContain("Browse an example garden");
    expect(html).not.toContain("See a sample garden");
    expect(html).not.toContain(">Tour a garden</a>");
    expect(html).not.toContain("See it in action");
    expect(html).not.toContain("Look around");
    expect(html).not.toContain("Open it on this device");
    expect(html).not.toContain("Your garden link opens this page");
    expect(html).not.toContain("private link");
    expect(html).not.toContain("secure Garden.io link");
    expect(html).not.toContain("garden record");
  });
});
