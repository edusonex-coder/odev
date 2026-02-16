-- TEST: Viçdan öğrenci için bu hafta test soruları ekle
-- Bu SQL'i Supabase SQL Editor'de çalıştır

-- Önce viçdan öğrencinin ID'sini bulalım
DO $$
DECLARE
    v_student_id UUID;
    v_question_id UUID;
BEGIN
    -- viçdan öğrencinin ID'sini bul
    SELECT id INTO v_student_id 
    FROM profiles 
    WHERE full_name ILIKE '%viçdan%' 
    LIMIT 1;
    
    IF v_student_id IS NOT NULL THEN
        -- Bu haftaya ait 3 test sorusu ekle
        
        -- Soru 1: Çözülmüş
        INSERT INTO questions (student_id, subject, question_text, status, created_at)
        VALUES (
            v_student_id,
            'Matematik',
            'İki sayının toplamı 15, farkı 3 ise bu sayılar kaçtır?',
            'pending',
            NOW() - INTERVAL '2 days'
        ) RETURNING id INTO v_question_id;
        
        -- Çözüm ekle
        INSERT INTO solutions (question_id, solver_type, solution_text)
        VALUES (
            v_question_id,
            'ai',
            'İki bilinmeyenli denklem sistemi kuralım: x + y = 15 ve x - y = 3. Bu denklemleri toplarsak 2x = 18, x = 9 bulunur. y = 15 - 9 = 6 olur.'
        );
        
        -- XP ekle
        INSERT INTO xp_logs (user_id, amount, reason)
        VALUES (v_student_id, 50, 'Matematik sorusu çözüldü');
        
        -- Soru 2: Çözülmüş
        INSERT INTO questions (student_id, subject, question_text, status, created_at)
        VALUES (
            v_student_id,
            'Fen Bilgisi',
            'Fotosentez olayında hangi gaz açığa çıkar?',
            'pending',
            NOW() - INTERVAL '1 day'
        ) RETURNING id INTO v_question_id;
        
        INSERT INTO solutions (question_id, solver_type, solution_text)
        VALUES (
            v_question_id,
            'ai',
            'Fotosentez sırasında bitkiler karbondioksit (CO₂) alır ve oksijen (O₂) açığa çıkarır.'
        );
        
        INSERT INTO xp_logs (user_id, amount, reason)
        VALUES (v_student_id, 50, 'Fen Bilgisi sorusu çözüldü');
        
        -- Soru 3: Beklemede
        INSERT INTO questions (student_id, subject, question_text, status, created_at)
        VALUES (
            v_student_id,
            'Türkçe',
            'Cümlede özne nasıl bulunur?',
            'pending',
            NOW() - INTERVAL '3 hours'
        );
        
        -- Profildeki XP'yi güncelle
        UPDATE profiles 
        SET xp = xp + 100,
            level = FLOOR((xp + 100) / 100) + 1
        WHERE id = v_student_id;
        
        RAISE NOTICE 'Test verileri başarıyla eklendi! Öğrenci ID: %', v_student_id;
    ELSE
        RAISE NOTICE 'viçdan öğrenci bulunamadı!';
    END IF;
END $$;
