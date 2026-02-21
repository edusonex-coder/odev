import datetime
import os
import sys

LOG_FILE = "docs/ERROR_EXPERIENCE_LOG.md"

def log_error(error_desc, root_cause, resolution):
    header = f"\n### 📅 {datetime.datetime.now().strftime('%d %B %Y - %H:%M')}\n"
    content = f"- **Hata:** {error_desc}\n- **Kök Neden:** {root_cause}\n- **Çözüm:** {resolution}\n"
    
    if not os.path.exists(LOG_FILE):
        with open(LOG_FILE, "w", encoding="utf-8") as f:
            f.write("# 📓 OdevGPT Hata & Deneyim Günlüğü\n\nBu dosya, gelişim sürecinde karşılaşılan hataların ve çözümlerinin kaydını tutar.\n")
            
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(header + content)
    
    print(f"✅ Deneyim günlüğüne kaydedildi: {LOG_FILE}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Kullanım: python scripts/log_error.py 'Hata' 'Kök Neden' 'Çözüm'")
    else:
        log_error(sys.argv[1], sys.argv[2], sys.argv[3])
