import Link from "next/link";
import { SERVICIOS, formatCOP } from "@/lib/data";
import { ServiceIcon, ArrowRight } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/Reveal";

export default function Services() {
  return (
    <section id="servicios" className="scroll-mt-20 py-14 sm:py-20 lg:py-24">
      <Reveal className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            Nuestros servicios
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink sm:text-5xl">
            Precisión en cada detalle
          </h2>
          <p className="mt-3 text-stone-600 sm:mt-4">
            Elige el servicio que buscas y resérvalo en segundos.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3">
          {SERVICIOS.map((s) => (
            <Link key={s.id} href={`/reservar?servicio=${s.id}`} className="group block">
              <Card className="relative flex h-full flex-col p-4 hover:shadow-lift sm:p-6">
                {s.destacado && (
                  <Badge
                    variant="accent"
                    className="absolute right-3 top-3 sm:right-5 sm:top-5"
                  >
                    Popular
                  </Badge>
                )}
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 transition-colors group-hover:border-ink sm:h-14 sm:w-14">
                  <ServiceIcon
                    name={s.icono}
                    className="h-7 w-7 sm:h-9 sm:w-9"
                    aria-hidden
                  />
                </span>
                <h3 className="mt-3 font-heading text-lg leading-tight tracking-wide text-ink sm:mt-4 sm:text-2xl">
                  {s.nombre}
                </h3>
                <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-stone-500 sm:mt-2 sm:line-clamp-none sm:text-sm">
                  {s.descripcion}
                </p>
                <div className="mt-4 flex items-end justify-between border-t border-stone-200 pt-3 sm:pt-4">
                  <div>
                    <p className="font-heading text-xl text-ink sm:text-2xl">
                      {formatCOP(s.precio)}
                    </p>
                    <p className="text-[11px] text-stone-400 sm:text-xs">
                      {s.duracion} min
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 transition-colors group-hover:text-accent sm:text-sm">
                    <span className="hidden sm:inline">Reservar</span>
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
