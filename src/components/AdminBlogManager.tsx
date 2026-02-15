import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Globe, Search, Image as ImageIcon, CheckCircle, XCircle, Wand2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { blogSeeds } from "@/lib/blogSeeds";

interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image_url: string;
    is_published: boolean;
    seo_title: string;
    seo_description: string;
    geo_target: string;
    published_at: string;
}

export default function AdminBlogManager() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        image_url: "",
        is_published: false,
        seo_title: "",
        seo_description: "",
        geo_target: "",
    });
    const { toast } = useToast();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .order('published_at', { ascending: false });

            if (error) throw error;
            setBlogs(data || []);
        } catch (error: any) {
            toast({ title: "Hata", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (!currentBlog.title || !currentBlog.slug) {
                toast({ title: "Hata", description: "Başlık ve slug zorunludur.", variant: "destructive" });
                return;
            }

            if (currentBlog.id) {
                const { error } = await supabase
                    .from('blogs')
                    .update(currentBlog)
                    .eq('id', currentBlog.id);
                if (error) throw error;
                toast({ title: "Başarılı", description: "Blog güncellendi." });
            } else {
                const { error } = await supabase
                    .from('blogs')
                    .insert([currentBlog]);
                if (error) throw error;
                toast({ title: "Başarılı", description: "Yeni blog eklendi." });
            }

            setIsDialogOpen(false);
            fetchBlogs();
        } catch (error: any) {
            toast({ title: "Hata", description: error.message, variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) return;
        try {
            const { error } = await supabase.from('blogs').delete().eq('id', id);
            if (error) throw error;
            toast({ title: "Başarılı", description: "Blog silindi." });
            fetchBlogs();
        } catch (error: any) {
            toast({ title: "Hata", description: error.message, variant: "destructive" });
        }
    };

    const openEditDialog = (blog: Blog) => {
        setCurrentBlog(blog);
        setIsDialogOpen(true);
    };

    const openCreateDialog = () => {
        setCurrentBlog({
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            image_url: "",
            is_published: false,
            seo_title: "",
            seo_description: "",
            geo_target: "",
        });
        setIsDialogOpen(true);
    };

    const handleMagicImport = async () => {
        if (!confirm("Hazır blogları içe aktarmak istediğinize emin misiniz?")) return;
        setLoading(true);
        try {
            const seedsWithDates = blogSeeds.map(s => ({
                ...s,
                published_at: new Date().toISOString(),
                is_published: true
            }));
            const { error } = await supabase.from('blogs').insert(seedsWithDates);
            if (error) throw error;
            toast({ title: "Başarılı", description: "Örnek bloglar başarıyla eklendi!" });
            fetchBlogs();
        } catch (error: any) {
            toast({ title: "Hata", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Blog Yönetimi</h2>
                <div className="flex gap-2">
                    <Button onClick={handleMagicImport} variant="outline" className="gap-2 border-violet-200 text-violet-700 hover:bg-violet-50">
                        <Wand2 className="w-4 h-4" /> Sihirli İçe Aktar
                    </Button>
                    <Button onClick={openCreateDialog} className="gap-2">
                        <Plus className="w-4 h-4" /> Yeni Blog Ekle
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Başlık</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead>GEO</TableHead>
                                <TableHead>Tarih</TableHead>
                                <TableHead className="text-right">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                    </TableCell>
                                </TableRow>
                            ) : blogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        Henüz blog yazısı bulunmuyor.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                blogs.map((blog) => (
                                    <TableRow key={blog.id}>
                                        <TableCell className="font-medium">{blog.title}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{blog.slug}</TableCell>
                                        <TableCell>
                                            {blog.is_published ? (
                                                <Badge className="bg-green-100 text-green-700">Yayında</Badge>
                                            ) : (
                                                <Badge variant="secondary">Taslak</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {blog.geo_target ? <Badge variant="outline">{blog.geo_target}</Badge> : "-"}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {new Date(blog.published_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="ghost" onClick={() => openEditDialog(blog)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(blog.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{currentBlog.id ? "Blog Düzenle" : "Yeni Blog Ekle"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Başlık</Label>
                                <Input
                                    value={currentBlog.title}
                                    onChange={(e) => {
                                        const title = e.target.value;
                                        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                        setCurrentBlog({ ...currentBlog, title, slug });
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug (URL yolu)</Label>
                                <Input
                                    value={currentBlog.slug}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, slug: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Özet (Excerpt)</Label>
                                <Textarea
                                    value={currentBlog.excerpt}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Görsel URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={currentBlog.image_url}
                                        onChange={(e) => setCurrentBlog({ ...currentBlog, image_url: e.target.value })}
                                    />
                                    <Button variant="outline" size="icon"><ImageIcon className="w-4 h-4" /></Button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={currentBlog.is_published}
                                    onCheckedChange={(val) => setCurrentBlog({ ...currentBlog, is_published: val })}
                                />
                                <Label>Yayınla</Label>
                            </div>
                        </div>

                        <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                            <h4 className="font-bold text-sm flex items-center gap-2">
                                <Globe className="w-4 h-4 text-blue-500" /> SEO & GEO Ayarları
                            </h4>
                            <div className="space-y-2">
                                <Label className="text-xs">SEO Başlığı</Label>
                                <Input
                                    className="text-sm"
                                    value={currentBlog.seo_title}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, seo_title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">SEO Açıklaması</Label>
                                <Textarea
                                    className="text-sm h-20"
                                    value={currentBlog.seo_description}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, seo_description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">GEO Hedefleme (Örn: İstanbul, Türkiye)</Label>
                                <Input
                                    className="text-sm"
                                    value={currentBlog.geo_target}
                                    onChange={(e) => setCurrentBlog({ ...currentBlog, geo_target: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label>İçerik (Markdown)</Label>
                            <Textarea
                                className="min-h-[300px] font-mono"
                                value={currentBlog.content}
                                onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>İptal</Button>
                        <Button onClick={handleSave}>Kaydet</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
