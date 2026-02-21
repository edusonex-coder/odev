-- =====================================================
-- 🛡️ ODEVGPT DATA ISOLATION & ANALYTICS FIX
-- =====================================================
-- Amaç: Kurumların birbirinin verisini görmesini engellemek ve 
-- "Detaylı Analiz" ile "Maliyet Defteri"ni hiyerarşiye bağlamak.

BEGIN;

-- 1. CEO Financial Dashboard View Güncellemesi (tenant_id ekle)
DROP VIEW IF EXISTS public.ceo_financial_dashboard CASCADE;
CREATE OR REPLACE VIEW public.ceo_financial_dashboard AS
SELECT 
    l.metadata->>'feature_name' as feature_name,
    l.model,
    l.tenant_id, -- FİLTRELEME İÇİN KRİTİK
    SUM(l.total_tokens) as total_tokens,
    SUM(l.cost_usd) as total_cost_usd,
    AVG(l.latency_ms) as avg_latency,
    COUNT(*) as interaction_count
FROM 
    public.ai_usage_logs l
GROUP BY 
    l.metadata->>'feature_name', l.model, l.tenant_id;

GRANT SELECT ON public.ceo_financial_dashboard TO authenticated;

-- 2. Kurum Özeti View'ı Güncellemesi (RLS ile uyumlu)
CREATE OR REPLACE VIEW public.corporate_analytics_summary AS
SELECT 
    t.id as tenant_id,
    t.name as tenant_name,
    (SELECT COUNT(*) FROM public.profiles p WHERE p.tenant_id = t.id AND p.role = 'student') as active_students,
    (SELECT COUNT(*) FROM public.questions q WHERE q.tenant_id = t.id) as total_questions,
    (SELECT COUNT(*) FROM public.questions q WHERE q.tenant_id = t.id AND q.status IN ('completed', 'ai_answered')) as resolved_questions,
    (SELECT COALESCE(SUM(l.cost_usd), 0) FROM public.ai_usage_logs l WHERE l.tenant_id = t.id) as total_ai_cost
FROM 
    public.tenants t
UNION ALL
-- Bireysel Kullanıcılar İçin
SELECT 
    NULL as tenant_id,
    'Bireysel' as tenant_name,
    (SELECT COUNT(*) FROM public.profiles p WHERE p.tenant_id IS NULL AND p.role = 'student') as active_students,
    (SELECT COUNT(*) FROM public.questions q WHERE q.tenant_id IS NULL) as total_questions,
    (SELECT COUNT(*) FROM public.questions q WHERE q.tenant_id IS NULL AND q.status IN ('completed', 'ai_answered')) as resolved_questions,
    (SELECT COALESCE(SUM(l.cost_usd), 0) FROM public.ai_usage_logs l WHERE l.tenant_id IS NULL) as total_ai_cost;

GRANT SELECT ON public.corporate_analytics_summary TO authenticated;

COMMIT;

DO $$ 
BEGIN 
  RAISE NOTICE '✅ DATA ISOLATION: Viewlar hiyerarşiye uygun hale getirildi.'; 
END $$;
