import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, BellDot, Check, Trash2, ExternalLink } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface Notification {
    id: string;
    title: string;
    content: string;
    type: string;
    link: string;
    is_read: boolean;
    created_at: string;
}

export default function NotificationBell() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        fetchNotifications();

        // Realtime notification listener
        const channel = supabase
            .channel(`user-notifications-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                },
                () => {
                    fetchNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const fetchNotifications = async () => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (!error && data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        }
    };

    const markAsRead = async (id: string) => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);
        fetchNotifications();
    };

    const markAllAsRead = async () => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user?.id)
            .eq('is_read', false);
        fetchNotifications();
    };

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);
        if (notification.link) {
            navigate(notification.link);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative transition-all hover:bg-primary/10 rounded-full group">
                    {unreadCount > 0 ? (
                        <>
                            <BellDot className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        </>
                    ) : (
                        <Bell className="w-5 h-5 text-muted-foreground group-hover:scale-110 transition-transform" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-2xl border-primary/10 animate-in slide-in-from-top-2">
                <DropdownMenuLabel className="p-4 flex items-center justify-between bg-muted/30">
                    <span className="font-bold">Bildirimler</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-[10px] h-7 px-2 text-primary hover:text-primary/80 hover:bg-primary/5"
                        >
                            Hepsini Okundu İşaretle
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="m-0" />
                <ScrollArea className="h-80">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground space-y-2">
                            <Bell className="w-8 h-8 mx-auto opacity-20" />
                            <p className="text-xs">Henüz bildiriminiz yok.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`p-4 border-b last:border-0 cursor-pointer transition-all hover:bg-muted/50 group relative ${!n.is_read ? 'bg-primary/5' : ''}`}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="space-y-1">
                                            <p className={`text-xs font-bold leading-none ${!n.is_read ? 'text-primary' : ''}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                                                {n.content}
                                            </p>
                                        </div>
                                        {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />}
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[9px] text-muted-foreground italic">
                                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: tr })}
                                        </span>
                                        {n.link && <ExternalLink className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <DropdownMenuSeparator className="m-0" />
                <div className="p-2 text-center">
                    <Button variant="ghost" size="sm" className="w-full text-[10px] text-muted-foreground">
                        Tüm Bildirimleri Gör
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
