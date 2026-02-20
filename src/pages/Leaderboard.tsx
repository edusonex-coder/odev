import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trophy,
    Medal,
    ArrowLeft,
    Loader2,
    Sparkles,
    Target,
    Flame,
    TrendingUp,
    Search,
    Crown,
    Star,
    Award,
    ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import SEO from "@/components/SEO";
import { cn } from "@/lib/utils";

interface LeaderboardUser {
    id: string;
    full_name: string | null;
    xp: number;
    level: number;
    avatar_url: string | null;
    tenant_id: string | null;
}

export default function Leaderboard() {
    const navigate = useNavigate();
    const { profile, user: authUser } = useAuth();
    const { tenant } = useTenant();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"global" | "school">("global");
    const [myRank, setMyRank] = useState<number | null>(null);

    useEffect(() => {
        if (profile?.tenant_id) {
            setFilter("school");
        }
    }, [profile?.tenant_id]);

    useEffect(() => {
        fetchLeaderboard();
    }, [filter, profile?.tenant_id]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('profiles')
                .select('id, full_name, xp, level, avatar_url, tenant_id')
                .eq('role', 'student');

            if (filter === 'school' && profile?.tenant_id) {
                query = query.eq('tenant_id', profile.tenant_id);
            }

            query = query.order('xp', { ascending: false });

            const { data, error } = await query.limit(100);

            if (error) throw error;
            setUsers(data || []);

            // Find current user's rank
            if (authUser) {
                const index = (data || []).findIndex(u => u.id === authUser.id);
                if (index !== -1) {
                    setMyRank(index + 1);
                } else {
                    // If not in top 100, we could fetch specifically but for now keep null
                    setMyRank(null);
                }
            }
        } catch (err) {
            console.error("Leaderboard Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const topThree = useMemo(() => users.slice(0, 3), [users]);
    const others = useMemo(() => {
        const filtered = users.filter(user =>
            (user.full_name || "").toLowerCase().includes(searchQuery.toLowerCase())
        );
        return searchQuery ? filtered : filtered.slice(3);
    }, [users, searchQuery]);

    const getRankStyles = (index: number) => {
        switch (index) {
            case 0: return "bg-gradient-to-br from-yellow-400 to-amber-600 shadow-yellow-200";
            case 1: return "bg-gradient-to-br from-slate-300 to-slate-500 shadow-slate-200";
            case 2: return "bg-gradient-to-br from-orange-400 to-amber-700 shadow-orange-200";
            default: return "bg-muted";
        }
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
            <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <Trophy className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
            </div>
            <p className="font-medium animate-pulse text-muted-foreground">Şampiyonlar sahası hazırlanıyor...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
            <SEO title="Liderlik Tablosu" />
            
            {/* Hero Background Decor */}
            <div className="absolute top-0 left-0 right-0 h-96 bg-primary/5 -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[100%] bg-accent/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-5%] w-[30%] h-[80%] bg-primary/10 blur-[100px] rounded-full" />
            </div>

            <div className="container py-8 max-w-5xl mx-auto space-y-10 relative">
                {/* Header Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => navigate(-1)} 
                                className="rounded-full bg-white shadow-sm hover:shadow-md transition-all"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                                    Liderlik Tablosu <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                                </h1>
                                <p className="text-muted-foreground text-sm font-medium">EdusonEX evreninin en başarılı kaşifleri!</p>
                            </div>
                        </div>

                        {/* Current User Quick Stats - Desktop */}
                        {profile && (
                            <div className="hidden md:flex items-center gap-6 bg-white p-3 px-6 rounded-2xl shadow-sm border border-slate-100">
                                <div className="text-center">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">XP</p>
                                    <p className="font-black text-primary">{profile.xp}</p>
                                </div>
                                <div className="w-px h-8 bg-slate-100" />
                                <div className="text-center">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">SIRALAMA</p>
                                    <p className="font-black text-accent">{myRank ? `#${myRank}` : "???"}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Filters & Search Row */}
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-100 flex gap-1 w-full md:w-auto">
                            <Button
                                variant={filter === 'global' ? 'primary' : 'ghost'}
                                size="sm"
                                className={cn(
                                    "rounded-xl h-10 px-6 transition-all",
                                    filter === 'global' ? "shadow-glow" : "text-muted-foreground hover:bg-slate-50"
                                )}
                                onClick={() => setFilter('global')}
                            >
                                <Star className={cn("w-4 h-4 mr-2", filter === 'global' ? "fill-current" : "")} />
                                Global
                            </Button>
                            <Button
                                variant={filter === 'school' ? 'primary' : 'ghost'}
                                size="sm"
                                className={cn(
                                    "rounded-xl h-10 px-6 transition-all",
                                    filter === 'school' ? "shadow-glow" : "text-muted-foreground hover:bg-slate-50"
                                )}
                                onClick={() => setFilter('school')}
                            >
                                <Target className="w-4 h-4 mr-2" />
                                {tenant ? tenant.name : "Okul İçi"}
                            </Button>
                        </div>
                        <div className="relative flex-1 group w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Bir şampiyonun ismini ara..."
                                className="pl-12 h-12 rounded-2xl border-slate-100 bg-white shadow-sm focus:ring-primary/20 transition-all text-base"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Top 3 PodiumSection */}
                {!searchQuery && topThree.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end py-10">
                        {/* 2nd Place */}
                        <AnimatePresence mode="wait">
                            {topThree[1] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    key={`rank-2-${filter}`}
                                    className="order-2 md:order-1"
                                >
                                    <Card className="border-0 shadow-lg text-center bg-white/80 backdrop-blur-sm group hover:scale-[1.02] transition-transform">
                                        <div className="h-2 w-full bg-slate-300 rounded-t-xl" />
                                        <CardContent className="pt-10 pb-8 space-y-4">
                                            <div className="relative inline-block">
                                                <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
                                                    <AvatarImage src={topThree[1].avatar_url || ""} />
                                                    <AvatarFallback>{topThree[1].full_name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="absolute -bottom-2 -right-2 bg-slate-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-lg text-lg">2</div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{topThree[1].full_name}</h3>
                                                <div className="flex items-center justify-center gap-2 mt-1">
                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200">Seviye {topThree[1].level}</Badge>
                                                </div>
                                            </div>
                                            <div className="text-3xl font-black text-slate-700 tabular-nums">{topThree[1].xp.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">XP</span></div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* 1st Place - The Champion */}
                        <AnimatePresence mode="wait">
                            {topThree[0] && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                    key={`rank-1-${filter}`}
                                    className="order-1 md:order-2 z-10"
                                >
                                    <div className="relative group">
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce">
                                            <Crown className="w-12 h-12 text-yellow-500 fill-yellow-500 drop-shadow-xl" />
                                        </div>
                                        
                                        <Card className="border-0 shadow-2xl text-center overflow-hidden relative bg-white group-hover:scale-[1.05] transition-transform">
                                            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/10 via-amber-500/5 to-transparent" />
                                            <div className="h-3 w-full bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-600" />
                                            
                                            <CardContent className="pt-12 pb-12 space-y-6 relative">
                                                <div className="relative inline-block">
                                                    <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse" />
                                                    <Avatar className="w-36 h-36 border-4 border-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.3)] relative">
                                                        <AvatarImage src={topThree[0].avatar_url || ""} />
                                                        <AvatarFallback className="text-4xl">{topThree[0].full_name?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-yellow-400 to-amber-600 text-white w-14 h-14 rounded-full flex items-center justify-center font-black border-4 border-white shadow-2xl text-2xl">1</div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <h2 className="font-black text-3xl tracking-tight text-slate-900">{topThree[0].full_name}</h2>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Badge className="bg-yellow-500 text-white hover:bg-yellow-600 border-0 shadow-sm animate-pulse">
                                                            EFSANEVİ LİDER
                                                        </Badge>
                                                        <Badge variant="outline" className="border-yellow-200 text-yellow-700">LVL {topThree[0].level}</Badge>
                                                    </div>
                                                </div>
                                                
                                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 drop-shadow-sm tabular-nums">
                                                    {topThree[0].xp.toLocaleString()} <span className="text-sm text-amber-800/60 font-medium">XP</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* 3rd Place */}
                        <AnimatePresence mode="wait">
                            {topThree[2] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    key={`rank-3-${filter}`}
                                    className="order-3"
                                >
                                    <Card className="border-0 shadow-lg text-center bg-white/80 backdrop-blur-sm group hover:scale-[1.02] transition-transform">
                                        <div className="h-2 w-full bg-orange-400 rounded-t-xl opacity-60" />
                                        <CardContent className="pt-10 pb-8 space-y-4">
                                            <div className="relative inline-block">
                                                <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
                                                    <AvatarImage src={topThree[2].avatar_url || ""} />
                                                    <AvatarFallback>{topThree[2].full_name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="absolute -bottom-2 -right-2 bg-amber-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-lg text-lg">3</div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{topThree[2].full_name}</h3>
                                                <div className="flex items-center justify-center gap-2 mt-1">
                                                    <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-100">Seviye {topThree[2].level}</Badge>
                                                </div>
                                            </div>
                                            <div className="text-3xl font-black text-amber-800 tabular-nums">{topThree[2].xp.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">XP</span></div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* List Table Modernized */}
                <Card className="shadow-2xl border-0 overflow-hidden bg-white/60 backdrop-blur-md rounded-[2rem]">
                    <div className="p-8 border-b border-slate-100 bg-white/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Award className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Şampiyonlar Arenası</h2>
                        </div>
                        <div className="hidden sm:flex items-center gap-6">
                            <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                <Target className="w-4 h-4 text-primary" /> Zirve Hedefi
                            </span>
                            <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                <Flame className="w-4 h-4 text-orange-500" /> Aktif Rekabet
                            </span>
                        </div>
                    </div>
                    
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    <tr>
                                        <th className="px-8 py-5"># SIra</th>
                                        <th className="px-8 py-5">Kaşif Bilgileri</th>
                                        <th className="px-8 py-5 hidden md:table-cell">Gelişim Seviyesi</th>
                                        <th className="px-8 py-5 text-right">Skor</th>
                                        <th className="px-4 py-5 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {others.map((user, index) => {
                                        const rank = searchQuery ? index + 1 : index + 4;
                                        const isCurrentUser = user.id === authUser?.id;
                                        
                                        return (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.05 * index }}
                                                className={cn(
                                                    "hover:bg-primary/[0.02] transition-colors group cursor-pointer",
                                                    isCurrentUser ? "bg-primary/[0.03]" : ""
                                                )}
                                            >
                                                <td className="px-8 py-6">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-110",
                                                        rank <= 3 ? getRankStyles(rank-1) : "bg-slate-100 text-slate-500"
                                                    )}>
                                                        {rank <= 3 ? <Medal className="w-5 h-5 text-white" /> : rank}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <Avatar className="w-12 h-12 border-2 border-white shadow-md transition-all group-hover:border-primary/30">
                                                                <AvatarImage src={user.avatar_url || ""} />
                                                                <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            {isCurrentUser && (
                                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className={cn(
                                                                "font-bold text-slate-900 flex items-center gap-2",
                                                                isCurrentUser ? "text-primary" : ""
                                                            )}>
                                                                {user.full_name}
                                                                {isCurrentUser && <Badge className="h-4 p-0 px-1 text-[8px] bg-primary text-white">SENSİN</Badge>}
                                                            </span>
                                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium mt-0.5">
                                                                <TrendingUp className="w-3 h-3 text-green-500" /> 
                                                                Lvl {user.level} · Son 24 saatte yükselişte
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 hidden md:table-cell">
                                                    <div className="flex flex-col gap-2 w-32">
                                                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                                                            <span>Puan: {user.xp % 500} / 500</span>
                                                            <span>%{Math.floor(((user.xp % 500) / 500) * 100)}</span>
                                                        </div>
                                                        <Progress 
                                                            value={(user.xp % 500) / 5} 
                                                            className="h-2 bg-slate-100" 
                                                            //@ts-ignore
                                                            indicatorClassName="bg-gradient-to-r from-primary to-indigo-500"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className="font-black text-xl text-slate-800 tabular-nums tracking-tight">
                                                            {user.xp.toLocaleString()}
                                                        </span>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">TOPLAM XP</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-6">
                                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {others.length === 0 && (
                            <div className="py-24 text-center">
                                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-slate-900 font-bold text-lg">Eşleşen şampiyon bulunamadı</h3>
                                <p className="text-muted-foreground text-sm">Arama kriterini değiştirmeyi dene.</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Personalized Floating Status Bar (Only if user is not in top items) */}
                {profile && myRank && myRank > 3 && (
                    <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
                    >
                        <Card className="bg-slate-900 text-white border-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl border-t-2">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center font-black text-xl text-primary border border-primary/30">
                                        #{myRank}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-primary uppercase tracking-widest">Senin Sıralaman</span>
                                        <span className="font-bold text-base">{profile.full_name}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 pr-2">
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-slate-500 block">TOPLAM</span>
                                        <span className="text-xl font-black tabular-nums">{profile.xp.toLocaleString()} XP</span>
                                    </div>
                                    <div className="h-10 w-px bg-slate-800" />
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-slate-500 block">HEDEF</span>
                                        <span className="text-base font-bold text-indigo-400">-{((users[myRank-2]?.xp || 0) - profile.xp).toLocaleString()} XP</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Motivation Section Modernized */}
                <div className="grid md:grid-cols-2 gap-8 mt-12">
                    <Card className="border-0 bg-primary shadow-2xl shadow-primary/20 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform duration-500">
                            <Trophy className="w-32 h-32" />
                        </div>
                        <CardHeader className="relative">
                            <CardTitle className="flex items-center gap-2 text-2xl font-black">
                                Zirveye Yolculuk
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 relative">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { xp: "+10", task: "Sokratik Sohbet", icon: <Sparkles className="w-4 h-4" /> },
                                    { xp: "+100", task: "Zamanında Teslim", icon: <Award className="w-4 h-4" /> },
                                    { xp: "+250", task: "Arkadaş Daveti", icon: <Star className="w-4 h-4" /> },
                                    { xp: "+500", task: "Hataları Çözme", icon: <Target className="w-4 h-4" /> }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                                        <span className="text-2xl font-black">{item.xp}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 flex items-center gap-1">
                                            {item.icon} {item.task}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-white shadow-xl flex flex-col justify-center">
                        <CardHeader>
                            <CardTitle className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">Günün Motivasyonu</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <blockquote className="space-y-4">
                                <p className="text-2xl font-black text-slate-800 leading-tight italic">
                                    "Eğitim, dünyayı değiştirmek için kullanabileceğiniz en güçlü silahtır."
                                </p>
                                <footer className="flex items-center gap-3">
                                    <div className="w-8 h-1 bg-primary rounded-full" />
                                    <cite className="text-sm font-bold text-slate-500 not-italic uppercase tracking-widest">Nelson Mandela</cite>
                                </footer>
                            </blockquote>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
