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
    ChevronRight,
    Calendar,
    Globe
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
    rank: number;
}

export default function Leaderboard() {
    const navigate = useNavigate();
    const { profile, user: authUser } = useAuth();
    const { tenant } = useTenant();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"global" | "school">("global");
    const [period, setPeriod] = useState<"all_time" | "weekly">("weekly");
    const [myRank, setMyRank] = useState<number | null>(null);

    useEffect(() => {
        if (profile?.tenant_id) {
            setFilter("school");
        }
    }, [profile?.tenant_id]);

    useEffect(() => {
        fetchLeaderboard();
    }, [filter, period, profile?.tenant_id]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.rpc('get_leaderboard_v2', {
                p_tenant_id: filter === 'school' ? profile?.tenant_id : null,
                p_period: period,
                p_limit: 100
            });

            if (error) throw error;
            setUsers(data || []);

            if (authUser) {
                const myIdx = (data || []).findIndex((u: any) => u.id === authUser.id);
                setMyRank(myIdx !== -1 ? myIdx + 1 : null);
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
            <p className="font-medium animate-pulse text-muted-foreground italic text-lg">Şampiyonlar sahası hazırlanıyor...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 relative via-white to-slate-50 pb-24 font-outfit">
            <SEO title="Şampiyonlar Arenası | OdevGPT" />

            {/* Ambient Background */}
            <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[100%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[80%] bg-accent/5 blur-[100px] rounded-full" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            <div className="container py-8 max-w-6xl mx-auto space-y-12 relative px-4">
                {/* Header Section */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => navigate(-1)}
                                className="rounded-2xl h-12 w-12 bg-white/80 backdrop-blur-sm shadow-sm border-slate-100 hover:scale-105 transition-transform"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-600" />
                            </Button>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                                    Arenası <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200 px-3 py-1">CANLI</Badge>
                                </h1>
                                <p className="text-slate-500 text-lg font-medium">Rekabetin kalbi burada atıyor.</p>
                            </div>
                        </div>

                        {/* Stats Hub */}
                        <div className="flex items-center gap-2 p-1 bg-white/80 backdrop-blur-md rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                            <div className="flex items-center gap-2 px-6 py-3 border-r border-slate-100 group cursor-default">
                                <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">XP Skorun</p>
                                    <p className="font-black text-xl text-slate-800 leading-none">{profile?.xp || 0}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-6 py-3 group cursor-default">
                                <div className="p-2 bg-accent/10 rounded-xl group-hover:scale-110 transition-transform">
                                    <Trophy className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Sıran</p>
                                    <p className="font-black text-xl text-slate-800 leading-none">{myRank ? `#${myRank}` : "???"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Master Filter Bar */}
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                        {/* Period Filter (New) */}
                        <div className="flex p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-2xl border border-slate-200/50 flex-1 lg:flex-none">
                            <Button
                                variant={period === 'weekly' ? 'default' : 'ghost'}
                                className={cn(
                                    "rounded-xl px-6 h-10 flex-1 transition-all duration-300",
                                    period === 'weekly' ? "shadow-lg bg-primary text-white" : "text-slate-500"
                                )}
                                onClick={() => setPeriod('weekly')}
                            >
                                <Calendar className="w-4 h-4 mr-2" /> Haftalık
                            </Button>
                            <Button
                                variant={period === 'all_time' ? 'default' : 'ghost'}
                                className={cn(
                                    "rounded-xl px-6 h-10 flex-1 transition-all duration-300",
                                    period === 'all_time' ? "shadow-lg bg-primary text-white" : "text-slate-500"
                                )}
                                onClick={() => setPeriod('all_time')}
                            >
                                <Globe className="w-4 h-4 mr-2" /> Tüm Zamanlar
                            </Button>
                        </div>

                        {/* Global/School Filter */}
                        <div className="flex p-1.5 bg-white shadow-xl rounded-2xl border border-slate-100 flex-1 lg:flex-none">
                            <Button
                                variant={filter === 'global' ? 'secondary' : 'ghost'}
                                className={cn(
                                    "rounded-xl px-6 h-10 flex-1 transition-all",
                                    filter === 'global' ? "bg-slate-100 text-slate-900" : "text-slate-500"
                                )}
                                onClick={() => setFilter('global')}
                            >
                                <Globe className="w-4 h-4 mr-2" /> Global
                            </Button>
                            <Button
                                variant={filter === 'school' ? 'secondary' : 'ghost'}
                                className={cn(
                                    "rounded-xl px-6 h-10 flex-1 transition-all",
                                    filter === 'school' ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500"
                                )}
                                onClick={() => setFilter('school')}
                            >
                                <Target className="w-4 h-4 mr-2" /> {tenant ? tenant.name : "Okul"}
                            </Button>
                        </div>

                        {/* Search */}
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Şampiyonları ara..."
                                className="pl-12 h-14 rounded-2xl border-slate-100 bg-white shadow-xl focus:ring-primary/20 text-lg font-medium transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/*  podium Section - Redesigned to be more 3D/Premium */}
                {!searchQuery && topThree.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end py-10 perspective-1000">
                        {/* 2nd Place */}
                        <AnimatePresence mode="wait">
                            {topThree[1] && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, x: -50 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="order-2 md:order-1 h-full flex flex-col justify-end"
                                >
                                    <div className="relative group p-1 rounded-[2.5rem] bg-gradient-to-b from-slate-200 to-transparent">
                                        <Card className="border-0 shadow-2xl text-center bg-white/95 backdrop-blur-xl rounded-[2.4rem] overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                                            <CardContent className="pt-10 pb-8 space-y-4">
                                                <div className="relative inline-block">
                                                    <div className="absolute inset-0 bg-slate-300 blur-2xl opacity-30 rounded-full" />
                                                    <Avatar className="w-24 h-24 border-4 border-slate-100 shadow-xl relative">
                                                        <AvatarImage src={topThree[1].avatar_url || ""} />
                                                        <AvatarFallback>{topThree[1].full_name?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute -bottom-2 -right-2 bg-slate-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-black border-4 border-white shadow-lg text-lg">2</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-black text-xl text-slate-800">{topThree[1].full_name}</h3>
                                                    <div className="flex justify-center gap-1.5 capitalize">
                                                        <Badge className="bg-slate-100 text-slate-500 border-0">Seviye {topThree[1].level}</Badge>
                                                    </div>
                                                </div>
                                                <div className="text-3xl font-black text-slate-600 tabular-nums">
                                                    {topThree[1].xp.toLocaleString()} <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">XP</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* 1st Place - The King */}
                        <AnimatePresence mode="wait">
                            {topThree[0] && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                    key={`champion-${period}-${filter}`}
                                    className="order-1 md:order-2 z-20"
                                >
                                    <div className="relative group">
                                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30">
                                            <motion.div
                                                animate={{
                                                    rotate: [0, -10, 10, 0],
                                                    scale: [1, 1.1, 1]
                                                }}
                                                transition={{ duration: 4, repeat: Infinity }}
                                            >
                                                <Crown className="w-20 h-20 text-yellow-500 fill-yellow-500 drop-shadow-[0_10px_30px_rgba(234,179,8,0.5)]" />
                                            </motion.div>
                                        </div>

                                        <div className="p-1.5 rounded-[3rem] bg-gradient-to-b from-yellow-300 via-amber-500 to-transparent shadow-[0_30px_100px_rgba(234,179,8,0.2)]">
                                            <Card className="border-0 shadow-2xl text-center overflow-hidden relative bg-white rounded-[2.8rem] transition-all duration-700 group-hover:scale-[1.03]">
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.1),transparent)]" />
                                                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-yellow-50/50 to-transparent" />

                                                <CardContent className="pt-16 pb-14 space-y-6 relative">
                                                    <div className="relative inline-block">
                                                        <div className="absolute inset-[-15px] bg-yellow-400 blur-[40px] opacity-20 rounded-full animate-pulse" />
                                                        <Avatar className="w-40 h-40 border-[6px] border-yellow-400 shadow-[0_0_50px_rgba(234,179,8,0.4)] relative">
                                                            <AvatarImage src={topThree[0].avatar_url || ""} />
                                                            <AvatarFallback className="text-4xl font-black bg-yellow-50">{topThree[0].full_name?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <motion.div
                                                            className="absolute -bottom-4 -right-4 bg-gradient-to-br from-yellow-400 to-amber-600 text-white w-16 h-16 rounded-full flex items-center justify-center font-black border-[6px] border-white shadow-2xl text-3xl"
                                                            whileHover={{ scale: 1.1, rotate: 360 }}
                                                        >
                                                            1
                                                        </motion.div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <h2 className="font-black text-3xl tracking-tight text-slate-900 group-hover:bg-gradient-to-r group-hover:from-yellow-600 group-hover:to-amber-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                                                            {topThree[0].full_name}
                                                        </h2>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Badge className="bg-yellow-500 text-white hover:bg-yellow-600 border-0 px-4 py-1 font-bold shadow-lg shadow-yellow-200">
                                                                ARENA ŞAMPİYONU
                                                            </Badge>
                                                            <Badge variant="outline" className="border-yellow-200 text-yellow-700 bg-yellow-50/50">LVL {topThree[0].level}</Badge>
                                                        </div>
                                                    </div>

                                                    <div className="text-6xl font-black text-slate-800 tabular-nums tracking-tighter">
                                                        {topThree[0].xp.toLocaleString()} <span className="text-base text-yellow-600 font-black uppercase tracking-widest ml-1">XP</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* 3rd Place */}
                        <AnimatePresence mode="wait">
                            {topThree[2] && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, x: 50 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    transition={{ delay: 0.3, type: "spring" }}
                                    className="order-3 h-full flex flex-col justify-end"
                                >
                                    <div className="relative group p-1 rounded-[2.5rem] bg-gradient-to-b from-orange-200 to-transparent">
                                        <Card className="border-0 shadow-2xl text-center bg-white/95 backdrop-blur-xl rounded-[2.4rem] overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                                            <CardContent className="pt-10 pb-8 space-y-4">
                                                <div className="relative inline-block">
                                                    <Avatar className="w-24 h-24 border-4 border-orange-100 shadow-xl">
                                                        <AvatarImage src={topThree[2].avatar_url || ""} />
                                                        <AvatarFallback>{topThree[2].full_name?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute -bottom-2 -right-2 bg-amber-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-black border-4 border-white shadow-lg text-lg">3</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-black text-xl text-slate-800">{topThree[2].full_name}</h3>
                                                    <div className="flex justify-center gap-1.5 capitalize">
                                                        <Badge className="bg-orange-50 text-orange-600 border-0">Seviye {topThree[2].level}</Badge>
                                                    </div>
                                                </div>
                                                <div className="text-3xl font-black text-amber-700 tabular-nums">
                                                    {topThree[2].xp.toLocaleString()} <span className="text-xs text-amber-500 font-bold uppercase tracking-widest">XP</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* main Ranking Table */}
                <Card className="shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-0 overflow-hidden bg-white/80 backdrop-blur-2xl rounded-[3rem]">
                    <div className="p-8 md:p-10 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <Award className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Kalan Şampiyonlar</h2>
                                <p className="text-slate-500 font-medium">Sıralamanı yükseltmek için daha çok soru çöz!</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-black text-slate-800">%{Math.floor(Math.random() * 20) + 80}</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AKTİVİTE</span>
                            </div>
                            <div className="w-px h-10 bg-slate-100" />
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                                    <span className="text-sm font-black text-slate-800">CANLI</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">REKABET</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/30 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    <tr>
                                        <th className="px-10 py-6">SIRALAMA</th>
                                        <th className="px-6 py-6">OYUNCU PROFİLİ</th>
                                        <th className="px-6 py-6 hidden lg:table-cell">GELİŞİM PLANI</th>
                                        <th className="px-10 py-6 text-right">SKOR (XP)</th>
                                        <th className="px-6 py-6 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {others.map((user, index) => {
                                        const rank = searchQuery ? index + 1 : index + 4;
                                        const isCurrentUser = user.id === authUser?.id;

                                        return (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.03 * index }}
                                                className={cn(
                                                    "group transition-all duration-300 hover:bg-slate-50/50 cursor-pointer",
                                                    isCurrentUser ? "bg-primary/[0.04] relative z-10" : ""
                                                )}
                                            >
                                                <td className="px-10 py-7">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                                                        rank <= 3 ? getRankStyles(rank - 1) : "bg-white border-2 border-slate-100 text-slate-400 shadow-sm"
                                                    )}>
                                                        {rank <= 3 ? <Medal className="w-6 h-6 text-white" /> : rank}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-7">
                                                    <div className="flex items-center gap-5">
                                                        <div className="relative">
                                                            <Avatar className="w-14 h-14 border-[3px] border-white shadow-xl transition-all group-hover:border-primary/50">
                                                                <AvatarImage src={user.avatar_url || ""} />
                                                                <AvatarFallback className="bg-slate-100 font-bold text-slate-500">{user.full_name?.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            {isCurrentUser && (
                                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-[3px] border-white rounded-full shadow-lg animate-pulse" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className={cn(
                                                                "font-black text-xl tracking-tight transition-colors",
                                                                isCurrentUser ? "text-primary" : "text-slate-800"
                                                            )}>
                                                                {user.full_name}
                                                                {isCurrentUser && <Badge className="ml-3 h-5 px-2 bg-primary text-white text-[9px] font-black tracking-widest">SENİN SKORUN</Badge>}
                                                            </span>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                                                                    <Target className="w-3 h-3 text-slate-400" /> Seviye {user.level}
                                                                </span>
                                                                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                                                <span className="text-[11px] text-green-500 font-bold flex items-center gap-1 uppercase tracking-wider">
                                                                    <TrendingUp className="w-3 h-3" /> YÜKSELİŞTE
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-7 hidden lg:table-cell">
                                                    <div className="flex flex-col gap-2.5 w-44">
                                                        <div className="flex items-center justify-between text-[11px] font-black text-slate-400 tracking-wider">
                                                            <span>SONRAKİ LVL</span>
                                                            <span>%{Math.floor(((user.xp % 1000) / 1000) * 100)}</span>
                                                        </div>
                                                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(user.xp % 1000) / 10}%` }}
                                                                transition={{ delay: 0.5, duration: 1.5 }}
                                                                className="h-full bg-gradient-to-r from-primary via-indigo-500 to-accent"
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-7 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className="font-black text-3xl text-slate-900 tabular-nums tracking-tighter leading-none mb-1">
                                                            {user.xp.toLocaleString()}
                                                        </span>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Puan</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-7">
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {others.length === 0 && (
                            <div className="py-32 text-center bg-slate-50/50">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-white w-24 h-24 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6"
                                >
                                    <Search className="w-10 h-10 text-slate-200" />
                                </motion.div>
                                <h3 className="text-slate-900 font-black text-2xl tracking-tight mb-2">Kimseyi bulamadık!</h3>
                                <p className="text-slate-500 font-medium max-w-xs mx-auto">Aradığın şampiyon henüz arenaya girmemiş olabilir.</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Floating User Rank Info (If not in sight) */}
                {profile && myRank && myRank > 3 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl"
                    >
                        <div className="p-1 rounded-[2.5rem] bg-gradient-to-r from-primary via-indigo-600 to-accent shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
                            <Card className="bg-slate-900/95 text-white border-0 backdrop-blur-2xl rounded-[2.4rem]">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-primary blur-2xl opacity-40 rounded-full animate-pulse" />
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-indigo-600 rounded-[1.2rem] flex items-center justify-center font-black text-2xl text-white shadow-xl relative">
                                                #{myRank}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-1">Geceler Hâkimi</span>
                                            <span className="font-black text-2xl tracking-tight">{profile.full_name}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-10 pr-4">
                                        <div className="text-right flex flex-col items-end">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">SKORUN (XP)</span>
                                            <span className="text-3xl font-black tabular-nums leading-none tracking-tighter text-white">{profile.xp.toLocaleString()}</span>
                                        </div>
                                        <div className="h-12 w-px bg-white/10" />
                                        <div className="text-right flex flex-col items-end">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">HEDEF FARK</span>
                                            <span className="text-2xl font-black tabular-nums leading-none tracking-tighter text-indigo-400">
                                                -{((users[myRank - 2]?.xp || 0) - profile.xp).toLocaleString()}
                                            </span>
                                        </div>
                                        <Button
                                            size="icon"
                                            className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border-0 transition-colors"
                                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                        >
                                            <TrendingUp className="w-6 h-6 text-primary" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
