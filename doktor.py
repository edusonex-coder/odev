
import os
import requests
import json
from datetime import datetime

class OdevGPTDoctor:
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
        # Script'in bulunduğu dizindeki .env dosyasını bul
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
        self.report.append(f"{type}: {message}")

    def error(self, message):
        self.log(message, "ERROR")
        self.issues.append(message)

    def check_supabase_connectivity(self):
        self.log("Supabase bağlantısı kontrol ediliyor...")
        if not self.base_url or not self.anon_key:
            self.error("Supabase URL veya Anon Key eksik!")
            return False
            
        try:
            res = requests.get(f"{self.base_url}/rest/v1/", headers=self.headers)
            if res.status_code == 200:
                self.log("Supabase API yanıt veriyor.")
                return True
            else:
                self.error(f"Supabase API hatası: {res.status_code}")
                return False
        except Exception as e:
            self.error(f"Bağlantı hatası: {str(e)}")
            return False

    def check_tenants(self):
        self.log("Tenants (Kurumlar) tablosu taranıyor...")
        res = requests.get(f"{self.base_url}/rest/v1/tenants?select=*", headers=self.headers)
        if res.status_code == 200:
            tenants = res.json()
            self.log(f"Toplam {len(tenants)} kurum bulundu.")
            
            for t in tenants:
                self.log(f"Kurum: {t.get('name')} | Slug: {t.get('slug')} | ID: {t.get('id')}")
            
            domains = [t.get('domain') for t in tenants if t.get('domain')]
            if len(domains) != len(set(domains)):
                self.error("Mükerrer domain tanımları bulundu!")
                
            for t in tenants:
                if not t.get('slug'):
                    self.error(f"Kurumun slug'ı eksik: {t.get('name')}")
                if not t.get('primary_color'):
                    self.log(f"Uyarı: {t.get('name')} için primary_color tanımlanmamış.", "WARN")
        else:
            self.error(f"Tenants tablosuna erişilemedi: {res.status_code}")

    def check_profiles(self):
        self.log("Profiller ve Tenant ilişkileri taranıyor...")
        res = requests.get(f"{self.base_url}/rest/v1/profiles?select=*", headers=self.headers)
        if res.status_code == 200:
            profiles = res.json()
            self.log(f"Erişilebilen profil sayısı: {len(profiles)}")
            
            missing_tenant = [p for p in profiles if not p.get('tenant_id')]
            if missing_tenant:
                self.error(f"{len(missing_tenant)} profil herhangi bir kuruma (tenant) bağlı değil!")
                for p in missing_tenant:
                    self.log(f"Bağımsız Profil: {p.get('full_name')} | Rol: {p.get('role')} | ID: {p.get('id')}", "WARN")
        else:
            self.error(f"Profillere erişilemedi: {res.status_code}")

    def check_data_integrity(self):
        self.log("Veri bütünlüğü kontrol ediliyor...")
        # Soru ve çözüm sayılarını karşılaştır
        q_res = requests.get(f"{self.base_url}/rest/v1/questions?select=id", headers=self.headers)
        s_res = requests.get(f"{self.base_url}/rest/v1/solutions?select=id", headers=self.headers)
        
        if q_res.status_code == 200 and s_res.status_code == 200:
            self.log(f"Toplam Sorular: {len(q_res.json())}")
            self.log(f"Toplam Çözümler: {len(s_res.json())}")
        else:
            self.log("Soru/Çözüm istatistikleri alınamadı.", "WARN")

    def run(self):
        print("\n" + "="*50)
        print(f"ODEVPGT SİSTEM DOKTORU - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*50 + "\n")
        
        if self.check_supabase_connectivity():
            self.check_tenants()
            self.check_profiles()
            self.check_data_integrity()
        
        print("\n" + "="*50)
        if not self.issues:
            print(" SONUÇ: SİSTEM SAĞLIKLI! 🎉")
        else:
            print(f" SONUÇ: {len(self.issues)} ADET KRİTİK SORUN BULUNDU!")
            for issue in self.issues:
                print(f" - {issue}")
        print("="*50 + "\n")

if __name__ == "__main__":
    doctor = OdevGPTDoctor()
    doctor.run()
