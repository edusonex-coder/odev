ÖdevGPT mimarisinde uygulanan **Sokratik yöntem**, öğrencinin pasif bir "izleyici" veya "kopyalayıcı" olmasını engelleyip, sürece aktif olarak dahil olmasını sistemsel kısıtlamalar ve yönlendirmelerle zorunlu kılmaktadır.  
Raporda yer alan "Pedagojik Prompting" ve sistem talimatlarına (System Prompt) göre, bu zorunluluk şu üç temel mekanizma ile sağlanır:

### 1\. Diyalog Tabanlı İlerleme (Monolog Yerine Diyalog)

Standart ödev uygulamalarında (Photomath, Chegg vb.) iletişim genellikle tek yönlüdür; öğrenci sorar, sistem cevabı verir. ÖdevGPT’de ise **Sokratik yöntem**, cevabı bir bütün olarak sunmak yerine, çözüm sürecini karşılıklı bir konuşmaya dönüştürür.

* **Pas Atma Mekanizması:** Yapay zeka, problemin çözümünde kritik bir eşiğe geldiğinde duraksar ve topu öğrenciye atar. Örneğin, bir denklemi tamamen çözmek yerine; *"Burada x'i yalnız bırakmak için her iki tarafı neye bölmemiz gerekir?"* veya *"Şimdi bu kurala göre denklemin sağ tarafını sen nasıl yazardın?"* gibi sorular sorar 1, 2\.  
* **Zorunlu Etkileşim:** Öğrenci bu soruya yanıt vermeden (veya en azından düşündüğünü belirtmeden) yapay zeka bir sonraki adıma geçmez. Bu durum, öğrencinin ekran başındaki dikkatini canlı tutar.

### 2\. "Öğrenme Teyidi" Olmadan İşlemin Bitmemesi

Sistemin başarı kriteri (Success Metric), sadece sorunun çözülmesi değil, öğrencinin bunu anladığının teyit edilmesidir.

* **Teyit Soruları:** Sistem talimatlarında (hedef\_target.md), her konuşma döngüsünün sonunda *"Öğrenme Teyidi"* yapılması zorunlu tutulmuştur. Yapay zeka, cevabı verdikten sonra sohbeti kapatmaz; *"Bu çözüm mantığına göre benzer bir örneği sen çözmek ister misin?"* veya *"Anlaşılmayan bir yer kaldı mı?"* gibi sorularla öğrencinin kavrayış düzeyini test eder 2\.  
* **Kopyalamaya Karşı Bariyer:** Öğrenci sadece sonucu alıp gitmek istese bile, sistemin bu ısrarlı "eğitmen" tavrı, onu cevabı kopyalamadan önce en azından çözüm yolunu okumaya mecbur bırakır.

### 3\. Yansıtıcı ve Yönlendirici Sorular (Reflective Questioning)

Sokratik yöntemin özü olan "doğurtma" (maieutics) tekniği, öğrencinin halihazırda bildiği kavramları kullanarak yeni bilgiye ulaşmasını hedefler.

* **Ezber Bozma:** Sistem, *"Cevap 5"* demek yerine, *"Önce elimizdeki elmaları belirleyelim. Arkadaşımız 2 elma daha eklediğine göre hangi işlemi yapmalıyız?"* gibi düşünce zincirleri kurar 3\.  
* **Düşünmeye Sevk Etme:** Raporda belirtildiği üzere sistem, öğrenciye doğrudan balık vermek yerine, olta takımını nasıl kullanacağını gösteren sorular sorarak (scaffolding/iskelet oluşturma) öğrencinin zihinsel efor sarf etmesini sağlar 1\.

Özetle; ÖdevGPT'nin Sokratik mimarisi, öğrencinin **"Cevabı Al \-\> Kopyala \-\> Kapat"** şeklindeki kısa yolunu, **"Sorgula \-\> Yanıtla \-\> Anla \-\> Onayla"** döngüsüne çevirerek derse katılımı teknik olarak zorunlu hale getirir.  
