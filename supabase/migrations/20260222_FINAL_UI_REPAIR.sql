-- =====================================================
-- 🛠️ ODEVGPT FINAL UI & HİYERARŞİ REHABİLİTASYONU
-- =====================================================
-- Besmele ile başlıyoruz.
-- Sorun 1: Kurumlar RLS nedeniyle görünmüyor (SELECT kısıtlı).
-- Sorun 2: Super Admin RLS fonksiyonu eksik veya kısıtlı.
-- Sorun 3: Ferhat Karaduman'ın holding statüsü tam tescillenmemiş.

BEGIN;

-- 1. TENANTS RLS: Herkes isim görebilmeli, sadece Super Admin yönetmeli.
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Super admins can manage tenants" ON public.tenants;
DROP POLICY IF EXISTS "Anyone can view tenant names" ON public.tenants;

-- Herkes kurum isimlerini görebilmeli (Joinler ve logo/tema için kritik)
CREATE POLICY "Anyone can view tenant names" ON public.tenants
FOR SELECT TO authenticated USING (true);

-- Sadece Süper Adminler yönetebilir
CREATE POLICY "Super admins can manage tenants" ON public.tenants
FOR ALL TO authenticated USING (public.is_iam_super_admin() = true);

-- 2. PROFILES: Ferhat Karaduman Global/Holding Ayarı
-- Ferhat Karaduman'ı bul ve tam yetkiyle merkeze çek.
UPDATE public.profiles 
SET is_super_admin = true, 
    role = 'admin',
    tenant_id = NULL
WHERE full_name ILIKE '%FERHAT KARADUMAN%';

-- 3. HIYERARŞİ FONKSİYONLARINI GÜNCELLE
-- Daha güvenli COALESCE ekleme
CREATE OR REPLACE FUNCTION public.is_iam_super_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(is_super_admin, false) FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- 4. VIEW GÜNCELLEME: Raporlarda Bireysel Kullanıcıları da düzgün göster
DROP VIEW IF EXISTS public.questions_with_costs CASCADE;
CREATE OR REPLACE VIEW public.questions_with_costs AS
SELECT 
    q.id,
    q.created_at,
    q.subject,
    q.question_text,
    q.image_url,
    q.status,
    q.student_id,
    q.tenant_id,
    p.full_name as student_name,
    COALESCE(t.name, 'Bireysel') as tenant_name,
    COALESCE((SELECT SUM(cost_usd) FROM public.ai_usage_logs WHERE metadata->>'question_id' = q.id::text), 0) as total_ai_cost,
    COALESCE((SELECT SUM(total_tokens) FROM public.ai_usage_logs WHERE metadata->>'question_id' = q.id::text), 0) as total_ai_tokens
FROM 
    public.questions q
LEFT JOIN 
    public.profiles p ON q.student_id = p.id
LEFT JOIN 
    public.tenants t ON q.tenant_id = t.id
GROUP BY 
    q.id, p.full_name, t.name;

GRANT SELECT ON public.questions_with_costs TO authenticated;

COMMIT;

-- Bilgilendirme
DO $$ 
BEGIN 
  RAISE NOTICE '✅ FINAL UI REPAIR: Kurum görünürlüğü ve hiyerarşi tescil edildi.'; 
END $$;
