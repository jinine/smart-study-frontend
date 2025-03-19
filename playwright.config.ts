import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Folder for Playwright tests
  webServer: {
    command: 'npm start', // Change if using another start command
    port: 3000, // Change if your app runs on a different port
    reuseExistingServer: true,
  },
  use: {
    headless: true, // Set to false for debugging
    baseURL: 'http://localhost:3000', // Update to match your local dev server
    viewport: { width: 1280, height: 720 },
  },
});
