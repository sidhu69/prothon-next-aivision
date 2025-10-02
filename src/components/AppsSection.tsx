import { Download, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import astrologerIcon from "@/assets/astrologer-icon.png";

const AppsSection = () => {
  return (
    <section id="apps" className="py-24 relative">
      <div className="container px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">Our Applications</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Explore Our Apps
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover intelligent applications powered by advanced AI technology
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden bg-card/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_0_60px_hsl(270_80%_60%/0.3)] group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* App Icon */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <img 
                    src={astrologerIcon} 
                    alt="Pro AI Astrologer Icon" 
                    className="relative w-32 h-32 rounded-3xl shadow-2xl ring-2 ring-primary/50"
                  />
                </div>

                {/* App Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                    Pro AI Astrologer
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Experience the fusion of ancient wisdom and modern AI. Get personalized astrological insights powered by advanced artificial intelligence.
                  </p>

                  <div className="flex items-center gap-4 mb-6 justify-center md:justify-start">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">Featured App</span>
                  </div>

                  <Button 
                    size="lg" 
                    className="group bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_30px_hsl(270_80%_60%/0.5)] transition-all duration-500"
                  >
                    <Download className="mr-2 w-5 h-5 group-hover:animate-bounce" />
                    Download APK
                  </Button>

                  <p className="text-xs text-muted-foreground mt-3">
                    Android 6.0 and above
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Coming Soon Teaser */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              More innovative apps coming soon... Stay tuned! 🚀
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppsSection;
