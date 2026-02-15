/**
 * SUBMIT ASSIGNMENT DIALOG
 * 
 * Öğrencilerin ödev teslim etmesini sağlayan dialog.
 * Metin girişi, dosya yükleme ve OCR desteği içerir.
 */

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, Camera, FileText, CheckCircle, X, Sparkles } from 'lucide-react';
import { performOCR, formatOCRResult, type OCRResult } from '@/lib/advancedOCR';

interface SubmitAssignmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    assignmentId: string;
    assignmentTitle: string;
    onSuccess?: () => void;
}

export default function SubmitAssignmentDialog({
    open,
    onOpenChange,
    assignmentId,
    assignmentTitle,
    onSuccess,
}: SubmitAssignmentDialogProps) {
    const { user } = useAuth();
    const { toast } = useToast();

    const [submissionText, setSubmissionText] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [ocrResults, setOcrResults] = useState<OCRResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [ocrLoading, setOcrLoading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(selectedFiles);

        // Eğer resim dosyası varsa OCR çalıştır
        const imageFile = selectedFiles.find(f => f.type.startsWith('image/'));
        if (imageFile) {
            await runOCR(imageFile);
        }
    };

    const runOCR = async (file: File) => {
        try {
            setOcrLoading(true);
            toast({
                title: '📸 Gelişmiş OCR Başlatıldı',
                description: 'Görüntü analiz ediliyor ve en uygun OCR yöntemi seçiliyor...',
            });

            // Advanced OCR kullan
            const result = await performOCR(file, {
                preferMath: file.name.toLowerCase().includes('math') ||
                    file.name.toLowerCase().includes('matematik'),
                language: 'tur',
                enhanceImage: true,
            });

            setOcrResults(prev => [...prev, result]);

            // OCR metnini submission text'e ekle
            if (result.text.trim()) {
                const formattedResult = formatOCRResult(result);
                setSubmissionText(prev =>
                    prev ? `${prev}\n\n${formattedResult}` : formattedResult
                );

                toast({
                    title: `✅ ${result.method === 'mathpix' ? '🔢 Mathpix' : '📝 Tesseract'} OCR Tamamlandı`,
                    description: `Metin başarıyla okundu. Güven: ${(result.confidence * 100).toFixed(1)}%`,
                });
            }

        } catch (error) {
            console.error('OCR error:', error);
            toast({
                title: 'OCR Hatası',
                description: 'Görüntüdeki metin okunamadı.',
                variant: 'destructive',
            });
        } finally {
            setOcrLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!submissionText.trim() && files.length === 0) {
            toast({
                title: 'Eksik İçerik',
                description: 'Lütfen metin girin veya dosya yükleyin.',
                variant: 'destructive',
            });
            return;
        }

        if (!user) return;

        try {
            setLoading(true);

            // Dosyaları Supabase Storage'a yükle
            const uploadedFiles = [];
            for (const file of files) {
                const fileName = `${user.id}/${Date.now()}_${file.name}`;
                const { data, error } = await supabase.storage
                    .from('assignment_files')
                    .upload(fileName, file);

                if (error) throw error;

                uploadedFiles.push({
                    url: data.path,
                    name: file.name,
                    type: file.type,
                });
            }

            // RPC ile ödev teslim et
            const { data, error } = await supabase.rpc('submit_assignment', {
                p_assignment_id: assignmentId,
                p_student_id: user.id,
                p_submission_text: submissionText,
                p_submission_files: uploadedFiles.length > 0 ? uploadedFiles : null,
                p_ocr_text: ocrResults.map(r => r.text).join('\n\n') || null,
            });

            if (error) throw error;

            toast({
                title: '✅ Ödev Teslim Edildi',
                description: 'Ödeviniz başarıyla gönderildi. Öğretmeniniz değerlendirme yapacaktır.',
            });

            // Reset form
            setSubmissionText('');
            setFiles([]);
            setOcrResults([]);
            onOpenChange(false);
            onSuccess?.();

        } catch (error: any) {
            console.error('Submission error:', error);
            toast({
                title: 'Hata',
                description: error.message || 'Ödev teslim edilirken bir sorun oluştu.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Ödev Teslim Et
                    </DialogTitle>
                    <DialogDescription>
                        {assignmentTitle}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Metin Girişi */}
                    <div className="space-y-2">
                        <Label htmlFor="submission">Cevabınız</Label>
                        <Textarea
                            id="submission"
                            placeholder="Ödev cevabınızı buraya yazın..."
                            value={submissionText}
                            onChange={(e) => setSubmissionText(e.target.value)}
                            rows={8}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            {submissionText.length} karakter
                        </p>
                    </div>

                    {/* Dosya Yükleme */}
                    <div className="space-y-2">
                        <Label>Dosya Ekle (Opsiyonel)</Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => document.getElementById('file-upload')?.click()}
                                disabled={ocrLoading}
                            >
                                {ocrLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        OCR Çalışıyor...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Dosya Seç
                                    </>
                                )}
                            </Button>
                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                accept="image/*,application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Resim veya PDF dosyası yükleyebilirsiniz. Resimler otomatik olarak okunacaktır (OCR).
                        </p>
                    </div>

                    {/* Yüklenen Dosyalar */}
                    {files.length > 0 && (
                        <div className="space-y-2">
                            <Label>Yüklenen Dosyalar</Label>
                            <div className="space-y-2">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 rounded-lg border bg-card"
                                    >
                                        <div className="flex items-center gap-2">
                                            {file.type.startsWith('image/') ? (
                                                <Camera className="w-4 h-4 text-blue-600" />
                                            ) : (
                                                <FileText className="w-4 h-4 text-gray-600" />
                                            )}
                                            <span className="text-sm font-medium truncate max-w-[300px]">
                                                {file.name}
                                            </span>
                                            <Badge variant="secondary" className="text-xs">
                                                {(file.size / 1024).toFixed(1)} KB
                                            </Badge>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFile(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* OCR Sonuçları */}
                    {ocrResults.length > 0 && (
                        <div className="space-y-3">
                            <Label>OCR Sonuçları</Label>
                            {ocrResults.map((result, index) => (
                                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {result.method === 'mathpix' ? (
                                                <Sparkles className="w-4 h-4 text-purple-600" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                            )}
                                            <span className="text-sm font-semibold text-blue-900">
                                                {result.method === 'mathpix' ? 'Mathpix AI Analizi' : 'Tesseract Metin Tanıma'}
                                            </span>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] scale-90">
                                            %{(result.confidence * 100).toFixed(0)} Güven
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-blue-800 whitespace-pre-wrap max-h-32 overflow-y-auto font-mono">
                                        {result.text.length > 300 ? result.text.substring(0, 300) + '...' : result.text}
                                    </p>
                                    {result.latex && (
                                        <div className="mt-2 pt-2 border-t border-blue-100">
                                            <span className="text-[10px] font-bold text-blue-700 uppercase">LaTeX Çıktısı:</span>
                                            <code className="block text-[10px] bg-blue-100/50 p-1 rounded mt-1 overflow-x-auto">
                                                {result.latex}
                                            </code>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        İptal
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading || ocrLoading}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Gönderiliyor...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Teslim Et
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
