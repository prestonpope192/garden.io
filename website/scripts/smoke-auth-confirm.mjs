import { chromium } from "@playwright/test";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3001";

async function runConfirmSmoke(page, path, expectedPayload) {
  const sessionRequests = [];

  await page.route("**/api/auth/session", async (route) => {
    const request = route.request();
    const payload = request.postDataJSON();
    sessionRequests.push(payload);

    await route.fulfill({
      body: JSON.stringify({ ok: true }),
      contentType: "application/json",
      headers: {
        "set-cookie": "sb-smoke-auth-token=session-cookie; Path=/; SameSite=Lax"
      },
      status: 200
    });
  });

  await page.goto(`${baseUrl}${path}`);
  await page.waitForURL(`${baseUrl}/app/my-property`, { timeout: 10_000 });

  if (sessionRequests.length !== 1) {
    throw new Error(`Expected one auth session request, got ${sessionRequests.length}`);
  }

  for (const [key, value] of Object.entries(expectedPayload)) {
    if (sessionRequests[0][key] !== value) {
      throw new Error(`Expected auth payload ${key}=${value}, got ${sessionRequests[0][key]}`);
    }
  }
}

async function runInvalidLinkSmoke(page) {
  const sessionRequests = [];

  await page.route("**/api/auth/session", async (route) => {
    sessionRequests.push(route.request().postDataJSON());
    await route.fulfill({
      body: JSON.stringify({ ok: false }),
      contentType: "application/json",
      status: 400
    });
  });

  await page.goto(`${baseUrl}/auth/confirm?next=/app/my-property`);
  await page.waitForURL(`${baseUrl}/app/my-property?auth=invalid_link`, { timeout: 10_000 });

  if (sessionRequests.length !== 0) {
    throw new Error(`Expected no auth session request for missing token state, got ${sessionRequests.length}`);
  }
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(10_000);

  await runConfirmSmoke(
    page,
    "/auth/confirm?next=/app/my-property#access_token=access-token&refresh_token=refresh-token",
    {
      access_token: "access-token",
      refresh_token: "refresh-token"
    }
  );

  await runConfirmSmoke(
    page,
    "/auth/confirm?next=/app/my-property&token_hash=hash-token&type=magiclink",
    {
      token_hash: "hash-token",
      type: "magiclink"
    }
  );

  await runInvalidLinkSmoke(page);
} finally {
  await browser.close();
}

console.log("Auth confirm browser smoke passed.");
