// Ajustes generales del negocio (demo, localStorage).

export type Ajustes = {
  nombre: string;
  tagline: string;
  direccion: string;
  telefono: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  tiktok: string;
};

const KEY = "barberia:ajustes";

export const AJUSTES_DEFAULT: Ajustes = {
  nombre: "Navaja & Co.",
  tagline: "Barbería clásica · Bogotá",
  direccion: "Calle 85 #12-34, Chapinero, Bogotá",
  telefono: "+57 300 123 4567",
  whatsapp: "573001234567",
  email: "hola@navajaco.com",
  instagram: "navajaco",
  facebook: "navajaco",
  tiktok: "navajaco",
};

export function getAjustes(): Ajustes {
  if (typeof window === "undefined") return AJUSTES_DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...AJUSTES_DEFAULT, ...JSON.parse(raw) };
  } catch {
    /* noop */
  }
  return AJUSTES_DEFAULT;
}

export function saveAjustes(a: Ajustes): void {
  localStorage.setItem(KEY, JSON.stringify(a));
}
