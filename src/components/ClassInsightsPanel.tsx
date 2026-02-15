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
import { Loader2, Brain, TrendingDown, TrendingUp, Lightbulb, BookOpen, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

            // 1. Zayıf konuları al (RPC)
            const { data: weakTopicsData, error: weakError } = await supabase
                .rpc('get_class_weak_topics', { p_class_id: classId, p_limit: 10 });

            if (weakError) throw weakError;

            // 2. Öğrenci metriklerini al (View)
            const { data: metricsData, error: metricsError } = await supabase
                .from('student_performance_metrics')
                .select('*')
                .eq('class_id', classId);

            if (metricsError) throw metricsError;

            setWeakTopics(weakTopicsData || []);
            setStudentMetrics(metricsData || []);

            // 3. Mevcut insight var mı kontrol et
            const { data: existingInsight } = await supabase
                .from('class_insights')
                .select('*')
                .eq('class_id', classId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (existingInsight) {
                setInsights({
                    weak_topics: existingInsight.weak_topics || [],
                    strong_topics: [],
                    average_success_rate: existingInsight.average_success_rate || 0,
                    total_questions_analyzed: existingInsight.total_questions_analyzed || 0,
                    ai_recommendations: existingInsight.ai_recommendations || '',
                    suggested_exercises: existingInsight.suggested_exercises || [],
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
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const chartData = weakTopics.slice(0, 5).map(topic => ({
        name: topic.topic.length > 20 ? topic.topic.substring(0, 20) + '...' : topic.topic,
        score: Math.round(topic.difficulty_score * 100),
        students: topic.student_count,
    }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Brain className="w-6 h-6 text-primary" />
                        Sınıf Zeka Raporu
                    </h2>
                    <p className="text-muted-foreground">
                        AI destekli performans analizi ve öğretim önerileri
                    </p>
                </div>
                <Button
                    onClick={generateNewInsights}
                    disabled={analyzing || weakTopics.length === 0}
                    className="gap-2"
                >
                    {analyzing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analiz Ediliyor...
                        </>
                    ) : (
                        <>
                            <Brain className="w-4 h-4" />
                            Yeni Analiz Oluştur
                        </>
                    )}
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ortalama Başarı</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">
                            {insights?.average_success_rate.toFixed(1) || '0'}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {studentMetrics.length} öğrenci ortalaması
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Analiz Edilen Soru</CardTitle>
                        <BookOpen className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">
                            {insights?.total_questions_analyzed || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Toplam soru sayısı
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Zayıf Konu</CardTitle>
                        <TrendingDown className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-700">
                            {weakTopics.filter(t => t.difficulty_score > 0.6).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Dikkat gerektiren konular
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Weak Topics Chart */}
            {chartData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingDown className="w-5 h-5 text-orange-600" />
                            En Zor Konular
                        </CardTitle>
                        <CardDescription>
                            Öğrencilerin en çok zorlandığı 5 konu
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis
                                    dataKey="name"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                    formatter={(value: any, name: string) => {
                                        if (name === 'score') return [`${value}%`, 'Zorluk Skoru'];
                                        if (name === 'students') return [value, 'Öğrenci Sayısı'];
                                        return [value, name];
                                    }}
                                />
                                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.score > 80 ? '#ef4444' : entry.score > 60 ? '#f97316' : '#eab308'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* AI Recommendations */}
            {insights?.ai_recommendations && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-600" />
                            AI Öğretim Önerileri
                        </CardTitle>
                        <CardDescription>
                            Yapay zeka tarafından oluşturulan pedagojik öneriler
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-none">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                {insights.ai_recommendations}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Suggested Exercises */}
            {insights?.suggested_exercises && insights.suggested_exercises.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            Önerilen Alıştırmalar
                        </CardTitle>
                        <CardDescription>
                            Zayıf konuları güçlendirmek için öneriler
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {insights.suggested_exercises.map((exercise, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-sm">{exercise.topic}</h4>
                                            <Badge
                                                variant={
                                                    exercise.difficulty === 'easy' ? 'secondary' :
                                                        exercise.difficulty === 'medium' ? 'default' : 'destructive'
                                                }
                                                className="text-xs"
                                            >
                                                {exercise.difficulty === 'easy' ? 'Kolay' :
                                                    exercise.difficulty === 'medium' ? 'Orta' : 'Zor'}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-1">
                                            {exercise.exercise_type}
                                        </p>
                                        <p className="text-sm">{exercise.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* No Data State */}
            {weakTopics.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Henüz Veri Yok</h3>
                        <p className="text-sm text-muted-foreground text-center max-w-md">
                            Sınıf analizi için yeterli veri bulunmuyor. Öğrencileriniz soru çözmeye başladığında
                            burada detaylı performans raporları görebileceksiniz.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
