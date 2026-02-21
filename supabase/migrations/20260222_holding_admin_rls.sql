-- =====================================================
-- 🚀 FÜZEM ENTEGRASYONU: HOLDING & OKUL İZOLASYONU
-- =====================================================
-- Amaç: Super Admin (Holding) ve School Admin (Okul) için tam veri izolasyonu ve RLS.
-- Tarih: 2026-02-22

-- 1. AI_USAGE_LOGS: Tenant_id garantisi ve RLS
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_usage_logs' AND column_name='tenant_id') THEN
        ALTER TABLE public.ai_usage_logs ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Eksik tenant_id'leri profile üzerinden doldur
UPDATE public.ai_usage_logs l
SET tenant_id = p.tenant_id
FROM public.profiles p
WHERE l.user_id = p.id AND l.tenant_id IS NULL;

-- 2. RLS POLİTİKALARI (YIKIP YENİDEN YAP)
-- 
-- 2.1 QUESTIONS RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "questions_rls_policy" ON public.questions;
CREATE POLICY "questions_rls_policy" ON public.questions
FOR ALL TO authenticated
USING (
    (SELECT is_super_admin FROM public.profiles WHERE id = (SELECT auth.uid())) = true OR -- Super Admin her şeyi görür
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = (SELECT auth.uid())) OR -- Kendi okulunun verileri
    student_id = (SELECT auth.uid()) -- Kendi soruları (Edge case için)
)
WITH CHECK (
    (SELECT is_super_admin FROM public.profiles WHERE id = (SELECT auth.uid())) = true OR
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = (SELECT auth.uid()))
);

-- 2.2 SOLUTIONS RLS
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "solutions_rls_policy" ON public.solutions;
CREATE POLICY "solutions_rls_policy" ON public.solutions
FOR ALL TO authenticated
USING (
    (SELECT is_super_admin FROM public.profiles WHERE id = (SELECT auth.uid())) = true OR
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = (SELECT auth.uid()))
)
WITH CHECK (
    (SELECT is_super_admin FROM public.profiles WHERE id = (SELECT auth.uid())) = true OR
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = (SELECT auth.uid()))
);

-- 2.3 AI_USAGE_LOGS RLS
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ai_usage_logs_rls_policy" ON public.ai_usage_logs;
CREATE POLICY "ai_usage_logs_rls_policy" ON public.ai_usage_logs
FOR ALL TO authenticated
USING (
    (SELECT is_super_admin FROM public.profiles WHERE id = (SELECT auth.uid())) = true OR
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = (SELECT auth.uid()))
)
WITH CHECK (
    (SELECT is_super_admin FROM public.profiles WHERE id = (SELECT auth.uid())) = true OR
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = (SELECT auth.uid()))
);

-- 2.4 PROFILES RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_rls_policy" ON public.profiles;
CREATE POLICY "profiles_rls_policy" ON public.profiles
FOR ALL TO authenticated
USING (
    (SELECT is_super_admin FROM public.profiles WHERE id = (SELECT auth.uid())) = true OR
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = (SELECT auth.uid())) OR
    id = (SELECT auth.uid())
)
WITH CHECK (
    (SELECT is_super_admin FROM public.profiles WHERE id = (SELECT auth.uid())) = true OR
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = (SELECT auth.uid())) OR
    id = (SELECT auth.uid())
);

-- 3. ANALYTIKS İÇİN GELİŞMİŞ VIEWLER
-- Okul bazlı maliyet raporu
CREATE OR REPLACE VIEW public.tenant_cost_ledger AS
SELECT 
    t.id as tenant_id,
    t.name as tenant_name,
    COUNT(l.id) as total_ai_requests,
    SUM(l.prompt_tokens) as total_prompt_tokens,
    SUM(l.completion_tokens) as total_completion_tokens,
    SUM(l.total_tokens) as total_tokens,
    SUM(l.cost_usd) as total_cost_usd -- cost_usd field used in healer
FROM 
    public.tenants t
LEFT JOIN 
    public.ai_usage_logs l ON t.id = l.tenant_id
GROUP BY 
    t.id, t.name;

GRANT SELECT ON public.tenant_cost_ledger TO authenticated;

-- Gelişmiş Soru Havuzu View'i (Costs ile birlikte)
CREATE OR REPLACE VIEW public.questions_with_costs AS
SELECT 
    q.id,
    q.created_at,
    q.subject,
    q.question_text,
    q.image_url,
    q.status,
    q.student_id,
    q.tenant_id,
    p.full_name as student_name,
    t.name as tenant_name,
    COALESCE(SUM(l.cost_usd), 0) as total_ai_cost,
    COALESCE(SUM(l.total_tokens), 0) as total_ai_tokens
FROM 
    public.questions q
LEFT JOIN 
    public.profiles p ON q.student_id = p.id
LEFT JOIN 
    public.tenants t ON q.tenant_id = t.id
LEFT JOIN 
    public.ai_usage_logs l ON q.id::text = l.metadata->>'question_id'
GROUP BY 
    q.id, p.full_name, t.name;

GRANT SELECT ON public.questions_with_costs TO authenticated;

-- Ders bazlı soru yoğunluğu raporu
CREATE OR REPLACE VIEW public.subject_popularity_report AS
SELECT 
    tenant_id,
    subject,
    COUNT(*) as question_count
FROM 
    public.questions
GROUP BY 
    tenant_id, subject;

GRANT SELECT ON public.subject_popularity_report TO authenticated;

-- Günlük soru trafiği (Okul bazlı karşılaştırma için)
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

-- Okul Bazlı AI Harcaması
CREATE OR REPLACE VIEW public.tenant_ai_spend_summary AS
SELECT 
    tenant_id,
    SUM(cost_usd) as total_spend,
    COUNT(*) as request_count
FROM 
    public.ai_usage_logs
GROUP BY 
    tenant_id;

GRANT SELECT ON public.tenant_ai_spend_summary TO authenticated;

-- 3.2 EXECUTIVE DASHBOARD EXPOSURE (MISSING GRANTS)
GRANT SELECT ON public.ceo_financial_dashboard TO authenticated;

-- Growth Metrics Table (If missing for chart)
CREATE TABLE IF NOT EXISTS public.ceo_growth_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT,
    total_conversions INTEGER,
    cac DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed some sample growth data
INSERT INTO public.ceo_growth_metrics (platform, total_conversions, cac) VALUES 
('Google Ads', 125, 4.20),
('Meta', 88, 5.50),
('Referral', 45, 0.00),
('Direct', 210, 0.00)
ON CONFLICT DO NOTHING;

GRANT SELECT ON public.ceo_growth_metrics TO authenticated;
GRANT SELECT ON public.payments TO authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT SELECT ON public.subscription_plans TO authenticated;

-- 4. SONUÇ MESAJI
DO $$
BEGIN
  RAISE NOTICE '✅ FÜZEM ENTEGRASYONU: RLS Politikaları ve Analitik Viewlar güncellendi. Holding ve Okul ayrımı tamamlandı.';
END $$;
