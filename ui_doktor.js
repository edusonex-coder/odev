import { execSync } from 'child_process';
import fs from 'fs';

console.log("====================================================");
console.log("🚀 OdevGPT UI DOKTORU - E2E TEST VE AKIŞ KONTROLÜ");
console.log("====================================================");

try {
    console.log("🔍 [1] Sayfalar arası veri transferi ve kritik akışlar test ediliyor...");
    execSync('npx playwright test tests/e2e/smoke.spec.ts', { stdio: 'inherit' });

    console.log("\n🔍 [2] Konsol Hataları ve Gizli Bug Taraması (Deep Stealth Scan)...");
    try {
        execSync('npx playwright test tests/e2e/console_scanner.spec.ts', { stdio: 'inherit' });
        console.log("\n✅ TEŞHİS: Konsol temiz, gizli hata bulunamadı.");
    } catch (e) {
        console.error("\n⚠️ UYARI: Bazı sayfalarda konsol hataları veya 404/400 istekleri tespit edildi!");
        console.error("Bu hatalar kullanıcı deneyimini bozabilir veya veri kaybına neden olabilir.");
    }

    console.log("\n✅ GENEL TEŞHİS: Sistem temel akışları sağlıklı.");
    console.log("Prestij kaybı riski: DÜŞÜK");
} catch (error) {
    console.error("\n❌ KRİTİK HATA TESPİT EDİLDİ!");
    console.error("Ana kullanıcı akışları kırılmış. Acil müdahale gerekebilir.");
    process.exit(1);
}
