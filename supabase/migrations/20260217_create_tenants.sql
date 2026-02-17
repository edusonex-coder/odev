-- PROJE ADI: OdevGPT
-- Create tenants table
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    domain TEXT, -- Optional: for mapping custom domains like 'isikdamper.online'
    logo_url TEXT,
    primary_color TEXT, -- HSL format: "263 84% 50%"
    secondary_color TEXT,
    favicon_url TEXT,
    hide_universe_section BOOLEAN DEFAULT false,
    hide_podcast_section BOOLEAN DEFAULT false,
    hide_video_section BOOLEAN DEFAULT false,
    video_position TEXT DEFAULT 'left' CHECK (video_position IN ('left', 'right')),
    dark_mode BOOLEAN DEFAULT false,
    hero_style TEXT DEFAULT 'gradient' CHECK (hero_style IN ('gradient', 'industrial', 'modern')),
    cto_name TEXT,
    cto_note TEXT,
    video_url TEXT,
    podcast_url TEXT,
    support_email TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Allow public read access to tenants (since branding config is public)
CREATE POLICY "Allow public read access to tenants"
ON public.tenants
FOR SELECT
USING (true);

-- Insert initial mock data
INSERT INTO public.tenants (
    name, slug, domain, logo_url, primary_color, secondary_color, 
    hide_universe_section, hide_podcast_section, cto_name, cto_note
) VALUES (
    'Odev Koleji', 
    'odevkolej', 
    'odevkolej.edusonex.com.tr', 
    'https://img.logoipsum.com/296.svg', 
    '210 100% 50%', 
    '210 20% 96%', 
    true, 
    true, 
    'Okul Koordinatörü', 
    'Öğrencilerimizin başarısı için en modern yapay zeka araçlarını müfredatımıza entegre ettik. Bu platform sadece bir ödev aracı değil, dijital bir eğitim yol arkadaşıdır.'
);

INSERT INTO public.tenants (
    name, slug, domain, logo_url, primary_color, secondary_color, 
    dark_mode, hero_style, hide_universe_section, hide_podcast_section, 
    hide_video_section, video_position, video_url, cto_name, cto_note
) VALUES (
    'IŞIK Akademi', 
    'isikdamper', 
    'isikdamper.online', 
    'https://img.logoipsum.com/280.svg', 
    '24 95% 53%', 
    '240 10% 4%', 
    true, 
    'industrial', 
    true, 
    true, 
    false, 
    'right', 
    'https://youtu.be/y8mSVCdbAWE', 
    'Akademi Müdürü', 
    'IŞIK Akademi olarak, teknik becerilerinizi yapay zeka destekli eğitim araçlarıyla en üst seviyeye taşıyoruz.'
);
