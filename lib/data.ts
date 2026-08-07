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
  foto: string;
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
    foto: "/barbers/andres.jpg",
  },
  {
    id: "camilo",
    nombre: "Camilo Vargas",
    alias: "La Navaja",
    especialidad: "Barba y afeitado tradicional",
    experiencia: "8 años de experiencia",
    iniciales: "CV",
    foto: "/barbers/camilo.jpg",
  },
  {
    id: "sofia",
    nombre: "Sofía Mendoza",
    alias: "La Artista",
    especialidad: "Diseños y colorimetría",
    experiencia: "6 años de experiencia",
    iniciales: "SM",
    foto: "/barbers/sofia.jpg",
  },
  {
    id: "julian",
    nombre: "Julián Ospina",
    alias: "El Moderno",
    especialidad: "Cortes modernos y texturizados",
    experiencia: "5 años de experiencia",
    iniciales: "JO",
    foto: "/barbers/julian.jpg",
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

export type Review = {
  id: string;
  texto: string;
  autor: string;
  detalle: string;
  estrellas: number;
};

export const RESENAS: Review[] = [
  {
    id: "r1",
    texto:
      "El mejor corte que me han hecho en años. Andrés es un verdadero maestro con la máquina. Salí como nuevo.",
    autor: "Daniel Restrepo",
    detalle: "Cliente desde 2021",
    estrellas: 5,
  },
  {
    id: "r2",
    texto:
      "El afeitado a navaja con toalla caliente es toda una experiencia. Ambiente increíble y atención de primera.",
    autor: "Mateo Gómez",
    detalle: "Cliente frecuente",
    estrellas: 5,
  },
  {
    id: "r3",
    texto:
      "Reservé en línea en dos minutos y me atendieron puntual. La barba me quedó perfecta. 100% recomendado.",
    autor: "Sebastián Cruz",
    detalle: "Primera visita",
    estrellas: 5,
  },
  {
    id: "r4",
    texto:
      "Llevo años buscando una barbería así de buena en Bogotá. El trato es cercano y el resultado impecable.",
    autor: "Carlos Jiménez",
    detalle: "Cliente desde 2022",
    estrellas: 5,
  },
  {
    id: "r5",
    texto:
      "Camilo me arregló la barba como nadie. Se nota que aman lo que hacen. Volveré sin duda.",
    autor: "Andrés Motta",
    detalle: "Cliente frecuente",
    estrellas: 5,
  },
  {
    id: "r6",
    texto:
      "Ambiente relajado, buen café y un corte moderno espectacular. La mejor experiencia de barbería que he tenido.",
    autor: "Felipe Ríos",
    detalle: "Primera visita",
    estrellas: 5,
  },
];

export type TrabajoGaleria = { titulo: string; src: string; barbero: string };

export const GALERIA: TrabajoGaleria[] = [
  { titulo: "Barba a tijera", src: "/gallery/g1.jpg", barbero: "camilo" },
  { titulo: "Afeitado a navaja", src: "/gallery/g2.jpg", barbero: "camilo" },
  { titulo: "Degradado / Fade", src: "/gallery/g3.jpg", barbero: "andres" },
  { titulo: "Perfilado y líneas", src: "/gallery/g4.jpg", barbero: "andres" },
  { titulo: "Corte texturizado", src: "/gallery/g5.jpg", barbero: "sofia" },
  { titulo: "Peinado y acabado", src: "/gallery/g6.jpg", barbero: "sofia" },
  { titulo: "Barba definida", src: "/gallery/g7.jpg", barbero: "julian" },
  { titulo: "Detalle a navaja", src: "/gallery/g8.jpg", barbero: "julian" },
];

export const formatCOP = (valor: number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
