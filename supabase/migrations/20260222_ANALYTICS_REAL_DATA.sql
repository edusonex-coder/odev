-- =====================================================
-- 📊 ODEVGPT ANALYTICS ENGINE: REAL DATA UPGRADE
-- =====================================================
-- Amaç: Detaylı Analiz sayfasındaki "Mock" verileri gerçeğe dönüştürmek.

BEGIN;

-- 1. Okul Bazlı Özet Raporu (Summary Stats)
CREATE OR REPLACE VIEW public.corporate_analytics_summary AS
SELECT 
    p.tenant_id,
    COUNT(DISTINCT p.id) FILTER (WHERE p.role = 'student') as active_students,
    COUNT(DISTINCT q.id) as total_questions,
    COUNT(DISTINCT q.id) FILTER (WHERE q.status IN ('completed', 'ai_answered')) as resolved_questions,
    COALESCE(SUM(l.cost_usd), 0) as total_ai_cost,
    CASE 
        WHEN COUNT(DISTINCT q.id) > 0 THEN 
            (COUNT(DISTINCT q.id) FILTER (WHERE q.status IN ('completed', 'ai_answered'))::float / COUNT(DISTINCT q.id) * 100)
        ELSE 100 
    END as success_rate
FROM 
    public.profiles p
LEFT JOIN 
    public.questions q ON p.tenant_id = q.tenant_id OR (p.tenant_id IS NULL AND q.tenant_id IS NULL)
LEFT JOIN 
    public.ai_usage_logs l ON q.id::text = l.metadata->>'question_id'
GROUP BY 
    p.tenant_id;

GRANT SELECT ON public.corporate_analytics_summary TO authenticated;

-- 2. "Bireysel" kullanıcıları da kapsayan trafik view'ını güçlendir
DROP VIEW IF EXISTS public.daily_tenant_traffic CASCADE;
CREATE OR REPLACE VIEW public.daily_tenant_traffic AS
SELECT 
    tenant_id,
    date_trunc('day', created_at) as day,
    COUNT(*) as question_count
FROM 
    public.questions
GROUP BY 
    tenant_id, day;

GRANT SELECT ON public.daily_tenant_traffic TO authenticated;

COMMIT;

DO $$ 
BEGIN 
  RAISE NOTICE '✅ ANALYTICS UPGRADE: Gerçek veri motoru kuruldu.'; 
END $$;
