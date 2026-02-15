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
  LogOut
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
      } else {
        fetchUserClasses();
      }
    }
  }, [profile, loading, navigate]);

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
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">

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

          {/* Level Progress Circle (Decorative) */}
          <div className="hidden md:flex items-center justify-center relative w-48 h-48">
            <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 bg-white/10 rounded-full backdrop-blur-sm flex flex-col items-center justify-center border border-white/20 shadow-2xl">
              <span className="text-sm font-medium text-violet-200">SEVİYE</span>
              <span className="text-5xl font-black text-white">{currentLevel}</span>
              <span className="text-xs text-violet-200 mt-1">{currentXp} / {nextLevelXp} XP</span>
            </div>
          </div>
        </div>

        {/* Background Patterns */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Sınıflarım Bölümü */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" /> Sınıflarım
          </h3>
        </div>

        {classesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-2xl bg-gray-100 animate-pulse"></div>)}
          </div>
        ) : userClasses.length === 0 ? (
          <Card className="border-dashed border-2 bg-gray-50/50">
            <CardContent className="py-10 text-center">
              <School className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-muted-foreground">Henüz bir sınıfa katılmadın.</p>
              <p className="text-xs text-muted-foreground mt-1">Öğretmeninden aldığın kodla yukarıdaki butondan katılabilirsin.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userClasses.map((item) => (
              <Link key={item.id} to={`/dashboard/class/${item.classes?.id}`} className="block">
                <Card className={`border-l-4 hover:shadow-lg transition-all cursor-pointer ${getClassColorBorder(item.classes?.color || 'blue')}`}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className={`text-[10px] ${getClassColorBg(item.classes?.color || 'blue')}`}>
                        {item.classes?.schedule || 'Genel'}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                    <CardTitle className="text-lg mt-2">{item.classes?.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Öğretmen: {item.classes?.profiles?.full_name || 'Belli değil'}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-orange-50/50 border-orange-100 hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Flame className="w-8 h-8 text-orange-500 mb-2" />
            <div className="text-2xl font-bold text-gray-800">12 Gün</div>
            <div className="text-xs text-muted-foreground">Seri Yakaladın! 🔥</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50/50 border-blue-100 hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Zap className="w-8 h-8 text-blue-500 mb-2" />
            <div className="text-2xl font-bold text-gray-800">45 Soru</div>
            <div className="text-xs text-muted-foreground">Bu hafta çözülen</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100 hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Target className="w-8 h-8 text-green-500 mb-2" />
            <div className="text-2xl font-bold text-gray-800">%85</div>
            <div className="text-xs text-muted-foreground">Başarı Oranı</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/50 border-purple-100 hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Trophy className="w-8 h-8 text-purple-500 mb-2" />
            <div className="text-2xl font-bold text-gray-800">3. Sıra</div>
            <div className="text-xs text-muted-foreground">Sınıf Liderliği</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sol Kolon: Grafik ve Son Aktiviteler */}
        <div className="lg:col-span-2 space-y-6">

          {/* Haftalık Grafik */}
          <Card className="shadow-sm border-0 bg-white ring-1 ring-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Haftalık Performans
              </CardTitle>
              <CardDescription>Kazandığın XP puanları</CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorPuan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      cursor={{ stroke: '#8b5cf6', strokeWidth: 2 }}
                    />
                    <Area type="monotone" dataKey="puan" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPuan)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Son Çözümler */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800">Son Aktiviteler</h3>
              <Link to="/dashboard/history" className="text-sm text-primary font-medium hover:underline">Tümünü Gör</Link>
            </div>

            {completedTasks.map((task) => (
              <div key={task.id} className="group flex items-center justify-between p-4 bg-white rounded-2xl border hover:border-primary/30 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${task.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {task.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 group-hover:text-primary transition-colors">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">{task.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${task.status === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>{task.score}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Sağ Kolon: Hedefler ve Rozetler */}
        <div className="space-y-6">

          {/* Günlük Hedefler */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0 shadow-lg" id="goals-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" /> Günlük Hedefler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">3 Soru Çöz</span>
                  <span className="font-bold text-green-400">2/3</span>
                </div>
                <Progress value={66} className="h-2 bg-gray-700" indicatorClassName="bg-green-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">1 Konu Tekrarı</span>
                  <span className="font-bold text-blue-400">0/1</span>
                </div>
                <Progress value={0} className="h-2 bg-gray-700" indicatorClassName="bg-blue-400" />
              </div>
            </CardContent>
          </Card>

          {/* Rozetler */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> Rozet Koleksiyonu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { emoji: "🚀", name: "Başlangıç", locked: false },
                  { emoji: "⚡", name: "Hız", locked: true },
                  { emoji: "🔥", name: "Seri", locked: false },
                  { emoji: "🧠", name: "Zeka", locked: true },
                  { emoji: "💎", name: "Elmas", locked: true },
                  { emoji: "🎓", name: "Mezun", locked: true },
                ].map((badge, i) => (
                  <div key={i} className={`flex flex-col items-center justify-center p-3 rounded-xl border ${badge.locked ? 'opacity-40 bg-gray-50 grayscale' : 'bg-yellow-50/50 border-yellow-200'}`}>
                    <span className="text-2xl mb-1">{badge.emoji}</span>
                    <span className="text-[10px] font-medium text-gray-600">{badge.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Premium Teaser */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-200 to-yellow-400 p-6 text-yellow-900 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 fill-yellow-900" />
              <h3 className="font-bold">Premium'a Geç</h3>
            </div>
            <p className="text-sm font-medium opacity-90 mb-4">Sınırsız soru çözümü ve detaylı analizler için PRO ol.</p>
            <Button size="sm" className="w-full bg-white text-yellow-800 hover:bg-white/90 border-0">
              Detayları İncele
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
