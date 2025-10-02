import HeroSection from "@/components/HeroSection";
import SocialSection from "@/components/SocialSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <section id="connect">
        <SocialSection />
      </section>
      <Footer />
    </div>
  );
};

export default Index;
