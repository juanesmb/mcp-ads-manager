import { CtaSection } from "@/components/sections/cta-section";
import { FaqSection } from "@/components/sections/faq-section";
import { HeroSection } from "@/components/sections/hero-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { LogoBar } from "@/components/sections/logo-bar";
import { MarketingFooter } from "@/components/sections/marketing-footer";
import { PricingSection } from "@/components/sections/pricing-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { FeaturesSection } from "@/components/sections/value-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LogoBar />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <MarketingFooter />
    </>
  );
}
