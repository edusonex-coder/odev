import { useState, useRef } from "react";
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
import { getAIResponse } from "@/lib/ai";
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
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const processImageOCR = async (file: File) => {
    setIsProcessing(true);
    toast({
      title: "Yazı Okunuyor 📖",
      description: "Fotoğraftaki metni anlamaya çalışıyorum...",
    });

    try {
      const result = await Tesseract.recognize(
        file,
        'tur', // Türkçe dil desteği
        { logger: m => console.log(m) }
      );

      const text = result.data.text.trim();
      if (text) {
        setQuestionText(prev => (prev ? prev + "\n" + text : text));
        toast({
          title: "Başarılı ✨",
          description: "Fotoğraftaki yazı metne çevrildi.",
          duration: 3000,
        });
      } else {
        toast({
          title: "Yazı Bulunamadı",
          description: "Resimde net bir yazı tespit edemedim.",
          variant: "destructive",
        });
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      toast({
        title: "Kamera hatası",
        description: "Kameraya erişilemedi.",
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
        setShowCamera(false);

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
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setShowCamera(false);
    }
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
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('question_images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;
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

      if (dbError) throw dbError;

      // 3. EĞER METİN VARSA: AI Otomatik Çözüm Üretsin
      if (questionText && qData) {
        try {
          toast({
            title: "Yapay Zeka Devrede 🤖",
            description: "Sorunuz analiz ediliyor...",
            duration: 2000,
          });

          const aiPrompt = `Öğrenci sorusu (${selectedSubject}): ${questionText}. 
          Lütfen bu soruyu adım adım, açıklayıcı ve eğitici bir dille çöz. 
          Cevabı doğrudan verme, önce ipucu ver sonra çözümü anlat. Türkçe kullan.`;

          const aiResponseText = await getAIResponse([{ role: "user", content: aiPrompt }]);

          // Çözümü kaydet
          await supabase.from("solutions").insert({
            question_id: qData.id,
            solver_type: "ai",
            solver_id: user?.id, // AI olduğu için sys user id veya null (RLS allow null?)
            solution_text: aiResponseText,
            is_approved: true
          });

          // Soru durumunu güncelle
          await supabase.from("questions").update({ status: "ai_answered" }).eq("id", qData.id);

        } catch (aiError) {
          console.error("AI Auto-Solve Hatası:", aiError);
          // Hata olsa bile soru kaydedildi, devam et.
        }
      }

      toast({
        title: "Soru Gönderildi! 🚀",
        description: "Sorunuz ve (varsa) AI çözümü hazır.",
      });

      // Temizle ve yönlendir => History sayfasına gidip sonucu görsün
      setQuestionText("");
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
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
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
