-- =====================================================
-- FIX RLS: Solutions & Parent Reports
-- Date: 16 Feb 2026
-- Description: 
-- 1. Adds INSERT policy for solutions (for AI responses)
-- 2. Ensures parents can see their student's solutions
-- 3. Fixes parent_reports policies
-- =====================================================

-- 1. Solutions INSERT Policy
-- Students should be able to trigger AI solutions for their own questions
DROP POLICY IF EXISTS "Students can insert AI solutions" ON solutions;
CREATE POLICY "Students can insert AI solutions"
ON solutions FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM questions q
        WHERE q.id = question_id
        AND q.student_id = auth.uid()
    )
    AND solver_type = 'ai'
);

-- 2. Solutions SELECT Policy (Reinforcement)
DROP POLICY IF EXISTS "Users can view relevant solutions" ON solutions;
CREATE POLICY "Users can view relevant solutions" 
ON solutions FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM questions q 
        WHERE q.id = question_id 
        AND (
            q.student_id = auth.uid() 
            OR EXISTS (
                SELECT 1 FROM student_parent_relations 
                WHERE parent_id = auth.uid() AND student_id = q.student_id
            )
            OR EXISTS (
                SELECT 1 FROM profiles
                WHERE profiles.id = auth.uid() AND profiles.role IN ('teacher', 'admin')
            )
        )
    )
);

-- 3. Parent Reports SELECT Policy
DROP POLICY IF EXISTS "Parents can view their own reports" ON parent_reports;
CREATE POLICY "Parents can view their own reports"
ON parent_reports FOR SELECT
USING (
    parent_id = auth.uid() 
    OR student_id = auth.uid()
);

-- 4. Parent Reports INSERT Policy
DROP POLICY IF EXISTS "Users can insert reports for their students" ON parent_reports;
CREATE POLICY "Users can insert reports for their students"
ON parent_reports FOR INSERT
WITH CHECK (
    parent_id = auth.uid()
);

-- Verify
DO $$
BEGIN
    RAISE NOTICE '✅ RLS policies for solutions and parent_reports updated.';
END $$;
