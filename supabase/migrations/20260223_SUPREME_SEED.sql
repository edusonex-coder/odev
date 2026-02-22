-- =====================================================
-- 🌱 ODEVGPT SUPREME SEED: DYNAMIC TEST ENVIRONMENT
-- Tarih: 23 Şubat 2026
-- Amaç: AI Action Engine demosu için gerekli veriyi AKILLI bir şekilde oluşturur.
-- =====================================================

DO $$
DECLARE
    v_tenant_id UUID;
    v_target_user_id UUID;
    v_class_id UUID;
BEGIN
    -- 1. Demo Tenant (Okul) Oluştur
    INSERT INTO public.tenants (name, slug, domain)
    VALUES ('Demo Akademi', 'demo-akademi', 'demo.edusonex.online')
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_tenant_id;

    -- 2. Mevcut Sistemden Bir Kullanıcı Bul (Önce Admin, sonra Teacher, sonra Herhangi biri)
    SELECT id INTO v_target_user_id FROM public.profiles WHERE role = 'admin' LIMIT 1;
    
    IF v_target_user_id IS NULL THEN
        SELECT id INTO v_target_user_id FROM public.profiles WHERE role = 'teacher' LIMIT 1;
    END IF;

    IF v_target_user_id IS NULL THEN
        SELECT id INTO v_target_user_id FROM public.profiles LIMIT 1;
    END IF;

    -- 3. Eğer hiç kullanıcı yoksa, zorla profil oluşturmayı deneme (FK Hatası verir)
    IF v_target_user_id IS NOT NULL THEN
        -- Kullanıcıyı bu tenant'a bağla ve rolünü teacher/admin yap
        UPDATE public.profiles 
        SET tenant_id = v_tenant_id, 
            role = CASE WHEN role = 'student' THEN 'teacher' ELSE role END
        WHERE id = v_target_user_id;

        -- 4. Demo Sınıf Oluştur
        INSERT INTO public.classes (name, teacher_id, invite_code, color)
        VALUES ('10-A Fizik (Demo)', v_target_user_id, 'DEMO10', 'purple')
        ON CONFLICT (invite_code) DO UPDATE SET name = EXCLUDED.name
        RETURNING id INTO v_class_id;

        RAISE NOTICE '✅ Seed Başarılı:';
        RAISE NOTICE '   Kullanılan User ID: %', v_target_user_id;
        RAISE NOTICE '   Tenant ID: %', v_tenant_id;
        RAISE NOTICE '   Class ID: %', v_class_id;
    ELSE
        RAISE NOTICE '⚠️ SİSTEMDE HİÇ KULLANICI BULUNAMADI!';
        RAISE NOTICE '   Lütfen önce uygulamaya gidip (/signup) bir hesap oluşturun.';
        RAISE NOTICE '   Hesap oluşturduktan sonra bu seed scriptini tekrar çalıştırın.';
    END IF;
END $$;
