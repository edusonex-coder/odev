import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
    TrendingUp, Award, Users, Brain, School,
    ArrowUpRight, ArrowDownRight, Zap, Target
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function CorporateAnalytics({ tenantId }: { tenantId?: string }) {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [subjectData, setSubjectData] = useState<any[]>([]);
    const [trafficData, setTrafficData] = useState<any[]>([]);
    const [costData, setCostData] = useState<any[]>([]);
    const [summary, setSummary] = useState({
        totalQuestions: 0,
        activeStudents: 0,
        avgCost: 0,
        conversionRate: 0
    });

    useEffect(() => {
        fetchAnalytics();
    }, [tenantId]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const targetTenant = tenantId || profile?.tenant_id;

            // 1. Subject Popularity
            let subQuery = supabase.from('subject_popularity_report').select('*');
            if (targetTenant && targetTenant !== 'all') {
                subQuery = subQuery.eq('tenant_id', targetTenant);
            }
            const { data: sData } = await subQuery;
            setSubjectData(sData || []);

            // 2. Traffic Trend
            let trafficQuery = supabase.from('daily_tenant_traffic').select('*').order('day', { ascending: true });
            if (targetTenant && targetTenant !== 'all') {
                trafficQuery = trafficQuery.eq('tenant_id', targetTenant);
            }
            const { data: tData } = await trafficQuery;

            const formattedTraffic = tData?.map(d => ({
                name: format(new Date(d.day), 'dd MMM', { locale: tr }),
                questions: d.question_count
            })) || [];
            setTrafficData(formattedTraffic);

            // 3. Costs
            let costQuery = supabase.from('tenant_cost_ledger').select('*');
            if (targetTenant && targetTenant !== 'all') {
                costQuery = costQuery.eq('tenant_id', targetTenant);
            }
            const { data: cData } = await costQuery;
            setCostData(cData || []);

            // 4. Real Summary Stats
            let summaryQuery = supabase.from('corporate_analytics_summary').select('*');
            if (targetTenant && targetTenant !== 'all') {
                summaryQuery = summaryQuery.eq('tenant_id', targetTenant);
            }
            const { data: sumData } = await summaryQuery;

            if (sumData && sumData.length > 0) {
                // If 'all' is selected, sum up all tenants
                const totals = sumData.reduce((acc, curr) => ({
                    active_students: acc.active_students + (curr.active_students || 0),
                    total_questions: acc.total_questions + (curr.total_questions || 0),
                    resolved_questions: acc.resolved_questions + (curr.resolved_questions || 0),
                    total_ai_cost: acc.total_ai_cost + (curr.total_ai_cost || 0)
                }), { active_students: 0, total_questions: 0, resolved_questions: 0, total_ai_cost: 0 });

                setSummary({
                    totalQuestions: totals.total_questions,
                    activeStudents: totals.active_students,
                    avgCost: totals.total_questions > 0 ? (totals.total_ai_cost / totals.total_questions) : 0,
                    conversionRate: totals.total_questions > 0 ? Math.round((totals.resolved_questions / totals.total_questions) * 100) : 100
                });
            }

        } catch (err) {
            console.error("Analytics fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader><Skeleton className="h-4 w-24" /></CardHeader>
                        <CardContent><Skeleton className="h-8 w-16" /></CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm overflow-hidden relative">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-indigo-600 font-semibold flex items-center gap-1">
                            <School className="w-3 h-3" /> Toplam Soru
                        </CardDescription>
                        <CardTitle className="text-3xl font-bold">{summary.totalQuestions}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-xs text-muted-foreground font-medium">
                            Toplam Etkinlik
                        </div>
                    </CardContent>
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Target className="w-16 h-16 text-indigo-600" />
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm overflow-hidden relative">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-emerald-600 font-semibold flex items-center gap-1">
                            <Users className="w-3 h-3" /> Aktif Öğrenciler
                        </CardDescription>
                        <CardTitle className="text-3xl font-bold">{summary.activeStudents}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-xs text-muted-foreground font-medium">
                            Toplam Öğrenci
                        </div>
                    </CardContent>
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Users className="w-16 h-16 text-emerald-600" />
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100 shadow-sm overflow-hidden relative">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-amber-600 font-semibold flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Avg. AI Cost
                        </CardDescription>
                        <CardTitle className="text-3xl font-bold">${summary.avgCost.toFixed(2)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-xs text-muted-foreground font-medium">
                            Soru Başı Ortalama
                        </div>
                    </CardContent>
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Zap className="w-16 h-16 text-amber-600" />
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 shadow-sm overflow-hidden relative">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-purple-600 font-semibold flex items-center gap-1">
                            <Award className="w-3 h-3" /> Başarı Oranı
                        </CardDescription>
                        <CardTitle className="text-3xl font-bold">%{summary.conversionRate}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-xs text-muted-foreground font-medium">
                            Sistemsel Başarı Skoru
                        </div>
                    </CardContent>
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Award className="w-16 h-16 text-purple-600" />
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic Chart */}
                <Card className="lg:col-span-2 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-500" /> Soru Trafiği (Zaman İçinde)
                        </CardTitle>
                        <CardDescription>Gün bazlı soru sayılarındaki değişim trendi.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="questions" name="Soru Sayısı" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Subject Distribution */}
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-purple-500" /> Derslere Göre Dağılım
                        </CardTitle>
                        <CardDescription>En çok soru sorulan branşlar.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={subjectData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="question_count"
                                    nameKey="subject"
                                >
                                    {subjectData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Comparative Analysis (Only for Holding Admin/Multi-tenant select) */}
                {(!tenantId || tenantId === 'all') && profile?.is_super_admin && (
                    <Card className="lg:col-span-3 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-emerald-600">
                                <School className="w-5 h-5" /> Kurumlar Arası Karşılaştırma (AI Maliyet & Trafik)
                            </CardTitle>
                            <CardDescription>Okulların verimlilik ve kullanım analizi.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={costData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="tenant_name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis yAxisId="left" orientation="left" stroke="#6366f1" axisLine={false} tickLine={false} label={{ value: 'Maliyet ($)', angle: -90, position: 'insideLeft', style: { fill: '#6366f1' } }} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" axisLine={false} tickLine={false} label={{ value: 'İstek Sayısı', angle: 90, position: 'insideRight', style: { fill: '#10b981' } }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="total_cost_usd" name="AI Maliyeti ($)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    <Bar yAxisId="right" dataKey="total_ai_requests" name="Toplam İstek" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
