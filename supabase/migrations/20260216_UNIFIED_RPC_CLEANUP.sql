-- ============================================
-- ODEVGPT: UNIFIED RPC CLEANUP & STANDARDIZATION
-- Tarih: 16 Şubat 2026
-- Amaç: Tüm çakışan RPC versiyonlarını temizle ve
--       ParentPanel.tsx ile senkronize etmeyi sağla
-- ============================================

-- ===== PROBLEM =====
-- ParentPanel.tsx parametresiz RPC çağrıyor:
--   - supabase.rpc('get_parent_students')  ← No parameters
--   - supabase.rpc('pair_student_with_parent', {p_access_code: '...'}) ← Only code param
--
-- Ama eski migrations parameterli versiyonlar tanımlamıştı:
--   - get_parent_students(UUID) ← Old (wrong)
--   - pair_student_with_parent(UUID, TEXT) ← Old (wrong)
--
-- Bu migration: Parameterli tüm versiyonları DROP ile ve
-- parametresiz yeni versiyonları CREATE ile değiştir.

-- ===== 1. TÜME PARAMETRELI VERSİYONLARI SİL =====

-- get_parent_students: Tüm eski overload'ları sil
DROP FUNCTION IF EXISTS get_parent_students(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_parent_students() CASCADE;

-- pair_student_with_parent: Tüm eski overload'ları sil  
DROP FUNCTION IF EXISTS pair_student_with_parent(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS pair_student_with_parent(TEXT) CASCADE;

-- ===== 2. YENİ PARAMETRESİZ VERSİYONLARI OLUŞTUR =====

-- ✅ GET_PARENT_STUDENTS: Parametresiz, auth.uid() kullanır
-- Çağrı: supabase.rpc('get_parent_students')
CREATE OR REPLACE FUNCTION get_parent_students()
RETURNS TABLE (
    student_id UUID,
    student_name TEXT,
    student_avatar TEXT,
    xp INTEGER,
    level INTEGER,
    total_questions BIGINT,
    solved_questions BIGINT,
    last_activity TIMESTAMPTZ
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS student_id,
        p.full_name AS student_name,
        p.avatar_url AS student_avatar,
        p.xp,
        p.level,
        (SELECT COUNT(*) FROM questions WHERE student_id = p.id) AS total_questions,
        (SELECT COUNT(DISTINCT q.id) FROM questions q JOIN solutions s ON s.question_id = q.id WHERE q.student_id = p.id) AS solved_questions,
        (SELECT MAX(created_at) FROM questions WHERE student_id = p.id) AS last_activity
    FROM student_parent_relations r
    JOIN profiles p ON p.id = r.student_id
    WHERE r.parent_id = auth.uid(); -- 🔐 Güvenli: mevcut kullanıcı ID'si
END;
$$;

-- ✅ PAIR_STUDENT_WITH_PARENT: Sadece access code alır, parent auth.uid()'den alır
-- Çağrı: supabase.rpc('pair_student_with_parent', {p_access_code: 'X1Y2Z3AB'})
CREATE OR REPLACE FUNCTION pair_student_with_parent(p_access_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_student_id UUID;
    v_student_name TEXT;
    v_parent_id UUID;
BEGIN
    v_parent_id := auth.uid(); -- 🔐 Güvenli: mevcut kullanıcı
    
    -- Erişim koduna sahip öğrenciyi bul (sadece öğrenci rolü)
    SELECT id, full_name INTO v_student_id, v_student_name
    FROM profiles 
    WHERE parent_access_code ILIKE trim(p_access_code) AND role = 'student';
    
    IF v_student_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false, 
            'message', 'Geçersiz kod! Lütfen öğrencinin Profil sayfasındaki 8 haneli kodu girin.'
        );
    END IF;
    
    -- Güvenlik: Kendini ekleyemez
    IF v_student_id = v_parent_id THEN
        RETURN jsonb_build_object(
            'success', false, 
            'message', 'Kendinizi öğrenci olarak ekleyemezsiniz.'
        );
    END IF;
    
    -- İlişkiyi ekle (zaten varsa CONFLICT DO NOTHING)
    INSERT INTO student_parent_relations (student_id, parent_id)
    VALUES (v_student_id, v_parent_id)
    ON CONFLICT (student_id, parent_id) DO NOTHING;
    
    RETURN jsonb_build_object(
        'success', true, 
        'student_name', v_student_name,
        'student_id', v_student_id
    );
END;
$$;

-- ===== 3. RLS POLİTİKALARI (Güvenlik) =====

-- Veliler sadece kendi öğrencilik verilerinin görebilsin
ALTER TABLE student_parent_relations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view student data" ON student_parent_relations;
CREATE POLICY "Parents can view student data" ON student_parent_relations 
FOR SELECT USING (auth.uid() = parent_id OR auth.uid() = student_id);

-- Veliler öğrencilerinin sorularını görebilsin
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents view questions" ON questions;
CREATE POLICY "Parents view questions" ON questions 
FOR SELECT USING (
    auth.uid() = student_id OR EXISTS (
        SELECT 1 FROM student_parent_relations r 
        WHERE r.parent_id = auth.uid() AND r.student_id = questions.student_id
    )
);

-- ===== 4. KONTROL / DOĞRULAMA =====

-- Bu SQL çalıştırıldıktan sonra şunları test et:
-- 1. Browser Console'da: 
--    supabase.rpc('get_parent_students').then(d => console.log(d))
-- 2. ParentPanel.tsx yenilenirse: Öğrenciler listelenmiş ve aktiviteler görülüyor mu?
-- 3. Access code ile pairing çalışıyor mu?

COMMENT ON FUNCTION get_parent_students() IS 
'Veli rolü olan kullanıcının takip ettiği tüm öğrencileri döndürür. 
Parametre almaz, auth.uid() ile güvenliğini sağlar.
ParentPanel.tsx tarafından kullanılır.';

COMMENT ON FUNCTION pair_student_with_parent(TEXT) IS 
'Öğrenci erişim kodunu kullanarak veli-öğrenci ilişkisi oluşturur.
Parametreler: p_access_code (8 haneli kod)
Dönüş: {success: bool, student_name: string, message?: string}';

-- ===== COMPLETION =====
-- DONE! Tüm RPC fonksiyonları artık ParentPanel.tsx'le uyumlu.
