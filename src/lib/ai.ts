/**
 * AI Service for OdevGPT
 * Uses Groq API for fast inference
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

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
    const userMessage = messages.find(m => m.role === 'user')?.content || "";
    const systemMessage = messages.find(m => m.role === 'system')?.content || "Sen yardımcı bir eğitim asistanısın.";

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

    // askAI fonksiyonunu mesaj listesiyle çalışacak şekilde güncelleyebiliriz veya basitçe:
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

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Socratic AI Error:", error);
        throw error;
    }
}
