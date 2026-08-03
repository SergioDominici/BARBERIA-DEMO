import Link from "next/link";
import { BarberPole, ArrowRight, Phone } from "@/components/icons";

export default function CtaBooking() {
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-16 text-center sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
          />
          <BarberPole className="mx-auto h-14 w-14 text-white" aria-hidden />
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-bold text-white sm:text-5xl">
            ¿Listo para tu próximo corte?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-stone-300">
            Reserva en línea, elige tu barbero y tu horario. Sin filas, sin
            esperas. Te esperamos en Navaja &amp; Co.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/reservar"
              className="btn inline-flex bg-white text-ink hover:bg-stone-200"
            >
              Reservar ahora
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href="tel:+5713001234567"
              className="btn inline-flex border border-white/30 text-white hover:bg-white/10"
            >
              <Phone className="h-4 w-4" aria-hidden />
              300 123 4567
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
