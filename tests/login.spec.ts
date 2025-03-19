import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login'); // Adjust URL if necessary
  });

  test('should display login form', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Login');
  });

  test('should allow typing in email and password fields', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');

    await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com');
    await expect(page.locator('input[type="password"]')).toHaveValue('password123');
  });

  test('should attempt login and redirect on success', async ({ page }) => {
    // Mock API Response
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'mock-token', email: 'test@example.com' }),
      });
    });

    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Expect localStorage to have token
    await page.waitForTimeout(500); // Simulating async storage update
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBe('mock-token');

    // Expect navigation to /dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should show error on invalid login', async ({ page }) => {
    // Mock API Failure Response
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid credentials' }),
      });
    });

    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Expect an error message (modify this selector based on how you display errors)
    await expect(page.locator('text=error')).toBeVisible();
  });
});
