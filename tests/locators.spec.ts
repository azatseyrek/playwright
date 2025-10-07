import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByText('Forms').click();
  await page.getByText('Form Layouts').click();
});

test('Locator syntax rules', async ({ page }) => {
  // by Tag Name
  page.locator('input');

  // by ID
  page.locator('#inputEmail1');

  // by Class Value
  page.locator('.shape-rectangle');

  // by Class Value (full match)
  page.locator('[class="class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');

  // by Attribute
  page.locator('[placeholder="Email"]');

  // by Combined different selectors
  page.locator('input[placeholder="Email"][nbinput]');

  // by Partial text match
  page.locator(':text("Using")');

  // by Exact text match
  page.locator(':text-is("Using the Grid")');
});

test('User facing locators', async ({ page }) => {
  await page.getByRole('textbox', { name: 'Email' }).first().click();
  await page.getByRole('button', { name: 'Sign in' }).first().click();
  await page.getByLabel('Email').first().click();
  await page.getByPlaceholder('Jane Doe').click();
  await page.getByText('Using the Grid').click();
  await page.getByTitle('IoT Dashboard').click();
});

test('Child element locators', async ({ page }) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click();

  // nth child
  await page.locator('nb-card').nth(3).getByRole('button').click();
});

test('Parent element locators', async ({ page }) => {
  await page.getByLabel('Remember me').locator('..').click();
  await page.getByText('Using the Grid').locator('..').getByRole('button').click();

  await page.locator('nb-card');
});
