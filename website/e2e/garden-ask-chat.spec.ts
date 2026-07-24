import { expect, test } from "@playwright/test";

async function askGardenQuestion(page: import("@playwright/test").Page, question: string) {
  const composer = page.locator(".garden-ai-composer textarea").last();
  await composer.click();
  await composer.fill(question);
  await expect(page.locator(".garden-ai-send")).toBeEnabled();
  await page.locator(".garden-ai-send").click();
  await expect(page.locator(".garden-ai-message-bubble--assistant .garden-ai-answer")).toHaveCount(1);
}

test("garden ask stays in a chat thread and links plant context", async ({ page }) => {
  await page.goto("/tour/ask");

  const emptyComposer = page.locator(".garden-ai-composer:not(.garden-ai-composer--chat) textarea");
  await emptyComposer.click();
  await emptyComposer.pressSequentially("what should I do with my bell pepper?");
  await expect(page.locator(".garden-ai-send")).toBeEnabled();
  await page.locator(".garden-ai-send").click();

  const userBubbles = page.locator(".garden-ai-message-bubble--user");
  const assistantBubbles = page.locator(".garden-ai-message-bubble--assistant .garden-ai-answer");
  await expect(userBubbles).toHaveCount(1);
  await expect(userBubbles.first()).toContainText("what should I do with my bell pepper?");
  await expect(assistantBubbles).toHaveCount(1);

  const contextChip = page.locator(".garden-ai-context-chip", { hasText: "Bell Pepper" });
  await expect(contextChip).toHaveCount(1);
  await expect(contextChip).toHaveAttribute("data-tooltip", "Bell Pepper · Container Row, Kitchen Garden");
  await expect(contextChip).toHaveAttribute("href", "/tour/property?plant=demo-plant-bell-pepper");

  const followUpComposer = page.locator(".garden-ai-composer--chat textarea");
  await expect(followUpComposer).toHaveAttribute("placeholder", "Ask a follow-up...");
  await followUpComposer.click();
  await followUpComposer.pressSequentially("should I prune it now?");
  await expect(page.locator(".garden-ai-send")).toBeEnabled();
  await page.locator(".garden-ai-send").click();

  await expect(userBubbles).toHaveCount(2);
  await expect(assistantBubbles).toHaveCount(2);
  await expect(page.locator(".garden-ai-question-memory")).toHaveCount(0);
  await expect(page.locator(".garden-ai-turn").nth(1).locator(".garden-ai-context-chip")).toHaveText("Bell Pepper");

  await contextChip.first().click();
  await expect(page).toHaveURL(/\/tour\/property\?plant=demo-plant-bell-pepper$/);
  await expect(page.getByRole("heading", { name: "Bell Pepper" })).toBeVisible();
  await expect(page.getByText("Container Row")).toBeVisible();
});

test.describe("garden ask plant context matching", () => {
  const cases = [
    {
      question: "what should I do with my bell pepper?",
      expected: [
        {
          name: "Bell Pepper",
          tooltip: "Bell Pepper · Container Row, Kitchen Garden",
          href: "/tour/property?plant=demo-plant-bell-pepper"
        }
      ]
    },
    {
      question: "are the peppers ready to pick?",
      expected: [
        {
          name: "Bell Pepper",
          tooltip: "Bell Pepper · Container Row, Kitchen Garden",
          href: "/tour/property?plant=demo-plant-bell-pepper"
        }
      ]
    },
    {
      question: "when should I harvest dill seed?",
      expected: [
        {
          name: "Bouquet Dill",
          tooltip: "Bouquet Dill · Herb Bed, Kitchen Garden",
          href: "/tour/property?plant=demo-plant-dill"
        }
      ]
    },
    {
      question: "are the borage blooms attracting pollinators?",
      expected: [
        {
          name: "Borage",
          tooltip: "Borage · Bloom Border, Pollinator Edge",
          href: "/tour/property?plant=demo-plant-borage"
        },
        {
          name: "Borage",
          tooltip: "Borage · Herb Bed, Kitchen Garden",
          href: "/tour/property?plant=demo-plant-borage-herb"
        }
      ]
    },
    {
      question: "what is growing in the herb bed?",
      expected: [
        {
          name: "Bouquet Dill",
          tooltip: "Bouquet Dill · Herb Bed, Kitchen Garden",
          href: "/tour/property?plant=demo-plant-dill"
        },
        {
          name: "Borage",
          tooltip: "Borage · Herb Bed, Kitchen Garden",
          href: "/tour/property?plant=demo-plant-borage-herb"
        }
      ]
    },
    {
      question: "what should I check in the pollinator edge?",
      expected: [
        {
          name: "Borage",
          tooltip: "Borage · Bloom Border, Pollinator Edge",
          href: "/tour/property?plant=demo-plant-borage"
        }
      ]
    },
    {
      question: "what needs water in the container row?",
      expected: [
        {
          name: "Bell Pepper",
          tooltip: "Bell Pepper · Container Row, Kitchen Garden",
          href: "/tour/property?plant=demo-plant-bell-pepper"
        }
      ]
    }
  ];

  for (const testCase of cases) {
    test(`shows plant context for "${testCase.question}"`, async ({ page }) => {
      await page.goto("/tour/ask");
      await askGardenQuestion(page, testCase.question);

      const chips = page.locator(".garden-ai-context-chip");
      await expect(chips).toHaveCount(testCase.expected.length);

      for (let index = 0; index < testCase.expected.length; index += 1) {
        await expect(chips.nth(index)).toHaveText(testCase.expected[index].name);
        await expect(chips.nth(index)).toHaveAttribute("data-tooltip", testCase.expected[index].tooltip);
        await expect(chips.nth(index)).toHaveAttribute("href", testCase.expected[index].href);
      }
    });
  }
});
