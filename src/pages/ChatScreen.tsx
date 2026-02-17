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
