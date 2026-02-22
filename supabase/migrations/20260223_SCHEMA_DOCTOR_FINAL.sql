-- =====================================================
-- 🏥 ODEVGPT SCHEMA DOCTOR - LAUNCH READY FIX
-- Tarih: 23 Şubat 2026
-- Amaç: Sistem Tanılama sonuçlarındaki tüm kırmızı/uyarı
--       durumları temizleyerek piyasaya hazır hale getirmek.
-- =====================================================

BEGIN;

-- =====================================================
-- 1. SOLUTIONS TABLOSU: YANLIŞ student_id KOLONU KALDIRma
--    Sistem Tanılama: "❌ HATA: student_id solutions tablosunda olmamalı!"
--    solutions tablosunda student_id olmaz, questions üzerinden JOIN yapılır.
-- =====================================================
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'solutions' 
        AND column_name = 'student_id'
    ) THEN
        ALTER TABLE public.solutions DROP COLUMN student_id;
        RAISE NOTICE '✅ solutions.student_id kolonu kaldırıldı (Şema temizlendi).';
    ELSE
        RAISE NOTICE 'ℹ️ solutions.student_id zaten yok, atlanıyor.';
    END IF;
END $$;

-- =====================================================
-- 2. CEO DASHBOARD VIEWLERİ: security_invoker=true ile YENIDEN OLUŞTUR
--    (Advisor: Views should use security_invoker=true)
-- =====================================================

-- 2.1 CEO Financial Dashboard
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'ceo_financial_dashboard') THEN
        DROP VIEW public.ceo_financial_dashboard CASCADE;
    ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ceo_financial_dashboard') THEN
        DROP TABLE public.ceo_financial_dashboard CASCADE;
    END IF;
END $$;
CREATE OR REPLACE VIEW public.ceo_financial_dashboard
WITH (security_invoker = true)
AS
SELECT 
    tenant_id,
    feature_name,
    model,
    sum(total_tokens) as total_tokens,
    sum(cost_usd) as total_cost_usd,
    avg(latency_ms) as avg_latency,
    count(*) as interaction_count
FROM public.ai_usage_logs
GROUP BY tenant_id, feature_name, model;

GRANT SELECT ON public.ceo_financial_dashboard TO authenticated;

-- 2.2 CEO Growth Metrics
DO $$
BEGIN
    -- Tablo mı view mı bilmiyoruz, ikisini de kontrol et
    IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'ceo_growth_metrics') THEN
        DROP VIEW public.ceo_growth_metrics CASCADE;
    ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ceo_growth_metrics') THEN
        DROP TABLE public.ceo_growth_metrics CASCADE;
    END IF;
END $$;

CREATE OR REPLACE VIEW public.ceo_growth_metrics
WITH (security_invoker = true)
AS
SELECT 
    platform,
    sum(spend_usd) as total_spend,
    sum(clicks) as total_clicks,
    sum(conversions) as total_conversions,
    CASE WHEN sum(conversions) > 0 THEN sum(spend_usd) / sum(conversions) ELSE 0 END as cac,
    CASE WHEN sum(clicks) > 0 THEN (sum(conversions)::float / sum(clicks)::float) * 100 ELSE 0 END as conversion_rate
FROM public.marketing_campaigns
GROUP BY platform;

GRANT SELECT ON public.ceo_growth_metrics TO authenticated;

-- 2.3 AI Usage Summary
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'ai_usage_summary') THEN
        DROP VIEW public.ai_usage_summary CASCADE;
    ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_usage_summary') THEN
        DROP TABLE public.ai_usage_summary CASCADE;
    END IF;
END $$;
CREATE OR REPLACE VIEW public.ai_usage_summary
WITH (security_invoker = true)
AS
SELECT
    model,
    feature_name,
    date_trunc('day', created_at) as date,
    count(*) as requests,
    sum(total_tokens) as total_tokens,
    sum(cost_usd) as total_cost_usd,
    avg(latency_ms) as avg_latency_ms
FROM public.ai_usage_logs
GROUP BY model, feature_name, date_trunc('day', created_at);

GRANT SELECT ON public.ai_usage_summary TO authenticated;

-- 2.4 Holding Performance Summary (Advisor: security_invoker fix)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'holding_performance_summary') THEN
        DROP VIEW public.holding_performance_summary CASCADE;
    ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'holding_performance_summary') THEN
        DROP TABLE public.holding_performance_summary CASCADE;
    END IF;
