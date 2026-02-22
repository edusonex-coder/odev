import { test, expect } from '@playwright/test';

// Supabase Project ID from .env: gxgvhuwsstupjgpziejg
const SUPABASE_PROJECT_ID = 'gxgvhuwsstupjgpziejg';

test.describe('OdevGPT Temel İş Akışı (Smoke Test)', () => {

    test.beforeEach(async ({ page }) => {
        // Mocking Supabase Auth for Dashboard Access
        await page.addInitScript(({ projectId }) => {
            const mockSession = {
                user: {
                    id: 'test-user-id',
                    email: 'test@edusonex.com',
                    user_metadata: { full_name: 'Test Kullanıcı' }
                },
                access_token: 'fake-token',
                refresh_token: 'fake-refresh-token',
                expires_at: Math.floor(Date.now() / 1000) + 3600
            };
            // Dynamic key based on Project ID
            window.localStorage.setItem(`sb-${projectId}-auth-token`, JSON.stringify(mockSession));
        }, { projectId: SUPABASE_PROJECT_ID });
    });

    test('Uygulama Temel Varlık Kontrolü', async ({ page }) => {
        await page.goto('/login');
        await expect(page).toHaveTitle(/devGPT/i);
    });

    test('Sokratik Rehberden Soru Sor Ekranına Veri Transferi', async ({ page }) => {
        // 1. Durumu hazırla (Rehberden gelmiş gibi)
        await page.goto('/');
        await page.evaluate(() => {
            localStorage.setItem('ask_question_draft_text', 'Test Soru Metni');
            localStorage.setItem('ask_question_draft_subject', 'matematik');
        });

        // 2. Soru sor sayfasına git
        await page.goto('/dashboard/ask');

        // Yönlendirmeyi bekle (Auth kontrolü için kritik)
        await page.waitForURL('**/dashboard/ask');

        // 3. Verilerin kutulara dolduğunu doğrula
        // Placeholder metnine daha esnek yaklaşalım
        const questionArea = page.getByPlaceholder(/sorunu buraya yazabilir/i);
        await expect(questionArea).toHaveValue('Test Soru Metni');

        // Ders seçiminin Matematik olarak işaretlendiğini doğrula
        // SelectTrigger genellikle bir butondur ve seçili değeri gösterir
        const subjectSelect = page.locator('button').filter({ hasText: 'Matematik' });
        await expect(subjectSelect).toBeVisible();
    });

    test('Görsel Sıkıştırma Modülü Varlığı', async ({ page }) => {
        await page.goto('/dashboard/ask');
        await page.waitForURL('**/dashboard/ask');

        // "Kamera" metnini içeren butonu bul
        const cameraBtn = page.getByRole('button', { name: /kamera/i });
        await expect(cameraBtn).toBeVisible();
    });
});
