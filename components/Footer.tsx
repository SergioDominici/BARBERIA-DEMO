import Link from "next/link";
import { HORARIOS } from "@/lib/data";
import { FlatIcon, Clock, Phone, Mail } from "@/components/icons";

export default function Footer() {
  return (
    <footer id="contacto" className="border-t border-stone-200 bg-stone-50">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 font-heading text-2xl tracking-wide text-ink">
            <FlatIcon
              src="/icons/barber-pole-color.png"
              className="h-7 w-7"
              aria-hidden
            />
            NAVAJA <span className="text-accent">&amp;</span> CO.
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-500">
            Barbería clásica y moderna en el corazón de Bogotá. Tradición,
            precisión y un buen café mientras te atendemos.
          </p>
          <div className="mt-5 flex gap-3">
            {["Instagram", "Facebook", "TikTok"].map((red) => (
              <a
                key={red}
                href="#"
                className="rounded-full border border-stone-300 px-4 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-ink hover:text-ink"
              >
                {red}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-heading text-lg tracking-wide text-ink">
            <Clock className="h-4 w-4 text-accent" aria-hidden />
            Horarios
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-stone-500">
            {HORARIOS.map((h) => (
              <li key={h.dia} className="flex flex-col">
                <span className="text-ink">{h.dia}</span>
                <span>{h.horas}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-heading text-lg tracking-wide text-ink">
            <FlatIcon src="/icons/location-pole.png" className="h-5 w-5" aria-hidden />
            Visítanos
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-stone-500">
            <li>Calle 85 #12-34, Chapinero, Bogotá</li>
            <li>
              <a
                href="tel:+5713001234567"
                className="flex items-center gap-2 hover:text-ink"
              >
                <Phone className="h-4 w-4" aria-hidden />
                +57 300 123 4567
              </a>
            </li>
            <li>
              <a
                href="mailto:hola@navajaco.com"
                className="flex items-center gap-2 hover:text-ink"
              >
                <Mail className="h-4 w-4" aria-hidden />
                hola@navajaco.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-200">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-stone-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Navaja &amp; Co. — Sitio demo. Iconos por{" "}
            <a
              href="https://www.flaticon.es"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-ink"
            >
              Flaticon
            </a>
            .
          </p>
          <Link href="/admin" className="hover:text-ink">
            Panel de administración
          </Link>
        </div>
      </div>
    </footer>
  );
}
