-- 1. Bloglar Tablosu Oluşturma
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    author_id UUID REFERENCES public.profiles(id) DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    seo_title TEXT,
    seo_description TEXT,
    geo_target TEXT,
    is_published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0
);

-- 2. Görüntülenme Sayısını Artıran RPC Fonksiyonu
CREATE OR REPLACE FUNCTION increment_blog_views(blog_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE blogs
    SET view_count = view_count + 1
    WHERE id = blog_id;
END;
$$ LANGUAGE plpgsql;

-- 3. RLS Politikalarını Aktive Etme
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Politikalar
DROP POLICY IF EXISTS "Herkes yayındaki blogları görebilir" ON public.blogs;
CREATE POLICY "Herkes yayındaki blogları görebilir" ON public.blogs
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Adminler tüm blogları görebilir" ON public.blogs;
CREATE POLICY "Adminler tüm blogları görebilir" ON public.blogs
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

DROP POLICY IF EXISTS "Adminler blog ekleyebilir/güncelleyebilir" ON public.blogs;
CREATE POLICY "Adminler blog ekleyebilir/güncelleyebilir" ON public.blogs
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));
