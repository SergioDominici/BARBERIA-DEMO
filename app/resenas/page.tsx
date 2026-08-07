import type { Metadata } from "next";
import Link from "next/link";
import { RESENAS, formatCOP, SERVICIOS } from "@/lib/data";
import { Estrellas } from "@/components/Testimonials";
import { ArrowRight } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Reseñas de clientes",
  description:
    "Todas las opiniones de nuestros clientes sobre Navaja & Co. — cortes, barba y afeitado.",
};

export default function ResenasPage() {
  const promedio =
    RESENAS.reduce((s, r) => s + r.estrellas, 0) / RESENAS.length;
  const desde = Math.min(...SERVICIOS.map((s) => s.precio));

  return (
    <div className="pt-24">
      <section className="container-page py-10 sm:py-14">
        <Link
          href="/#contacto"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 transition-colors hover:text-ink"
        >
          <ArrowRight className="h-4 w-4 rotate-180" aria-hidden />
          Volver al inicio
        </Link>

        <div className="max-w-2xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            Reseñas
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
            Lo que dicen nuestros clientes
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Estrellas n={5} />
            <p className="text-sm text-ink/70">
              <span className="font-semibold text-ink">
                {promedio.toFixed(1)}
              </span>{" "}
              de 5 · {RESENAS.length} reseñas
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {RESENAS.map((r) => (
            <Card key={r.id} className="flex flex-col p-6">
              <Estrellas n={r.estrellas} />
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-ink/80">
                “{r.texto}”
              </blockquote>
              <figcaption className="mt-6 border-t border-ink/15 pt-4">
                <p className="font-semibold text-ink">{r.autor}</p>
                <p className="text-sm text-ink/50">{r.detalle}</p>
              </figcaption>
            </Card>
          ))}
        </div>

        {/* CTA al final */}
        <div className="mt-14 rounded-2xl border border-ink/15 bg-cream-dark px-6 py-12 text-center sm:px-16">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Únete a nuestros clientes felices
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ink/70">
            Reserva tu cita desde {formatCOP(desde)} y vive la experiencia.
          </p>
          <Button asChild size="lg" className="mt-7">
            <Link href="/reservar">
              Reservar ahora
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
