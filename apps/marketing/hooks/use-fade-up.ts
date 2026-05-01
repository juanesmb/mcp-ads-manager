"use client";

import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to the returned ref.
 * Adds `data-visible="true"` when the element enters the viewport.
 * Use with Tailwind `data-[visible=true]:` variants for scroll reveal.
 */
export function useFadeUp<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-visible", "true");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
