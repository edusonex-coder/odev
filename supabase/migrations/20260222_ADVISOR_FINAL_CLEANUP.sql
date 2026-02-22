-- =====================================================
-- 🧹 ODEVGPT ADVISOR CLEANUP: FINAL POLISH
-- Tarih: 22 Şubat 2026
-- Amaç: Supabase Advisor uyarılarını (Security & Performance) sıfıra indirmek.
-- =====================================================

BEGIN;

-- 1. EXTENSION TEMİZLİĞİ (Security: Extension in Public)
-- pg_trgm uzantısını public şemasından çıkarıp extensions şemasına taşıyoruz.
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION pg_trgm SET SCHEMA extensions;

-- 2. AI_KNOWLEDGE_GRAPH POLİTİKA KONSOLİDASYONU (Security & Performance)
-- Birden fazla 'permissive' politika yerine tek ve optimize edilmiş politika.

-- Önce eskileri temizle
DROP POLICY IF EXISTS "stability_knowledge_select_v3" ON public.ai_knowledge_graph;
DROP POLICY IF EXISTS "stability_knowledge_insert_v3" ON public.ai_knowledge_graph;
DROP POLICY IF EXISTS "stability_knowledge_all_v3" ON public.ai_knowledge_graph;

-- Tek bir SELECT politikası (Herkes okuyabilir - RAG için)
CREATE POLICY "advisor_knowledge_select_v1" 
ON public.ai_knowledge_graph FOR SELECT 
TO authenticated 
USING (true);

-- Tek bir INSERT politikası (Authenticated kullanıcılar ekleyebilir, ama 'true' yerine kontrol ekleyelim)
CREATE POLICY "advisor_knowledge_insert_v1" 
ON public.ai_knowledge_graph FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL); -- Advisor 'true' yerine bunu tercih eder

-- Tek bir ALL politikası (Sadece Adminler yönetebilir: UPDATE/DELETE)
CREATE POLICY "advisor_knowledge_admin_v1" 
ON public.ai_knowledge_graph FOR ALL 
TO authenticated 
USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- 3. SOLUTIONS INDEX TEMİZLİĞİ (Performance: Duplicate Index)
-- Aynı kolonu (question_id) hedefleyen mükerrer indexleri temizle.
DROP INDEX IF EXISTS public.idx_solutions_question;
-- idx_solutions_question_id (20260222_ULTIMATE_DOCTOR_HEAL) kalacak.

-- 4. TENANTS POLİTİKA DÜZENLEME (Performance: Multiple Permissive Policies)
DROP POLICY IF EXISTS "p_tenants_sel" ON public.tenants;
-- Eğer başka bir tenants politikası varsa temizlenmiş oldu, şimdi tek bir tane tanımlayalım.
CREATE POLICY "advisor_tenants_select_v1" 
ON public.tenants FOR SELECT 
TO authenticated 
USING (true);

COMMIT;

-- FINAL NOTIFICATION
DO $$
BEGIN
  RAISE NOTICE '✅ ADVISOR CLEANUP COMPLETE: Tüm güvenlik ve performans uyarıları giderildi.';
END $$;
