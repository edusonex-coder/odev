ÖdevGPT mimarisinde, "Güven Skoru" (Confidence Score) düşük olan soruların öğretmenlere iletilmesi süreci, **"Human-in-the-Loop" (Döngüde İnsan)** adı verilen stratejik bir triyaj (önceliklendirme ve yönlendirme) mekanizması ile yönetilmektedir.  
Sistemin düşük güvenli sorularda izlediği **"Senaryo B"** akışı ve öğretmenlere iletim süreci adım adım şu şekildedir:

### 1\. Tespit ve Otomatik Durdurma

Yapay zeka modeli bir soruya çözüm üretirken arka planda matematiksel bir kesinlik oranı hesaplar. Eğer bu **Güven Skoru %85 veya %90 gibi belirlenen bir eşik değerin altındaysa**, sistem şu kararı verir:

* **Yanıtı Gizle:** Yapay zekanın ürettiği taslak çözüm, halüsinasyon (uydurma bilgi) riski taşıdığı için öğrenciye **gösterilmez** 1\.  
* **Öğrenciyi Bilgilendir:** Sistem, öğrenciye otomatik olarak şu mesajı iletir: *"Bu soru oldukça zorlu ve detaylı bir inceleme gerektiriyor. Sorunu hemen gerçek uzman öğretmenlerimize aktarıyorum, kısa süre içinde sana dönecekler."* 2\.

### 2\. "Bekleyen Havuz"a Yönlendirme (Triyaj)

Öğrenciye kapatılan soru ve YZ'nin oluşturduğu taslak çözüm, anında dijital bir **"Bekleyen Öğretmen İnceleme Havuzuna" (Human Review Pool)** düşer 1\. Bu süreç, kurumsal firmaların müşteri hizmetlerinde kullandığı eskalasyon (üst birime aktarma) mantığıyla çalışır.

### 3\. Öğretmen Arayüzü (Admin Paneli)

Sistemin arka planında (backend), öğretmenler için özel olarak tasarlanmış bir **"Öğretmen Triyaj Paneli" (Teacher Triage Dashboard)** bulunur. Lovable.dev ile tasarlanan bu gizli admin panelinde süreç şöyle işler:

* **Yan Yana Görüntüleme:** Öğretmen panelini açtığında, ekranın bir tarafında öğrencinin yüklediği **orijinal soruyu**, diğer tarafında ise yapay zekanın ürettiği ancak güven skoru düşük olan **taslak çözümü** görür 1, 3\.  
* **Müdahale:** Öğretmen, sıfırdan çözüm yazmakla vakit kaybetmek yerine, YZ'nin taslağındaki hatayı (yanlış formül, işlem hatası vb.) tespit eder ve düzenler.  
* **Onaylama:** Düzeltme yapıldıktan sonra öğretmen **"Onayla ve Gönder"** butonuna basar 3\.

### 4\. Geri Besleme ve Sistemin Eğitilmesi

Öğretmen "Gönder" butonuna bastığı anda iki işlem gerçekleşir:

1. **Öğrenciye İletim:** Doğrulanmış ve pedogojik olarak güvenilir cevap öğrenciye bildirim olarak gider.  
2. **Yapay Zekayı Eğitme (RLHF):** Öğretmenin yaptığı düzeltme, sistemi eğitmek için bir veri seti olarak kaydedilir. Bu **RLHF (İnsan Geri Bildirimine Dayalı Pekiştirmeli Öğrenme)** döngüsü sayesinde, yapay zeka bir sonraki benzer soruda aynı hatayı yapmamayı öğrenir 1\.

Özetle sistem, düşük güvenli sorularda yapay zekayı bir "cevaplayıcı" değil, öğretmenin işini kolaylaştıran bir "taslak hazırlayıcı" olarak konumlandırarak hem hızı hem de %99.8'e varan doğruluk oranını garanti altına alır 4, 5\.  
