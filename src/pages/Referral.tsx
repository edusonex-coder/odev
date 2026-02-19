import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Gift, Share2, Copy, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export default function ReferralPage() {
    const { profile } = useAuth();
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    // Fetch referrals from database
    const { data: referrals, isLoading } = useQuery({
        queryKey: ['referrals', profile?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('referrals')
                .select('*, referred:profiles!referrals_referred_id_fkey(full_name, avatar_url, created_at)')
                .eq('referrer_id', profile?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!profile?.id
    });

    const referralCode = profile?.referral_code || 'DAVET-KODU';
    const shareUrl = `${window.location.origin}/signup?ref=${referralCode}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast({
            title: "Bağlantı Kopyalandı!",
            description: "Davet bağlantısı başarıyla kopyalandı. Arkadaşlarına gönderebilirsin.",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container py-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Header Card */}
                <div className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30">
                            <Gift className="w-12 h-12 text-white" />
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">Arkadaşlarını Davet Et, Birlikte Kazan!</h1>
                            <p className="text-white/80 text-lg font-medium">Davet ettiğin her arkadaşın için <span className="text-yellow-300 font-bold">250 XP</span> kazanırsın. Üstelik onlar da senin sayende hızlı bir başlangıç yapar!</p>
                        </div>
                    </div>
                </div>

                {/* Share Section */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-card p-8 rounded-3xl border shadow-sm space-y-6">
                        <div className="flex items-center gap-3 text-primary">
                            <Share2 className="w-6 h-6" />
                            <h2 className="text-xl font-bold">Davet Linkin</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-secondary/50 rounded-2xl border-2 border-dashed border-primary/20 flex items-center justify-between group">
                                <code className="text-sm font-mono font-bold text-primary truncate max-w-[200px]">
                                    {shareUrl}
                                </code>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={copyToClipboard}
                                    className="hover:bg-primary/10 transition-colors"
                                >
                                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>

                            <Button className="w-full h-14 rounded-2xl gradient-primary text-white font-bold text-lg shadow-lg" onClick={copyToClipboard}>
                                Bağlantıyı Paylaş
                            </Button>
                        </div>
                    </div>

                    <div className="bg-card p-8 rounded-3xl border shadow-sm space-y-6 flex flex-col justify-center text-center">
                        <div className="mx-auto w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-600 mb-2">
                            <Star className="w-8 h-8 fill-current" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Kazanılan Toplam Ödül</p>
                            <h3 className="text-4xl font-black text-slate-800">
                                {(referrals?.length || 0) * 250} <span className="text-xl font-bold text-slate-400">XP</span>
                            </h3>
                        </div>
                        <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {referrals?.length || 0} Davetli</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1"><Gift className="w-3 h-3" /> {referrals?.length || 0} Başarılı</span>
                        </div>
                    </div>
                </div>

                {/* Referrals List */}
                <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
                    <div className="p-6 border-b flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-500" />
                            Davet Ettiklerin
                        </h2>
                        <span className="text-xs font-bold bg-secondary px-3 py-1 rounded-full text-slate-500 leading-none">
                            Toplam {referrals?.length || 0} Kişi
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="p-12 text-center text-slate-400 italic">Yükleniyor...</div>
                    ) : referrals?.length === 0 ? (
                        <div className="p-16 text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                <Users className="w-10 h-10 text-slate-200" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-600">Henüz kimseyi davet etmedin</h3>
                                <p className="text-slate-400">İlk arkadaşını davet ederek 250 XP kazanmaya başlayabilirsin!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {referrals?.map((ref: any) => (
                                <div key={ref.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                                            {ref.referred.full_name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{ref.referred.full_name}</p>
                                            <p className="text-xs text-slate-400">{new Date(ref.created_at).toLocaleDateString('tr-TR')} tarihinde katıldı</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                                        <CheckCircle className="w-4 h-4" />
                                        +250 XP Kazandırdı
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* FAQ / Info */}
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { title: "Davet Et", text: "Özel linkini arkadaşlarına gönder.", icon: Share2 },
                        { title: "Kayıt Olsunlar", text: "Senin linkinle OdevGPT'ye katılsınlar.", icon: ArrowRight },
                        { title: "Ödül Al", text: "Her başarılı kayıt için ödülünü topla.", icon: Gift },
                    ].map((step, i) => (
                        <div key={i} className="bg-white/50 border border-dashed p-6 rounded-2xl space-y-2">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary border">
                                <step.icon className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-sm">{step.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{step.text}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
