-- 🎁 OdevGPT DAILY QUEST ENGINE v1
-- Günlük görevleri takip eden ve ödüllendiren zeka katmanı.

-- 1. Günlük Aktiviteyi Getiren Fonksiyon
CREATE OR REPLACE FUNCTION get_daily_quest_status(p_student_id UUID)
RETURNS TABLE (
    questions_solved INTEGER,
    socratic_chats INTEGER,
    is_bonus_claimed BOOLEAN
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT 
        -- 1. Bugün çözülen soru sayısı
        (SELECT COUNT(DISTINCT q.id)::INTEGER 
         FROM questions q
         JOIN solutions s ON s.question_id = q.id 
         WHERE q.student_id = p_student_id 
           AND q.created_at >= CURRENT_DATE)::INTEGER as questions_solved,
           
        -- 2. Bugün başlatılan Sokratik sohbet sayısı
        (SELECT COUNT(*)::INTEGER 
         FROM ai_chat_sessions 
         WHERE student_id = p_student_id 
           AND created_at >= CURRENT_DATE)::INTEGER as socratic_chats,

        -- 3. Bugün ödül alındı mı?
        EXISTS (
            SELECT 1 FROM xp_logs 
            WHERE user_id = p_student_id 
              AND reason = 'Daily Quest Bonus' 
              AND created_at >= CURRENT_DATE
        ) as is_bonus_claimed;
END;
$$;

-- 2. Ödülü Talep Etme Fonksiyonu
CREATE OR REPLACE FUNCTION claim_daily_quest_bonus(p_student_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_questions INTEGER;
    v_chats INTEGER;
    v_claimed BOOLEAN;
BEGIN
    -- Mevcut durumu kontrol et
    SELECT questions_solved, socratic_chats, is_bonus_claimed 
    INTO v_questions, v_chats, v_claimed
    FROM get_daily_quest_status(p_student_id);

    -- 1. Zaten alındıysa hata döndür
    IF v_claimed THEN
        RETURN jsonb_build_object('success', false, 'message', 'Bugünkü ödülünü zaten aldın! Yarın yine gel. 😊');
    END IF;

    -- 2. Görevler tamamlanmadıysa hata döndür
    IF v_questions < 3 OR v_chats < 1 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Henüz tüm görevleri tamamlamadın! 3 Soru ve 1 Sokratik Sohbet gerekli.');
    END IF;

    -- 3. Ödülü ver (+50 XP)
    INSERT INTO xp_logs (user_id, amount, reason)
    VALUES (p_student_id, 50, 'Daily Quest Bonus');

    -- 4. Profili güncelle (XP artışı)
    UPDATE profiles SET xp = xp + 50 WHERE id = p_student_id;

    RETURN jsonb_build_object('success', true, 'message', 'Tebrikler! 50 XP kazandın ve sürpriz kutuyu açtın! 🎉');
END;
$$;
