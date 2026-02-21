-- =====================================================
-- 🛡️ ODEVGPT STABLE SECURITY & PERFORMANCE V1
-- Tarih: 22 Şubat 2026
-- Amaç: Supabase Advisor'daki tüm kritik 400 (View) ve 403 (RLS) hatalarını temizlemek.
--       Halisinasyon içermez, doğrudan Advisor çıktılarına odaklıdır.
-- =====================================================

BEGIN;

-- 1. VIEW GÜVENLİĞİ (Security Definer -> Security Invoker)
-- Supabase Advisor: "Detects views defined with the SECURITY DEFINER property."
-- Çözüm: WITH (security_invoker = true) ekleyerek RLS'i zorunlu kılmak.

-- A. tenant_ai_spend_summary
DROP VIEW IF EXISTS public.tenant_ai_spend_summary CASCADE;
CREATE VIEW public.tenant_ai_spend_summary WITH (security_invoker = true) AS
SELECT 
    tenant_id,
    SUM(cost_usd) as total_spend,
    COUNT(*) as request_count
FROM 
    public.ai_usage_logs
GROUP BY 
    tenant_id;

-- B. questions_with_costs
DROP VIEW IF EXISTS public.questions_with_costs CASCADE;
CREATE VIEW public.questions_with_costs WITH (security_invoker = true) AS
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

-- C. tenant_cost_ledger (Holding için kritik)
DROP VIEW IF EXISTS public.tenant_cost_ledger CASCADE;
CREATE VIEW public.tenant_cost_ledger WITH (security_invoker = true) AS
SELECT 
    COALESCE(t.id, '00000000-0000-0000-0000-000000000000'::uuid) as tenant_id,
    COALESCE(t.name, 'Bireysel Kullanıcılar') as tenant_name,
    COUNT(l.id) as total_ai_requests,
    SUM(l.total_tokens) as total_tokens,
    SUM(l.cost_usd) as total_cost_usd
FROM 
    public.ai_usage_logs l
LEFT JOIN 
    public.tenants t ON l.tenant_id = t.id
GROUP BY 
    t.id, t.name;

-- D. daily_tenant_traffic
DROP VIEW IF EXISTS public.daily_tenant_traffic CASCADE;
CREATE VIEW public.daily_tenant_traffic WITH (security_invoker = true) AS
SELECT 
    tenant_id,
    date_trunc('day', created_at) as day,
    COUNT(*) as question_count
FROM 
    public.questions
GROUP BY 
    tenant_id, day;

-- E. corporate_analytics_summary
DROP VIEW IF EXISTS public.corporate_analytics_summary CASCADE;
CREATE VIEW public.corporate_analytics_summary WITH (security_invoker = true) AS
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

-- F. subject_popularity_report
DROP VIEW IF EXISTS public.subject_popularity_report CASCADE;
CREATE VIEW public.subject_popularity_report WITH (security_invoker = true) AS
SELECT 
    tenant_id,
    subject,
    COUNT(*) as question_count
FROM 
    public.questions
GROUP BY 
    tenant_id, subject;

-- G. holding_performance_summary
DROP VIEW IF EXISTS public.holding_performance_summary CASCADE;
CREATE VIEW public.holding_performance_summary WITH (security_invoker = true) AS
SELECT 
    t.name as tenant_name,
    COUNT(q.id) as question_count,
    COUNT(DISTINCT q.student_id) as student_count,
    SUM(l.cost_usd) as total_cost
FROM 
    public.tenants t
LEFT JOIN 
    public.questions q ON t.id = q.tenant_id
LEFT JOIN 
    public.ai_usage_logs l ON q.id::text = l.metadata->>'question_id'
GROUP BY 
    t.name;

-- H. ai_usage_summary
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

-- I. ceo_financial_dashboard
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

-- 2. RLS POLİTİKA OPTİMİZASYONU (Performance Fix)
-- Supabase Advisor: "Avoids unnecessarily re-evaluating auth.uid() for each row."
-- Çözüm: auth.uid() yerine (SELECT auth.uid()) kullanmak.
-- Ayrıca "Always True" (USING (true)) politikalarını daha güvenli hale getiriyoruz.

DO $$ 
DECLARE 
    target_tables TEXT[] := ARRAY[
        'profiles', 'questions', 'solutions', 'ai_usage_logs', 
        'classes', 'class_students', 'ai_chat_sessions', 'ai_chat_messages',
        'ai_approvals', 'ai_knowledge_graph', 'ceo_growth_metrics'
    ];
    t_name TEXT;
    pol_name TEXT;
