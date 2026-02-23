import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface Profile {
    id: string;
    role: 'student' | 'teacher' | 'admin' | 'parent';
    full_name: string | null;
    grade_level: number | null;
    field: string | null;
    avatar_url: string | null;
    xp: number;
    level: number;
    streak: number;
    parent_access_code: string | null;
    last_activity_at: string;
    notification_preferences?: {
        question_answered?: boolean;
        weekly_report?: boolean;
        new_tasks?: boolean;
        student_activity?: boolean;
        assignment_graded?: boolean;
    };
    tenant_id: string | null;
    is_super_admin: boolean;
    referral_code: string | null;
    referred_by_code: string | null;
    tenants?: { name: string } | null;
}

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, fullName: string, role?: string, tenantId?: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;

        // Get initial session
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (!mounted) return;

            if (error) {
                // Sadece kritik hataları göster, refresh hatalarını temizle
                if (error.message.includes("refresh_token_not_found") || error.message.includes("Refresh Token Not Found")) {
                    console.warn("Auth Session: Refresh token expired, signing out...");
                    localStorage.removeItem('sb-' + (new URL(import.meta.env.VITE_SUPABASE_URL)).hostname.split('.')[0] + '-auth-token');
                    supabase.auth.signOut();
                } else {
                    console.error("Auth session error:", error.message);
                }
            }

            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (!mounted) return;

            console.log(`Auth Event: ${event}`);

            // Eğer event TOKEN_REFRESHED ise ve elimizdeki session zaten varsa, 
            // state güncellemeye gerek yok (re-render'ı önler)
            if (event === 'TOKEN_REFRESHED' && session?.access_token === currentSession?.access_token) {
                return;
            }

            setSession(currentSession);
            setUser(currentSession?.user ?? null);

            if (event === 'SIGNED_IN') {
                if (currentSession?.user) {
                    fetchProfile(currentSession.user.id);
                }
            } else if (event === 'SIGNED_OUT') {
                setProfile(null);
                setLoading(false);
                // Hard cleanup for token errors
                localStorage.removeItem('sb-' + (new URL(import.meta.env.VITE_SUPABASE_URL)).hostname.split('.')[0] + '-auth-token');
            } else if (event === 'INITIAL_SESSION') {
                if (currentSession?.user) {
                    fetchProfile(currentSession.user.id);
                } else {
                    setLoading(false);
                }
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [session?.access_token]);

    const fetchProfile = async (userId: string) => {
        setLoading(true);
        setProfile(null);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*, tenants(name)')
                .eq('id', userId)
                .single();

            if (error) {
                // Eğer profil yoksa (PGRST116), otomatik oluşturmayı dene (Fallback)
                if (error.code === 'PGRST116') {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        const newProfile = {
                            id: user.id,
                            full_name: user.user_metadata.full_name || 'Yeni Kullanıcı',
                            role: user.user_metadata.role || 'student',
                        };
                        const { data: createdProfile, error: createError } = await supabase
                            .from('profiles')
                            .insert(newProfile)
                            .select()
                            .single();

                        if (!createError) {
                            setProfile(createdProfile);
                            return;
                        }
                    }
                }
                throw error;
            }
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        navigate('/dashboard');
    };

    const signUp = async (email: string, password: string, fullName: string, role: string = 'student', tenantId?: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                    tenant_id: tenantId,
                },
            },
        });
        if (error) throw error;

        // Profile otomatik oluşturulacak (trigger sayesinde)
        // Ama role'ü güncellememiz gerekebilir (Eğer trigger'da bir aksilik olursa veya anlık güncelleme gerekirse)
        if (data.user && (role !== 'student' || tenantId)) {
            await supabase
                .from('profiles')
                .update({ role, tenant_id: tenantId })
                .eq('id', data.user.id);
        }

        navigate('/dashboard');
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        navigate('/');
    };

    const value = {
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
