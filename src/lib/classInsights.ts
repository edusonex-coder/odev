/**
 * CLASS INSIGHTS AI SERVICE
 * 
 * Sınıf performansını analiz eden ve öğretmenlere pedagojik öneriler sunan AI servisi.
 * Groq API kullanarak zayıf konuları tespit eder ve öğretim stratejileri önerir.
 */

import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});

export interface WeakTopic {
    topic: string;
    difficulty_score: number;
    student_count: number;
    avg_attempts: number;
}

export interface StudentMetric {
    student_id: string;
    student_name: string;
    total_questions: number;
    solved_questions: number;
    success_rate: number;
    total_xp: number;
    current_level: number;
}

export interface ClassInsight {
    weak_topics: WeakTopic[];
    strong_topics: string[];
    average_success_rate: number;
    total_questions_analyzed: number;
    ai_recommendations: string;
    suggested_exercises: {
        topic: string;
        exercise_type: string;
        difficulty: 'easy' | 'medium' | 'hard';
        description: string;
    }[];
}

/**
 * Sınıfın zayıf konularını analiz eder ve AI önerileri oluşturur
 */
export async function analyzeClassPerformance(
    weakTopics: WeakTopic[],
    studentMetrics: StudentMetric[],
    className: string
): Promise<ClassInsight> {
    try {
        // Zayıf ve güçlü konuları ayır
        const weak = weakTopics.filter(t => t.difficulty_score > 0.6);
        const strong = weakTopics.filter(t => t.difficulty_score < 0.4).map(t => t.topic);

        // Ortalama başarı oranını hesapla
        const avgSuccess = studentMetrics.length > 0
            ? studentMetrics.reduce((sum, s) => sum + s.success_rate, 0) / studentMetrics.length
            : 0;

        // AI'dan pedagojik öneriler al
        const aiRecommendations = await generateTeachingRecommendations(weak, className, avgSuccess);

        // Önerilen alıştırmalar oluştur
        const suggestedExercises = await generateExerciseSuggestions(weak);

        return {
            weak_topics: weak,
            strong_topics: strong,
            average_success_rate: Math.round(avgSuccess * 100) / 100,
            total_questions_analyzed: studentMetrics.reduce((sum, s) => sum + s.total_questions, 0),
            ai_recommendations: aiRecommendations,
            suggested_exercises: suggestedExercises,
        };
    } catch (error) {
        console.error("Class performance analysis error:", error);
        throw new Error("Sınıf analizi sırasında bir hata oluştu.");
    }
}

/**
 * AI ile öğretmene pedagojik öneriler oluşturur
 */
async function generateTeachingRecommendations(
    weakTopics: WeakTopic[],
    className: string,
    avgSuccessRate: number
): Promise<string> {
    if (weakTopics.length === 0) {
        return "🎉 Harika! Sınıfınız tüm konularda başarılı. Öğrencilerinizi tebrik edin ve daha ileri seviye konulara geçebilirsiniz.";
    }

    const topicList = weakTopics.map(t => 
        `- ${t.topic} (Zorluk: ${(t.difficulty_score * 100).toFixed(0)}%, ${t.student_count} öğrenci)`
    ).join('\n');

    const prompt = `Sen deneyimli bir eğitim danışmanısın. Bir öğretmene sınıfının performansı hakkında pedagojik öneriler sunuyorsun.

SINIF BİLGİLERİ:
- Sınıf: ${className}
- Ortalama Başarı Oranı: ${(avgSuccessRate).toFixed(1)}%
- Zayıf Konular:
${topicList}

GÖREV:
1. Zayıf konuları analiz et
2. Öğretmene bu konuları güçlendirmek için 3-4 somut, uygulanabilir öneri sun
3. Sokratik öğrenme ve aktif katılım yöntemlerini öner
4. Pozitif ve motive edici bir dil kullan

ÖNERİLER (Maksimum 300 kelime):`;

    const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || "AI önerileri oluşturulamadı.";
}

/**
 * Zayıf konular için önerilen alıştırmalar oluşturur
 */
async function generateExerciseSuggestions(
    weakTopics: WeakTopic[]
): Promise<ClassInsight['suggested_exercises']> {
    if (weakTopics.length === 0) return [];

    const exercises: ClassInsight['suggested_exercises'] = [];

    for (const topic of weakTopics.slice(0, 3)) { // İlk 3 zayıf konu için
        const prompt = `Konu: ${topic.topic}

Bu konu için öğrencilerin pratik yapabileceği 1 alıştırma türü öner.
Sadece alıştırma türünü ve kısa açıklamasını yaz (maksimum 50 kelime).

Format:
Alıştırma Türü: [tür]
Açıklama: [açıklama]`;

        try {
            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.3-70b-versatile",
                temperature: 0.8,
                max_tokens: 150,
            });

            const response = completion.choices[0]?.message?.content || "";
            const typeMatch = response.match(/Alıştırma Türü:\s*(.+)/i);
            const descMatch = response.match(/Açıklama:\s*(.+)/i);

            exercises.push({
                topic: topic.topic,
                exercise_type: typeMatch?.[1]?.trim() || "Pratik Soruları",
                difficulty: topic.difficulty_score > 0.8 ? 'easy' : 
                           topic.difficulty_score > 0.6 ? 'medium' : 'hard',
                description: descMatch?.[1]?.trim() || "Konuyu pekiştirmek için alıştırmalar yapın.",
            });
        } catch (error) {
            console.error(`Exercise generation error for ${topic.topic}:`, error);
            exercises.push({
                topic: topic.topic,
                exercise_type: "Pratik Soruları",
                difficulty: 'medium',
                description: "Bu konuyla ilgili çeşitli sorular çözün.",
            });
        }
    }

    return exercises;
}

/**
 * Öğrenci performans trendini analiz eder (son 30 gün)
 */
export function analyzeStudentTrend(
    progressData: { date: string; questions_asked: number; questions_solved: number; xp_gained: number }[]
): {
    trend: 'improving' | 'declining' | 'stable';
    trend_percentage: number;
    summary: string;
} {
    if (progressData.length < 7) {
        return {
            trend: 'stable',
            trend_percentage: 0,
            summary: 'Yeterli veri yok. En az 7 günlük aktivite gerekli.',
        };
    }

    // İlk ve son hafta ortalamalarını karşılaştır
    const firstWeek = progressData.slice(-7);
    const lastWeek = progressData.slice(0, 7);

    const firstWeekAvg = firstWeek.reduce((sum, d) => sum + d.questions_solved, 0) / 7;
    const lastWeekAvg = lastWeek.reduce((sum, d) => sum + d.questions_solved, 0) / 7;

    const change = ((lastWeekAvg - firstWeekAvg) / (firstWeekAvg || 1)) * 100;

    let trend: 'improving' | 'declining' | 'stable';
    let summary: string;

    if (change > 15) {
        trend = 'improving';
        summary = `🚀 Harika! Son hafta performansı %${change.toFixed(0)} arttı.`;
    } else if (change < -15) {
        trend = 'declining';
        summary = `⚠️ Dikkat! Son hafta performansı %${Math.abs(change).toFixed(0)} düştü.`;
    } else {
        trend = 'stable';
        summary = `📊 Performans stabil. Düzenli çalışmaya devam ediyor.`;
    }

    return {
        trend,
        trend_percentage: Math.round(change * 100) / 100,
        summary,
    };
}
