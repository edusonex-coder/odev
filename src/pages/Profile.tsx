import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Settings, LogOut, Trophy, Flame, Star, ChevronRight,
  BookOpen, Loader2, Edit2, Save, X, ShieldCheck, Copy
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
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

export default function Profile() {
  const { profile, signOut, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [gradeLevel, setGradeLevel] = useState(profile?.grade_level?.toString() || "");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SEO title="Profilim" />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-6 border text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/10 to-accent/10 -z-10" />

          <div className="relative inline-block mx-auto mb-3">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {profile?.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md"
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
                  <Button onClick={handleUpdateProfile} disabled={uploading}>
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

          <h2 className="text-xl font-bold">{profile?.full_name || "Kullanıcı"}</h2>
          <p className="text-sm text-muted-foreground capitalize">
            {profile?.role === 'student' ? `${profile?.grade_level || '?'} . Sınıf Öğrencisi` :
              profile?.role === 'teacher' ? 'Öğretmen' :
                profile?.role === 'parent' ? 'Veli' : profile?.role}
          </p>

          {profile?.role === 'student' && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="text-center">
                <p className="text-lg font-bold text-accent">{profile?.streak || 0}</p>
                <p className="text-xs text-muted-foreground">🔥 Seri</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{profile?.xp || 0}</p>
                <p className="text-xs text-muted-foreground">⭐ XP</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-lg font-bold">28</p>
                <p className="text-xs text-muted-foreground">Çözülen</p>
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
          <Card className="border-accent/20 bg-accent/5 overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent" />
                Veli Erişim Kodu
              </CardTitle>
              <CardDescription className="text-[10px]">
                Bu kodu velinizle paylaşarak ilerlemenizi takip etmesini sağlayabilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-background border rounded-lg p-2 font-mono text-center text-lg font-bold tracking-widest text-primary">
                  {profile?.parent_access_code || '------'}
                </div>
                <Button
                  size="icon"
                  variant="outline"
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
                  <Copy className="w-4 h-4" />
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
          className="bg-card rounded-xl p-4 border"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Seviye {profile?.level || 1}</span>
            <span className="text-xs text-muted-foreground">{profile?.xp || 0} / {(profile?.level || 1) * 1000} XP</span>
          </div>
          <Progress value={((profile?.xp || 0) % 1000) / 10} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">Sıradaki seviye için {1000 - ((profile?.xp || 0) % 1000)} XP kaldı</p>
        </motion.div>
      )}

      {/* Badges (Only for students) */}
      {profile?.role === 'student' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent" /> Rozetlerim
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { emoji: "🐺", name: "Matematik Kurdu", earned: true },
              { emoji: "🧪", name: "Fen Dehası", earned: true },
              { emoji: "⚡", name: "Hız Şampiyonu", earned: false },
              { emoji: "🔥", name: "Seri Avcısı", earned: false },
            ].map((b) => (
              <div
                key={b.name}
                className={`bg-card rounded-xl p-3 border text-center ${!b.earned ? "opacity-40" : ""}`}
              >
                <span className="text-2xl">{b.emoji}</span>
                <p className="text-[10px] font-medium mt-1">{b.name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Menu Items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <button className="w-full flex items-center justify-between p-4 bg-card rounded-xl border hover:bg-secondary/50 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">Ayarlar</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        <button className="w-full flex items-center justify-between p-4 bg-card rounded-xl border hover:bg-secondary/50 transition-colors duration-200">
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
