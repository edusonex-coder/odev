-- ============================================================
-- EDUSONEX BAYİ & TOPTAN SİSTEM MİGRASYONU
-- Tarih: 24 Şubat 2026
-- Açıklama: dealers ve wholesale_requests tabloları
--           odevgpt + LAB + diğer projeler için ortak kullanım
-- ============================================================

-- 1. BAYİLER TABLOSU (Tüm projeler için ortak)
CREATE TABLE IF NOT EXISTS public.dealers (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ad               TEXT NOT NULL,
  firma_adi        TEXT,
  email            TEXT NOT NULL,
  telefon          TEXT,
  sehir            TEXT NOT NULL,
  ilce             TEXT,
  mahalle          TEXT,
  koy              TEXT,
  adres            TEXT,
  durum            TEXT DEFAULT 'beklemede' CHECK (durum IN ('aktif', 'pasif', 'beklemede')),
  projeler         TEXT[] DEFAULT ARRAY['LAB Deney Setleri'],
  komisyon_orani   INTEGER DEFAULT 10,
  toplam_satis     NUMERIC DEFAULT 0,
  pipeline         NUMERIC DEFAULT 0,
  calisma_saatleri TEXT,
  notlar           TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TOPTAN TALEPLERİ TABLOSU
CREATE TABLE IF NOT EXISTS public.wholesale_requests (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  firma_adi     TEXT NOT NULL,
  yetkili_adi   TEXT NOT NULL,
  email         TEXT NOT NULL,
  telefon       TEXT,
  sehir         TEXT,
  satis_turu    TEXT CHECK (satis_turu IN ('toptan', 'white-label', 'her-ikisi')),
  urunler       TEXT[] DEFAULT '{}',
  aciklama      TEXT,
  durum         TEXT DEFAULT 'beklemede' CHECK (durum IN ('beklemede', 'inceleniyor', 'tamamlandi', 'reddedildi')),
  kaynak_proje  TEXT DEFAULT 'LAB',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3. İndeksler
CREATE INDEX IF NOT EXISTS dealers_sehir_idx    ON public.dealers (sehir);
CREATE INDEX IF NOT EXISTS dealers_ilce_idx     ON public.dealers (ilce);
CREATE INDEX IF NOT EXISTS dealers_durum_idx    ON public.dealers (durum);
CREATE INDEX IF NOT EXISTS wholesale_durum_idx  ON public.wholesale_requests (durum);
CREATE INDEX IF NOT EXISTS wholesale_email_idx  ON public.wholesale_requests (email);

-- 4. RLS Etkinleştir
ALTER TABLE public.dealers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wholesale_requests ENABLE ROW LEVEL SECURITY;

-- 5. RLS Politikaları (DROP + CREATE pattern — IF NOT EXISTS desteklenmiyor)

-- Dealers: Herkes aktif bayileri görebilir
DROP POLICY IF EXISTS "dealers_public_read"  ON public.dealers;
DROP POLICY IF EXISTS "dealers_admin_all"    ON public.dealers;

CREATE POLICY "dealers_public_read"
  ON public.dealers FOR SELECT
  USING (durum = 'aktif');

CREATE POLICY "dealers_admin_all"
  ON public.dealers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'super_admin')
    )
  );

-- Wholesale: Herkes talep gönderebilir, sadece admin görebilir
DROP POLICY IF EXISTS "wholesale_public_insert" ON public.wholesale_requests;
DROP POLICY IF EXISTS "wholesale_admin_read"    ON public.wholesale_requests;
DROP POLICY IF EXISTS "wholesale_admin_update"  ON public.wholesale_requests;

CREATE POLICY "wholesale_public_insert"
  ON public.wholesale_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "wholesale_admin_read"
  ON public.wholesale_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "wholesale_admin_update"
  ON public.wholesale_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'super_admin')
    )
  );

-- 6. updated_at Trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS dealers_updated_at      ON public.dealers;
DROP TRIGGER IF EXISTS wholesale_updated_at    ON public.wholesale_requests;

CREATE TRIGGER dealers_updated_at
  BEFORE UPDATE ON public.dealers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER wholesale_updated_at
  BEFORE UPDATE ON public.wholesale_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 7. Seed / Demo Verisi
INSERT INTO public.dealers
  (ad, firma_adi, email, telefon, sehir, ilce, mahalle, adres, durum, projeler, calisma_saatleri)
VALUES
  ('Eğitim Dünyası', 'Eğitim Dünyası Eğitim Merkezi', 'info@egitimdunyasi.com', '0216 XXX XX XX',
   'İstanbul', 'Kadıköy', 'Moda', 'Moda Cad. No: XX, Kadıköy/İstanbul',
   'aktif', ARRAY['LAB Deney Setleri', 'ÖdevGPT'], '09:00 - 18:00 (Pzt-Cmt)'),

  ('STEM Akademi İzmir', 'STEM Akademi Ltd.', 'stem@stemakademi.com', '0232 XXX XX XX',
   'İzmir', 'Bornova', 'Kazımdirik', 'Kazımdirik Mah. No: XX, Bornova',
   'aktif', ARRAY['LAB Deney Setleri'], '09:00 - 19:00 (Pzt-Cmt)'),

  ('Bilim ve Teknoloji', 'Bilim Teknoloji A.Ş.', 'bilim@bilimtekno.com', '0312 XXX XX XX',
   'Ankara', 'Çankaya', 'Kavaklıdere', 'Kavaklıdere Mah. Akay Cad. No: XX',
   'aktif', ARRAY['LAB Deney Setleri', 'ÖdevGPT'], '08:30 - 17:30 (Pzt-Cum)'),

  ('Sandıklı Eğitim', 'Sandıklı Eğitim Merkezi', 'info@sandikli-egitim.com', '0272 XXX XX XX',
   'Afyonkarahisar', 'Sandıklı', 'Merkez', 'Cumhuriyet Cad. No: XX, Sandıklı',
   'aktif', ARRAY['LAB Deney Setleri'], '09:00 - 17:00 (Pzt-Cmt)'),

  ('Bursa Mantis Robotik', 'Mantis Robotik Ltd.', 'bursa@mantisrobotik.com', '0224 XXX XX XX',
   'Bursa', 'Nilüfer', 'Özlüce', 'Özlüce Mah. Ar-Ge Cad. No: XX, Nilüfer',
   'aktif', ARRAY['LAB Deney Setleri'], '09:00 - 18:00 (Pzt-Cum)')
ON CONFLICT DO NOTHING;

-- ============================================================
-- UYGULAMA NOTU:
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın.
-- LAB projesi, odevgpt ile ortak Supabase instance kullanıyor:
-- URL: https://gxgvhuwsstupjgpziejg.supabase.co
-- ============================================================
