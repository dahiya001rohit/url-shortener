import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import StatsBar from "../components/sections/StatsBar";
import FeaturesSection from "../components/sections/FeaturesSection";
import HowItWorks from "../components/sections/HowItWorks";
import CTABanner from "../components/sections/CTABanner";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <HowItWorks />
      <CTABanner />
      <Footer />
    </main>
  );
}
