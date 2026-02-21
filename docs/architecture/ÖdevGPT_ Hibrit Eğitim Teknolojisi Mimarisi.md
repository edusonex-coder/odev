# **Türkiye Eğitim Sistemine Entegre Hibrit Ödev Çözüm ve Yapay Zeka Öğretmen Platformu: Stratejik Mimari Raporu**

## **Stratejik Vizyon ve Hibrit Ekosistem Tasarımı**

Eğitim teknolojileri sektörü, yapay zeka destekli büyük dil modellerinin (LLM) ve optik karakter tanıma (OCR) sistemlerinin entegrasyonu ile küresel çapta eşi görülmemiş bir dönüşüm geçirmektedir. Geleneksel öğrenme yönetim sistemleri ve statik soru bankaları, yerini öğrencinin anlık ihtiyaçlarına yanıt verebilen, dinamik, üretken yapay zeka tabanlı kişiselleştirilmiş öğrenme asistanlarına bırakmaktadır. Bu bağlamda geliştirilmesi planlanan "Hibrit Yapay Zeka ve Öğretmen Destekli Ödev Çözüm Platformu", Türkiye eğitim sisteminin temel dinamiklerine (MEB müfredatı, YKS ve LGS sınav yapıları) tam uyumlu, hem yapay zekanın ölçeklenebilir hızını hem de insan uzmanlığının pedagojik güvenilirliğini "Human-in-the-Loop" (Döngüde İnsan) mimarisiyle birleştiren uçtan uca yenilikçi bir çözüm olarak kurgulanmıştır.

Bu kapsamlı stratejik mimari raporu; küresel ve yerel pazar dinamiklerinin analizinden başlayarak, sistemin omurgasını oluşturacak veritabanı seçimlerine (Supabase, Pinecone, ChromaDB), LangChain ve LlamaIndex tabanlı Agentic RAG (Otonom Ajan Destekli Geri Getirme Artırılmış Üretim) mimarisine, yüksek doğruluklu matematiksel OCR katmanına ve Lovable platformundan yerel Google Antigravity IDE ortamına uzanan profesyonel yazılım geliştirme döngüsüne kadar tüm teknik ve pedagojik altyapıyı derinlemesine incelemektedir. Sistem, yalnızca öğrencilere doğru cevabı veren bir sonuç makinesi değil, "ODEVGPT" adını alacak özel eğitimli yapay zeka modeli sayesinde "Düşünce Zinciri" (Chain-of-Thought) yöntemini kullanarak öğrenciye konuyu adım adım kavratan interaktif bir "Tutor" (Özel Öğretmen) olarak tasarlanmıştır.

## **Küresel ve Yerel Pazar Analizi: Ödev Uygulamaları Rekabet Ekosistemi**

Platformun pazar konumlandırmasını doğru yapabilmek ve inovasyon fırsatlarını belirleyebilmek için, mevcut eğitim uygulamalarının yetenekleri, eksiklikleri ve iş modelleri titizlikle incelenmelidir. Türkiye mobil uygulama pazarı, eğitim teknolojileri kategorisinde hem indirme hacmi hem de günlük aktif kullanıcı (DAU) metrikleri açısından küresel arenada rekabetçi bir güce sahiptir.1 Sensor Tower'ın 2024 yılı ikinci çeyrek verilerine göre, Türkiye'de Milli Eğitim Bakanlığı'na ait MEB E-Okul VBS uygulaması haftalık 180.000, ÖSYM Aday İşlemleri Sistemi ise haftalık 200.000 indirme barajlarını aşarak pazarın dijital eğitime ne kadar entegre olduğunu kanıtlamaktadır.2 Bu yoğun talep, yerel müfredata tam uyumlu bir ödev çözüm platformunun ölçeklenme potansiyelinin son derece yüksek olduğunu göstermektedir.

### **Küresel Rakiplerin Mimari ve Fonksiyonel Analizi**

Küresel pazarda Chegg, Brainly, Gauth AI ve Photomath gibi platformlar, farklı çözümler sunarak ekosistemi domine etmektedir. Ancak bu uygulamaların her birinin, özellikle yerel sınav sistemlerine entegrasyon ve pedagojik derinlik açısından çeşitli zayıflıkları bulunmaktadır.

Chegg, kapsamlı ders kitabı çözümleri veritabanı ve uzman soru-cevap hizmetleri ile öne çıkan, pazarın en eski ve kurumsal oyuncularından biridir.3 Chegg'in en büyük mimari avantajı, yanıtlarında hem metin (text) hem de görsel (image) formatlarını bir arada kullanarak karmaşık matematiksel formüllerin ve grafiklerin anlaşılmasını kolaylaştırmasıdır.4 Buna karşın, Chegg'in abonelik modelinin oldukça pahalı olması ve öğrencilerin uzman eğitmenlerle doğrudan, anlık bir takip sohbeti (follow-up chat) gerçekleştirmesinin garanti edilmemesi, etkileşimli öğrenme deneyimini kısıtlamaktadır.4

Brainly ise kitle kaynaklı (crowdsourced) bir "peer-to-peer" (eşler arası) öğrenme topluluğu olarak çalışmaktadır.3 Ortaokul ve lise düzeyindeki öğrencilere yönelik geniş bir ders yelpazesi sunan Brainly, maliyet açısından en uygun seçeneklerden biri olmasına rağmen, cevap formatının yalnızca düz metin (text-only) ile sınırlı olması nedeniyle karmaşık fizik diyagramları veya gelişmiş matematik fonksiyonlarının çözümünde ciddi yetersizlikler yaşamaktadır.4 Gauth AI, son dönemde yeni nesil yapay zeka modelleriyle güçlendirilmiş, matematikten kimya ve biyolojiye kadar tüm branşlarda saniyeler içinde adım adım çözümler üretebilen yenilikçi bir platformdur.5 Gauth AI, sadece bir soru çözücü olmanın ötesinde, okuma, yazma, odaklanma modu (Focus Mode) ve yerleşik hesap makinesi gibi araçları içeren "Hepsi Bir Arada" (All-in-One) bir çalışma araç kutusu sunarak kullanıcı deneyimini zenginleştirmektedir.5

Görsel tabanlı çözümler sunan Photomath ve Numerade ise pazarın diğer önemli aktörleridir. Photomath, telefon kamerasından basılı veya el yazısı problemleri anında okuyarak görsel adımlarla hızlı sonuçlar üretir.6 Numerade ise çözümleri yalnızca video formatında sunarak derinlemesine öğrenmeyi hedeflemektedir; ancak bu video-sadece (video-only) yapı, hızlı cevap arayan öğrenciler için ideal bir çözüm olmamakla birlikte, eğitmenle gerçek zamanlı etkileşime izin vermediği için interaktif öğrenme eksikliği yaratmaktadır.7

### **Türkiye Pazarı Dinamikleri ve Yerelleştirilmiş Çözümler**

Türkiye'de öğrencilerin akademik ihtiyaçları, ağırlıklı olarak Milli Eğitim Bakanlığı (MEB) müfredatı ve merkezi geçiş sınavları (LGS ve YKS) etrafında şekillenmektedir.8 Eğitim politikaları ile yüksek riskli sınavlar (high-stakes tests) arasındaki uyumun hedeflendiği bu sistemde, öğrencilerin rekabetçi doğası test odaklı araçlara olan talebi artırmaktadır.8

