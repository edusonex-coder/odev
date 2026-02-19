# OdevGPT Raporlar Dizini

Bu klasör, OdevGPT projesinin gelişim sürecindeki önemli analizleri, kararları ve dokümantasyonu içerir.

## 📁 Dizin Yapısı

### Mimari Dokümantasyon
- `OdevGPT_Proje Mimarisi.md` - Temel proje mimarisi ve teknoloji yığını
- `ÖdevGPT_ Hibrit Eğitim Teknolojisi Mimarisi.md` - Kapsamlı stratejik mimari raporu
- `ÖdevGPT_ Pedagojik Prompting ve Sokratik Öğrenme Mimarisi.md` - Pedagojik yaklaşım
- `ÖdevGPT_ Sokratik Öğrenme ve Etkileşimli Pedagoji Mimarisi.md` - Etkileşim tasarımı

### Sistem Tasarımı
- `OdevGPT_Sistem Talimatları.md` - AI sistem talimatları ve kuralları
- `OdevGPT_Hafıza ve Doğrulama.md` - Hafıza yönetimi ve doğrulama mekanizmaları
- `ÖdevGPT_ Güven Skoru ve Öğretmen Triyaj Mekanizması.md` - HITL (Human-in-the-Loop) sistemi

### İlerleme Raporları
İlerleme raporları tarih bazlı olarak `GUN_AY_YIL_ilerleme.md` formatında saklanır.

### Durum Raporları
- `MASTER_STATUS.md` - Ana durum raporu ve yol haritası
- `RAPOR_INDEKSI.md` - Tüm raporların indeksi ve okuma rehberi
- `CANLI_DURUM_RAPORU.md` - Canlı ortam analizi
- `ALTYAPI_ENVANTERI.md` - Teknik altyapı envanteri

### Tanı Araçları
- `topla.py` - Proje dosyalarını toplayan Python scripti
- `tum.txt` - Toplanan tüm proje dosyaları (otomatik oluşturulur)

## 🔧 Araç Kullanımı

### Proje Dosyalarını Toplama
```bash
# .raporlar dizininde çalıştır
python topla.py
```

Bu komut, proje dosyalarını tarar ve `tum.txt` dosyasına yazar. Bu dosya, AI asistanlarına projenin tamamını göstermek için kullanılır.

## 📚 Rapor Formatı

Her rapor şunları içerir:
1. **Özet** - Raporun amacı ve kapsamı
2. **Detaylı Analiz** - Teknik veya stratejik detaylar
3. **Kararlar** - Alınan önemli kararlar ve gerekçeleri
4. **Sonraki Adımlar** - Gelecek planlar
5. **Referanslar** - İlgili dosyalar ve kaynaklar

## 🎯 Amaç

Bu raporlar:
- Proje gelişimini takip eder
- Önemli kararları ve gerekçelerini belgeler
- Ekip üyelerinin hızlı bilgi edinmesini sağlar
- AI asistanlarına proje bağlamı sunar
- Gelecekteki benzer projelere referans oluşturur

## 📖 Okuma Sırası (Yeni Başlayanlar İçin)

1. **README.md** (Bu dosya) - Genel bakış
2. **OdevGPT_Proje Mimarisi.md** - Temel mimari
3. **ÖdevGPT_ Hibrit Eğitim Teknolojisi Mimarisi.md** - Kapsamlı strateji
4. **MASTER_STATUS.md** - Mevcut durum ve yol haritası
5. **RAPOR_INDEKSI.md** - Detaylı dokümantasyon haritası

---

**Son Güncelleme:** 14 Şubat 2026
**Proje:** OdevGPT - Hibrit Yapay Zeka ve Öğretmen Destekli Ödev Çözüm Platformu
