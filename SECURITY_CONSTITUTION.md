# OdevGPT Güvenlik ve Mimari Anayasası (Security Constitution)
**Tarih:** 22 Şubat 2026
**Hazırlayan:** CTO
**Durum:** Yürürlükte

## 1. Temel Felsefe: "Döngüsüz Hiyerarşi"
Sistemde yaşanan `infinite recursion` (sonsuz döngü) hatalarını engellemek için RLS politikaları içerisinde doğrudan `SELECT` sorgusu yapılmaz. Bunun yerine **Security Definer** yetkisiyle çalışan merkezi yardımcı fonksiyonlar kullanılır.

## 2. Altın Kurallar (Checklist)

### A. RLS Politikaları
- **Asla** `USING (true)` (permissive) politikası kullanma (Supabase Advisor uyarısı).
- **Asla** RLS içinde `SELECT * FROM table_name` yapma (Infinite Recursion hatası).
- **Her Zaman** `(SELECT auth.uid())` formatını kullan (Performance uyarısı çözümü).
- **Her Zaman** `public.get_my_tenant_id()` gibi yardımcı fonksiyonları kullan.

### B. Görünümler (Views)
- Tüm görünümler `WITH (security_invoker = true)` parametresi ile oluşturulmalıdır.
- Görünüm içinde veri filtreleme, RLS politikaları ile uyumlu olmalıdır.

### C. Fonksiyonlar (RPC)
- Tüm fonksiyonlar `SET search_path = public` güvenlik ayarına sahip olmalıdır.
- Yetki kontrolü gerektiren fonksiyonlar `SECURITY DEFINER` olarak işaretlenmelidir.

## 3. Merkezi Yetki Fonksiyonları (Standard)
Aşağıdaki fonksiyonlar sistemin "beyni" olarak kabul edilir:
1. `get_my_tenant_id()`: Mevcut kullanıcının kurum ID'sini döner.
2. `is_super_admin()`: Kullanıcının Holding/Super Admin olup olmadığını döner.
3. `get_my_role()`: Kullanıcının rolünü (student, teacher, admin) döner.

## 4. Hata Çözüm Protokolü
Eğer bir tabloda 500 hatası veya "sonsuz döngü" alınırsa:
1. Tablonun RLS politikalarını kontrol et.
2. Politika içinde o tablonun kendisine referans verilip verilmediğine bak.
3. Referansı kaldır ve yardımcı fonksiyona çevir.

---
*Bu doküman projenin en üst düzey teknik talimatıdır ve tüm AI ajanları tarafından titizlikle takip edilmelidir.*
