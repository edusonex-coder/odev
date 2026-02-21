# **ODEVGPT \- Hibrit Eğitim Platformu Teknik Mimarisi**

## **1\. Yönetici Özeti**

Bu proje, öğrencilerin ödev fotoğraflarını yükleyerek veya metin girerek anında çözüm alabildiği, AI'ın yetersiz kaldığı veya öğrencinin ek açıklama istediği durumlarda gerçek öğretmenlerin devreye girdiği hibrit bir eğitim teknolojisidir.

## **2\. Teknoloji Yığını (Tech Stack)**

### **A. Backend & AI Orkestrasyonu**

* **Ana Dil:** Python (AI kütüphaneleri için zorunlu).  
* **API Framework:** **FastAPI**. (Yüksek performans ve asenkron yapı için).  
* **Orkestrasyon:** **LangChain** ve **LlamaIndex**.  
  * *Neden?* LangChain'i "Agent" yapısı için kullanacağız (Örn: Matematik sorusu ise WolframAlpha veya Python REPL tool'unu kullan, Tarih ise RAG kullan). LlamaIndex'i ise veri indeksleme (RAG) için kullanacağız.  
* **Model:** Başlangıçta **GPT-4o** veya **Claude 3.5 Sonnet** (Prototip aşamasında maliyet/performans dengesi için). İlerleyen fazda HuggingFace üzerinden **Fine-Tuned Llama 3 \- Turkish** modeli.

### **B. Veritabanı & Vektör Depolama (Supabase Kararı)**

* **Veritabanı:** **Supabase** (PostgreSQL).  
  * *Karar:* Başka bir veritabanına ihtiyacımız YOK. Supabase bu proje için mükemmeldir.  
  * *Neden?* 1\. **Auth:** Öğrenci/Öğretmen girişleri hazır. 2\. **Storage:** Ödev fotoğraflarını (S3 uyumlu) saklar. 3\. **Realtime:** Öğretmen ve öğrenci arasındaki canlı sohbet için WebSocket altyapısı hazır. 4\. **Vector Store:** pgvector eklentisi ile ChromaDB kullanmamıza gerek kalmaz. Vektörleri (embeddings) doğrudan Postgres içinde tutarak mimariyi sadeleştiririz.

### **C. Görüntü İşleme (OCR)**

* **Teknoloji:** **Mathpix** (Matematik formülleri için en iyisi) veya **Google Cloud Vision API** (Genel metinler için).  
* **Alternatif (Açık Kaynak):** PaddleOCR.

## **3\. Sistem Akışı (Workflow)**

1. **Girdi:** Öğrenci sorunun fotoğrafını çeker.  
2. **OCR Katmanı:** Görüntü metne ve LaTeX formatına (formüller için) çevrilir.  
3. **Yönlendirici (Router \- LangChain):** Sorunun dersi tespit edilir (Matematik, Fizik, Sözel).  
4. **RAG (Retrieval Augmented Generation \- LlamaIndex):**  
   * Sistem, soruyu vektöre çevirir ve veritabanındaki **MEB kitapları, çıkmış sorular ve doğrulanmış içerikler** arasında benzerlik araması yapar.  
5. **Üretim (Generation):** \* Bulunan bağlam \+ Sistem Talimatları LLM'e gönderilir.  
   * LLM, cevabı "pedagojik adım adım çözüm" formatında üretir.  
6. **Güven Skoru (Confidence Score):**  
   * Eğer AI cevabından %85'in altında eminse veya öğrenci "Anlamadım" butonuna basarsa;  
   * Soru **"Öğretmen Havuzu"na** düşer.  
7. **Öğretmen Müdahalesi:** Müsait öğretmen soruyu alır, sesli veya yazılı açıklama yapar. Bu açıklama sisteme kaydedilir ve AI eğitimi için veri olur (Feedback Loop).