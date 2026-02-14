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
