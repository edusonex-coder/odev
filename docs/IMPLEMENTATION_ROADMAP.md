# 🚀 ODEVGPT GELİŞTİRME YOL HARİTASI
**Tarih:** 15 Şubat 2026  
**Durum:** Aktif Geliştirme Fazı  
**Hedef:** MVP'den Production-Ready Platforma Geçiş

---

## 📊 MEVCUT DURUM
- ✅ MVP %98 Tamamlandı
- ✅ Vercel.json SPA Routing Fix Uygulandı
- ✅ Temel AI, Auth, Gamification Sistemleri Çalışıyor
- ⏳ Production-Ready Özellikler Bekleniyor

---

## 🎯 ÖNCELİKLİ GÖREV SIRASI

### **FAZ 1: Sınıf Zeka Raporu (Class Insights) Modülü** 🧠
**Öncelik:** 🔴 Kritik  
**Tahmini Süre:** 4-6 saat  
**Hedef:** Öğretmenlerin sınıf performansını AI ile analiz edebilmesi

#### Alt Görevler:
1. **Database Schema Güncellemeleri**
   - [ ] `class_insights` tablosu oluştur
   - [ ] `student_performance_metrics` view oluştur
   - [ ] RPC fonksiyonları: `get_class_weak_topics()`, `get_student_progress()`

2. **Backend AI Analiz Servisi**
   - [ ] `src/lib/classInsights.ts` - AI analiz motoru
   - [ ] Groq API ile sınıf verilerini analiz et
   - [ ] Zayıf konuları tespit et (örn: "Kesirler", "İkinci Dereceden Denklemler")
   - [ ] Öğrenci başarı trendlerini hesapla

3. **Frontend Bileşenleri**
   - [ ] `ClassInsightsPanel.tsx` - Ana insights dashboard
   - [ ] `WeakTopicsChart.tsx` - En çok takılınan konular grafiği
   - [ ] `StudentProgressTable.tsx` - Öğrenci bazlı performans tablosu
   - [ ] `AIRecommendations.tsx` - AI'ın öğretmene önerileri

4. **Entegrasyon**
   - [ ] `TeacherPanel.tsx` içine "Sınıf Analizi" tab ekle
   - [ ] Real-time data binding (Supabase Realtime)
   - [ ] Export PDF rapor özelliği

**Başarı Kriterleri:**
- ✅ Öğretmen, sınıfın en zayıf 5 konusunu görebilmeli
- ✅ Öğrenci bazlı performans karşılaştırması yapabilmeli
- ✅ AI, öğretmene pedagojik öneriler sunmalı

---

### **FAZ 2: Ödev Sistemi İyileştirmeleri** 📚
**Öncelik:** 🟡 Yüksek  
**Tahmini Süre:** 3-4 saat  
**Hedef:** Ödev takip ve değerlendirme sistemini güçlendirme

#### Alt Görevler:
1. **Database İyileştirmeleri**
   - [ ] `assignments` tablosuna `difficulty_level` ekle
   - [ ] `assignment_submissions` tablosu oluştur
   - [ ] `submission_feedback` tablosu (öğretmen yorumları için)

2. **Ödev Oluşturma Wizard**
   - [ ] `AssignmentWizard.tsx` - Step-by-step ödev oluşturma
   - [ ] AI ile otomatik soru önerisi
   - [ ] Zorluk seviyesi seçimi (Kolay/Orta/Zor)
   - [ ] Son teslim tarihi ve hatırlatıcı ayarları

3. **Öğrenci Ödev Teslim Sistemi**
   - [ ] `SubmitAssignment.tsx` - Dosya yükleme + metin girişi
   - [ ] OCR ile fotoğraf yükleme desteği
   - [ ] Otomatik plagiarism check (basit metin benzerliği)

4. **Öğretmen Değerlendirme Paneli**
   - [ ] `GradeAssignments.tsx` - Toplu değerlendirme arayüzü
   - [ ] AI destekli ön değerlendirme (öneriler)
   - [ ] Hızlı yorum şablonları

**Başarı Kriterleri:**
- ✅ Öğretmen 5 dakikada ödev oluşturabilmeli
- ✅ Öğrenci fotoğraf çekerek ödev teslim edebilmeli
- ✅ AI, öğretmene değerlendirme önerileri sunmalı

---

### **FAZ 3: Gelişmiş OCR Entegrasyonu** 📸
**Öncelik:** 🟡 Yüksek  
**Tahmini Süre:** 5-7 saat  
**Hedef:** Matematiksel sembolleri %95 doğrulukla okuma

#### Alt Görevler:
1. **OCR Engine Upgrade**
   - [ ] Tesseract.js → Mathpix OCR API geçişi (veya Google Vision API)
   - [ ] LaTeX formatında matematiksel ifade çıktısı
   - [ ] El yazısı tanıma iyileştirmesi

2. **Görüntü Ön İşleme**
   - [ ] `src/lib/imagePreprocessing.ts` - Görüntü kalite artırma
   - [ ] Kontrast ayarlama, gürültü azaltma
   - [ ] Perspektif düzeltme (eğik çekilmiş fotoğraflar için)

