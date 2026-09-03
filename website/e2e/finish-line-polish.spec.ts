import { expect, test } from "@playwright/test";

test("sample tour Today page exposes garden memory before the first question", async ({ page }) => {
  await page.goto("/tour/ask");

  const banner = page.getByText("Exploring a sample garden");
  await expect(banner).toBeVisible();
  await expect(page.getByRole("link", { name: "Start your own" })).toHaveAttribute("href", "/app");

  const memory = page.getByLabel("Garden memory snapshot");
  await expect(memory).toBeVisible();
  await expect(memory).toContainText("Backyard Garden");
  await expect(memory).toContainText("Central Texas");
  await expect(memory).toContainText("4 growing plants");
  await expect(memory).toContainText("2 places");
  await expect(memory).toContainText("1 care item today");
  await expect(memory).toContainText("Latest note: First strong bloom after two hot days. Bees active before noon.");
  await expect(memory.getByRole("link", { name: "Open garden memory" })).toHaveAttribute("href", "/tour/property");

  const firstShortcut = page.getByLabel("Chat history");
  const bannerBox = await banner.boundingBox();
  const shortcutBox = await firstShortcut.boundingBox();
  expect(bannerBox).not.toBeNull();
  expect(shortcutBox).not.toBeNull();
  expect((bannerBox?.y ?? 0) + (bannerBox?.height ?? 0)).toBeLessThan(shortcutBox?.y ?? 0);
});

test("homepage describes planning without claiming an automatic schedule", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "A planting plan from your wishlist and garden notes." })).toBeVisible();
  await expect(page.getByLabel("Example garden planning notes")).toBeVisible();
  await expect(page.getByText("Wishlist becomes next steps")).toBeVisible();
  await expect(page.getByText("Care stays connected")).toBeVisible();
  await expect(page.getByLabel("Example automated garden schedule")).toHaveCount(0);
  await expect(page.getByText("The garden schedule is auto-crafted")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "An automatic planting schedule from your wishlist." })).toHaveCount(0);
});

test("sample Garden Memory drawer scope stays readable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });

  for (const path of ["/tour/property", "/tour/property?plant=demo-plant-bell-pepper"]) {
    await page.goto(path);

    const scope = page.locator(".garden-drawer__scope");
    await expect(scope).toBeVisible();
    const memoryTimeline = page.getByLabel("Garden memory timeline");
    await expect(memoryTimeline).toBeVisible();
    await expect(memoryTimeline).toContainText("Memory timeline");
    if (path === "/tour/property") {
      await expect(memoryTimeline).toContainText("what you noticed, what you did, and how the garden responded");
      await expect(memoryTimeline).toContainText("2 observations");
      await expect(memoryTimeline).toContainText("2 outcomes");
      await expect(memoryTimeline).not.toContainText("Refresh mulch on exposed soil");
    } else {
      await expect(memoryTimeline).toContainText("Plant journal · photos, notes, care, and outcomes");
      await expect(memoryTimeline).toContainText("Photo notes will gather here by season");
    }

    const labelBox = await scope.locator(".ink-stamp").boundingBox();
    const scopeTextBox = await scope.locator(":scope > span").boundingBox();

    expect(labelBox).not.toBeNull();
    expect(scopeTextBox).not.toBeNull();
    expect((labelBox?.x ?? 0) + (labelBox?.width ?? 0)).toBeLessThan(scopeTextBox?.x ?? 0);
  }
});

test("sample plant history turns recorded outcomes into resilient next-season guidance", async ({ page }) => {
  await page.route("**/_next/image?url=**", (route) => route.abort());
  await page.goto("/tour/plants");

  await expect(page.locator(".garden-plants-thumb--fallback")).toHaveCount(4);
  await page.getByText("Bell Pepper", { exact: true }).first().click();
  await page.getByRole("tab", { name: "History" }).click();

  const timeline = page.getByLabel("Garden memory timeline");
  await expect(timeline).toContainText("Harvested · 4.5 lb · quality 4/5 · grew well");
  await expect(timeline).toContainText("Bell Pepper has done well for you");
  await expect(timeline).toContainText("From your garden notes");
  await expect(timeline).toContainText("Keep doing what works: same spot, same timing.");
  await expect(page.getByText("Kitchen Garden · Container Row").first()).toBeVisible();
});

test("a returning grower can separate remembered events from work that still needs care", async ({ page }) => {
  await page.goto("/tour/ask");

  const snapshot = page.getByLabel("Garden memory snapshot");
  await expect(snapshot).toContainText("Latest note: First strong bloom after two hot days.");
  await snapshot.getByRole("link", { name: "Open garden memory" }).click();

  const memory = page.getByLabel("Garden memory timeline");
  await expect(memory).toContainText("2 observations");
  await expect(memory).toContainText("0 completed care items");
  await expect(memory).toContainText("2 outcomes");
  await expect(memory).not.toContainText("Refresh mulch on exposed soil");

  await page.getByRole("link", { name: "Weekly care" }).click();
  await expect(page.getByRole("heading", { name: "Weekly care" })).toBeVisible();
  await expect(page.getByText("Water deeply before the hot afternoon")).toBeVisible();
  await expect(page.getByText("Harvest dill before afternoon heat")).toBeVisible();

  await page.getByRole("link", { name: "Today" }).click();
  const composer = page.getByRole("textbox", { name: "Ask about your garden" });
  await composer.fill("What changed since last time?");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByRole("heading", { name: /Compare today’s leaves with the last note/ })).toBeVisible();
  await page.getByText("Why this answer fits your garden").click();
  await expect(page.getByText("Your garden has a recent plant note to compare against.")).toBeVisible();
  await expect(page.getByText("Describe whether the newest growth looks better, worse, or unchanged.")).toBeVisible();
});
