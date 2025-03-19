import { test, expect } from '@playwright/test';

test('should login and interact with document component', async ({ page }) => {
    const backendUri = "http://localhost:4000";

    // Step 1: Navigate to login page
    await page.goto("http://localhost:3000/login");

    // Step 2: Fill in login credentials
    await page.fill('input[id="email"]', "test@test.com");
    await page.fill('input[id="password"]', "Test1234!");

    // Step 3: Click login button and wait for navigation
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    // Step 4: Navigate to the dashboard
    await page.goto('http://localhost:3000/dashboard');

    const newDocumentButton = page.locator('button[id="manage-cue-cards"]');
    newDocumentButton.click();

    // Step 7: Check if the URL contains '/document/:id'
    await expect(page).toHaveURL('/cue-card');
});
