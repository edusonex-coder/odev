# PROJECT CONTEXT: ODEVGPT
Generated: 2026-02-18 22:25:49.891730

## CONFIGURATION & META

### package.json
```
{
  "name": "edusonex-odevgpt",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@supabase/supabase-js": "^2.95.3",
    "@tanstack/react-query": "^5.83.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.34.0",
    "groq-sdk": "^0.37.0",
    "input-otp": "^1.4.2",
    "katex": "^0.16.28",
    "lucide-react": "^0.462.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.61.1",
    "react-markdown": "^10.1.0",
    "react-resizable-panels": "^2.1.9",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4",
    "rehype-katex": "^7.0.1",
    "remark-math": "^6.0.0",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "tesseract.js": "^7.0.0",
    "vaul": "^0.9.9",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@eslint/js": "^9.32.0",
    "@tailwindcss/typography": "^0.5.16",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.0.0",
    "@types/node": "^22.16.5",
    "@types/react": "^18.3.23",
    "@types/react-dom": "^18.3.7",
    "@vitejs/plugin-react-swc": "^3.11.0",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.32.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^15.15.0",
    "jsdom": "^20.0.3",
    "lovable-tagger": "^1.1.13",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3",
    "typescript-eslint": "^8.38.0",
    "vite": "^5.4.19",
    "vitest": "^3.2.4"
  }
}

```

### tsconfig.json
```
{
  "files": [],
  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "noImplicitAny": false,
    "noUnusedParameters": false,
    "skipLibCheck": true,
    "allowJs": true,
    "noUnusedLocals": false,
    "strictNullChecks": false
  }
}

```

### vite.config.ts
```
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

```

### tailwind.config.ts
```
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          glow: "hsl(var(--accent-glow))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: {
          elevated: "hsl(var(--surface-elevated))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(25 95% 53% / 0.4)" },
          "50%": { boxShadow: "0 0 40px hsl(25 95% 53% / 0.7)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

```

### README.md
```
# Edusonex ÖdevGPT

AI Destekli Akıllı Eğitim Asistanı - Ödevlerini fotoğrafla, AI ile adım adım öğren!

## 🎯 Proje Hakkında

Edusonex ÖdevGPT, Türkiye eğitim sistemine entegre, hibrit (AI + İnsan Öğretmen) ödev çözüm platformudur. **Sokratik Metod** ile öğrencilere ders çalışmayı sevdirir ve kalıcı öğrenme sağlar.

**Özellikler:**
- 🤖 **Sokratik AI Asistanı:** Cevabı söylemez, düşünmeye sevk eder. (Llama-3-70B)
- 🎮 **EdusonXP Oyunlaştırma:** XP toplama, Seviye atlama ve Liderlik Tablosu.
- 👨‍🏫 **Öğretmen Değerlendirme:** Ödevlerin öğretmenler tarafından incelenip notlandığı panel.
- 📸 **Multimedya Desteği:** Fotoğraf yükleme ve dosya teslim sistemi.
- 🚀 **Smart Announcement:** AI destekli pedagojik sınıf duyuruları.
- 📚 **MEB Müfredatı:** %100 uyumlu konu anlatım ve soru çözüm desteği.

## 🛠️ Teknoloji Yığını

- **Frontend:** React 18 + TypeScript + Vite
- **UI:** shadcn/ui + Tailwind CSS + Framer Motion
- **Backend:** Supabase (Auth, DB, Storage, RPC)
- **AI Engine:** Groq (Llama-3.3-70B-versatile)
- **Analiz:** Custom Gamification Engine (SQL tabanlı)

## 🚀 Kurulum

```sh
# 1. Repoyu klonlayın
git clone <GIT_URL>

# 2. Bağımlılıkları yükleyin
npm install

# 3. .env dosyasını yapılandırın
# VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY ve VITE_GROQ_API_KEY ekleyin.

# 4. Başlatın
npm run dev
```

## 📊 Geliştirme Durumu

**Mevcut İlerleme:** %95 🚀

- ✅ Frontend & UI Modernizasyonu
- ✅ Backend Altyapısı (Supabase)
- ✅ Sokratik AI Motoru (Groq Entegrasyonu)
- ✅ Oyunlaştırma (XP & Leaderboard)
- ✅ Öğretmen Grading Paneli
- ✅ Landing Page Multimedia Entegrasyonu
- ⏳ Production Deployment (Vercel DNS Beklemede)

## 📝 Dokümantasyon

Detaylı dokümantasyon için `.raporlar/` klasörüne bakın:
- `OdevGPT_Sunum_ve_Kullanim_Kilavuzu.md` - **Yeni Kullanım Kılavuzu & Yatırımcı Özeti**
- `MASTER_STATUS.md` - Teknik durum raporu
- `MEVCUT_DURUM.md` - Günlük ilerleme logları

## 📄 Lisans

© 2026 Edusonex. Tüm hakları saklıdır.

---

**Bismillahirrahmanirrahim** 🌟

```

## SOURCE CODE

### src\App.css
```
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}

```

### src\App.tsx
```
/** OdevGPT Main Application */
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import AskQuestion from "./pages/AskQuestion";
import ChatScreen from "./pages/ChatScreen";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import TeacherPanel from "./pages/TeacherPanel";
import QuestionDetail from "./pages/QuestionDetail";
import Premium from "./pages/Premium";
import AdminPanel from "./pages/AdminPanel";
import ClassDetail from "./pages/ClassDetail";
import AssignmentDetail from "./pages/AssignmentDetail";
import Leaderboard from "./pages/Leaderboard";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import ParentPanel from "./pages/ParentPanel";

import { TenantProvider } from "./contexts/TenantContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TenantProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="ask" element={<AskQuestion />} />
                <Route path="chat" element={<ChatScreen />} />
                <Route path="history" element={<History />} />
                <Route path="question/:id" element={<QuestionDetail />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} /> {/* Settings Route */}
                <Route path="premium" element={<Premium />} />
                <Route path="upgrade" element={<Premium />} />
                <Route
                  path="admin"
                  element={
                    <ProtectedRoute requireRole="admin">
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                /> {/* Admin Panel Rotası */}
                <Route path="class/:id" element={<ClassDetail />} /> {/* Student Class Detail */}
                <Route path="assignment/:id" element={<AssignmentDetail />} /> {/* Assignment Detail */}
                <Route path="leaderboard" element={<Leaderboard />} /> {/* Global Leaderboard */}
                <Route
                  path="parent"
                  element={
                    <ProtectedRoute requireRole="parent">
                      <ParentPanel />
                    </ProtectedRoute>
                  }
                /> {/* Parent Panel */}
              </Route>

              <Route
                path="/teacher"
                element={
                  <ProtectedRoute requireRole="teacher">
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<TeacherPanel />} />
                <Route path="class/:id" element={<ClassDetail />} /> {/* Teacher Class Detail */}
                <Route path="assignment/:id" element={<AssignmentDetail />} /> {/* Teacher Assignment Detail */}
              </Route>

              <Route
                path="/parent"
                element={
                  <ProtectedRoute requireRole="parent">
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ParentPanel />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TenantProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

```

### src\index.css
```
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 260 20% 12%;

    --card: 0 0% 100%;
    --card-foreground: 260 20% 12%;

    --popover: 0 0% 100%;
    --popover-foreground: 260 20% 12%;

    --primary: 263 84% 50%;
    --primary-foreground: 0 0% 100%;

    --secondary: 260 60% 96%;
    --secondary-foreground: 263 84% 40%;

    --muted: 260 20% 96%;
    --muted-foreground: 260 10% 50%;

    --accent: 25 95% 53%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    --border: 260 20% 90%;
    --input: 260 20% 90%;
    --ring: 263 84% 50%;

    --radius: 0.75rem;

    /* Custom tokens */
    --primary-glow: 263 84% 60%;
    --accent-glow: 25 95% 63%;
    --surface-elevated: 260 30% 98%;
    --gradient-primary: linear-gradient(135deg, hsl(263 84% 50%), hsl(280 80% 60%));
    --gradient-accent: linear-gradient(135deg, hsl(25 95% 53%), hsl(15 90% 55%));
    --gradient-hero: linear-gradient(160deg, hsl(263 84% 50%) 0%, hsl(280 70% 55%) 50%, hsl(25 95% 53%) 100%);
    --shadow-sm: 0 2px 8px -2px hsl(263 84% 50% / 0.08);
    --shadow-md: 0 8px 24px -4px hsl(263 84% 50% / 0.12);
    --shadow-lg: 0 16px 48px -8px hsl(263 84% 50% / 0.16);
    --shadow-glow: 0 0 24px hsl(263 84% 50% / 0.3);
    --shadow-accent-glow: 0 0 24px hsl(25 95% 53% / 0.3);

    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 263 84% 50%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 260 60% 96%;
    --sidebar-accent-foreground: 263 84% 40%;
    --sidebar-border: 260 20% 90%;
    --sidebar-ring: 263 84% 50%;
  }

  .dark {
    --background: 260 20% 6%;
    --foreground: 0 0% 96%;
    --card: 260 20% 9%;
    --card-foreground: 0 0% 96%;
    --popover: 260 20% 9%;
    --popover-foreground: 0 0% 96%;
    --primary: 263 84% 60%;
    --primary-foreground: 0 0% 100%;
    --secondary: 260 30% 15%;
    --secondary-foreground: 260 60% 80%;
    --muted: 260 20% 15%;
    --muted-foreground: 260 10% 60%;
    --accent: 25 95% 53%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 62% 30%;
    --destructive-foreground: 0 0% 100%;
    --border: 260 20% 18%;
    --input: 260 20% 18%;
    --ring: 263 84% 60%;
    --sidebar-background: 260 20% 8%;
    --sidebar-foreground: 0 0% 90%;
    --sidebar-primary: 263 84% 60%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 260 30% 15%;
    --sidebar-accent-foreground: 260 60% 80%;
    --sidebar-border: 260 20% 18%;
    --sidebar-ring: 263 84% 60%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
    font-family: 'Inter', sans-serif;
  }
}

@layer utilities {
  .gradient-primary {
    background: var(--gradient-primary);
  }

  .gradient-accent {
    background: var(--gradient-accent);
  }

  .gradient-hero {
    background: var(--gradient-hero);
  }

  .gradient-text {
    background: var(--gradient-hero);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .shadow-glow {
    box-shadow: var(--shadow-glow);
  }

  .shadow-accent-glow {
    box-shadow: var(--shadow-accent-glow);
  }

  .glass {
    background: hsl(var(--background) / 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .text-balance {
    text-wrap: balance;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  @keyframes pulse-glow {
    0%, 100% { opacity: 0.5; box-shadow: 0 0 20px hsl(var(--primary) / 0.2); }
    50% { opacity: 1; box-shadow: 0 0 40px hsl(var(--primary) / 0.4); }
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: hsl(var(--muted-foreground) / 0.2);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--primary) / 0.4);
  }
}

```

### src\main.tsx
```
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);

```

### src\vite-env.d.ts
```
/// <reference types="vite/client" />

```

### src\components\AdminBlogManager.tsx
```
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Globe, Search, Image as ImageIcon, CheckCircle, XCircle, Wand2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { blogSeeds } from "@/lib/blogSeeds";

interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image_url: string;
    is_published: boolean;
    seo_title: string;
    seo_description: string;
    geo_target: string;
    published_at: string;
}

export default function AdminBlogManager() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        image_url: "",
        is_published: false,
        seo_title: "",
        seo_description: "",
        geo_target: "",
    });
    const { toast } = useToast();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .order('published_at', { ascending: false });

            if (error) throw error;
            setBlogs(data || []);
        } catch (error: any) {
            toast({ title: "Hata", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (!currentBlog.title || !currentBlog.slug) {
                toast({ title: "Hata", description: "Başlık ve slug zorunludur.", variant: "destructive" });
                return;
            }

            if (currentBlog.id) {
                const { error } = await supabase
                    .from('blogs')
                    .update(currentBlog)
                    .eq('id', currentBlog.id);
                if (error) throw error;
                toast({ title: "Başarılı", description: "Blog güncellendi." });
            } else {
                const { error } = await supabase
                    .from('blogs')
                    .insert([currentBlog]);
                if (error) throw error;
                toast({ title: "Başarılı", description: "Yeni blog eklendi." });
            }

            setIsDialogOpen(false);
            fetchBlogs();
        } catch (error: any) {
            toast({ title: "Hata", description: error.message, variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) return;
        try {
            const { error } = await supabase.from('blogs').delete().eq('id', id);
            if (error) throw error;
            toast({ title: "Başarılı", description: "Blog silindi." });
            fetchBlogs();
        } catch (error: any) {
            toast({ title: "Hata", description: error.message, variant: "destructive" });
        }
    };

    const openEditDialog = (blog: Blog) => {
        setCurrentBlog(blog);
        setIsDialogOpen(true);
    };

    const openCreateDialog = () => {
        setCurrentBlog({
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            image_url: "",
            is_published: false,
            seo_title: "",
            seo_description: "",
            geo_target: "",
        });
        setIsDialogOpen(true);
    };

    const handleMagicImport = async () => {
        if (!confirm("Hazır blogları içe aktarmak istediğinize emin misiniz?")) return;
        setLoading(true);
        try {
            const seedsWithDates = blogSeeds.map(s => ({
                ...s,
                published_at: new Date().toISOString(),
                is_published: true
            }));
            const { error } = await supabase.from('blogs').insert(seedsWithDates);
            if (error) throw error;
            toast({ title: "Başarılı", description: "Örnek bloglar başarıyla eklendi!" });
            fetchBlogs();
        } catch (error: any) {
            toast({ title: "Hata", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Blog Yönetimi</h2>
                <div className="flex gap-2">
                    <Button onClick={handleMagicImport} variant="outline" className="gap-2 border-violet-200 text-violet-700 hover:bg-violet-50">
                        <Wand2 className="w-4 h-4" /> Sihirli İçe Aktar
                    </Button>
                    <Button onClick={openCreateDialog} className="gap-2">
                        <Plus className="w-4 h-4" /> Yeni Blog Ekle
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Başlık</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead>GEO</TableHead>
                                <TableHead>Tarih</TableHead>
                                <TableHead className="text-right">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                    </TableCell>
                                </TableRow>
                            ) : blogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        Henüz blog yazısı bulunmuyor.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                blogs.map((blog) => (
                                    <TableRow key={blog.id}>
                                        <TableCell className="font-medium">{blog.title}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{blog.slug}</TableCell>
                                        <TableCell>
                                            {blog.is_published ? (
                                                <Badge className="bg-green-100 text-green-700">Yayında</Badge>
                                            ) : (
                                                <Badge variant="secondary">Taslak</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {blog.geo_target ? <Badge variant="outline">{blog.geo_target}</Badge> : "-"}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {new Date(blog.published_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="ghost" onClick={() => openEditDialog(blog)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(blog.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{currentBlog.id ? "Blog Düzenle" : "Yeni Blog Ekle"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Başlık</Label>
                                <Input
                                    value={currentBlog.title}
                                    onChange={(e) => {
                                        const title = e.target.value;
                                        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                        setCurrentBlog({ ...currentBlog, title, slug });
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug (URL yolu)</Label>
                                <Input
                                    value={currentBlog.slug}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, slug: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Özet (Excerpt)</Label>
                                <Textarea
                                    value={currentBlog.excerpt}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Görsel URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={currentBlog.image_url}
                                        onChange={(e) => setCurrentBlog({ ...currentBlog, image_url: e.target.value })}
                                    />
                                    <Button variant="outline" size="icon"><ImageIcon className="w-4 h-4" /></Button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={currentBlog.is_published}
                                    onCheckedChange={(val) => setCurrentBlog({ ...currentBlog, is_published: val })}
                                />
                                <Label>Yayınla</Label>
                            </div>
                        </div>

                        <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                            <h4 className="font-bold text-sm flex items-center gap-2">
                                <Globe className="w-4 h-4 text-blue-500" /> SEO & GEO Ayarları
                            </h4>
                            <div className="space-y-2">
                                <Label className="text-xs">SEO Başlığı</Label>
                                <Input
                                    className="text-sm"
                                    value={currentBlog.seo_title}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, seo_title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">SEO Açıklaması</Label>
                                <Textarea
                                    className="text-sm h-20"
                                    value={currentBlog.seo_description}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, seo_description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">GEO Hedefleme (Örn: İstanbul, Türkiye)</Label>
                                <Input
                                    className="text-sm"
                                    value={currentBlog.geo_target}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, geo_target: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label>İçerik (Markdown)</Label>
                            <Textarea
                                className="min-h-[300px] font-mono"
                                value={currentBlog.content}
                                onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>İptal</Button>
                        <Button onClick={handleSave}>Kaydet</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

```

### src\components\AIUsageMonitor.tsx
```
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

```

### src\components\AnnouncementManager.tsx
```
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Plus, Trash2, Send, Bell, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Announcement {
    id: string;
    title: string;
    content: string;
    type: string;
    is_global: boolean;
    created_at: string;
    tenant_id: string | null;
}

export default function AnnouncementManager({ selectedTenantId }: { selectedTenantId: string }) {
    const { profile } = useAuth();
    const { toast } = useToast();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: "",
        type: "info",
        is_global: false
    });

    useEffect(() => {
        fetchAnnouncements();
    }, [selectedTenantId]);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            let query = supabase.from("announcements").select("*").order("created_at", { ascending: false });

            if (selectedTenantId !== "all") {
                query = query.or(`tenant_id.eq.${selectedTenantId},is_global.eq.true`);
            }

            const { data, error } = await query;
            if (error) throw error;
            setAnnouncements(data || []);
        } catch (err) {
            console.error("Announcement fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newAnnouncement.title || !newAnnouncement.content) return;

        try {
            const payload = {
                title: newAnnouncement.title,
                content: newAnnouncement.content,
                type: newAnnouncement.type,
                is_global: profile?.is_super_admin ? newAnnouncement.is_global : false,
                tenant_id: newAnnouncement.is_global ? null : (selectedTenantId === "all" ? profile?.tenant_id : selectedTenantId)
            };

            const { error } = await supabase.from("announcements").insert(payload);
            if (error) throw error;

            toast({ title: "Başarılı", description: "Duyuru yayınlandı." });
            setIsAdding(false);
            setNewAnnouncement({ title: "", content: "", type: "info", is_global: false });
            fetchAnnouncements();
        } catch (err: any) {
            toast({ title: "Hata", description: err.message, variant: "destructive" });
        }
    };

    const deleteAnnouncement = async (id: string) => {
        try {
            const { error } = await supabase.from("announcements").delete().eq("id", id);
            if (error) throw error;
            setAnnouncements(announcements.filter(a => a.id !== id));
            toast({ title: "Silindi", description: "Duyuru kaldırıldı." });
        } catch (err: any) {
            toast({ title: "Hata", description: err.message, variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold">Duyuru Yönetimi</h2>
                </div>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} className="gap-2">
                        <Plus className="w-4 h-4" /> Yeni Duyuru
                    </Button>
                )}
            </div>

            {isAdding && (
                <Card className="border-primary/20 shadow-lg animate-in fade-in slide-in-from-top-4">
                    <CardHeader>
                        <CardTitle>Yeni Duyuru Yayınla</CardTitle>
                        <CardDescription>Kurum veya genel sistem duyurusu oluşturun.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Başlık</label>
                            <Input
                                value={newAnnouncement.title}
                                onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                placeholder="Örn: Hafta Sonu Bakım Çalışması"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">İçerik</label>
                            <Textarea
                                value={newAnnouncement.content}
                                onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                placeholder="Duyuru detaylarını yazın..."
                            />
                        </div>
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Tip:</label>
                                <select
                                    className="bg-white border text-sm p-1 rounded-md"
                                    value={newAnnouncement.type}
                                    onChange={e => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                                >
                                    <option value="info">Bilgi</option>
                                    <option value="success">Başarı</option>
                                    <option value="warning">Uyarı</option>
                                    <option value="urgent">Kritik</option>
                                </select>
                            </div>
                            {profile?.is_super_admin && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_global"
                                        checked={newAnnouncement.is_global}
                                        onChange={e => setNewAnnouncement({ ...newAnnouncement, is_global: e.target.checked })}
                                    />
                                    <label htmlFor="is_global" className="text-sm font-medium flex items-center gap-1 cursor-pointer">
                                        <Globe className="w-3 h-3" /> Tüm Sisteme Gönder (Global)
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 justify-end pt-2">
                            <Button variant="ghost" onClick={() => setIsAdding(false)}>İptal</Button>
                            <Button onClick={handleAdd} className="gap-2">
                                <Send className="w-4 h-4" /> Yayınla
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {loading ? (
                    <div className="py-10 text-center text-muted-foreground">Yükleniyor...</div>
                ) : announcements.length === 0 ? (
                    <div className="py-20 text-center bg-muted/20 border-2 border-dashed rounded-3xl">
                        <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground italic">Henüz bir duyuru bulunmuyor.</p>
                    </div>
                ) : (
                    announcements.map(a => (
                        <Card key={a.id} className="hover:shadow-md transition-shadow overflow-hidden group">
                            <div className="flex items-start p-6 gap-4">
                                <div className={`p-3 rounded-2xl ${a.type === 'urgent' ? 'bg-red-50 text-red-600' :
                                        a.type === 'warning' ? 'bg-orange-50 text-orange-600' :
                                            a.type === 'success' ? 'bg-green-50 text-green-600' :
                                                'bg-blue-50 text-blue-600'
                                    }`}>
                                    <Megaphone className="w-6 h-6" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-lg">{a.title}</h4>
                                            {a.is_global && <Badge variant="secondary" className="bg-purple-50 text-purple-600 border-purple-100 flex items-center gap-1"><Globe className="w-3 h-3" /> TÜM SİSTEM</Badge>}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{format(new Date(a.created_at), 'd MMMM yyyy HH:mm', { locale: tr })}</span>
                                    </div>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{a.content}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => deleteAnnouncement(a.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

```

### src\components\AssignmentWizard.tsx
```
/**
 * ASSIGNMENT WIZARD
 * 
 * Öğretmenlerin adım adım ödev oluşturmasını sağlayan wizard bileşeni.
 * AI ile otomatik soru önerisi ve zorluk seviyesi seçimi içerir.
 */

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Loader2, Sparkles, BookOpen, Target, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AssignmentWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classId: string;
    onSuccess?: () => void;
}

export default function AssignmentWizard({ open, onOpenChange, classId, onSuccess }: AssignmentWizardProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [maxScore, setMaxScore] = useState(100);
    const [dueDate, setDueDate] = useState<Date>();

    const resetForm = () => {
        setStep(1);
        setTitle('');
        setDescription('');
        setInstructions('');
        setDifficulty('medium');
        setMaxScore(100);
        setDueDate(undefined);
    };

    const handleCreate = async () => {
        if (!title || !description || !dueDate) {
            toast({
                title: 'Eksik Bilgi',
                description: 'Lütfen tüm zorunlu alanları doldurun.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setLoading(true);

            const { error } = await supabase.from('assignments').insert({
                class_id: classId,
                title,
                description,
                instructions,
                difficulty_level: difficulty,
                max_score: maxScore,
                due_date: dueDate.toISOString(),
            });

            if (error) throw error;

            toast({
                title: '✅ Ödev Oluşturuldu',
                description: `${title} başarıyla eklendi.`,
            });

            resetForm();
            onOpenChange(false);
            onSuccess?.();

        } catch (error: any) {
            console.error('Assignment creation error:', error);
            toast({
                title: 'Hata',
                description: error.message || 'Ödev oluşturulurken bir sorun oluştu.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 1 && !title) {
            toast({ title: 'Ödev başlığı gerekli', variant: 'destructive' });
            return;
        }
        if (step === 2 && !description) {
            toast({ title: 'Ödev açıklaması gerekli', variant: 'destructive' });
            return;
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Yeni Ödev Oluştur
                    </DialogTitle>
                    <DialogDescription>
                        Adım {step}/3: {step === 1 ? 'Temel Bilgiler' : step === 2 ? 'Detaylar' : 'Son Ayarlar'}
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-4">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={cn(
                                'h-2 flex-1 rounded-full transition-colors',
                                s <= step ? 'bg-primary' : 'bg-gray-200'
                            )}
                        />
                    ))}
                </div>

                <div className="space-y-4 py-4">
                    {/* STEP 1: Temel Bilgiler */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Ödev Başlığı *</Label>
                                <Input
                                    id="title"
                                    placeholder="Örn: Kesirler Konusu Alıştırmaları"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Kısa Açıklama *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Ödevin amacını ve kapsamını kısaca açıklayın..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="difficulty">Zorluk Seviyesi</Label>
                                <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="easy">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="bg-green-100 text-green-700">Kolay</Badge>
                                                <span className="text-xs text-muted-foreground">Temel seviye</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="medium">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Orta</Badge>
                                                <span className="text-xs text-muted-foreground">Standart seviye</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="hard">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="bg-red-100 text-red-700">Zor</Badge>
                                                <span className="text-xs text-muted-foreground">İleri seviye</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Detaylar */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="instructions">Talimatlar (Opsiyonel)</Label>
                                <Textarea
                                    id="instructions"
                                    placeholder="Öğrencilere özel talimatlar verin (örn: 'Tüm işlemleri gösterin', 'Grafik çizin')"
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    rows={4}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Bu talimatlar öğrencilere ödev detayında gösterilecektir.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="maxScore">Maksimum Puan</Label>
                                    <Input
                                        id="maxScore"
                                        type="number"
                                        min={1}
                                        max={1000}
                                        value={maxScore}
                                        onChange={(e) => setMaxScore(parseInt(e.target.value) || 100)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Son Teslim Tarihi *</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-full justify-start text-left font-normal',
                                                    !dueDate && 'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dueDate ? format(dueDate, 'PPP', { locale: tr }) : 'Tarih seçin'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={dueDate}
                                                onSelect={setDueDate}
                                                initialFocus
                                                disabled={(date) => date < new Date()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Özet */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="rounded-lg border p-4 space-y-3">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Target className="w-4 h-4 text-primary" />
                                    Ödev Özeti
                                </h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Başlık:</span>
                                        <span className="font-medium">{title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Zorluk:</span>
                                        <Badge
                                            variant="secondary"
                                            className={
                                                difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                    difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                            }
                                        >
                                            {difficulty === 'easy' ? 'Kolay' : difficulty === 'medium' ? 'Orta' : 'Zor'}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Maksimum Puan:</span>
                                        <span className="font-medium">{maxScore}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Son Teslim:</span>
                                        <span className="font-medium flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {dueDate ? format(dueDate, 'PPP', { locale: tr }) : 'Belirtilmedi'}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t">
                                    <p className="text-xs text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
                                <div className="text-xs text-blue-900">
                                    <p className="font-semibold mb-1">AI Önerisi</p>
                                    <p>
                                        Bu ödev {difficulty === 'easy' ? 'kolay' : difficulty === 'medium' ? 'orta' : 'zor'} seviyede.
                                        Öğrencilerinize {difficulty === 'easy' ? '2-3 gün' : difficulty === 'medium' ? '5-7 gün' : '1-2 hafta'} süre vermenizi öneririz.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between">
                    <div className="flex gap-2">
                        {step > 1 && (
                            <Button variant="outline" onClick={prevStep}>
                                Geri
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>
                            İptal
                        </Button>
                        {step < 3 ? (
                            <Button onClick={nextStep}>
                                İleri
                            </Button>
                        ) : (
                            <Button onClick={handleCreate} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Oluşturuluyor...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Ödevi Oluştur
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

```