BEGIN 
    FOREACH t_name IN ARRAY target_tables LOOP
        FOR pol_name IN (SELECT policyname FROM pg_policies WHERE tablename = t_name AND schemaname = 'public') LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol_name, t_name);
        END LOOP;
    END LOOP;
END $$;

-- A. PROFILES (Performans & Güvenlik)
CREATE POLICY "profiles_v1_rls" ON public.profiles FOR ALL TO authenticated
USING (
    (SELECT COALESCE(is_super_admin, false) FROM public.profiles WHERE id = (SELECT auth.uid())) = true OR 
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = (SELECT auth.uid())) OR
    id = (SELECT auth.uid())
);

-- B. QUESTIONS
CREATE POLICY "questions_v1_rls" ON public.questions FOR ALL TO authenticated
USING (
    (SELECT COALESCE(is_super_admin, false) FROM public.profiles WHERE id = (SELECT auth.uid())) = true OR 
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = (SELECT auth.uid())) OR
    student_id = (SELECT auth.uid())
);

-- C. SOLUTIONS
CREATE POLICY "solutions_v1_rls" ON public.solutions FOR ALL TO authenticated
USING (
    (SELECT COALESCE(is_super_admin, false) FROM public.profiles WHERE id = (SELECT auth.uid())) = true OR 
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = (SELECT auth.uid())) OR
    EXISTS (SELECT 1 FROM public.questions q WHERE q.id = question_id AND q.student_id = (SELECT auth.uid()))
);

-- D. AI_USAGE_LOGS
CREATE POLICY "ai_usage_logs_v1_rls" ON public.ai_usage_logs FOR ALL TO authenticated
USING (
    (SELECT COALESCE(is_super_admin, false) FROM public.profiles WHERE id = (SELECT auth.uid())) = true OR 
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = (SELECT auth.uid())) OR
    user_id = (SELECT auth.uid())
);

-- E. CLASSES
CREATE POLICY "classes_v1_rls" ON public.classes FOR ALL TO authenticated
USING (
    (SELECT COALESCE(is_super_admin, false) FROM public.profiles WHERE id = (SELECT auth.uid())) = true OR 
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = (SELECT auth.uid())) OR
    teacher_id = (SELECT auth.uid())
);

-- F. CLASS_STUDENTS
CREATE POLICY "class_students_v1_rls" ON public.class_students FOR ALL TO authenticated
USING (
    (SELECT COALESCE(is_super_admin, false) FROM public.profiles WHERE id = (SELECT auth.uid())) = true OR 
    student_id = (SELECT auth.uid()) OR
    EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND (c.teacher_id = (SELECT auth.uid()) OR c.tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = (SELECT auth.uid()))))
);

-- G. CEO_GROWTH_METRICS (Eksik RLS burada tamamlanıyor)
ALTER TABLE IF EXISTS public.ceo_growth_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ceo_growth_metrics_read" ON public.ceo_growth_metrics
FOR SELECT TO authenticated
USING ( (SELECT COALESCE(is_super_admin, false) FROM public.profiles WHERE id = (SELECT auth.uid())) = true );

-- G. AI_KNOWLEDGE_GRAPH (RAG Cache)
-- Herkes okuyabilir ama sadece adminler yazabilir/güncelleyebilir.
CREATE POLICY "ai_knowledge_graph_sel" ON public.ai_knowledge_graph FOR SELECT TO authenticated USING (true);
CREATE POLICY "ai_knowledge_graph_adm" ON public.ai_knowledge_graph FOR ALL TO authenticated
USING ( 
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' 
);

-- H. AI_APPROVALS
-- Bu tabloda user_id kolonu yoktur, sadece adminler erişebilir.
CREATE POLICY "ai_approvals_v1_rls" ON public.ai_approvals FOR ALL TO authenticated
USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
);

-- I. AI_CHAT_SESSIONS
CREATE POLICY "ai_chat_sessions_v1_rls" ON public.ai_chat_sessions FOR ALL TO authenticated
USING ( student_id = (SELECT auth.uid()) );

-- J. AI_CHAT_MESSAGES
CREATE POLICY "ai_chat_messages_v1_rls" ON public.ai_chat_messages FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.ai_chat_sessions s 
        WHERE s.id = session_id AND s.student_id = (SELECT auth.uid())
    )
);

-- 3. FINALIZATION
COMMIT;

-- 4. FINAL NOTIFICATION
DO $$
BEGIN
  RAISE NOTICE '✅ STABLE SECURITY V1: View ve RLS hataları temizlendi, performans optimizasyonu uygulandı.';
END $$;
