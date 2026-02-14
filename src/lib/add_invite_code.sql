-- 🎓 DAVET KODU SİSTEMİ 🎓
-- Bu kodu Supabase SQL Editor'de çalıştırın.

-- 1. Classes tablosuna 'invite_code' sütunu ekle
ALTER TABLE public.classes 
ADD COLUMN IF NOT EXISTS invite_code TEXT;

-- 2. Var olan sınıflara rastgele kod üret (Eğer varsa)
-- (Sadece boş olanları günceller)
UPDATE public.classes 
SET invite_code = upper(substring(md5(random()::text) from 1 for 6))
WHERE invite_code IS NULL;

-- 3. Benzersizlik kısıtlaması ekle (İki sınıf aynı koda sahip olamaz)
ALTER TABLE public.classes 
ADD CONSTRAINT classes_invite_code_key UNIQUE (invite_code);
