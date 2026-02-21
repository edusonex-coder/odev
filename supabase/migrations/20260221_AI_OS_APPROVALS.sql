-- =====================================================
-- 🛡️ AI_OS MERKEZİ ONAY SİSTEMİ (HITL)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.ai_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_source TEXT NOT NULL, -- 'odevgpt', 'crm', 'yonetim'
  agent_name TEXT NOT NULL,
  approval_type TEXT NOT NULL, -- 'contract', 'email', 'financial'
  summary TEXT NOT NULL,
  content TEXT NOT NULL, -- Taslak metin (teklif, sözleşme, email vb.)
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Düşük', 'Orta', 'Yüksek', 'Kritik')),
  status TEXT NOT NULL CHECK (status IN ('Bekliyor', 'Onaylandı', 'Reddedildi')) DEFAULT 'Bekliyor',
  metadata JSONB, -- Ekstra veriler
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Aktifleştirme
ALTER TABLE public.ai_approvals ENABLE ROW LEVEL SECURITY;

-- Politikaları Temizle (Büyük Reset Protokolü)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'ai_approvals' AND schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.ai_approvals', r.policyname);
    END LOOP;
END $$;

-- Unified Boss Policy (Sadece Adminler)
CREATE POLICY "ai_approvals_admin_ultimate" ON public.ai_approvals 
FOR ALL TO authenticated 
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
)
WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
);

-- Indexler
CREATE INDEX IF NOT EXISTS idx_ai_approvals_status ON public.ai_approvals(status);
CREATE INDEX IF NOT EXISTS idx_ai_approvals_source ON public.ai_approvals(project_source);

-- Updated At Trigger
CREATE TRIGGER update_ai_approvals_updated_at BEFORE UPDATE ON public.ai_approvals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 🧪 TEST VERİLERİ (Ajanların İlk Çıktıları İçin Hazırlık)
-- =====================================================
-- Not: Bu veriler normalde AI_OS backend tarafından eklenecek.
INSERT INTO public.ai_approvals (project_source, agent_name, approval_type, summary, content, risk_level)
VALUES 
('crm', 'Partnership Agent', 'contract', 'Fuzem White-Label Çerçeve Sözleşmesi', 'Veri mülkiyeti Edusonex''te kalmak kaydıyla...', 'Yüksek'),
('crm', 'Sales Agent', 'email', 'Denizli Butik Kurslar Cold Outreach', 'Sayın Kurucu, CAPEX maliyetlerinizi sıfırlamaya geldik...', 'Orta');
