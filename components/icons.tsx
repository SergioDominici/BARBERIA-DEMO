import type { SVGProps, ImgHTMLAttributes } from "react";

/**
 * Set de iconos propios de la barbería, dibujados como line-art para el tema
 * claro. Heredan el color con `currentColor`; el poste de barbero lleva un
 * acento rojo. Sin librerías externas, sin emojis.
 */

type IconProps = SVGProps<SVGSVGElement>;

const ACENTO = "#c1121f";

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function Scissors(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="6" r="2.6" />
      <circle cx="6" cy="18" r="2.6" />
      <path d="M20 4 8.5 15.5" />
      <path d="M14.5 14.5 20 20" />
      <path d="M8 8.4 12 12" />
    </svg>
  );
}

export function Razor(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* Navaja recta abierta: filo, lomo y mango */}
      <path d="M21 3.6c-3 0-6.2 1.5-8.8 4.2L5 15" />
      <path d="M21 3.6c0 3-1.5 6.2-4.2 8.8" />
      <path d="M12.2 7.8 16.8 12.4" />
      <path d="M5 15 3.2 16.8a1.9 1.9 0 1 0 2.7 2.7L8 17.4" />
    </svg>
  );
}

export function Brush(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* Brocha de afeitar */}
      <path d="M8 10c0-3.3 1.8-7 4-7s4 3.7 4 7z" />
      <path d="M8 10h8l-.7 3H8.7z" />
      <path d="M9 13l.8 8h4.4l.8-8" />
    </svg>
  );
}

export function Clippers(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* Máquina de cortar */}
      <rect x="7.5" y="3.5" width="7" height="11" rx="1.5" />
      <path d="M7.5 14.5v3M9.5 14.5v3M11 14.5v3M12.5 14.5v3M14.5 14.5v3" />
      <path d="M14.5 6c3.5 0 3 4.5 6 5.5" />
    </svg>
  );
}

export function Comb(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* Peine */}
      <path d="M3.5 8.5h17v2.2h-17z" />
      <path d="M5.5 10.7v6M8 10.7v6M10.5 10.7v6M13 10.7v6M15.5 10.7v6M18 10.7v6" />
    </svg>
  );
}

export function Child(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* Corte infantil */}
      <circle cx="12" cy="7.5" r="3.2" />
      <path d="M12 4.3c1-1.1 2.4-1 2.6.4" />
      <path d="M6.5 21c0-4 2.4-7 5.5-7s5.5 3 5.5 7" />
    </svg>
  );
}

export function Bolt(props: IconProps) {
  return (
    <svg {...base} {...props}>
      {/* Diseños y líneas */}
      <path d="M13.5 2.5 4.5 13.5H11l-1 8 9.5-11.5H13z" />
    </svg>
  );
}

export function BarberPole({ strokeWidth = 1.6, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      {/* Poste de barbero con franjas rojas */}
      <rect
        x="8.5"
        y="5"
        width="7"
        height="14"
        rx="3.5"
        fill="#ffffff"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <g stroke={ACENTO} strokeWidth="2" strokeLinecap="round">
        <path d="M9 10.6l6-4" />
        <path d="M9 13.6l6-4" />
        <path d="M9 16.6l6-4" />
      </g>
      <path
        d="M7 5h10M7 19h10M9 3h6M9 21h6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Star({ filled = true, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg
      {...base}
      fill={filled ? "currentColor" : "none"}
      strokeWidth={filled ? 0 : 1.6}
      {...props}
    >
      <path d="M12 2.5l2.7 5.9 6.3.6-4.8 4.2 1.5 6.3L12 16.9 6.3 19.5l1.5-6.3-4.8-4.2 6.3-.6z" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12.5 10 18 20 6" />
    </svg>
  );
}

export function Quote(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9.5 6C6.5 6 4 8.6 4 11.9V18h6.2v-6H7.3c0-2 1.2-3.4 3.2-3.6zm10 0c-3 0-5.5 2.6-5.5 5.9V18H20v-6h-2.9c0-2 1.2-3.4 3.2-3.6z" />
    </svg>
  );
}

export function Menu(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function Phone(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.6 3.5 4.2 4.3C3.3 4.6 2.8 5.5 3 6.4a17 17 0 0 0 14.6 14.6c.9.2 1.8-.3 2.1-1.2l.8-2.4c.2-.7-.1-1.5-.8-1.8l-3-1.3c-.6-.3-1.3-.1-1.7.4l-1 1.2A13 13 0 0 1 8 9.8l1.2-1c.5-.4.7-1.1.4-1.7l-1.3-3c-.3-.7-1-1-1.7-.6z" />
    </svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 5.5L20 7" />
    </svg>
  );
}

export function MapPin(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21c4.5-4.4 7-8 7-11a7 7 0 1 0-14 0c0 3 2.5 6.6 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function Clock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function WhatsApp(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.5 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12 2.04a9.9 9.9 0 0 0-8.53 14.9L2 22l5.2-1.36A9.9 9.9 0 1 0 12 2.04zm0 18.13a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.2 8.2 0 1 1 6.95 3.84z" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Iconos ilustrados (PNG de Flaticon, estilo lineal color) guardados en
 * `public/icons/`. Se usan para decorar servicios y secciones.
 */
export type ServiceIconKey =
  | "scissors"
  | "razor"
  | "brush"
  | "clippers"
  | "child"
  | "bolt";

const SERVICIO_PNG: Record<ServiceIconKey, string> = {
  scissors: "/icons/scissors.png", // Corte clásico → tijeras
  clippers: "/icons/clipper.png", // Corte + barba → máquina
  razor: "/icons/razor-color.png", // Afeitado a navaja → maquinilla + brocha (color)
  brush: "/icons/beard.png", // Arreglo de barba → barba
  child: "/icons/chair-color.png", // Corte infantil → silla de barbero
  bolt: "/icons/comb-scissors.png", // Diseños y líneas → peine + tijeras
};

/** Imagen de icono (PNG) reutilizable; decorativa por defecto (`alt=""`). */
export function FlatIcon({
  src,
  alt = "",
  className,
  ...props
}: { src: string } & ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} {...props} />;
}

export function ServiceIcon({
  name,
  alt = "",
  ...props
}: { name: ServiceIconKey } & Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src"
>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={SERVICIO_PNG[name]} alt={alt} {...props} />;
}
