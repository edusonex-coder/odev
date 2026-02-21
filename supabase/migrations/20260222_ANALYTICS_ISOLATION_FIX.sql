-- =====================================================
-- 🛡️ ODEVGPT DATA ISOLATION & ANALYTICS FIX (V3)
-- =====================================================
-- Amaç: Kurumların birbirinin verisini görmesini engellemek ve 
-- PostgreSQL'deki view güncelleme hatasını (42P16) aşmak.

BEGIN;

-- 1. ESKİ YAPILARI TEMİZLE (Colum name uyuşmazlığını çözmek için en garantisi DROP)
DROP VIEW IF EXISTS public.corporate_analytics_summary CASCADE;
DROP VIEW IF EXISTS public.ceo_financial_dashboard CASCADE;
DROP VIEW IF EXISTS public.tenant_cost_ledger CASCADE;

-- 2. CEO Financial Dashboard (Performans için Aggregate edilmiş hali)
CREATE OR REPLACE VIEW public.ceo_financial_dashboard AS
SELECT 
    l.metadata->>'feature_name' as feature_name,
    l.model,
    l.tenant_id,
    SUM(l.total_tokens) as total_tokens,
    SUM(l.cost_usd) as total_cost_usd,
    AVG(l.latency_ms) as avg_latency,
    COUNT(*) as interaction_count
FROM 
    public.ai_usage_logs l
GROUP BY 
    l.metadata->>'feature_name', l.model, l.tenant_id;

GRANT SELECT ON public.ceo_financial_dashboard TO authenticated;

-- 3. Kurum Özeti View'ı (Hiyerarşi ve İzolasyon odaklı)
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
SELECT 
    NULL as tenant_id,
    'Bireysel' as tenant_name,
    (SELECT COUNT(*) FROM public.profiles p WHERE p.tenant_id IS NULL AND p.role = 'student') as active_students,
    (SELECT COUNT(*) FROM public.questions q WHERE q.tenant_id IS NULL) as total_questions,
    (SELECT COUNT(*) FROM public.questions q WHERE q.tenant_id IS NULL AND q.status IN ('completed', 'ai_answered')) as resolved_questions,
    (SELECT COALESCE(SUM(l.cost_usd), 0) FROM public.ai_usage_logs l WHERE l.tenant_id IS NULL) as total_ai_cost;

GRANT SELECT ON public.corporate_analytics_summary TO authenticated;

-- 4. Maliyet Defteri Master View
CREATE OR REPLACE VIEW public.tenant_cost_ledger AS
SELECT 
    COALESCE(t.name, 'Bireysel') as tenant_name,
    l.tenant_id,
    l.model,
    SUM(l.total_tokens) as total_tokens,
    SUM(l.cost_usd) as total_cost_usd,
    COUNT(*) as total_ai_requests
FROM 
    public.ai_usage_logs l
LEFT JOIN 
    public.tenants t ON l.tenant_id = t.id
GROUP BY 
    t.name, l.tenant_id, l.model;

GRANT SELECT ON public.tenant_cost_ledger TO authenticated;

COMMIT;

DO $$ 
BEGIN 
  RAISE NOTICE '✅ DATA ISOLATION V3: Analiz motoru başarıyla güncellendi.'; 
END $$;
