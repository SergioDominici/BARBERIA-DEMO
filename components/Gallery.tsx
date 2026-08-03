import { FlatIcon } from "@/components/icons";

const ITEMS = [
  { titulo: "Fade clásico", src: "/icons/clippers-line.png" },
  { titulo: "Barba perfilada", src: "/icons/brush.png" },
  { titulo: "Afeitado a navaja", src: "/icons/blade.png" },
  { titulo: "Diseño de líneas", src: "/icons/comb-spray.png" },
  { titulo: "Texturizado moderno", src: "/icons/barber-working.png" },
  { titulo: "Estilo ejecutivo", src: "/icons/barber-face.png" },
];

export default function Gallery() {
  return (
    <section id="galeria" className="scroll-mt-20 py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            Galería
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
            Nuestro trabajo habla
          </h2>
          <p className="mt-4 text-stone-600">
            Una muestra de los estilos que creamos día a día. La calidad se ve en
            cada acabado.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3">
          {ITEMS.map((item) => (
            <div
              key={item.titulo}
              className="group relative flex aspect-square flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 transition-colors hover:border-ink"
            >
              <FlatIcon
                src={item.src}
                aria-hidden
                className="h-14 w-14 opacity-70 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
              />
              <p className="px-3 text-center font-heading text-lg tracking-wide text-ink">
                {item.titulo}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
