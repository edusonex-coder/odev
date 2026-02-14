import { useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Lock,
    Bell,
    Shield,
    Globe,
    Smartphone,
    CheckCircle2,
    Loader2,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function Settings() {
    const { profile, user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState(profile?.full_name || "");

    const handleUpdateProfile = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ full_name: fullName })
                .eq('id', user.id);

            if (error) throw error;

            toast({
                title: "Profil Güncellendi! ✨",
                description: "Değişikliklerin başarıyla kaydedildi.",
            });
        } catch (error: any) {
            toast({
                title: "Hata",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
                <p className="text-muted-foreground mt-1">Hesap ayarlarını ve tercihlerini buradan yönetebilirsin.</p>
            </div>

            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="bg-white border p-1 rounded-xl h-12">
                    <TabsTrigger value="account" className="rounded-lg gap-2">
                        <User className="w-4 h-4" /> Hesap
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-lg gap-2">
                        <Bell className="w-4 h-4" /> Bildirimler
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-lg gap-2">
                        <Shield className="w-4 h-4" /> Güvenlik
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profil Bilgileri</CardTitle>
                                <CardDescription>Adını ve profil fotoğrafını buradan değiştirebilirsin.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="relative group">
                                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold overflow-hidden border-2 border-primary/20">
                                            {profile?.avatar_url ? (
                                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                profile?.full_name?.charAt(0) || "U"
                                            )}
                                        </div>
                                        <button className="absolute inset-0 bg-black/40 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">Değiştir</button>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold">{profile?.full_name}</h3>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Mail className="w-3 h-3" /> {user?.email}
                                        </p>
                                        <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase mt-2">
                                            {profile?.role === 'student' ? 'Öğrenci' : 'Öğretmen'}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid gap-4 max-w-md">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Ad Soyad</Label>
                                        <Input
                                            id="name"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Adın Soyadın"
                                        />
                                    </div>
                                    <Button onClick={handleUpdateProfile} disabled={loading} className="w-fit">
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                        Değişiklikleri Kaydet
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Dil ve Bölge</CardTitle>
                                <CardDescription>Uygulama dil ayarlarını buradan yapabilirsin.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <p className="font-medium">Uygulama Dili</p>
                                            <p className="text-sm text-muted-foreground">Türkçe (Varsayılan)</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bildirim Tercihleri</CardTitle>
                            <CardDescription>Hangi durumlarda bildirim almak istediğini seç.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { id: 'n1', title: 'Soru Yanıtlandı', desc: 'Sorduğun soru öğretmen tarafından yanıtlandığında bildir.', icon: <Smartphone className="w-5 h-5" />, active: true },
                                { id: 'n2', title: 'Haftalık Rapor', desc: 'Performans özetini her pazar akşamı al.', icon: <Bell className="w-5 h-5" />, active: false },
                                { id: 'n3', title: 'Yeni Görevler', desc: 'Sana özel yeni görevler eklendiğinde bildir.', icon: <Zap className="w-5 h-5" />, active: true }
                            ].map((n) => (
                                <div key={n.id} className="flex items-center justify-between p-4 border rounded-xl">
                                    <div className="flex gap-3">
                                        <div className="text-primary mt-0.5">{n.icon}</div>
                                        <div>
                                            <p className="font-medium text-sm">{n.title}</p>
                                            <p className="text-xs text-muted-foreground">{n.desc}</p>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${n.active ? 'bg-primary' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${n.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Şifre ve Güvenlik</CardTitle>
                            <CardDescription>Hesap güvenliğini buradan sağlayabilirsin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="outline" className="w-full justify-between h-14 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Lock className="w-5 h-5 text-red-500" />
                                    <span className="font-medium">Şifre Değiştir</span>
                                </div>
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                            <Button variant="outline" className="w-full justify-between h-14 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-indigo-500" />
                                    <span className="font-medium">İki Faktörlü Doğrulama (2FA)</span>
                                </div>
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Add necessary icon
function Zap(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 14.75 12 3 10 9.25H20L12 21 14 14.75H4Z" />
        </svg>
    );
}
