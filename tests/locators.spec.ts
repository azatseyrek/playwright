import { expect, test } from '@playwright/test';

// ✅ Her testten önce çalışır (ön hazırlık aşaması)
test.beforeEach(async ({ page }) => {
  // Uygulamayı aç
  await page.goto('http://localhost:4200/');

  // Menüden Forms -> Form Layouts sayfasına git
  await page.getByText('Forms').click();
  await page.getByText('Form Layouts').click();
});

//
// 🧩 TEST 1 — LOCATOR SYNTAX RULES
// 🎯 Amaç: Farklı locator türlerini görmek ve denemek
//
test('Locator syntax rules', async ({ page }) => {
  // 🔹 Tag Name ile bulma (tüm input elementlerini seçer)
  page.locator('input');

  // 🔹 ID ile bulma (tekil element)
  page.locator('#inputEmail1');

  // 🔹 Class adıyla bulma (partial match)
  page.locator('.shape-rectangle');

  // 🔹 Class adıyla bulma (tam eşleşme)
  page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');

  // 🔹 Attribute (özellik) ile bulma
  page.locator('[placeholder="Email"]');

  // 🔹 Farklı selector’ları birleştirme
  page.locator('input[placeholder="Email"][nbinput]');

  // 🔹 Text içinde geçen kelimeye göre bulma (partial match)
  page.locator(':text("Using")');

  // 🔹 Text tam eşleşmesi (exact match)
  page.locator(':text-is("Using the Grid")');
});

//
// 🧩 TEST 2 — USER-FACING LOCATORS
// 🎯 Amaç: Kullanıcı perspektifine uygun locatorları görmek
//
test('User facing locators', async ({ page }) => {
  // 🔹 Rolüne göre bul (accessibility-first)
  await page.getByRole('textbox', { name: 'Email' }).first().click();
  await page.getByRole('button', { name: 'Sign in' }).first().click();

  // 🔹 Label metnine göre bul
  await page.getByLabel('Email').first().click();

  // 🔹 Placeholder’a göre bul
  await page.getByPlaceholder('Jane Doe').click();

  // 🔹 Elementin içindeki yazıya göre bul
  await page.getByText('Using the Grid').click();

  // 🔹 Title attribute’una göre bul
  await page.getByTitle('IoT Dashboard').click();
});

//
// 🧩 TEST 3 — CHILD ELEMENT LOCATORS
// 🎯 Amaç: Parent-Child ilişkisi üzerinden locator kullanımı
//
test('Child element locators', async ({ page }) => {
  // 🔹 Parent-Child zinciri ile seçim
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();

  // 🔹 nb-card içindeki button
  await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click();

  // 🔹 nth() ile belirli sıradaki elementi seç
  await page.locator('nb-card').nth(3).getByRole('button').click();
});

//
// 🧩 TEST 4 — PARENT ELEMENT LOCATORS
// 🎯 Amaç: Parent element filtreleme tekniklerini görmek
//
test('Parent element locators', async ({ page }) => {
  // 🔹 hasText — text içeren parent
  await page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' }).click();

  // 🔹 has — belirli bir locator içeriyorsa parent seçimi
  await page
    .locator('nb-card', { has: page.locator('#inputEmail1') })
    .getByRole('textbox', { name: 'Email' })
    .click();

  // 🔹 filter({ hasText }) — filtreleme
  await page.locator('nb-card').filter({ hasText: 'Basic form' }).getByRole('textbox', { name: 'Email' }).click();
});

//
// 🧩 TEST 5 — RE-USING LOCATORS
// 🎯 Amaç: Locator’ları tekrar kullanmak, kod tekrarını azaltmak
//
test('Re-using locators', async ({ page }) => {
  const basicForm = page.locator('nb-card').filter({ hasText: 'Basic form' });
  const emailField = basicForm.getByRole('textbox', { name: 'Email' });
  const passwordField = basicForm.getByRole('textbox', { name: 'Password' });
  const submitButton = basicForm.getByRole('button', { name: 'Submit' });

  // Formu doldur
  await emailField.fill('johndoe@example.com');
  await passwordField.fill('12345');
  await basicForm.locator('nb-checkbox').click();
  await submitButton.click();

  // Assertions
  await expect(emailField).toHaveValue('johndoe@example.com');
  await expect(passwordField).toHaveValue('12345');
  await expect(basicForm.locator('nb-checkbox .custom-checkbox')).toHaveClass(/checked/);
});

//
// 🧩 TEST 6 — EXTRACTING VALUES
// 🎯 Amaç: Elementlerden değerleri almak ve doğrulamak
//
test('Extracting values', async ({ page }) => {
  const basicForm = page.locator('nb-card').filter({ hasText: 'Basic form' });

  const buttonText = await basicForm.getByRole('button', { name: 'Submit' }).textContent();
  expect(buttonText).toBe('Submit');

  const allRadioTexts = await page.locator('nb-radio').allTextContents();
  expect(allRadioTexts.length).toBe(3);
  expect(allRadioTexts).toContain('Option 1');
  expect(allRadioTexts).toContain('Option 2');
  expect(allRadioTexts).toContain('Disabled Option');

  const emailField = basicForm.getByRole('textbox', { name: 'Email' });
  await emailField.fill('johndoe@example.com');
  const emailValue = await emailField.inputValue();
  expect(emailValue).toBe('johndoe@example.com');

  const placeholderValue = await emailField.getAttribute('placeholder');
  expect(placeholderValue).toBe('Email');
});

//
// 🧩 TEST 7 — ASSERTIONS
// 🎯 Amaç: General, Locator ve Soft Assertions kullanımını görmek
//
test('Assertions', async ({ page }) => {
  // 🔹 --- GENERAL ASSERTIONS ---
  const value = 5;
  expect(value).toEqual(5);

  const basicFormButton = page.locator('nb-card').filter({ hasText: 'Basic form' }).locator('button');

  const text = await basicFormButton.textContent();
  expect(text).toBe('Submit');

  // 🔹 --- LOCATOR ASSERTIONS ---
  await expect(basicFormButton).toHaveText('Submit');

  // 🔹 --- SOFT ASSERTIONS ---
  await expect.soft(basicFormButton).toHaveText('Submittt'); // bilerek yanlış
  await basicFormButton.click();

  // 🧠 NOTLAR:
  // 1️⃣ General Assertions → Basit değişkenler üzerinde anlık kontrol yapar, DOM beklemez.
  // 2️⃣ Locator Assertions → Auto-wait aktif, element hazır olana kadar bekler.
  // 3️⃣ Soft Assertions → Hata olsa bile test devam eder, raporda soft failure olarak görünür.
});
