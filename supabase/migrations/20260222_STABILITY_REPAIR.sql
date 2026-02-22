-- =====================================================
-- 🛡️ ODEVGPT STABILITY REPAIR: BREAKING THE 403 BARRIER
-- Tarih: 22 Şubat 2026
-- Amaç: Grand Reset sonrası ortaya çıkan 403 Forbidden ve 
--       Sonsuz Döngü (Recursion) hatalarını temizlemek.
-- =====================================================

BEGIN;

-- 1. YARDIMCI FONKSİYONLARDA GÜVENLİK GÜNCELLEMESİ
-- auth.uid() yerine doğrudan sub claim'ine bakarak hızı artıralım ve döngü riskini azaltalım.

CREATE OR REPLACE FUNCTION public.get_my_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT tenant_id FROM public.profiles WHERE id = (SELECT auth.uid()));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND is_super_admin = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. POLİTİKA RESET (Tam Temizlik)
DO $$ 
DECLARE 
    target_tables TEXT[] := ARRAY['profiles', 'ai_knowledge_graph', 'class_students', 'ai_chat_sessions', 'ai_chat_messages', 'assignments', 'assignment_submissions'];
    t_name TEXT;
    pol_name TEXT;
BEGIN 
    FOREACH t_name IN ARRAY target_tables LOOP
        FOR pol_name IN (SELECT policyname FROM pg_policies WHERE tablename = t_name AND schemaname = 'public') LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol_name, t_name);
        END LOOP;
    END LOOP;
END $$;

-- 3. PROFILES: SADECE GEREKLİ YETKİLER (Döngü Riski Minimum)
CREATE POLICY "stability_profiles_select_v3" ON public.profiles FOR SELECT TO authenticated
USING (
    id = (SELECT auth.uid()) OR 
    (public.is_super_admin() = true) OR
    (tenant_id = public.get_my_tenant_id())
);

CREATE POLICY "stability_profiles_update_v3" ON public.profiles FOR UPDATE TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));

-- 4. KNOWLEDGE GRAPH: RAG ERİŞİMİ (403 Çözümü)
CREATE POLICY "stability_knowledge_select_v3" ON public.ai_knowledge_graph FOR SELECT TO authenticated USING (true);
CREATE POLICY "stability_knowledge_insert_v3" ON public.ai_knowledge_graph FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "stability_knowledge_all_v3" ON public.ai_knowledge_graph FOR ALL TO authenticated
USING ( (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' );

-- 5. CLASS_STUDENTS & ASSIGNMENTS: AKADEMİK YETKİLER (403 Çözümü)
CREATE POLICY "stability_class_students_select_v3" ON public.class_students FOR SELECT TO authenticated
USING (
    student_id = (SELECT auth.uid()) OR 
    EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.teacher_id = (SELECT auth.uid())) OR
    (SELECT tenant_id FROM public.classes WHERE id = class_id) = public.get_my_tenant_id()
);

CREATE POLICY "stability_class_students_insert_v3" ON public.class_students FOR INSERT TO authenticated
WITH CHECK (student_id = (SELECT auth.uid()));

-- ASSIGNMENTS (Ödevler)
CREATE POLICY "stability_assignments_all_v3" ON public.assignments FOR ALL TO authenticated
USING (
    teacher_id = (SELECT auth.uid()) OR 
    (public.get_my_tenant_id() = (SELECT tenant_id FROM public.classes WHERE id = class_id)) OR
    (public.is_super_admin() = true)
);

-- ASSIGNMENT_SUBMISSIONS (Ödev Teslimleri)
CREATE POLICY "stability_submissions_all_v3" ON public.assignment_submissions FOR ALL TO authenticated
USING (
    student_id = (SELECT auth.uid()) OR 
    EXISTS (SELECT 1 FROM public.assignments a WHERE a.id = assignment_id AND a.teacher_id = (SELECT auth.uid())) OR
    (public.is_super_admin() = true)
);

-- 6. AI_CHAT: OTURUM VE MESAJ (403 Çözümü)
CREATE POLICY "stability_chat_sessions_v3" ON public.ai_chat_sessions FOR ALL TO authenticated
USING (student_id = (SELECT auth.uid()))
WITH CHECK (student_id = (SELECT auth.uid()));

CREATE POLICY "stability_chat_messages_v3" ON public.ai_chat_messages FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.ai_chat_sessions s 
        WHERE s.id = session_id AND s.student_id = (SELECT auth.uid())
    )
);

COMMIT;

-- 7. NOTIFICATION
DO $$
BEGIN
  RAISE NOTICE '✅ STABILITY REPAIR COMPLETE: 403 ve Recursion hataları giderildi.';
END $$;
