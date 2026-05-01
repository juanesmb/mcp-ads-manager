import { MarketingContainer } from "@/components/ui/container";
import { testimonials } from "@/content/landing";

export function TestimonialSection() {
  const [featured, ...rest] = testimonials.items;

  return (
    <section className="border-y-[0.5px] border-border bg-card py-[88px]">
      <MarketingContainer>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--j-ember)]">
          {testimonials.label}
        </p>
        <h2
          className="mb-14 text-foreground"
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
          {/* Featured card — deep teal */}
          <div className="flex flex-col rounded-[var(--j-radius-lg)] border-[0.5px] border-[var(--j-canopy)] bg-[var(--j-deep-teal)] p-7">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-[20px] bg-[var(--j-canopy)] px-2.5 py-1 text-[11px] font-medium text-[var(--j-fern)]">
              <span className="size-1.5 rounded-full bg-[var(--j-fern)]" aria-hidden />
              {featured.company}
            </div>
            <blockquote
              className="mb-5 flex-1 leading-[1.55] text-[var(--j-mist)]"
              style={{
                fontFamily: "var(--j-font-serif)",
                fontSize: "17px",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              "{featured.quote}"
            </blockquote>
            <div className="flex items-center gap-2.5">
              <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[var(--j-ember)] text-[12px] font-medium text-[var(--j-mist)]">
                {featured.initials}
              </span>
              <div>
                <p className="text-[13px] font-medium text-[var(--j-mist)]">{featured.name}</p>
                <p className="text-[12px] text-[var(--j-slate)]">{featured.role}</p>
              </div>
            </div>
          </div>

          {/* Regular cards — mist */}
          {rest.map((item) => (
            <div
              key={item.name}
              className="flex flex-col rounded-[var(--j-radius-lg)] border-[0.5px] border-border bg-[var(--j-mist)] p-7"
            >
              <blockquote
                className="mb-5 flex-1 leading-[1.55] text-[var(--j-deep-teal)]"
                style={{
                  fontFamily: "var(--j-font-serif)",
                  fontSize: "17px",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                "{item.quote}"
              </blockquote>
              <div className="flex items-center gap-2.5">
                <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[var(--j-ember)] text-[12px] font-medium text-[var(--j-mist)]">
                  {item.initials}
                </span>
                <div>
                  <p className="text-[13px] font-medium text-foreground">{item.name}</p>
                  <p className="text-[12px] text-[var(--j-slate)]">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </MarketingContainer>
    </section>
  );
}
