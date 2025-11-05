import { chromium, expect, test } from '@playwright/test';

//
// 🧩 Playwright Locator System — Eğitim Notları
//
// 🎯 Amaç:
// Bu dosya, Playwright’ta locator (seçici) kullanımını kapsamlı bir şekilde gösterir.
// Locator, DOM üzerindeki elementleri bulmak ve onlarla etkileşime geçmek için kullanılır.
//
// 🔍 İçerik:
// 1️⃣ Locator Syntax Rules → Farklı selector türleri
// 2️⃣ User-Facing Locators → Accessibility-first yaklaşımı
// 3️⃣ Child Element Locators → Parent → Child zinciri
// 4️⃣ Parent Element Locators → has / hasText / filter kullanımı
// 5️⃣ Re-Using Locators → Kod tekrarını azaltma
// 6️⃣ Extracting Values → Değer çekme (text, value, attribute)
// 7️⃣ Assertions → General, Locator ve Soft Assertions farkları
//

// ✅ Her testten önce çalışır (ön hazırlık aşaması)
test.beforeEach(async ({ page }) => {
  // 🌍 Uygulamayı aç
  await page.goto('http://localhost:4200/');

  // 🧭 Menüden Forms → Form Layouts sayfasına git
  await page.getByText('Forms').click();
  await page.getByText('Form Layouts').click();
});

//
// 🧩 TEST 1 — LOCATOR SYNTAX RULES
// 🎯 Amaç: CSS selector ve Playwright locator syntaxlarını görmek
//
test('Locator syntax rules', async ({ page }) => {
  // 🔹 Tag Name (etiket ismi)
  page.locator('input'); // Tüm input elementleri

  // 🔹 ID seçimi (#)
  page.locator('#inputEmail1');

  // 🔹 Class adı (partial match)
  page.locator('.shape-rectangle');

  // 🔹 Class adı (tam eşleşme)
  page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');

  // 🔹 Attribute (özellik) ile bulma
  page.locator('[placeholder="Email"]');

  // 🔹 Farklı selector’ları birleştirme
  page.locator('input[placeholder="Email"][nbinput]');

  // 🔹 Text’e göre arama (partial match)
  page.locator(':text("Using")');

  // 🔹 Text tam eşleşmesi
  page.locator(':text-is("Using the Grid")');

  /*
  🧠 NOT:
  - :text("...") → kelimeyi içeren tüm elementleri bulur.
  - :text-is("...") → yalnızca tam olarak eşleşen text’i bulur.
  */
});

//
// 🧩 TEST 2 — USER-FACING LOCATORS
// 🎯 Amaç: Accessibility-first yaklaşım ile kullanıcı perspektifinden locator kullanmak
//
test('User facing locators', async ({ page }) => {
  /*
  🧠 getBy* metotları Playwright’ın “user-facing locators” sistemidir.
  Bu sistem accessibility (erişilebilirlik) temelli çalışır.
  */

  // 🔹 Rolüne göre bul (örnek: textbox, button)
  await page.getByRole('textbox', { name: 'Email' }).first().click();
  await page.getByRole('button', { name: 'Sign in' }).first().click();

  // 🔹 Label metnine göre bul
  await page.getByLabel('Email').first().click();

  // 🔹 Placeholder’a göre bul
  await page.getByPlaceholder('Jane Doe').click();

  // 🔹 Elementin iç yazısına göre bul
  await page.getByText('Using the Grid').click();

  // 🔹 Title attribute’una göre bul
  await page.getByTitle('IoT Dashboard').click();

  /*
  💡 getBy* family:
     - getByRole() → en önerilen (a11y temelli)
     - getByLabel() → form alanları için ideal
     - getByPlaceholder() → placeholder bazlı
     - getByText() → görünür metne göre
     - getByTitle() → title attribute’una göre
  */
});

//
// 🧩 TEST 3 — CHILD ELEMENT LOCATORS
// 🎯 Amaç: Parent → Child ilişkisiyle locator zinciri oluşturmak
//
test('Child element locators', async ({ page }) => {
  // 🔹 Parent → Child zinciriyle arama
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();

  // 🔹 nb-card içindeki button
  await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click();

  // 🔹 nth() → belirli sıradaki elementi seçmek için
  await page.locator('nb-card').nth(3).getByRole('button').click();

  /*
  💡 nth(index) → 0 tabanlı index.
  nb-card.nth(3) → sayfadaki 4. nb-card elementini döner.
  */
});

