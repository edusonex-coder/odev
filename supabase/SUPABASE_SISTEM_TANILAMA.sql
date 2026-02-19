-- =====================================================
-- ODEVGPT SISTEM ANALIZI VE SAGLIK KONTROLU (CHECK-UP)
-- Bu sorgu sistemdeki tabloları, fonksiyonları ve güvenlik ayarlarını denetler.
-- Sonuçları doğrudan Supabase SQL Editor "Results" sekmesinde gösterir.
-- =====================================================

WITH checks AS (
    -- 1. Tablo Kontrolleri
    SELECT 'Tablo' as tip, name as bilesen, 
           (CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = name AND table_schema = 'public') THEN '✅ Mevcut' ELSE '❌ EKSIK' END) as durum
    FROM (VALUES 
        ('profiles'), 
        ('questions'), 
        ('solutions'), 
        ('student_parent_relations'), 
        ('parent_reports'), 
        ('xp_logs'), 
        ('notifications'),
        ('assignments'),
        ('submissions'),
        ('blogs')
    ) as t(name)
    
    UNION ALL
    
    -- 2. Fonksiyon Kontrolleri (RPC)
    SELECT 'Fonksiyon', name,
           (CASE WHEN EXISTS (SELECT FROM pg_proc WHERE proname = name) THEN '✅ Mevcut' ELSE '❌ EKSIK' END)
    FROM (VALUES 
        ('get_parent_students'), 
        ('get_student_weekly_stats'), 
        ('pair_student_with_parent'), 
        ('add_xp'),
        ('get_parent_weekly_reports')
    ) as t(name)
    
    UNION ALL
    
    -- 3. RLS (Güvenlik) Kontrolleri
    SELECT 'Guvenlik (RLS)', tablename,
           (CASE WHEN rowsecurity = true THEN '🔒 Aktif' ELSE '⚠️ PASIF (Risk!)' END)
    FROM pg_tables 
    WHERE schemaname = 'public' AND tablename IN (
        'profiles', 'questions', 'solutions', 
        'student_parent_relations', 'parent_reports', 
        'assignments', 'submissions', 'blogs'
    )
    
    UNION ALL
    
    -- 4. Veri Tutarlılığı (Gecersiz status kontrolü)
    SELECT 'Veri Durumu', 'Solved Statusu',
           (CASE WHEN (SELECT COUNT(*) FROM questions WHERE status = 'solved') > 0 
            THEN '⚠️ ' || (SELECT COUNT(*) FROM questions WHERE status = 'solved') || ' hatali kayit var!' 
            ELSE '✅ Temiz' END)
            
    UNION ALL
    
    -- 5. Kritik Kolon Kontrolleri
    SELECT 'Kolon Verisi', 'Profiles Yapisi',
           (CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'parent_access_code') 
            THEN '✅ Eksiksiz' ELSE '❌ parent_access_code EKSIK!' END)
)
SELECT * FROM checks
ORDER BY tip DESC, bilesen ASC;
