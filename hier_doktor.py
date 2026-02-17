
import os
import requests
import json
from datetime import datetime

class HierarchyDoctor:
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
        prefix = "[+]" if type == "INFO" else "[!]" if type == "ERROR" else "[?]"
        print(f"{prefix} {message}")

    def check_super_admin(self):
        self.log("Süper Admin (Ferhat Karaduman) durumu kontrol ediliyor...")
        res = requests.get(f"{self.base_url}/rest/v1/profiles?id=eq.195e3a1d-9d01-4922-8f5c-c596f0371d94", headers=self.headers)
        if res.status_code == 200:
            data = res.json()
            if data and data[0].get('is_super_admin'):
                self.log("Ferhat Karaduman: SÜPER ADMİN YETKİSİ AKTİF. ✅")
            else:
                self.log("Ferhat Karaduman: Süper admin yetkisi bulunamadı!", "ERROR")
        else:
            self.log("Profil verisi çekilemedi.", "ERROR")

    def check_isolation_logic(self):
        self.log("Panel izolasyon mantığı kontrol ediliyor...")
        # Basit bir check: Profiles listesinde farklı tenant_id'leri görebiliyor muyuz?
        res = requests.get(f"{self.base_url}/rest/v1/profiles?select=tenant_id", headers=self.headers)
        if res.status_code == 200:
            tenants = set([p.get('tenant_id') for p in res.json()])
            self.log(f"Sistemde erişilebilen benzersiz Kurum ID sayısı: {len(tenants)}")
            if len(tenants) > 1:
                self.log("Multi-Tenant veri erişimi doğrulanmıştır. ✅")
            else:
                self.log("Sistemde sadece tek bir kurum verisi var veya izolasyon kısıtlı.", "WARN")

    def run(self):
        print("\n" + "="*60)
        print(f"HİYERARŞİ DOKTORU - FİNAL KONTROL - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*60 + "\n")
        self.check_super_admin()
        self.check_isolation_logic()
        print("\n" + "="*60 + "\n")

if __name__ == "__main__":
    doctor = HierarchyDoctor()
    doctor.run()
