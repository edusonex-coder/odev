-- ============================================
-- ODEVGPT: PARENT TRACKING SYSTEM (VELİ TAKİP SİSTEMİ)
-- Tarih: 15 Şubat 2026
-- Amaç: Velilerin öğrenci gelişimini takip edebilmesi
-- ============================================

-- 1. EXTEND PROFILES
-- Öğrencilere veli bağlama kodu ekleyelim
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS parent_access_code TEXT UNIQUE DEFAULT substring(md5(random()::text), 1, 8);

-- 2. STUDENT-PARENT RELATIONSHIPS
-- Velilerin hangi öğrencileri takip edebileceğini saklar
CREATE TABLE IF NOT EXISTS student_parent_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    relation_type TEXT DEFAULT 'parent', -- parent, guardian, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Bir veli bir öğrenciyi sadece 1 kez bağlayabilir
    UNIQUE(student_id, parent_id)
);

-- Index for faster lookup
CREATE INDEX idx_parent_student_parent ON student_parent_relations(parent_id);
CREATE INDEX idx_parent_student_student ON student_parent_relations(student_id);

-- ============================================
-- 3. RPC: PAIR STUDENT WITH PARENT
-- Velinin erişim koduyla öğrenciyi kendine bağlaması
-- ============================================
CREATE OR REPLACE FUNCTION pair_student_with_parent(
    p_parent_id UUID,
    p_access_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_student_id UUID;
    v_student_name TEXT;
BEGIN
    -- Koda sahip öğrenciyi bul
    SELECT id, full_name INTO v_student_id, v_student_name
    FROM profiles
    WHERE parent_access_code = p_access_code AND role = 'student';
    
    IF v_student_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Geçersiz erişim kodu.');
    END IF;
    
    -- İlişkiyi ekle
    INSERT INTO student_parent_relations (student_id, parent_id)
    VALUES (v_student_id, p_parent_id)
    ON CONFLICT (student_id, parent_id) DO NOTHING;
    
    RETURN jsonb_build_object(
        'success', true, 
        'student_id', v_student_id,
        'student_name', v_student_name
    );
END;
$$;

-- ============================================
-- 4. RPC: GET PARENT STUDENTS
-- Velinin takip ettiği tüm öğrencileri ve özet verilerini getirir
-- ============================================
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
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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

-- ============================================
-- 5. RLS POLICIES
-- ============================================

-- Student-Parent Relations
ALTER TABLE student_parent_relations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own relations" ON student_parent_relations;
CREATE POLICY "Users can view their own relations"
ON student_parent_relations FOR SELECT
USING (auth.uid() = parent_id OR auth.uid() = student_id);

-- Profiles access for Parents
-- Veliler sadece kendi öğrencilerinin profillerini görebilmeli
DROP POLICY IF EXISTS "Parents can view their students profiles" ON profiles;
CREATE POLICY "Parents can view their students profiles"
ON profiles FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM student_parent_relations
        WHERE parent_id = auth.uid() AND student_id = profiles.id
    )
);

-- ============================================
-- 6. PARENT ACCESS FOR QUESTIONS & SOLUTIONS
-- Veliler çocuklarının sorularını ve çözümlerini görebilmeli
-- ============================================

-- Questions
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Parents can view student questions" ON questions;
CREATE POLICY "Parents can view student questions"
ON questions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM student_parent_relations
        WHERE parent_id = auth.uid() AND student_id = questions.student_id
    )
);

-- Solutions
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Parents can view student solutions" ON solutions;
CREATE POLICY "Parents can view student solutions"
ON solutions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM questions q
        JOIN student_parent_relations r ON r.student_id = q.student_id
        WHERE q.id = solutions.question_id AND r.parent_id = auth.uid()
    )
);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
