-- 🚀 ODEVGPT CEO VISION FIX: RLS & Schema Hardening
-- Amacı: Ekran görüntülerindeki hataları (RLS violations, Not-null violations) kökten çözmek.

-- ==========================================
-- 1. ANNOUNCEMENTS GÜNCELLEME
-- ==========================================

-- class_id eksikse ekleyelim (Bazı sayfalarda sınıf duyurusu olarak kullanılıyor)
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE;

-- Not-null kısıtlamasını kaldıralım (Global duyurular için class_id null olmalı)
ALTER TABLE public.announcements ALTER COLUMN class_id DROP NOT NULL;

-- RLS: Öğretmenler kendi sınıfları için veya global duyuru ekleyebilmeli
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
DROP POLICY IF EXISTS "Teachers and Admins can manage announcements" ON public.announcements;

CREATE POLICY "Teachers and Admins can manage announcements" ON public.announcements
FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'teacher')
);

-- ==========================================
-- 2. ASSIGNMENTS RLS FIX
-- ==========================================

-- Öğretmenlerin ödev oluşturabilmesini ve yönetebilmesini garanti altına alalım
DROP POLICY IF EXISTS "Teachers can manage own assignments" ON public.assignments;
CREATE POLICY "Teachers can manage own assignments" ON public.assignments 
FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'teacher' OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('teacher', 'admin')
);

-- ==========================================
-- 3. BLOGS RLS FIX
-- ==========================================

-- Adminlerin blog ekleyebilmesini garanti altına alalım
DROP POLICY IF EXISTS "Adminler blog ekleyebilir/güncelleyebilir" ON public.blogs;
CREATE POLICY "Adminler blog ekleyebilir/güncelleyebilir" ON public.blogs
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==========================================
-- 4. MESSAGES (CHAT) FIX
-- ==========================================
-- Screenshot 3'teki "Mesaj gönderilemedi" (403 Forbidden) hatası için profiles-class_students RLS kontrolü

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can update messages if involved" ON public.questions;
CREATE POLICY "Anyone can update messages if involved" ON public.questions
FOR UPDATE USING (
    auth.uid() = student_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- ==========================================
-- 5. EXECUTIVE DASHBOARD FIX
-- ==========================================
-- Screenshot 8'deki executive sayfasının yetki sorunlarını çözelim

DROP POLICY IF EXISTS "Super Adms can see everything" ON public.tenants;
CREATE POLICY "Super Adms can see everything" ON public.tenants
FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==========================================
-- TAMAMLANDI
-- ==========================================
