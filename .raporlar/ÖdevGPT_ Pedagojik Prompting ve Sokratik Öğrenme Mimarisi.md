ÖdevGPT’nin "Pedagojik Prompting" mimarisi, öğrencinin ödevi sadece bir angarya olarak görüp hızlıca cevabı kopyalamasını engellemek için **"Cevap Makinesi"** değil, **"Sokratik Bir Eğitmen"** gibi davranacak şekilde kurgulanmıştır.  
Sistem, öğrencinin doğrudan sonuca ulaşmasını engelleyen ve onu sürece dahil eden şu 4 temel mekanizmayı kullanır:

### 1\. Nihai Cevabın Geciktirilmesi (Delayed Gratification)

ÖdevGPT’nin sistem talimatlarında (System Prompt), yapay zekaya verilen en kesin emir; "Görevin öğrencinin sorduğu soruyu doğrudan çözüp ona cevabı vermek DEĞİLDİR" şeklindedir 1\.

* **Nasıl Çalışır?** Standart bir yapay zeka (örneğin ChatGPT veya Photomath) "x kaçtır?" sorusuna doğrudan "x=5" diyebilir. Ancak Pedagojik Prompting, sonucu en sona saklar.  
* **Kopyalamaya Etkisi:** Öğrenci ekranı açtığında kopyalayabileceği tek bir sayı veya şık göremez. Bunun yerine, çözümün mantığını anlatan bir metinle karşılaşır ve cevabı bulmak için bu açıklamayı okumak zorunda kalır 2\.

### 2\. Düşünce Zinciri (Chain-of-Thought) ile Süreç Odaklılık

Sistem, cevabı vermeden önce insan bilişsel süreçlerini taklit eden "Düşünce Zinciri" (CoT) yöntemini kullanır. Bu yöntem, soruyu mantıksal küçük adımlara böler 3\.

* **Mekanizma:** Sistem, "3 elmam var, 2 tane daha aldım" diyen bir öğrenciye "5" demek yerine; "Önce elimizdeki elmaları belirleyelim. Sonra eklenenleri üzerine sayalım. Bu bir toplama işlemidir..." şeklinde akıl yürütür 3\.  
* **Analiz:** Sistem arka planda iki zincir çalıştırır: Biri öğrencinin eksiğini analiz eden "Düşünce Zinciri", diğeri ise bu analize uygun yönlendirici cevabı üreten "Yanıt Zinciri"dir. Bu yapı, öğrencinin sadece "ne" sorusuna değil, "neden" ve "nasıl" sorularına odaklanmasını sağlar 3\.

### 3\. Sokratik Sorgulama ve Öğrenme Teyidi

Sistemin en kritik kopyalama önleyici özelliği, öğrenciye \*\*"Balık vermek yerine balık tutmayı öğretmesi"\*\*dir. Yapay zeka, çözüm sürecinde duraksayarak öğrenciye pas atar.

* **Yönlendirici Sorular:** Sistem, çözümün bir aşamasında "Şimdi bu kurala göre denklemin sağ tarafını sen nasıl yazardın?" gibi sorular sorarak öğrencinin katılımını zorunlu kılar 4\.  
* **Öğrenme Teyidi:** İşlem bittiğinde dahi, öğrencinin konuyu anlayıp anlamadığı teyit edilmeden (örneğin; "Benzer bir örnek yapalım mı?") süreç kapatılmaz 4\. Bu interaktif yapı, öğrencinin pasif bir kopyalayıcı olmaktan çıkıp aktif bir katılımcıya dönüşmesini sağlar.

### 4\. İskelet Oluşturma (Scaffolding)

Eğer öğrenci konuyu anlamazsa, Pedagojik Prompting mimarisi cevabı tekrarlamak yerine "Scaffolding" (İskelet/Basamaklandırma) yöntemini devreye sokar 5\.

* **Uygulama:** Öğrenci "Anlamadım" dediğinde, sistem aynı açıklamayı yapmak yerine konuyu daha basit parçalara ayırır veya gerçek hayattan analojiler kurar 6\.  
* **Örnek:** 11\. Sınıf seviyesindeki bir soruyu anlamayan öğrenciye, sistem 9\. sınıf kazanımlarına inerek temelden anlatmaya başlar. Bu durum, öğrencinin sadece cevabı alıp gitmesini imkansızlaştırır çünkü sistem öğrenciyi "öğrenme çukuruna" çekmektedir.

Özetle; **Pedagojik Prompting**, öğrencinin karşısına sadece kopyalanacak bir **"Sonuç"** (Result) değil, takip edilmesi gereken bir **"Süreç"** (Process) çıkararak kopyalamayı yapısal olarak engeller.  
