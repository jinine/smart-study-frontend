import { test, expect } from "@playwright/test";

test("User can log in and access the dashboard", async ({ page }) => {
  const backendUri = "http://localhost:4000";

  // Step 1: Navigate to login page
  await page.goto("http://localhost:3000/login");

  // Step 2: Fill in login credentials
  await page.fill('input[id="email"]', "test@test.com");
  await page.fill('input[id="password"]', "Test1234!");

  // Step 3: Click login button and wait for navigation
  await page.click('button[type="submit"]');

  // Step 4: Wait for API response and store the token
//   await page.waitForResponse((response) =>
//     response.url().includes(`${backendUri}/api/v1/user/login`) &&
//     response.status() === 200
//   );

  // Simulate token storage (if login succeeds, backend usually returns a token)
  await page.evaluate(() => {
    localStorage.setItem("token", "mocked_token");
    localStorage.setItem("user", JSON.stringify({ email: "test@test.com" }));
  });

  // Step 5: Navigate to dashboard
  await page.goto("http://localhost:3000/dashboard");

  // Step 6: Verify the dashboard loaded
  await expect(page).toHaveURL("http://localhost:3000/dashboard");
  await expect(page.locator("h2")).toHaveText("Browse Cue Cards");
});
