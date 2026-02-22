-- =====================================================
-- 🔒 ODEVGPT AI_KNOWLEDGE_GRAPH POLICY FIX
-- Tarih: 23 Şubat 2026
-- Amaç: "RLS Policy Always True" uyarısını gidermek.
--       FOR ALL + USING(true) yerine explicit ayrım yapıyoruz.
--       SELECT için USING(true) intentional (Advisor bunu kabul eder).
--       INSERT/UPDATE/DELETE için WITH CHECK kısıtlayıcı olmalı.
-- =====================================================

-- Eski politikayı kaldır
DROP POLICY IF EXISTS "ai_knowledge_graph_access" ON public.ai_knowledge_graph;
DROP POLICY IF EXISTS "ai_knowledge_graph_unified_v4" ON public.ai_knowledge_graph;

-- SELECT: Herkes okuyabilir (USING true sadece SELECT için kabul edilir)
CREATE POLICY "ai_kg_select" ON public.ai_knowledge_graph
FOR SELECT TO authenticated
USING (true);

-- INSERT: Sadece teacher/admin yazabilir
CREATE POLICY "ai_kg_insert" ON public.ai_knowledge_graph
FOR INSERT TO authenticated
WITH CHECK (
    public.is_iam_super_admin() OR
    public.get_my_role() IN ('teacher', 'admin')
);

-- UPDATE: Sadece teacher/admin güncelleyebilir
CREATE POLICY "ai_kg_update" ON public.ai_knowledge_graph
FOR UPDATE TO authenticated
USING (
    public.is_iam_super_admin() OR
    public.get_my_role() IN ('teacher', 'admin')
);

-- DELETE: Sadece admin silebilir
CREATE POLICY "ai_kg_delete" ON public.ai_knowledge_graph
FOR DELETE TO authenticated
USING (public.is_iam_super_admin());

NOTIFY pgrst, 'reload schema';
