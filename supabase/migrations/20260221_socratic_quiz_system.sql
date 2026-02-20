
-- 🚀 OdevGPT Sokratik Quiz & Eksik Kapatma Sistemi (DÜZELTİLMİŞ)
-- Tarih: 21 Şubat 2026

-- 1. Tabloları Güvenli Şekilde Oluştur
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    topic TEXT,
    difficulty TEXT DEFAULT 'medium',
    questions JSONB NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    score INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    answers JSONB,
    score INTEGER,
    completed_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS Politikalarını Temizle ve Yeniden Kur
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own quizzes" ON public.quizzes;
CREATE POLICY "Users can manage their own quizzes" 
ON public.quizzes FOR ALL
USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Users can manage their own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can manage their own quiz attempts" 
ON public.quiz_attempts FOR ALL
USING (auth.uid() = student_id);

-- 3. Yardımcı Fonksiyonu Güncelle
CREATE OR REPLACE FUNCTION public.get_student_latest_weak_topic(p_student_id UUID)
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
    v_topic TEXT;
BEGIN
    SELECT subject INTO v_topic
    FROM public.questions
    WHERE student_id = p_student_id AND (status = 'ai_answered' OR status = 'solved')
    GROUP BY subject
    ORDER BY COUNT(*) DESC
    LIMIT 1;
    
    RETURN v_topic;
END;
$$;
