import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Camera, Clock, User, Sparkles, LogOut, Settings, Crown, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationBell from "./NotificationBell";

export default function DashboardLayout() {
  const location = useLocation();
  const { profile, signOut } = useAuth();

  // Role based navigation items
  const getNavItems = () => {
    const role = profile?.role || 'student';

    if (role === 'teacher') {
      return [
        { icon: Home, label: "Panel", path: "/teacher" },
        { icon: Clock, label: "Geçmiş", path: "/dashboard/history" },
        { icon: User, label: "Profil", path: "/dashboard/profile" },
      ];
    }

    if (role === 'parent') {
      return [
        { icon: Home, label: "Veli Paneli", path: "/dashboard/parent" },
        { icon: User, label: "Profil", path: "/dashboard/profile" },
        { icon: Settings, label: "Ayarlar", path: "/dashboard/settings" },
      ];
    }

    // Default: Student items
    return [
      { icon: Home, label: "Anasayfa", path: "/dashboard" },
      { icon: Clock, label: "Geçmişim", path: "/dashboard/history" },
      { icon: Camera, label: "Soru Sor", path: "/dashboard/ask", accent: true },
      { icon: User, label: "Profil", path: "/dashboard/profile" },
    ];
  };

  const navItems = getNavItems();


  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass border-b">
        <div className="container flex items-center justify-between h-14">
          <Link to={profile?.role === 'teacher' ? '/teacher' : profile?.role === 'parent' ? '/dashboard/parent' : '/dashboard'} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">
              <span className="gradient-text">ODEV</span>
              <span className="text-accent">GPT</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {profile?.role === 'student' && profile?.streak !== undefined && (
              <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50/80 border border-orange-100 text-orange-600 text-[10px] font-bold">
                <span>🔥</span> {profile.streak} gün
              </div>
            )}
            {profile?.role === 'student' && profile?.xp !== undefined && (
              <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50/80 border border-blue-100 text-blue-600 text-[10px] font-bold">
                ⭐ {profile.xp} XP
              </div>
            )}

            {profile?.role === 'student' && (
              <Link to="/dashboard/premium">
                <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer">
                  <Crown size={14} className="text-white" /> PRO
                </div>
              </Link>
            )}


            <NotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="w-8 h-8 border-2 border-primary/20">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {profile?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.role === 'student' ? 'Öğrenci' :
                        profile?.role === 'teacher' ? 'Öğretmen' :
                          profile?.role === 'parent' ? 'Veli' :
                            profile?.role === 'admin' ? 'Yönetici' : profile?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="md:hidden">
                  <Link to="/dashboard/premium" className="cursor-pointer text-amber-600 font-semibold focus:text-amber-700">
                    <Crown className="mr-2 h-4 w-4" />
                    <span>PRO Yükselt</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="md:hidden" />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profilim</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Ayarlar</span>
                  </Link>
                </DropdownMenuItem>

                {profile?.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/admin" className="cursor-pointer text-destructive font-bold focus:text-destructive">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Yönetici Paneli</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container py-4 md:py-6">
        <Outlet />
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isAccent = item.accent;

            if (isAccent) {
              return (
                <Link key={item.path} to={item.path} className="relative -mt-6">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-full gradient-accent shadow-accent-glow flex items-center justify-center"
                  >
                    <item.icon className="w-6 h-6 text-accent-foreground" />
                  </motion.div>
                </Link>
              );
            }

            return (
              <Link key={item.path} to={item.path} className="flex flex-col items-center gap-0.5 py-1">
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-[10px] ${isActive ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
