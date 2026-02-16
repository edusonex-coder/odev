-- =====================================================
-- PARENT WEEKLY REPORTS SYSTEM
-- Tarih: 16 Şubat 2026
-- Amaç: Veliler için AI destekli haftalık gelişim raporları
-- =====================================================

-- 1. Parent Reports Tablosu
-- =====================================================
CREATE TABLE IF NOT EXISTS parent_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    
    -- Metrikler
    total_questions INTEGER DEFAULT 0,
    solved_questions INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0,
    total_xp_gained INTEGER DEFAULT 0,
    level_ups INTEGER DEFAULT 0,
    
    -- AI Oluşturulmuş İçerik
    ai_summary TEXT,
    ai_highlights JSONB DEFAULT '[]'::jsonb,
    ai_recommendations TEXT,
    
    -- Konu Dağılımı (opsiyonel, şimdilik basit tutuyoruz)
    subject_breakdown JSONB DEFAULT '{}'::jsonb,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint: Her öğrenci için haftada bir rapor
    UNIQUE(student_id, week_start)
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_parent_reports_parent_id ON parent_reports(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_reports_student_id ON parent_reports(student_id);
CREATE INDEX IF NOT EXISTS idx_parent_reports_week ON parent_reports(week_start, week_end);

-- RLS Politikaları
ALTER TABLE parent_reports ENABLE ROW LEVEL SECURITY;

-- Veliler sadece kendi raporlarını görebilir
DROP POLICY IF EXISTS "Parents can view their own reports" ON parent_reports;
CREATE POLICY "Parents can view their own reports"
    ON parent_reports FOR SELECT
    USING (parent_id = auth.uid());

-- Sistem (backend) raporları oluşturabilir
DROP POLICY IF EXISTS "System can insert reports" ON parent_reports;
CREATE POLICY "System can insert reports"
    ON parent_reports FOR INSERT
    WITH CHECK (true);

-- Sistem raporları güncelleyebilir
DROP POLICY IF EXISTS "System can update reports" ON parent_reports;
CREATE POLICY "System can update reports"
    ON parent_reports FOR UPDATE
    USING (true);

-- =====================================================
-- 2. RPC: Haftalık Rapor Verilerini Getir
-- =====================================================
CREATE OR REPLACE FUNCTION get_student_weekly_stats(
    p_student_id UUID,
    p_week_start DATE,
    p_week_end DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB;
    v_total_questions INTEGER;
    v_solved_questions INTEGER;
    v_success_rate DECIMAL(5,2);
    v_total_xp INTEGER;
    v_level_ups INTEGER;
    v_recent_questions JSONB;
BEGIN
    -- Soru istatistikleri
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM solutions s WHERE s.question_id = questions.id))
    INTO v_total_questions, v_solved_questions
    FROM questions
    WHERE student_id = p_student_id
        AND created_at >= p_week_start
        AND created_at < p_week_end + INTERVAL '1 day';
    
    -- Başarı oranı
    IF v_total_questions > 0 THEN
        v_success_rate := (v_solved_questions::DECIMAL / v_total_questions) * 100;
    ELSE
        v_success_rate := 0;
    END IF;
    
    -- XP kazanımı
    SELECT COALESCE(SUM(amount), 0)
    INTO v_total_xp
    FROM xp_logs
    WHERE user_id = p_student_id
        AND created_at >= p_week_start
        AND created_at < p_week_end + INTERVAL '1 day';
    
    -- Seviye atlamaları (basit hesaplama)
    v_level_ups := FLOOR(v_total_xp / 1000);
    
    -- Son sorular (en fazla 5 tane)
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', q.id,
                'question_text', LEFT(q.question_text, 100),
                'status', q.status,
                'created_at', q.created_at
            )
            ORDER BY q.created_at DESC
        ) FILTER (WHERE q.id IS NOT NULL),
        '[]'::jsonb
    )
    INTO v_recent_questions
    FROM (
        SELECT * FROM questions
        WHERE student_id = p_student_id
            AND created_at >= p_week_start
            AND created_at < p_week_end + INTERVAL '1 day'
        ORDER BY created_at DESC
        LIMIT 5
    ) q;
    
    -- Sonuç JSON'u oluştur
    v_result := jsonb_build_object(
        'total_questions', v_total_questions,
        'solved_questions', v_solved_questions,
        'success_rate', v_success_rate,
        'total_xp_gained', v_total_xp,
        'level_ups', v_level_ups,
        'recent_questions', v_recent_questions
    );
    
    RETURN v_result;
END;
$$;

-- =====================================================
-- 3. RPC: Veli İçin Haftalık Rapor Listesi
-- =====================================================
CREATE OR REPLACE FUNCTION get_parent_weekly_reports()
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
    FROM parent_reports pr
    JOIN profiles p ON p.id = pr.student_id
    WHERE pr.parent_id = auth.uid()
    ORDER BY pr.week_start DESC, p.full_name;
END;
$$;

-- =====================================================
-- NOTLAR
-- =====================================================
-- 1. AI özet metinleri frontend'den Groq API ile oluşturulacak
-- 2. Raporlar cache olarak saklanacak (her hafta bir kez oluşturulur)
-- 3. Veli panelinde "Rapor Oluştur" butonu olacak
-- 4. Otomatik rapor oluşturma için cron job eklenebilir (gelecekte)
