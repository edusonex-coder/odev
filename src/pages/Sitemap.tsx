import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  Building2, 
  Eye, 
  LayoutDashboard,
  MessageSquare,
  History as HistoryIcon,
  Settings,
  Trophy,
  Share2,
  BookOpen,
  PlusCircle,
  BarChart3,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Sitemap = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "0. Ziyaretçi / Genel (Guest)",
      icon: <Eye className="w-5 h-5 text-blue-400" />,
      color: "border-blue-500/50 bg-blue-500/5",
      pages: [
        { name: "Ana Sayfa (Landing)", path: "/", icon: <ExternalLink className="w-4 h-4" /> },
        { name: "Giriş Yap", path: "/login", icon: <User className="w-4 h-4" /> },
        { name: "Kayıt Ol", path: "/signup", icon: <PlusCircle className="w-4 h-4" /> },
        { name: "Blog Listesi", path: "/blog", icon: <BookOpen className="w-4 h-4" /> },
        { name: "404 Sayfası", path: "/not-found-test", icon: <ShieldCheck className="w-4 h-4" /> },
      ],
    },
    {
      title: "1. Öğrenci (Student)",
      icon: <GraduationCap className="w-5 h-5 text-green-400" />,
      color: "border-green-500/50 bg-green-500/5",
      pages: [
        { name: "Öğrenci Paneli", path: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { name: "Soru Sor (AI)", path: "/dashboard/ask", icon: <PlusCircle className="w-4 h-4" /> },
        { name: "AI Chat / Çözüm", path: "/dashboard/chat", icon: <MessageSquare className="w-4 h-4" /> },
        { name: "Soru Geçmişi", path: "/dashboard/history", icon: <HistoryIcon className="w-4 h-4" /> },
        { name: "Profilim", path: "/dashboard/profile", icon: <User className="w-4 h-4" /> },
        { name: "Ayarlar", path: "/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
        { name: "Liderlik Tablosu", path: "/dashboard/leaderboard", icon: <Trophy className="w-4 h-4" /> },
        { name: "Referans Sistemi", path: "/dashboard/referral", icon: <Share2 className="w-4 h-4" /> },
        { name: "Premium Paketler", path: "/dashboard/premium", icon: <ShieldCheck className="w-4 h-4" /> },
      ],
    },
    {
      title: "2. Öğretmen (Teacher)",
      icon: <Users className="w-5 h-5 text-purple-400" />,
      color: "border-purple-500/50 bg-purple-500/5",
      pages: [
        { name: "Öğretmen Paneli", path: "/teacher", icon: <LayoutDashboard className="w-4 h-4" /> },
        { name: "Sınıf Detay (Örn: 6a9e1adb)", path: "/teacher/class/6a9e1adb-afd4-46c7-a31c-5454e42e0dde", icon: <Users className="w-4 h-4" /> },
        { name: "Ödev Detay", path: "/teacher/assignment/1", icon: <BookOpen className="w-4 h-4" /> },
      ],
    },
    {
      title: "3. Veli (Parent)",
      icon: <User className="w-5 h-5 text-orange-400" />,
      color: "border-orange-500/50 bg-orange-500/5",
      pages: [
        { name: "Veli Paneli", path: "/parent", icon: <LayoutDashboard className="w-4 h-4" /> },
        { name: "Öğrenci Takibi", path: "/dashboard/parent", icon: <BarChart3 className="w-4 h-4" /> },
      ],
    },
    {
      title: "4. Admin (System Admin)",
      icon: <ShieldCheck className="w-5 h-5 text-red-400" />,
      color: "border-red-500/50 bg-red-500/5",
      pages: [
        { name: "Admin Kontrol Paneli", path: "/dashboard/admin", icon: <ShieldCheck className="w-4 h-4" /> },
      ],
    },
    {
      title: "5. Holding Yöneticisi (Executive)",
      icon: <Building2 className="w-5 h-5 text-cyan-400" />,
      color: "border-cyan-500/50 bg-cyan-500/5",
      pages: [
        { name: "Başkanlık Paneli (Executive)", path: "/executive", icon: <Building2 className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-200 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              OdevGPT Site Haritası
            </h1>
            <p className="text-slate-400 mt-2">Sistemdeki tüm sayfalara hızlı erişim ve test paneli.</p>
          </div>
          <Badge variant="outline" className="px-4 py-1 border-blue-500/30 text-blue-400 bg-blue-500/5 text-lg">
            v2.5 Deep Scan Ready
          </Badge>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, idx) => (
            <Card key={idx} className={`border-2 ${section.color} backdrop-blur-xl bg-opacity-20`}>
              <CardHeader className="flex flex-row items-center gap-3">
                {section.icon}
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {section.pages.map((page, pIdx) => (
                  <Button
                    key={pIdx}
                    variant="ghost"
                    className="w-full justify-start gap-3 hover:bg-white/5 transition-all text-slate-300 hover:text-white group"
                    onClick={() => navigate(page.path)}
                  >
                    <span className="p-2 rounded-md bg-white/5 group-hover:bg-white/10 transition-colors">
                      {page.icon}
                    </span>
                    {page.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <footer className="mt-12 text-center text-slate-500 text-sm border-t border-white/5 pt-8">
          <p>© 2026 OdevGPT Unified Ecosystem - Doktorlar Tarafından Taranabilir</p>
        </footer>
      </div>
    </div>
  );
};

export default Sitemap;
