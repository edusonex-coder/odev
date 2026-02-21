-- =====================================================
-- 💰 AI_USAGE_LOGS (Maliyet Takip Tablosu)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_source TEXT NOT NULL, -- 'odevgpt', 'crm', 'yonetim'
  feature_name TEXT NOT NULL,   -- 'Sales_Email', 'Partnership_Contract'
  model_name TEXT NOT NULL,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  estimated_cost DECIMAL(10,6) DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Aktifleştirme
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Unified Boss Policy (Sadece Adminler)
CREATE POLICY "ai_usage_logs_admin_ultimate" ON public.ai_usage_logs 
FOR ALL TO authenticated 
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
)
WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
);

-- Indexler
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_project ON public.ai_usage_logs(project_source);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created ON public.ai_usage_logs(created_at DESC);
