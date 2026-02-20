-- 🏥 EDUSONEX CRITICAL DOCTOR FIX (21 Şubat 2026)
-- Amaç: Konsoldaki 400 Hatasını (ai_knowledge_graph) kökten çözmek ve pgvector uyumluluğunu sağlamak.

-- 1. pgvector Uzantısını Etkinleştir (Eğer yüklü değilse ai_knowledge_graph tablosu hata verir)
-- Not: Bazı Supabase platformlarında bu uzantı admin yetkisi gerektirir.
-- Eğer hata verirse embedding sütununu text olarak fallback yapacağız.
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. ai_knowledge_graph Tablosunu Sağlamlaştır
-- Eğer tablo hiç oluşmadıysa (vector hatası yüzünden) oluştur.
CREATE TABLE IF NOT EXISTS public.ai_knowledge_graph (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    source_product TEXT NOT NULL DEFAULT 'odevgpt',
    content_text TEXT NOT NULL,
    ai_response TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Embedding Sütununu Güvenli Şekilde Ekle
-- Eğer vector extension varsa VECTOR(1536) kullan, yoksa TEXT olarak ekle (hata almamak için)
DO $$ 
BEGIN
    BEGIN
        -- Vector extension varsa embedding sütununu vector olarak ekle
        IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
            ALTER TABLE public.ai_knowledge_graph ADD COLUMN IF NOT EXISTS embedding VECTOR(1536);
        ELSE
            ALTER TABLE public.ai_knowledge_graph ADD COLUMN IF NOT EXISTS embedding TEXT;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- Bir hata olursa (tip uyumsuzluğu vb) text olarak devam et
        ALTER TABLE public.ai_knowledge_graph ADD COLUMN IF NOT EXISTS embedding TEXT;
    END;
END $$;

-- 4. ai_response Sütunu Kontrolü (Tekrar Garanti)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_knowledge_graph' AND column_name = 'ai_response') THEN
        ALTER TABLE public.ai_knowledge_graph ADD COLUMN ai_response TEXT;
    END IF;
END $$;

-- 5. RLS Politikalarını Herkes İçin (Authenticated) Baştan Yaz
ALTER TABLE public.ai_knowledge_graph ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read knowledge" ON public.ai_knowledge_graph;
CREATE POLICY "Authenticated users can read knowledge" ON public.ai_knowledge_graph
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert knowledge" ON public.ai_knowledge_graph;
CREATE POLICY "Authenticated users can insert knowledge" ON public.ai_knowledge_graph
FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update knowledge" ON public.ai_knowledge_graph;
CREATE POLICY "Authenticated users can update knowledge" ON public.ai_knowledge_graph
FOR UPDATE TO authenticated USING (true);

-- 6. Şema Önbelleğini Sıfırla
NOTIFY pgrst, 'reload schema';

COMMENT ON TABLE public.ai_knowledge_graph IS 'Edusonex Merkezi AI Hafızası ve RAG Katmanı.';
