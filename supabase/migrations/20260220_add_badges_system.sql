
-- 🏆 OdevGPT Rozet Sistemi Migrasyonu (DÜZELTİLMİŞ)
-- Tarih: 20 Şubat 2026

-- Eskileri temizle (Tip uyuşmazlığını gidermek için)
DROP TABLE IF EXISTS public.user_badges CASCADE;
DROP TABLE IF EXISTS public.badges CASCADE;

-- 1. Rozet Tanımları Tablosu
CREATE TABLE public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    secret BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Kullanıcı Rozetleri (Kazanılanlar)
-- NOT: profiles.id UUID değilse burada 'user_id' tipini ona uydurmalıyız. 
-- Supabase Auth default olarak UUID kullanır.
CREATE TABLE public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, badge_id)
);

-- 3. RLS Güvenliği
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are viewable by everyone" ON public.badges FOR SELECT USING (true);
CREATE POLICY "User badges are viewable by everyone" ON public.user_badges FOR SELECT USING (true);

-- 4. Başlangıç Rozetlerini Ekle
INSERT INTO public.badges (name, description, icon, category) VALUES
('İlk Adım', 'OdevGPT dünyasına ilk adımı attın! Hoş geldin.', '🚀', 'general'),
('Sokratik Çömez', 'AI ile ilk başarılı sohbetini tamamladın.', '🦉', 'academic'),
('XP Avcısı', '1,000 XP barajını aştın.', '💰', 'general'),
('Gece Kuşu', 'Gece 00:00''dan sonra ders çalıştın.', '🌙', 'secret'),
('Matematik Kurdu', '10 adet matematik sorusu çözdün.', '🐺', 'academic'),
('Fen Dehası', '10 adet fen sorusu çözdün.', '🧪', 'academic'),
('Seri Ustası', '3 günlük çalışma serisi yakaladın.', '🔥', 'streak');
