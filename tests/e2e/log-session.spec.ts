import { test, expect } from '@playwright/test';

test('user can log a lifting session and see it on dashboard and history', async ({ page }) => {
  // Navigate to Log Session page
  await page.goto('/log');
  await expect(page.getByRole('heading', { name: 'Log Session' })).toBeVisible();

  // Select Lifting activity
  await page.getByTestId('activity-lifting').click();

  // Fill in lifting details
  await page.getByTestId('exercise-input').fill('Bench Press');
  await page.getByTestId('sets-input').fill('4');
  await page.getByTestId('reps-input').fill('10');
  await page.getByTestId('weight-input').fill('185');

  // Set duration
  await page.getByTestId('duration-input').fill('45');

  // Add a note
  await page.getByTestId('notes-input').fill('Testing workout log');

  // Submit the session
  await page.getByTestId('submit-session').click();

  // Should redirect to dashboard
  await page.waitForURL('/');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // Last session card should show the lifting session
  await expect(page.getByText('lifting').first()).toBeVisible();
  await expect(page.getByText('45 min').first()).toBeVisible();

  // Navigate to history
  await page.getByRole('link', { name: /History/ }).click();
  await page.waitForURL('/history');

  // Should see the new session in the list
  await expect(page.locator('button').filter({ hasText: /Lifting/i }).first()).toBeVisible();
});

test('dashboard shows muscle fatigue heatmap and recovery timeline', async ({ page }) => {
  await page.goto('/');

  // Dashboard loads with key components
  await expect(page.getByText('Muscle Fatigue Map')).toBeVisible();
  await expect(page.getByText('Recovery Timeline')).toBeVisible();
  await expect(page.getByText('Energy Expenditure')).toBeVisible();
  await expect(page.getByText('Sessions This Week')).toBeVisible();
});

test('session detail page shows full session info', async ({ page }) => {
  // Navigate to history
  await page.goto('/history');

  // Expand first session and click details
  await page.locator('button').filter({ hasText: /lifting|boxing|running|basketball/i }).first().click();
  await page.getByText('Full Details →').first().click();

  // Should be on a session detail page with /session/ in the URL
  await expect(page).toHaveURL(/\/session\//);
  await expect(page.getByText('Duration')).toBeVisible();
  await expect(page.getByText('Muscle Load Distribution')).toBeVisible();
});
