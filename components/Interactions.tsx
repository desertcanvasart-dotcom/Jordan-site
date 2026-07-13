"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Interactions() {
  const pathname = usePathname();

  useEffect(() => {
    const header = document.getElementById("site-header");
    const updateHeader = () => {
      if (!header) return;
      header.classList.toggle("is-solid", window.scrollY > 24);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.in)"));
    let observer: IntersectionObserver | undefined;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("in"));
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      elements.forEach((element) => observer?.observe(element));
    }

    return () => {
      window.removeEventListener("scroll", updateHeader);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
