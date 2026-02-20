-- 📊 OdevGPT Teacher Analytics Engine v2.1
-- Sınıf performansını analiz eden ve pedagojik öngörüler sunan geliştirilmiş motor.

-- 1. Sınıf Analizi Tablosunu Güncelle (Eğer gerekliyse)
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

-- 2. Gelişmiş Zayıf Konu Analizi RPC
-- Sadece zayıf konuları değil, trendi (iyileşiyor mu/kötüleşiyor mu) de hesaplar.
CREATE OR REPLACE FUNCTION public.get_class_analytics_v2(p_class_id UUID)
RETURNS TABLE (
    topic TEXT,
    success_rate NUMERIC,
    trend TEXT, -- 'improving', 'declining', 'stable'
    student_count INTEGER,
    total_questions INTEGER
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    WITH topic_stats AS (
        SELECT 
            q.subject as t_topic,
            COUNT(q.id) as total_q,
            COUNT(q.id) FILTER (WHERE q.status IN ('solved', 'ai_answered')) as solved_q,
            COUNT(q.id) FILTER (WHERE q.created_at >= (now() - interval '7 days')) as recent_q,
            COUNT(q.id) FILTER (WHERE q.created_at >= (now() - interval '7 days') AND q.status IN ('solved', 'ai_answered')) as recent_solved_q,
            COUNT(DISTINCT q.student_id) as students
        FROM public.questions q
        JOIN public.class_students cs ON q.student_id = cs.student_id
        WHERE cs.class_id = p_class_id
        GROUP BY q.subject
    )
    SELECT 
        t_topic as topic,
        (solved_q::NUMERIC / NULLIF(total_q, 0)) as success_rate,
        CASE 
            WHEN (recent_solved_q::NUMERIC / NULLIF(recent_q, 0)) > (solved_q::NUMERIC / NULLIF(total_q, 0)) + 0.1 THEN 'improving'
            WHEN (recent_solved_q::NUMERIC / NULLIF(recent_q, 0)) < (solved_q::NUMERIC / NULLIF(total_q, 0)) - 0.1 THEN 'declining'
            ELSE 'stable'
        END as trend,
        students::INTEGER,
        total_q::INTEGER
    FROM topic_stats
    WHERE total_q > 0
    ORDER BY success_rate ASC;
END;
$$;

-- 3. Sınıf Genel Metrikleri RPC
CREATE OR REPLACE FUNCTION public.get_class_overall_metrics(p_class_id UUID)
RETURNS TABLE (
    avg_success_rate NUMERIC,
    total_xp_gained BIGINT,
    active_students INTEGER,
    total_questions_asked INTEGER
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        AVG(CASE WHEN q.status IN ('solved', 'ai_answered') THEN 1 ELSE 0 END)::NUMERIC as avg_success_rate,
        COALESCE(SUM(p.xp), 0)::BIGINT as total_xp_gained,
        COUNT(DISTINCT cs.student_id)::INTEGER as active_students,
        COUNT(q.id)::INTEGER as total_questions_asked
    FROM public.class_students cs
    LEFT JOIN public.profiles p ON p.id = cs.student_id
    LEFT JOIN public.questions q ON q.student_id = p.id
    WHERE cs.class_id = p_class_id;
END;
$$;
