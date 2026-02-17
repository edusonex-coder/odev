-- 20260217_add_super_admin_and_hierarchy.sql
-- Description: Adds super admin role and hierarchy to the system.

-- 1. Profiles tablosuna is_super_admin ekle
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE;

-- 2. Ferhat Karaduman'ı Süper Admin Yap (Holding Yöneticisi)
-- Email: ferhatkaraduman@gmail.com
-- ID: 195e3a1d-9d01-4922-8f5c-c596f0371d94
UPDATE public.profiles 
SET is_super_admin = TRUE, role = 'admin'
WHERE id = '195e3a1d-9d01-4922-8f5c-c596f0371d94';

-- 3. RLS (Row Level Security) Politikalarını Güncelleme (Mantıksal Hazırlık)
-- Mevcut politikaları koruyarak, Süper Adminlerin her şeyi görmesini sağlayacak kural:
-- (Auth kullanıcısının profile.is_super_admin değeri true ise erişim ver)

/*
Örnek Politika Güncellemesi (Manuel uygulanması önerilir):
CREATE POLICY "Super admins can do everything" ON public.profiles
FOR ALL USING (
  (SELECT is_super_admin FROM public.profiles WHERE id = auth.uid()) = true
);
*/

COMMENT ON COLUMN public.profiles.is_super_admin IS 'True ise tüm tenant verilerine erişebilir (Holding/Süper Admin)';
