import { cn } from "@jumon/ui/cn";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

/** Outline — card surface, teal text, sage 0.5px border */
export function OutlineCta({ href, children, className }: Props) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--j-radius-md)] border-[0.5px] border-border bg-card px-3.5 py-[7px] text-[13px] font-medium text-foreground outline-none transition-colors hover:bg-accent focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--j-harvest)]",
        className
      )}
    >
      {children}
    </a>
  );
}
