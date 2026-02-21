-- 🛡️ ODEVGPT SUPABASE ADVISOR MASSIVE CONSOLIDATION v4
-- Tarih: 21 Şubat 2026
-- Amacı: 70'e çıkan uyarıları tekil, birleşik politikalarla (FOR ALL) sıfırlamak.

DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Tüm tablolar için bilinen eski politikaları temizleyelim (Çakışmaları önlemek için)
    FOR r IN (
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND (policyname LIKE '%perf%' OR policyname LIKE '%unified%' OR policyname LIKE '%select%' OR policyname LIKE '%admin%' OR policyname LIKE '%student%' OR policyname LIKE '%Users can%')
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- =====================================================
-- 🛠️ UNIFIED POLICY MODELLERİ (TEK TABLO - TEK POLİTİKA)
-- =====================================================

-- [1] AI_KNOWLEDGE_GRAPH (Always True & Performance)
ALTER TABLE public.ai_knowledge_graph ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_knowledge_graph_unified_v4" ON public.ai_knowledge_graph 
FOR ALL TO authenticated 
USING (true) -- Herkes okuyabilir
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')); -- Sadece admin yazabilir

-- [2] QUESTIONS (Initialization Plan)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions_unified_v4" ON public.questions 
FOR ALL TO authenticated 
USING (student_id = (SELECT auth.uid()) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('teacher', 'admin')))
WITH CHECK (student_id = (SELECT auth.uid()));

-- [3] SOLUTIONS (Performance)
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "solutions_unified_v4" ON public.solutions 
FOR ALL TO authenticated 
USING (
    EXISTS (SELECT 1 FROM public.questions q WHERE q.id = question_id AND q.student_id = (SELECT auth.uid())) 
    OR solver_id = (SELECT auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('teacher', 'admin'))
)
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('teacher', 'admin')));

-- [4] PROFILES (Performance)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_unified_v4" ON public.profiles 
FOR ALL TO authenticated 
USING (id = (SELECT auth.uid()) OR role IN ('teacher', 'admin'))
WITH CHECK (id = (SELECT auth.uid()));

-- [5] ANNOUNCEMENTS (Initialization Plan)
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "announcements_unified_v4" ON public.announcements 
FOR ALL TO authenticated 
USING (
    is_active = TRUE AND (
        is_global = TRUE OR 
        tenant_id = (SELECT p.tenant_id FROM public.profiles p WHERE p.id = (SELECT auth.uid()) LIMIT 1)
    ) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('teacher', 'admin'))
);

-- [6] ASSIGNMENTS (Performance)
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assignments_unified_v4" ON public.assignments 
FOR ALL TO authenticated 
USING (true)
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('teacher', 'admin')));

-- [7] STUDENT_PARENT_RELATIONS (Performance)
ALTER TABLE public.student_parent_relations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "student_parent_relations_unified_v4" ON public.student_parent_relations 
FOR ALL TO authenticated 
USING (parent_id = (SELECT auth.uid()) OR student_id = (SELECT auth.uid()));

-- [8] CERTIFICATES (Performance)
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "certificates_unified_v4" ON public.certificates 
FOR ALL TO authenticated 
USING (user_id = (SELECT auth.uid()) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- [9] CLASS_STUDENTS (Performance)
ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "class_students_unified_v4" ON public.class_students 
FOR ALL TO authenticated 
USING (student_id = (SELECT auth.uid()) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('teacher', 'admin')));

-- [10] BLOGS (Performance)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blogs_unified_v4" ON public.blogs 
FOR ALL TO authenticated 
USING (is_published = true OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- =====================================================
-- 🚀 INDEXING TURBO (SEARCH SPEED)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_v4_profiles_tenant ON public.profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_v4_questions_student ON public.questions(student_id);
CREATE INDEX IF NOT EXISTS idx_v4_solutions_question ON public.solutions(question_id);
CREATE INDEX IF NOT EXISTS idx_v4_assignments_teacher ON public.assignments(teacher_id);

-- =====================================================
-- TAMAMLANDI - OdevGPT Unified Shield v4 🛡️✨
-- =====================================================