### src\components\ClassChatRoom.tsx
```
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Trash2, User, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Message {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
        full_name: string;
        avatar_url: string;
        role: string;
    };
}

interface ClassChatRoomProps {
    classId: string;
    isTeacher?: boolean;
}

export default function ClassChatRoom({ classId, isTeacher }: ClassChatRoomProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMessages();

        // Realtime subscription
        const channel = supabase
            .channel(`class-chat-${classId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'class_messages',
                    filter: `class_id=eq.${classId}`
                },
                (payload) => {
                    // Yeni mesaj geldiğinde profili ile beraber çekmek için fetchMessages'ı tetikleyebiliriz
                    // Veya daha performanslı olması için payload'u direkt ekleyebiliriz (tabii user verisi gerek)
                    fetchMessages();
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'class_messages',
                },
                () => fetchMessages()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [classId]);

    useEffect(() => {
        // Otomatik aşağı kaydır
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('class_messages')
                .select(`
                    id,
                    content,
                    created_at,
                    user_id,
                    profiles:user_id (
                        full_name,
                        avatar_url,
                        role
                    )
                `)
                .eq('class_id', classId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages(data as any || []);
        } catch (error) {
            console.error('Messages fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        try {
            setSending(true);
            const { error } = await supabase.from('class_messages').insert({
                class_id: classId,
                user_id: user.id,
                content: newMessage.trim()
            });

            if (error) throw error;
            setNewMessage('');
        } catch (error: any) {
            toast({
                title: 'Hata',
                description: 'Mesaj gönderilemedi.',
                variant: 'destructive'
            });
        } finally {
            setSending(false);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            const { error } = await supabase
                .from('class_messages')
                .delete()
                .eq('id', messageId);

            if (error) throw error;
            toast({ description: 'Mesaj silindi.' });
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Mesaj silinemedi.',
                variant: 'destructive'
            });
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-card rounded-3xl border shadow-sm overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="font-bold text-sm">Sınıf Sohbeti</h3>
                </div>
                <Badge variant="outline" className="text-[10px] opacity-70">Canlı</Badge>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-40">
                        <Sparkles className="w-8 h-8" />
                        <p className="text-xs italic">Henüz mesaj yok. İlk mesajı sen gönder!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {messages.map((msg) => {
                            const isMe = msg.user_id === user?.id;
                            const isAdmin = msg.profiles.role === 'teacher' || msg.profiles.role === 'admin';

                            return (
                                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                    <Avatar className="w-8 h-8 mt-1 border shadow-sm">
                                        <AvatarImage src={msg.profiles.avatar_url} />
                                        <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                    </Avatar>
                                    <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : ''}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-gray-500">
                                                {msg.profiles.full_name}
                                            </span>
                                            {isAdmin && (
                                                <Badge className="text-[8px] h-3.5 px-1 bg-primary/10 text-primary border-none">Öğretmen</Badge>
                                            )}
                                        </div>
                                        <div className={`
                                            p-3 rounded-2xl text-sm relative group
                                            ${isMe
                                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                : 'bg-muted rounded-tl-none'}
                                        `}>
                                            {msg.content}

                                            {/* Delete Action (Show on hover for teacher or owner) */}
                                            {(isTeacher || isMe) && (
                                                <button
                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                    className={`
                                                        absolute -top-2 -right-2 p-1 bg-destructive text-white rounded-full 
                                                        opacity-0 group-hover:opacity-100 transition-opacity shadow-lg
                                                        ${isMe ? '-left-2 right-auto' : ''}
                                                    `}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                        <span className="text-[8px] text-muted-foreground mt-1">
                                            {format(new Date(msg.created_at), 'HH:mm', { locale: tr })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </ScrollArea>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-muted/10 flex gap-2">
                <Input
                    placeholder="Mesajını yaz..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="rounded-2xl border-none bg-white shadow-sm focus-visible:ring-primary"
                    disabled={sending}
                />
                <Button
                    type="submit"
                    size="icon"
                    className="rounded-full shrink-0 shadow-lg shadow-primary/20"
                    disabled={!newMessage.trim() || sending}
                >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
            </form>
        </div>
    );
}



```

### src\components\ClassInsightsPanel.tsx
```
/**
 * CLASS INSIGHTS PANEL
 * 
 * Öğretmenlerin sınıf performansını AI ile analiz edip görselleştirdiği ana panel.
 * Zayıf konuları, öğrenci metriklerini ve AI önerilerini gösterir.
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { analyzeClassPerformance, WeakTopic, StudentMetric, ClassInsight } from '@/lib/classInsights';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, TrendingDown, TrendingUp, Lightbulb, BookOpen, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface ClassInsightsPanelProps {
    classId: string;
    className: string;
}

export default function ClassInsightsPanel({ classId, className }: ClassInsightsPanelProps) {
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [insights, setInsights] = useState<ClassInsight | null>(null);
    const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
    const [studentMetrics, setStudentMetrics] = useState<StudentMetric[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        fetchInsights();
    }, [classId]);

    const fetchInsights = async () => {
        try {
            setLoading(true);

            // 1. Zayıf konuları al (RPC)
            const { data: weakTopicsData, error: weakError } = await supabase
                .rpc('get_class_weak_topics', { p_class_id: classId, p_limit: 10 });

            if (weakError) throw weakError;

            // 2. Öğrenci metriklerini al (View)
            const { data: metricsData, error: metricsError } = await supabase
                .from('student_performance_metrics')
                .select('*')
                .eq('class_id', classId);

            if (metricsError) throw metricsError;

            setWeakTopics(weakTopicsData || []);
            setStudentMetrics(metricsData || []);

            // 3. Mevcut insight var mı kontrol et
            const { data: existingInsight } = await supabase
                .from('class_insights')
                .select('*')
                .eq('class_id', classId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (existingInsight) {
                setInsights({
                    weak_topics: existingInsight.weak_topics || [],
                    strong_topics: [],
                    average_success_rate: existingInsight.average_success_rate || 0,
                    total_questions_analyzed: existingInsight.total_questions_analyzed || 0,
                    ai_recommendations: existingInsight.ai_recommendations || '',
                    suggested_exercises: existingInsight.suggested_exercises || [],
                });
            }

        } catch (error: any) {
            console.error('Insights fetch error:', error);
            toast({
                title: 'Hata',
                description: 'Sınıf analizi yüklenirken bir sorun oluştu.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const generateNewInsights = async () => {
        try {
            setAnalyzing(true);

            // AI analizi yap
            const newInsights = await analyzeClassPerformance(
                weakTopics,
                studentMetrics,
                className
            );

            // Veritabanına kaydet
            const { error } = await supabase
                .from('class_insights')
                .insert({
                    class_id: classId,
                    weak_topics: newInsights.weak_topics,
                    average_success_rate: newInsights.average_success_rate,
                    total_questions_analyzed: newInsights.total_questions_analyzed,
                    ai_recommendations: newInsights.ai_recommendations,
                    suggested_exercises: newInsights.suggested_exercises,
                });

            if (error) throw error;

            setInsights(newInsights);

            toast({
                title: '✅ Analiz Tamamlandı',
                description: 'Sınıf performansı başarıyla analiz edildi.',
            });

        } catch (error: any) {
            console.error('Insights generation error:', error);
            toast({
                title: 'Hata',
                description: 'AI analizi sırasında bir sorun oluştu.',
                variant: 'destructive',
            });
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const chartData = weakTopics.slice(0, 5).map(topic => ({
        name: topic.topic.length > 20 ? topic.topic.substring(0, 20) + '...' : topic.topic,
        score: Math.round(topic.difficulty_score * 100),
        students: topic.student_count,
    }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Brain className="w-6 h-6 text-primary" />
                        Sınıf Zeka Raporu
                    </h2>
                    <p className="text-muted-foreground">
                        AI destekli performans analizi ve öğretim önerileri
                    </p>
                </div>
                <Button
                    onClick={generateNewInsights}
                    disabled={analyzing || weakTopics.length === 0}
                    className="gap-2"
                >
                    {analyzing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analiz Ediliyor...
                        </>
                    ) : (
                        <>
                            <Brain className="w-4 h-4" />
                            Yeni Analiz Oluştur
                        </>
                    )}
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ortalama Başarı</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">
                            {insights?.average_success_rate.toFixed(1) || '0'}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {studentMetrics.length} öğrenci ortalaması
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Analiz Edilen Soru</CardTitle>
                        <BookOpen className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">
                            {insights?.total_questions_analyzed || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Toplam soru sayısı
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Zayıf Konu</CardTitle>
                        <TrendingDown className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-700">
                            {weakTopics.filter(t => t.difficulty_score > 0.6).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Dikkat gerektiren konular
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Weak Topics Chart */}
            {chartData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingDown className="w-5 h-5 text-orange-600" />
                            En Zor Konular
                        </CardTitle>
                        <CardDescription>
                            Öğrencilerin en çok zorlandığı 5 konu
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis
                                    dataKey="name"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                    formatter={(value: any, name: string) => {
                                        if (name === 'score') return [`${value}%`, 'Zorluk Skoru'];
                                        if (name === 'students') return [value, 'Öğrenci Sayısı'];
                                        return [value, name];
                                    }}
                                />
                                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.score > 80 ? '#ef4444' : entry.score > 60 ? '#f97316' : '#eab308'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* AI Recommendations */}
            {insights?.ai_recommendations && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-600" />
                            AI Öğretim Önerileri
                        </CardTitle>
                        <CardDescription>
                            Yapay zeka tarafından oluşturulan pedagojik öneriler
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-none">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                {insights.ai_recommendations}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Suggested Exercises */}
            {insights?.suggested_exercises && insights.suggested_exercises.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                Önerilen Alıştırmalar
                            </CardTitle>
                            <CardDescription>
                                Zayıf konuları güçlendirmek için öneriler
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {insights.suggested_exercises.map((exercise, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-sm">{exercise.topic}</h4>
                                                <Badge
                                                    variant={
                                                        exercise.difficulty === 'easy' ? 'secondary' :
                                                            exercise.difficulty === 'medium' ? 'default' : 'destructive'
                                                    }
                                                    className="text-xs"
                                                >
                                                    {exercise.difficulty === 'easy' ? 'Kolay' :
                                                        exercise.difficulty === 'medium' ? 'Orta' : 'Zor'}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-1">
                                                {exercise.exercise_type}
                                            </p>
                                            <p className="text-sm">{exercise.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-destructive" />
                                Dikkat Gerektiren Öğrenciler
                            </CardTitle>
                            <CardDescription>
                                Başarı oranı %60'ın altında olanlar
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {studentMetrics
                                    .filter(s => s.success_rate < 0.6)
                                    .sort((a, b) => a.success_rate - b.success_rate)
                                    .slice(0, 5)
                                    .map((student, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-bold text-xs">
                                                    {student.student_name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{student.student_name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-destructive"
                                                                style={{ width: `${student.success_rate * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground">%{Math.round(student.success_rate * 100)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-[10px]">Detay</Badge>
                                        </div>
                                    ))}
                                {studentMetrics.filter(s => s.success_rate < 0.6).length === 0 && (
                                    <div className="text-center py-6 text-muted-foreground italic text-sm">
                                        Şu an tüm öğrenciler hedeflerin üzerinde! 🎉
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* No Data State */}
            {weakTopics.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Henüz Veri Yok</h3>
                        <p className="text-sm text-muted-foreground text-center max-w-md">
                            Sınıf analizi için yeterli veri bulunmuyor. Öğrencileriniz soru çözmeye başladığında
                            burada detaylı performans raporları görebileceksiniz.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

```

### src\components\DashboardLayout.tsx
```
import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Camera, Clock, User, Sparkles, LogOut, Settings, Crown, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
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
  const { tenant } = useTenant();

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
            {tenant?.logo_url ? (
              <img src={tenant.logo_url} alt={tenant.name} className="h-7 w-auto object-contain" />
            ) : (
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <span className="text-lg font-bold">
              {tenant ? (
                <span className="gradient-text uppercase">{tenant.name}</span>
              ) : (
                <>
                  <span className="gradient-text">ODEV</span>
                  <span className="text-accent">GPT</span>
                </>
              )}
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

```

### src\components\ErrorBoundary.tsx
```
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center space-y-6 bg-background">
                    <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center animate-pulse">
                        <AlertTriangle className="w-10 h-10 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tight text-foreground">Ups! Bir Şeyler Ters Gitti</h1>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Beklenmedik bir hata ile karşılaştık. Endişelenmeyin, bu durum teknik ekibimize iletildi.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={() => window.location.reload()}
                            className="rounded-xl px-8"
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" /> Sayfayı Yenile
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = '/'}
                            className="rounded-xl px-8"
                        >
                            <Home className="w-4 h-4 mr-2" /> Ana Sayfaya Dön
                        </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-8">
                        OdevGPT Error Handling System
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

```

### src\components\HoldingAnalytics.tsx
```
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    LineChart, Line
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { School, TrendingUp, Users, FileQuestion, Award } from "lucide-react";
import AIUsageMonitor from "./AIUsageMonitor";

interface HoldingStats {
    tenant_id: string;
    tenant_name: string;
    total_students: number;
    total_questions: number;
    total_solutions: number;
    avg_student_xp: number;
}

export default function HoldingAnalytics() {
    const [data, setData] = useState<HoldingStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHoldingData();
    }, []);

    const fetchHoldingData = async () => {
        try {
            setLoading(true);
            // Not: Bu view veritabanında oluşturulmuş olmalıdır.
            const { data: stats, error } = await supabase
                .from('holding_performance_summary')
                .select('*');

            if (error) throw error;
            setData(stats || []);
        } catch (err) {
            console.error("Holding analytics error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Analizler hazırlanıyor...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <AIUsageMonitor />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-lg">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-indigo-100 flex items-center gap-2">
                            <School className="w-4 h-4" /> Toplam Kurum
                        </CardDescription>
                        <CardTitle className="text-3xl font-black">{data.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" /> Toplam Öğrenci
                        </CardDescription>
                        <CardTitle className="text-3xl font-bold">
                            {data.reduce((acc, curr) => acc + curr.total_students, 0)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <FileQuestion className="w-4 h-4 text-orange-500" /> Toplam Soru
                        </CardDescription>
                        <CardTitle className="text-3xl font-bold">
                            {data.reduce((acc, curr) => acc + curr.total_questions, 0)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white border shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-500" /> Ort. XP / Öğrenci
                        </CardDescription>
                        <CardTitle className="text-3xl font-bold">
                            {Math.round(data.reduce((acc, curr) => acc + curr.avg_student_xp, 0) / (data.length || 1))}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-7">
                <Card className="lg:col-span-4 shadow-md border-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" /> Kurumlar Arası Soru Trafiği
                        </CardTitle>
                        <CardDescription>Hangi okul ne kadar aktif?</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis dataKey="tenant_name" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="total_questions" radius={[6, 6, 0, 0]} name="Soru Sayısı">
                                    {data.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${1 - index * 0.15})`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 shadow-md border-primary/5">
                    <CardHeader>
                        <CardTitle>Kurum Liderlik Tablosu</CardTitle>
                        <CardDescription>Performans sıralaması</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Kurum</TableHead>
                                    <TableHead className="text-right">XP Ort.</TableHead>
                                    <TableHead className="text-right">Çözüm %</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.sort((a, b) => b.avg_student_xp - a.avg_student_xp).map((item) => (
                                    <TableRow key={item.tenant_id}>
                                        <TableCell className="font-bold text-xs">{item.tenant_name}</TableCell>
                                        <TableCell className="text-right font-medium text-xs">{Math.round(item.avg_student_xp)}</TableCell>
                                        <TableCell className="text-right text-xs">
                                            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100">
                                                %{item.total_questions > 0 ? Math.round((item.total_solutions / item.total_questions) * 100) : 100}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

```

### src\components\LandingDemo.tsx
```
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const demoScenarios = [
    {
        id: 1,
        subject: "Matematik",
        question: "2x + 5 = 15 denklemini çöz",
        answer: "Adım 1: Sabit terimi karşıya atalım.\n2x = 15 - 5\n2x = 10\n\nAdım 2: Her iki tarafı 2'ye bölelim.\nx = 10 / 2\nx = 5\n\nSonuç: x = 5 ✅",
        color: "from-blue-500 to-cyan-500",
    },
    {
        id: 2,
        subject: "Fen Bilimleri",
        question: "Fotosentez nedir?",
        answer: "Fotosentez, bitkilerin güneş ışığını kullanarak kendi besinlerini üretmesidir.\n☀️ Güneş + 💧 Su + 🌬️ Karbondioksit -> 🌿 Besin + 🌬️ Oksijen",
        color: "from-green-500 to-emerald-500",
    },
    {
        id: 3,
        subject: "Türkçe",
        question: "'Kalem' kelimesinin eş anlamlısı nedir?",
        answer: "'Kalem' kelimesinin eş anlamlısı 'yazgıç'tır. Ancak günümüzde pek kullanılmaz. Genellikle eş anlamlısı olarak bağlama göre farklı kelimeler seçilebilir.",
        color: "from-red-500 to-orange-500",
    },
];

export default function LandingDemo() {
    const [activeScenario, setActiveScenario] = useState(demoScenarios[0]);
    const [typedAnswer, setTypedAnswer] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        let i = 0;
        setTypedAnswer("");
        setIsTyping(true);

        const interval = setInterval(() => {
            setTypedAnswer(activeScenario.answer.slice(0, i + 1));
            i++;
            if (i > activeScenario.answer.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [activeScenario]);

    return (
        <section className="py-16 md:py-24 bg-secondary/30 overflow-hidden">
            <div className="container">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Sol: Seçim Alanı */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold mb-4">
                                Gücünü <span className="gradient-text">Test Et</span>
                            </h2>
                            <p className="text-muted-foreground text-lg mb-8">
                                Hangi derste yardıma ihtiyacın var? Bir soru seç ve OdevGPT'nin nasıl çözdüğünü gör.
                            </p>
                        </motion.div>

                        <div className="space-y-4">
                            {demoScenarios.map((scenario) => (
                                <motion.div
                                    key={scenario.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveScenario(scenario)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${activeScenario.id === scenario.id
                                            ? "bg-card border-primary shadow-md ring-1 ring-primary/20"
                                            : "bg-card/50 hover:bg-card border-transparent hover:border-primary/20"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${scenario.color} text-white mb-1 inline-block`}>
                                                {scenario.subject}
                                            </span>
                                            <p className="font-medium">{scenario.question}</p>
                                        </div>
                                        {activeScenario.id === scenario.id && (
                                            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sağ: Chat Demo */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Dekoratif Arka Plan */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[2rem] blur-xl opacity-50" />

                        <div className="relative bg-background border rounded-3xl shadow-2xl overflow-hidden h-[500px] flex flex-col">
                            {/* Fake Header */}
                            <div className="bg-card/80 backdrop-blur-md p-4 border-b flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">OdevGPT Asistan</h3>
                                    <div className="flex items-center gap-1 text-xs text-green-500">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        Çevrimiçi
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 p-6 space-y-6 overflow-hidden flex flex-col justify-end bg-muted/20">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeScenario.id + "-user"}
                                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex justify-end"
                                    >
                                        <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-lg">
                                            <p className="text-sm font-medium">{activeScenario.question}</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        key={activeScenario.id + "-ai"}
                                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex justify-start"
                                    >
                                        <div className="flex items-end gap-2 max-w-[90%]">
                                            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mb-1">
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="bg-card border px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm">
                                                <pre className="text-sm whitespace-pre-wrap font-sans text-foreground/90 leading-relaxed">
                                                    {typedAnswer}
                                                    {isTyping && <span className="inline-block w-1 h-4 bg-primary ml-1 animate-blink" />}
                                                </pre>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Input Area (Fake) */}
                            <div className="p-4 border-t bg-card">
                                <div className="h-12 bg-muted rounded-full flex items-center px-4 text-muted-foreground text-sm">
                                    Bir soru yaz...
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

```

### src\components\NavLink.tsx
```
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };

```

### src\components\NotificationBell.tsx
```
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, BellDot, Check, Trash2, ExternalLink } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface Notification {
    id: string;
    title: string;
    content: string;
    type: string;
    link: string;
    is_read: boolean;
    created_at: string;
}

export default function NotificationBell() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        fetchNotifications();

        // Realtime notification listener
        const channel = supabase
            .channel(`user-notifications-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                },
                () => {
                    fetchNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const fetchNotifications = async () => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (!error && data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        }
    };

    const markAsRead = async (id: string) => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);
        fetchNotifications();
    };

    const markAllAsRead = async () => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user?.id)
            .eq('is_read', false);
        fetchNotifications();
    };

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);
        if (notification.link) {
            navigate(notification.link);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative transition-all hover:bg-primary/10 rounded-full group">
                    {unreadCount > 0 ? (
                        <>
                            <BellDot className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        </>
                    ) : (
                        <Bell className="w-5 h-5 text-muted-foreground group-hover:scale-110 transition-transform" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-2xl border-primary/10 animate-in slide-in-from-top-2">
                <DropdownMenuLabel className="p-4 flex items-center justify-between bg-muted/30">
                    <span className="font-bold">Bildirimler</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-[10px] h-7 px-2 text-primary hover:text-primary/80 hover:bg-primary/5"
                        >
                            Hepsini Okundu İşaretle
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="m-0" />
                <ScrollArea className="h-80">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground space-y-2">
                            <Bell className="w-8 h-8 mx-auto opacity-20" />
                            <p className="text-xs">Henüz bildiriminiz yok.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`p-4 border-b last:border-0 cursor-pointer transition-all hover:bg-muted/50 group relative ${!n.is_read ? 'bg-primary/5' : ''}`}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="space-y-1">
                                            <p className={`text-xs font-bold leading-none ${!n.is_read ? 'text-primary' : ''}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                                                {n.content}
                                            </p>
                                        </div>
                                        {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />}
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[9px] text-muted-foreground italic">
                                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: tr })}
                                        </span>
                                        {n.link && <ExternalLink className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <DropdownMenuSeparator className="m-0" />
                <div className="p-2 text-center">
                    <Button variant="ghost" size="sm" className="w-full text-[10px] text-muted-foreground">
                        Tüm Bildirimleri Gör
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

```

### src\components\ProtectedRoute.tsx
```
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireRole?: "student" | "teacher" | "admin" | "parent";
}

export default function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
    const { user, profile, loading } = useAuth();

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check role if required
    if (requireRole && profile?.role !== requireRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🚫</span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Erişim Reddedildi</h1>
                    <p className="text-muted-foreground mb-6">
                        Bu sayfaya erişim yetkiniz bulunmamaktadır.
                    </p>
                    <Navigate to="/dashboard" replace />
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

```

### src\components\SEO.tsx
```
import { useEffect } from 'react';
import { useTenant } from '@/contexts/TenantContext';

interface SEOProps {
    title: string;
    description?: string;
}

const SEO = ({ title, description }: SEOProps) => {
    const { tenant } = useTenant();

    useEffect(() => {
        const baseTitle = tenant ? tenant.name : "OdevGPT";
        document.title = `${title} | ${baseTitle}`;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (description) {
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            } else {
                const meta = document.createElement('meta');
                meta.name = 'description';
                meta.content = description;
                document.head.appendChild(meta);
            }
        }
    }, [title, description, tenant]);

    return null; // This component doesn't render anything
};

export default SEO;

```

### src\components\SmartReminders.tsx
```
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Sparkles, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { askAI } from "@/lib/ai";

interface Assignment {
    id: string;
    title: string;
    due_date: string;
    status: string;
}

export default function SmartReminders({ assignments }: { assignments: Assignment[] }) {
    const [nudges, setNudges] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const pending = assignments.filter(a => a.status === 'pending').slice(0, 3);
        if (pending.length > 0) {
            generateNudges(pending);
        }
    }, [assignments]);

    const generateNudges = async (items: Assignment[]) => {
        try {
            setLoading(true);
            const prompt = `
        Aşağıdaki ödevler için öğrenciyi motive edecek, samimi ve çok kısa (max 10 kelime) birer "yapay zeka hatırlatıcısı" yaz. 
        Ödevler: ${items.map(i => i.title).join(", ")}
        Format: Ödev Adı: Mesaj | Ödev Adı: Mesaj
      `;

            const response = await askAI(prompt, "Sen motive edici bir eğitim koçusun. Kısa, enerjik ve destekleyici cevaplar ver.");

            const newNudges: Record<string, string> = {};
            response.split('|').forEach(part => {
                const [title, msg] = part.split(':');
                if (title && msg) newNudges[title.trim()] = msg.trim();
            });

            setNudges(newNudges);
        } catch (err) {
            console.error("Nudge generation failed", err);
        } finally {
            setLoading(false);
        }
    };

    const pendingAssignments = assignments.filter(a => a.status === 'pending');

    if (pendingAssignments.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Akıllı Hatırlatıcılar
                </h3>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">AI Destekli</Badge>
            </div>

            <div className="grid gap-3">
                {pendingAssignments.slice(0, 2).map((assignment, idx) => (
                    <motion.div
                        key={assignment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="border-none shadow-sm bg-gradient-to-r from-white to-primary/5 overflow-hidden group hover:shadow-md transition-all cursor-pointer">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h4 className="font-bold text-sm truncate">{assignment.title}</h4>
                                        <span className="text-[10px] text-orange-500 font-medium whitespace-nowrap">
                                            {formatDistanceToNow(new Date(assignment.due_date), { addSuffix: true, locale: tr })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground italic flex items-center gap-1">
                                        {nudges[assignment.title] || "AI senin için strateji hazırlıyor..."}
                                    </p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

```

### src\components\SubmitAssignmentDialog.tsx
```
/**
 * SUBMIT ASSIGNMENT DIALOG
 * 
 * Öğrencilerin ödev teslim etmesini sağlayan dialog.
 * Metin girişi, dosya yükleme ve OCR desteği içerir.
 */

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, Camera, FileText, CheckCircle, X, Sparkles } from 'lucide-react';
import { performOCR, formatOCRResult, type OCRResult } from '@/lib/advancedOCR';

interface SubmitAssignmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    assignmentId: string;
    assignmentTitle: string;
    onSuccess?: () => void;
}

export default function SubmitAssignmentDialog({
    open,
    onOpenChange,
    assignmentId,
    assignmentTitle,
    onSuccess,
}: SubmitAssignmentDialogProps) {
    const { user } = useAuth();
    const { toast } = useToast();

    const [submissionText, setSubmissionText] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [ocrResults, setOcrResults] = useState<OCRResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [ocrLoading, setOcrLoading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(selectedFiles);

        // Eğer resim dosyası varsa OCR çalıştır
        const imageFile = selectedFiles.find(f => f.type.startsWith('image/'));
        if (imageFile) {
            await runOCR(imageFile);
        }
    };

    const runOCR = async (file: File) => {
        try {
            setOcrLoading(true);
            toast({
                title: '📸 Gelişmiş OCR Başlatıldı',
                description: 'Görüntü analiz ediliyor ve en uygun OCR yöntemi seçiliyor...',
            });

            // Advanced OCR kullan
            const result = await performOCR(file, {
                preferMath: file.name.toLowerCase().includes('math') ||
                    file.name.toLowerCase().includes('matematik'),
                language: 'tur',
                enhanceImage: true,
            });

            setOcrResults(prev => [...prev, result]);

            // OCR metnini submission text'e ekle
            if (result.text.trim()) {
                const formattedResult = formatOCRResult(result);
                setSubmissionText(prev =>
                    prev ? `${prev}\n\n${formattedResult}` : formattedResult
                );

                toast({
                    title: `✅ ${result.method === 'mathpix' ? '🔢 Mathpix' : '📝 Tesseract'} OCR Tamamlandı`,
                    description: `Metin başarıyla okundu. Güven: ${(result.confidence * 100).toFixed(1)}%`,
                });
            }

        } catch (error) {
            console.error('OCR error:', error);
            toast({
                title: 'OCR Hatası',
                description: 'Görüntüdeki metin okunamadı.',
                variant: 'destructive',
            });
        } finally {
            setOcrLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!submissionText.trim() && files.length === 0) {
            toast({
                title: 'Eksik İçerik',
                description: 'Lütfen metin girin veya dosya yükleyin.',
                variant: 'destructive',
            });
            return;
        }

        if (!user) return;

        try {
            setLoading(true);

            // Dosyaları Supabase Storage'a yükle
            const uploadedFiles = [];
            for (const file of files) {
                const fileName = `${user.id}/${Date.now()}_${file.name}`;
                const { data, error } = await supabase.storage
                    .from('assignment_files')
                    .upload(fileName, file);

                if (error) throw error;

                uploadedFiles.push({
                    url: data.path,
                    name: file.name,
                    type: file.type,
                });
            }

            // RPC ile ödev teslim et
            const { data, error } = await supabase.rpc('submit_assignment', {
                p_assignment_id: assignmentId,
                p_student_id: user.id,
                p_submission_text: submissionText,
                p_submission_files: uploadedFiles.length > 0 ? uploadedFiles : null,
                p_ocr_text: ocrResults.map(r => r.text).join('\n\n') || null,
            });

            if (error) throw error;

            toast({
                title: '✅ Ödev Teslim Edildi',
                description: 'Ödeviniz başarıyla gönderildi. Öğretmeniniz değerlendirme yapacaktır.',
            });

            // Reset form
            setSubmissionText('');
            setFiles([]);
            setOcrResults([]);
            onOpenChange(false);
            onSuccess?.();

        } catch (error: any) {
            console.error('Submission error:', error);
            toast({
                title: 'Hata',
                description: error.message || 'Ödev teslim edilirken bir sorun oluştu.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Ödev Teslim Et
                    </DialogTitle>
                    <DialogDescription>
                        {assignmentTitle}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Metin Girişi */}
                    <div className="space-y-2">
                        <Label htmlFor="submission">Cevabınız</Label>
                        <Textarea
                            id="submission"
                            placeholder="Ödev cevabınızı buraya yazın..."
                            value={submissionText}
                            onChange={(e) => setSubmissionText(e.target.value)}
                            rows={8}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            {submissionText.length} karakter
                        </p>
                    </div>

                    {/* Dosya Yükleme */}
                    <div className="space-y-2">
                        <Label>Dosya Ekle (Opsiyonel)</Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => document.getElementById('file-upload')?.click()}
                                disabled={ocrLoading}
                            >
                                {ocrLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        OCR Çalışıyor...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Dosya Seç
                                    </>
                                )}
                            </Button>
                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                accept="image/*,application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Resim veya PDF dosyası yükleyebilirsiniz. Resimler otomatik olarak okunacaktır (OCR).
                        </p>
                    </div>

                    {/* Yüklenen Dosyalar */}
                    {files.length > 0 && (
                        <div className="space-y-2">
                            <Label>Yüklenen Dosyalar</Label>
                            <div className="space-y-2">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 rounded-lg border bg-card"
                                    >
                                        <div className="flex items-center gap-2">
                                            {file.type.startsWith('image/') ? (
                                                <Camera className="w-4 h-4 text-blue-600" />
                                            ) : (
                                                <FileText className="w-4 h-4 text-gray-600" />
                                            )}
                                            <span className="text-sm font-medium truncate max-w-[300px]">
                                                {file.name}
                                            </span>
                                            <Badge variant="secondary" className="text-xs">
                                                {(file.size / 1024).toFixed(1)} KB
                                            </Badge>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFile(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* OCR Sonuçları */}
                    {ocrResults.length > 0 && (
                        <div className="space-y-3">
                            <Label>OCR Sonuçları</Label>
                            {ocrResults.map((result, index) => (
                                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {result.method === 'mathpix' ? (
                                                <Sparkles className="w-4 h-4 text-purple-600" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                            )}
                                            <span className="text-sm font-semibold text-blue-900">
                                                {result.method === 'mathpix' ? 'Mathpix AI Analizi' : 'Tesseract Metin Tanıma'}
                                            </span>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] scale-90">
                                            %{(result.confidence * 100).toFixed(0)} Güven
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-blue-800 whitespace-pre-wrap max-h-32 overflow-y-auto font-mono">
                                        {result.text.length > 300 ? result.text.substring(0, 300) + '...' : result.text}
                                    </p>
                                    {result.latex && (
                                        <div className="mt-2 pt-2 border-t border-blue-100">
                                            <span className="text-[10px] font-bold text-blue-700 uppercase">LaTeX Çıktısı:</span>
                                            <code className="block text-[10px] bg-blue-100/50 p-1 rounded mt-1 overflow-x-auto">
                                                {result.latex}
                                            </code>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        İptal
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading || ocrLoading}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Gönderiliyor...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Teslim Et
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

```

### src\components\TenantManager.tsx
```
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { School, Settings2, Palette, Globe, Save, Loader2, PlayCircle } from "lucide-react";

interface Tenant {
    id: string;
    name: string;
    slug: string;
    domain: string | null;
    logo_url: string | null;
    primary_color: string | null;
    cto_name: string | null;
    cto_note: string | null;
    video_url: string | null;
    hide_universe_section: boolean;
    hero_style: 'gradient' | 'industrial' | 'modern';
}

export default function TenantManager() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from("tenants").select("*").order("name");
            if (error) throw error;
            setTenants(data || []);
            if (data && data.length > 0 && !selectedTenant) {
                setSelectedTenant(data[0]);
            }
        } catch (err: any) {
            toast({ title: "Hata", description: err.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!selectedTenant) return;
        try {
            setSaving(true);
            const { error } = await supabase
                .from("tenants")
                .update({
                    name: selectedTenant.name,
                    slug: selectedTenant.slug,
                    domain: selectedTenant.domain,
                    logo_url: selectedTenant.logo_url,
                    primary_color: selectedTenant.primary_color,
                    cto_name: selectedTenant.cto_name,
                    cto_note: selectedTenant.cto_note,
                    video_url: selectedTenant.video_url,
                    hide_universe_section: selectedTenant.hide_universe_section,
                    hero_style: selectedTenant.hero_style
                })
                .eq("id", selectedTenant.id);

            if (error) throw error;
            toast({ title: "Başarılı", description: "Kurum ayarları güncellendi." });
            fetchTenants();
        } catch (err: any) {
            toast({ title: "Hata", description: err.message, variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="py-10 text-center animate-pulse">Kurumlar yükleniyor...</div>;

    return (
        <div className="grid gap-8 lg:grid-cols-4">
            {/* Kurum Listesi */}
            <div className="lg:col-span-1 space-y-2">
                <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4 px-2 tracking-widest">Kayıtlı Kurumlar</h3>
                {tenants.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setSelectedTenant(t)}
                        className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedTenant?.id === t.id
                                ? 'bg-primary/5 border-primary shadow-sm'
                                : 'bg-white border-transparent hover:bg-gray-50'
                            }`}
                    >
                        <div className="font-bold flex items-center gap-2">
                            <School className={`w-4 h-4 ${selectedTenant?.id === t.id ? 'text-primary' : 'text-gray-400'}`} />
                            {t.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground ml-6 font-mono">{t.slug}</div>
                    </button>
                ))}
            </div>

            {/* Düzenleme Alanı */}
            <div className="lg:col-span-3">
                {selectedTenant ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black">{selectedTenant.name} Yapılandırması</h2>
                                <p className="text-muted-foreground text-sm">Kurumun görsel kimliğini ve özelliklerini yönetin.</p>
                            </div>
                            <Button onClick={handleUpdate} disabled={saving} className="gap-2 shadow-lg shadow-primary/20">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Ayarları Kaydet
                            </Button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-sm flex items-center gap-2"><Settings2 className="w-4 h-4" /> Genel Bilgiler</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Kurum Adı</Label>
                                        <Input value={selectedTenant.name} onChange={e => setSelectedTenant({ ...selectedTenant, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Slug (Alt Alan Adı)</Label>
                                        <Input value={selectedTenant.slug} onChange={e => setSelectedTenant({ ...selectedTenant, slug: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Özel Alan Adı (Custom Domain)</Label>
                                        <Input value={selectedTenant.domain || ''} onChange={e => setSelectedTenant({ ...selectedTenant, domain: e.target.value })} placeholder="isikdamper.online" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-sm flex items-center gap-2"><Palette className="w-4 h-4" /> Görsel Kimlik</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Logo URL</Label>
                                        <Input value={selectedTenant.logo_url || ''} onChange={e => setSelectedTenant({ ...selectedTenant, logo_url: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Birincil Renk (HSL: 263 84% 50%)</Label>
                                        <Input value={selectedTenant.primary_color || ''} onChange={e => setSelectedTenant({ ...selectedTenant, primary_color: e.target.value })} />
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <Label>Universe Bölümünü Gizle</Label>
                                        <Switch checked={selectedTenant.hide_universe_section} onCheckedChange={val => setSelectedTenant({ ...selectedTenant, hide_universe_section: val })} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-2">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-sm flex items-center gap-2"><Globe className="w-4 h-4" /> Beyaz Etiket (White-Label) & İçerik</CardTitle>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>CTO / Yönetici Adı</Label>
                                            <Input value={selectedTenant.cto_name || ''} onChange={e => setSelectedTenant({ ...selectedTenant, cto_name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>CTO Notu</Label>
                                            <Textarea value={selectedTenant.cto_note || ''} onChange={e => setSelectedTenant({ ...selectedTenant, cto_note: e.target.value })} rows={4} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2"><PlayCircle className="w-4 h-4" /> Tanıtım Videosu URL (YouTube)</Label>
                                            <Input value={selectedTenant.video_url || ''} onChange={e => setSelectedTenant({ ...selectedTenant, video_url: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Hero Tasarım Stili</Label>
                                            <select
                                                className="w-full bg-white border p-2 rounded-md text-sm"
                                                value={selectedTenant.hero_style}
                                                onChange={e => setSelectedTenant({ ...selectedTenant, hero_style: e.target.value as any })}
                                            >
                                                <option value="gradient">Gradient (Modern)</option>
                                                <option value="industrial">Industrial (Ciddi)</option>
                                                <option value="modern">Minimalist</option>
                                            </select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-gray-50/50 rounded-3xl border-2 border-dashed">
                        <School className="w-12 h-12 mb-4 opacity-20" />
                        <p className="italic">Düzenlemek için sol taraftan bir kurum seçin.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

```

### src\components\WeeklyReportCard.tsx
```
/**
 * WEEKLY REPORT CARD
 * Veli için haftalık AI destekli öğrenci raporu kartı
 */

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { generateWeeklyParentReport, generateReportHighlights } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';
import {
    FileText,
    Sparkles,
    TrendingUp,
    Award,
    Calendar,
    Loader2
} from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { tr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';

interface WeeklyReportCardProps {
    studentId: string;
    studentName: string;
}

interface WeeklyStats {
    total_questions: number;
    solved_questions: number;
    success_rate: number;
    total_xp_gained: number;
    level_ups: number;
    recent_questions?: Array<{ question_text: string; status: string }>;
}

export function WeeklyReportCard({ studentId, studentName }: WeeklyReportCardProps) {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<{
        summary: string;
        highlights: string[];
        stats: WeeklyStats;
        weekStart: Date;
        weekEnd: Date;
    } | null>(null);
    const { toast } = useToast();
    const [fetchedOnMount, setFetchedOnMount] = useState(false);

    // Mevcut raporu çek
    const fetchExistingReport = useCallback(async () => {
        if (!studentId || fetchedOnMount) return;

        try {
            const now = new Date();
            const weekStart = startOfWeek(now, { weekStartsOn: 1 });

            const { data, error } = await supabase
                .from('parent_reports')
                .select('*')
                .eq('student_id', studentId)
                .eq('week_start', format(weekStart, 'yyyy-MM-dd'))
                .maybeSingle();

            if (error) throw error;

            if (data) {
                // Eğer rapor varsa state'e yükle
                setReport({
                    summary: data.ai_summary,
                    highlights: data.ai_highlights || [],
                    stats: {
                        total_questions: data.total_questions,
                        solved_questions: data.solved_questions,
                        success_rate: data.success_rate,
                        total_xp_gained: data.total_xp_gained,
                        level_ups: data.level_ups
                    },
                    weekStart: new Date(data.week_start),
                    weekEnd: new Date(data.week_end)
                });
            }
        } catch (error) {
            console.error('Mevcut rapor yüklenemedi:', error);
        } finally {
            setFetchedOnMount(true);
        }
    }, [studentId, fetchedOnMount]);

    useEffect(() => {
        fetchExistingReport();
    }, [fetchExistingReport]);

    // Öğrenci değişirse tekrar çekmeyi sağla
    useEffect(() => {
        setFetchedOnMount(false);
        setReport(null);
    }, [studentId]);

    const generateReport = async () => {
        setLoading(true);
        try {
            // Bu haftanın başlangıç ve bitiş tarihlerini hesapla
            const now = new Date();
            const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Pazartesi
            const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Pazar

            // Haftalık istatistikleri getir
            const { data: statsData, error: statsError } = await supabase
                .rpc('get_student_weekly_stats', {
                    p_student_id: studentId,
                    p_week_start: format(weekStart, 'yyyy-MM-dd'),
                    p_week_end: format(weekEnd, 'yyyy-MM-dd')
                });

            if (statsError) throw statsError;

            const stats = statsData as WeeklyStats;

            // Eğer hiç aktivite yoksa
            if (stats.total_questions === 0) {
                toast({
                    title: "Henüz Aktivite Yok",
                    description: `${studentName} bu hafta henüz soru sormamış.`,
                    variant: "default"
                });
                setLoading(false);
                return;
            }

            // AI ile rapor oluştur
            const [aiSummary, aiHighlights] = await Promise.all([
                generateWeeklyParentReport(studentName, stats),
                generateReportHighlights(studentName, stats)
            ]);

            // Raporu kaydet (cache için)
            const { error: insertError } = await supabase
                .from('parent_reports')
                .insert({
                    parent_id: (await supabase.auth.getUser()).data.user?.id,
                    student_id: studentId,
                    week_start: format(weekStart, 'yyyy-MM-dd'),
                    week_end: format(weekEnd, 'yyyy-MM-dd'),
                    total_questions: stats.total_questions,
                    solved_questions: stats.solved_questions,
                    success_rate: stats.success_rate,
                    total_xp_gained: stats.total_xp_gained,
                    level_ups: stats.level_ups,
                    ai_summary: aiSummary,
                    ai_highlights: aiHighlights
                });

            if (insertError && insertError.code !== '23505') { // 23505 = unique constraint violation (zaten var)
                console.warn('Rapor kaydedilemedi:', insertError);
            }

            setReport({
                summary: aiSummary,
                highlights: aiHighlights,
                stats,
                weekStart,
                weekEnd
            });

            toast({
                title: "Rapor Oluşturuldu! ✨",
                description: "Haftalık gelişim raporu hazır.",
            });

        } catch (error) {
            console.error('Rapor oluşturma hatası:', error);
            toast({
                title: "Hata",
                description: "Rapor oluşturulurken bir sorun oluştu.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <CardTitle>Haftalık Gelişim Raporu</CardTitle>
                    </div>
                    {report && (
                        <Badge variant="outline" className="gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(report.weekStart, 'd MMM', { locale: tr })} - {format(report.weekEnd, 'd MMM', { locale: tr })}
                        </Badge>
                    )}
                </div>
                <CardDescription>
                    {studentName} için AI destekli haftalık performans özeti
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!report && !loading && (
                    <div className="text-center py-8">
                        <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                            Bu hafta için henüz rapor oluşturulmamış
                        </p>
                        <Button
                            onClick={generateReport}
                            className="gap-2"
                        >
                            <Sparkles className="h-4 w-4" />
                            Rapor Oluştur
                        </Button>
                    </div>
                )}

                {loading && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-purple-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">AI rapor oluşturuyor...</span>
                        </div>
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                )}

                {report && !loading && (
                    <div className="space-y-6">
                        {/* İstatistik Kartları */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-blue-600">{report.stats.total_questions}</div>
                                    <div className="text-xs text-blue-600/70">Soru Sordu</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-green-600">{report.stats.solved_questions}</div>
                                    <div className="text-xs text-green-600/70">Çözüm Buldu</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-purple-600">%{report.stats.success_rate.toFixed(0)}</div>
                                    <div className="text-xs text-purple-600/70">Başarı Oranı</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-orange-600">{report.stats.total_xp_gained}</div>
                                    <div className="text-xs text-orange-600/70">XP Kazandı</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Öne Çıkan Noktalar */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Award className="h-4 w-4 text-yellow-600" />
                                Öne Çıkan Noktalar
                            </div>
                            <div className="space-y-2">
                                {report.highlights.map((highlight, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800"
                                    >
                                        <TrendingUp className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{highlight}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Özeti */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Sparkles className="h-4 w-4 text-purple-600" />
                                AI Gelişim Raporu
                            </div>
                            <div className="prose prose-sm dark:prose-invert max-w-none p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200 dark:border-purple-800">
                                <ReactMarkdown>{report.summary}</ReactMarkdown>
                            </div>
                        </div>

                        {/* Yeni Rapor Oluştur Butonu */}
                        <Button
                            onClick={generateReport}
                            variant="outline"
                            className="w-full gap-2"
                            disabled={loading}
                        >
                            <Sparkles className="h-4 w-4" />
                            Raporu Yenile
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

```

### src\contexts\AuthContext.tsx
```
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface Profile {
    id: string;
    role: 'student' | 'teacher' | 'admin' | 'parent';
    full_name: string | null;
    grade_level: number | null;
    field: string | null;
    avatar_url: string | null;
    xp: number;
    level: number;
    streak: number;
    parent_access_code: string | null;
    last_activity_at: string;
    notification_preferences?: {
        question_answered?: boolean;
        weekly_report?: boolean;
        new_tasks?: boolean;
        student_activity?: boolean;
        assignment_graded?: boolean;
    };
    tenant_id: string | null;
    is_super_admin: boolean;
}

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, fullName: string, role?: string, tenantId?: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        setLoading(true);
        setProfile(null);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                // Eğer profil yoksa (PGRST116), otomatik oluşturmayı dene (Fallback)
                if (error.code === 'PGRST116') {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        const newProfile = {
                            id: user.id,
                            full_name: user.user_metadata.full_name || 'Yeni Kullanıcı',
                            role: user.user_metadata.role || 'student',
                        };
                        const { data: createdProfile, error: createError } = await supabase
                            .from('profiles')
                            .insert(newProfile)
                            .select()
                            .single();

                        if (!createError) {
                            setProfile(createdProfile);
                            return;
                        }
                    }
                }
                throw error;
            }
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        navigate('/dashboard');
    };

    const signUp = async (email: string, password: string, fullName: string, role: string = 'student', tenantId?: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                    tenant_id: tenantId,
                },
            },
        });
        if (error) throw error;

        // Profile otomatik oluşturulacak (trigger sayesinde)
        // Ama role'ü güncellememiz gerekebilir (Eğer trigger'da bir aksilik olursa veya anlık güncelleme gerekirse)
        if (data.user && (role !== 'student' || tenantId)) {
            await supabase
                .from('profiles')
                .update({ role, tenant_id: tenantId })
                .eq('id', data.user.id);
        }

        navigate('/dashboard');
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        navigate('/');
    };

    const value = {
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

```

### src\contexts\TenantContext.tsx
```
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface TenantConfig {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
    primary_color?: string; // HSL format: "263 84% 50%"
    secondary_color?: string;
    favicon_url?: string;
    // White-labeling Overrides
    hide_universe_section?: boolean;
    hide_podcast_section?: boolean;
    hide_video_section?: boolean;
    video_position?: 'left' | 'right';
    dark_mode?: boolean;
    hero_style?: 'gradient' | 'industrial' | 'modern';
    custom_cto_name?: string;
    custom_cto_note?: string;
    custom_video_url?: string;
    custom_podcast_url?: string;
    support_email?: string;
}

interface TenantContextType {
    tenant: TenantConfig | null;
    isLoading: boolean;
}

const TenantContext = createContext<TenantContextType>({
    tenant: null,
    isLoading: true,
});

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tenant, setTenant] = useState<TenantConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const resolveTenant = async () => {
            const hostname = window.location.hostname;
            const searchParams = new URLSearchParams(window.location.search);
            const debugTenant = searchParams.get('tenant');

            try {
                let data: any = null;
                let error: any = null;

                // 1. Determine the slug or domain to query
                if (debugTenant) {
                    // Manual debug override via ?tenant=slug
                    const response = await supabase
                        .from('tenants')
                        .select('*')
                        .eq('slug', debugTenant)
                        .single();
                    data = response.data;
                    error = response.error;
                } else {
                    // Try exact domain match (e.g., isikdamper.online)
                    const response = await supabase
                        .from('tenants')
                        .select('*')
                        .eq('domain', hostname)
                        .single();
                    data = response.data;
                    error = response.error;

                    if (error || !data) {
                        // Fallback: Check subdomain for .edusonex.com.tr
                        const subdomain = hostname.split('.')[0];
                        if (subdomain && subdomain !== 'odev' && subdomain !== 'www') {
                            const subResponse = await supabase
                                .from('tenants')
                                .select('*')
                                .eq('slug', subdomain)
                                .single();
                            data = subResponse.data;
                            error = subResponse.error;
                        }
                    }
                }

                if (data && !error) {
                    const config: TenantConfig = {
                        ...data,
                        // Map database column names to existing interface names
                        custom_cto_name: data.cto_name,
                        custom_cto_note: data.cto_note,
                        custom_video_url: data.video_url,
                        custom_podcast_url: data.podcast_url,
                    };
                    applyTenantBranding(config);
                    setTenant(config);
                } else {
                    setTenant(null);
                }
            } catch (err) {
                console.error("Tenant resolution error:", err);
                setTenant(null);
            } finally {
                setIsLoading(false);
            }
        };

        resolveTenant();
    }, []);


    const applyTenantBranding = (config: TenantConfig) => {
        if (config.primary_color) {
            document.documentElement.style.setProperty('--primary', config.primary_color);
            document.documentElement.style.setProperty('--ring', config.primary_color);
        }

        // Handle Dark Mode
        if (config.dark_mode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        if (config.name) {
            document.title = `${config.name} | OdevGPT`;
        }

        if (config.favicon_url) {
            const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
            if (link) {
                link.href = config.favicon_url;
            } else {
                const newLink = document.createElement('link');
                newLink.rel = 'icon';
                newLink.href = config.favicon_url;
                document.head.appendChild(newLink);
            }
        }
    };

    return (
        <TenantContext.Provider value={{ tenant, isLoading }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => useContext(TenantContext);

```

### src\hooks\use-mobile.tsx
```
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

```

### src\hooks\use-toast.ts
```
import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };

```

### src\lib\add_invite_code.sql
```
-- 🎓 DAVET KODU SİSTEMİ 🎓
-- Bu kodu Supabase SQL Editor'de çalıştırın.

-- 1. Classes tablosuna 'invite_code' sütunu ekle
ALTER TABLE public.classes 
ADD COLUMN IF NOT EXISTS invite_code TEXT;

-- 2. Var olan sınıflara rastgele kod üret (Eğer varsa)
-- (Sadece boş olanları günceller)
UPDATE public.classes 
SET invite_code = upper(substring(md5(random()::text) from 1 for 6))
WHERE invite_code IS NULL;

-- 3. Benzersizlik kısıtlaması ekle (İki sınıf aynı koda sahip olamaz)
ALTER TABLE public.classes 
ADD CONSTRAINT classes_invite_code_key UNIQUE (invite_code);

```

### src\lib\admin_yap.sql
```
-- 👑 EDUSONEX ÖDEVGPT - ADMİN YETKİSİ VERME KOMUTU 👑
-- Bu kodu Supabase Dashboard -> SQL Editor kısmına yapıştırıp RUN butonuna basın.

DO $$
DECLARE
  target_email TEXT := 'ferhatkaraduman@gmail.com'; -- Hedef E-posta
  user_id UUID;
BEGIN
  -- 1. Kullanıcının ID'sini bul
  SELECT id INTO user_id FROM auth.users WHERE email = target_email;

  IF user_id IS NULL THEN
    RAISE NOTICE 'Kullanıcı bulunamadı: %', target_email;
  ELSE
    -- 2. Profiles tablosunu güncelle (Visible Role)
    UPDATE public.profiles
    SET role = 'admin'
    WHERE id = user_id;

    -- 3. Auth metadata'yı güncelle (Supabase Auth Role - Opsiyonel ama iyi olur)
    UPDATE auth.users
    SET raw_user_meta_data = 
      COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
    WHERE id = user_id;

    RAISE NOTICE 'Kullanıcı başarıyla ADMİN yapıldı: % (ID: %)', target_email, user_id;
  END IF;
END $$;

```

### src\lib\advancedOCR.ts
```
/**
 * ADVANCED OCR SERVICE
 * 
 * Hybrid OCR sistemi:
 * - Tesseract.js: Genel metin tanıma
 * - Mathpix API: Matematik formülleri ve denklemler
 * - Otomatik seçim: İçerik tipine göre en uygun OCR'ı kullanır
 */

import Tesseract from 'tesseract.js';

// Mathpix API configuration
const MATHPIX_APP_ID = import.meta.env.VITE_MATHPIX_APP_ID;
const MATHPIX_APP_KEY = import.meta.env.VITE_MATHPIX_APP_KEY;
const MATHPIX_API_URL = 'https://api.mathpix.com/v3/text';

export interface OCRResult {
    text: string;
    latex?: string;
    confidence: number;
    method: 'tesseract' | 'mathpix';
    processingTime: number;
}

export interface OCROptions {
    preferMath?: boolean; // Matematik içerik bekleniyor mu?
    language?: string; // 'tur', 'eng', 'auto'
    enhanceImage?: boolean; // Görüntü iyileştirme yapılsın mı?
}

/**
 * Görüntüde matematik içeriği olup olmadığını tespit eder
 */
function detectMathContent(file: File): boolean {
    // Basit heuristik: Dosya adında "math", "matematik", "formül" gibi kelimeler var mı?
    const fileName = file.name.toLowerCase();
    const mathKeywords = ['math', 'matematik', 'formül', 'denklem', 'equation', 'formula'];

    return mathKeywords.some(keyword => fileName.includes(keyword));
}

/**
 * Görüntüyü ön işleme tabi tutar (kontrast, parlaklık, gürültü azaltma)
 */
async function preprocessImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Canvas context not available'));
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;

                // Görüntüyü çiz
                ctx.drawImage(img, 0, 0);

                // Kontrast ve parlaklık ayarı
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                const contrast = 1.2; // %20 kontrast artışı
                const brightness = 10; // 10 birim parlaklık artışı

                for (let i = 0; i < data.length; i += 4) {
                    // RGB kanallarını ayarla
                    data[i] = Math.min(255, Math.max(0, contrast * (data[i] - 128) + 128 + brightness));
                    data[i + 1] = Math.min(255, Math.max(0, contrast * (data[i + 1] - 128) + 128 + brightness));
                    data[i + 2] = Math.min(255, Math.max(0, contrast * (data[i + 2] - 128) + 128 + brightness));
                }

                ctx.putImageData(imageData, 0, 0);

                // Base64 olarak döndür
                resolve(canvas.toDataURL('image/png'));
            };

            img.onerror = () => reject(new Error('Image loading failed'));
            img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error('File reading failed'));
        reader.readAsDataURL(file);
    });
}

/**
 * Tesseract.js ile OCR yapar
 */
async function runTesseractOCR(file: File, language: string = 'tur'): Promise<OCRResult> {
    const startTime = Date.now();

    try {
        const { data } = await Tesseract.recognize(file, language, {
            logger: (m) => console.log('[Tesseract]', m),
        });

        const processingTime = Date.now() - startTime;

        return {
            text: data.text,
            confidence: data.confidence,
            method: 'tesseract',
            processingTime,
        };
    } catch (error) {
        console.error('Tesseract OCR error:', error);
        throw new Error('Tesseract OCR failed');
    }
}

/**
 * Mathpix API ile matematik OCR yapar
 */
async function runMathpixOCR(file: File): Promise<OCRResult> {
    const startTime = Date.now();

    if (!MATHPIX_APP_ID || !MATHPIX_APP_KEY) {
        throw new Error('Mathpix API credentials not configured');
    }

    try {
        // Dosyayı base64'e çevir
        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // "data:image/png;base64," kısmını kaldır
                const base64Data = result.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        // Mathpix API'ye istek gönder
        const response = await fetch(MATHPIX_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'app_id': MATHPIX_APP_ID,
                'app_key': MATHPIX_APP_KEY,
            },
            body: JSON.stringify({
                src: `data:image/png;base64,${base64}`,
                formats: ['text', 'latex_styled'],
                ocr: ['math', 'text'],
            }),
        });

        if (!response.ok) {
            throw new Error(`Mathpix API error: ${response.status}`);
        }

        const data = await response.json();
        const processingTime = Date.now() - startTime;

        return {
            text: data.text || '',
            latex: data.latex_styled || data.latex || undefined,
            confidence: data.confidence || 0.95,
            method: 'mathpix',
            processingTime,
        };
    } catch (error) {
        console.error('Mathpix OCR error:', error);
        throw new Error('Mathpix OCR failed');
    }
}

/**
 * Hybrid OCR: En uygun yöntemi seçer ve OCR yapar
 */
export async function performOCR(
    file: File,
    options: OCROptions = {}
): Promise<OCRResult> {
    const {
        preferMath = false,
        language = 'tur',
        enhanceImage = true,
    } = options;

    // Görüntü iyileştirme
    let processedFile = file;
    if (enhanceImage) {
        try {
            const enhancedDataUrl = await preprocessImage(file);
            const blob = await fetch(enhancedDataUrl).then(r => r.blob());
            processedFile = new File([blob], file.name, { type: 'image/png' });
        } catch (error) {
            console.warn('Image preprocessing failed, using original:', error);
        }
    }

    // Matematik içeriği tespiti
    const hasMathContent = preferMath || detectMathContent(file);

    // Mathpix kullanılabilir mi?
    const mathpixAvailable = !!(MATHPIX_APP_ID && MATHPIX_APP_KEY);

    // Strateji seçimi
    if (hasMathContent && mathpixAvailable) {
        console.log('🔢 Using Mathpix OCR for math content');
        try {
            return await runMathpixOCR(processedFile);
        } catch (error) {
            console.warn('Mathpix failed, falling back to Tesseract:', error);
            return await runTesseractOCR(processedFile, language);
        }
    } else {
        console.log('📝 Using Tesseract OCR for general text');
        return await runTesseractOCR(processedFile, language);
    }
}

/**
 * Çoklu dosya için OCR yapar
 */
export async function performBatchOCR(
    files: File[],
    options: OCROptions = {}
): Promise<OCRResult[]> {
    const results: OCRResult[] = [];

    for (const file of files) {
        try {
            const result = await performOCR(file, options);
            results.push(result);
        } catch (error) {
            console.error(`OCR failed for ${file.name}:`, error);
            results.push({
                text: '',
                confidence: 0,
                method: 'tesseract',
                processingTime: 0,
            });
        }
    }

    return results;
}

/**
 * OCR sonucunu formatlar (LaTeX varsa gösterir)
 */
export function formatOCRResult(result: OCRResult): string {
    let formatted = result.text;

    if (result.latex) {
        formatted += '\n\n--- LaTeX Formatı ---\n' + result.latex;
    }

    formatted += `\n\n[OCR Yöntemi: ${result.method.toUpperCase()}, Güven: ${(result.confidence * 100).toFixed(1)}%, Süre: ${result.processingTime}ms]`;

    return formatted;
}

```

### src\lib\ai.ts
```
/**
 * AI Service for OdevGPT
 * Supports multiple providers: Groq, Gemini, OpenAI, Claude
 */
import { supabase } from "./supabase";

// Model Configuration
interface AIProviderConfig {
    url: string;
    apiKey: string | undefined;
    model: string;
    label: string;
}

const PROVIDERS: Record<string, AIProviderConfig> = {
    "groq-llama3": {
        url: "https://api.groq.com/openai/v1/chat/completions",
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        model: "llama-3.3-70b-versatile",
        label: "Groq (Llama 3)"
    },
    "gemini-flash": {
        url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        apiKey: import.meta.env.VITE_GEMINI_API_KEY,
        model: "gemini-1.5-flash",
        label: "Google Gemini 1.5 Flash"
    },
    "gpt-4o": {
        url: "https://api.openai.com/v1/chat/completions",
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        model: "gpt-4o",
        label: "OpenAI GPT-4o"
    },
    "gpt-4-turbo": {
        url: "https://api.openai.com/v1/chat/completions",
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        model: "gpt-4-turbo",
        label: "OpenAI GPT-4 Turbo"
    },
    "gpt-3.5-turbo": {
        url: "https://api.openai.com/v1/chat/completions",
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        model: "gpt-3.5-turbo",
        label: "OpenAI GPT-3.5 Turbo"
    },
    "claude-3-sonnet": {
        // Anthropic API formatı farklı olduğu için şimdilik OpenAI uyumlu bir proxy veya farklı fetch yapısı gerekir.
        // Basitlik için bunu şimdilik devre dışı bırakıyoruz veya yine OpenAI uyumlu bir sağlayıcı üzerinden (örn: OpenRouter) geçirebiliriz.
        // Ancak kullanıcı doğrudan Claude seçerse ve API Key varsa, Anthropic SDK'sı gerekebilir.
        // Bu örnekte OpenAI uyumlu endpointler (Groq, Gemini, OpenAI) odaklıyız.
        url: "https://api.anthropic.com/v1/messages",
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
        model: "claude-3-sonnet-20240229",
        label: "Claude 3.5 Sonnet"
    }
};

/**
 * Get accurate provider configuration based on admin settings
 * Fallback mechanism included
 */
function getActiveProvider(): AIProviderConfig {
    let selectedModelId = "groq-llama3"; // Default

    try {
        const settings = localStorage.getItem('admin_system_settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            if (parsed.aiModel && PROVIDERS[parsed.aiModel]) {
                selectedModelId = parsed.aiModel;
            }
        }
    } catch (e) {
        console.warn("Error reading admin settings, using default model.");
    }

    let config = PROVIDERS[selectedModelId];

    // 1. Seçilen modelin API Key'i var mı?
    if (!config.apiKey) {
        console.warn(`${config.label} API Key not found. Trying fallback...`);

        // 2. Fallback: Önce Groq dene
        if (PROVIDERS["groq-llama3"].apiKey) {
            console.log("Fallback to Groq");
            return PROVIDERS["groq-llama3"];
        }

        // 3. Fallback: Sonra Gemini dene
        if (PROVIDERS["gemini-flash"].apiKey) {
            console.log("Fallback to Gemini");
            return PROVIDERS["gemini-flash"];
        }

        // 4. Fallback: Sonra OpenAI dene
        if (PROVIDERS["gpt-4o"].apiKey) {
            return PROVIDERS["gpt-4o"];
        }
    }

    return config;
}

const TEACHER_PROMPT = `
Sen OdevGPT'nin uzman eğitim koçu ve öğretmenisin.
Görevin: Öğrencilerin sorularını sadece çözmek değil, onlara konuyu öğretmek.

ÖZEL KURALLAR:
1. Asla sadece şıkkı (A, B, C..) söyleyip geçme.
2. Önce soruyu analiz et: Hangi konu? Hangi formüller/bilgiler gerekli?
3. Adım adım çözüm uygula.
4. Çözümün sonunda "Sonuç: X" şeklinde net bir sonuç belirt.
5. Öğrenciyle samimi, motive edici ve Türkçe konuş.
6. Eğer soru metni JSON formatında gelirse, "soru_metni", "soru_koku" ve "secenekler" alanlarını birleştirip anlamlı bir soru haline getir ve öyle çöz.
7. Matematiksel ifadeleri anlaşılır şekilde, mümkünse LaTeX formatında ($...$) yaz.
8. Önemli terimleri ve başlıkları **kalın** yazarak vurgula.
`;

/**
 * Unified AI Request Handler with Automatic Fallback & Logging
 */
async function makeAIRequest(messages: { role: string; content: string }[], temperature: number = 0.7) {
    const primaryProvider = getActiveProvider();

    // Fallback listesi: seçilen dışındakileri ekle
    const fallbackProviders = [
        PROVIDERS["groq-llama3"],
        PROVIDERS["gemini-flash"],
        PROVIDERS["gpt-4o"]
    ].filter(p => p.model !== primaryProvider.model && p.apiKey);

    const providersToTry = [primaryProvider, ...fallbackProviders];
    let lastError = null;

    for (const provider of providersToTry) {
        if (!provider.apiKey) continue;

        try {
            console.log(`AI Request: Attempting with ${provider.label}...`);

            // Format content correctly for the API
            // Some providers might need special handling for vision, but standard OpenAI format is used here.
            const response = await fetch(provider.url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${provider.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: provider.model,
                    messages: messages,
                    temperature: temperature,
                    max_tokens: 1000 // Ensure enough tokens for complex tasks
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                // Rate limit (429) veya Server Error durumunda bir sonrakini dene
                if (response.status === 429 || response.status >= 500) {
                    console.warn(`${provider.label} limit/error (${response.status}). Trying next provider...`);
                    lastError = data.error?.message || response.statusText;
                    continue;
                }
                throw new Error(`AI API Hatası (${provider.label}): ${data.error?.message || response.statusText}`);
            }

            // Başarılı yanıt geldiyse logla ve dön
            const content = data.choices[0].message.content;
            const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

            // Arkaplanda logla (beklemeye gerek yok)
            supabase.from("ai_usage_logs").insert({
                provider: provider.label,
                model: provider.model,
                prompt_tokens: usage.prompt_tokens,
                completion_tokens: usage.completion_tokens,
                total_tokens: usage.total_tokens,
                status: 'success'
            }).then(({ error }) => error && console.error("Usage log error:", error));

            return content;

        } catch (error: any) {
            console.error(`${provider.label} request failed:`, error.message);
            lastError = error.message;

            // Eğer bu son provider ise hatayı fırlat
            if (provider === providersToTry[providersToTry.length - 1]) {
                // Başarısızlık durumunu logla
                supabase.from("ai_usage_logs").insert({
                    provider: provider.label,
                    model: provider.model,
                    status: 'failed',
                    error_message: error.message
                }).then(({ error }) => error && console.error("Usage log error:", error));

                throw new Error(`Sistem şu an çok yoğun. Lütfen birkaç dakika sonra tekrar deneyin. (Hata: ${lastError})`);
            }
        }
    }

    throw new Error(`AI servislerine ulaşılamıyor. Lütfen API anahtarlarınızı kontrol edin.`);
}

export async function askAI(prompt: string, systemPrompt: string = "Sen yardımcı bir eğitim asistanısın.") {
    return makeAIRequest([
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
    ], 0.7);
}

/**
 * Öğretmen duyurusunu pedagojik ve etkileyici hale getirir
 */
export async function enhanceAnnouncement(content: string) {
    const systemPrompt = `
    Sen OdevGPT'nin akıllı eğitim asistanısın. 
    Görevin: Öğretmenin yazdığı kısa ve teknik duyuruları, öğrenciler için motive edici, nazik, 
    pedagojik açıdan doğru ve heyecan verici bir dille yeniden yazmak. 
    - Duyurunun özünü koru.
    - Emoji kullan.
    - Öğrencilere hitap şeklin samimi ve destekleyici olsun.
    - Metni çok uzatmadan, okunabilirliği yüksek tut.
  `;

    return askAI(`Lütfen şu duyuruyu geliştir: "${content}"`, systemPrompt);
}

/**
 * Duyuruyu öğrenciler için 3 maddelik can alıcı noktaya özetler
 */
export async function summarizeForStudents(content: string) {
    const systemPrompt = `
    Sen OdevGPT'nin özetleyici asistanısın. 
    Görevin: Uzun okul duyurularını öğrenciler için "Can Alıcı 3 Madde" şeklinde özetlemek.
    Sadece 3 kısa madde ver, her maddenin başına uygun bir emoji koy.
  `;

    return askAI(`Lütfen şu metni öğrenciler için 3 maddede özetle:\n\n${content}`, systemPrompt);
}

/**
 * compatibility wrapper for old code
 */
export async function getAIResponse(messages: { role: string; content: string }[]) {
    // Mesaj formatını unified yapıya uydur
    // Eğer messages içinde system prompt varsa ayrıştır, yoksa default ekle
    const systemMsg = messages.find(m => m.role === 'system')?.content || TEACHER_PROMPT;
    const userMsgs = messages.filter(m => m.role !== 'system');

    // Geçmişi koru
    const unifiedMessages = [
        { role: "system", content: systemMsg },
        ...userMsgs
    ];

    return makeAIRequest(unifiedMessages, 0.7);
}

/**
 * Sokratik Öğrenme Metodu: Öğrenciye cevabı vermez, ipuçları ve sorularla öğrenciyi cevaba ulaştırır.
 */
export async function askSocraticAI(
    userMessage: string,
    context: { question: string, subject: string, history?: { role: string, content: string }[] }
) {
    const systemPrompt = `
    Sen OdevGPT'nin Sokratik Eğitmenisin. 
    Görevin: Öğrenciye asla doğrudan cevabı söylememek! 
    
    KURALLAR:
    1. Öğrencinin sorduğu "${context.subject}" konulu "${context.question}" sorusu üzerinde çalışıyorsun.
    2. Öğrenciye cevabı vermek yerine, onu düşünmeye sevke edecek kısa, yönlendirici sorular sor.
    3. Eğer öğrenci çok yanlış bir yoldaysa, nazikçe küçük ipuçları ver.
    4. Adım adım ilerle. Bir seferde sadece bir konuya veya adıma odaklan.
    5. Dilin teşvik edici, sabırlı ve pedagojik olsun.
    6. Cevapların kısa olsun (maksimum 2-3 cümle), öğrenciyi sıkma.
    `;

    // Geçmiş sohbeti birleştir
    const messages = context.history
        ? [...context.history, { role: "user", content: userMessage }]
        : [{ role: "user", content: userMessage }];

    const fullMessages = [
        { role: "system", content: systemPrompt },
        ...messages
    ];

    return makeAIRequest(fullMessages, 0.6);
}

/**
 * Veli raporu oluşturur
 */
export async function generateWeeklyParentReport(
    studentName: string,
    stats: {
        total_questions: number;
        solved_questions: number;
        success_rate: number;
        total_xp_gained: number;
        level_ups: number;
        recent_questions?: Array<{ question_text: string; status: string }>;
    }
) {
    const systemPrompt = `
    Sen OdevGPT'nin Veli Rapor Asistanısın.
    Görevin: Öğrenci performansını velilere pozitif, motive edici ve bilgilendirici bir dille sunmak.
    Raporu Markdown formatında yaz.
    `;

    const prompt = `
    Lütfen ${studentName} isimli öğrenci için bir haftalık gelişim raporu oluştur.
    İstatistikler: ${JSON.stringify(stats)}
    `;

    return askAI(prompt, systemPrompt);
}

/**
 * Rapor için öne çıkan noktalar
 */
export async function generateReportHighlights(
    studentName: string,
    stats: any
): Promise<string[]> {
    const systemPrompt = `
    Sen OdevGPT'nin Veli Rapor Asistanısın.
    Görevin: Öğrenci performansından 3 öne çıkan nokta (highlight) çıkarmak. Max 10 kelime, 1 emoji.
    `;

    const prompt = `
    ${studentName} performans özeti:
    ${JSON.stringify(stats)}
    `;

    const response = await askAI(prompt, systemPrompt);

    return response
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .slice(0, 3);
}
/**
 * Gelişmiş Vision OCR: Resimdeki soruyu okur ve tertemiz metne çevirir.
 * Tesseract yerine Vision modellerini (Gemini Flash, GPT-4o) kullanır.
 */
export async function analyzeQuestionImage(imageBase64: string): Promise<string> {
    const systemPrompt = `
    Sen OdevGPT Elite OCR Mühendisisin. 
    Görevin: Resimdeki soruyu dijital dünyaya MÜKEMMEL bir şekilde aktarmak.
    
    ÖZEL TALİMATLAR:
    1. **Sıfır Hata Politikası:** Harf, rakam veya sembol yanlışlığı kabul edilemez.
    2. **Pedagojik Normalizasyon:** Metni olduğu gibi oku ama karmaşık matematiksel ifadeleri, üst/alt simgeleri ve formülleri STANDART LaTeX ($...$) formatına sadık kalarak yaz.
    3. **Yapısal Bütünlük:** Sorunun kökü ile seçenekler arasındaki boşluğu koru. Her seçeneği (A, B, C, D, E) kesinlikle yeni bir satıra yaz.
    4. **Görsel Kaymaları Önle:** Metin bloklarını resimdeki mantıksal sırasıyla işle.
    5. **Temiz Çıktı:** Cevabında "İşte sorunuz" veya "Okunan metin" gibi hiçbir ekstra ifade olmamalı. Sadece ve sadece sorunun kendisini döndür.
    `;

    // Vision destekli modelleri öncelikle seç (Gemini Flash çok hızlı ve başarılıdır)
    const visionMessages = [
        { role: "system", content: systemPrompt },
        {
            role: "user",
            content: [
                { type: "text", text: "Lütfen bu resimdeki soruyu metne çevir:" },
                { type: "image_url", image_url: { url: imageBase64 } }
            ]
        }
    ];

    // makeAIRequest tipini esnetmemiz gerekecek çünkü normalde string bekliyor.
    // Ancak makeAIRequest içindeki JSON.stringify bunu zaten halledecektir.
    return makeAIRequest(visionMessages as any, 0.1);
}

```

### src\lib\blogSeeds.ts
```
export const blogSeeds = [
    {
        title: "ÖdevGPT: Yapay Zeka Destekli Hibrit Eğitim Ekosistemi",
        slug: "odevgpt-hibrit-egitim-ekosistemi",
        content: `**OdevGPT**, geleneksel ödev sistemini modern teknolojiyle birleştiren, **yapay zeka destekli hibrit bir eğitim platformudur**. 

Bu sistem, öğrencilere doğrudan cevap sunmak yerine **Sokratik yöntemle** ipuçları vererek onların öğrenme sürecini derinleştirmeyi amaçlar. Öğretmenlerin değerlendirme yükünü hafifleten yazılım, **oyunlaştırma unsurları ve XP puanlama sistemi** sayesinde öğrencilerin motivasyonunu en üst seviyede tutar. 

Platform; öğrenci, öğretmen ve okul yönetimi için özelleştirilmiş paneller sunarak **veriye dayalı ve interaktif bir akademik takip** sağlar. Kullanıcılar, soru-cevap asistanlığından liderlik tablolarına kadar pek çok fonksiyon aracılığıyla **kişiselleştirilmiş bir öğrenme deneyimi** yaşarlar. 

Özetle bu kaynaklar, eğitimin geleceğini **akıllı rehberlik ve dijital ekosistem entegrasyonu** üzerinden kurgulayan kapsamlı bir uygulama rehberidir.`,
        excerpt: "ÖdevGPT, geleneksel ödev sistemini modern teknolojiyle birleştiren, yapay zeka destekli hibrit bir eğitim platformudur.",
        seo_title: "ÖdevGPT: Hibrit Eğitim ve Yapay Zeka",
        seo_description: "Eğitimin geleceği yapay zeka ile şekilleniyor. ÖdevGPT'nin Sokratik metot ve hibrit eğitim vizyonunu keşfedin.",
        geo_target: "Türkiye"
    },
    {
        title: "Sokratik Metod ile Kalıcı Öğrenme Rehberi",
        slug: "sokratik-metod-ve-kalici-ogrenme",
        content: `Sokratik metod, öğrenciye doğrudan cevabı vermek yerine, doğru soruları sorarak onun cevabı kendisinin bulmasını sağlayan binlerce yıllık bir tekniktir.

### Neden Sokratik Metod?
1. **Eleştirel Düşünme:** Öğrenci ezberlemek yerine neden-sonuç ilişkisi kurar.
2. **Kalıcı Hafıza:** Kendi keşfettiği bilgiyi unutması çok daha zordur.
3. **Özgüven:** Problemi kendi çözen öğrencinin akademik özgüveni artar.

ÖdevGPT, bu kadim yöntemi en modern yapay zeka modelleriyle birleştirerek her öğrenciye özel bir mentor sunar.`,
        excerpt: "Sokratik metod, öğrenciye doğrudan cevabı vermek yerine, onun cevabı kendisinin bulmasını sağlayan bir tekniktir.",
        seo_title: "Sokratik Metod ile Eğitimde Yenilik | ÖdevGPT",
        seo_description: "Öğrencilerinize balık vermeyin, balık tutmayı öğretin. Sokratik asistan ile kalıcı öğrenme rehberi.",
        geo_target: "Türkiye"
    },
    {
        title: "ÖdevGPT Oyunlaştırma ve XP Ödül Sistemi",
        slug: "odevgpt-oyunlastirma-ve-xp-sistemi",
        content: `ÖdevGPT'nin oyunlaştırma (gamification) stratejisi, ders çalışmayı öğrenciler için bir zorunluluktan çıkarıp, XP (deneyim puanı) kazanılan bir oyuna dönüştürür.

### 🎮 XP Kazanma Kuralları
Sistem, öğrencinin platformdaki aktifliğini şu baremlerle ödüllendirir:

* **Sokratik Sohbet (+10 XP):** AI ile girilen her etkileşim için verilir.
* **Ödev Teslimi (+100 XP):** Ödev tamamlandığında anında tanımlanır.
* **Değerlendirilen Ödev (+250 XP):** Öğretmen not verdiğinde eklenen büyük başarı bonusudur.
* **Seri / Streak (+50 XP):** Düzenli kullanım için verilen ek puandır.

### 🏆 Liderlik Tablosu
Kazanılan XP'ler global ve sınıf içi liderlik tablolarında listelenir, bu da sağlıklı bir rekabet ortamı yaratır.`,
        excerpt: "Ders çalışmayı bir oyuna dönüştürün! ÖdevGPT'nin ödül sistemi ve XP kazanma yollarını öğrenin.",
        seo_title: "Eğitimde Oyunlaştırma: XP ve Ödül Sistemi",
        seo_description: "Öğrencileri nasıl motive edersiniz? Gamification (Oyunlaştırma) teknikleri ve EdusonXP sistemi.",
        geo_target: "Global"
    }
];

```

### src\lib\classInsights.ts
```
/**
 * CLASS INSIGHTS AI SERVICE
 * 
 * Sınıf performansını analiz eden ve öğretmenlere pedagojik öneriler sunan AI servisi.
 * Merkezi AI servisini kullanarak zayıf konuları tespit eder ve öğretim stratejileri önerir.
 */

import { askAI } from "./ai";

export interface WeakTopic {
    topic: string;
    difficulty_score: number;
    student_count: number;
    avg_attempts: number;
}

export interface StudentMetric {
    student_id: string;
    student_name: string;
    total_questions: number;
    solved_questions: number;
    success_rate: number;
    total_xp: number;
    current_level: number;
}

export interface ClassInsight {
    weak_topics: WeakTopic[];
    strong_topics: string[];
    average_success_rate: number;
    total_questions_analyzed: number;
    ai_recommendations: string;
    suggested_exercises: {
        topic: string;
        exercise_type: string;
        difficulty: 'easy' | 'medium' | 'hard';
        description: string;
    }[];
}

/**
 * Sınıfın zayıf konularını analiz eder ve AI önerileri oluşturur
 */
export async function analyzeClassPerformance(
    weakTopics: WeakTopic[],
    studentMetrics: StudentMetric[],
    className: string
): Promise<ClassInsight> {
    try {
        // Zayıf ve güçlü konuları ayır
        const weak = weakTopics.filter(t => t.difficulty_score > 0.6);
        const strong = weakTopics.filter(t => t.difficulty_score < 0.4).map(t => t.topic);

        // Ortalama başarı oranını hesapla
        const avgSuccess = studentMetrics.length > 0
            ? studentMetrics.reduce((sum, s) => sum + s.success_rate, 0) / studentMetrics.length
            : 0;

        // AI'dan pedagojik öneriler al
        const aiRecommendations = await generateTeachingRecommendations(weak, className, avgSuccess);

        // Önerilen alıştırmalar oluştur
        const suggestedExercises = await generateExerciseSuggestions(weak);

        return {
            weak_topics: weak,
            strong_topics: strong,
            average_success_rate: Math.round(avgSuccess * 100) / 100,
            total_questions_analyzed: studentMetrics.reduce((sum, s) => sum + s.total_questions, 0),
            ai_recommendations: aiRecommendations,
            suggested_exercises: suggestedExercises,
        };
    } catch (error) {
        console.error("Class performance analysis error:", error);
        throw new Error("Sınıf analizi sırasında bir hata oluştu.");
    }
}

/**
 * AI ile öğretmene pedagojik öneriler oluşturur
 */
async function generateTeachingRecommendations(
    weakTopics: WeakTopic[],
    className: string,
    avgSuccessRate: number
): Promise<string> {
    if (weakTopics.length === 0) {
        return "🎉 Harika! Sınıfınız tüm konularda başarılı. Öğrencilerinizi tebrik edin ve daha ileri seviye konulara geçebilirsiniz.";
    }

    const topicList = weakTopics.map(t =>
        `- ${t.topic} (Zorluk: ${(t.difficulty_score * 100).toFixed(0)}%, ${t.student_count} öğrenci)`
    ).join('\n');

    const prompt = `Sen deneyimli bir eğitim danışmanısın. Bir öğretmene sınıfının performansı hakkında pedagojik öneriler sunuyorsun.

SINIF BİLGİLERİ:
- Sınıf: ${className}
- Ortalama Başarı Oranı: ${(avgSuccessRate).toFixed(1)}%
- Zayıf Konular:
${topicList}

GÖREV:
1. Zayıf konuları analiz et
2. Öğretmene bu konuları güçlendirmek için 3-4 somut, uygulanabilir öneri sun
3. Sokratik öğrenme ve aktif katılım yöntemlerini öner
4. Pozitif ve motive edici bir dil kullan

ÖNERİLER (Maksimum 300 kelime):`;

    const response = await askAI(prompt, "Sen deneyimli bir eğitim danışmanısın. Bir öğretmene sınıfının performansı hakkında pedagojik öneriler sunuyorsun.");

    return response || "AI önerileri oluşturulamadı.";
}

/**
 * Zayıf konular için önerilen alıştırmalar oluşturur
 */
async function generateExerciseSuggestions(
    weakTopics: WeakTopic[]
): Promise<ClassInsight['suggested_exercises']> {
    if (weakTopics.length === 0) return [];

    const exercises: ClassInsight['suggested_exercises'] = [];

    for (const topic of weakTopics.slice(0, 3)) { // İlk 3 zayıf konu için
        const prompt = `Konu: ${topic.topic}

Bu konu için öğrencilerin pratik yapabileceği 1 alıştırma türü öner.
Sadece alıştırma türünü ve kısa açıklamasını yaz (maksimum 50 kelime).

Format:
Alıştırma Türü: [tür]
Açıklama: [açıklama]`;

        try {
            const response = await askAI(prompt, "Sen bir eğitim materyali tasarımcısısın. Konulara göre etkili alıştırmalar önerirsin.");

            const typeMatch = response.match(/Alıştırma Türü:\s*(.+)/i);
            const descMatch = response.match(/Açıklama:\s*(.+)/i);

            exercises.push({
                topic: topic.topic,
                exercise_type: typeMatch?.[1]?.trim() || "Pratik Soruları",
                difficulty: topic.difficulty_score > 0.8 ? 'easy' :
                    topic.difficulty_score > 0.6 ? 'medium' : 'hard',
                description: descMatch?.[1]?.trim() || response.substring(0, 100),
            });
        } catch (error) {
            console.error(`Exercise generation error for ${topic.topic}:`, error);
            exercises.push({
                topic: topic.topic,
                exercise_type: "Pratik Soruları",
                difficulty: 'medium',
                description: "Bu konuyla ilgili çeşitli sorular çözün.",
            });
        }
    }

    return exercises;
}

/**
 * Öğrenci performans trendini analiz eder (son 30 gün)
 */
export function analyzeStudentTrend(
    progressData: { date: string; questions_asked: number; questions_solved: number; xp_gained: number }[]
): {
    trend: 'improving' | 'declining' | 'stable';
    trend_percentage: number;
    summary: string;
} {
    if (progressData.length < 7) {
        return {
            trend: 'stable',
            trend_percentage: 0,
            summary: 'Yeterli veri yok. En az 7 günlük aktivite gerekli.',
        };
    }

    // İlk ve son hafta ortalamalarını karşılaştır
    const firstWeek = progressData.slice(-7);
    const lastWeek = progressData.slice(0, 7);

    const firstWeekAvg = firstWeek.reduce((sum, d) => sum + d.questions_solved, 0) / 7;
    const lastWeekAvg = lastWeek.reduce((sum, d) => sum + d.questions_solved, 0) / 7;

    const change = ((lastWeekAvg - firstWeekAvg) / (firstWeekAvg || 1)) * 100;

    let trend: 'improving' | 'declining' | 'stable';
    let summary: string;

    if (change > 15) {
        trend = 'improving';
        summary = `🚀 Harika! Son hafta performansı %${change.toFixed(0)} arttı.`;
    } else if (change < -15) {
        trend = 'declining';
        summary = `⚠️ Dikkat! Son hafta performansı %${Math.abs(change).toFixed(0)} düştü.`;
    } else {
        trend = 'stable';
        summary = `📊 Performans stabil. Düzenli çalışmaya devam ediyor.`;
    }

    return {
        trend,
        trend_percentage: Math.round(change * 100) / 100,
        summary,
    };
}

```

### src\lib\create_classes.sql
```
-- 🏫 OKUL YÖNETİM SİSTEMİ VERİTABANI KURULUMU 🏫
-- Bu kodu Supabase Dashboard -> SQL Editor kısmına yapıştırıp RUN butonuna basın.

-- 1. Sınıflar Tablosu (Classes)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- örn: "12-A Matematik"
    description TEXT,
    schedule TEXT, -- örn: "Pazartesi 09:00"
    color TEXT DEFAULT 'blue' -- UI için renk kodu (blue, green, purple, orange)
);

-- 2. Sınıf-Öğrenci Bağlantı Tablosu (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.class_students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(class_id, student_id) -- Bir öğrenci aynı sınıfa iki kez eklenemez
);

-- 3. RLS (Güvenlik) Politikalarını Aktif Et
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;

-- --- CLASSES POLİTİKALARI ---

DROP POLICY IF EXISTS "Teachers can view own classes" ON public.classes;
CREATE POLICY "Teachers can view own classes" 
ON public.classes FOR SELECT 
USING (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Teachers can insert classes" ON public.classes;
CREATE POLICY "Teachers can insert classes" 
ON public.classes FOR INSERT 
WITH CHECK (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Teachers can update own classes" ON public.classes;
CREATE POLICY "Teachers can update own classes" 
ON public.classes FOR UPDATE 
USING (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Teachers can delete own classes" ON public.classes;
CREATE POLICY "Teachers can delete own classes" 
ON public.classes FOR DELETE 
USING (auth.uid() = teacher_id);

-- --- CLASS_STUDENTS POLİTİKALARI ---

DROP POLICY IF EXISTS "Teachers can view students in their classes" ON public.class_students;
CREATE POLICY "Teachers can view students in their classes" 
ON public.class_students FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.classes 
        WHERE classes.id = class_students.class_id 
        AND classes.teacher_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Teachers can manage students in their classes" ON public.class_students;
CREATE POLICY "Teachers can manage students in their classes" 
ON public.class_students FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.classes 
        WHERE classes.id = class_students.class_id 
        AND classes.teacher_id = auth.uid()
    )
);

-- 5. Realtime'ı aç (Hata verirse göz ardı edilebilir)
-- Eğer tablo zaten yayındaysa hata verir, bu normaldir.
ALTER PUBLICATION supabase_realtime ADD TABLE public.classes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.class_students;

```

### src\lib\fix_signup.sql
```
-- Bu SQL kodunu Supabase Dashboard -> SQL Editor kısmına yapıştırıp RUN butonuna basın.

-- 1. Profiles tablosunun RLS politikalarını kontrol et (gerekirse aç)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Herkesin profil okumasına izin ver
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);

-- 3. Kullanıcıların kendi profillerini güncellemesine izin ver
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Trigger Fonksiyonunu Onar (En önemli kısım)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Yeni Kullanıcı'),
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  );
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Hata olursa yutma, logla ama işlemi durdurma (opsiyonel, burada durdurmuyoruz ki user oluşsun)
    -- Ama genelde user oluşmazsa login de olamaz.
    -- Basit bir insert deniyoruz.
    RETURN new;
END;
$$;

-- 5. Trigger'ı yeniden oluştur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Role sütunu için kısıtlamayı güncelle (Eğer enum değilse)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'teacher', 'admin'));

-- 7. Storage bucket oluştur (Eğer yoksa)
INSERT INTO storage.buckets (id, name, public) VALUES ('question_images', 'question_images', true) ON CONFLICT DO NOTHING;

-- 8. Storage Policy (Herkes yükleyebilir - Geçici çözüm)
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'question_images');
CREATE POLICY "Anyone can view images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'question_images');

```

### src\lib\gamification.ts
```
import { supabase } from "./supabase";

/**
 * Grants XP to a user by calling the RPC function in Supabase.
 * @param userId The ID of the user.
 * @param amount The amount of XP to grant.
 */
export async function grantXP(userId: string, amount: number, reason: string = 'activity') {
    try {
        const { error } = await supabase.rpc('add_xp', {
            user_id: userId,
            amount: amount,
            reason: reason
        });

        if (error) {
            console.error("XP Grant Error:", error);
        }
        return !error;
    } catch (err) {
        console.error("XP Grant Exception:", err);
        return false;
    }
}

export const XP_VALUES = {
    SOCRATIC_MESSAGE: 10,
    ASSIGNMENT_SUBMISSION: 100,
    PERFECT_GRADE: 250,
    STREAK_BONUS: 50
};

```

### src\lib\supabase.ts
```
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

```

### src\lib\utils.ts
```
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

### src\pages\AdminPanel.tsx
```
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Loader2, Users, FileQuestion, CheckCircle, ShieldAlert, GraduationCap, School,
    TrendingUp, BarChart3, PieChart, Baby, Search, Settings, Save, Server, Lock, Activity, Power
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, subDays, format } from "date-fns";
import { tr } from "date-fns/locale";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminBlogManager from "@/components/AdminBlogManager";
import AnnouncementManager from "@/components/AnnouncementManager";
import HoldingAnalytics from "@/components/HoldingAnalytics";
import TenantManager from "@/components/TenantManager";
import { BookOpenText, Megaphone, LayoutDashboard, Building2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserProfile {
    id: string;
    full_name: string;
    role: 'student' | 'teacher' | 'admin' | 'parent';
    created_at: string;
    avatar_url: string | null;
    tenant_id: string | null;
    tenants?: { name: string };
}

interface Tenant {
    id: string;
    name: string;
}

interface Stats {
    totalUsers: number;
    totalQuestions: number;
    totalSolutions: number;
    pendingQuestions: number;
    students: number;
    teachers: number;
    admins: number;
    parents: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export default function AdminPanel() {
    const { user, profile } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalQuestions: 0,
        totalSolutions: 0,
        pendingQuestions: 0,
        students: 0,
        teachers: 0,
        admins: 0,
        parents: 0,
    });
    const [weeklyData, setWeeklyData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [selectedTenantId, setSelectedTenantId] = useState<string>("all");
    const { toast } = useToast();

    // System Settings State
    const [systemSettings, setSystemSettings] = useState({
        maintenanceMode: false,
        allowSignups: true,
        aiModel: "gpt-4o",
        dailyQuestionLimit: 10,
        teacherApprovalRequired: false
    });

    useEffect(() => {
        if (profile?.is_super_admin) {
            fetchTenants();
        } else if (profile?.tenant_id) {
            setSelectedTenantId(profile.tenant_id);
        }
    }, [profile]);

    useEffect(() => {
        fetchData();
        // Load settings from local storage if available for persistence demo
        const savedSettings = localStorage.getItem('admin_system_settings');
        if (savedSettings) {
            setSystemSettings(JSON.parse(savedSettings));
        }
    }, [selectedTenantId]);

    const fetchTenants = async () => {
        try {
            const { data, error } = await supabase.from('tenants').select('id, name');
            if (error) throw error;
            setTenants(data || []);
        } catch (err) {
            console.error("Tenants fetch error:", err);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const isAll = selectedTenantId === "all";

            // 1. Genel İstatistikler
            let userQuery = supabase.from('profiles').select('*', { count: 'exact', head: true });
            let questionQuery = supabase.from('questions').select('*', { count: 'exact', head: true });
            let solutionQuery = supabase.from('solutions').select('*', { count: 'exact', head: true });
            let pendingQuery = supabase.from('questions').select('*', { count: 'exact', head: true }).eq('status', 'pending');

            if (!isAll) {
                userQuery = userQuery.eq('tenant_id', selectedTenantId);
                questionQuery = questionQuery.eq('tenant_id', selectedTenantId);
                solutionQuery = solutionQuery.eq('tenant_id', selectedTenantId);
                pendingQuery = pendingQuery.eq('tenant_id', selectedTenantId);
            }

            const { count: userCount } = await userQuery;
            const { count: questionCount } = await questionQuery;
            const { count: solutionCount } = await solutionQuery;
            const { count: pendingCount } = await pendingQuery;

            // Rol dağılımı
            const getRoleCount = async (role: string) => {
                let q = supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', role);
                if (!isAll) q = q.eq('tenant_id', selectedTenantId);
                const { count } = await q;
                return count || 0;
            };

            const studentCount = await getRoleCount('student');
            const teacherCount = await getRoleCount('teacher');
            const adminCount = await getRoleCount('admin');
            const parentCount = await getRoleCount('parent');

            setStats({
                totalUsers: userCount || 0,
                totalQuestions: questionCount || 0,
                totalSolutions: solutionCount || 0,
                pendingQuestions: pendingCount || 0,
                students: studentCount || 0,
                teachers: teacherCount || 0,
                admins: adminCount || 0,
                parents: parentCount || 0,
            });

            // 2. Kullanıcıları Çek
            let profilesQuery = supabase
                .from('profiles')
                .select('*, tenants(name)')
                .order('created_at', { ascending: false })
                .limit(50);

            if (!isAll) {
                profilesQuery = profilesQuery.eq('tenant_id', selectedTenantId);
            }

            const { data: userData, error: userError } = await profilesQuery;

            if (userError) throw userError;
            setUsers(userData as UserProfile[]);

            // 3. Haftalık Veri (Mock Data)
            const mockWeeklyData = Array.from({ length: 7 }).map((_, i) => {
                const date = subDays(new Date(), 6 - i);
                return {
                    name: format(date, 'dd MMM', { locale: tr }),
                    soru: Math.floor(Math.random() * 20) + 5,
                    cozum: Math.floor(Math.random() * 15) + 2,
                };
            });
            setWeeklyData(mockWeeklyData);

        } catch (error: any) {
            console.error("Admin data fetch error:", error);
            toast({
                title: "Hata",
                description: "Veriler yüklenirken bir sorun oluştu.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId: string, newRole: 'student' | 'teacher' | 'admin' | 'parent') => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            toast({
                title: "Rol Güncellendi",
                description: `Kullanıcı rolü ${newRole} olarak değiştirildi.`,
            });

            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            fetchData();

        } catch (error: any) {
            toast({
                title: "Hata",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleSaveSettings = () => {
        // Simulate saving settings (In a real app, this would go to a 'system_settings' table)
        localStorage.setItem('admin_system_settings', JSON.stringify(systemSettings));

        toast({
            title: "Ayarlar Kaydedildi",
            description: "Sistem yapılandırması başarıyla güncellendi.",
        });
    };

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (profile?.role !== 'admin') {
        return (
            <div className="flex flex-col h-[50vh] items-center justify-center text-center p-4">
                <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold mb-2">Erişim Engellendi</h1>
                <p className="text-muted-foreground">Bu sayfayı görüntülemek için yönetici yetkisine sahip olmalısınız.</p>
                <Button variant="link" onClick={() => window.history.back()}>Geri Dön</Button>
            </div>
        );
    }

    const pieData = [
        { name: 'Öğrenci', value: stats.students },
        { name: 'Öğretmen', value: stats.teachers },
        { name: 'Veli', value: stats.parents },
        { name: 'Yönetici', value: stats.admins },
    ];

    return (
        <div className="space-y-8 pb-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {profile?.is_super_admin ? "Holding Yönetici Paneli" : "Okul Yönetici Paneli"}
                    </h1>
                    <p className="text-muted-foreground">
                        {profile?.is_super_admin ? "Tüm okulların genel durumu ve yönetimi." : "Kurumunuzun genel durumu ve kullanıcıları."}
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    {profile?.is_super_admin && (
                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border shadow-sm w-full md:w-auto">
                            <School className="w-4 h-4 ml-2 text-primary" />
                            <Select value={selectedTenantId} onValueChange={setSelectedTenantId}>
                                <SelectTrigger className="w-[200px] border-none focus:ring-0">
                                    <SelectValue placeholder="Okul Seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tüm Okullar</SelectItem>
                                    {tenants.map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <Button onClick={fetchData} variant="outline" size="sm" className="gap-2 w-full md:w-auto">
                        <TrendingUp className="w-4 h-4" /> Verileri Yenile
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="dashboard" className="space-y-6">
                <TabsList className="bg-white border p-1 rounded-xl h-12 w-full md:w-auto overflow-x-auto">
                    <TabsTrigger value="dashboard" className="rounded-lg gap-2">
                        <BarChart3 className="w-4 h-4" /> İstatistikler
                    </TabsTrigger>
                    <TabsTrigger value="users" className="rounded-lg gap-2">
                        <Users className="w-4 h-4" /> Kullanıcılar
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-lg gap-2">
                        <Settings className="w-4 h-4" /> Sistem Ayarları
                    </TabsTrigger>
                    <TabsTrigger value="blogs" className="rounded-lg gap-2">
                        <BookOpenText className="w-4 h-4" /> Blog Yönetimi
                    </TabsTrigger>
                    <TabsTrigger value="announcements" className="rounded-lg gap-2">
                        <Megaphone className="w-4 h-4" /> Duyurular
                    </TabsTrigger>
                    {profile?.is_super_admin && (
                        <TabsTrigger value="holding" className="rounded-lg gap-2">
                            <LayoutDashboard className="w-4 h-4 text-purple-600" /> Holding Analizi
                        </TabsTrigger>
                    )}
                    {profile?.is_super_admin && (
                        <TabsTrigger value="tenants" className="rounded-lg gap-2">
                            <Building2 className="w-4 h-4 text-blue-600" /> Kurum Yönetimi
                        </TabsTrigger>
                    )}
                </TabsList>

                {/* DASHBOARD CONTENT */}
                <TabsContent value="dashboard" className="space-y-8">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-blue-900">Toplam Kullanıcı</CardTitle>
                                <Users className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-700">{stats.totalUsers}</div>
                                <p className="text-xs text-blue-600/80">Sisteme kayıtlı herkes</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-purple-900">Toplam Soru</CardTitle>
                                <FileQuestion className="h-4 w-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-700">{stats.totalQuestions}</div>
                                <p className="text-xs text-purple-600/80">Sorulan tüm sorular</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-green-900">Çözülen Soru</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-700">{stats.totalSolutions}</div>
                                <p className="text-xs text-green-600/80">Başarıyla yanıtlananlar</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-orange-900">Bekleyen Sorular</CardTitle>
                                <Loader2 className="h-4 w-4 text-orange-600 animate-spin-slow" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-700">{stats.pendingQuestions}</div>
                                <p className="text-xs text-orange-600/80">Acil çözüm bekleyenler</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-7">
                        <Card className="col-span-4 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-primary" /> Haftalık Aktivite
                                </CardTitle>
                                <CardDescription>Son 7 gün içindeki soru ve çözüm trafiği</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={weeklyData}>
                                        <defs>
                                            <linearGradient id="colorSoru" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorCozum" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Area type="monotone" dataKey="soru" stroke="#8884d8" fillOpacity={1} fill="url(#colorSoru)" name="Soru Sayısı" />
                                        <Area type="monotone" dataKey="cozum" stroke="#82ca9d" fillOpacity={1} fill="url(#colorCozum)" name="Çözüm Sayısı" />
                                        <Legend iconType="circle" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="w-5 h-5 text-primary" /> Kullanıcı Dağılımı
                                </CardTitle>
                                <CardDescription>Sistemdeki rollerin oranı</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RePieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            label
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* USERS CONTENT */}
                <TabsContent value="users" className="space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Kullanıcı Yönetimi</CardTitle>
                                    <CardDescription>Sisteme kayıtlı kullanıcıları düzenleyin, rol atayın.</CardDescription>
                                </div>
                                <div className="relative w-72">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="İsim veya rol ara..."
                                        className="pl-9"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="w-[80px]">Avatar</TableHead>
                                            <TableHead>Ad Soyad</TableHead>
                                            {profile?.is_super_admin && selectedTenantId === "all" && <TableHead>Okul</TableHead>}
                                            <TableHead>Kayıt Tarihi</TableHead>
                                            <TableHead>Rol</TableHead>
                                            <TableHead className="text-right">İşlemler</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                                    Kullanıcı bulunamadı.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <TableRow key={user.id} className="hover:bg-muted/5 transition-colors">
                                                    <TableCell>
                                                        <Avatar className="h-9 w-9 border">
                                                            <AvatarImage src={user.avatar_url || ""} />
                                                            <AvatarFallback className="bg-primary/5 text-primary font-bold text-xs">
                                                                {user.full_name?.substring(0, 2).toUpperCase() || "??"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold">{user.full_name || "İsimsiz"}</span>
                                                            <span className="text-xs text-muted-foreground">{user.id}</span>
                                                        </div>
                                                    </TableCell>
                                                    {profile?.is_super_admin && selectedTenantId === "all" && (
                                                        <TableCell>
                                                            <Badge variant="secondary" className="font-medium">
                                                                {user.tenants?.name || "Bağımsız"}
                                                            </Badge>
                                                        </TableCell>
                                                    )}
                                                    <TableCell>
                                                        <Badge variant="outline" className="font-normal text-muted-foreground">
                                                            {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: tr })}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.role === 'admin' ? (
                                                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Yönetici</Badge>
                                                        ) : user.role === 'teacher' ? (
                                                            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">Öğretmen</Badge>
                                                        ) : user.role === 'parent' ? (
                                                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Veli</Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">Öğrenci</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Select
                                                                defaultValue={user.role}
                                                                onValueChange={(val) => updateUserRole(user.id, val as any)}
                                                            >
                                                                <SelectTrigger className="w-[110px] h-8 text-xs">
                                                                    <SelectValue placeholder="Rol Seç" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="student">Öğrenci</SelectItem>
                                                                    <SelectItem value="teacher">Öğretmen</SelectItem>
                                                                    <SelectItem value="parent">Veli</SelectItem>
                                                                    <SelectItem value="admin">Admin</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SETTINGS CONTENT */}
                <TabsContent value="settings" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Server className="w-5 h-5 text-primary" /> Sistem Yapılandırması
                            </CardTitle>
                            <CardDescription>
                                OdevGPT genel sistem ayarlarını buradan yönetebilirsiniz.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">

                            {/* Bakım Modu */}
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-base font-medium">Bakım Modu</Label>
                                        {systemSettings.maintenanceMode && <Badge variant="destructive">AKTİF</Badge>}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Siteyi sadece yöneticilerin erişebileceği şekilde kısıtlar.
                                    </p>
                                </div>
                                <Switch
                                    checked={systemSettings.maintenanceMode}
                                    onCheckedChange={(c) => setSystemSettings(p => ({ ...p, maintenanceMode: c }))}
                                />
                            </div>

                            {/* Yeni Üye Alımı */}
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-medium">Yeni Üye Kaydı</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Dışarıdan yeni kullanıcı kayıtlarını aç/kapat.
                                    </p>
                                </div>
                                <Switch
                                    checked={systemSettings.allowSignups}
                                    onCheckedChange={(c) => setSystemSettings(p => ({ ...p, allowSignups: c }))}
                                />
                            </div>

                            {/* Öğretmen Onayı */}
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-medium">AI Cevaplarında Öğretmen Onayı</Label>
                                    <p className="text-sm text-muted-foreground">
                                        AI tarafından üretilen çözümler yayınlanmadan önce öğretmen onayına düşsün.
                                    </p>
                                </div>
                                <Switch
                                    checked={systemSettings.teacherApprovalRequired}
                                    onCheckedChange={(c) => setSystemSettings(p => ({ ...p, teacherApprovalRequired: c }))}
                                />
                            </div>

                            {/* AI Model Ayarları */}
                            <div className="grid gap-4 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Varsayılan Yapay Zeka Modeli</Label>
                                        <Select
                                            value={systemSettings.aiModel}
                                            onValueChange={(val) => setSystemSettings(p => ({ ...p, aiModel: val }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="groq-llama3">Groq - Llama 3 70B (Hızlı & Ücretsiz)</SelectItem>
                                                <SelectItem value="gemini-flash">Google Gemini 1.5 Flash (Önerilen)</SelectItem>
                                                <SelectItem value="gpt-4o">OpenAI GPT-4o (Ücretli)</SelectItem>
                                                <SelectItem value="claude-3-sonnet">Claude 3.5 Sonnet (Ücretli)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[10px] text-muted-foreground mt-1 text-amber-600">
                                            Not: Seçilen modelin API anahtarının .env dosyasında (VITE_X_API_KEY) tanımlı olduğundan emin olun.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Ücretsiz Kullanıcı Günlük Soru Limiti</Label>
                                        <Input
                                            type="number"
                                            value={systemSettings.dailyQuestionLimit}
                                            onChange={(e) => setSystemSettings(p => ({ ...p, dailyQuestionLimit: parseInt(e.target.value) }))}
                                        />
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 bg-gray-50 border-t p-4 rounded-b-xl">
                            <Button variant="outline">İptal</Button>
                            <Button onClick={handleSaveSettings} className="gap-2">
                                <Save className="w-4 h-4" /> Değişiklikleri Kaydet
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* BLOG CONTENT */}
                <TabsContent value="blogs">
                    <AdminBlogManager />
                </TabsContent>

                <TabsContent value="announcements">
                    <AnnouncementManager selectedTenantId={selectedTenantId} />
                </TabsContent>

                {profile?.is_super_admin && (
                    <TabsContent value="holding">
                        <HoldingAnalytics />
                    </TabsContent>
                )}

                {profile?.is_super_admin && (
                    <TabsContent value="tenants">
                        <TenantManager />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}

```

### src\pages\AskQuestion.tsx
```
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, Send, X, Image as ImageIcon, Loader2, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAIResponse, analyzeQuestionImage } from "@/lib/ai";
import Tesseract from 'tesseract.js';

export default function AskQuestion() {
  const [questionText, setQuestionText] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Taslağı Yerel Depolamadan Yükle
  useEffect(() => {
    const savedText = localStorage.getItem("ask_question_draft_text");
    const savedSubject = localStorage.getItem("ask_question_draft_subject");
    if (savedText) setQuestionText(savedText);
    if (savedSubject) setSelectedSubject(savedSubject);
  }, []);

  // Taslağı Otomatik Kaydet
  useEffect(() => {
    localStorage.setItem("ask_question_draft_text", questionText);
    localStorage.setItem("ask_question_draft_subject", selectedSubject);
  }, [questionText, selectedSubject]);

  // Kamera akışını yöneten Effect
  useEffect(() => {
    if (showCamera && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => console.error("Video oynatma hatası:", err));
    }
  }, [showCamera, stream]);

  // Component unmount olduğunda kamerayı kapat
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const processImageOCR = async (file: File) => {
    setIsProcessing(true);
    toast({
      title: "Yazı Okunuyor 📖",
      description: "Yapay Zeka sorunuzu analiz ediyor...",
    });

    try {
      // 1. Dosyayı Base64'e çevir (AI Vision için)
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const base64Image = await base64Promise;

      // 2. AI Vision ile OCR yap
      const text = await analyzeQuestionImage(base64Image);

      if (text && !text.startsWith("HATA:")) {
        setQuestionText(prev => (prev ? prev + "\n" + text : text));
        toast({
          title: "Başarılı ✨",
          description: "Yapay zeka soruyu başarıyla okudu.",
          duration: 3000,
        });
      } else {
        // AI Vision başarısız olursa Tesseract'a düş (Fallback)
        console.warn("AI Vision failed, falling back to Tesseract...");
        const result = await Tesseract.recognize(file, 'tur');
        const fallbackText = result.data.text.trim();

        if (fallbackText) {
          setQuestionText(prev => (prev ? prev + "\n" + fallbackText : fallbackText));
        } else {
          throw new Error("Metin bulunamadı.");
        }
      }
    } catch (error) {
      console.error("OCR Hatası:", error);
      toast({
        title: "Okuma Hatası",
        description: "Metin okunamadı, lütfen elle yazın.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Dosya çok büyük",
          description: "Lütfen 5MB'dan küçük bir resim seçin.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setImageFile(file);
        // Otomatik OCR başlat
        processImageOCR(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Arka kamera öncelikli
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setStream(newStream);
      setShowCamera(true);
    } catch (err) {
      console.error("Kamera erişim hatası:", err);
      toast({
        title: "Kamera hatası",
        description: "Kameraya erişilemedi. Lütfen izinleri kontrol edin.",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImage(dataUrl);

        // DataURL'i dosyaya çevir
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
            setImageFile(file);
            // Otomatik OCR başlat
            processImageOCR(file);
          });

        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const removeImage = () => {
    setImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!questionText && !imageFile) {
      toast({
        title: "Eksik bilgi",
        description: "Lütfen bir soru yazın veya fotoğraf yükleyin.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedSubject) {
      toast({
        title: "Ders seçimi",
        description: "Lütfen bir ders seçin.",
        variant: "destructive",
      });
      return;
    }

    try {
      let imageUrl = null;

      // 1. Resmi Supabase Storage'a yükle (Varsa)
      if (imageFile) {
        toast({ title: "Yükleniyor...", description: "Resim sunucuya gönderiliyor." });
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('question_images')
          .upload(filePath, imageFile);

        if (uploadError) throw new Error(`Resim yükleme hatası: ${uploadError.message}`);
        imageUrl = filePath;
      }

      // 2. Soruyu veritabanına kaydet
      const { data: qData, error: dbError } = await supabase
        .from('questions')
        .insert({
          student_id: user?.id,
          question_text: questionText,
          image_url: imageUrl,
          subject: selectedSubject,
          status: 'pending' // Varsayılan
        })
        .select()
        .single();

      if (dbError) throw new Error(`Veritabanı kayıt hatası: ${dbError.message}`);

      // 3. EĞER METİN VARSA: AI Otomatik Çözüm Üretsin
      if (questionText && qData) {
        try {
          toast({
            title: "Yapay Zeka Çalışıyor �",
            description: "Sorunuz analiz ediliyor, lütfen bekleyin...",
            duration: 3000,
          });

          const aiPrompt = `Öğrenci sorusu (${selectedSubject}): ${questionText}. 
          Lütfen bu soruyu adım adım, açıklayıcı ve eğitici bir dille çöz. 
          Cevabı doğrudan verme, önce ipucu ver sonra çözümü anlat. Türkçe kullan.`;

          const aiResponseText = await getAIResponse([{ role: "user", content: aiPrompt }]);

          // Çözümü kaydet
          const { error: insertError } = await supabase.from("solutions").insert({
            question_id: qData.id,
            solver_type: "ai",
            solver_id: user?.id,
            solution_text: aiResponseText
          });

          if (insertError) throw insertError;

          toast({
            title: "Çözüm Hazır! 🎉",
            description: "Yapay zeka sorunu çözdü.",
            duration: 3000,
          });

          // Soru durumunu güncelle
          await supabase.from("questions").update({ status: "ai_answered" }).eq("id", qData.id);

        } catch (aiError: any) {
          console.error("AI Auto-Solve Hatası:", aiError);
          toast({
            title: "Otomatik Çözüm Hatası",
            description: "Hata detayı: " + (aiError?.message || aiError?.toString() || "Bilinmiyor"),
            variant: "destructive",
            duration: 10000, // 10 saniye ekranda kalsın
          });
          // Hata olsa bile soru kaydedildi, devam et.
        }
      }

      toast({
        title: "Soru Gönderildi! 🚀",
        description: "Sorunuz ve (varsa) AI çözümü hazır.",
      });

      // Temizle ve yönlendir => History sayfasına gidip sonucu görsün
      setQuestionText("");
      setSelectedSubject("");
      localStorage.removeItem("ask_question_draft_text");
      localStorage.removeItem("ask_question_draft_subject");
      setImage(null);
      setImageFile(null);
      navigate("/dashboard/history");

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Hata",
        description: error.message || "Soru gönderilemedi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Soru Sor</h1>
        <p className="text-muted-foreground text-sm">Fotoğrafını çek, yapay zeka çözsün.</p>
      </motion.div>

      <div className="space-y-4">
        {/* Fotoğraf Alanı */}
        <div className="relative">
          {showCamera ? (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                <Button onClick={stopCamera} variant="secondary" size="icon" className="rounded-full w-12 h-12">
                  <X className="w-6 h-6" />
                </Button>
                <Button onClick={capturePhoto} size="icon" className="rounded-full w-16 h-16 border-4 border-white bg-transparent hover:bg-white/20">
                  <div className="w-12 h-12 rounded-full bg-white" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-card border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors relative">
              {image ? (
                <div className="relative inline-block">
                  <img src={image} alt="Preview" className="max-h-64 rounded-lg shadow-lg" />
                  <Button
                    onClick={removeImage}
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 rounded-full w-8 h-8 shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col items-center justify-center text-white backdrop-blur-sm">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      <span className="text-sm font-medium animate-pulse">Yazı Okunuyor...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-pulse-glow">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Fotoğraf Yükle veya Çek</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      Sorunun net bir fotoğrafını çek. Yapay zeka senin için okuyacak.
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="gap-2">
                      <Upload className="w-4 h-4" /> Galeri
                    </Button>
                    <Button onClick={startCamera} className="gap-2 gradient-primary text-primary-foreground shadow-glow">
                      <Camera className="w-4 h-4" /> Kamera
                    </Button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Metin Alanı */}
        <div className="space-y-2 relative">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Soru Metni</label>
            {isProcessing && (
              <span className="text-xs text-primary flex items-center gap-1 animate-pulse">
                <Wand2 className="w-3 h-3" /> Fotoğraftan metin çıkarılıyor...
              </span>
            )}
          </div>
          <Textarea
            placeholder="Sorunu buraya yazabilir veya fotoğraf çekebilirsin..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className={`min-h-[120px] rounded-xl resize-none p-4 text-base transition-all duration-300 ${isProcessing ? "border-primary ring-1 ring-primary/20 bg-primary/5" : ""
              }`}
          />
        </div>

        {/* Ders Seçimi */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Ders</label>
          <Select onValueChange={setSelectedSubject} value={selectedSubject}>
            <SelectTrigger className="w-full rounded-xl h-12">
              <SelectValue placeholder="Ders Seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="matematik">Matematik</SelectItem>
              <SelectItem value="fen">Fen Bilimleri</SelectItem>
              <SelectItem value="turkce">Türkçe</SelectItem>
              <SelectItem value="sosyal">Sosyal Bilgiler</SelectItem>
              <SelectItem value="ingilizce">İngilizce</SelectItem>
              <SelectItem value="fizik">Fizik</SelectItem>
              <SelectItem value="kimya">Kimya</SelectItem>
              <SelectItem value="biyoloji">Biyoloji</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
          onClick={handleSubmit}
          disabled={(!questionText && !image) || !selectedSubject || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              İşleniyor...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Soruyu Gönder
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

```

### src\pages\AssignmentDetail.tsx
```
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    FileText,
    Upload,
    CheckCircle2,
    Loader2,
    Send,
    MessageSquare,
    Sparkles,
    File,
    X,
    ExternalLink,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { grantXP, XP_VALUES } from "@/lib/gamification";
import { askAI } from "@/lib/ai";

interface Assignment {
    id: string;
    class_id: string;
    title: string;
    description: string | null;
    due_date: string | null;
    status: string;
    created_at: string;
}

interface Submission {
    id: string;
    content: string | null;
    file_url: string | null;
    score: number | null; // DB column is 'score'
    grade?: number | null; // For frontend compatibility if needed
    status: string;
    student_id: string;
    created_at: string;
    profiles?: {
        full_name: string | null;
    };
}

export default function AssignmentDetail() {
    const { id } = useParams<{ id: string }>();
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [submission, setSubmission] = useState<Submission | null>(null); // For student
    const [submissions, setSubmissions] = useState<Submission[]>([]); // For teacher

    // Form states
    const [content, setContent] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Teacher states
    const [gradingSub, setGradingSub] = useState<Submission | null>(null);
    const [gradeInput, setGradeInput] = useState("");
    const [feedbackInput, setFeedbackInput] = useState(""); // New field
    const [isGrading, setIsGrading] = useState(false);
    const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

    const isTeacher = profile?.role === 'teacher';

    // Taslakları Yükle
    useEffect(() => {
        const savedContent = localStorage.getItem(`assignment_draft_content_${id}`);
        const savedFeedback = localStorage.getItem(`assignment_draft_feedback_${id}`);
        const savedGrade = localStorage.getItem(`assignment_draft_grade_${id}`);

        if (savedContent && !isTeacher) setContent(savedContent);
        if (savedFeedback && isTeacher) setFeedbackInput(savedFeedback);
        if (savedGrade && isTeacher) setGradeInput(savedGrade);
    }, [id, isTeacher]);

    // Taslakları Kaydet
    useEffect(() => {
        if (!isTeacher && content) {
            localStorage.setItem(`assignment_draft_content_${id}`, content);
        }
    }, [content, id, isTeacher]);

    useEffect(() => {
        if (isTeacher) {
            if (feedbackInput) localStorage.setItem(`assignment_draft_feedback_${id}`, feedbackInput);
            if (gradeInput) localStorage.setItem(`assignment_draft_grade_${id}`, gradeInput);
        }
    }, [feedbackInput, gradeInput, id, isTeacher]);

    useEffect(() => {
        if (id && user) {
            fetchAssignmentDetails();
        }
    }, [id, user]);

    const fetchAssignmentDetails = async () => {
        setLoading(true);
        try {
            // Assignment info
            const { data: assign, error: assignError } = await supabase
                .from('assignments')
                .select('*')
                .eq('id', id)
                .single();

            if (assignError) throw assignError;
            setAssignment(assign);

            if (isTeacher) {
                // Fetch all submissions for teacher
                const { data: subs, error: subsError } = await supabase
                    .from('assignment_submissions')
                    .select(`
                        *,
                        profiles:student_id (full_name)
                    `)
                    .eq('assignment_id', id);

                if (subsError) throw subsError;
                setSubmissions(subs || []);
            } else {
                // Fetch student's own submission
                const { data: sub, error: subError } = await supabase
                    .from('assignment_submissions')
                    .select('*')
                    .eq('assignment_id', id)
                    .eq('student_id', user?.id)
                    .maybeSingle();

                if (subError) throw subError;
                setSubmission(sub);
                if (sub) {
                    setContent(sub.content || "");
                    // Map score to 'grade' logic if needed visually, but we use 'score' in interface
                }
            }
        } catch (error: any) {
            console.error("Hata:", error);
            toast({ title: "Hata", description: "Ödev detayları yüklenemedi.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleGradeSubmission = async () => {
        if (!gradingSub || !gradeInput || !user) return;
        setIsGrading(true);
        try {
            const { error } = await supabase
                .from('assignment_submissions')
                .update({
                    score: parseInt(gradeInput),
                    feedback: feedbackInput, // Save feedback
                    status: 'graded'
                })
                .eq('id', gradingSub.id);

            if (error) throw error;

            toast({ title: "Başarılı", description: "Not başarıyla verildi! 🎯" });

            // Give XP to STUDENT
            grantXP(gradingSub.student_id, XP_VALUES.PERFECT_GRADE);

            setGradingSub(null);
            setGradeInput("");
            setFeedbackInput("");
            localStorage.removeItem(`assignment_draft_feedback_${id}`);
            localStorage.removeItem(`assignment_draft_grade_${id}`);
            fetchAssignmentDetails();
        } catch (error: any) {
            toast({ title: "Hata", description: "Not verilirken bir hata oluştu.", variant: "destructive" });
        } finally {
            setIsGrading(false);
        }
    };

    const generateAIFeedback = async () => {
        if (!gradingSub || !assignment) return;
        setIsGeneratingFeedback(true);
        try {
            const prompt = `
                Ödev Başlığı: ${assignment.title}
                Ödev Açıklaması: ${assignment.description}
                Öğrenci Yanıtı: ${gradingSub.content}
                
                Bu öğrenci yanıtını analiz et ve öğretmen için kısa, yapıcı ve profesyonel bir "geri bildirim" metni yaz. 
                Öğrencinin neyi iyi yaptığını ve neyi geliştirebileceğini belirt. Maksimum 2 cümlede bitir.
            `;
            const response = await askAI(prompt, "Sen bir öğretmen asistanısın. Öğrencilere yapıcı ve eğitici geri bildirimler hazırlarsın.");
            setFeedbackInput(response);
            toast({ title: "AI Geri Bildirimi Hazır ✨", description: "Metin kutusuna eklendi." });
        } catch (err) {
            toast({ title: "Hata", description: "AI geri bildirimi oluşturulamadı.", variant: "destructive" });
        } finally {
            setIsGeneratingFeedback(false);
        }
    };

    const handleSubmitAssignment = async () => {
        if ((!content.trim() && !selectedFile) || !user || !id) return;
        setIsSubmitting(true);
        setUploadProgress(10);

        try {
            let fileUrl = submission?.file_url || null;

            // 1. Upload File if selected
            if (selectedFile) {
                setUploadProgress(30);
                const fileExt = selectedFile.name.split('.').pop();
                const fileName = `${user.id}/${id}_${Math.random()}.${fileExt}`;
                const filePath = `submissions/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('assignments')
                    .upload(filePath, selectedFile, { upsert: true });

                if (uploadError) throw uploadError;

                setUploadProgress(70);
                const { data: { publicUrl } } = supabase.storage
                    .from('assignments')
                    .getPublicUrl(filePath);

                fileUrl = publicUrl;
            }

            // 2. Upsert submission
            const { error } = await supabase
                .from('assignment_submissions')
                .upsert({
                    assignment_id: id,
                    student_id: user.id,
                    content: content,
                    file_url: fileUrl,
                    status: 'submitted'
                });

            if (error) throw error;

            setUploadProgress(100);
            toast({ title: "Başarılı", description: "Ödevin başarıyla teslim edildi! 🚀" });

            // XP Increase (Only if not already graded/submitted maybe? But re-submission is allowed usually)
            grantXP(user.id, XP_VALUES.ASSIGNMENT_SUBMISSION);

            setSelectedFile(null);
            localStorage.removeItem(`assignment_draft_content_${id}`);
            fetchAssignmentDetails();
        } catch (error: any) {
            console.error("Submission error:", error);
            toast({ title: "Hata", description: "Ödev teslim edilirken bir hata oluştu.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!assignment) return <div className="text-center py-20">Ödev bulunamadı.</div>;

    const isPastDue = assignment.due_date && new Date(assignment.due_date) < new Date();

    return (
        <div className="container py-6 max-w-4xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
            </Button>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Side: Assignment Content */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-0 shadow-sm overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-primary/10 text-primary border-0">Ödev</Badge>
                                {isPastDue && <Badge variant="destructive" className="border-0">Süresi Doldu</Badge>}
                            </div>
                            <CardTitle className="text-3xl font-bold">{assignment.title}</CardTitle>
                            <CardDescription className="flex items-center gap-4 pt-2">
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(assignment.created_at).toLocaleDateString('tr-TR')}</span>
                                {assignment.due_date && (
                                    <span className={`flex items-center gap-1 ${isPastDue ? 'text-destructive font-bold' : ''}`}>
                                        <Clock className="w-4 h-4" /> Son Teslim: {new Date(assignment.due_date).toLocaleString('tr-TR')}
                                    </span>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" /> Ödev Açıklaması
                            </h4>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {assignment.description || "Bu ödev için bir açıklama girilmemiş."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Teacher Grading View */}
                    {isTeacher && gradingSub && (
                        <Card className="shadow-lg border-indigo-200 animate-in slide-in-from-right duration-300">
                            <CardHeader className="bg-indigo-50/50">
                                <CardTitle className="text-lg">Değerlendirme: {gradingSub.profiles?.full_name}</CardTitle>
                                <CardDescription>Öğrencinin ödevini incele ve not ver.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" /> Öğrenci Yanıtı
                                    </h4>
                                    <div className="p-4 bg-gray-50 rounded-xl text-sm leading-relaxed whitespace-pre-wrap min-h-[100px] border">
                                        {gradingSub.content || "Öğrenci bir açıklama yazmamış."}
                                    </div>
                                </div>

                                {gradingSub.file_url && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-bold">Ekli Dosya</h4>
                                        <a
                                            href={gradingSub.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 transition-colors group"
                                        >
                                            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                                <FileText className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold">Ödev Dosyasını Aç</p>
                                                <p className="text-[10px] text-muted-foreground">PDF veya Resim dosyası</p>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                        </a>
                                    </div>
                                )}

                                <div className="space-y-4 pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold">Öğretmen Geri Bildirimi</label>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-[10px] gap-1.5 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                                            onClick={generateAIFeedback}
                                            disabled={isGeneratingFeedback || !gradingSub.content}
                                        >
                                            {isGeneratingFeedback ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                            AI Önerisi Al
                                        </Button>
                                    </div>
                                    <Textarea
                                        placeholder="Öğrenciye notunu veya önerilerini yaz..."
                                        value={feedbackInput}
                                        onChange={(e) => setFeedbackInput(e.target.value)}
                                        className="text-sm"
                                    />

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Not / Puan (0-100)</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="Örn: 85"
                                            value={gradeInput}
                                            onChange={(e) => setGradeInput(e.target.value)}
                                            className="font-bold text-lg"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between gap-3 border-t pt-4 bg-gray-50/30">
                                <Button variant="ghost" onClick={() => setGradingSub(null)}>Kapat</Button>
                                <Button
                                    onClick={handleGradeSubmission}
                                    className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                                    disabled={isGrading || !gradeInput}
                                >
                                    {isGrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                    Notu Gönder & XP Ver
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Student Submission Form */}
                    {!isTeacher && (
                        <Card className="shadow-md border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Upload className="w-5 h-5 text-primary" /> Ödevini Gönder
                                </CardTitle>
                                <CardDescription>Cevabını aşağıya yazabilirsin.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="Cevabını veya notlarını buraya yaz..."
                                    className="min-h-[150px]"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    disabled={submission?.status === 'graded'}
                                />

                                {/* File Upload Area */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <File className="w-4 h-4 text-primary" /> Dosya Ekle (PDF, Resim vb.)
                                    </label>

                                    {!selectedFile && !submission?.file_url ? (
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="file-upload"
                                                className="hidden"
                                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                                disabled={submission?.status === 'graded'}
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                            >
                                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                <span className="text-xs text-gray-500 font-medium">Dosya seçmek için tıkla</span>
                                                <span className="text-[10px] text-gray-400 mt-1">Maksimum 10MB</span>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <FileText className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="max-w-[150px] md:max-w-[300px]">
                                                    <p className="text-sm font-bold truncate">
                                                        {selectedFile ? selectedFile.name : "Yüklenen Dosya"}
                                                    </p>
                                                    {submission?.file_url && (
                                                        <a href={submission.file_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1">
                                                            Görüntüle <ExternalLink className="w-2 h-2" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive"
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                }}
                                                disabled={submission?.status === 'graded'}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {isSubmitting && uploadProgress > 0 && (
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="bg-primary h-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between items-center border-t pt-4">
                                {submission ? (
                                    <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                                        <CheckCircle2 className="w-4 h-4" /> Ödev Teslim Edildi
                                    </div>
                                ) : (
                                    <div className="text-xs text-muted-foreground italic">
                                        {isPastDue ? "⚠️ Süresi dolmuş ödevler teslim edilebilir." : "Henüz teslim edilmedi."}
                                    </div>
                                )}
                                <Button
                                    onClick={handleSubmitAssignment}
                                    disabled={isSubmitting || submission?.status === 'graded' || (!content.trim() && !selectedFile)}
                                    className="gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    {submission ? "Güncelle ve Gönder" : "Ödevi Teslim Et"}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </div>

                {/* Right Side: Status / Feedback */}
                <div className="space-y-6">
                    {!isTeacher && submission?.score && (
                        <Card className="bg-green-50 border-green-200">
                            <CardHeader>
                                <CardTitle className="text-sm text-green-800 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-green-600" /> Öğretmen Geri Bildirimi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-900 mb-2">{submission.score}</div>
                                <p className="text-sm text-green-800">Harika iş çıkardın!</p>
                            </CardContent>
                        </Card>
                    )}

                    {isTeacher && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Öğrenci Teslimleri</CardTitle>
                                <CardDescription>{submissions.length} öğrenci teslim etti.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {submissions.map((sub) => (
                                        <div
                                            key={sub.id}
                                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${gradingSub?.id === sub.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
                                            onClick={() => {
                                                setGradingSub(sub);
                                                setGradeInput(sub.score?.toString() || "");
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-bold">{sub.profiles?.full_name}</span>
                                                <Badge variant={sub.status === 'graded' ? 'default' : 'outline'} className="text-[10px]">
                                                    {sub.status === 'graded' ? 'PUANLANDI' : 'BEKLEYEN'}
                                                </Badge>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground truncate">{sub.content}</p>
                                            {sub.file_url && (
                                                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-primary font-medium">
                                                    <FileText className="w-3 h-3" /> Ekli Dosya Mevcut
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {submissions.length === 0 && (
                                        <div className="p-8 text-center text-muted-foreground text-sm italic">
                                            Henüz hiç teslim yok.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="bg-indigo-50/50 border-indigo-100">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2 text-indigo-700">
                                <MessageSquare className="w-4 h-4" /> AI İpucu İster misin?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-indigo-600 mb-4 leading-relaxed">
                                Bu ödevde tıkandıysan Sokratik AI sana yardımcı olabilir!
                            </p>
                            <Button variant="outline" size="sm" className="w-full text-indigo-700 border-indigo-200 bg-white hover:bg-indigo-50" onClick={() => navigate('/dashboard/chat')}>
                                AI Öğretmen ile Konuş
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

```

### src\pages\BlogList.tsx
```
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight, Search, Sparkles, Youtube, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    image_url: string;
    published_at: string;
    author: { full_name: string } | null;
}

export default function BlogList() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const { data, error } = await supabase
                .from('blogs')
                .select(`
                    id, title, slug, excerpt, image_url, published_at,
                    author:author_id ( full_name )
                `)
                .eq('is_published', true)
                .order('published_at', { ascending: false });

            if (error) throw error;

            const rawData = data || [];
            const formattedBlogs = rawData.map((blog: any) => ({
                ...blog,
                author: Array.isArray(blog.author) ? blog.author[0] : blog.author
            }));

            setBlogs(formattedBlogs);
        } catch (error) {
            console.error("Bloglar yüklenirken hata:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-700 pt-32 pb-20 text-white text-center px-4 relative">
                <div className="absolute top-8 left-8">
                    <Link to="/">
                        <Button variant="ghost" className="text-white hover:bg-white/20 rounded-full gap-2">
                            <Home className="w-4 h-4" /> Anasayfa
                        </Button>
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 mb-4 px-4 py-1">
                            ÖdevGPT Akademi
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                            Eğitimin Geleceğini <br /> <span className="text-yellow-300">Bizimle Keşfedin</span>
                        </h1>
                        <p className="text-xl text-violet-100 max-w-2xl mx-auto font-medium">
                            Yapay zeka, sokratik metot ve eğitim teknolojileri üzerine en güncel rehberler ve makaleler.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-10">
                {/* Featured Video */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 bg-white rounded-[3rem] p-4 shadow-2xl overflow-hidden border border-violet-100"
                >
                    <div className="grid md:grid-cols-2 gap-8 items-center p-6 lg:p-10">
                        <div className="aspect-video rounded-[2rem] overflow-hidden shadow-lg">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/3CxZclawVSA"
                                title="ÖdevGPT Tanıtım"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="space-y-6">
                            <Badge className="bg-red-100 text-red-600 border-0 h-8 px-4 flex w-fit items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span> YENİ VİDEO
                            </Badge>
                            <h2 className="text-3xl font-black text-gray-900 leading-tight">
                                ÖdevGPT: Eğitimin Yeni Yüzü ve Vizyonumuz
                            </h2>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                Neden ÖdevGPT? Geleneksel eğitimdeki aksaklıkları nasıl gideriyoruz? Sokratik asistanımızın çalışma prensiplerini ve vizyonumuzu bu videoda keşfedin.
                            </p>
                            <a href="https://www.youtube.com/watch?v=3CxZclawVSA" target="_blank" rel="noopener noreferrer">
                                <Button className="rounded-full bg-violet-600 hover:bg-violet-700 h-12 px-8 font-bold gap-2">
                                    <Youtube className="w-5 h-5" /> Şimdi İzle
                                </Button>
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto mb-16">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                        className="pl-12 h-16 rounded-2xl shadow-xl border-0 focus-visible:ring-2 focus-visible:ring-violet-500 text-lg"
                        placeholder="Makale ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-96 rounded-3xl bg-white animate-pulse shadow-sm"></div>
                        ))}
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="text-center py-20">
                        <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-700">Sonuç Bulunamadı</h3>
                        <p className="text-muted-foreground">Aradığınız kriterlere uygun makale bulunmuyor.</p>
                        <Button variant="link" onClick={() => setSearchTerm("")} className="text-violet-600">tüm blogları gör</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map((blog, index) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link to={`/blog/${blog.slug}`}>
                                    <Card className="h-full border-0 shadow-sm hover:shadow-2xl transition-all group overflow-hidden rounded-3xl bg-white flex flex-col">
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <img
                                                src={blog.image_url || "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2070&auto=format&fit=crop"}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                                alt={blog.title}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                                <span className="text-white font-bold flex items-center gap-2">
                                                    Devamını Oku <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>
                                        <CardHeader className="flex-grow p-6">
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(blog.published_at).toLocaleDateString('tr-TR')}</span>
                                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {blog.author?.full_name || 'ÖdevGPT'}</span>
                                            </div>
                                            <CardTitle className="text-xl group-hover:text-violet-600 transition-colors line-clamp-2 leading-tight">
                                                {blog.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-6 pb-6 pt-0">
                                            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                                {blog.excerpt || blog.title}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

```

### src\pages\BlogPost.tsx
```
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Link2, Clock, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Blog {
    id: string;
    title: string;
    content: string;
    image_url: string;
    published_at: string;
    seo_title: string;
    seo_description: string;
    author: { full_name: string; avatar_url: string } | null;
}

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) fetchBlog();
    }, [slug]);

    const fetchBlog = async () => {
        try {
            const { data, error } = await supabase
                .from('blogs')
                .select(`
                    *,
                    author:author_id ( full_name, avatar_url )
                `)
                .eq('slug', slug)
                .single();

            if (error) throw error;
            setBlog(data);

            // Görüntülenme sayısını artır
            await supabase.rpc('increment_blog_views', { blog_id: data.id });

        } catch (error) {
            console.error("Blog yüklenirken hata:", error);
            navigate('/blog');
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Bağlantı kopyalandı!");
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
    );

    if (!blog) return null;

    return (
        <div className="min-h-screen bg-white">
            {/* SEO Meta Tags Update (Requires some library if truly SPA, but we can set document title) */}
            <title>{blog.seo_title || blog.title} | ÖdevGPT Blog</title>
            <meta name="description" content={blog.seo_description} />

            {/* Hero Image Section */}
            <div className="w-full h-[60vh] relative overflow-hidden">
                <img
                    src={blog.image_url || "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2070&auto=format&fit=crop"}
                    className="w-full h-full object-cover"
                    alt={blog.title}
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                <div className="absolute inset-0 flex items-center justify-center p-6 mt-16">
                    <div className="max-w-4xl w-full text-center text-white space-y-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Badge className="bg-violet-600 text-white border-0 px-4 py-1 mb-6">Öne Çıkan Makale</Badge>
                            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight drop-shadow-lg">
                                {blog.title}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm md:text-base font-medium text-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-violet-600 border-2 border-white overflow-hidden shadow-lg">
                                        <img src={blog.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author?.full_name}`} alt="" />
                                    </div>
                                    <span>{blog.author?.full_name || 'ÖdevGPT Ekibi'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-yellow-300" />
                                    <span>{new Date(blog.published_at).toLocaleDateString('tr-TR')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-300" />
                                    <span>6 dk okuma</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-white rounded-t-[3rem] p-8 md:p-16 shadow-2xl border-t border-gray-100">
                    <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
                        <Link to="/blog">
                            <Button variant="ghost" className="text-violet-600 hover:bg-violet-50 rounded-full">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Tüm Yazılar
                            </Button>
                        </Link>
                        <div className="flex gap-2">
                            <Button size="icon" variant="outline" className="rounded-full hover:bg-violet-50 text-violet-600" onClick={copyLink}>
                                <Link2 className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" className="rounded-full hover:bg-blue-50 text-blue-600">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" className="rounded-full hover:bg-blue-100 text-blue-700">
                                <Facebook className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <article className="prose prose-lg md:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-gray-700 prose-p:leading-relaxed prose-img:rounded-3xl prose-img:shadow-xl prose-a:text-violet-600">
                        <ReactMarkdown>{blog.content}</ReactMarkdown>
                    </article>

                    <hr className="my-16" />

                    {/* Newsletter or CTA */}
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-10 md:p-16 text-white text-center shadow-xl mb-12 overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-black mb-4">Öğrenme Yolculuğunuza Devam Edin</h3>
                            <p className="text-violet-100 mb-8 max-w-md mx-auto">
                                ÖdevGPT ile sınıf içi başarıyı %40 artırın. Sokratik asistanınız 7/24 yanınızda.
                            </p>
                            <div className="flex justify-center gap-4 flex-wrap">
                                <Link to="/signup">
                                    <Button size="lg" className="bg-white text-violet-700 hover:bg-violet-50 font-bold px-8">Ücretsiz Başla</Button>
                                </Link>
                                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold">Tanıtımı İzle</Button>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mt-32 -mr-32"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

```

### src\pages\ChatScreen.tsx
```
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Send, Loader2, ChevronLeft, Sparkles, Brain, GraduationCap, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getAIResponse, askSocraticAI } from "@/lib/ai";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Subject = "Genel" | "Matematik" | "Fen Bilimleri" | "Türkçe" | "Sosyal Bilgiler" | "İngilizce";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Merhaba! 👋 Ben senin kişisel AI Çalışma Koçun. Bugün hangi ders üzerinde beraber çalışalım? İstersen doğrudan soru sorabilirsin, istersen 'Sokratik Mod'u açarak konuyu keşfetmemi sağlayabilirsin." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSocratic, setIsSocratic] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject>("Genel");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let responseContent: string;

      const history = messages.slice(-10);

      if (isSocratic) {
        responseContent = await askSocraticAI(input, {
          question: input,
          subject: selectedSubject,
          history: history
        });
      } else {
        const systemPrompt = `Sen OdevGPT'nin uzman ${selectedSubject} öğretmenisin. Öğrenciye yardımcı ol, motive et ve net açıklamalar yap.`;
        const contextMessages = [
          { role: "system", content: systemPrompt },
          ...history,
          userMessage
        ];
        responseContent = await getAIResponse(contextMessages as any);
      }

      const aiMessage: Message = { role: "assistant", content: responseContent };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Hata",
        description: "AI Koçun sistemleri şu an çok yoğun. Lütfen tekrar dene.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden border shadow-xl">
      {/* Header */}
      <div className="p-4 border-b bg-white flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full h-8 w-8">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
              <h2 className="font-black text-lg tracking-tight flex items-center gap-2">
                AI Çalışma Koçu
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none text-[10px]">PRO</Badge>
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Senin için hazır
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-wrap gap-1">
            {["Matematik", "Fen Bilimleri", "Türkçe", "Sosyal Bilgiler", "İngilizce"].map((subj) => (
              <Button
                key={subj}
                variant={selectedSubject === subj ? "default" : "outline"}
                size="sm"
                className="h-8 rounded-full text-[11px] font-bold"
                onClick={() => setSelectedSubject(subj as Subject)}
              >
                {subj}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-primary/5 p-3 rounded-2xl border border-primary/10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isSocratic ? 'bg-orange-500 text-white' : 'bg-white text-primary'} shadow-sm transition-colors`}>
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Sokratik Mod</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Cevabı söyleme, beni sorularla eğit.</p>
            </div>
          </div>
          <Switch
            checked={isSocratic}
            onCheckedChange={setIsSocratic}
            className="data-[state=checked]:bg-orange-500"
          />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === "user" ? "bg-white border" : "bg-primary text-white"
                }`}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`rounded-3xl px-5 py-3 shadow-sm relative ${msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-white border border-gray-100 rounded-tl-none text-gray-800"
                  }`}
              >
                <div className="text-sm prose prose-sm max-w-none prose-p:leading-relaxed prose-p:my-0">
                  {msg.content}
                </div>
                {msg.role === "assistant" && (
                  <div className="mt-2 flex gap-1 opacity-0 hover:opacity-100 transition-opacity absolute -right-16 top-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-white shadow-sm border"><Sparkles className="w-3.5 h-3.5 text-primary" /></Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 animate-bounce">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl rounded-tl-none px-5 py-3 shadow-inner flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
              </div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Düşünüyor...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t">
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-full border border-gray-100 focus-within:border-primary transition-colors shadow-inner">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`${isSocratic ? 'Sokratik Mod' : selectedSubject} hakkında bir şey sor...`}
            className="rounded-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 h-11"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`rounded-full w-12 h-11 flex-shrink-0 shadow-lg transition-all ${isLoading || !input.trim() ? 'bg-gray-300' : 'bg-primary hover:scale-105 shadow-primary/20'
              }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-3 font-medium">
          Ders çalışırken takıldığın yerleri sormaktan çekinme! ✨
        </p>
      </div>
    </div>
  );
}

```

### src\pages\ClassDetail.tsx
```
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Users,
    BookOpen,
    MessageSquare,
    Settings,
    Plus,
    Search,
    MoreVertical,
    Loader2,
    CheckCircle2,
    Clock,
    ClipboardList,
    GraduationCap,
    Sparkles,
    Send,
    Zap,
    Wand2,
    BarChart3,
    BrainCircuit,
    Trash2,
    Pencil,
    UserMinus,
    MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { enhanceAnnouncement, summarizeForStudents, askAI } from "@/lib/ai";
import { motion } from "framer-motion";
import ClassChatRoom from "@/components/ClassChatRoom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface ClassData {
    id: string;
    name: string;
    color: string;
    schedule: string | null;
    teacher_id: string;
    invite_code: string;
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

interface StudentInClass {
    student_id: string;
    joined_at: string;
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

interface Announcement {
    id: string;
    content: string;
    ai_summary: string | null;
    created_at: string;
    is_smart: boolean;
    profiles: {
        full_name: string | null;
    } | null;
}

interface Assignment {
    id: string;
    title: string;
    description: string | null;
    due_date: string | null;
    status: 'active' | 'archived';
    created_at: string;
    teacher_id: string;
}

export default function ClassDetail() {
    const { id } = useParams<{ id: string }>();
    const { profile, user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [classData, setClassData] = useState<ClassData | null>(null);
    const [students, setStudents] = useState<StudentInClass[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [newAnnouncement, setNewAnnouncement] = useState("");
    const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
    const [newAssignmentDesc, setNewAssignmentDesc] = useState("");
    const [newAssignmentDueDate, setNewAssignmentDueDate] = useState("");
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
    const [showAssignmentForm, setShowAssignmentForm] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [classAIInsights, setClassAIInsights] = useState<string | null>(null);

    // Edit Class State
    const [isEditClassOpen, setIsEditClassOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editSchedule, setEditSchedule] = useState("");

    useEffect(() => {
        if (id) {
            fetchClassDetails();
            fetchAnnouncements();
            fetchAssignments();
        }
    }, [id]);

    const fetchClassDetails = async () => {
        setLoading(true);
        try {
            const { data: cls, error: clsError } = await supabase
                .from('classes')
                .select(`
          *,
          profiles:teacher_id (
            full_name,
            avatar_url
          )
        `)
                .eq('id', id)
                .single();

            if (clsError) throw clsError;

            const formattedCls = {
                ...cls,
                profiles: Array.isArray(cls.profiles) ? cls.profiles[0] : cls.profiles
            } as any;

            setClassData(formattedCls);
            setEditName(formattedCls.name);
            setEditSchedule(formattedCls.schedule || "");

            const { data: stus, error: stuError } = await supabase
                .from('class_students')
                .select(`
          student_id,
          joined_at,
          profiles:student_id (
            full_name,
            avatar_url
          )
        `)
                .eq('class_id', id);

            if (stuError) throw stuError;

            const formattedStus = stus?.map(s => ({
                ...s,
                profiles: Array.isArray(s.profiles) ? s.profiles[0] : s.profiles
            })) as any;

            setStudents(formattedStus || []);
        } catch (error: any) {
            console.error("Hata:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select(`
          *,
          profiles:teacher_id (
            full_name
          )
        `)
                .eq('class_id', id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedData = data?.map(a => ({
                ...a,
                profiles: Array.isArray(a.profiles) ? a.profiles[0] : a.profiles
            })) as any;

            setAnnouncements(formattedData || []);
        } catch (error) {
            console.error("Duyurular yüklenirken hata:", error);
        }
    };

    const fetchAssignments = async () => {
        try {
            const { data, error } = await supabase
                .from('assignments')
                .select('*')
                .eq('class_id', id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAssignments(data || []);
        } catch (error) {
            console.error("Ödevler yüklenirken hata:", error);
        }
    };

    const handleEnhanceAnnouncement = async () => {
        if (!newAnnouncement.trim()) return;
        setIsEnhancing(true);
        try {
            const enhanced = await enhanceAnnouncement(newAnnouncement);
            setNewAnnouncement(enhanced);
            toast({
                title: "AI Dokunuşu Tamam! ✨",
                description: "Duyuru pedagojik ve motive edici hale getirildi.",
            });
        } catch (error) {
            toast({
                title: "Hata",
                description: "AI şu an yanıt veremiyor.",
                variant: "destructive"
            });
        } finally {
            setIsEnhancing(false);
        }
    };

    const handlePostAnnouncement = async () => {
        if (!newAnnouncement.trim() || !user || !id) return;
        setIsPosting(true);
        try {
            // Generate summary if it's a long announcement
            let summary = null;
            if (newAnnouncement.length > 50) {
                summary = await summarizeForStudents(newAnnouncement);
            }

            const { error } = await supabase
                .from('announcements')
                .insert({
                    class_id: id,
                    teacher_id: user.id,
                    content: newAnnouncement,
                    ai_summary: summary,
                    is_smart: newAnnouncement.includes('✨') || newAnnouncement.length > 50
                });

            if (error) throw error;

            toast({ title: "Başarılı", description: "Duyuru paylaşıldı!" });
            setNewAnnouncement("");
            fetchAnnouncements();
        } catch (error) {
            toast({ title: "Hata", description: "Duyuru paylaşılamadı.", variant: "destructive" });
        } finally {
            setIsPosting(false);
        }
    };

    const handleCreateAssignment = async () => {
        if (!newAssignmentTitle.trim() || !user || !id) return;
        setIsCreatingAssignment(true);
        try {
            // Check required fields
            if (!newAssignmentTitle) {
                toast({ title: "Hata", description: "Ödev başlığı zorunludur.", variant: "destructive" });
                return;
            }

            const payload = {
                class_id: id,
                teacher_id: user.id,
                title: newAssignmentTitle,
                description: newAssignmentDesc,
                due_date: newAssignmentDueDate || null,
                status: 'active'
            };

            const { error } = await supabase
                .from('assignments')
                .insert(payload);

            if (error) throw error;

            toast({ title: "Başarılı", description: "Ödev başarıyla oluşturuldu!" });
            setNewAssignmentTitle("");
            setNewAssignmentDesc("");
            setNewAssignmentDueDate("");
            setShowAssignmentForm(false);
            fetchAssignments();
        } catch (error: any) {
            console.error("Assignment create error:", error);
            toast({ title: "Hata", description: "Ödev oluşturulamadı: " + error.message, variant: "destructive" });
        } finally {
            setIsCreatingAssignment(false);
        }
    };

    const handleUpdateClass = async () => {
        if (!editName.trim() || !id) return;
        try {
            const { error } = await supabase
                .from('classes')
                .update({ name: editName, schedule: editSchedule })
                .eq('id', id);

            if (error) throw error;

            toast({ title: "Başarılı", description: "Sınıf bilgileri güncellendi." });
            setIsEditClassOpen(false);
            fetchClassDetails();
        } catch (error: any) {
            toast({ title: "Hata", description: error.message, variant: "destructive" });
        }
    };

    const handleKickStudent = async (studentId: string) => {
        if (!confirm("Bu öğrenciyi sınıftan çıkarmak istediğinize emin misiniz?")) return;
        try {
            const { error } = await supabase
                .from('class_students')
                .delete()
                .eq('class_id', id)
                .eq('student_id', studentId);

            if (error) throw error;

            toast({ title: "Öğrenci Çıkarıldı", description: "Öğrenci sınıftan başarıyla çıkarıldı." });
            fetchClassDetails();
        } catch (error: any) {
            toast({ title: "Hata", description: error.message, variant: "destructive" });
        }
    };

    const handleDeleteAssignment = async (assignId: string) => {
        if (!confirm("Bu ödevi silmek istediğinize emin misiniz?")) return;
        try {
            const { error } = await supabase
                .from('assignments')
                .delete()
                .eq('id', assignId);

            if (error) throw error;
            toast({ title: "Ödev Silindi", description: "Ödev kaldırıldı." });
            fetchAssignments();
        } catch (error: any) {
            toast({ title: "Hata", description: error.message, variant: "destructive" });
        }
    };

    const fetchClassInsights = async () => {
        if (!isTeacher) return;
        setIsAnalyzing(true);
        try {
            // Sınıftaki öğrencilerin tüm sorularını ve konularını çek
            const studentIds = students.map(s => s.student_id);
            if (studentIds.length === 0) {
                setClassAIInsights("Henüz sınıfta öğrenci yok.");
                return;
            }

            const { data: questions } = await supabase
                .from('questions')
                .select('subject, question_text, status')
                .in('student_id', studentIds)
                .limit(50);

            if (!questions || questions.length === 0) {
                setClassAIInsights("Henüz analiz edilecek soru verisi bulunamadı.");
                return;
            }

            const questionContext = questions.map(q => `- Konu: ${q.subject}, Metin: ${q.question_text?.substring(0, 50)}...`).join('\n');

            const systemPrompt = `
                Sen OdevGPT'nin Akademik Veri Analistisin. 
                Görevin: Bir sınıftaki öğrencilerin sorduğu sorulardan yola çıkarak öğretmene stratejik içgörüler sunmak.
                Analiz yaparken:
                1. Sınıfın genel olarak hangi konularda zorlandığını tespit et.
                2. Öğretmene derste neye odaklanması gerektiğini öner.
                3. Motive edici ve profesyonel bir dil kullan.
                4. Yanıtı markdown formatında (başlıklar, maddeler) ver.
            `;

            const prompt = `Aşağıdaki soru verilerine dayanarak bu sınıf için 1 haftalık akademik durum raporu hazırla:\n\n${questionContext}`;

            const response = await askAI(prompt, systemPrompt);
            setClassAIInsights(response);
        } catch (error) {
            console.error("Insight error:", error);
            toast({ title: "Hata", description: "Analiz yapılırken bir sorun oluştu." });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const isTeacher = profile?.role === 'teacher' && classData?.teacher_id === user?.id;

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (!classData) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-2xl font-bold">Sınıf bulunamadı.</h2>
                <Button onClick={() => navigate(-1)} className="mt-4"><ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön</Button>
            </div>
        );
    }

    return (
        <div className="container py-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-bold text-gray-900">{classData.name}</h1>
                            <Badge variant="outline" className={`border-0 ${classData.color === 'blue' ? 'bg-blue-50 text-blue-700' :
                                classData.color === 'green' ? 'bg-green-50 text-green-700' :
                                    classData.color === 'purple' ? 'bg-purple-50 text-purple-700' :
                                        'bg-orange-50 text-orange-700'
                                }`}>
                                {classData.schedule || "Genel"}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" /> Öğretmen: {classData.profiles?.full_name}
                        </p>
                    </div>
                </div>

                {isTeacher && (
                    <div className="flex items-center gap-2">
                        <div className="bg-white border rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm font-mono">
                            <span className="text-gray-500">Davet Kodu:</span>
                            <span className="font-bold text-primary">{classData.invite_code}</span>
                        </div>
                        <Dialog open={isEditClassOpen} onOpenChange={setIsEditClassOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon"><Settings className="w-4 h-4" /></Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Sınıf Ayarları</DialogTitle>
                                    <DialogDescription>Sınıf bilgilerini güncelleyin.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Sınıf Adı</Label>
                                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Ders Programı / Saat</Label>
                                        <Input value={editSchedule} onChange={(e) => setEditSchedule(e.target.value)} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleUpdateClass}>Kaydet</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="overview" className="rounded-lg gap-2"><BookOpen className="w-4 h-4" /> Genel Bakış</TabsTrigger>
                    <TabsTrigger value="messages" className="gap-2"><MessageSquare className="w-3 h-3" /> Mesajlar</TabsTrigger>
                    <TabsTrigger value="tasks">Ödevler</TabsTrigger>
                    <TabsTrigger value="students">Öğrenciler</TabsTrigger>
                    {isTeacher && <TabsTrigger value="insights" className="gap-2"><Sparkles className="w-3 h-3" /> AI Analiz</TabsTrigger>}
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2 border-0 shadow-sm bg-gray-50/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-primary" /> Sınıf Akışı
                                </CardTitle>
                                <CardDescription>Öğretmeninizden gelen son duyurular ve mesajlar.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">

                                {/* Announcement Input for Teachers */}
                                {isTeacher && (
                                    <Card className="border-primary/20 bg-white overflow-hidden">
                                        <CardContent className="p-4 space-y-3">
                                            <Textarea
                                                placeholder="Öğrencilerine bir şeyler söyle..."
                                                className="border-0 focus-visible:ring-0 min-h-[100px] resize-none p-0"
                                                value={newAnnouncement}
                                                onChange={(e) => setNewAnnouncement(e.target.value)}
                                            />
                                            <div className="flex items-center justify-between pt-3 border-t">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 gap-2"
                                                        onClick={handleEnhanceAnnouncement}
                                                        disabled={isEnhancing || !newAnnouncement.trim()}
                                                    >
                                                        {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                                        AI ile Güzelleştir
                                                    </Button>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="gap-2"
                                                    onClick={handlePostAnnouncement}
                                                    disabled={isPosting || !newAnnouncement.trim()}
                                                >
                                                    {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                    Paylaş
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Announcements List */}
                                <div className="space-y-4">
                                    {announcements.map((a) => (
                                        <Card key={a.id} className="border-0 shadow-sm overflow-hidden group">
                                            <CardHeader className="p-4 pb-0">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                            {a.profiles?.full_name?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-bold">{a.profiles?.full_name}</p>
                                                        <p className="text-[10px] text-muted-foreground">{new Date(a.created_at).toLocaleString('tr-TR')}</p>
                                                    </div>
                                                    {a.is_smart && (
                                                        <Badge variant="outline" className="ml-auto bg-violet-50 text-violet-600 border-violet-100 text-[9px] gap-1">
                                                            <Sparkles className="w-2.5 h-2.5" /> AKILLI DUYURU
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {a.content}

                                                {/* AI Summary Box */}
                                                {a.ai_summary && (
                                                    <div className="mt-4 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                                                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                            <Zap className="w-3 h-3" /> Sihirli Özet (AI)
                                                        </p>
                                                        <div className="text-xs text-amber-800 space-y-1">
                                                            {a.ai_summary.split('\n').filter(line => line.trim()).map((line, i) => (
                                                                <p key={i}>{line}</p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {announcements.length === 0 && !isTeacher && (
                                        <div className="py-20 text-center text-muted-foreground bg-white rounded-2xl border border-dashed">
                                            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p>Henüz bir duyuru yapılmamış.</p>
                                        </div>
                                    )}
                                </div>

                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold">Yaklaşan Etkinlikler</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex flex-col items-center justify-center font-bold">
                                            <span className="text-[10px] leading-none">ŞUB</span>
                                            <span className="text-base">18</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Matematik Sınavı</p>
                                            <p className="text-xs text-muted-foreground">09:00 - Online</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="students">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Sınıf Mevcudu</CardTitle>
                                <CardDescription>Bu sınıfa kayıtlı öğrenciler.</CardDescription>
                            </div>
                            <div className="relative w-64 hidden md:block">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Öğrenci ara..." className="pl-9" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {students.map((stu) => (
                                    <div key={stu.student_id} className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10 border">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stu.student_id}`} />
                                                <AvatarFallback>{stu.profiles?.full_name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-sm tracking-tight">{stu.profiles?.full_name}</p>
                                                <p className="text-[10px] text-muted-foreground">Katılım: {new Date(stu.joined_at).toLocaleDateString('tr-TR')}</p>
                                            </div>
                                        </div>
                                        {isTeacher && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreVertical className="w-4 h-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleKickStudent(stu.student_id)} className="text-red-600 focus:text-red-600 cursor-pointer">
                                                        <Trash2 className="w-4 h-4 mr-2" /> Sınıftan Çıkar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                ))}

                                {students.length === 0 && (
                                    <div className="col-span-full py-20 text-center text-muted-foreground">
                                        <Users className="w-16 h-16 mx-auto mb-4 opacity-10" />
                                        <p>Bu sınıfta henüz hiç öğrenci yok.</p>
                                        <p className="text-sm mt-1">Öğrencilere davet kodunu ({classData.invite_code}) vererek katılmalarını isteyebilirsiniz.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-6">
                    {/* Assignment Controls for Teachers */}
                    {isTeacher && !showAssignmentForm && (
                        <Button onClick={() => setShowAssignmentForm(true)} className="w-full h-16 border-dashed border-2 bg-transparent hover:bg-gray-50 text-gray-600 gap-2">
                            <Plus className="w-5 h-5" /> Yeni Ödev Tanımla
                        </Button>
                    )}

                    {showAssignmentForm && (
                        <Card className="animate-in slide-in-from-top duration-300">
                            <CardHeader>
                                <CardTitle>Yeni Ödev Oluştur</CardTitle>
                                <CardDescription>Öğrencileriniz için yeni bir görev atayın.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Ödev Başlığı</label>
                                    <Input
                                        placeholder="Örn: Newton Yasaları Problemleri"
                                        value={newAssignmentTitle}
                                        onChange={(e) => setNewAssignmentTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Açıklama / Detaylar</label>
                                    <Textarea
                                        placeholder="Ödev detaylarını ve yönergeleri buraya yazın..."
                                        value={newAssignmentDesc}
                                        onChange={(e) => setNewAssignmentDesc(e.target.value)}
                                        className="min-h-[120px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Teslim Tarihi (Opsiyonel)</label>
                                    <Input
                                        type="datetime-local"
                                        value={newAssignmentDueDate}
                                        onChange={(e) => setNewAssignmentDueDate(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => setShowAssignmentForm(false)}>İptal</Button>
                                <Button onClick={handleCreateAssignment} disabled={isCreatingAssignment}>
                                    {isCreatingAssignment ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                    Ödevi Yayınla
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Assignments List */}
                    <div className="grid gap-4">
                        {assignments.map((assignment) => (
                            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg">{assignment.title}</h3>
                                                {assignment.status === 'active' ? (
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">AKTİF</Badge>
                                                ) : (
                                                    <Badge variant="secondary">ARŞİVLENMİŞ</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{assignment.description}</p>
                                        </div>
                                        {isTeacher && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-full">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleDeleteAssignment(assignment.id)} className="text-destructive focus:text-destructive cursor-pointer">
                                                        <Trash2 className="w-4 h-4 mr-2" /> Ödevi Sil
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-6 mt-6 pt-6 border-t font-medium text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            Son Teslim: {assignment.due_date ? new Date(assignment.due_date).toLocaleString('tr-TR') : 'Süre Sınırı Yok'}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4" />
                                            {students.length} Öğrenci
                                        </div>
                                        <Button size="sm" variant="outline" className="ml-auto" onClick={() => navigate(`/dashboard/assignment/${assignment.id}`)}>
                                            Detayları Gör
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {assignments.length === 0 && !showAssignmentForm && (
                            <div className="text-center py-20 bg-white border border-dashed rounded-2xl">
                                <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-xl font-bold text-gray-700">Henüz Ödev Yok</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    {isTeacher ? "Öğrencilerinize ilk ödevlerini vererek öğrenme sürecini başlatın!" : "Bu sınıf için henüz bir ödev tanımlanmamış."}
                                </p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="messages">
                    <ClassChatRoom classId={id!} isTeacher={isTeacher} />
                </TabsContent>

                <TabsContent value="insights">
                    <Card className="border-2 border-primary/10 shadow-xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <BrainCircuit className="w-6 h-6" /> Sınıf İçi AI Analizi
                                    </CardTitle>
                                    <CardDescription className="text-violet-100">
                                        Öğrencilerinizin sorularından yola çıkarak akademik durumu raporlar.
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={fetchClassInsights}
                                    className="bg-white text-violet-600 hover:bg-violet-50"
                                    disabled={isAnalyzing}
                                >
                                    {isAnalyzing ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <Wand2 className="w-4 h-4 mr-2" />
                                    )}
                                    Analizi Başlat
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-8">
                            {classAIInsights ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="prose prose-sm max-w-none dark:prose-invert"
                                >
                                    <div className="bg-violet-50/50 p-6 rounded-2xl border border-violet-100 leading-relaxed text-gray-700 whitespace-pre-wrap">
                                        {classAIInsights}
                                    </div>
                                    <div className="mt-6 flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
                                        <Zap className="w-5 h-5" />
                                        <span>Bu veriler son 50 öğrenci sorusu baz alınarak yapay zeka tarafından üretilmiştir.</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="text-center py-20 space-y-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                        <BarChart3 className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-xl">Sınıfınızın Nabzını Ölçün</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        Yapay zeka asistanımız sınıftaki tüm soruları tarayarak hangi konularda eksiklik olduğunu size raporlar.
                                    </p>
                                    <Button variant="outline" onClick={fetchClassInsights} disabled={isAnalyzing}>
                                        Şimdi Analiz Et
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

```

### src\pages\DashboardHome.tsx
```
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  Camera,
  BookOpen,
  Trophy,
  TrendingUp,
  Flame,
  Star,
  ChevronRight,
  Loader2,
  Calendar,
  Zap,
  Target,
  Clock,
  CheckCircle2,
  School,
  Sparkles,
  MoreVertical,
  LogOut,
  Wand2,
  Megaphone,
  Bell
} from "lucide-react";
import SmartReminders from "@/components/SmartReminders";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  submitted_at?: string;
  grade?: number;
  feedback?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  is_global: boolean;
  created_at: string;
}

// Mock Data - Haftalık Çalışma (Yedek)
const defaultActivityData = [
  { name: 'Pzt', puan: 0 },
  { name: 'Sal', puan: 0 },
  { name: 'Çar', puan: 0 },
  { name: 'Per', puan: 0 },
  { name: 'Cum', puan: 0 },
  { name: 'Cmt', puan: 0 },
  { name: 'Paz', puan: 0 },
];

interface UserClass {
  id: string;
  class_id: string;
  classes: {
    id: string;
    name: string;
    color: string;
    schedule: string | null;
    profiles: {
      full_name: string | null;
    } | null;
  } | null;
}

export default function DashboardHome() {
  const { profile, loading, user } = useAuth();
  const { tenant } = useTenant();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [userClasses, setUserClasses] = useState<UserClass[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [stats, setStats] = useState({ solved: 0, streak: 0, success: 0 });
  const [weeklyXp, setWeeklyXp] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Gamification stats from real profile data
  const currentXp = profile?.xp || 0;
  const currentLevel = profile?.level || 1;
  const nextLevelXp = currentLevel * 1000;
  const progressToNextLevel = ((currentXp % 1000) / 1000) * 100;

  useEffect(() => {
    if (!loading && profile) {
      if (profile.role === 'teacher') {
        navigate('/teacher');
      } else if (profile.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (profile.role === 'parent') {
        navigate('/dashboard/parent', { replace: true });
      } else {
        fetchUserClasses();
        fetchUserStats();
        fetchAssignments();
        fetchAnnouncements();
      }
    }
  }, [profile, loading, navigate]);

  const fetchAnnouncements = async () => {
    if (!profile?.tenant_id) return;
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .or(`tenant_id.eq.${profile.tenant_id},is_global.eq.true`)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err) {
      console.error("Announcements error:", err);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;
    try {
      // Soru sayısı
      const { count } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', user.id);

      setStats(prev => ({
        ...prev,
        solved: count || 0,
        streak: profile?.streak || 0
      }));

      // Haftalık XP grafiği için RPC fonksiyonunu kullan (get_student_daily_xp)
      const { data: xpData, error: xpError } = await supabase
        .rpc('get_student_daily_xp', {
          p_student_id: user.id,
          p_days: 7
        });

      if (xpError) throw xpError;

      if (xpData) {
        // RPC'den gelen veriyi grafiğe uygun formata çevir
        const formattedChartData = xpData.map((d: any) => ({
          name: d.day_name,
          puan: d.total_xp
        }));
        setWeeklyXp(formattedChartData);
      }
    } catch (err) {
      console.error("Stats fetching error:", err);
      setWeeklyXp(defaultActivityData); // Hata durumunda boş grafik
    }
  };

  const fetchAssignments = async () => {
    if (!user) return;
    try {
      setAssignmentsLoading(true);

      // 1. Önce öğrencinin sınıflarını al
      const { data: userClassList } = await supabase
        .from('class_students')
        .select('class_id')
        .eq('student_id', user.id);

      const classIds = userClassList?.map(c => c.class_id) || [];

      if (classIds.length === 0) {
        setAssignments([]);
        return;
      }

      // 2. Bu sınıflara ait TÜM ödevleri çek
      const { data: assignmentsData, error: assignError } = await supabase
        .from('assignments')
        .select(`
            id,
            title,
            description,
            due_date
        `)
        .in('class_id', classIds)
        .order('due_date', { ascending: true })
        .limit(10);

      if (assignError) throw assignError;

      if (!assignmentsData || assignmentsData.length === 0) {
        setAssignments([]);
        return;
      }

      // 3. Öğrencinin teslim durumlarını çek
      const assignmentIds = assignmentsData.map(a => a.id);
      const { data: submissionsData, error: subError } = await supabase
        .from('assignment_submissions')
        .select('assignment_id, status, score, submitted_at, feedback')
        .eq('student_id', user.id)
        .in('assignment_id', assignmentIds);

      if (subError) throw subError;

      // 4. Verileri birleştir
      const combinedAssignments = assignmentsData.map((assign: any) => {
        const sub = submissionsData?.find((s: any) => s.assignment_id === assign.id);

        let status = 'pending';
        // Hiç submission yoksa -> pending (Ödev Bekliyor)
        // Submission var, status 'pending' -> submitted (Teslim Edildi, Not Bekliyor)
        // Submission var, status 'graded' -> graded (Notlandı)

        if (sub) {
          if (sub.status === 'graded') status = 'graded';
          else status = 'submitted';
        }

        return {
          id: assign.id,
          title: assign.title,
          description: assign.description,
          due_date: assign.due_date,
          status: status,
          submitted_at: sub?.submitted_at,
          grade: sub?.score,
          feedback: sub?.feedback
        };
      });

      // 5. Sıralama: Yapılmamışlar en üstte
      combinedAssignments.sort((a, b) => {
        const statusOrder: Record<string, number> = { pending: 0, submitted: 1, graded: 2 };
        return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
      });

      setAssignments(combinedAssignments);

    } catch (err) {
      console.error("Assignments fetch error:", err);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const fetchUserClasses = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('class_students')
        .select(`
          id,
          class_id,
          classes (
            id,
            name,
            color,
            schedule,
            profiles:teacher_id (
              full_name
            )
          )
        `)
        .eq('student_id', user.id);

      if (error) throw error;

      // Fix typing issue with Supabase join
      const formattedData = data?.map(item => ({
        ...item,
        classes: Array.isArray(item.classes) ? item.classes[0] : item.classes
      })) as any;

      setUserClasses(formattedData || []);
    } catch (error) {
      console.error("Sınıflar yüklenirken hata:", error);
    } finally {
      setClassesLoading(false);
    }
  };

  const handleJoinClass = async () => {
    if (!joinCode.trim() || !user) return;
    setJoining(true);

    try {
      // 1. Kodu kontrol et
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('id, name')
        .eq('invite_code', joinCode.toUpperCase())
        .single();

      if (classError || !classData) {
        throw new Error("Geçersiz davet kodu. Lütfen kontrol edip tekrar deneyin.");
      }

      // 2. Halihazırda üye mi kontrol et
      const { data: existingMember } = await supabase
        .from('class_students')
        .select('id')
        .eq('class_id', classData.id)
        .eq('student_id', user.id)
        .single();

      if (existingMember) {
        throw new Error("Zaten bu sınıfın bir üyesisin! 😊");
      }

      // 3. Sınıfa ekle
      const { error: joinError } = await supabase
        .from('class_students')
        .insert({
          class_id: classData.id,
          student_id: user.id
        });

      if (joinError) throw joinError;

      toast({
        title: "Harika! 🎉",
        description: `${classData.name} sınıfına başarıyla katıldın. Hoş geldin!`,
      });
      setJoinCode("");
      fetchUserClasses(); // Refresh classes

    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setJoining(false);
    }
  };

  const getClassColorBorder = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-500';
      case 'green': return 'border-green-500';
      case 'purple': return 'border-purple-500';
      case 'orange': return 'border-orange-500';
      default: return 'border-gray-500';
    }
  };

  const getClassColorBg = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 text-blue-700';
      case 'green': return 'bg-green-50 text-green-700';
      case 'purple': return 'bg-purple-50 text-purple-700';
      case 'orange': return 'bg-orange-50 text-orange-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-10">
        <SEO title="Yükleniyor..." />
        {/* Hero Skeleton */}
        <div className="h-64 rounded-3xl bg-muted animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
            </div>
            {/* Chart Skeleton */}
            <Skeleton className="h-[300px] rounded-3xl" />
            {/* Classes Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
            </div>
          </div>
          <div className="space-y-8">
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] gap-4">
        <h2 className="text-xl font-bold">Profil bilgileri yüklenemedi.</h2>
        <p className="text-muted-foreground">Lütfen internet bağlantınızı kontrol edip tekrar deneyin.</p>
        <Button onClick={() => window.location.reload()}>Sayfayı Yenile</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <SEO title="Öğrenci Paneli" />

      {/* Hero Section */}
      <div
        className="relative overflow-hidden rounded-3xl bg-indigo-600 text-white shadow-xl"
        style={{
          background: tenant?.primary_color
            ? `linear-gradient(135deg, ${tenant.primary_color}, ${tenant.primary_color}dd)`
            : undefined
        }}
      >
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 max-w-lg">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-violet-100 bg-white/10 w-fit px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{tenant ? `${tenant.name} Kaşifi` : "Hoş geldin, Süper Kahraman!"}</span>
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Merhaba, {profile?.full_name?.split(' ')[0] || 'Öğrenci'}! 👋 <br />
              {tenant ? `${tenant.name}'de` : "Bugün"} öğrenmeye hazır mısın?
            </h1>
            <p className="text-violet-100 text-lg opacity-90">
              Seni bekleyen <span className="font-bold text-white">3 yeni görev</span> ve kazanılacak <span className="font-bold text-yellow-300">500 XP</span> var.
            </p>
            <div className="flex gap-3 pt-2">
              <Link to="/dashboard/ask">
                <Button size="lg" className="bg-white text-violet-700 hover:bg-violet-50 font-bold shadow-lg shadow-violet-900/20 border-0">
                  <Camera className="w-5 h-5 mr-2" /> Soru Sor
                </Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <School className="w-5 h-5 mr-2" /> Sınıfa Katıl
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Sınıfa Katıl</DialogTitle>
                    <DialogDescription>
                      Öğretmeninden aldığın 6 haneli davet kodunu buraya gir.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="joinCode">Davet Kodu</Label>
                      <Input
                        id="joinCode"
                        placeholder="Örn: X1Y2Z3"
                        className="text-center font-mono text-xl tracking-widest uppercase"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        maxLength={6}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleJoinClass}
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                      disabled={joining || joinCode.length < 6}
                    >
                      {joining ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Katıl"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center relative w-48 h-48">
            <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 bg-white/10 rounded-full backdrop-blur-sm flex flex-col items-center justify-center border border-white/20 shadow-2xl">
              <span className="text-sm font-medium text-violet-200">SEVİYE</span>
              <span className="text-5xl font-black text-white">{currentLevel}</span>
              <span className="text-xs text-violet-200 mt-1">{currentXp} / {nextLevelXp} XP</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon: İstatistikler, Grafik ve Sınıflar */}
        <div className="lg:col-span-2 space-y-8">

          {/* İstatistik Kartları */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-orange-50/50 border-orange-100 hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Flame className="w-8 h-8 text-orange-500 mb-2" />
                <div className="text-2xl font-bold text-gray-800">{profile?.streak || 0} Gün</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Seri</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50/50 border-blue-100 hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Zap className="w-8 h-8 text-blue-500 mb-2" />
                <div className="text-2xl font-bold text-gray-800">{stats.solved}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Soru</div>
              </CardContent>
            </Card>
            <Card className="bg-green-50/50 border-green-100 hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Target className="w-8 h-8 text-green-500 mb-2" />
                <div className="text-2xl font-bold text-gray-800">%{Math.round(progressToNextLevel)}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Seviye İlerlemesi</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50/50 border-purple-100 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/dashboard/leaderboard')}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Trophy className="w-8 h-8 text-purple-500 mb-2" />
                <div className="text-2xl font-bold text-gray-800">#{stats.solved > 0 ? '12' : '--'}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Sıralama</div>
              </CardContent>
            </Card>
          </div>

          <SmartReminders assignments={assignments} />

          {/* Grafik */}
          <Card className="shadow-lg border-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" /> Haftalık XP Grafiği
                </CardTitle>
                <CardDescription>Son 7 gündeki öğrenme aktiviten</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pl-0">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyXp.length > 0 ? weeklyXp : defaultActivityData}>
                    <defs>
                      <linearGradient id="colorPuan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="puan" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPuan)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bekleyen Ödevler */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Ödevlerim
              </h3>
              <Badge variant="secondary" className="rounded-full px-3">{assignments.length}</Badge>
            </div>

            {assignmentsLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
              </div>
            ) : assignments.length === 0 ? (
              <Card className="border-dashed border-2 py-8 bg-muted/30">
                <CardContent className="flex flex-col items-center justify-center text-center space-y-2">
                  <div className="p-3 bg-muted rounded-full">
                    <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="font-bold">Harika! Bekleyen ödevin yok.</p>
                  <p className="text-xs text-muted-foreground">Şimdilik dinlenebilir veya soru çözebilirsin.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {assignments.map((assignment) => (
                  <Card key={assignment.id} className="hover:shadow-md transition-all border-l-4 border-l-primary group">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                            {assignment.title}
                          </h4>
                          <Badge
                            variant={
                              assignment.status === 'graded' ? 'default' :
                                assignment.status === 'submitted' ? 'secondary' :
                                  'outline'
                            }
                            className="text-[10px] h-5"
                          >
                            {assignment.status === 'graded' ? 'Notlandı' :
                              assignment.status === 'submitted' ? 'Gönderildi' :
                                'Bekliyor'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{assignment.description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium pt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(assignment.due_date).toLocaleDateString()}
                          </span>
                          {assignment.grade && (
                            <span className="flex items-center gap-1 text-green-600 font-bold">
                              <Trophy className="w-3 h-3" />
                              {assignment.grade} Puan
                            </span>
                          )}
                        </div>
                      </div>
                      <Link to={`/dashboard/assignment/${assignment.id}`}>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full bg-muted/50 group-hover:bg-primary group-hover:text-white transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sınıflarım */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Kayıtlı Sınıfların</h3>
            {classesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse"></div>)}
              </div>
            ) : userClasses.length === 0 ? (
              <div className="p-10 border-2 border-dashed rounded-2xl text-center bg-gray-50/50">
                <p className="text-muted-foreground">Henüz bir sınıfa katılmadın.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userClasses.map((item) => (
                  <Link key={item.id} to={`/dashboard/class/${item.classes?.id}`}>
                    <Card className={`hover:shadow-md transition-all border-l-4 ${getClassColorBorder(item.classes?.color || 'blue')}`}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold">{item.classes?.name}</p>
                          <p className="text-xs text-muted-foreground">{item.classes?.profiles?.full_name}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sağ Kolon: Duyurular, Günlük Görevler ve Rozetler */}
        <div className="space-y-8">

          {/* Duyuru Bölümü */}
          {announcements.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Megaphone className="w-4 h-4" /> Duyurular
                </h3>
              </div>
              <div className="space-y-3">
                {announcements.map(announcement => (
                  <Card key={announcement.id} className="border-l-4 border-l-primary overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`text-[10px] ${announcement.type === 'urgent' ? 'text-red-600 bg-red-50 border-red-100' :
                          announcement.is_global ? 'text-purple-600 bg-purple-50 border-purple-100' :
                            'text-blue-600 bg-blue-50 border-blue-100'
                          }`}>
                          {announcement.is_global ? 'Global' : 'Kurumsal'}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(announcement.created_at).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm leading-tight">{announcement.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Card className="shadow-lg border-indigo-100 bg-indigo-50/30 overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" /> Günlük Görevler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-bold">3 Soru Çöz</span>
                  <Badge variant="secondary" className="bg-violet-100 text-violet-700 font-bold">+50 XP</Badge>
                </div>
                <Progress value={(Math.min(stats.solved, 3) / 3) * 100} className="h-1.5" />
                <p className="text-[10px] text-right font-medium text-gray-500">{Math.min(stats.solved, 3)}/3</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-bold">1 Sokratik Sohbet</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-bold">+20 XP</Badge>
                </div>
                <Progress value={0} className="h-1.5" />
                <p className="text-[10px] text-right font-medium text-gray-500">0/1</p>
              </div>
            </CardContent>
            <CardFooter className="bg-indigo-600 text-white p-3 text-center text-[10px] font-bold">
              HEPSİNİ TAMAMLA, SÜRPRİZ KUTU KAZAN! 🎁
            </CardFooter>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> Rozet Kütüphanesi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { e: '🚀', n: 'Yolcu', l: false },
                  { e: '⚡', n: 'Hızlı', l: true },
                  { e: '🔥', n: 'Seri', l: false },
                  { e: '🧠', n: 'Daha', l: true },
                  { e: '🏆', n: 'Usta', l: true },
                  { e: '💎', n: 'Ender', l: true },
                ].map((b, i) => (
                  <div key={i} className={`flex flex-col items-center p-2 rounded-xl border ${b.l ? 'opacity-30 grayscale bg-gray-50' : 'bg-yellow-50 border-yellow-200'}`}>
                    <span className="text-xl">{b.e}</span>
                    <span className="text-[8px] font-bold mt-1 text-gray-600 uppercase">{b.n}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-black text-xl mb-1">PREMIUM</h3>
              <p className="text-xs font-medium opacity-90 mb-4 line-clamp-2">Sınırsız AI kullanımı ve özel içerikler için yükselt.</p>
              <Button size="sm" className="w-full bg-white text-orange-600 hover:bg-gray-100 font-bold">İncele</Button>
            </div>
            <Star className="absolute -bottom-4 -right-4 w-24 h-24 text-white/20 rotate-12 group-hover:scale-110 transition-transform" />
          </div>

        </div>
      </div>
    </div>
  );
}

```

### src\pages\History.tsx
```
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, Loader2, Image as ImageIcon, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";

interface QuestionHistory {
  id: string;
  subject: string;
  question_text: string | null;
  image_url: string | null;
  status: 'pending' | 'ai_processing' | 'ai_answered' | 'teacher_review' | 'completed';
  created_at: string;
}

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<QuestionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("questions")
          .select("*")
          .eq("student_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setHistory(data || []);
      } catch (error) {
        console.error("Geçmiş yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "ai_answered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "teacher_review":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Tamamlandı";
      case "ai_answered": return "AI Cevapladı";
      case "teacher_review": return "Öğretmen İnceliyor";
      case "pending": return "Beklemede";
      default: return status;
    }
  };

  const getPublicUrl = (path: string | null) => {
    if (!path) return null;
    return supabase.storage.from("question_images").getPublicUrl(path).data.publicUrl;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <SEO title="Soru Geçmişim" />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Geçmişim</h1>
        <p className="text-muted-foreground text-sm">Daha önce sorduğun sorular ({history.length})</p>
      </motion.div>

      {history.length === 0 ? (
        <div className="text-center py-10 opacity-50">
          <MessageSquare className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
          <p>Henüz hiç soru sormamışsın. Hadi ilk sorunu sor!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/dashboard/question/${item.id}`)}
              className="bg-card rounded-xl p-4 border hover:shadow-md transition-shadow duration-200 cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                {/* Sol Taraf: Resim veya İkon */}
                <div className="flex-shrink-0">
                  {item.image_url ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border bg-muted">
                      <img
                        src={getPublicUrl(item.image_url) || ""}
                        alt="Soru resmi"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-secondary/50 flex items-center justify-center border">
                      <MessageSquare className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Sağ Taraf: Detaylar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold capitalize">
                        {item.subject}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: tr })}
                      </span>
                    </div>
                    {getStatusIcon(item.status)}
                  </div>

                  <p className="text-sm font-medium line-clamp-2 text-foreground/90 mb-1">
                    {item.question_text || "Fotoğraflı soru"}
                  </p>

                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    Durum: <span className="font-medium text-foreground">{getStatusText(item.status)}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

```

### src\pages\Index.tsx
```
import { motion } from "framer-motion";
import { Camera, ArrowRight, Sparkles, Brain, UserCheck, Star, Shield, BookOpen, Globe, Youtube, Music, FileDown, ExternalLink, CheckCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-illustration.png";
import LandingDemo from "@/components/LandingDemo";
import SEO from "@/components/SEO";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const steps = [
  {
    icon: Camera,
    title: "Fotoğrafını Çek",
    description: "Sorunun fotoğrafını çek veya metin olarak yaz.",
    color: "bg-primary text-primary-foreground",
  },
  {
    icon: Brain,
    title: "AI Çözsün",
    description: "Yapay zeka adım adım pedagojik çözüm üretsin.",
    color: "gradient-accent text-accent-foreground",
  },
  {
    icon: UserCheck,
    title: "Öğretmene Sor",
    description: "Anlamadıysan gerçek öğretmenlerden destek al.",
    color: "bg-primary text-primary-foreground",
  },
];

const testimonials = [
  {
    name: "Elif K.",
    role: "8. Sınıf Öğrencisi",
    text: "Matematik sorularımı fotoğraf çekip yüklüyorum, anında adım adım çözüm geliyor!",
    rating: 5,
  },
  {
    name: "Ahmet Y.",
    role: "Veli",
    text: "Çocuğumun ödevlerinde artık çok daha rahat. MEB müfredatına uygun olması bizi çok rahatlatıyor.",
    rating: 5,
  },
  {
    name: "Zeynep A.",
    role: "Lise 2 Öğrencisi",
    text: "Fen derslerinde harika yardımcı! Anlamadığım yerde öğretmene bağlanabiliyorum.",
    rating: 5,
  },
];

import { useTenant } from "@/contexts/TenantContext";

export default function LandingPage() {
  const { tenant } = useTenant();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={tenant ? `${tenant.name} | Yapay Zeka Destekli Ödev Asistanı` : "Yapay Zeka Destekli Ödev Asistanı"}
        description={`${tenant ? tenant.name : 'OdevGPT'}, yapay zeka destekli akıllı eğitim asistanı ile sorularını çöz, anlamadığın yerde gerçek öğretmenlerden destek al.`}
      />
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            {tenant?.logo_url ? (
              <img src={tenant.logo_url} alt={tenant.name} className="h-8 w-auto object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
            <span className="text-xl font-bold">
              {tenant ? (
                <span className="gradient-text uppercase tracking-tight">{tenant.name}</span>
              ) : (
                <>
                  <span className="gradient-text">ODEV</span>
                  <span className="text-accent">GPT</span>
                </>
              )}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-sm font-semibold hover:text-primary transition-colors">Özellikler</a>
            <a href="/#how-it-works" className="text-sm font-semibold hover:text-primary transition-colors">Nasıl Çalışır?</a>
            <Link to="/blog" className="text-sm font-semibold hover:text-primary transition-colors">Blog</Link>
            <a href="/#pricing" className="text-sm font-semibold hover:text-primary transition-colors">Ücretlendirme</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Giriş Yap</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="gradient-primary text-primary-foreground shadow-glow">
                Ücretsiz Başla
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {tenant?.hero_style === 'industrial' ? (
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden relative bg-black text-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,100,0,0.1),transparent_70%)]" />

          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-orange-600/20 border border-orange-600/30 text-orange-500 text-sm font-bold uppercase tracking-widest mb-8"
              >
                <Zap className="w-4 h-4 fill-current" />
                Teknik Uzmanlık & Yapay Zeka
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-8xl font-black leading-[1.1] mb-8 uppercase"
              >
                {tenant?.name} İLE <br />
                <span className="text-orange-500 italic">USTALIĞA</span> ADIM AT
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed"
              >
                Geleceğin endüstri liderlerini yetiştiriyoruz. Yapay zeka destekli teknik eğitim platformumuzla becerilerinizi dijital çağa taşıyın.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <Link to="/signup">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white font-black text-xl px-12 py-8 rounded-none border-r-4 border-b-4 border-orange-900 shadow-2xl transition-all hover:translate-x-1 hover:translate-y-1 active:translate-x-2 active:translate-y-2">
                    HEMEN BAŞLA
                  </Button>
                </Link>
                <Link to="/#how-it-works">
                  <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 text-white font-bold text-xl px-12 py-8 rounded-none">
                    EĞİTİMLER
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      ) : (
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-primary/5 via-accent/5 to-transparent -z-10" />
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                className="text-center md:text-left"
              >
                <motion.div custom={0} variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6 animate-fade-in">
                  <Shield className="w-4 h-4" />
                  MEB Müfredatına %100 Uyumlu
                </motion.div>
                <motion.h1 custom={1} variants={fadeInUp} className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-6 text-balance">
                  Ödevin mi var?{" "}
                  <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent animate-gradient-text">Fotoğrafını çek,</span>{" "}
                  anında adım adım öğren.
                </motion.h1>
                <motion.p custom={2} variants={fadeInUp} className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto md:mx-0">
                  AI destekli akıllı eğitim asistanı ile sorularını çöz, anlamadığın yerde gerçek öğretmenlerden destek al.
                </motion.p>
                <motion.div custom={3} variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link to="/dashboard/ask">
                    <Button size="lg" className="gradient-accent text-accent-foreground shadow-accent-glow hover:shadow-[0_0_20px_rgba(var(--accent),0.6)] transition-all duration-300 transform hover:-translate-y-1 text-lg px-8 py-6 rounded-2xl w-full sm:w-auto">
                      <Camera className="w-5 h-5 mr-2" />
                      Soru Sor / Fotoğraf Çek
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-2xl w-full sm:w-auto border-2 hover:bg-secondary/50 transition-all">
                      Keşfet
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative hidden md:block"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-accent/20 to-transparent blur-3xl rounded-full animate-blob" />
                <img
                  src={heroImage}
                  alt="ODEVGPT - Akıllı Eğitim Asistanı"
                  className="relative w-full max-w-lg mx-auto animate-float drop-shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Demo */}
      <LandingDemo />

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-card/50 border-y border-border/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Nasıl <span className="gradient-text">Çalışır?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Sadece 3 basit adımda ödevlerinin üstesinden gel ve başarıya ulaş.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="bg-card rounded-3xl p-8 text-center shadow-lg border hover:border-primary/50 transition-all duration-300 h-full flex flex-col items-center">
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold text-xl shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform">
                    {i + 1}
                  </div>
                  <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects (Features) */}
      <section id="features" className="py-16 md:py-24 overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tüm <span className="gradient-text">Dersler</span> İçin Hazır
            </h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {["Matematik", "Fen Bilimleri", "Türkçe", "Sosyal Bilgiler", "İngilizce", "Fizik", "Kimya", "Biyoloji", "Geometri", "Tarih", "Din Kültürü", "Felsefe"].map(
              (subject, i) => (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary))", color: "white" }}
                  className="px-6 py-3 rounded-full bg-secondary/80 text-secondary-foreground font-semibold border border-transparent hover:border-primary/20 transition-all duration-200 cursor-default select-none shadow-sm"
                >
                  {subject}
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-background/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Öğrencilerimiz <span className="gradient-text">Başarıyor!</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-3xl p-8 border shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
                <div className="flex gap-1 mb-4 text-orange-400">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-foreground/90 text-lg mb-6 italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-base">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-20 text-center text-primary-foreground shadow-2xl"
          >
            <div className="absolute inset-0 gradient-hero z-0" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-md border border-white/20 shadow-inner">
                <Sparkles className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl md:text-5xl font-black leading-tight">
                Başarıya Giden Yolda<br />İlk Adımı At!
              </h2>

              <p className="text-lg md:text-xl opacity-90 max-w-lg mx-auto font-medium">
                Sınırlı süreliğine tüm özellikler ücretsiz. Hemen dene, farkı gör.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/signup">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-7 rounded-2xl font-bold w-full sm:w-auto shadow-xl hover:scale-105 transition-transform">
                    Ücretsiz Kayıt Ol
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

              <p className="text-xs opacity-60 mt-4">Kredi kartı gerekmez. İstediğin zaman iptal et.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-secondary/20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Şeffaf <span className="gradient-text">Ücretlendirme</span></h2>
            <p className="text-muted-foreground text-lg">İhtiyacınıza uygun paketi seçin, başarıya odaklanın.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-card p-8 rounded-[2.5rem] border hover:shadow-xl transition-all flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Başlangıç</h3>
              <p className="text-muted-foreground mb-6">Öğrenmeye başlamak isteyenler için.</p>
              <div className="text-4xl font-black mb-6">₺0 <span className="text-base font-normal text-muted-foreground">/ay</span></div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Günlük 5 Soru Hakkı</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Standart AI Çözümleri</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Topluluk Desteği</li>
              </ul>
              <Link to="/signup">
                <Button variant="outline" className="w-full rounded-2xl py-6">Ücretsiz Başla</Button>
              </Link>
            </div>
            {/* Pro Plan */}
            <div className="bg-card p-8 rounded-[2.5rem] border-2 border-primary shadow-2xl relative flex flex-col transform hover:-translate-y-2 transition-all">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold">EN ÇOK TERCİH EDİLEN</div>
              <h3 className="text-2xl font-bold mb-2 text-primary">Pro Paket</h3>
              <p className="text-muted-foreground mb-6">Sınavlara hazırlanan ciddi öğrenciler için.</p>
              <div className="text-4xl font-black mb-6">₺99 <span className="text-base font-normal text-muted-foreground">/ay</span></div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Sınırsız Soru Fotoğrafı</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Sokratik Yöntemle Anlatım</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Öncelikli Öğretmen Desteği</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Reklamsız Deneyim</li>
              </ul>
              <Link to="/signup">
                <Button className="w-full rounded-2xl py-6 gradient-primary shadow-glow">Hemen Başla</Button>
              </Link>
            </div>
            {/* School Plan */}
            <div className="bg-card p-8 rounded-[2.5rem] border hover:shadow-xl transition-all flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Okul / Kurum</h3>
              <p className="text-muted-foreground mb-6">Sınıf ve okul yönetimi için özel çözümler.</p>
              <div className="text-4xl font-black mb-6 text-center py-2 text-primary font-bold">Fiyat Alın</div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-violet-500" /> Detaylı Sınıf İstatistikleri</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-violet-500" /> Öğretmen Dashboard</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-violet-500" /> Kurumsal Raporlama</li>
              </ul>
              <Button variant="outline" className="w-full rounded-2xl py-6">İletişime Geçin</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section - Video, Podcast & Presentations */}
      <section className="py-24 bg-card/50 relative overflow-hidden">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Eğitimde <span className="gradient-text">Yeni Nesil</span> Kaynaklar
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Platformumuzu daha yakından tanıyın, podcastlerimizi dinleyin ve sunumlarımızı inceleyin.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
            {/* Column A (Default: Video/Podcast, If right: Info/PDF) */}
            <div className={tenant?.video_position === 'right' ? "lg:order-2 space-y-8" : "lg:order-1 space-y-8"}>
              {/* YouTube Video Embed */}
              {!tenant?.hide_video_section && (
                <motion.div
                  initial={{ opacity: 0, x: tenant?.video_position === 'right' ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-[2rem] border overflow-hidden shadow-xl"
                >
                  <div className="p-6 border-b bg-primary/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Youtube className="w-5 h-5 text-red-500" />
                      <h3 className="font-bold">{tenant ? tenant.name : "Tanıtım Videomuz"}</h3>
                    </div>
                    <a href={tenant?.custom_video_url || "https://youtu.be/WPxtGU3yAjs"} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                      YouTube'da İzle <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={tenant?.custom_video_url?.replace("youtu.be/", "www.youtube.com/embed/").replace("watch?v=", "embed/") || "https://www.youtube.com/embed/WPxtGU3yAjs"}
                      title={`${tenant ? tenant.name : "OdevGPT"} Tanıtım Videosu`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </motion.div>
              )}

              {/* Spotify Podcast Embed */}
              {!tenant?.hide_podcast_section && (
                <motion.div
                  initial={{ opacity: 0, x: tenant?.video_position === 'right' ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#1DB954]/5 rounded-[2rem] border border-[#1DB954]/20 overflow-hidden shadow-sm p-1"
                >
                  <div className="p-5 flex items-center gap-2">
                    <Music className="w-5 h-5 text-[#1DB954]" />
                    <h3 className="font-bold">Eğitim Podcastimiz</h3>
                  </div>
                  <iframe
                    src={tenant?.custom_podcast_url || "https://open.spotify.com/embed/episode/3QcJY1AjuhiXwjxtRPZNKy?utm_source=generator"}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-2xl"
                  ></iframe>
                </motion.div>
              )}
            </div>

            {/* Column B (Default: Info/PDF, If video right: This is left) */}
            <div className={tenant?.video_position === 'right' ? "lg:order-1 space-y-8" : "lg:order-2 space-y-8"}>
              <motion.div
                initial={{ opacity: 0, x: tenant?.video_position === 'right' ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-card rounded-[2rem] border shadow-xl p-8 h-full"
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Proje Bilgi Paketi</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {tenant ? `${tenant.name} vizyonu, teknolojisi ve teknik temelleri hakkında hazırladığımız detaylı sunuma aşağıdan ulaşabilirsiniz.` : "OdevGPT'nin vizyonu, teknolojisi ve pedagojik temelleri hakkında hazırladığımız detaylı sunuma aşağıdan ulaşabilirsiniz. Projemizin nasıl bir fark yarattığını keşfedin."}
                </p>

                <div className="space-y-4">
                  <div className="group flex items-center justify-between p-4 bg-gray-50 rounded-2xl border hover:border-blue-300 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <FileDown className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{tenant ? `${tenant.slug}_sunum.pdf` : "OdevGPT_info_1.pdf"}</p>
                        <p className="text-[10px] text-muted-foreground">Proje Tanıtım Sunumu • 13.1 MB</p>
                      </div>
                    </div>
                    <a
                      href="/docs/odevGPT_info_1.pdf"
                      download
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-200"
                    >
                      İndir
                    </a>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                  <div className="p-2 h-fit bg-amber-100 rounded-lg">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-900 mb-1">{tenant?.custom_cto_name || "CTO Notu"}</h4>
                    <p className="text-xs text-amber-800/80 leading-relaxed">
                      "{tenant?.custom_cto_note || "Yapay zekayı sadece bir araç değil, her öğrencinin yanında duran sabırlı bir mentor olarak tasarladık. Sunumumuzda bu mimariyi detaylıca bulabilirsiniz."}"
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Universe Discovery Button */}
      {!tenant?.hide_universe_section && (
        <section className="py-24 relative overflow-hidden">
          <div className="container flex justify-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full max-w-4xl"
            >
              <a
                href="https://edusonex.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block w-full bg-black rounded-[3rem] p-1 overflow-hidden"
              >
                {/* Animated Background for the Button */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-100 blur-xl transition-opacity animate-gradient-text" />

                <div className="relative bg-black/90 rounded-[2.9rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 group-hover:border-white/20 transition-all">
                  <div className="text-center md:text-left space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] font-bold tracking-widest uppercase">
                      Premium Deneyim
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white">
                      EdusonEX Evrenini <span className="text-indigo-400 italic">Keşfedin</span>
                    </h2>
                    <p className="text-white/60 text-lg max-w-md">
                      OdevGPT'nin doğduğu devasa eğitim ekosistemine yolculuğa çıkın.
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity" />
                    <div className="relative px-8 py-5 bg-white text-black rounded-2xl font-black text-xl flex items-center gap-3 transition-transform group-hover:scale-105 active:scale-95 shadow-2xl">
                      Hemen Git
                      <Globe className="w-6 h-6 animate-pulse" />
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 border-t bg-card/30">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8 text-sm text-muted-foreground">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              {tenant?.logo_url ? (
                <img src={tenant.logo_url} alt={tenant.name} className="h-6 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />
              ) : (
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <span className="font-bold text-lg text-foreground uppercase tracking-tighter">
                {tenant?.name || "ODEVGPT"}
              </span>
            </div>
            <p className="max-w-xs text-center md:text-left">
              {tenant ? `${tenant.name} öğrencileri için akıllı yapay zeka asistanı.` : "Türkiye'nin en gelişmiş yapay zeka destekli eğitim asistanı."}
            </p>
          </div>

          <div className="flex gap-8">
            <nav className="hidden md:flex items-center gap-8">
              <a href="/#features" className="text-sm font-semibold hover:text-primary transition-colors">Özellikler</a>
              <a href="/#how-it-works" className="text-sm font-semibold hover:text-primary transition-colors">Nasıl Çalışır?</a>
              <Link to="/blog" className="text-sm font-semibold hover:text-primary transition-colors">Blog</Link>
              <a href="/#pricing" className="text-sm font-semibold hover:text-primary transition-colors">Ücretlendirme</a>
            </nav>
          </div>

          <p>© 2026 ODEVGPT. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}

```

### src\pages\Leaderboard.tsx
```
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Trophy,
    Medal,
    ArrowLeft,
    Loader2,
    Sparkles,
    Target,
    Flame,
    TrendingUp,
    Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import SEO from "@/components/SEO";

interface LeaderboardUser {
    id: string;
    full_name: string | null;
    xp: number;
    level: number;
    avatar_url: string | null;
    tenant_id: string | null;
}

export default function Leaderboard() {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { tenant } = useTenant();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"global" | "school">("global");

    useEffect(() => {
        // If user belongs to a tenant, default to school filter
        if (profile?.tenant_id) {
            setFilter("school");
        }
    }, [profile?.tenant_id]);

    useEffect(() => {
        fetchLeaderboard();
    }, [filter, profile?.tenant_id]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('profiles')
                .select('id, full_name, xp, level, avatar_url, tenant_id')
                .eq('role', 'student');

            if (filter === 'school' && profile?.tenant_id) {
                query = query.eq('tenant_id', profile.tenant_id);
            }

            query = query.order('xp', { ascending: false });

            const { data, error } = await query.limit(50);

            if (error) throw error;
            setUsers(data || []);
        } catch (err) {
            console.error("Leaderboard Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        (user.full_name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Trophy className="w-6 h-6 text-yellow-500" />;
            case 1: return <Medal className="w-6 h-6 text-gray-400" />;
            case 2: return <Medal className="w-6 h-6 text-amber-600" />;
            default: return <span className="font-bold text-muted-foreground">{index + 1}</span>;
        }
    };

    if (loading) return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const topThree = users.slice(0, 3);
    const others = filteredUsers.slice(3);

    return (
        <div className="container py-8 max-w-5xl mx-auto space-y-8">
            <SEO title="Liderlik Tablosu" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black flex items-center gap-2">
                            Liderlik Tablosu <Sparkles className="w-6 h-6 text-yellow-500" />
                        </h1>
                        <p className="text-muted-foreground text-sm">EdusonEX evreninin en başarılı kaşifleri!</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="bg-muted p-1 rounded-xl flex gap-1 grow md:grow-0">
                        <Button
                            variant={filter === 'global' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="rounded-lg text-[10px] h-8 grow md:grow-0"
                            onClick={() => setFilter('global')}
                        >
                            Global
                        </Button>
                        <Button
                            variant={filter === 'school' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="rounded-lg text-[10px] h-8 grow md:grow-0"
                            onClick={() => setFilter('school')}
                        >
                            {tenant ? tenant.name : "Okul İçi"}
                        </Button>
                    </div>
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="İsimle ara..."
                            className="pl-10 h-10 rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Top 3 Podium */}
            {!searchQuery && topThree.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end py-10">
                    {/* 2nd Place */}
                    {topThree[1] && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="order-2 md:order-1"
                        >
                            <Card className="border-2 border-gray-100 shadow-lg text-center bg-gray-50/30">
                                <CardContent className="pt-8 space-y-4">
                                    <div className="relative inline-block">
                                        <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
                                            <AvatarImage src={topThree[1].avatar_url || ""} />
                                            <AvatarFallback>{topThree[1].full_name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-2 -right-2 bg-gray-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white">2</div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{topThree[1].full_name}</h3>
                                        <Badge variant="secondary">Seviye {topThree[1].level}</Badge>
                                    </div>
                                    <div className="text-2xl font-black text-gray-700">{topThree[1].xp} XP</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* 1st Place */}
                    {topThree[0] && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="order-1 md:order-2 z-10"
                        >
                            <Card className="border-4 border-yellow-400 shadow-2xl text-center bg-gradient-to-b from-yellow-50 to-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4">
                                    <Trophy className="w-8 h-8 text-yellow-500 opacity-20" />
                                </div>
                                <CardContent className="pt-10 pb-10 space-y-4">
                                    <div className="relative inline-block">
                                        <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 animate-pulse" />
                                        <Avatar className="w-28 h-28 border-4 border-yellow-400 shadow-2xl relative">
                                            <AvatarImage src={topThree[0].avatar_url || ""} />
                                            <AvatarFallback>{topThree[0].full_name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white text-lg">1</div>
                                    </div>
                                    <div>
                                        <h2 className="font-black text-2xl">{topThree[0].full_name}</h2>
                                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">ALTIN KAŞİF</Badge>
                                    </div>
                                    <div className="text-4xl font-black text-yellow-600 drop-shadow-sm">{topThree[0].xp} XP</div>
                                    <div className="flex items-center justify-center gap-2 text-yellow-700 text-sm font-bold">
                                        Level {topThree[0].level}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* 3rd Place */}
                    {topThree[2] && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="order-3"
                        >
                            <Card className="border-2 border-orange-100 shadow-lg text-center bg-orange-50/10">
                                <CardContent className="pt-8 space-y-4">
                                    <div className="relative inline-block">
                                        <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
                                            <AvatarImage src={topThree[2].avatar_url || ""} />
                                            <AvatarFallback>{topThree[2].full_name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-2 -right-2 bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white">3</div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{topThree[2].full_name}</h3>
                                        <Badge variant="secondary">Seviye {topThree[2].level}</Badge>
                                    </div>
                                    <div className="text-2xl font-black text-amber-700">{topThree[2].xp} XP</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            )}

            {/* List Table */}
            <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Sıralama</CardTitle>
                        <div className="text-sm text-muted-foreground font-medium flex items-center gap-4">
                            <span className="flex items-center gap-1"><Target className="w-4 h-4" /> Hedef: Zirve</span>
                            <span className="flex items-center gap-1"><Flame className="w-4 h-4" /> Aktif Kaşifler</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Kaşif</th>
                                    <th className="px-6 py-4">Seviye</th>
                                    <th className="px-6 py-4 text-right">Toplam XP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {others.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            {getRankIcon(searchQuery ? index : index + 3)}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10 border-2 border-white shadow-sm transition-transform group-hover:scale-110">
                                                    <AvatarImage src={user.avatar_url || ""} />
                                                    <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{user.full_name}</span>
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 italic">
                                                        <TrendingUp className="w-3 h-3" /> Yükselişte
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5 w-24">
                                                <div className="flex items-center justify-between text-[10px] font-bold">
                                                    <span>LVL {user.level}</span>
                                                    <span className="text-muted-foreground">{Math.floor(((user.xp % 500) / 500) * 100)}%</span>
                                                </div>
                                                <Progress value={(user.xp % 500) / 5} className="h-1.5 bg-gray-100" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-black text-gray-800 text-lg">{user.xp}</span>
                                            <span className="text-[10px] text-gray-400 ml-1">XP</span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredUsers.length === 0 && (
                        <div className="py-20 text-center text-muted-foreground italic">
                            Eşleşen kaşif bulunamadı.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Motivation Section */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-indigo-600 text-white border-0 shadow-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Zirveye Nasıl Çıkılır?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 relative z-10">
                        <div className="flex items-start gap-3">
                            <div className="p-1 bg-white/20 rounded-md mt-1 font-bold text-xs">+10</div>
                            <p className="text-sm">Sokratik AI ile sohbet ederek her mesajda XP kazan.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-1 bg-white/20 rounded-md mt-1 font-bold text-xs">+100</div>
                            <p className="text-sm">Ödevlerini zamanında teslim ederek büyük puanı kap!</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-1 bg-white/20 rounded-md mt-1 font-bold text-xs">+250</div>
                            <p className="text-sm">Öğretmenden tam not al ve sıralamada zıpla.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-amber-100 border-amber-200 text-amber-900 border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle>Günün Sözü</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <blockquote className="italic text-lg font-medium leading-relaxed">
                            "Eğitim, dünyayı değiştirmek için kullanabileceğiniz en güçlü silahtır. Sen de bir EdusonEX kahramanısın!"
                        </blockquote>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

```

### src\pages\Login.tsx
```
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

export default function Login() {
    const { tenant } = useTenant();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { signIn } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signIn(email, password);
            toast({
                title: "Hoş geldiniz! 🎉",
                description: "Başarıyla giriş yaptınız.",
            });
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Giriş yapılırken bir hata oluştu.");
            toast({
                title: "Hata",
                description: err.message || "Giriş yapılırken bir hata oluştu.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <SEO title={tenant ? `${tenant.name} Giriş` : "Giriş Yap"} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                    {tenant?.logo_url ? (
                        <img src={tenant.logo_url} alt={tenant.name} className="h-10 w-auto object-contain" />
                    ) : (
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-primary-foreground" />
                        </div>
                    )}
                    <span className="text-2xl font-bold">
                        {tenant ? (
                            <span className="gradient-text uppercase">{tenant.name}</span>
                        ) : (
                            <>
                                <span className="gradient-text">Edusonex</span>{" "}
                                <span className="text-accent">ÖdevGPT</span>
                            </>
                        )}
                    </span>
                </Link>

                {/* Login Card */}
                <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-lg)] border">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-2">Giriş Yap</h1>
                        <p className="text-muted-foreground text-sm">
                            {tenant ? `${tenant.name} paneline giriş yapın` : "Hesabınıza giriş yapın ve öğrenmeye devam edin"}
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2"
                        >
                            <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                            <p className="text-sm text-destructive">{error}</p>
                        </motion.div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full gradient-primary text-primary-foreground shadow-glow"
                            size="lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Giriş yapılıyor...
                                </>
                            ) : (
                                "Giriş Yap"
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs text-muted-foreground">veya</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Hesabınız yok mu?{" "}
                            <Link
                                to="/signup"
                                className="text-primary font-semibold hover:underline"
                            >
                                Kayıt Ol
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ← Ana Sayfaya Dön
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

```

### src\pages\NotFound.tsx
```
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SearchX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="rounded-full bg-secondary/50 p-6 mb-6">
        <SearchX className="h-16 w-16 text-muted-foreground opacity-50" />
      </div>

      <h1 className="mb-2 text-4xl font-bold tracking-tight">Oops! Sayfa Bulunamadı</h1>
      <p className="mb-8 text-lg text-muted-foreground max-w-md">
        Aradığın sayfa kitabın sayfaları arasında kaybolmuş olabilir. Sözelciler bile bulamazdı!
      </p>

      <Link to="/">
        <Button size="lg" className="gradient-primary text-primary-foreground shadow-glow">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anasayfaya Dön
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;

```

### src\pages\ParentPanel.tsx
```
/**
 * PARENT PANEL (VELİ PANELİ)
 * 
 * Velilerin öğrencilerini takip edebildiği dashboard.
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import SEO from '@/components/SEO';
import { WeeklyReportCard } from '@/components/WeeklyReportCard';
import {
    Users,
    Plus,
    Trophy,
    Activity,
    BookOpen,
    TrendingUp,
    Clock,
    UserCircle,
    Loader2,
    ShieldCheck,
    HelpCircle,
    ChevronRight,
    Star,
    Award,
    Sparkles,
    Zap,
    Calendar,
    CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface StudentSummary {
    student_id: string;
    student_name: string;
    student_avatar: string;
    xp: number;
    level: number;
    total_questions: number;
    solved_questions: number;
    last_activity: string;
}

interface StudentActivity {
    id: string;
    title: string;
    content: string;
    created_at: string;
    status: string;
    hasSolution: boolean;
}

interface ChartDataPoint {
    name: string;
    xp: number;
}

interface Assignment {
    id: string;
    title: string;
    description: string;
    due_date: string;
    status: string;
    submitted_at?: string;
    grade?: number;
    feedback?: string;
}

export default function ParentPanel() {
    const { user } = useAuth();
    const { tenant } = useTenant();
    const { toast } = useToast();

    const [students, setStudents] = useState<StudentSummary[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [pairingCode, setPairingCode] = useState('');
    const [isPairing, setIsPairing] = useState(false);
    const [studentActivities, setStudentActivities] = useState<StudentActivity[]>([]);
    const [latestAiSummary, setLatestAiSummary] = useState<string | null>(null);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);

    const selectedStudent = students.find(s => s.student_id === selectedStudentId) || students[0];

    useEffect(() => {
        // user.id varsa öğrencileri çek
        if (user?.id) {
            fetchStudents();
        }
    }, [user?.id]); // Sadece user ID değişirse çalışır

    useEffect(() => {
        // selectedStudentId değişirse verileri çek
        if (selectedStudentId) {
            fetchStudentActivities(selectedStudentId);
            fetchLatestReport(selectedStudentId);
            fetchChartData(selectedStudentId);
            fetchAssignments(selectedStudentId);
        }
    }, [selectedStudentId]);

    const fetchLatestReport = async (studentId: string) => {
        try {
            const { data, error } = await supabase
                .from('parent_reports')
                .select('ai_summary')
                .eq('student_id', studentId)
                .order('week_start', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            if (data) {
                setLatestAiSummary(data.ai_summary);
            } else {
                setLatestAiSummary(null);
            }
        } catch (err) {
            console.error("Report fetch error:", err);
        }
    };

    const fetchChartData = async (studentId: string) => {
        try {
            const { data, error } = await supabase
                .rpc('get_student_daily_xp', {
                    p_student_id: studentId,
                    p_days: 7
                });

            if (error) throw error;
            if (data) {
                setChartData(data.map((d: any) => ({
                    name: d.day_name,
                    xp: d.total_xp
                })));
            }
        } catch (err) {
            console.error("Chart data fetch error:", err);
            // Hata durumunda boş grafik göster
            setChartData([]);
        }
    };

    const fetchAssignments = async (studentId: string) => {
        try {
            // 1. Öğrencinin sınıflarını bul
            const { data: classData } = await supabase
                .from('class_students')
                .select('class_id')
                .eq('student_id', studentId);

            const classIds = classData?.map(c => c.class_id) || [];

            if (classIds.length === 0) {
                setAssignments([]);
                return;
            }

            // 2. Sınıflara ait tüm ödevleri çek
            const { data: assignmentsData, error: assignError } = await supabase
                .from('assignments')
                .select(`
                    id,
                    title,
                    description,
                    due_date
                `)
                .in('class_id', classIds)
                .order('due_date', { ascending: true }); // Önce yaklaşan ödevler

            if (assignError) throw assignError;

            if (!assignmentsData || assignmentsData.length === 0) {
                setAssignments([]);
                return;
            }

            // 3. Teslim durumlarını çek
            const assignmentIds = assignmentsData.map(a => a.id);
            const { data: submissionsData, error: subError } = await supabase
                .from('assignment_submissions')
                .select('assignment_id, status, score, submitted_at, feedback')
                .eq('student_id', studentId)
                .in('assignment_id', assignmentIds);

            if (subError) throw subError;

            // 4. Birleştir
            const formattedAssignments = assignmentsData.map((assign: any) => {
                const sub = submissionsData?.find(s => s.assignment_id === assign.id);

                let status = 'pending';
                if (sub) {
                    if (sub.status === 'graded') status = 'graded';
                    else status = 'submitted';
                }

                return {
                    id: assign.id,
                    title: assign.title,
                    description: assign.description,
                    due_date: assign.due_date,
                    status: status,
                    submitted_at: sub?.submitted_at,
                    grade: sub?.score,
                    feedback: sub?.feedback
                };
            });

            // 5. Sıralama
            formattedAssignments.sort((a, b) => {
                const priority: Record<string, number> = { pending: 0, submitted: 1, graded: 2 };
                return (priority[a.status] || 0) - (priority[b.status] || 0);
            });

            setAssignments(formattedAssignments);

        } catch (err) {
            console.error("Assignments fetch error:", err);
            setAssignments([]);
        }
    };

    const fetchStudentActivities = async (studentId: string) => {
        if (!studentId) return;

        try {
            // Öğrencinin soruları ve çözüm metriklerini çek
            const { data: questionsData, error: questionsError } = await supabase
                .from('questions')
                .select(`
                    id, 
                    question_text, 
                    created_at, 
                    status,
                    solutions(id, solver_type)
                `)
                .eq('student_id', studentId)
                .order('created_at', { ascending: false })
                .limit(5);

            if (questionsError) throw questionsError;

            // Veriyi Activity tab'ı için transform et
            const formattedActivities = (questionsData || []).map((q: any) => ({
                id: q.id,
                title: q.status === 'solved' ? '✅ Çözülen Soru' : '❓ Çözüm Bekliyor',
                content: q.question_text,
                created_at: q.created_at,
                status: q.status,
                hasSolution: (q.solutions || []).length > 0
            }));

            setStudentActivities(formattedActivities);
        } catch (err) {
            console.error("Activity fetch error:", err);
            // Hata sessizce loglanız, kullanıcıya toast gösterilmez
        }
    };

    const fetchStudents = async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            // PARAMETRE YOK! Backend auth.uid() kullanıyor.
            const { data, error } = await supabase.rpc('get_parent_students');

            if (error) {
                console.error('❌ get_parent_students RPC Hatası:', {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                });
                // Toast göster ama detaylı bilgi logla
                toast({
                    title: "Veriler yüklenemedi",
                    description: "Veli paneli yüklü değil. Lütfen en son veri tabanı migrasyonunu çalıştırdığından emin olun.",
                    variant: "destructive",
                });
                return;
            }

            setStudents(data || []);
            if (data && data.length > 0 && !selectedStudentId) {
                setSelectedStudentId(data[0].student_id);
            }
        } catch (error: any) {
            console.error('❌ Fetch students error:', {
                name: error.name,
                message: error.message,
                stack: error.stack,
            });
            toast({
                title: "Bağlantı Hatası",
                description: "Sunucuyla bağlantı kurulamadı.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePairing = async () => {
        if (!pairingCode.trim() || !user?.id) return;

        try {
            setIsPairing(true);
            // pair_student_with_parent(p_access_code TEXT) -> JSONB
            const { data, error } = await supabase.rpc('pair_student_with_parent', {
                p_access_code: pairingCode.trim()
            });

            if (error) {
                console.error('❌ pair_student_with_parent RPC Hatası:', {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                });
                toast({
                    title: 'RPC Hatası',
                    description: error.message || 'Öğrenci bağlanırken bir sorun oluştu.',
                    variant: 'destructive',
                });
                return;
            }

            if (data?.success) {
                toast({
                    title: '✅ Bağlantı Başarılı',
                    description: `${data.student_name} artık hesabınıza bağlandı.`,
                });
                setPairingCode('');
                // Listeyi yenile
                fetchStudents();
            } else {
                toast({
                    title: 'Bağlantı Başarısız',
                    description: data?.message || 'Bilinmeyen bir hata oluştu.',
                    variant: 'destructive',
                });
            }
        } catch (error: any) {
            console.error('❌ Pairing error:', error);
            toast({
                title: 'Bağlantı Hatası',
                description: error.message || 'Öğrenci bağlanırken bir sorun oluştu.',
                variant: 'destructive',
            });
        } finally {
            setIsPairing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Veriler hazırlanıyor...</p>
            </div>
        );
    }

    return (
        <div className="container py-8 px-4 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <SEO title="Veli Paneli" />
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black flex items-center gap-3 tracking-tight">
                        <div className="p-2 bg-primary/10 rounded-2xl">
                            {tenant?.logo_url ? (
                                <img src={tenant.logo_url} alt={tenant.name} className="w-8 h-8 object-contain" />
                            ) : (
                                <Users className="w-8 h-8 text-primary" />
                            )}
                        </div>
                        {tenant ? `${tenant.name} Veli Paneli` : "Veli Paneli"}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        {tenant ? `${tenant.name} öğrencilerinin` : "Çocuklarınızın"} akademik serüvenini buradan yönetin.
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto bg-card p-2 rounded-2xl shadow-sm border">
                    <Input
                        placeholder="Erişim Kodu (Örn: X1Y2Z3)"
                        value={pairingCode}
                        onChange={(e) => setPairingCode(e.target.value)}
                        className="border-none bg-transparent focus-visible:ring-0 w-full md:w-48 placeholder:text-muted-foreground/50"
                        maxLength={8}
                    />
                    <Button
                        onClick={handlePairing}
                        disabled={isPairing || !pairingCode}
                        className="rounded-xl px-6 shadow-lg shadow-primary/20"
                    >
                        {isPairing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                        Ekle
                    </Button>
                </div>
            </div>

            {students.length === 0 ? (
                <Card className="border-dashed border-2 py-20 bg-muted/30 rounded-3xl">
                    <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-bounce" style={{ animationDuration: '3000ms' }}>
                            <UserCircle className="w-12 h-12 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold">Henüz bir öğrenci bağlamadınız</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Öğrencinizin profil sayfasındaki <span className="text-primary font-bold">"Veli Erişim Kodu"</span>nu buraya girerek başlayabilirsiniz.
                            </p>
                        </div>
                        <div className="flex items-start gap-4 p-5 bg-white rounded-2xl text-sm text-left max-w-lg shadow-sm border">
                            <ShieldCheck className="w-6 h-6 text-green-500 mt-1 shrink-0" />
                            <div className="space-y-1">
                                <p className="font-bold text-gray-800">Güvenli Veri Paylaşımı</p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Özel erişim kodu sayesinde sadece yetkilendirdiğiniz öğrencinin akademik verilerini görebilirsiniz.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Student List Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Öğrencilerim
                            </h2>
                            <Badge variant="secondary" className="rounded-full px-3">{students.length}</Badge>
                        </div>
                        <div className="space-y-3">
                            {students.map((student) => (
                                <div
                                    key={student.student_id}
                                    onClick={() => setSelectedStudentId(student.student_id)}
                                    className={`
                                        group relative p-4 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden
                                        ${selectedStudentId === student.student_id
                                            ? 'border-primary bg-primary/5 shadow-md'
                                            : 'border-transparent bg-card hover:border-gray-200 shadow-sm'}
                                    `}
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`
                                            p-1 rounded-full border-2 transition-transform duration-300
                                            ${selectedStudentId === student.student_id ? 'border-primary scale-110' : 'border-gray-100'}
                                        `}>
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                                {student.student_avatar ? (
                                                    <img src={student.student_avatar} alt={student.student_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserCircle className="w-8 h-8 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{student.student_name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-[10px] h-5 bg-white">Lvl {student.level}</Badge>
                                                <span className="text-[10px] text-muted-foreground font-medium">{student.xp} XP</span>
                                            </div>
                                        </div>
                                        {selectedStudentId === student.student_id && (
                                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                <ChevronRight className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    {selectedStudentId === student.student_id && (
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <Star className="w-12 h-12 text-primary" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Quick Insight Card */}
                        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-xl rounded-3xl overflow-hidden relative">
                            <CardContent className="p-6 space-y-4">
                                <div className="p-2 bg-white/20 rounded-xl w-fit">
                                    <Award className="w-6 h-6 text-yellow-300" />
                                </div>
                                <h4 className="text-xl font-bold leading-tight">Yapay Zeka <br />Analizi</h4>
                                <p className="text-indigo-100 text-sm leading-relaxed line-clamp-3">
                                    {latestAiSummary || `${selectedStudent?.student_name} için bu haftalık henüz bir analiz oluşturulmadı.`}
                                </p>
                                <Button
                                    variant="secondary"
                                    className="w-full bg-white text-indigo-600 hover:bg-gray-100 font-bold rounded-xl mt-2"
                                    onClick={() => {
                                        const el = document.getElementById('weekly-report-card');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    Raporu Oku
                                </Button>
                            </CardContent>
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                        </Card>
                    </div>

                    {/* Performance Details Main Area */}
                    <div className="lg:col-span-8 space-y-6">
                        {selectedStudent && (
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1.5 rounded-2xl h-14">
                                    <TabsTrigger value="overview" className="rounded-xl font-bold text-xs uppercase tracking-wider">Genel Bakış</TabsTrigger>
                                    <TabsTrigger value="activity" className="rounded-xl font-bold text-xs uppercase tracking-wider">Aktivite</TabsTrigger>
                                    <TabsTrigger value="homework" className="rounded-xl font-bold text-xs uppercase tracking-wider">Ödevler</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="mt-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <Card className="rounded-2xl border-none bg-orange-50/50 shadow-sm hover:shadow-md transition-all">
                                            <CardHeader className="p-5 pb-2">
                                                <CardDescription className="text-orange-600 font-bold text-[10px] uppercase tracking-widest">Toplam Soru</CardDescription>
                                                <CardTitle className="text-3xl font-black text-orange-950">{selectedStudent.total_questions}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-5 pt-0">
                                                <div className="flex items-center text-xs text-orange-700/60 font-medium">
                                                    <HelpCircle className="w-3 h-3 mr-1" />
                                                    Soru Geçmişi
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="rounded-2xl border-none bg-emerald-50/50 shadow-sm hover:shadow-md transition-all">
                                            <CardHeader className="p-5 pb-2">
                                                <CardDescription className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest">Çözülen Soru</CardDescription>
                                                <CardTitle className="text-3xl font-black text-emerald-950">{selectedStudent.solved_questions}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-5 pt-0">
                                                <div className="flex items-center text-xs text-emerald-700 font-bold">
                                                    <ShieldCheck className="w-3 h-3 mr-1" />
                                                    %{((selectedStudent.solved_questions / (selectedStudent.total_questions || 1)) * 100).toFixed(0)} Başarı
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="col-span-2 md:col-span-1 rounded-2xl border-none bg-blue-50/50 shadow-sm hover:shadow-md transition-all">
                                            <CardHeader className="p-5 pb-2">
                                                <CardDescription className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">Son Aktivite</CardDescription>
                                                <CardTitle className="text-xl font-black text-blue-950 truncate">
                                                    {selectedStudent.last_activity
                                                        ? format(new Date(selectedStudent.last_activity), 'd MMM', { locale: tr })
                                                        : 'Aktivite yok'}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-5 pt-0">
                                                <div className="flex items-center text-xs text-blue-700/60 font-medium">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {selectedStudent.last_activity
                                                        ? format(new Date(selectedStudent.last_activity), 'HH:mm')
                                                        : '-'}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* XP Growth Chart */}
                                    <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                                        <TrendingUp className="w-5 h-5 text-primary" />
                                                        Haftalık XP Kazanımı
                                                    </CardTitle>
                                                    <CardDescription>Öğrencinin son 7 gündeki öğrenme hızı</CardDescription>
                                                </div>
                                                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">Aktif</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <div className="h-[280px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={chartData}>
                                                        <defs>
                                                            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor={tenant?.primary_color || "#8b5cf6"} stopOpacity={0.3} />
                                                                <stop offset="95%" stopColor={tenant?.primary_color || "#8b5cf6"} stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                        <XAxis
                                                            dataKey="name"
                                                            stroke="#94a3b8"
                                                            fontSize={12}
                                                            tickLine={false}
                                                            axisLine={false}
                                                            tickMargin={10}
                                                        />
                                                        <YAxis hide />
                                                        <Tooltip
                                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                                                            cursor={{ stroke: '#8b5cf6', strokeWidth: 2 }}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="xp"
                                                            stroke={tenant?.primary_color || "#8b5cf6"}
                                                            strokeWidth={4}
                                                            fillOpacity={1}
                                                            fill="url(#colorXp)"
                                                            animationDuration={2000}
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Haftalık AI Raporu */}
                                    <div id="weekly-report-card">
                                        <WeeklyReportCard
                                            studentId={selectedStudent.student_id}
                                            studentName={selectedStudent.student_name}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="activity">
                                    <Card className="rounded-3xl border-none shadow-sm">
                                        <CardHeader>
                                            <CardTitle className="font-bold flex items-center gap-2">
                                                <Activity className="w-5 h-5 text-primary" />
                                                Son Sorular ve Yanıtlar
                                            </CardTitle>
                                            <CardDescription>Yapay zeka ile olan etkileşimler</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <ScrollArea className="h-[400px]">
                                                {studentActivities.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                                            <Clock className="w-8 h-8 text-muted-foreground/30" />
                                                        </div>
                                                        <p className="text-muted-foreground italic text-sm max-w-xs px-6">
                                                            Henüz bu öğrenci için bir aktivite kaydı yok.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="divide-y">
                                                        {studentActivities.map((activity, idx) => (
                                                            <div key={activity.id} className="p-4 hover:bg-muted/30 transition-colors flex gap-4 items-start relative group">
                                                                <div className={`
                                                                    w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                                                                    ${activity.status === 'solved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}
                                                                `}>
                                                                    {activity.status === 'solved' ? <Award className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
                                                                </div>
                                                                <div className="flex-1 space-y-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <p className="text-sm font-bold text-gray-900">{activity.title}</p>
                                                                        <span className="text-[10px] text-muted-foreground">
                                                                            {format(new Date(activity.created_at), 'd MMM HH:mm', { locale: tr })}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                                                        {activity.content}
                                                                    </p>
                                                                </div>
                                                                {idx === 0 && (
                                                                    <div className="absolute top-2 right-2">
                                                                        <Badge variant="outline" className="text-[8px] bg-blue-50 text-blue-700 border-blue-100">EN YENİ</Badge>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </ScrollArea>
                                            <div className="p-4 bg-muted/20 border-t text-center">
                                                <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                                                    <Zap className="w-3 h-3 text-yellow-500" />
                                                    Tüm veriler yapay zeka tarafından gerçek zamanlı analiz edilmektedir.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="homework">
                                    <Card className="rounded-3xl border-none shadow-sm">
                                        <CardHeader>
                                            <CardTitle className="font-bold flex items-center gap-2">
                                                <BookOpen className="w-5 h-5 text-primary" />
                                                Ödev Takip Sistemi
                                            </CardTitle>
                                            <CardDescription>Öğretmenler tarafından atanan ödevler ve durumları</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {assignments.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                                        <BookOpen className="w-8 h-8 text-muted-foreground/30" />
                                                    </div>
                                                    <p className="text-muted-foreground italic text-sm max-w-xs px-6">
                                                        Henüz atanmış ödev bulunmuyor.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {assignments.map((assignment) => (
                                                        <div key={assignment.id} className="p-5 rounded-2xl border bg-card hover:shadow-md transition-all">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div className="flex-1">
                                                                    <h4 className="font-bold text-base mb-1">{assignment.title}</h4>
                                                                    <p className="text-sm text-muted-foreground line-clamp-2">{assignment.description}</p>
                                                                </div>
                                                                <Badge
                                                                    variant={
                                                                        assignment.status === 'graded' ? 'default' :
                                                                            assignment.status === 'submitted' ? 'secondary' :
                                                                                'outline'
                                                                    }
                                                                    className="ml-3"
                                                                >
                                                                    {assignment.status === 'graded' ? '✅ Notlandı' :
                                                                        assignment.status === 'submitted' ? '📝 Gönderildi' :
                                                                            '⏳ Bekliyor'}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    Son Tarih: {format(new Date(assignment.due_date), 'dd MMM yyyy', { locale: tr })}
                                                                </div>
                                                                {assignment.submitted_at && (
                                                                    <div className="flex items-center gap-1">
                                                                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                                                                        Teslim: {format(new Date(assignment.submitted_at), 'dd MMM HH:mm', { locale: tr })}
                                                                    </div>
                                                                )}
                                                                {assignment.grade !== null && assignment.grade !== undefined && (
                                                                    <div className="flex items-center gap-1 font-bold text-primary">
                                                                        <Award className="w-3 h-3" />
                                                                        Not: {assignment.grade}/100
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {assignment.feedback && (
                                                                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                                                    <p className="text-xs font-semibold text-muted-foreground mb-1">Öğretmen Geri Bildirimi:</p>
                                                                    <p className="text-sm">{assignment.feedback}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

```

### src\pages\Premium.tsx
```
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

const plans = [
    {
        name: "Başlangıç",
        price: "0",
        period: "/ay",
        description: "Ödevlere giriş yapmak için ideal.",
        features: [
            "Günde 3 soru sorma hakkı",
            "Temel AI Asistan",
            "Reklamlı deneyim",
            "Standart destek"
        ],
        icon: Zap,
        color: "from-gray-400 to-gray-600",
        buttonVariant: "outline" as const,
        popular: false
    },
    {
        name: "Süper Öğrenci",
        price: "149",
        period: "/ay",
        description: "En popüler seçim. Başarını katla!",
        features: [
            "Sınırsız soru sorma hakkı",
            "Gelişmiş AI (Llama-3 Pro)",
            "Adım adım detaylı çözümler",
            "Haftada 5 Öğretmen Sorusu",
            "Reklamsız deneyim",
            "Öncelikli destek"
        ],
        icon: Sparkles,
        color: "from-primary to-accent",
        buttonVariant: "default" as const,
        popular: true
    },
    {
        name: "VIP Koçluk",
        price: "499",
        period: "/ay",
        description: "Sınavlara hazırlananlar için özel.",
        features: [
            "Her şey sınırsız",
            "7/24 Canlı Öğretmen Desteği",
            "Kişiye özel çalışma programı",
            "Sınav analizi ve takibi",
            "Veli bilgilendirme sistemi",
            "VIP WhatsApp hattı"
        ],
        icon: Crown,
        color: "from-yellow-400 to-amber-600",
        buttonVariant: "outline" as const,
        popular: false
    }
];

export default function Premium() {
    const { toast } = useToast();

    const handleSubscribe = (planName: string) => {
        toast({
            title: `${planName} Planı Seçildi 🚀`,
            description: "Ödeme altyapısı yakında aktif olacak. Şimdilik ücretsiz kullanabilirsin!",
        });
    };

    return (
        <div className="py-10 pb-20 space-y-10">
            <SEO title="Premium Üyelik" description="OdevGPT Premium ile sınırsız soru sorma, ileri seviye AI çözümleri ve öğretmen desteği avantajlarından yararlanın." />
            <div className="text-center space-y-4">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
                >
                    Potansiyelini Açığa Çıkar
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground max-w-md mx-auto"
                >
                    Sana en uygun planı seç, derslerde süper güce kavuş. İstediğin zaman iptal et.
                </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {plans.map((plan, index) => {
                    const Icon = plan.icon;
                    return (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className={`relative bg-card rounded-2xl border p-6 flex flex-col ${plan.popular ? "shadow-2xl scale-105 border-primary/50 ring-2 ring-primary/20 z-10" : "shadow-lg hover:border-primary/30"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-accent px-4 py-1 text-sm shadow-glow">
                                        En Popüler
                                    </Badge>
                                </div>
                            )}

                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>

                            <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
                            <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-3xl font-bold">₺{plan.price}</span>
                                <span className="text-muted-foreground">{plan.period}</span>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-foreground/80">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.buttonVariant}
                                className={`w-full py-6 rounded-xl font-semibold ${plan.popular ? "gradient-primary shadow-glow text-primary-foreground border-0" : ""
                                    }`}
                                onClick={() => handleSubscribe(plan.name)}
                            >
                                Planı Seç
                            </Button>
                        </motion.div>
                    );
                })}
            </div>

            <div className="text-center pt-8">
                <p className="text-sm text-muted-foreground">
                    Öğretmen misin? <a href="#" className="text-primary hover:underline">Öğretmen Başvuru Formu</a>
                </p>
            </div>
        </div>
    );
}

```

### src\pages\Profile.tsx
```
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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

```

### src\pages\QuestionDetail.tsx
```
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle, Share2, MessageSquare, Loader2, Volume2, StopCircle, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { askSocraticAI, getAIResponse, analyzeQuestionImage } from "@/lib/ai";
import { toast } from "sonner";
import { grantXP, XP_VALUES } from "@/lib/gamification";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import SEO from "@/components/SEO";

interface QuestionDetail {
    id: string;
    subject: string;
    question_text: string | null;
    image_url: string | null;
    status: string;
    created_at: string;
}

interface Solution {
    id: string;
    solution_text: string;
    solver_type: 'ai' | 'teacher';
    created_at: string;
}

export default function QuestionDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [question, setQuestion] = useState<QuestionDetail | null>(null);
    const [solutions, setSolutions] = useState<Solution[]>([]);
    const [loading, setLoading] = useState(true);
    const [speakingInfo, setSpeakingInfo] = useState<{ id: string, speaking: boolean } | null>(null);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [isAutoSolving, setIsAutoSolving] = useState(false);
    const autoSolveAttempted = useRef(false);
    const [similarQuestion, setSimilarQuestion] = useState<string | null>(null);
    const [isGeneratingSimilar, setIsGeneratingSimilar] = useState(false);

    // ID her değiştiğinde (yeni soruya geçildiğinde) 'çözüldü' işaretini kaldır
    useEffect(() => {
        autoSolveAttempted.current = false;
    }, [id]);

    useEffect(() => {
        async function fetchQuestionData() {
            if (!id || !user) return;
            try {
                // Soruyu çek
                const { data: qData, error: qError } = await supabase
                    .from("questions")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (qError) throw qError;
                setQuestion(qData);

                // Çözümleri çek
                const { data: sData, error: sError } = await supabase
                    .from("solutions")
                    .select("*")
                    .eq("question_id", id)
                    .order("created_at", { ascending: false });

                if (sError && sError.code !== 'PGRST116') throw sError;
                setSolutions(sData || []);

            } catch (error) {
                console.error("Detay yüklenirken hata:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchQuestionData();

        return () => {
            window.speechSynthesis.cancel();
        };
    }, [id, user]);

    // Otomatik Çözümleyici
    useEffect(() => {
        const autoSolve = async () => {
            // Guard: Döngüyü engellemek için kontrol
            if (autoSolveAttempted.current || loading || !question || solutions.length > 0 || isAutoSolving) return;

            autoSolveAttempted.current = true; // Kilidi kapat
            setIsAutoSolving(true);

            try {
                // 0. Eğer metin yoksa ama resim varsa, önce Vision ile metni çıkar
                let finalQuestionText = question.question_text || "";

                if (!finalQuestionText && question.image_url) {
                    toast.info("Görseldeki yazı yapay zeka tarafından okunuyor... 📖");
                    const publicUrl = getPublicUrl(question.image_url);
                    if (publicUrl) {
                        try {
                            const extractedText = await analyzeQuestionImage(publicUrl);
                            if (extractedText && !extractedText.startsWith("HATA:")) {
                                finalQuestionText = extractedText;
                                // Veritabanını güncelle (kalıcı hale getir)
                                await supabase.from("questions")
                                    .update({ question_text: extractedText })
                                    .eq("id", question.id);

                                // State'i güncelle ki arayüzde de görünsün
                                setQuestion(prev => prev ? { ...prev, question_text: extractedText } : prev);
                                toast.success("Metin başarıyla dijitalleştirildi! ✨");
                            }
                        } catch (visionErr) {
                            console.error("Vision OCR Error in detail:", visionErr);
                        }
                    }
                }

                toast.info("Yapay Zeka sorunu inceliyor... 🤖");

                const aiPrompt = `Öğrenci sorusu (${question.subject}): ${finalQuestionText || "Görsel soru"}. 
                Lütfen bu soruyu adım adım, açıklayıcı ve eğitici bir dille çöz. 
                Cevabı doğrudan verme, önce ipucu ver sonra çözümü anlat. Türkçe kullan.`;

                // 1. Cevabı al
                const aiResponseText = await getAIResponse([{ role: "user", content: aiPrompt }]);

                // 2. Kaydetmeyi dene
                const { data: solData, error: insertError } = await supabase.from("solutions").insert({
                    question_id: question.id,
                    solver_type: "ai",
                    solver_id: user?.id,
                    solution_text: aiResponseText
                }).select().single();

                if (insertError) {
                    console.error("Çözüm kaydedilemedi (RLS veya İzin hatası):", insertError);
                    // Kaydedilemediyse bile gösterelim (Client-side Fallback)
                    const tempSolution: Solution = {
                        id: "temp-ai-" + Date.now(),
                        solution_text: aiResponseText,
                        solver_type: "ai",
                        created_at: new Date().toISOString()
                    };
                    setSolutions([tempSolution]);
                    // Veritabanına yazılamadı uyarısı kullanıcıyı rahatsız etmemesi için kaldırıldı.
                } else {
                    // Başarılı kayıt
                    setSolutions([solData]);
                    await supabase.from("questions").update({ status: "ai_answered" }).eq("id", question.id);
                    toast.success("Çözüm hazır! 🎉");
                }

            } catch (error) {
                console.error("Auto-solve error:", error);
                toast.error("Otomatik çözüm üretilemedi.");
            } finally {
                setIsAutoSolving(false);
            }
        };

        if (!loading && question && solutions.length === 0) {
            autoSolve();
        }
    }, [question, solutions, loading, user]);

    const handleGenerateSimilarQuestion = async () => {
        if (!question) return;
        setIsGeneratingSimilar(true);
        try {
            const prompt = `Öğrencinin şu matematik sorusuna benzer, aynı konuda ve zorlukta YENİ bir pratik sorusu oluştur:
            "${question.question_text || "Görseldeki soru"}"
            
            Sadece soruyu ve şıkları yaz. Cevabı hemen verme.`;

            const response = await getAIResponse([{ role: "user", content: prompt }]);
            setSimilarQuestion(response);
            toast.success("Benzer soru hazır!");

            setTimeout(() => {
                document.getElementById("similar-q-section")?.scrollIntoView({ behavior: "smooth" });
            }, 100);

        } catch (error) {
            console.error(error);
            toast.error("Benzer soru oluşturulamadı.");
        } finally {
            setIsGeneratingSimilar(false);
        }
    };

    const handleSpeak = (text: string, solId: string) => {
        if (speakingInfo?.speaking && speakingInfo.id === solId) {
            window.speechSynthesis.cancel();
            setSpeakingInfo(null);
            return;
        }

        window.speechSynthesis.cancel(); // Öncekini durdur

        // Markdown ve LaTeX sembollerini temizle (Okurken garip durmasın)
        const cleanText = text
            .replace(/[*#_`]/g, '') // Markdown
            .replace(/\$/g, '') // LaTeX dolar işaretleri
            .replace(/\[.*?\]/g, '') // Köşeli parantez içleri (bazen link vs olur)
            .trim();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = "tr-TR";
        utterance.rate = 0.95; // Hafifçe yavaş, ders anlatır gibi
        utterance.pitch = 1.0;

        // Türkçe sesi bulmaya çalış (Google Türkçe sesi varsa harika olur)
        const voices = window.speechSynthesis.getVoices();
        const trVoice = voices.find(v => v.lang.includes('tr')) || voices.find(v => v.lang.includes('TR'));
        if (trVoice) utterance.voice = trVoice;

        utterance.onend = () => setSpeakingInfo(null);
        utterance.onerror = () => {
            setSpeakingInfo(null);
            toast.error("Sesli okuma başlatılamadı.");
        };

        setSpeakingInfo({ id: solId, speaking: true });
        window.speechSynthesis.speak(utterance);
    };

    const getPublicUrl = (path: string | null) => {
        if (!path) return null;
        return supabase.storage.from("question_images").getPublicUrl(path).data.publicUrl;
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !question || isThinking) return;

        const userMsg = inputMessage.trim();
        setInputMessage("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsThinking(true);

        try {
            const response = await askSocraticAI(userMsg, {
                question: question.question_text || "Bu bir görsel soru.",
                subject: question.subject,
                history: messages
            });

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);

            // XP Kazandır
            if (user) {
                grantXP(user.id, XP_VALUES.SOCRATIC_MESSAGE);
            }
        } catch (error) {
            console.error("Chat error:", error);
            toast.error("AI ile bağlantı kurulamadı.");
        } finally {
            setIsThinking(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!question) {
        return (
            <div className="text-center py-10">
                <p>Soru bulunamadı veya erişim yetkiniz yok.</p>
                <Button onClick={() => navigate("/dashboard/history")} variant="link">Geri Dön</Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            <SEO
                title={`${question.subject} Sorusu`}
                description={`${question.subject} dersine ait soru ve çözümü. OdevGPT ile adım adım öğrenin.`}
            />
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">Soru Detayı</h1>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="capitalize">{question.subject}</span> •
                            <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}</span>
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary" onClick={() => {
                    const shareData = {
                        title: 'OdevGPT Soru Detayı',
                        text: `Bu soruya bakar mısın? ${question.subject} dersinden bir soru.`,
                        url: window.location.href
                    };
                    if (navigator.share) {
                        navigator.share(shareData);
                    } else {
                        navigator.clipboard.writeText(window.location.href);
                        // Basit bir alert veya toast eklenebilir ama şu anlık yeterli
                    }
                }}>
                    <Share2 className="w-5 h-5" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sol: Soru */}
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-2xl p-5 border shadow-sm h-full"
                    >
                        <h2 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                            <MessageSquare className="w-5 h-5 text-primary" /> Soru İçeriği
                        </h2>

                        {question.image_url && (
                            <div className="space-y-4">
                                <div className="rounded-xl overflow-hidden border bg-muted/30 group relative">
                                    <div className="absolute top-2 left-2 z-10">
                                        <span className="bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-md font-medium uppercase tracking-wider">Orijinal Fotoğraf</span>
                                    </div>
                                    <img
                                        src={getPublicUrl(question.image_url) || ""}
                                        alt="Soru"
                                        className="w-full h-auto object-contain max-h-[350px] transition-transform duration-500 group-hover:scale-[1.02]"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-1 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
                                    <div className="pl-4 space-y-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Dijital Versiyon (AI OCR)</span>
                                        </div>
                                        <div className="text-foreground/90 leading-relaxed text-sm prose dark:prose-invert max-w-none">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkMath]}
                                                rehypePlugins={[rehypeKatex]}
                                            >
                                                {question.question_text || "*Metin çıkarılamadı*"}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!question.image_url && question.question_text && (
                            <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                {question.question_text}
                            </p>
                        )}
                    </motion.div>
                </div>

                {/* Sağ: Çözümler */}
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-2xl p-4 border shadow-sm h-full"
                    >
                        <h2 className="font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" /> Çözümler
                        </h2>

                        {solutions.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                {isAutoSolving ? (
                                    <div className="flex flex-col items-center gap-3 animate-pulse">
                                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                        <p className="font-medium text-primary">Yapay Zeka Soruyu Çözüyor...</p>
                                        <p className="text-xs">Lütfen bekleyin, öğretmeniniz çözüm hazırlıyor 🤖</p>
                                    </div>
                                ) : (
                                    <>
                                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>Henüz bir çözüm bulunmuyor.</p>
                                        <p className="text-xs mt-1">Yapay zeka veya öğretmenlerimiz sorunu inceliyor.</p>
                                        <Button
                                            className="mt-4"
                                            variant="outline"
                                            onClick={() => navigate("/dashboard/chat")}
                                        >
                                            AI Asistan'a Sor
                                        </Button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {solutions.map((sol) => (
                                    <div key={sol.id} className="relative bg-secondary/30 rounded-xl p-4 border group transition-all hover:bg-secondary/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${sol.solver_type === 'ai' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {sol.solver_type === 'ai' ? '🤖 AI Çözümü' : '👨‍🏫 Öğretmen Çözümü'}
                                            </span>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="w-8 h-8 rounded-full"
                                                    onClick={() => handleSpeak(sol.solution_text, sol.id)}
                                                >
                                                    {speakingInfo?.id === sol.id && speakingInfo?.speaking ? (
                                                        <StopCircle className="w-4 h-4 text-destructive animate-pulse" />
                                                    ) : (
                                                        <Volume2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    )}
                                                </Button>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(sol.created_at), { addSuffix: true, locale: tr })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm leading-relaxed prose dark:prose-invert max-w-none break-words">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkMath]}
                                                rehypePlugins={[rehypeKatex]}
                                                components={{
                                                    p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                                                    strong: ({ node, ...props }) => <span className="font-bold text-primary" {...props} />
                                                }}
                                            >
                                                {sol.solution_text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Sokratik Chat Bölümü */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background rounded-3xl p-6 border-2 border-indigo-100 dark:border-indigo-900 shadow-lg"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg dark:text-indigo-200">Sokratik Rehber</h2>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Cevabı bulman için sana ipuçları verir</p>
                    </div>
                </div>

                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="text-center py-10 bg-white/50 dark:bg-black/20 rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-800">
                            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-indigo-300 animate-bounce" />
                            <p className="text-sm text-indigo-600 dark:text-indigo-400 px-10">
                                Bu soruyu çözmekte zorlanıyor musun? İlk adımın ne olmalı, bana sorabilirsin!
                            </p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-white dark:bg-card border-2 border-indigo-50 dark:border-indigo-900 rounded-tl-none'
                                    }`}>
                                    <div className="text-sm leading-relaxed prose dark:prose-invert max-w-none break-words">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                    {isThinking && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-card p-4 rounded-2xl rounded-tl-none border shadow-sm">
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSendMessage} className="relative group">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="İpucu iste veya bir şeyler sor..."
                        className="w-full bg-white dark:bg-background border-2 border-indigo-100 dark:border-indigo-900 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
                    />
                    <Button
                        type="submit"
                        disabled={!inputMessage.trim() || isThinking}
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition-all group-hover:scale-105"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        onClick={() => setInputMessage("Bu soruyu çözmeye nasıl başlamalıyım?")}
                        className="text-[10px] bg-white dark:bg-card px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900 hover:bg-indigo-50 transition-colors text-indigo-600 dark:text-indigo-400"
                    >
                        🚀 Başlangıç ipucu
                    </button>
                    <button
                        onClick={() => setInputMessage("Hangi formülü kullanmalıyım?")}
                        className="text-[10px] bg-white dark:bg-card px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900 hover:bg-indigo-50 transition-colors text-indigo-600 dark:text-indigo-400"
                    >
                        📐 Formül sor
                    </button>
                </div>
            </motion.div>

            {/* Benzer Soru / Pratik Yap */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
                id="similar-q-section"
            >
                {!similarQuestion ? (
                    <Button
                        onClick={handleGenerateSimilarQuestion}
                        disabled={isGeneratingSimilar}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none"
                    >
                        {isGeneratingSimilar ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Pratik Sorusu Hazırlanıyor...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 mr-2" />
                                Benzer Soru Çöz & Pekiştir
                            </>
                        )}
                    </Button>
                ) : (
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl p-6 border-2 border-emerald-100 dark:border-emerald-900 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles className="w-32 h-32 text-emerald-500" />
                        </div>
                        <h3 className="font-bold text-lg text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Sıra Sende!
                        </h3>
                        <div className="prose dark:prose-invert max-w-none mb-4 text-emerald-900 dark:text-emerald-100">
                            <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {similarQuestion}
                            </ReactMarkdown>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                onClick={() => setSimilarQuestion(null)}
                            >
                                Yeni Soru İste
                            </Button>
                            <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => navigate("/dashboard/ask")}
                            >
                                Çözümü Gönder
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

```

### src\pages\Settings.tsx
```
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

```

### src\pages\Signup.tsx
```
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, User, GraduationCap, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

export default function Signup() {
    const { tenant } = useTenant();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState<"student" | "teacher" | "parent">("student");
    const [gradeLevel, setGradeLevel] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { signUp } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validation
        if (role === "student" && !gradeLevel) {
            setError("Lütfen sınıf seviyenizi seçin.");
            setLoading(false);
            return;
        }

        try {
            await signUp(email, password, fullName, role, tenant?.id);
            toast({
                title: "Hoş geldiniz! 🎉",
                description: "Hesabınız başarıyla oluşturuldu.",
            });

            // Role based redirect after signup
            if (role === "parent") {
                navigate("/dashboard/parent");
            } else {
                navigate("/dashboard");
            }
        } catch (err: any) {
            setError(err.message || "Kayıt olurken bir hata oluştu.");
            toast({
                title: "Hata",
                description: err.message || "Kayıt olurken bir hata oluştu.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <SEO title={tenant ? `${tenant.name} Kayıt` : "Kayıt Ol"} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                    {tenant?.logo_url ? (
                        <img src={tenant.logo_url} alt={tenant.name} className="h-10 w-auto object-contain" />
                    ) : (
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-primary-foreground" />
                        </div>
                    )}
                    <span className="text-2xl font-bold">
                        {tenant ? (
                            <span className="gradient-text uppercase">{tenant.name}</span>
                        ) : (
                            <>
                                <span className="gradient-text">Edusonex</span>{" "}
                                <span className="text-accent">ÖdevGPT</span>
                            </>
                        )}
                    </span>
                </Link>

                {/* Signup Card */}
                <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-lg)] border">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-2">Kayıt Ol</h1>
                        <p className="text-muted-foreground text-sm">
                            {tenant ? `${tenant.name} ailesine katılın` : "Ücretsiz hesap oluştur ve öğrenmeye başla"}
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2"
                        >
                            <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                            <p className="text-sm text-destructive">{error}</p>
                        </motion.div>
                    )}

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Ad Soyad</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="Adınız Soyadınız"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="pl-10"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="En az 6 karakter"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <Label>Hesap Türü</Label>
                            <RadioGroup
                                value={role}
                                onValueChange={(value: "student" | "teacher" | "parent") => setRole(value as any)}
                                className="flex flex-wrap gap-4"
                                disabled={loading}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="student" id="student" />
                                    <Label htmlFor="student" className="cursor-pointer">
                                        Öğrenci
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="teacher" id="teacher" />
                                    <Label htmlFor="teacher" className="cursor-pointer">
                                        Öğretmen
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="parent" id="parent" />
                                    <Label htmlFor="parent" className="cursor-pointer">
                                        Veli
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Grade Level (Only for students) */}
                        {role === "student" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="gradeLevel">Sınıf Seviyesi</Label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                                    <Select
                                        value={gradeLevel}
                                        onValueChange={setGradeLevel}
                                        disabled={loading}
                                    >
                                        <SelectTrigger className="pl-10">
                                            <SelectValue placeholder="Sınıfınızı seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1. Sınıf</SelectItem>
                                            <SelectItem value="2">2. Sınıf</SelectItem>
                                            <SelectItem value="3">3. Sınıf</SelectItem>
                                            <SelectItem value="4">4. Sınıf</SelectItem>
                                            <SelectItem value="5">5. Sınıf</SelectItem>
                                            <SelectItem value="6">6. Sınıf</SelectItem>
                                            <SelectItem value="7">7. Sınıf</SelectItem>
                                            <SelectItem value="8">8. Sınıf</SelectItem>
                                            <SelectItem value="9">9. Sınıf</SelectItem>
                                            <SelectItem value="10">10. Sınıf</SelectItem>
                                            <SelectItem value="11">11. Sınıf</SelectItem>
                                            <SelectItem value="12">12. Sınıf</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            className="w-full gradient-primary text-primary-foreground shadow-glow"
                            size="lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Kayıt yapılıyor...
                                </>
                            ) : (
                                "Kayıt Ol"
                            )}
                        </Button>
                    </form>

                    {/* Terms */}
                    <p className="text-xs text-muted-foreground text-center mt-4">
                        Kayıt olarak{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                            Kullanım Şartları
                        </Link>{" "}
                        ve{" "}
                        <Link to="/privacy" className="text-primary hover:underline">
                            Gizlilik Politikası
                        </Link>
                        'nı kabul etmiş olursunuz.
                    </p>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs text-muted-foreground">veya</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Zaten hesabınız var mı?{" "}
                            <Link
                                to="/login"
                                className="text-primary font-semibold hover:underline"
                            >
                                Giriş Yap
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ← Ana Sayfaya Dön
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

```

### src\pages\TeacherPanel.tsx
```
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Edit3,
  Send,
  Sparkles,
  Clock,
  Loader2,
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  Plus,
  MoreVertical,
  Search,
  School,
  X,
  Palette,
  CheckCircle,
  HelpCircle,
  Bell,
  Brain,
  Megaphone
} from "lucide-react";
import SEO from "@/components/SEO";
import ClassInsightsPanel from "@/components/ClassInsightsPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Question {
  id: string;
  subject: string;
  question_text: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
  student_id: string;
  profiles: { full_name: string } | null;
}

interface ClassItem {
  id: string;
  name: string;
  description: string | null;
  schedule: string | null;
  color: string;
  invite_code: string;
  student_count?: number;
}

interface StudentItem {
  student_id: string;
  full_name: string | null;
  avatar_url: string | null;
  class_name: string;
  joined_at: string;
}

// Mock Data for Dashboard
const weeklyStats = [
  { name: 'Pts', soru: 4 },
  { name: 'Sal', soru: 7 },
  { name: 'Çar', soru: 5 },
  { name: 'Per', soru: 9 },
  { name: 'Cum', soru: 12 },
  { name: 'Cmt', soru: 8 },
  { name: 'Paz', soru: 6 },
  { name: 'Pzt', soru: 10 }
];

export default function TeacherPanel() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [allStudents, setAllStudents] = useState<StudentItem[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [solutionText, setSolutionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, profile } = useAuth();
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  // New Class Form State
  const [isNewClassOpen, setIsNewClassOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassSchedule, setNewClassSchedule] = useState("");
  const [newClassColor, setNewClassColor] = useState("blue");

  // AI Announcement States
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementDraft, setAnnouncementDraft] = useState("");
  const [isEnhancingAnnouncement, setIsEnhancingAnnouncement] = useState(false);
  const [targetClassId, setTargetClassId] = useState<string>("all");

  // Taslakları Yükle (Ototropik State)
  useEffect(() => {
    const savedAnnDraft = localStorage.getItem("teacher_announcement_draft");
    const savedSolDraft = localStorage.getItem("teacher_solution_draft");
    if (savedAnnDraft) setAnnouncementDraft(savedAnnDraft);
    if (savedSolDraft) setSolutionText(savedSolDraft);
  }, []);

  // Taslakları Kaydet
  useEffect(() => {
    localStorage.setItem("teacher_announcement_draft", announcementDraft);
  }, [announcementDraft]);

  useEffect(() => {
    localStorage.setItem("teacher_solution_draft", solutionText);
  }, [solutionText]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, tenant]); // User veya tenant değiştiğinde (oturum tazelendiğinde) verileri tekrar çek

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchQuestions(), fetchClassesAndStudents()]);
    setLoading(false);
  };

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select(`*, profiles:student_id (full_name)`)
        .in('status', ['pending', 'ai_answered', 'teacher_review'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      const formattedData = data?.map(q => ({
        ...q,
        profiles: Array.isArray(q.profiles) ? q.profiles[0] : q.profiles
      })) as Question[];
      setQuestions(formattedData || []);
    } catch (error) {
      console.error("Sorular yüklenirken hata:", error);
    }
  };

  const fetchClassesAndStudents = async () => {
    try {
      // 1. Fetch Classes
      const { data: clsData, error: clsError } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });

      if (clsError) throw clsError;
      setClasses(clsData || []);

      if (!clsData || clsData.length === 0) {
        setAllStudents([]);
        return;
      }

      // 2. Fetch Students for these classes
      const classIds = clsData.map(c => c.id);
      const { data: stuData, error: stuError } = await supabase
        .from('class_students')
        .select(`
            student_id,
            joined_at,
            class_id,
            profiles:student_id (full_name, avatar_url),
            classes:class_id (name)
        `)
        .in('class_id', classIds);

      if (stuError) throw stuError;

      const formattedStudents = stuData?.map((s: any) => ({
        student_id: s.student_id,
        full_name: s.profiles?.full_name || "İsimsiz Öğrenci",
        avatar_url: s.profiles?.avatar_url,
        class_name: s.classes?.name || "Bilinmeyen Sınıf",
        joined_at: s.joined_at
      }));

      setAllStudents(formattedStudents || []);

    } catch (error) {
      console.error("Sınıflar yüklenirken hata:", error);
    }
  }

  const handleCreateClass = async () => {
    if (!newClassName.trim() || !user) return;

    // Generate random 6-char code: X9A2B1
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      const { error } = await supabase.from('classes').insert({
        teacher_id: user.id,
        name: newClassName,
        schedule: newClassSchedule,
        color: newClassColor,
        invite_code: generatedCode
      });

      if (error) throw error;

      toast({
        title: "Sınıf Oluşturuldu! 🎉",
        description: `${newClassName} sınıfı eklendi. Davet Kodu: ${generatedCode}`
      });
      setIsNewClassOpen(false);
      setNewClassName("");
      setNewClassSchedule("");
      fetchClassesAndStudents(); // Listeyi güncelle

    } catch (error: any) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  }

  const handleDeleteClass = async (classId: string) => {
    if (!confirm("Bu sınıfı silmek istediğinize emin misiniz?")) return;
    try {
      const { error } = await supabase.from('classes').delete().eq('id', classId);
      if (error) throw error;
      toast({ title: "Sınıf Silindi", description: "Sınıf başarıyla kaldırıldı." });
      fetchClassesAndStudents();
    } catch (error: any) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  }

  const handleSubmitSolution = async () => {
    if (!selectedQuestionId || !solutionText.trim() || !user) return;
    setSubmitting(true);
    try {
      const { error: solError } = await supabase.from("solutions").insert({
        question_id: selectedQuestionId,
        solver_type: "teacher",
        solver_id: user.id,
        solution_text: solutionText,
        is_approved: true
      });
      if (solError) throw solError;
      await supabase.from("questions").update({ status: "completed" }).eq("id", selectedQuestionId);
      toast({ title: "Çözüm Gönderildi! 🎉", description: "Eline sağlık hocam." });
      setSolutionText("");
      localStorage.removeItem("teacher_solution_draft");
      setSelectedQuestionId(null);
      fetchQuestions();
    } catch (error: any) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const enhanceAnnouncement = async () => {
    if (!announcementDraft) return;
    setIsEnhancingAnnouncement(true);
    try {
      const { askAI } = await import("@/lib/ai");
      const prompt = `
        Aşağıdaki taslak duyuruyu daha profesyonel, nazik ve net bir eğitim duyurusu haline getir.
        Öğrenci ve veliler tarafından okunacak. Duyuru çok uzun olmasın (max 100 kelime).
        Taslak: ${announcementDraft}
      `;
      const response = await askAI(prompt, "Sen bir okul müdürü ve iletişim uzmanısın. Net ve motive edici duyurular yazarsın.");
      setAnnouncementContent(response);
      toast({ title: "AI Duyuruyu Hazırladı! ✨", description: "Duyuru metni güncellendi." });
    } catch (err) {
      toast({ title: "Hata", description: "AI duyuru oluşturamadı.", variant: "destructive" });
    } finally {
      setIsEnhancingAnnouncement(false);
    }
  };

  const handlePostAnnouncement = async () => {
    if (!announcementContent || !user) return;
    try {
      const { error } = await supabase.from('announcements').insert({
        title: announcementContent.split('\n')[0].substring(0, 50) + "...",
        content: announcementContent,
        class_id: targetClassId === "all" ? null : targetClassId,
        teacher_id: user.id,
        is_global: targetClassId === "all"
      });
      if (error) throw error;
      toast({ title: "Duyuru Yayınlandı! 📢", description: "Tüm sınıfa bildirim gönderildi." });
      setIsAnnouncementOpen(false);
      setAnnouncementContent("");
      setAnnouncementDraft("");
      localStorage.removeItem("teacher_announcement_draft");
    } catch (err: any) {
      toast({ title: "Hata", description: err.message, variant: "destructive" });
    }
  };

  const getPublicUrl = (path: string | null) => {
    if (!path) return null;
    return supabase.storage.from("question_images").getPublicUrl(path).data.publicUrl;
  };

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  const getClassColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'green': return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      case 'purple': return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      case 'orange': return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <SEO title="Eğitmen Paneli" />
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            {tenant?.logo_url ? (
              <img src={tenant.logo_url} alt={tenant.name} className="h-7 w-auto object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
            <span className="text-lg font-bold">
              {tenant ? (
                <span className="gradient-text uppercase">{tenant.name}</span>
              ) : (
                <>
                  <span className="text-primary">Eğitim</span>
                  <span className="text-gray-900">Paneli</span>
                </>
              )}
            </span>
            <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700 hover:bg-purple-200">Eğitmen</Badge>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border shadow-sm">
              <Avatar className="w-6 h-6">
                <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                <AvatarFallback>{profile?.full_name?.charAt(0) || 'T'}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{profile?.full_name || 'Eğitmen'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6 px-4 max-w-7xl mx-auto">
        <Tabs defaultValue="dashboard" className="space-y-6" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            <TabsList className="bg-white border shadow-sm p-1 rounded-xl h-12">
              <TabsTrigger value="dashboard" className="rounded-lg gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <LayoutDashboard className="w-4 h-4" /> Genel Bakış
              </TabsTrigger>
              <TabsTrigger value="questions" className="rounded-lg gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <ClipboardList className="w-4 h-4" /> Soru Havuzu
                {questions.length > 0 && <span className="ml-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">{questions.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="classes" className="rounded-lg gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <BookOpen className="w-4 h-4" /> Sınıflarım
              </TabsTrigger>
              <TabsTrigger value="insights" className="rounded-lg gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Brain className="w-4 h-4" /> Sınıf Analizi
              </TabsTrigger>
              <TabsTrigger value="students" className="rounded-lg gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Users className="w-4 h-4" /> Öğrenciler
              </TabsTrigger>
              <TabsTrigger value="messages" className="rounded-lg gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <MessageSquare className="w-4 h-4" /> Mesajlar
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 ml-auto">
              {/* AI Duyuru Butonu */}
              <Dialog open={isAnnouncementOpen} onOpenChange={setIsAnnouncementOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-primary/20 text-primary hover:bg-primary/5 bg-white">
                    <Megaphone className="w-4 h-4" /> AI Duyuru
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-black">
                      <Sparkles className="w-6 h-6 text-primary" /> AI Duyuru Asistanı
                    </DialogTitle>
                    <DialogDescription>
                      Taslak notlarınızı girin, AI sizin için profesyonel bir içerik hazırlasın.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label className="font-bold">Hangi Sınıfa?</Label>
                      <Select value={targetClassId} onValueChange={setTargetClassId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sınıf seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tüm Sınıflarım</SelectItem>
                          {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Notlarınız</Label>
                      <Textarea
                        placeholder="Örn: sınav çarşambaya ertelendi, herkes hazırlıklı gelsin."
                        value={announcementDraft}
                        onChange={(e) => setAnnouncementDraft(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button
                        onClick={enhanceAnnouncement}
                        disabled={isEnhancingAnnouncement || !announcementDraft}
                        variant="secondary"
                        className="w-full gap-2 text-xs h-9 bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {isEnhancingAnnouncement ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        AI ile Zenginleştir
                      </Button>
                    </div>
                    {announcementContent && (
                      <div className="space-y-2 pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-300">
                        <Label className="font-bold">Yayınlanacak Metin</Label>
                        <Textarea
                          className="min-h-[120px] text-sm leading-relaxed"
                          value={announcementContent}
                          onChange={(e) => setAnnouncementContent(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button onClick={handlePostAnnouncement} disabled={!announcementContent} className="w-full bg-primary hover:bg-primary/90">Duyuruyu Paylaş</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {activeTab === 'classes' && (
                <Dialog open={isNewClassOpen} onOpenChange={setIsNewClassOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2 bg-primary text-white hover:bg-primary/90">
                      <Plus className="w-4 h-4" /> Yeni Sınıf
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Yeni Sınıf Oluştur</DialogTitle>
                      <DialogDescription>
                        Sınıf bilgilerini girerek yeni bir ders grubu oluşturun.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-right">Sınıf Adı</Label>
                        <Input id="name" placeholder="Örn: 10-A Matematik" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} className="col-span-3" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="schedule" className="text-right">Ders Saati (Opsiyonel)</Label>
                        <Input id="schedule" placeholder="Örn: Pazartesi 09:00" value={newClassSchedule} onChange={(e) => setNewClassSchedule(e.target.value)} className="col-span-3" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color" className="text-right">Renk Teması</Label>
                        <Select value={newClassColor} onValueChange={setNewClassColor}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Bir renk seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blue"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Mavi</div></SelectItem>
                            <SelectItem value="green"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div>Yeşil</div></SelectItem>
                            <SelectItem value="purple"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div>Mor</div></SelectItem>
                            <SelectItem value="orange"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div>Turuncu</div></SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleCreateClass}>Oluştur</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* DASHBOARD TAB */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Soru</CardTitle>
                  <HelpCircle className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{questions.length + 15}</div>
                  <p className="text-xs text-muted-foreground mt-1">Bu dönem sorulan</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Bekleyen Sorular</CardTitle>
                  <ClipboardList className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{questions.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Cevaplanmayı bekleyen</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Çözülen Soru</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-muted-foreground mt-1 text-green-600">Başarıyla yanıtlananlar</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Sınıflarım</CardTitle>
                  <BookOpen className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{classes.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Aktif şube</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
              <Card className="col-span-4 shadow-sm">
                <CardHeader>
                  <CardTitle>Haftalık Performans</CardTitle>
                  <CardDescription>Soru çözüm grafiği</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyStats}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="soru" name="Gelen Soru" fill="#adfa1d" radius={[4, 4, 0, 0]} className="fill-primary" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-3 shadow-sm">
                <CardHeader>
                  <CardTitle>Son Sınıf Aktiviteleri</CardTitle>
                  <CardDescription>Oluşturulan son sınıflar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {classes.slice(0, 4).map((cls, i) => (
                      <div key={cls.id} className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white ${cls.color === 'blue' ? 'bg-blue-500' : cls.color === 'green' ? 'bg-green-500' : cls.color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'}`}>
                          {cls.name.charAt(0)}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{cls.name}</p>
                          <p className="text-xs text-muted-foreground">{cls.schedule || "Saat belirtilmedi"}</p>
                        </div>
                      </div>
                    ))}
                    {classes.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Henüz hiç sınıf oluşturmadınız.</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* QUESTIONS TAB */}
          <TabsContent value="questions" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
              {/* Question List */}
              <div className="lg:col-span-1 border rounded-2xl bg-white overflow-hidden flex flex-col h-full shadow-sm">
                <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                  <h2 className="font-semibold flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-primary" /> Bekleyenler
                  </h2>
                  <Badge variant="outline" className="bg-white">{questions.length}</Badge>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {questions.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground opacity-60">
                      <ClipboardList className="w-12 h-12 mx-auto mb-2" />
                      <p>Bekleyen soru yok.</p>
                    </div>
                  ) : (
                    questions.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => setSelectedQuestionId(q.id)}
                        className={`rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${selectedQuestionId === q.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "bg-white hover:border-blue-200"}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary" className="text-[10px]">{q.subject}</Badge>
                          <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(q.created_at), { addSuffix: true, locale: tr })}</span>
                        </div>
                        <p className="text-sm font-medium line-clamp-2 text-gray-800">{q.question_text || "Görsel içerikli soru"}</p>
                        <div className="mt-2 pt-2 border-t border-dashed flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" /> {q.profiles?.full_name || "Öğrenci"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Detail Area */}
              <div className="lg:col-span-2 flex flex-col h-full bg-white rounded-2xl border shadow-sm overflow-hidden">
                {selectedQuestion ? (
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{selectedQuestion.subject} Sorusu</h3>
                          <Badge variant={selectedQuestion.status === 'pending' ? 'destructive' : 'default'} className="uppercase text-[10px]">
                            {selectedQuestion.status === 'pending' ? 'Bekliyor' : selectedQuestion.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Öğrenci: {selectedQuestion.profiles?.full_name}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedQuestionId(null)}>Kapat</Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="space-y-6">
                        {/* Soru İçeriği */}
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                          {selectedQuestion.image_url && (
                            <img src={getPublicUrl(selectedQuestion.image_url) || ""} className="max-h-[300px] rounded-lg mb-4 border bg-white" />
                          )}
                          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{selectedQuestion.question_text}</p>
                        </div>

                        {/* Çözüm Alanı */}
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Edit3 className="w-4 h-4 text-green-600" /> Çözümünüz
                          </h4>
                          <Textarea
                            placeholder="Çözümü buraya yazın... Yazdıktan sonra gönder butonu aktifleşecektir."
                            value={solutionText}
                            onChange={(e) => setSolutionText(e.target.value)}
                            className="min-h-[200px] p-4 text-base bg-white border-2 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setSelectedQuestionId(null)}>Vazgeç</Button>
                      <Button onClick={handleSubmitSolution} disabled={submitting || !solutionText.trim()} className="bg-green-600 hover:bg-green-700">
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />} Çözümü Gönder
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <ClipboardList className="w-10 h-10 opacity-20" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Bir soru seçin</h3>
                    <p className="max-w-xs mx-auto">Listeden bir soru seçerek detayları görebilir ve çözüm yazabilirsiniz.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* CLASSES TAB */}
          <TabsContent value="classes" className="space-y-6">
            {classes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <School className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Henüz Sınıfınız Yok</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  Öğrencilerinizi yönetmek ve ders programınızı oluşturmak için ilk sınıfınızı ekleyin.
                </p>
                <Button onClick={() => setIsNewClassOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> İlk Sınıfı Oluştur
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                  <Link key={cls.id} to={`/teacher/class/${cls.id}`} className="block">
                    <Card className="group hover:shadow-lg transition-all cursor-pointer border-t-4 bg-white" style={{ borderTopColor: cls.color === 'blue' ? '#3b82f6' : cls.color === 'green' ? '#22c55e' : cls.color === 'purple' ? '#a855f7' : '#f97316' }}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col gap-2">
                            <Badge variant="outline" className={`border-0 w-fit ${getClassColorClasses(cls.color)}`}>{(cls.student_count || 0)} Öğrenci</Badge>
                            <div
                              className="flex items-center gap-2 text-xs font-mono bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 border transition-colors group/code"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigator.clipboard.writeText(cls.invite_code);
                                toast({ description: "Davet kodu kopyalandı! 📋" });
                              }}
                              title="Kodu Kopyala"
                            >
                              <span className="text-gray-500 font-semibold">KOD:</span>
                              <span className="font-bold text-gray-900 tracking-wider">{cls.invite_code}</span>
                              <ClipboardList className="w-3 h-3 text-gray-400 group-hover/code:text-primary transition-colors" />
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(cls.invite_code);
                                toast({ description: "Kod kopyalandı: " + cls.invite_code });
                              }}>
                                Kodu Kopyala
                              </DropdownMenuItem>
                              <DropdownMenuItem>Düzenle</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClass(cls.id);
                              }}>Sil</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardTitle className="mt-2 text-xl">{cls.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> {cls.schedule || "Saat Belirtilmedi"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent p-0>
                        <div className="flex -space-x-2 overflow-hidden py-2 px-6 min-h-[40px]">
                          {allStudents
                            .filter(s => s.class_name === cls.name) // name üzerinden eşleştirme çok sağlıklı değil ama elimizdeki veriye göre en hızlı yol
                            .slice(0, 5)
                            .map((s, i) => (
                              <Avatar key={i} className="w-8 h-8 border-2 border-white ring-1 ring-gray-100">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.student_id}`} />
                                <AvatarFallback className="text-[10px] bg-gray-100 text-gray-500">{s.full_name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))
                          }
                          {allStudents.filter(s => s.class_name === cls.name).length > 5 && (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-gray-100 text-[10px] font-medium text-gray-500">
                              +{allStudents.filter(s => s.class_name === cls.name).length - 5}
                            </div>
                          )}
                        </div>
                        <div className="p-6 pt-0">
                          <Button className="w-full mt-4" variant="outline">Sınıfa Git</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}

                <Button variant="outline" className="h-auto min-h-[200px] flex flex-col gap-4 border-dashed border-2 hover:border-primary hover:bg-primary/5" onClick={() => setIsNewClassOpen(true)}>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-semibold text-lg">Yeni Sınıf Ekle</span>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* CLASS INSIGHTS TAB */}
          <TabsContent value="insights" className="space-y-6">
            {classes.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Brain className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Sınıf Analizi İçin Sınıf Gerekli</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                    AI destekli sınıf analizi yapabilmek için önce bir sınıf oluşturmalısınız.
                  </p>
                  <Button onClick={() => setIsNewClassOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Sınıf Oluştur
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <ClassInsightsPanel
                classId={classes[0].id}
                className={classes[0].name}
              />
            )}
          </TabsContent>

          {/* STUDENTS TAB */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Öğrenci Listesi</CardTitle>
                    <CardDescription>Tüm sınıflarınızdaki kayıtlı öğrenciler ({allStudents.length})</CardDescription>
                  </div>
                  <div className="relative w-64 hidden md:block">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Öğrenci ara..." className="pl-9" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {allStudents.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Henüz kayıtlı öğrenciniz bulunmuyor.</p>
                    <p className="text-sm mt-1">Sınıflarınızın davet kodlarını paylaşarak öğrencilerinizi sisteme dahil edebilirsiniz.</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm text-muted-foreground">
                      <div className="col-span-4">Öğrenci Adı</div>
                      <div className="col-span-4">Kayıtlı Olduğu Sınıf</div>
                      <div className="col-span-4 text-right">Katılım Tarihi</div>
                    </div>
                    {allStudents.map((stu, i) => (
                      <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors border-b last:border-0 text-sm">
                        <div className="col-span-4 flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stu.student_id}`} />
                            <AvatarFallback>{stu.full_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{stu.full_name}</span>
                        </div>
                        <div className="col-span-4">
                          <Badge variant="outline" className="font-normal">{stu.class_name}</Badge>
                        </div>
                        <div className="col-span-4 text-right text-muted-foreground">
                          {new Date(stu.joined_at).toLocaleDateString("tr-TR")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* MESSAGES TAB - Placeholder */}
          <TabsContent value="messages" className="space-y-6">
            <div className="text-center py-20 bg-white border border-dashed rounded-2xl">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-700">Yakında Geliyor</h3>
              <p className="text-muted-foreground">Mesajlaşma özelliği geliştirme aşamasındadır.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

```

### src\test\example.test.ts
```
import { describe, it, expect } from "vitest";

describe("example", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});

```

### src\test\setup.ts
```
import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

```

### src\components\ui\accordion.tsx
```
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

```

### src\components\ui\alert-dialog.tsx
```
import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};

```

### src\components\ui\alert.tsx
```
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };

```

### src\components\ui\aspect-ratio.tsx
```
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };

```

### src\components\ui\avatar.tsx
```
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };

```

### src\components\ui\badge.tsx
```
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

```

### src\components\ui\breadcrumb.tsx
```
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
  ),
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return <Comp ref={ref} className={cn("transition-colors hover:text-foreground", className)} {...props} />;
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  ),
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => (
  <li role="presentation" aria-hidden="true" className={cn("[&>svg]:size-3.5", className)} {...props}>
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};

```

### src\components\ui\button.tsx
```
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

```

### src\components\ui\calendar.tsx
```
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

```

### src\components\ui\card.tsx
```
import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

```

### src\components\ui\carousel.tsx
```
import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  ({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)}
          {...props}
        />
      </div>
    );
  },
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel();

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)}
        {...props}
      />
    );
  },
);
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  },
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  },
);
CarouselNext.displayName = "CarouselNext";

export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };

```

### src\components\ui\chart.tsx
```
import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> });
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([_, config]) => config.theme || config.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: "line" | "dot" | "dashed";
      nameKey?: string;
      labelKey?: string;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item.dataKey || item.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>;
      }

      if (!value) {
        return null;
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>;
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className,
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center",
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn("shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]", {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          })}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center",
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">{itemConfig?.label || item.name}</span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = "ChartTooltip";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean;
      nameKey?: string;
    }
>(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value}
            className={cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegend";

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle };

```

### src\components\ui\checkbox.tsx
```
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };

```

### src\components\ui\collapsible.tsx
```
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };

```

### src\components\ui\command.tsx
```
import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator ref={ref} className={cn("-mx-1 h-px bg-border", className)} {...props} />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};

```

### src\components\ui\context-menu.tsx
```
import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const ContextMenu = ContextMenuPrimitive.Root;

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

const ContextMenuGroup = ContextMenuPrimitive.Group;

const ContextMenuPortal = ContextMenuPrimitive.Portal;

const ContextMenuSub = ContextMenuPrimitive.Sub;

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold text-foreground", inset && "pl-8", className)}
    {...props}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};

```

### src\components\ui\dialog.tsx
```
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

```

### src\components\ui\drawer.tsx
```
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

const Drawer = ({ shouldScaleBackground = true, ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/80", className)} {...props} />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};

```

### src\components\ui\dropdown-menu.tsx
```
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent focus:bg-accent",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />;
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};

```

### src\components\ui\form.tsx
```
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return <Label ref={ref} className={cn(error && "text-destructive", className)} htmlFor={formItemId} {...props} />;
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
        aria-invalid={!!error}
        {...props}
      />
    );
  },
);
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return <p ref={ref} id={formDescriptionId} className={cn("text-sm text-muted-foreground", className)} {...props} />;
  },
);
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <p ref={ref} id={formMessageId} className={cn("text-sm font-medium text-destructive", className)} {...props}>
        {body}
      </p>
    );
  },
);
FormMessage.displayName = "FormMessage";

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };

```

### src\components\ui\hover-card.tsx
```
import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "@/lib/utils";

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };

```

### src\components\ui\input-otp.tsx
```
import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";

import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, React.ComponentPropsWithoutRef<typeof OTPInput>>(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  ),
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center", className)} {...props} />,
);
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ ...props }, ref) => (
    <div ref={ref} role="separator" {...props}>
      <Dot />
    </div>
  ),
);
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };

```

### src\components\ui\input.tsx
```
import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };

```

### src\components\ui\label.tsx
```
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };

```

### src\components\ui\menubar.tsx
```
import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const MenubarMenu = MenubarPrimitive.Menu;

const MenubarGroup = MenubarPrimitive.Group;

const MenubarPortal = MenubarPrimitive.Portal;

const MenubarSub = MenubarPrimitive.Sub;

const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn("flex h-10 items-center space-x-1 rounded-md border bg-background p-1", className)}
    {...props}
  />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </MenubarPrimitive.Portal>
));
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
};
MenubarShortcut.displayname = "MenubarShortcut";

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};

```

### src\components\ui\navigation-menu.tsx
```
import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
);

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
      className,
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};

```

### src\components\ui\pagination.tsx
```
import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  ),
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to previous page" size="default" className={cn("gap-1 pl-2.5", className)} {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to next page" size="default" className={cn("gap-1 pr-2.5", className)} {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span aria-hidden className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};

```

### src\components\ui\popover.tsx
```
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };

```

### src\components\ui\progress.tsx
```
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
  }
>(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName)}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

```

### src\components\ui\radio-group.tsx
```
import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };

```

### src\components\ui\resizable.tsx
```
import { GripVertical } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
    {...props}
  />
);

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };

```

### src\components\ui\scroll-area.tsx
```
import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    viewportRef?: React.Ref<HTMLDivElement>;
  }
>(({ className, children, viewportRef, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
    <ScrollAreaPrimitive.Viewport ref={viewportRef} className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };

```

### src\components\ui\select.tsx
```
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};

```

### src\components\ui\separator.tsx
```
import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className)}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };

```

### src\components\ui\sheet.tsx
```
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
        {children}
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};

```

### src\components\ui\sidebar.tsx
```
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className)}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        className={cn("flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      ref={ref}
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          "relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
        )}
      />
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
        >
          {children}
        </div>
      </div>
    </div>
  );
});
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentProps<typeof Button>>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <Button
        ref={ref}
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", className)}
        onClick={(event) => {
          onClick?.(event);
          toggleSidebar();
        }}
        {...props}
      >
        <PanelLeft />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    );
  },
);
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <button
        ref={ref}
        data-sidebar="rail"
        aria-label="Toggle Sidebar"
        tabIndex={-1}
        onClick={toggleSidebar}
        title="Toggle Sidebar"
        className={cn(
          "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] group-data-[side=left]:-right-4 group-data-[side=right]:left-0 hover:after:bg-sidebar-border sm:flex",
          "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
          "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
          "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarRail.displayName = "SidebarRail";

const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<"main">>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className,
      )}
      {...props}
    />
  );
});
SidebarInset.displayName = "SidebarInset";

const SidebarInput = React.forwardRef<React.ElementRef<typeof Input>, React.ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        data-sidebar="input"
        className={cn(
          "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarInput.displayName = "SidebarInput";

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} data-sidebar="header" className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
});
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} data-sidebar="footer" className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
});
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator = React.forwardRef<React.ElementRef<typeof Separator>, React.ComponentProps<typeof Separator>>(
  ({ className, ...props }, ref) => {
    return (
      <Separator
        ref={ref}
        data-sidebar="separator"
        className={cn("mx-2 w-auto bg-sidebar-border", className)}
        {...props}
      />
    );
  },
);
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
});
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { asChild?: boolean }>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        data-sidebar="group-label"
        className={cn(
          "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupAction = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button"> & { asChild?: boolean }>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-sidebar="group-action"
        className={cn(
          "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          // Increases the hit area of the button on mobile.
          "after:absolute after:-inset-2 after:md:hidden",
          "group-data-[collapsible=icon]:hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-sidebar="group-content" className={cn("w-full text-sm", className)} {...props} />
  ),
);
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(({ className, ...props }, ref) => (
  <ul ref={ref} data-sidebar="menu" className={cn("flex w-full min-w-0 flex-col gap-1", className)} {...props} />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  <li ref={ref} data-sidebar="menu-item" className={cn("group/menu-item relative", className)} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center" hidden={state !== "collapsed" || isMobile} {...tooltip} />
    </Tooltip>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    showOnHover?: boolean;
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean;
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />}
      <Skeleton
        className="h-4 max-w-[--skeleton-width] flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ ...props }, ref) => (
  <li ref={ref} {...props} />
));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean;
    size?: "sm" | "md";
    isActive?: boolean;
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};

```

### src\components\ui\skeleton.tsx
```
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };

```

### src\components\ui\slider.tsx
```
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

```

### src\components\ui\sonner.tsx
```
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };

```

### src\components\ui\switch.tsx
```
import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

```

### src\components\ui\table.tsx
```
import * as React from "react";

import { cn } from "@/lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />,
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
  ),
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50", className)}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
  ),
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  ),
);
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };

```

### src\components\ui\tabs.tsx
```
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };

```

### src\components\ui\textarea.tsx
```
import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };

```

### src\components\ui\toast.tsx
```
import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />;
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};

```

### src\components\ui\toaster.tsx
```
import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

```

### src\components\ui\toggle-group.tsx
```
import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
});

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root ref={ref} className={cn("flex items-center justify-center gap-1", className)} {...props}>
    <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };

```

### src\components\ui\toggle.tsx
```
import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };

```

### src\components\ui\tooltip.tsx
```
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

```

### src\components\ui\use-toast.ts
```
import { useToast, toast } from "@/hooks/use-toast";

export { useToast, toast };

```