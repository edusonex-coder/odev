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
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Loader2, Users, FileQuestion, CheckCircle, ShieldAlert, GraduationCap, School,
    TrendingUp, BarChart3, PieChart, Baby, Search, Settings, Save, Server, Lock, Activity, Power
} from "lucide-react";
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
    PieChart as RePieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminBlogManager from "@/components/AdminBlogManager";
import AnnouncementManager from "@/components/AnnouncementManager";
import HoldingAnalytics from "@/components/HoldingAnalytics";
import TenantManager from "@/components/TenantManager";
import AILedger from "@/components/AILedger";
import AdvancedQuestionPool from "@/components/AdvancedQuestionPool";
import CorporateAnalytics from "@/components/CorporateAnalytics";
import { BookOpenText, Megaphone, LayoutDashboard, Building2, Coins, SearchCode } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserProfile {
    id: string;
    full_name: string;
    role: 'student' | 'teacher' | 'admin' | 'parent';
    is_super_admin: boolean;
    created_at: string;
    avatar_url: string | null;
    tenant_id: string | null;
    tenants?: { name: string };
}

interface Tenant {
    id: string;
    name: string;
}

interface Stats {
    totalUsers: number;
    totalQuestions: number;
    totalSolutions: number;
    pendingQuestions: number;
    students: number;
    teachers: number;
    admins: number;
    parents: number;
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
        parents: 0,
    });
    const [weeklyData, setWeeklyData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [selectedTenantId, setSelectedTenantId] = useState<string>("all");
    const { toast } = useToast();

    // System Settings State
    const [systemSettings, setSystemSettings] = useState({
        maintenanceMode: false,
        allowSignups: true,
        aiModel: "gpt-4o",
        dailyQuestionLimit: 10,
        teacherApprovalRequired: false
    });

    useEffect(() => {
        if (profile?.is_super_admin) {
            fetchTenants();
        } else if (profile?.tenant_id) {
            setSelectedTenantId(profile.tenant_id);
        }
    }, [profile]);

    useEffect(() => {
        fetchData();
        // Load settings from local storage if available for persistence demo
        const savedSettings = localStorage.getItem('admin_system_settings');
        if (savedSettings) {
            setSystemSettings(JSON.parse(savedSettings));
        }
    }, [selectedTenantId]);

    const fetchTenants = async () => {
        try {
            const { data, error } = await supabase.from('tenants').select('id, name');
            if (error) throw error;
            setTenants(data || []);
        } catch (err) {
            console.error("Tenants fetch error:", err);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const isAll = selectedTenantId === "all";
            const isIndividual = selectedTenantId === "individual";

            // 1. Genel İstatistikler
            let userQuery = supabase.from('profiles').select('*', { count: 'exact', head: true });
            let questionQuery = supabase.from('questions').select('*', { count: 'exact', head: true });
            let solutionQuery = supabase.from('solutions').select('*', { count: 'exact', head: true });
            let pendingQuery = supabase.from('questions').select('*', { count: 'exact', head: true }).eq('status', 'pending');

            if (isIndividual) {
                userQuery = userQuery.is('tenant_id', null);
                questionQuery = questionQuery.is('tenant_id', null);
                solutionQuery = solutionQuery.is('tenant_id', null);
                pendingQuery = pendingQuery.is('tenant_id', null);
            } else if (!isAll) {
                userQuery = userQuery.eq('tenant_id', selectedTenantId);
                questionQuery = questionQuery.eq('tenant_id', selectedTenantId);
                solutionQuery = solutionQuery.eq('tenant_id', selectedTenantId);
                pendingQuery = pendingQuery.eq('tenant_id', selectedTenantId);
            }

            const { count: userCount } = await userQuery;
            const { count: questionCount } = await questionQuery;
            const { count: solutionCount } = await solutionQuery;
            const { count: pendingCount } = await pendingQuery;

            // Rol dağılımı
            const getRoleCount = async (role: string) => {
                let q = supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', role);
                if (isIndividual) q = q.is('tenant_id', null);
                else if (!isAll) q = q.eq('tenant_id', selectedTenantId);
                const { count } = await q;
                return count || 0;
            };

            const studentCount = await getRoleCount('student');
            const teacherCount = await getRoleCount('teacher');
            const adminCount = await getRoleCount('admin');
            const parentCount = await getRoleCount('parent');

            setStats({
                totalUsers: userCount || 0,
                totalQuestions: questionCount || 0,
                totalSolutions: solutionCount || 0,
                pendingQuestions: pendingCount || 0,
                students: studentCount || 0,
                teachers: teacherCount || 0,
                admins: adminCount || 0,
                parents: parentCount || 0,
            });

            // 2. Kullanıcıları Çek
            let profilesQuery = supabase
                .from('profiles')
                .select('*, tenants(name)')
                .order('created_at', { ascending: false })
                .limit(50);

            if (isIndividual) {
                profilesQuery = profilesQuery.is('tenant_id', null);
            } else if (!isAll) {
                profilesQuery = profilesQuery.eq('tenant_id', selectedTenantId);
            }

            const { data: userData, error: userError } = await profilesQuery;

            if (userError) throw userError;
            setUsers(userData as UserProfile[]);

            // 3. Haftalık Veri (Mock Data)
            const mockWeeklyData = Array.from({ length: 7 }).map((_, i) => {
                const date = subDays(new Date(), 6 - i);
                return {
                    name: format(date, 'dd MMM', { locale: tr }),
                    soru: Math.floor(Math.random() * 20) + 5,
                    cozum: Math.floor(Math.random() * 15) + 2,
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

    const updateUserRole = async (userId: string, newRole: 'student' | 'teacher' | 'admin' | 'parent') => {
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

            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            fetchData();

        } catch (error: any) {
            toast({
                title: "Hata",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleSaveSettings = () => {
        // Simulate saving settings (In a real app, this would go to a 'system_settings' table)
        localStorage.setItem('admin_system_settings', JSON.stringify(systemSettings));

        toast({
            title: "Ayarlar Kaydedildi",
            description: "Sistem yapılandırması başarıyla güncellendi.",
        });
    };

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <Button variant="link" onClick={() => window.history.back()}>Geri Dön</Button>
            </div>
        );
    }

    const pieData = [
        { name: 'Öğrenci', value: stats.students },
        { name: 'Öğretmen', value: stats.teachers },
        { name: 'Veli', value: stats.parents },
        { name: 'Yönetici', value: stats.admins },
    ];

    return (
        <div className="space-y-8 pb-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {profile?.is_super_admin ? "Holding Yönetici Paneli" : "Okul Yönetici Paneli"}
                    </h1>
                    <p className="text-muted-foreground">
                        {profile?.is_super_admin ? "Tüm okulların genel durumu ve yönetimi." : "Kurumunuzun genel durumu ve kullanıcıları."}
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    {profile?.is_super_admin && (
                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border shadow-sm w-full md:w-auto">
                            <School className="w-4 h-4 ml-2 text-primary" />
                            <Select value={selectedTenantId} onValueChange={setSelectedTenantId}>
                                <SelectTrigger className="w-[200px] border-none focus:ring-0">
                                    <SelectValue placeholder="Okul Seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tüm Sistem (Holding)</SelectItem>
                                    <SelectItem value="individual">Bağımsız Kullanıcılar</SelectItem>
                                    <hr className="my-1 opacity-20" />
                                    {tenants.map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <Button onClick={fetchData} variant="outline" size="sm" className="gap-2 w-full md:w-auto">
                        <TrendingUp className="w-4 h-4" /> Verileri Yenile
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="dashboard" className="space-y-6">
                <TabsList className="bg-white border p-1 rounded-xl h-12 w-full md:w-auto overflow-x-auto">
                    <TabsTrigger value="dashboard" className="rounded-lg gap-2">
                        <BarChart3 className="w-4 h-4" /> İstatistikler
                    </TabsTrigger>
                    <TabsTrigger value="users" className="rounded-lg gap-2">
                        <Users className="w-4 h-4" /> Kullanıcılar
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-lg gap-2">
                        <Settings className="w-4 h-4" /> Sistem Ayarları
                    </TabsTrigger>
                    <TabsTrigger value="blogs" className="rounded-lg gap-2">
                        <BookOpenText className="w-4 h-4" /> Blog Yönetimi
                    </TabsTrigger>
                    <TabsTrigger value="announcements" className="rounded-lg gap-2">
                        <Megaphone className="w-4 h-4" /> Duyurular
                    </TabsTrigger>
                    <TabsTrigger value="questions" className="rounded-lg gap-2">
                        <SearchCode className="w-4 h-4 text-emerald-600" /> Soru Havuzu
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="rounded-lg gap-2">
                        <BarChart3 className="w-4 h-4 text-indigo-600" /> Detaylı Analiz
                    </TabsTrigger>
                    <TabsTrigger value="ai-ledger" className="rounded-lg gap-2">
                        <Coins className="w-4 h-4 text-amber-600" /> AI Maliyet Defteri
                    </TabsTrigger>
                    {profile?.is_super_admin && (
                        <TabsTrigger value="holding" className="rounded-lg gap-2">
                            <LayoutDashboard className="w-4 h-4 text-purple-600" /> Holding Analizi
                        </TabsTrigger>
                    )}
                    {profile?.is_super_admin && (
                        <TabsTrigger value="tenants" className="rounded-lg gap-2">
                            <Building2 className="w-4 h-4 text-blue-600" /> Kurum Yönetimi
                        </TabsTrigger>
                    )}
                </TabsList>

                {/* DASHBOARD CONTENT */}
                <TabsContent value="dashboard" className="space-y-8">
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
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
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
                </TabsContent>

                {/* USERS CONTENT */}
                <TabsContent value="users" className="space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Kullanıcı Yönetimi</CardTitle>
                                    <CardDescription>Sisteme kayıtlı kullanıcıları düzenleyin, rol atayın.</CardDescription>
                                </div>
                                <div className="relative w-72">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="İsim veya rol ara..."
                                        className="pl-9"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="w-[80px]">Avatar</TableHead>
                                            <TableHead>Ad Soyad</TableHead>
                                            {profile?.is_super_admin && selectedTenantId === "all" && <TableHead>Okul</TableHead>}
                                            <TableHead>Kayıt Tarihi</TableHead>
                                            <TableHead>Rol</TableHead>
                                            <TableHead className="text-right">İşlemler</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                                    Kullanıcı bulunamadı.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredUsers.map((user) => (
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
                                                            <span className="text-xs text-muted-foreground">{user.id}</span>
                                                        </div>
                                                    </TableCell>
                                                    {profile?.is_super_admin && selectedTenantId === "all" && (
                                                        <TableCell>
                                                            <Badge
                                                                variant={user.is_super_admin ? "default" : "secondary"}
                                                                className={`font-medium ${user.is_super_admin ? "bg-indigo-600" : ""}`}
                                                            >
                                                                {user.is_super_admin ? "HOLDİNG" : (user.tenants?.name || "Bağımsız")}
                                                            </Badge>
                                                        </TableCell>
                                                    )}
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
                                                        ) : user.role === 'parent' ? (
                                                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Veli</Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">Öğrenci</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Select
                                                                defaultValue={user.role}
                                                                onValueChange={(val) => updateUserRole(user.id, val as any)}
                                                            >
                                                                <SelectTrigger className="w-[110px] h-8 text-xs">
                                                                    <SelectValue placeholder="Rol Seç" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="student">Öğrenci</SelectItem>
                                                                    <SelectItem value="teacher">Öğretmen</SelectItem>
                                                                    <SelectItem value="parent">Veli</SelectItem>
                                                                    <SelectItem value="admin">Admin</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SETTINGS CONTENT */}
                <TabsContent value="settings" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Server className="w-5 h-5 text-primary" /> Sistem Yapılandırması
                            </CardTitle>
                            <CardDescription>
                                OdevGPT genel sistem ayarlarını buradan yönetebilirsiniz.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">

                            {/* Bakım Modu */}
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-base font-medium">Bakım Modu</Label>
                                        {systemSettings.maintenanceMode && <Badge variant="destructive">AKTİF</Badge>}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Siteyi sadece yöneticilerin erişebileceği şekilde kısıtlar.
                                    </p>
                                </div>
                                <Switch
                                    checked={systemSettings.maintenanceMode}
                                    onCheckedChange={(c) => setSystemSettings(p => ({ ...p, maintenanceMode: c }))}
                                />
                            </div>

                            {/* Yeni Üye Alımı */}
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-medium">Yeni Üye Kaydı</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Dışarıdan yeni kullanıcı kayıtlarını aç/kapat.
                                    </p>
                                </div>
                                <Switch
                                    checked={systemSettings.allowSignups}
                                    onCheckedChange={(c) => setSystemSettings(p => ({ ...p, allowSignups: c }))}
                                />
                            </div>

                            {/* Öğretmen Onayı */}
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-medium">AI Cevaplarında Öğretmen Onayı</Label>
                                    <p className="text-sm text-muted-foreground">
                                        AI tarafından üretilen çözümler yayınlanmadan önce öğretmen onayına düşsün.
                                    </p>
                                </div>
                                <Switch
                                    checked={systemSettings.teacherApprovalRequired}
                                    onCheckedChange={(c) => setSystemSettings(p => ({ ...p, teacherApprovalRequired: c }))}
                                />
                            </div>

                            {/* AI Model Ayarları */}
                            <div className="grid gap-4 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Varsayılan Yapay Zeka Modeli</Label>
                                        <Select
                                            value={systemSettings.aiModel}
                                            onValueChange={(val) => setSystemSettings(p => ({ ...p, aiModel: val }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="groq-llama3">Groq - Llama 3 70B (Hızlı & Ücretsiz)</SelectItem>
                                                <SelectItem value="gemini-flash">Google Gemini 1.5 Flash (Önerilen)</SelectItem>
                                                <SelectItem value="gpt-4o">OpenAI GPT-4o (Ücretli)</SelectItem>
                                                <SelectItem value="claude-3-sonnet">Claude 3.5 Sonnet (Ücretli)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[10px] text-muted-foreground mt-1 text-amber-600">
                                            Not: Seçilen modelin API anahtarının .env dosyasında (VITE_X_API_KEY) tanımlı olduğundan emin olun.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Ücretsiz Kullanıcı Günlük Soru Limiti</Label>
                                        <Input
                                            type="number"
                                            value={systemSettings.dailyQuestionLimit}
                                            onChange={(e) => setSystemSettings(p => ({ ...p, dailyQuestionLimit: parseInt(e.target.value) }))}
                                        />
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 bg-gray-50 border-t p-4 rounded-b-xl">
                            <Button variant="outline">İptal</Button>
                            <Button onClick={handleSaveSettings} className="gap-2">
                                <Save className="w-4 h-4" /> Değişiklikleri Kaydet
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* BLOG CONTENT */}
                <TabsContent value="blogs">
                    <AdminBlogManager />
                </TabsContent>

                <TabsContent value="announcements">
                    <AnnouncementManager selectedTenantId={selectedTenantId} />
                </TabsContent>

                <TabsContent value="ai-ledger">
                    <AILedger />
                </TabsContent>

                <TabsContent value="questions">
                    <AdvancedQuestionPool />
                </TabsContent>

                <TabsContent value="analytics">
                    <CorporateAnalytics tenantId={selectedTenantId} />
                </TabsContent>

                {profile?.is_super_admin && (
                    <TabsContent value="holding">
                        <HoldingAnalytics />
                    </TabsContent>
                )}

                {profile?.is_super_admin && (
                    <TabsContent value="tenants">
                        <TenantManager />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
