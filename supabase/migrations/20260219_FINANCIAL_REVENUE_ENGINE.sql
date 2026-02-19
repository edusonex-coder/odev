-- Project: OdevGPT
-- 20260219_FINANCIAL_REVENUE_ENGINE.sql
-- Description: Tables for Revenue tracking and B2B Subscription management.

-- 1. Subscription Plans (B2B & B2C)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('b2c_individual', 'b2b_school')),
    price_monthly DECIMAL(10, 2) NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE, -- For school subscriptions
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- For individual subscriptions
    plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
    status TEXT DEFAULT 'active', -- 'active', 'past_due', 'canceled'
    current_period_start TIMESTAMPTZ DEFAULT now(),
    current_period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Payments (Halal/Interest-Free Ledger)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT, -- 'credit_card', 'bank_transfer'
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Sample Data
INSERT INTO public.subscription_plans (name, type, price_monthly, features) VALUES
('Bireysel Pro', 'b2c_individual', 9.90, '["Sınırsız Soru", "Öncelikli AI", "Veli Bildirimleri"]'),
('Okul Standart', 'b2b_school', 250.00, '["100 Öğrenci", "Kurumsal Dashboard", "Sınırsız Duyuru"]'),
('Okul Premium', 'b2b_school', 500.00, '["Sınırsız Öğrenci", "Beyaz Etiket", "24/7 Destek"]');

-- Insert some sample subscriptions and payments logic (Manual seed for dashboard)
-- We will assume some revenue has been generated.

-- 5. Updated Financial Dashboard View (Revenue vs Cost)
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

-- Seed Sample Payments
INSERT INTO public.payments (amount, payment_method) VALUES 
(4500.00, 'bank_transfer'), -- Genel B2B Satış tahmini
(120.00, 'credit_card');   -- Bireysel Satış tahmini

-- 6. Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage everything finance" ON public.subscription_plans;
CREATE POLICY "Admins can manage everything finance" ON public.subscription_plans FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins can manage everything subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can manage everything subscriptions" ON public.subscriptions FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins can manage everything payments" ON public.payments;
CREATE POLICY "Admins can manage everything payments" ON public.payments FOR ALL USING (true);
