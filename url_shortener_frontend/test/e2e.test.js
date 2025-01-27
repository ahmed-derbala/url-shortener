const { test, expect } = require('@playwright/test');

test.describe('URL Shortener App', () => {
  // Test for creating a short URL
  test('should create a short URL and display it', async ({ page }) => {
    // Navigate to the React app
    await page.goto('http://localhost:3000/');

    // Enter the original URL in the input field
    await page.fill('input[name="originalUrl"]', 'https://example.com');

    // Submit the form
    await page.click('button[type="submit"]');

    // Check if the short URL is displayed
    const shortUrl = await page.locator('text=Shortened URL:').textContent();
    expect(shortUrl).toMatch(/^Shortened URL: http:\/\/localhost:3000\/[a-zA-Z0-9]+$/);

  });

  // Test for visiting a short URL and being redirected
  test('should resolve short URL to original URL', async ({ page }) => {
    const originalUrl = 'https://example.com/';
    const shortId = 'S8qSOi7_S';
  
    // Navigate to the short URL
    await page.goto(`http://localhost:3000/${shortId}`);
  
    // Wait for the page to navigate to the original URL
    await page.waitForURL(originalUrl);
  
    // Assert the final URL
    expect(page.url()).toBe(originalUrl);
  });
  

  // Test for 404 error on invalid short URL
  test('should display 404 for an invalid short URL', async ({ page }) => {
    await page.goto('http://localhost:3000/nonexistent123');
    await expect(page.locator('text=URL not found')).toBeVisible();
  });
});
