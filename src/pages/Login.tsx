import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-bold">
                        <span className="gradient-text">Edusonex</span>{" "}
                        <span className="text-accent">ÖdevGPT</span>
                    </span>
                </Link>

                {/* Login Card */}
                <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-lg)] border">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-2">Giriş Yap</h1>
                        <p className="text-muted-foreground text-sm">
                            Hesabınıza giriş yapın ve öğrenmeye devam edin
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
