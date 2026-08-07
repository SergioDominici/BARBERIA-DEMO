import { SERVICIOS, formatCOP } from "@/lib/data";
import { ServiceIcon, ArrowRight } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BookingDialog from "@/components/BookingDialog";

export default function PricesMenu() {
  return (
    <section id="servicios" className="scroll-mt-20 py-14 sm:py-20 lg:py-24">
      <Reveal className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">
            <span className="h-px w-8 bg-accent" />
            Carta de precios
            <span className="h-px w-8 bg-accent" />
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink sm:text-5xl">
            Nuestros servicios
          </h2>
          <p className="mt-3 text-stone-600 sm:mt-4">
            Precios claros, sin sorpresas. Reserva el que quieras en segundos.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-stone-200 bg-white p-3 shadow-card sm:mt-12 sm:p-5">
          <ul className="divide-y divide-stone-200">
            {SERVICIOS.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-2 py-4">
                <span className="hidden h-11 w-11 flex-none items-center justify-center rounded-xl border border-stone-200 bg-stone-50 sm:inline-flex">
                  <ServiceIcon name={s.icono} className="h-6 w-6" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-heading text-lg tracking-wide text-ink">
                    {s.nombre}
                    {s.destacado && <Badge variant="accent">Popular</Badge>}
                  </p>
                  <p className="truncate text-xs text-stone-500 sm:text-sm">
                    {s.descripcion}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="mb-1 hidden flex-1 self-end border-b border-dotted border-stone-300 sm:block"
                />
                <div className="flex-none text-right">
                  <p className="font-heading text-xl text-ink">
                    {formatCOP(s.precio)}
                  </p>
                  <p className="text-[11px] text-stone-400">{s.duracion} min</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex justify-center">
          <BookingDialog>
            <Button size="lg">
              Reservar ahora
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </BookingDialog>
        </div>
      </Reveal>
    </section>
  );
}
