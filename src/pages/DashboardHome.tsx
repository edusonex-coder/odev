import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  Camera,
  BookOpen,
  Trophy,
  TrendingUp,
  Flame,
  Star,
  ChevronRight,
  Loader2,
  Calendar,
  Zap,
  Target,
  Clock,
  CheckCircle2,
  School,
  Sparkles,
  MoreVertical,
  LogOut,
  Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";

// Mock Data - Haftalık Çalışma
const activityData = [
  { name: 'Pzt', puan: 40 },
  { name: 'Sal', puan: 65 },
  { name: 'Çar', puan: 30 },
  { name: 'Per', puan: 85 },
  { name: 'Cum', puan: 50 },
  { name: 'Cmt', puan: 90 },
  { name: 'Paz', puan: 60 },
];

const completedTasks = [
  { id: 1, title: "Matematik - Türev", score: "90 XP", date: "2 saat önce", status: "completed" },
  { id: 2, title: "Fizik - Kuvvet", score: "İnceleniyor", date: "4 saat önce", status: "pending" },
  { id: 3, title: "Kimya - Mol Kavramı", score: "75 XP", date: "Dün", status: "completed" },
];

interface UserClass {
  id: string;
  class_id: string;
  classes: {
    id: string;
    name: string;
    color: string;
    schedule: string | null;
    profiles: {
      full_name: string | null;
    } | null;
  } | null;
}

