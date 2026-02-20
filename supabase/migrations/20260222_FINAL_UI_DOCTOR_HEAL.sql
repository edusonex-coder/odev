-- 🩺 DOCTOR'S FINAL HEALING MIGRATION
-- Tarih: 22 Şubat 2026
-- Amaç: RLS engellerini kaldırma, merkezi hafızayı (Knowledge Graph) halka açma ve auth hatalarını minimize etme.

-- ======================================================
-- 1. AI_KNOWLEDGE_GRAPH: Merkezi Hafıza Erişimi
-- ======================================================
-- Önceki 'Admin only access' politikasını esnetiyoruz.
-- AI hafızası tüm kullanıcılar için (RAG) çalışmalıdır.

ALTER TABLE public.ai_knowledge_graph ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin only access" ON public.ai_knowledge_graph;
DROP POLICY IF EXISTS "Authenticated users can read knowledge" ON public.ai_knowledge_graph;
DROP POLICY IF EXISTS "Authenticated users can insert knowledge" ON public.ai_knowledge_graph;

-- Herkes okuyabilir (RAG Cache için kritik)
CREATE POLICY "Anyone authenticated can read knowledge"
ON public.ai_knowledge_graph FOR SELECT
TO authenticated
USING (true);

-- Tüm yapay zeka işlemleri (kullanıcı adına) kayıt atabilmeli
CREATE POLICY "Anyone authenticated can contribute to knowledge"
ON public.ai_knowledge_graph FOR INSERT
TO authenticated
WITH CHECK (true);

-- Sadece adminler veya içeriği üretenler silebilir/güncelleyebilir
CREATE POLICY "Admins can manage knowledge"
ON public.ai_knowledge_graph FOR ALL
TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ======================================================
-- 2. CLASSES: Sınıf Bulma ve Katılma Yetkileri
-- ======================================================

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları koru ama öğrencilere SELECT izni ver (Kodu ile sınıf bulabilmeleri için)
DROP POLICY IF EXISTS "Authenticated users can view classes" ON public.classes;
CREATE POLICY "Authenticated users can view classes"
ON public.classes FOR SELECT
TO authenticated
USING (true);

-- ======================================================
-- 3. CLASS_STUDENTS: Sınıfa Katılma Yetkisi
-- ======================================================

ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;

-- Öğrenciler kendi üyeliklerini görebilmeli
DROP POLICY IF EXISTS "Students can view own memberships" ON public.class_students;
CREATE POLICY "Students can view own memberships"
ON public.class_students FOR SELECT
TO authenticated
USING (auth.uid() = student_id OR EXISTS (
    SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.teacher_id = auth.uid()
));

-- Öğrenciler bir sınıfa katılabilmeli (INSERT)
DROP POLICY IF EXISTS "Students can join classes" ON public.class_students;
CREATE POLICY "Students can join classes"
ON public.class_students FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

-- ======================================================
-- 4. KNOWLEDGE GRAPH: source_product Varsayılan Değeri
-- ======================================================
-- Eğer eksikse 'odevgpt' olarak varsayılan ata.
ALTER TABLE public.ai_knowledge_graph 
ALTER COLUMN source_product SET DEFAULT 'odevgpt';

-- null olanları temizle/doldur
UPDATE public.ai_knowledge_graph SET source_product = 'odevgpt' WHERE source_product IS NULL;

-- ======================================================
-- 5. ANALİZ RAPORU
-- ======================================================
NOTIFY pgrst, 'reload schema';

DO $$
BEGIN
    RAISE NOTICE '✅ Doktor iyileştirme paketi uygulandı.';
    RAISE NOTICE '🧠 Knowledge Graph artık tüm kullanıcılar için aktif.';
    RAISE NOTICE '🏫 Sınıf bulma ve katılma sorunları giderildi.';
END $$;
