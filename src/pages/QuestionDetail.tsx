import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle, Share2, MessageSquare, Loader2, Volume2, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

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
        </div>
    );
}
