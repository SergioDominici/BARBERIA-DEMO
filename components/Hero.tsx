import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink">
      {/* Foto vertical para celular */}
      <Image
        src="/hero-mobile.jpg"
        alt="Interior de la barbería Navaja & Co."
        fill
        priority
        sizes="100vw"
        className="object-cover object-center md:hidden"
      />
      {/* Foto horizontal para escritorio */}
      <Image
        src="/hero-desktop.jpg"
        alt="Interior de la barbería Navaja & Co."
        fill
        priority
        sizes="100vw"
        className="hidden object-cover object-center md:block"
      />

      {/* Capas para legibilidad del texto sobre la foto */}
      <div aria-hidden className="absolute inset-0 bg-ink/45" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/45"
      />

      {/* Contenido: centrado y repartido (arriba · centro · abajo) */}
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 pb-14 pt-28 text-center sm:pb-20 sm:pt-32">
        {/* Arriba */}
        <p className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
          <span className="h-px w-6 bg-accent" />
          Barbería clásica · Bogotá
          <span className="h-px w-6 bg-accent" />
        </p>

        {/* Centro */}
        <div className="flex flex-col items-center">
          <h1 className="mx-auto max-w-2xl text-balance font-display text-4xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            El arte de un{" "}
            <span className="italic text-accent">buen corte</span>
          </h1>
          <div className="mt-6 flex items-center gap-2.5">
            <div className="flex gap-1 text-accent" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4" />
              ))}
            </div>
            <span className="text-sm font-medium text-white/80">
              4.9 · +1.200 clientes felices
            </span>
          </div>
        </div>

        {/* Abajo */}
        <div className="flex flex-col items-center gap-7">
          <div className="flex w-full max-w-xs flex-col items-center gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <Button
              asChild
              variant="light"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/reservar">
                Reservar tu cita
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="outlineLight"
              size="lg"
              className="w-full sm:w-auto"
            >
              <a href="#servicios">Ver servicios</a>
            </Button>
          </div>
          <a
            href="#servicios"
            aria-label="Desliza para ver más"
            className="animate-bounce text-white/50 transition-colors hover:text-white"
          >
            <ArrowRight className="h-6 w-6 rotate-90" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
