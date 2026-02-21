-- 🛡️ DEMO İÇİN ANON ERİŞİMİ (GEÇİCİ)
-- Normalde bu backend service_role kullanmalı, ama şu an anon ile demo yapıyoruz.

CREATE POLICY "anon_access_approvals" ON public.ai_approvals 
FOR ALL TO anon 
USING (true) 
WITH CHECK (true);

CREATE POLICY "anon_access_usage" ON public.ai_usage_logs 
FOR ALL TO anon 
USING (true) 
WITH CHECK (true);
