-- 1. CLASS INSIGHTS TABLE
CREATE TABLE IF NOT EXISTS class_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    analysis_date TIMESTAMPTZ DEFAULT NOW(),
    weak_topics JSONB,
    strong_topics JSONB,
    average_success_rate DECIMAL(5,2),
    total_questions_analyzed INTEGER DEFAULT 0,
    ai_recommendations TEXT,
    suggested_exercises JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_class_insights_class_id ON class_insights(class_id);
CREATE INDEX IF NOT EXISTS idx_class_insights_date ON class_insights(analysis_date DESC);

-- ============================================
-- 2. STUDENT PERFORMANCE METRICS VIEW
-- ============================================
CREATE OR REPLACE VIEW student_performance_metrics AS
SELECT 
    p.id AS student_id,
    p.full_name AS student_name,
    cs.class_id,
    COUNT(DISTINCT q.id) AS total_questions,
    COUNT(DISTINCT CASE WHEN s.id IS NOT NULL THEN q.id END) AS solved_questions,
    ROUND(
        (COUNT(DISTINCT CASE WHEN s.id IS NOT NULL THEN q.id END)::DECIMAL / 
        NULLIF(COUNT(DISTINCT q.id), 0) * 100), 
        2
    ) AS success_rate,
    p.xp AS total_xp,
    p.level AS current_level,
    MAX(q.created_at) AS last_activity
FROM profiles p
LEFT JOIN class_students cs ON cs.student_id = p.id
LEFT JOIN questions q ON q.student_id = p.id
LEFT JOIN solutions s ON s.question_id = q.id
WHERE p.role = 'student'
GROUP BY p.id, p.full_name, cs.class_id, p.xp, p.level;

-- ============================================
-- 3. RPC: GET CLASS WEAK TOPICS
-- ============================================
CREATE OR REPLACE FUNCTION get_class_weak_topics(
    p_class_id UUID,
    p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
    topic TEXT,
    difficulty_score DECIMAL,
    student_count INTEGER,
    avg_attempts DECIMAL
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.subject AS topic,
        ROUND(AVG(CASE 
            WHEN s.id IS NULL THEN 1.0 
            ELSE 0.3 
        END), 2) AS difficulty_score,
        COUNT(DISTINCT q.student_id)::INTEGER AS student_count,
        ROUND(AVG(
            (SELECT COUNT(*) FROM solutions WHERE question_id = q.id)
        ), 2) AS avg_attempts
    FROM questions q
    LEFT JOIN solutions s ON s.question_id = q.id
    WHERE q.student_id IN (
        SELECT student_id FROM class_students WHERE class_id = p_class_id
    )
    AND q.subject IS NOT NULL
    GROUP BY q.subject
    ORDER BY difficulty_score DESC
    LIMIT p_limit;
END;
$$;

-- ============================================
-- 4. RPC: GET STUDENT PROGRESS
-- ============================================
CREATE OR REPLACE FUNCTION get_student_progress(
    p_student_id UUID,
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    date DATE,
    questions_asked INTEGER,
    questions_solved INTEGER,
    xp_gained INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.date,
        COUNT(DISTINCT q.id)::INTEGER AS questions_asked,
        COUNT(DISTINCT CASE WHEN s.id IS NOT NULL THEN q.id END)::INTEGER AS questions_solved,
        COALESCE(SUM(xl.amount), 0)::INTEGER AS xp_gained
    FROM (
        SELECT generate_series(
            CURRENT_DATE - p_days, 
            CURRENT_DATE, 
            '1 day'::INTERVAL
        )::DATE AS date
    ) d
    LEFT JOIN questions q ON DATE(q.created_at) = d.date AND q.student_id = p_student_id
    LEFT JOIN solutions s ON s.question_id = q.id
    LEFT JOIN xp_logs xl ON DATE(xl.created_at) = d.date AND xl.user_id = p_student_id
    GROUP BY d.date
    ORDER BY d.date DESC;
END;
$$;

-- ============================================
-- 5. RPC: GENERATE CLASS INSIGHTS
-- ============================================
CREATE OR REPLACE FUNCTION generate_class_insights(p_class_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_insight_id UUID;
    v_weak_topics JSONB;
    v_avg_success DECIMAL;
    v_total_questions INTEGER;
BEGIN
    SELECT jsonb_agg(
        jsonb_build_object(
            'topic', topic,
            'difficulty_score', difficulty_score,
            'student_count', student_count,
            'avg_attempts', avg_attempts
        )
    ) INTO v_weak_topics
    FROM get_class_weak_topics(p_class_id, 10);
    
    SELECT 
        ROUND(AVG(success_rate), 2),
        SUM(total_questions)
    INTO v_avg_success, v_total_questions
    FROM student_performance_metrics
    WHERE class_id = p_class_id;
    
    INSERT INTO class_insights (
        class_id,
        weak_topics,
        average_success_rate,
        total_questions_analyzed,
        ai_recommendations
    ) VALUES (
        p_class_id,
        v_weak_topics,
        COALESCE(v_avg_success, 0),
        COALESCE(v_total_questions, 0),
        'AI önerileri frontend tarafından Groq API ile oluşturulacak.'
    )
    RETURNING id INTO v_insight_id;
    
    RETURN v_insight_id;
END;
$$;

-- ============================================
-- 6. RLS POLICIES
-- ============================================
ALTER TABLE class_insights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Class insights viewable by teacher and admin" ON class_insights;
CREATE POLICY "Class insights viewable by teacher and admin"
ON class_insights FOR SELECT
USING (
    auth.uid() IN (SELECT teacher_id FROM classes WHERE id = class_id)
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Class insights insertable by teacher and admin" ON class_insights;
CREATE POLICY "Class insights insertable by teacher and admin"
ON class_insights FOR INSERT
WITH CHECK (
    auth.uid() IN (SELECT teacher_id FROM classes WHERE id = class_id)
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- 7. TRIGGER: AUTO UPDATE TIMESTAMP
-- ============================================
CREATE OR REPLACE FUNCTION update_class_insights_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_class_insights_timestamp ON class_insights;
CREATE TRIGGER trigger_update_class_insights_timestamp
BEFORE UPDATE ON class_insights
FOR EACH ROW
EXECUTE FUNCTION update_class_insights_timestamp();