//
// 🧩 TEST 4 — PARENT ELEMENT LOCATORS
// 🎯 Amaç: Belirli child elementlere göre parent seçmek
//
test('Parent element locators', async ({ page }) => {
  // 🔹 hasText → belirli text içeren parent
  await page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' }).click();

  // 🔹 has → belirli bir locator içeriyorsa parent seçimi
  await page
    .locator('nb-card', { has: page.locator('#inputEmail1') })
    .getByRole('textbox', { name: 'Email' })
    .click();

  // 🔹 filter → locator’ları filtreleme (daha temiz syntax)
  await page.locator('nb-card').filter({ hasText: 'Basic form' }).getByRole('textbox', { name: 'Email' }).click();

  /*
  🧠 has / hasText / filter farkları:
  - hasText: text eşleşmesi üzerinden filtreleme
  - has: locator eşleşmesi (örneğin belirli bir input içeriyorsa)
  - filter: zincirlenebilir syntax (daha okunabilir)
  */
});

//
// 🧩 TEST 5 — RE-USING LOCATORS
// 🎯 Amaç: Locator’ları değişkene atayarak kod tekrarını önlemek
//
test('Re-using locators', async ({ page }) => {
  // 🎯 Aynı alan üzerinde tekrar kullanılacak locator’lar tanımlanıyor
  const basicForm = page.locator('nb-card').filter({ hasText: 'Basic form' });
  const emailField = basicForm.getByRole('textbox', { name: 'Email' });
  const passwordField = basicForm.getByRole('textbox', { name: 'Password' });
  const submitButton = basicForm.getByRole('button', { name: 'Submit' });

  // 🧩 Formu doldur
  await emailField.fill('johndoe@example.com');
  await passwordField.fill('12345');
  await basicForm.locator('nb-checkbox').click();
  await submitButton.click();

  // ✅ Assertions (doğrulamalar)
  await expect(emailField).toHaveValue('johndoe@example.com');
  await expect(passwordField).toHaveValue('12345');
  await expect(basicForm.locator('nb-checkbox .custom-checkbox')).toHaveClass(/checked/);

  /*
  💡 NOT:
  Locator’ları değişkene almak:
  - Kod tekrarını azaltır.
  - Testlerin okunabilirliğini artırır.
  - “Parent → Child” bağlamını korur.
  */
});

//
// 🧩 TEST 6 — EXTRACTING VALUES
// 🎯 Amaç: Elementlerden text, value ve attribute değerlerini almak
//
test('Extracting values', async ({ page }) => {
  const basicForm = page.locator('nb-card').filter({ hasText: 'Basic form' });

  // 🔹 textContent() → görünen yazıyı döner
  const buttonText = await basicForm.getByRole('button', { name: 'Submit' }).textContent();
  expect(buttonText).toBe('Submit');

  // 🔹 allTextContents() → birden fazla elementi liste olarak döner
  const allRadioTexts = await page.locator('nb-radio').allTextContents();
  expect(allRadioTexts.length).toBe(3);
  expect(allRadioTexts).toContain('Option 1');
  expect(allRadioTexts).toContain('Option 2');
  expect(allRadioTexts).toContain('Disabled Option');

  // 🔹 inputValue() → input’un mevcut değerini döner
  const emailField = basicForm.getByRole('textbox', { name: 'Email' });
  await emailField.fill('johndoe@example.com');
  const emailValue = await emailField.inputValue();
  expect(emailValue).toBe('johndoe@example.com');

  // 🔹 getAttribute() → spesifik bir attribute’un değerini döner
  const placeholderValue = await emailField.getAttribute('placeholder');
  expect(placeholderValue).toBe('Email');

  /*
  🧠 textContent vs inputValue farkı:
  - textContent → sadece görünen text (div, span vs)
  - inputValue → input alanının “value” değerini döner
  */
});

//
// 🧩 TEST 7 — ASSERTIONS
// 🎯 Amaç: General, Locator ve Soft Assertions farklarını anlamak
//
test('Assertions', async ({ page }) => {
  // 🔹 --- GENERAL ASSERTIONS ---
  // Temel değişkenler üzerinde yapılır (DOM beklemez)
  const value = 5;
  expect(value).toEqual(5);

  const basicFormButton = page.locator('nb-card').filter({ hasText: 'Basic form' }).locator('button');
  const text = await basicFormButton.textContent();
  expect(text).toBe('Submit');

  // 🔹 --- LOCATOR ASSERTIONS ---
  // Elementi auto-wait ile kontrol eder
  await expect(basicFormButton).toHaveText('Submit');

  // 🔹 --- SOFT ASSERTIONS ---
  // Hata olsa bile test devam eder (raporda “soft failure” olarak görünür)
  await expect.soft(basicFormButton).toHaveText('Submittt'); // (bilerek yanlış)
  console.log('✅ Soft assertion başarısız olsa bile test akışı devam ediyor.');

  // Testin devam ettiğini göstermek için butona tıklayalım
  await basicFormButton.click();
  console.log('🎯 Buton tıklandı — test soft assertion sonrasında da çalışmaya devam etti.');

  /*
  🧠 Özet:
  - General Assertions → senkron, beklemez
  - Locator Assertions → auto-wait aktif
  - Soft Assertions → hatada test akışını kesmez
  */
});
