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
    Sparkles,
    File,
    X,
    ExternalLink
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
import { grantXP, XP_VALUES } from "@/lib/gamification";

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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

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
        if ((!content.trim() && !selectedFile) || !user || !id) return;
        setIsSubmitting(true);
        setUploadProgress(10);

        try {
            let fileUrl = submission?.file_url || null;

            // 1. Upload File if selected
            if (selectedFile) {
                setUploadProgress(30);
                const fileExt = selectedFile.name.split('.').pop();
                const fileName = `${user.id}/${id}_${Math.random()}.${fileExt}`;
                const filePath = `submissions/${fileName}`;

                const { error: uploadError, data } = await supabase.storage
                    .from('assignments')
                    .upload(filePath, selectedFile, { upsert: true });

                if (uploadError) throw uploadError;

                setUploadProgress(70);
                const { data: { publicUrl } } = supabase.storage
                    .from('assignments')
                    .getPublicUrl(filePath);

                fileUrl = publicUrl;
            }

            // 2. Clear previous file if user removed it (UI logic could be added)

            // 3. Upsert submission
            const { error } = await supabase
                .from('assignment_submissions')
                .upsert({
                    assignment_id: id,
                    student_id: user.id,
                    content: content,
                    file_url: fileUrl,
                    status: 'submitted'
                });

            if (error) throw error;

            setUploadProgress(100);
            toast({ title: "Başarılı", description: "Ödevin başarıyla teslim edildi! 🚀" });

            // XP Kazandır
            if (user) {
                grantXP(user.id, XP_VALUES.ASSIGNMENT_SUBMISSION);
            }

            setSelectedFile(null);
            fetchAssignmentDetails();
        } catch (error: any) {
            console.error("Submission error:", error);
            toast({ title: "Hata", description: "Ödev teslim edilirken bir hata oluştu.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setUploadProgress(0), 1000);
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
                                    className="min-h-[150px]"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    disabled={submission?.status === 'graded'}
                                />

                                {/* File Upload Area */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <File className="w-4 h-4 text-primary" /> Dosya Ekle (PDF, Resim vb.)
                                    </label>

                                    {!selectedFile && !submission?.file_url ? (
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="file-upload"
                                                className="hidden"
                                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                                disabled={submission?.status === 'graded'}
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                            >
                                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                <span className="text-xs text-gray-500 font-medium">Dosya seçmek için tıkla</span>
                                                <span className="text-[10px] text-gray-400 mt-1">Maksimum 10MB</span>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <FileText className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="max-w-[150px] md:max-w-[300px]">
                                                    <p className="text-sm font-bold truncate">
                                                        {selectedFile ? selectedFile.name : "Yüklenen Dosya"}
                                                    </p>
                                                    {submission?.file_url && (
                                                        <a href={submission.file_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1">
                                                            Görüntüle <ExternalLink className="w-2 h-2" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive"
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    // In a real app, we might also want to mark the remote file for deletion
                                                }}
                                                disabled={submission?.status === 'graded'}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {isSubmitting && uploadProgress > 0 && (
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="bg-primary h-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between items-center border-t pt-4">
                                {submission ? (
                                    <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                                        <CheckCircle2 className="w-4 h-4" /> Ödev Teslim Edildi
                                    </div>
                                ) : (
                                    <div className="text-xs text-muted-foreground italic">
                                        {isPastDue ? "⚠️ Süresi dolmuş ödevler teslim edilebilir." : "Henüz teslim edilmedi."}
                                    </div>
                                )}
                                <Button
                                    onClick={handleSubmitAssignment}
                                    disabled={isSubmitting || submission?.status === 'graded' || (!content.trim() && !selectedFile)}
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
                                            {sub.file_url && (
                                                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-primary font-medium">
                                                    <FileText className="w-3 h-3" /> Ekli Dosya Mevcut
                                                </div>
                                            )}
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
