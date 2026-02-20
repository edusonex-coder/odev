/**
 * AI ASSIGNMENT GENERATOR
 * 
 * Öğretmenler için otomatik interaktif ödevler (quizler) üretir.
 */

import { askAI } from "./ai";

export interface AIQuestion {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export async function generateAIAssignment(
    subject: string,
    topic: string,
    level: string,
    count: number = 5
): Promise<AIQuestion[]> {
    const prompt = `Sen uzman bir eğitim materyali tasarımcısısın. ${subject} dersinin ${topic} konusu üzerine, ${level} zorluk seviyesinde ${count} adet çoktan seçmeli sorudan oluşan bir ödev hazırlamalısın.

GÖREV:
Aşağıdaki yapıda bir JSON array döndür:
[
  {
    "id": "q1",
    "question": "Soru metni buraya",
    "options": ["A şıkkı", "B şıkkı", "C şıkkı", "D şıkkı"],
    "correctIndex": 0,
    "explanation": "Doğru cevabın kısa pedagojik açıklaması"
  }
]

KURALLAR:
1. Sadece JSON döndür. Başka açıklama ekleme.
2. Sorular öğretici ve müfredata uygun olsun.
3. ${level === 'easy' ? 'Temel kavramlara odaklan.' : level === 'hard' ? 'Analiz ve sentez gerektiren zor sorular hazırla.' : 'Kavrama seviyesinde sorular hazırla.'}
`;

    try {
        const response = await askAI(prompt, "Sen uzman bir eğitim materyali tasarımcısısın. Sadece JSON formatında sorular üretirsin.", "assignment_generator");

        // JSON Ayıklama
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        const questions = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

        if (!questions || !Array.isArray(questions)) {
            throw new Error("AI geçerli bir soru seti üretemedi.");
        }

        return questions as AIQuestion[];
    } catch (error) {
        console.error("Assignment generation error:", error);
        throw new Error("Ödev üretilirken bir hata oluştu.");
    }
}