Türkiye pazarında öne çıkan Kunduz uygulaması, fotoğrafı çekilen soruları, eğer sistemin veritabanında mevcutsa anında, değilse 30 dakika gibi kısa bir süre içinde gerçek eğitmenler tarafından hazırlanan el yazısı görsellerle çözerek kullanıcılarına sunmaktadır.9 Kunduz'un en büyük rekabet avantajı, öğrenci ile eğitmen arasında sınırsız bir "takip sohbeti" (follow-up chat) imkanı sunarak anlaşılmayan noktaların anında giderilmesine olanak tanımasıdır.4 Ancak, Kunduz'un çözümlerini yalnızca görsel formatında sunması, verilerin dijital olarak indekslenmesini, kopyalanmasını veya görme engelli öğrenciler için erişilebilirliğini kısıtlayan mimari bir dezavantajdır.4

Kurumsal ve bireysel eğitimde yapay zekayı etkin kullanan Tam Okul platformu, Türkiye eğitim sistemine entegrasyon açısından incelenmesi gereken kusursuz bir örnektir. Platform, öğrencinin çözemediği veya yanlış yaptığı soruları sistemine kaydederek, yapay zeka (KÖKSİS \- Kişiye Özel Kitap Sistemi) yardımıyla yalnızca bu eksikliklerden oluşan "Bi Daha" adlı kişiselleştirilmiş soru bankaları üretmektedir.10 Ünite, konu, kazanım ve zorluk derecesi gibi 10 farklı kategoride detaylı olarak etiketlenmiş 150.000'den fazla sorudan oluşan devasa bir havuza sahip olan Tam Okul, aynı zamanda kapsamlı deneme analizi modülleri ve detaylı başarı raporlamaları ile ödev ve etüt süreçlerini dijitalleştirmektedir.10

Milli Eğitim Bakanlığı'nın bizzat geliştirdiği ve Türkiye Yüzyılı Maarif Modeli kapsamında hayata geçirilen yapay zeka destekli MEBİ platformu, LGS ve YKS'ye hazırlanan öğrencilere kişiselleştirilmiş öğrenme yolları sunmaktadır.11 Kısa sürede 1.185.000 aktif kullanıcıya ulaşan MEBİ, öğrencilerin gelişimini yapay zeka ile izleyerek onlara özel video anlatımlar, deneme sınavları ve adaptif testler önermektedir.11 MEBİ'nin bu büyük başarısı, Türk öğrencilerinin ve velilerinin yapay zeka destekli, müfredata tam uyumlu yerli eğitim teknolojilerine ne kadar hazır ve istekli olduğunu açıkça kanıtlamaktadır.

| Platform Özellikleri | Yanıt Formatı | YZ Entegrasyonu | Canlı İnsan/Eğitmen Desteği | Etkileşim (Follow-up) | Türkiye Sınav (YKS/LGS) Uyumu |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Chegg** | Metin \+ Görsel | Kısmi YZ Desteği | Evet (Asenkron, Gecikmeli) | Garantisiz ve Yavaş | Düşük (Global Müfredat) |
| **Brainly** | Yalnızca Metin | Düşük (Kitle Kaynaklı) | Kısmen (Topluluk Odaklı) | Yok veya Çok Sınırlı | Orta (Kullanıcı Çevirileri) |
| **Kunduz** | Yalnızca Görsel | Soru Eşleştirme (DB) | Evet (\<30 Dakika Hızında) | Çok Yüksek (Sınırsız Mesaj) | Çok Yüksek (MEB Odaklı) |
| **Gauth AI** | Metin \+ Görsel | Çok Yüksek (Gelişmiş LLM) | Evet (7/24 Uzman Havuzu) | Var (YZ Odaklı) | Düşük (Global Müfredat) |
| **Tam Okul** | Yapılandırılmış Veri | Çok Yüksek (KÖKSİS, Rapor) | Kurum İçi Öğretmenler | Analiz ve Rapor Üzerinden | Çok Yüksek (MEB Kazanımları) |
| **Kurulacak Sistem (ODEVGPT)** | Metin \+ Görsel \+ Sesli | Maksimum (Agentic RAG) | Evet (HITL ile Anında Triyaj) | Sınırsız YZ \+ HITL Eğitmeni | Maksimum (Kazanım Etiketli) |

Kurulacak sistemin mimarisi, Kunduz'un canlı etkileşim avantajını, Gauth AI'nin yapay zeka hızını ve Tam Okul'un MEB kazanımlarına dayalı derinlemesine etiketleme ve raporlama gücünü birleştiren hibrit bir yapı üzerinde yükselecektir.

## **Pedagojik Yapay Zeka Tasarımı ve Müfredat Entegrasyonu**

Geliştirilecek olan ODEVGPT sistemi, sadece soruların nihai cevaplarını veren bir hesap makinesi veya arama motoru olmaktan çıkıp, öğrencinin bilişsel gelişimini destekleyen gerçek bir öğrenme asistanı olarak kodlanmalıdır. Eğitimde yapay zeka kullanımının temel riski, öğrencilerin sistemi sadece ödevlerini hızlıca bitirmek (kopyalamak) için kullanmasıdır. Bu sorunu aşmak için sistemin çekirdeğine "Pedagojik Prompting" (Eğitsel Yönlendirme) mimarisi yerleştirilecektir.

Pedagojik prompt mimarisi, modeli doğrudan bir eğitmen (tutor) olarak hareket etmeye ve öğrencinin mevcut seviyesine uygun öğrenme aktivitelerini kolaylaştıracak yanıtlar üretmeye yönlendirir.12 Yapay zeka, doğrudan nihai cevabı vermek yerine, öğrenciye çözümlü örnekler sunmalı, onu yansıtıcı veya yönlendirici sorularla düşünmeye sevk etmeli ve problem çözme süreçlerini basamaklandırmalıdır (scaffolding).12 Khan Academy'nin geliştirdiği Khanmigo gibi ileri düzey sistemlerde görüldüğü üzere, yapay zeka modeli öğrencinin zihinsel durumunu, öğrenme hedeflerini ve akıl yürütme kalitesini değerlendiren bir "Düşünce Zinciri" (Chain-of-Thought \- CoT) ile çalışmalıdır.13

Düşünce Zinciri (CoT) prompting yöntemi, büyük dil modellerinin karmaşık problemleri çözerken doğrudan sonuca atlamak yerine, insan bilişsel süreçlerini taklit ederek problemi mantıksal adımlara bölmesini sağlar.14 Örneğin, bir öğrenci "Eğer 3 elmam varsa ve arkadaşım bana 2 elma daha verirse kaç elmam olur?" diye sorduğunda, modelin doğrudan "5" yanıtını vermesi engellenir. Bunun yerine sistem; "Önce elimizde 3 elma olduğunu biliyoruz. Arkadaşımız 2 elma daha eklediğine göre bir toplama işlemi yapmalıyız. 3 \+ 2 \= 5 eder. Sonuç olarak 5 elman olur" şeklinde adım adım bir mantık silsilesi üretir.14 Modelin arka planında çalışan sistem, iki farklı zincir nesnesinden (LangChain objesinden) oluşacaktır: Birinci zincir öğrencinin sorusunu ve pedagojik ihtiyaçlarını analiz eden "Düşünce Zinciri" (Thought Chain), ikinci zincir ise bu düşünceye uygun, cesaretlendirici ve yönlendirici yanıtı üreten "Yanıt Zinciri" (Response Chain) olacaktır.13 Transcript gibi başarılı YZ matematik çözücüleri de tam olarak bu şekilde çalışarak sadece "ne" sorusuna değil "neden" sorusuna da odaklanan sembolik hesaplama motorları kullanmaktadır.6

