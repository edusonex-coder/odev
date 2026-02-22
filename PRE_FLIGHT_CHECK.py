import os
import re
import glob

def check_rls_integrity():
    print("\n[🛡️] RLS Integrity & Sovereign Shield Check...")
    migration_dir = "supabase/migrations"
    migrations = sorted(glob.glob(os.path.join(migration_dir, "*.sql")))
    
    critical_tables = [
        'profiles', 'questions', 'solutions', 'classes', 
        'class_students', 'announcements', 'assignments', 
        'assignment_submissions', 'ai_approvals', 'tenants'
    ]
    
    # En son migrasyonu (V14 ve sonrası) ana kaynak olarak al
    latest_migrations_content = ""
    target_files = [m for m in migrations if "Z_FINAL_REMEDY" in m or "AI_APPROVALS" in m or "SUPREME_SEED" in m]
    
    for m in target_files:
        with open(m, 'r', encoding='utf-8') as f:
            latest_migrations_content += f.read()

    missing_rls = []
    for table in critical_tables:
        # ENABLE ROW LEVEL SECURITY kontrolü
        if not re.search(f"ALTER TABLE\s+(public\.)?{table}\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY", latest_migrations_content, re.IGNORECASE):
            # Belki daha eski dosyalardadır, tüm içeriğe bak
            full_content = ""
            for m in migrations:
                with open(m, 'r', encoding='utf-8', errors='ignore') as f:
                    full_content += f.read()
            if not re.search(f"ALTER TABLE\s+(public\.)?{table}\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY", full_content, re.IGNORECASE):
                missing_rls.append(table)

    if missing_rls:
        print(f"  ❌ KRİTİK: Şu tablolar için RLS aktif edilmemiş görünüyor: {', '.join(missing_rls)}")
    else:
        print("  ✅ Tüm kritik tablolar için RLS aktif (Sovereign Shield Aktif).")

def check_frontend_vulnerabilities():
    print("\n[💻] Frontend Security Scan...")
    src_dir = "src"
    patterns = {
        r"localStorage\.set(Item)?\('role'": "GÜVENLİK UYARISI: Kullanıcı rolü localStorage'da saklanıyor mu? (Sadece UI içinse OK, yetki için AuthContext kullanılmalı)",
        r"supabase\.from\(['\"]profiles['\"]\)\.select\(['\"]\*\s*['\"]\)": "PERFORMANS: profiles tablosundan * çekmek verimsiz olabilir.",
        r"\.select\(['\"]\*\s*['\"]\)": "DİKKAT: Büyük tablolarda '*' kullanımı bant genişliğini yorar.",
        r"anon_key.*=.*['\"]": "TEHLİKE: Kod içinde hardcoded anon_key tespit edildi (Çoğunlukla .env'de olmalı)."
    }
    
    files = glob.glob(os.path.join(src_dir, "**", "*.tsx"), recursive=True) + \
            glob.glob(os.path.join(src_dir, "**", "*.ts"), recursive=True)
            
    vulnerabilities_found = 0
    for file_path in files:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            for pattern, msg in patterns.items():
                if re.search(pattern, content):
                    # print(f"  [!] {os.path.basename(file_path)}: {msg}")
                    vulnerabilities_found += 1
                    
    print(f"  ✅ Frontend tarandı. {vulnerabilities_found} potansiyel uyarı/iyileştirme alanı bulundu.")

def check_environment_sync():
    print("\n[⚙️] Environment & Connection Check...")
    env_path = ".env"
    if not os.path.exists(env_path):
        print("  ❌ HATA: .env dosyası eksik!")
        return

    with open(env_path, 'r') as f:
        content = f.read()
        needed = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"]
        for key in needed:
            if key not in content:
                print(f"  ❌ HATA: {key} .env içinde eksik!")
            else:
                print(f"  ✅ {key} hazır.")

if __name__ == "__main__":
    print("="*60)
    print("🚀 ODEVGPT PRE-FLIGHT SYSTEM DOCTOR (Piyasa Öncesi Tam Tarama)")
    print("="*60)
    
    check_rls_integrity()
    check_frontend_vulnerabilities()
    check_environment_sync()
    
    print("\n" + "="*60)
    print("🏁 TARAMA TAMAMLANDI")
    print("💡 Tavsiye: docs/ODEVGPT_TECHNICAL_WHITEPAPER.md içindeki mimariyi son kez gözden geçirin.")
    print("="*60)
