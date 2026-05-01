"use client";

import { useMouseGlow } from "@/hooks/use-mouse-glow";

/**
 * Wraps the page content sections (excluding header and footer).
 * Renders a position:fixed ember glow orb that tracks the cursor within
 * this area — invisible over the header or footer.
 *
 * z-index:1 is required so the orb paints above section backgrounds that use
 * position:relative (which would otherwise cover a z-index:0 fixed element).
 * At 11 % opacity text remains fully readable.
 */
export function PageGlowCanvas({ children }: { children: React.ReactNode }) {
  const { containerRef, glowRef } = useMouseGlow<HTMLDivElement>();

  return (
    <div ref={containerRef}>
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none rounded-full"
        style={{
          position: "fixed",
          width: "900px",
          height: "900px",
          left: "50vw",
          top: "50vh",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(200,96,26,0.11) 0%, transparent 68%)",
          opacity: 0,
          zIndex: 1,
          transition: "left 80ms linear, top 80ms linear, opacity 600ms ease",
        }}
      />
      {children}
    </div>
  );
}
