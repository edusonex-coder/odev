-- ============================================
-- ODEVGPT: SECURITY HARDENING v5 (FINAL POLISH)
-- Tarih: 18 Şubat 2026
-- Amaç: notifications tablosundaki inatçı RLS uyarılarını temizlemek.
-- ============================================

-- 1. NOTIFICATIONS TABLOSU İÇİN AGRESİF TEMİZLİK
-- ============================================
-- Önce tablodaki TÜM mevcut politikaları dinamik olarak siliyoruz
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN (SELECT policyname FROM pg_policies WHERE tablename = 'notifications' AND schemaname = 'public')
    LOOP
        EXECUTE format('DROP POLICY %I ON public.notifications', pol.policyname);
    END LOOP;
END $$;

-- Şimdi her işlem (operation) için çok spesifik ve kısıtlayıcı politikalar yazıyoruz
-- SELECT: Sadece kendi bildirimlerini görebilir
CREATE POLICY "notif_select" ON public.notifications 
FOR SELECT USING (auth.uid() = user_id);

-- INSERT: Sadece giriş yapmış kullanıcılar (veya sistem) bildirim oluşturabilir 
-- Ama kendi adına oluşturmalı (veya admin olmalı)
CREATE POLICY "notif_insert" ON public.notifications 
FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- UPDATE: Sadece kendi bildirimini (okundu işaretlemek vb.) güncelleyebilir
CREATE POLICY "notif_update" ON public.notifications 
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- DELETE: Sadece kendi bildirimini silebilir
CREATE POLICY "notif_delete" ON public.notifications 
FOR DELETE USING (auth.uid() = user_id);

-- 2. DİĞER KRİTİK AYARLAR (TEKRAR KONTROL)
-- ============================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER VIEW IF EXISTS public.student_performance_metrics SET (security_invoker = true);

-- 3. SEARCH PATH GÜVENLİĞİ (TÜM FONKSİYONLAR İÇİN TEKRAR)
-- ============================================
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT 
            p.proname as func_name,
            pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.oid NOT IN (SELECT objid FROM pg_depend WHERE deptype = 'e')
    LOOP
        BEGIN
            EXECUTE format('ALTER FUNCTION public.%I(%s) SET search_path = public', 
                           func_record.func_name, func_record.args);
        EXCEPTION WHEN OTHERS THEN CONTINUE;
        END;
    END LOOP;
END $$;

-- ============================================
-- GÜVENLİK SIKILAŞTIRMA v5 TAMAMLANDI
-- NOT: "Leaked Password Protection" uyarısı Supabase Dashboard -> 
--      Auth -> Settings altından manuel düzeltilmelidir. (Ücretli plan gerekebilir)
-- ============================================
-- ============================================