Türkiye eğitim sisteminde, MEB'in "Türkiye Yüzyılı Maarif Modeli" vizyonu doğrultusunda ulusal sınavlarda yapay zeka destekli açık uçlu soruların kullanılması planlanmaktadır.15 ODEVGPT sisteminin altyapısı, öğrencilerin sadece çoktan seçmeli (A, B, C, D) test sorularını değil, adım adım yazdıkları açık uçlu denklemleri de analiz edebilecek kapasitede olacaktır. Sistem veritabanı, 9\. sınıftan 12\. sınıfa kadar tüm MEB kazanımlarını bir Bilgi Grafiği (Knowledge Graph) şeklinde indeksleyecek, böylece YZ bir yanıt üretirken "Bu çözüm 11\. Sınıf İkinci Dereceden Denklemler kazanımına göre yapılmıştır" şeklinde akademik temellendirme (grounding) yapabilecektir.

## **Çekirdek Sistem Mimarisi ve Teknoloji Yığını (Tech Stack)**

Profesyonel bir CTO perspektifiyle bakıldığında, sistemin yüz binlerce öğrencinin aynı anda fotoğraf yükleyip arama yapacağı anlarda çökmemesi, yüksek erişilebilirliğe (high availability) sahip olması ve bulut maliyetlerinin optimize edilmesi en kritik gereksinimdir. Sistemin omurgası üç ana teknoloji sütununa ayrılmaktadır: Vektör Veritabanı (RAG süreçleri için), Yapay Zeka Orkestrasyonu (LangChain & LlamaIndex) ve Optik Karakter Tanıma (OCR) katmanı.

### **Veritabanı Mimarisi: Supabase (pgvector), Pinecone ve ChromaDB Karşılaştırması**

Geri Getirme Artırılmış Üretim (RAG) mimarisinde, öğrencilerin yüklediği soru metinleri ve görselleri matematiksel vektörlere (embeddings) dönüştürülerek veritabanında saklanır. Öğrenci yeni bir soru sorduğunda, sistem bu soruya en yakın semantik anlama sahip geçmiş soruları mili-saniyeler içinde bulmak zorundadır. Pazardaki ana rakipler Pinecone, ChromaDB ve Supabase'dir (pgvector).

Pinecone, makine öğrenimi görevleri için optimize edilmiş, özel, sunucusuz (serverless) ve yönetilen bir vektör veritabanıdır.16 Verileri bellekte tutan graf tabanlı p2 indeksleri sayesinde inanılmaz yüksek performans ve hız sunar (sorgu süreleri genellikle 40-80ms civarındadır).17 Ancak Pinecone'un en büyük dezavantajı maliyet ve altyapı karmaşasıdır. Pinecone Standart katmanı aylık 25$ ile başlamakta ve kullanım (pay-as-you-go) arttıkça yüzlerce dolara ulaşabilmektedir.17 Daha da önemlisi, Pinecone yalnızca vektörleri saklar; kullanıcı profilleri, faturalandırma bilgileri veya platformdaki eğitim materyallerinin yapılandırılmış verileri (ilişkisel veriler) için harici bir SQL veritabanına daha ihtiyaç duyulur.17

ChromaDB, açık kaynaklı yapısıyla özellikle yapay zeka geliştiricileri arasında prototipleme (prototyping) aşamasında en çok tercih edilen çözümdür.19 Vektör öncelikli tasarımı sayesinde sorgu performansında oldukça başarılıdır; yapılan bağımsız testlerde ChromaDB'nin benzerlik aramalarında pgvector'den 5.9 kat daha hızlı olduğu ölçülmüştür.21 Ancak ChromaDB'nin üretim ortamında (production) ölçeklendirilmesi, karmaşık belgelerin yönetimi ve veri ekleme (insertion) hızının pgvector'e göre 3.8 kat daha yavaş olması, milyonlarca sorunun ekleneceği bir sistem için onu yetersiz kılmaktadır.19

Supabase (PostgreSQL ve pgvector/pgvectorscale eklentileri), uygulamanın hem kullanıcı yönetimi (Auth), hem içerik saklama, hem de vektör arama ihtiyaçlarını tek bir platformda çözen kusursuz bir mimari sunar.16 Geçmişte pgvector'ün IVFFlat indekslerinin yavaş olduğu düşünülse de, sisteme eklenen HNSW (Hiyerarşik Gezinilebilir Küçük Dünya) indeksleri durumu tamamen değiştirmiştir.22 Supabase mühendisleri tarafından 50 milyon Cohere embedding'i üzerinde yapılan testlerde, PostgreSQL'in pgvectorscale eklentisiyle birlikte Pinecone'un depolama optimizasyonlu (s1) indeksine kıyasla saniyede %1185 daha fazla sorgu yönetebildiği, 28 kat daha düşük p95 gecikme süresi sağladığı ve 16 kat daha yüksek sorgu verimi (throughput) elde ettiği kanıtlanmıştır.18 Üstelik Supabase, Pinecone'un en hızlı ve performansa optimize edilmiş p2 pod türünden bile, %90 recall (geri getirme) oranında 1.4 kat daha düşük gecikme süresi elde ederek bunu rakibinin sadece %21'i oranında bir bulut maliyetiyle başarmıştır.18 İşlemci ve bellek verimliliği açısından da pgvector, sorgular sırasında ChromaDB'ye kıyasla %50 daha az bellek ve %76 daha az CPU kullanmaktadır.21