export default function DashboardHome() {
  const { profile, loading, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [userClasses, setUserClasses] = useState<UserClass[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [stats, setStats] = useState({ solved: 0, streak: 0, success: 0 });
  const [weeklyXp, setWeeklyXp] = useState<any[]>([]);

  // Gamification stats from real profile data
  const currentXp = profile?.xp || 0;
  const currentLevel = profile?.level || 1;
  const nextLevelXp = currentLevel * 1000;
  const progressToNextLevel = ((currentXp % 1000) / 1000) * 100;

  useEffect(() => {
    if (!loading && profile) {
      if (profile.role === 'teacher') {
        navigate('/teacher');
      } else if (profile.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (profile.role === 'parent') {
        navigate('/dashboard/parent', { replace: true });
      } else {
        fetchUserClasses();
        fetchUserStats();
      }
    }
  }, [profile, loading, navigate]);

  const fetchUserStats = async () => {
    if (!user) return;
    try {
      // Soru sayısı
      const { count } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', user.id);

      setStats(prev => ({
        ...prev,
        solved: count || 0,
        streak: profile?.streak || 0
      }));

      // Haftalık XP grafiği için logları çek (son 7 gün)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: logs } = await supabase
        .from('xp_logs')
        .select('created_at, amount')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      if (logs) {
        // Logları günlere göre grupla (Basit bir mapping)
        const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
        const chartData = days.map((day, i) => {
          const today = new Date();
          const d = new Date();
          d.setDate(today.getDate() - (6 - i));
          const dayLabel = days[d.getDay()];

          const dayTotal = logs
            .filter(log => new Date(log.created_at).toDateString() === d.toDateString())
            .reduce((acc, curr) => acc + curr.amount, 0);

          return { name: dayLabel, puan: dayTotal };
        });
        setWeeklyXp(chartData);
      }
    } catch (err) {
      console.error("Stats fetching error:", err);
    }
  };

  const fetchUserClasses = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('class_students')
        .select(`
          id,
          class_id,
          classes (
            id,
            name,
            color,
            schedule,
            profiles:teacher_id (
              full_name
            )
          )
        `)
        .eq('student_id', user.id);

      if (error) throw error;

      // Fix typing issue with Supabase join
      const formattedData = data?.map(item => ({
        ...item,
        classes: Array.isArray(item.classes) ? item.classes[0] : item.classes
      })) as any;

      setUserClasses(formattedData || []);
    } catch (error) {
      console.error("Sınıflar yüklenirken hata:", error);
    } finally {
      setClassesLoading(false);
    }
  };

  const handleJoinClass = async () => {
    if (!joinCode.trim() || !user) return;
    setJoining(true);

    try {
      // 1. Kodu kontrol et
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('id, name')
        .eq('invite_code', joinCode.toUpperCase())
        .single();

      if (classError || !classData) {
        throw new Error("Geçersiz davet kodu. Lütfen kontrol edip tekrar deneyin.");
      }

      // 2. Halihazırda üye mi kontrol et
      const { data: existingMember } = await supabase
        .from('class_students')
        .select('id')
        .eq('class_id', classData.id)
        .eq('student_id', user.id)
        .single();

      if (existingMember) {
        throw new Error("Zaten bu sınıfın bir üyesisin! 😊");
      }

      // 3. Sınıfa ekle
      const { error: joinError } = await supabase
        .from('class_students')
        .insert({
          class_id: classData.id,
          student_id: user.id
        });

      if (joinError) throw joinError;

      toast({
        title: "Harika! 🎉",
        description: `${classData.name} sınıfına başarıyla katıldın. Hoş geldin!`,
      });
      setJoinCode("");
      fetchUserClasses(); // Refresh classes

    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setJoining(false);
    }
  };

  const getClassColorBorder = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-500';
      case 'green': return 'border-green-500';
      case 'purple': return 'border-purple-500';
      case 'orange': return 'border-orange-500';
      default: return 'border-gray-500';
    }
  };

  const getClassColorBg = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 text-blue-700';
      case 'green': return 'bg-green-50 text-green-700';
      case 'purple': return 'bg-purple-50 text-purple-700';
      case 'orange': return 'bg-orange-50 text-orange-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-10">
        <SEO title="Yükleniyor..." />
        {/* Hero Skeleton */}
        <div className="h-64 rounded-3xl bg-muted animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
            </div>
            {/* Chart Skeleton */}
            <Skeleton className="h-[300px] rounded-3xl" />
            {/* Classes Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
            </div>
          </div>
          <div className="space-y-8">
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] gap-4">
        <h2 className="text-xl font-bold">Profil bilgileri yüklenemedi.</h2>
        <p className="text-muted-foreground">Lütfen internet bağlantınızı kontrol edip tekrar deneyin.</p>
        <Button onClick={() => window.location.reload()}>Sayfayı Yenile</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <SEO title="Öğrenci Paneli" />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl">
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 max-w-lg">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-violet-100 bg-white/10 w-fit px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Hoş geldin, Süper Kahraman!</span>
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Merhaba, {profile?.full_name?.split(' ')[0] || 'Öğrenci'}! 👋 <br />
              Bugün öğrenmeye hazır mısın?
            </h1>
            <p className="text-violet-100 text-lg">
              Seni bekleyen <span className="font-bold text-white">3 yeni görev</span> ve kazanılacak <span className="font-bold text-yellow-300">500 XP</span> var.
            </p>
            <div className="flex gap-3 pt-2">
              <Link to="/dashboard/ask">
                <Button size="lg" className="bg-white text-violet-700 hover:bg-violet-50 font-bold shadow-lg shadow-violet-900/20 border-0">
                  <Camera className="w-5 h-5 mr-2" /> Soru Sor
                </Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <School className="w-5 h-5 mr-2" /> Sınıfa Katıl
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Sınıfa Katıl</DialogTitle>
                    <DialogDescription>
                      Öğretmeninden aldığın 6 haneli davet kodunu buraya gir.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="joinCode">Davet Kodu</Label>
                      <Input
                        id="joinCode"
                        placeholder="Örn: X1Y2Z3"
                        className="text-center font-mono text-xl tracking-widest uppercase"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        maxLength={6}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleJoinClass}
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                      disabled={joining || joinCode.length < 6}
                    >
                      {joining ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Katıl"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center relative w-48 h-48">
            <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 bg-white/10 rounded-full backdrop-blur-sm flex flex-col items-center justify-center border border-white/20 shadow-2xl">
              <span className="text-sm font-medium text-violet-200">SEVİYE</span>
              <span className="text-5xl font-black text-white">{currentLevel}</span>
              <span className="text-xs text-violet-200 mt-1">{currentXp} / {nextLevelXp} XP</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon: İstatistikler, Grafik ve Sınıflar */}
        <div className="lg:col-span-2 space-y-8">

          {/* İstatistik Kartları */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-orange-50/50 border-orange-100 hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Flame className="w-8 h-8 text-orange-500 mb-2" />
                <div className="text-2xl font-bold text-gray-800">{profile?.streak || 0} Gün</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Seri</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50/50 border-blue-100 hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Zap className="w-8 h-8 text-blue-500 mb-2" />
                <div className="text-2xl font-bold text-gray-800">{stats.solved}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Soru</div>
              </CardContent>
            </Card>
            <Card className="bg-green-50/50 border-green-100 hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Target className="w-8 h-8 text-green-500 mb-2" />
                <div className="text-2xl font-bold text-gray-800">%85</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Başarı</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50/50 border-purple-100 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/dashboard/leaderboard')}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Trophy className="w-8 h-8 text-purple-500 mb-2" />
                <div className="text-2xl font-bold text-gray-800">#{stats.solved > 0 ? '12' : '--'}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Sıralama</div>
              </CardContent>
            </Card>
          </div>

          {/* Grafik */}
          <Card className="shadow-lg border-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" /> Haftalık XP Grafiği
                </CardTitle>
                <CardDescription>Son 7 gündeki öğrenme aktiviten</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pl-0">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyXp.length > 0 ? weeklyXp : activityData}>
                    <defs>
                      <linearGradient id="colorPuan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="puan" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPuan)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sınıflarım */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Kayıtlı Sınıfların</h3>
            {classesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse"></div>)}
              </div>
            ) : userClasses.length === 0 ? (
              <div className="p-10 border-2 border-dashed rounded-2xl text-center bg-gray-50/50">
                <p className="text-muted-foreground">Henüz bir sınıfa katılmadın.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userClasses.map((item) => (
                  <Link key={item.id} to={`/dashboard/class/${item.classes?.id}`}>
                    <Card className={`hover:shadow-md transition-all border-l-4 ${getClassColorBorder(item.classes?.color || 'blue')}`}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold">{item.classes?.name}</p>
                          <p className="text-xs text-muted-foreground">{item.classes?.profiles?.full_name}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sağ Kolon: Günlük Görevler ve Rozetler */}
        <div className="space-y-8">

          <Card className="shadow-lg border-indigo-100 bg-indigo-50/30 overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" /> Günlük Görevler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-bold">3 Soru Çöz</span>
                  <Badge variant="secondary" className="bg-violet-100 text-violet-700 font-bold">+50 XP</Badge>
                </div>
                <Progress value={(Math.min(stats.solved, 3) / 3) * 100} className="h-1.5" />
                <p className="text-[10px] text-right font-medium text-gray-500">{Math.min(stats.solved, 3)}/3</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-bold">1 Sokratik Sohbet</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-bold">+20 XP</Badge>
                </div>
                <Progress value={0} className="h-1.5" />
                <p className="text-[10px] text-right font-medium text-gray-500">0/1</p>
              </div>
            </CardContent>
            <CardFooter className="bg-indigo-600 text-white p-3 text-center text-[10px] font-bold">
              HEPSİNİ TAMAMLA, SÜRPRİZ KUTU KAZAN! 🎁
            </CardFooter>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> Rozet Kütüphanesi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { e: '🚀', n: 'Yolcu', l: false },
                  { e: '⚡', n: 'Hızlı', l: true },
                  { e: '🔥', n: 'Seri', l: false },
                  { e: '🧠', n: 'Daha', l: true },
                  { e: '🏆', n: 'Usta', l: true },
                  { e: '💎', n: 'Ender', l: true },
                ].map((b, i) => (
                  <div key={i} className={`flex flex-col items-center p-2 rounded-xl border ${b.l ? 'opacity-30 grayscale bg-gray-50' : 'bg-yellow-50 border-yellow-200'}`}>
                    <span className="text-xl">{b.e}</span>
                    <span className="text-[8px] font-bold mt-1 text-gray-600 uppercase">{b.n}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-black text-xl mb-1">PREMIUM</h3>
              <p className="text-xs font-medium opacity-90 mb-4 line-clamp-2">Sınırsız AI kullanımı ve özel içerikler için yükselt.</p>
              <Button size="sm" className="w-full bg-white text-orange-600 hover:bg-gray-100 font-bold">İncele</Button>
            </div>
            <Star className="absolute -bottom-4 -right-4 w-24 h-24 text-white/20 rotate-12 group-hover:scale-110 transition-transform" />
          </div>

        </div>
      </div>
    </div>
  );
}
