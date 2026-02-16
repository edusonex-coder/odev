/**
 * AI Service for OdevGPT
 * Uses Groq API for fast inference
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const TEACHER_PROMPT = `
Sen OdevGPT'nin uzman eğitim koçu ve öğretmenisin.
Görevin: Öğrencilerin sorularını sadece çözmek değil, onlara konuyu öğretmek.

ÖZEL KURALLAR:
1. Asla sadece şıkkı (A, B, C..) söyleyip geçme.
2. Önce soruyu analiz et: Hangi konu? Hangi formüller/bilgiler gerekli?
3. Adım adım çözüm uygula.
4. Çözümün sonunda "Sonuç: X" şeklinde net bir sonuç belirt.
5. Öğrenciyle samimi, motive edici ve Türkçe konuş.
6. Eğer soru metni JSON formatında gelirse, "soru_metni", "soru_koku" ve "secenekler" alanlarını birleştirip anlamlı bir soru haline getir ve öyle çöz.
7. Matematiksel ifadeleri anlaşılır şekilde, mümkünse LaTeX formatında ($...$) yaz.
8. Önemli terimleri ve başlıkları **kalın** yazarak vurgula.
`;

export async function askAI(prompt: string, systemPrompt: string = "Sen yardımcı bir eğitim asistanısın.") {
    if (!GROQ_API_KEY) {
        throw new Error("AI API anahtarı bulunamadı.");
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`AI API Hatası: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("AI Error:", error);
        throw error;
    }
}

/**
 * Öğretmen duyurusunu pedagojik ve etkileyici hale getirir
 */
export async function enhanceAnnouncement(content: string) {
    const systemPrompt = `
    Sen OdevGPT'nin akıllı eğitim asistanısın. 
    Görevin: Öğretmenin yazdığı kısa ve teknik duyuruları, öğrenciler için motive edici, nazik, 
    pedagojik açıdan doğru ve heyecan verici bir dille yeniden yazmak. 
    - Duyurunun özünü koru.
    - Emoji kullan.
    - Öğrencilere hitap şeklin samimi ve destekleyici olsun.
    - Metni çok uzatmadan, okunabilirliği yüksek tut.
  `;

    return askAI(`Lütfen şu duyuruyu geliştir: "${content}"`, systemPrompt);
}

/**
 * Duyuruyu öğrenciler için 3 maddelik can alıcı noktaya özetler
 */
export async function summarizeForStudents(content: string) {
    const systemPrompt = `
    Sen OdevGPT'nin özetleyici asistanısın. 
    Görevin: Uzun okul duyurularını öğrenciler için "Can Alıcı 3 Madde" şeklinde özetlemek.
    Sadece 3 kısa madde ver, her maddenin başına uygun bir emoji koy.
  `;

    return askAI(`Lütfen şu metni öğrenciler için 3 maddede özetle:\n\n${content}`, systemPrompt);
}

/**
 * compatibility wrapper for old code
 */
export async function getAIResponse(messages: { role: string; content: string }[]) {
    // Kullanıcı mesajını bul
    const userMessageObj = messages.find(m => m.role === 'user');
    const userMessage = userMessageObj?.content || "";

    // Sistem mesajını bul veya varsayılanı kullan
    let systemMessage = messages.find(m => m.role === 'system')?.content;

    if (!systemMessage) {
        systemMessage = TEACHER_PROMPT;
    }

    return askAI(userMessage, systemMessage);
}

/**
 * Sokratik Öğrenme Metodu: Öğrenciye cevabı vermez, ipuçları ve sorularla öğrenciyi cevaba ulaştırır.
 */