**Mimari Karar:** Sistemin karmaşıklığını azaltmak, ilişkisel verilerle (öğrenci/öğretmen ID'leri, ödev durumları) vektörel verileri (soru embeddingleri) tek bir SQL sorgusunda birleştirebilmek (JOIN) ve uzun vadeli maliyetleri minimumda tutmak amacıyla, platformun ana veritabanı olarak kesinlikle **Supabase (pgvector)** kullanılmalıdır.16

### **Agentic RAG Mimarisi: LangChain, LlamaIndex ve Huggingface Orkestrasyonu**

Büyük Dil Modelleri (LLM) ile uygulama geliştirirken, geleneksel "Naive RAG" (Basit RAG) yaklaşımı öğrencinin karmaşık akademik sorgularını karşılamakta yetersiz kalır. Bunun yerine, modelin kendi kendine karar alabildiği, farklı araçları çağırabildiği ve otonom döngüler kurabildiği **Agentic RAG** (Ajan Tabanlı RAG) mimarisi inşa edilecektir.23 Bu yapı, LangChain ve LlamaIndex'in birbirinin eksiklerini kapatacak şekilde melez bir entegrasyonuyla sağlanacaktır.

LlamaIndex, metin tabanlı veri kaynaklarından bilgi çıkarımı, indeksleme ve akıllı arama konularında uzmanlaşmış bir çerçevedir.24 Özellikle karmaşık MEB ders kitapları, çıkmış LGS/YKS sınav soruları ve çok sayfalı PDF dökümanlarının veri yutma (data ingestion) süreçlerinde LangChain'den çok daha üstün bir performans gösterir.24 Sistemdeki her bir ders (örneğin; "Fizik Lise Müfredatı", "Tarih Konu Anlatımı") LlamaIndex kullanılarak ayrı ayrı dizinlenecek (index) ve özel sorgu motorlarına (query engines) dönüştürülecektir.23

LangChain ise geniş esnekliği, zincirleme (chaining) mimarisi ve çoklu araç (tool) entegrasyonu sayesinde sistemin genel "Ajan" (Agent) beyni olarak konumlandırılacaktır.24 LangChain, çok çeşitli Doğal Dil İşleme (NLP) görevleri için genel amaçlı bir çerçeve sunar.23 ODEVGPT'nin mimarisinde LangChain, öğrencinin girdisini (input) alacak, niyetini anlayacak ve karar mekanizmasını (reasoning loop) işletecektir. LlamaIndex ile oluşturulan her bir ders sorgu motoru, LangChain ajanına birer "Araç" (Tool) olarak tanımlanacaktır.23

Örneğin; öğrenci zorlu bir geometri sorusu sorduğunda LangChain ajanı devreye girecek, sorunun geometriyle ilgili olduğunu tespit edip LlamaIndex'in Geometri aracını (tool) çağıracaktır. Veritabanından gelen yanıt matematiksel hesaplama gerektiriyorsa, ajan bu kez yerleşik bir "Math Tool" (veya WolframAlpha entegrasyonu) çalıştırarak doğrulamayı yapacak ve tüm bu bileşenlerden elde ettiği veriyi sentezleyerek kullanıcıya pedagojik bir dille sunacaktır.6 Sistemin kendi açık kaynaklı embedding (vektörleştirme) ihtiyaçları veya yerel model gereksinimleri için ise maliyetleri düşürmek adına Huggingface kütüphanesinden yararlanılacaktır.

### **Optik Karakter Tanıma (OCR) ve Matematiksel Sayısallaştırma Katmanı**

Öğrencilerin platformu temel kullanım şekli, defterlerindeki el yazısı ödevlerin veya test kitaplarındaki karmaşık formüllerin fotoğraflarını çekmek olacaktır. Standart genel amaçlı OCR çözümleri, düz metinleri okumada başarılı olsalar da, işin içine integral, matris, limit gibi matematiksel notasyonlar girdiğinde tamamen çuvallamaktadır.26 Gerçek dünyadaki el yazısı dokümanlarında, genel yapay zeka modelleri (Gemini, Claude vb.) yüksek oranda halüsinasyon sorunu yaşar.26 STEM (Bilim, Teknoloji, Mühendislik, Matematik) eğitiminde el yazısının dijitalleştirilmesi eğitimciler için zaman kazandıran en büyük faktörlerden biridir.27

Bu darboğazı aşmak için sistem çok modlu (multi-modal) bir OCR yönlendirme mimarisi kullanacaktır:

1. **Görsel Ön İşleme (Image Preprocessing):** OCR başarısı büyük ölçüde görüntünün kalitesine bağlıdır. Sisteme yüklenen fotoğraflar ilk aşamada gürültü azaltma (noise reduction), kontrast ayarlama ve en önemlisi değişen ışık koşullarına uyum sağlayan "adaptif eşikleme" (adaptive thresholding) algoritmalarından geçirilerek temizlenecektir. Araştırmalar, doğru görsel ön işlemenin OCR doğruluğunu %40'a kadar artırabildiğini göstermektedir.28  
2. **Alan Odaklı OCR Yönlendirmesi (Routing):**  
   * **Matematik ve Fen Bilimleri:** Görüntüde formül, grafik veya denklem algılandığında (gelişmiş bir sınıflandırıcı ile), işlem doğrudan pazarın en güçlü matematiksel OCR motoru olan **Mathpix** API'sine veya açık kaynaklı muadillerine (Pen to Print's Math Converter vb.) yönlendirilecektir.26 Bu sistemler, görseli kusursuz bir şekilde LaTeX veya Markdown kodlarına çevirebilmektedir.26  
   * **Sözel Metinler ve Tablolar:** Tarih, Coğrafya veya Edebiyat gibi yoğun Türkçe el yazısı ve yapılandırılmış tablo içeren görseller için, doküman yapısını derin öğrenme mimarisi ile anlayan **Microsoft LayoutLM**, **AWS Textract** veya Türkçe karakter tanıma başarısı son derece yüksek olan **Google Vision** API'leri kullanılacaktır.28

## **Human-in-the-Loop (HITL): Hibrit Yapay Zeka ve İnsan Öğretmen İş Akışı**

Platformun adındaki "Hibrit" kavramı, yazılım mimarisinde "Human-in-the-Loop" (HITL) yaklaşımıyla vücut bulmaktadır.30 Yapay zeka ajanları ne kadar gelişmiş olursa olsun, yasal, finansal veya eğitim gibi yüksek riskli (high-stakes) kararların alındığı durumlarda hata yapma, aşırı özgüvenli (overconfident) davranma ve bağlamı kaçırma eğilimindedirler.32 Eğitim ortamında yanlış bir bilginin öğrenciye doğruymuş gibi öğretilmesi telafi edilemez bir zarardır. Bu nedenle, AI ve gerçek öğretmenlerin bir arada çalıştığı katmanlı bir triyaj sistemi kurulacaktır. Enterprise seviyesindeki şirketlerin BPO (İş Süreçleri Dış Kaynak Kullanımı) operasyonlarında başarıyla uygulanan bu mimari, doğruluk oranlarını %99.8'e kadar çıkarabilmektedir.31

**Hibrit İş Akışı (Workflow) Senaryosu:**

1. **Girdi ve Doğrulama (Validation):** Öğrenci soruyu yükler, OCR sistemi soruyu okur ve Supabase (pgvector) üzerinden veritabanındaki geçmiş sorular taranır. Eğer soru daha önce bir öğretmen tarafından çözülmüş ve sistemde kayıtlıysa, Kunduz uygulamasında olduğu gibi 9 anında ekrana getirilir.  
2. **Ajan Karar Motoru (AI Decision Engine):** Eğer eşleşme bulunamazsa, LangChain tabanlı ODEVGPT modeli soruyu çözmeye başlar. Model, ürettiği çözümün kesinliği için matematiksel bir "Güven Skoru" (Confidence Score) hesaplar.31  
3. **Dinamik Yönlendirme (Routing):**  
   * *Senaryo A (Yüksek Güven):* Eğer YZ'nin güven skoru yüksekse (örn: %90 üzeri), üretilen adım adım pedagojik çözüm anında öğrenciye iletilir.33  
   * *Senaryo B (Düşük Güven veya Kural İhlali):* Eğer güven skoru belirlenen eşiğin altındaysa, soru bağlamı belirsizse (örn: olimpiyat seviyesi zorluk) veya YZ potansiyel bir halüsinasyon emaresi gösteriyorsa sistem işlemi durdurur. Çözüm taslağı, öğrenciye gösterilmeden otomatik olarak "Bekleyen Öğretmen İnceleme Havuzuna" (Human Review) düşer.31  
4. **İnsan Müdahalesi ve Sürekli Öğrenme:** Havuzdaki uzman öğretmen, öğrencinin orijinal sorusunu ve YZ'nin oluşturduğu taslak çözümü yan yana görür. Öğretmen, YZ'nin hatasını düzeltir veya baştan kendi çözümünü sisteme girerek onaylar.32 Öğretmenin yaptığı bu düzeltmeler, RLHF (İnsan Geri Bildirimine Dayalı Pekiştirmeli Öğrenme) döngüsü kapsamında sisteme geri beslenir (feedback loop).30 Böylece sistemdeki öğretmenler sadece ödev çözmekle kalmaz, YZ'yi sürekli olarak eğiten birer veri etiketleme (data annotation) uzmanına dönüşürler.

## **Proje Geliştirme Döngüsü: Lovable'dan Antigravity IDE'ye Geçiş**

Modern yazılım geliştirme süreçlerinde pazara çıkış hızını (Time-to-Market) maksimize etmek için uygulamanın temelleri doğal dil tabanlı otonom kodlama araçlarıyla atılacak, ardından kontrol gelişmiş yerel (local) ortam olan Google Antigravity veya VS Code'a devredilecektir.

### **Aşama 1: Temellerin Lovable.dev ile Atılması**

