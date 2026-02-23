import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Crown, Star, TrendingUp, Search, Loader2, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface LeaderboardEntry {
    id: string;
    full_name: string;
    xp: number;
    level: number;
    avatar_url: string;
    rank: number;
}

export default function Leaderboard() {
    const { user, profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [period, setPeriod] = useState<"weekly" | "all_time">("weekly");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLeaderboard();
    }, [period]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.rpc('get_leaderboard_v2', {
                p_tenant_id: profile?.tenant_id,
                p_period: period,
                p_limit: 50
            });

            if (error) throw error;
            setEntries(data || []);
        } catch (err) {
            console.error("Leaderboard fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredEntries = entries.filter((e) =>
        e.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const topThree = entries.slice(0, 3);
    const rest = filteredEntries.slice(3);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-md p-6 rounded-3xl border shadow-sm">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent flex items-center gap-3">
                        <Trophy className="w-10 h-10 text-amber-500" /> Şampiyonlar Ligi
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">Öğren, çöz, zirveye yerleş! ✨</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Arkadaşını ara..."
                            className="pl-10 rounded-2xl bg-white/80 border-none focus-visible:ring-2 focus-visible:ring-primary shadow-inner min-w-[200px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="w-fit">
                        <TabsList className="bg-slate-100 rounded-2xl p-1 h-11">
                            <TabsTrigger value="weekly" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Haftalık</TabsTrigger>
                            <TabsTrigger value="all_time" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Genel</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
                </div>
            ) : (
                <>
                    {/* Top 3 Podium */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        {/* 2nd Place */}
                        <PodiumCard entry={entries[1]} rank={2} color="slate" delay={0.1} />
                        {/* 1st Place */}
                        <PodiumCard entry={entries[0]} rank={1} color="amber" delay={0} highlight />
                        {/* 3rd Place */}
                        <PodiumCard entry={entries[2]} rank={3} color="orange" delay={0.2} />
                    </div>

                    {/* Leaderboard Table */}
                    <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-indigo-500/5 bg-white/80 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b p-6">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Sıralama Tablosu
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs text-muted-foreground uppercase tracking-widest bg-slate-50/50 px-6 border-b">
                                            <th className="py-4 pl-8">Sıra</th>
                                            <th className="py-4">Öğrenci</th>
                                            <th className="py-4">Seviye</th>
                                            <th className="py-4 text-right pr-8">XP Puanı</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence>
                                            {rest.map((entry, idx) => (
                                                <motion.tr
                                                    key={entry.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className={`group hover:bg-slate-50/80 transition-all border-b last:border-0 ${entry.id === user?.id ? 'bg-indigo-50/50' : ''}`}
                                                >
                                                    <td className="py-5 pl-8">
                                                        <span className="font-mono font-black text-slate-300 group-hover:text-primary transition-colors">#{entry.rank}</span>
                                                    </td>
                                                    <td className="py-5">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                                                                <AvatarImage src={entry.avatar_url} />
                                                                <AvatarFallback>{entry.full_name?.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-800">{entry.full_name}</span>
                                                                {entry.id === user?.id && <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Ben (Siz)</span>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 font-bold border-indigo-100">
                                                            Lvl {entry.level}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4 text-right pr-8">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="text-lg font-black text-slate-700">{(entry.xp || 0).toLocaleString()}</span>
                                                            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}

function PodiumCard({ entry, rank, color, delay, highlight }: { entry?: LeaderboardEntry, rank: number, color: string, delay: number, highlight?: boolean }) {
    if (!entry) return <div className="hidden md:block" />;

    const colorMap: any = {
        amber: "from-yellow-400 to-amber-600 text-amber-700 shadow-amber-200",
        slate: "from-slate-300 to-slate-500 text-slate-700 shadow-slate-200",
        orange: "from-orange-300 to-orange-500 text-orange-700 shadow-orange-200"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            className={`relative pt-12 pb-8 px-6 bg-white rounded-[2.5rem] shadow-xl border-2 transition-transform hover:scale-105 ${highlight ? 'border-amber-400 scale-110 !z-10 shadow-amber-500/10' : 'border-slate-50'}`}
        >
            <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full p-1.5 bg-gradient-to-br ${colorMap[color]} shadow-2xl`}>
                <div className="w-full h-full rounded-full bg-white overflow-hidden border-4 border-white">
                    <Avatar className="w-full h-full">
                        <AvatarImage src={entry.avatar_url} />
                        <AvatarFallback>{entry.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br ${colorMap[color]} text-white flex items-center justify-center font-black text-lg border-4 border-white shadow-lg`}>
                    {rank}
                </div>
            </div>

            <div className="text-center mt-4">
                <h3 className="font-black text-xl text-slate-800 truncate px-2">{entry.full_name}</h3>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                    <Badge className="bg-indigo-500 text-white border-none px-3 font-bold">Lvl {entry.level}</Badge>
                    <div className="flex items-center gap-1 font-black text-amber-500">
                        <span>{(entry.xp || 0).toLocaleString()}</span>
                        <Zap className="w-3 h-3 fill-amber-500" />
                    </div>
                </div>
                {highlight && (
                    <div className="mt-4 animate-bounce">
                        <Crown className="w-8 h-8 text-amber-500 mx-auto fill-amber-500" />
                    </div>
                )}
            </div>
        </motion.div>
    );
}
