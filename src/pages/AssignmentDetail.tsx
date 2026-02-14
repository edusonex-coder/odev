import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    ClipboardList,
    Clock,
    FileText,
    Upload,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Send,
    MessageSquare,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface Assignment {
    id: string;
    class_id: string;
    title: string;
    description: string | null;
    due_date: string | null;
    status: string;
    created_at: string;
}

interface Submission {
    id: string;
    content: string | null;
    file_url: string | null;
    grade: string | null;
    status: string;
    student_id: string;
    created_at: string;
    profiles?: {
        full_name: string | null;
    };
}

export default function AssignmentDetail() {
    const { id } = useParams<{ id: string }>();
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [submission, setSubmission] = useState<Submission | null>(null); // For student
    const [submissions, setSubmissions] = useState<Submission[]>([]); // For teacher

    // Form states
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isTeacher = profile?.role === 'teacher';

    useEffect(() => {
        if (id && user) {
            fetchAssignmentDetails();
        }
    }, [id, user]);

    const fetchAssignmentDetails = async () => {
        setLoading(true);
        try {
            // Assignment info
            const { data: assign, error: assignError } = await supabase
                .from('assignments')
                .select('*')
                .eq('id', id)
                .single();

            if (assignError) throw assignError;
            setAssignment(assign);

            if (isTeacher) {
                // Fetch all submissions for teacher
                const { data: subs, error: subsError } = await supabase
                    .from('assignment_submissions')
                    .select(`
                        *,
                        profiles:student_id (full_name)
                    `)
                    .eq('assignment_id', id);

                if (subsError) throw subsError;
                setSubmissions(subs || []);
            } else {
                // Fetch student's own submission
                const { data: sub, error: subError } = await supabase
                    .from('assignment_submissions')
                    .select('*')
                    .eq('assignment_id', id)
                    .eq('student_id', user?.id)
                    .maybeSingle();

                if (subError) throw subError;
                setSubmission(sub);
                if (sub) setContent(sub.content || "");
            }
        } catch (error: any) {
            console.error("Hata:", error);
            toast({ title: "Hata", description: "Ödev detayları yüklenemedi.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAssignment = async () => {
        if (!content.trim() || !user || !id) return;
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('assignment_submissions')
                .upsert({
                    assignment_id: id,
                    student_id: user.id,
                    content: content,
                    status: 'submitted'
                });

            if (error) throw error;

            toast({ title: "Başarılı", description: "Ödevin başarıyla teslim edildi! 🚀" });
            fetchAssignmentDetails();
        } catch (error: any) {
            toast({ title: "Hata", description: "Ödev teslim edilirken bir hata oluştu.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!assignment) return <div className="text-center py-20">Ödev bulunamadı.</div>;

    const isPastDue = assignment.due_date && new Date(assignment.due_date) < new Date();

    return (
        <div className="container py-6 max-w-4xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
            </Button>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Side: Assignment Content */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-0 shadow-sm overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-primary/10 text-primary border-0">Ödev</Badge>
                                {isPastDue && <Badge variant="destructive" className="border-0">Süresi Doldu</Badge>}
                            </div>
                            <CardTitle className="text-3xl font-bold">{assignment.title}</CardTitle>
                            <CardDescription className="flex items-center gap-4 pt-2">
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(assignment.created_at).toLocaleDateString('tr-TR')}</span>
                                {assignment.due_date && (
                                    <span className={`flex items-center gap-1 ${isPastDue ? 'text-destructive font-bold' : ''}`}>
                                        <Clock className="w-4 h-4" /> Son Teslim: {new Date(assignment.due_date).toLocaleString('tr-TR')}
                                    </span>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" /> Ödev Açıklaması
                            </h4>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {assignment.description || "Bu ödev için bir açıklama girilmemiş."}
                            </p>
                        </CardContent>
                    </Card>

                    {!isTeacher && (
                        <Card className="shadow-md border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Upload className="w-5 h-5 text-primary" /> Ödevini Gönder
                                </CardTitle>
                                <CardDescription>Cevabını aşağıya yazabilirsin.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="Cevabını veya notlarını buraya yaz..."
                                    className="min-h-[200px]"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    disabled={submission?.status === 'graded'}
                                />
                            </CardContent>
                            <CardFooter className="flex justify-between items-center border-t pt-4">
                                {submission ? (
                                    <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                                        <CheckCircle2 className="w-4 h-4" /> Ödev Teslim Edildi
                                    </div>
                                ) : (
                                    <div className="text-xs text-muted-foreground italic">
                                        {isPastDue ? "⚠️ Süresi dolmuş ödevler teslim edilebilir ancak işaretlenebilir." : "Henüz teslim edilmedi."}
                                    </div>
                                )}
                                <Button
                                    onClick={handleSubmitAssignment}
                                    disabled={isSubmitting || submission?.status === 'graded' || !content.trim()}
                                    className="gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    {submission ? "Güncelle ve Gönder" : "Ödevi Teslim Et"}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </div>

                {/* Right Side: Status / Feedback */}
                <div className="space-y-6">
                    {!isTeacher && submission?.grade && (
                        <Card className="bg-green-50 border-green-200">
                            <CardHeader>
                                <CardTitle className="text-sm text-green-800 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-green-600" /> Öğretmen Geri Bildirimi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-900 mb-2">{submission.grade}</div>
                                <p className="text-sm text-green-800">Harika iş çıkardın!</p>
                            </CardContent>
                        </Card>
                    )}

                    {isTeacher && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Öğrenci Teslimleri</CardTitle>
                                <CardDescription>{submissions.length} öğrenci teslim etti.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {submissions.map((sub) => (
                                        <div key={sub.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-bold">{sub.profiles?.full_name}</span>
                                                <Badge variant="outline" className="text-[10px]">{sub.status}</Badge>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground truncate">{sub.content}</p>
                                        </div>
                                    ))}
                                    {submissions.length === 0 && (
                                        <div className="p-8 text-center text-muted-foreground text-sm italic">
                                            Henüz hiç teslim yok.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="bg-indigo-50/50 border-indigo-100">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2 text-indigo-700">
                                <MessageSquare className="w-4 h-4" /> AI İpucu İster misin?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-indigo-600 mb-4 leading-relaxed">
                                Bu ödevde tıkandıysan Sokratik AI sana yardımcı olabilir!
                            </p>
                            <Button variant="outline" size="sm" className="w-full text-indigo-700 border-indigo-200 bg-white hover:bg-indigo-50" onClick={() => navigate('/dashboard/chat')}>
                                AI Öğretmen ile Konuş
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
