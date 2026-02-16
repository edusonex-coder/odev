/**
 * PARENT PANEL (VELİ PANELİ)
 * 
 * Velilerin öğrencilerini takip edebildiği dashboard.
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import SEO from '@/components/SEO';
import { WeeklyReportCard } from '@/components/WeeklyReportCard';
import {
    Users,
    Plus,
    Trophy,
    Activity,
    BookOpen,
    TrendingUp,
    Clock,
    UserCircle,
    Loader2,
    ShieldCheck,
    HelpCircle,
    ChevronRight,
    Star,
    Award,
    Sparkles,
    Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface StudentSummary {
    student_id: string;
    student_name: string;
    student_avatar: string;
    xp: number;
    level: number;
    total_questions: number;
    solved_questions: number;
    last_activity: string;
}

interface StudentActivity {
    id: string;
    title: string;
    content: string;
    created_at: string;
    status: string;
    hasSolution: boolean;
}

// Not: Grafik için şu an mock veri kullanılmaktadır. 
// Gelecekte xp_logs tablosundan günlük toplamlar çekilecek.
const mockChartData = [
    { name: 'Pzt', xp: 40 },
    { name: 'Sal', xp: 80 },
    { name: 'Çar', xp: 120 },
    { name: 'Per', xp: 100 },
    { name: 'Cum', xp: 180 },
    { name: 'Cmt', xp: 220 },
    { name: 'Paz', xp: 200 },
];

export default function ParentPanel() {
    const { user } = useAuth();
    const { toast } = useToast();

    const [students, setStudents] = useState<StudentSummary[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [pairingCode, setPairingCode] = useState('');
    const [isPairing, setIsPairing] = useState(false);
    const [studentActivities, setStudentActivities] = useState<StudentActivity[]>([]);
    const [latestAiSummary, setLatestAiSummary] = useState<string | null>(null);

    const selectedStudent = students.find(s => s.student_id === selectedStudentId) || students[0];

    useEffect(() => {
        // user.id varsa öğrencileri çek
        if (user?.id) {
            fetchStudents();
        }
    }, [user?.id]); // Sadece user ID değişirse çalışır

    useEffect(() => {
        // selectedStudentId değişirse verileri çek
        if (selectedStudentId) {
            fetchStudentActivities(selectedStudentId);
            fetchLatestReport(selectedStudentId);
        }
    }, [selectedStudentId]);

    const fetchLatestReport = async (studentId: string) => {
        try {
            const { data, error } = await supabase
                .from('parent_reports')
                .select('ai_summary')
                .eq('student_id', studentId)
                .order('week_start', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            if (data) {
                setLatestAiSummary(data.ai_summary);
            } else {
                setLatestAiSummary(null);
            }
        } catch (err) {
            console.error("Report fetch error:", err);
        }
    };

    const fetchStudentActivities = async (studentId: string) => {
        if (!studentId) return;

        try {
            // Öğrencinin soruları ve çözüm metriklerini çek
            const { data: questionsData, error: questionsError } = await supabase
                .from('questions')
                .select(`
                    id, 
                    question_text, 
                    created_at, 
                    status,
                    solutions(id, solver_type)
                `)
                .eq('student_id', studentId)
                .order('created_at', { ascending: false })
                .limit(5);

            if (questionsError) throw questionsError;

            // Veriyi Activity tab'ı için transform et
            const formattedActivities = (questionsData || []).map((q: any) => ({
                id: q.id,
                title: q.status === 'solved' ? '✅ Çözülen Soru' : '❓ Çözüm Bekliyor',
                content: q.question_text,
                created_at: q.created_at,
                status: q.status,
                hasSolution: (q.solutions || []).length > 0
            }));

            setStudentActivities(formattedActivities);
        } catch (err) {
            console.error("Activity fetch error:", err);
            // Hata sessizce loglanız, kullanıcıya toast gösterilmez
        }
    };

    const fetchStudents = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            // PARAMETRE YOK! Backend auth.uid() kullanıyor.
            const { data, error } = await supabase.rpc('get_parent_students');

            if (error) {
                console.error('❌ get_parent_students RPC Hatası:', {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                });
                // Toast göster ama detaylı bilgi logla
                toast({
                    title: "Veriler yüklenemedi",
                    description: "Veli paneli yüklü değil. Lütfen en son veri tabanı migrasyonunu çalıştırdığından emin olun.",
                    variant: "destructive",
                });
                return;
            }

            setStudents(data || []);
            if (data && data.length > 0 && !selectedStudentId) {
                setSelectedStudentId(data[0].student_id);
            }
        } catch (error: any) {
            console.error('❌ Fetch students error:', {
                name: error.name,
                message: error.message,
                stack: error.stack,
            });
            toast({
                title: "Bağlantı Hatası",
                description: "Sunucuyla bağlantı kurulamadı.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePairing = async () => {
        if (!pairingCode.trim() || !user?.id) return;

        try {
            setIsPairing(true);
            // pair_student_with_parent(p_access_code TEXT) -> JSONB
            const { data, error } = await supabase.rpc('pair_student_with_parent', {
                p_access_code: pairingCode.trim()
            });

            if (error) {
                console.error('❌ pair_student_with_parent RPC Hatası:', {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                });
                toast({
                    title: 'RPC Hatası',
                    description: error.message || 'Öğrenci bağlanırken bir sorun oluştu.',
                    variant: 'destructive',
                });
                return;
            }

            if (data?.success) {
                toast({
                    title: '✅ Bağlantı Başarılı',
                    description: `${data.student_name} artık hesabınıza bağlandı.`,
                });
                setPairingCode('');
                // Listeyi yenile
                fetchStudents();
            } else {
                toast({
                    title: 'Bağlantı Başarısız',
                    description: data?.message || 'Bilinmeyen bir hata oluştu.',
                    variant: 'destructive',
                });
            }
        } catch (error: any) {
            console.error('❌ Pairing error:', error);
            toast({
                title: 'Bağlantı Hatası',
                description: error.message || 'Öğrenci bağlanırken bir sorun oluştu.',
                variant: 'destructive',
            });
        } finally {
            setIsPairing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Veriler hazırlanıyor...</p>
            </div>
        );
    }

    return (
        <div className="container py-8 px-4 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <SEO title="Veli Paneli" />
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black flex items-center gap-3 tracking-tight">
                        <div className="p-2 bg-primary/10 rounded-2xl">
                            <Users className="w-8 h-8 text-primary" />
                        </div>
                        Veli Paneli
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Çocuklarınızın akademik serüvenini buradan yönetin.
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto bg-card p-2 rounded-2xl shadow-sm border">
                    <Input
                        placeholder="Erişim Kodu (Örn: X1Y2Z3)"
                        value={pairingCode}
                        onChange={(e) => setPairingCode(e.target.value)}
                        className="border-none bg-transparent focus-visible:ring-0 w-full md:w-48 placeholder:text-muted-foreground/50"
                        maxLength={8}
                    />
                    <Button
                        onClick={handlePairing}
                        disabled={isPairing || !pairingCode}
                        className="rounded-xl px-6 shadow-lg shadow-primary/20"
                    >
                        {isPairing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                        Ekle
                    </Button>
                </div>
            </div>

            {students.length === 0 ? (
                <Card className="border-dashed border-2 py-20 bg-muted/30 rounded-3xl">
                    <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-bounce" style={{ animationDuration: '3000ms' }}>
                            <UserCircle className="w-12 h-12 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">Henüz bir öğrenci bağlamadınız</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Öğrencinizin profil sayfasındaki <span className="text-primary font-bold">"Veli Erişim Kodu"</span>nu buraya girerek başlayabilirsiniz.
                            </p>
                        </div>
                        <div className="flex items-start gap-4 p-5 bg-white rounded-2xl text-sm text-left max-w-lg shadow-sm border">
                            <ShieldCheck className="w-6 h-6 text-green-500 mt-1 shrink-0" />
                            <div className="space-y-1">
                                <p className="font-bold text-gray-800">Güvenli Veri Paylaşımı</p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Özel erişim kodu sayesinde sadece yetkilendirdiğiniz öğrencinin akademik verilerini görebilirsiniz.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Student List Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Öğrencilerim
                            </h2>
                            <Badge variant="secondary" className="rounded-full px-3">{students.length}</Badge>
                        </div>
                        <div className="space-y-3">
                            {students.map((student) => (
                                <div
                                    key={student.student_id}
                                    onClick={() => setSelectedStudentId(student.student_id)}
                                    className={`
                                        group relative p-4 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden
                                        ${selectedStudentId === student.student_id
                                            ? 'border-primary bg-primary/5 shadow-md'
                                            : 'border-transparent bg-card hover:border-gray-200 shadow-sm'}
                                    `}
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`
                                            p-1 rounded-full border-2 transition-transform duration-300
                                            ${selectedStudentId === student.student_id ? 'border-primary scale-110' : 'border-gray-100'}
                                        `}>
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                                {student.student_avatar ? (
                                                    <img src={student.student_avatar} alt={student.student_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserCircle className="w-8 h-8 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{student.student_name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-[10px] h-5 bg-white">Lvl {student.level}</Badge>
                                                <span className="text-[10px] text-muted-foreground font-medium">{student.xp} XP</span>
                                            </div>
                                        </div>
                                        {selectedStudentId === student.student_id && (
                                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                <ChevronRight className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    {selectedStudentId === student.student_id && (
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <Star className="w-12 h-12 text-primary" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Quick Insight Card */}
                        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-xl rounded-3xl overflow-hidden relative">
                            <CardContent className="p-6 space-y-4">
                                <div className="p-2 bg-white/20 rounded-xl w-fit">
                                    <Award className="w-6 h-6 text-yellow-300" />
                                </div>
                                <h4 className="text-xl font-bold leading-tight">Yapay Zeka <br />Analizi</h4>
                                <p className="text-indigo-100 text-sm leading-relaxed line-clamp-3">
                                    {latestAiSummary || `${selectedStudent?.student_name} için bu haftalık henüz bir analiz oluşturulmadı.`}
                                </p>
                                <Button
                                    variant="secondary"
                                    className="w-full bg-white text-indigo-600 hover:bg-gray-100 font-bold rounded-xl mt-2"
                                    onClick={() => {
                                        const el = document.getElementById('weekly-report-card');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    Raporu Oku
                                </Button>
                            </CardContent>
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                        </Card>
                    </div>

                    {/* Performance Details Main Area */}
                    <div className="lg:col-span-8 space-y-6">
                        {selectedStudent && (
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1.5 rounded-2xl h-14">
                                    <TabsTrigger value="overview" className="rounded-xl font-bold text-xs uppercase tracking-wider">Genel Bakış</TabsTrigger>
                                    <TabsTrigger value="activity" className="rounded-xl font-bold text-xs uppercase tracking-wider">Aktivite</TabsTrigger>
                                    <TabsTrigger value="homework" className="rounded-xl font-bold text-xs uppercase tracking-wider">Ödevler</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="mt-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <Card className="rounded-2xl border-none bg-orange-50/50 shadow-sm hover:shadow-md transition-all">
                                            <CardHeader className="p-5 pb-2">
                                                <CardDescription className="text-orange-600 font-bold text-[10px] uppercase tracking-widest">Toplam Soru</CardDescription>
                                                <CardTitle className="text-3xl font-black text-orange-950">{selectedStudent.total_questions}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-5 pt-0">
                                                <div className="flex items-center text-xs text-orange-700/60 font-medium">
                                                    <HelpCircle className="w-3 h-3 mr-1" />
                                                    Soru Geçmişi
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="rounded-2xl border-none bg-emerald-50/50 shadow-sm hover:shadow-md transition-all">
                                            <CardHeader className="p-5 pb-2">
                                                <CardDescription className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest">Çözülen Soru</CardDescription>
                                                <CardTitle className="text-3xl font-black text-emerald-950">{selectedStudent.solved_questions}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-5 pt-0">
                                                <div className="flex items-center text-xs text-emerald-700 font-bold">
                                                    <ShieldCheck className="w-3 h-3 mr-1" />
                                                    %{((selectedStudent.solved_questions / (selectedStudent.total_questions || 1)) * 100).toFixed(0)} Başarı
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="col-span-2 md:col-span-1 rounded-2xl border-none bg-blue-50/50 shadow-sm hover:shadow-md transition-all">
                                            <CardHeader className="p-5 pb-2">
                                                <CardDescription className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">Son Aktivite</CardDescription>
                                                <CardTitle className="text-xl font-black text-blue-950 truncate">
                                                    {selectedStudent.last_activity
                                                        ? format(new Date(selectedStudent.last_activity), 'd MMM', { locale: tr })
                                                        : 'Aktivite yok'}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-5 pt-0">
                                                <div className="flex items-center text-xs text-blue-700/60 font-medium">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {selectedStudent.last_activity
                                                        ? format(new Date(selectedStudent.last_activity), 'HH:mm')
                                                        : '-'}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* XP Growth Chart */}
                                    <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                                        <TrendingUp className="w-5 h-5 text-primary" />
                                                        Haftalık XP Kazanımı
                                                    </CardTitle>
                                                    <CardDescription>Öğrencinin son 7 gündeki öğrenme hızı</CardDescription>
                                                </div>
                                                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">Aktif</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <div className="h-[280px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={mockChartData}>
                                                        <defs>
                                                            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                        <XAxis
                                                            dataKey="name"
                                                            stroke="#94a3b8"
                                                            fontSize={12}
                                                            tickLine={false}
                                                            axisLine={false}
                                                            tickMargin={10}
                                                        />
                                                        <YAxis hide />
                                                        <Tooltip
                                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                                                            cursor={{ stroke: '#8b5cf6', strokeWidth: 2 }}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="xp"
                                                            stroke="#8b5cf6"
                                                            strokeWidth={4}
                                                            fillOpacity={1}
                                                            fill="url(#colorXp)"
                                                            animationDuration={2000}
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Haftalık AI Raporu */}
                                    <div id="weekly-report-card">
                                        <WeeklyReportCard
                                            studentId={selectedStudent.student_id}
                                            studentName={selectedStudent.student_name}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="activity">
                                    <Card className="rounded-3xl border-none shadow-sm">
                                        <CardHeader>
                                            <CardTitle className="font-bold flex items-center gap-2">
                                                <Activity className="w-5 h-5 text-primary" />
                                                Son Sorular ve Yanıtlar
                                            </CardTitle>
                                            <CardDescription>Yapay zeka ile olan etkileşimler</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <ScrollArea className="h-[400px]">
                                                {studentActivities.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                                            <Clock className="w-8 h-8 text-muted-foreground/30" />
                                                        </div>
                                                        <p className="text-muted-foreground italic text-sm max-w-xs px-6">
                                                            Henüz bu öğrenci için bir aktivite kaydı yok.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="divide-y">
                                                        {studentActivities.map((activity, idx) => (
                                                            <div key={activity.id} className="p-4 hover:bg-muted/30 transition-colors flex gap-4 items-start relative group">
                                                                <div className={`
                                                                    w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                                                                    ${activity.status === 'solved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}
                                                                `}>
                                                                    {activity.status === 'solved' ? <Award className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
                                                                </div>
                                                                <div className="flex-1 space-y-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <p className="text-sm font-bold text-gray-900">{activity.title}</p>
                                                                        <span className="text-[10px] text-muted-foreground">
                                                                            {format(new Date(activity.created_at), 'd MMM HH:mm', { locale: tr })}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                                                        {activity.content}
                                                                    </p>
                                                                </div>
                                                                {idx === 0 && (
                                                                    <div className="absolute top-2 right-2">
                                                                        <Badge variant="outline" className="text-[8px] bg-blue-50 text-blue-700 border-blue-100">EN YENİ</Badge>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </ScrollArea>
                                            <div className="p-4 bg-muted/20 border-t text-center">
                                                <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                                                    <Zap className="w-3 h-3 text-yellow-500" />
                                                    Tüm veriler yapay zeka tarafından gerçek zamanlı analiz edilmektedir.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="homework">
                                    <Card className="rounded-3xl border-none shadow-sm px-2">
                                        <CardHeader>
                                            <CardTitle className="font-bold">Ödev Takip Sistemi</CardTitle>
                                            <CardDescription>Öğretmenler tarafından atanan aktif ödevler</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {[1, 2].map(i => (
                                                    <div key={i} className="p-4 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-between opacity-60">
                                                        <div className="space-y-1">
                                                            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse"></div>
                                                            <div className="h-3 w-24 bg-gray-50 rounded animate-pulse"></div>
                                                        </div>
                                                        <div className="h-8 w-20 bg-gray-100 rounded-full animate-pulse"></div>
                                                    </div>
                                                ))}
                                                <p className="text-center text-xs text-muted-foreground mt-4 italic">
                                                    Öğretmen paneli ile entegrasyon devam ediyor.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
