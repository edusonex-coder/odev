-- =====================================================
-- 🚀 ODEVGPT ULTIMATE HIYERARŞİ & GÜVENLİK YAPILANDIRMASI
-- =====================================================
-- Besmele ile başlıyoruz. 
-- Amaç: Holding (S0), Okul (S1), Öğretmen/Öğrenci/Veli (S2-4) seviyelerini kesinleştirmek.

BEGIN;

-- 1. YARDIMCI FONKSİYONLAR (Döngü Kırıcı & Performans Odaklı)
CREATE OR REPLACE FUNCTION public.get_my_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_iam_super_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(is_super_admin, false) FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- 2. VERİ TEMİZLİĞİ: Bağlamsız Adminleri (Rabia Vakası) Tespit ve Koruma
-- Eğer bir admin süper admin değilse VE tenant_id'si yoksa, bu bir hatadır.
-- Şimdilik bu kullanıcıları silmiyoruz, ama RLS ile yetkilerini kısıtlıyoruz.
-- Not: Manuel olarak bu kullanıcıların tenant_id'si atanmalıdır.

-- 3. PROFILES RLS (Hiyerarşinin Kalbi)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_rls_policy" ON public.profiles;

CREATE POLICY "profiles_rls_hierarchy_policy" ON public.profiles
FOR ALL TO authenticated
USING (
    (public.is_iam_super_admin() = true) OR                             -- S0: Holding her şeyi görür
    (public.get_my_role() = 'admin' AND tenant_id = public.get_my_tenant_id()) OR -- S1: Okul Admini sadece kendi okulunu görür
    (id = auth.uid()) OR                                                -- S2-4: Kullanıcı kendisini görür
    (tenant_id = public.get_my_tenant_id() AND tenant_id IS NOT NULL)    -- Aynı okulun üyeleri birbirini görebilir (Sınıf arkadaşları vb.)
);

-- 4. QUESTIONS RLS (Veri Sızıntısı Önleme)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "questions_rls_policy" ON public.questions;

CREATE POLICY "questions_rls_hierarchy_policy" ON public.questions
FOR ALL TO authenticated
USING (
    (public.is_iam_super_admin() = true) OR                             -- S0: Holding her şeyi görür
    (public.get_my_role() = 'admin' AND tenant_id = public.get_my_tenant_id()) OR -- S1: Okul Admini okul sorularını görür
    (student_id = auth.uid()) OR                                        -- Bireysel: Kendi sorusu
    (tenant_id = public.get_my_tenant_id() AND tenant_id IS NOT NULL)    -- S2-4: Okul içi paylaşım
)
WITH CHECK (
    (public.is_iam_super_admin() = true) OR 
    (tenant_id = public.get_my_tenant_id()) OR                          -- Sadece kendi okuluna soru ekleyebilir
    (tenant_id IS NULL)                                                 -- Veya bağımsız soru ekleyebilir
);

-- 5. SOLUTIONS RLS
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "solutions_rls_policy" ON public.solutions;

CREATE POLICY "solutions_rls_hierarchy_policy" ON public.solutions
FOR ALL TO authenticated
USING (
    (public.is_iam_super_admin() = true) OR 
    (public.get_my_role() = 'admin' AND tenant_id = public.get_my_tenant_id()) OR
    (tenant_id = public.get_my_tenant_id() AND tenant_id IS NOT NULL) OR
    (EXISTS (SELECT 1 FROM public.questions q WHERE q.id = question_id AND q.student_id = auth.uid())) -- Kendi sorusunun çözümü
);

-- 6. AI_USAGE_LOGS RLS (Maliyet Takibi)
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ai_usage_logs_rls_policy" ON public.ai_usage_logs;

CREATE POLICY "ai_usage_logs_rls_hierarchy_policy" ON public.ai_usage_logs
FOR ALL TO authenticated
USING (
    (public.is_iam_super_admin() = true) OR 
    (public.get_my_role() = 'admin' AND tenant_id = public.get_my_tenant_id()) OR
    (user_id = auth.uid()) -- Kendi kullanım logları
);

-- 7. OKUL YÖNETİCİSİ (S1) İÇİN ÖZEL YETKİLER
-- Okul yöneticisi kendi okuluna öğretmen/öğrenci atayabilir mi? Evet.
-- Bu yetkiyi frontend tarafında kısıtlayacağız, RLS zaten tenant_id koruması sağlıyor.

-- 8. ANALYTIKS GÖRÜNÜMLERİNİN GÜNCELLENMESİ (Bireysel Kullanıcıları da kapsayacak şekilde)
-- Bireysel kullanıcılar tenant_id = NULL olduğu için raporlarda 'Bireysel/Global' olarak görünmeli.

DROP VIEW IF EXISTS public.tenant_cost_ledger CASCADE;
CREATE OR REPLACE VIEW public.tenant_cost_ledger AS
SELECT 
    COALESCE(t.id, '00000000-0000-0000-0000-000000000000'::uuid) as tenant_id,
    COALESCE(t.name, 'Bireysel Kullanıcılar') as tenant_name,
    COUNT(l.id) as total_ai_requests,
    SUM(l.total_tokens) as total_tokens,
    SUM(l.cost_usd) as total_cost_usd
FROM 
    public.ai_usage_logs l
LEFT JOIN 
    public.tenants t ON l.tenant_id = t.id
GROUP BY 
    t.id, t.name;

GRANT SELECT ON public.tenant_cost_ledger TO authenticated;

COMMIT;

-- Bilgilendirme
DO $$ 
BEGIN 
  RAISE NOTICE '✅ ULTIMATE HIYERARŞİ FIX: Besmele ile tamamlandı. S0-S4 hiyerarşisi RLS seviyesinde betonlaştırıldı.'; 
END $$;
