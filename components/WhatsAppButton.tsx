"use client";

import { usePathname } from "next/navigation";
import { WhatsApp } from "@/components/icons";

const TELEFONO = "573001234567"; // +57 300 123 4567 (demo)
const MENSAJE = "¡Hola Navaja & Co.! Quiero reservar una cita.";

export default function WhatsAppButton() {
  const pathname = usePathname();
  // En el flujo de reserva hay una barra fija abajo: evitamos el choque
  if (pathname === "/reservar") return null;

  const href = `https://wa.me/${TELEFONO}?text=${encodeURIComponent(MENSAJE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Reservar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md ring-1 ring-black/5 transition-colors hover:bg-[#1eb257] sm:bottom-6 sm:right-6"
    >
      <WhatsApp className="h-6 w-6" aria-hidden />
    </a>
  );
}
