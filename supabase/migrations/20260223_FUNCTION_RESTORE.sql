-- =====================================================
-- 🔧 ODEVGPT FUNCTION RESTORE
-- Tarih: 23 Şubat 2026
-- Amaç: Sistem Tanılamada eksik çıkan kritik fonksiyonları restore et.
-- =====================================================

-- 1. pair_student_with_parent: Veli-Öğrenci eşleşmesi (Erişim kodu ile)
DROP FUNCTION IF EXISTS public.pair_student_with_parent(UUID, TEXT);
CREATE OR REPLACE FUNCTION public.pair_student_with_parent(p_parent_id UUID, p_access_code TEXT)
RETURNS JSONB 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
    v_student_id UUID;
    v_student_name TEXT;
BEGIN
    -- Öğrenciyi erişim koduna göre bul
    SELECT id, full_name 
    INTO v_student_id, v_student_name
    FROM public.profiles 
    WHERE parent_access_code ILIKE trim(p_access_code) 
    AND role = 'student';
    
    IF v_student_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false, 
            'message', 'Geçersiz kod! Lütfen öğrencinin Profil sayfasındaki 8 haneli kodu girin.'
        );
    END IF;
    
    -- Eşleştir
    INSERT INTO public.student_parent_relations (student_id, parent_id)
    VALUES (v_student_id, p_parent_id)
    ON CONFLICT (student_id, parent_id) DO NOTHING;
    
    RETURN jsonb_build_object('success', true, 'student_name', v_student_name);
END;
$$;

-- 2. get_parent_students: Velinin bağlı öğrencilerini listele
DROP FUNCTION IF EXISTS public.get_parent_students(UUID);
CREATE OR REPLACE FUNCTION public.get_parent_students(p_parent_id UUID)
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
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS student_id,
        p.full_name AS student_name,
        p.avatar_url AS student_avatar,
        p.xp,
        p.level,
        (SELECT COUNT(*) FROM public.questions q WHERE q.student_id = p.id) AS total_questions,
        (SELECT COUNT(DISTINCT q.id) 
         FROM public.questions q 
         JOIN public.solutions s ON s.question_id = q.id 
         WHERE q.student_id = p.id) AS solved_questions,
        (SELECT MAX(created_at) FROM public.questions WHERE student_id = p.id) AS last_activity
    FROM public.student_parent_relations r
    JOIN public.profiles p ON p.id = r.student_id
    WHERE r.parent_id = p_parent_id;
END;
$$;

-- 3. get_student_weekly_stats: Öğrencinin haftalık istatistikleri
DROP FUNCTION IF EXISTS public.get_student_weekly_stats(UUID, DATE, DATE);
CREATE OR REPLACE FUNCTION public.get_student_weekly_stats(
    p_student_id UUID,
    p_week_start DATE,
    p_week_end DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total_questions INTEGER;
    v_solved_questions INTEGER;
    v_success_rate DECIMAL(5,2);
    v_total_xp INTEGER;
    v_level_ups INTEGER;
    v_recent_questions JSONB;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE EXISTS (
            SELECT 1 FROM public.solutions s WHERE s.question_id = questions.id
        ))
    INTO v_total_questions, v_solved_questions
    FROM public.questions
    WHERE student_id = p_student_id
        AND created_at >= p_week_start
        AND created_at < p_week_end + INTERVAL '1 day';
    
    IF v_total_questions > 0 THEN
        v_success_rate := (v_solved_questions::DECIMAL / v_total_questions) * 100;
    ELSE
        v_success_rate := 0;
    END IF;
    
    SELECT COALESCE(SUM(amount), 0)
    INTO v_total_xp
    FROM public.xp_logs
    WHERE user_id = p_student_id
        AND created_at >= p_week_start
        AND created_at < p_week_end + INTERVAL '1 day';
    
    v_level_ups := FLOOR(v_total_xp / 1000);
    
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', q.id,
                'question_text', LEFT(q.question_text, 100),
                'status', q.status,
                'created_at', q.created_at
            ) ORDER BY q.created_at DESC
        ) FILTER (WHERE q.id IS NOT NULL),
        '[]'::jsonb
    )
    INTO v_recent_questions
    FROM (
        SELECT * FROM public.questions
        WHERE student_id = p_student_id
            AND created_at >= p_week_start
            AND created_at < p_week_end + INTERVAL '1 day'
        ORDER BY created_at DESC
        LIMIT 5
    ) q;
    
    RETURN jsonb_build_object(
        'total_questions', v_total_questions,
        'solved_questions', v_solved_questions,
        'success_rate', v_success_rate,
        'total_xp_gained', v_total_xp,
        'level_ups', v_level_ups,
        'recent_questions', v_recent_questions
    );
END;
$$;

-- 4. get_parent_weekly_reports: Velinin tüm öğrenci raporlarını getir
DROP FUNCTION IF EXISTS public.get_parent_weekly_reports();
CREATE OR REPLACE FUNCTION public.get_parent_weekly_reports()
RETURNS TABLE (
    report_id UUID,
    student_id UUID,
    student_name TEXT,
    student_avatar TEXT,
    week_start DATE,
    week_end DATE,
    total_questions INTEGER,
    solved_questions INTEGER,
    success_rate DECIMAL(5,2),
    total_xp_gained INTEGER,
    level_ups INTEGER,
    ai_summary TEXT,
    ai_highlights JSONB,
    ai_recommendations TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pr.id,
        pr.student_id,
        p.full_name,
        p.avatar_url,
        pr.week_start,
        pr.week_end,
        pr.total_questions,
        pr.solved_questions,
        pr.success_rate,
        pr.total_xp_gained,
        pr.level_ups,
        pr.ai_summary,
        pr.ai_highlights,
        pr.ai_recommendations,
        pr.created_at
    FROM public.parent_reports pr
    JOIN public.profiles p ON p.id = pr.student_id
    WHERE pr.parent_id = (SELECT auth.uid())
    ORDER BY pr.week_start DESC, p.full_name;
END;
$$;

-- 5. is_my_student: Veli kendi öğrencisini kontrol eder
DROP FUNCTION IF EXISTS public.is_my_student(UUID);
CREATE OR REPLACE FUNCTION public.is_my_student(p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.student_parent_relations
        WHERE parent_id = (SELECT auth.uid()) AND student_id = p_student_id
    );
$$;

-- 6. add_xp: Öğrenciye XP ekle
DROP FUNCTION IF EXISTS public.add_xp(UUID, INTEGER, TEXT);
CREATE OR REPLACE FUNCTION public.add_xp(p_user_id UUID, p_amount INTEGER, p_reason TEXT DEFAULT 'general')
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.xp_logs (user_id, amount, reason)
    VALUES (p_user_id, p_amount, p_reason);
    
    UPDATE public.profiles
    SET xp = COALESCE(xp, 0) + p_amount,
        level = GREATEST(1, FLOOR((COALESCE(xp, 0) + p_amount) / 1000)::INTEGER + 1)
    WHERE id = p_user_id;
END;
$$;

-- 7. get_class_by_invite_code: Davet koduyla sınıf bul (RPC Bridge)
DROP FUNCTION IF EXISTS public.get_class_by_invite_code(TEXT);
CREATE OR REPLACE FUNCTION public.get_class_by_invite_code(p_invite_code TEXT)
RETURNS TABLE (id UUID, name TEXT, teacher_id UUID, color TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT c.id, c.name, c.teacher_id, c.color
    FROM public.classes c
    WHERE c.invite_code = UPPER(TRIM(p_invite_code))
    LIMIT 1;
END;
$$;

NOTIFY pgrst, 'reload schema';
