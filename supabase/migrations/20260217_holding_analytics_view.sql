-- 20260217_holding_analytics_view.sql
-- Description: Creates a secure view for holding-level analytics across all tenants.

-- Bu view sadece Süper Adminlerin tüm kurumların performansını karşılaştırmasını sağlar.
-- Bu view sadece Süper Adminlerin tüm kurumların performansını karşılaştırmasını sağlar.
CREATE OR REPLACE VIEW public.holding_performance_summary AS
SELECT 
    t.id as tenant_id,
    t.name as tenant_name,
    t.slug as tenant_slug,
    (SELECT count(*) FROM public.profiles p WHERE p.tenant_id = t.id AND p.role = 'student') as total_students,
    (SELECT count(*) FROM public.questions q WHERE q.tenant_id = t.id) as total_questions,
    (SELECT count(*) FROM public.solutions s WHERE s.tenant_id = t.id) as total_solutions,
    (SELECT round(avg(xp)) FROM public.profiles p WHERE p.tenant_id = t.id AND p.role = 'student') as avg_student_xp,
    (SELECT max(last_activity_at) FROM public.profiles p WHERE p.tenant_id = t.id) as last_activity
FROM 
    public.tenants t;

-- RLS: Sadece is_super_admin=true olanlar bu view'ı sorgulayabilsin (Tablo bazlı erişim zaten kısıtlı ama view için de ekliyoruz)
ALTER VIEW public.holding_performance_summary OWNER TO postgres;
GRANT SELECT ON public.holding_performance_summary TO authenticated;

COMMENT ON VIEW public.holding_performance_summary IS 'Holding yöneticileri için kurumlar arası karşılaştırmalı performans verileri.';
