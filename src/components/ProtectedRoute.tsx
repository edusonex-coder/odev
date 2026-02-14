import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireRole?: "student" | "teacher" | "admin";
}

export default function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
    const { user, profile, loading } = useAuth();

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check role if required
    if (requireRole && profile?.role !== requireRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🚫</span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Erişim Reddedildi</h1>
                    <p className="text-muted-foreground mb-6">
                        Bu sayfaya erişim yetkiniz bulunmamaktadır.
                    </p>
                    <Navigate to="/dashboard" replace />
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
