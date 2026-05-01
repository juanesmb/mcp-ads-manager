import { MarketingContainer } from "@/components/ui/container";
import { faq } from "@/content/landing";

export function FaqSection() {
  return (
    <section id="faq" className="bg-background py-16">
      <MarketingContainer>
        <h2 className="text-xl text-foreground md:text-2xl">FAQ</h2>
        <div className="mt-8 divide-y-[0.5px] divide-[#1a3038] rounded-[var(--j-radius-lg)] border-[0.5px] border-border bg-card">
          {faq.map((item) => (
            <details key={item.question} className="group px-6 py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-foreground marker:content-none">
                {item.question}
                <span
                  aria-hidden
                  className="ml-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </MarketingContainer>
    </section>
  );
}
