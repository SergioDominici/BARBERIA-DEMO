const MARCAS = [
  "Wahl",
  "BaByliss PRO",
  "American Crew",
  "Reuzel",
  "Uppercut Deluxe",
  "Suavecito",
  "Proraso",
  "Andis",
];

export default function Marquee() {
  return (
    <section
      aria-label="Marcas que usamos"
      className="overflow-hidden border-y border-stone-200 bg-white py-5 sm:py-6"
    >
      <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
        <div className="flex w-max shrink-0 animate-marquee items-center gap-8 pr-8 motion-reduce:animate-none sm:gap-14 sm:pr-14">
          {[...MARCAS, ...MARCAS].map((m, i) => (
            <span
              key={i}
              className="whitespace-nowrap font-heading text-base tracking-wide text-stone-400 transition-colors hover:text-ink sm:text-xl"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
