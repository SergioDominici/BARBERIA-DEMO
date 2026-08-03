"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FlatIcon, Menu, Close } from "@/components/icons";

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-stone-200 bg-white/85 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading text-2xl tracking-wide text-ink"
        >
          <FlatIcon
            src="/icons/barber-pole-color.png"
            className="h-7 w-7"
            aria-hidden
          />
          NAVAJA <span className="text-accent">&amp;</span> CO.
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
          <Link href="/reservar" className="btn-primary !py-2.5">
            Reservar
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-300 text-ink md:hidden"
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
        <div className="border-t border-stone-200 bg-white md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-stone-50"
              >
                {item.label}
              </a>
            ))}
            <Link href="/reservar" className="btn-primary mt-2">
              Reservar cita
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
