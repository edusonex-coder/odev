-- 🩺 DOCTOR TRAINING: SCHEMA HEALER (21 Şubat 2026)
-- Amaç: Konsoldaki 'announcements' ve 'blogs' şema hatalarını kökten çözmek.

-- ======================================================
-- 1. ANNOUNCEMENTS: Sütun Sağlamlaştırma
-- ======================================================
-- Frontend 'title', 'class_id' ve 'teacher_id' bekliyor.
-- Mismatch Fix: Migration created_by kullanıyordu ama frontend teacher_id gönderiyor.

DO $$ 
BEGIN
    -- Tablo yoksa oluştur, varsa eksikleri tamamla
    CREATE TABLE IF NOT EXISTS public.announcements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
        title TEXT NOT NULL DEFAULT 'Duyuru',
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );

    -- Eksik kolonları ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'class_id') THEN
        ALTER TABLE public.announcements ADD COLUMN class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'teacher_id') THEN
        ALTER TABLE public.announcements ADD COLUMN teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'type') THEN
        ALTER TABLE public.announcements ADD COLUMN type TEXT DEFAULT 'info';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'is_active') THEN
        ALTER TABLE public.announcements ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'is_global') THEN
        ALTER TABLE public.announcements ADD COLUMN is_global BOOLEAN DEFAULT FALSE;
    END IF;

END $$;

-- RLS Politikaları
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view relevant announcements" ON public.announcements;
CREATE POLICY "Anyone can view relevant announcements" ON public.announcements
FOR SELECT TO authenticated
USING (
    is_active = TRUE AND (
        is_global = TRUE OR 
        class_id IN (SELECT class_id FROM public.class_students WHERE student_id = auth.uid()) OR
        -- Parent Access: Veli çocuğunun sınıfındaki duyuruları görebilmeli
        class_id IN (
            SELECT cs.class_id 
            FROM public.class_students cs
            JOIN public.student_parent_relations spr ON spr.student_id = cs.student_id
            WHERE spr.parent_id = auth.uid()
        ) OR
        teacher_id = auth.uid() OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    )
);

DROP POLICY IF EXISTS "Teachers can manage their own announcements" ON public.announcements;
CREATE POLICY "Teachers can manage their own announcements"
ON public.announcements FOR ALL
TO authenticated
USING (
    teacher_id = auth.uid() OR 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
    teacher_id = auth.uid() OR 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- ======================================================
-- 2. BLOGS: Foreign Key İlişkisini Onar
-- ======================================================
-- 'author_id' sütunu ile 'profiles' tablosu arasındaki ilişkiyi PostgREST'e hatırlat.

DO $$ 
BEGIN
    -- Kolonun varlığını kontrol et
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'author_id') THEN
        ALTER TABLE public.blogs ADD COLUMN author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;

    -- İlişkiyi yeniden kur
    ALTER TABLE public.blogs DROP CONSTRAINT IF EXISTS blogs_author_id_fkey;
    ALTER TABLE public.blogs 
    ADD CONSTRAINT blogs_author_id_fkey 
    FOREIGN KEY (author_id) 
    REFERENCES public.profiles(id) 
    ON DELETE SET NULL;

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Blog author_id onarılamadı: %', SQLERRM;
END $$;

-- ======================================================
-- 3. SCHEMA CACHE REFRESH
-- ======================================================
-- PostgREST'in yeni sütunları ve ilişkileri görmesini sağla
NOTIFY pgrst, 'reload schema';

DO $$
BEGIN
    RAISE NOTICE '✅ Şema Doktoru Eğitildi: announcements ve blogs onarıldı.';
END $$;
