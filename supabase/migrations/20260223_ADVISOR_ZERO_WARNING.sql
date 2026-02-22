-- =====================================================
-- 🛡️ ODEVGPT ADVISOR ZERO-WARNING FIX
-- Tarih: 23 Şubat 2026
-- Amaç: Performance Advisor'ı sıfır uyarıya indirmek.
--       Multiple Permissive Policies + Duplicate Index düzeltmesi.
-- Kural: Bir tablo için FOR SELECT + FOR ALL BİR ARADA OLMAZ.
--        Ya tek FOR ALL, ya da explicit (INSERT/UPDATE/DELETE) ayrımı yapılır.
-- =====================================================

BEGIN;

-- =====================================================
-- 1. AI_KNOWLEDGE_GRAPH: 2 policy → 1 policy
--    Mevcut: ai_knowledge_graph_final (SELECT) + ai_knowledge_graph_admin (ALL)
-- =====================================================
DROP POLICY IF EXISTS "ai_knowledge_graph_final" ON public.ai_knowledge_graph;
DROP POLICY IF EXISTS "ai_knowledge_graph_admin" ON public.ai_knowledge_graph;
DROP POLICY IF EXISTS "ai_knowledge_graph_unified_v4" ON public.ai_knowledge_graph;

-- Tek birleşik policy: herkes okur, yalnızca teacher/admin yazar
CREATE POLICY "ai_knowledge_graph_access" ON public.ai_knowledge_graph
FOR ALL TO authenticated
USING (true)
WITH CHECK (
    public.is_iam_super_admin() OR 
    public.get_my_role() IN ('teacher', 'admin')
);

-- =====================================================
-- 2. BLOGS: 2 policy → explicit ayrım
--    Mevcut: blogs_final_select (SELECT) + blogs_final_admin (ALL)
-- =====================================================
DROP POLICY IF EXISTS "blogs_final_select" ON public.blogs;
DROP POLICY IF EXISTS "blogs_final_admin" ON public.blogs;
DROP POLICY IF EXISTS "blogs_unified_v4" ON public.blogs;

-- SELECT: herkese yayınlananlar görünür
CREATE POLICY "blogs_select" ON public.blogs FOR SELECT TO authenticated
USING (is_published = true OR public.is_iam_super_admin());

-- INSERT/UPDATE/DELETE: sadece admin
CREATE POLICY "blogs_admin_write" ON public.blogs FOR INSERT TO authenticated
WITH CHECK (public.is_iam_super_admin());
CREATE POLICY "blogs_admin_modify" ON public.blogs FOR UPDATE TO authenticated
USING (public.is_iam_super_admin());
CREATE POLICY "blogs_admin_delete" ON public.blogs FOR DELETE TO authenticated
USING (public.is_iam_super_admin());

-- =====================================================
-- 3. CLASSES: 3 policy → explicit ayrım (FOR ALL SELECT'i kapsıyor)
--    Mevcut: classes_final_select (SELECT) + classes_final_modify (ALL)
-- =====================================================
DROP POLICY IF EXISTS "classes_final_select" ON public.classes;
DROP POLICY IF EXISTS "classes_final_insert" ON public.classes;
DROP POLICY IF EXISTS "classes_final_modify" ON public.classes;
DROP POLICY IF EXISTS "classes_v12_select_all" ON public.classes;
DROP POLICY IF EXISTS "classes_v12_insert_teacher" ON public.classes;
DROP POLICY IF EXISTS "classes_v12_modify_owner" ON public.classes;
DROP POLICY IF EXISTS "classes_v15_select" ON public.classes;
DROP POLICY IF EXISTS "classes_v15_insert" ON public.classes;
DROP POLICY IF EXISTS "classes_v15_all" ON public.classes;

-- SELECT: herkes görebilir (davet kodu için)
CREATE POLICY "classes_select" ON public.classes FOR SELECT TO authenticated
USING (true);

-- INSERT: teacher/admin
CREATE POLICY "classes_insert" ON public.classes FOR INSERT TO authenticated
WITH CHECK (
    public.is_iam_super_admin() OR 
    public.get_my_role() IN ('teacher', 'admin')
);

-- UPDATE/DELETE: sadece sınıfın sahibi öğretmen veya admin
CREATE POLICY "classes_update" ON public.classes FOR UPDATE TO authenticated
USING (public.is_iam_super_admin() OR teacher_id = (SELECT auth.uid()));
CREATE POLICY "classes_delete" ON public.classes FOR DELETE TO authenticated
USING (public.is_iam_super_admin() OR teacher_id = (SELECT auth.uid()));

-- =====================================================
-- 4. QUESTIONS: FOR SELECT + FOR ALL çakışması
--    Mevcut: questions_final_select (SELECT) + questions_final_modify (ALL)
-- =====================================================
DROP POLICY IF EXISTS "questions_final_select" ON public.questions;
DROP POLICY IF EXISTS "questions_final_insert" ON public.questions;
DROP POLICY IF EXISTS "questions_final_modify" ON public.questions;
DROP POLICY IF EXISTS "questions_v12_isolation" ON public.questions;
DROP POLICY IF EXISTS "questions_v12_modify" ON public.questions;
DROP POLICY IF EXISTS "questions_v15_isolation" ON public.questions;
DROP POLICY IF EXISTS "questions_v15_modify" ON public.questions;
DROP POLICY IF EXISTS "questions_unified_v4" ON public.questions;

-- SELECT: tenant izolasyonu + veli erişimi
CREATE POLICY "questions_select" ON public.questions FOR SELECT TO authenticated
USING (
    public.is_iam_super_admin() OR
    (student_id = (SELECT auth.uid())) OR
    public.is_my_student(student_id) OR
    (tenant_id IS NOT NULL AND tenant_id = public.get_my_tenant_id())
);

-- INSERT: sadece öğrenci kendi sorusunu ekler
CREATE POLICY "questions_insert" ON public.questions FOR INSERT TO authenticated
WITH CHECK (student_id = (SELECT auth.uid()));

-- UPDATE/DELETE: kendi sorusunu veya admin
CREATE POLICY "questions_update" ON public.questions FOR UPDATE TO authenticated
USING (student_id = (SELECT auth.uid()) OR public.is_iam_super_admin());
CREATE POLICY "questions_delete" ON public.questions FOR DELETE TO authenticated
USING (student_id = (SELECT auth.uid()) OR public.is_iam_super_admin());

-- =====================================================
-- 5. SOLUTIONS: Duplicate Index temizliği
-- =====================================================
DROP INDEX IF EXISTS public.idx_v4_solutions_question;
DROP INDEX IF EXISTS public.idx_solutions_question_id_final;
DROP INDEX IF EXISTS public.idx_solutions_question_final;
-- Tek doğru index:
CREATE UNIQUE INDEX IF NOT EXISTS idx_solutions_question_id 
ON public.solutions(question_id, id);
-- Performans için created_at index
CREATE INDEX IF NOT EXISTS idx_solutions_created_at 
ON public.solutions(created_at DESC);

-- =====================================================
-- 6. PROFILES: Eğer çakışan policy varsa temizle
-- =====================================================
DROP POLICY IF EXISTS "profiles_unified_v4" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
-- profiles_final_select zaten FUNCTION_RESTORE ile kuruldu, dokunmuyoruz.

COMMIT;

NOTIFY pgrst, 'reload schema';
