# OdevGPT Hata Analiz Defteri (Post-Mortem Log)

## Hata Kaydı #001: RLS 403 Forbidden (Ödev Oluşturma Hatası)
**Tarih:** 22 Şubat 2026
**Hata Kodu:** `42501` (new row violates row-level security policy for table "assignments")
**Belirti:** Öğretmen AI Ödev Sihirbazı ile ödev oluştururken "Ödev oluşturulamadı" kırmızı hata kutusu alıyor. Konsolda `403 Forbidden` görünüyor.

### 1. Kök Neden Analizi (Root Cause Analysis)
- **Yapılan İşlem:** `20260222_THE_GRAND_RESET.sql` dosyasında sistem genelinde "sonsuz döngüleri" kırmak için toplu bir politika silme işlemi yapıldı.
- **Hata Noktası:** `target_tables` dizisine `assignments` ve `assignment_submissions` tabloları eklendi ve tüm mevcut politikaları silindi. Ancak, dosyanın devamında bu tablolar için yeni "Anayasal" politikalar tanımlanmadı.
- **Sonuç:** RLS (Satır Bazlı Güvenlik) bu tablolarda aktif kaldı ama hiçbir "izin" kuralı kalmadığı için PostgreSQL tüm `INSERT` ve `SELECT` işlemlerini varsayılan olarak reddetti.

### 2. Alınan Dersler
- **Resetleme Riski:** Bir "Grand Reset" (Büyük Sıfırlama) operasyonunda, politikası silinen her tablonun mutlaka yeni kuralları da aynı dosyada tanımlanmalıdır. Liste eksik kalırsa sistem kilitlenir.
- **Bütünsel Düşünme:** Sadece "ana" tablolara (profiles, questions) odaklanmak, "ikincil" ama kritik fonksiyonel tabloları (assignments) bozabilir.

### 3. Doktorlar İçin Eğitici Not (AI Training)
- **Doktorlara Uyarı:** "Sıfırlama yaparken sildiğin her şeyi yerine koyduğundan emin ol. Eğer bir tabloyu `DROP POLICY` listesine alıyorsan, 50 satır aşağıda ona `CREATE POLICY` yazdığını kontrol et."
- **Kontrol Listesi:** Her migration sonrası kritik kullanıcı akışlarını (ödev oluşturma, sınıfa katılma) test et.

### 4. Çözüm Uygulaması
`STABILITY_REPAIR` dosyasına `assignments` ve `assignment_submissions` için hiyerarşiye uygun kurallar eklendi.

---

## Hata Kaydı #002: Advisor Uyarıları (Security & Performance Clutter)
**Tarih:** 22 Şubat 2026
**Hata Tipi:** Warning (Uyarı)
**Belirti:** Supabase Advisor ekranında "Extension in Public", "RLS Policy Always True" ve "Duplicate Index" uyarıları.

### 1. Kök Neden Analizi
- **Extension in Public:** `pg_trgm` gibi sistem eklentilerinin `public` şemasında olması güvenlik riski oluşturur.
- **Always True:** Bazı politikalarda hızlı çözüm için kullanılan `WITH CHECK (true)` ifadesi Advisor tarafından "fazla esnek" olarak işaretlenir.
- **Mükerrer Index:** Farklı zamanlarda oluşturulan migration dosyaları (`20260215` ve `20260222`) aynı kolonlara (`solutions.question_id`) farklı isimlerle index atmış.

### 2. Alınan Dersler
- **Migration Takibi:** Yeni bir index veya politika eklemeden önce mevcut şemayı kontrol et.
- **Sıkı Kurallar:** `true` yerine `auth.uid() IS NOT NULL` gibi daha spesifik kontroller kullan.

### 3. Çözüm Uygulaması
- `20260222_ADVISOR_FINAL_CLEANUP.sql` ile tüm bu uyarılar tek hamlede giderildi.
- Eklentiler `extensions` şemasına taşındı.
- Politikalar konsolide edildi.

---

## Hata Kaydı #003: Performance Advisor (Query Efficiency)
**Tarih:** 22 Şubat 2026
**Hata Tipi:** Performance Warning (Verimlilik Uyarısı)
**Belirti:** Supabase Advisor'da "Auth RLS Initialization Plan" ve "Multiple Permissive Policies" uyarıları.

### 1. Kök Neden Analizi
- **Auth Initialization Plan:** `auth.uid()` doğrudan kullanıldığında Postgres her satır için bu fonksiyonu tekrar çalıştırır. `(SELECT auth.uid())` subquery yapısı ise bir kez çalıştırıp önbelleğe alır.
- **Multiple Permissive Policies:** Bir tablo üzerinde aynı rol için (authenticated) birden fazla izin kuralı (SELECT için hem genel kural hem admin kuralı gibi) olması sorgu planlayıcısını yorar.

### 2. Alınan Dersler
- **Syntax Disiplini:** RLS kurallarında her zaman `(SELECT auth.uid())` kullanılması performansı %20-30 civarında artırabilir.
- **Konsolidasyon:** "Admin her şeyi yapar" kuralı yerine, "Herkes okur, admin ek olarak siler/günceller" şeklinde yetki ayrımı (OR yerine farklı aksiyonlar) daha verimlidir.

### 3. Çözüm Uygulaması
- `20260222_ADVISOR_FINAL_CLEANUP.sql` v2 sürümüyle tüm tablolar (Knowledge Graph, Tenants vb.) tekil ve optimize edilmiş politikalara geçirildi.
