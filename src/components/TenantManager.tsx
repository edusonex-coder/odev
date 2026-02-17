import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { School, Settings2, Palette, Globe, Save, Loader2, PlayCircle } from "lucide-react";

interface Tenant {
    id: string;
    name: string;
    slug: string;
    domain: string | null;
    logo_url: string | null;
    primary_color: string | null;
    cto_name: string | null;
    cto_note: string | null;
    video_url: string | null;
    hide_universe_section: boolean;
    hero_style: 'gradient' | 'industrial' | 'modern';
}

export default function TenantManager() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from("tenants").select("*").order("name");
            if (error) throw error;
            setTenants(data || []);
            if (data && data.length > 0 && !selectedTenant) {
                setSelectedTenant(data[0]);
            }
        } catch (err: any) {
            toast({ title: "Hata", description: err.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!selectedTenant) return;
        try {
            setSaving(true);
            const { error } = await supabase
                .from("tenants")
                .update({
                    name: selectedTenant.name,
                    slug: selectedTenant.slug,
                    domain: selectedTenant.domain,
                    logo_url: selectedTenant.logo_url,
                    primary_color: selectedTenant.primary_color,
                    cto_name: selectedTenant.cto_name,
                    cto_note: selectedTenant.cto_note,
                    video_url: selectedTenant.video_url,
                    hide_universe_section: selectedTenant.hide_universe_section,
                    hero_style: selectedTenant.hero_style
                })
                .eq("id", selectedTenant.id);

            if (error) throw error;
            toast({ title: "Başarılı", description: "Kurum ayarları güncellendi." });
            fetchTenants();
        } catch (err: any) {
            toast({ title: "Hata", description: err.message, variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="py-10 text-center animate-pulse">Kurumlar yükleniyor...</div>;

    return (
        <div className="grid gap-8 lg:grid-cols-4">
            {/* Kurum Listesi */}
            <div className="lg:col-span-1 space-y-2">
                <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4 px-2 tracking-widest">Kayıtlı Kurumlar</h3>
                {tenants.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setSelectedTenant(t)}
                        className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedTenant?.id === t.id
                                ? 'bg-primary/5 border-primary shadow-sm'
                                : 'bg-white border-transparent hover:bg-gray-50'
                            }`}
                    >
                        <div className="font-bold flex items-center gap-2">
                            <School className={`w-4 h-4 ${selectedTenant?.id === t.id ? 'text-primary' : 'text-gray-400'}`} />
                            {t.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground ml-6 font-mono">{t.slug}</div>
                    </button>
                ))}
            </div>

            {/* Düzenleme Alanı */}
            <div className="lg:col-span-3">
                {selectedTenant ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black">{selectedTenant.name} Yapılandırması</h2>
                                <p className="text-muted-foreground text-sm">Kurumun görsel kimliğini ve özelliklerini yönetin.</p>
                            </div>
                            <Button onClick={handleUpdate} disabled={saving} className="gap-2 shadow-lg shadow-primary/20">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Ayarları Kaydet
                            </Button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-sm flex items-center gap-2"><Settings2 className="w-4 h-4" /> Genel Bilgiler</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Kurum Adı</Label>
                                        <Input value={selectedTenant.name} onChange={e => setSelectedTenant({ ...selectedTenant, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Slug (Alt Alan Adı)</Label>
                                        <Input value={selectedTenant.slug} onChange={e => setSelectedTenant({ ...selectedTenant, slug: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Özel Alan Adı (Custom Domain)</Label>
                                        <Input value={selectedTenant.domain || ''} onChange={e => setSelectedTenant({ ...selectedTenant, domain: e.target.value })} placeholder="isikdamper.online" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-sm flex items-center gap-2"><Palette className="w-4 h-4" /> Görsel Kimlik</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Logo URL</Label>
                                        <Input value={selectedTenant.logo_url || ''} onChange={e => setSelectedTenant({ ...selectedTenant, logo_url: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Birincil Renk (HSL: 263 84% 50%)</Label>
                                        <Input value={selectedTenant.primary_color || ''} onChange={e => setSelectedTenant({ ...selectedTenant, primary_color: e.target.value })} />
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <Label>Universe Bölümünü Gizle</Label>
                                        <Switch checked={selectedTenant.hide_universe_section} onCheckedChange={val => setSelectedTenant({ ...selectedTenant, hide_universe_section: val })} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-2">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-sm flex items-center gap-2"><Globe className="w-4 h-4" /> Beyaz Etiket (White-Label) & İçerik</CardTitle>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>CTO / Yönetici Adı</Label>
                                            <Input value={selectedTenant.cto_name || ''} onChange={e => setSelectedTenant({ ...selectedTenant, cto_name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>CTO Notu</Label>
                                            <Textarea value={selectedTenant.cto_note || ''} onChange={e => setSelectedTenant({ ...selectedTenant, cto_note: e.target.value })} rows={4} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2"><PlayCircle className="w-4 h-4" /> Tanıtım Videosu URL (YouTube)</Label>
                                            <Input value={selectedTenant.video_url || ''} onChange={e => setSelectedTenant({ ...selectedTenant, video_url: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Hero Tasarım Stili</Label>
                                            <select
                                                className="w-full bg-white border p-2 rounded-md text-sm"
                                                value={selectedTenant.hero_style}
                                                onChange={e => setSelectedTenant({ ...selectedTenant, hero_style: e.target.value as any })}
                                            >
                                                <option value="gradient">Gradient (Modern)</option>
                                                <option value="industrial">Industrial (Ciddi)</option>
                                                <option value="modern">Minimalist</option>
                                            </select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-gray-50/50 rounded-3xl border-2 border-dashed">
                        <School className="w-12 h-12 mb-4 opacity-20" />
                        <p className="italic">Düzenlemek için sol taraftan bir kurum seçin.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
