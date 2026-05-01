import { PrimaryCta } from "@/components/ui/primary-cta";
import { ctaSection } from "@/content/landing";
import { getAppHref } from "@/lib/env";

export function CtaSection() {
  const appHref = getAppHref();

  return (
    <section className="relative overflow-hidden bg-[var(--j-deep-teal)] px-8 py-[100px] text-center">
      {/* Subtle radial ember glow — decorative depth, marketing-only */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-200px] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(200,96,26,0.10) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-[860px]">
        <h2
          className="mx-auto mb-4 max-w-[580px] text-[var(--j-mist)]"
          style={{
            fontFamily: "var(--j-font-serif)",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 400,
            lineHeight: 1.15,
          }}
        >
          {ctaSection.heading.split("\n").map((line, i) =>
            i === 0 ? (
              <span key={i}>
                {line}
                <br />
              </span>
            ) : (
              <span key={i}>
                {line}{" "}
                <em className="not-italic" style={{ color: "var(--j-harvest)" }}>
                  {ctaSection.headingEm}
                </em>
              </span>
            )
          )}
        </h2>

        <p className="mx-auto mb-10 max-w-[420px] text-[16px] leading-relaxed text-[var(--j-slate)]">
          {ctaSection.sub}
        </p>

        <PrimaryCta href={appHref} large>
          {ctaSection.cta}
        </PrimaryCta>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-6">
          {ctaSection.trust.map((item) => (
            <div key={item} className="flex items-center gap-1.5 text-[12px] text-[var(--j-slate)]">
              <span className="text-[var(--j-fern)]">✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
