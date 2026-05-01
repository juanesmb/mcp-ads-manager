import { MarketingContainer } from "@/components/ui/container";
import { PrimaryCta } from "@/components/ui/primary-cta";
import { pricing } from "@/content/landing";
import { getAppHref } from "@/lib/env";

export function PricingSection() {
  const appHref = getAppHref();

  return (
    <section id="pricing" className="bg-[var(--j-deep-teal)] py-[88px]">
      <MarketingContainer>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--j-ember)]">
          {pricing.label}
        </p>
        <h2
          className="mb-4 text-[var(--j-mist)]"
          style={{
            fontFamily: "var(--j-font-serif)",
            fontSize: "clamp(30px, 4vw, 46px)",
            fontWeight: 400,
            lineHeight: 1.15,
          }}
        >
          {pricing.heading}{" "}
          <em className="not-italic" style={{ color: "var(--j-ember)" }}>
            {pricing.headingEm}
          </em>{" "}
          {pricing.headingSuffix}
        </h2>
        <p className="mb-14 max-w-[540px] text-[16px] leading-relaxed text-[var(--j-slate)]">
          {pricing.sub}
        </p>

        <div className="max-w-[460px] overflow-hidden rounded-[var(--j-radius-lg)] border-[0.5px] border-[#1a3038] bg-[var(--j-canopy)]">
          <div className="px-7 pb-6 pt-7">
            {/* Fern early-access label */}
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--j-fern)]">
              {pricing.planLabel}
            </p>

            {/* Instrument Serif price in mist */}
            <div className="mb-1.5 flex items-baseline gap-1">
              <span
                className="leading-none text-[var(--j-mist)]"
                style={{
                  fontFamily: "var(--j-font-serif)",
                  fontSize: "52px",
                  fontWeight: 400,
                }}
              >
                ${pricing.priceUsd}
              </span>
              <span className="mb-1 text-[14px] text-[var(--j-slate)]">
                / {pricing.billingCadence}
              </span>
            </div>
            <p className="mb-6 text-[13px] text-[var(--j-slate)]">{pricing.tagline}</p>

            {/* Ember-tinted trial callout */}
            <div
              className="mb-6 flex items-center gap-3 rounded-[var(--j-radius-md)] px-4 py-3"
              style={{
                background: "rgba(200,96,26,0.15)",
                border: "0.5px solid rgba(200,96,26,0.30)",
              }}
            >
              <span className="text-[18px]">🎁</span>
              <div>
                <p className="text-[13px] font-medium text-[var(--j-mist)]">
                  {pricing.trialCallout.title}
                </p>
                <p className="text-[12px] text-[var(--j-slate)]">{pricing.trialCallout.sub}</p>
              </div>
            </div>

            {/* Fern ✓ bullet list, mist text */}
            <ul className="flex flex-col gap-2.5">
              {pricing.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-[13px] text-[var(--j-mist)]">
                  <span className="font-medium text-[var(--j-fern)]" aria-hidden>
                    ✓
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Dark overlay footer */}
          <div
            className="flex flex-col gap-2.5 border-t-[0.5px] border-[#1a3038] px-7 py-5"
            style={{ background: "rgba(0,0,0,0.15)" }}
          >
            <PrimaryCta href={appHref} large className="w-full justify-center">
              Start your free trial →
            </PrimaryCta>
            <p className="text-center text-[12px] text-[var(--j-slate)]">{pricing.note}</p>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
