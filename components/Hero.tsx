import Link from "next/link";
import { FlatIcon, Quote, ArrowRight } from "@/components/icons";

const STATS = [
  { valor: "15+", etiqueta: "Años de tradición" },
  { valor: "4", etiqueta: "Barberos expertos" },
  { valor: "12k", etiqueta: "Cortes realizados" },
];

export default function Hero() {
  return (
    <section className="hero-soft relative overflow-hidden pt-16">
      <div className="container-page relative grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div className="animate-fade-up">
          <p className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            Barbería clásica · Bogotá
          </p>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
            El arte de
            <br />
            un <span className="italic text-accent">buen corte</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-stone-600">
            Cortes de precisión, afeitado a navaja y arreglo de barba en un
            ambiente donde la tradición se encuentra con el estilo moderno.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/reservar" className="btn-primary">
              Reservar tu cita
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a href="#servicios" className="btn-outline">
              Ver servicios
            </a>
          </div>

          <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-stone-200 pt-8">
            {STATS.map((s) => (
              <div key={s.etiqueta}>
                <dt className="font-heading text-4xl text-ink">{s.valor}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-stone-400">
                  {s.etiqueta}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Tarjeta visual (sin imágenes externas) */}
        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-stone-200 bg-white p-8 shadow-lift">
            <div className="absolute right-6 top-6 rounded-full border border-stone-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
              Est. 2009
            </div>
            <div className="flex h-full flex-col items-center justify-center text-center">
              <FlatIcon
                src="/icons/barber-avatar.png"
                className="h-32 w-32 drop-shadow-sm"
                aria-hidden
              />
              <Quote className="mt-6 h-6 w-6 text-accent/70" aria-hidden />
              <p className="mt-3 font-display text-2xl italic text-ink">
                Un buen corte es una
                <br />
                declaración de estilo.
              </p>
              <div className="mt-8 h-px w-24 bg-stone-200" />
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-stone-400">
                Navaja &amp; Co.
              </p>
            </div>
          </div>
          <div
            aria-hidden
            className="absolute -bottom-6 -left-6 -z-10 h-40 w-40 rounded-full bg-accent/5 blur-3xl"
          />
        </div>
      </div>
    </section>
  );
}
