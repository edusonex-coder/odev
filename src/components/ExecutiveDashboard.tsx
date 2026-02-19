import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
    Shield, TrendingUp, DollarSign, Zap, Activity, Users,
    ChevronRight, AlertCircle, CheckCircle2, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExecutiveDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // CEO View'dan verileri çekiyoruz (Daha önce SQL'de tanımladığımız View)
            const { data, error } = await supabase
                .from('ceo_financial_dashboard')
                .select('*');

            if (error) throw error;
            setStats(data);
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
                    { icon: <DollarSign />, label: 'Günlük Harcama', value: '$12.45', trend: '+5.2%', color: 'indigo' },
                    { icon: <Zap />, label: 'AI Karar Sayısı', value: '14,204', trend: '+12%', color: 'purple' },
                    { icon: <TrendingUp />, label: 'Dönüşüm Oranı', value: '%18.2', trend: '+2.1%', color: 'pink' },
                    { icon: <Users />, label: 'Aktif Kullanıcı', value: '1,200', trend: '+45', color: 'blue' }
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
                        <p className="text-slate-500 text-sm font-medium">{item.label}</p>
                        <div className="flex items-end gap-3 mt-2">
                            <h2 className="text-2xl font-bold font-mono">{item.value}</h2>
                            <span className={`text-xs font-bold mb-1 px-1.5 py-0.5 rounded ${item.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {item.trend}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cost Analysis Chart */}
                <div className="lg:col-span-2 backdrop-blur-md bg-white/5 p-8 rounded-3xl border border-white/10">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-400" /> Yapay Zeka Harcama Analizi
                        </h3>
                        <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none">
                            <option>Son 7 Gün</option>
                            <option>Son 30 Gün</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats || []}>
                                <defs>
                                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="feature_name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ color: '#6366f1' }}
                                />
                                <Area type="monotone" dataKey="total_cost_usd" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Agent Status */}
                <div className="backdrop-blur-md bg-white/5 p-8 rounded-3xl border border-white/10">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Ajan Operasyon Durumu
                    </h3>
                    <div className="space-y-6">
                        {[
                            { name: 'CMO (Growth)', status: 'Çalışıyor', health: 98, color: 'indigo' },
                            { name: 'ADS Commander', status: 'Optimize Ediliyor', health: 92, color: 'purple' },
                            { name: 'CFO (Finance)', status: 'Aktif', health: 100, color: 'emerald' },
                            { name: 'CS AI (L1 Support)', status: 'Hazır', health: 95, color: 'blue' },
                            { name: 'CTO (DevOps)', status: 'Sistem Yükleniyor', health: 88, color: 'amber' }
                        ].map((agent, idx) => (
                            <div key={idx} className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium">{agent.name}</span>
                                    <span className="text-xs text-slate-500">{agent.status}</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${agent.health}%` }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                        className={`h-full bg-${agent.color}-500 shadow-[0_0_10px_rgba(var(--tw-color-${agent.color}-500),0.5)]`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-3 bg-indigo-500 hover:bg-indigo-600 transition-colors rounded-xl font-bold flex items-center justify-center gap-2 group">
                        Tüm Organizasyonu Denetle <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
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
