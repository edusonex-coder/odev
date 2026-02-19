-- Project: OdevGPT
-- 20260219_REFERRAL_VIRAL_LOOP.sql
-- Description: Implements a referral system for viral growth as per CMO directives.

-- 1. Profiles tablosuna davet kodu ekle
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS referred_by_code TEXT;

-- 2. Referral Tracking Table
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_awarded BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending', -- 'pending', 'converted', 'rewarded'
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(referred_id) -- Bir kullanıcı sadece bir kişi tarafından davet edilebilir
);

-- 3. Davet kodu üretme fonksiyonu
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        -- Basit bir 8 karakterli random kod (Örn: ABC123XY)
        NEW.referral_code := UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 8));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger'ı bağla
DROP TRIGGER IF EXISTS trigger_generate_referral_code ON public.profiles;
CREATE TRIGGER trigger_generate_referral_code
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION generate_referral_code();

-- 5. RPC: Davet Kodunu Kullan (Referral Bağlantısını Kur)
CREATE OR REPLACE FUNCTION process_referral(p_user_id UUID, p_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_referrer_id UUID;
BEGIN
    -- Davet koduna sahip kişiyi bul
    SELECT id INTO v_referrer_id FROM public.profiles WHERE referral_code = p_code;
    
    IF v_referrer_id IS NOT NULL AND v_referrer_id != p_user_id THEN
        -- Referral kaydı yap
        INSERT INTO public.referrals (referrer_id, referred_id, status)
        VALUES (v_referrer_id, p_user_id, 'converted')
        ON CONFLICT DO NOTHING;
        
        -- Profilde de işaretle
        UPDATE public.profiles SET referred_by_code = p_code WHERE id = p_user_id;
        
        -- Referans verene XP ödülü ver (Fix: amount kolonunu kullanıyoruz)
        INSERT INTO public.xp_logs (user_id, amount, reason)
        VALUES (v_referrer_id, 250, 'Arkadaş davet edildi: ' || p_user_id);
        
        UPDATE public.profiles SET xp = xp + 250 WHERE id = v_referrer_id;
        
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$;

-- RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own referrals" ON public.referrals 
    FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
