# 🗄️ SUPABASE KURULUM REHBERİ (Sizin Yapmanız Gerekenler)

Şu ana kadar projenin kodlarını yazdım ancak bu kodların çalışabilmesi için veritabanının Supabase üzerinde oluşturulması gerekiyor. Bu işlem güvenlik nedeniyle **sizin tarafınızdan** yapılmalıdır.

Lütfen aşağıdaki adımları sırasıyla uygulayın:

## 1. Veritabanı Tablolarını Oluşturma 🏗️

1. **Supabase Dashboard**'a gidin: [Supabase](https://supabase.com/dashboard)
2. Projenizi seçin.
3. Sol menüden **SQL Editor**'e tıklayın.
4. **New Query** butonuna basın.
5. Aşağıdaki dosyanın içeriğini kopyalayıp buraya yapıştırın:
   - 📂 Dosya Yolu: `.raporlar/database_schema.sql`
6. Sağ alttaki **RUN** butonuna basın.
   - ✅ "Success" mesajını görmelisiniz.

## 2. Dosya Yükleme Alanlarını (Storage) Açma 📦

1. Yine **SQL Editor**'de **New Query** deyin.
2. Aşağıdaki dosyanın içeriğini kopyalayıp yapıştırın:
   - 📂 Dosya Yolu: `.raporlar/storage_schema.sql`
3. **RUN** butonuna basın.
   - Bu işlem `question_images` ve `avatars` klasörlerini oluşturacak.

## 3. Email Girişini Kontrol Etme 📧

1. Sol menüden **Authentication** -> **Providers** sekmesine gidin.
2. **Email** sağlayıcısının **Enabled** olduğundan emin olun.
3. "Confirm email" (Email doğrulama) seçeneği **kapalı** (disabled) olabilir (geliştirme aşamasında kolaylık sağlar).

---

🎉 **Tebrikler!** Artık sistem tamamen hazır.
- ✅ Kayıt olabilir (Signup)
- ✅ Giriş yapabilir (Login)
- ✅ Profil düzenleyebilir
- ✅ Resim yükleyebilirsiniz.

Şimdi "Soru Sorma" özelliğini geliştirmeye devam edebiliriz! 🚀
