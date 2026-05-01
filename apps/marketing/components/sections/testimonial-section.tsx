import { MarketingContainer } from "@/components/ui/container";
import { testimonials } from "@/content/landing";

export function TestimonialSection() {
  const [featured, ...rest] = testimonials.items;

  return (
    <section className="bg-[var(--j-canopy)] py-[88px]">
      <MarketingContainer>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--j-ember)]">
          {testimonials.label}
        </p>
        <h2
          className="mb-14 text-[var(--j-mist)]"
          style={{
            fontFamily: "var(--j-font-serif)",
            fontSize: "clamp(30px, 4vw, 46px)",
            fontWeight: 400,
            lineHeight: 1.15,
          }}
        >
          {testimonials.heading}{" "}
          <em className="not-italic" style={{ color: "var(--j-ember)" }}>
            {testimonials.headingEm}
          </em>
          <br />
          {testimonials.headingSuffix}
        </h2>

        <div className="grid gap-[14px] md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Featured card — ember */}
          <div className="flex flex-col rounded-[var(--j-radius-lg)] border-[0.5px] border-[var(--j-ember)] bg-[var(--j-ember)] p-7">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-[20px] bg-black/15 px-2.5 py-1 text-[11px] font-medium text-[var(--j-mist)]">
              <span className="size-1.5 rounded-full bg-[var(--j-mist)]" aria-hidden />
              {featured.company}
            </div>
            <blockquote
              className="mb-5 flex-1 text-[var(--j-mist)]"
              style={{
                fontFamily: "var(--j-font-serif)",
                fontSize: "16px",
                fontStyle: "italic",
                fontWeight: 400,
                lineHeight: 1.55,
              }}
            >
              "{featured.quote}"
            </blockquote>
            <div className="flex items-center gap-2.5">
              <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-white/25 text-[12px] font-medium text-[var(--j-mist)]">
                {featured.initials}
              </span>
              <div>
                <p className="text-[13px] font-medium text-[var(--j-mist)]">{featured.name}</p>
                <p className="text-[12px] text-[var(--j-mist)]/60">{featured.role}</p>
              </div>
            </div>
          </div>

          {/* Regular cards — canopy surface with darker border */}
          {rest.map((item) => (
            <div
              key={item.name}
              className="flex flex-col rounded-[var(--j-radius-lg)] border-[0.5px] border-[#1a3038] bg-[var(--j-canopy)] p-7"
            >
              <blockquote
                className="mb-5 flex-1 text-[var(--j-slate)]"
                style={{
                  fontFamily: "var(--j-font-serif)",
                  fontSize: "16px",
                  fontStyle: "italic",
                  fontWeight: 400,
                  lineHeight: 1.55,
                }}
              >
                "{item.quote}"
              </blockquote>
              <div className="flex items-center gap-2.5">
                <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[var(--j-ember)] text-[12px] font-medium text-[var(--j-mist)]">
                  {item.initials}
                </span>
                <div>
                  <p className="text-[13px] font-medium text-[var(--j-slate)]">{item.name}</p>
                  <p className="text-[12px] text-[var(--j-slate)]/70">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </MarketingContainer>
    </section>
  );
}
