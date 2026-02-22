import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('OdevGPT Visual Health Scan', () => {
    const sitemap = [
        { name: 'landing', path: '/' },
        { name: 'login', path: '/login' },
        { name: 'signup', path: '/signup' },
        { name: 'blog_list', path: '/blog' },
        { name: 'student_dashboard', path: '/dashboard' },
        { name: 'history', path: '/dashboard/history' },
        { name: 'profile', path: '/dashboard/profile' },
        { name: 'ask_question', path: '/dashboard/ask' },
        { name: 'settings', path: '/dashboard/settings' },
        { name: 'leaderboard', path: '/dashboard/leaderboard' },
        { name: 'referral', path: '/dashboard/referral' },
        { name: 'premium', path: '/dashboard/premium' },
        { name: 'teacher_panel', path: '/teacher' },
        { name: 'parent_panel', path: '/parent' },
        { name: 'admin_panel', path: '/dashboard/admin' },
        { name: 'executive', path: '/executive' },
        { name: 'sitemap', path: '/sitemap' }
    ];

    const reportDir = path.join(process.cwd(), '.raporlar', 'visual_scan_' + new Date().toISOString().split('T')[0]);

    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    for (const pageInfo of sitemap) {
        test(`Screenshot: ${pageInfo.name}`, async ({ page }) => {
            // Log in logic if needed - for now just capture what's visible
            // Note: If ProtectedRoute redirects to /login, we will see the login page
            await page.goto(pageInfo.path);
            await page.waitForTimeout(2000); // UI animasyonları için bekle

            const screenshotPath = path.join(reportDir, `${pageInfo.name}.png`);
            await page.screenshot({ path: screenshotPath, fullPage: true });

            console.log(`📸 [VISUAL SCAN] Görsel kaydedildi: ${pageInfo.name}`);
        });
    }
});
