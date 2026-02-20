-- 📝 OdevGPT INTERACTIVE ASSIGNMENT ENGINE v1
-- Ödev tablosunu interaktif ve AI destekli hale getirme.

-- 1. Kolonları ekle
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS type TEXT CHECK (type IN ('classic', 'interactive')) DEFAULT 'classic';
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS content_json JSONB DEFAULT '[]';

-- 2. Interaktif Ödevler için Yardımcı Fonksiyon (İstatistikler için)
CREATE OR REPLACE FUNCTION get_interactive_assignment_results(p_assignment_id UUID)
RETURNS TABLE (
    student_id UUID,
    student_name TEXT,
    score INTEGER,
    correct_count INTEGER,
    total_count INTEGER,
    completed_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS student_id,
        p.full_name AS student_name,
        s.score,
        (s.submission_files->>'correct_count')::INTEGER AS correct_count,
        (s.submission_files->>'total_count')::INTEGER AS total_count,
        s.submitted_at AS completed_at
    FROM assignment_submissions s
    JOIN profiles p ON p.id = s.student_id
    WHERE s.assignment_id = p_assignment_id
    ORDER BY s.score DESC;
END;
$$;
