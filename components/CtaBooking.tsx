import Link from "next/link";
import { ArrowRight, Phone } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export default function CtaBooking() {
  return (
    <section className="border-t border-ink/15 bg-cream-dark py-12 sm:py-16">
      <Reveal className="container-page text-center">
        <p className="mx-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          <span className="h-px w-8 bg-accent" />
          Reserva tu cita
          <span className="h-px w-8 bg-accent" />
        </p>
        <h2 className="mx-auto mt-5 max-w-2xl font-display text-2xl font-bold text-ink sm:text-4xl">
          ¿Listo para tu próximo corte?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-ink/70">
          Elige tu barbero y tu horario en un minuto. Sin filas, sin esperas.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/reservar">
              Reservar ahora
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <a href="tel:+5713001234567">
              <Phone className="h-4 w-4" aria-hidden />
              300 123 4567
            </a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
