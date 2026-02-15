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
