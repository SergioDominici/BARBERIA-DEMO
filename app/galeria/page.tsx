import type { Metadata } from "next";
import Link from "next/link";
import GalleryGrid from "@/components/GalleryGrid";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Galería del equipo",
  description:
    "El trabajo de cada barbero de Navaja & Co. Filtra por barbero y mira sus cortes, barbas y afeitados.",
};

export default function GaleriaPage() {
  return (
    <div className="pt-24">
      <section className="container-page py-10 sm:py-14">
        <Link
          href="/#galeria"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 transition-colors hover:text-ink"
        >
          <ArrowRight className="h-4 w-4 rotate-180" aria-hidden />
          Volver al inicio
        </Link>

        <div className="max-w-2xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            Galería
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
            El trabajo de cada barbero
          </h1>
          <p className="mt-4 text-ink/70">
            Elige un barbero para ver su portafolio. Toca cualquier foto para
            verla en grande.
          </p>
        </div>

        <GalleryGrid />
      </section>
    </div>
  );
}
