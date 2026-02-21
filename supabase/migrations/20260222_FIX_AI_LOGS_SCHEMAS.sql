-- =====================================================
-- 🛠️ AI_OS SCHEMA HEAL & UPGRADE (Maliyet ve Onay Tabloları)
-- =====================================================

-- 1. ESKİ TABLOYU TEMİZLE (Çakışmaları önlemek için)
DROP VIEW IF EXISTS public.ai_usage_summary;
DROP TABLE IF EXISTS public.ai_usage_logs CASCADE;

-- 2. YENİ AI_USAGE_LOGS (Maliyet Takip - Projekt Bazlı)
CREATE TABLE public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_source TEXT NOT NULL, -- 'odevgpt', 'crm', 'yonetim'
  feature_name TEXT NOT NULL,   -- 'Sales_Email', 'Partnership_Contract'
  model_name TEXT NOT NULL,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  estimated_cost DECIMAL(10,6) DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE
);

-- 3. AI_APPROVALS UPDATE (Eylem Motoru İçin)
-- Tablo zaten varsa eksik sütunları ekleyelim
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_approvals' AND column_name='metadata') THEN
        ALTER TABLE public.ai_approvals ADD COLUMN metadata JSONB;
    END IF;
END $$;

-- 4. RLS & GÜVENLİK
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Politikaları Temizle ve Yeni Unified Policy Ekle
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'ai_usage_logs' AND schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.ai_usage_logs', r.policyname);
    END LOOP;
END $$;

CREATE POLICY "ai_usage_logs_unified_admin" ON public.ai_usage_logs 
FOR ALL TO authenticated 
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
)
WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
);

-- 5. İNDEKSLEME
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_project ON public.ai_usage_logs(project_source);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created ON public.ai_usage_logs(created_at DESC);

-- 6. ÖZET GÖRÜNÜM (Revenue Factory İçin)
CREATE OR REPLACE VIEW public.ai_usage_summary AS
SELECT 
    project_source,
    model_name,
    count(*) as total_requests,
    sum(total_tokens) as total_tokens,
    sum(estimated_cost) as total_cost,
    max(created_at) as last_request
FROM 
    public.ai_usage_logs
GROUP BY 
    project_source, model_name;

GRANT SELECT ON public.ai_usage_summary TO authenticated;
