import { MarketingContainer } from "@/components/ui/container";
import { howItWorks } from "@/content/landing";
import { FadeUp } from "@/components/ui/fade-up";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-background py-[88px]">
      <MarketingContainer>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--j-ember)]">
          {howItWorks.label}
        </p>
        <h2
          className="mb-4 text-foreground"
          style={{
            fontFamily: "var(--j-font-serif)",
            fontSize: "clamp(30px, 4vw, 46px)",
            fontWeight: 400,
            lineHeight: 1.15,
          }}
        >
          {howItWorks.heading}{" "}
          <em className="not-italic" style={{ color: "var(--j-ember)" }}>
            {howItWorks.headingEm}
          </em>
        </h2>
        <p className="mb-14 max-w-[540px] text-[16px] leading-relaxed text-[var(--j-slate)]">
          {howItWorks.sub}
        </p>

        <ol className="grid gap-[14px] md:grid-cols-3">
          {howItWorks.steps.map((step, i) => (
            <li key={step.num}>
              <FadeUp delay={i * 80} className="flex h-full flex-col overflow-hidden rounded-[var(--j-radius-lg)] border-[0.5px] border-border bg-card">
              <div className="flex flex-col px-6 pb-5 pt-6">
                <span
                  className="mb-4 leading-none text-[var(--j-sage)]"
                  style={{
                    fontFamily: "var(--j-font-serif)",
                    fontSize: "36px",
                    fontWeight: 400,
                  }}
                >
                  {step.num}
                </span>
                <h3 className="mb-2 text-[15px] font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-[var(--j-slate)]">
                  {step.body}
                </p>
              </div>
              </FadeUp>
            </li>
          ))}
        </ol>
      </MarketingContainer>
    </section>
  );
}
