import { MarketingContainer } from "@/components/ui/container";

const bullets = [
  "Pods juggle dozens of accounts and tabs — every question becomes an export chase.",
  "Leaders want weekly reads without commissioning another BI one-off.",
  "Sensitive spend and structure data shouldn't disappear into ungoverned pasted prompts.",
] as const;

export function ProblemSection() {
  return (
    <section className="bg-background py-16">
      <MarketingContainer>
        <h2 className="max-w-sm text-xl text-foreground md:text-2xl">
          The cost of living in browser tabs
        </h2>
        <ul className="mt-8 space-y-5">
          {bullets.map((text) => (
            <li
              key={text}
              className="flex gap-4 border-l-[0.5px] border-[var(--j-sage)] pl-5 leading-relaxed text-muted-foreground"
            >
              {text}
            </li>
          ))}
        </ul>
      </MarketingContainer>
    </section>
  );
}
