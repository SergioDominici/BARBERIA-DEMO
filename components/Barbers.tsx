import { BARBEROS } from "@/lib/data";

export default function Barbers() {
  return (
    <section id="barberos" className="scroll-mt-20 bg-stone-50 py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">
            <span className="h-px w-8 bg-accent" />
            El equipo
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
            Manos expertas
          </h2>
          <p className="mt-4 text-stone-600">
            Un equipo de barberos apasionados por su oficio, listos para darte el
            mejor corte de tu vida.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BARBEROS.map((b) => (
            <article
              key={b.id}
              className="group rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-card transition-shadow hover:shadow-lift"
            >
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-ink font-heading text-3xl tracking-wider text-white transition-transform group-hover:scale-105">
                {b.iniciales}
              </div>
              <h3 className="mt-5 font-heading text-2xl tracking-wide text-ink">
                {b.nombre}
              </h3>
              <p className="text-sm font-medium italic text-accent">
                “{b.alias}”
              </p>
              <p className="mt-3 text-sm text-stone-600">{b.especialidad}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-stone-400">
                {b.experiencia}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
