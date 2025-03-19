import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should load the home page correctly', async ({ page }) => {
    await expect(page.locator('header')).toHaveText(/Smart Study Assistant/i);
    await expect(page.locator('#organize-notes')).toHaveText(/Organize Your Notes, Supercharge Your Study/i);
  });  

  test('should have a Get Started button that navigates to /signup', async ({ page }) => {
    const getStartedButton = page.locator('text=Get Started');
    await expect(getStartedButton).toBeVisible();
    await getStartedButton.click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test('should display the Features section with all feature cards', async ({ page }) => {
    const featuresHeading = page.locator('text=Features');
    await expect(featuresHeading).toBeVisible();

    const featureTitles = [
      'AI-Powered Organization',
      'Custom Study Plans',
      'Interactive Flashcards'
    ];

    for (const title of featureTitles) {
      await expect(page.locator(`role=heading[name="${title}"]`)).toBeVisible();
    }
  });

  test('should navigate to the About page when Learn More is clicked', async ({ page }) => {
    const learnMoreButton = page.locator('text=Learn More');
    await expect(learnMoreButton).toBeVisible();
    await learnMoreButton.click();
    await expect(page).toHaveURL(/\/about/);
  });

  test('should display footer with copyright text', async ({ page }) => {
    await expect(page.locator('footer')).toHaveText(/© 2024 Smart Study Assistant/i);
  });
});
