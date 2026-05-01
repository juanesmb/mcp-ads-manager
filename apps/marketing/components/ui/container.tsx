import { cn } from "@jumon/ui/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/** Max content width ~860px, horizontal rhythm 32px per design system */
export function MarketingContainer({ children, className }: Props) {
  return <div className={cn("mx-auto w-full max-w-[860px] px-8", className)}>{children}</div>;
}
