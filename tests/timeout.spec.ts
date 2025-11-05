import { test, expect } from '@playwright/test';

/*
============================================================
🎯 PLAYWRIGHT TIMEOUTS — TAM REHBER
============================================================

⏰ Playwright'ta farklı seviyelerde "timeout" kavramları vardır.
Her biri farklı amaca hizmet eder. Aşağıda detaylıca açıklanmıştır:

📘 1️⃣ GLOBAL TIMEOUT (default: yok)
------------------------------------------------------------
👉 Tüm test dosyasının toplam çalışma süresini sınırlar.
   Yani testlerin toplam süresi bu limiti aşarsa Playwright testleri durdurur.
🔹 Ayar yeri: playwright.config.ts içinde → globalTimeout

   örn:
   export default defineConfig({
     globalTimeout: 60000, // 1 dakika
   });

📘 2️⃣ TEST TIMEOUT (default: 30000 ms)
------------------------------------------------------------
👉 Tek bir testin maksimum çalışma süresidir.
   Eğer test bu süre içinde tamamlanmazsa hata verir.
🔹 Ayar yeri: playwright.config.ts → timeout
🔹 Test bazında ayarlanabilir:
     test.setTimeout(10000);

📘 3️⃣ ACTION TIMEOUT (default: yok)
------------------------------------------------------------
👉 click(), fill(), type(), textContent() gibi *tekil eylemlerin*
   maksimum süresidir.
🔹 Ayar yeri:
     test.use({ actionTimeout: 5000 });
   veya
     await page.setDefaultTimeout(5000);

📘 4️⃣ NAVIGATION TIMEOUT (default: yok)
------------------------------------------------------------
👉 page.goto(), page.reload(), page.waitForNavigation()
   gibi sayfa geçişlerinin bekleme süresidir.
🔹 Ayar yeri:
     test.use({ navigationTimeout: 10000 });
   veya
     await page.setDefaultNavigationTimeout(10000);

📘 5️⃣ EXPECT TIMEOUT (default: 5000 ms)
------------------------------------------------------------
👉 expect(locator).toHaveText() gibi locator assertion’larının
   maksimum bekleme süresidir.
   Yani Playwright, elementin beklenen hale gelmesi için 5 sn bekler.
🔹 Ayar yeri:
     await expect(locator).toBeVisible({ timeout: 10000 });

============================================================
*/

test.describe('⏱ Timeout Demonstration Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://uitestingplayground.com/ajax');
  });

  // 🔹 TEST 1 — TEST TIMEOUT (tek testin süresi)
  test('Test Timeout örneği', async ({ page }) => {
    test.setTimeout(5000); // sadece bu test için 5 sn limit
    console.log('💡 Bu test bilerek 5sn test timeout sınırını aşıyor. Hata bekleniyor.');

    await page.getByText('Button triggering AJAX request').click();
    await page.waitForTimeout(6000); // bilerek 6 sn bekliyoruz

    // Bu noktada test timeout’a takılır
    // ❌ Hata: "Test timeout of 5000ms exceeded"
  });

  // 🔹 TEST 2 — ACTION TIMEOUT (tekil komut)
  test('Action Timeout örneği', async ({ page }) => {
    await page.setDefaultTimeout(3000);
    console.log('💡 Bu test bilerek action timeout tetikleyecek. Hata bekleniyor.');

    await page.getByText('Button triggering AJAX request').click();
    const successButton = page.locator('.bg-success');

    await successButton.click(); // ❌ "Timeout 3000ms exceeded"
  });

  // 🔹 TEST 3 — EXPECT TIMEOUT
  test('Expect Timeout örneği', async ({ page }) => {
    console.log('💡 Bu test bilerek expect timeout tetikleyecek. Hata bekleniyor.');

    await page.getByText('Button triggering AJAX request').click();
    const successButton = page.locator('.bg-success');

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {
      timeout: 10000, // default 5s → 10s
    });

    console.log('✅ Expect assertion 10sn içinde başarılı olursa bu log görünür.');
  });

  // 🔹 TEST 4 — NAVIGATION TIMEOUT
  test('Navigation Timeout örneği', async ({ page }) => {
    await page.setDefaultNavigationTimeout(3000);
    console.log('💡 Bu test bilerek navigation timeout tetikleyecek. Hata bekleniyor.');

    // yavaş yüklenen bir sayfayı simulate etmek için bilerek yanlış port
    await page.goto('https://example.com:81', { timeout: 5000 });
    // Eğer sayfa 3sn içinde yüklenmezse
    // ❌ "Timeout 3000ms exceeded during navigation"
  });
});

/*
============================================================
💡 ÖZET:
------------------------------------------------------------
✅ Global Timeout → tüm test run'ının limiti
✅ Test Timeout → tek testin limiti
✅ Action Timeout → click, fill gibi aksiyonlar için
✅ Navigation Timeout → sayfa geçişleri için
✅ Expect Timeout → assertion beklemeleri için

Her biri farklı seviyede uygulanır ve üst seviye
timeout’lar alttakileri kapsar (nested yapı).
============================================================
*/
