-- 20260217_add_ai_usage_tracking.sql
-- Description: Tracks AI token usage and health across all tenants for monitoring and quota management.

CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    status TEXT DEFAULT 'success', -- 'success', 'failed'
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for analytics
CREATE INDEX IF NOT EXISTS idx_ai_usage_tenant ON public.ai_usage_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON public.ai_usage_logs(created_at);

-- View for Holding Admin to see aggregated stats
CREATE OR REPLACE VIEW public.ai_usage_summary AS
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

-- Permissions
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
-- Only system can insert/select (we'll use service role or definer functions)
-- But for holding admin viewing, we grant select to authenticated
GRANT SELECT ON public.ai_usage_summary TO authenticated;

COMMENT ON TABLE public.ai_usage_logs IS 'AI kullanım metrikleri ve token harcamaları.';
