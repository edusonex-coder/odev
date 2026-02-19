# **ÖDEVGPT-Hafıza (Memory) ve RAG Stratejisi**

Yapay zekanın halüsinasyon görmesini engellemek ve "uydurma" cevapların önüne geçmek için aşağıdaki **LlamaIndex** ve **LangChain** stratejisini uygulayacağız.

## **1\. Veri Kaynağı (Knowledge Base)**

Sistemi sadece genel internet bilgisiyle değil, güvenilir eğitim materyalleriyle besleyeceğiz:

* **MEB Ders Kitapları (PDF):** LlamaIndex kullanılarak parse edilecek ve chunk'lara (parçalara) bölünecek.  
* **Soru Bankaları:** Çözümlü soru bankaları veritabanına işlenecek.  
* **Müfredat Ağacı:** Hangi konunun hangi sınıfta işlendiğine dair yapılandırılmış JSON verisi.

## **2\. Vektör Veritabanı (Supabase pgvector)**

* Kitaplardan ve soru bankalarından elde edilen metinler, HuggingFace üzerindeki çok dilli embedding modelleri (örn: intfloat/multilingual-e5-large) kullanılarak vektöre çevrilecek ve Supabase'e kaydedilecek.  
* Kullanıcı soru sorduğunda, önce bu veritabanında "Benzer Soru" ve "İlgili Konu Anlatımı" aranacak.

## **3\. RAG Akışı (Retrieval Augmented Generation)**

Prompt yapısı şu şekilde dinamik olarak oluşturulacak:

\[SİSTEM\]: Sen ODEVGPT'sin.  
\[BAĞLAM \- VERİTABANINDAN\]: (Buraya veritabanından bulunan ilgili ders kitabı sayfası veya benzer soru çözümü gelir.)  
\[KULLANICI SORUSU\]: (Öğrencinin fotoğrafı/metni)  
\[GÖREV\]: Yukarıdaki \[BAĞLAM\] bilgisini referans alarak \[KULLANICI SORUSU\]'nu çöz. Bağlam dışına çıkma. Eğer bağlamda bilgi yoksa genel bilgini kullan ama bunu belirt.

## **4\. Konuşma Hafızası (Conversation Buffer Memory)**

* **LangChain RunnableWithMessageHistory** kullanılacak.  
* **Kayan Pencere (Sliding Window):** Öğrenci ile AI arasındaki sohbetin sadece son 5-10 mesajı bağlam olarak tutulacak. Bu, token maliyetini düşürür ve AI'ın konudan sapmasını engeller.  
* **Oturum Bazlı Hafıza:** Öğrenci "Matematik" dersinden çıkıp "Tarih" dersine geçerse hafıza sıfırlanır veya yeni bir oturum (Session ID) açılır.

## **5\. Doğruluk Kontrolü (Self-Correction)**

* AI cevabı ürettikten sonra, ikinci bir hafif LLM (veya bir doğrulama zinciri) cevabı kontrol eder.  
* *Örnek:* "Çözüm mantıklı mı? İşlem hatası var mı?"  
* Eğer doğrulama başarısız olursa, cevap kullanıcıya gösterilmez ve soru **Öğretmen Havuzu**na düşer.