-- Project: OdevGPT
-- 20260219_GROWTH_ANALYTICS.sql
-- Description: Tables for CMO and ADS Commander to track marketing performance.

-- 1. ADS Performance Tracking
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL, -- 'google', 'meta', 'tiktok'
    campaign_name TEXT NOT NULL,
    spend_usd DECIMAL(10, 2) DEFAULT 0.0,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Unit Economics View for CEO
CREATE OR REPLACE VIEW public.ceo_growth_metrics AS
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

-- 3. Sample Data for the Dashboard (Initial Seed)
INSERT INTO public.marketing_campaigns (platform, campaign_name, spend_usd, impressions, clicks, conversions)
VALUES 
('google', 'OdevGPT Search - TR', 150.00, 5000, 350, 25),
('meta', 'Socratic Coach Video', 200.00, 12000, 800, 45),
('tiktok', 'Homework Help Viral', 50.00, 45000, 1200, 15);
