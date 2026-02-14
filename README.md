# Edusonex ÖdevGPT

AI Destekli Akıllı Eğitim Asistanı - Ödevlerini fotoğrafla, AI ile adım adım öğren!

## 🎯 Proje Hakkında

Edusonex ÖdevGPT, Türkiye eğitim sistemine entegre, hibrit (AI + İnsan Öğretmen) ödev çözüm platformudur.

**Özellikler:**
- 📸 Fotoğraf çekerek soru sorma
- 🤖 AI destekli adım adım çözüm
- 👨‍🏫 Gerçek öğretmen desteği (HITL)
- 📚 MEB müfredatına %100 uyumlu
- 🎓 Pedagojik yaklaşım (Sokratik öğrenme)

## 🛠️ Teknoloji Yığını

- **Frontend:** React 18.3.1 + TypeScript
- **Build Tool:** Vite 5.4.19
- **UI Library:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS 3.4.17
- **State:** @tanstack/react-query
- **Router:** react-router-dom
- **Animation:** framer-motion
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **AI:** LangChain + LlamaIndex (planlı)
- **OCR:** Mathpix + Google Vision (planlı)

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ & npm
- Supabase hesabı

### Adımlar

```sh
# 1. Repoyu klonlayın
git clone <GIT_URL>

# 2. Proje dizinine gidin
cd odevgpt

# 3. Bağımlılıkları yükleyin
npm install

# 4. .env dosyasını oluşturun
# .env.example dosyasını kopyalayıp .env olarak kaydedin
# Supabase URL ve Key'leri ekleyin

# 5. Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda http://localhost:8080 açın.

## 📁 Proje Yapısı

```
odevgpt/
├── src/
│   ├── pages/           # Sayfa bileşenleri
│   ├── components/      # UI bileşenleri
│   ├── contexts/        # React contexts (Auth vb.)
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Yardımcı fonksiyonlar
│   └── assets/          # Görseller
├── .raporlar/           # Proje raporları ve dokümantasyon
├── public/              # Statik dosyalar
└── package.json
```

## 📊 Geliştirme Durumu

**Mevcut İlerleme:** %30

- ✅ Frontend (Lovable'dan devralındı)
- ✅ Backend altyapısı (Supabase)
- ✅ Veritabanı şeması
- ✅ Auth sistemi
- ⏳ Login/Signup sayfaları (gelecek)
- ⏳ AI entegrasyonu (gelecek)
- ⏳ OCR entegrasyonu (gelecek)

## 📝 Dokümantasyon

Detaylı dokümantasyon için `.raporlar/` klasörüne bakın:
- `MASTER_STATUS.md` - Ana durum raporu
- `RAPOR_INDEKSI.md` - Tüm raporların indeksi
- `LOVABLE_DEVIR_TESLIM_ANALIZI.md` - Lovable analizi

## 🤝 Katkıda Bulunma

Bu proje aktif geliştirme aşamasındadır.

## 📄 Lisans

© 2026 Edusonex. Tüm hakları saklıdır.

## 📞 İletişim

**Edusonex ÖdevGPT**  
AI Destekli Akıllı Eğitim Asistanı

---

**Bismillahirrahmanirrahim** 🌟
