import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Lock,
    Bell,
    Shield,
    Smartphone,
    CheckCircle2,
    Loader2,
    ChevronRight,
    Eye,
    EyeOff,
    AlertCircle,
    Copy,
    Users,
    BookOpen,
    GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import SEO from "@/components/SEO";

export default function Settings() {
    const { profile, user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState(profile?.full_name || "");

    // Notification Preferences State
    const [notifications, setNotifications] = useState({
        question_answered: profile?.notification_preferences?.question_answered ?? true,
        weekly_report: profile?.notification_preferences?.weekly_report ?? false,
        new_tasks: profile?.notification_preferences?.new_tasks ?? true,
        student_activity: profile?.notification_preferences?.student_activity ?? true,
        assignment_graded: profile?.notification_preferences?.assignment_graded ?? true
    });
    const [notifLoading, setNotifLoading] = useState(false);

    // Load preferences from profile when it changes
    useEffect(() => {
        if (profile?.notification_preferences) {
            setNotifications({
                question_answered: profile.notification_preferences.question_answered ?? true,
                weekly_report: profile.notification_preferences.weekly_report ?? false,
                new_tasks: profile.notification_preferences.new_tasks ?? true,
                student_activity: profile.notification_preferences.student_activity ?? true,
                assignment_graded: profile.notification_preferences.assignment_graded ?? true
            });
        }
        if (profile?.full_name) {
            setFullName(profile.full_name);
        }
    }, [profile]);

    // Password Change State
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

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

    const handleToggleNotification = async (key: keyof typeof notifications) => {
        const newValue = !notifications[key];
        setNotifications(prev => ({ ...prev, [key]: newValue }));
        setNotifLoading(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    notification_preferences: {
                        ...notifications,
                        [key]: newValue
                    }
                })
                .eq('id', user?.id);

            if (error) throw error;

            toast({
                title: "Tercih Güncellendi",
                description: `Bildirim ayarı ${newValue ? 'açıldı' : 'kapatıldı'}.`,
            });
        } catch (error: any) {
            setNotifications(prev => ({ ...prev, [key]: !newValue }));
            toast({
                title: "Hata",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setNotifLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            toast({
                title: "Hata",
                description: "Tüm alanları doldurunuz.",
                variant: "destructive",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast({
                title: "Hata",
                description: "Yeni şifreler eşleşmiyor.",
                variant: "destructive",
            });
            return;
        }

        if (newPassword.length < 6) {
            toast({
                title: "Hata",
                description: "Şifre en az 6 karakter olmalı.",
                variant: "destructive",
            });
            return;
        }

        setPasswordLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            toast({
                title: "Şifre Değiştirildi! ✨",
                description: "Şifreniz başarıyla güncellendi.",
            });

            setNewPassword("");
            setConfirmPassword("");
            setPasswordDialogOpen(false);
        } catch (error: any) {
            toast({
                title: "Hata",
                description: error.message || "Şifre değiştirilemedi.",
                variant: "destructive",
            });
        } finally {
            setPasswordLoading(false);
        }
    };

    const copyAccessCode = () => {
        if (profile?.parent_access_code) {
            navigator.clipboard.writeText(profile.parent_access_code);
            toast({
                title: "Kopyalandı! 📋",
                description: "Erişim kodu panoya kopyalandı.",
            });
        }
    };

    // Rol bazlı bildirim seçenekleri
    const getNotificationOptions = () => {
        const role = profile?.role;

        if (role === 'student') {
            return [
                {
                    key: 'question_answered' as keyof typeof notifications,
                    icon: Smartphone,
                    title: 'Soru Yanıtlandı',
                    description: 'Sorduğun soru yapay zeka veya öğretmen tarafından yanıtlandığında bildir.'
                },
                {
                    key: 'assignment_graded' as keyof typeof notifications,
                    icon: BookOpen,
                    title: 'Ödev Notlandı',
                    description: 'Öğretmen ödevini notlandırdığında bildir.'
                },
                {
                    key: 'new_tasks' as keyof typeof notifications,
                    icon: Bell,
                    title: 'Yeni Görevler',
                    description: 'Sana özel yeni görevler eklendiğinde bildir.'
                }
            ];
        } else if (role === 'parent') {
            return [
                {
                    key: 'student_activity' as keyof typeof notifications,
                    icon: Users,
                    title: 'Öğrenci Aktivitesi',
                    description: 'Öğrencin soru sorduğunda veya ödev teslim ettiğinde bildir.'
                },
                {
                    key: 'weekly_report' as keyof typeof notifications,
                    icon: Bell,
                    title: 'Haftalık Rapor',
                    description: 'Performans özetini her pazar akşamı al.'
                },
                {
                    key: 'assignment_graded' as keyof typeof notifications,
                    icon: BookOpen,
                    title: 'Ödev Notlandı',
                    description: 'Öğrencinin ödevi notlandığında bildir.'
                }
            ];
        } else if (role === 'teacher') {
            return [
                {
                    key: 'question_answered' as keyof typeof notifications,
                    icon: Smartphone,
                    title: 'Yeni Sorular',
                    description: 'Öğrenciler yeni soru sorduğunda bildir.'
                },
                {
                    key: 'new_tasks' as keyof typeof notifications,
                    icon: GraduationCap,
                    title: 'Ödev Teslimi',
                    description: 'Öğrenciler ödev teslim ettiğinde bildir.'
                }
            ];
        }

        // Admin veya diğer roller için genel ayarlar
        return [
            {
                key: 'question_answered' as keyof typeof notifications,
                icon: Smartphone,
                title: 'Sistem Bildirimleri',
                description: 'Önemli sistem olaylarında bildir.'
            }
        ];
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <SEO title="Ayarlar" />
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
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold">{profile?.full_name}</h3>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Mail className="w-3 h-3" /> {user?.email}
                                        </p>
                                        <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase mt-2">
                                            {profile?.role === 'student' ? 'Öğrenci' :
                                                profile?.role === 'teacher' ? 'Öğretmen' :
                                                    profile?.role === 'parent' ? 'Veli' :
                                                        profile?.role === 'admin' ? 'Admin' : profile?.role}
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

                                {/* Öğrenci için Veli Erişim Kodu */}
                                {profile?.role === 'student' && profile?.parent_access_code && (
                                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-sm flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-purple-600" />
                                                    Veli Erişim Kodu
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Velinin seni takip edebilmesi için bu kodu paylaş.
                                                </p>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <code className="px-3 py-2 bg-white rounded-lg font-mono text-lg font-bold text-purple-600 border-2 border-purple-200">
                                                        {profile.parent_access_code}
                                                    </code>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={copyAccessCode}
                                                        className="gap-1"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                        Kopyala
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                            {getNotificationOptions().map((option) => {
                                const Icon = option.icon;
                                return (
                                    <div key={option.key} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex gap-3">
                                            <div className="text-primary mt-0.5"><Icon className="w-5 h-5" /></div>
                                            <div>
                                                <p className="font-medium text-sm">{option.title}</p>
                                                <p className="text-xs text-muted-foreground">{option.description}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleToggleNotification(option.key)}
                                            disabled={notifLoading}
                                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notifications[option.key] ? 'bg-primary' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifications[option.key] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>
                                );
                            })}
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
                            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between h-14 rounded-xl hover:bg-red-50">
                                        <div className="flex items-center gap-3">
                                            <Lock className="w-5 h-5 text-red-500" />
                                            <span className="font-medium">Şifre Değiştir</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Şifre Değiştir</DialogTitle>
                                        <DialogDescription>
                                            Hesabınızı korumak için şifrenizi düzenli olarak değiştirin.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">Yeni Şifre</Label>
                                            <div className="relative">
                                                <Input
                                                    id="new-password"
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Yeni şifreniz (en az 6 karakter)"
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-2.5"
                                                >
                                                    {showNewPassword ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Şifreyi Onayla</Label>
                                            <Input
                                                id="confirm-password"
                                                type={showPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Şifrenizi tekrar girin"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setPasswordDialogOpen(false)}
                                            disabled={passwordLoading}
                                        >
                                            İptal
                                        </Button>
                                        <Button
                                            onClick={handleChangePassword}
                                            disabled={passwordLoading}
                                        >
                                            {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                            Şifre Değiştir
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
