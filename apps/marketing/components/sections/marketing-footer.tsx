import { MarketingContainer } from "@/components/ui/container";
import { footer } from "@/content/landing";
import { getAppHref } from "@/lib/env";

export function MarketingFooter() {
  const appHref = getAppHref();

  return (
    <footer className="border-t-[0.5px] border-[var(--j-canopy)] bg-[var(--j-canopy)]">
      <MarketingContainer className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <span className="text-[12px] font-medium tracking-[0.12em] text-[var(--j-slate)] uppercase">
          JUMON
        </span>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-6 text-[12px]">
          <span className="text-[var(--j-slate)]">{footer.trademark}</span>
          <a
            href="#"
            className="text-[var(--j-slate)] transition-colors hover:text-[var(--j-mist)]"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-[var(--j-slate)] transition-colors hover:text-[var(--j-mist)]"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-[var(--j-slate)] transition-colors hover:text-[var(--j-mist)]"
          >
            Docs
          </a>
          <a
            href="#"
            className="text-[var(--j-slate)] transition-colors hover:text-[var(--j-mist)]"
          >
            Contact
          </a>
          <a
            href={appHref}
            className="font-medium text-[var(--j-mist)] underline-offset-4 transition-colors hover:underline"
          >
            {footer.secondaryLinkLabel}
          </a>
        </nav>

        <span className="rounded-[20px] bg-[var(--j-deep-teal)] px-2.5 py-1 text-[11px] text-[var(--j-fern)]">
          {footer.earlyAccessBadge}
        </span>
      </MarketingContainer>
    </footer>
  );
}
