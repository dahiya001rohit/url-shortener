import HeroSection from "../components/sections/HeroSection";
import StatsBar from "../components/sections/StatsBar";
import FeaturesSection from "../components/sections/FeaturesSection";
import HowItWorks from "../components/sections/HowItWorks";
import CTABanner from "../components/sections/CTABanner";

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <div id="analytics"><StatsBar /></div>
      <div id="features"><FeaturesSection /></div>
      <HowItWorks />
      <div id="cta"><CTABanner /></div>
    </main>
  );
}
