-- =====================================================
-- FIX: get_parent_students RPC - Ambiguous column fix
-- Tarih: 16 Şubat 2026
-- Sorun: "student_id" column reference is ambiguous
-- =====================================================

DROP FUNCTION IF EXISTS get_parent_students() CASCADE;

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
        COUNT(q.id) AS total_questions,
        COUNT(q.id) FILTER (WHERE q.status = 'solved') AS solved_questions,
        MAX(q.created_at) AS last_activity
    FROM student_parent_relations spr
    JOIN profiles p ON p.id = spr.student_id
    LEFT JOIN questions q ON q.student_id = p.id
    WHERE spr.parent_id = auth.uid()
    GROUP BY p.id, p.full_name, p.avatar_url, p.xp, p.level
    ORDER BY p.full_name;
END;
$$;

-- Yorum: Tüm kolonlara tablo alias'ları eklendi (p.id, q.id, spr.parent_id)
-- Bu sayede "ambiguous column" hatası ortadan kalktı.
