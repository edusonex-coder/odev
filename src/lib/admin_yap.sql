-- 👑 EDUSONEX ÖDEVGPT - ADMİN YETKİSİ VERME KOMUTU 👑
-- Bu kodu Supabase Dashboard -> SQL Editor kısmına yapıştırıp RUN butonuna basın.

DO $$
DECLARE
  target_email TEXT := 'ferhatkaraduman@gmail.com'; -- Hedef E-posta
  user_id UUID;
BEGIN
  -- 1. Kullanıcının ID'sini bul
  SELECT id INTO user_id FROM auth.users WHERE email = target_email;

  IF user_id IS NULL THEN
    RAISE NOTICE 'Kullanıcı bulunamadı: %', target_email;
  ELSE
    -- 2. Profiles tablosunu güncelle (Visible Role)
    UPDATE public.profiles
    SET role = 'admin'
    WHERE id = user_id;

    -- 3. Auth metadata'yı güncelle (Supabase Auth Role - Opsiyonel ama iyi olur)
    UPDATE auth.users
    SET raw_user_meta_data = 
      COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
    WHERE id = user_id;

    RAISE NOTICE 'Kullanıcı başarıyla ADMİN yapıldı: % (ID: %)', target_email, user_id;
  END IF;
END $$;
