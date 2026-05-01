"use client";

import { useEffect } from "react";
import { useInView } from "@/hooks/use-in-view";

/**
 * Attaches an IntersectionObserver to the returned ref.
 * Adds `data-visible="true"` when the element enters the viewport.
 * Use with Tailwind `data-[visible=true]:` variants for scroll reveal.
 *
 * Delegates observation to useInView — both hooks share the same primitive.
 */
export function useFadeUp<T extends HTMLElement = HTMLDivElement>() {
  const { ref, inView } = useInView<T>({ threshold: 0.1 });

  useEffect(() => {
    if (inView && ref.current) {
      ref.current.setAttribute("data-visible", "true");
    }
  }, [inView, ref]);

  return ref;
}
