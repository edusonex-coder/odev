/**
 * CERTIFICATE ENGINE
 * 
 * Öğrencilerin başarılarını analiz eder ve otomatik olarak sertifika üretir.
 */

import { supabase } from "./supabase";
import { askAI } from "./ai";

export type CertificateType = 'academic_excellence' | 'streak_master' | 'level_milestone' | 'subject_expert';

export async function checkAndIssueCertificates(userId: string) {
    try {
        // 1. Kullanıcı verilerini çek
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (!profile) return;

        // 2. Halihazırda var olan sertifikaları çek (Tekrar üretmemek için)
        const { data: existingCerts } = await supabase.from('certificates').select('type').eq('user_id', userId);
        const earnedTypes = new Set(existingCerts?.map(c => c.type));

        // --- SENARYO 1: Seviye 10 Başarısı ---
        if (profile.level >= 10 && !earnedTypes.has('level_milestone')) {
            await issueLevelCertificate(userId, profile.level);
        }

        // --- SENARYO 2: 7 Günlük Seri ---
        if (profile.streak >= 7 && !earnedTypes.has('streak_master')) {
            await issueStreakCertificate(userId, profile.streak);
        }

    } catch (error) {
        console.error("Certificate check error:", error);
    }
}

async function issueLevelCake(userId: string, level: number) {
    // Placeholder - actually used the functions below
}

async function issueLevelCertificate(userId: string, level: number) {
    const aiNote = await askAI(
        `Bir öğrenci OdevGPT'de Seviye ${level} aşamasına geldi. Onu tebrik eden, akademik azmini öven çok kısa (1 cümle) bir "takdir belgesi" notu yaz.`,
        "Sen akademik bir kurul başkanısın. Resmi ama teşvik edici konuşursun."
    );

    await supabase.rpc('issue_certificate', {
        p_user_id: userId,
        p_type: 'level_milestone',
        p_title: `Seviye ${level} Kaşifi`,
        p_description: `OdevGPT platformunda Seviye ${level} aşamasına ulaşarak üstün azim gösterdi.`,
        p_metadata: { level },
        p_ai_commendation: aiNote
    });
}

async function issueStreakCertificate(userId: string, streak: number) {
    const aiNote = await askAI(
        `Bir öğrenci tam ${streak} gündür aralıksız OdevGPT kullanıyor. Bu disiplini öven, bir samuray gibi disiplinli olduğunu belirten esprili ve takdir dolu bir not yaz (1 cümle).`,
        "Sen motivasyonel bir koçsun."
    );

    await supabase.rpc('issue_certificate', {
        p_user_id: userId,
        p_type: 'streak_master',
        p_title: `${streak} Günlük Disiplin Üstadı`,
        p_description: `${streak} gün boyunca kesintisiz öğrenme maratonunu başarıyla sürdürdü.`,
        p_metadata: { streak },
        p_ai_commendation: aiNote
    });
}
