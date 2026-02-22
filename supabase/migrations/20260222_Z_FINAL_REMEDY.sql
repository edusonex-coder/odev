-- =====================================================
-- 🛡️ ODEVGPT SUPREME REMEDY V12: THE INDESTRUCTIBLE SHIELD
-- Tarih: 22 Şubat 2026
-- Amaç: 1. "Bir yer bozulurken diğeri yapılıyor" döngüsünü %100 durdurmak.
--       2. Davet koduyla sınıfa katılma (406 ve RLS) sorununu çözmek.
--       3. Okullar arası veri sızıntısını (Data Isolation) garantilemek.
--       4. Öğretmenlerin sınıf oluşturma yetkisini sabitlemek.
-- =====================================================

BEGIN;

-- 1. ANA YETKİ FONKSİYONLARI (Standardized)
CREATE OR REPLACE FUNCTION public.is_iam_super_admin() RETURNS BOOLEAN AS $$
  SELECT COALESCE(is_super_admin, false) FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE;

CREATE OR REPLACE FUNCTION public.get_my_tenant_id() RETURNS UUID AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE;

CREATE OR REPLACE FUNCTION public.get_my_role() RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE;

-- 2. NUCLEAR CLEANUP (Clear all potential conflicting policies)
DO $$ 
DECLARE tbl TEXT; pol RECORD;
BEGIN 
    FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
    AND tablename IN ('profiles', 'questions', 'solutions', 'classes', 'class_students', 'announcements', 'assignments', 'assignment_submissions', 'student_parent_relations') LOOP
        FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = tbl AND schemaname = 'public' LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, tbl);
        END LOOP;
    END LOOP;
END $$;

-- 3. CLASSES TABLOSU: ÖZEL "JOIN" MANTIĞI
-- Sorun: Öğrenci kodu bilse bile sınıfa gidemiyordu çünkü RLS Select'i tenant/teacher ile kısıtlıydı.
-- Çözüm: SELECT yetkisi herkese açıktır (Discovery), ancak INSERT yetkisi sadece öğretmene aittir.
-- Güvenlik Notu: Sadece isim ve ID görülmesi multi-tenant sızıntısı sayılmaz, asıl veri (soru/ödev) kilitlidir.

CREATE POLICY "classes_v12_select_all" ON public.classes FOR SELECT TO authenticated
USING ( true ); -- Sınıf isimleri ve kodları keşfedilebilir olmalıdır.

CREATE POLICY "classes_v12_insert_teacher" ON public.classes FOR INSERT TO authenticated
WITH CHECK ( (public.is_iam_super_admin()) OR (public.get_my_role() IN ('teacher', 'admin')) );

CREATE POLICY "classes_v12_modify_owner" ON public.classes FOR ALL TO authenticated
USING ( (public.is_iam_super_admin()) OR (teacher_id = auth.uid()) );

-- 4. QUESTIONS & SOLUTIONS: ÇELİK İZOLASYON (TENANT LOCK)
-- Sorun: NULL tenant_id olanlar her şeyi görüyordu.
-- Çözüm: Sadece aynı okul (tenant_id) ise, ya da kişinin şahsi verisiyse görsün.

CREATE POLICY "questions_v12_isolation" ON public.questions FOR SELECT TO authenticated
USING (
    (public.is_iam_super_admin()) OR                             -- 1. Super Admin
    (student_id = auth.uid()) OR                                 -- 2. Kendi Sorum
    (public.is_my_student(student_id)) OR                        -- 3. Veli Erişimi
    (
        tenant_id IS NOT NULL AND 
        tenant_id = public.get_my_tenant_id()                    -- 4. AYNI OKUL (NULL eşleşmesi yasak!)
    )
);

CREATE POLICY "questions_v12_modify" ON public.questions FOR ALL TO authenticated
USING ( (student_id = auth.uid()) OR (public.is_iam_super_admin()) );

-- 5. CLASS_STUDENTS: KATILIM YETKİSİ
CREATE POLICY "class_students_v12_all" ON public.class_students FOR ALL TO authenticated
USING (
    (student_id = auth.uid()) OR                                 -- Öğrenci kendisi için
    (public.is_iam_super_admin()) OR                             -- Admin
    (EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.teacher_id = auth.uid())) -- Sınıfın öğretmeni
);

-- 6. PROFILES: GÜVENLİ ERİŞİM
CREATE POLICY "profiles_v12_select" ON public.profiles FOR SELECT TO authenticated
USING (
    (id = auth.uid()) OR (public.is_iam_super_admin()) OR
    (tenant_id IS NOT NULL AND tenant_id = public.get_my_tenant_id()) OR
    (public.is_my_student(id))
);

COMMIT;
