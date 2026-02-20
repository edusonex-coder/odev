import { test, expect } from '@playwright/test';

test.describe('Console Error Scanner', () => {
    const pagesToScan = [
        '/dashboard',
        '/dashboard/history',
        '/dashboard/profile',
        '/dashboard/ask'
    ];

    for (const pagePath of pagesToScan) {
        test(`Scan ${pagePath} for console errors`, async ({ page }) => {
            const errors: string[] = [];
            const consoleErrors: string[] = [];

            // Listen for unhandled exceptions
            page.on('pageerror', (exception) => {
                errors.push(`Uncaught Exception: ${exception.message}`);
            });

            // Listen for console errors
            page.on('console', (msg) => {
                if (msg.type() === 'error') {
                    // Ignore known HMR/WebSocket errors if necessary, but for doctor we want everything
                    consoleErrors.push(`Console Error: ${msg.text()}`);
                }
            });

            // Go to page
            await page.goto(pagePath);

            // Wait for a bit to let async requests fire
            await page.waitForTimeout(3000);

            const allFound = [...errors, ...consoleErrors];

            if (allFound.length > 0) {
                console.log(`\n❌ [${pagePath}] Bulunan Hatalar:`);
                allFound.forEach(err => console.log(`   - ${err}`));
            }

            expect(allFound, `Page ${pagePath} has console errors or exceptions`).toHaveLength(0);
        });
    }
});
