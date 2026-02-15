import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Link2, Clock, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Blog {
    id: string;
    title: string;
    content: string;
    image_url: string;
    published_at: string;
    seo_title: string;
    seo_description: string;
    author: { full_name: string; avatar_url: string } | null;
}

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) fetchBlog();
    }, [slug]);

    const fetchBlog = async () => {
        try {
            const { data, error } = await supabase
                .from('blogs')
                .select(`
                    *,
                    author:author_id ( full_name, avatar_url )
                `)
                .eq('slug', slug)
                .single();

            if (error) throw error;
            setBlog(data);

            // Görüntülenme sayısını artır
            await supabase.rpc('increment_blog_views', { blog_id: data.id });

        } catch (error) {
            console.error("Blog yüklenirken hata:", error);
            navigate('/blog');
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Bağlantı kopyalandı!");
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
    );

    if (!blog) return null;

    return (
        <div className="min-h-screen bg-white">
            {/* SEO Meta Tags Update (Requires some library if truly SPA, but we can set document title) */}
            <title>{blog.seo_title || blog.title} | ÖdevGPT Blog</title>
            <meta name="description" content={blog.seo_description} />

            {/* Hero Image Section */}
            <div className="w-full h-[60vh] relative overflow-hidden">
                <img
                    src={blog.image_url || "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2070&auto=format&fit=crop"}
                    className="w-full h-full object-cover"
                    alt={blog.title}
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                <div className="absolute inset-0 flex items-center justify-center p-6 mt-16">
                    <div className="max-w-4xl w-full text-center text-white space-y-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Badge className="bg-violet-600 text-white border-0 px-4 py-1 mb-6">Öne Çıkan Makale</Badge>
                            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight drop-shadow-lg">
                                {blog.title}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm md:text-base font-medium text-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-violet-600 border-2 border-white overflow-hidden shadow-lg">
                                        <img src={blog.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author?.full_name}`} alt="" />
                                    </div>
                                    <span>{blog.author?.full_name || 'ÖdevGPT Ekibi'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-yellow-300" />
                                    <span>{new Date(blog.published_at).toLocaleDateString('tr-TR')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-300" />
                                    <span>6 dk okuma</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-white rounded-t-[3rem] p-8 md:p-16 shadow-2xl border-t border-gray-100">
                    <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
                        <Link to="/blog">
                            <Button variant="ghost" className="text-violet-600 hover:bg-violet-50 rounded-full">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Tüm Yazılar
                            </Button>
                        </Link>
                        <div className="flex gap-2">
                            <Button size="icon" variant="outline" className="rounded-full hover:bg-violet-50 text-violet-600" onClick={copyLink}>
                                <Link2 className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" className="rounded-full hover:bg-blue-50 text-blue-600">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" className="rounded-full hover:bg-blue-100 text-blue-700">
                                <Facebook className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <article className="prose prose-lg md:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-gray-700 prose-p:leading-relaxed prose-img:rounded-3xl prose-img:shadow-xl prose-a:text-violet-600">
                        <ReactMarkdown>{blog.content}</ReactMarkdown>
                    </article>

                    <hr className="my-16" />

                    {/* Newsletter or CTA */}
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-10 md:p-16 text-white text-center shadow-xl mb-12 overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-black mb-4">Öğrenme Yolculuğunuza Devam Edin</h3>
                            <p className="text-violet-100 mb-8 max-w-md mx-auto">
                                ÖdevGPT ile sınıf içi başarıyı %40 artırın. Sokratik asistanınız 7/24 yanınızda.
                            </p>
                            <div className="flex justify-center gap-4 flex-wrap">
                                <Link to="/signup">
                                    <Button size="lg" className="bg-white text-violet-700 hover:bg-violet-50 font-bold px-8">Ücretsiz Başla</Button>
                                </Link>
                                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold">Tanıtımı İzle</Button>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mt-32 -mr-32"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
