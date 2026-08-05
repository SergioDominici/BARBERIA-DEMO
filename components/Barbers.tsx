import Link from "next/link";
import Image from "next/image";
import { BARBEROS } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "@/components/icons";

export default function Barbers() {
  return (
    <section id="barberos" className="scroll-mt-20 bg-stone-50 py-14 sm:py-20 lg:py-24">
      <Reveal className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            El equipo
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink sm:text-5xl">
            Manos expertas
          </h2>
          <p className="mt-3 text-stone-600 sm:mt-4">
            Un equipo apasionado por su oficio, listo para darte el mejor corte de
            tu vida.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-6 lg:grid-cols-4">
          {BARBEROS.map((b) => (
            <Link
              key={b.id}
              href={`/reservar?barbero=${b.id}`}
              className="group block"
            >
              <Card className="overflow-hidden pb-4 text-center hover:shadow-lift sm:pb-6">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={b.foto}
                    alt={`${b.nombre}, barbero`}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-ink/80 py-2 text-xs font-semibold uppercase tracking-wider text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Reservar
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-lg tracking-wide text-ink sm:text-2xl">
                  {b.nombre}
                </h3>
                <p className="text-xs font-medium italic text-accent sm:text-sm">
                  “{b.alias}”
                </p>
                <p className="mt-2 px-3 text-xs text-stone-600 sm:mt-3 sm:text-sm">
                  {b.especialidad}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-stone-400 sm:text-xs">
                  {b.experiencia}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
