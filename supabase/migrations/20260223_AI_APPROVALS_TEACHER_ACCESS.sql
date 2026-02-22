-- =====================================================
-- 🛡️ AI_OS ENHANCEMENT: TEACHER ACCESS & MULTI-TENANCY
-- Tarih: 23 Şubat 2026
-- Amaç: Öğretmenlerin AI ödev onaylarını görebilmesi için yetki ve kolon ekleme.
-- =====================================================

-- 1. Tenant ID kolonu ekle (Strict Isolation için)
ALTER TABLE public.ai_approvals ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);

-- 2. Mevcut politikaları temizle
DROP POLICY IF EXISTS "ai_approvals_admin_ultimate" ON public.ai_approvals;
DROP POLICY IF EXISTS "ai_approvals_teacher_access" ON public.ai_approvals;

-- 3. Super Admin Politikası (Tüm her şeyi görür)
CREATE POLICY "ai_approvals_admin_ultimate" ON public.ai_approvals 
FOR ALL TO authenticated 
USING ( public.is_iam_super_admin() );

-- 4. Öğretmen Politikası (Sadece kendi okulu ve odevgpt projesi)
CREATE POLICY "ai_approvals_teacher_access" ON public.ai_approvals
FOR SELECT TO authenticated
USING (
    (public.get_my_role() = 'teacher' AND project_source = 'odevgpt' AND tenant_id = public.get_my_tenant_id())
);

-- 5. Öğretmen Onay Yetkisi (Status güncelleme)
CREATE POLICY "ai_approvals_teacher_update" ON public.ai_approvals
FOR UPDATE TO authenticated
USING (
    (public.get_my_role() = 'teacher' AND project_source = 'odevgpt' AND tenant_id = public.get_my_tenant_id())
)
WITH CHECK (
    (public.get_my_role() = 'teacher' AND project_source = 'odevgpt' AND tenant_id = public.get_my_tenant_id())
);

-- Indexle
CREATE INDEX IF NOT EXISTS idx_ai_approvals_tenant ON public.ai_approvals(tenant_id);

-- PostgREST yenile
NOTIFY pgrst, 'reload schema';
