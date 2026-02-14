-- ============================================
-- ODEVGPT VERİTABANI ŞEMASI
-- Tarih: 14 Şubat 2026
-- Amaç: Temel tabloları ve RLS politikalarını oluşturma
-- ============================================

-- 1. pgvector eklentisini aktifleştir (AI embeddings için)
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- TABLOLAR
-- ============================================

-- 2. Kullanıcı profilleri tablosu
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
  full_name TEXT,
  grade_level INTEGER CHECK (grade_level >= 1 AND grade_level <= 12), -- 1-12 (sınıf seviyesi)
  field TEXT CHECK (field IN ('sayisal', 'sozel', 'esit_agirlik', 'ilkokul', 'ortaokul')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Sorular tablosu
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT, -- Supabase Storage'daki fotoğraf URL'i
  ocr_text TEXT, -- OCR ile çıkarılan metin
  question_text TEXT, -- Kullanıcının yazdığı metin (eğer yazarak sorduysa)
  subject TEXT, -- 'matematik', 'fizik', 'kimya', 'turkce', vb.
  grade_level INTEGER,
  status TEXT NOT NULL CHECK (status IN ('pending', 'ai_processing', 'ai_answered', 'teacher_review', 'completed')) DEFAULT 'pending',
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1), -- 0.00 - 1.00
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Çözümler tablosu
CREATE TABLE IF NOT EXISTS solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  solver_type TEXT NOT NULL CHECK (solver_type IN ('ai', 'teacher')),
  solver_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- NULL ise AI
  solution_text TEXT NOT NULL,
  solution_steps JSONB, -- Adım adım çözüm (JSON formatında)
  latex_content TEXT, -- LaTeX formatında matematik içeriği
  is_approved BOOLEAN DEFAULT FALSE,
  feedback TEXT, -- Öğrenci geri bildirimi
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 1-5 yıldız
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Vektör embeddings tablosu (RAG için)
CREATE TABLE IF NOT EXISTS question_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  embedding vector(1536), -- OpenAI embedding boyutu (ada-002)
  metadata JSONB, -- Ek bilgiler (konu, kazanım, zorluk vb.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Öğretmen-Soru atama tablosu (HITL için)
CREATE TABLE IF NOT EXISTS teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('assigned', 'in_progress', 'completed')) DEFAULT 'assigned',
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  notes TEXT
);

-- ============================================
-- İNDEKSLER (Performans için)
-- ============================================

-- Sorular için indeksler
CREATE INDEX IF NOT EXISTS idx_questions_student_id ON questions(student_id);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);

-- Çözümler için indeksler
CREATE INDEX IF NOT EXISTS idx_solutions_question_id ON solutions(question_id);
CREATE INDEX IF NOT EXISTS idx_solutions_solver_id ON solutions(solver_id);

-- Vektör benzerlik araması için indeks (HNSW - Hiyerarşik Gezinilebilir Küçük Dünya)
CREATE INDEX IF NOT EXISTS idx_question_embeddings_vector 
ON question_embeddings USING hnsw (embedding vector_cosine_ops);

-- Öğretmen atamaları için indeksler
CREATE INDEX IF NOT EXISTS idx_teacher_assignments_teacher_id ON teacher_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_assignments_status ON teacher_assignments(status);

-- ============================================
-- TRIGGER FUNCTIONS
-- ============================================

-- updated_at otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_solutions_updated_at BEFORE UPDATE ON solutions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- ============================================

-- RLS'i aktifleştir
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;

-- PROFILES Politikaları
CREATE POLICY "Kullanıcılar kendi profillerini görebilir"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Yeni kullanıcı profili oluşturulabilir"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- QUESTIONS Politikaları
CREATE POLICY "Öğrenciler kendi sorularını görebilir"
  ON questions FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Öğretmenler tüm soruları görebilir"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
    )
  );

CREATE POLICY "Adminler tüm soruları görebilir"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Öğrenciler soru oluşturabilir"
  ON questions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Öğrenciler kendi sorularını güncelleyebilir"
  ON questions FOR UPDATE
  USING (auth.uid() = student_id);

-- SOLUTIONS Politikaları
CREATE POLICY "Herkes çözümleri görebilir (kendi sorularına ait)"
  ON solutions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM questions
      WHERE questions.id = solutions.question_id
      AND (questions.student_id = auth.uid() OR solver_id = auth.uid())
    )
  );

CREATE POLICY "Öğretmenler çözüm oluşturabilir"
  ON solutions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('teacher', 'admin')
    )
  );

-- QUESTION_EMBEDDINGS Politikaları
CREATE POLICY "Embeddings herkes tarafından okunabilir"
  ON question_embeddings FOR SELECT
  USING (true);

CREATE POLICY "Sadece sistem embeddings oluşturabilir"
  ON question_embeddings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- TEACHER_ASSIGNMENTS Politikaları
CREATE POLICY "Öğretmenler kendi atamalarını görebilir"
  ON teacher_assignments FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Adminler tüm atamaları görebilir"
  ON teacher_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- BAŞLANGIÇ VERİLERİ (Opsiyonel)
-- ============================================

-- Admin kullanıcısı için profil oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, full_name)
  VALUES (
    NEW.id,
    'student', -- Varsayılan rol
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Yeni Kullanıcı')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Yeni kullanıcı oluşturulduğunda otomatik profil oluştur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- ============================================
-- TAMAMLANDI
-- ============================================

-- Başarı mesajı
DO $$
BEGIN
  RAISE NOTICE '✅ OdevGPT veritabanı şeması başarıyla oluşturuldu!';
  RAISE NOTICE '📊 Oluşturulan tablolar: profiles, questions, solutions, question_embeddings, teacher_assignments';
  RAISE NOTICE '🔒 RLS politikaları aktifleştirildi';
  RAISE NOTICE '🚀 pgvector eklentisi aktif';
  RAISE NOTICE '⚡ İndeksler oluşturuldu';
END $$;
