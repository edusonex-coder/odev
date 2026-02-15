-- ============================================
-- ODEVGPT: ASSIGNMENT SYSTEM IMPROVEMENTS
-- Tarih: 15 Şubat 2026
-- Amaç: Ödev oluşturma, teslim ve değerlendirme sistemini güçlendirme
-- ============================================

-- 1. ASSIGNMENTS TABLE IMPROVEMENTS
-- Mevcut assignments tablosuna yeni alanlar ekle
ALTER TABLE assignments
ADD COLUMN IF NOT EXISTS difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS auto_grade BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS max_score INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS instructions TEXT,
ADD COLUMN IF NOT EXISTS attachments JSONB; -- Öğretmenin eklediği dosyalar

-- ============================================
-- 2. ASSIGNMENT SUBMISSIONS TABLE
-- Öğrenci ödev teslimlerini saklar
-- ============================================
-- Tablo zaten varsa, eksik kolonları ekle
ALTER TABLE assignment_submissions
ADD COLUMN IF NOT EXISTS submission_text TEXT,
ADD COLUMN IF NOT EXISTS submission_files JSONB,
ADD COLUMN IF NOT EXISTS ocr_extracted_text TEXT,
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('pending', 'graded', 'returned')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS score INTEGER,
ADD COLUMN IF NOT EXISTS feedback TEXT,
ADD COLUMN IF NOT EXISTS ai_feedback TEXT,
ADD COLUMN IF NOT EXISTS ai_score INTEGER,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS graded_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS graded_by UUID REFERENCES profiles(id);

-- Eğer tablo yoksa oluştur
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON assignment_submissions(status);

