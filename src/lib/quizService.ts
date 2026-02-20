
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
    // 1. Öğrencinin son sorularını getir (Bağlam için)
    let query = supabase
        .from('questions')
        .select('question_text, ai_response')
        .eq('student_id', studentId);

    if (subject !== 'Genel') {
        query = query.eq('subject', subject);
    }

    const { data: questions } = await query
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
        const response = await askAI(prompt, "Sen uzman bir Sokratik eğitim tasarımcısısın. Sadece JSON formatında çıktı verirsin.", "socratic_quiz");

        // Daha dayanıklı JSON ayıklama logic
        const jsonMatch = response.match(/\[[\s\S]*\]/);

        if (!jsonMatch) {
            console.error("AI did not return valid JSON array:", response);
            throw new Error("Geçersiz format.");
        }

        const cleanJson = jsonMatch[0];
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Quiz generation detailed error:", error);
        throw new Error("Quiz üretilemedi.");
    }
}
