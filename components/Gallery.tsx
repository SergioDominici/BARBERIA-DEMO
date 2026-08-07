import Link from "next/link";
import Image from "next/image";
import { GALERIA } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/components/icons";

const MUESTRA = GALERIA.slice(0, 6);

export default function Gallery() {
  return (
    <section id="galeria" className="scroll-mt-20 py-10 sm:py-14 lg:py-20">
      <Reveal className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            Galería
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold text-ink sm:text-4xl">
            El trabajo de cada barbero
          </h2>
          <p className="mt-3 text-stone-600 sm:mt-4">
            Una muestra de lo que hacemos. Entra a la galería para ver el
            portafolio completo de cada barbero.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-3">
          {MUESTRA.map((item) => (
            <Link
              key={item.src}
              href="/galeria"
              className="group relative aspect-square overflow-hidden rounded-2xl border border-stone-200 transition-transform duration-200 active:scale-[0.98]"
            >
              <Image
                src={item.src}
                alt={item.titulo}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-3 text-left font-heading text-base tracking-wide text-white sm:p-4 sm:text-lg">
                {item.titulo}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/galeria">
              Ver galería completa
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
