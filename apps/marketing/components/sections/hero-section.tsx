import { MarketingContainer } from "@/components/ui/container";
import { OutlineCta } from "@/components/ui/outline-cta";
import { PrimaryCta } from "@/components/ui/primary-cta";
import { heroBadge, hero } from "@/content/landing";
import { getAppHref } from "@/lib/env";

export function HeroSection() {
  const appHref = getAppHref();

  return (
    <section className="bg-[var(--j-deep-teal)]">
      <MarketingContainer className="pb-20 pt-24 text-center">
        {/* Early access badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-[20px] border-[0.5px] border-[var(--j-fern)] bg-[var(--j-canopy)] px-3.5 py-[5px] text-[12px] font-medium tracking-[0.04em] text-[var(--j-fern)]">
          <span
            aria-hidden
            className="size-1.5 shrink-0 animate-pulse rounded-full bg-[var(--j-fern)]"
          />
          {heroBadge}
        </div>

        <h1
          className="mx-auto mb-3 max-w-[820px] leading-[1.1] text-[var(--j-mist)]"
          style={{
            fontFamily: "var(--j-font-serif)",
            fontSize: "clamp(42px, 6vw, 72px)",
            fontWeight: 400,
          }}
        >
          {hero.title}
          <br />
          <em className="not-italic" style={{ color: "var(--j-harvest)" }}>
            {hero.titleEm}
          </em>
        </h1>

        <p className="mx-auto mb-11 max-w-[520px] text-[17px] leading-relaxed text-[var(--j-slate)]">
          {hero.subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <PrimaryCta href={appHref} large>
            {hero.primaryCta}
          </PrimaryCta>
          <OutlineCta
            href={hero.secondaryHref}
            className="border-[var(--j-slate)]/50 bg-transparent px-7 py-3 text-sm text-[var(--j-mist)] hover:bg-[var(--j-canopy)]"
          >
            {hero.secondaryCta}
          </OutlineCta>
        </div>

        <p className="mt-5 text-[12px] text-[var(--j-slate)]">{hero.note}</p>
      </MarketingContainer>
    </section>
  );
}
