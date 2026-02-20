
-- 🛡️ OdevGPT Supabase Security Hardening & Advisor Fixes
-- Tarih: 21 Şubat 2026

-- ==========================================
-- 1. FONKSİYON GÜVENLİĞİ (Search Path Fixes)
-- ==========================================

-- get_student_latest_weak_topic
ALTER FUNCTION public.get_student_latest_weak_topic(p_student_id UUID) 
SET search_path = public;

-- get_class_weak_topics
ALTER FUNCTION public.get_class_weak_topics(p_class_id UUID, p_limit INTEGER) 
SET search_path = public;

-- generate_referral_code (Trigger function, no arguments)
ALTER FUNCTION public.generate_referral_code() 
SET search_path = public;

-- process_referral (Fix signature order: UUID, TEXT)
ALTER FUNCTION public.process_referral(p_user_id UUID, p_code TEXT) 
SET search_path = public;

-- get_session_history (Eğer varsa)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_session_history') THEN
        ALTER FUNCTION public.get_session_history(UUID) SET search_path = public;
    END IF;
END $$;


-- ==========================================
-- 2. VIEW GÜVENLİĞİ (Definer -> Explicit Invoker)
-- ==========================================

-- student_performance_metrics
DROP VIEW IF EXISTS public.student_performance_metrics CASCADE;
CREATE VIEW public.student_performance_metrics WITH (security_invoker = true) AS
SELECT 
    p.id as student_id,
    p.full_name as student_name,
    c.id as class_id,
    COUNT(q.id) as total_questions,
    COUNT(q.id) FILTER (WHERE q.status IN ('solved', 'ai_answered')) as solved_questions,
    CASE 
        WHEN COUNT(q.id) > 0 THEN 
            (COUNT(q.id) FILTER (WHERE q.status IN ('solved', 'ai_answered')))::NUMERIC / COUNT(q.id)
        ELSE 0 
    END as success_rate,
    p.xp as total_xp,
    p.level as current_level
FROM 
    public.profiles p
JOIN 
    public.class_students cs ON p.id = cs.student_id
JOIN 
    public.classes c ON cs.class_id = c.id
LEFT JOIN 
    public.questions q ON p.id = q.student_id
WHERE 
    p.role = 'student'
GROUP BY 
    p.id, p.full_name, c.id, p.xp, p.level;

-- ai_usage_summary
DROP VIEW IF EXISTS public.ai_usage_summary CASCADE;
CREATE VIEW public.ai_usage_summary WITH (security_invoker = true) AS
SELECT 
    l.provider,
    l.model,
    count(*) as total_requests,
    sum(l.total_tokens) as total_tokens,
    sum(CASE WHEN l.created_at > now() - interval '24 hours' THEN l.total_tokens ELSE 0 END) as tokens_last_24h,
    count(CASE WHEN l.status = 'failed' THEN 1 END) as failed_requests,
    count(CASE WHEN l.status = 'success' THEN 1 END) as success_requests
FROM 
    public.ai_usage_logs l
GROUP BY 
    l.provider, l.model;

-- ceo_financial_dashboard
DROP VIEW IF EXISTS public.ceo_financial_dashboard CASCADE;
CREATE VIEW public.ceo_financial_dashboard WITH (security_invoker = true) AS
SELECT 
    tenant_id,
    feature_name,
    model,
    sum(total_tokens) as total_tokens,
    sum(cost_usd) as total_cost_usd,
    avg(latency_ms) as avg_latency,
    count(*) as interaction_count
FROM 
    public.ai_usage_logs
GROUP BY 
    tenant_id, feature_name, model;

-- ceo_growth_metrics
DROP VIEW IF EXISTS public.ceo_growth_metrics CASCADE;
CREATE VIEW public.ceo_growth_metrics WITH (security_invoker = true) AS
SELECT 
    platform,
    sum(spend_usd) as total_spend,
    sum(clicks) as total_clicks,
    sum(conversions) as total_conversions,
    CASE WHEN sum(conversions) > 0 THEN sum(spend_usd) / sum(conversions) ELSE 0 END as cac,
    CASE WHEN sum(clicks) > 0 THEN (sum(conversions)::float / sum(clicks)::float) * 100 ELSE 0 END as conversion_rate
FROM 
    public.marketing_campaigns
GROUP BY 
    platform;

-- ==========================================
-- 3. PERMISSIVE RLS (Always True Fixes)
-- ==========================================

-- Subscription Plans: Herkes planları görebilir (SELECT), ama sadece admin değiştirebilir.
DROP POLICY IF EXISTS "Admins can manage everything finance" ON public.subscription_plans;
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Admins can manage subscription plans" ON public.subscription_plans;
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans
FOR SELECT USING (true);
CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Subscriptions: Sadece kendi aboneliğini görebilir.
DROP POLICY IF EXISTS "Admins can manage everything subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Payments: Sadece kendi ödemelerini görebilir.
DROP POLICY IF EXISTS "Admins can manage everything payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;
CREATE POLICY "Users can view own payments" ON public.payments
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.subscriptions s
        WHERE s.id = payments.subscription_id AND s.user_id = auth.uid()
    )
);
CREATE POLICY "Admins can manage all payments" ON public.payments
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==========================================
-- 4. EKSİK RLS POLİTİKALARI (Missing Policies)
-- ==========================================

-- AI ve Stratejik karar tabloları (Genelde boş veya admin içindir)
-- Temel kural: Sadece yetkili (admin) görebilir veya tamamen kapalıdır.

DO $$ 
DECLARE
    t TEXT;
    tables_to_fix TEXT[] := ARRAY['ai_knowledge_graph', 'knowledge_registry', 'marketing_campaigns', 'organization_agents', 'strategic_decisions'];
BEGIN
    FOREACH t IN ARRAY tables_to_fix LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('DROP POLICY IF EXISTS "Admin only access" ON public.%I', t);
        EXECUTE format('CREATE POLICY "Admin only access" ON public.%I FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = ''admin'')
        )', t);
    END LOOP;
END $$;

-- ==========================================
-- 5. LEAKED PASSWORD PROTECTION (Not)
-- ==========================================
-- Bu ayar SQL ile değil, Supabase Dashboard > Authentication > Security 
-- altından manuel aktif edilmelidir (Veya API ile proje konfigürasyonu güncellenir).
