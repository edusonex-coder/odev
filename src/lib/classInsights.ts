/**
 * CLASS INSIGHTS AI SERVICE
 * 
 * Sınıf performansını analiz eden ve öğretmenlere pedagojik öneriler sunan AI servisi.
 * Merkezi AI servisini kullanarak zayıf konuları tespit eder ve öğretim stratejileri önerir.
 */

import { askAI } from "./ai";

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
 * Sınıfın zayıf konularını analiz eder ve AI önerileri oluşturur (Tek seferlik AI çağrısı ile optimize edildi)
 */
export async function analyzeClassPerformance(
    weakTopics: WeakTopic[],
    studentMetrics: StudentMetric[],
    className: string
): Promise<ClassInsight> {
    try {
        const avgSuccess = studentMetrics.length > 0
            ? studentMetrics.reduce((sum, s) => sum + s.success_rate, 0) / studentMetrics.length
            : 0;

        const topicList = weakTopics.map(t =>
            `- ${t.topic} (Zorluk: ${(t.difficulty_score * 100).toFixed(0)}%, ${t.student_count} öğrenci)`
        ).join('\n');

        const prompt = `Sen uzman bir eğitim analistisin. ${className} sınıfının verilerini analiz edip JSON formatında bir rapor sunmalısın.

VERİLER:
- Ortalama Başarı: %${(avgSuccess * 100).toFixed(1)}
- Konu Bazlı Durum:
${topicList}

GÖREV:
Aşağıdaki yapıda bir JSON objesi döndür:
{
  "recommendation": "Öğretmen için 3-4 maddelik pedagojik strateji metni",
  "exercises": [
    {
      "topic": "Konu Adı",
      "type": "Alıştırma Türü",
      "difficulty": "easy|medium|hard",
      "description": "Kısa açıklama"
    }
  ],
  "strong_topics": ["En başarılı olunan 2 konu"]
}

Sadece JSON döndür. Başka açıklama ekleme.`;

        const response = await askAI(prompt, "Sen uzman bir eğitim analistisin. Sadece JSON döner ve net eğitim stratejileri üretirsin.", "teacher_analytics");

        // JSON Ayıklama
        const jsonMatch = response.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
        const data = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

        if (!data) throw new Error("AI geçerli bir analiz üretemedi.");

        return {
            weak_topics: weakTopics.filter(t => t.difficulty_score > 0.5),
            strong_topics: data.strong_topics || [],
            average_success_rate: Math.round(avgSuccess * 100) / 100,
            total_questions_analyzed: studentMetrics.reduce((sum, s) => sum + s.total_questions, 0),
            ai_recommendations: data.recommendation || "Analiz tamamlandı.",
            suggested_exercises: data.exercises || [],
        };
    } catch (error) {
        console.error("Class performance analysis error:", error);
        throw new Error("Sınıf analizi sırasında bir hata oluştu.");
    }
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
