import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sparkles, Mail, Lock, User, GraduationCap, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import SEO from "@/components/SEO";

export default function Signup() {
    const { tenant } = useTenant();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const refCode = query.get('ref');
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

            // Handle Referral if code exists
            if (refCode) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase.rpc('process_referral', {
                        p_user_id: user.id,
                        p_code: refCode
                    });
                }
            }

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
