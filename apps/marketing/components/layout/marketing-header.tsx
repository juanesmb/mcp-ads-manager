import Link from "next/link";
import { getAppHref } from "@/lib/env";

export function MarketingHeader() {
  const appHref = getAppHref();

  return (
    <>
      <header>
        <nav
          aria-label="Main"
          className="flex h-[52px] items-center justify-between bg-[var(--j-deep-teal)] px-8"
        >
          <Link
            href="/"
            className="rounded-[var(--j-radius-sm)] border border-[var(--j-ember)] px-3.5 py-1.5 text-sm font-medium tracking-[0.12em] text-[var(--j-mist)] uppercase"
          >
            JUMON
          </Link>
          <div className="flex items-center gap-8">
            <div className="hidden items-center gap-8 md:flex">
              <a
                href="#how-it-works"
                className="text-[13px] font-normal text-[var(--j-slate)] transition-colors hover:text-[var(--j-mist)]"
              >
                How it works
              </a>
              <a
                href="#pricing"
                className="text-[13px] font-normal text-[var(--j-slate)] transition-colors hover:text-[var(--j-mist)]"
              >
                Pricing
              </a>
            </div>
            <a
              href={appHref}
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-[var(--j-radius-md)] bg-[var(--j-ember)] px-3.5 py-[7px] text-[13px] font-medium text-[var(--j-mist)] outline-none transition-opacity hover:opacity-[0.92] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--j-harvest)]"
            >
              Start free trial
            </a>
          </div>
        </nav>
      </header>
      <div aria-hidden className="h-px bg-[var(--j-canopy)]" />
    </>
  );
}
