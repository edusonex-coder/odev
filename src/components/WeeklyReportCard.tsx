/**
 * WEEKLY REPORT CARD
 * Veli için haftalık AI destekli öğrenci raporu kartı
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { generateWeeklyParentReport, generateReportHighlights } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';
import {
    FileText,
    Sparkles,
    TrendingUp,
    Award,
    Calendar,
    Loader2
} from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { tr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';

interface WeeklyReportCardProps {
    studentId: string;
    studentName: string;
}

interface WeeklyStats {
    total_questions: number;
    solved_questions: number;
    success_rate: number;
    total_xp_gained: number;
    level_ups: number;
    recent_questions?: Array<{ question_text: string; status: string }>;
}

export function WeeklyReportCard({ studentId, studentName }: WeeklyReportCardProps) {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<{
        summary: string;
        highlights: string[];
        stats: WeeklyStats;
        weekStart: Date;
        weekEnd: Date;
    } | null>(null);
    const { toast } = useToast();

    const generateReport = async () => {
        setLoading(true);
        try {
            // Bu haftanın başlangıç ve bitiş tarihlerini hesapla
            const now = new Date();
            const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Pazartesi
            const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Pazar

            // Haftalık istatistikleri getir
            const { data: statsData, error: statsError } = await supabase
                .rpc('get_student_weekly_stats', {
                    p_student_id: studentId,
                    p_week_start: format(weekStart, 'yyyy-MM-dd'),
                    p_week_end: format(weekEnd, 'yyyy-MM-dd')
                });

            if (statsError) throw statsError;

            const stats = statsData as WeeklyStats;

            // Eğer hiç aktivite yoksa
            if (stats.total_questions === 0) {
                toast({
                    title: "Henüz Aktivite Yok",
                    description: `${studentName} bu hafta henüz soru sormamış.`,
                    variant: "default"
                });
                setLoading(false);
                return;
            }

            // AI ile rapor oluştur
            const [aiSummary, aiHighlights] = await Promise.all([
                generateWeeklyParentReport(studentName, stats),
                generateReportHighlights(studentName, stats)
            ]);

            // Raporu kaydet (cache için)
            const { error: insertError } = await supabase
                .from('parent_reports')
                .insert({
                    parent_id: (await supabase.auth.getUser()).data.user?.id,
                    student_id: studentId,
                    week_start: format(weekStart, 'yyyy-MM-dd'),
                    week_end: format(weekEnd, 'yyyy-MM-dd'),
                    total_questions: stats.total_questions,
                    solved_questions: stats.solved_questions,
                    success_rate: stats.success_rate,
                    total_xp_gained: stats.total_xp_gained,
                    level_ups: stats.level_ups,
                    ai_summary: aiSummary,
                    ai_highlights: aiHighlights
                });

            if (insertError && insertError.code !== '23505') { // 23505 = unique constraint violation (zaten var)
                console.warn('Rapor kaydedilemedi:', insertError);
            }

            setReport({
                summary: aiSummary,
                highlights: aiHighlights,
                stats,
                weekStart,
                weekEnd
            });

            toast({
                title: "Rapor Oluşturuldu! ✨",
                description: "Haftalık gelişim raporu hazır.",
            });

        } catch (error) {
            console.error('Rapor oluşturma hatası:', error);
            toast({
                title: "Hata",
                description: "Rapor oluşturulurken bir sorun oluştu.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <CardTitle>Haftalık Gelişim Raporu</CardTitle>
                    </div>
                    {report && (
                        <Badge variant="outline" className="gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(report.weekStart, 'd MMM', { locale: tr })} - {format(report.weekEnd, 'd MMM', { locale: tr })}
                        </Badge>
                    )}
                </div>
                <CardDescription>
                    {studentName} için AI destekli haftalık performans özeti
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!report && !loading && (
                    <div className="text-center py-8">
                        <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                            Bu hafta için henüz rapor oluşturulmamış
                        </p>
                        <Button
                            onClick={generateReport}
                            className="gap-2"
                        >
                            <Sparkles className="h-4 w-4" />
                            Rapor Oluştur
                        </Button>
                    </div>
                )}

                {loading && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-purple-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">AI rapor oluşturuyor...</span>
                        </div>
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                )}

                {report && !loading && (
                    <div className="space-y-6">
                        {/* İstatistik Kartları */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-blue-600">{report.stats.total_questions}</div>
                                    <div className="text-xs text-blue-600/70">Soru Sordu</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-green-600">{report.stats.solved_questions}</div>
                                    <div className="text-xs text-green-600/70">Çözüm Buldu</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-purple-600">%{report.stats.success_rate.toFixed(0)}</div>
                                    <div className="text-xs text-purple-600/70">Başarı Oranı</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-orange-600">{report.stats.total_xp_gained}</div>
                                    <div className="text-xs text-orange-600/70">XP Kazandı</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Öne Çıkan Noktalar */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Award className="h-4 w-4 text-yellow-600" />
                                Öne Çıkan Noktalar
                            </div>
                            <div className="space-y-2">
                                {report.highlights.map((highlight, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800"
                                    >
                                        <TrendingUp className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{highlight}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Özeti */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Sparkles className="h-4 w-4 text-purple-600" />
                                AI Gelişim Raporu
                            </div>
                            <div className="prose prose-sm dark:prose-invert max-w-none p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200 dark:border-purple-800">
                                <ReactMarkdown>{report.summary}</ReactMarkdown>
                            </div>
                        </div>

                        {/* Yeni Rapor Oluştur Butonu */}
                        <Button
                            onClick={generateReport}
                            variant="outline"
                            className="w-full gap-2"
                            disabled={loading}
                        >
                            <Sparkles className="h-4 w-4" />
                            Raporu Yenile
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
