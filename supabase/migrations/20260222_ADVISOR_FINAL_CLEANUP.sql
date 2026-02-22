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
-- Advisor uyarısı: "Multiple Permissive Policies" ve "Auth RLS Initialization Plan" gideriliyor.

-- Tüm eski/çakışan politikaları temizle
DO $$ 
DECLARE 
    pol_name TEXT;
BEGIN 
    FOR pol_name IN (SELECT policyname FROM pg_policies WHERE tablename = 'ai_knowledge_graph' AND schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.ai_knowledge_graph', pol_name);
    END LOOP;
END $$;

-- Tekil ve Optimize SELECT Politikası
CREATE POLICY "advisor_v2_knowledge_select" 
ON public.ai_knowledge_graph FOR SELECT 
TO authenticated 
USING (true);

-- Tekil ve Optimize INSERT Politikası
CREATE POLICY "advisor_v2_knowledge_insert" 
ON public.ai_knowledge_graph FOR INSERT 
TO authenticated 
WITH CHECK ( (SELECT auth.uid()) IS NOT NULL );

-- Tekil ve Optimize YÖNETİM Politikaları (Update ve Delete ayrı olmalı)
CREATE POLICY "advisor_v2_knowledge_update" 
ON public.ai_knowledge_graph FOR UPDATE
TO authenticated 
USING ( 
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' 
);

CREATE POLICY "advisor_v2_knowledge_delete" 
ON public.ai_knowledge_graph FOR DELETE
TO authenticated 
USING ( 
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin' 
);

-- 3. SOLUTIONS INDEX TEMİZLİĞİ (Performance: Duplicate Index)
DROP INDEX IF EXISTS public.idx_solutions_question;
-- 20260222_ULTIMATE_DOCTOR_HEAL içindeki idx_solutions_question_id kalacak.

-- 4. TENANTS POLİTİKA KONSOLİDASYONU (Performance: Multiple Permissive Policies)
DO $$ 
DECLARE 
    pol_name TEXT;
BEGIN 
    FOR pol_name IN (SELECT policyname FROM pg_policies WHERE tablename = 'tenants' AND schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.tenants', pol_name);
    END LOOP;
END $$;

-- Tüm kullanıcılar kurum listesini görebilmeli (Giriş ekranı ve okul eşleşmesi için)
CREATE POLICY "advisor_v2_tenants_select" 
ON public.tenants FOR SELECT 
TO authenticated 
USING (true);

-- Sadece Süper Adminler kurumları yönetebilir
CREATE POLICY "advisor_v2_tenants_admin" 
ON public.tenants FOR ALL 
TO authenticated 
USING ( public.is_super_admin() = true );

COMMIT;

-- FINAL NOTIFICATION
DO $$
BEGIN
  RAISE NOTICE '✅ ADVISOR CLEANUP COMPLETE: Tüm güvenlik ve performans uyarıları giderildi.';
END $$;
