# 🗝️ OdevGPT MASTER HANDOVER - Devir Teslim Raporu

Bu dosya, OdevGPT projesinin mevcut teknik durumunu ve bir sonraki AI asistanının projeyi devralıp kesintisiz devam etmesi için gereken tüm bilgileri içerir.

## 📍 MEVCUT DURUM ÖZETİ
- **Proje Adı:** Edusonex OdevGPT
- **Teknoloji Yığını:** React + Vite + TypeScript + TailwindCSS + Supabase
- **AI Engine:** Groq (Llama 3.3 70B Versatile)
- **Ana Hedef:** Sokratik öğrenme mimarisine sahip yapay zeka destekli eğitim platformu.

## ✅ TAMAMLANAN KRİTİK ALTYAPI
1.  **Auth & Profil:** Komple Supabase Auth entegrasyonu, rol yönetimi (teacher/student).
2.  **Sınıf Sistemi:** Sınıf oluşturma (öğretmen), sınıfa katılma (öğrenci - davet kodu ile).
3.  **Akıllı Duyuru Sistemi:** `announcements` tablosu hazır. Groq ile duyuru geliştirme ve otomatik özetleme (AI Summary) entegre edildi.
4.  **Soru Sorabilme:** Öğrenci resim yükleyebilir (OCR - Tesseract.js) ve soru metni girebilir.

## 🛠️ VERİTABANI ŞEMASI (KAYITLI TABLOLAR)
- `profiles`: Kullanıcı rolleri ve isimleri.
- `classes`: Sınıf bilgileri ve davet kodları.
- `class_students`: Öğrenci-Sınıf eşleşmeleri.
- `announcements`: Akıllı duyurular ve AI özetleri.
- `questions`: Sorular ve durumları (pending, solved, ai_answered).
- `solutions`: Soru çözümleri.

## 🚀 BİR SONRAKİ ADIMLAR (ÖNCELİKLİ)
1.  **Sokratik Öğrenme Chat'i:** `src/pages/QuestionDetail.tsx` sayfasında AI'nın doğrudan cevap vermek yerine öğrenciyi yönlendirdiği "Sokratik Chat" modulu yapılacak.
2.  **Ödev Sistemi:** Sınıf içine `assignments` tablosu eklenip öğretmenlerin ödev vermesi sağlanacak.
3.  **Gamification:** `profiles` tablosuna `xp` ve `streak` alanları eklenip liderlik tablosu yapılacak.

## ⚠️ KRİTİK TEKNİK NOTLAR
- **AI Servisi:** `src/lib/ai.ts` dosyasında `askAI`, `enhanceAnnouncement` ve `summarizeForStudents` fonksiyonları mevcuttur.
- **API Keys:** `.env` dosyasında `VITE_GROQ_API_KEY` ve Supabase bilgileri tanımlıdır.
- **Yol Haritası:** Detaylı özellik listesi ana dizindeki `todo_list.md` dosyasındadır.

---
**Yeni Asistan İçin Talimat:** Lütfen projeyi bu dosya ve `todo_list.md` üzerinden analiz ederek devam ettir. Bir sonraki görev: **Sokratik Chat Modülü.**
