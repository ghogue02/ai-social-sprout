
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-allendale-black">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 font-serif gold-gradient">404</h1>
        <p className="text-xl text-gray-200 mb-6">Page not found</p>
        <Button asChild className="bg-allendale-gold text-black hover:bg-allendale-gold/80">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
