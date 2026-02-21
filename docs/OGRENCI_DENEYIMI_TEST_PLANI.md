# 🧪 ÖĞRENCİ DENEYİMİ TEST PLANI
**Tarih:** 16 Şubat 2026  
**Amaç:** RLS düzeltmelerinden sonra öğrenci soru sorma ve AI cevap alma akışını doğrulamak

---

## ✅ Test Edilecek Akış

### 1. Soru Sorma (AskQuestion.tsx)
**Beklenen Davranış:**
- Öğrenci fotoğraf yükleyebilmeli veya metin yazabilmeli
- OCR ile fotoğraftaki metin otomatik çıkarılmalı
- Soru veritabanına kaydedilmeli (`questions` tablosu)
- Resim varsa `question_images` bucket'ına yüklenmeli

**Kontrol Noktaları:**
```typescript
// AskQuestion.tsx - Line 218-228
const { data: qData, error: dbError } = await supabase
    .from('questions')
    .insert({
        student_id: user?.id,
        question_text: questionText,
        image_url: imageUrl,
        subject: selectedSubject,
        status: 'pending'
    })
    .select()
    .single();
```

### 2. AI Otomatik Çözüm (AskQuestion.tsx)
**Beklenen Davranış:**
- Soru metni varsa AI otomatik çözüm üretmeli
- Çözüm `solutions` tablosuna kaydedilmeli
- **ÖNCEKİ SORUN:** 403 Forbidden (RLS hatası)
- **ŞİMDİ:** `20260216_FIX_RLS.sql` ile düzeltildi

**Kontrol Noktaları:**
```typescript
// AskQuestion.tsx - Line 248-253
const { error: insertError } = await supabase.from("solutions").insert({
    question_id: qData.id,
    solver_type: "ai",
    solver_id: user?.id,
    solution_text: aiResponseText
});
```

**RLS Politikası (Düzeltilmiş):**
```sql
-- 20260216_FIX_RLS.sql
CREATE POLICY "Students can insert AI solutions"
ON solutions FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM questions q
        WHERE q.id = question_id
        AND q.student_id = auth.uid()
    )
    AND solver_type = 'ai'
);
```

### 3. XP Kazanımı
**Beklenen Davranış:**
- Soru çözüldüğünde öğrenci XP kazanmalı
- XP `xp_logs` tablosuna kaydedilmeli
- `profiles.xp` güncellenm eli
- Veli panelindeki grafik bu XP'yi göstermeli

**Kontrol Noktaları:**
- `add_xp()` RPC fonksiyonu çağrılıyor mu?
- `get_student_daily_xp()` doğru veriyi döndürüyor mu?

### 4. Veli Bildirimi
**Beklenen Davranış:**
- Öğrenci soru sorduğunda veli bildirim almalı
- **ÖNCEKİ SORUN:** Trigger yanlış tablo adı (`parent_student_links`)
- **ŞİMDİ:** `20260216_FIX_TRIGGER.sql` ile düzeltildi

**Kontrol Noktaları:**
```sql
-- Trigger doğru tabloyu kullanıyor mu?
SELECT * FROM student_parent_relations WHERE student_id = 'test-student-id';
```

---

## 🔍 Manuel Test Adımları

### Adım 1: Öğrenci Olarak Giriş Yap
1. Tarayıcıda `/dashboard/ask` sayfasına git
2. Konsolu aç (F12)
3. Network sekmesini izle

### Adım 2: Soru Sor
1. Bir ders seç (örn: Matematik)
2. Metin yaz: "2x + 5 = 15 denklemini çöz"
3. "Soruyu Gönder" butonuna tıkla

### Adım 3: Konsol ve Network Kontrolü
**Başarılı Akış:**
```
✅ POST /rest/v1/questions → 201 Created
✅ POST /rest/v1/solutions → 201 Created
✅ PATCH /rest/v1/questions → 200 OK (status: ai_answered)
✅ Toast: "Çözüm Hazır! 🎉"
```

**Hatalı Akış (Eski):**
```
❌ POST /rest/v1/solutions → 403 Forbidden
❌ Toast: "Otomatik Çözüm Hatası"
```

### Adım 4: Veli Panelinde Kontrol
1. Veli hesabıyla giriş yap
2. `/dashboard/parent` sayfasına git
3. XP grafiğini kontrol et (bugünkü XP artmış olmalı)
4. "Aktivite" sekmesinde yeni soruyu gör
5. "Genel Bakış" sekmesinde "Haftalık Rapor Oluştur" butonuna tıkla

---

## 🐛 Bilinen Sorunlar ve Çözümleri

### Sorun 1: "0 Çözülen Soru" Gösterimi
**Sebep:** `get_student_weekly_stats` fonksiyonu `status = 'solved'` arıyordu  
**Çözüm:** `EXISTS (SELECT 1 FROM solutions...)` kontrolüne geçildi  
**Dosya:** `20260216_parent_weekly_reports.sql` (Line 89)

### Sorun 2: AI Analizi Kaybolması
**Sebep:** State yönetimi, sayfa değişince sıfırlanıyordu  
**Çözüm:** `useEffect` ile veritabanından mevcut rapor çekiliyor  
**Dosya:** `WeeklyReportCard.tsx` (Line 52-96)

### Sorun 3: XP Tutarsızlığı
**Sebep:** Farklı kaynaklardan farklı XP değerleri geliyordu  
**Çözüm:** Tek kaynak (`get_parent_students` RPC) kullanılıyor  
**Dosya:** `ParentPanel.tsx`

---

## 📊 Beklenen Sonuçlar

### Veritabanı Kontrolleri
```sql
-- 1. Soru kaydedildi mi?
SELECT * FROM questions WHERE student_id = 'user-id' ORDER BY created_at DESC LIMIT 1;

-- 2. Çözüm oluşturuldu mu?
SELECT * FROM solutions WHERE question_id = 'question-id';

-- 3. XP loglandı mı?
SELECT * FROM xp_logs WHERE user_id = 'user-id' ORDER BY created_at DESC LIMIT 5;

-- 4. Veli bildirimi oluşturuldu mu?
SELECT * FROM notifications WHERE user_id = 'parent-id' ORDER BY created_at DESC LIMIT 1;
```

### Frontend Kontrolleri
- ✅ Soru gönderme başarılı
- ✅ AI çözüm üretimi başarılı
- ✅ XP grafiği gerçek veri gösteriyor
- ✅ Haftalık rapor kalıcı
- ✅ Ödev listesi gerçek veri gösteriyor

---

## 🚀 Sonraki Adımlar (Eğer Test Başarılı)
1. Production'a deploy et
2. Gerçek kullanıcılarla beta test yap
3. Performans metrikleri topla
4. Kullanıcı geri bildirimlerini değerlendir
