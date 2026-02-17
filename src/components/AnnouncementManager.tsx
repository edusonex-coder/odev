import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Plus, Trash2, Send, Bell, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Announcement {
    id: string;
    title: string;
    content: string;
    type: string;
    is_global: boolean;
    created_at: string;
    tenant_id: string | null;
}

export default function AnnouncementManager({ selectedTenantId }: { selectedTenantId: string }) {
    const { profile } = useAuth();
    const { toast } = useToast();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: "",
        type: "info",
        is_global: false
    });

    useEffect(() => {
        fetchAnnouncements();
    }, [selectedTenantId]);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            let query = supabase.from("announcements").select("*").order("created_at", { ascending: false });

            if (selectedTenantId !== "all") {
                query = query.or(`tenant_id.eq.${selectedTenantId},is_global.eq.true`);
            }

            const { data, error } = await query;
            if (error) throw error;
            setAnnouncements(data || []);
        } catch (err) {
            console.error("Announcement fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newAnnouncement.title || !newAnnouncement.content) return;

        try {
            const payload = {
                title: newAnnouncement.title,
                content: newAnnouncement.content,
                type: newAnnouncement.type,
                is_global: profile?.is_super_admin ? newAnnouncement.is_global : false,
                tenant_id: newAnnouncement.is_global ? null : (selectedTenantId === "all" ? profile?.tenant_id : selectedTenantId)
            };

            const { error } = await supabase.from("announcements").insert(payload);
            if (error) throw error;

            toast({ title: "Başarılı", description: "Duyuru yayınlandı." });
            setIsAdding(false);
            setNewAnnouncement({ title: "", content: "", type: "info", is_global: false });
            fetchAnnouncements();
        } catch (err: any) {
            toast({ title: "Hata", description: err.message, variant: "destructive" });
        }
    };

    const deleteAnnouncement = async (id: string) => {
        try {
            const { error } = await supabase.from("announcements").delete().eq("id", id);
            if (error) throw error;
            setAnnouncements(announcements.filter(a => a.id !== id));
            toast({ title: "Silindi", description: "Duyuru kaldırıldı." });
        } catch (err: any) {
            toast({ title: "Hata", description: err.message, variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold">Duyuru Yönetimi</h2>
                </div>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} className="gap-2">
                        <Plus className="w-4 h-4" /> Yeni Duyuru
                    </Button>
                )}
            </div>

            {isAdding && (
                <Card className="border-primary/20 shadow-lg animate-in fade-in slide-in-from-top-4">
                    <CardHeader>
                        <CardTitle>Yeni Duyuru Yayınla</CardTitle>
                        <CardDescription>Kurum veya genel sistem duyurusu oluşturun.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Başlık</label>
                            <Input
                                value={newAnnouncement.title}
                                onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                placeholder="Örn: Hafta Sonu Bakım Çalışması"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">İçerik</label>
                            <Textarea
                                value={newAnnouncement.content}
                                onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                placeholder="Duyuru detaylarını yazın..."
                            />
                        </div>
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Tip:</label>
                                <select
                                    className="bg-white border text-sm p-1 rounded-md"
                                    value={newAnnouncement.type}
                                    onChange={e => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                                >
                                    <option value="info">Bilgi</option>
                                    <option value="success">Başarı</option>
                                    <option value="warning">Uyarı</option>
                                    <option value="urgent">Kritik</option>
                                </select>
                            </div>
                            {profile?.is_super_admin && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_global"
                                        checked={newAnnouncement.is_global}
                                        onChange={e => setNewAnnouncement({ ...newAnnouncement, is_global: e.target.checked })}
                                    />
                                    <label htmlFor="is_global" className="text-sm font-medium flex items-center gap-1 cursor-pointer">
                                        <Globe className="w-3 h-3" /> Tüm Sisteme Gönder (Global)
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 justify-end pt-2">
                            <Button variant="ghost" onClick={() => setIsAdding(false)}>İptal</Button>
                            <Button onClick={handleAdd} className="gap-2">
                                <Send className="w-4 h-4" /> Yayınla
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {loading ? (
                    <div className="py-10 text-center text-muted-foreground">Yükleniyor...</div>
                ) : announcements.length === 0 ? (
                    <div className="py-20 text-center bg-muted/20 border-2 border-dashed rounded-3xl">
                        <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground italic">Henüz bir duyuru bulunmuyor.</p>
                    </div>
                ) : (
                    announcements.map(a => (
                        <Card key={a.id} className="hover:shadow-md transition-shadow overflow-hidden group">
                            <div className="flex items-start p-6 gap-4">
                                <div className={`p-3 rounded-2xl ${a.type === 'urgent' ? 'bg-red-50 text-red-600' :
                                        a.type === 'warning' ? 'bg-orange-50 text-orange-600' :
                                            a.type === 'success' ? 'bg-green-50 text-green-600' :
                                                'bg-blue-50 text-blue-600'
                                    }`}>
                                    <Megaphone className="w-6 h-6" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-lg">{a.title}</h4>
                                            {a.is_global && <Badge variant="secondary" className="bg-purple-50 text-purple-600 border-purple-100 flex items-center gap-1"><Globe className="w-3 h-3" /> TÜM SİSTEM</Badge>}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{format(new Date(a.created_at), 'd MMMM yyyy HH:mm', { locale: tr })}</span>
                                    </div>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{a.content}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => deleteAnnouncement(a.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
