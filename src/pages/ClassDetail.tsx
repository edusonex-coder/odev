import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Users,
    BookOpen,
    MessageSquare,
    Settings,
    Plus,
    Search,
    MoreVertical,
    Loader2,
    CheckCircle2,
    Clock,
    ClipboardList,
    GraduationCap,
    Sparkles,
    Send,
    Zap,
    Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { enhanceAnnouncement, summarizeForStudents } from "@/lib/ai";

interface ClassData {
    id: string;
    name: string;
    color: string;
    schedule: string | null;
    teacher_id: string;
    invite_code: string;
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

interface StudentInClass {
    student_id: string;
    joined_at: string;
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

interface Announcement {
    id: string;
    content: string;
    ai_summary: string | null;
    created_at: string;
    is_smart: boolean;
    profiles: {
        full_name: string | null;
    } | null;
}

interface Assignment {
    id: string;
    title: string;
    description: string | null;
    due_date: string | null;
    status: 'active' | 'archived';
    created_at: string;
    teacher_id: string;
}

export default function ClassDetail() {
    const { id } = useParams<{ id: string }>();
    const { profile, user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [classData, setClassData] = useState<ClassData | null>(null);
    const [students, setStudents] = useState<StudentInClass[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [newAnnouncement, setNewAnnouncement] = useState("");
    const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
    const [newAssignmentDesc, setNewAssignmentDesc] = useState("");
    const [newAssignmentDueDate, setNewAssignmentDueDate] = useState("");
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
    const [showAssignmentForm, setShowAssignmentForm] = useState(false);

    useEffect(() => {
        if (id) {
            fetchClassDetails();
            fetchAnnouncements();
            fetchAssignments();
        }
    }, [id]);

    const fetchClassDetails = async () => {
        setLoading(true);
        try {
            const { data: cls, error: clsError } = await supabase
                .from('classes')
                .select(`
          *,
          profiles:teacher_id (
            full_name,
            avatar_url
          )
        `)
                .eq('id', id)
                .single();

            if (clsError) throw clsError;

            const formattedCls = {
                ...cls,
                profiles: Array.isArray(cls.profiles) ? cls.profiles[0] : cls.profiles
            } as any;

            setClassData(formattedCls);

            const { data: stus, error: stuError } = await supabase
                .from('class_students')
                .select(`
          student_id,
          joined_at,
          profiles:student_id (
            full_name,
            avatar_url
          )
        `)
                .eq('class_id', id);

            if (stuError) throw stuError;

            const formattedStus = stus?.map(s => ({
                ...s,
                profiles: Array.isArray(s.profiles) ? s.profiles[0] : s.profiles
            })) as any;

            setStudents(formattedStus || []);
        } catch (error: any) {
            console.error("Hata:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select(`
          *,
          profiles:teacher_id (
            full_name
          )
        `)
                .eq('class_id', id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedData = data?.map(a => ({
                ...a,
                profiles: Array.isArray(a.profiles) ? a.profiles[0] : a.profiles
            })) as any;

            setAnnouncements(formattedData || []);
        } catch (error) {
            console.error("Duyurular yüklenirken hata:", error);
        }
    };

    const fetchAssignments = async () => {
        try {
            const { data, error } = await supabase
                .from('assignments')
                .select('*')
                .eq('class_id', id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAssignments(data || []);
        } catch (error) {
            console.error("Ödevler yüklenirken hata:", error);
        }
    };

    const handleEnhanceAnnouncement = async () => {
        if (!newAnnouncement.trim()) return;
        setIsEnhancing(true);
        try {
            const enhanced = await enhanceAnnouncement(newAnnouncement);
            setNewAnnouncement(enhanced);
            toast({
                title: "AI Dokunuşu Tamam! ✨",
                description: "Duyuru pedagojik ve motive edici hale getirildi.",
            });
        } catch (error) {
            toast({
                title: "Hata",
                description: "AI şu an yanıt veremiyor.",
                variant: "destructive"
            });
        } finally {
            setIsEnhancing(false);
        }
    };

    const handlePostAnnouncement = async () => {
        if (!newAnnouncement.trim() || !user || !id) return;
        setIsPosting(true);
        try {
            // Generate summary if it's a long announcement
            let summary = null;
            if (newAnnouncement.length > 50) {
                summary = await summarizeForStudents(newAnnouncement);
            }

            const { error } = await supabase
                .from('announcements')
                .insert({
                    class_id: id,
                    teacher_id: user.id,
                    content: newAnnouncement,
                    ai_summary: summary,
                    is_smart: newAnnouncement.includes('✨') || newAnnouncement.length > 50
                });

            if (error) throw error;

            toast({ title: "Başarılı", description: "Duyuru paylaşıldı!" });
            setNewAnnouncement("");
            fetchAnnouncements();
        } catch (error) {
            toast({ title: "Hata", description: "Duyuru paylaşılamadı.", variant: "destructive" });
        } finally {
            setIsPosting(false);
        }
    };

    const handleCreateAssignment = async () => {
        if (!newAssignmentTitle.trim() || !user || !id) return;
        setIsCreatingAssignment(true);
        try {
            const { error } = await supabase
                .from('assignments')
                .insert({
                    class_id: id,
                    teacher_id: user.id,
                    title: newAssignmentTitle,
                    description: newAssignmentDesc,
                    due_date: newAssignmentDueDate || null
                });

            if (error) throw error;

            toast({ title: "Başarılı", description: "Ödev başarıyla oluşturuldu!" });
            setNewAssignmentTitle("");
            setNewAssignmentDesc("");
            setNewAssignmentDueDate("");
            setShowAssignmentForm(false);
            fetchAssignments();
        } catch (error) {
            toast({ title: "Hata", description: "Ödev oluşturulamadı.", variant: "destructive" });
        } finally {
            setIsCreatingAssignment(false);
        }
    };

    const isTeacher = profile?.role === 'teacher' && classData?.teacher_id === user?.id;

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (!classData) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-2xl font-bold">Sınıf bulunamadı.</h2>
                <Button onClick={() => navigate(-1)} className="mt-4"><ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön</Button>
            </div>
        );
    }

    return (
        <div className="container py-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-bold text-gray-900">{classData.name}</h1>
                            <Badge variant="outline" className={`border-0 ${classData.color === 'blue' ? 'bg-blue-50 text-blue-700' :
                                classData.color === 'green' ? 'bg-green-50 text-green-700' :
                                    classData.color === 'purple' ? 'bg-purple-50 text-purple-700' :
                                        'bg-orange-50 text-orange-700'
                                }`}>
                                {classData.schedule || "Genel"}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" /> Öğretmen: {classData.profiles?.full_name}
                        </p>
                    </div>
                </div>

                {isTeacher && (
                    <div className="flex items-center gap-2">
                        <div className="bg-white border rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm font-mono">
                            <span className="text-gray-500">Davet Kodu:</span>
                            <span className="font-bold text-primary">{classData.invite_code}</span>
                        </div>
                        <Button variant="outline" size="icon"><Settings className="w-4 h-4" /></Button>
                    </div>
                )}
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-white border p-1 rounded-xl h-12 inline-flex w-full md:w-auto overflow-x-auto">
                    <TabsTrigger value="overview" className="rounded-lg gap-2"><BookOpen className="w-4 h-4" /> Genel Bakış</TabsTrigger>
                    <TabsTrigger value="tasks" className="rounded-lg gap-2"><ClipboardList className="w-4 h-4" /> Ödevler & Sorular</TabsTrigger>
                    <TabsTrigger value="students" className="rounded-lg gap-2"><Users className="w-4 h-4" /> Öğrenciler ({students.length})</TabsTrigger>
                    <TabsTrigger value="messages" className="rounded-lg gap-2"><MessageSquare className="w-4 h-4" /> Mesajlar</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2 border-0 shadow-sm bg-gray-50/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-primary" /> Sınıf Akışı
                                </CardTitle>
                                <CardDescription>Öğretmeninizden gelen son duyurular ve mesajlar.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">

                                {/* Announcement Input for Teachers */}
                                {isTeacher && (
                                    <Card className="border-primary/20 bg-white overflow-hidden">
                                        <CardContent className="p-4 space-y-3">
                                            <Textarea
                                                placeholder="Öğrencilerine bir şeyler söyle..."
                                                className="border-0 focus-visible:ring-0 min-h-[100px] resize-none p-0"
                                                value={newAnnouncement}
                                                onChange={(e) => setNewAnnouncement(e.target.value)}
                                            />
                                            <div className="flex items-center justify-between pt-3 border-t">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 gap-2"
                                                        onClick={handleEnhanceAnnouncement}
                                                        disabled={isEnhancing || !newAnnouncement.trim()}
                                                    >
                                                        {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                                        AI ile Güzelleştir
                                                    </Button>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="gap-2"
                                                    onClick={handlePostAnnouncement}
                                                    disabled={isPosting || !newAnnouncement.trim()}
                                                >
                                                    {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                    Paylaş
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Announcements List */}
                                <div className="space-y-4">
                                    {announcements.map((a) => (
                                        <Card key={a.id} className="border-0 shadow-sm overflow-hidden group">
                                            <CardHeader className="p-4 pb-0">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                            {a.profiles?.full_name?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-bold">{a.profiles?.full_name}</p>
                                                        <p className="text-[10px] text-muted-foreground">{new Date(a.created_at).toLocaleString('tr-TR')}</p>
                                                    </div>
                                                    {a.is_smart && (
                                                        <Badge variant="outline" className="ml-auto bg-violet-50 text-violet-600 border-violet-100 text-[9px] gap-1">
                                                            <Sparkles className="w-2.5 h-2.5" /> AKILLI DUYURU
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {a.content}

                                                {/* AI Summary Box */}
                                                {a.ai_summary && (
                                                    <div className="mt-4 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                                                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                            <Zap className="w-3 h-3" /> Sihirli Özet (AI)
                                                        </p>
                                                        <div className="text-xs text-amber-800 space-y-1">
                                                            {a.ai_summary.split('\n').filter(line => line.trim()).map((line, i) => (
                                                                <p key={i}>{line}</p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {announcements.length === 0 && !isTeacher && (
                                        <div className="py-20 text-center text-muted-foreground bg-white rounded-2xl border border-dashed">
                                            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p>Henüz bir duyuru yapılmamış.</p>
                                        </div>
                                    )}
                                </div>

                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold">Yaklaşan Etkinlikler</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex flex-col items-center justify-center font-bold">
                                            <span className="text-[10px] leading-none">ŞUB</span>
                                            <span className="text-base">18</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Matematik Sınavı</p>
                                            <p className="text-xs text-muted-foreground">09:00 - Online</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="students">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Sınıf Mevcudu</CardTitle>
                                <CardDescription>Bu sınıfa kayıtlı öğrenciler.</CardDescription>
                            </div>
                            <div className="relative w-64 hidden md:block">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Öğrenci ara..." className="pl-9" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {students.map((stu) => (
                                    <div key={stu.student_id} className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10 border">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stu.student_id}`} />
                                                <AvatarFallback>{stu.profiles?.full_name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-sm tracking-tight">{stu.profiles?.full_name}</p>
                                                <p className="text-[10px] text-muted-foreground">Katılım: {new Date(stu.joined_at).toLocaleDateString('tr-TR')}</p>
                                            </div>
                                        </div>
                                        {isTeacher && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreVertical className="w-4 h-4" /></Button>
                                                </DropdownMenuTrigger>
                                                {/* Dropdown content here if needed */}
                                            </DropdownMenu>
                                        )}
                                    </div>
                                ))}

                                {students.length === 0 && (
                                    <div className="col-span-full py-20 text-center text-muted-foreground">
                                        <Users className="w-16 h-16 mx-auto mb-4 opacity-10" />
                                        <p>Bu sınıfta henüz hiç öğrenci yok.</p>
                                        <p className="text-sm mt-1">Öğrencilere davet kodunu ({classData.invite_code}) vererek katılmalarını isteyebilirsiniz.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-6">
                    {/* Assignment Controls for Teachers */}
                    {isTeacher && !showAssignmentForm && (
                        <Button onClick={() => setShowAssignmentForm(true)} className="w-full h-16 border-dashed border-2 bg-transparent hover:bg-gray-50 text-gray-600 gap-2">
                            <Plus className="w-5 h-5" /> Yeni Ödev Tanımla
                        </Button>
                    )}

                    {showAssignmentForm && (
                        <Card className="animate-in slide-in-from-top duration-300">
                            <CardHeader>
                                <CardTitle>Yeni Ödev Oluştur</CardTitle>
                                <CardDescription>Öğrencileriniz için yeni bir görev atayın.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Ödev Başlığı</label>
                                    <Input
                                        placeholder="Örn: Newton Yasaları Problemleri"
                                        value={newAssignmentTitle}
                                        onChange={(e) => setNewAssignmentTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Açıklama / Detaylar</label>
                                    <Textarea
                                        placeholder="Ödev detaylarını ve yönergeleri buraya yazın..."
                                        value={newAssignmentDesc}
                                        onChange={(e) => setNewAssignmentDesc(e.target.value)}
                                        className="min-h-[120px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Teslim Tarihi (Opsiyonel)</label>
                                    <Input
                                        type="datetime-local"
                                        value={newAssignmentDueDate}
                                        onChange={(e) => setNewAssignmentDueDate(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => setShowAssignmentForm(false)}>İptal</Button>
                                <Button onClick={handleCreateAssignment} disabled={isCreatingAssignment}>
                                    {isCreatingAssignment ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                    Ödevi Yayınla
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Assignments List */}
                    <div className="grid gap-4">
                        {assignments.map((assignment) => (
                            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg">{assignment.title}</h3>
                                                {assignment.status === 'active' ? (
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">AKTİF</Badge>
                                                ) : (
                                                    <Badge variant="secondary">ARŞİVLENMİŞ</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{assignment.description}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-6 mt-6 pt-6 border-t font-medium text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            Son Teslim: {assignment.due_date ? new Date(assignment.due_date).toLocaleString('tr-TR') : 'Süre Sınırı Yok'}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4" />
                                            0/ {students.length} Tamamlandı
                                        </div>
                                        <Button size="sm" variant="outline" className="ml-auto" onClick={() => navigate(`/dashboard/assignment/${assignment.id}`)}>
                                            Detayları Gör
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {assignments.length === 0 && !showAssignmentForm && (
                            <div className="text-center py-20 bg-white border border-dashed rounded-2xl">
                                <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-xl font-bold text-gray-700">Henüz Ödev Yok</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    {isTeacher ? "Öğrencilerinize ilk ödevlerini vererek öğrenme sürecini başlatın!" : "Bu sınıf için henüz bir ödev tanımlanmamış."}
                                </p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="messages">
                    <div className="text-center py-20 bg-white border border-dashed rounded-2xl">
                        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-bold text-gray-700">Sınıf Mesajlaşması</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">Tüm sınıfın bir arada sohbet edebileceği alan çok yakında burada olacak.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Minimal Dropdown for students
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
