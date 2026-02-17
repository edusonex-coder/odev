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
