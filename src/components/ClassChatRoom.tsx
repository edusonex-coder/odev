import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Trash2, User, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Message {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
        full_name: string;
        avatar_url: string;
        role: string;
    };
}

interface ClassChatRoomProps {
    classId: string;
    isTeacher?: boolean;
}

export default function ClassChatRoom({ classId, isTeacher }: ClassChatRoomProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMessages();

        // Realtime subscription
        const channel = supabase
            .channel(`class-chat-${classId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'class_messages',
                    filter: `class_id=eq.${classId}`
                },
                (payload) => {
                    // Yeni mesaj geldiğinde profili ile beraber çekmek için fetchMessages'ı tetikleyebiliriz
                    // Veya daha performanslı olması için payload'u direkt ekleyebiliriz (tabii user verisi gerek)
                    fetchMessages();
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'class_messages',
                },
                () => fetchMessages()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [classId]);

    useEffect(() => {
        // Otomatik aşağı kaydır
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('class_messages')
                .select(`
                    id,
                    content,
                    created_at,
                    user_id,
                    profiles:user_id (
                        full_name,
                        avatar_url,
                        role
                    )
                `)
                .eq('class_id', classId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages(data as any || []);
        } catch (error) {
            console.error('Messages fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        try {
            setSending(true);
            const { error } = await supabase.from('class_messages').insert({
                class_id: classId,
                user_id: user.id,
                content: newMessage.trim()
            });

            if (error) throw error;
            setNewMessage('');
        } catch (error: any) {
            toast({
                title: 'Hata',
                description: 'Mesaj gönderilemedi.',
                variant: 'destructive'
            });
        } finally {
            setSending(false);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            const { error } = await supabase
                .from('class_messages')
                .delete()
                .eq('id', messageId);

            if (error) throw error;
            toast({ description: 'Mesaj silindi.' });
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Mesaj silinemedi.',
                variant: 'destructive'
            });
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-card rounded-3xl border shadow-sm overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="font-bold text-sm">Sınıf Sohbeti</h3>
                </div>
                <Badge variant="outline" className="text-[10px] opacity-70">Canlı</Badge>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-40">
                        <Sparkles className="w-8 h-8" />
                        <p className="text-xs italic">Henüz mesaj yok. İlk mesajı sen gönder!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {messages.map((msg) => {
                            const isMe = msg.user_id === user?.id;
                            const isAdmin = msg.profiles.role === 'teacher' || msg.profiles.role === 'admin';

                            return (
                                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                    <Avatar className="w-8 h-8 mt-1 border shadow-sm">
                                        <AvatarImage src={msg.profiles.avatar_url} />
                                        <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                    </Avatar>
                                    <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : ''}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-gray-500">
                                                {msg.profiles.full_name}
                                            </span>
                                            {isAdmin && (
                                                <Badge className="text-[8px] h-3.5 px-1 bg-primary/10 text-primary border-none">Öğretmen</Badge>
                                            )}
                                        </div>
                                        <div className={`
                                            p-3 rounded-2xl text-sm relative group
                                            ${isMe
                                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                : 'bg-muted rounded-tl-none'}
                                        `}>
                                            {msg.content}

                                            {/* Delete Action (Show on hover for teacher or owner) */}
                                            {(isTeacher || isMe) && (
                                                <button
                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                    className={`
                                                        absolute -top-2 -right-2 p-1 bg-destructive text-white rounded-full 
                                                        opacity-0 group-hover:opacity-100 transition-opacity shadow-lg
                                                        ${isMe ? '-left-2 right-auto' : ''}
                                                    `}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                        <span className="text-[8px] text-muted-foreground mt-1">
                                            {format(new Date(msg.created_at), 'HH:mm', { locale: tr })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </ScrollArea>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-muted/10 flex gap-2">
                <Input
                    placeholder="Mesajını yaz..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="rounded-2xl border-none bg-white shadow-sm focus-visible:ring-primary"
                    disabled={sending}
                />
                <Button
                    type="submit"
                    size="icon"
                    className="rounded-full shrink-0 shadow-lg shadow-primary/20"
                    disabled={!newMessage.trim() || sending}
                >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
            </form>
        </div>
    );
}


