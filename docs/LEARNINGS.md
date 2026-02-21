# 🧠 OdevGPT - AI LEARNINGS & PROTOCOLS
**Tarih:** 21 Şubat 2026
**Amaç:** Geçmiş hatalardan ders çıkararak, gelecekteki gelişim süreçlerini hatasız ve optimize hale getirmek.

---

## 🛡️ 1. DATABASE (SUPABASE/POSTGRES) PROTOCOL

### ❌ Hata: "Ben çözerim" diyerek teşhis koymadan ilaç yazmak.
**Ders:** Veritabanındaki uyarılar arttığında sisteme körleme SQL basma. Önce mevcut durumu (politikaları, indexleri) tarayan bir diagnostic script çalıştır.
**Kural:** `diagnose_db.py` benzeri bir araçla "Multiple Permissive Policies" kontrolü yapmadan yeni kural ekleme.

### ❌ Hata: RLS içinde ham `auth.uid()` kullanımı.
**Ders:** Supabase Advisor, ham `auth.uid()` kullanımını "Initialization Plan" uyarısı olarak işaretler çünkü her satırda fonksiyon çalıştırır.
**Kural:** Politikalar içinde mutlaka `(SELECT auth.uid())` yapısını kullan. Bu, PostgreSQL'in değeri önbelleğe alıp index'e (B-Tree) vurmasını sağlar.
*   *Örnek:* `USING (user_id = (SELECT auth.uid()))`

### ❌ Hata: Üst üste binen (çakışan) politikalar.
**Ders:** Bir tablo için hem "Admin görebilir", hem "Öğretmen görebilir", hem "Herkes okuyabilir" diye 3 ayrı SELECT kuralı yazmak performansı öldürür.
**Kural:** **"Unified Policy" (Birleşik Politika)** yaklaşımını kullan. Tek bir `FOR ALL` veya `FOR SELECT` içine `OR` mantığıyla tüm yetkileri göm. Eski kuralları mutlaka `DROP` et.

### ❌ Hata: "Always True" Security Riski.
**Ders:** `FOR ALL` eylemi için `USING (true)` demek, silme ve güncelleme yetkisini de herkese açar.
**Kural:** Okuma (`SELECT`) için `true` kabul edilebilir ancak `INSERT/UPDATE/DELETE` için mutlaka rol veya sahiplik kontrolü içeren ayrı kurallar veya `WITH CHECK` kullan.

---

## 🛠️ 2. STORAGE (SUPABASE STORAGE) PROTOCOL

### ❌ Hata: Karmaşık Storage politikaları.
**Ders:** `storage.objects` tablosu devasadır. Buradaki her bir kural dosya yükleme hızını doğrudan etkiler.
**Kural:** `storage.objects` üzerindeki tüm eski kuralları temizle ve `bucket_id` bazlı çalışan tek bir dev "Unified Storage Policy" kullan.

---

## 💻 3. UI & DEVELOPMENT PROTOCOL

### ❌ Hata: Görsel hataları tahmin etmeye çalışmak.
**Ders:** "Şu ikon gitmiş olabilir" demek yerine, sitemap üzerinden tüm rotaları tarayan `ui_doktor.js`'i çalıştır.
**Kural:** Her büyük veri tabanı değişikliğinden sonra `npx playwright test` (Unified Scanner) koşturulmadan "Bitti" deme.

---

## 🧪 4. KISIR DÖNGÜYÜ KIRMA (RECOVERY PROTOCOL)
Eğer bir hata 2 denemeden fazla tekrarlanıyorsa:
1.  **DUR.**
2.  Mevcut tüm politikaları ve indexleri export et (SQL Dump).
3.  Eldeki dump dosyasını regex ile tara (Diagnostic).
4.  Tüm eski yapıyı **DROP** eden ve yerine "Altın Standart" (Shield v5) yapıyı kuran bir **"Ultimate Heal"** scripti yaz.

---

## 🤖 GELECEKTEKİ AJANLARA NOT
Bu dosyadaki kurallar "tecrübeyle sabit" acı reçetelerdir. Bu kuralları çiğnemek projenin Advisor skorunu düşürür ve karmaşıklığı artırır. **Önce TEMİZLE, sonra İNŞA ET.**
