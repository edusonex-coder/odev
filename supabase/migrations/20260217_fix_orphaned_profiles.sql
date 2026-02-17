-- PROJE ADI: OdevGPT
-- TARİH: 17 Şubat 2026
-- AMAÇ: Doktordan gelen "Bağımsız Profil" hatasını düzeltmek için mevcut kullanıcıları IŞIK Akademi'ye bağlar.

-- 1. Tenants tablosundan IŞIK Akademi ID'sini al
UPDATE public.profiles 
SET tenant_id = '835ef272-daee-4557-80a5-bccf045f776e' 
WHERE tenant_id IS NULL;

-- 2. Gelecekte tenant_id'siz kullanıcı oluşmasını engellemek için NOT NULL kısıtlaması (Opsiyonel ama önerilir)
-- Önce verilerin dolduğundan emin olduğumuz için bunu yapabiliriz.
-- ALTER TABLE public.profiles ALTER COLUMN tenant_id SET NOT NULL;
