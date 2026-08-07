import Link from "next/link";
import { RESENAS } from "@/lib/data";
import { Star, ArrowRight } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export function Estrellas({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-1 text-accent" aria-label={`${n} de 5 estrellas`}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="h-4 w-4" aria-hidden />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const destacadas = RESENAS.slice(0, 4);

  return (
    <section className="bg-stone-50 py-10 sm:py-14 lg:py-20">
      <Reveal className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            Testimonios
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold text-ink sm:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
        </div>

        {/* 2x2 en móvil, 4 en fila en escritorio */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4">
          {destacadas.map((r) => (
            <Card key={r.id} className="flex flex-col p-4 sm:p-6">
              <Estrellas n={r.estrellas} />
              <blockquote className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-stone-600">
                “{r.texto}”
              </blockquote>
              <figcaption className="mt-4 border-t border-stone-200 pt-3">
                <p className="text-sm font-semibold text-ink">{r.autor}</p>
                <p className="text-xs text-stone-400">{r.detalle}</p>
              </figcaption>
            </Card>
          ))}
        </div>

        {RESENAS.length > 4 && (
          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline">
              <Link href="/resenas">
                Ver todas las reseñas
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        )}
      </Reveal>
    </section>
  );
}
