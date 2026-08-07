"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ImageBand() {
  const ref = useRef<HTMLElement>(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        // progreso del centro de la sección respecto al centro de la pantalla
        const progress =
          (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        setY(Math.max(-1, Math.min(1, progress)) * -28);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative h-[34vh] min-h-[260px] w-full overflow-hidden"
    >
      {/* Capa de imagen algo más alta para que el parallax no deje bordes */}
      <div
        className="absolute inset-x-0 -inset-y-[14%] will-change-transform"
        style={{ transform: `translate3d(0, ${y}px, 0)` }}
      >
        <Image
          src="/band.jpg"
          alt="Interior de la barbería Navaja & Co."
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div aria-hidden className="absolute inset-0 bg-ink/65" />
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            <span className="h-px w-8 bg-accent" />
            Tradición desde 2009
            <span className="h-px w-8 bg-accent" />
          </p>
          <p className="mt-3 font-display text-2xl italic text-white sm:text-4xl">
            Cada corte, una obra de arte.
          </p>
        </div>
      </div>
    </section>
  );
}