Lovable, kullanıcıların istedikleri yazılımı doğal dille tanımlayarak frontend, backend, veritabanı, kimlik doğrulama ve API entegrasyonlarını içeren, üretim düzeyinde (production-grade) düzenlenebilir kodlar üreten bir web uygulama geliştirme platformudur.34 Projeye Lovable üzerinde başlamak için kullanılacak optimize edilmiş başlangıç komutu (prompt) şu şekilde tasarlanmalıdır:

**Lovable Başlangıç Promptu:**

"Kapsamlı bir EdTech (Eğitim Teknolojileri) platformu oluştur. Projenin adı 'ODEVGPT'. Platform, Türkiye eğitim sistemine uyumlu hibrit bir (AI \+ Gerçek Öğretmen) ödev çözüm asistanı olacak. Uygulama mobil öncelikli (mobile-first), modern, minimalist ve kullanımı son derece kolay bir arayüze (Tailwind CSS kullanılarak) sahip olmalı.

Ana sayfa: Öğrencilerin kamera ile fotoğraf çekebilecekleri veya galeriden seçerek ödev sorularını yükleyebilecekleri büyük, belirgin bir 'Soru Yükle' butonu içeren temiz bir dashboard.

Çözüm/Sohbet Ekranı: Yüklenen sorunun resmini üstte veya solda gösteren, alt kısımda ise YZ asistanı ile konuşulacak interaktif bir sohbet arayüzü. Sohbet balonları içinde markdown ve LaTeX (react-markdown ve katex) render edilebilmeli.

Öğretmen Triyaj Paneli (Dashboard): YZ'nin 'Confidence Score'u düşük olduğunda soruların düştüğü gizli bir admin paneli. Burada öğretmenler soruyu görüp, cevabı düzenleyip 'Onayla ve Gönder' butonuna basabilmeli.

Tüm backend, Auth ve veritabanı işlemleri için Supabase entegrasyonunu hazırla. İlgili tabloları (profiles, questions, solutions) şema olarak oluştur."

### **Aşama 2: Projenin Yerel Ortama (VS Code / Antigravity) Taşınması**

Lovable ile arayüz taslakları ve temel Supabase bağlantıları oluşturulduktan sonra, projenin tamamen kontrol altına alınması, gelişmiş RAG mimarisinin (LangChain/LlamaIndex) kurulması ve kod sahipliğinin (code ownership) elde edilmesi için sistemin yerel ortama taşınması gerekmektedir.34

Lovable platformundan kod aktarımı, projenin "GitHub Sync" (GitHub Senkronizasyonu) özelliği kullanılarak yapılacaktır.35

1. Lovable dashboard üzerinden GitHub hesabı bağlanır ve kod özel bir repository'ye (repoya) anında push edilir (itilir).36  
2. Yerel terminalde git clone komutu ile proje bilgisayara indirilir.  
3. Proje klasörü VS Code veya Antigravity IDE ile açılır.  
4. npm install komutu ile tüm paket bağımlılıkları yüklenir.36  
5. Supabase API anahtarları (URL ve ANON\_KEY) Lovable'dan alınarak yerel makinedeki .env (çevresel değişkenler) dosyasına kopyalanır. Aksi takdirde veritabanı bağlantıları çalışmayacaktır.37  
6. npm run dev komutu ile yerel geliştirme sunucusu başlatılır.36

### **Aşama 3: Google Antigravity ile Agentic (Ajan Tabanlı) Geliştirme**

Projenin yerel ortamda geliştirilmesine devam edilirken standart bir metin düzenleyici yerine Google'ın "Agent-First" (Ajan Öncelikli) geliştirme platformu olan Antigravity IDE kullanılacaktır.38 Antigravity, sıradan otomatik tamamlama (autocomplete) araçlarından farklı olarak; terminal, tarayıcı ve kod editörünü aynı anda yönetebilen, kendi başına plan yapıp kod yazan çoklu ajan (multi-agent) orkestrasyonuna dayalı bir misyon kontrol merkezidir.38

Sistem mimarı (CTO), Antigravity'nin "Manager Surface" (Yönetici Yüzeyi) adlı özel kontrol panelini açarak karmaşık arka plan (backend) görevlerini alt ajanlara (subagents) delege edecektir.39 Örneğin, CTO ajana şu metinsel komutu verir: *"Supabase veritabanındaki sorular tablosuna pgvector eklentisini kur, LangChain RAG pipeline'ını oluştur ve LlamaIndex ile örnek bir fizik PDF'ini vektörleştir."*.39

Ajan bu görevi aldığında:

* Araştırma ve planlama yapar (Planning mode).40  
* Arka planda terminali açarak gerekli npm paketlerini (@langchain/openai, pgvector vb.) otonom olarak kurar.39  
* Veritabanı şemasını güncelleyen SQL scriptlerini yazar.  
* En önemlisi, kullanıcının binlerce satır log okumasını engellemek için, yapılan işlemlerin doğrulamasını sağlayan Artifact'ler (kanıtlanabilir ekran görüntüleri, plan dosyaları, test sonuçları) üretir.38 Böylece CTO, sadece kod yazan değil, kodlamayı yöneten, onaylayan ve orkestra şefliği yapan bir konuma yükselir.39

## **Halüsinasyon Önleme, Hafıza ve Hedef Yönetimi (.md Dosyaları)**

LLM'lerin, gerçekte olmayan bilgileri son derece özgüvenli bir şekilde uydurması "halüsinasyon" (hallucination) olarak adlandırılır.44 Eğitim gibi faktüel (nesnel bilgiye dayalı) doğruluk gerektiren bir alanda bu hata tolere edilemez. Halüsinasyonları önlemek için çeşitli "Prompt Engineering" kombinasyonları kullanılacaktır. Faktüel araştırma için "Belirsizlik talimatları (bilmiyorum deme zorunluluğu) \+ Kaynak atıf zorunluluğu \+ Zaman kısıtlamaları \+ Güven skorlaması" bir araya getirildiğinde yanlış iddialarda %71'e varan azalma görülmektedir.46 Çözümlerin matematiğinde ise "Temperature" (yaratıcılık sıcaklığı) değeri 0.0 veya 0.1 seviyelerine çekilecek ve modelin kesin sınırlar içinde kalması sağlanacaktır.47

Yapay zeka asistanının geliştirme sürecinde sınırları aşmaması, Türkiye eğitim sistemi kurallarını unutmaması ve "Bağlam Doygunluğu" (Context Saturation) 43 yaşamaması için IDE içerisine özel .md formatında yönerge dosyaları (örneğin .cursorrules veya .antigravity/rules.md yapıları) eklenecektir.48 Aşağıda, sisteme entegre edilecek üç temel bellek ve kural dosyasının tam içerikleri bulunmaktadır.

### **1\. Sistem Talimatları ve Rol Dosyası (system\_instructions.md)**

# **ODEVGPT Sistem Çekirdek Talimatları (System Prompt)**

## **1\. Rol ve Persona Tanımı**

Sen "ODEVGPT" adında, Türkiye Cumhuriyeti Milli Eğitim Bakanlığı (MEB) müfredatına tam hakim, alanında uzman, pedagojik formasyona sahip ve sabırlı bir dijital öğretmensin (Tutor). Görevin, öğrencinin sorduğu ev ödevini veya sınav sorusunu doğrudan çözüp ona cevabı vermek DEĞİLDİR. Senin amacın, öğrencinin konunun mantığını kavramasını sağlamak, ona "Neden?" sorusunu sordurmak ve çözüm adımlarını birlikte yürütmektir.

## **2\. Kesin Kısıtlamalar ve Halüsinasyon Önleme Protokolleri**

