import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Send, Loader2, RefreshCw, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getAIResponse, ChatMessage } from "@/lib/ai";

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Merhaba! 👋 Ben ÖdevGPT. Sana hangi konuda yardımcı olabilirim? Matematik, Fen veya başka bir ders... Sorunu sor, birlikte çözelim!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Mevcut mesaj geçmişini de göndererek bağlamı koruyoruz
      // Ancak çok uzun olmaması için son 10 mesajı alabiliriz
      const contextMessages = [...messages, userMessage].slice(-10);

      const responseContent = await getAIResponse(contextMessages);

      const aiMessage: ChatMessage = { role: "assistant", content: responseContent };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Cevap alınırken bir sorun oluştu. Lütfen tekrar deneyin.",
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
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-2xl mx-auto bg-background rounded-xl overflow-hidden border shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-card">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full h-8 w-8">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="relative">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
        </div>
        <div>
          <h2 className="font-semibold text-sm">ÖdevGPT Asistan</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Çevrimiçi
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-card border rounded-tl-none text-card-foreground"
                }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-card border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">ÖdevGPT yazıyor...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Bir şeyler yaz..."
            className="rounded-full bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary py-6"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="rounded-full w-12 h-12 gradient-primary shadow-glow flex-shrink-0"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
