import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="AI Technology Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Radial gradient glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,hsl(270_80%_60%/0.15),transparent_70%)]" />

      {/* Content */}
      <div className="container relative z-10 px-4 py-20 text-center">
        <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in">
          <Sparkles className="w-6 h-6 text-accent" />
          <span className="text-accent font-semibold tracking-wider uppercase text-sm">
            High Intelligence Technology
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in-up">
          Prothon
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
          Building the future with artificial intelligence. 
          We create cutting-edge applications that transform possibilities into reality.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
          <Button 
            size="lg" 
            className="group bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_40px_hsl(270_80%_60%/0.5)] transition-all duration-500 text-lg px-8"
          >
            Explore Our Apps
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-300 text-lg px-8"
          >
            Join Community
          </Button>
        </div>

        {/* Social proof */}
        <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in animation-delay-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>AI-Powered Apps</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse animation-delay-200" />
            <span>Active Community</span>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