3. **UI İyileştirmeleri**
   - [ ] `CameraCapture.tsx` - Gelişmiş kamera arayüzü
   - [ ] Gerçek zamanlı önizleme ve kırpma
   - [ ] OCR sonucu düzenleme arayüzü (kullanıcı hataları düzeltebilsin)

4. **Doğrulama Mekanizması**
   - [ ] AI ile OCR sonucunu doğrula
   - [ ] Kullanıcıya "Bu doğru okundu mu?" onay ekranı

**Başarı Kriterleri:**
- ✅ Matematiksel sembolleri %95+ doğrulukla okumalı
- ✅ El yazısı notları tanıyabilmeli
- ✅ LaTeX formatında çıktı verebilmeli

---

### **FAZ 4: Veli Takip Sistemi** 👨‍👩‍👧
**Öncelik:** 🟢 Orta  
**Tahmini Süre:** 4-5 saat  
**Hedef:** Velilerin çocuklarının performansını takip edebilmesi

#### Alt Görevler:
1. **Database Schema**
   - [ ] `parent_student_links` tablosu (veli-öğrenci ilişkisi)
   - [ ] `weekly_reports` tablosu (otomatik haftalık raporlar)

2. **Veli Paneli**
   - [ ] `ParentDashboard.tsx` - Veli ana ekranı
   - [ ] Çocuğun haftalık performans grafiği
   - [ ] Çözülen soru sayısı, XP kazanımı
   - [ ] Öğretmen yorumları

3. **Otomatik Rapor Sistemi**
   - [ ] Cron job: Her Pazar akşamı rapor oluştur
   - [ ] AI ile haftalık özet oluştur
   - [ ] Email/SMS bildirimi (opsiyonel)

4. **Veli-Öğretmen İletişim**
   - [ ] Mesajlaşma sistemi (basit chat)
   - [ ] Randevu talep etme

**Başarı Kriterleri:**
- ✅ Veli, çocuğunun haftalık performansını görebilmeli
- ✅ Otomatik raporlar her hafta oluşturulmalı
- ✅ Öğretmenle iletişim kurabilmeli

---

### **FAZ 5: Real-time Sınıf Sohbeti** 💬
**Öncelik:** 🟢 Orta  
**Tahmini Süre:** 3-4 saat  
**Hedef:** Sınıf içi anlık soru-cevap ve tartışma

#### Alt Görevler:
1. **Supabase Realtime Entegrasyonu**
   - [ ] `class_messages` tablosu
   - [ ] Realtime subscription kurulumu

2. **Chat Bileşenleri**
   - [ ] `ClassChatRoom.tsx` - Sınıf sohbet odası
   - [ ] Mesaj gönderme/alma
   - [ ] Emoji ve dosya paylaşımı

3. **Moderasyon**
   - [ ] Öğretmen mesaj silme yetkisi
   - [ ] Küfür filtresi (basit kelime listesi)

**Başarı Kriterleri:**
- ✅ Sınıf üyeleri gerçek zamanlı mesajlaşabilmeli
- ✅ Öğretmen moderasyon yapabilmeli

---

### **FAZ 6: Production Optimizasyonları** ⚡
**Öncelik:** 🟡 Yüksek  
**Tahmini Süre:** 2-3 saat  
**Hedef:** Performans, güvenlik ve kullanıcı deneyimi iyileştirmeleri

#### Alt Görevler:
1. **Performans**
   - [ ] Lazy loading (React.lazy) tüm sayfalara
   - [ ] Image optimization (WebP formatı)
   - [ ] Bundle size analizi ve optimizasyon

2. **Güvenlik**
   - [ ] Rate limiting (API isteklerini sınırla)
   - [ ] Input sanitization (XSS koruması)
   - [ ] CSRF token implementasyonu

3. **SEO & Analytics**
   - [ ] Meta tags tüm sayfalara
   - [ ] Google Analytics entegrasyonu
   - [ ] Sitemap.xml oluştur

4. **Error Handling**
   - [ ] Global error boundary
   - [ ] Kullanıcı dostu hata mesajları
   - [ ] Sentry.io entegrasyonu (hata takibi)

**Başarı Kriterleri:**
- ✅ Lighthouse skoru 90+
- ✅ Tüm API endpoint'leri rate-limited
- ✅ SEO optimize edilmiş

---

## 📅 ZAMAN ÇİZELGESİ

```
Hafta 1 (15-21 Şubat):
├─ Gün 1-2: Faz 1 (Class Insights)
├─ Gün 3-4: Faz 2 (Ödev Sistemi)
└─ Gün 5-7: Faz 3 (OCR Upgrade)

Hafta 2 (22-28 Şubat):
├─ Gün 1-3: Faz 4 (Veli Takip)
├─ Gün 4-5: Faz 5 (Real-time Chat)
└─ Gün 6-7: Faz 6 (Production Optimizasyonları)
```

---

## 🎯 BAŞLANGIÇ NOKTASI

**ŞİMDİ BAŞLIYORUZ:** Faz 1 - Sınıf Zeka Raporu (Class Insights)

### İlk Adım: Database Schema
1. `class_insights` tablosu oluştur
2. RPC fonksiyonları yaz
3. Frontend bileşenlerini geliştir

---

**Hazırlayan:** Antigravity AI  
**Son Güncelleme:** 15 Şubat 2026, 13:50  
**Durum:** ✅ Plan Onaylandı - Geliştirme Başlıyor
