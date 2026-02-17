import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle, Share2, MessageSquare, Loader2, Volume2, StopCircle, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { askSocraticAI, getAIResponse, analyzeQuestionImage } from "@/lib/ai";
import { toast } from "sonner";
import { grantXP, XP_VALUES } from "@/lib/gamification";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import SEO from "@/components/SEO";

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
    const autoSolveAttempted = useRef(false);
    const [similarQuestion, setSimilarQuestion] = useState<string | null>(null);
    const [isGeneratingSimilar, setIsGeneratingSimilar] = useState(false);

    // ID her değiştiğinde (yeni soruya geçildiğinde) 'çözüldü' işaretini kaldır
    useEffect(() => {
        autoSolveAttempted.current = false;
    }, [id]);

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

                if (sError && sError.code !== 'PGRST116') throw sError;
                setSolutions(sData || []);

            } catch (error) {
                console.error("Detay yüklenirken hata:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchQuestionData();

        return () => {
            window.speechSynthesis.cancel();
        };
    }, [id, user]);

    // Otomatik Çözümleyici
    useEffect(() => {
        const autoSolve = async () => {
            // Guard: Döngüyü engellemek için kontrol
            if (autoSolveAttempted.current || loading || !question || solutions.length > 0 || isAutoSolving) return;

            autoSolveAttempted.current = true; // Kilidi kapat
            setIsAutoSolving(true);

            try {
                // 0. Eğer metin yoksa ama resim varsa, önce Vision ile metni çıkar
                let finalQuestionText = question.question_text || "";

                if (!finalQuestionText && question.image_url) {
                    toast.info("Görseldeki yazı yapay zeka tarafından okunuyor... 📖");
                    const publicUrl = getPublicUrl(question.image_url);
                    if (publicUrl) {
                        try {
                            const extractedText = await analyzeQuestionImage(publicUrl);
                            if (extractedText && !extractedText.startsWith("HATA:")) {
                                finalQuestionText = extractedText;
                                // Veritabanını güncelle (kalıcı hale getir)
                                await supabase.from("questions")
                                    .update({ question_text: extractedText })
                                    .eq("id", question.id);

                                // State'i güncelle ki arayüzde de görünsün
                                setQuestion(prev => prev ? { ...prev, question_text: extractedText } : prev);
                                toast.success("Metin başarıyla dijitalleştirildi! ✨");
                            }
                        } catch (visionErr) {
                            console.error("Vision OCR Error in detail:", visionErr);
                        }
                    }
                }

                toast.info("Yapay Zeka sorunu inceliyor... 🤖");

                const aiPrompt = `Öğrenci sorusu (${question.subject}): ${finalQuestionText || "Görsel soru"}. 
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
                    // Veritabanına yazılamadı uyarısı kullanıcıyı rahatsız etmemesi için kaldırıldı.
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

    const handleGenerateSimilarQuestion = async () => {
        if (!question) return;
        setIsGeneratingSimilar(true);
        try {
            const prompt = `Öğrencinin şu matematik sorusuna benzer, aynı konuda ve zorlukta YENİ bir pratik sorusu oluştur:
            "${question.question_text || "Görseldeki soru"}"
            
            Sadece soruyu ve şıkları yaz. Cevabı hemen verme.`;

            const response = await getAIResponse([{ role: "user", content: prompt }]);
            setSimilarQuestion(response);
            toast.success("Benzer soru hazır!");

            setTimeout(() => {
                document.getElementById("similar-q-section")?.scrollIntoView({ behavior: "smooth" });
            }, 100);

        } catch (error) {
            console.error(error);
            toast.error("Benzer soru oluşturulamadı.");
        } finally {
            setIsGeneratingSimilar(false);
        }
    };

    const handleSpeak = (text: string, solId: string) => {
        if (speakingInfo?.speaking && speakingInfo.id === solId) {
            window.speechSynthesis.cancel();
            setSpeakingInfo(null);
            return;
        }

        window.speechSynthesis.cancel(); // Öncekini durdur

        // Markdown ve LaTeX sembollerini temizle (Okurken garip durmasın)
        const cleanText = text
            .replace(/[*#_`]/g, '') // Markdown
            .replace(/\$/g, '') // LaTeX dolar işaretleri
            .replace(/\[.*?\]/g, '') // Köşeli parantez içleri (bazen link vs olur)
            .trim();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = "tr-TR";
        utterance.rate = 0.95; // Hafifçe yavaş, ders anlatır gibi
        utterance.pitch = 1.0;

        // Türkçe sesi bulmaya çalış (Google Türkçe sesi varsa harika olur)
        const voices = window.speechSynthesis.getVoices();
        const trVoice = voices.find(v => v.lang.includes('tr')) || voices.find(v => v.lang.includes('TR'));
        if (trVoice) utterance.voice = trVoice;

        utterance.onend = () => setSpeakingInfo(null);
        utterance.onerror = () => {
            setSpeakingInfo(null);
            toast.error("Sesli okuma başlatılamadı.");
        };

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
            <SEO
                title={`${question.subject} Sorusu`}
                description={`${question.subject} dersine ait soru ve çözümü. OdevGPT ile adım adım öğrenin.`}
            />
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
                        className="bg-card rounded-2xl p-5 border shadow-sm h-full"
                    >
                        <h2 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                            <MessageSquare className="w-5 h-5 text-primary" /> Soru İçeriği
                        </h2>

                        {question.image_url && (
                            <div className="space-y-4">
                                <div className="rounded-xl overflow-hidden border bg-muted/30 group relative">
                                    <div className="absolute top-2 left-2 z-10">
                                        <span className="bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-md font-medium uppercase tracking-wider">Orijinal Fotoğraf</span>
                                    </div>
                                    <img
                                        src={getPublicUrl(question.image_url) || ""}
                                        alt="Soru"
                                        className="w-full h-auto object-contain max-h-[350px] transition-transform duration-500 group-hover:scale-[1.02]"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-1 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
                                    <div className="pl-4 space-y-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Dijital Versiyon (AI OCR)</span>
                                        </div>
                                        <div className="text-foreground/90 leading-relaxed text-sm prose dark:prose-invert max-w-none">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkMath]}
                                                rehypePlugins={[rehypeKatex]}
                                            >
                                                {question.question_text || "*Metin çıkarılamadı*"}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!question.image_url && question.question_text && (
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
                                        <div className="text-sm leading-relaxed prose dark:prose-invert max-w-none break-words">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkMath]}
                                                rehypePlugins={[rehypeKatex]}
                                                components={{
                                                    p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                                                    strong: ({ node, ...props }) => <span className="font-bold text-primary" {...props} />
                                                }}
                                            >
                                                {sol.solution_text}
                                            </ReactMarkdown>
                                        </div>
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
                                    <div className="text-sm leading-relaxed prose dark:prose-invert max-w-none break-words">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
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
                        🚀 Başlangıç ipucu
                    </button>
                    <button
                        onClick={() => setInputMessage("Hangi formülü kullanmalıyım?")}
                        className="text-[10px] bg-white dark:bg-card px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900 hover:bg-indigo-50 transition-colors text-indigo-600 dark:text-indigo-400"
                    >
                        📐 Formül sor
                    </button>
                </div>
            </motion.div>

            {/* Benzer Soru / Pratik Yap */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
                id="similar-q-section"
            >
                {!similarQuestion ? (
                    <Button
                        onClick={handleGenerateSimilarQuestion}
                        disabled={isGeneratingSimilar}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none"
                    >
                        {isGeneratingSimilar ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Pratik Sorusu Hazırlanıyor...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 mr-2" />
                                Benzer Soru Çöz & Pekiştir
                            </>
                        )}
                    </Button>
                ) : (
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl p-6 border-2 border-emerald-100 dark:border-emerald-900 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles className="w-32 h-32 text-emerald-500" />
                        </div>
                        <h3 className="font-bold text-lg text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Sıra Sende!
                        </h3>
                        <div className="prose dark:prose-invert max-w-none mb-4 text-emerald-900 dark:text-emerald-100">
                            <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {similarQuestion}
                            </ReactMarkdown>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                onClick={() => setSimilarQuestion(null)}
                            >
                                Yeni Soru İste
                            </Button>
                            <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => navigate("/dashboard/ask")}
                            >
                                Çözümü Gönder
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
