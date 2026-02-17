
import os
import requests
import json
from datetime import datetime

class OdevGPTDoctor:
    """
    OdevGPT Sistem Doktoru v2.1 - "Persistent State & Session Analyst"
    Frontend ve Backend arasındaki veri akışını, oturum kalıcılığını ve 
    sayfa geçişlerindeki veri kayıplarını analiz eder.
    """
    def __init__(self):
        self.report = []
        self.issues = []
        self.warnings = []
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
        prefix = {"INFO": "[+]", "ERROR": "[!]", "WARN": "[?]", "SUCCESS": "[✅]", "DEBUG": "[*]"}.get(type, "[-]")
        print(f"{prefix} {message}")
        self.report.append(f"{type}: {message}")

    def error(self, message):
        self.log(message, "ERROR")
        self.issues.append(message)

    def warn(self, message):
        self.log(message, "WARN")
        self.warnings.append(message)

    def check_env_consistency(self):
        self.log("Çevresel değişkenlerin Frontend ile uyumu kontrol ediliyor...")
        required = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"]
        for var in required:
            val = self.env.get(var)
            if not val:
                self.error(f"Kritik Değişken Eksik: {var}")
            elif len(val) < 20: 
                self.warn(f"{var} değeri şüpheli derecede kısa. Hatalı kopyalanmış olabilir.")

    def check_auth_config(self):
        self.log("Oturum (Auth) ve Cache ayarları taranıyor...")
        # Supabase sunucu tarafı ayarlarını anon key ile tam göremeyiz ama temel kontrol yapabiliriz
        res = requests.get(f"{self.base_url}/auth/v1/settings", headers=self.headers)
        if res.status_code == 200:
            settings = res.json()
            # External providers, session timeout vb.
            self.log(f"Auth Ayarları Alındı: {len(settings)} parametre aktif.", "SUCCESS")
        else:
            self.warn(f"Sunucu tarafı Auth ayarları kısıtlı (Kod: {res.status_code}). Bu, Frontend tarafındaki AuthContext kaybına işaret edebilir.")

    def analyze_data_emptying_risk(self):
        self.log("Sayfaların 'boşalma' (data emptying) riski analiz ediliyor...")
        # Tablolarda veri var mı? Eğer veri olmasına rağmen sayfa boşsa Frontend Cache/State sorunu vardır.
        tables = ["questions", "profiles", "tenants"]
        headers_with_count = self.headers.copy()
        headers_with_count["Prefer"] = "count=exact"
        
        for table in tables:
            res = requests.get(f"{self.base_url}/rest/v1/{table}?select=id&limit=1", headers=headers_with_count)
            if res.status_code in [200, 206]:
                count = res.headers.get("Content-Range", "0/0").split("/")[-1]
                self.log(f"'{table}' tablosunda {count} kayıt var.", "SUCCESS")
                if int(count) == 0:
                    self.warn(f"'{table}' tablosu tamamen boş. Sayfalardaki boşluğun sebebi bu olabilir.")
            else:
                self.log(f"'{table}' tablosu sayımı yapılamadı (Yetki?).", "DEBUG")

    def run(self):
        print("\n" + "🩺 " + "="*60)
        print(f" ODEVGPT SİSTEM DOKTORU v2.1 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(" [Teşhis: Frontend Veri Kayıpları & Oturum Analizi]")
        print("="*63 + "\n")
        
        self.check_env_consistency()
        self.check_auth_config()
        self.analyze_data_emptying_risk()
        
        print("\n" + "="*60)
        if not self.issues:
            print(" ✅ ANALİZ SONUCU: Sunucu tarafı verileri stabil.")
            print(" 💡 TEŞHİS: Sayfa boşalmaları muhtemelen React State (Local State) kaybından kaynaklanıyor.")
            print(" 🛠️ ÖNERİ: Sayfa geçişlerinde veriyi 'localStorage' üzerinden restore eden bir mekanizma eklenmeli.")
        else:
            print(f" ❌ ANALİZ SONUCU: {len(self.issues)} ADET KRİTİK SORUN BULUNDU!")
        
        if self.warnings:
            print(f"\n ⚠️  {len(self.warnings)} Adet Sistem Uyarısı:")
            for w in self.warnings: print(f"   - {w}")
        print("="*60 + "\n")

if __name__ == "__main__":
    doctor = OdevGPTDoctor()
    doctor.run()
