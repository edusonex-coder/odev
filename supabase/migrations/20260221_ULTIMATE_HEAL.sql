-- 🛡️ ODEVGPT ULTIMATE DATABASE HEAL (Shield v5)
-- Tarih: 21 Şubat 2026
-- Amacı: 70+ Advisor uyarısını, mükerrer indexleri ve çakışan politikaları KÖKTEN temizlemek.

-- =====================================================
-- 1. TEMİZLİK OPERASYONU: Mükerrer Indexler
-- =====================================================
DROP INDEX IF EXISTS public.idx_ai_usage_tenant_final;
DROP INDEX IF EXISTS public.idx_assign_teacher_final;
DROP INDEX IF EXISTS public.idx_perf_assignments_tenant;
DROP INDEX IF EXISTS public.idx_perf_profiles_tenant;
DROP INDEX IF EXISTS public.idx_profiles_tenant_id;
DROP INDEX IF EXISTS public.idx_perf_questions_tenant;
DROP INDEX IF EXISTS public.idx_questions_student_id_final;
DROP INDEX IF EXISTS public.idx_solutions_question_id_final;
DROP INDEX IF EXISTS public.idx_spr_parent_final;
DROP INDEX IF EXISTS public.idx_spr_student_final;

-- = { Sağlam ve Standardize Indexler } =
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_tenant_id ON public.ai_usage_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_v4_assignments_teacher ON public.assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_tenant_id ON public.assignments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_v4_profiles_tenant ON public.profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_questions_tenant_id ON public.questions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_v4_questions_student ON public.questions(student_id);
CREATE INDEX IF NOT EXISTS idx_v4_solutions_question ON public.solutions(question_id);
CREATE INDEX IF NOT EXISTS idx_student_parent_relations_parent_id ON public.student_parent_relations(parent_id);
CREATE INDEX IF NOT EXISTS idx_student_parent_relations_student_id ON public.student_parent_relations(student_id);

-- =====================================================
-- 2. TEMİZLİK OPERASYONU: Çakışan Politikalar (Public)
-- =====================================================
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- 'public' şemasındaki tüm politikaları temizleyelim (Büyük Reset)
    FOR r IN (
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- = { Bütüncül (Unified) ve Performans Odaklı Politikalar } =

-- [AI_KNOWLEDGE_GRAPH]
ALTER TABLE public.ai_knowledge_graph ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_knowledge_graph_unified_ultimate" ON public.ai_knowledge_graph 
FOR ALL TO authenticated 
USING (true)
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

-- [QUESTIONS]
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions_unified_ultimate" ON public.questions 
FOR ALL TO authenticated 
USING (student_id = (SELECT auth.uid()) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('teacher', 'admin')))
WITH CHECK (student_id = (SELECT auth.uid()));

-- [SOLUTIONS]
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "solutions_unified_ultimate" ON public.solutions 
FOR ALL TO authenticated 
USING (
    EXISTS (SELECT 1 FROM public.questions q WHERE q.id = question_id AND q.student_id = (SELECT auth.uid())) 
    OR solver_id = (SELECT auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('teacher', 'admin'))
)
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('teacher', 'admin')));

-- [PROFILES]
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_unified_ultimate" ON public.profiles 
FOR ALL TO authenticated 
USING (id = (SELECT auth.uid()) OR role IN ('teacher', 'admin'))
WITH CHECK (id = (SELECT auth.uid()));

-- [ANNOUNCEMENTS]
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "announcements_unified_ultimate" ON public.announcements 
FOR ALL TO authenticated 
USING (
    is_active = TRUE AND (
        is_global = TRUE OR 
        tenant_id = (SELECT p.tenant_id FROM public.profiles p WHERE p.id = (SELECT auth.uid()) LIMIT 1)
    ) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('teacher', 'admin'))
);

-- [ASSIGNMENTS]
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assignments_unified_ultimate" ON public.assignments 
FOR ALL TO authenticated 
USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()))
)
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('teacher', 'admin')));

-- [STUDENT_PARENT_RELATIONS]
ALTER TABLE public.student_parent_relations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "student_parent_relations_unified_ultimate" ON public.student_parent_relations 
FOR ALL TO authenticated 
USING (parent_id = (SELECT auth.uid()) OR student_id = (SELECT auth.uid()));

-- [STORAGE.OBJECTS] - BÜYÜK TEMİZLİK
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
    END LOOP;
END $$;

CREATE POLICY "storage_objects_unified_ultimate" ON storage.objects
FOR ALL TO authenticated
USING (
    bucket_id IN ('avatars', 'assignments', 'questions') AND
    ( owner = (SELECT auth.uid()) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('teacher', 'admin')) )
)
WITH CHECK (
    bucket_id IN ('avatars', 'assignments', 'questions') AND
    owner = (SELECT auth.uid())
);

-- =====================================================
-- 3. SECURITY & PERFORMANCE FINETUNING
-- =====================================================
-- Search Path Fix (Again to be sure)
ALTER FUNCTION public.issue_certificate(UUID, TEXT, TEXT, TEXT, JSONB, TEXT) SET search_path = public;
ALTER FUNCTION public.claim_daily_quest_bonus(UUID) SET search_path = public;

-- Leaked Password Notu:
-- Supabase Dashboard -> Auth -> Email Providers -> Leaked Password Protection: ENABLED yapın.

-- =====================================================
-- 🏁 TAMAMLANDI - OdevGPT Shield Ultimate v5 🏁
-- =====================================================
