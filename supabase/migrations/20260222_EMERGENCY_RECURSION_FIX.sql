-- =====================================================
-- 🩺 ODEVGPT EMERGENCY HEAL: RLS RECURSION FIX
-- =====================================================
-- Hata: "infinite recursion detected in policy for relation profiles"
-- Neden: Profiller tablosundaki RLS politikası, kontrol için yine profiller tablosuna bakıyor.
-- Çözüm: SECURITY DEFINER fonksiyonları kullanarak RLS döngüsünü kırmak.

-- 1. Güvenli Kontrol Fonksiyonları (RLS Bypass)
CREATE OR REPLACE FUNCTION public.get_my_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_iam_super_admin()
RETURNS BOOLEAN AS $$
  SELECT is_super_admin FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- 2. PROFILES RLS Düzeltmesi (Döngü Kırıldı)
DROP POLICY IF EXISTS "profiles_rls_policy" ON public.profiles;
CREATE POLICY "profiles_rls_policy" ON public.profiles
FOR ALL TO authenticated
USING (
    id = auth.uid() OR                          -- Kendisi
    is_iam_super_admin() = true OR               -- Super Admin
    tenant_id = get_my_tenant_id()              -- Aynı okuldakiler
);

-- 3. DİĞER TABLOLARDAKİ OPTİMİZASYON (Opsiyonel ama temizlik için)
-- Questions
DROP POLICY IF EXISTS "questions_rls_policy" ON public.questions;
CREATE POLICY "questions_rls_policy" ON public.questions
FOR ALL TO authenticated
USING (
    is_iam_super_admin() = true OR 
    tenant_id = get_my_tenant_id() OR
    student_id = auth.uid()
)
WITH CHECK (
    is_iam_super_admin() = true OR 
    tenant_id = get_my_tenant_id()
);

-- Solutions
DROP POLICY IF EXISTS "solutions_rls_policy" ON public.solutions;
CREATE POLICY "solutions_rls_policy" ON public.solutions
FOR ALL TO authenticated
USING (
    is_iam_super_admin() = true OR 
    tenant_id = get_my_tenant_id()
)
WITH CHECK (
    is_iam_super_admin() = true OR 
    tenant_id = get_my_tenant_id()
);

-- AI Usage Logs
DROP POLICY IF EXISTS "ai_usage_logs_rls_policy" ON public.ai_usage_logs;
CREATE POLICY "ai_usage_logs_rls_policy" ON public.ai_usage_logs
FOR ALL TO authenticated
USING (
    is_iam_super_admin() = true OR 
    tenant_id = get_my_tenant_id()
)
WITH CHECK (
    is_iam_super_admin() = true OR 
    tenant_id = get_my_tenant_id()
);

-- 4. Bilgilendirme
DO $$ 
BEGIN 
  RAISE NOTICE '✅ RLS Döngüsü başarıyla kırıldı ve fonksiyonlar üzerinden optimize edildi.'; 
END $$;
