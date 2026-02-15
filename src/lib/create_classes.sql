-- 🏫 OKUL YÖNETİM SİSTEMİ VERİTABANI KURULUMU 🏫
-- Bu kodu Supabase Dashboard -> SQL Editor kısmına yapıştırıp RUN butonuna basın.

-- 1. Sınıflar Tablosu (Classes)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- örn: "12-A Matematik"
    description TEXT,
    schedule TEXT, -- örn: "Pazartesi 09:00"
    color TEXT DEFAULT 'blue' -- UI için renk kodu (blue, green, purple, orange)
);

-- 2. Sınıf-Öğrenci Bağlantı Tablosu (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.class_students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(class_id, student_id) -- Bir öğrenci aynı sınıfa iki kez eklenemez
);

-- 3. RLS (Güvenlik) Politikalarını Aktif Et
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;

-- --- CLASSES POLİTİKALARI ---

DROP POLICY IF EXISTS "Teachers can view own classes" ON public.classes;
CREATE POLICY "Teachers can view own classes" 
ON public.classes FOR SELECT 
USING (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Teachers can insert classes" ON public.classes;
CREATE POLICY "Teachers can insert classes" 
ON public.classes FOR INSERT 
WITH CHECK (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Teachers can update own classes" ON public.classes;
CREATE POLICY "Teachers can update own classes" 
ON public.classes FOR UPDATE 
USING (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Teachers can delete own classes" ON public.classes;
CREATE POLICY "Teachers can delete own classes" 
ON public.classes FOR DELETE 
USING (auth.uid() = teacher_id);

-- --- CLASS_STUDENTS POLİTİKALARI ---

DROP POLICY IF EXISTS "Teachers can view students in their classes" ON public.class_students;
CREATE POLICY "Teachers can view students in their classes" 
ON public.class_students FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.classes 
        WHERE classes.id = class_students.class_id 
        AND classes.teacher_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Teachers can manage students in their classes" ON public.class_students;
CREATE POLICY "Teachers can manage students in their classes" 
ON public.class_students FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.classes 
        WHERE classes.id = class_students.class_id 
        AND classes.teacher_id = auth.uid()
    )
);

-- 5. Realtime'ı aç (Hata verirse göz ardı edilebilir)
-- Eğer tablo zaten yayındaysa hata verir, bu normaldir.
ALTER PUBLICATION supabase_realtime ADD TABLE public.classes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.class_students;
