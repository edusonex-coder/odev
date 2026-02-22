-- =====================================================
-- 🔐 GHOST FUNCTION CLEANUP & PERMANENT ANON LOCKDOWN
-- Claude CEO Tespiti üzerine: v2.1 kapatılmamış açıklar
-- 23 Şubat 2026
-- =====================================================

BEGIN;

-- =====================================================
-- BÖLÜM 1: Eski is_super_admin() fonksiyonunu temizle
-- (is_iam_super_admin() zaten var, eskisi hayalet olarak kalıyordu)
-- =====================================================
DROP FUNCTION IF EXISTS public.is_super_admin() CASCADE;
-- CASCADE: Bu fonksiyona bağlı eski RLS policy varsa onları da kaldırır.
-- Yeni sistemde is_iam_super_admin() kullanılıyor.


-- =====================================================
-- BÖLÜM 2: DEFAULT PRIVILEGES — Yeni tablolar için
-- Claude tespiti: "REVOKE sonradan eklenen tabloları kapsamaz"
-- Çözüm: ALTER DEFAULT PRIVILEGES ile yeni tablolara varsayılan
--         olarak anon erişimi verme.
-- =====================================================
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON TABLES FROM anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON SEQUENCES FROM anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON FUNCTIONS FROM anon;

-- authenticated rolü için minimum gerekli izinler
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE ON SEQUENCES TO authenticated;


-- =====================================================
-- BÖLÜM 3: Kontrol Sorguları
-- =====================================================
DO $$
DECLARE
    v_anon_table_count INTEGER;
    v_ghost_func_count INTEGER;
    v_no_rls_count INTEGER;
BEGIN
    -- anon tablo erişimi
    SELECT COUNT(*) INTO v_anon_table_count
    FROM information_schema.role_table_grants
    WHERE grantee = 'anon' AND table_schema = 'public';

    -- ghost fonksiyon sayısı
    SELECT COUNT(*) INTO v_ghost_func_count
    FROM pg_proc
    WHERE proname = 'is_super_admin';

    -- RLS'siz tablo
    SELECT COUNT(*) INTO v_no_rls_count
    FROM pg_tables
    WHERE schemaname = 'public' AND rowsecurity = false;

    RAISE NOTICE '--- AUDIT SONUÇLARI ---';
    RAISE NOTICE 'anon tablo erişimi: % (0 olmalı)', v_anon_table_count;
    RAISE NOTICE 'Ghost is_super_admin: % (0 olmalı)', v_ghost_func_count;
    RAISE NOTICE 'RLS kapalı tablo: % (0 olmalı)', v_no_rls_count;

    IF v_anon_table_count = 0 AND v_ghost_func_count = 0 THEN
        RAISE NOTICE '✅ TÜM KONTROLLER BAŞARILI — Güvenlik duvarı kapalı.';
    ELSE
        RAISE WARNING '⚠️ BAZI KONTROLLER BAŞARISIZ — Yukarıdaki sayıları incele.';
    END IF;
END $$;

COMMIT;
