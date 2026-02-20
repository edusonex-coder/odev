-- 🎖️ OdevGPT BADGE ENGINE v1
-- Rozetlerin otomatik olarak kazanılmasını sağlayan zeka katmanı.

-- 1. Rozet Atama Yardımcı Fonksiyonu
CREATE OR REPLACE FUNCTION award_badge_if_not_exists(p_user_id UUID, p_badge_name TEXT)
RETURNS VOID AS $$
DECLARE
    v_badge_id UUID;
BEGIN
    SELECT id INTO v_badge_id FROM badges WHERE name = p_badge_name;
    
    IF v_badge_id IS NOT NULL THEN
        INSERT INTO user_badges (user_id, badge_id)
        VALUES (p_user_id, v_badge_id)
        ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ana Rozet Kontrol Fonksiyonu
CREATE OR REPLACE FUNCTION check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_xp INTEGER;
    v_math_count INTEGER;
    v_total_solutions INTEGER;
BEGIN
    -- Hangi tablo tetiklediyse user_id'yi al
    IF TG_TABLE_NAME = 'profiles' THEN
        v_user_id := NEW.id;
        v_xp := NEW.xp;
    ELSIF TG_TABLE_NAME = 'xp_logs' THEN
        v_user_id := NEW.user_id;
        SELECT xp INTO v_xp FROM profiles WHERE id = v_user_id;
    ELSIF TG_TABLE_NAME = 'solutions' THEN
        -- SOLUTIONS tablosunda student_id yoktur, questions üzerinden almalıyız
        SELECT student_id INTO v_user_id FROM questions WHERE id = NEW.question_id;
        SELECT xp INTO v_xp FROM profiles WHERE id = v_user_id;
    END IF;

    -- KRİTER 1: XP Basamakları
    IF v_xp >= 1000 THEN
        PERFORM award_badge_if_not_exists(v_user_id, 'XP Avcısı');
    END IF;
    
    -- KRİTER 2: İlk Adım (Her zaman verilir)
    PERFORM award_badge_if_not_exists(v_user_id, 'İlk Adım');

    -- KRİTER 3: Matematik Kurdu (Questions üzerinden kontrol edilir)
    SELECT COUNT(*) INTO v_math_count 
    FROM questions q
    JOIN solutions s ON s.question_id = q.id
    WHERE q.student_id = v_user_id AND q.subject ILIKE '%matematik%';
    
    IF v_math_count >= 10 THEN
        PERFORM award_badge_if_not_exists(v_user_id, 'Matematik Kurdu');
    END IF;

    -- KRİTER 4: Gece Kuşu (Saat kontrolü)
    IF EXTRACT(HOUR FROM now()) BETWEEN 0 AND 4 THEN
        PERFORM award_badge_if_not_exists(v_user_id, 'Gece Kuşu');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Tetikleyicileri (Triggers) Oluştur
DROP TRIGGER IF EXISTS trg_check_badges_on_xp ON profiles;
CREATE TRIGGER trg_check_badges_on_xp
AFTER UPDATE OF xp ON profiles
FOR EACH ROW EXECUTE FUNCTION check_and_award_badges();

DROP TRIGGER IF EXISTS trg_check_badges_on_solution ON solutions;
CREATE TRIGGER trg_check_badges_on_solution
AFTER INSERT ON solutions
FOR EACH ROW EXECUTE FUNCTION check_and_award_badges();

-- 4. Mevcut Kullanıcılar İçin Bir Kez Çalıştır (Opsiyonel Manuel Çağrı)
-- DO $$ 
-- DECLARE r RECORD;
-- BEGIN
--     FOR r IN SELECT id FROM profiles WHERE role = 'student' LOOP
--         PERFORM award_badge_if_not_exists(r.id, 'İlk Adım');
--     END LOOP;
-- END $$;
