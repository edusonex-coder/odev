import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Search, FileQuestion, Calendar as CalendarIcon, Filter,
    ArrowUpDown, Download, ExternalLink, Brain
} from "lucide-react";
import { format, subDays, startOfDay, endOfDay, startOfWeek } from "date-fns";
import { tr } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { saveAs } from "file-saver";

interface QuestionWithStats {
    id: string;
    created_at: string;
    subject: string;
    question_text: string | null;
    image_url: string | null;
    status: string;
    student_id: string;
    tenant_id: string;
    student_name: string;
    tenant_name: string;
    total_ai_cost: number;
    total_ai_tokens: number;
}

export default function AdvancedQuestionPool() {
    const { profile } = useAuth();
    const { toast } = useToast();
    const [questions, setQuestions] = useState<QuestionWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSubject, setSelectedSubject] = useState<string>("all");
    const [selectedTenant, setSelectedTenant] = useState<string>("all");
    const [dateRange, setDateRange] = useState<string>("30");
    const [subjects, setSubjects] = useState<string[]>([]);
    const [tenants, setTenants] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        fetchData();
        fetchFilters();
    }, [selectedTenant, selectedSubject, dateRange]);

    const fetchFilters = async () => {
        try {
            // Subjects
            const { data: subData } = await supabase.from('questions').select('subject');
            if (subData) {
                const uniqueSubjects = Array.from(new Set(subData.map(s => s.subject))).filter(Boolean);
                setSubjects(uniqueSubjects);
            }

            // Tenants (if super admin)
            if (profile?.is_super_admin) {
                const { data: tData } = await supabase.from('tenants').select('id, name');
                if (tData) setTenants(tData);
            }
        } catch (err) {
            console.error("Filter fetch error:", err);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            let query = supabase.from('questions_with_costs').select('*').order('created_at', { ascending: false });

            if (selectedSubject !== "all") {
                query = query.eq('subject', selectedSubject);
            }

            if (profile?.is_super_admin) {
                if (selectedTenant !== "all") {
                    query = query.eq('tenant_id', selectedTenant);
                }
            } else {
                if (profile?.tenant_id) {
                    query = query.eq('tenant_id', profile.tenant_id);
                }
            }

            // Date Filtering
            const now = new Date();
            if (dateRange === "today") {
                query = query.gte('created_at', startOfDay(now).toISOString());
            } else if (dateRange === "yesterday") {
                const yesterday = subDays(now, 1);
                query = query.gte('created_at', startOfDay(yesterday).toISOString())
                    .lte('created_at', endOfDay(yesterday).toISOString());
            } else if (dateRange === "week") {
                query = query.gte('created_at', startOfWeek(now, { weekStartsOn: 1 }).toISOString());
            } else if (dateRange === "30") {
                query = query.gte('created_at', subDays(now, 30).toISOString());
            }

            const { data, error } = await query;

            if (error) throw error;
            setQuestions(data || []);
        } catch (err: any) {
            toast({
                title: "Hata",
                description: "Sorular yüklenirken bir sorun oluştu.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        try {
            if (questions.length === 0) {
                toast({ title: "Uyarı", description: "Dışa aktarılacak veri bulunamadı." });
                return;
            }

            const headers = ["ID", "Tarih", "Öğrenci", "Ders", "Soru Özeti", "Durum", "AI Maliyet ($)", "Okul"];
            const csvRows = [headers.join(",")];

            questions.forEach(q => {
                const row = [
                    q.id,
                    format(new Date(q.created_at), 'yyyy-MM-dd HH:mm'),
                    `"${(q.student_name || '').replace(/"/g, '""')}"`,
                    `"${(q.subject || '').replace(/"/g, '""')}"`,
                    `"${(q.question_text || 'Görsel').substring(0, 50).replace(/"/g, '""')}"`,
                    q.status,
                    q.total_ai_cost.toFixed(4),
                    `"${(q.tenant_name || 'Bireysel').replace(/"/g, '""')}"`
                ];
                csvRows.push(row.join(","));
            });

            const csvString = csvRows.join("\n");
            const blob = new Blob(["\ufeff" + csvString], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, `odevgpt_soru_havuzu_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`);

            toast({ title: "Başarılı", description: "Veriler Excel (CSV) olarak indirildi." });
        } catch (err) {
            toast({ title: "Hata", description: "Dosya oluşturulurken bir hata oluştu.", variant: "destructive" });
        }
    };

    const filteredQuestions = questions.filter(q =>
    (q.question_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.subject?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Tamamlandı</Badge>;
            case 'ai_answered': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">AI Yanıtladı</Badge>;
            case 'pending': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Bekliyor</Badge>;
            case 'teacher_review': return <Badge className="bg-purple-100 text-purple-700 border-purple-200">İncelemede</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <Card className="shadow-lg border-indigo-100 overflow-hidden">
            <CardHeader className="bg-slate-50 border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Brain className="w-5 h-5 text-indigo-600" /> Profesyonel Soru Havuzu
                        </CardTitle>
                        <CardDescription>Tüm soruları, maliyetleri ve çözüm statülerini izleyin.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-white"
                            onClick={handleExport}
                        >
                            <Download className="w-4 h-4" /> Excel'e Aktar
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Soru veya öğrenci ara..."
                            className="pl-9 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="bg-white">
                            <div className="flex items-center gap-2">
                                <Filter className="w-3 h-3 text-slate-400" />
                                <SelectValue placeholder="Ders Seçin" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tüm Dersler</SelectItem>
                            {subjects.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    {profile?.is_super_admin && (
                        <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                            <SelectTrigger className="bg-white">
                                <div className="flex items-center gap-2">
                                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                    <SelectValue placeholder="Okul Seçin" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tüm Okullar</SelectItem>
                                {tenants.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}

                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="bg-white">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-3 h-3 text-slate-400" />
                                <SelectValue placeholder="Tarih Aralığı" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Bugün</SelectItem>
                            <SelectItem value="yesterday">Dün</SelectItem>
                            <SelectItem value="week">Bu Hafta</SelectItem>
                            <SelectItem value="30">Son 30 Gün</SelectItem>
                            <SelectItem value="all">Tüm Zamanlar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-[150px]">Tarih</TableHead>
                            <TableHead>Öğrenci</TableHead>
                            <TableHead>Ders</TableHead>
                            <TableHead className="max-w-[300px]">Soru Özeti</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">AI Maliyet</TableHead>
                            {profile?.is_super_admin && <TableHead>Kurum</TableHead>}
                            <TableHead className="text-right">İşlem</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-md ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredQuestions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                                    <FileQuestion className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                    <p>Soru bulunamadı.</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredQuestions.map((q) => (
                                <TableRow key={q.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="text-xs text-slate-500">
                                        {format(new Date(q.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                                    </TableCell>
                                    <TableCell className="font-medium">{q.student_name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize text-[10px] font-semibold">{q.subject}</Badge>
                                    </TableCell>
                                    <TableCell className="max-w-[300px]">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm line-clamp-1">{q.question_text || "Görsel Soru"}</p>
                                            {q.image_url && <Badge variant="secondary" className="w-fit text-[9px] h-4">Görsel Mevcut</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(q.status)}</TableCell>
                                    <TableCell className="text-right font-mono text-[11px] font-bold text-amber-600">
                                        <div className="flex flex-col items-end">
                                            <span>${q.total_ai_cost.toFixed(4)}</span>
                                            <span className="text-[9px] text-slate-400">{q.total_ai_tokens} tok.</span>
                                        </div>
                                    </TableCell>
                                    {profile?.is_super_admin && (
                                        <TableCell className="text-[10px] text-indigo-600 font-semibold">{q.tenant_name}</TableCell>
                                    )}
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-indigo-600" onClick={() => window.open(`/dashboard/question/${q.id}`, '_blank')}>
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
