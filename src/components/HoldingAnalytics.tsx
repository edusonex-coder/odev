import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    LineChart, Line
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { School, TrendingUp, Users, FileQuestion, Award } from "lucide-react";
import AIUsageMonitor from "./AIUsageMonitor";

interface HoldingStats {
    tenant_id: string;
    tenant_name: string;
    total_students: number;
    total_questions: number;
    total_solutions: number;
    avg_student_xp: number;
}

export default function HoldingAnalytics() {
    const [data, setData] = useState<HoldingStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHoldingData();
    }, []);

    const fetchHoldingData = async () => {
        try {
            setLoading(true);
            // Not: Bu view veritabanında oluşturulmuş olmalıdır.
            const { data: stats, error } = await supabase
                .from('holding_performance_summary')
                .select('*');

            if (error) throw error;
            setData(stats || []);
        } catch (err) {
            console.error("Holding analytics error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Analizler hazırlanıyor...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <AIUsageMonitor />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-lg">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-indigo-100 flex items-center gap-2">
                            <School className="w-4 h-4" /> Toplam Kurum
                        </CardDescription>
                        <CardTitle className="text-3xl font-black">{data.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" /> Toplam Öğrenci
                        </CardDescription>
                        <CardTitle className="text-3xl font-bold">
                            {data.reduce((acc, curr) => acc + curr.total_students, 0)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <FileQuestion className="w-4 h-4 text-orange-500" /> Toplam Soru
                        </CardDescription>
                        <CardTitle className="text-3xl font-bold">
                            {data.reduce((acc, curr) => acc + curr.total_questions, 0)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-500" /> Ort. XP / Öğrenci
                        </CardDescription>
                        <CardTitle className="text-3xl font-bold">
                            {Math.round(data.reduce((acc, curr) => acc + curr.avg_student_xp, 0) / (data.length || 1))}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-7">
                <Card className="lg:col-span-4 shadow-md border-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" /> Kurumlar Arası Soru Trafiği
                        </CardTitle>
                        <CardDescription>Hangi okul ne kadar aktif?</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis dataKey="tenant_name" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="total_questions" radius={[6, 6, 0, 0]} name="Soru Sayısı">
                                    {data.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${1 - index * 0.15})`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 shadow-md border-primary/5">
                    <CardHeader>
                        <CardTitle>Kurum Liderlik Tablosu</CardTitle>
                        <CardDescription>Performans sıralaması</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Kurum</TableHead>
                                    <TableHead className="text-right">XP Ort.</TableHead>
                                    <TableHead className="text-right">Çözüm %</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.sort((a, b) => b.avg_student_xp - a.avg_student_xp).map((item) => (
                                    <TableRow key={item.tenant_id}>
                                        <TableCell className="font-bold text-xs">{item.tenant_name}</TableCell>
                                        <TableCell className="text-right font-medium text-xs">{Math.round(item.avg_student_xp)}</TableCell>
                                        <TableCell className="text-right text-xs">
                                            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100">
                                                %{item.total_questions > 0 ? Math.round((item.total_solutions / item.total_questions) * 100) : 100}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
