import type { ServiceIconKey } from "@/components/icons";

export type Service = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number; // COP
  duracion: number; // minutos
  icono: ServiceIconKey; // clave del icono SVG propio
  destacado?: boolean;
};

export type Barber = {
  id: string;
  nombre: string;
  alias: string;
  especialidad: string;
  experiencia: string;
  iniciales: string;
};

export const SERVICIOS: Service[] = [
  {
    id: "corte-clasico",
    nombre: "Corte Clásico",
    descripcion:
      "Corte a tijera y máquina con acabado a navaja, lavado y peinado.",
    precio: 30000,
    duracion: 30,
    icono: "scissors",
    destacado: true,
  },
  {
    id: "corte-barba",
    nombre: "Corte + Barba",
    descripcion:
      "Nuestro combo estrella: corte completo más perfilado y arreglo de barba.",
    precio: 45000,
    duracion: 45,
    icono: "clippers",
    destacado: true,
  },
  {
    id: "afeitado-navaja",
    nombre: "Afeitado a Navaja",
    descripcion:
      "Afeitado tradicional con toalla caliente, aceites y navaja recta.",
    precio: 35000,
    duracion: 30,
    icono: "razor",
  },
  {
    id: "arreglo-barba",
    nombre: "Arreglo de Barba",
    descripcion: "Perfilado, recorte y tratamiento con aceites e hidratación.",
    precio: 25000,
    duracion: 20,
    icono: "brush",
  },
  {
    id: "corte-infantil",
    nombre: "Corte Infantil",
    descripcion: "Corte para los más pequeños en un ambiente tranquilo.",
    precio: 22000,
    duracion: 25,
    icono: "child",
  },
  {
    id: "disenos-lineas",
    nombre: "Diseños y Líneas",
    descripcion: "Líneas, degradados artísticos y diseños personalizados.",
    precio: 18000,
    duracion: 20,
    icono: "bolt",
  },
];

export const BARBEROS: Barber[] = [
  {
    id: "andres",
    nombre: "Andrés Rojas",
    alias: "El Maestro",
    especialidad: "Fades y cortes clásicos",
    experiencia: "12 años de experiencia",
    iniciales: "AR",
  },
  {
    id: "camilo",
    nombre: "Camilo Vargas",
    alias: "La Navaja",
    especialidad: "Barba y afeitado tradicional",
    experiencia: "8 años de experiencia",
    iniciales: "CV",
  },
  {
    id: "sofia",
    nombre: "Sofía Mendoza",
    alias: "La Artista",
    especialidad: "Diseños y colorimetría",
    experiencia: "6 años de experiencia",
    iniciales: "SM",
  },
  {
    id: "julian",
    nombre: "Julián Ospina",
    alias: "El Moderno",
    especialidad: "Cortes modernos y texturizados",
    experiencia: "5 años de experiencia",
    iniciales: "JO",
  },
];

export const HORARIOS = [
  { dia: "Lunes a Viernes", horas: "9:00 — 20:00" },
  { dia: "Sábados", horas: "8:00 — 18:00" },
  { dia: "Domingos y festivos", horas: "Cerrado" },
];

// Franjas horarias disponibles para reservar (demo)
export const FRANJAS_HORARIAS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

export const formatCOP = (valor: number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
