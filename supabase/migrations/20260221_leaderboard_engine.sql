-- 🏆 OdevGPT LEADERBOARD ENGINE v2
-- Haftalık XP sıralaması ve Rozet entegrasyonu için gereken altyapı.

-- 1. Haftalık XP Hesaplama Fonksiyonu
CREATE OR REPLACE FUNCTION get_leaderboard_v2(
    p_tenant_id UUID DEFAULT NULL,
    p_period TEXT DEFAULT 'all_time', -- 'all_time' veya 'weekly'
    p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    xp BIGINT,
    level INTEGER,
    avatar_url TEXT,
    tenant_id UUID,
    rank BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_period = 'weekly' THEN
        RETURN QUERY
        WITH weekly_xp AS (
            SELECT 
                user_id, 
                SUM(amount)::BIGINT as period_xp 
            FROM xp_logs 
            WHERE created_at > (now() - interval '7 days')
            GROUP BY user_id
        )
        SELECT 
            p.id,
            p.full_name,
            COALESCE(w.period_xp, 0)::BIGINT as xp,
            p.level,
            p.avatar_url,
            p.tenant_id,
            ROW_NUMBER() OVER(ORDER BY COALESCE(w.period_xp, 0) DESC, p.xp DESC) as rank
        FROM profiles p
        LEFT JOIN weekly_xp w ON p.id = w.user_id
        WHERE p.role = 'student'
          AND (p_tenant_id IS NULL OR p.tenant_id = p_tenant_id)
        ORDER BY xp DESC
        LIMIT p_limit;
    ELSE
        -- Global / All Time
        RETURN QUERY
        SELECT 
            p.id,
            p.full_name,
            p.xp::BIGINT,
            p.level,
            p.avatar_url,
            p.tenant_id,
            ROW_NUMBER() OVER(ORDER BY p.xp DESC) as rank
        FROM profiles p
        WHERE p.role = 'student'
          AND (p_tenant_id IS NULL OR p.tenant_id = p_tenant_id)
        ORDER BY p.xp DESC
        LIMIT p_limit;
    END IF;
END;
$$;
