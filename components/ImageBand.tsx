import Image from "next/image";

export default function ImageBand() {
  return (
    <section className="relative h-[44vh] min-h-[320px] w-full overflow-hidden">
      <Image
        src="/band.jpg"
        alt="Interior de la barbería Navaja & Co."
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div aria-hidden className="absolute inset-0 bg-ink/65" />
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            <span className="h-px w-8 bg-accent" />
            Tradición desde 2009
            <span className="h-px w-8 bg-accent" />
          </p>
          <p className="mt-4 font-display text-3xl italic text-white sm:text-5xl">
            Cada corte, una obra de arte.
          </p>
        </div>
      </div>
    </section>
  );
}
