import { test, expect } from '@playwright/test';

test('User can sign up successfully', async ({ page }) => {
  await page.goto('http://localhost:3000/signup'); // Update if needed

  // Fill out the signup form
  await page.fill('#username', 'testuser');
  await page.fill('#email', 'testuser@example.com');
  await page.fill('#firstName', 'Test');
  await page.fill('#lastName', 'User');
  await page.fill('#password', 'Test@1234');
  await page.fill('#profilePictureUrl', 'https://example.com/image.jpg');

  // Click the signup button
  await page.click('button[type="submit"]');

  // Wait for navigation (assuming successful signup redirects to /login)
  await page.waitForURL('**/login');

  // Verify the user is on the login page
  await expect(page).toHaveURL(/.*login/);
  await expect(page.locator('h2')).toHaveText('Login'); // Adjust selector based on your login page
});
