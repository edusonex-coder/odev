import { test, expect } from '@playwright/test';

test.describe('Console Error Scanner', () => {
    const pagesToScan = [
        '/dashboard',
        '/dashboard/history',
        '/dashboard/profile',
        '/dashboard/ask',
        '/dashboard/settings',
        '/teacher',
        '/blog',
    ];

    for (const pagePath of pagesToScan) {
        test(`Scan ${pagePath} for console errors`, async ({ page }) => {
            const errors: string[] = [];
            const networkErrors: string[] = [];

            page.on('console', msg => {
                if (msg.type() === 'error' && !msg.text().includes('WebSocket')) {
                    errors.push(`[CONSOLE ERROR] ${msg.text()}`);
                }
            });

            page.on('pageerror', err => {
                errors.push(`[PAGE ERROR] ${err.message}`);
            });

            page.on('requestfailed', request => {
                if (!request.url().includes('localhost')) {
                    networkErrors.push(`[NETWORK ERROR] ${request.url()} - ${request.failure()?.errorText}`);
                }
            });

            // Go to page
            await page.goto(pagePath);

            // Wait for a bit to let async requests fire
            await page.waitForTimeout(3000);

            const allFound = [...errors, ...networkErrors];

            if (allFound.length > 0) {
                console.log(`\n❌ [${pagePath}] Bulunan Hatalar:`);
                allFound.forEach(err => console.log(`   - ${err}`));
            }

            expect(allFound, `Page ${pagePath} has console errors or network failures`).toHaveLength(0);
        });
    }
});
