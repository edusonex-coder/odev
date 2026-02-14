-- ============================================
-- ODEVGPT STORAGE ŞEMASI (DÜZELTİLMİŞ)
-- Amaç: Dosya yükleme alanlarını (Buckets) ve izinlerini oluşturma
-- ============================================

-- NOT: Bu komutları Supabase SQL Editor'de çalıştırın.

-- 1. Buckets Oluşturma
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('question_images', 'question_images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('solution_images', 'solution_images', true)
ON CONFLICT (id) DO NOTHING;


-- 2. Güvenlik Politikaları (RLS)

-- Önce mevcut politikaları temizleyelim (Hata almamak için)
DROP POLICY IF EXISTS "Avatar resimleri herkes tarafından görülebilir" ON storage.objects;
DROP POLICY IF EXISTS "Kullanıcılar kendi avatarlarını yükleyebilir" ON storage.objects;
DROP POLICY IF EXISTS "Kullanıcılar kendi avatarlarını güncelleyebilir" ON storage.objects;
DROP POLICY IF EXISTS "Soru resimlerini herkes görebilir" ON storage.objects;
DROP POLICY IF EXISTS "Giriş yapmış kullanıcılar soru resmi yükleyebilir" ON storage.objects;
DROP POLICY IF EXISTS "Kullanıcılar kendi soru resimlerini silebilir" ON storage.objects;

-- AVATARS Politikaları
CREATE POLICY "Avatar resimleri herkes tarafından görülebilir"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

CREATE POLICY "Kullanıcılar kendi avatarlarını yükleyebilir"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Kullanıcılar kendi avatarlarını güncelleyebilir"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND 
  owner = auth.uid()
);

CREATE POLICY "Kullanıcılar kendi avatarlarını silebilir"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND 
  owner = auth.uid()
);

-- QUESTION_IMAGES Politikaları
CREATE POLICY "Soru resimlerini herkes görebilir"
ON storage.objects FOR SELECT
USING ( bucket_id = 'question_images' );

CREATE POLICY "Giriş yapmış kullanıcılar soru resmi yükleyebilir"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'question_images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Kullanıcılar kendi soru resimlerini silebilir"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'question_images' AND
  owner = auth.uid()
);

-- Başarı Mesajı
DO $$
BEGIN
  RAISE NOTICE '✅ Storage bucketları ve politikaları başarıyla oluşturuldu!';
END $$;
