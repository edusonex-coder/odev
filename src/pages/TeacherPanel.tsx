import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Edit3,
  Send,
  Sparkles,
  Clock,
  Loader2,
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  Plus,
  MoreVertical,
  Search,
  School,
  X,
  Palette,
  CheckCircle,
  HelpCircle,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Question {
  id: string;
  subject: string;
  question_text: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
  student_id: string;
  profiles: { full_name: string } | null;
}

interface ClassItem {
  id: string;
  name: string;
  description: string | null;
  schedule: string | null;
  color: string;
  invite_code: string;
  student_count?: number; // Join ile gelecek (henüz implemente edilmedi)
}

// Mock Data for Dashboard
const weeklyStats = [
  { name: 'Pts', soru: 4 },
  { name: 'Sal', soru: 7 },
  { name: 'Çar', soru: 5 },
  { name: 'Per', soru: 9 },
  { name: 'Cum', soru: 12 },
  { name: 'Cmt', soru: 8 },
  { name: 'Paz', soru: 6 },
];

const mockStudents = [
  { id: 1, name: 'Ahmet Yılmaz', grade: '12. Sınıf', status: 'online', average: 85, lastActive: 'Şimdi' },
  { id: 2, name: 'Zeynep Kaya', grade: '11. Sınıf', status: 'offline', average: 92, lastActive: '2 saat önce' },
];

