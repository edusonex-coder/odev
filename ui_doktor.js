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
        console.log("\n✅ TEŞHİS: Tüm taranan sayfalar tertemiz.");
    } catch (e) {
        console.error("\n⚠️ UYARI: Bazı sayfalarda kritik konsol hataları veya network (400/404) hataları tespit edildi!");
        console.error("Bu hatalar veri kaybına veya AI servislerinin çalışmamasına neden olabilir.");
        console.error("Lütfen yukarıdaki hata loglarını inceleyin.");
    }

    console.log("\n✅ DOKTOR RAPORU: Temel akışlar çalışıyor ancak yan servislerde (AI Cache vb.) pürüzler olabilir.");
    console.log("Prestij kaybı riski: DÜŞÜK (Ama teknik borç rüzgarı esiyor)");
} catch (error) {
    console.error("\n❌ KRİTİK HATA TESPİT EDİLDİ!");
    console.error("Ana kullanıcı akışları (Login, Soru Sorma vb.) KIRILMIŞ DURUMDA!");
    console.error("ACİL MÜDAHALE GEREKİR.");
    process.exit(1);
}
