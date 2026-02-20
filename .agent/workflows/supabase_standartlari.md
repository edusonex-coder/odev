---
description: Supabase Database Performance & Security Standards (Zero Error Protocol)
---

# 🏁 OdevGPT Database Standartları (Sıfır Hata Protokolü)

Bu protokol, Supabase Performance ve Security Advisor uyarılarını kalıcı olarak sıfırlamak ve maksimum sorgu hızına ulaşmak için her database işleminde **ZORUNLU** olarak uygulanacaktır.

## 1. RLS (Row Level Security) Kuralları
- **Performans:** Politikalarda `auth.uid()` doğrudan kullanılmayacak. Mutlaka `(SELECT auth.uid())` alt-sorgu (subquery) formatında yazılacak. Bu, ID'nin her satırda yeniden hesaplanmasını önler ve önbelleğe (cache) alınmasını sağlar.
- **Temizlik:** Yeni bir politika eklenmeden önce, o tablodaki tüm eski politikaları isim gözetmeksizin silen "Nuclear Cleanup" döngüsü çalıştırılacak.
  ```sql
  FOR pol_name IN (SELECT policyname FROM pg_policies WHERE tablename = 'table_name') LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol_name, 'table_name');
  END LOOP;
  ```

## 2. İndeksleme Standartları
- **Tekillik:** Bir yabancı anahtar (FK) için sadece bir adet indeks bulunacak.
- **İsimlendirme:** İndeks isimleri standart `idx_[table]_[column]_final` formatında olacak.
- **Güvenlik:** İndeks oluşturmadan önce mutlaka `DROP INDEX IF EXISTS` ile Advisor'ın flaglediği olası ikiz isimler temizlenecek.

## 3. "Ultima Guard" (Defansif Migrasyon)
- Herhangi bir DDL (Alt table, Add column, Create index) işlemi çıplak bırakılmayacak.
- Mutlaka `DO $$` bloğu içinde `IF EXISTS` veya `information_schema` kontrolleri ile sarmalanacak. Bu sayede script, tablo veya kolon yoksa hata verip durmak yerine güvenle bir sonraki adıma geçecek.

## 4. Multi-Tenancy (Tenant İzole Edilmesi)
- Tüm tablolarda `tenant_id` kolonu ve buna bağlı RLS politikası denetlenecek.
- `tenant_id` kolonu olmayan tablolar kritik hata (Warning) olarak kabul edilecek.
