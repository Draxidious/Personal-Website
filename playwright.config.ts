import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e-tests',
  fullyParallel: true,
  reporter: 'html',
  expect: {
    // GitHub-hosted runners render WebGL via software rasterization
    // (no GPU), which produces slightly different anti-aliasing along
    // canvas edges than a local GPU. This tolerates that noise without
    // masking real visual regressions, which differ far more than 2%.
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
