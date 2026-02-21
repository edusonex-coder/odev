-- =====================================================
-- 🩺 ODEVGPT DASHBOARD REPAIR: MISSING VIEWS & GRANTS
-- =====================================================
-- Hata: "relation public.ceo_financial_dashboard does not exist"
-- Çözüm: Görünümü yeniden tanımla ve gerekli tabloları garanti altına al.

-- 1. CEO Financial Dashboard (Revenue vs Cost)
DROP VIEW IF EXISTS public.ceo_financial_dashboard CASCADE;
CREATE OR REPLACE VIEW public.ceo_financial_dashboard AS
WITH ai_costs AS (
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
        tenant_id, feature_name, model
),
revenue AS (
    SELECT 
        COALESCE(s.tenant_id, '00000000-0000-0000-0000-000000000000'::uuid) as tenant_id,
        sum(amount) as total_revenue_usd
    FROM 
        public.payments p
    LEFT JOIN public.subscriptions s ON p.subscription_id = s.id
    GROUP BY 
        s.tenant_id
)
SELECT 
    c.tenant_id,
    c.feature_name,
    c.model,
    c.total_tokens,
    c.total_cost_usd,
    COALESCE(r.total_revenue_usd, 0) as total_revenue_usd,
    c.avg_latency,
    c.interaction_count
FROM 
    ai_costs c
LEFT JOIN revenue r ON c.tenant_id = r.tenant_id;

-- 2. CEO Growth Metrics (Ensure exists as a table, drop view if it exists from older sessions)
DROP VIEW IF EXISTS public.ceo_growth_metrics CASCADE;
CREATE TABLE IF NOT EXISTS public.ceo_growth_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT,
    total_conversions INTEGER,
    cac DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed some sample growth data if empty
INSERT INTO public.ceo_growth_metrics (platform, total_conversions, cac)
SELECT platform, total_conversions, cac FROM (
    VALUES 
    ('Google Ads', 125, 4.20),
    ('Meta', 88, 5.50),
    ('Referral', 45, 0.00),
    ('Direct', 210, 0.00)
) AS t(platform, total_conversions, cac)
WHERE NOT EXISTS (SELECT 1 FROM public.ceo_growth_metrics LIMIT 1);

-- 3. Grants
GRANT SELECT ON public.ceo_financial_dashboard TO authenticated;
GRANT SELECT ON public.ceo_growth_metrics TO authenticated;
GRANT SELECT ON public.payments TO authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT SELECT ON public.subscription_plans TO authenticated;

-- 4. Result
DO $$ 
BEGIN 
  RAISE NOTICE '✅ Dashboard Repair: CEO Financial Dashboard ve Growth Metrics tabloları/viewları onarıldı.'; 
END $$;
