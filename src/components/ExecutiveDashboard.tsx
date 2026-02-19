import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
    Shield, TrendingUp, DollarSign, Zap, Activity, Users,
    ChevronRight, AlertCircle, CheckCircle2, LayoutDashboard, GraduationCap, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExecutiveDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [growth, setGrowth] = useState<any>([]);
    const [tenants, setTenants] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // 1. AI Financial Dashboard
            const { data: finData } = await supabase
                .from('ceo_financial_dashboard')
                .select('*');

            // 2. Growth metrics (ADS/CAMPAIGNS)
            const { data: growthData } = await supabase
                .from('ceo_growth_metrics')
                .select('*');

            // 3. Tenants (School Management)
            const { data: tenantData } = await supabase
                .from('tenants')
                .select('*')
                .order('created_at', { ascending: false });

            setStats(finData);
            setGrowth(growthData || []);
            setTenants(tenantData || []);
        } catch (error) {
            console.error('Stats fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans selection:bg-indigo-500/30">
            {/* Header - Glassmorphism */}
            <header className="flex justify-between items-center mb-12 backdrop-blur-md bg-white/5 p-6 rounded-2xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                        <LayoutDashboard className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Edusonex OS <span className="text-sm font-medium text-indigo-400 align-top ml-2 px-2 py-0.5 rounded-full border border-indigo-400/30">v2.1</span>
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                            Yapay Zeka Organizasyonu - Başkanlık Paneli
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Sistem Durumu</p>
                        <p className="text-emerald-400 font-mono text-sm">AKTİF • %99.9 Uptime</p>
                    </div>
                    <div className="bg-white/5 p-2 rounded-full border border-white/10">
                        <Shield className="w-6 h-6 text-indigo-400" />
                    </div>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { icon: <DollarSign />, label: 'Top. Gelir', value: `$${stats?.reduce((acc: any, curr: any) => acc + curr.total_revenue_usd, 0).toFixed(2) || '0.00'}`, trend: '+25%', color: 'emerald' },
                    { icon: <Activity />, label: 'Brüt Kar (Margin)', value: `%${stats?.reduce((acc: any, curr: any) => acc + curr.total_revenue_usd, 0) > 0 ? (100 * (1 - (stats?.reduce((acc: any, curr: any) => acc + curr.total_cost_usd, 0) / stats?.reduce((acc: any, curr: any) => acc + curr.total_revenue_usd, 0)))).toFixed(1) : '0'}`, trend: 'Sağlıklı', color: 'indigo' },
                    { icon: <Zap />, label: 'AI İşlem/Cost', value: `$${stats?.reduce((acc: any, curr: any) => acc + curr.total_cost_usd, 0).toFixed(2) || '0.00'}`, trend: '-5%', color: 'purple' },
                    { icon: <Users />, label: 'Top. Dönüşüm', value: growth?.reduce((acc: any, curr: any) => acc + curr.total_conversions, 0).toLocaleString() || '0', trend: '+45', color: 'blue' }
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="backdrop-blur-md bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                    >
                        <div className={`p-3 bg-${item.color}-500/10 text-${item.color}-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                            {React.cloneElement(item.icon as React.ReactElement, { className: 'w-6 h-6' })}
                        </div>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{item.label}</p>
                        <div className="flex items-end gap-3 mt-2">
                            <h2 className="text-2xl font-bold font-mono text-white">{item.value}</h2>
                            <span className={`text-[10px] font-bold mb-1 px-1.5 py-0.5 rounded-full ${item.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {item.trend}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cost Analysis Chart */}
                <div className="lg:col-span-2 backdrop-blur-md bg-white/5 p-8 rounded-3xl border border-white/10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <DollarSign className="w-32 h-32 text-indigo-500" />
                    </div>
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-400" /> Birim Ekonomisi (Revenue vs AI Cost)
                        </h3>
                    </div>
                    <div className="h-[300px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="feature_name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => val.length > 10 ? val.substring(0, 10) + '...' : val} />
                                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Bar dataKey="total_revenue_usd" name="Gelir" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="total_cost_usd" name="Maliyet" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Agent Status */}
                <div className="backdrop-blur-md bg-white/5 p-8 rounded-3xl border border-white/10">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Operasyonel Durum
                    </h3>
                    <div className="space-y-6">
                        {[
                            { name: 'CMO (Growth)', status: 'Çalışıyor', health: 98, color: 'indigo' },
                            { name: 'ADS Commander', status: 'Optimize Ediliyor', health: 92, color: 'purple' },
                            { name: 'CFO (Finance)', status: 'Aktif', health: 100, color: 'emerald' },
                            { name: 'CTO (DevOps)', status: 'Yükleniyor', health: 88, color: 'amber' }
                        ].map((agent, idx) => (
                            <div key={idx} className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-slate-300">{agent.name}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">{agent.status}</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${agent.health}%` }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                        className={`h-full bg-${agent.color}-500 rounded-full`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Growth Analysis Chart */}
                <div className="lg:col-span-3 backdrop-blur-md bg-white/5 p-8 rounded-3xl border border-white/10 mt-8">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-indigo-300">
                        <Users className="w-5 h-5" /> Pazarlama & Büyüme (CMO Insights)
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={growth || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                                <XAxis dataKey="platform" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                />
                                <Bar dataKey="total_conversions" name="Dönüşüm" fill="#818cf8" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="cac" name="CAC ($)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* School & Tenant Management */}
                <div className="lg:col-span-3 backdrop-blur-md bg-white/5 p-8 rounded-3xl border border-white/10 mt-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
                            <GraduationCap className="w-5 h-5" /> B2B Okul & Kurum Yönetimi
                        </h3>
                        <button className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                            Yeni Kurum Ekle <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase tracking-widest">
                                    <th className="pb-4 font-semibold">Kurum Adı</th>
                                    <th className="pb-4 font-semibold">Slug / Domain</th>
                                    <th className="pb-4 font-semibold">AI Kimlik</th>
                                    <th className="pb-4 font-semibold">Durum</th>
                                    <th className="pb-4 font-semibold text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {tenants.map((t: any) => (
                                    <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                                                    {t.logo_url ? <img src={t.logo_url} className="w-5 h-5" /> : <GraduationCap className="w-4 h-4 text-slate-500" />}
                                                </div>
                                                <span className="font-bold text-slate-200">{t.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 font-mono text-xs text-slate-400">
                                            {t.slug} • {t.domain || '-'}
                                        </td>
                                        <td className="py-4">
                                            <div className="max-w-[200px] truncate text-xs text-slate-500 italic">
                                                {t.ai_personality_prompt || 'Varsayılan OdevGPT'}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">AKTİF</span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <button className="p-2 text-slate-500 hover:text-white transition-colors">
                                                <Settings className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer - Ethics Badge */}
            <footer className="mt-12 flex justify-center">
                <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-100 italic">"Hakikat bizim kılavuzumuzdur. Etik ve Şeffaf Yapay Zeka Yönetimi."</span>
                </div>
            </footer>
        </div>
    );
};

export default ExecutiveDashboard;
