-- ============================================
-- ODEVGPT: MASTER PARENT & PROFILE SYSTEM FIX
-- Tarih: 15 Şubat 2026
-- Amaç: Tüm tabloların ve fonksiyonların eksiksiz kurulması
-- ============================================

-- 1. PROFILES TABLOSUNU GÜNCELLE
-- Eksik olabilecek tüm kolonları ekleyelim
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_access_code TEXT UNIQUE DEFAULT substring(md5(random()::text), 1, 8);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW();

-- Rol kısıtlamasını güncelle
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'teacher', 'admin', 'parent'));

-- 2. VELİ-ÖĞRENCİ İLİŞKİ TABLOSU
CREATE TABLE IF NOT EXISTS student_parent_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    relation_type TEXT DEFAULT 'parent',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, parent_id)
);

CREATE INDEX IF NOT EXISTS idx_parent_student_parent ON student_parent_relations(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_student ON student_parent_relations(student_id);

-- 3. BİLDİRİMLER TABLOSU
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- 4. XP LOGLARI TABLOSU
CREATE TABLE IF NOT EXISTS xp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RPC FONKSİYONLARI (DROP & CREATE)

-- add_xp
DROP FUNCTION IF EXISTS add_xp(UUID, INTEGER, TEXT);
CREATE OR REPLACE FUNCTION add_xp(user_id UUID, amount INTEGER, reason TEXT)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO xp_logs (user_id, amount, reason) VALUES (user_id, amount, reason);
    UPDATE profiles SET xp = xp + amount WHERE id = user_id;
END;
$$;

-- pair_student_with_parent
DROP FUNCTION IF EXISTS pair_student_with_parent(UUID, TEXT);
CREATE OR REPLACE FUNCTION pair_student_with_parent(p_parent_id UUID, p_access_code TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_student_id UUID;
    v_student_name TEXT;
BEGIN
    SELECT id, full_name INTO v_student_id, v_student_name
    FROM profiles WHERE parent_access_code = p_access_code AND role = 'student';
    
    IF v_student_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Geçersiz erişim kodu.');
    END IF;
    
    INSERT INTO student_parent_relations (student_id, parent_id)
    VALUES (v_student_id, p_parent_id)
    ON CONFLICT (student_id, parent_id) DO NOTHING;
    
    RETURN jsonb_build_object('success', true, 'student_id', v_student_id, 'student_name', v_student_name);
END;
$$;

-- get_parent_students
DROP FUNCTION IF EXISTS get_parent_students(UUID);
CREATE OR REPLACE FUNCTION get_parent_students(p_parent_id UUID)
RETURNS TABLE (
    student_id UUID,
    student_name TEXT,
    student_avatar TEXT,
    xp INTEGER,
    level INTEGER,
    total_questions BIGINT,
    solved_questions BIGINT,
    last_activity TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS student_id,
        p.full_name AS student_name,
        p.avatar_url AS student_avatar,
        p.xp,
        p.level,
        (SELECT COUNT(*) FROM questions WHERE student_id = p.id) AS total_questions,
        (SELECT COUNT(*) FROM solutions s JOIN questions q ON s.question_id = q.id WHERE q.student_id = p.id) AS solved_questions,
        (SELECT MAX(created_at) FROM questions WHERE student_id = p.id) AS last_activity
    FROM student_parent_relations r
    JOIN profiles p ON p.id = r.student_id
    WHERE r.parent_id = p_parent_id;
END;
$$;

-- 6. GÜVENLİK (RLS) POLİTİKALARI
ALTER TABLE student_parent_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Basit ama güvenli politikalar
DROP POLICY IF EXISTS "Public profiles" ON profiles;
CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Parent relations select" ON student_parent_relations;
CREATE POLICY "Parent relations select" ON student_parent_relations FOR SELECT USING (auth.uid() = parent_id OR auth.uid() = student_id);

DROP POLICY IF EXISTS "Notifications select" ON notifications;
CREATE POLICY "Notifications select" ON notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Notifications update" ON notifications;
CREATE POLICY "Notifications update" ON notifications FOR UPDATE USING (auth.uid() = user_id);
