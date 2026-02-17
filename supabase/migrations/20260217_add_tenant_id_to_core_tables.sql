-- 20260217_add_tenant_id_to_core_tables.sql
-- Description: Adds tenant_id to questions and solutions for better multi-tenancy and RLS.

-- 1. Questions tablosuna tenant_id ekle
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- 2. Mevcut soruları öğrencinin kurumuna göre güncelle
UPDATE public.questions q
SET tenant_id = p.tenant_id
FROM public.profiles p
WHERE q.student_id = p.id AND q.tenant_id IS NULL;

-- 3. Solutions tablosuna tenant_id ekle (Daha hızlı sorgu ve RLS için)
ALTER TABLE public.solutions ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- 4. Mevcut çözümleri sorunun kurumuna göre güncelle
UPDATE public.solutions s
SET tenant_id = q.tenant_id
FROM public.questions q
WHERE s.question_id = q.id AND s.tenant_id IS NULL;

-- 5. Indexler
CREATE INDEX IF NOT EXISTS idx_questions_tenant_id ON public.questions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_solutions_tenant_id ON public.solutions(tenant_id);

COMMENT ON COLUMN public.questions.tenant_id IS 'Sorunun ait olduğu kurum.';
COMMENT ON COLUMN public.solutions.tenant_id IS 'Çözümün ait olduğu kurum.';
