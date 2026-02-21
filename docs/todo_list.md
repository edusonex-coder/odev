# 🚀 OdevGPT Soul & Intelligence - TODO List

Bu liste, OdevGPT'nin sadece bir ödev yönetim aracı değil, aynı zamanda **Yapay Zeka Destekli Bir Eğitim Asistanı** olmasını sağlayacak "can alıcı" özellikleri içerir.

## 🧠 FAZ 2: AI ORKESTRASYONU & RUHU (Öncelikli)

### 1. AI Duyuru Asistanı (Smart Announcements) 📣
- [x] **AI Genişletme:** Öğretmen kısa bir not yazar, AI bunu motive edici ve detaylı bir duyuruya dönüştürür.
- [x] **Öğrenci Özeti:** AI, uzun duyuruları öğrenciler için 3 maddelik "Can Alıcı Noktalar" şeklinde özetler.
- [ ] **Duygu Analizi:** Duyurunun tonunun (sert, destekleyici, bilgilendirici) ayarlanabilmesi.

### 2. Sokratik Ödev Sistemi (AI Tutor Integration) 🎓
- [x] **Sokratik Rehber:** AI, öğrenciye ödevin cevabını vermez; ona sorular sorarak cevaba ulaşmasını sağlar.
- [x] **LaTeX & Markdown Desteği:** Çözümlerin profesyonel matematiksel formatta sunulması.
- [x] **Sesli Okuma (TTS):** Çözümlerin tane tane ve doğal bir Türkçe ile seslendirilmesi.
- [x] **Benzer Soru (Pratik):** "Sıra Sende" butonu ile konuya benzer yeni sorular üretilmesi.
- [x] **İpucu Sistemi:** "Bana bir ipucu ver" butonları üzerinden yönlendirme.

### 3. Sınıf Zeka Raporu (Class Insights for Teachers) 📊
- [ ] **Kafa Karışıklığı Isı Haritası:** Öğrencilerin AI'ya en çok hangi konularda soru sorduğunu öğretmene gösterir.
- [ ] **Aktiflik Skoru:** Hangi öğrencilerin AI ile gerçekten etkileşime girdiğinin raporu.
- [ ] **Haftalık Özet:** Öğretmene "Sınıfınız bu hafta en çok X konusuna odaklandı" özeti.

### 4. Güven Skoru & HITL (Human-In-The-Loop) 🛡️
- [ ] **Kopya Algılama:** AI etkileşim süresine göre "Öğrenme mi yoksa Cevap Kopyalama mı?" analizi.
- [ ] **Öğretmen Onayı:** AI'nın emin olamadığı karmaşık sorularda "Öğretmene Sor" triyaj mekanizması.

## 🎨 UI/UX & ETKİLEŞİM İYİLEŞTİRMELERİ

### 5. Oyunlaştırma (Gamification) 🏆
- [x] **Mesaj Başı XP:** Sokratik rehberle her mesajlaşmada XP kazanma (temel mantık).
- [ ] **Sınıf Liderlik Tablosu:** Sınıf içindeki canlı rekabeti tetikleyen skorboard.
- [ ] **Günlük Streak:** 3 gün üst üste soru soran öğrenciye bonus XP.

### 6. Veli Bilgilendirme (AI Parent Reports) 👪
- [x] **Haftalık Gelişim Karnesi:** AI destekli haftalık öğrenci performans raporu (⚠️ BLOKE - Trigger hatası)
  - ✅ UI bileşenleri hazır (`WeeklyReportCard.tsx`)
  - ✅ AI servisleri hazır (`generateWeeklyParentReport`, `generateReportHighlights`)
  - ⚠️ Database trigger düzeltilmesi gerekiyor
  - 📋 Detay: `.raporlar/16_SUBAT_2026_HAFTALIK_RAPOR_SISTEMI_DURUM.md`
- [ ] **Pozitif Bildirim:** AI'nın öğrenci başarısını veliye otomatik raporlaması.

## 🛠️ TEKNİK ADIMLAR (HIZLI AKSİYON)
- [x] `src/lib/ai.ts` üzerinden Groq API entegrasyonu.
- [x] Sokratik Chat modülü ve `QuestionDetail.tsx` iyileştirmeleri.
- [x] `announcements` tablosunun AI ile bağlanması.
- [x] Haftalık veli raporları backend ve frontend altyapısı.

---
**Not:** Proje "Sokratik Eğitim Asistanı" ruhuna kavuştu.

**ÖNCELİKLİ GÖREV (16 Şubat 2026):**
- Haftalık Veli Raporları sistemini tamamla (trigger düzeltmesi + test)

**Sonraki Hedef:** Öğretmenler için Sınıf Analiz Ekranı
