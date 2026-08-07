"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BARBEROS, GALERIA } from "@/lib/data";
import { getGaleriaExtra, EVENTO_GALERIA } from "@/lib/store";
import { Close, ArrowRight } from "@/components/icons";

const nombreCorto = (id: string) =>
  BARBEROS.find((b) => b.id === id)?.nombre.split(" ")[0] ?? "";

export default function GalleryGrid() {
  const [filtro, setFiltro] = useState<string>("todos");
  const [open, setOpen] = useState<number | null>(null);
  const [trabajos, setTrabajos] = useState(GALERIA as { titulo: string; src: string; barbero: string }[]);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const cargar = () => setTrabajos([...GALERIA, ...getGaleriaExtra()]);
    cargar();
    window.addEventListener(EVENTO_GALERIA, cargar);
    window.addEventListener("storage", cargar);
    return () => {
      window.removeEventListener(EVENTO_GALERIA, cargar);
      window.removeEventListener("storage", cargar);
    };
  }, []);

  const visibles = useMemo(
    () =>
      filtro === "todos"
        ? trabajos
        : trabajos.filter((t) => t.barbero === filtro),
    [filtro, trabajos]
  );

  const cerrar = useCallback(() => setOpen(null), []);
  const mover = useCallback(
    (dir: number) =>
      setOpen((i) =>
        i === null ? i : (i + dir + visibles.length) % visibles.length
      ),
    [visibles.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, cerrar, mover]);

  return (
    <>
      {/* Filtro por barbero */}
      <div className="mt-8 flex flex-wrap gap-2">
        {[{ id: "todos", label: "Todos" }, ...BARBEROS.map((b) => ({
          id: b.id,
          label: b.nombre.split(" ")[0],
        }))].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setFiltro(t.id);
              setOpen(null);
            }}
            className={`rounded-lg border px-4 py-1.5 text-sm font-semibold transition-colors ${
              filtro === t.id
                ? "border-ink bg-navy text-white"
                : "border-ink/25 text-ink/70 hover:border-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {visibles.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-ink/15"
          >
            <Image
              src={item.src}
              alt={item.titulo}
              fill
              unoptimized={item.src.startsWith("data:")}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3 text-left sm:p-4">
              <p className="font-heading text-base tracking-wide text-white sm:text-lg">
                {item.titulo}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/70">
                por {nombreCorto(item.barbero)}
              </p>
            </div>
            <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-cream-light/20 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open !== null && visibles[open] && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/90 p-4 backdrop-blur-sm"
          onClick={cerrar}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) mover(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-cream-light/10 text-white transition-colors hover:bg-cream-light/20"
          >
            <Close className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              mover(-1);
            }}
            aria-label="Anterior"
            className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-cream-light/10 text-white transition-colors hover:bg-cream-light/20 sm:left-6"
          >
            <ArrowRight className="h-5 w-5 rotate-180" aria-hidden />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              mover(1);
            }}
            aria-label="Siguiente"
            className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-cream-light/10 text-white transition-colors hover:bg-cream-light/20 sm:right-6"
          >
            <ArrowRight className="h-5 w-5" aria-hidden />
          </button>

          <figure
            className="relative flex max-h-[85vh] w-full max-w-3xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[70vh] w-full">
              <Image
                src={visibles[open].src}
                alt={visibles[open].titulo}
                fill
                unoptimized={visibles[open].src.startsWith("data:")}
                sizes="90vw"
                className="rounded-2xl object-contain"
              />
            </div>
            <figcaption className="mt-4 text-center font-heading text-lg tracking-wide text-white">
              {visibles[open].titulo}
              <span className="ml-3 text-sm font-normal text-white/50">
                por {nombreCorto(visibles[open].barbero)} · {open + 1}/
                {visibles.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
