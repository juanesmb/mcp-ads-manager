"use client";

import { useFadeUp } from "@/hooks/use-fade-up";
import { cn } from "@jumon/ui/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Wraps children in a div that fades up when scrolled into view.
 * Delay is in milliseconds and staggers reveals when used multiple times.
 */
export function FadeUp({ children, className, delay = 0 }: Props) {
  const ref = useFadeUp<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "translate-y-6 opacity-0 transition-[opacity,transform] duration-[600ms] ease-out",
        "data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100",
        className
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
