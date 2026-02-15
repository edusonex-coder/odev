-- ============================================
-- ODEVGPT: FIX RPC PARAMETERS (KESİN ÇÖZÜM)
-- Tarih: 15 Şubat 2026
-- Amaç: RPC fonksiyonlarından user_id parametresini kaldırıp
-- güvenli auth.uid() kullanımına geçmek.
-- ============================================

-- 1. get_parent_students (Parametresiz Versiyon)
-- Önce eski versiyonu (parametre alan) silelim ki karışıklık olmasın
DROP FUNCTION IF EXISTS get_parent_students(UUID);

-- Yeni versiyon: Parametre almaz, auth.uid() kullanır
CREATE OR REPLACE FUNCTION get_parent_students()
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
    WHERE r.parent_id = auth.uid(); -- Güvenli ID kullanımı
END;
$$;

-- 2. pair_student_with_parent (Sadece kod alan versiyon)
DROP FUNCTION IF EXISTS pair_student_with_parent(UUID, TEXT);

CREATE OR REPLACE FUNCTION pair_student_with_parent(p_access_code TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_student_id UUID;
    v_student_name TEXT;
    v_parent_id UUID;
BEGIN
    v_parent_id := auth.uid(); -- Mevcut kullanıcı ID'si
    
    SELECT id, full_name INTO v_student_id, v_student_name
    FROM profiles 
    WHERE parent_access_code ILIKE trim(p_access_code) AND role = 'student';
    
    IF v_student_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Geçersiz kod! Lütfen öğrencinin Profil sayfasındaki 8 haneli kodu girin.');
    END IF;
    
    -- Kendini ekleyemezsin
    IF v_student_id = v_parent_id THEN
         RETURN jsonb_build_object('success', false, 'message', 'Kendinizi öğrenci olarak ekleyemezsiniz.');
    END IF;
    
    INSERT INTO student_parent_relations (student_id, parent_id)
    VALUES (v_student_id, v_parent_id)
    ON CONFLICT (student_id, parent_id) DO NOTHING;
    
    RETURN jsonb_build_object('success', true, 'student_name', v_student_name);
END;
$$;

-- 3. RLS GÜNCELLEMELERİ (Garanti olsun)
ALTER TABLE student_parent_relations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view student data" ON student_parent_relations;
CREATE POLICY "Parents can view student data" ON student_parent_relations 
FOR SELECT USING (auth.uid() = parent_id OR auth.uid() = student_id);

-- Migration Complete