export default function TeacherPanel() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [solutionText, setSolutionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  // New Class Form State
  const [isNewClassOpen, setIsNewClassOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassSchedule, setNewClassSchedule] = useState("");
  const [newClassColor, setNewClassColor] = useState("blue");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchQuestions(), fetchClasses()]);
    setLoading(false);
  };

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select(`*, profiles:student_id (full_name)`)
        .in('status', ['pending', 'ai_answered', 'teacher_review'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      const formattedData = data?.map(q => ({
        ...q,
        profiles: Array.isArray(q.profiles) ? q.profiles[0] : q.profiles
      })) as Question[];
      setQuestions(formattedData || []);
    } catch (error) {
      console.error("Sorular yüklenirken hata:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error("Sınıflar yüklenirken hata:", error);
    }
  }

  const handleCreateClass = async () => {
    if (!newClassName.trim() || !user) return;

    // Generate random 6-char code: X9A2B1
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      const { error } = await supabase.from('classes').insert({
        teacher_id: user.id,
        name: newClassName,
        schedule: newClassSchedule,
        color: newClassColor,
        invite_code: generatedCode
      });

      if (error) throw error;

      toast({
        title: "Sınıf Oluşturuldu! 🎉",
        description: `${newClassName} sınıfı eklendi. Davet Kodu: ${generatedCode}`
      });
      setIsNewClassOpen(false);
      setNewClassName("");
      setNewClassSchedule("");
      fetchClasses(); // Listeyi güncelle

    } catch (error: any) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  }

  const handleDeleteClass = async (classId: string) => {
    if (!confirm("Bu sınıfı silmek istediğinize emin misiniz?")) return;
    try {
      const { error } = await supabase.from('classes').delete().eq('id', classId);
      if (error) throw error;
      toast({ title: "Sınıf Silindi", description: "Sınıf başarıyla kaldırıldı." });
      fetchClasses();
    } catch (error: any) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  }

  const handleSubmitSolution = async () => {
    if (!selectedQuestionId || !solutionText.trim() || !user) return;
    setSubmitting(true);
    try {
      const { error: solError } = await supabase.from("solutions").insert({
        question_id: selectedQuestionId,
        solver_type: "teacher",
        solver_id: user.id,
        solution_text: solutionText,
        is_approved: true
      });
      if (solError) throw solError;
      await supabase.from("questions").update({ status: "completed" }).eq("id", selectedQuestionId);
      toast({ title: "Çözüm Gönderildi! 🎉", description: "Eline sağlık hocam." });
      setSolutionText("");
      setSelectedQuestionId(null);
      fetchQuestions();
    } catch (error: any) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const getPublicUrl = (path: string | null) => {
    if (!path) return null;
    return supabase.storage.from("question_images").getPublicUrl(path).data.publicUrl;
  };

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  const getClassColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'green': return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      case 'purple': return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      case 'orange': return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">
              <span className="text-primary">Eğitim</span>
              <span className="text-gray-900">Paneli</span>
            </span>
            <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700 hover:bg-purple-200">Öğretmen</Badge>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border shadow-sm">
              <Avatar className="w-6 h-6">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                <AvatarFallback>T</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Edusonex Öğretmen</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6 px-4 max-w-7xl mx-auto">
        <Tabs defaultValue="dashboard" className="space-y-6" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            <TabsList className="bg-white border shadow-sm p-1 rounded-xl h-12">
              <TabsTrigger value="dashboard" className="rounded-lg gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <LayoutDashboard className="w-4 h-4" /> Genel Bakış
              </TabsTrigger>
              <TabsTrigger value="questions" className="rounded-lg gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <ClipboardList className="w-4 h-4" /> Soru Havuzu
                {questions.length > 0 && <span className="ml-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">{questions.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="classes" className="rounded-lg gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <BookOpen className="w-4 h-4" /> Sınıflarım
              </TabsTrigger>
              <TabsTrigger value="students" className="rounded-lg gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Users className="w-4 h-4" /> Öğrenciler
              </TabsTrigger>
              <TabsTrigger value="messages" className="rounded-lg gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <MessageSquare className="w-4 h-4" /> Mesajlar
              </TabsTrigger>
            </TabsList>

            {activeTab === 'classes' && (
              <Dialog open={isNewClassOpen} onOpenChange={setIsNewClassOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 ml-4 bg-primary text-white hover:bg-primary/90">
                    <Plus className="w-4 h-4" /> Yeni Sınıf
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Yeni Sınıf Oluştur</DialogTitle>
                    <DialogDescription>
                      Sınıf bilgilerini girerek yeni bir ders grubu oluşturun.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-right">Sınıf Adı</Label>
                      <Input id="name" placeholder="Örn: 10-A Matematik" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule" className="text-right">Ders Saati (Opsiyonel)</Label>
                      <Input id="schedule" placeholder="Örn: Pazartesi 09:00" value={newClassSchedule} onChange={(e) => setNewClassSchedule(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color" className="text-right">Renk Teması</Label>
                      <Select value={newClassColor} onValueChange={setNewClassColor}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Bir renk seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Mavi</div></SelectItem>
                          <SelectItem value="green"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div>Yeşil</div></SelectItem>
                          <SelectItem value="purple"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div>Mor</div></SelectItem>
                          <SelectItem value="orange"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div>Turuncu</div></SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateClass}>Oluştur</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* DASHBOARD TAB */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Soru</CardTitle>
                  <HelpCircle className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{questions.length + 15}</div>
                  <p className="text-xs text-muted-foreground mt-1">Bu dönem sorulan</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Bekleyen Sorular</CardTitle>
                  <ClipboardList className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{questions.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Cevaplanmayı bekleyen</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Çözülen Soru</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-muted-foreground mt-1 text-green-600">Başarıyla yanıtlananlar</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Sınıflarım</CardTitle>
                  <BookOpen className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{classes.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Aktif şube</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
              <Card className="col-span-4 shadow-sm">
                <CardHeader>
                  <CardTitle>Haftalık Performans</CardTitle>
                  <CardDescription>Soru çözüm grafiği</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyStats}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="soru" name="Gelen Soru" fill="#adfa1d" radius={[4, 4, 0, 0]} className="fill-primary" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-3 shadow-sm">
                <CardHeader>
                  <CardTitle>Son Sınıf Aktiviteleri</CardTitle>
                  <CardDescription>Oluşturulan son sınıflar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {classes.slice(0, 4).map((cls, i) => (
                      <div key={cls.id} className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white ${cls.color === 'blue' ? 'bg-blue-500' : cls.color === 'green' ? 'bg-green-500' : cls.color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'}`}>
                          {cls.name.charAt(0)}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{cls.name}</p>
                          <p className="text-xs text-muted-foreground">{cls.schedule || "Saat belirtilmedi"}</p>
                        </div>
                      </div>
                    ))}
                    {classes.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Henüz hiç sınıf oluşturmadınız.</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* QUESTIONS TAB */}
          <TabsContent value="questions" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
              {/* Question List */}
              <div className="lg:col-span-1 border rounded-2xl bg-white overflow-hidden flex flex-col h-full shadow-sm">
                <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                  <h2 className="font-semibold flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-primary" /> Bekleyenler
                  </h2>
                  <Badge variant="outline" className="bg-white">{questions.length}</Badge>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {questions.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground opacity-60">
                      <ClipboardList className="w-12 h-12 mx-auto mb-2" />
                      <p>Bekleyen soru yok.</p>
                    </div>
                  ) : (
                    questions.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => setSelectedQuestionId(q.id)}
                        className={`rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${selectedQuestionId === q.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "bg-white hover:border-blue-200"}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary" className="text-[10px]">{q.subject}</Badge>
                          <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(q.created_at), { addSuffix: true, locale: tr })}</span>
                        </div>
                        <p className="text-sm font-medium line-clamp-2 text-gray-800">{q.question_text || "Görsel içerikli soru"}</p>
                        <div className="mt-2 pt-2 border-t border-dashed flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" /> {q.profiles?.full_name || "Öğrenci"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Detail Area */}
              <div className="lg:col-span-2 flex flex-col h-full bg-white rounded-2xl border shadow-sm overflow-hidden">
                {selectedQuestion ? (
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{selectedQuestion.subject} Sorusu</h3>
                          <Badge variant={selectedQuestion.status === 'pending' ? 'destructive' : 'default'} className="uppercase text-[10px]">
                            {selectedQuestion.status === 'pending' ? 'Bekliyor' : selectedQuestion.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Öğrenci: {selectedQuestion.profiles?.full_name}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedQuestionId(null)}>Kapat</Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="space-y-6">
                        {/* Soru İçeriği */}
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                          {selectedQuestion.image_url && (
                            <img src={getPublicUrl(selectedQuestion.image_url) || ""} className="max-h-[300px] rounded-lg mb-4 border bg-white" />
                          )}
                          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{selectedQuestion.question_text}</p>
                        </div>

                        {/* Çözüm Alanı */}
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Edit3 className="w-4 h-4 text-green-600" /> Çözümünüz
                          </h4>
                          <Textarea
                            placeholder="Çözümü buraya yazın..."
                            value={solutionText}
                            onChange={(e) => setSolutionText(e.target.value)}
                            className="min-h-[200px] p-4 text-base bg-white border-2 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setSelectedQuestionId(null)}>Vazgeç</Button>
                      <Button onClick={handleSubmitSolution} disabled={submitting || !solutionText.trim()} className="bg-green-600 hover:bg-green-700">
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />} Çözümü Gönder
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <ClipboardList className="w-10 h-10 opacity-20" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Bir soru seçin</h3>
                    <p className="max-w-xs mx-auto">Listeden bir soru seçerek detayları görebilir ve çözüm yazabilirsiniz.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* CLASSES TAB */}
          <TabsContent value="classes" className="space-y-6">
            {classes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <School className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Henüz Sınıfınız Yok</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  Öğrencilerinizi yönetmek ve ders programınızı oluşturmak için ilk sınıfınızı ekleyin.
                </p>
                <Button onClick={() => setIsNewClassOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> İlk Sınıfı Oluştur
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                  <Link key={cls.id} to={`/teacher/class/${cls.id}`} className="block">
                    <Card className="group hover:shadow-lg transition-all cursor-pointer border-t-4 bg-white" style={{ borderTopColor: cls.color === 'blue' ? '#3b82f6' : cls.color === 'green' ? '#22c55e' : cls.color === 'purple' ? '#a855f7' : '#f97316' }}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col gap-2">
                            <Badge variant="outline" className={`border-0 w-fit ${getClassColorClasses(cls.color)}`}>{(cls.student_count || 0)} Öğrenci</Badge>
                            <div
                              className="flex items-center gap-2 text-xs font-mono bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 border transition-colors group/code"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigator.clipboard.writeText(cls.invite_code);
                                toast({ description: "Davet kodu kopyalandı! 📋" });
                              }}
                              title="Kodu Kopyala"
                            >
                              <span className="text-gray-500 font-semibold">KOD:</span>
                              <span className="font-bold text-gray-900 tracking-wider">{cls.invite_code}</span>
                              <ClipboardList className="w-3 h-3 text-gray-400 group-hover/code:text-primary transition-colors" />
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(cls.invite_code);
                                toast({ description: "Kod kopyalandı: " + cls.invite_code });
                              }}>
                                Kodu Kopyala
                              </DropdownMenuItem>
                              <DropdownMenuItem>Düzenle</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClass(cls.id);
                              }}>Sil</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardTitle className="mt-2 text-xl">{cls.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> {cls.schedule || "Saat Belirtilmedi"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent p-0>
                        <div className="flex -space-x-2 overflow-hidden py-2 px-6 min-h-[40px]">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-gray-100 text-[10px] font-medium text-gray-500">0</div>
                        </div>
                        <div className="p-6 pt-0">
                          <Button className="w-full mt-4" variant="outline">Sınıfa Git</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}

                <Button variant="outline" className="h-auto min-h-[200px] flex flex-col gap-4 border-dashed border-2 hover:border-primary hover:bg-primary/5" onClick={() => setIsNewClassOpen(true)}>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-semibold text-lg">Yeni Sınıf Ekle</span>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* STUDENTS TAB - Placeholder */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Öğrenci Listesi</CardTitle>
                    <CardDescription>Tüm sınıflarınızdaki kayıtlı öğrenciler</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Bu özellik için önce öğrencilerinizi sınıflara eklemelisiniz.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MESSAGES TAB - Placeholder */}
          <TabsContent value="messages" className="space-y-6">
            <div className="text-center py-20 bg-white border border-dashed rounded-2xl">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-700">Yakında Geliyor</h3>
              <p className="text-muted-foreground">Mesajlaşma özelliği geliştirme aşamasındadır.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
