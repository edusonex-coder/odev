-- ============================================
-- ODEVGPT: THE ULTIMATE ROOT CAUSE FIX
-- Tarih: 15 Şubat 2026
-- ============================================

-- 1. PROFILES TABLOSUNU TAMİR ET (Eksik kolonlar)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT; -- KRİTİK EKSİK!
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_access_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW();

-- Benzersizlik kısıtlamaları
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_parent_access_code_key') THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_parent_access_code_key UNIQUE (parent_access_code);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check') THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'teacher', 'admin', 'parent'));
    END IF;
END $$;

-- 2. TETİKLEYİCİ GÜNCELLEME (Avatar ve Rol Senkronizasyonu)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Yeni Kullanıcı'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'avatar'),
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    role = EXCLUDED.role;
  RETURN new;
END;
$$;

-- 3. TEMEL TABLOLAR (Eğer silinmişlerse)
CREATE TABLE IF NOT EXISTS student_parent_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    relation_type TEXT DEFAULT 'parent',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, parent_id)
);

CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject TEXT,
    question_text TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    solver_type TEXT CHECK (solver_type IN ('ai', 'teacher', 'system')),
    solver_id UUID REFERENCES profiles(id),
    solution_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS xp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RPC FONKSİYONLARI (KESİN ÇÖZÜM)

-- get_parent_students: Frontend (ParentPanel.tsx) ile tam uyumlu sütun adları
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
        (SELECT COUNT(DISTINCT q.id) FROM questions q JOIN solutions s ON s.question_id = q.id WHERE q.student_id = p.id) AS solved_questions,
        (SELECT MAX(created_at) FROM questions WHERE student_id = p.id) AS last_activity
    FROM student_parent_relations r
    JOIN profiles p ON p.id = r.student_id
    WHERE r.parent_id = p_parent_id;
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
    FROM profiles 
    WHERE parent_access_code ILIKE trim(p_access_code) AND role = 'student';
    
    IF v_student_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Geçersiz kod! Lütfen öğrencinin Profil sayfasındaki 8 haneli kodu girin.');
    END IF;
    
    INSERT INTO student_parent_relations (student_id, parent_id)
    VALUES (v_student_id, p_parent_id)
    ON CONFLICT (student_id, parent_id) DO NOTHING;
    
    RETURN jsonb_build_object('success', true, 'student_name', v_student_name);
END;
$$;

-- 5. GÜVENLİK (RLS) POLİTİKALARI (VELİ ERİŞİMİ İÇİN)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_parent_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;

-- Profillere genel okuma izni (Sınırlı)
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
CREATE POLICY "Enable read access for all users" ON profiles FOR SELECT USING (true);

-- Veliler kendi çocuklarının verilerini görebilsin
DROP POLICY IF EXISTS "Parents can view student data" ON student_parent_relations;
CREATE POLICY "Parents can view student data" ON student_parent_relations FOR SELECT USING (auth.uid() = parent_id OR auth.uid() = student_id);

DROP POLICY IF EXISTS "Parents view questions" ON questions;
CREATE POLICY "Parents view questions" ON questions FOR SELECT USING (
    auth.uid() = student_id OR EXISTS (SELECT 1 FROM student_parent_relations r WHERE r.parent_id = auth.uid() AND r.student_id = questions.student_id)
);

DROP POLICY IF EXISTS "Parents view solutions" ON solutions;
CREATE POLICY "Parents view solutions" ON solutions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM questions q 
        JOIN student_parent_relations r ON r.student_id = q.student_id 
        WHERE q.id = solutions.question_id AND r.parent_id = auth.uid()
    )
);
