import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, AlertTriangle, CheckCircle2, Server } from "lucide-react";

interface AIUsageStats {
    provider: string;
    model: string;
    total_requests: number;
    total_tokens: number;
    tokens_last_24h: number;
    failed_requests: number;
    success_requests: number;
}

export default function AIUsageMonitor() {
    const [stats, setStats] = useState<AIUsageStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAIStats();
        const sub = supabase
            .channel('ai_usage_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ai_usage_logs' }, () => {
                fetchAIStats();
            })
            .subscribe();

        return () => { supabase.removeChannel(sub); };
    }, []);

    const fetchAIStats = async () => {
        try {
            const { data, error } = await supabase.from("ai_usage_summary").select("*");
            if (error) throw error;
            setStats(data || []);
        } catch (err) {
            console.error("AI Stats fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const getHealthStatus = (failed: number, total: number) => {
        const rate = total > 0 ? (failed / total) * 100 : 0;
        if (rate > 15) return { label: 'Kritik', color: 'text-red-600 bg-red-50', icon: AlertTriangle };
        if (rate > 5) return { label: 'Uyarı', color: 'text-amber-600 bg-amber-50', icon: AlertTriangle };
        return { label: 'Sağlıklı', color: 'text-green-600 bg-green-50', icon: CheckCircle2 };
    };

    if (loading) return <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">Sistem sağlığı kontrol ediliyor...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" /> AI Altyapı Sağlığı
                    </h3>
                    <p className="text-xs text-muted-foreground">Sağlayıcı bazlı anlık token ve hata takibi.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((s, idx) => {
                    const health = getHealthStatus(s.failed_requests, s.total_requests);
                    const HealthIcon = health.icon;

                    return (
                        <Card key={idx} className="overflow-hidden border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3 bg-muted/20">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <Server className="w-4 h-4 text-primary" />
                                        <div>
                                            <CardTitle className="text-sm font-bold">{s.provider}</CardTitle>
                                            <CardDescription className="text-[10px]">{s.model}</CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={`text-[10px] font-bold ${health.color} border-none`}>
                                        <HealthIcon className="w-3 h-3 mr-1" /> {health.label}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Son 24 Saat Token</p>
                                        <p className="text-xl font-black text-primary flex items-center gap-1">
                                            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            {s.tokens_last_24h.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Başarı Oranı</p>
                                        <p className="font-bold text-sm">
                                            %{Math.round(((s.success_requests) / (s.total_requests || 1)) * 100)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold mx-0.5">
                                        <span>Hata Payı</span>
                                        <span className="text-red-500">{s.failed_requests} Hata</span>
                                    </div>
                                    <Progress value={(s.failed_requests / (s.total_requests || 1)) * 100} className="h-1 bg-gray-100" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
