import { Heart, Code } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 backdrop-blur-xl">
      <div className="container px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
              Prothon
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Building intelligent applications with cutting-edge AI technology. 
              Transforming ideas into reality.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/apps" className="hover:text-accent transition-colors">Our Apps</a>
              </li>
              <li>
                <a href="https://instagram.com/prothonai" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#telegram" className="hover:text-accent transition-colors">Telegram Support</a>
              </li>
              <li>
                <a href="#youtube" className="hover:text-accent transition-colors">YouTube Channel</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Connect</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Follow us on social media for updates
            </p>
            <p className="text-sm">
              <span className="text-accent font-semibold">@Prothonai</span>
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            Made with <Heart className="w-4 h-4 fill-red-500 text-red-500 animate-pulse" /> and <Code className="w-4 h-4 text-accent" /> by Prothon Team
          </p>
          <p>
            © {new Date().getFullYear()} Prothon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
