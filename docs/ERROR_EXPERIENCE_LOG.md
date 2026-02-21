# 📓 OdevGPT Hata & Deneyim Günlüğü

Bu dosya, gelişim sürecinde karşılaşılan hataların ve çözümlerinin kaydını tutar.

### 📅 21 February 2026 - 14:38
- **Hata:** Supabase Advisor 70+ Uyarı Kısır Döngüsü
- **Kök Neden:** Eski politikaların temizlenmemesi ve auth.uid() performans anti-patterni.
- **Çözüm:** Shield v5: Tüm eski politikaları topluca DROP edip yerine (SELECT auth.uid()) içeren Unified Policy mimarisine geçiş.
