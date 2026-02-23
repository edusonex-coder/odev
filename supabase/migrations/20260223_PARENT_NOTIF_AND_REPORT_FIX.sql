-- =====================================================
-- 🔐 PARENT PANEL: NOTIFICATION LINK & REPORT LOGIC FIX
-- Tarih: 23 Şubat 2026
-- Amaç: 
-- 1) Veli bildirimlerindeki 404 (yanlış URL) hatasını düzelt.
-- 2) Haftalık raporun "aktivite yok" hatasını (tarih çakışması) gider.
-- =====================================================

BEGIN;

-- 1. BİLDİRİM TETİKLEYİCİSİNİ DÜZELT (Notification Link Fix)
-- =====================================================
-- Eski trigger ve fonksiyonu temizle
DROP TRIGGER IF EXISTS notify_parent_on_student_question ON public.questions;
DROP FUNCTION IF EXISTS public.notify_parent_on_student_question() CASCADE;

CREATE OR REPLACE FUNCTION public.notify_parent_on_student_question()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_student_name TEXT;
    v_parent_id UUID;
BEGIN
    -- Öğrenci ismini al
    SELECT full_name INTO v_student_name
    FROM public.profiles WHERE id = NEW.student_id;
    
    -- Her bağlı veli için bildirim oluştur
    -- DÜZELTME: Linki /dashboard/question/[ID] olarak güncelliyoruz (Eski hatalı /dashboard/student/ linki yerine)
    INSERT INTO public.notifications (user_id, title, content, type, link)
    SELECT 
        parent_id, 
        'Yeni Soru Soruldu 🚀',
        v_student_name || ' yeni bir soru sordu. Detayları görmek için tıklayın.',
        'info',
        '/dashboard/question/' || NEW.id
    FROM public.student_parent_relations
    WHERE student_id = NEW.student_id;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER notify_parent_on_student_question
    AFTER INSERT ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_parent_on_student_question();


-- 2. HAFTALIK İSTATİSTİK RPC DÜZELTME (Weekly Stats Logical Fix)
-- =====================================================
-- Öğrencinin istatistiklerini getirirken eğer o haftada veri yoksa 
-- "Aktivite Yok" demek yerine son 7 günü kapsayacak şekilde esnetilebilir 
-- veya tarih aralığı kontrolü iyileştirilebilir.
-- Şimdilik fonksiyona dokunmadan frontend'i düzelteceğiz ancak 
-- fonksiyonun search_path'ini garantiye alalım.

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


-- 3. MEVCUT HATALI LİNKLERİ DÜZELT (Cleanup Existing Bad Links)
-- =====================================================
UPDATE public.notifications
SET link = REPLACE(link, '/dashboard/student/', '/dashboard/question/')
WHERE link LIKE '/dashboard/student/%';

COMMIT;
