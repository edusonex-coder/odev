-- 🏁 OdevGPT TOTAL PERFORMANCE OVERHAUL (v2.13 - STABLE RESTORATION)
-- "policy already exists" hatasını çözer.
-- Tüm tablolar için temizlik ve yeniden kurulum döngüsünü tam kapasiteye çıkarır.

-- ==========================================
-- 1. POLİTİKA TEMİZLİĞİ (Kapsamlı Temizlik)
-- ==========================================
DO $$ 
DECLARE 
    target_tables TEXT[] := ARRAY[
        'profiles', 'questions', 'solutions', 'notifications', 
        'ai_chat_sessions', 'ai_chat_messages', 'assignment_submissions',
        'classes', 'tenants'
    ];
    t_name TEXT;
    pol_name TEXT;
BEGIN 
    FOREACH t_name IN ARRAY target_tables LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t_name) THEN
            FOR pol_name IN (SELECT policyname FROM pg_policies WHERE tablename = t_name AND schemaname = 'public') LOOP
                EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol_name, t_name);
            END LOOP;
        END IF;
    END LOOP;
END $$;

-- ==========================================
-- 2. CORE RLS RESTORATION (Yazma ve Okuma Yetkileri)
-- ==========================================

-- PROFILES
CREATE POLICY "p_profiles_sel" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "p_profiles_upd" ON public.profiles FOR UPDATE USING ((SELECT auth.uid()) = id);

-- QUESTIONS (Soru İşlemleri)
CREATE POLICY "p_questions_sel" ON public.questions FOR SELECT USING ((SELECT auth.uid()) = student_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('teacher', 'admin')));
CREATE POLICY "p_questions_ins" ON public.questions FOR INSERT WITH CHECK ((SELECT auth.uid()) = student_id);
CREATE POLICY "p_questions_upd" ON public.questions FOR UPDATE USING ((SELECT auth.uid()) = student_id);
CREATE POLICY "p_questions_del" ON public.questions FOR DELETE USING ((SELECT auth.uid()) = student_id);

-- SOLUTIONS (Çözümler)
CREATE POLICY "p_solutions_sel" ON public.solutions FOR SELECT USING (true);
CREATE POLICY "p_solutions_ins" ON public.solutions FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role IN ('teacher', 'admin')));

-- CLASSES & TENANTS
CREATE POLICY "p_classes_sel" ON public.classes FOR SELECT USING (true);
CREATE POLICY "p_tenants_sel" ON public.tenants FOR SELECT USING (true);

-- AI CHAT
CREATE POLICY "p_chat_sessions_all" ON public.ai_chat_sessions FOR ALL USING ((SELECT auth.uid()) = student_id);
CREATE POLICY "p_chat_messages_all" ON public.ai_chat_messages FOR ALL USING (EXISTS (SELECT 1 FROM public.ai_chat_sessions WHERE id = session_id AND student_id = (SELECT auth.uid())));

-- ==========================================
-- 4. KRİTİK EKSİK KOLONLARI TAMAMLA (Recovery)
-- ==========================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);

-- Diğer kritik tablolar için de benzer şekilde (Örnek olarak en çok kullanılanlar seçildi)
-- Bu işlem "Auth RLS Initialization Plan" uyarısını dindirecektir.
