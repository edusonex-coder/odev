import os
import glob
import sys
import re

def run_doctor():
    # Script'in bulunduğu klasörü (odevgpt) baz alarak yolları belirle
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    print("\n" + "="*60)
    print("🩺 ODEVGPT SUPABASE SISTEM DOKTORU - v2.5 (Smart Recovery)")
    print("="*60)

    # 1. Migrasyon Dosyaları Kontrolü
    print("\n[1] 📁 Yerel Migrasyon Dosyaları Analizi...")
    
    migration_dir = os.path.join(base_dir, "supabase", "migrations")
    migration_glob = os.path.join(migration_dir, "*.sql")
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

    # 2. Deep Logic Scan (Anti-Pattern Kontrolü)
    print("\n[2] 🧠 Deep Logic Scan (Zeka Katmanı Analizi)...")
    
    risky_patterns = {
        r"s\.student_id": "Mismatch: 'solutions' (s) tablosunda 'student_id' yoktur. 'questions' ile join yapmalısınız.",
        r"NEW\.student_id.*solutions": "Trigger Hatası: 'solutions' tablosu tetikleyicilerinde NEW.student_id kullanılamaz.",
        r"INSERT INTO solutions.*student_id": "Şema Hatası: 'solutions' tablosuna 'student_id' eklenemez.",
        r"ai_knowledge_graph.*ai_response": "Schema Check: ai_knowledge_graph tablosunda ai_response sütunu kritik öneme sahiptir.",
        r"ENABLE ROW LEVEL SECURITY.*solutions": "Security Notice: Solutions tablosu RLS'i öğrencilerin AI insert yapmasını engellememeli.",
    }

    found_errors = 0
    for m_path in migrations:
        with open(m_path, 'r', encoding='utf-8') as f:
            content = f.read()
            for pattern, message in risky_patterns.items():
                if re.search(pattern, content, re.IGNORECASE):
                    print(f"  ❌ KRİTİK HATA TESPİT EDİLDİ: {os.path.basename(m_path)}")
                    print(f"     ⚠️  {message}")
                    found_errors += 1

    if found_errors == 0:
        print("  ✅ Bilinen mantıksal anti-pattern bulunamadı.")
    else:
        print(f"\n  🛑 Toplam {found_errors} mantıksal hata bulundu. Lütfen DÜZELTİN!")

    # 3. SQL Hata Tahmini
    print("\n[3] 🔍 Bilinen İsim Mismatch ve Hata Kontrolü...")
    
    checks = {
        "20260215_assignment_improvements.sql": "Tablo ismi 'assignment_submissions'.",
        "20260221_badge_engine.sql": "DİKKAT: student_id/solver_id çakışması kontrol edilmeli.",
        "20260219_CEO_RADICAL_UPGRADE.sql": "AI Cost Intelligence sütunları kontrolü.",
    }

    for file, info in checks.items():
        file_path = os.path.join(migration_dir, file)
        if os.path.exists(file_path):
            print(f"  💡 {file}: {info}")
        else:
            print(f"  ⚠️  Opsiyonel/Eski: {file} yerelde yok.")

    # 4. Aksiyon Planı
    print("\n" + "="*60)
    print("🏁 TEŞHİS TAMAMLANDI")
    print("="*60)
    if found_errors > 0:
        print("🚨 DURUM: KRİTİK")
        print("👉 Acilen hatalı migrasyonları düzeltin veya fix SQL'i yazın.")
    else:
        print("✅ DURUM: SAĞLIKLI")
    
    print(f"\n🚀 Proje Kökeni: {base_dir}")
    print("💡 Öneri: Supabase'de 'SUPABASE_SISTEM_TANILAMA.sql'i çalıştırmayı unutmayın.")
    print("="*60 + "\n")

if __name__ == "__main__":
    run_doctor()
