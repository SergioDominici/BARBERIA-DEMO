// Almacenes de demo en localStorage para el panel admin.
// (En una app real esto viviría en una base de datos / API.)

export type GaleriaExtra = {
  id: string;
  src: string;
  titulo: string;
  barbero: string;
};

const GALERIA_KEY = "barberia:galeria";
const HORARIOS_KEY = "barberia:horarios";

export const EVENTO_GALERIA = "barberia:galeria-updated";

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/* ---------------------------------- Galería ---------------------------------- */

export function getGaleriaExtra(): GaleriaExtra[] {
  if (typeof window === "undefined") return [];
  return parse<GaleriaExtra[]>(localStorage.getItem(GALERIA_KEY), []);
}

export function addGaleriaExtra(item: Omit<GaleriaExtra, "id">): void {
  const lista = getGaleriaExtra();
  lista.unshift({ ...item, id: "g_" + Math.random().toString(36).slice(2, 9) });
  localStorage.setItem(GALERIA_KEY, JSON.stringify(lista));
  window.dispatchEvent(new Event(EVENTO_GALERIA));
}

export function deleteGaleriaExtra(id: string): void {
  const lista = getGaleriaExtra().filter((g) => g.id !== id);
  localStorage.setItem(GALERIA_KEY, JSON.stringify(lista));
  window.dispatchEvent(new Event(EVENTO_GALERIA));
}

/* ---------------------------------- Horarios ---------------------------------- */

export type HorarioItem = { dia: string; horas: string };

export function getHorarios(defaults: HorarioItem[]): HorarioItem[] {
  if (typeof window === "undefined") return defaults;
  return parse<HorarioItem[]>(localStorage.getItem(HORARIOS_KEY), defaults);
}

export function saveHorarios(lista: HorarioItem[]): void {
  localStorage.setItem(HORARIOS_KEY, JSON.stringify(lista));
}
