-- 20260217_allow_super_admin_manage_tenants.sql
-- Description: Allows Super Admins to manage institutional configurations directly from the UI.

-- Mevcut politikaları kontrol et ve yetkiyi genişlet
CREATE POLICY "Super admins can manage tenants" 
ON public.tenants
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND is_super_admin = TRUE
  )
);

COMMENT ON TABLE public.tenants IS 'Kurumsal yapılandırmalar. Sadece Süper Adminler tarafından yönetilebilir.';
