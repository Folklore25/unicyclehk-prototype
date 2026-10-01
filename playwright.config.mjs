import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173/unicyclehk-prototype/",
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    { name: "mobile-320", use: { viewport: { width: 320, height: 740 } } },
    { name: "mobile-390", use: { viewport: { width: 390, height: 844 } } },
    { name: "tablet-768", use: { viewport: { width: 768, height: 1024 } } },
    { name: "tablet-1024", use: { viewport: { width: 1024, height: 768 } } },
    { name: "desktop-1280", use: { viewport: { width: 1280, height: 800 } } },
    { name: "desktop-1440", use: { viewport: { width: 1440, height: 900 } } }
  ],
  webServer: {
    command: "node scripts/preview-site.mjs",
    url: "http://127.0.0.1:4173/unicyclehk-prototype/",
    reuseExistingServer: false,
    timeout: 15_000
  }
});
