/**
 * AI Service for OdevGPT
 * Supports multiple providers: Groq, Gemini, OpenAI, Claude
 */
import { supabase } from "./supabase";
import { queryKnowledge } from "./knowledge";

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
    "groq-vision": {
        url: "https://api.groq.com/openai/v1/chat/completions",
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        label: "Groq (Vision)"
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

const MODEL_COSTS: Record<string, { prompt: number, completion: number }> = {
    "llama-3.3-70b-versatile": { prompt: 0.00059 / 1000, completion: 0.00079 / 1000 }, // Groq tahmini
    "gemini-1.5-flash": { prompt: 0.000075 / 1000, completion: 0.0003 / 1000 },
    "gpt-4o": { prompt: 0.0025 / 1000, completion: 0.010 / 1000 },
    "gpt-4-turbo": { prompt: 0.01 / 1000, completion: 0.03 / 1000 },
    "gpt-3.5-turbo": { prompt: 0.0005 / 1000, completion: 0.0015 / 1000 }
};

/**
 * Unified AI Request Handler with Automatic Fallback, Logging & Cost Intelligence
 */
async function makeAIRequest(
    messages: { role: string; content: string }[],
    temperature: number = 0.7,
    featureName: string = "general_chat",
    tenantName?: string,
    personalityPrompt?: string
) {
    // 0. CTO Directive: RAG Cache (Hafızadan Getir)
    const cacheableFeatures = ["homework_solver", "elite_vision_ocr"];

    // Global table existence check (to avoid 400 errors if table is missing)
    if (globalThis._ai_knowledge_graph_missing) {
        return null;
    }

    if (cacheableFeatures.includes(featureName)) {
        const userPrompt = messages.find(m => m.role === "user")?.content;
        if (typeof userPrompt === 'string') {
            try {
                const { data: cached } = await supabase
                    .from('ai_knowledge_graph')
                    .select('ai_response')
                    .eq('content_text', userPrompt)
                    .maybeSingle();

                if (cached?.ai_response) {
                    console.log(`[RAG CACHE HIT] Feature: ${featureName} - Memory used.`);
                    return cached.ai_response;
                }
            } catch (e: any) {
                // Sadece 400 veya 404 gibi tablo eksikliği hatalarını logla ama akışı bozma
                if (e?.code === 'PGRST116' || e?.code === '42P01' || e?.status === 400) {
                    console.warn("[RAG] Knowledge Graph table missing or broken. Disabling cache to prevent console noise.");
                    globalThis._ai_knowledge_graph_missing = true;
                } else {
                    console.warn("Cache check error (ignored):", e);
                }
            }
        }
    }

    // 1. Intelligence Level Routing (Model Router)
    let primaryProvider = getActiveProvider();

    // Low-Priority tasks should use cheapest stable model
    const lowPriorityFeatures = ["announcement_enhancer", "announcement_summary", "general_chat", "socratic_quiz"];
    const visionFeatures = ["elite_vision_ocr"];

    if (visionFeatures.includes(featureName)) {
        console.log(`[AI ROUTING] Vision Task Detected (${featureName}). Forcing vision model...`);
        // Force Vision Support
        if (PROVIDERS["gemini-flash"].apiKey) {
            primaryProvider = PROVIDERS["gemini-flash"];
        } else if (PROVIDERS["groq-vision"].apiKey) {
            primaryProvider = PROVIDERS["groq-vision"];
        } else if (PROVIDERS["gpt-4o"].apiKey) {
            primaryProvider = PROVIDERS["gpt-4o"];
        } else {
            console.error("[AI ROUTING] CRITICAL: No vision models have valid API keys!");
            throw new Error("Görsel okuma için gerekli yapay zeka anahtarı bulunamadı (Gemini veya Groq)!");
        }
    } else if (lowPriorityFeatures.includes(featureName)) {
        // Force Gemini Flash or Llama 3 for low priority tasks to save costs
        primaryProvider = PROVIDERS["gemini-flash"].apiKey ? PROVIDERS["gemini-flash"] : PROVIDERS["groq-llama3"];
    }

    const startTime = Date.now();

    // Tenant-Specific Identity Injection
    let identityPrompt = tenantName
        ? `Sen şu an ${tenantName} kurumunun resmi eğitim asistanısın. Cevaplarında bu kurumun bir parçası olduğunu hissettir ve kurumun etik değerlerine uygun davran.`
        : "Sen Edusonex ekosisteminin zeki bir eğitim asistanısın.";

    if (personalityPrompt) {
        identityPrompt += `\n\nÖzel Kurumsal Kimlik: ${personalityPrompt}`;
    }

    // CTO Directive: RAG Context Injection (Real retrieval)
    let ragContext = "";
    if (featureName === "homework_solver" || featureName === "general_chat") {
        const userMsg = messages.find(m => m.role === "user")?.content;
        const userText = typeof userMsg === 'string'
            ? userMsg
            : Array.isArray(userMsg)
                ? (userMsg as any[]).find((c: any) => c.type === 'text')?.text
                : "";

        if (userText && typeof userText === 'string') {
            try {
                const results = await queryKnowledge(userText as string);
                if (results && results.length > 0) {
                    ragContext = "\n\nSistem Hafızasından İlgili Bilgiler:\n" +
                        results.map(r => `- [${r.source_product}]: ${r.content_text}`).join("\n");
                    console.log(`[RAG INJECTION] Found ${results.length} relevant entries.`);
                }
            } catch (e) {
                console.warn("RAG Context fetch failed:", e);
            }
        }
    }

    // Combine everything
    const finalIdentity = identityPrompt + ragContext;

    // Combine identity prompt with any existing system prompt in messages
    const existingSystemMsg = messages.find(m => m.role === "system");
    const combinedSystemPrompt = existingSystemMsg
        ? `${finalIdentity}\n\nGörev Talimatı: ${existingSystemMsg.content}`
        : finalIdentity;

    const isVisionTask = featureName === "elite_vision_ocr" || (featureName === "homework_solver" && messages.some(m => Array.isArray(m.content)));

    // Unified prompt structure
    const fullMessages = [...messages.filter(m => m.role !== "system")];
    if (isVisionTask && primaryProvider.label.includes("Groq")) {
        // Groq Vision models work better when instructions are in the user message
        const userMsg = fullMessages.find(m => m.role === "user");
        if (userMsg && Array.isArray(userMsg.content)) {
            const textPart = userMsg.content.find((c: any) => c.type === "text");
            if (textPart) {
                textPart.text = `${combinedSystemPrompt}\n\n${textPart.text}`;
            }
        } else if (userMsg && typeof userMsg.content === 'string') {
            userMsg.content = `${combinedSystemPrompt}\n\n${userMsg.content}`;
        }
    } else {
        // Standard system message injection
        fullMessages.unshift({ role: "system", content: combinedSystemPrompt });
    }

    const fallbackProviders = [
        PROVIDERS["gemini-flash"],
        PROVIDERS["groq-vision"],
        PROVIDERS["gpt-4o"],
        PROVIDERS["groq-llama3"]
    ].filter(p => {
        if (!p.apiKey) return false;
        if (p.model === primaryProvider.model) return false;

        // Vision tasks require vision-capable models
        const visionModels = [
            "gemini-1.5-flash",
            "gpt-4o",
            "llama-3.2-11b-vision-preview",
            "llama-3.2-90b-vision-preview",
            "meta-llama/llama-4-scout-17b-16e-instruct"
        ];
        if (isVisionTask) {
            return visionModels.includes(p.model);
        }

        return true;
    });

    const providersToTry = [primaryProvider, ...fallbackProviders];
    let lastError = null;

    for (const provider of providersToTry) {
        if (!provider.apiKey) continue;

        try {
            console.log(`AI Request [${featureName}${tenantName ? ` - ${tenantName}` : ''}]: Attempting with ${provider.label}...`);

            const response = await fetch(provider.url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${provider.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: provider.model,
                    messages: fullMessages,
                    temperature: temperature,
                    max_tokens: 2000
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (response.status === 429 || response.status >= 500) {
                    console.warn(`${provider.label} limit/error (${response.status}). Trying next...`);
                    lastError = data.error?.message || response.statusText;
                    continue;
                }
                throw new Error(`AI API Hatası (${provider.label}): ${data.error?.message || response.statusText}`);
            }

            const content = data.choices[0].message.content;
            const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
            const latency = Date.now() - startTime;

            // CTO Directive: Save to Knowledge Graph (RAG Cache)
            if (cacheableFeatures.includes(featureName)) {
                const userPrompt = messages.find(m => m.role === "user")?.content;
                if (typeof userPrompt === 'string' && content) {
                    // Extract tenantId if available from the search params or context
                    const sourceProduct = "odevgpt";

                    supabase.from("ai_knowledge_graph").upsert({
                        content_text: userPrompt,
                        ai_response: content,
                        category: featureName,
                        source_product: sourceProduct
                    }, { onConflict: 'content_text' }).then(({ error }) => {
                        if (error) {
                            console.warn("Cache save error:", error);
                            if (error.code === '23502') {
                                console.error("CRITICAL: Missing NOT NULL column in ai_knowledge_graph. Please check database schema.");
                            }
                        }
                    });
                }
            }

            // Cost Calculation
            const costs = MODEL_COSTS[provider.model] || { prompt: 0, completion: 0 };
            const totalCost = (usage.prompt_tokens * costs.prompt) + (usage.completion_tokens * costs.completion);

            // Background Logging (Async)
            (async () => {
                try {
                    const { data: userData } = await supabase.auth.getUser();

                    // Check if tenantName is a valid UUID, if not, leave as null (tenant_id requires UUID)
                    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tenantName || "");
                    const tenantIdToSave = isUuid ? tenantName : null;

                    await supabase.from("ai_usage_logs").insert({
                        provider: provider.label,
                        model: provider.model,
                        prompt_tokens: usage.prompt_tokens,
                        completion_tokens: usage.completion_tokens,
                        total_tokens: usage.total_tokens,
                        cost_usd: totalCost,
                        feature_name: featureName,
                        latency_ms: latency,
                        status: 'success',
                        user_id: userData?.user?.id,
                        tenant_id: tenantIdToSave
                    });
                } catch (e) {
                    console.warn("Usage log background error:", e);
                }
            })();

            return content;

        } catch (error: any) {
            console.error(`${provider.label} request failed:`, error.message);
            lastError = error.message;

            if (provider === providersToTry[providersToTry.length - 1]) {
                supabase.from("ai_usage_logs").insert({
                    provider: provider.label,
                    model: provider.model,
                    feature_name: featureName,
                    latency_ms: Date.now() - startTime,
                    status: 'failed',
                    error_message: error.message
                }).then(({ error }) => error && console.error("Usage log error:", error));

                throw new Error(`Sistem şu an çok yoğun. Lütfen birkaç dakika sonra tekrar deneyin. (Hata: ${lastError})`);
            }
        }
    }

    throw new Error(`AI servislerine ulaşılamıyor. Lütfen API anahtarlarınızı kontrol edin.`);
}


export async function askAI(
    prompt: string,
    systemPrompt: string = "Sen yardımcı bir eğitim asistanısın.",
    featureName: string = "general_chat",
    tenantName?: string
) {
    return makeAIRequest([
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
    ], 0.7, featureName, tenantName);
}

/**
 * Öğretmen duyurusunu pedagojik ve etkileyici hale getirir
 */
export async function enhanceAnnouncement(content: string, tone: 'motivating' | 'formal' | 'warning' = 'motivating') {
    const tonePrompts = {
        motivating: "motive edici, nazik, pedagojik açıdan doğru ve heyecan verici",
        formal: "resmi, ciddi, profesyonel ve kurumsal",
        warning: "uyarıcı, ciddi, kuralları hatırlatan ama yine de saygılı"
    };

    const systemPrompt = `
    Sen OdevGPT'nin akıllı eğitim asistanısın. 
    Görevin: Öğretmenin yazdığı kısa ve teknik duyuruları, öğrenciler için ${tonePrompts[tone]} bir dille yeniden yazmak. 
    - Duyurunun özünü koru.
    - Duyurunun içeriğine uygun emojiler kullan.
    - Öğrencilere hitap şeklin samimi ve destekleyici olsun.
    - Metni çok uzatmadan, okunabilirliği yüksek tut.
  `;

    return askAI(`Lütfen şu duyuruyu ${tone} tonunda geliştir: "${content}"`, systemPrompt, "announcement_enhancer");
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

    return askAI(`Lütfen şu metni öğrenciler için 3 maddede özetle:\n\n${content}`, systemPrompt, "announcement_summary");
}

/**
 * compatibility wrapper for old code
 */
export async function getAIResponse(
    messages: { role: string; content: string }[],
    tenantIdOrName?: string,
    personalityPrompt?: string,
    featureName: string = "homework_solver"
) {
    // Mesaj formatını unified yapıya uydur
    const systemMsg = messages.find(m => m.role === 'system')?.content || TEACHER_PROMPT;
    const userMsgs = messages.filter(m => m.role !== 'system');

    const unifiedMessages = [
        { role: "system", content: systemMsg },
        ...userMsgs
    ];

    return makeAIRequest(unifiedMessages, 0.7, featureName, tenantIdOrName, personalityPrompt);
}

/**
 * Sokratik Öğrenme Metodu: Öğrenciye cevabı vermez, ipuçları ve sorularla öğrenciyi cevaba ulaştırır.
 */
export async function askSocraticAI(
    userMessage: string,
    context: { question: string, subject: string, history?: { role: string, content: string }[], tenantName?: string, personalityPrompt?: string }
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

    return makeAIRequest(fullMessages, 0.6, "socratic_tutor", context.tenantName, context.personalityPrompt);
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

    return askAI(prompt, systemPrompt, "weekly_parent_report");
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

    const response = await askAI(prompt, systemPrompt, "report_highlights");

    return response
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .slice(0, 3);
}
/**
 * Gelişmiş Vision OCR: Resimdeki soruyu okur ve tertemiz metne çevirir.
 * Tesseract yerine Vision modellerini (Gemini Flash, GPT-4o) kullanır.
 */
export async function analyzeQuestionImage(imageBase64: string, tenantIdOrName?: string): Promise<string> {
    const systemPrompt = `
    Sen OdevGPT Elite OCR Mühendisisin. 
    Görevin: Resimdeki soruyu dijital dünyaya MÜKEMMEL bir şekilde aktarmak.
    
    ÖZEL TALİMATLAR:
    1. **Sıfır Hata Politikası:** Harf, rakam veya sembol yanlışlığı kabul edilemez.
    2. **Pedagojik Normalizasyon:** Metni olduğu gibi oku ama karmaşık matematiksel ifadeleri, üst/alt simgeleri ve formülleri STANDART LaTeX ($...$) formatına sadık kalarak yaz.
    3. **Yapısal Bütünlük:** Sorunun kökü ile seçenekler arasındaki boşluğu koru. Her seçeneği (A, B, C, D, E) kesinlikle yeni bir satıra yaz.
    4. **Görsel Kaymaları Önle:** Metin bloklarını resimdeki mantıksal sırasıyla işle.
    5. **Temiz Çıktı:** Cevabında "İşte sorunuz" veya "Okunan metin" gibi hiçbir ekstra ifade olmamalı. Sadece ve sadece sorunun kendisini döndür.
    `;

    // Vision destekli modelleri öncelikle seç (Gemini Flash çok hızlı ve başarılıdır)
    const visionMessages = [
        { role: "system", content: systemPrompt },
        {
            role: "user",
            content: [
                { type: "text", text: "Lütfen bu resimdeki soruyu metne çevir:" },
                { type: "image_url", image_url: { url: imageBase64 } }
            ]
        }
    ];

    // makeAIRequest tipini esnetmemiz gerekecek çünkü normalde string bekliyor.
    // Ancak makeAIRequest içindeki JSON.stringify bunu zaten halledecektir.
    return makeAIRequest(visionMessages as any, 0.1, "elite_vision_ocr", tenantIdOrName);
}
