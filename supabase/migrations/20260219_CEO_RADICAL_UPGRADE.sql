-- Project: OdevGPT
-- 20260219_CEO_RADICAL_UPGRADE.sql
-- Description: Upgrades AI logging for financial tracking and adds central knowledge graph as per CEO & VP mandates.

-- 1. Upgrade ai_usage_logs for Financial Intelligence
ALTER TABLE public.ai_usage_logs 
    ADD COLUMN IF NOT EXISTS cost_usd DECIMAL(12, 10) DEFAULT 0.0,
    ADD COLUMN IF NOT EXISTS feature_name TEXT,
    ADD COLUMN IF NOT EXISTS latency_ms INTEGER;

-- 2. Create Central Knowledge Graph for Cross-Product reuse (RAG)
CREATE TABLE IF NOT EXISTS public.ai_knowledge_graph (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- 'educational', 'business', 'legal', etc.
    source_product TEXT NOT NULL, -- 'odevgpt', 'sinav', 'crm', etc.
    content_text TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding VECTOR(1536), -- Optional: if using pgvector, otherwise text for now
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for searching categories and products
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON public.ai_knowledge_graph(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_product ON public.ai_knowledge_graph(source_product);

-- 3. Create AI Cost Dashboard View
CREATE OR REPLACE VIEW public.ceo_financial_dashboard AS
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

COMMENT ON VIEW public.ceo_financial_dashboard IS 'CEO için finansal ve operasyonel AI analiz paneli verisi.';
