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

    const labelBox = await scope.locator(".ink-stamp").boundingBox();
    const scopeTextBox = await scope.locator(":scope > span").boundingBox();

    expect(labelBox).not.toBeNull();
    expect(scopeTextBox).not.toBeNull();
    expect((labelBox?.x ?? 0) + (labelBox?.width ?? 0)).toBeLessThan(scopeTextBox?.x ?? 0);
  }
});
