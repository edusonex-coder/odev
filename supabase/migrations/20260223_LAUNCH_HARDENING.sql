-- =====================================================
-- 🚀 ODEVGPT LAUNCH HARDENING v2 - PRE-FLIGHT FINAL
-- Tarih: 23 Şubat 2026
-- Amaç: Piyasaya çıkmadan önce tüm Advisor warningleri ve
--       kritik 403 hatalarını sona erdirmek.
-- =====================================================

BEGIN;

-- =====================================================
-- 1. YETKİ FONKSİYONLARI: TAMAMEN OPTİMİZE SÜRÜMLER
--    (Initialization Plan Fix: auth.uid() -> (SELECT auth.uid()))
-- =====================================================

-- Orphan function temizliği (Advisor: Function Search Path Mutable)
DROP FUNCTION IF EXISTS public.get_my_id() CASCADE;

CREATE OR REPLACE FUNCTION public.is_iam_super_admin() 
RETURNS BOOLEAN AS $$
  SELECT COALESCE(is_super_admin, false) FROM public.profiles WHERE id = (SELECT auth.uid());
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE;

CREATE OR REPLACE FUNCTION public.get_my_tenant_id() 
RETURNS UUID AS $$
  SELECT tenant_id FROM public.profiles WHERE id = (SELECT auth.uid());
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE;

CREATE OR REPLACE FUNCTION public.get_my_role() 
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = (SELECT auth.uid());
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE;

-- =====================================================
-- 2. NUCLEAR RLS CLEANUP (Tüm eski politikaları sıfırla)
-- =====================================================
DO $$ 
DECLARE tbl TEXT; pol RECORD;
BEGIN 
    FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
    AND tablename IN (
        'profiles', 'questions', 'solutions', 'classes', 'class_students', 
        'announcements', 'assignments', 'assignment_submissions', 
        'ai_approvals', 'ai_usage_logs', 'ai_knowledge_graph',
        'blogs', 'certificates', 'student_parent_relations',
        'notifications', 'xp_logs', 'parent_reports'
    ) LOOP
        FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = tbl AND schemaname = 'public' LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, tbl);
        END LOOP;
    END LOOP;
END $$;

-- =====================================================
-- 3. POLİTİKALAR (Tek policy per table, ayrışık roller)
-- =====================================================

-- [3.1] PROFILES
CREATE POLICY "profiles_final_select" ON public.profiles FOR SELECT TO authenticated
USING (
    (id = (SELECT auth.uid())) OR 
    (public.is_iam_super_admin()) OR
    (tenant_id IS NOT NULL AND tenant_id = public.get_my_tenant_id()) OR
    (public.is_my_student(id))
);
CREATE POLICY "profiles_final_update" ON public.profiles FOR UPDATE TO authenticated
USING (id = (SELECT auth.uid()) OR public.is_iam_super_admin())
WITH CHECK (id = (SELECT auth.uid()) OR public.is_iam_super_admin());

-- [3.2] CLASSES
CREATE POLICY "classes_final_select" ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "classes_final_insert" ON public.classes FOR INSERT TO authenticated 
WITH CHECK (public.is_iam_super_admin() OR public.get_my_role() IN ('teacher', 'admin'));
CREATE POLICY "classes_final_modify" ON public.classes FOR ALL TO authenticated 
USING (public.is_iam_super_admin() OR teacher_id = (SELECT auth.uid()));

-- [3.3] QUESTIONS
CREATE POLICY "questions_final_select" ON public.questions FOR SELECT TO authenticated
USING (
    public.is_iam_super_admin() OR                             
    (student_id = (SELECT auth.uid())) OR                                 
    public.is_my_student(student_id) OR                        
    (tenant_id IS NOT NULL AND tenant_id = public.get_my_tenant_id())
);
CREATE POLICY "questions_final_insert" ON public.questions FOR INSERT TO authenticated
WITH CHECK (student_id = (SELECT auth.uid()));
CREATE POLICY "questions_final_modify" ON public.questions FOR ALL TO authenticated
USING ((student_id = (SELECT auth.uid())) OR public.is_iam_super_admin());

-- [3.4] SOLUTIONS -- KRİTİK: 403 hatasını çöz
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "solutions_final_select" ON public.solutions FOR SELECT TO authenticated
USING (
    public.is_iam_super_admin() OR
    (solver_id = (SELECT auth.uid())) OR
    EXISTS (
        SELECT 1 FROM public.questions q 
        WHERE q.id = question_id AND q.student_id = (SELECT auth.uid())
    ) OR
    (tenant_id IS NOT NULL AND tenant_id = public.get_my_tenant_id())
);
CREATE POLICY "solutions_final_insert" ON public.solutions FOR INSERT TO authenticated
WITH CHECK (
    public.is_iam_super_admin() OR 
    public.get_my_role() IN ('teacher', 'admin') OR
    (solver_type = 'ai')
);

-- [3.5] CLASS_STUDENTS
CREATE POLICY "class_students_final" ON public.class_students FOR ALL TO authenticated
USING (
    (student_id = (SELECT auth.uid())) OR                               
    public.is_iam_super_admin() OR                                       
    EXISTS (
        SELECT 1 FROM public.classes c 
        WHERE c.id = class_id AND c.teacher_id = (SELECT auth.uid())
    )
);

