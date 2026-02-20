
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, CheckCircle2, ArrowRight, Loader2, Trophy, HelpCircle } from 'lucide-react';
import { generateSocraticQuiz, QuizQuestion } from '@/lib/quizService';
import { useToast } from '@/hooks/use-toast';

export function SocraticQuizCard({ studentId }: { studentId: string }) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'active' | 'finished'>('idle');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const { toast } = useToast();

    const startQuiz = async () => {
        try {
            setStatus('loading');
            const data = await generateSocraticQuiz(studentId, 'Genel');
            setQuestions(data);
            setStatus('active');
            setCurrentIndex(0);
            setScore(0);
        } catch (error) {
            toast({ title: "Hata", description: "Zeka testi yüklenemedi, lütfen tekrar dene.", variant: "destructive" });
            setStatus('idle');
        }
    };

    const handleAnswer = (index: number) => {
        if (isLocked) return;
        setSelectedAnswer(index);
        setIsLocked(true);

        if (index === questions[currentIndex].correctIndex) {
            setScore(s => s + 1);
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(c => c + 1);
            setSelectedAnswer(null);
            setIsLocked(false);
        } else {
            setStatus('finished');
        }
    };

    if (status === 'idle') {
        return (
            <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-primary text-white rounded-3xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <CardHeader>
                    <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-2">
                        <Brain className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-black">Zeka Testi 👋</CardTitle>
                    <CardDescription className="text-indigo-100 font-medium">
                        Bugün neler öğrendin? AI sana özel 3 soru hazırlasın.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={startQuiz}
                        className="w-full bg-white text-indigo-600 hover:bg-slate-50 h-12 rounded-2xl font-black shadow-lg"
                    >
                        TESTİ BAŞLAT
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (status === 'loading') {
        return (
            <Card className="border-none shadow-xl h-[280px] flex items-center justify-center rounded-3xl">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
                    <p className="text-sm font-black animate-pulse text-muted-foreground uppercase tracking-widest">
                        Zeka Testi Hazırlanıyor...
                    </p>
                </div>
            </Card>
        );
    }

    if (status === 'active') {
        const q = questions[currentIndex];
        return (
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden min-h-[400px]">
                <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
                    <Badge variant="outline" className="text-white border-white/20">
                        SORU {currentIndex + 1} / {questions.length}
                    </Badge>
                    <div className="flex gap-1">
                        {questions.map((_, i) => (
                            <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${i === currentIndex ? 'bg-primary' : i < currentIndex ? 'bg-green-500' : 'bg-white/20'}`} />
                        ))}
                    </div>
                </div>
                <CardContent className="p-8 space-y-6">
                    <h3 className="text-xl font-bold leading-relaxed">{q.question}</h3>
                    <div className="grid gap-3">
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                disabled={isLocked}
                                className={`w-full p-4 rounded-2xl text-left font-medium transition-all ${selectedAnswer === i
                                        ? (i === q.correctIndex ? 'bg-green-500 text-white shadow-lg' : 'bg-rose-500 text-white')
                                        : isLocked && i === q.correctIndex
                                            ? 'bg-green-100 border-2 border-green-500'
                                            : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${selectedAnswer === i ? 'bg-white/20' : 'bg-slate-200'
                                        }`}>
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                    {opt}
                                </div>
                            </button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {isLocked && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-primary/5 rounded-2xl border border-primary/10"
                            >
                                <p className="text-xs font-bold text-primary uppercase mb-1">🔍 Sokratik Not:</p>
                                <p className="text-sm font-medium leading-relaxed">{q.explanation}</p>
                                <Button onClick={nextQuestion} className="w-full mt-4 bg-slate-900">
                                    SONRAKİ SORU
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden text-center p-12 bg-slate-50">
            <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
                <Trophy className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-black mb-2">Tebrikler!</h2>
            <p className="text-muted-foreground font-medium mb-8">
                Testi tamamladın! Skorun: <span className="text-primary font-black">{score} / {questions.length}</span>
            </p>
            <div className="flex gap-4">
                <Button onClick={() => setStatus('idle')} variant="outline" className="flex-1 h-12 rounded-2xl border-2 font-bold">
                    KAPAT
                </Button>
                <Button onClick={startQuiz} className="flex-1 h-12 rounded-2xl font-bold bg-primary shadow-glow">
                    TEKRAR DENE
                </Button>
            </div>
        </Card>
    );
}
