import { CtaSection } from "@/components/sections/cta-section";
import { DataflowSection } from "@/components/sections/dataflow-section";
import { FaqSection } from "@/components/sections/faq-section";
import { HeroSection } from "@/components/sections/hero-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { LogoBar } from "@/components/sections/logo-bar";
import { MarketingFooter } from "@/components/sections/marketing-footer";
import { PricingSection } from "@/components/sections/pricing-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { FeaturesSection } from "@/components/sections/value-section";
import { PageGlowCanvas } from "@/components/ui/page-glow-canvas";

export default function HomePage() {
  return (
    <>
      <PageGlowCanvas>
        <HeroSection />
        <LogoBar />
        <HowItWorksSection />
        <DataflowSection />
        <FeaturesSection />
        <TestimonialSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </PageGlowCanvas>
      <MarketingFooter />
    </>
  );
}
