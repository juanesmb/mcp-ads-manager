export function SectionDivider({ className }: { className?: string }) {
  return <div aria-hidden className={`my-[var(--j-space-xl)] h-[0.5px] w-full bg-[var(--j-sage)] ${className ?? ""}`} />;
}
