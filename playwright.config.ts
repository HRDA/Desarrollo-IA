import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3000";
const providerPort = 41000 + (process.pid % 20000);
const providerBaseURL = `http://127.0.0.1:${providerPort}/e2e-${process.pid}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "node tests/e2e/mock-provider.mjs",
      url: `http://127.0.0.1:${providerPort}/health`,
      reuseExistingServer: false,
      timeout: 30_000,
      env: { MOCK_PROVIDER_PORT: String(providerPort) },
    },
    {
      command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
      url: baseURL,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        DUMMYJSON_BASE_URL: providerBaseURL,
        NEXT_TELEMETRY_DISABLED: "1",
      },
    },
  ],
});
