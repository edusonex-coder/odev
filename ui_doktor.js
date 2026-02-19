import { execSync } from 'child_process';
import fs from 'fs';

console.log("====================================================");
console.log("🚀 OdevGPT UI DOKTORU - E2E TEST VE AKIŞ KONTROLÜ");
console.log("====================================================");

try {
    console.log("🔍 Sayfalar arası veri transferi ve kritik akışlar test ediliyor...");
    execSync('npx playwright test', { stdio: 'inherit' });
    console.log("\n✅ TEŞHİS: Tüm kullanıcı akışları sağlıklı çalışıyor.");
    console.log("Prestij kaybı riski: DÜŞÜK");
} catch (error) {
    console.error("\n❌ HATA TESPİT EDİLDİ!");
    console.error("Bazı kullanıcı akışları kırılmış olabilir.");
    console.log("\nDetaylı rapor için: npm run test:ui:report");
    process.exit(1);
}
