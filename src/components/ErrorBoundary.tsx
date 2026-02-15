import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center space-y-6 bg-background">
                    <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center animate-pulse">
                        <AlertTriangle className="w-10 h-10 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tight text-foreground">Ups! Bir Şeyler Ters Gitti</h1>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Beklenmedik bir hata ile karşılaştık. Endişelenmeyin, bu durum teknik ekibimize iletildi.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={() => window.location.reload()}
                            className="rounded-xl px-8"
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" /> Sayfayı Yenile
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = '/'}
                            className="rounded-xl px-8"
                        >
                            <Home className="w-4 h-4 mr-2" /> Ana Sayfaya Dön
                        </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-8">
                        OdevGPT Error Handling System
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
