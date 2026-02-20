/**
 * CLASS INSIGHTS PANEL
 * 
 * Öğretmenlerin sınıf performansını AI ile analiz edip görselleştirdiği ana panel.
 * Zayıf konuları, öğrenci metriklerini ve AI önerilerini gösterir.
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { analyzeClassPerformance, WeakTopic, StudentMetric, ClassInsight } from '@/lib/classInsights';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Brain, TrendingDown, TrendingUp, Lightbulb, BookOpen, AlertCircle, Award, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface ClassInsightsPanelProps {
    classId: string;
    className: string;
}

export default function ClassInsightsPanel({ classId, className }: ClassInsightsPanelProps) {
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [insights, setInsights] = useState<ClassInsight | null>(null);
    const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
    const [studentMetrics, setStudentMetrics] = useState<StudentMetric[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        fetchInsights();
    }, [classId]);

    const fetchInsights = async () => {
        try {
            setLoading(true);

            // 1. Zayıf konuları ve trendleri al (Yeni RPC v2)
            const { data: analyticsData, error: analyticsError } = await supabase
                .rpc('get_class_analytics_v2', { p_class_id: classId });

            if (analyticsError) throw analyticsError;

            // 2. Sınıf genel metriklerini al
            const { data: metricsData, error: metricsError } = await supabase
                .rpc('get_class_overall_metrics', { p_class_id: classId });

            if (metricsError) throw metricsError;

            // 3. Öğrenci metriklerini al (Görünümden)
            const { data: studentPerfData, error: perfError } = await supabase
                .from('student_performance_metrics')
                .select('*')
                .eq('class_id', classId);

            if (perfError) throw perfError;

            setWeakTopics((analyticsData || []).map((t: any) => ({
                topic: t.topic,
                difficulty_score: 1 - t.success_rate,
                student_count: t.student_count,
                trend: t.trend,
                total_questions: t.total_questions
            })));

            setStudentMetrics(studentPerfData || []);

            // 4. Mevcut AI insight kontrol et
            const { data: existingInsight } = await supabase
                .from('class_insights')
                .select('*')
                .eq('class_id', classId)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (existingInsight) {
                setInsights({
                    weak_topics: Array.isArray(existingInsight.weak_topics) ? existingInsight.weak_topics : [],
                    strong_topics: [],
                    average_success_rate: Number(existingInsight.average_success_rate) || 0,
                    total_questions_analyzed: Number(existingInsight.total_questions_analyzed) || 0,
                    ai_recommendations: existingInsight.ai_recommendations || '',
                    suggested_exercises: Array.isArray(existingInsight.suggested_exercises) ? existingInsight.suggested_exercises : [],
                });
            }

        } catch (error: any) {
            console.error('Insights fetch error:', error);
            toast({
                title: 'Hata',
                description: 'Sınıf analizi yüklenirken bir sorun oluştu.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const generateNewInsights = async () => {
        try {
            setAnalyzing(true);

            // AI analizi yap
            const newInsights = await analyzeClassPerformance(
                weakTopics,
                studentMetrics,
                className
            );

            // Veritabanına kaydet
            const { error } = await supabase
                .from('class_insights')
                .insert({
                    class_id: classId,
                    weak_topics: newInsights.weak_topics,
                    average_success_rate: newInsights.average_success_rate,
                    total_questions_analyzed: newInsights.total_questions_analyzed,
                    ai_recommendations: newInsights.ai_recommendations,
                    suggested_exercises: newInsights.suggested_exercises,
                });

            if (error) throw error;

            setInsights(newInsights);

            toast({
                title: '✅ Analiz Tamamlandı',
                description: 'Sınıf performansı başarıyla analiz edildi.',
            });

        } catch (error: any) {
            console.error('Insights generation error:', error);
            toast({
                title: 'Hata',
                description: 'AI analizi sırasında bir sorun oluştu.',
                variant: 'destructive',
            });
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Sınıf verileri analiz ediliyor...</p>
            </div>
        );
    }

    const chartData = weakTopics.slice(0, 5).map(topic => ({
        name: topic.topic.length > 15 ? topic.topic.substring(0, 15) + '...' : topic.topic,
        score: Math.round(topic.difficulty_score * 100),
        students: topic.student_count,
    }));

    return (
        <div className="space-y-8 pb-10">
            {/* Header / Spotlight Area */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-6 rounded-3xl border border-primary/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="relative z-10">
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-2xl">
                            <Brain className="w-8 h-8 text-primary" />
                        </div>
                        {className} Zeka Raporu
                    </h2>
                    <p className="text-muted-foreground font-medium mt-1">
                        Yapay zeka sınıftaki öğrenme açıklarını sizin için tespit etti.
                    </p>
                </div>
                <Button
                    onClick={generateNewInsights}
                    disabled={analyzing || weakTopics.length === 0}
                    className="gap-2 h-12 px-6 rounded-2xl shadow-glow text-lg font-bold transition-all hover:scale-105 active:scale-95"
                >
                    {analyzing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            AI Düşünüyor...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Yeni Analiz Üret
                        </>
                    )}
                </Button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {[
                    { label: 'Sınıf Başarısı', value: `${insights?.average_success_rate.toFixed(0) || '0'}%`, icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Analiz Edilen', value: insights?.total_questions_analyzed || 0, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Kritik Konu', value: weakTopics.filter(t => t.difficulty_score > 0.7).length, icon: TrendingDown, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Öğrenci Sayısı', value: studentMetrics.length, icon: User, color: 'text-purple-600', bg: 'bg-purple-50' }
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{stat.label}</p>
                                <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Visual Analytics - 2/3 Width */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm overflow-hidden rounded-3xl">
                        <CardHeader className="bg-slate-50/50 pb-2">
                            <CardTitle className="text-lg font-black flex items-center gap-2">
                                <TrendingDown className="w-5 h-5 text-orange-600" />
                                ÖĞRENME AÇIKLARI
                            </CardTitle>
                            <CardDescription className="text-xs uppercase font-bold tracking-widest text-muted-foreground">
                                En çok zorlanılan konular (Zorluk yüzdesi)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {chartData.length > 0 ? (
                                <div className="h-[320px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                fontSize={10}
                                                fontWeight="bold"
                                                stroke="#94a3b8"
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                fontSize={10}
                                                fontWeight="bold"
                                                stroke="#94a3b8"
                                                tickFormatter={(v) => `%${v}`}
                                            />
                                            <Tooltip
                                                cursor={{ fill: '#f8fafc' }}
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border shadow-xl">
                                                                <p className="font-black text-xs text-slate-800 border-b pb-1 mb-1">{payload[0].payload.name}</p>
                                                                <div className="space-y-1">
                                                                    <p className="text-xs flex items-center gap-2">
                                                                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                                                                        <span className="font-bold">Zorluk: %{payload[0].value}</span>
                                                                    </p>
                                                                    <p className="text-[10px] text-muted-foreground flex items-center gap-2">
                                                                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                                                                        <span>{payload[0].payload.students} Öğrenci Takıldı</span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Bar dataKey="score" radius={[8, 8, 8, 8]} barSize={32}>
                                                {chartData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.score > 80 ? '#f43f5e' : entry.score > 60 ? '#f97316' : '#eab308'}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground italic">
                                    <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
                                    Yeterli analiz verisi henüz oluşmadı.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* AI Recommendations */}
                    <AnimatePresence mode="wait">
                        {insights && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <Card className="border-none shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-20" />
                                    <CardHeader className="border-b border-white/10">
                                        <CardTitle className="text-xl font-black flex items-center gap-3">
                                            <div className="bg-primary p-2 rounded-xl">
                                                <Lightbulb className="w-5 h-5 text-white" />
                                            </div>
                                            AI PEDAGOJİK STRATEJİ
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 relative z-10">
                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <p className="text-slate-300 leading-relaxed text-base italic font-medium">
                                                "{insights.ai_recommendations}"
                                            </p>
                                        </div>
                                    </CardContent>
                                    <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between items-center">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">OdevGPT Eğitim Rehberi</span>
                                        <Badge className="bg-primary/20 text-primary border-none text-[10px]">PROFESSOR AI</Badge>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar - 1/3 Width */}
                <div className="space-y-6">
                    {/* Alerters / Spotlight Students */}
                    <Card className="border-none shadow-sm rounded-3xl h-full">
                        <CardHeader>
                            <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-tight">
                                <AlertCircle className="w-4 h-4 text-rose-500" />
                                DİKKAT GEREKTİRENLER
                            </CardTitle>
                            <CardDescription className="text-[10px] font-bold">
                                Başarı oranı %60'ın altında olan öğrenciler
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {studentMetrics
                                .filter(s => s.success_rate < 0.6)
                                .sort((a, b) => a.success_rate - b.success_rate)
                                .slice(0, 8)
                                .map((student, index) => (
                                    <div key={index} className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl hover:bg-slate-100 transition-colors group">
                                        <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center font-black text-sm shadow-sm group-hover:rotate-12 transition-transform">
                                            {student.student_name.charAt(0)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black text-slate-700">{student.student_name}</span>
                                                <span className="text-[10px] font-bold text-rose-500">%{Math.round(student.success_rate * 100)}</span>
                                            </div>
                                            <Progress value={student.success_rate * 100} className="h-1.5" />
                                        </div>
                                    </div>
                                ))}

                            {studentMetrics.filter(s => s.success_rate < 0.6).length === 0 && (
                                <div className="text-center py-12 space-y-4">
                                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                                        <Sparkles className="w-6 h-6 text-green-600" />
                                    </div>
                                    <p className="text-xs font-black text-green-700 uppercase tracking-widest leading-normal">
                                        Mükemmel! <br /> Herkes Hedefin Üzerinde.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Recommended Actions */}
                    {insights?.suggested_exercises && insights.suggested_exercises.length > 0 && (
                        <Card className="border-none shadow-sm bg-accent/5 rounded-3xl border-2 border-accent/20">
                            <CardHeader>
                                <CardTitle className="text-sm font-black flex items-center gap-2 uppercase">
                                    <BookOpen className="w-4 h-4 text-accent" />
                                    ACİL ETKİNLİK PLANI
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {insights.suggested_exercises.map((ex, i) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl border shadow-sm space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter">
                                                {ex.topic}
                                            </Badge>
                                            <div className="flex gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-200" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-100" />
                                            </div>
                                        </div>
                                        <h5 className="font-black text-xs">{ex.exercise_type}</h5>
                                        <p className="text-[10px] text-muted-foreground leading-snug">{ex.description}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

// Missing Lucide Icon 'User' fix
function User(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function Sparkles(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    );
}
