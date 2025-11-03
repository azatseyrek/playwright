import test, { expect } from '@playwright/test';

//
// 🧩 TEST 1 — AUTO-WAITING (Actionability & Locator States)
// 🎯 Amaç: Playwright’ın auto-waiting mantığını ve element durumlarına göre bekleme stratejilerini anlamak
//

test.beforeEach(async ({ page }) => {
  // 🌍 Test öncesi setup — AJAX örnek sayfasını aç
  await page.goto('https://uitestingplayground.com/ajax');

  // ▶️ AJAX isteğini tetikleyecek butona tıkla
  await page.getByText('Button triggering AJAX request').click();
});

test('Auto-waiting demonstration on AJAX page', async ({ page }) => {
  const successButton = page.locator('.bg-success');

  /*
  🧠 NOT: 
  Burada auto-waiting mekanizması hemen devreye girmez, çünkü:
  - Element `.bg-success` henüz DOM’a eklenmemiştir.
  - Playwright locator’ı oluşturur ama elementin var olmasını beklemez.
  
  ❌ Aşağıdaki gibi bir kod hata verebilir:
      const text = await successButton.textContent();
  
  ✅ Çözüm:
      Elementin DOM’a “eklenmesini” beklemek gerekir.
      Bunun için waitFor({ state: 'attached' }) kullanılır.
  */

  // ✅ Element DOM’a eklenene kadar bekle
  await successButton.waitFor({ state: 'attached' });

  // 📜 Elementin metnini al
  const text = await successButton.allTextContents();

  // 🔍 İçerik doğrulaması
  expect(text).toContain('Data loaded with AJAX get request.');

  /*
  💬 Ayrıca Playwright expect() kullanırken otomatik bekleme (auto-waiting) desteği sunar.
  Bu sayede manuel “waitFor()” çoğu zaman gereksiz olur.
  */

  // ✅ Auto-waiting destekli doğrulama (timeout eklenebilir)
  await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 });
});

//
// 🔎 Genel Bilgi — Default timeout değerleri
//
// - Locator assertion’ları için varsayılan timeout: 5000 ms
// - Global varsayılan (örneğin page.waitForSelector) timeout: 30000 ms
//
// 🎛 Değiştirmek istersen → playwright.config.ts dosyasında:
//   use: { timeout: 30000, expect: { timeout: 10000 } }
//

//
// 🧩 AUTO-WAITING DETAYLARI — Playwright’ın otomatik beklediği durumlar
//
// Playwright, bir element ile etkileşime geçmeden önce şu 6 özelliği kontrol eder:
//
// 1️⃣ Visible → Görünür mü?
// 2️⃣ Stable → Animasyon ya da DOM değişimi bitmiş mi?
// 3️⃣ Receives Events → Gerçekten tıklanabilir mi?
// 4️⃣ Enabled → Devre dışı (disabled) değil mi?
// 5️⃣ Editable → input/textarea düzenlenebilir mi?
// 6️⃣ Attached → Element DOM’da mevcut mu?
//
// Bu kontroller “actionability checks” olarak geçer.
//

/*
🎯 2. Matcher Türleri — “Timeout eklenebilir mi?” farkı

| Tür | Örnek | Timeout destekler mi? | Açıklama |
|-----|--------|------------------------|-----------|
| **Auto-waiting matchers** | toHaveText, toBeVisible, toBeHidden, toHaveValue, toHaveAttribute, toContainText | ✅ Evet | DOM üzerinde dinamik değişiklikleri bekler. Bu yüzden timeout anlamlıdır. |
| **Static matchers** | toBeAttached, toBeDetached, toBeChecked, toContain, toEqual, toMatch | ❌ Hayır | Sadece o anda kontrol eder. Bekleme yapmaz. |
*/

//
// 🧩 TEST 2 — ALTERNATIVE WAIT STRATEGIES
// 🎯 Amaç: Auto-waiting dışında manuel bekleme yöntemlerini görmek
//

test('Alternative waits', async ({ page }) => {
  const successButton = page.locator('.bg-success');

  /*
  🔸 Bazı durumlarda auto-waiting yeterli olmayabilir.
  Özellikle AJAX gibi “arka plan” isteklerinde element DOM’a geç eklenebilir.

  Bu durumda “manual wait” yöntemlerinden biri seçilebilir:
  */

  // 1️⃣ Belirli bir element DOM’a eklenene kadar bekle
  // await page.waitForSelector('.bg-success');

  // 2️⃣ Belirli bir network isteğinin tamamlanmasını bekle
  // await page.waitForResponse('https://uitestingplayground.com/ajaxdata');

  // 3️⃣ Tüm network çağrılarının tamamlanmasını bekle (GENEL — Önerilmez)
  await page.waitForLoadState('networkidle');

  // ✅ Sonuç doğrulaması
  const text = await successButton.allTextContents();
  expect(text).toContain('Data loaded with AJAX get request.');
});

//
// 💡 ÖZET — Auto-waiting vs Manual Waiting
//
// ✅ Auto-waiting → Playwright kendi bekler, genelde en güvenli ve temiz yöntemdir.
// ✅ Manual waiting → Özel durumlarda (ör. uzun süren AJAX veya custom loader) kullanılabilir.
// ❌ hard wait (waitForTimeout) → Kullanılmamalıdır; testleri yavaşlatır ve kararsız hale getirir.
//
// Önerilen pratik:
//  - Önce “auto-waiting” ile çözmeyi dene
//  - Gerekirse sadece ilgili noktada “waitFor()” ya da “expect(...).toBeVisible()” kullan
//
