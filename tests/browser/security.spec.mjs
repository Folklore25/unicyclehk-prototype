import { test, expect } from "@playwright/test";

test.beforeEach(({}, info) => test.skip(info.project.name !== "desktop-1280", "Security behavior is viewport-independent"));

test("tampered saved listings cannot inject markup or remote images, even without CSP", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ bypassCSP: true });
  await context.addInitScript(() => {
    const payload = `x');\"><img id="injected" src="x" onerror="window.injected=true"><div style="`;
    const product = { id: "local-attack", local: true, title: '<img id="title-injection" src=x onerror="window.injected=true">', category: "Furniture", price: 50, condition: "Good", university: "cityu", location: "CityUHK", time: "Just now", age: 0, seller: "Student", initials: "CI", rating: "New seller", description: "A test listing", pickup: "CityU main entrance", imageData: payload, asset: "https://blocked.invalid/track.webp" };
    localStorage.setItem("unicyclehk-demo-v4", JSON.stringify({ products: [product] }));
  });
  const page = await context.newPage();
  try {
    await page.goto(baseURL);
    await expect(page.locator("#productGrid .product-card")).toHaveCount(13);
    await expect(page.locator("#injected, #title-injection")).toHaveCount(0);
    expect(await page.evaluate(() => window.injected)).toBeUndefined();
    const card = page.locator('[data-product="local-attack"]');
    await expect(card.locator(".product-title")).toContainText("<img");
    await expect(card.locator(".product-image")).toHaveCSS("background-image", /assets\/products\/01-table\.webp/);
  } finally { await context.close(); }
});

test("CSP blocks injected inline scripts and off-origin connections", async ({ page }) => {
  await page.goto("./");
  const result = await page.evaluate(async () => {
    const violations = [];
    document.addEventListener("securitypolicyviolation", (event) => violations.push(event.effectiveDirective));
    const script = document.createElement("script");
    script.textContent = "window.inlineInjection = true";
    document.body.append(script);
    let blocked = false;
    try { await fetch("https://blocked.invalid/collect"); } catch { blocked = true; }
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { executed: !!window.inlineInjection, blocked, violations };
  });
  expect(result.executed).toBe(false);
  expect(result.blocked).toBe(true);
  expect(result.violations).toContain("script-src-elem");
  expect(result.violations).toContain("connect-src");
});

test("a 404 never replaces the cached home, and the PWA works offline", async ({ page, context }) => {
  await page.goto("./");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  const response = await page.goto("missing-page");
  expect(response.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "This listing has moved on." })).toBeVisible();
  expect(await page.evaluate(async () => (await (await caches.match("./index.html")).text()).includes("Find what you need"))).toBe(true);
  await context.setOffline(true);
  await page.goto("./");
  await expect(page.locator("#productGrid .product-card")).toHaveCount(12);
  await expect(page.locator("#connectionStatus")).toBeVisible();
  await context.setOffline(false);
});
