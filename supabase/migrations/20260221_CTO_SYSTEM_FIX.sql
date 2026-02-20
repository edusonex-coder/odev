-- 🛠️ OdevGPT CTO SYSTEM FIX & OPTIMIZATION
-- Tarih: 21 Şubat 2026
-- Amaç: Konsol hatalarını temizleme, RLS açıklarını kapatma ve şema uyumsuzluklarını giderme.

-- ==========================================
-- 1. AI_KNOWLEDGE_GRAPH: Şema ve Sütun Kontrolü
-- ==========================================
DO $$ 
BEGIN
    -- ai_response sütunu eksikse ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_knowledge_graph' AND column_name = 'ai_response') THEN
        ALTER TABLE public.ai_knowledge_graph ADD COLUMN ai_response TEXT;
    END IF;
END $$;

-- RLS Politikalarını Güncelle (Hafıza/Cache özelliğinin çalışması için)
ALTER TABLE public.ai_knowledge_graph ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read knowledge" ON public.ai_knowledge_graph;
CREATE POLICY "Authenticated users can read knowledge" ON public.ai_knowledge_graph
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert knowledge" ON public.ai_knowledge_graph;
CREATE POLICY "Authenticated users can insert knowledge" ON public.ai_knowledge_graph
FOR INSERT TO authenticated WITH CHECK (true);

-- ==========================================
-- 2. SOLUTIONS: RLS Düzeltmesi
-- ==========================================
-- Mevcut durum: Sadece teacher/admin insert yapabiliyor.
-- Yeni durum: Öğrenciler de kendi soruları için 'ai' tipinde çözüm ekleyebilmeli.

DROP POLICY IF EXISTS "Öğrenciler AI çözümü ekleyebilir" ON public.solutions;
CREATE POLICY "Öğrenciler AI çözümü ekleyebilir" ON public.solutions
FOR INSERT TO authenticated
WITH CHECK (
    (solver_type = 'ai' AND EXISTS (
        SELECT 1 FROM public.questions q 
        WHERE q.id = question_id AND q.student_id = auth.uid()
    ))
    OR 
    (EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin')
    ))
);

-- ==========================================
-- 3. AI_USAGE_LOGS: RLS Düzeltmesi
-- ==========================================
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can insert logs" ON public.ai_usage_logs;
CREATE POLICY "Authenticated users can insert logs" ON public.ai_usage_logs
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can view own logs" ON public.ai_usage_logs;
CREATE POLICY "Users can view own logs" ON public.ai_usage_logs
FOR SELECT TO authenticated USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
));

-- ==========================================
-- 4. VERİ TABANI CACHE TEMİZLİĞİ (PostgREST için)
-- ==========================================
-- PostgREST'in şema cache'ini yenilemesi için notify gönder.
NOTIFY pgrst, 'reload schema';

-- ==========================================
-- 5. ANALİZ & ONAY
-- ==========================================
DO $$
BEGIN
    RAISE NOTICE '✅ CTO Sistem Uyumluluk Paketi Başarıyla Uygulandı.';
    RAISE NOTICE '🚀 ai_knowledge_graph: ai_response sütun ve RLS fix.';
    RAISE NOTICE '🛡️ solutions: Öğrenci INSERT izni verildi.';
    RAISE NOTICE '📊 ai_usage_logs: Loglama yetkisi tanımlandı.';
END $$;
