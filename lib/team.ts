// Store de demo (localStorage) para el panel del dueño:
// cada barbero tiene su perfil, sus servicios/precios y su horario.
import { BARBEROS, SERVICIOS, HORARIOS } from "@/lib/data";
import type { ServiceIconKey } from "@/components/icons";

export type ServicioBarbero = {
  id: string;
  nombre: string;
  precio: number;
  duracion: number;
  icono: ServiceIconKey;
};

export type BarberoPerfil = {
  id: string;
  nombre: string;
  alias: string;
  especialidad: string;
  experiencia: string;
  iniciales: string;
  foto: string;
  descripcion: string;
  comision: number; // % de comisión del barbero
  servicios: ServicioBarbero[];
  horario: { dia: string; horas: string }[];
};

const KEY = "barberia:equipo";
export const EVENTO_EQUIPO = "barberia:equipo-updated";

const BIOS: Record<string, string> = {
  andres:
    "Con más de 12 años tras la silla, Andrés domina el fade y los cortes clásicos. Precisión milimétrica y buena conversación garantizadas.",
  camilo:
    "Especialista en barba y afeitado tradicional a navaja con toalla caliente. Para Camilo, cada afeitado es un ritual.",
  sofia:
    "Diseños, líneas y colorimetría. Sofía convierte cada corte en una obra personalizada con su toque artístico.",
  julian:
    "Cortes modernos y texturizados. Julián está siempre al día con las últimas tendencias urbanas.",
};

function seed(): BarberoPerfil[] {
  return BARBEROS.map((b) => ({
    ...b,
    descripcion: BIOS[b.id] ?? "",
    comision: 40,
    servicios: SERVICIOS.map((s) => ({
      id: s.id,
      nombre: s.nombre,
      precio: s.precio,
      duracion: s.duracion,
      icono: s.icono,
    })),
    horario: HORARIOS.map((h) => ({ ...h })),
  }));
}

export function getEquipo(): BarberoPerfil[] {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as BarberoPerfil[];
  } catch {
    /* noop */
  }
  return seed();
}

export function saveEquipo(lista: BarberoPerfil[]): void {
  localStorage.setItem(KEY, JSON.stringify(lista));
  window.dispatchEvent(new Event(EVENTO_EQUIPO));
}

export function updateBarbero(
  id: string,
  cambios: Partial<BarberoPerfil>
): BarberoPerfil[] {
  const lista = getEquipo().map((b) =>
    b.id === id ? { ...b, ...cambios } : b
  );
  saveEquipo(lista);
  return lista;
}

export function addBarbero(nombre: string): BarberoPerfil[] {
  const base = seed()[0];
  const iniciales = nombre
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const nuevo: BarberoPerfil = {
    ...base,
    id: "brb_" + Math.random().toString(36).slice(2, 8),
    nombre: nombre.trim(),
    alias: "Nuevo",
    especialidad: "Cortes y barba",
    experiencia: "Nuevo en el equipo",
    iniciales: iniciales || "NB",
    foto: "/barbers/andres.jpg",
    descripcion: "",
  };
  const lista = [...getEquipo(), nuevo];
  saveEquipo(lista);
  return lista;
}

export function deleteBarbero(id: string): BarberoPerfil[] {
  const lista = getEquipo().filter((b) => b.id !== id);
  saveEquipo(lista);
  return lista;
}

export function resetEquipo(): BarberoPerfil[] {
  const s = seed();
  saveEquipo(s);
  return s;
}
