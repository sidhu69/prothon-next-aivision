import { Instagram, Youtube, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const socialLinks = [
  {
    name: "Instagram",
    handle: "@Prothonai",
    description: "Follow us for updates and behind-the-scenes content",
    icon: Instagram,
    url: "https://instagram.com/prothonai",
    color: "from-pink-500 to-purple-500",
  },
  {
    name: "YouTube",
    handle: "Prothon",
    description: "Subscribe for tutorials, demos, and tech insights",
    icon: Youtube,
    url: "#youtube",
    color: "from-red-500 to-red-600",
  },
  {
    name: "Telegram",
    handle: "Support Channel",
    description: "Get help from developers and join discussions",
    icon: Send,
    url: "#telegram",
    color: "from-blue-400 to-blue-600",
  },
];

const SocialSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Users className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">Join Our Community</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Connect With Us
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay updated, get support, and be part of our growing community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {socialLinks.map((social, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden bg-card/50 backdrop-blur-xl border-border/50 hover:border-accent/50 transition-all duration-500 hover:shadow-[0_0_40px_hsl(190_95%_50%/0.2)] cursor-pointer"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <div className="relative p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${social.color} shadow-lg group-hover:shadow-2xl transition-shadow duration-500 group-hover:scale-110 transform transition-transform`}>
                    <social.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-2">{social.name}</h3>
                <p className="text-accent font-semibold mb-3">{social.handle}</p>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed min-h-[3rem]">
                  {social.description}
                </p>

                <Button 
                  variant="outline" 
                  className="w-full border-accent/30 hover:bg-accent/10 hover:border-accent transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(190_95%_50%/0.3)]"
                  asChild
                >
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    Follow / Join
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Developer Support Note */}
        <div className="mt-16 text-center">
          <Card className="inline-block bg-primary/5 border-primary/20 backdrop-blur-xl px-8 py-4">
            <p className="text-muted-foreground">
              💬 <span className="text-foreground font-semibold">Need developer support?</span> Join our Telegram channel for direct help from our team
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SocialSection;
