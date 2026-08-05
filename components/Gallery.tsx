import Image from "next/image";
import { Reveal } from "@/components/Reveal";

const ITEMS = [
  { titulo: "Recorte de barba", src: "/gallery/1.jpg" },
  { titulo: "Afeitado a navaja", src: "/gallery/2.jpg" },
  { titulo: "Degradado / Fade", src: "/gallery/3.jpg" },
  { titulo: "Corte texturizado", src: "/gallery/4.jpg" },
  { titulo: "Productos premium", src: "/gallery/5.jpg" },
  { titulo: "Sillón clásico", src: "/gallery/6.jpg" },
];

export default function Gallery() {
  return (
    <section id="galeria" className="scroll-mt-20 py-14 sm:py-20 lg:py-24">
      <Reveal className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            Galería
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink sm:text-5xl">
            Nuestro trabajo habla
          </h2>
          <p className="mt-3 text-stone-600 sm:mt-4">
            Una muestra de los estilos que creamos día a día.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 md:grid-cols-3">
          {ITEMS.map((item) => (
            <div
              key={item.titulo}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-stone-200"
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
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