END $$;
CREATE OR REPLACE VIEW public.holding_performance_summary
WITH (security_invoker = true)
AS
SELECT 
    t.id as tenant_id,
    t.name as tenant_name,
    t.slug as tenant_slug,
    (SELECT count(*) FROM public.profiles p WHERE p.tenant_id = t.id AND p.role = 'student') as total_students,
    (SELECT count(*) FROM public.questions q WHERE q.tenant_id = t.id) as total_questions,
    (SELECT count(*) FROM public.solutions s WHERE s.tenant_id = t.id) as total_solutions,
    (SELECT round(avg(xp)) FROM public.profiles p WHERE p.tenant_id = t.id AND p.role = 'student') as avg_student_xp,
    (SELECT max(last_activity_at) FROM public.profiles p WHERE p.tenant_id = t.id) as last_activity
FROM public.tenants t;

GRANT SELECT ON public.holding_performance_summary TO authenticated;

-- =====================================================
-- 3. TRIGGER SAĞLIĞI: trg_check_badges_on_solution YENİDEN KUAT
-- =====================================================
DROP TRIGGER IF EXISTS trg_check_badges_on_solution ON public.solutions;

-- Fonksiyon solutions tablosunda student_id olmadığı için questions üzerinden alır (doğru yaklaşım)
CREATE OR REPLACE FUNCTION public.check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_xp INTEGER;
    v_math_count INTEGER;
BEGIN
    IF TG_TABLE_NAME = 'profiles' THEN
        v_user_id := NEW.id;
        v_xp := NEW.xp;
    ELSIF TG_TABLE_NAME = 'xp_logs' THEN
        v_user_id := NEW.user_id;
        SELECT xp INTO v_xp FROM public.profiles WHERE id = v_user_id;
    ELSIF TG_TABLE_NAME = 'solutions' THEN
        -- solutions'ta student_id YOKTUR, questions üzerinden al
        SELECT q.student_id, p.xp 
        INTO v_user_id, v_xp 
        FROM public.questions q
        JOIN public.profiles p ON p.id = q.student_id
        WHERE q.id = NEW.question_id;
    END IF;

    IF v_user_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Rozet 1: İlk Adım (Her zaman)
    PERFORM public.award_badge_if_not_exists(v_user_id, 'İlk Adım');

    -- Rozet 2: XP basamakları
    IF v_xp >= 1000 THEN
        PERFORM public.award_badge_if_not_exists(v_user_id, 'XP Avcısı');
    END IF;

    -- Rozet 3: Matematik Kurdu
    SELECT COUNT(*) INTO v_math_count 
    FROM public.questions q
    JOIN public.solutions s ON s.question_id = q.id
    WHERE q.student_id = v_user_id AND q.subject ILIKE '%matematik%';
    
    IF v_math_count >= 10 THEN
        PERFORM public.award_badge_if_not_exists(v_user_id, 'Matematik Kurdu');
    END IF;

    -- Rozet 4: Gece Kuşu
    IF EXTRACT(HOUR FROM now()) BETWEEN 0 AND 4 THEN
        PERFORM public.award_badge_if_not_exists(v_user_id, 'Gece Kuşu');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger'ı yeniden oluştur
CREATE TRIGGER trg_check_badges_on_solution
AFTER INSERT ON public.solutions
FOR EACH ROW EXECUTE FUNCTION public.check_and_award_badges();

-- =====================================================
-- 4. MARKETING_CAMPAIGNS: RLS Aktif Et
-- =====================================================
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "marketing_campaigns_admin" ON public.marketing_campaigns;
CREATE POLICY "marketing_campaigns_admin" ON public.marketing_campaigns FOR ALL TO authenticated
USING (public.is_iam_super_admin());

-- =====================================================
-- 5. PARENT_REPORTS: RLS Aktif Et
-- =====================================================-- [5] PARENT_REPORTS: RLS Aktif Et
ALTER TABLE public.parent_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "parent_reports_access" ON public.parent_reports;
DROP POLICY IF EXISTS "Parents can view their own reports" ON public.parent_reports;
DROP POLICY IF EXISTS "System can insert reports" ON public.parent_reports;
DROP POLICY IF EXISTS "System can update reports" ON public.parent_reports;
CREATE POLICY "parent_reports_select" ON public.parent_reports FOR SELECT TO authenticated
USING (
    parent_id = (SELECT auth.uid()) OR 
    public.is_iam_super_admin() OR
    public.is_my_student(student_id)
);
CREATE POLICY "parent_reports_insert" ON public.parent_reports FOR INSERT TO authenticated
WITH CHECK (true);
CREATE POLICY "parent_reports_update" ON public.parent_reports FOR UPDATE TO authenticated
USING (parent_id = (SELECT auth.uid()) OR public.is_iam_super_admin());

-- =====================================================
-- 6. NOTIFICATIONS: RLS Güncelle
-- =====================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

COMMIT;

-- Schema yenile
NOTIFY pgrst, 'reload schema';
