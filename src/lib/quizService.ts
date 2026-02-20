
/**
 * SOKRATİK QUIZ SERVİSİ
 * Öğrencinin geçmişini analiz eder ve kişiselleştirilmiş quizler üretir.
 */

import { askAI } from "./ai";
import { supabase } from "./supabase";

export interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export async function generateSocraticQuiz(studentId: string, subject: string): Promise<QuizQuestion[]> {
    // 1. Öğrencinin bu dersteki son sorularını getir (Bağlam için)
    const { data: questions } = await supabase
        .from('questions')
        .select('question_text, ai_response')
        .eq('student_id', studentId)
        .eq('subject', subject)
        .order('created_at', { ascending: false })
        .limit(3);

    const context = questions?.map(q => `Soru: ${q.question_text}\nCevap Özeti: ${q.ai_response?.substring(0, 100)}...`).join('\n\n') || "Henüz veri yok.";

    const prompt = `Sen Sokratik bir öğretmensin. Öğrencinin ${subject} dersindeki geçmişini analiz ederek ona 3 soruluk bir "Mini Eksik Kapatma Testi" hazırlayacaksın.
    
    ÖĞRENCİ GEÇMİŞİ:
    ${context}
    
    GÖREV:
    - Bu dersle ilgili, öğrencinin zorlanabileceği 3 adet çoktan seçmeli soru hazırlat.
    - Sorular sadece bilgi ölçmesin, düşündürsün (Sokratik tarz).
    - Her sorunun sonunda nedenini açıklayan bir "Sokratik Not" ekle.
    
    JSON FORMATINDA CEVAP VER:
    [
      {
        "question": "Soru metni",
        "options": ["Şık A", "Şık B", "Şık C", "Şık D"],
        "correctIndex": 0,
        "explanation": "Neden A şıkkı doğru? (Sokratik bir dille)"
      },
      ...
    ]
    
    SADECE JSON ÇIKTISI VER, BAŞKA METİN EKLEME.`;

    try {
        const response = await askAI(prompt, "Sen uzman bir Sokratik eğitim tasarımcısısın. Sadece JSON formatında çıktı verirsin.");
        const cleanJson = response.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Quiz generation error:", error);
        throw new Error("Quiz üretilemedi.");
    }
}
