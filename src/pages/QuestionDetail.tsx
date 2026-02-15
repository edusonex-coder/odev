import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle, Share2, MessageSquare, Loader2, Volume2, StopCircle, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { askSocraticAI, getAIResponse } from "@/lib/ai";
import { toast } from "sonner";
import { grantXP, XP_VALUES } from "@/lib/gamification";

interface QuestionDetail {
    id: string;
    subject: string;
    question_text: string | null;
    image_url: string | null;
    status: string;
    created_at: string;
}

interface Solution {
    id: string;
    solution_text: string;
    solver_type: 'ai' | 'teacher';
    created_at: string;
}

export default function QuestionDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [question, setQuestion] = useState<QuestionDetail | null>(null);
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [loading, setLoading] = useState(true);
    const [speakingInfo, setSpeakingInfo] = useState<{ id: string, speaking: boolean } | null>(null);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [isAutoSolving, setIsAutoSolving] = useState(false);

    useEffect(() => {
        async function fetchQuestionData() {
            if (!id || !user) return;
            try {
                // Soruyu çek
                const { data: qData, error: qError } = await supabase
                    .from("questions")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (qError) throw qError;
                setQuestion(qData);

                // Çözümleri çek
                const { data: sData, error: sError } = await supabase
                    .from("solutions")
                    .select("*")
                    .eq("question_id", id)
                    .order("created_at", { ascending: false });

                if (sError && sError.code !== 'PGRST116') throw sError; // Çözüm yoksa hata verme
                setSolutions(sData || []);

            } catch (error) {
                console.error("Detay yüklenirken hata:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchQuestionData();

        // Component unmount olduğunda konuşmayı durdur
        return () => {
            window.speechSynthesis.cancel();
        };
    }, [id, user]);

    // Otomatik Çözümleyici (Eğer çözüm yoksa devreye girer)
    useEffect(() => {
        const autoSolve = async () => {
            // Soru yüklendi, yükleme bitti, çözüm YOK ve henüz çözülmüyorsa
            if (loading || !question || solutions.length > 0 || isAutoSolving) return;

            setIsAutoSolving(true);
            try {
                toast.info("Yapay Zeka sorunu inceliyor... 🤖");

                const aiPrompt = `Öğrenci sorusu (${question.subject}): ${question.question_text || "Görsel soru"}. 
                Lütfen bu soruyu adım adım, açıklayıcı ve eğitici bir dille çöz. 
                Cevabı doğrudan verme, önce ipucu ver sonra çözümü anlat. Türkçe kullan.`;

                // 1. Cevabı al
                const aiResponseText = await getAIResponse([{ role: "user", content: aiPrompt }]);

                // 2. Kaydetmeyi dene
                const { data: solData, error: insertError } = await supabase.from("solutions").insert({
                    question_id: question.id,
                    solver_type: "ai",
                    solver_id: user?.id,
                    solution_text: aiResponseText
                }).select().single();

                if (insertError) {
                    console.error("Çözüm kaydedilemedi (RLS veya İzin hatası):", insertError);
                    // Kaydedilemediyse bile gösterelim (Client-side Fallback)
                    const tempSolution: Solution = {
                        id: "temp-ai-" + Date.now(),
                        solution_text: aiResponseText,
                        solver_type: "ai",
                        created_at: new Date().toISOString()
                    };
                    setSolutions([tempSolution]);
                    toast.warning("Çözüm gösteriliyor (Kaydedilemedi).", { description: "Gelecekte tekrar görüntülemek için sayfayı yenilemeyin." });
                } else {
                    // Başarılı kayıt
                    setSolutions([solData]);
                    await supabase.from("questions").update({ status: "ai_answered" }).eq("id", question.id);
                    toast.success("Çözüm hazır! 🎉");
                }

            } catch (error) {
                console.error("Auto-solve error:", error);
                toast.error("Otomatik çözüm üretilemedi.");
            } finally {
                setIsAutoSolving(false);
            }
        };

        if (!loading && question && solutions.length === 0) {
            autoSolve();
        }
    }, [question, solutions, loading, user]);

    const handleSpeak = (text: string, solId: string) => {
        if (speakingInfo?.speaking && speakingInfo.id === solId) {
            window.speechSynthesis.cancel();
            setSpeakingInfo(null);
            return;
        }

        window.speechSynthesis.cancel(); // Öncekini durdur
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "tr-TR";
        utterance.onend = () => setSpeakingInfo(null);

        setSpeakingInfo({ id: solId, speaking: true });
        window.speechSynthesis.speak(utterance);
    };

    const getPublicUrl = (path: string | null) => {
        if (!path) return null;
        return supabase.storage.from("question_images").getPublicUrl(path).data.publicUrl;
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !question || isThinking) return;

        const userMsg = inputMessage.trim();
        setInputMessage("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsThinking(true);

        try {
            const response = await askSocraticAI(userMsg, {
                question: question.question_text || "Bu bir görsel soru.",
                subject: question.subject,
                history: messages
            });

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);

            // XP Kazandır
            if (user) {
                grantXP(user.id, XP_VALUES.SOCRATIC_MESSAGE);
            }
        } catch (error) {
            console.error("Chat error:", error);
            toast.error("AI ile bağlantı kurulamadı.");
        } finally {
            setIsThinking(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!question) {
        return (
            <div className="text-center py-10">
                <p>Soru bulunamadı veya erişim yetkiniz yok.</p>
                <Button onClick={() => navigate("/dashboard/history")} variant="link">Geri Dön</Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">Soru Detayı</h1>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="capitalize">{question.subject}</span> •
                            <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}</span>
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary" onClick={() => {
                    const shareData = {
                        title: 'OdevGPT Soru Detayı',
                        text: `Bu soruya bakar mısın? ${question.subject} dersinden bir soru.`,
                        url: window.location.href
                    };
                    if (navigator.share) {
                        navigator.share(shareData);
                    } else {
                        navigator.clipboard.writeText(window.location.href);
                        // Basit bir alert veya toast eklenebilir ama şu anlık yeterli
                    }
                }}>
                    <Share2 className="w-5 h-5" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sol: Soru */}
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-2xl p-4 border shadow-sm"
                    >
                        <h2 className="font-semibold mb-3 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-primary" /> Soru
                        </h2>

                        {question.image_url && (
                            <div className="mb-4 rounded-xl overflow-hidden border bg-muted">
                                <img
                                    src={getPublicUrl(question.image_url) || ""}
                                    alt="Soru"
                                    className="w-full h-auto object-contain max-h-[400px]"
                                />
                            </div>
                        )}

                        {question.question_text && (
                            <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                {question.question_text}
                            </p>
                        )}
                    </motion.div>
                </div>

                {/* Sağ: Çözümler */}
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-2xl p-4 border shadow-sm h-full"
                    >
                        <h2 className="font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" /> Çözümler
                        </h2>

                        {solutions.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                {isAutoSolving ? (
                                    <div className="flex flex-col items-center gap-3 animate-pulse">
                                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                        <p className="font-medium text-primary">Yapay Zeka Soruyu Çözüyor...</p>
                                        <p className="text-xs">Lütfen bekleyin, öğretmeniniz çözüm hazırlıyor 🤖</p>
                                    </div>
                                ) : (
                                    <>
                                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>Henüz bir çözüm bulunmuyor.</p>
                                        <p className="text-xs mt-1">Yapay zeka veya öğretmenlerimiz sorunu inceliyor.</p>
                                        <Button
                                            className="mt-4"
                                            variant="outline"
                                            onClick={() => navigate("/dashboard/chat")}
                                        >
                                            AI Asistan'a Sor
                                        </Button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {solutions.map((sol) => (
                                    <div key={sol.id} className="relative bg-secondary/30 rounded-xl p-4 border group transition-all hover:bg-secondary/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${sol.solver_type === 'ai' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {sol.solver_type === 'ai' ? '🤖 AI Çözümü' : '👨‍🏫 Öğretmen Çözümü'}
                                            </span>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="w-8 h-8 rounded-full"
                                                    onClick={() => handleSpeak(sol.solution_text, sol.id)}
                                                >
                                                    {speakingInfo?.id === sol.id && speakingInfo?.speaking ? (
                                                        <StopCircle className="w-4 h-4 text-destructive animate-pulse" />
                                                    ) : (
                                                        <Volume2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    )}
                                                </Button>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(sol.created_at), { addSuffix: true, locale: tr })}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                            {sol.solution_text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Sokratik Chat Bölümü */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background rounded-3xl p-6 border-2 border-indigo-100 dark:border-indigo-900 shadow-lg"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg dark:text-indigo-200">Sokratik Rehber</h2>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Cevabı bulman için sana ipuçları verir</p>
                    </div>
                </div>

                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="text-center py-10 bg-white/50 dark:bg-black/20 rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-800">
                            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-indigo-300 animate-bounce" />
                            <p className="text-sm text-indigo-600 dark:text-indigo-400 px-10">
                                Bu soruyu çözmekte zorlanıyor musun? İlk adımın ne olmalı, bana sorabilirsin!
                            </p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-white dark:bg-card border-2 border-indigo-50 dark:border-indigo-900 rounded-tl-none'
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                    {isThinking && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-card p-4 rounded-2xl rounded-tl-none border shadow-sm">
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSendMessage} className="relative group">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="İpucu iste veya bir şeyler sor..."
                        className="w-full bg-white dark:bg-background border-2 border-indigo-100 dark:border-indigo-900 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
                    />
                    <Button
                        type="submit"
                        disabled={!inputMessage.trim() || isThinking}
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition-all group-hover:scale-105"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        onClick={() => setInputMessage("Bu soruyu çözmeye nasıl başlamalıyım?")}
                        className="text-[10px] bg-white dark:bg-card px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900 hover:bg-indigo-50 transition-colors text-indigo-600 dark:text-indigo-400"
                    >
                        🚀 Nasıl başlamalıyım?
                    </button>
                    <button
                        onClick={() => setInputMessage("Bana küçük bir ipucu verir misin?")}
                        className="text-[10px] bg-white dark:bg-card px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900 hover:bg-indigo-50 transition-colors text-indigo-600 dark:text-indigo-400"
                    >
                        💡 İpucu ver
                    </button>
                    <button
                        onClick={() => setInputMessage("Hangi konuyu bilmem gerekiyor?")}
                        className="text-[10px] bg-white dark:bg-card px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900 hover:bg-indigo-50 transition-colors text-indigo-600 dark:text-indigo-400"
                    >
                        📚 Hangi konu bu?
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
