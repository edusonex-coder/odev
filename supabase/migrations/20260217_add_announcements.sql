-- 20260217_add_announcements.sql
-- Description: Adds announcements table for internal communication.

CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_active BOOLEAN DEFAULT TRUE,
    is_global BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Kolonların varlığını garanti altına alalım (eğer tablo eskiden kaldıysa)
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS is_global BOOLEAN DEFAULT FALSE;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'info';

-- RLS Politikaları
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Herkes aktif duyuruları görebilir (Kendi tenant'ı veya Global olanlar)
CREATE POLICY "Users can view relevant announcements" ON public.announcements
    FOR SELECT USING (
        is_active = TRUE AND (
            is_global = TRUE OR 
            tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) OR
            (SELECT is_super_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
        )
    );

-- Adminler duyuru oluşturabilir/düzenleyebilir
CREATE POLICY "Admins can manage announcements" ON public.announcements
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

COMMENT ON TABLE public.announcements IS 'Kurumsal ve genel sistem duyuruları.';
