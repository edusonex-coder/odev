import { test, expect } from '@playwright/test';

test.describe('OdevGPT Temel İş Akışı (Smoke Test)', () => {

    test.beforeEach(async ({ page }) => {
        // Mocking Supabase Auth for Dashboard Access
        await page.addInitScript(() => {
            const mockSession = {
                user: { id: 'test-user-id', email: 'test@edusonex.com' },
                access_token: 'fake-token',
                refresh_token: 'fake-refresh-token',
                expires_at: Math.floor(Date.now() / 1000) + 3600
            };
            window.localStorage.setItem('sb-vjpsowjzhjxvxjxvxjvx-auth-token', JSON.stringify(mockSession));
            // Note: The key varies by project. If it doesn't work, we'll check the exact key.
        });
    });

    test('Uygulama Temel Varlık Kontrolü', async ({ page }) => {
        await page.goto('/login');
        // 'Ö' harfi için esnek regex
        await expect(page).toHaveTitle(/devGPT/);
    });

    test('Sokratik Rehberden Soru Sor Ekranına Veri Transferi', async ({ page }) => {
        // 1. Durumu hazırla (Rehberden gelmiş gibi)
        await page.goto('/'); // Base URL
        await page.evaluate(() => {
            localStorage.setItem('ask_question_draft_text', 'Test Soru Metni');
            localStorage.setItem('ask_question_draft_subject', 'matematik');
        });

        // 2. Soru sor sayfasına git
        await page.goto('/dashboard/ask');

        // 3. Verilerin kutulara dolduğunu doğrula
        const questionArea = page.locator('textarea[placeholder*="buraya yazabilir"]');
        await expect(questionArea).toHaveValue('Test Soru Metni');

        // Ders seçiminin Matematik olarak işaretlendiğini doğrula
        const subjectSelect = page.locator('button:has-text("Matematik")');
        await expect(subjectSelect).toBeVisible();
    });

    test('Görsel Sıkıştırma Modülü Varlığı', async ({ page }) => {
        await page.goto('/dashboard/ask');
        const cameraBtn = page.locator('button:has-text("Kamera")');
        await expect(cameraBtn).toBeVisible();
    });
});
