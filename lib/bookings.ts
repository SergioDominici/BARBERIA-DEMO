// Almacenamiento de reservas en el navegador (localStorage) para la demo.
// En una app real esto se reemplazaría por una API + base de datos.

export type EstadoReserva = "pendiente" | "confirmada" | "completada" | "cancelada";

export type Reserva = {
  id: string;
  servicioId: string;
  servicioNombre: string;
  precio: number;
  barberoId: string;
  barberoNombre: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:mm
  cliente: string;
  telefono: string;
  email: string;
  nota?: string;
  estado: EstadoReserva;
  creada: string; // ISO
};

const STORAGE_KEY = "barberia:reservas";

function safeParse(raw: string | null): Reserva[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as Reserva[]) : [];
  } catch {
    return [];
  }
}

export function getReservas(): Reserva[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

export function saveReservas(reservas: Reserva[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
  // Notifica a otras pestañas / componentes en la misma página
  window.dispatchEvent(new Event("barberia:reservas-updated"));
}

export function addReserva(
  reserva: Omit<Reserva, "id" | "estado" | "creada">
): Reserva {
  const nueva: Reserva = {
    ...reserva,
    id: generarId(),
    estado: "pendiente",
    creada: new Date().toISOString(),
  };
  const reservas = getReservas();
  reservas.push(nueva);
  saveReservas(reservas);
  return nueva;
}

export function updateEstado(id: string, estado: EstadoReserva): void {
  const reservas = getReservas().map((r) =>
    r.id === id ? { ...r, estado } : r
  );
  saveReservas(reservas);
}

export function deleteReserva(id: string): void {
  saveReservas(getReservas().filter((r) => r.id !== id));
}

export function slotOcupado(
  fecha: string,
  hora: string,
  barberoId: string
): boolean {
  return getReservas().some(
    (r) =>
      r.fecha === fecha &&
      r.hora === hora &&
      r.barberoId === barberoId &&
      r.estado !== "cancelada"
  );
}

function generarId(): string {
  return (
    "r_" +
    Math.random().toString(36).slice(2, 8) +
    Date.now().toString(36).slice(-4)
  );
}
