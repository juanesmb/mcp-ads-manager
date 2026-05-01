import { logoBar } from "@/content/landing";

export function LogoBar() {
  return (
    <div
      className="border-b-[0.5px] border-[var(--j-canopy)] bg-[var(--j-canopy)] py-5"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 px-8">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--j-slate)]">
          {logoBar.label}
        </span>

        {logoBar.platforms.map((p) => (
          <div
            key={p.label}
            className="flex items-center gap-2"
            style={{ opacity: p.active ? 1 : 0.6 }}
          >
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--j-deep-teal)] text-[11px] font-medium text-[var(--j-fern)]">
              {p.icon}
            </span>
            <span className="text-[13px] font-medium text-[var(--j-slate)]">
              {p.label}
            </span>
            {"badge" in p && (
              <span className="rounded-[10px] bg-[var(--j-deep-teal)] px-1.5 py-[2px] text-[10px] text-[var(--j-slate)] opacity-70">
                {p.badge}
              </span>
            )}
          </div>
        ))}

        {/* Vertical divider */}
        <div aria-hidden className="hidden h-5 w-px bg-[var(--j-deep-teal)] md:block" />

        {logoBar.agents.map((a) => (
          <div key={a.label} className="flex items-center gap-2">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--j-deep-teal)] text-[11px] font-medium text-[var(--j-fern)]">
              {a.icon}
            </span>
            <span className="text-[13px] font-medium text-[var(--j-slate)]">{a.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
