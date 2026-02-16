-- =====================================================
-- XP CHART DATA RPC
-- Tarih: 16 Şubat 2026
-- Amaç: Veli panelindeki XP grafiği için günlük XP toplamlarını getir
-- =====================================================

CREATE OR REPLACE FUNCTION get_student_daily_xp(
    p_student_id UUID,
    p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
    day_name TEXT,
    day_date DATE,
    total_xp INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH date_series AS (
        SELECT 
            generate_series(
                CURRENT_DATE - (p_days - 1),
                CURRENT_DATE,
                '1 day'::interval
            )::date AS day_date
    ),
    daily_totals AS (
        SELECT 
            DATE(created_at) as xp_date,
            COALESCE(SUM(amount), 0) as daily_xp
        FROM xp_logs
        WHERE user_id = p_student_id
            AND created_at >= CURRENT_DATE - (p_days - 1)
        GROUP BY DATE(created_at)
    )
    SELECT 
        CASE EXTRACT(DOW FROM ds.day_date)
            WHEN 0 THEN 'Paz'
            WHEN 1 THEN 'Pzt'
            WHEN 2 THEN 'Sal'
            WHEN 3 THEN 'Çar'
            WHEN 4 THEN 'Per'
            WHEN 5 THEN 'Cum'
            WHEN 6 THEN 'Cmt'
        END as day_name,
        ds.day_date,
        COALESCE(dt.daily_xp, 0)::INTEGER as total_xp
    FROM date_series ds
    LEFT JOIN daily_totals dt ON ds.day_date = dt.xp_date
    ORDER BY ds.day_date;
END;
$$;

-- Test için örnek kullanım:
-- SELECT * FROM get_student_daily_xp('student-uuid-buraya', 7);
