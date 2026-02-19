import { test, expect } from '@playwright/test';

test.describe('OdevGPT Temel İş Akışı (Smoke Test)', () => {

    test('Öğrenci girişi, soru sorma ve Sokratik etkileşim akışı', async ({ page }) => {
        // 1. Giriş Sayfası
        await page.goto('/login');

        // Not: Test ortamında gerçek bir kullanıcı girişi yapmak yerine 
        // AuthContext'i simüle etmek veya önceden tanımlanmış test kullanıcısını kullanmak gerekir.
        // Şimdilik sadece sayfa varlığını ve temel UI elemanlarını kontrol edelim.
        await expect(page).toHaveTitle(/OdevGPT/);

        // 2. Dashboad Kontrolü (Giriş yapılmış varsayarsak)
        // Gerçek test için burada bir login işlemi yapılmalı.
        // await page.fill('input[type="email"]', 'test@edusonex.com');
        // await page.fill('input[type="password"]', 'password');
        // await page.click('button[type="submit"]');

        // 3. Sokratik Rehber ve Benzer Soru Akışı Veri Transfer Testi
        // Bu test, son yaşadığımız "veri taşınmama" sorununu doğrudan simulate eder.
        await test.step('Sokratik rehberden soru sor ekranına veri transferi', async () => {
            // LocalStorage'ı manuel set ederek bir soru detay sayfasındaymış gibi davranalım
            await page.goto('/');
            await page.evaluate(() => {
                localStorage.setItem('ask_question_draft_text', 'Test Soru Metni');
                localStorage.setItem('ask_question_draft_subject', 'matematik');
            });

            // Soru sor sayfasına git
            await page.goto('/dashboard/ask');

            // Input alanlarının dolu olup olmadığını kontrol et
            const questionArea = page.locator('textarea[placeholder*="buraya yazabilir"]');
            await expect(questionArea).toHaveValue('Test Soru Metni');

            const subjectSelect = page.locator('button:has-text("Matematik")');
            // Shadcn select olduğu için text kontrolü yapıyoruz
            await expect(subjectSelect).toBeVisible();
        });
    });

    test('Görsel Sıkıştırma Modülü Varlığı', async ({ page }) => {
        await page.goto('/dashboard/ask');
        // Kamera butonunun varlığını kontrol et
        const cameraBtn = page.locator('button:has-text("Kamera")');
        await expect(cameraBtn).toBeVisible();
    });
});
