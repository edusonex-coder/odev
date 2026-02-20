
-- 📊 OdevGPT Öğretmen Analitiği & Insight Sistemi (DÜZELTİLMİŞ)
-- Tarih: 21 Şubat 2026

-- Eskileri temizle (View kolon değişikliği hatasını önlemek için)
DROP VIEW IF EXISTS public.student_performance_metrics CASCADE;

-- 1. AI Insight Raporlarını Saklama Tablosu
CREATE TABLE IF NOT EXISTS public.class_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    weak_topics JSONB NOT NULL DEFAULT '[]',
    average_success_rate NUMERIC(5,2),
    total_questions_analyzed INTEGER,
    ai_recommendations TEXT,
    suggested_exercises JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Öğrenci Performans Metrikleri View'i
-- Bu view, her öğrencinin toplam/çözülen sorularını ve başarı oranını anlık hesaplar.
CREATE VIEW public.student_performance_metrics AS
SELECT 
    p.id as student_id,
    p.full_name as student_name,
    c.id as class_id,
    COUNT(q.id) as total_questions,
    COUNT(q.id) FILTER (WHERE q.status IN ('solved', 'ai_answered')) as solved_questions,
    CASE 
        WHEN COUNT(q.id) > 0 THEN 
            (COUNT(q.id) FILTER (WHERE q.status IN ('solved', 'ai_answered')))::NUMERIC / COUNT(q.id)
        ELSE 0 
    END as success_rate,
    p.xp as total_xp,
    p.level as current_level
FROM 
    public.profiles p
JOIN 
    public.class_students cs ON p.id = cs.student_id
JOIN 
    public.classes c ON cs.class_id = c.id
LEFT JOIN 
    public.questions q ON p.id = q.student_id
WHERE 
    p.role = 'student'
GROUP BY 
    p.id, p.full_name, c.id, p.xp, p.level;

-- 3. Sınıfın Zayıf Konularını Analiz Eden RPC
CREATE OR REPLACE FUNCTION public.get_class_weak_topics(p_class_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    topic TEXT,
    difficulty_score NUMERIC,
    student_count INTEGER,
    avg_attempts NUMERIC
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.subject as topic,
        (1 - (COUNT(q.id) FILTER (WHERE q.status IN ('solved', 'ai_answered')))::NUMERIC / COUNT(q.id)) as difficulty_score,
        COUNT(DISTINCT q.student_id)::INTEGER as student_count,
        1.5 as avg_attempts
    FROM 
        public.questions q
    JOIN 
        public.class_students cs ON q.student_id = cs.student_id
    WHERE 
        cs.class_id = p_class_id
    GROUP BY 
        q.subject
    HAVING 
        COUNT(q.id) > 0
    ORDER BY 
        difficulty_score DESC
    LIMIT p_limit;
END;
$$;

-- 4. RLS Güvenliği
ALTER TABLE public.class_insights ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Teachers can manage insights of their classes') THEN
        CREATE POLICY "Teachers can manage insights of their classes" 
        ON public.class_insights FOR ALL
        USING (EXISTS (
            SELECT 1 FROM public.classes c 
            WHERE c.id = class_insights.class_id AND c.teacher_id = auth.uid()
        ));
    END IF;
END $$;
