-- =====================================================
-- 🛡️ ODEVGPT CLASS SYSTEM SECURITY REPAIR
-- Tarih: 22 Şubat 2026
-- Amaç: Öğretmenlerin sınıf oluşturma, güncelleme ve silme yetkilerini tamir etmek.
--       Önceki performans optimizasyonu sadece SELECT izni vermişti.
-- =====================================================

BEGIN;

-- 1. CLASSES RLS (Yıkıp Yeniden Yap)
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "p_classes_sel" ON public.classes;
DROP POLICY IF EXISTS "Authenticated users can view classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can manage own classes" ON public.classes;

-- Herkes sınıfları görebilmeli (Katılmak için kod sorgulama vb.)
CREATE POLICY "classes_select_policy" ON public.classes
FOR SELECT TO authenticated
USING (true);

-- Öğretmenler kendi sınıflarını oluşturabilir
CREATE POLICY "classes_insert_policy" ON public.classes
FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- Öğretmenler kendi sınıflarını güncelleyebilir ve silebilir
CREATE POLICY "classes_modify_policy" ON public.classes
FOR ALL TO authenticated
USING (
    teacher_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 2. CLASS_STUDENTS RLS (Öğrencilerin Katılması)
ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can join classes" ON public.class_students;
DROP POLICY IF EXISTS "Students can view own memberships" ON public.class_students;

CREATE POLICY "class_students_select" ON public.class_students
FOR SELECT TO authenticated
USING (
    student_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.classes WHERE id = class_id AND teacher_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "class_students_insert" ON public.class_students
FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid());

COMMIT;

DO $$ 
BEGIN 
  RAISE NOTICE '✅ CLASS SECURITY REPAIR: Sınıf yönetim yetkileri düzeltildi.'; 
END $$;
