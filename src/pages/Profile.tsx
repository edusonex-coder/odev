import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User, Settings, LogOut, Trophy, Flame, Star, ChevronRight,
  BookOpen, Loader2, Edit2, Save, X, ShieldCheck, Copy, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earned?: boolean;
}

export default function Profile() {
  const { profile, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [gradeLevel, setGradeLevel] = useState(profile?.grade_level?.toString() || "");
  const [uploading, setUploading] = useState(false);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [badgesLoading, setBadgesLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (profile?.id) {
      fetchBadges();
    }
  }, [profile?.id]);

  const fetchBadges = async () => {
    try {
      setBadgesLoading(true);

      // 1. Tüm mevcut rozetleri çek
      const { data: allBadges, error: badgesError } = await supabase
        .from('badges')
        .select('*');

      if (badgesError) throw badgesError;

      // 2. Kullanıcının kazandığı rozetleri çek
      const { data: userBadges, error: userBadgesError } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', profile?.id);

      if (userBadgesError) throw userBadgesError;

      const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id));

      // 3. Rozetleri birleştir
      const combinedBadges = (allBadges || []).map(b => ({
        ...b,
        earned: earnedBadgeIds.has(b.id)
      }));

      setBadges(combinedBadges);
    } catch (error: any) {
      console.error("Badge fetch error:", error);
    } finally {
      setBadgesLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setUploading(true);
    try {
      if (!profile?.id) return;

      const updates = {
        full_name: fullName,
        grade_level: parseInt(gradeLevel) || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Profil güncellendi",
        description: "Değişiklikler başarıyla kaydedildi.",
      });
      setIsEditing(false);
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Profil yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <SEO title="Profilim" />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile Card */}
        <div className="bg-card rounded-3xl p-8 border shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 -z-10" />

          <div className="relative inline-block mx-auto mb-4">
            <Avatar className="w-28 h-28 border-4 border-background shadow-xl">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-black">
                {profile?.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-1 right-1 rounded-full h-10 w-10 shadow-lg border-2 border-background hover:scale-110 transition-transform"
                  onClick={() => {
                    setFullName(profile?.full_name || "");
                    setGradeLevel(profile?.grade_level?.toString() || "");
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Profili Düzenle</DialogTitle>
                  <DialogDescription>
                    Profil bilgilerinizi buradan güncelleyebilirsiniz.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input
                      id="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  {profile?.role === 'student' && (
                    <div className="grid gap-2">
                      <Label htmlFor="grade">Sınıf Seviyesi</Label>
                      <Select value={gradeLevel} onValueChange={setGradeLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sınıf seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(12)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}. Sınıf
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>İptal</Button>
                  <Button onClick={handleUpdateProfile} disabled={uploading} className="shadow-glow">
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Kaydediliyor
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Kaydet
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight">{profile?.full_name || "EdusonEX Kaşifi"}</h2>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-primary/20 bg-primary/5 text-primary">
                {profile?.role === 'student' ? `${profile?.grade_level || '?'} . Sınıf` :
                  profile?.role === 'teacher' ? 'Eğitmen' :
                    profile?.role === 'parent' ? 'Veli' : 'Yönetici'}
              </Badge>
              {profile?.role === 'student' && (
                <Badge className="text-[10px] uppercase font-bold tracking-widest bg-accent shadow-sm">
                  Seviye {profile?.level || 1}
                </Badge>
              )}
            </div>
          </div>

          {profile?.role === 'student' && (
            <div className="grid grid-cols-3 gap-2 mt-8 max-w-sm mx-auto">
              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                <p className="text-xl font-black text-accent">{profile?.streak || 0}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">🔥 Seri</p>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                <p className="text-xl font-black text-primary">{profile?.xp || 0}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">⭐ XP</p>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                <p className="text-xl font-black text-slate-800">28</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Çözülen</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Parent Access Code (Only for students) */}
      {profile?.role === 'student' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="border-accent/20 bg-accent/[0.02] overflow-hidden rounded-2xl border-dashed">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-black flex items-center gap-2 text-accent uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                Veli Erişim Kodu
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white border border-accent/20 rounded-xl p-3 font-mono text-center text-xl font-black tracking-[0.3em] text-accent shadow-inner">
                  {profile?.parent_access_code || '------'}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-14 w-14 rounded-xl border-accent/20 hover:bg-accent/10 transition-colors"
                  onClick={() => {
                    if (profile?.parent_access_code) {
                      navigator.clipboard.writeText(profile.parent_access_code);
                      toast({
                        title: "Kod kopyalandı",
                        description: "Veli erişim kodu panoya kopyalandı.",
                      });
                    }
                  }}
                >
                  <Copy className="w-5 h-5 text-accent" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Level Progress (Only for students) */}
      {profile?.role === 'student' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 border shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="space-y-0.5">
              <h4 className="font-black text-sm uppercase tracking-tight">Akademik İlerleme</h4>
              <p className="text-[10px] text-muted-foreground font-medium">Sıradaki seviye için {1000 - ((profile?.xp || 0) % 1000)} XP daha lazım!</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-primary">LVL {profile?.level || 1}</span>
            </div>
          </div>
          <div className="relative">
            <Progress value={((profile?.xp || 0) % 1000) / 10} className="h-3 bg-slate-100" />
            <div className="absolute -top-1 left-[calc(10%)] w-0.5 h-5 bg-primary/20" />
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>{profile?.xp || 0} XP</span>
            <span>{(profile?.level || 1) * 1000} XP</span>
          </div>
        </motion.div>
      )}

      {/* Badges System (Real Integration) */}
      {profile?.role === 'student' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-base uppercase tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" /> Başarı Rozetleri
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">
              {badges.filter(b => b.earned).length} / {badges.length}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {badgesLoading ? (
              // Badge Skeletons
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-200 animate-pulse h-24" />
              ))
            ) : (
              badges.map((b) => (
                <motion.div
                  key={b.id}
                  whileHover={b.earned ? { scale: 1.05 } : {}}
                  className={`bg-white rounded-2xl p-4 border shadow-sm text-center relative group transition-all duration-300 ${!b.earned ? "grayscale opacity-30 hover:opacity-50" : "hover:shadow-md border-primary/10"}`}
                >
                  <div className={`text-3xl mb-1 transition-transform duration-500 ${b.earned ? "group-hover:rotate-12" : ""}`}>
                    {b.icon}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-tight leading-tight">{b.name}</p>

                  {!b.earned && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/60 backdrop-blur-[1px] rounded-2xl">
                      <p className="text-[8px] font-bold px-2 text-slate-600">{b.description}</p>
                    </div>
                  )}

                  {b.earned && (
                    <div className="absolute -top-1 -right-1">
                      <div className="bg-green-500 text-white p-0.5 rounded-full shadow-sm">
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {badges.length === 0 && !badgesLoading && (
            <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed text-muted-foreground text-xs italic">
              Henüz rozet sistemi tanımlanmamış.
            </div>
          )}
        </motion.div>
      )}

      {/* Menu Items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <button
          onClick={() => navigate('/dashboard/settings')}
          className="w-full flex items-center justify-between p-4 bg-card rounded-xl border hover:bg-secondary/50 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">Ayarlar</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        <button
          onClick={() => toast({
            title: "Yakında Geliyor! 🚀",
            description: "Abonelik özellikleri üzerinde çalışıyoruz.",
          })}
          className="w-full flex items-center justify-between p-4 bg-card rounded-xl border hover:bg-secondary/50 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">Abonelik</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-between p-4 bg-card rounded-xl border hover:bg-destructive/5 border-destructive/20 transition-colors duration-200 group"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-destructive group-hover:text-destructive" />
            <span className="text-sm font-medium text-destructive group-hover:text-destructive">Çıkış Yap</span>
          </div>
          <ChevronRight className="w-4 h-4 text-destructive/50 group-hover:text-destructive" />
        </button>
      </motion.div>
    </div>
  );
}
