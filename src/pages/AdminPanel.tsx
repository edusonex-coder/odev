import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
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
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Users, FileQuestion, CheckCircle, ShieldAlert, GraduationCap, School, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, subDays, format } from "date-fns";
import { tr } from "date-fns/locale";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart as RePieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminBlogManager from "@/components/AdminBlogManager";
import { BookOpenText } from "lucide-react";

interface UserProfile {
    id: string;
    full_name: string;
    role: 'student' | 'teacher' | 'admin';
    created_at: string;
    avatar_url: string | null;
}

interface Stats {
    totalUsers: number;
    totalQuestions: number;
    totalSolutions: number;
    pendingQuestions: number;
    students: number;
    teachers: number;
    admins: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export default function AdminPanel() {
    const { user, profile } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalQuestions: 0,
        totalSolutions: 0,
        pendingQuestions: 0,
        students: 0,
        teachers: 0,
        admins: 0,
    });
    const [weeklyData, setWeeklyData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // 1. Genel İstatistikler
            const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: questionCount } = await supabase.from('questions').select('*', { count: 'exact', head: true });
            const { count: solutionCount } = await supabase.from('solutions').select('*', { count: 'exact', head: true });
            const { count: pendingCount } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('status', 'pending');

            // Rol dağılımı (Pie Chart için)
            const { count: studentCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');
            const { count: teacherCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher');
            const { count: adminCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin');

            setStats({
                totalUsers: userCount || 0,
                totalQuestions: questionCount || 0,
                totalSolutions: solutionCount || 0,
                pendingQuestions: pendingCount || 0,
                students: studentCount || 0,
                teachers: teacherCount || 0,
                admins: adminCount || 0,
            });

            // 2. Kullanıcıları Çek
            const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10); // Sadece son 10 kullanıcıyı göster (performans için)

            if (userError) throw userError;
            setUsers(userData as UserProfile[]);

            // 3. Haftalık Veri (Mock Data - Gerçek veritabanı sorgusu karmaşık olabilir)
            // Supabase'de group by time için RPC gerekir. Şimdilik mock data kullanalım.
            const mockWeeklyData = Array.from({ length: 7 }).map((_, i) => {
                const date = subDays(new Date(), 6 - i);
                return {
                    name: format(date, 'dd MMM', { locale: tr }),
                    soru: Math.floor(Math.random() * 20) + 5, // 5-25 arası rastgele
                    cozum: Math.floor(Math.random() * 15) + 2, // 2-17 arası rastgele
                };
            });
            setWeeklyData(mockWeeklyData);

        } catch (error: any) {
            console.error("Admin data fetch error:", error);
            toast({
                title: "Hata",
                description: "Veriler yüklenirken bir sorun oluştu.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId: string, newRole: 'student' | 'teacher' | 'admin') => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            toast({
                title: "Rol Güncellendi",
                description: `Kullanıcı rolü ${newRole} olarak değiştirildi.`,
            });

            // Listeyi güncelle
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            fetchData(); // İstatistikleri de güncelle

        } catch (error: any) {
            toast({
                title: "Hata",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (profile?.role !== 'admin') {
        return (
            <div className="flex flex-col h-[50vh] items-center justify-center text-center p-4">
                <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold mb-2">Erişim Engellendi</h1>
                <p className="text-muted-foreground">Bu sayfayı görüntülemek için yönetici yetkisine sahip olmalısınız.</p>
            </div>
        )
    }

    const pieData = [
        { name: 'Öğrenci', value: stats.students },
        { name: 'Öğretmen', value: stats.teachers },
        { name: 'Yönetici', value: stats.admins },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Yönetici Paneli
                    </h1>
                    <p className="text-muted-foreground">Sistemin genel durumu ve performans metrikleri.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={fetchData} variant="outline" size="sm" className="gap-2">
                        <TrendingUp className="w-4 h-4" /> Verileri Yenile
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="dashboard" className="space-y-6">
                <TabsList className="bg-white border p-1 rounded-xl h-12">
                    <TabsTrigger value="dashboard" className="rounded-lg gap-2">
                        <BarChart3 className="w-4 h-4" /> İstatistikler
                    </TabsTrigger>
                    <TabsTrigger value="blogs" className="rounded-lg gap-2">
                        <BookOpenText className="w-4 h-4" /> Blog Yönetimi
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-8">
                    {/* İstatistik Kartları */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-blue-900">Toplam Kullanıcı</CardTitle>
                                <Users className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-700">{stats.totalUsers}</div>
                                <p className="text-xs text-blue-600/80">Sisteme kayıtlı herkes</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-purple-900">Toplam Soru</CardTitle>
                                <FileQuestion className="h-4 w-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-700">{stats.totalQuestions}</div>
                                <p className="text-xs text-purple-600/80">Sorulan tüm sorular</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-green-900">Çözülen Soru</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-700">{stats.totalSolutions}</div>
                                <p className="text-xs text-green-600/80">Başarıyla yanıtlananlar</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-orange-900">Bekleyen Sorular</CardTitle>
                                <Loader2 className="h-4 w-4 text-orange-600 animate-spin-slow" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-700">{stats.pendingQuestions}</div>
                                <p className="text-xs text-orange-600/80">Acil çözüm bekleyenler</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Grafikler */}
                    <div className="grid gap-4 md:grid-cols-7">
                        <Card className="col-span-4 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-primary" /> Haftalık Aktivite
                                </CardTitle>
                                <CardDescription>Son 7 gün içindeki soru ve çözüm trafiği</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={weeklyData}>
                                        <defs>
                                            <linearGradient id="colorSoru" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorCozum" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                        />
                                        <Area type="monotone" dataKey="soru" stroke="#8884d8" fillOpacity={1} fill="url(#colorSoru)" name="Soru Sayısı" />
                                        <Area type="monotone" dataKey="cozum" stroke="#82ca9d" fillOpacity={1} fill="url(#colorCozum)" name="Çözüm Sayısı" />
                                        <Legend iconType="circle" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="w-5 h-5 text-primary" /> Kullanıcı Dağılımı
                                </CardTitle>
                                <CardDescription>Sistemdeki rollerin oranı</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RePieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            label
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kullanıcı Listesi */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" /> Son Kayıt Olan Kullanıcılar
                            </CardTitle>
                            <CardDescription>Sisteme en son katılan 10 kullanıcı.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="w-[80px]">Avatar</TableHead>
                                            <TableHead>Ad Soyad</TableHead>
                                            <TableHead>Kayıt Tarihi</TableHead>
                                            <TableHead>Rol</TableHead>
                                            <TableHead className="text-right">İşlemler</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id} className="hover:bg-muted/5 transition-colors">
                                                <TableCell>
                                                    <Avatar className="h-9 w-9 border">
                                                        <AvatarImage src={user.avatar_url || ""} />
                                                        <AvatarFallback className="bg-primary/5 text-primary font-bold text-xs">
                                                            {user.full_name?.substring(0, 2).toUpperCase() || "??"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold">{user.full_name || "İsimsiz"}</span>
                                                        <span className="text-xs text-muted-foreground">{user.id.substring(0, 8)}...</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-normal text-muted-foreground">
                                                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: tr })}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {user.role === 'admin' ? (
                                                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Yönetici</Badge>
                                                    ) : user.role === 'teacher' ? (
                                                        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">Öğretmen</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="bg-slate-100 text-slate-700">Öğrenci</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {user.role !== 'admin' && (
                                                            <Button size="sm" className="h-7 px-2 text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-200" variant="outline" onClick={() => updateUserRole(user.id, 'admin')}>
                                                                <ShieldAlert className="w-3 h-3 mr-1" /> Admin
                                                            </Button>
                                                        )}
                                                        {user.role !== 'teacher' && (
                                                            <Button size="sm" className="h-7 px-2 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200" variant="outline" onClick={() => updateUserRole(user.id, 'teacher')}>
                                                                <School className="w-3 h-3 mr-1" /> Öğretmen
                                                            </Button>
                                                        )}
                                                        {user.role !== 'student' && (
                                                            <Button size="sm" className="h-7 px-2 text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200" variant="outline" onClick={() => updateUserRole(user.id, 'student')}>
                                                                <GraduationCap className="w-3 h-3 mr-1" /> Öğrenci
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="blogs">
                    <AdminBlogManager />
                </TabsContent>
            </Tabs>
        </div>
    );
}
