/**
 * AI Service for OdevGPT
 * Supports multiple providers: Groq, Gemini, OpenAI, Claude
 */
import { supabase } from "./supabase";

// Model Configuration
interface AIProviderConfig {
    url: string;
    apiKey: string | undefined;
    model: string;
    label: string;
}

const PROVIDERS: Record<string, AIProviderConfig> = {
    "groq-llama3": {
        url: "https://api.groq.com/openai/v1/chat/completions",
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        model: "llama-3.3-70b-versatile",
        label: "Groq (Llama 3)"
    },
    "gemini-flash": {
        url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        apiKey: import.meta.env.VITE_GEMINI_API_KEY,
        model: "gemini-1.5-flash",
        label: "Google Gemini 1.5 Flash"
    },
    "gpt-4o": {
        url: "https://api.openai.com/v1/chat/completions",
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        model: "gpt-4o",
        label: "OpenAI GPT-4o"
    },
    "gpt-4-turbo": {
        url: "https://api.openai.com/v1/chat/completions",
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        model: "gpt-4-turbo",
        label: "OpenAI GPT-4 Turbo"
    },
    "gpt-3.5-turbo": {
        url: "https://api.openai.com/v1/chat/completions",
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        model: "gpt-3.5-turbo",
        label: "OpenAI GPT-3.5 Turbo"
    },
    "claude-3-sonnet": {
        // Anthropic API formatı farklı olduğu için şimdilik OpenAI uyumlu bir proxy veya farklı fetch yapısı gerekir.
        // Basitlik için bunu şimdilik devre dışı bırakıyoruz veya yine OpenAI uyumlu bir sağlayıcı üzerinden (örn: OpenRouter) geçirebiliriz.
        // Ancak kullanıcı doğrudan Claude seçerse ve API Key varsa, Anthropic SDK'sı gerekebilir.
        // Bu örnekte OpenAI uyumlu endpointler (Groq, Gemini, OpenAI) odaklıyız.
        url: "https://api.anthropic.com/v1/messages",
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
        model: "claude-3-sonnet-20240229",
        label: "Claude 3.5 Sonnet"
    }
};

/**
 * Get accurate provider configuration based on admin settings
 * Fallback mechanism included
 */
function getActiveProvider(): AIProviderConfig {
    let selectedModelId = "groq-llama3"; // Default

    try {
        const settings = localStorage.getItem('admin_system_settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            if (parsed.aiModel && PROVIDERS[parsed.aiModel]) {
                selectedModelId = parsed.aiModel;
            }
        }
    } catch (e) {
        console.warn("Error reading admin settings, using default model.");
    }

    let config = PROVIDERS[selectedModelId];

    // 1. Seçilen modelin API Key'i var mı?
    if (!config.apiKey) {
        console.warn(`${config.label} API Key not found. Trying fallback...`);

        // 2. Fallback: Önce Groq dene
        if (PROVIDERS["groq-llama3"].apiKey) {
            console.log("Fallback to Groq");
            return PROVIDERS["groq-llama3"];
        }

        // 3. Fallback: Sonra Gemini dene
        if (PROVIDERS["gemini-flash"].apiKey) {
            console.log("Fallback to Gemini");
            return PROVIDERS["gemini-flash"];
        }

        // 4. Fallback: Sonra OpenAI dene
        if (PROVIDERS["gpt-4o"].apiKey) {
            return PROVIDERS["gpt-4o"];
        }
    }

    return config;
}

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

/**
 * Unified AI Request Handler with Automatic Fallback & Logging
 */
