-- ============================================
-- ODEVGPT: ASSIGNMENT SYSTEM (ÖDEV SİSTEMİ)
-- Tarih: 15 Şubat 2026
-- ============================================

-- 1. ASSIGNMENTS TABLE (Ödevler Ana Tablo)
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
    auto_grade BOOLEAN DEFAULT false,
    max_score INTEGER DEFAULT 100,
    instructions TEXT,
    attachments JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ASSIGNMENT SUBMISSIONS TABLE (Öğrenci Teslimleri)
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    submission_text TEXT,
    submission_files JSONB,
    ocr_extracted_text TEXT,
    status TEXT CHECK (status IN ('pending', 'graded', 'returned')) DEFAULT 'pending',
    score INTEGER,
    feedback TEXT,
    ai_feedback TEXT,
    ai_score INTEGER,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    graded_at TIMESTAMPTZ,
    graded_by UUID REFERENCES profiles(id),
    UNIQUE(assignment_id, student_id)
);

-- 3. SUBMISSION FEEDBACK TABLE (Detaylı Yorumlar)
CREATE TABLE IF NOT EXISTS submission_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES assignment_submissions(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    comment_type TEXT CHECK (comment_type IN ('praise', 'correction', 'suggestion', 'question')) DEFAULT 'suggestion',
    line_reference INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON assignment_submissions(student_id);

-- 4. RPC: GET ASSIGNMENT SUBMISSIONS
CREATE OR REPLACE FUNCTION get_assignment_submissions(p_assignment_id UUID)
RETURNS TABLE (
    submission_id UUID,
    student_id UUID,
    student_name TEXT,
    student_avatar TEXT,
    submission_text TEXT,
    submission_files JSONB,
    status TEXT,
    score INTEGER,
    feedback TEXT,
    ai_score INTEGER,
    submitted_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id AS submission_id,
        p.id AS student_id,
        p.full_name AS student_name,
        p.avatar_url AS student_avatar,
        s.submission_text,
        s.submission_files,
        s.status,
        s.score,
        s.feedback,
        s.ai_score,
        s.submitted_at,
        s.graded_at
    FROM assignment_submissions s
    JOIN profiles p ON p.id = s.student_id
    WHERE s.assignment_id = p_assignment_id
    ORDER BY s.submitted_at DESC;
END;
$$;

-- 5. RPC: SUBMIT ASSIGNMENT
CREATE OR REPLACE FUNCTION submit_assignment(
    p_assignment_id UUID,
    p_student_id UUID,
    p_submission_text TEXT,
    p_submission_files JSONB DEFAULT NULL,
    p_ocr_text TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_submission_id UUID;
BEGIN
    INSERT INTO assignment_submissions (
        assignment_id,
        student_id,
        submission_text,
        submission_files,
        ocr_extracted_text,
        status
    ) VALUES (
        p_assignment_id,
        p_student_id,
        p_submission_text,
        p_submission_files,
        p_ocr_text,
        'pending'
    )
    ON CONFLICT (assignment_id, student_id) 
    DO UPDATE SET
        submission_text = EXCLUDED.submission_text,
        submission_files = EXCLUDED.submission_files,
        ocr_extracted_text = EXCLUDED.ocr_extracted_text,
        submitted_at = NOW(),
        status = 'pending'
    RETURNING id INTO v_submission_id;
    
    RETURN v_submission_id;
END;
$$;

-- 6. RPC: GRADE SUBMISSION (With XP rewards)
CREATE OR REPLACE FUNCTION grade_submission(
    p_submission_id UUID,
    p_teacher_id UUID,
    p_score INTEGER,
    p_feedback TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_student_id UUID;
BEGIN
    UPDATE assignment_submissions
    SET 
        score = p_score,
        feedback = p_feedback,
        status = 'graded',
        graded_at = NOW(),
        graded_by = p_teacher_id
    WHERE id = p_submission_id
    RETURNING student_id INTO v_student_id;
    
    -- XP Ödülleri (Fix: amount kolonunu kullanıyoruz)
    IF p_score >= 70 THEN
        INSERT INTO xp_logs (user_id, amount, reason)
        VALUES (v_student_id, 100, 'Ödev başarısı: ' || p_score || ' puan');
        UPDATE profiles SET xp = xp + 100 WHERE id = v_student_id;
    ELSIF p_score >= 50 THEN
        INSERT INTO xp_logs (user_id, amount, reason)
        VALUES (v_student_id, 50, 'Ödev tamamlandı');
        UPDATE profiles SET xp = xp + 50 WHERE id = v_student_id;
    END IF;
    
    RETURN TRUE;
END;
$$;

-- 7. RLS POLICIES
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view assignments" ON assignments;
CREATE POLICY "Public view assignments" ON assignments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Teachers can manage own assignments" ON assignments;
CREATE POLICY "Teachers can manage own assignments" ON assignments FOR ALL USING (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Students see own submissions" ON assignment_submissions;
CREATE POLICY "Students see own submissions" ON assignment_submissions FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students insert own submissions" ON assignment_submissions;
CREATE POLICY "Students insert own submissions" ON assignment_submissions FOR INSERT WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Teachers view class submissions" ON assignment_submissions;
CREATE POLICY "Teachers view class submissions" ON assignment_submissions FOR SELECT USING (
    EXISTS (SELECT 1 FROM assignments a JOIN classes c ON c.id = a.class_id WHERE a.id = assignment_id AND c.teacher_id = auth.uid())
);

-- 8. TRIGGER FOR NOTIFICATIONS
CREATE OR REPLACE FUNCTION notify_student_on_grade()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.score IS NULL AND NEW.score IS NOT NULL THEN
        INSERT INTO notifications (user_id, title, content, type)
        VALUES (NEW.student_id, 'Ödevin Notlandı! ✅', 'Bir öğretmen ödevini değerlendirdi.', 'success');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_on_grade ON assignment_submissions;
CREATE TRIGGER trigger_notify_on_grade
AFTER UPDATE OF score ON assignment_submissions
FOR EACH ROW
EXECUTE FUNCTION notify_student_on_grade();
