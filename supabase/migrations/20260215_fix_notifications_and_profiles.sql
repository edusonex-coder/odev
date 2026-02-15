-- ============================================
-- ODEVGPT: HOTFIX FOR PARENT ROLE AND NOTIFICATIONS
-- Tarih: 15 Şubat 2026
-- Amaç: Veli girişindeki hataları düzeltme ve eksik bildirim tablosunu oluşturma
-- ============================================

-- 1. FIX PROFILES ROLE CONSTRAINT
-- Mevcut kısıtlamayı kaldırıp 'parent' rolünü ekleyelim
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'teacher', 'admin', 'parent'));

-- 2. CREATE NOTIFICATIONS TABLE
-- Eksik olan bildirimler tablosunu oluşturalım
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- info, success, warning, error
    link TEXT, -- Tıklandığında gidilecek URL
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookup
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- 3. NOTIFICATIONS RLS POLICIES
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;
CREATE POLICY "Users can delete their own notifications"
ON notifications FOR DELETE
USING (auth.uid() = user_id);

-- 4. FIX PROFILES RLS FOR ALL USERS
-- Kullanıcıların kendi profillerini görebildiğinden emin olalım
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- 5. ENSURE TRIGGER HANDLES ALL ROLES
-- handle_new_user fonksiyonunu role'ü de içerecek şekilde güncelleyelim
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
    RETURN new;
END;
$$;

-- 6. CREATE XP_LOGS TABLE (If missing)
CREATE TABLE IF NOT EXISTS xp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RPC: ADD XP
CREATE OR REPLACE FUNCTION add_xp(user_id UUID, amount INTEGER, reason TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO xp_logs (user_id, amount, reason)
    VALUES (user_id, amount, reason);
    
    UPDATE profiles
    SET xp = xp + amount
    WHERE id = user_id;
END;
$$;

