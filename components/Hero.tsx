import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Seal from "@/components/Seal";

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

      {/* Velo cálido (no azul) para legibilidad, dejando ver la foto */}
      <div aria-hidden className="absolute inset-0 bg-ink/40" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/25"
      />

      {/* Sello girando */}
      <Seal className="absolute right-4 top-20 h-20 w-20 animate-spin-slow text-cream-light/80 sm:right-8 sm:top-28 sm:h-32 sm:w-32" />

      {/* Contenido */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="inline-flex items-center gap-3 font-heading text-xs font-semibold uppercase tracking-[0.3em] text-cream-light/70 sm:text-sm">
          <span className="h-px w-6 bg-accent" />
          Barbería clásica · Bogotá
          <span className="h-px w-6 bg-accent" />
        </p>

        <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.92] text-cream-light sm:text-7xl lg:text-8xl">
          El arte de un
          <span className="mt-2 block font-script text-5xl normal-case text-accent sm:text-7xl lg:text-8xl">
            buen corte
          </span>
        </h1>

        <div className="mt-7 flex items-center gap-2.5">
          <div className="flex gap-1 text-mustard" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4" />
            ))}
          </div>
          <span className="font-heading text-sm uppercase tracking-wider text-cream-light/80">
            4.9 · +1.200 clientes
          </span>
        </div>

        <div className="mt-9 flex w-full max-w-xs flex-col items-center gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
          <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
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
      </div>

      {/* Franja de poste de barbero */}
      <div aria-hidden className="barber-stripes absolute inset-x-0 bottom-0 h-3" />
    </section>
  );
}
