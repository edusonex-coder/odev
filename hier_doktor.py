
import os
import requests
import json
from datetime import datetime

class HierarchyDoctor:
    """
    Hiyerarşi ve İzolasyon Doktoru v2.1 - "Session & Persistence Watcher"
    Sayfa geçişlerinde yetki kaybı olup olmadığını ve veri hiyerarşisinin 
    Frontend navigasyonuyla uyumunu denetler.
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
        prefix = {"INFO": "🔹", "ERROR": "❌", "WARN": "⚠️", "SUCCESS": "✅", "ADMIN": "👑", "SEC": "🛡️"}.get(type, "▫️")
        print(f"{prefix} {message}")

    def check_navigation_auth_persistence(self):
        self.log("Navigasyon sırasında yetki kaybı riski analizi...", "SEC")
        # RLS politikalarının 'anon' rollere açık olup olmadığını simüle et
        res = requests.get(f"{self.base_url}/rest/v1/profiles", headers={"apikey": self.anon_key})
        if res.status_code == 401 or res.status_code == 403:
            self.log("Güvenlik Duvarı: Giriş yapmayan kullanıcılar profillere erişemiyor. (Normal)", "SUCCESS")
        elif res.status_code == 200:
            self.log("Uyarı: Giriş yapmayanlar profil listesini görebiliyor! Bu, navigasyonda veri sızıntısına yol açabilir.", "WARN")

    def check_tenant_link_persistence(self):
        self.log("Kurum (Tenant) bağlarının kalıcılığı kontrol ediliyor...")
        # Eğer bir profilin tenant_id'si null ise, sayfa geçişinde o kullanıcı her şeyi boş görecektir.
        res = requests.get(f"{self.base_url}/rest/v1/profiles?tenant_id=is.null", headers=self.headers)
        if res.status_code == 200:
            null_tenants = res.json()
            if null_tenants:
                self.log(f"Kritik: {len(null_tenants)} adet kullanıcının Kurum ID'si eksik. Bu kullanıcılar sayfaları boş görecektir!", "ERROR")
            else:
                self.log("Tüm kullanıcılar geçerli bir kuruma bağlı.", "SUCCESS")

    def run(self):
        print("\n" + "🏰 " + "="*60)
        print(f" HİYERARŞİ DOKTORU v2.1 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(" [Teşhis: Yetkilendirme Kalıcılığı & İzolasyon]")
        print("="*63 + "\n")
        
        self.check_navigation_auth_persistence()
        self.check_tenant_link_persistence()
        
        print("\n" + "="*60)
        print(" ✅ TEŞHİS: Navigasyondaki 'boşalma' hiyerarşik bir yetki hatasından ziyade,")
        print("           Frontend'deki 'Auth State'in anlık kesilmesiyle ilgili olabilir.")
        print("="*60 + "\n")

if __name__ == "__main__":
    doctor = HierarchyDoctor()
    doctor.run()
