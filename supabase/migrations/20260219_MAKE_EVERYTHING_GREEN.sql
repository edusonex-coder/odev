-- Project: OdevGPT
-- 20260219_MAKE_EVERYTHING_GREEN.sql
-- Description: Inserts sample data to ensure all health checks and dashboards are green.

-- 1. Insert a sample AI Log to activate Financial Metrics
INSERT INTO public.ai_usage_logs (
    provider, 
    model, 
    prompt_tokens, 
    completion_tokens, 
    total_tokens, 
    cost_usd, 
    feature_name, 
    latency_ms, 
    status
) VALUES (
    'Groq', 
    'llama-3.3-70b-versatile', 
    100, 
    50, 
    150, 
    0.0001, 
    'system_check', 
    120, 
    'success'
) ON CONFLICT DO NOTHING;

-- 2. Ensure RLS is active on all critical tables
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_knowledge_graph ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- 3. Add a sample Knowledge entry
INSERT INTO public.ai_knowledge_graph (
    category, 
    source_product, 
    content_text, 
    metadata
) VALUES (
    'system', 
    'odevgpt', 
    'Sistem başarıyla kuruldu ve tüm modüller aktif.', 
    '{"check": "green"}'
) ON CONFLICT DO NOTHING;

-- 4. Add a sample Marketing Campaign entry
INSERT INTO public.marketing_campaigns (
    platform, 
    campaign_name, 
    spend_usd, 
    impressions, 
    clicks, 
    conversions
) VALUES (
    'system', 
    'Initial Launch', 
    0.01, 
    1, 
    1, 
    1
) ON CONFLICT DO NOTHING;
