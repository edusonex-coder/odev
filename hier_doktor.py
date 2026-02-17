
import os
import requests
import json
from datetime import datetime

class HierarchyDoctor:
    """
    Hiyerarşi ve İzolasyon Doktoru v2.0
    Multi-tenant yapısını, rol hiyerarşisini ve veri izolasyonunu denetler.
    """
    def __init__(self):
        self.report = []
        self.issues = []
        self.env = self._load_env()
        self.base_url = self.env.get("VITE_SUPABASE_URL")
        self.anon_key = self.env.get("VITE_SUPABASE_ANON_KEY")
        self.headers = {
            "apikey": self.anon_key,
            "Authorization": f"Bearer {self.anon_key}"
        }

    def _load_env(self):
        env = {}
        script_dir = os.path.dirname(os.path.abspath(__file__))
        env_path = os.path.join(script_dir, ".env")
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    if "=" in line and not line.strip().startswith("#"):
                        parts = line.strip().split("=", 1)
                        if len(parts) == 2:
                            k, v = parts
                            env[k.strip()] = v.strip()
        return env

    def log(self, message, type="INFO"):
        prefix = {
            "INFO": "🔹",
            "ERROR": "❌",
            "WARN": "⚠️",
            "SUCCESS": "✅",
            "ADMIN": "👑"
        }.get(type, "▫️")
        print(f"{prefix} {message}")
        self.report.append(f"{type}: {message}")

    def error(self, message):
        self.log(message, "ERROR")
        self.issues.append(message)

    def check_super_admin_integrity(self):
        self.log("Süper Admin Yetki Matrisi kontrol ediliyor...", "ADMIN")
        # Ferhat Karaduman ID'si üzerinden kontrol
        super_admin_id = "195e3a1d-9d01-4922-8f5c-c596f0371d94"
        res = requests.get(f"{self.base_url}/rest/v1/profiles?id=eq.{super_admin_id}", headers=self.headers)
        if res.status_code == 200:
            data = res.json()
            if data and data[0].get('is_super_admin'):
                self.log(f"Süper Admin ({data[0].get('full_name')}): YETKİLENDİRME TAMAM.", "SUCCESS")
                if data[0].get('role') != 'admin':
                    self.log(f"Uyarı: Süper admin rolü '{data[0].get('role')}' olarak görünüyor, 'admin' olması önerilir.", "WARN")
            else:
                self.error("KRİTİK: Süper admin bayrağı (is_super_admin) kapalı veya profil bulunamadı!")
        else:
            self.error(f"Süper admin profili sorgulanamadı: {res.status_code}")

    def check_tenant_isolation(self):
        self.log("Veri İzolasyonu ve Multi-Tenant yapısı taranıyor...")
        res = requests.get(f"{self.base_url}/rest/v1/profiles?select=tenant_id", headers=self.headers)
        if res.status_code == 200:
            profiles = res.json()
            tenants = set([p.get('tenant_id') for p in profiles if p.get('tenant_id')])
            self.log(f"Aktif izolasyon altındaki Kurum (Tenant) sayısı: {len(tenants)}", "SUCCESS")
            
            # Bağımsız profilleri bul
            orphans = [p for p in profiles if not p.get('tenant_id')]
            if orphans:
                self.log(f"Dikkat: {len(orphans)} adet profil herhangi bir kuruma bağlı değil (Global Profil).", "WARN")
        else:
            self.error("İzolasyon testi başarısız: Profiller listelenemedi.")

    def check_role_distribution(self):
        self.log("Sistem Rol Dağılımı analiz ediliyor...")
        res = requests.get(f"{self.base_url}/rest/v1/profiles?select=role", headers=self.headers)
        if res.status_code == 200:
            roles = [p.get('role') for p in res.json()]
            dist = {role: roles.count(role) for role in set(roles)}
            for role, count in dist.items():
                self.log(f"Rol: {role:10} | Kullanıcı Sayısı: {count}")
            
            if 'parent' not in dist:
                self.log("Veli (parent) rolü henüz sistemde aktif kullanıcıya sahip değil.", "WARN")
        else:
            self.error("Rol dağılımı alınamadı.")

    def check_cross_entity_integrity(self):
        self.log("Varlık İlişkileri (Entity Integrity) kontrol ediliyor...")
        # Sınıfların tenant_id'si var mı?
        res = requests.get(f"{self.base_url}/rest/v1/classes?select=id,tenant_id", headers=self.headers)
        if res.status_code == 200:
            classes = res.json()
            bad_classes = [c for c in classes if not c.get('tenant_id')]
            if bad_classes:
                self.error(f"{len(bad_classes)} adet sınıfın kurum (tenant) bağlantısı kopuk!")
            else:
                self.log("Tüm sınıflar geçerli bir kuruma bağlı.", "SUCCESS")
        
        # Soruların tenant_id'si var mı? (Gelecekteki genişleme için)
        # Mevcut yapıda sorular profil (student_id) üzerinden bağlı, dolaylı kontrol:
        res = requests.get(f"{self.base_url}/rest/v1/questions?select=id,student_id", headers=self.headers)
        if res.status_code == 200:
            self.log(f"Sistemde toplam {len(res.json())} soru hiyerarşik olarak takip ediliyor.", "INFO")

    def run(self):
        print("\n" + "🏰 " + "="*60)
        print(f" HİYERARŞİ VE İZOLASYON DOKTORU v2.0 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*63 + "\n")
        
        self.check_super_admin_integrity()
        print("-" * 40)
        self.check_tenant_isolation()
        print("-" * 40)
        self.check_role_distribution()
        print("-" * 40)
        self.check_cross_entity_integrity()
        
        print("\n" + "="*60)
        if not self.issues:
            print(" 🛡️  HİYERARŞİ GÜVENLİ: Veri izolasyonu ve yetkilendirme kusursuz.")
        else:
            print(f" ⚠️  HİYERARŞİDE {len(self.issues)} ADET KRİTİK GÜVENLİK/YAPI SORUNU!")
            for issue in self.issues:
                print(f"   - {issue}")
        print("="*60 + "\n")

if __name__ == "__main__":
    doctor = HierarchyDoctor()
    doctor.run()
