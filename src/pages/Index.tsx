import { motion } from "framer-motion";
import { Camera, ArrowRight, Sparkles, Brain, UserCheck, Star, Shield, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-illustration.png";
import LandingDemo from "@/components/LandingDemo";

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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">
              <span className="gradient-text">ODEV</span>
              <span className="text-accent">GPT</span>
            </span>
          </Link>
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

      {/* Interactive Demo */}
      <LandingDemo />

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-card/50 border-y border-border/50">
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

      {/* Subjects */}
      <section className="py-16 md:py-24 overflow-hidden">
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

      {/* Footer */}
      <footer className="py-12 border-t bg-card/30">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8 text-sm text-muted-foreground">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">ODEVGPT</span>
            </div>
            <p className="max-w-xs text-center md:text-left">Türkiye'nin en gelişmiş yapay zeka destekli eğitim asistanı.</p>
          </div>

          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Hakkımızda</a>
            <a href="#" className="hover:text-primary transition-colors">Öğretmenler</a>
            <a href="#" className="hover:text-primary transition-colors">Blog</a>
            <a href="#" className="hover:text-primary transition-colors">İletişim</a>
          </div>

          <p>© 2026 ODEVGPT. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