-- [3.6] ASSIGNMENTS
CREATE POLICY "assignments_final_select" ON public.assignments FOR SELECT TO authenticated
USING (
    public.is_iam_super_admin() OR
    public.get_my_role() IN ('teacher', 'admin') OR
    EXISTS (
        SELECT 1 FROM public.class_students cs 
        WHERE cs.class_id = class_id AND cs.student_id = (SELECT auth.uid())
    )
);
CREATE POLICY "assignments_final_insert" ON public.assignments FOR INSERT TO authenticated
WITH CHECK (public.get_my_role() IN ('teacher', 'admin') OR public.is_iam_super_admin());

-- [3.7] ASSIGNMENT_SUBMISSIONS
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assignment_submissions_final" ON public.assignment_submissions FOR ALL TO authenticated
USING (
    (student_id = (SELECT auth.uid())) OR
    public.is_iam_super_admin() OR
    public.get_my_role() IN ('teacher', 'admin')
);

-- [3.8] AI_USAGE_LOGS -- 403 HATASININ SEBEBI BU TABLOYDUY!
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_usage_logs_final_insert" ON public.ai_usage_logs FOR INSERT TO authenticated
WITH CHECK (
    user_id = (SELECT auth.uid()) OR user_id IS NULL
);
CREATE POLICY "ai_usage_logs_final_select" ON public.ai_usage_logs FOR SELECT TO authenticated
USING (
    (user_id = (SELECT auth.uid())) OR public.is_iam_super_admin()
);

-- [3.9] AI_KNOWLEDGE_GRAPH
ALTER TABLE public.ai_knowledge_graph ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_knowledge_graph_final" ON public.ai_knowledge_graph FOR SELECT TO authenticated
USING (true);
CREATE POLICY "ai_knowledge_graph_admin" ON public.ai_knowledge_graph FOR ALL TO authenticated
USING (public.is_iam_super_admin() OR public.get_my_role() IN ('teacher', 'admin'));

-- [3.10] AI_APPROVALS -- Multiple Permissive Policies → Tek politika
ALTER TABLE public.ai_approvals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ai_approvals_v15_admin" ON public.ai_approvals;
DROP POLICY IF EXISTS "ai_approvals_v15_teacher" ON public.ai_approvals;
DROP POLICY IF EXISTS "ai_approvals_admin_ultimate" ON public.ai_approvals;
DROP POLICY IF EXISTS "ai_approvals_teacher_access" ON public.ai_approvals;
DROP POLICY IF EXISTS "ai_approvals_teacher_update" ON public.ai_approvals;

CREATE POLICY "ai_approvals_final" ON public.ai_approvals FOR ALL TO authenticated
USING (
    public.is_iam_super_admin() OR
    (
        public.get_my_role() = 'teacher' AND 
        project_source = 'odevgpt' AND 
        tenant_id IS NOT NULL AND
        tenant_id = public.get_my_tenant_id()
    )
);

-- [3.11] BLOGS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blogs_final_select" ON public.blogs FOR SELECT TO authenticated
USING (is_published = true OR public.is_iam_super_admin());
CREATE POLICY "blogs_final_admin" ON public.blogs FOR ALL TO authenticated
USING (public.is_iam_super_admin());

-- [3.12] NOTIFICATIONS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_final" ON public.notifications FOR ALL TO authenticated
USING (user_id = (SELECT auth.uid()) OR public.is_iam_super_admin());

-- [3.13] XP_LOGS
ALTER TABLE public.xp_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "xp_logs_final" ON public.xp_logs FOR ALL TO authenticated
USING (user_id = (SELECT auth.uid()) OR public.is_iam_super_admin());

-- [3.14] CERTIFICATES
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "certificates_final" ON public.certificates FOR ALL TO authenticated
USING (user_id = (SELECT auth.uid()) OR public.is_iam_super_admin());

-- [3.15] STUDENT_PARENT_RELATIONS
ALTER TABLE public.student_parent_relations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "student_parent_relations_final" ON public.student_parent_relations FOR ALL TO authenticated
USING (
    parent_id = (SELECT auth.uid()) OR 
    student_id = (SELECT auth.uid()) OR
    public.is_iam_super_admin()
);

-- [3.16] ANNOUNCEMENTS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "announcements_final_select" ON public.announcements FOR SELECT TO authenticated
USING (
    is_active = TRUE AND (
        is_global = TRUE OR 
        tenant_id = public.get_my_tenant_id()
    )
    OR public.is_iam_super_admin()
    OR public.get_my_role() IN ('teacher', 'admin')
);
CREATE POLICY "announcements_final_insert" ON public.announcements FOR INSERT TO authenticated
WITH CHECK (public.get_my_role() IN ('teacher', 'admin') OR public.is_iam_super_admin());

-- =====================================================
-- 4. DUPLICATE INDEX TEMİZLİĞİ (Advisor: Duplicate Index)
-- =====================================================
DROP INDEX IF EXISTS public.idx_v4_solutions_question;
CREATE INDEX IF NOT EXISTS idx_solutions_question_final ON public.solutions(question_id);
CREATE INDEX IF NOT EXISTS idx_solutions_created_at ON public.solutions(created_at DESC);

-- =====================================================
-- 5. ISTATISTIK GÜNCELLEMESİ
-- =====================================================
ANALYZE public.profiles;
ANALYZE public.questions;
ANALYZE public.solutions;
ANALYZE public.ai_usage_logs;
ANALYZE public.classes;

COMMIT;

-- PostgREST schema cache yenile
NOTIFY pgrst, 'reload schema';
