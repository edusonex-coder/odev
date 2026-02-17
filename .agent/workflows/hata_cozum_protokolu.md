---
description: Hata Çözüm Protokolü (ASLA FARZETME!)
---

# 🛑 HATA ÇÖZÜM VE DEBUG PROTOKOLÜ (SOKRATİK YAKLAŞIM)

Bu iş akışı, sistemde bir hata (Error), bug veya beklenmedik bir durum oluştuğunda **ZORUNLU** olarak takip edilmelidir. Amacı, yapay zeka halüsinasyonlarını (varsayımları) engellemek ve bilimsel veriye dayalı çözüm üretmektir.

## 1. 🔍 KANIT TOPLAMA (THE EVIDENCE)
**Soru:** "Hatanın kaynağını gösteren somut veriye sahip miyim?"

*   **Veritabanı Hatasıysa:**
    *   ASLA tablo veya kolon adlarını tahmin etme.
    *   Şu SQL sorgularını çalıştırarak şemayı gör:
        ```sql
        -- Tablo ve Kolonları Listele
        SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'ilgili_tablo';
        
        -- Trigger ve Fonksiyonları Listele
        SELECT routine_name, routine_definition FROM information_schema.routines WHERE routine_definition LIKE '%ilgili_terim%';
        ```
*   **Kod Hatasıysa:**
    *   İlgili dosyanın güncel halini `view_file` ile oku. Hafızandaki eski versiyona güvenme.

## 2. 🧠 ANALİZ (THE ANALYSIS)
**Soru:** "Bulduğum kanıtlar, varsayımlarımla örtüşüyor mu?"

*   Loglardaki hata mesajı ne diyor? (Örn: `column 'message' does not exist`)
*   Veritabanı şeması ne diyor? (Örn: `notifications` tablosunda sadece `content` var.)
*   **Çelişki:** Eğer kod `message` kullanıyorsa ama şemada `content` varsa, suçlu sensin! Kodu şemaya uydur.

## 3. 🧪 DOĞRULAMA (THE VERIFICATION)
**Soru:** "Önerdiğim çözümün çalışacağını nasıl garanti edebilirim?"

*   SQL yazıyorsan, önce `SELECT` ile veriyi gör.
*   Fonksiyon değiştiriyorsan, eski fonksiyonu `DROP` etmeyi unutma.
*   Çözümden önce kendine sor: "Bunu daha önce denedim mi? Kanıtım var mı?"

## 4. 🚀 UYGULAMA (THE EXECUTION)
**Soru:** "Çözümü en güvenli şekilde nasıl uygularım?"

*   Asla veriyi silme (`DELETE`) veya tabloyu uçurma (`DROP TABLE`) - mecbur kalmadıkça.
*   Her zaman `CREATE OR REPLACE` veya `IF NOT EXISTS` kullan.
*   İşlem bitince `HAFIZA_TAZELEME` dosyasına neyi, neden ve nasıl değiştirdiğini not et.

---
**UNUTMA:** Bir yazılımcı gibi değil, bir **Dedektif** gibi düşün. Kanıt yoksa, çözüm de yok.
