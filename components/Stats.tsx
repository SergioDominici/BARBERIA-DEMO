"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  target: number;
  etiqueta: string;
  format: (n: number) => string;
};

const STATS: Stat[] = [
  { target: 15, etiqueta: "Años de tradición", format: (n) => `${Math.round(n)}+` },
  {
    target: 12000,
    etiqueta: "Cortes realizados",
    format: (n) => `${Math.round(n / 1000)}k`,
  },
  { target: 4, etiqueta: "Barberos expertos", format: (n) => `${Math.round(n)}` },
  { target: 4.9, etiqueta: "Calificación media", format: (n) => n.toFixed(1) },
];

function Counter({ target, format }: { target: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const animar = () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        setVal(target);
        return;
      }
      const dur = 2600;
      const start = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(target * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    };

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          animar();
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{format(val)}</span>;
}

export default function Stats() {
  return (
    <section className="border-y border-ink/15 bg-cream-dark">
      <div className="container-page grid grid-cols-4 gap-2 py-8 sm:gap-6 sm:py-12">
        {STATS.map((s) => (
          <div key={s.etiqueta} className="text-center">
            <p className="font-heading text-2xl text-ink sm:text-4xl lg:text-5xl">
              <Counter target={s.target} format={s.format} />
            </p>
            <p className="mt-1 text-[10px] uppercase leading-tight tracking-wider text-ink/60 sm:text-sm">
              {s.etiqueta}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
