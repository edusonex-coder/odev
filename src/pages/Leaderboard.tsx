import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Trophy,
    Medal,
    ArrowLeft,
    Loader2,
    Sparkles,
    Target,
    Flame,
    TrendingUp,
    Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import SEO from "@/components/SEO";

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
    const { profile } = useAuth();
    const { tenant } = useTenant();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"global" | "school">("global");

    useEffect(() => {
        // If user belongs to a tenant, default to school filter
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

            const { data, error } = await query.limit(50);

            if (error) throw error;
            setUsers(data || []);
        } catch (err) {
            console.error("Leaderboard Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        (user.full_name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Trophy className="w-6 h-6 text-yellow-500" />;
            case 1: return <Medal className="w-6 h-6 text-gray-400" />;
            case 2: return <Medal className="w-6 h-6 text-amber-600" />;
            default: return <span className="font-bold text-muted-foreground">{index + 1}</span>;
        }
    };

    if (loading) return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const topThree = users.slice(0, 3);
    const others = filteredUsers.slice(3);

    return (
        <div className="container py-8 max-w-5xl mx-auto space-y-8">
            <SEO title="Liderlik Tablosu" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black flex items-center gap-2">
                            Liderlik Tablosu <Sparkles className="w-6 h-6 text-yellow-500" />
                        </h1>
                        <p className="text-muted-foreground text-sm">EdusonEX evreninin en başarılı kaşifleri!</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="bg-muted p-1 rounded-xl flex gap-1 grow md:grow-0">
                        <Button
                            variant={filter === 'global' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="rounded-lg text-[10px] h-8 grow md:grow-0"
                            onClick={() => setFilter('global')}
                        >
                            Global
                        </Button>
                        <Button
                            variant={filter === 'school' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="rounded-lg text-[10px] h-8 grow md:grow-0"
                            onClick={() => setFilter('school')}
                        >
                            {tenant ? tenant.name : "Okul İçi"}
                        </Button>
                    </div>
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="İsimle ara..."
                            className="pl-10 h-10 rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Top 3 Podium */}
            {!searchQuery && topThree.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end py-10">
                    {/* 2nd Place */}
                    {topThree[1] && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="order-2 md:order-1"
                        >
                            <Card className="border-2 border-gray-100 shadow-lg text-center bg-gray-50/30">
                                <CardContent className="pt-8 space-y-4">
                                    <div className="relative inline-block">
                                        <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
                                            <AvatarImage src={topThree[1].avatar_url || ""} />
                                            <AvatarFallback>{topThree[1].full_name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-2 -right-2 bg-gray-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white">2</div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{topThree[1].full_name}</h3>
                                        <Badge variant="secondary">Seviye {topThree[1].level}</Badge>
                                    </div>
                                    <div className="text-2xl font-black text-gray-700">{topThree[1].xp} XP</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* 1st Place */}
                    {topThree[0] && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="order-1 md:order-2 z-10"
                        >
                            <Card className="border-4 border-yellow-400 shadow-2xl text-center bg-gradient-to-b from-yellow-50 to-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4">
                                    <Trophy className="w-8 h-8 text-yellow-500 opacity-20" />
                                </div>
                                <CardContent className="pt-10 pb-10 space-y-4">
                                    <div className="relative inline-block">
                                        <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 animate-pulse" />
                                        <Avatar className="w-28 h-28 border-4 border-yellow-400 shadow-2xl relative">
                                            <AvatarImage src={topThree[0].avatar_url || ""} />
                                            <AvatarFallback>{topThree[0].full_name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white text-lg">1</div>
                                    </div>
                                    <div>
                                        <h2 className="font-black text-2xl">{topThree[0].full_name}</h2>
                                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">ALTIN KAŞİF</Badge>
                                    </div>
                                    <div className="text-4xl font-black text-yellow-600 drop-shadow-sm">{topThree[0].xp} XP</div>
                                    <div className="flex items-center justify-center gap-2 text-yellow-700 text-sm font-bold">
                                        Level {topThree[0].level}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* 3rd Place */}
                    {topThree[2] && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="order-3"
                        >
                            <Card className="border-2 border-orange-100 shadow-lg text-center bg-orange-50/10">
                                <CardContent className="pt-8 space-y-4">
                                    <div className="relative inline-block">
                                        <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
                                            <AvatarImage src={topThree[2].avatar_url || ""} />
                                            <AvatarFallback>{topThree[2].full_name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-2 -right-2 bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white">3</div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{topThree[2].full_name}</h3>
                                        <Badge variant="secondary">Seviye {topThree[2].level}</Badge>
                                    </div>
                                    <div className="text-2xl font-black text-amber-700">{topThree[2].xp} XP</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            )}

            {/* List Table */}
            <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Sıralama</CardTitle>
                        <div className="text-sm text-muted-foreground font-medium flex items-center gap-4">
                            <span className="flex items-center gap-1"><Target className="w-4 h-4" /> Hedef: Zirve</span>
                            <span className="flex items-center gap-1"><Flame className="w-4 h-4" /> Aktif Kaşifler</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Kaşif</th>
                                    <th className="px-6 py-4">Seviye</th>
                                    <th className="px-6 py-4 text-right">Toplam XP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {others.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            {getRankIcon(searchQuery ? index : index + 3)}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10 border-2 border-white shadow-sm transition-transform group-hover:scale-110">
                                                    <AvatarImage src={user.avatar_url || ""} />
                                                    <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{user.full_name}</span>
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 italic">
                                                        <TrendingUp className="w-3 h-3" /> Yükselişte
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5 w-24">
                                                <div className="flex items-center justify-between text-[10px] font-bold">
                                                    <span>LVL {user.level}</span>
                                                    <span className="text-muted-foreground">{Math.floor(((user.xp % 500) / 500) * 100)}%</span>
                                                </div>
                                                <Progress value={(user.xp % 500) / 5} className="h-1.5 bg-gray-100" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-black text-gray-800 text-lg">{user.xp}</span>
                                            <span className="text-[10px] text-gray-400 ml-1">XP</span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredUsers.length === 0 && (
                        <div className="py-20 text-center text-muted-foreground italic">
                            Eşleşen kaşif bulunamadı.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Motivation Section */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-indigo-600 text-white border-0 shadow-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Zirveye Nasıl Çıkılır?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 relative z-10">
                        <div className="flex items-start gap-3">
                            <div className="p-1 bg-white/20 rounded-md mt-1 font-bold text-xs">+10</div>
                            <p className="text-sm">Sokratik AI ile sohbet ederek her mesajda XP kazan.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-1 bg-white/20 rounded-md mt-1 font-bold text-xs">+100</div>
                            <p className="text-sm">Ödevlerini zamanında teslim ederek büyük puanı kap!</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-1 bg-white/20 rounded-md mt-1 font-bold text-xs">+250</div>
                            <p className="text-sm">Arkadaşını davet et, ikiniz de kazanın.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-1 bg-white/20 rounded-md mt-1 font-bold text-xs">+250</div>
                            <p className="text-sm">Öğretmenden tam not al ve sıralamada zıpla.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-amber-100 border-amber-200 text-amber-900 border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle>Günün Sözü</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <blockquote className="italic text-lg font-medium leading-relaxed">
                            "Eğitim, dünyayı değiştirmek için kullanabileceğiniz en güçlü silahtır. Sen de bir EdusonEX kahramanısın!"
                        </blockquote>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
