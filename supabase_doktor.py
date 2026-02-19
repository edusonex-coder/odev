import os
import glob
import sys

def run_doctor():
    # Script'in bulunduğu klasörü (odevgpt) baz alarak yolları belirle
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    print("\n" + "="*60)
    print("🩺 ODEVGPT SUPABASE SISTEM DOKTORU - v2.3 (Auto-Path)")
    print("="*60)

    # 1. Migrasyon Dosyaları Kontrolü
    print("\n[1] 📁 Yerel Migrasyon Dosyaları Analizi...")
    
    # Proje köküne göre yolu ayarla
    migration_glob = os.path.join(base_dir, "supabase", "migrations", "*.sql")
    migrations = sorted(glob.glob(migration_glob))
    
    if not migrations:
        print(f"❌ HATA: Migrasyon dosyaları bulunamadı!")
        print(f"🔍 Aranan Yol: {migration_glob}")
    else:
        print(f"✅ Toplam {len(migrations)} migrasyon dosyası tespit edildi.")
        
        # Son 5 migrasyonu listele
        print("\n⏳ Son eklenen kritik migrasyonlar:")
        for m in migrations[-5:]:
            print(f"  - {os.path.basename(m)}")

    # 2. SQL Hata Tahmini
    print("\n[2] 🔍 Bilinen İsim Mismatch ve Hata Kontrolü...")
    
    checks = {
        "20260215_assignment_improvements.sql": "Tablo ismi 'assignment_submissions'.",
        "20260217_holding_analytics_view.sql": "View ismi 'holding_performance_summary'.",
        "20260219_CEO_RADICAL_UPGRADE.sql": "AI Cost Intelligence sütunları kontrolü.",
        "20260219_TENANT_AI_PERSONALITY.sql": "White-label AI promptları kontrolü.",
    }

    for file, info in checks.items():
        # Dosya var mı kontrolü
        file_path = os.path.join(base_dir, "supabase", "migrations", file)
        if os.path.exists(file_path):
            print(f"  💡 {file}: {info}")
        else:
            print(f"  ❌ KRİTİK EKSİK: {file} yerelde bulunamadı!")

    # 3. Aksiyon Planı
    print("\n" + "="*60)
    print("🏁 TEŞHİS TAMAMLANDI")
    print("="*60)
    print(f"📌 Çalışılan Dizin: {os.getcwd()}")
    print(f"🚀 Proje Kökeni: {base_dir}")
    print("\n💡 Öneri: Supabase'de 'SUPABASE_SISTEM_TANILAMA.sql'i çalıştırmayı unutmayın.")
    print("="*60 + "\n")

if __name__ == "__main__":
    run_doctor()
