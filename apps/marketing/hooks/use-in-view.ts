"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref and a boolean that becomes true once the element
 * enters the viewport. Fires once and never resets — use for
 * enter-once animations and lazy reveals.
 */
export function useInView<T extends Element>(
  options?: IntersectionObserverInit,
): { ref: React.RefObject<T | null>; inView: boolean } {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}
