-- =====================================================
-- SETTINGS PAGE FIX: notification_preferences kolonu ekle
-- Tarih: 16 Şubat 2026
-- =====================================================

-- 1. notification_preferences kolonu ekle (JSONB)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
    "question_answered": true,
    "weekly_report": false,
    "new_tasks": true,
    "student_activity": true,
    "assignment_graded": true
}'::jsonb;

-- 2. Mevcut kullanıcılar için default değerleri set et
UPDATE profiles 
SET notification_preferences = '{
    "question_answered": true,
    "weekly_report": false,
    "new_tasks": true,
    "student_activity": true,
    "assignment_graded": true
}'::jsonb
WHERE notification_preferences IS NULL;

-- Verify
DO $$
BEGIN
    RAISE NOTICE '✅ notification_preferences kolonu eklendi ve default değerler set edildi.';
END $$;
