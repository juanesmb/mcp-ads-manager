import { cn } from "@jumon/ui/cn";

type Props = {
  href: string;
  children: React.ReactNode;
  large?: boolean;
  className?: string;
};

/** Ember primary — design system btn-primary pattern */
export function PrimaryCta({ href, children, large, className }: Props) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--j-radius-md)] bg-[var(--j-ember)] font-medium text-[var(--j-mist)] outline-none ring-offset-[var(--j-mist)] transition-opacity hover:opacity-[0.92] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--j-harvest)]",
        large ? "px-7 py-3 text-[14px]" : "px-3.5 py-[7px] text-[13px]",
        className
      )}
    >
      {children}
    </a>
  );
}