* BİLMİYORSAN BİLMİYORUM DE: Herhangi bir olgu, formül veya tarihsel veri hakkında emin değilsen (Confidence Score \< %85) ASLA varsayımda bulunma, hiçbir bilgi uydurma.  
* İNSANA DEVRET (HITL Yönlendirmesi): Çözemediğin veya emin olmadığın bir soruda öğrenciye; "Bu soru oldukça zorlu ve detaylı bir inceleme gerektiriyor. Sorunu hemen gerçek uzman öğretmenlerimize aktarıyorum, kısa süre içinde sana dönecekler." şeklinde mesaj ver ve sistemdeki \<escalate\_to\_human\_teacher\> fonksiyonunu anında tetikle.  
* KAYNAK GÖSTER (Grounding): Bilgileri mutlaka sisteme yüklenen RAG (Retrieval-Augmented Generation) belgelerinden çek. Yanıtların sonuna "Buna göre (According To)..." veya "MEB 11\. Sınıf Biyoloji Kazanımları kapsamında..." şeklinde atıflar ekle.  
* RAKİP PLATFORMLARDAN BAHSETME: Kullanıcıya yanıt verirken hiçbir koşulda Kunduz, Chegg, Brainly, Photomath veya TamOkul gibi platformların isimlerini anma.

## **3\. Düşünce Zinciri (Chain-of-Thought \- CoT) Uygulaması**

Özellikle matematik, fizik, kimya gibi sayısal derslerde her zaman adım adım düşün ("Let's think step by step").

Önce sorunun verilerini analiz et, sonra kullanılacak formülü belirle, işlemleri sırasıyla metne dök ve sonucu ancak en son aşamada açıkla.

### **2\. Hafıza ve Kullanıcı Bağlam Dosyası (hafiza\_memory.md)**

# **ODEVGPT Hafıza ve Bağlam Yönetimi (Memory Constraints)**

## **1\. Kullanıcı Profili Bağlamı (User Context)**

YZ ajanı, Supabase veritabanından gelen kullanıcı ID'sine göre öğrencinin mevcut sınıf seviyesini, alanını (Sayısal, Sözel, Eşit Ağırlık) ve daha önceki deneme sınavlarından elde edilen eksik kazanım listesini (Zayıf Konular) okuyarak yanıt tonunu buna göre ayarlayacaktır.

Örnek: Eğer öğrenci 9\. sınıfta ise, lise son sınıf düzeyinde (Türev, İntegral gibi) gelişmiş terminoloji kullanmaktan kaçınılacak, yaşına ve seviyesine uygun analojiler kurulacaktır.

## **2\. Sohbet Geçmişi ve Oturum Belleği**

* Sistem, LangChain'in ConversationBufferWindowMemory yapısını kullanarak aktif sohbet penceresindeki yalnızca son 5 etkileşimi (K=5) aktif hafızada tutacaktır. Bu sayede token maliyetleri optimize edilecek ve LLM'nin konudan sapması (hallucination drift) engellenecektir.  
* Öğrenci "Anlamadım" veya "Bunu nasıl bulduk?" diye sorduğunda, ajan bir önceki mesajında anlattığı adımı tekrar etmek yerine, farklı bir gerçek hayat örneği (analoji) kurarak veya konuyu daha alt basamaklara indirgeyerek (scaffolding) yeniden açıklayacaktır.

### **3\. Hedef ve Metrikler Dosyası (hedef\_target.md)**

# **ODEVGPT İş Mantığı ve Başarı Hedefleri**

## **1\. Temel İş Hedefleri**

* Öğrenci Memnuniyeti ve Öğrenme Teyidi: Her konuşma döngüsünün sonunda, öğrencinin konuyu anlayıp anlamadığı ufak teyit sorularıyla ("Şimdi bu kurala göre sen denklemin sağ tarafını nasıl yazardın?") doğrulanmalıdır.  
* Etkileşim Süresi: Bir problemin baştan sona çözülüp anlatılma süreci mümkün olduğunca akıcı olmalıdır. İdeal olarak pedagojik yönlendirme 3 ila 4 sohbet balonunda tamamlanmalıdır.

## **2\. Teknik Performans Hedefleri (CTO Metrikleri)**

* LlamaIndex üzerinden Supabase pgvector sorgularının (RAG Retrieval) yanıt süresi 150 milisaniyenin altında tutulmalıdır.  
* Sisteme eklenen her yeni soru fotoğrafı ve üretilen çözüm, OCR (Mathpix/LayoutLM) sonuçlarıyla birlikte Supabase Storage ve ilgili tablolara, doğru etiketlerle (Konu, Sınıf, Zorluk) kaydedilmelidir.  
* Agentic RAG içindeki LangChain araçlarının (Tools) çağrılma başarısızlık oranları izlenmeli ve hatalar anında geliştirici loglarına raporlanmalıdır.

## **Sonuç**

Türkiye eğitim sisteminin merkezi sınav odaklı yapısı ve MEB müfredatı göz önüne alındığında, öğrencilerin sadece doğru şıkkı işaretlemeye değil, soru çözme mantığını kavramaya ihtiyaçları vardır. Önerilen bu mimari; yüksek bulut maliyetli ve sadece vektör tutabilen Pinecone yerine, tüm ilişkisel kullanıcı verisi ve vektörel arama kapasitesini yüksek performansla (pgvectorscale ile) tek potada eriten Supabase'i merkezine almaktadır. Yapay zekanın LlamaIndex ve LangChain destekli otonom zekası, matematik alanında uzmanlaşmış Mathpix OCR'ı ile desteklenecek, olası bir halüsinasyon veya karmaşık soru senaryosunda ise sistem kontrolü anında "Human-in-the-Loop" mantığıyla gerçek öğretmenlere devredecektir. Lovable.dev ile hızlıca prototiplenecek ve ardından Google Antigravity IDE'nin ajan-öncelikli gücüyle yerel olarak derinleştirilecek olan bu sistem, Türkiye pazarında Kunduz, Tam Okul veya MEBİ gibi dev platformların en iyi özelliklerini bir araya getirerek, kusursuz ve pedagojik bir "Ödev Asistanı" vizyonunu hayata geçirecek eşsiz bir teknolojik altyapıya sahiptir.

#### **Alıntılanan çalışmalar**

