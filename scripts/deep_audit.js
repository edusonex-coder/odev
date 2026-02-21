import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gxgvhuwsstupjgpziejg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4Z3ZodXdzc3R1cGpncHppZWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODQ0NDksImV4cCI6MjA4NjY2MDQ0OX0.t9F-yMUKRZS2s2KciVP3iQM4Ex_3S0cDmejOt_j-zIs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deepAudit() {
    console.log('--- 🚀 ODEVGPT HIYERARŞİ DENETİMİ BAŞLADI ---');

    // 1. Admin Taraması
    console.log('\n[1] Admin & SuperAdmin Kontrolü:');
    const { data: profiles, error: pErr } = await supabase
        .from('profiles')
        .select('id, full_name, role, is_super_admin, tenant_id, tenants(name)');

    if (pErr) { console.error(pErr); return; }

    const adminOrphans = [];
    profiles.forEach(p => {
        if (p.role === 'admin' && !p.is_super_admin && !p.tenant_id) {
            adminOrphans.push(p);
        }
        if (p.role === 'admin') {
            const type = p.is_super_admin ? 'HOLDING ADMIN' : 'SCHOOL ADMIN';
            const context = p.tenant_id ? `Okul: ${p.tenants?.name}` : 'BAĞLAMSIZ (KRİTİK!)';
            console.log(`- ${p.full_name.padEnd(20)} | ${type.padEnd(15)} | ${context}`);
        }
    });

    if (adminOrphans.length > 0) {
        console.warn(`\n⚠️ UYARI: ${adminOrphans.length} adet bağlamı olmayan (Rabia vaka) admin bulundu!`);
    }

    // 2. Tenant Dağılımı
    console.log('\n[2] Kullanıcı Dağılım Özeti:');
    const stats = { individual: 0, school_based: 0 };
    profiles.forEach(p => {
        if (p.tenant_id) stats.school_based++;
        else stats.individual++;
    });
    console.log(`- Kurumsal Kullanıcılar: ${stats.school_based}`);
    console.log(`- Bağımsız Kullanıcılar: ${stats.individual}`);

    // 3. Veri Sızıntısı Analizi (Hızlı check)
    console.log('\n[3] Veri Sızıntısı Kontrolü (Questions):');
    const { data: questions } = await supabase.from('questions').select('id, tenant_id').limit(10);
    const orphanQuestions = questions?.filter(q => !q.tenant_id) || [];
    console.log(`- Bağımsız Sorular: ${orphanQuestions.length} (İncelenen 10 sorudan)`);

    console.log('\n--- 🏁 DENETİM TAMAMLANDI ---');
}

deepAudit();
