import Link from "next/link";
import { SERVICIOS, formatCOP } from "@/lib/data";
import { ServiceIcon, ArrowRight } from "@/components/icons";

export default function Services() {
  return (
    <section id="servicios" className="scroll-mt-20 py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            Nuestros servicios
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
            Precisión en cada detalle
          </h2>
          <p className="mt-4 text-stone-600">
            Desde el corte clásico hasta el afeitado tradicional a navaja. Elige
            el servicio que buscas y resérvalo en segundos.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICIOS.map((s) => (
            <article
              key={s.id}
              className="card group relative flex flex-col hover:shadow-lift"
            >
              {s.destacado && (
                <span className="absolute right-5 top-5 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
                  Popular
                </span>
              )}
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 transition-colors group-hover:border-ink">
                <ServiceIcon name={s.icono} className="h-9 w-9" aria-hidden />
              </span>
              <h3 className="mt-4 font-heading text-2xl tracking-wide text-ink">
                {s.nombre}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-500">
                {s.descripcion}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4">
                <div>
                  <p className="font-heading text-2xl text-ink">
                    {formatCOP(s.precio)}
                  </p>
                  <p className="text-xs text-stone-400">{s.duracion} min</p>
                </div>
                <Link
                  href={`/reservar?servicio=${s.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 transition-colors group-hover:text-accent"
                >
                  Reservar
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
