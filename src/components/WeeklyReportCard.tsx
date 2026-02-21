/**
 * WEEKLY REPORT CARD
 * Veli için haftalık AI destekli öğrenci raporu kartı
 */

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { generateWeeklyParentReport, generateReportHighlights } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Sparkles,
    TrendingUp,
    Award,
    Calendar,
    Loader2,
    Star,
    Target,
    Flame,
    Zap
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
    const { user } = useAuth();
    const { toast } = useToast();
    const [fetchedOnMount, setFetchedOnMount] = useState(false);

    // Mevcut raporu çek
    const fetchExistingReport = useCallback(async () => {
        if (!studentId || fetchedOnMount) return;

        try {
            const now = new Date();
            const weekStart = startOfWeek(now, { weekStartsOn: 1 });

            const { data, error } = await supabase
                .from('parent_reports')
                .select('*')
                .eq('student_id', studentId)
                .eq('week_start', format(weekStart, 'yyyy-MM-dd'))
                .maybeSingle();

            if (error) throw error;

            if (data) {
                setReport({
                    summary: data.ai_summary,
                    highlights: data.ai_highlights || [],
                    stats: {
                        total_questions: data.total_questions,
                        solved_questions: data.solved_questions,
                        success_rate: data.success_rate,
                        total_xp_gained: data.total_xp_gained,
                        level_ups: data.level_ups
                    },
                    weekStart: new Date(data.week_start),
                    weekEnd: new Date(data.week_end)
                });
            }
        } catch (error) {
            console.error('Mevcut rapor yüklenemedi:', error);
        } finally {
            setFetchedOnMount(true);
        }
    }, [studentId, fetchedOnMount]);

    useEffect(() => {
        fetchExistingReport();
    }, [fetchExistingReport]);

    useEffect(() => {
        setFetchedOnMount(false);
        setReport(null);
    }, [studentId]);

    const generateReport = async () => {
        setLoading(true);
        try {
            const now = new Date();
            const weekStart = startOfWeek(now, { weekStartsOn: 1 });
            const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

            // Haftalık istatistikleri getir
            const { data: statsData, error: statsError } = await supabase
                .rpc('get_student_weekly_stats', {
                    p_student_id: studentId,
                    p_week_start: format(weekStart, 'yyyy-MM-dd'),
                    p_week_end: format(weekEnd, 'yyyy-MM-dd')
                });

            if (statsError) throw statsError;
            const stats = statsData as WeeklyStats;

            if (!stats || stats.total_questions === 0) {
                toast({
                    title: "Henüz Aktivite Yok",
                    description: `${studentName} bu hafta henüz soru sormamış.`,
                });
                setLoading(false);
                return;
            }

            const [aiSummary, aiHighlights] = await Promise.all([
                generateWeeklyParentReport(studentName, stats),
                generateReportHighlights(studentName, stats)
            ]);

            await supabase
                .from('parent_reports')
                .insert({
                    parent_id: user?.id,
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

            setReport({
                summary: aiSummary,
                highlights: aiHighlights,
                stats,
                weekStart,
                weekEnd
            });

            toast({
                title: "Rapor Hazır! 🎉",
                description: "AI gelişim raporu başarıyla oluşturuldu.",
            });
        } catch (error: any) {
            console.error('Rapor hatası:', error);
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
        <Card className="border-none shadow-xl overflow-hidden rounded-3xl bg-white relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

            <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="bg-purple-100 p-2 rounded-xl">
                                <FileText className="h-5 w-5 text-purple-600" />
                            </div>
                            <CardTitle className="text-2xl font-black tracking-tight">Gelişim Raporu</CardTitle>
                        </div>
                        <CardDescription className="text-sm font-medium">
                            {studentName} için bu haftanın AI performans karnesi
                        </CardDescription>
                    </div>
                    {report && (
                        <Badge variant="secondary" className="px-3 py-1 rounded-full font-bold bg-slate-100 border-none">
                            <Calendar className="h-3 w-3 mr-2 text-slate-500" />
                            {format(report.weekStart, 'd MMMM', { locale: tr })}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-6 relative">
                {!report && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16 px-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200"
                    >
                        <div className="relative inline-block mb-6">
                            <Sparkles className="h-16 w-16 text-purple-400 mx-auto" />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -top-2 -right-2 bg-yellow-400 w-4 h-4 rounded-full blur-[2px]"
                            />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-2">Haftalık Karne Henüz Hazır Değil</h3>
                        <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
                            Yapay zekanın çocuğunuzun gelişimini analiz edip size özel bir özet sunması için butona basın.
                        </p>
                        <Button
                            onClick={generateReport}
                            className="gap-2 h-14 px-8 rounded-2xl bg-purple-600 hover:bg-purple-700 shadow-glow text-lg font-extrabold transition-all hover:scale-105 active:scale-95"
                        >
                            <Sparkles className="h-5 w-5" />
                            AI ANALİZİNİ BAŞLAT
                        </Button>
                    </motion.div>
                )}

                {loading && (
                    <div className="space-y-6 pt-4">
                        <div className="flex flex-col items-center justify-center gap-4 py-12 bg-slate-50 rounded-3xl border border-dashed animate-pulse">
                            <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />
                            <div className="space-y-1 text-center">
                                <p className="text-lg font-black text-purple-600">AI Analiz Yapıyor...</p>
                                <p className="text-xs text-muted-foreground">Sokratik geçmiş ve başarı verileri işleniyor.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-24 w-full rounded-2xl" />
                            <Skeleton className="h-24 w-full rounded-2xl" />
                        </div>
                        <Skeleton className="h-40 w-full rounded-2xl" />
                    </div>
                )}

                {report && !loading && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        {/* Highlights Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Soru', value: report.stats.total_questions, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { label: 'Başarı', value: `%${Math.round(report.stats.success_rate)}`, icon: Star, color: 'text-green-600', bg: 'bg-green-50' },
                                { label: 'XP', value: `+${report.stats.total_xp_gained}`, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' },
                                { label: 'Seri', value: `🔥 7`, icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`${stat.bg} p-4 rounded-2xl border border-white/50 shadow-sm transition-all hover:shadow-md group`}
                                >
                                    <div className={`${stat.color} mb-2`}>
                                        <stat.icon className="h-5 w-5 transform transition-transform group-hover:scale-125 group-hover:rotate-12" />
                                    </div>
                                    <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Summary & Highlights Container */}
                        <div className="grid lg:grid-cols-5 gap-6">
                            {/* AI Summary Section */}
                            <div className="lg:col-span-3 space-y-4">
                                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-slate-700">
                                    <Sparkles className="h-4 w-4 text-purple-600" />
                                    AI GELİŞİM ÖZETİ
                                </div>
                                <div className="prose prose-slate prose-sm max-w-none p-6 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner relative group min-h-[220px]">
                                    <ReactMarkdown>{report.summary}</ReactMarkdown>
                                    <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-30 transition-opacity">
                                        <Sparkles className="h-12 w-12" />
                                    </div>
                                </div>
                            </div>

                            {/* Achievements / Points Section */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-slate-700">
                                    <Award className="h-4 w-4 text-yellow-600" />
                                    BU HAFTANIN ENLERİ
                                </div>
                                <div className="space-y-3">
                                    {report.highlights.map((highlight, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + (index * 0.1) }}
                                            className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:bg-yellow-50/50 hover:border-yellow-200"
                                        >
                                            <div className="bg-yellow-100 p-2 rounded-xl mt-0.5">
                                                <Star className="h-4 w-4 text-yellow-600" />
                                            </div>
                                            <p className="text-sm font-medium leading-relaxed text-slate-700">{highlight}</p>
                                        </motion.div>
                                    ))}
                                    {report.highlights.length === 0 && (
                                        <div className="text-center py-12 text-slate-400 text-xs italic bg-slate-50 rounded-2xl border-dashed border">
                                            Henüz özel bir başarı kaydedilemedi.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Refresh Button */}
                        <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                VERİLER DOĞRULANDI VE GÜNCEL
                            </div>
                            <Button
                                onClick={generateReport}
                                variant="ghost"
                                className="gap-2 h-10 px-6 rounded-xl hover:bg-slate-100 text-slate-600 font-bold"
                                disabled={loading}
                            >
                                <Sparkles className="h-4 w-4" />
                                RAPORU YENİLE
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
