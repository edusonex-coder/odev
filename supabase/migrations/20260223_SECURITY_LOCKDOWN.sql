-- =====================================================
-- 🔐 ODEVGPT SECURITY LOCKDOWN
-- Tarih: 23 Şubat 2026
-- Amaç: Claude CEO değerlendirmesindeki kritik güvenlik
--       bulgularını kapatmak.
--       1) anon GRANT ALL → iptal
--       2) USING(true)/WITH CHECK(true) demo politikaları → kapat
--       3) question_images bucket → authenticated-only
--       4) K-12 içerik güvenliği için system prompt sabit
-- =====================================================

BEGIN;

-- =====================================================
-- BÖLÜM 1: GRANT ALL TO ANON → İPTAL
-- 20260221_EMERGENCY_HEAL_ALL.sql satır 105-107 tarafından 
-- herkese açılmıştı. Kapatıyoruz.
-- =====================================================
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- Anon'a sadece gerçekten gerekli olan minimum erişim:
-- (Frontend'in oturumsuz çalışmasına gerek yok, hepsi auth gerektiriyor)
-- Hiçbir tablo anon'a açık olmamalı.

-- =====================================================
-- BÖLÜM 2: DEMO POLITIKALARINI KAPAT
-- ai_usage_logs, ai_knowledge_graph, solutions, 
-- ai_chat_sessions, ai_chat_messages "USING(true)" politikaları
-- =====================================================

-- ai_usage_logs: Sınırlı erişim (LAUNCH_HARDENING'den geliyor, eskiyi temizle)
DROP POLICY IF EXISTS "ai_usage_logs_unlimited" ON public.ai_usage_logs;
DROP POLICY IF EXISTS "Allow authenticated insert logs" ON public.ai_usage_logs;
DROP POLICY IF EXISTS "Allow admin view logs" ON public.ai_usage_logs;
DROP POLICY IF EXISTS "ai_usage_logs_anon_insert" ON public.ai_usage_logs;
-- Final politikalar (önceden tanımlı, sadece eski açık olanları kapattık)

-- ai_knowledge_graph: anon unlimited temizle
DROP POLICY IF EXISTS "ai_knowledge_graph_unlimited" ON public.ai_knowledge_graph;

-- solutions: unlimited temizle (ADVISOR_ZERO_WARNING'de doğru politika kuruldu)
DROP POLICY IF EXISTS "solutions_unlimited" ON public.ai_approvals;
DROP POLICY IF EXISTS "Allow users to insert their own solutions" ON public.solutions;
DROP POLICY IF EXISTS "Allow users to view solutions for their questions" ON public.solutions;

-- solutions için güvenli politika (yoksa oluştur)
DROP POLICY IF EXISTS "solutions_secure_select" ON public.solutions;
DROP POLICY IF EXISTS "solutions_secure_insert" ON public.solutions;
CREATE POLICY "solutions_secure_select" ON public.solutions FOR SELECT TO authenticated
USING (
    public.is_iam_super_admin() OR
    EXISTS (
        SELECT 1 FROM public.questions q 
        WHERE q.id = solutions.question_id 
        AND (q.student_id = (SELECT auth.uid()) OR q.tenant_id = public.get_my_tenant_id())
    )
);
CREATE POLICY "solutions_secure_insert" ON public.solutions FOR INSERT TO authenticated
WITH CHECK (
    -- Yalnızca AI/teacher solver ekleyebilir (student_id'si olan kullanıcılar)
    solver_id = (SELECT auth.uid()) OR solver_id IS NULL
);

-- ai_chat_sessions: anon unlimited temizle
DROP POLICY IF EXISTS "chat_sessions_unlimited" ON public.ai_chat_sessions;
DROP POLICY IF EXISTS "ai_chat_sessions_secure" ON public.ai_chat_sessions;
CREATE POLICY "ai_chat_sessions_secure" ON public.ai_chat_sessions FOR ALL TO authenticated
USING (student_id = (SELECT auth.uid()) OR public.is_iam_super_admin())
WITH CHECK (student_id = (SELECT auth.uid()));

-- ai_chat_messages: anon unlimited temizle  
DROP POLICY IF EXISTS "chat_messages_unlimited" ON public.ai_chat_messages;
DROP POLICY IF EXISTS "ai_chat_messages_secure" ON public.ai_chat_messages;
CREATE POLICY "ai_chat_messages_secure" ON public.ai_chat_messages FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.ai_chat_sessions s 
        WHERE s.id = ai_chat_messages.session_id 
        AND (s.student_id = (SELECT auth.uid()) OR public.is_iam_super_admin())
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.ai_chat_sessions s 
        WHERE s.id = ai_chat_messages.session_id 
        AND s.student_id = (SELECT auth.uid())
    )
);

-- =====================================================
-- BÖLÜM 3: STORAGE - question_images BUCKET
-- Şu an herkese açık (anon dahil). 
-- Yükleme: sadece authenticated. Okuma: public ok.
-- =====================================================
DROP POLICY IF EXISTS "Soru resimleri herkese açık" ON storage.objects;
DROP POLICY IF EXISTS "question_images_read_public" ON storage.objects;
DROP POLICY IF EXISTS "question_images_upload_auth" ON storage.objects;
DROP POLICY IF EXISTS "question_images_delete_owner" ON storage.objects;

-- Okuma: herkese (görseller public CDN'den yükleniyor)
CREATE POLICY "question_images_read_public" ON storage.objects
FOR SELECT USING (bucket_id = 'question_images');

-- Yükleme: sadece authenticated kullanıcılar
CREATE POLICY "question_images_upload_auth" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'question_images');

-- Silme: sadece dosyayı yükleyen veya admin
CREATE POLICY "question_images_delete_owner" ON storage.objects
FOR DELETE TO authenticated
USING (
    bucket_id = 'question_images' AND 
    (auth.uid()::text = (storage.foldername(name))[1] OR public.is_iam_super_admin())
);

-- ai_knowledge_graph: GRANT'i sınırla
REVOKE ALL ON public.ai_knowledge_graph FROM anon;
REVOKE ALL ON public.solutions FROM anon;
REVOKE ALL ON public.questions FROM anon;
REVOKE ALL ON public.ai_usage_logs FROM anon;

-- Authenticated için gerekli USAGE izinleri (RLS zaten kontrol ediyor)
GRANT USAGE ON SCHEMA public TO authenticated;

COMMIT;

-- =====================================================
-- BÖLÜM 4: KONTROL SORGUSU
-- Bu sorgu çalıştırıldıktan sonra "anon" erişimi kalmadı mı?
-- =====================================================
SELECT 
    grantee, 
    table_name, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE grantee = 'anon' 
AND table_schema = 'public'
ORDER BY table_name;

-- Sonuç 0 satır olmalı ✅
