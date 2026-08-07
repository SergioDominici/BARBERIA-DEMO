"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FlatIcon, Menu, Close } from "@/components/icons";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#barberos", label: "Barberos" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#contacto", label: "Contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú al cambiar de ruta
  useEffect(() => setOpen(false), [pathname]);

  // Sobre el hero oscuro del inicio (sin scroll) el texto va en blanco
  const sobreHero = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-ink/15 bg-cream-light/85 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className={`flex items-center gap-2.5 font-heading text-2xl tracking-wide transition-colors ${
            sobreHero ? "text-white" : "text-ink"
          }`}
        >
          <FlatIcon
            src="/icons/barber-pole-color.png"
            className="h-7 w-7"
            aria-hidden
          />
          NAVAJA{" "}
          <span className="font-script text-[1.5em] leading-none text-accent">
            &amp;
          </span>{" "}
          CO.
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                sobreHero
                  ? "text-white/80 hover:text-white"
                  : "text-ink/70 hover:text-ink"
              }`}
            >
              {item.label}
            </a>
          ))}
          <Button asChild size="sm" variant={sobreHero ? "light" : "default"}>
            <Link href="/reservar">Reservar</Link>
          </Button>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors md:hidden ${
            sobreHero
              ? "border-white/40 text-white"
              : "border-ink/25 text-ink"
          }`}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? (
            <Close className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/15 bg-cream-light md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-cream-dark"
              >
                {item.label}
              </a>
            ))}
            <Button asChild className="mt-2 w-full">
              <Link href="/reservar">Reservar cita</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
