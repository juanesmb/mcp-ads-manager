"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks mouse position within a container and moves a position:fixed glow orb
 * by mutating inline styles directly — no React state, no re-renders.
 *
 *   mouseenter → opacity 1  (fade in)
 *   mousemove  → left/top = clientX/Y  (fast viewport tracking)
 *   mouseleave → opacity 0  (fade out)
 */
export function useMouseGlow<C extends HTMLElement>() {
  const containerRef = useRef<C>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;
    if (!container || !glow) return;

    const onEnter = () => { glow.style.opacity = "1"; };
    const onMove  = (e: MouseEvent) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top  = `${e.clientY}px`;
    };
    const onLeave = () => { glow.style.opacity = "0"; };

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mousemove",  onMove);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mousemove",  onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return { containerRef, glowRef };
}
