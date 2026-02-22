# OdevGPT Hata Analiz Defteri (Post-Mortem Log)

## Hata Kaydı #001: RLS 403 Forbidden (Ödev Oluşturma Hatası)
**Tarih:** 22 Şubat 2026
**Hata Kodu:** `42501` (new row violates row-level security policy for table "assignments")
... (existing content) ...

## Hata Kaydı #006: Eğitmen Paneli Sınıf Oluşturma Hatası (Teacher Blocked)
**Tarih:** 22 Şubat 2026
**Hata Kodu:** `42501` (new row violates row-level security policy for table "classes")
**Belirti:** Öğretmen yeni bir sınıf oluşturmaya çalıştığında "Hata" kırmızı mesajı alıyor. Konsolda `403 Forbidden` ve RLS ihlali görünüyor.

### 1. Kök Neden Analizi (Root Cause Analysis)
- **Problem:** `20260222_THE_GRAND_RESET.sql` (Büyük Sıfırlama) sonrasında `classes` tablosu için tanımlanan `constitution_classes_v1_rls` politikası, sadece `teacher_id = auth.uid()` veya aynı tenant olma şartını arıyordu. 
- **Çakışma:** Veritabanındaki `public.is_super_admin()` ve `public.get_my_tenant_id()` fonksiyonları, hem `THE_GRAND_RESET` hem de daha sonraki `Z_FINAL_REMEDY` sürümlerinde farklı isimlerle (is_iam_super_admin) veya farklı mantıklarla yeniden tanımlandı. `CASCADE` ile silinmeyen eski isimli fonksiyonlar, RLS politikalarında "Sessiz Hata" veya yetki yetersizliğine neden oldu.
- **Eksik Yetki:** Öğretmenlerin `role` bazlı `INSERT` yetkisi, genel bir `ALL` politikasına emanet edilmişti ancak `NEW` satırın `teacher_id` kolonu her zaman `auth.uid()` ile eşleşmediğinde (veya tenant_id boş olduğunda) RLS tarafından reddediliyordu.

### 2. Alınan Dersler
- **Nomenclature consistency (İsim Tutarlılığı):** Fonksiyon isimleri (`is_iam_super_admin` vs `is_super_admin`) proje genelinde tekilleştirilmeli. Eski fonksiyonlar her zaman temizlenmeli (`DROP ... CASCADE`).
- **Explicit over Implicit:** `FOR ALL` politikası yerine, `FOR INSERT` ve `FOR SELECT` kurallarını ayrı ayrı (explicit) tanımlamak her zaman daha güvenlidir.
- **Ambiguity Protection:** Postgres içindeki değişken ismi çakışmalarını önlemek için `#variable_conflict use_column` gibi direktifler hayati önem taşır.

### 3. Çözüm Uygulaması
- `20260222_Z_FINAL_REMEDY.sql` (V14) sürümü ile:
    - Tüm eski yetki fonksiyonları (`is_super_admin`, `get_my_tenant_id` vb.) `DROP ... CASCADE` ile silindi ve `iam_` prefix'li standart hiyerarşide toplandı.
    - `classes` ve `announcements` tabloları için öğretmenlerin (teacher role) `INSERT` yetkisi anayasal güvenceye alındı.
    - `profiles` hiyerarşisi, V7'de çözülen recursion (sonsuz döngü) fixini de içerecek şekilde finalize edildi.

## Hata Kaydı #007: Okullar Arası Veri Sızıntısı (Cross-Tenant Data Leak)
**Tarih:** 22 Şubat 2026
**Hata Kodu:** RLS Isolation Breach
**Belirti:** Bir öğretmen, başka bir okula ait olan sınıfları kendi panelinde görebiliyordu.

### 1. Kök Neden Analizi
- **Problem:** `IS NOT DISTINCT FROM` operatörü kullanılırken, `NULL` değerlerin (henüz tenant atanmamış hesaplar) birbirine eşit sayılması sonucu tüm "okulsuz" öğretmenler birbirinin verisini görür hale geldi.
- **Problem 2 (Policy Overlap):** Supabase'de birden fazla politika varsa, herhangi biri `true` dönerse erişim izni verir. Önceki "gevşek" kurallar silinmediği için sızıntı devam etti.

### 2. Alınan Dersler
- **Strict Matching:** Tenant karşılaştırmalarında mutlaka `tenant_id IS NOT NULL AND tenant_id = ...` yapısı kullanılmalı.
- **Nuclear Reset:** RLS güncellenirken sadece ilgili tablolar değil, şemadaki tüm tabloların politikaları dinamik bir script ile temizlenmeli.

### 3. Çözüm Uygulaması
- V14 sürümü ile `DO` bloğu kullanılarak tüm `public` politikaları silindi.
- `iam_tenant_id()` fonksiyonu üzerinden "Strict Match" (Sıkı Eşleşme) kuralı getirildi.

## Hata Kaydı #008: Keşif vs Gizlilik Çakışması (Join Class 406/403)
**Tarih:** 22 Şubat 2026
**Hata Kodu:** `406 Not Acceptable` / `42501 Forbidden`
**Belirti:** Öğretmen sınıf oluşturabiliyor ama öğrenci davet koduyla sınıfa katılamıyordu (Sınıf bulunamadı hatası).

### 1. Kök Neden Analizi
- **Paradoks:** İzolasyonu o kadar sıkılaştırdık ki, öğrenci henüz sınıfın üyesi olmadığı için (RLS engeliyle) sınıfın varlığını (kodunu) sorgulayamıyordu.

### 2. Çözüm
- **RPC Bridge:** Tabloyu SELECT'e açmak yerine, `SECURITY DEFINER` yetkisiyle çalışan ve sadece kod eşleşirse kısıtlı bilgi dönen `get_class_by_invite_code` RPC fonksiyonu oluşturuldu. Frontend bu köprüye bağlandı.
