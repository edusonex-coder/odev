-- =====================================================
-- 🏛️ ODEVGPT HIYERARŞİ ATAMALARI & TEMİZLİK
-- =====================================================
-- Başkanımızın talimatı ile Rabia Nur makamına atanıyor, 
-- Ferhat Karaduman holding seviyesine çekiliyor.

BEGIN;

-- 1. IŞIK Akademi ID'sini tespit et
DO $$ 
DECLARE 
    isik_id UUID;
BEGIN 
    SELECT id INTO isik_id FROM public.tenants WHERE name ILIKE '%Işık Akademi%' LIMIT 1;
    
    IF isik_id IS NULL THEN
        RAISE EXCEPTION 'IŞIK Akademi bulunamadı! Lütfen tenant adını kontrol edin.';
    END IF;

    -- 2. Rabia Nur'u IŞIK Akademi Admini yap
    UPDATE public.profiles 
    SET tenant_id = isik_id, 
        role = 'admin'
    WHERE full_name ILIKE '%Rabia nur%';

    -- 3. Ferhat Karaduman'ı Holding seviyesine çek (Okuldan bağımsız yap)
    -- Not: Süper admin her şeyi gördüğü için tenant_id'sinin NULL olması 'Global' olduğunu gösterir.
    UPDATE public.profiles 
    SET tenant_id = NULL,
        is_super_admin = true
    WHERE full_name ILIKE '%FERHAT KARADUMAN%';

END $$;

COMMIT;

-- 4. Durumu Kontrol Et
SELECT 
    p.full_name AS "Ad Soyad",
    p.role AS "Sistem Rolü",
    CASE 
        WHEN p.is_super_admin = true THEN 'HOLDİNG BAŞKANI'
        WHEN p.role = 'admin' AND p.tenant_id IS NOT NULL THEN 'OKUL YÖNETİCİSİ'
        ELSE 'KULLANICI'
    END AS "Hiyerarşi Seviyesi",
    COALESCE(t.name, 'GLOBAL / HOLDİNG') AS "Makam / Kurum"
FROM 
    public.profiles p
LEFT JOIN 
    public.tenants t ON p.tenant_id = t.id
WHERE 
    p.full_name ILIKE '%Rabia%' OR p.full_name ILIKE '%Ferhat%';
