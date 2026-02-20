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
        ('assignment_submissions'),
        ('blogs'),
        ('ai_usage_logs'),
        ('ai_knowledge_graph'),
        ('marketing_campaigns'),
        ('tenants')
    ) as t(name)
    
    UNION ALL
    
    -- 2. View Kontrolleri (CEO Dashboard)
    SELECT 'View', name,
           (CASE WHEN EXISTS (SELECT FROM information_schema.views WHERE table_name = name AND table_schema = 'public') THEN '✅ Mevcut' ELSE '❌ EKSIK' END)
    FROM (VALUES 
        ('ceo_financial_dashboard'), 
        ('ceo_growth_metrics'),
        ('ai_usage_summary'),
        ('holding_performance_summary')
    ) as t(name)
    
    UNION ALL

    -- 3. Fonksiyon Kontrolleri (RPC)
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
    
    -- 4. RLS (Güvenlik) Kontrolleri
    SELECT 'Guvenlik (RLS)', tablename,
           (CASE WHEN rowsecurity = true THEN '🔒 Aktif' ELSE '⚠️ PASIF (Risk!)' END)
    FROM pg_tables 
    WHERE schemaname = 'public' AND tablename IN (
        'profiles', 'questions', 'solutions', 
        'student_parent_relations', 'parent_reports', 
        'assignments', 'assignment_submissions', 'blogs', 
        'ai_usage_logs', 'tenants', 'ai_knowledge_graph', 'marketing_campaigns'
    )
    
    UNION ALL
    
    -- 5. Derin Sütun Kontrolü (Anti-Pattern Tespiti)
    SELECT 'Şema Tutarlılığı', 'Solutions Table student_id check',
           (CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'solutions' AND column_name = 'student_id') 
            THEN '❌ HATA: student_id solutions tablosunda olmamalı!' 
            ELSE '✅ Sağlıklı: student_id sadece questions tablosunda.' END)
            
    UNION ALL

    -- 6. Trigger Sağlığı
    SELECT 'Trigger Sağlığı', tgname,
           (CASE WHEN tgenabled = 'O' THEN '✅ Aktif' ELSE '⚠️ Devre Dışı' END)
    FROM pg_trigger 
    WHERE tgname IN ('trg_check_badges_on_solution', 'notify_parent_on_student_question')

    UNION ALL
    
    -- 7. Veri Tutarlılığı (CEO Analiz)
    SELECT 'Finansal Veri', 'AI Cost Log',
           (CASE WHEN (SELECT COUNT(*) FROM ai_usage_logs WHERE cost_usd > 0) > 0 
            THEN '✅ Maliyet Verisi Mevcut' 
            ELSE '⚠️ Henüz Maliyet Verisi Yok (Normal: Henüz AI talebi yapılmadı)' END)
)
SELECT * FROM checks
ORDER BY tip DESC, bilesen ASC;
