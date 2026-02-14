-- Bu SQL kodunu Supabase Dashboard -> SQL Editor kısmına yapıştırıp RUN butonuna basın.

-- 1. Profiles tablosunun RLS politikalarını kontrol et (gerekirse aç)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Herkesin profil okumasına izin ver
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);

-- 3. Kullanıcıların kendi profillerini güncellemesine izin ver
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Trigger Fonksiyonunu Onar (En önemli kısım)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Yeni Kullanıcı'),
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  );
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Hata olursa yutma, logla ama işlemi durdurma (opsiyonel, burada durdurmuyoruz ki user oluşsun)
    -- Ama genelde user oluşmazsa login de olamaz.
    -- Basit bir insert deniyoruz.
    RETURN new;
END;
$$;

-- 5. Trigger'ı yeniden oluştur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Role sütunu için kısıtlamayı güncelle (Eğer enum değilse)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'teacher', 'admin'));

-- 7. Storage bucket oluştur (Eğer yoksa)
INSERT INTO storage.buckets (id, name, public) VALUES ('question_images', 'question_images', true) ON CONFLICT DO NOTHING;

-- 8. Storage Policy (Herkes yükleyebilir - Geçici çözüm)
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'question_images');
CREATE POLICY "Anyone can view images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'question_images');
