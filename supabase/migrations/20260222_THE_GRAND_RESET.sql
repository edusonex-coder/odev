-- =====================================================
-- 🛡️ ODEVGPT FOUNDATION: GRAND ARCHITECTURE RESET
-- Tarih: 22 Şubat 2026
-- Amaç: Güvenlik Anayasası (SECURITY_CONSTITUTION.md) uyarınca 
--       tüm sonsuz döngüleri kıran ve hiyerarşiyi betonlaştıran ana mimari.
-- =====================================================

BEGIN;

-- 1. YARDIMCI FONKSİYONLAR (Döngü Kıran Beyin Fonksiyonları)
-- Bu fonksiyonlar SECURITY DEFINER ile çalışır, böylece RLS döngüsüne girmezler.

CREATE OR REPLACE FUNCTION public.get_my_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_super_admin = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. TÜM RLS POLİTİKALARINI SIFIRLA (Temiz Bir Sayfa)
DO $$ 
DECLARE 
    target_tables TEXT[] := ARRAY[
        'profiles', 'questions', 'solutions', 'ai_usage_logs', 
        'classes', 'class_students', 'ai_chat_sessions', 'ai_chat_messages',
        'ai_approvals', 'ai_knowledge_graph', 'ceo_growth_metrics',
        'assignments', 'assignment_submissions', 'notifications'
    ];
    t_name TEXT;
    pol_name TEXT;
BEGIN 
    FOREACH t_name IN ARRAY target_tables LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t_name) THEN
            FOR pol_name IN (SELECT policyname FROM pg_policies WHERE tablename = t_name AND schemaname = 'public') LOOP
                EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol_name, t_name);
            END LOOP;
        END IF;
    END LOOP;
END $$;

-- 3. ANAYASAL RLS POLİTİKALARI (Fonksiyon Bazlı)

-- A. PROFILES (Kilit Tablo - Kendi Kuyruğunu Kovalamaz)
CREATE POLICY "constitution_profiles_policy" ON public.profiles FOR ALL TO authenticated
USING (
    (public.is_super_admin() = true) OR                             -- S0: Holding
    (public.get_my_tenant_id() = tenant_id) OR                      -- S1-S4: Aynı Kurum
    (id = (SELECT auth.uid()))                                      -- Bireysel
);

-- B. QUESTIONS
CREATE POLICY "constitution_questions_policy" ON public.questions FOR ALL TO authenticated
USING (
    (public.is_super_admin() = true) OR 
    (public.get_my_tenant_id() = tenant_id) OR 
    (student_id = (SELECT auth.uid()))
);

-- C. SOLUTIONS
CREATE POLICY "constitution_solutions_v1_rls" ON public.solutions FOR ALL TO authenticated
USING (
    (public.is_super_admin() = true) OR 
    (public.get_my_tenant_id() = tenant_id) OR
    EXISTS (SELECT 1 FROM public.questions q WHERE q.id = question_id AND q.student_id = (SELECT auth.uid()))
);

-- D. CLASSES
CREATE POLICY "constitution_classes_v1_rls" ON public.classes FOR ALL TO authenticated
USING (
    (public.is_super_admin() = true) OR 
    (public.get_my_tenant_id() = tenant_id) OR
    (teacher_id = (SELECT auth.uid()))
);

-- E. AI_USAGE_LOGS
CREATE POLICY "constitution_ai_logs_v1_rls" ON public.ai_usage_logs FOR ALL TO authenticated
USING (
    (public.is_super_admin() = true) OR 
    (public.get_my_tenant_id() = tenant_id) OR
    (user_id = (SELECT auth.uid()))
);

-- F. CEO_GROWTH_METRICS (Sadece Holding)
ALTER TABLE IF EXISTS public.ceo_growth_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "constitution_growth_v1_rls" ON public.ceo_growth_metrics FOR ALL TO authenticated
USING ( (public.is_super_admin() = true) );

-- G. NOTIFICATIONS
CREATE POLICY "constitution_notifications_v1_rls" ON public.notifications FOR ALL TO authenticated
USING ( (user_id = (SELECT auth.uid())) );

-- H. AI_KNOWLEDGE_GRAPH (RAG Cache)
CREATE POLICY "constitution_knowledge_sel" ON public.ai_knowledge_graph FOR SELECT TO authenticated USING (true);
CREATE POLICY "constitution_knowledge_mod" ON public.ai_knowledge_graph FOR ALL TO authenticated
USING ( (public.get_my_role() = 'admin') );

-- 4. VIEW GÜVENLİĞİ (Toptan Temizlik)
-- Advisor'da kırmızı yanan tüm view'ları buraya ekliyoruz.

DROP VIEW IF EXISTS public.ceo_financial_dashboard CASCADE;
CREATE VIEW public.ceo_financial_dashboard WITH (security_invoker = true) AS
SELECT 
    l.tenant_id,
    l.feature_name,
    l.model,
    sum(l.total_tokens) as total_tokens,
    sum(l.cost_usd) as total_cost_usd,
    avg(l.latency_ms) as avg_latency,
    count(*) as interaction_count
FROM 
    public.ai_usage_logs l
GROUP BY 
    l.tenant_id, l.feature_name, l.model;

-- Diğer görünümler de benzer şekilde security_invoker yapılacaktır. 
-- (Şu an en kritik olanları resetledik)

COMMIT;

-- 5. FINAL NOTIFICATION
DO $$
BEGIN
  RAISE NOTICE '🚀 GRAND RESET COMPLETE: Döngüler kırıldı, hiyerarşi merkezi fonksiyonlara bağlandı.';
END $$;