export async function askSocraticAI(
    userMessage: string,
    context: { question: string, subject: string, history?: { role: string, content: string }[] }
) {
    const systemPrompt = `
    Sen OdevGPT'nin Sokratik Eğitmenisin. 
    Görevin: Öğrenciye asla doğrudan cevabı söylememek! 
    
    KURALLAR:
    1. Öğrencinin sorduğu "${context.subject}" konulu "${context.question}" sorusu üzerinde çalışıyorsun.
    2. Öğrenciye cevabı vermek yerine, onu düşünmeye sevke edecek kısa, yönlendirici sorular sor.
    3. Eğer öğrenci çok yanlış bir yoldaysa, nazikçe küçük ipuçları ver.
    4. Adım adım ilerle. Bir seferde sadece bir konuya veya adıma odaklan.
    5. Dilin teşvik edici, sabırlı ve pedagojik olsun.
    6. Cevapların kısa olsun (maksimum 2-3 cümle), öğrenciyi sıkma.
    `;

    // Eğer geçmiş (history) varsa, mesajları birleştir. Yoksa sadece yeni mesajı gönder.
    const messages = context.history
        ? [...context.history, { role: "user" as const, content: userMessage }]
        : [{ role: "user" as const, content: userMessage }];

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...messages
                ],
                temperature: 0.6,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Socratic AI Error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Socratic AI Error:", error);
        throw error;
    }
}

/**
 * Veli için haftalık AI raporu oluşturur
 * @param studentName Öğrenci adı
 * @param stats Haftalık istatistikler
 * @returns AI tarafından oluşturulmuş rapor metni
 */
export async function generateWeeklyParentReport(
    studentName: string,
    stats: {
        total_questions: number;
        solved_questions: number;
        success_rate: number;
        total_xp_gained: number;
        level_ups: number;
        recent_questions?: Array<{ question_text: string; status: string }>;
    }
) {
    const systemPrompt = `
    Sen OdevGPT'nin Veli Rapor Asistanısın.
    Görevin: Öğrenci performansını velilere pozitif, motive edici ve bilgilendirici bir dille sunmak.
    
    KURALLAR:
    1. Dil samimi ve destekleyici olmalı
    2. Başarıları vurgula, eksiklikleri nazikçe belirt
    3. Somut sayılar ver ama bunları anlamlı hale getir
    4. Gelecek için yapıcı önerilerde bulun
    5. Emoji kullan ama abartma (maksimum 3-4 tane)
    6. Rapor 3-4 paragraf olsun, çok uzun olmasın
    7. Pozitif bir tonla bitir
    `;

    const prompt = `
    Lütfen ${studentName} isimli öğrenci için bir haftalık gelişim raporu oluştur.
    
    İstatistikler:
    - Toplam soru sayısı: ${stats.total_questions}
    - Çözülen soru sayısı: ${stats.solved_questions}
    - Başarı oranı: %${stats.success_rate.toFixed(1)}
    - Kazanılan XP: ${stats.total_xp_gained}
    - Seviye atlaması: ${stats.level_ups} seviye
    
    Rapor şu bölümleri içermeli:
    1. Genel değerlendirme (1-2 cümle)
    2. Güçlü yönler ve başarılar
    3. Gelişim alanları (varsa, pozitif dille)
    4. Gelecek hafta için öneriler
    
    Raporu Markdown formatında yaz.
    `;

    return askAI(prompt, systemPrompt);
}

/**
 * Rapor için AI destekli öne çıkan noktalar (highlights) oluşturur
 */
export async function generateReportHighlights(
    studentName: string,
    stats: {
        total_questions: number;
        solved_questions: number;
        success_rate: number;
        total_xp_gained: number;
    }
): Promise<string[]> {
    const systemPrompt = `
    Sen OdevGPT'nin Veli Rapor Asistanısın.
    Görevin: Öğrenci performansından 3 öne çıkan nokta (highlight) çıkarmak.
    
    KURALLAR:
    1. Her highlight kısa olmalı (maksimum 10 kelime)
    2. Pozitif ve motive edici olmalı
    3. Somut sayılar içermeli
    4. Emoji kullan (her satırın başında 1 tane)
    5. Sadece 3 madde ver, başka açıklama yapma
    `;

    const prompt = `
    ${studentName} için 3 öne çıkan nokta oluştur:
    - ${stats.total_questions} soru sordu
    - ${stats.solved_questions} soru çözdü
    - %${stats.success_rate.toFixed(1)} başarı oranı
    - ${stats.total_xp_gained} XP kazandı
    
    Sadece 3 madde ver, her satır bir emoji ile başlasın.
    `;

    const response = await askAI(prompt, systemPrompt);

    // Yanıtı satırlara böl ve boş satırları temizle
    return response
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .slice(0, 3); // İlk 3 maddeyi al
}
