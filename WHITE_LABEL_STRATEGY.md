# OdevGPT White-Label (Multi-Tenant) Strateji Belgesi 📜

Bu belge, Edusonex evrenindeki uygulamaların (başta OdevGPT) kurumsal genişleme ve tenant yönetimi süreçlerini standartlaştırmak için oluşturulmuştur.

## 🎯 Temel Hedef
OdevGPT uygulamasını, tek bir kod tabanı üzerinden yüzlerce farklı okula/kuruma, sanki kendi özel yazılımlarıymış gibi (kendi domain, logo, renk ve içerikleriyle) sunabilmek.

## 🏗️ Mimari Yapı (Standardizasyon)

### 1. Veritabanı (Supabase) Ayrımı
*   **OdevGPT (`odevgpt`):** Bağımsız Supabase hesabı. Tenant tanımları ve öğrenci verileri burada tutulur.
*   **DokumanOS (`doc`):** Bağımsız Supabase hesabı. Tenant tanımları burada da ayrıca tutulur.
*   **Edusonex-Tüm:** Tanıtım amaçlı statik landing page. Backend/Database bağlantısı yoktur.

### 2. Tenant Tanımlama (`tenants` Tablosu)
Her uygulamanın kendi Supabase'inde bir `tenants` tablosu bulunur. Bu tablo şu standart alanları içerir:
- `slug`: (Örn: `odevkolej`) Alt alan adı tespiti için.
- `domain`: (Örn: `evrak.isikdamper.online`) Custom domain tespiti için.
- `branding_config`: Logo, renkler (Primary HSL), Hero stil, Dark mode ayarları.
- `content_config`: Hangi bölümlerin (Podcast, Video, Evren) gizleneceği veya gösterileceği.

## 🚀 Yol Haritası (OdevGPT Öncelikli)

### Aşama 1: Altyapı (ŞU AN BURADAYIZ)
- [x] `tenants` tablosu şemasının oluşturulması.
- [x] `TenantContext.tsx` ile hostname üzerinden dinamik veri çekme.
- [ ] **KRİTİK:** SQL script'inin Supabase Dashboard üzerinde çalıştırılması.

### Aşama 2: Kullanıcı Deneyimi (UI White-Labeling)
- [ ] **Login & Signup:** Giriş sayfalarının tenant logosu ve renklerine bürünmesi.
- [ ] **Dashboard:** Sol menü ve genel UI'daki marka kimliğinin tenant'a göre değişmesi.
- [ ] **Favicon & Title:** Tarayıcı sekme ikonunun ve başlığının tenant ismine göre dinamik güncellenmesi.

### Aşama 3: Veri İzolasyonu (Multi-Tenancy)
- [ ] `profiles` tablosuna `tenant_id` eklenmesi.
- [ ] Kayıt olan her öğrencinin otomatik olarak ilgili tenant ile ilişkilendirilmesi.
- [ ] RLS (Row Level Security) politikaları ile bir okulun verisinin diğerinden tamamen izole edilmesi.

## ⚠️ Dikkat Edilecekler
1.  **Karışıklığı Önle:** OdevGPT bitmeden DokumanOS veya diğer projelere White-Label geçişi yapılmayacak. 
2.  **Jenerik Kod:** Yazılan kodlar "isikdamper" veya "odevkolej" isimlerine bağımlı olmayacak. Her şey veritabanından gelecek.
3.  **Domain Match:** Kod domaini tanır ama Vercel Settings üzerinden domainin projeye eklenmesi şarttır.

---
*Hazırlayan: Antigravity*
*Tarih: 17 Şubat 2026*
