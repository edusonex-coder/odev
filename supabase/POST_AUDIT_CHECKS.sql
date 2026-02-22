-- =====================================================
-- 🔍 POST-AUDIT CHECKS
-- Claude CEO Değerlendirmesi — v2.1 Teknik Bulgular
-- 23 Şubat 2026
-- =====================================================

-- 1. Eski is_super_admin fonksiyonu var mı?
SELECT proname, pronargs, prosecdef 
FROM pg_proc 
WHERE proname LIKE '%super_admin%'
ORDER BY proname;
-- Beklenen: Sadece is_iam_super_admin olmalı.
-- is_super_admin (eski isim) varsa → temizle.

-- 2. anon rolünün hâlâ erişebildiği tablolar var mı?
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'anon' AND table_schema = 'public'
ORDER BY table_name;
-- Beklenen: 0 satır

-- 3. anon rolünün erişebildiği fonksiyonlar var mı?
SELECT routine_name, grantee, privilege_type
FROM information_schema.role_routine_grants
WHERE grantee = 'anon' AND specific_schema = 'public'
ORDER BY routine_name;
-- Beklenen: 0 satır (veya sadece public-safe fonksiyonlar)

-- 4. Hâlâ USING(true) WITH CHECK(true) birlikte olan politika var mı?
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND qual = 'true'
  AND with_check = 'true'
ORDER BY tablename;
-- Beklenen: 0 satır

-- 5. RLS kapalı tablolar var mı?
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false
ORDER BY tablename;
-- Beklenen: 0 satır (tüm tablolarda RLS açık olmalı)
