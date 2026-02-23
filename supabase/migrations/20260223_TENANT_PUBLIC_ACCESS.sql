-- =====================================================
-- 🔐 PUBLIC RESOURCES ACCESS FIX (Tenants & Blogs)
-- Tarih: 23 Şubat 2026
-- Amaç: Landing page ve Blog sayfalarının oturum açılmadan 
--       (anon) çalışabilmesini sağlamak. 
--       SECURITY_LOCKDOWN'da kapatılan anon SELECT yetkisini
--       kamuya açık tablo ve kolonlar için geri veriyoruz.
-- =====================================================

BEGIN;

-- 1. Tenants: Branding için tüm tabloya erişim (hassas veri yok)
GRANT SELECT ON public.tenants TO anon;

-- 2. Blogs: Blog yazılarının okunabilmesi için
GRANT SELECT ON public.blogs TO anon;

-- 3. Profiles: Blog yazar isimlerinin görünmesi için kısıtlı kolon erişimi
-- Sadece id ve isim/avatar kolonlarını anon'a açıyoruz.
GRANT SELECT (id, full_name, avatar_url, role) ON public.profiles TO anon;

-- 4. RLS Politikalarını Kontrol Et/Yenile
-- Tenants
DROP POLICY IF EXISTS "tenants_public_read" ON public.tenants;
CREATE POLICY "tenants_public_read" ON public.tenants FOR SELECT TO anon, authenticated USING (true);

-- Blogs
DROP POLICY IF EXISTS "blogs_public_read" ON public.blogs;
CREATE POLICY "blogs_public_read" ON public.blogs FOR SELECT TO anon, authenticated USING (is_published = true);

-- Profiles (Anon'un ne görebileceğini kısıtlayalım)
DROP POLICY IF EXISTS "profiles_public_read" ON public.profiles;
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT TO anon, authenticated 
USING (
    -- Authenticated her şeyi görebilir (veya mevcut RLS kuralı neyse o geçerli olur)
    (auth.role() = 'authenticated') OR
    -- Anon sadece kendi erişebildiği kolonları görecek şekilde row-level izni alır
    (auth.role() = 'anon')
);

-- 5. Audit Check
DO $$
DECLARE
    v_tenant_grant BOOLEAN;
    v_blog_grant BOOLEAN;
BEGIN
    SELECT EXISTS (SELECT 1 FROM information_schema.role_table_grants WHERE grantee = 'anon' AND table_name = 'tenants' AND privilege_type = 'SELECT') INTO v_tenant_grant;
    SELECT EXISTS (SELECT 1 FROM information_schema.role_table_grants WHERE grantee = 'anon' AND table_name = 'blogs' AND privilege_type = 'SELECT') INTO v_blog_grant;

    IF v_tenant_grant AND v_blog_grant THEN
        RAISE NOTICE '✅ Kamu kaynakları (Tenants/Blogs) anon erişimi başarıyla geri yüklendi.';
    ELSE
        RAISE EXCEPTION '❌ Erişim yetkileri tanımlanırken bir sorun oluştu.';
    END IF;
END $$;

COMMIT;
