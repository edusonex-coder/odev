import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Coins,
    Zap,
    Clock,
    BarChart3,
    TrendingDown,
    BrainCircuit,
    AlertTriangle
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface LedgerData {
    feature_name: string;
    model: string;
    total_tokens: number;
    total_cost_usd: number;
    avg_latency: number;
    interaction_count: number;
}

export default function AILedger({ tenantId }: { tenantId?: string }) {
    const [data, setData] = useState<LedgerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        fetchLedger();
    }, [tenantId]);

    const fetchLedger = async () => {
        try {
            setLoading(true);
            let query = supabase.from('ceo_financial_dashboard').select('*');

            if (tenantId === 'individual') {
                query = query.is('tenant_id', null);
            } else if (tenantId && tenantId !== 'all') {
                query = query.eq('tenant_id', tenantId);
            }

            const { data: ledgerData, error } = await query;

            if (error) throw error;

            setData(ledgerData || []);

            const total = (ledgerData || []).reduce((acc, curr) => acc + (Number(curr.total_cost_usd) || 0), 0);
            setTotalCost(total);
        } catch (err) {
            console.error("Ledger fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-amber-900">Toplam AI Maliyeti</CardTitle>
                        <Coins className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-700">${totalCost.toFixed(4)}</div>
                        <p className="text-xs text-amber-600/80">OdevGPT toplam operasyonel maliyeti</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-blue-900">Toplam Token</CardTitle>
                        <Zap className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">
                            {data.reduce((acc, curr) => acc + curr.total_tokens, 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-blue-600/80">Tüketilen toplam zeka birimi</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-900">Ort. Gecikme</CardTitle>
                        <Clock className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700">
                            {data.length > 0
                                ? (data.reduce((acc, curr) => acc + curr.avg_latency, 0) / data.length).toFixed(0)
                                : 0} ms
                        </div>
                        <p className="text-xs text-emerald-600/80">AI servisleri ortalama yanıt hızı</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" /> Modellere Göre Maliyet
                        </CardTitle>
                        <CardDescription>Hangi AI modeli ne kadar "yakıyor"?</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="model" fontSize={10} tick={{ fill: '#666' }} />
                                <YAxis fontSize={10} tickFormatter={(v) => `$${v.toFixed(3)}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
                                    formatter={(value: number) => [`$${value.toFixed(4)}`, 'Maliyet']}
                                />
                                <Bar dataKey="total_cost_usd" radius={[4, 4, 0, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-primary" /> Özellik Bazlı Kullanım
                        </CardTitle>
                        <CardDescription>En çok kullanılan AI özellikleri</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.sort((a, b) => b.interaction_count - a.interaction_count).slice(0, 5).map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none capitalize">{(item.feature_name || 'Bilinmeyen').replace(/_/g, ' ')}</p>
                                        <p className="text-xs text-muted-foreground">{item.model}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">{item.interaction_count} istek</p>
                                        <p className="text-[10px] text-muted-foreground">${item.total_cost_usd.toFixed(4)}</p>
                                    </div>
                                </div>
                            ))}
                            {data.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                    <AlertTriangle className="w-10 h-10 mb-2 opacity-20" />
                                    <p>Henüz AI kullanım verisi oluşmadı.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm overflow-hidden border-indigo-100">
                <CardHeader className="bg-indigo-50/50">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-indigo-600" /> Detaylı Maliyet Defteri
                    </CardTitle>
                </CardHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Özellik</TableHead>
                            <TableHead>Model</TableHead>
                            <TableHead className="text-right">İstek Sayısı</TableHead>
                            <TableHead className="text-right">Toplam Token</TableHead>
                            <TableHead className="text-right">Maliyet (USD)</TableHead>
                            <TableHead className="text-right">Ort. Gecikme</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell className="font-medium capitalize">{(row.feature_name || 'Bilinmeyen').replace(/_/g, ' ')}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-normal text-[10px]">
                                        {row.model}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-semibold">{row.interaction_count}</TableCell>
                                <TableCell className="text-right text-muted-foreground">{row.total_tokens.toLocaleString()}</TableCell>
                                <TableCell className="text-right font-mono text-emerald-600 font-bold">
                                    ${row.total_cost_usd.toFixed(4)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={row.avg_latency > 2000 ? "destructive" : "secondary"} className="text-[10px]">
                                        {row.avg_latency} ms
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
