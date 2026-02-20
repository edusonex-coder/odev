import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User, Settings, LogOut, Trophy, Flame, Star, ChevronRight,
  BookOpen, Loader2, Edit2, Save, X, ShieldCheck, Copy, Award,
  ScrollText, Download, Share2, Verified, Sparkles
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
import { checkAndIssueCertificates } from "@/lib/certificateEngine";

interface Certificate {
  id: string;
  type: string;
  title: string;
  description: string;
  certificate_code: string;
  ai_commendation: string;
  created_at: string;
  metadata: any;
}

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
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (profile?.id) {
      fetchBadges();
      fetchCertificates();
      checkAndIssueCertificates(profile.id); // Arka planda yeni kazanım var mı kontrol et
    }
  }, [profile?.id]);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (e) {
      console.error(e);
    }
  };

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

      {/* Badges System */}
      {profile?.role === 'student' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-base uppercase tracking-tight flex items-center gap-2 text-slate-800">
              <Award className="w-5 h-5 text-indigo-500" /> Başarı Rozetleri
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">
              {badges.filter(b => b.earned).length} / {badges.length}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {badgesLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-200 animate-pulse h-24" />
              ))
            ) : (
              badges.slice(0, 8).map((b) => (
                <motion.div
                  key={b.id}
                  whileHover={b.earned ? { scale: 1.05 } : {}}
                  className={`bg-white rounded-2xl p-4 border shadow-sm text-center relative group transition-all duration-300 ${!b.earned ? "grayscale opacity-30 group-hover:opacity-100" : "hover:shadow-md border-indigo-100"}`}
                >
                  <div className={`text-3xl mb-1 transition-transform duration-500 ${b.earned ? "group-hover:rotate-12" : ""}`}>
                    {b.icon}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-tight leading-tight">{b.name}</p>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* Certificates Section (PREMIUM) */}
      {profile?.role === 'student' && certificates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-base uppercase tracking-tight flex items-center gap-2 text-slate-800">
              <Verified className="w-5 h-5 text-amber-500" /> Akademik Sertifikalar
            </h3>
            <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] font-bold">
              {certificates.length} BELGE
            </Badge>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar">
            {certificates.map((cert) => (
              <motion.div
                key={cert.id}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedCert(cert)}
                className="flex-shrink-0 w-64 snap-start cursor-pointer group"
              >
                <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-3xl border-2 border-amber-200 shadow-sm transition-all group-hover:shadow-xl group-hover:border-amber-400 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-200/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-xl" />

                  <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-amber-100 mb-4 transform group-hover:rotate-12 transition-transform">
                    <ScrollText className="w-6 h-6 text-amber-600" />
                  </div>

                  <h4 className="font-black text-sm text-slate-800 mb-1 leading-tight">{cert.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-2 mb-4">{cert.description}</p>

                  <div className="flex items-center justify-between border-t border-amber-100 pt-3">
                    <span className="text-[9px] font-mono text-amber-700 bg-amber-100/50 px-2 py-0.5 rounded leading-none">
                      {cert.certificate_code}
                    </span>
                    <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full group-hover:bg-amber-500 group-hover:text-white">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Certificate Viewer Modal */}
      <Dialog open={!!selectedCert} onOpenChange={(open) => !open && setSelectedCert(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-slate-900 border-0 rounded-3xl">
          {selectedCert && (
            <div className="relative p-1 bg-gradient-to-br from-amber-400 via-yellow-200 to-amber-600">
              <div className="bg-white rounded-[22px] p-8 md:p-12 text-center relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-amber-50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-50 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl opacity-50" />

                <div className="relative z-10 border-4 border-double border-amber-200 p-8 rounded-xl bg-white/40 backdrop-blur-sm">
                  <div className="flex justify-center mb-6">
                    <div className="bg-amber-500 p-4 rounded-full shadow-2xl ring-8 ring-amber-100">
                      <Award className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <h5 className="text-amber-600 font-black tracking-[0.2em] uppercase text-xs mb-6">BAŞARI SERTİFİKASI</h5>

                  <div className="space-y-2 mb-8">
                    <p className="text-slate-500 font-medium italic">Bu belge, üstün gayretleri neticesinde</p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">{profile?.full_name}</h3>
                    <p className="text-slate-500 font-medium italic">tarafından kazanılmıştır.</p>
                  </div>

                  <div className="py-6 border-y border-amber-100 mb-8 px-4">
                    <h4 className="text-xl font-black text-slate-800 mb-2 uppercase">{selectedCert.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{selectedCert.description}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-amber-200 mb-8 italic text-xs text-slate-600 leading-relaxed">
                    <Sparkles className="w-3 h-3 text-amber-500 mb-1 mx-auto" />
                    "{selectedCert.ai_commendation}"
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
                    <div className="text-left">
                      <p>TARİH</p>
                      <p className="text-slate-800 font-black">{new Date(selectedCert.created_at).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div>
                      <Verified className="w-12 h-12 text-amber-500 opacity-20" />
                    </div>
                    <div className="text-right">
                      <p>DOĞRULAMA KODU</p>
                      <p className="text-amber-600 font-mono font-black">{selectedCert.certificate_code}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-center mt-8 relative z-10 no-print">
                  <Button variant="outline" className="gap-2 rounded-xl" onClick={() => window.print()}>
                    <Download className="w-4 h-4" /> İndir / Yazdır
                  </Button>
                  <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                    <Share2 className="w-4 h-4" /> Paylaş
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
