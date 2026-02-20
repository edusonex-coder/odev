-- 🎓 OdevGPT Achievement Certificate System
-- Öğrencilerin akademik başarılarını ve dönüm noktalarını belgeleyen sistem.

-- 1. Sertifikalar Tablosu
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'academic_excellence', 'streak_master', 'level_milestone', 'subject_expert'
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}', -- {score, level, subject, etc.}
    certificate_code TEXT UNIQUE NOT NULL,
    ai_commendation TEXT, -- AI tarafından üretilen kişiye özel tebrik mesajı
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS Ayarları
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own certificates"
ON public.certificates FOR SELECT
USING (auth.uid() = user_id);

-- 3. Sertifika Üretme Yardımcı Fonksiyonu
CREATE OR REPLACE FUNCTION issue_certificate(
    p_user_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_description TEXT,
    p_metadata JSONB DEFAULT '{}',
    p_ai_commendation TEXT DEFAULT NULL
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_code TEXT;
    v_cert_id UUID;
BEGIN
    -- Benzersiz sertifika kodu üret (Örn: OG-2026-ABC12)
    v_code := 'OG-' || to_char(now(), 'YYYY') || '-' || upper(substring(md5(random()::text) from 1 for 6));
    
    INSERT INTO public.certificates (user_id, type, title, description, metadata, certificate_code, ai_commendation)
    VALUES (p_user_id, p_type, p_title, p_description, p_metadata, v_code, p_ai_commendation)
    RETURNING id INTO v_cert_id;

    -- Bildirim gönder
    INSERT INTO public.notifications (user_id, title, content, type)
    VALUES (p_user_id, 'Yeni Sertifika Kazandın! 📜', p_title || ' sertifikan hazır.', 'success');

    RETURN v_cert_id;
END;
$$;