1. Türkiye mobile app trends and growth insights for 2025 \- Adjust, erişim tarihi Şubat 14, 2026, [https://www.adjust.com/blog/turkey-app-trends-2025/](https://www.adjust.com/blog/turkey-app-trends-2025/)  
2. Top 5 Education Apps in Turkey: Q2 2024 Performance Review \- Sensor Tower, erişim tarihi Şubat 14, 2026, [https://sensortower.com/blog/2024-q2-unified-top-5-education-units-tr-600a1c7d241bc16eb8da0a79](https://sensortower.com/blog/2024-q2-unified-top-5-education-units-tr-600a1c7d241bc16eb8da0a79)  
3. Chegg vs Brainly: The Top Online Learning Platforms for Academic Support \- Vertu, erişim tarihi Şubat 14, 2026, [https://vertu.com/guides/chegg-vs-brainly-a-comprehensive-guide-for-professionals/](https://vertu.com/guides/chegg-vs-brainly-a-comprehensive-guide-for-professionals/)  
4. Kunduz vs Brainly vs Chegg: Which Homework Helper Is Better? | by Anne Beaver \- Medium, erişim tarihi Şubat 14, 2026, [https://medium.com/@annethebeaver/kunduz-vs-brainly-vs-chegg-which-homework-helper-is-better-1c2e7c512ab8](https://medium.com/@annethebeaver/kunduz-vs-brainly-vs-chegg-which-homework-helper-is-better-1c2e7c512ab8)  
5. Gauth: AI Study Companion \- App Store \- Apple, erişim tarihi Şubat 14, 2026, [https://apps.apple.com/bb/app/gauth-ai-study-companion/id1542571008](https://apps.apple.com/bb/app/gauth-ai-study-companion/id1542571008)  
6. 5 Best AI Math Solvers in 2025 | Transcript, erişim tarihi Şubat 14, 2026, [https://transcript.study/blog/best-ai-math-solvers](https://transcript.study/blog/best-ai-math-solvers)  
7. Kunduz vs Numerade vs Chegg: Which Homework Helper Is Better? | by Anne Beaver, erişim tarihi Şubat 14, 2026, [https://medium.com/@annethebeaver/kunduz-vs-numerade-vs-chegg-which-homework-helper-is-better-27630879cb8f](https://medium.com/@annethebeaver/kunduz-vs-numerade-vs-chegg-which-homework-helper-is-better-27630879cb8f)  
8. www.ijcer.net Teaching or testing, which matters more? Transition among education levels in Turkey \- ERIC, erişim tarihi Şubat 14, 2026, [https://files.eric.ed.gov/fulltext/EJ1393448.pdf](https://files.eric.ed.gov/fulltext/EJ1393448.pdf)  
9. Kunduz vs Numerade vs CourseHero: Which homework helper is better? | by Anne Beaver, erişim tarihi Şubat 14, 2026, [https://medium.com/@annethebeaver/kunduz-vs-numerade-vs-coursehero-which-homework-helper-is-better-e93d2de62430](https://medium.com/@annethebeaver/kunduz-vs-numerade-vs-coursehero-which-homework-helper-is-better-e93d2de62430)  
10. TamOkul, erişim tarihi Şubat 14, 2026, [https://tamokul.com/](https://tamokul.com/)  
11. AI tool in Türkiye personalizes education for high school students | Daily Sabah, erişim tarihi Şubat 14, 2026, [https://www.dailysabah.com/turkiye/ai-tool-in-turkiye-personalizes-education-for-high-school-students/news](https://www.dailysabah.com/turkiye/ai-tool-in-turkiye-personalizes-education-for-high-school-students/news)  
12. Improving Student-AI Interaction Through Pedagogical Prompting: An Example in Computer Science Education \- arXiv, erişim tarihi Şubat 14, 2026, [https://arxiv.org/html/2506.19107v1](https://arxiv.org/html/2506.19107v1)  
13. Tutor-GPT & Pedagogical Reasoning \- LessWrong, erişim tarihi Şubat 14, 2026, [https://www.lesswrong.com/posts/hfuqzaPGaPA2PwFPM/tutor-gpt-and-pedagogical-reasoning](https://www.lesswrong.com/posts/hfuqzaPGaPA2PwFPM/tutor-gpt-and-pedagogical-reasoning)  
14. Chain of Thought Prompting: A Deep Dive into the AI Architecture Pattern \- Rahul Krishnan, erişim tarihi Şubat 14, 2026, [https://solutionsarchitecture.medium.com/chain-of-thought-prompting-a-deep-dive-into-the-ai-architecture-pattern-d35cd8b52c53](https://solutionsarchitecture.medium.com/chain-of-thought-prompting-a-deep-dive-into-the-ai-architecture-pattern-d35cd8b52c53)  
15. Türkiye to introduce AI-assisted open-ended questions in national exams, erişim tarihi Şubat 14, 2026, [https://www.turkiyetoday.com/lifestyle/turkiye-to-introduce-ai-assisted-open-ended-questions-in-national-exams-3208905](https://www.turkiyetoday.com/lifestyle/turkiye-to-introduce-ai-assisted-open-ended-questions-in-national-exams-3208905)  
16. Comparing Supabase with pgvector and Pinecone for AI Applications \- EVOKEHUB, erişim tarihi Şubat 14, 2026, [https://evokehub.com/comparing-supabase-with-pgvector-and-pinecone-for-ai-applications/](https://evokehub.com/comparing-supabase-with-pgvector-and-pinecone-for-ai-applications/)  
17. Supabase vs Pinecone: I Migrated My Production AI System and Here's What Actually Matters \- Dee, erişim tarihi Şubat 14, 2026, [https://deeflect.medium.com/supabase-vs-pinecone-i-migrated-my-production-ai-system-and-heres-what-actually-matters-7b2f2ebd59ee](https://deeflect.medium.com/supabase-vs-pinecone-i-migrated-my-production-ai-system-and-heres-what-actually-matters-7b2f2ebd59ee)  
18. Pgvector vs. Pinecone: Vector Database Performance and Cost Comparison \- Tiger Data, erişim tarihi Şubat 14, 2026, [https://www.tigerdata.com/blog/pgvector-vs-pinecone](https://www.tigerdata.com/blog/pgvector-vs-pinecone)  
19. Overwhelmed by RAG (Pinecone, Vectorize, Supabase etc) \- Reddit, erişim tarihi Şubat 14, 2026, [https://www.reddit.com/r/Rag/comments/1m0ejs0/overwhelmed\_by\_rag\_pinecone\_vectorize\_supabase\_etc/](https://www.reddit.com/r/Rag/comments/1m0ejs0/overwhelmed_by_rag_pinecone_vectorize_supabase_etc/)  
20. Best Vector Databases for RAG: Complete 2025 Comparison Guide \- Latenode Blog, erişim tarihi Şubat 14, 2026, [https://latenode.com/blog/ai-frameworks-technical-infrastructure/vector-databases-embeddings/best-vector-databases-for-rag-complete-2025-comparison-guide](https://latenode.com/blog/ai-frameworks-technical-infrastructure/vector-databases-embeddings/best-vector-databases-for-rag-complete-2025-comparison-guide)  
21. ChromaDB vs PGVector: The Epic Battle of Vector Databases \- Devendra Parihar \- Medium, erişim tarihi Şubat 14, 2026, [https://dev523.medium.com/chromadb-vs-pgvector-the-epic-battle-of-vector-databases-a43216772b34](https://dev523.medium.com/chromadb-vs-pgvector-the-epic-battle-of-vector-databases-a43216772b34)  
22. pgvector vs Pinecone: cost and performance \- Supabase, erişim tarihi Şubat 14, 2026, [https://supabase.com/blog/pgvector-vs-pinecone](https://supabase.com/blog/pgvector-vs-pinecone)  
23. Combining Langchain and LlamaIndex to build your first Agentic RAG System \- Medium, erişim tarihi Şubat 14, 2026, [https://medium.com/ama-tech-blog/combining-langchain-and-llamaindex-to-build-your-first-agentic-rag-system-6e8e2e7825e7](https://medium.com/ama-tech-blog/combining-langchain-and-llamaindex-to-build-your-first-agentic-rag-system-6e8e2e7825e7)  
24. Llamaindex vs Langchain: What's the difference? \- IBM, erişim tarihi Şubat 14, 2026, [https://www.ibm.com/think/topics/llamaindex-vs-langchain](https://www.ibm.com/think/topics/llamaindex-vs-langchain)  
25. I Tried LangChain, LlamaIndex, and Haystack – Here's What Worked and What Didn't : r/Rag \- Reddit, erişim tarihi Şubat 14, 2026, [https://www.reddit.com/r/Rag/comments/1jdne72/i\_tried\_langchain\_llamaindex\_and\_haystack\_heres/](https://www.reddit.com/r/Rag/comments/1jdne72/i_tried_langchain_llamaindex_and_haystack_heres/)  
26. Updated 2025 Review: My notes on the best OCR for handwriting recognition and text extraction : r/computervision \- Reddit, erişim tarihi Şubat 14, 2026, [https://www.reddit.com/r/computervision/comments/1mbpab3/updated\_2025\_review\_my\_notes\_on\_the\_best\_ocr\_for/](https://www.reddit.com/r/computervision/comments/1mbpab3/updated_2025_review_my_notes_on_the_best_ocr_for/)  
27. How OCR Enhances Math Learning: Converting Handwritten Equations into Digital Text, erişim tarihi Şubat 14, 2026, [https://tutorflow.io/blog/math-ocr-handwritten-to-digital](https://tutorflow.io/blog/math-ocr-handwritten-to-digital)  
28. Top Handwriting OCR Solutions for 2025 \- Sparkco, erişim tarihi Şubat 14, 2026, [https://sparkco.ai/blog/top-handwriting-ocr-solutions-for-2025](https://sparkco.ai/blog/top-handwriting-ocr-solutions-for-2025)  
29. The Best OCR Models in 2025 \- Beam Cloud, erişim tarihi Şubat 14, 2026, [https://www.beam.cloud/blog/best-ocr-models](https://www.beam.cloud/blog/best-ocr-models)  
30. Human-in-the-Loop Systems for Adaptive Learning Using Generative AI \- arXiv, erişim tarihi Şubat 14, 2026, [https://arxiv.org/html/2508.11062v1](https://arxiv.org/html/2508.11062v1)  
31. What is Human-in-the-Loop in Agentic AI? Enterprise Guide to Reliable AI Fallback, erişim tarihi Şubat 14, 2026, [https://blog.anyreach.ai/what-is-human-in-the-loop-in-agentic-ai-enterprise-guide-to-reliable-ai-fallback/](https://blog.anyreach.ai/what-is-human-in-the-loop-in-agentic-ai-enterprise-guide-to-reliable-ai-fallback/)  
32. Human-in-the-Loop Agentic Systems: A Practical Guide for Engineers Who Want Smarter, Safer Agents | by Sai Krishna Reddy Mudhiganti | Medium, erişim tarihi Şubat 14, 2026, [https://medium.com/@saimudhiganti/human-in-the-loop-agentic-systems-a-practical-guide-for-engineers-who-want-smarter-safer-agents-e1becadfbbdd](https://medium.com/@saimudhiganti/human-in-the-loop-agentic-systems-a-practical-guide-for-engineers-who-want-smarter-safer-agents-e1becadfbbdd)  
33. Human-in-the-Loop in Agentic Workflows: From Definition to Walkthrough Demo and Use Cases \- Orkes, erişim tarihi Şubat 14, 2026, [https://orkes.io/blog/human-in-the-loop/](https://orkes.io/blog/human-in-the-loop/)  
34. Lovable Documentation: Welcome to Lovable, erişim tarihi Şubat 14, 2026, [https://docs.lovable.dev/](https://docs.lovable.dev/)  
35. Cline vs Lovable: AI Coding Tool Comparison, erişim tarihi Şubat 14, 2026, [https://lovable.dev/guides/cline-vs-lovable](https://lovable.dev/guides/cline-vs-lovable)  
36. How to Export a Lovable Project to VS Code for Advanced Development \- Analyse Digital, erişim tarihi Şubat 14, 2026, [https://analysedigital.com/how-to-export-a-lovable-project-to-vs-code-for-advanced-development/](https://analysedigital.com/how-to-export-a-lovable-project-to-vs-code-for-advanced-development/)  
37. how to move my project from lovable to a more flexible program? \- Reddit, erişim tarihi Şubat 14, 2026, [https://www.reddit.com/r/lovable/comments/1oqjcf8/how\_to\_move\_my\_project\_from\_lovable\_to\_a\_more/](https://www.reddit.com/r/lovable/comments/1oqjcf8/how_to_move_my_project_from_lovable_to_a_more/)  
38. Google Antigravity Tool (IDE): What It Is and How Developers Benefit: ExpertAppDevs.Com, erişim tarihi Şubat 14, 2026, [https://medium.com/@expertappdevs/google-antigravity-tool-ide-what-it-is-and-how-developers-benefit-50119f8d886c](https://medium.com/@expertappdevs/google-antigravity-tool-ide-what-it-is-and-how-developers-benefit-50119f8d886c)  
39. Build with Google Antigravity, our new agentic development platform, erişim tarihi Şubat 14, 2026, [https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)  
40. Getting Started with Google Antigravity, erişim tarihi Şubat 14, 2026, [https://codelabs.developers.google.com/getting-started-google-antigravity](https://codelabs.developers.google.com/getting-started-google-antigravity)  
41. Antigravity NEW Update is HUGE\! Agent Skills, Subagents, AI Automation, and More\!, erişim tarihi Şubat 14, 2026, [https://www.youtube.com/watch?v=oRAeNVx2kqM](https://www.youtube.com/watch?v=oRAeNVx2kqM)  
42. Tutorial : Getting Started with Google Antigravity | by Romin Irani \- Medium, erişim tarihi Şubat 14, 2026, [https://medium.com/google-cloud/tutorial-getting-started-with-google-antigravity-b5cc74c103c2](https://medium.com/google-cloud/tutorial-getting-started-with-google-antigravity-b5cc74c103c2)  
43. Tutorial : Getting Started with Google Antigravity Skills, erişim tarihi Şubat 14, 2026, [https://medium.com/google-cloud/tutorial-getting-started-with-antigravity-skills-864041811e0d](https://medium.com/google-cloud/tutorial-getting-started-with-antigravity-skills-864041811e0d)  
44. 7 Prompt Engineering Tricks to Mitigate Hallucinations in LLMs \- Machine Learning Mastery, erişim tarihi Şubat 14, 2026, [https://machinelearningmastery.com/7-prompt-engineering-tricks-to-mitigate-hallucinations-in-llms/](https://machinelearningmastery.com/7-prompt-engineering-tricks-to-mitigate-hallucinations-in-llms/)  
45. Prompt engineering techniques to avoid hallucination in AI agents | by R. Harvey \- Medium, erişim tarihi Şubat 14, 2026, [https://medium.com/@r.harvey/prompt-engineering-techniques-to-avoid-hallucination-in-ai-agents-1bb61178ef5c](https://medium.com/@r.harvey/prompt-engineering-techniques-to-avoid-hallucination-in-ai-agents-1bb61178ef5c)  
46. How to Stop AI from Making Up Facts \- 12 Tested Techniques That Prevent ChatGPT and Claude Hallucinations (2025 Guide) : r/PromptEngineering \- Reddit, erişim tarihi Şubat 14, 2026, [https://www.reddit.com/r/PromptEngineering/comments/1o77fk0/how\_to\_stop\_ai\_from\_making\_up\_facts\_12\_tested/](https://www.reddit.com/r/PromptEngineering/comments/1o77fk0/how_to_stop_ai_from_making_up_facts_12_tested/)  
47. Tuning Your AI Model to Reduce Hallucinations \- YouTube, erişim tarihi Şubat 14, 2026, [https://www.youtube.com/watch?v=ZFKvTIADp0k](https://www.youtube.com/watch?v=ZFKvTIADp0k)  
48. study8677/antigravity-workspace-template: The ultimate starter kit for Google Antigravity IDE. Optimized for Gemini 3 Agentic Workflows, "Deep Think" mode, and auto-configuring .cursorrules. \- GitHub, erişim tarihi Şubat 14, 2026, [https://github.com/study8677/antigravity-workspace-template](https://github.com/study8677/antigravity-workspace-template)