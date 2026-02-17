
import os
import requests
import json
from datetime import datetime

class OdevGPTDoctor:
    """
    OdevGPT Sistem Doktoru v2.0
    Sistem sağlığını tarar, hataları raporlar ve çözüm önerileri sunar.
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
        prefix = {
            "INFO": "[+]",
            "ERROR": "[!]",
            "WARN": "[?]",
            "SUCCESS": "[✅]"
        }.get(type, "[-]")
        print(f"{prefix} {message}")
        self.report.append(f"{type}: {message}")

    def error(self, message):
        self.log(message, "ERROR")
        self.issues.append(message)

    def warn(self, message):
        self.log(message, "WARN")
        self.warnings.append(message)

    def check_env_files(self):
        self.log("Çevresel değişkenler kontrol ediliyor...")
        required = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY", "VITE_GROQ_API_KEY"]
        for var in required:
            if not self.env.get(var):
                self.error(f"Eksik Değişken: {var}")
            else:
                self.log(f"{var} tanımlı.", "SUCCESS")

    def check_supabase_connectivity(self):
        self.log("Supabase API bağlantısı kontrol ediliyor...")
        if not self.base_url: return False
        try:
            res = requests.get(f"{self.base_url}/rest/v1/", headers=self.headers)
            if res.status_code == 200:
                self.log("Supabase REST API aktif.", "SUCCESS")
                return True
            else:
                self.error(f"API Hatası: {res.status_code}")
                return False
        except Exception as e:
            self.error(f"Bağlantı koptu: {str(e)}")
            return False

    def check_storage_health(self):
        self.log("Storage (Depolama) durumu kontrol ediliyor...")
        # buckets endpoint'i anon key ile her zaman erişilebilir olmayabilir ama deneyelim
        res = requests.get(f"{self.base_url}/storage/v1/bucket", headers=self.headers)
        if res.status_code == 200:
            buckets = res.json()
            bucket_names = [b['name'] for b in buckets]
            if 'question_images' in bucket_names:
                self.log("Storage Bucket 'question_images' hazır.", "SUCCESS")
            else:
                self.error("'question_images' bucket'ı bulunamadı!")
        else:
            self.warn(f"Storage buckets listelenemedi (Yetki kısıtlı olabilir): {res.status_code}")

    def check_database_schema(self):
        self.log("Veritabanı tabloları doğrulanıyor...")
        tables = ["tenants", "profiles", "questions", "solutions", "ai_usage_logs"]
        for table in tables:
            res = requests.get(f"{self.base_url}/rest/v1/{table}?limit=1", headers=self.headers)
            if res.status_code in [200, 204]:
                self.log(f"Tablo '{table}' erişilebilir.", "SUCCESS")
            else:
                self.error(f"Tablo '{table}' ERİŞİLEMEZ veya EKSİK! (Kod: {res.status_code})")

    def check_ai_health(self):
        self.log("AI Kullanım Logları analiz ediliyor...")
        res = requests.get(f"{self.base_url}/rest/v1/ai_usage_logs?status=eq.failed&limit=5", headers=self.headers)
        if res.status_code == 200:
            failed_logs = res.json()
            if failed_logs:
                self.warn(f"Son zamanlarda {len(failed_logs)} adet AI hatası kaydedilmiş.")
                for log in failed_logs:
                    self.log(f"AI Hatası ({log.get('provider')}): {log.get('error_message')[:50]}...", "WARN")
            else:
                self.log("AI servisleri sağlıklı görünüyor.", "SUCCESS")

    def run(self):
        print("\n" + "🩺 " + "="*50)
        print(f" ODEVGPT SİSTEM DOKTORU v2.0 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*53 + "\n")
        
        self.check_env_files()
        if self.check_supabase_connectivity():
            self.check_database_schema()
            self.check_storage_health()
            self.check_ai_health()
        
        print("\n" + "="*50)
        if not self.issues:
            print(" 🎉 SONUÇ: SİSTEM SAPASAĞLAM! TÜM SİSTEMLER OPERASYONEL.")
        else:
            print(f" ❌ SONUÇ: {len(self.issues)} ADET KRİTİK SORUN BULUNDU!")
            for issue in self.issues:
                print(f"   - {issue}")
        
        if self.warnings:
            print(f"\n ⚠️  {len(self.warnings)} Adet Uyarı Mevcut:")
            for w in self.warnings:
                print(f"   - {w}")
        
        print("="*50 + "\n")

if __name__ == "__main__":
    doctor = OdevGPTDoctor()
    doctor.run()
