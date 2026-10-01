import { test, expect } from "@playwright/test";

test("marketplace, saved items and the correct profile entrance work", async ({ page }, info) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const failedResources = [];
  page.on("response", (response) => { if (response.status() >= 400) failedResources.push(response.url()); });
  await page.goto("./");
  await expect(page.locator("#productGrid .product-card")).toHaveCount(12);
  await expect(page.locator(".side-nav [data-route=profile]")).toHaveCount(0);
  const mobile = info.project.use.viewport.width < 761;
  const nav = page.locator(mobile ? ".mobile-nav" : ".side-nav");
  await nav.locator("[data-route=saved]").click();
  await expect(page.locator("#market-title")).toHaveText("Saved for later");
  await expect(page.locator("#productGrid .product-card")).toHaveCount(2);
  const profile = page.locator(mobile ? ".mobile-nav [data-route=profile]" : ".side-profile");
  await profile.click();
  await expect(page.locator("#verifyDialog")).toBeVisible();
  if (!mobile) await expect(profile).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(page.locator("#verifyDialog")).not.toBeVisible();
  if (!mobile) {
    await expect(profile).toHaveAttribute("aria-expanded", "false");
    await profile.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#verifyDialog")).toBeVisible();
    await page.keyboard.press("Escape");
  }
  await expect(page.locator("#productGrid .product-card")).toHaveCount(12);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  expect(failedResources).toEqual([]);
});

test("item details, chat and Smart Match load without runtime errors", async ({ page }, info) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await page.locator("#productGrid .card-open").first().click();
  await expect(page.locator("#productDialog")).toBeVisible();
  await page.locator("#messageSeller").click();
  await expect(page.locator("#chatPanel")).toBeVisible();
  await page.locator("#closeChat").click();
  await page.locator(info.project.use.viewport.width < 761 ? "#mobileSmartEntry" : ".side-nav [data-route=smart-match]").click();
  await expect(page.locator("#smartMatchView")).toBeVisible();
  await page.locator("#smartBudget").selectOption("75");
  await page.locator("#runSmartPage").click();
  await expect(page.locator("#smartMatchResults .product-card")).toHaveCount(4);
  expect(errors).toEqual([]);
});

test("a published listing survives a reload", async ({ page }, info) => {
  await page.goto("./");
  await page.locator(info.project.use.viewport.width < 761 ? "#mobileSell" : "#openSell").click();
  await page.locator('#sellForm [name="title"]').fill("CI student desk");
  await page.locator('#sellForm [name="category"]').selectOption("Furniture");
  await page.locator('#sellForm [name="description"]').fill("A usable desk listed by the automated demo test.");
  await page.locator("#photoInput").setInputFiles("assets/icon-192.png");
  await expect(page.locator("#uploadZone")).toHaveClass(/has-preview/);
  await page.locator("#formNext").click();
  await page.locator('#sellForm [name="price"]').fill("100");
  await page.locator("#formNext").click();
  await page.locator("#formPublish").click();
  await expect(page.locator("#productDialog h2")).toHaveText("CI student desk");
  await page.keyboard.press("Escape");
  await expect(page.locator("#productGrid .product-card")).toHaveCount(13);
  await page.reload();
  await expect(page.locator("#productGrid .product-card")).toHaveCount(13);
  await expect(page.locator(".product-title", { hasText: "CI student desk" })).toBeVisible();
  await expect(page.locator(".product-card", { hasText: "CI student desk" }).locator(".custom-image")).toHaveCSS("background-image", /data:image\/jpeg;base64,/);
});
