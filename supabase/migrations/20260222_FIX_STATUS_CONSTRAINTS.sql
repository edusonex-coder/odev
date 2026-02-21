-- status sütunundaki kısıtlamayı (CHECK constraint) genişletiyoruz.
ALTER TABLE public.ai_approvals DROP CONSTRAINT IF EXISTS ai_approvals_status_check;
ALTER TABLE public.ai_approvals ADD CONSTRAINT ai_approvals_status_check 
  CHECK (status IN ('Bekliyor', 'Onaylandı', 'Reddedildi', 'Tamamlandı', 'Hata'));
