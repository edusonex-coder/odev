-- =====================================================
-- FIX TRIGGER: notify_parent_on_student_question
-- Date: 16 Feb 2026
-- Description: Corrects the table name in the trigger from 
--              'parent_student_links' to 'student_parent_relations'
-- =====================================================

-- 1. Drop old objects
DROP TRIGGER IF EXISTS notify_parent_on_student_question ON questions;
DROP FUNCTION IF EXISTS notify_parent_on_student_question() CASCADE;

-- 2. Create fixed function
CREATE OR REPLACE FUNCTION notify_parent_on_student_question()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_student_name TEXT;
BEGIN
    -- Get student name
    SELECT full_name INTO v_student_name
    FROM profiles WHERE id = NEW.student_id;
    
    -- Insert notification for each linked parent
    INSERT INTO notifications (user_id, title, content, type, link)
    SELECT parent_id, 'Yeni Çalışma 📝',
           v_student_name || ' yeni bir soru sordu.',
           'system', '/dashboard/parent'
    FROM student_parent_relations
    WHERE student_id = NEW.student_id;
    
    RETURN NEW;
END;
$$;

-- 3. Create fixed trigger
CREATE TRIGGER notify_parent_on_student_question
    AFTER INSERT ON questions
    FOR EACH ROW
    EXECUTE FUNCTION notify_parent_on_student_question();

-- Verify Message
DO $$
BEGIN
    RAISE NOTICE '✅ Trigger notify_parent_on_student_question fixed successfully.';
END $$;
