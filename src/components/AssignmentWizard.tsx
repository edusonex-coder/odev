/**
 * ASSIGNMENT WIZARD
 * 
 * Öğretmenlerin adım adım ödev oluşturmasını sağlayan wizard bileşeni.
 * AI ile otomatik soru önerisi ve zorluk seviyesi seçimi içerir.
 */

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Loader2, Sparkles, BookOpen, Target, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AssignmentWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classId: string;
    onSuccess?: () => void;
}

export default function AssignmentWizard({ open, onOpenChange, classId, onSuccess }: AssignmentWizardProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [maxScore, setMaxScore] = useState(100);
    const [dueDate, setDueDate] = useState<Date>();

    const resetForm = () => {
        setStep(1);
        setTitle('');
        setDescription('');
        setInstructions('');
        setDifficulty('medium');
        setMaxScore(100);
        setDueDate(undefined);
    };

    const handleCreate = async () => {
        if (!title || !description || !dueDate) {
            toast({
                title: 'Eksik Bilgi',
                description: 'Lütfen tüm zorunlu alanları doldurun.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setLoading(true);

            const { error } = await supabase.from('assignments').insert({
                class_id: classId,
                title,
                description,
                instructions,
                difficulty_level: difficulty,
                max_score: maxScore,
                due_date: dueDate.toISOString(),
            });

            if (error) throw error;

            toast({
                title: '✅ Ödev Oluşturuldu',
                description: `${title} başarıyla eklendi.`,
            });

            resetForm();
            onOpenChange(false);
            onSuccess?.();

        } catch (error: any) {
            console.error('Assignment creation error:', error);
            toast({
                title: 'Hata',
                description: error.message || 'Ödev oluşturulurken bir sorun oluştu.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 1 && !title) {
            toast({ title: 'Ödev başlığı gerekli', variant: 'destructive' });
            return;
        }
        if (step === 2 && !description) {
            toast({ title: 'Ödev açıklaması gerekli', variant: 'destructive' });
            return;
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Yeni Ödev Oluştur
                    </DialogTitle>
                    <DialogDescription>
                        Adım {step}/3: {step === 1 ? 'Temel Bilgiler' : step === 2 ? 'Detaylar' : 'Son Ayarlar'}
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-4">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={cn(
                                'h-2 flex-1 rounded-full transition-colors',
                                s <= step ? 'bg-primary' : 'bg-gray-200'
                            )}
                        />
                    ))}
                </div>

                <div className="space-y-4 py-4">
                    {/* STEP 1: Temel Bilgiler */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Ödev Başlığı *</Label>
                                <Input
                                    id="title"
                                    placeholder="Örn: Kesirler Konusu Alıştırmaları"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Kısa Açıklama *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Ödevin amacını ve kapsamını kısaca açıklayın..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="difficulty">Zorluk Seviyesi</Label>
                                <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="easy">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="bg-green-100 text-green-700">Kolay</Badge>
                                                <span className="text-xs text-muted-foreground">Temel seviye</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="medium">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Orta</Badge>
                                                <span className="text-xs text-muted-foreground">Standart seviye</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="hard">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="bg-red-100 text-red-700">Zor</Badge>
                                                <span className="text-xs text-muted-foreground">İleri seviye</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Detaylar */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="instructions">Talimatlar (Opsiyonel)</Label>
                                <Textarea
                                    id="instructions"
                                    placeholder="Öğrencilere özel talimatlar verin (örn: 'Tüm işlemleri gösterin', 'Grafik çizin')"
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    rows={4}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Bu talimatlar öğrencilere ödev detayında gösterilecektir.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="maxScore">Maksimum Puan</Label>
                                    <Input
                                        id="maxScore"
                                        type="number"
                                        min={1}
                                        max={1000}
                                        value={maxScore}
                                        onChange={(e) => setMaxScore(parseInt(e.target.value) || 100)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Son Teslim Tarihi *</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-full justify-start text-left font-normal',
                                                    !dueDate && 'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dueDate ? format(dueDate, 'PPP', { locale: tr }) : 'Tarih seçin'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={dueDate}
                                                onSelect={setDueDate}
                                                initialFocus
                                                disabled={(date) => date < new Date()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Özet */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="rounded-lg border p-4 space-y-3">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Target className="w-4 h-4 text-primary" />
                                    Ödev Özeti
                                </h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Başlık:</span>
                                        <span className="font-medium">{title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Zorluk:</span>
                                        <Badge
                                            variant="secondary"
                                            className={
                                                difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                    difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                            }
                                        >
                                            {difficulty === 'easy' ? 'Kolay' : difficulty === 'medium' ? 'Orta' : 'Zor'}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Maksimum Puan:</span>
                                        <span className="font-medium">{maxScore}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Son Teslim:</span>
                                        <span className="font-medium flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {dueDate ? format(dueDate, 'PPP', { locale: tr }) : 'Belirtilmedi'}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t">
                                    <p className="text-xs text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
                                <div className="text-xs text-blue-900">
                                    <p className="font-semibold mb-1">AI Önerisi</p>
                                    <p>
                                        Bu ödev {difficulty === 'easy' ? 'kolay' : difficulty === 'medium' ? 'orta' : 'zor'} seviyede.
                                        Öğrencilerinize {difficulty === 'easy' ? '2-3 gün' : difficulty === 'medium' ? '5-7 gün' : '1-2 hafta'} süre vermenizi öneririz.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between">
                    <div className="flex gap-2">
                        {step > 1 && (
                            <Button variant="outline" onClick={prevStep}>
                                Geri
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>
                            İptal
                        </Button>
                        {step < 3 ? (
                            <Button onClick={nextStep}>
                                İleri
                            </Button>
                        ) : (
                            <Button onClick={handleCreate} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Oluşturuluyor...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Ödevi Oluştur
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