async function makeAIRequest(messages: { role: string; content: string }[], temperature: number = 0.7) {
    const primaryProvider = getActiveProvider();

    // Fallback listesi: seçilen dışındakileri ekle
    const fallbackProviders = [
        PROVIDERS["groq-llama3"],
        PROVIDERS["gemini-flash"],
        PROVIDERS["gpt-4o"]
    ].filter(p => p.model !== primaryProvider.model && p.apiKey);

    const providersToTry = [primaryProvider, ...fallbackProviders];
    let lastError = null;

    for (const provider of providersToTry) {
        if (!provider.apiKey) continue;

        try {
            console.log(`AI Request: Attempting with ${provider.label}...`);
            const response = await fetch(provider.url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${provider.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: provider.model,
                    messages: messages,
                    temperature: temperature,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                // Rate limit (429) veya Server Error durumunda bir sonrakini dene
                if (response.status === 429 || response.status >= 500) {
                    console.warn(`${provider.label} limit/error (${response.status}). Trying next provider...`);
                    lastError = data.error?.message || response.statusText;
                    continue;
                }
                throw new Error(`AI API Hatası (${provider.label}): ${data.error?.message || response.statusText}`);
            }

            // Başarılı yanıt geldiyse logla ve dön
            const content = data.choices[0].message.content;
            const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

            // Arkaplanda logla (beklemeye gerek yok)
            supabase.from("ai_usage_logs").insert({
                provider: provider.label,
                model: provider.model,
                prompt_tokens: usage.prompt_tokens,
                completion_tokens: usage.completion_tokens,
                total_tokens: usage.total_tokens,
                status: 'success'
            }).then(({ error }) => error && console.error("Usage log error:", error));

            return content;

        } catch (error: any) {
            console.error(`${provider.label} request failed:`, error.message);
            lastError = error.message;

            // Eğer bu son provider ise hatayı fırlat
            if (provider === providersToTry[providersToTry.length - 1]) {
                // Başarısızlık durumunu logla
                supabase.from("ai_usage_logs").insert({
                    provider: provider.label,
                    model: provider.model,
                    status: 'failed',
                    error_message: error.message
                }).then(({ error }) => error && console.error("Usage log error:", error));

                throw new Error(`Sistem şu an çok yoğun. Lütfen birkaç dakika sonra tekrar deneyin. (Hata: ${lastError})`);
            }
        }
    }

    throw new Error(`AI servislerine ulaşılamıyor. Lütfen API anahtarlarınızı kontrol edin.`);
}

export async function askAI(prompt: string, systemPrompt: string = "Sen yardımcı bir eğitim asistanısın.") {
    return makeAIRequest([
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
    ], 0.7);
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
    // Mesaj formatını unified yapıya uydur
    // Eğer messages içinde system prompt varsa ayrıştır, yoksa default ekle
    const systemMsg = messages.find(m => m.role === 'system')?.content || TEACHER_PROMPT;
    const userMsgs = messages.filter(m => m.role !== 'system');

    // Geçmişi koru
    const unifiedMessages = [
        { role: "system", content: systemMsg },
        ...userMsgs
    ];

    return makeAIRequest(unifiedMessages, 0.7);
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

    // Geçmiş sohbeti birleştir
    const messages = context.history
        ? [...context.history, { role: "user", content: userMessage }]
        : [{ role: "user", content: userMessage }];

    const fullMessages = [
        { role: "system", content: systemPrompt },
        ...messages
    ];

    return makeAIRequest(fullMessages, 0.6);
}

/**
 * Veli raporu oluşturur
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
    Raporu Markdown formatında yaz.
    `;

    const prompt = `
    Lütfen ${studentName} isimli öğrenci için bir haftalık gelişim raporu oluştur.
    İstatistikler: ${JSON.stringify(stats)}
    `;

    return askAI(prompt, systemPrompt);
}

/**
 * Rapor için öne çıkan noktalar
 */
export async function generateReportHighlights(
    studentName: string,
    stats: any
): Promise<string[]> {
    const systemPrompt = `
    Sen OdevGPT'nin Veli Rapor Asistanısın.
    Görevin: Öğrenci performansından 3 öne çıkan nokta (highlight) çıkarmak. Max 10 kelime, 1 emoji.
    `;

    const prompt = `
    ${studentName} performans özeti:
    ${JSON.stringify(stats)}
    `;

    const response = await askAI(prompt, systemPrompt);

    return response
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .slice(0, 3);
}
