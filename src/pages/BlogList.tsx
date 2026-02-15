import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight, Search, Sparkles, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    image_url: string;
    published_at: string;
    author: { full_name: string } | null;
}

export default function BlogList() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const { data, error } = await supabase
                .from('blogs')
                .select(`
                    id, title, slug, excerpt, image_url, published_at,
                    author:author_id ( full_name )
                `)
                .eq('is_published', true)
                .order('published_at', { ascending: false });

            if (error) throw error;

            // Supabase join responses can sometimes be arrays of objects for 1:N but for N:1 it should be an object.
            // Explicitly handling the type cast for the join result.
            const formattedBlogs = (data as any[]).map(blog => ({
                ...blog,
                author: Array.isArray(blog.author) ? blog.author[0] : blog.author
            }));

            setBlogs(formattedBlogs);
        } catch (error) {
            console.error("Bloglar yüklenirken hata:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-700 pt-32 pb-20 text-white text-center px-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 mb-4 px-4 py-1">
                            ÖdevGPT Akademi
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                            Eğitimin Geleceğini <br /> <span className="text-yellow-300">Bizimle Keşfedin</span>
                        </h1>
                        <p className="text-xl text-violet-100 max-w-2xl mx-auto font-medium">
                            Yapay zeka, sokratik metot ve eğitim teknolojileri üzerine en güncel rehberler ve makaleler.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-10">
                {/* Featured Video */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 bg-white rounded-[3rem] p-4 shadow-2xl overflow-hidden border border-violet-100"
                >
                    <div className="grid md:grid-cols-2 gap-8 items-center p-6 lg:p-10">
                        <div className="aspect-video rounded-[2rem] overflow-hidden shadow-lg">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/3CxZclawVSA"
                                title="ÖdevGPT Tanıtım"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="space-y-6">
                            <Badge className="bg-red-100 text-red-600 border-0 h-8 px-4 flex w-fit items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span> YENİ VİDEO
                            </Badge>
                            <h2 className="text-3xl font-black text-gray-900 leading-tight">
                                ÖdevGPT: Eğitimin Yeni Yüzü ve Vizyonumuz
                            </h2>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                Neden ÖdevGPT? Geleneksel eğitimdeki aksaklıkları nasıl gideriyoruz? Sokratik asistanımızın çalışma prensiplerini ve vizyonumuzu bu videoda keşfedin.
                            </p>
                            <Button className="rounded-full bg-violet-600 hover:bg-violet-700 h-12 px-8 font-bold gap-2">
                                <Youtube className="w-5 h-5" /> Şimdi İzle
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto mb-16">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                        className="pl-12 h-16 rounded-2xl shadow-xl border-0 focus-visible:ring-2 focus-visible:ring-violet-500 text-lg"
                        placeholder="Makale ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-96 rounded-3xl bg-white animate-pulse shadow-sm"></div>
                        ))}
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="text-center py-20">
                        <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-700">Sonuç Bulunamadı</h3>
                        <p className="text-muted-foreground">Aradığınız kriterlere uygun makale bulunmuyor.</p>
                        <Button variant="link" onClick={() => setSearchTerm("")} className="text-violet-600">tüm blogları gör</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map((blog, index) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link to={`/blog/${blog.slug}`}>
                                    <Card className="h-full border-0 shadow-sm hover:shadow-2xl transition-all group overflow-hidden rounded-3xl bg-white flex flex-col">
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <img
                                                src={blog.image_url || "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2070&auto=format&fit=crop"}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                                alt={blog.title}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                                <span className="text-white font-bold flex items-center gap-2">
                                                    Devamını Oku <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>
                                        <CardHeader className="flex-grow p-6">
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(blog.published_at).toLocaleDateString('tr-TR')}</span>
                                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {blog.author?.full_name || 'ÖdevGPT'}</span>
                                            </div>
                                            <CardTitle className="text-xl group-hover:text-violet-600 transition-colors line-clamp-2 leading-tight">
                                                {blog.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-6 pb-6 pt-0">
                                            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                                {blog.excerpt || blog.title}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
