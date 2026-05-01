import { MarketingContainer } from "@/components/ui/container";
import { features } from "@/content/landing";

export function FeaturesSection() {
  return (
    <section className="bg-[var(--j-deep-teal)] py-[88px]">
      <MarketingContainer>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--j-harvest)]">
          {features.label}
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
          Everything your agent needs
          <br />
          to{" "}
          <em className="not-italic" style={{ color: "var(--j-ember)" }}>
            {features.headingEm}
          </em>{" "}
          {features.headingSuffix}
        </h2>
        <p className="mb-14 max-w-[540px] text-[16px] leading-relaxed text-[var(--j-slate)]">
          {features.sub}
        </p>

        <div className="grid gap-[14px] md:grid-cols-2">
          {features.cards.map((card) => (
            <div
              key={card.title}
              className="rounded-[var(--j-radius-lg)] border-[0.5px] border-[#1a3038] bg-[var(--j-canopy)] p-7"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-[10px] text-[18px]" style={{ background: "rgba(244,248,247,0.08)" }}>
                {card.icon}
              </div>
              <h3 className="mb-2 text-[15px] font-medium text-[var(--j-mist)]">
                {card.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-[var(--j-slate)]">
                {card.body}
              </p>
            </div>
          ))}

          {/* Full-width Ember highlight card */}
          <div className="col-span-full flex flex-col items-start justify-between gap-6 rounded-[var(--j-radius-lg)] border-[var(--j-ember)] bg-[var(--j-ember)] p-8 sm:flex-row sm:items-center">
            <div>
              <h3
                className="mb-2 text-[var(--j-mist)]"
                style={{
                  fontFamily: "var(--j-font-serif)",
                  fontSize: "24px",
                  fontWeight: 400,
                }}
              >
                {features.highlight.title}
              </h3>
              <p className="max-w-[400px] text-[13px] leading-relaxed text-[var(--j-mist)]/75">
                {features.highlight.body}
              </p>
            </div>
            <span className="shrink-0 rounded-[20px] bg-white/15 px-3.5 py-1.5 text-[12px] font-medium text-[var(--j-mist)] whitespace-nowrap">
              {features.highlight.badge}
            </span>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
