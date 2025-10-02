import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AppsSection from "@/components/AppsSection";
import Footer from "@/components/Footer";

const Apps = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container px-4 py-4">
          <Link to="/">
            <Button variant="ghost" className="gap-2 hover:bg-primary/10">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <AppsSection />
      <Footer />
    </div>
  );
};

export default Apps;
