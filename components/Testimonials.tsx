import { Star } from "@/components/icons";

const RESENAS = [
  {
    texto:
      "El mejor corte que me han hecho en años. Andrés es un verdadero maestro con la máquina. Salí como nuevo.",
    autor: "Daniel Restrepo",
    detalle: "Cliente desde 2021",
  },
  {
    texto:
      "El afeitado a navaja con toalla caliente es toda una experiencia. Ambiente increíble y atención de primera.",
    autor: "Mateo Gómez",
    detalle: "Cliente frecuente",
  },
  {
    texto:
      "Reservé en línea en dos minutos y me atendieron puntual. La barba me quedó perfecta. 100% recomendado.",
    autor: "Sebastián Cruz",
    detalle: "Primera visita",
  },
];

function Estrellas() {
  return (
    <div className="flex gap-1 text-accent" aria-label="5 de 5 estrellas">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4" aria-hidden />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-stone-50 py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            Testimonios
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
            Lo que dicen nuestros clientes
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {RESENAS.map((r) => (
            <figure key={r.autor} className="card flex flex-col">
              <Estrellas />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-stone-600">
                “{r.texto}”
              </blockquote>
              <figcaption className="mt-6 border-t border-stone-200 pt-4">
                <p className="font-semibold text-ink">{r.autor}</p>
                <p className="text-xs text-stone-400">{r.detalle}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
