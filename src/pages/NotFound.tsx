import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SearchX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="rounded-full bg-secondary/50 p-6 mb-6">
        <SearchX className="h-16 w-16 text-muted-foreground opacity-50" />
      </div>

      <h1 className="mb-2 text-4xl font-bold tracking-tight">Oops! Sayfa Bulunamadı</h1>
      <p className="mb-8 text-lg text-muted-foreground max-w-md">
        Aradığın sayfa kitabın sayfaları arasında kaybolmuş olabilir. Sözelciler bile bulamazdı!
      </p>

      <Link to="/">
        <Button size="lg" className="gradient-primary text-primary-foreground shadow-glow">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anasayfaya Dön
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
