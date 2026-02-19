-- Project: OdevGPT
-- 20260219_TENANT_AI_PERSONALITY.sql
-- Description: Adds AI personality settings for schools (White-Label strategy).

-- 1. Add AI personality columns to tenants
ALTER TABLE public.tenants
    ADD COLUMN IF NOT EXISTS ai_welcome_message TEXT, -- School-specific greeting
    ADD COLUMN IF NOT EXISTS ai_personality_prompt TEXT, -- Specific prompt instructions (e.g. 'Sorumlu davran', 'Daha çok matematik odaklı ol')
    ADD COLUMN IF NOT EXISTS ai_forbidden_topics TEXT[], -- Topics the school doesn't want AI to discuss
    ADD COLUMN IF NOT EXISTS max_daily_requests_per_student INTEGER DEFAULT 50;

-- 2. Update existing sample tenants with personality
UPDATE public.tenants 
SET 
    ai_welcome_message = 'Odev Koleji Yapay Zeka Laboratuvarına hoş geldin! Senin için buradayız.',
    ai_personality_prompt = 'Sen Odev Koleji''nin akademik danışmanısın. Nazik, teşvik edici ve her zaman MEB müfredatına sadık kalarak cevap ver.'
WHERE slug = 'odevkolej';

UPDATE public.tenants 
SET 
    ai_welcome_message = 'IŞIK Akademi Teknik Destek Hattı. Sorunu sor, birlikte çözelim!',
    ai_personality_prompt = 'Sen teknik bir uzmansın. Cevaplarında mühendislik disiplini ve pratik çözüm odaklılık ön planda olsun.'
WHERE slug = 'isikdamper';

COMMENT ON COLUMN public.tenants.ai_personality_prompt IS 'Kuruma özel AI karakter tanımlaması.';