-- ============================================
-- 3. SUBMISSION FEEDBACK TABLE
-- Öğretmenlerin ödev üzerine detaylı yorumları
-- ============================================
CREATE TABLE IF NOT EXISTS submission_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES assignment_submissions(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    comment_type TEXT CHECK (comment_type IN ('praise', 'correction', 'suggestion', 'question')) DEFAULT 'suggestion',
    line_reference INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_submission ON submission_feedback(submission_id);

-- ============================================
-- 4. RPC: GET ASSIGNMENT SUBMISSIONS
-- Bir ödevin tüm teslimlerini detaylı şekilde getirir
-- ============================================
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

-- ============================================
-- 5. RPC: SUBMIT ASSIGNMENT
-- Öğrencinin ödev teslim etmesi
-- ============================================
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
    -- Ödev teslim et (varsa güncelle, yoksa ekle)
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

-- ============================================
-- 6. RPC: GRADE SUBMISSION
-- Öğretmenin ödevi değerlendirmesi
-- ============================================
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
    v_assignment_id UUID;
BEGIN
    -- Submission'ı güncelle
    UPDATE assignment_submissions
    SET 
        score = p_score,
        feedback = p_feedback,
        status = 'graded',
        graded_at = NOW(),
        graded_by = p_teacher_id
    WHERE id = p_submission_id
    RETURNING student_id, assignment_id INTO v_student_id, v_assignment_id;
    
    -- Öğrenciye XP ver (başarı bonusu)
    IF p_score >= 70 THEN
        -- 70+ puan aldıysa bonus XP
        INSERT INTO xp_logs (user_id, xp_change, reason)
        VALUES (v_student_id, 100, 'Ödev başarısı: ' || p_score || ' puan');
        
        UPDATE profiles
        SET xp = xp + 100
        WHERE id = v_student_id;
    ELSIF p_score >= 50 THEN
        -- 50-69 arası normal XP
        INSERT INTO xp_logs (user_id, xp_change, reason)
        VALUES (v_student_id, 50, 'Ödev tamamlandı: ' || p_score || ' puan');
        
        UPDATE profiles
        SET xp = xp + 50
        WHERE id = v_student_id;
    END IF;
    
    RETURN TRUE;
END;
$$;

-- ============================================
-- 7. RPC: GET STUDENT ASSIGNMENTS
-- Bir öğrencinin tüm ödevlerini ve teslim durumlarını getirir
-- ============================================
CREATE OR REPLACE FUNCTION get_student_assignments(p_student_id UUID)
RETURNS TABLE (
    assignment_id UUID,
    assignment_title TEXT,
    assignment_description TEXT,
    difficulty_level TEXT,
    due_date TIMESTAMPTZ,
    max_score INTEGER,
    class_name TEXT,
    submission_id UUID,
    submission_status TEXT,
    score INTEGER,
    submitted_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id AS assignment_id,
        a.title AS assignment_title,
        a.description AS assignment_description,
        a.difficulty_level,
        a.due_date,
        a.max_score,
        c.name AS class_name,
        s.id AS submission_id,
        s.status AS submission_status,
        s.score,
        s.submitted_at
    FROM assignments a
    JOIN classes c ON c.id = a.class_id
    JOIN class_students cs ON cs.class_id = c.id
    LEFT JOIN assignment_submissions s ON s.assignment_id = a.id AND s.student_id = p_student_id
    WHERE cs.student_id = p_student_id
    ORDER BY a.due_date DESC;
END;
$$;

-- ============================================
-- 8. RLS POLICIES
-- ============================================

-- Assignment Submissions
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view their own submissions" ON assignment_submissions;
CREATE POLICY "Students can view their own submissions"
ON assignment_submissions FOR SELECT
USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can insert their own submissions" ON assignment_submissions;
CREATE POLICY "Students can insert their own submissions"
ON assignment_submissions FOR INSERT
WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can update their own pending submissions" ON assignment_submissions;
CREATE POLICY "Students can update their own pending submissions"
ON assignment_submissions FOR UPDATE
USING (student_id = auth.uid() AND status = 'pending');

DROP POLICY IF EXISTS "Teachers can view submissions in their classes" ON assignment_submissions;
CREATE POLICY "Teachers can view submissions in their classes"
ON assignment_submissions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM assignments a
        JOIN classes c ON c.id = a.class_id
        WHERE a.id = assignment_id AND c.teacher_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Teachers can update submissions in their classes" ON assignment_submissions;
CREATE POLICY "Teachers can update submissions in their classes"
ON assignment_submissions FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM assignments a
        JOIN classes c ON c.id = a.class_id
        WHERE a.id = assignment_id AND c.teacher_id = auth.uid()
    )
);

-- Submission Feedback
ALTER TABLE submission_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view feedback on their submissions" ON submission_feedback;
CREATE POLICY "Students can view feedback on their submissions"
ON submission_feedback FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM assignment_submissions
        WHERE id = submission_id AND student_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Teachers can insert feedback" ON submission_feedback;
CREATE POLICY "Teachers can insert feedback"
ON submission_feedback FOR INSERT
WITH CHECK (teacher_id = auth.uid());

DROP POLICY IF EXISTS "Teachers can view all feedback" ON submission_feedback;
CREATE POLICY "Teachers can view all feedback"
ON submission_feedback FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher'
    )
);

-- ============================================
-- 9. TRIGGER: AUTO NOTIFY ON GRADE
-- Ödev notlandığında öğrenciye bildirim gönder (gelecekte)
-- ============================================
CREATE OR REPLACE FUNCTION notify_student_on_grade()
RETURNS TRIGGER AS $$
BEGIN
    -- Sadece score NULL'dan değere geçtiğinde çalışsın
    IF OLD.score IS NULL AND NEW.score IS NOT NULL THEN
        -- Gelecekte burada bildirim sistemi eklenebilir
        -- Şimdilik sadece log tutalım
        RAISE NOTICE 'Ödev notlandı: Öğrenci %, Puan %', NEW.student_id, NEW.score;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_on_grade ON assignment_submissions;
CREATE TRIGGER trigger_notify_on_grade
AFTER UPDATE OF score ON assignment_submissions
FOR EACH ROW
EXECUTE FUNCTION notify_student_on_grade();

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
