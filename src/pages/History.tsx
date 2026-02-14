import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, Loader2, Image as ImageIcon, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

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
